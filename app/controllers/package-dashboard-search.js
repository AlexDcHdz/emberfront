import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  session: Ember.inject.service('session'),
  tz: 'America/Mexico_City',
  actions: {
    showDelete(ticket) {
      Ember.set(ticket, 'predelete', true);
    },
    hideDelete(ticket) {
      Ember.set(ticket, 'predelete', false);
    },
    deleteTicket(ticket, cardNumber, phoneNumber, returnMoney) {
      this.get('authorizedRequest').ajax(
        ENV.apiURL + '/sale/cancelPackageTicket/' + ticket.id + '?cardNumber=' + cardNumber + '&returnMoney=' + returnMoney + '&phoneNumber=' + phoneNumber
      ).then((data) => {
        this.set('finishedSale', null);
        this.set('sales', null);
        this.set('couponData', data);
      });
    },
    searchByName(ticketName) {
      jQuery.ajax({
        url: ENV.apiURL + '/sale/findByPackageName?name=' + ticketName
      }).then((sales) => {
        this.set('sales', sales);
      });
    },
    search(ticketNumber) {
      jQuery.ajax({
        url: ENV.apiURL + '/sale/packageSaleData/' + ticketNumber
      }).then((saleData) => {
        this.set('finishedSale', saleData);
      });
    }
  }
});
