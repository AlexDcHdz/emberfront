import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service('session'),
  ajax(url, settings) {
    if(!settings) {
      settings = {};
    }
    settings.headers = {
      Authorization: 'Bearer ' + this.get('session.data.authenticated.access_token')
    };
    return jQuery.ajax(url, settings);
  }
});
