import Ember from 'ember';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

Ember.TextField.reopen({
  attributeBindings: ['data-minlength']
});

$.fn.validator.Constructor.DEFAULTS.errors.minlength = 'Dato muy corto';
$.fn.validator.Constructor.DEFAULTS.errors.match = 'Dato inválido';

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
