import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  session: Ember.inject.service('session'),
  report: {
    from: null,
    to: null
  },
  actions: {
    download(person) {
      location.href = ENV.apiURL + '/booth/downloadDetail/' + person.id + '.pdf?timeZone=' + 'America/Mexico_City' + '&startDate=' + this.get('report.from').toISOString() + '&endDate=' + this.get('report.to').toISOString();
    },
    searchSalesPeople(report) {
      localforage.getItem('terminalData').then((data) => {
        this.get('authorizedRequest').ajax(ENV.apiURL + '/booth/office/people/' + data.id + '?startDate=' + report.from.toISOString() + '&endDate=' + report.to.toISOString()).then((salesmen) => {
          this.set('salesmen', salesmen);
        });
      });
    }
  }
});
