import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  report: {},
  selectedTrips: [],
  actions: {
    selectTrip(trip) {
      this.get('selectedTrips').addObject(trip);
    },
    joinTrips(selectedTrips) {
        this.get('authorizedRequest').ajax(ENV.apiURL + '/trip/joinPayments', {
          method: 'POST',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify({
            selectedTrips: selectedTrips
          })
        }).then(() => {
          this.set('selectedTrips', []);
          this.set('trips', []);
        });
    },
    searchPayments(report) {
      localforage.getItem('terminalData').then((data) => {
        this.get('authorizedRequest').ajax(ENV.apiURL + '/payment/unjoined/' + data.id + '?startDate=' + report.from.toISOString() + '&endDate=' + report.to.toISOString()).then((payments) => {
          this.set('trips', payments);
        });
      });
    }
  }
});
