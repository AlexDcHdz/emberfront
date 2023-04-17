import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  session: Ember.inject.service('session'),
  getTerminalData(obj) {
    return DS.PromiseObject.create({
      promise: new Promise((resolve) => {
        localforage.getItem('terminalData').then((data) => {
          if(data && data.id) {
            this.get('authorizedRequest').ajax(ENV.apiURL + '/terminal/' + data.id).then((terminalData) => {
              jQuery.ajax({
                url: ENV.apiURL + '/search/localTrip',
                data: JSON.stringify({
                  origin: terminalData.stopOffName,
                  adultCount: 1
                }),
                contentType: 'application/json; charset=utf-8',
                method: 'POST'
              }).then((quotes) => {
                obj.terminal = terminalData;
                obj.quotes = quotes;
                resolve(obj);
              });
            });
          } else {
            resolve({});
          }
        });
      })
    });
  },
  model() {
    return this.getTerminalData({});
  }
});
