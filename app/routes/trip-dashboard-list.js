import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Route.extend({
  model() {
    var stopsUrl = ENV.apiURL + '/routes/allStops';
    return DS.PromiseArray.create({
      promise: jQuery.get(stopsUrl)
    });
  }
});
