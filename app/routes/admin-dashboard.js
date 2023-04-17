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
          this.get('authorizedRequest').ajax(ENV.apiURL + '/officeLocations?size=100').then((locations) => {
            obj.offices = locations._embedded.officeLocations;
            obj.offices.sort((a, b) => {
              return a.name.localeCompare(b.name);
            });
            if(data && data.id) {
              this.get('authorizedRequest').ajax(ENV.apiURL + '/terminal/' + data.id).then((terminalData) => {
                obj.terminal = terminalData;
                resolve(obj);
              });
            } else {
              resolve(obj);
            }
          });
        });
      })
    });
  },
  model() {
    return this.getTerminalData({});
  },
  actions: {
    dashboard() {
      console.log('Hola mundo', this.get('authorizedRequest').ajax);
    }
  }
});
