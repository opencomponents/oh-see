oh-see [![Build Status](https://secure.travis-ci.org/opentable/oh-see.png?branch=master)](http://travis-ci.org/opentable/oh-see)
======

So that you can see how [OC components](https://github.com/opentable/oc) look in production **before** publishing them to production.

Oh-see is a wrapper for [mirror-mirror](https://github.com/matteofigus/mirror-mirror) which is a wrapper for [Nightmare.js](https://github.com/segmentio/nightmare). Oh-see is been built for:

* Opening a matrix of urls with Chrome
* Optionally specify a set of operations to perform
* Take a screenshot
* Replace a DTP components' baseUrl and re-render the component
* Optionally specify another set of operations to perform
* Take another screenshot
* Compare the screenshots and save a diff file with the highighted differences

Most important features: 
* Crazy quick compare to Selenium with Phantom
* Able to hide/show Browser
* Works with any OS
* Able to use DevTools and do debugging with Chrome 

# Requirements:

* Node version: min: **0.10.40**, recommended: **>=4.2.X**
* `<oc-component>` container needs to be present in rendered components to make `oh-see` work.

### Install

```js
npm install oh-see
```

### Usage example

```js
var OhSee = require('oh-see');

var oh = new OhSee({
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

oh.run(function(err, result){
  console.log(arguments);
  process.exit(0);
});
```

### API

TODO

### License

MIT
