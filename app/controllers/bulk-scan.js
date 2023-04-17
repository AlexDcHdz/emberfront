import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  actions: {
    sendThing() {
      let ticketNumber = this.get('ticketNumber');
      this.set('ticketNumber', '');
			jQuery.get(ENV.apiURL + '/trip/recordUsed/' + ticketNumber).then((ticket) => {
        this.set('currentTicket', ticket);
      });
    }
  }
});
