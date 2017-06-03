oh-see [![Build Status](https://secure.travis-ci.org/opencomponents/oh-see.png?branch=master)](http://travis-ci.org/opencomponents/oh-see)
======

So that you can see how [OC components](https://github.com/opencomponents/oc) look in production **before** publishing them to production.

Oh-see is a wrapper for [mirror-mirror](https://github.com/matteofigus/mirror-mirror) which is a wrapper for [Nightmare.js](https://github.com/segmentio/nightmare). Oh-see is been built for:

* Opening a matrix of urls and viewports with Chrome
* Optionally specify a set of operations to perform
* Take a screenshot
* Replace a component's baseUrl and re-render it
* Optionally specify another set of operations to perform
* Take another screenshot
* Compare the screenshots and save a diff file with the highlighted differences

Most important features:
* Crazy quick compare to Selenium with Phantom
* Able to hide/show Browser
* Works with any OS
* Able to use DevTools and do debugging with Chrome

# Requirements:

* Node version: min: **6**
* `<oc-component>` container needs to be present in rendered components to make `oh-see` work.

### Install

```js
npm install oh-see
```

### Usage example

```js
const OhSee = require('oh-see');

const oh = OhSee({
  // Nightmare.js options
  openDevTools: true,
  show: false
});

oh.setup({
  concurrency: 5,
  timeout: 20000,
  debug: true,
  componentName: 'a-component',

  urls: {
    com_home: 'http://www.mywebsite.com',
    com_search: 'http://www.mywebsite.com/?s=something',
    com_product: 'https://www.mywebsite.com/item'
  },

  transformation: {
    type: 'replaceBaseUrl',
    newUrl: 'http://localhost:3030/',
    oldUrl: 'https://oc-registry.mywebsite.com/'
  },

  screenshotsPath: './screenshots'
});

oh.run((err, result) => {
  console.log(arguments);
  process.exit(0);
});
```

### API

1. [Set up an instance](#set-up-an-instance)
2. [Configure the runner](#configure-the-runner)
  * [action examples](#nightmare-actions-example)
  * [transformation types](#transformation-types)
3. [Start the runner](#start-the-runner)

### Set up an instance

`var ohSee = new OhSee([NighmareOptions]);`

Look at [Nighmare.js options](https://github.com/segmentio/nightmare#nightmareoptions).

### Configure the runner

`ohSee.setup(ohSeeOptions);`

This is an object with the following structure:

|name|type|mandatory|description|
|----|----|---------|-----------|
|componentName|`string`|yes|The component name|
|concurrency|`number`|no|Default 3, is the concurrency of tests|
|cookies|`object`|no|Allows to specify cookies to be used for each request|
|debug|`boolean`|no|When true, shows stuff in the console|
|headers|`object`|no|Allows to specify headers to be used for each request|
|preRendering|`array of functions`|no|An array of nightmareJs actions to perform before the first screenshots. [Look at the example below](#nightmare-actions-example)|
|postRendering|`array of functions`|no|An array of nightmareJs actions to perform after the transformation and before the second screenshots. [Look at the example below](#nightmare-actions-example)|
|retries|`number`|no|Default 3, number of retries after a failing session|
|screenshotsPath|`string`|yes|The path where to save the screenshots|
|timeout|`number`|no|Default 20000, when the session is going to be restarted|
|transformation|`object`|yes|The transformation to apply to the component. Look at the [Transformation types below](#transformation-types)|
|tryAppendLang|`boolean`|no|Default `false`, when `true` appends to the component's href the `__ocAcceptLanguage` parameter, inheriting the value from `html` DOM element's `lang` attribute. This is required when re-rendering a server-side rendered component that depends on `Accept-Language` attribute for being rendered in the correct language|
|urls|`object`|yes|The urls to test. Key is used to generate screenshots file name so keep it simple and without spaces and stuff|
|viewports|`array of arrays`|no|Default `[[800, 600]]`, the viewports for executing the tests|

#### Nightmare actions example

This example shows how to make a screenshot with a menu opened, assuming the transformation replaces the menu and then needs to run another javascript initialisation and then wait to complete before performing the same action again.

```js
ohSee.setup({
  ...
  preRender: [
    (nightmare) => nightmare.evaluate(() => $('#navbar-button').click()
  ],
  postRender: [
    (nightmare) => nightmare.evaluate(() => {
      window.menusReady = false;
      window.menus.initialise(() => window.menusReady = true);
    }),

    (nightmare) => nightmare.wait(() => window.menusReady === true),

    (nightmare) => nightmare.evaluate(() => $('#navbar-button').click())
  ]
});
```

#### Transformation types

##### Base url replacement

Replaces the components' base url to another one. Useful for comparing a local one with the production one.

```js
const transformation = {
  type: 'replaceBaseUrl',
  oldUrl: 'https://my-registry.my-company.com',
  newUrl: 'http://localhost:3000/'
};
...
```

### Start the runner

`ohSee.run(callback);`

Where callback is going to have an error and/or a response with the results. If any of the requests fails, the callback will include both an error + the response with succeeding screenshot links.

# Contributing

Yes please. Open an issue first.

### License

MIT
