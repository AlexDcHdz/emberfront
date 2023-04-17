import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Route.extend({
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  session: Ember.inject.service('session'),
  model() {
    return DS.PromiseObject.create({
      promise: new Promise((resolve) => {
        localforage.getItem('terminalData').then((data) => {
          if(data && data.id) {
            this.get('authorizedRequest').ajax(ENV.apiURL + '/payment/payments?terminalId=' + data.id).then((booths) => {
              this.get('authorizedRequest').ajax(ENV.apiURL + '/employees/payers').then((salesmen) => {
                resolve({
                  booths: booths,
                  salesmen: salesmen.map((s) => {
                    s.fullName = s.name + ' ' + s.lastName + ' ' + s.secondLastName;
                    return s;
                  })
                });
              });
            });
          } else {
            resolve({});
          }
        });
      })
    });
  },
  actions: {
    startShift(booth) {
      Ember.set(booth, 'startShift', true);
    },
    saveShift(booth) {
      this.get('authorizedRequest').ajax(ENV.apiURL + '/payment/startShift?terminalId=' + booth.id + '&employeeId=' + booth.salesmen + '&amount=' + booth.amount).then((start) => {
        Ember.set(booth, 'startShift', false);
        for(var x in start) {
          Ember.set(booth, x, start[x]);
        }
        location.href = ENV.apiURL + '/payment/downloadStartShift/' + booth.id + '.pdf?timeZone=' + 'America/Mexico_City';
      });
    },
    recordSnapshot(booth) {
      Ember.set(booth, 'startSnapshot', true);
    },
    saveRecordSnapshot(booth) {
      this.get('authorizedRequest').ajax(ENV.apiURL + '/payment/recordSnapshot?terminalId=' + booth.id + '&amount=' + booth.amount).then((start) => {
        Ember.set(booth, 'startSnapshot', false);
        for(var x in start) {
          Ember.set(booth, x, start[x]);
        }
        location.href = ENV.apiURL + '/payment/downloadRecordSnapshot/' + booth.id + '.pdf?timeZone=' + 'America/Mexico_City';
      });
    },
    closeShift(booth) {
      Ember.set(booth, 'closeShift', true);
    },
    saveCloseShift(booth) {
      this.get('authorizedRequest').ajax(ENV.apiURL + '/payment/closeShift?terminalId=' + booth.id).then((close) => {
        Ember.set(booth, 'closeShift', false);
        for(var x in close) {
          Ember.set(booth, x, close[x]);
        }
        location.href = ENV.apiURL + '/payment/downloadCloseShift/' + booth.latestShiftId + '.pdf?timeZone=' + 'America/Mexico_City';
      });
    }
  }
});
