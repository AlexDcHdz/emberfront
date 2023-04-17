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
        ENV.apiURL + '/sale/cancelTicket/' + ticket.ticketId + '?cardNumber=' + cardNumber + '&returnMoney=' + returnMoney + '&phoneNumber=' + phoneNumber
      ).then((data) => {
        this.set('finishedSale', null);
        this.set('sales', null);
        this.set('couponData', data);
      });
    },
    searchByName(ticketName) {
      jQuery.ajax({
        url: ENV.apiURL + '/sale/findByName?name=' + ticketName
      }).then((sales) => {
        this.set('sales', sales);
      });
    },
    saveComments(ticket) {
      this.get('authorizedRequest').ajax(
        ENV.apiURL + '/sale/updateTicket/' + ticket.ticketId + '?comments=' + ticket.comments).then((data) => {
          var that = this;
          if(data.outcome === 'success') {
            this.set('commentsUpdated', true);
            setTimeout(() => {
              that.set('commentsUpdated', false);
            }, 5000);
          } else {
            this.set('commentsError', true);
            setTimeout(() => {
              that.set('commentsError', false);
            }, 5000);
          }
          console.log(data);
        });
    },
    search(ticketNumber) {
      jQuery.ajax({
        url: ENV.apiURL + '/sale/saleData/' + ticketNumber
      }).then((saleData) => {
        this.set('finishedSale', saleData);
      });
    }
  }
});
