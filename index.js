'use strict';

const Mirror = require('mirror-mirror');
const _ = require('lodash');

module.exports = (conf) => {

  const mirror = Mirror(conf || {});

  return {
    setup: (options) => {

      let afterActions = [];

      if(options.preRendering){
        afterActions = options.preRendering;
      }

      afterActions.push((nigthmare) => {
        return nigthmare.evaluate(() => {

          window.oc = window.oc || {};
          window.oc.cmd = window.oc.cmd || [];

          window.oc.cmd.push((oc) => {
            const $el = oc.$(window.ohSee.selector);
            oc.renderNestedComponent($el, () => window.ohSee.rendered = true);
          });

        });
      });

      afterActions.push(nigthmare => nigthmare.wait(() => window.ohSee.rendered === true));

      if(options.postRendering){
        _.each(options.postRendering, option => afterActions.push(option));
      }

      const component = `oc-component[data-name="${options.componentName}"]`;

      return mirror.setup({
        concurrency: options.concurrency,
        cookies: options.cookies,
        debug: options.debug,
        headers: options.headers,
        retries: options.retries,
        screenshotsPath: options.screenshotsPath,
        timeout: options.timeout,
        urls: options.urls,
        viewports: options.viewports,

        selector: component,

        before: [
          (nigthmare) => {
            return nigthmare.evaluate((transformation, selector, componentName, tryAppendLang) => {

              const html = document.querySelector('html');

              window.ohSee = {
                componentName,
                rendered: false,
                selector,
                transformation,
                tryAppendLang: tryAppendLang || false
              };

              if(html){
                window.ohSee.lang = html.getAttribute('lang');
              }

            }, options.transformation, component, options.componentName, options.tryAppendLang);
          }
        ],

        transform: (selected) => {
          let ohSee = window.ohSee,
              currentHref = selected.getAttribute('href'),
              oldUrl = ohSee.transformation.oldUrl,
              newUrl = ohSee.transformation.newUrl,
              newHref = currentHref.replace(oldUrl, newUrl);

          if(ohSee.tryAppendLang && !!ohSee.lang){
            const hasQs = newHref.indexOf('?') >= 0;
            newHref += `${hasQs ? '&' : '?'}__ocAcceptLanguage=${ohSee.lang}`;
          }

          return `<oc-component href="${newHref}" data-name="${window.ohSee.componentName}"></oc-component>`;
        },

        after: afterActions
      });

    },
    run: callback => mirror.run(callback)
  };
};
