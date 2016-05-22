'use strict';

var Mirror = require('mirror-mirror');
var _ = require('lodash');

module.exports = function(conf){

  var mirror = new Mirror(conf || {});

  return {
    setup: function(options){

      var afterActions = [];

      if(!!options.preRendering){
        afterActions = options.preRendering;
      }

      afterActions.push(function(nigthmare){
        return nigthmare.evaluate(function(){

          window.oc = window.oc || {};
          window.oc.cmd = window.oc.cmd || [];

          window.oc.cmd.push(function(oc){

            var $el = oc.$(window.ohSee.selector);
            oc.renderNestedComponent($el, function(){
              window.ohSee.rendered = true;
            });

          });

        });
      });

      afterActions.push(function(nigthmare){
        return nigthmare.wait(function(){
          return window.ohSee.rendered === true;
        });
      });

      if(!!options.postRendering){
        _.each(options.postRendering, function(option){
          afterActions.push(option);
        });
      }

      var component = 'oc-component[data-name="' + options.componentName + '"]';

      return mirror.setup({
        concurrency: options.concurrency,
        cookies: options.cookies,
        debug: options.debug,
        headers: options.headers,
        retries: options.retries,
        screenshotsPath: options.screenshotsPath,
        timeout: options.timeout,
        urls: options.urls,

        selector: component,

        before: [
          function(nigthmare){
            return nigthmare.evaluate(function(transformation, selector, componentName, tryAppendLang){

              var html = document.querySelector('html');

              window.ohSee = {
                componentName: componentName,
                rendered: false,
                selector: selector,
                transformation: transformation,
                tryAppendLang: tryAppendLang || false
              };

              if(!!html){
                window.ohSee.lang = html.getAttribute('lang');
              }

            }, options.transformation, component, options.componentName, options.tryAppendLang);
          }
        ],

        transform: function(selected){
          var ohSee = window.ohSee,
              currentHref = selected.getAttribute('href'),
              oldUrl = ohSee.transformation.oldUrl,
              newUrl = ohSee.transformation.newUrl,
              newHref = currentHref.replace(oldUrl, newUrl);

          if(ohSee.tryAppendLang && !!ohSee.lang){
            var hasQs = newHref.indexOf('?') >= 0;
            newHref += (hasQs ? '&' : '?') + '__ocAcceptLanguage=' + ohSee.lang;
          }

          return '<oc-component href="' + newHref + '" data-name="' + window.ohSee.componentName +'"></oc-component>';
        },

        after: afterActions
      });

    },
    run: function(callback){
      return mirror.run(callback);
    }
  };
};
