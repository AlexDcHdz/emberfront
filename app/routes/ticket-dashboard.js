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
        this.get('authorizedRequest').ajax(ENV.apiURL + '/booth/status').then((boothStatus) => {
          localforage.getItem('terminalData').then((data) => {
            if(data && data.id) {
              this.get('authorizedRequest').ajax(ENV.apiURL + '/terminal/' + data.id).then((terminalData) => {
                obj.terminal = terminalData;
                // obj.quotes = quotes;
                if(boothStatus.terminalId === terminalData.terminalId) {
                  obj.boothStatus = boothStatus;
                } else {
                  // Terminal being used by another user
                }
                resolve(obj);
                /*
                jQuery.ajax({
                  url: ENV.apiURL + '/search/localTrip',
                  data: JSON.stringify({
                    origin: terminalData.stopOffName,
                    adultCount: 1
                  }),
                  contentType: 'application/json; charset=utf-8',
                  method: 'POST'
                }).then((quotes) => {
                });
                */
              });
            } else {
              resolve({});
            }
          });
        }, (error) => {
          console.log(error);
          if(gapi && gapi.auth2) {
            gapi.auth2.getAuthInstance().signOut();
          }
          this.set('session.data.profile', null);
          this.get('session').invalidate();
          this.container.lookup('controller:application').transitionToRoute('index');
        });
      })
    });
  },
  model() {
    return this.getTerminalData({});
  }
});
