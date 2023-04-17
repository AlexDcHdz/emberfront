/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  app.import('vendor/ladda/ladda-themeless.min.css');
  app.import('vendor/ladda/spin.min.js');
  app.import('vendor/ladda/ladda.min.js');
  app.import('vendor/animate.min.css');
  app.import('vendor/waypoints.min.js');
  app.import('vendor/theme-scripts.js');
  app.import('vendor/revolution_slider/css/settings.css');
  app.import('vendor/revolution_slider/css/style.css');
  app.import('vendor/revolution_slider/js/jquery.themepunch.plugins.min.js');
  app.import('vendor/revolution_slider/js/jquery.themepunch.revolution.min.js');
  app.import('vendor/jquery.bxslider/jquery.bxslider.css');
  app.import('vendor/jquery.bxslider/jquery.bxslider.min.js');
  app.import('vendor/flexslider/jquery.flexslider.js');
  app.import('vendor/flexslider/flexslider.css');
  app.import('bower_components/typeahead.js/dist/typeahead.jquery.min.js');
  app.import('bower_components/bootstrap-vertical-tabs/bootstrap.vertical-tabs.min.css');
	app.import('bower_components/card/lib/js/card.js');
	app.import('bower_components/localforage/dist/localforage.min.js');
  app.import('bower_components/darktooltip/dist/jquery.darktooltip.js');
  app.import('bower_components/darktooltip/dist/darktooltip.css');
  app.import('bower_components/moment-timezone/builds/moment-timezone-with-data.min.js');
  app.import('bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.es.js');
  app.import('bower_components/bootstrap-validator/dist/validator.min.js');
  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
