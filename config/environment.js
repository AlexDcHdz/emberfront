/* jshint node: true */

module.exports = function(environment) {
  var apiHost;
  if (environment === 'development') {
    //apiHost = 'localhost:9090';
    apiHost = 'api.medrano.just-cloud.com';
    // apiHost = 'api.sales.medrano.iamedu.io';
    // apiHost = 'api.sales.medrano.iamedu.io';
  } else if (environment === 'test') {
    apiHost = 'api.medrano.just-cloud.com';
  } else if (environment === 'production') {
    apiHost = 'api.medrano.just-cloud.com';
  }
	var apiProtocol = 'http';
  var ENV = {
    modulePrefix: 'ticket-sales-frontend',
    environment: environment,
    baseURL: '/',
		apiURL: apiProtocol + '://' + apiHost,
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

		moment: {
			includeLocales: ['es']
		},

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

	ENV.contentSecurityPolicy = {
		'default-src': "'none'",
		'frame-src': "*.facebook.com accounts.google.com",
		'script-src': "'self' 'unsafe-eval' *.googleapis.com maps.gstatic.com apis.google.com connect.facebook.net api-maps.yandex.ru",
		'font-src': "'self' fonts.gstatic.com",
		'connect-src': "'self' maps.gstatic.com " + apiHost,
		'img-src': "'self' *.googleapis.com maps.gstatic.com csi.gstatic.com placehold.it placeholdit.imgix.net apis.google.com www.paypalobjects.com api-maps.yandex.ru data: www.facebook.com",
		'style-src': "'self' 'unsafe-inline' fonts.googleapis.com maps.gstatic.com"
	};

	// ENV['ember-cli-map'] = {
	// 	googleApiKey: 'AIzaSyCb9LqQZq9YcPeBeye4DfZDCE-FNEqDUiE'
	// };

  ENV['ember-simple-auth'] = {
    baseURL: 'http://' + apiHost
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
