import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  model() {
    if($.inArray('view-gps', this.get('session.data.profile.permissions')) >= 0) {
      return DS.PromiseArray.create({
        promise: this.get('authorizedRequest').ajax(ENV.apiURL + '/tracking/locations')
      });
    } else {
      location.href = '/';
    }
  }
});
