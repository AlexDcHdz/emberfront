import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  step: 'search',
  actions: {
    cancelReservation(tripData) {
			jQuery('.loading').show();
      this.get('authorizedRequest').ajax(ENV.apiURL + '/sale/cancelReservation/' + this.get('saleData.id'))
      .then((data) => {
        console.log(data);
			  jQuery('.loading').hide();
        this.set('currentIds', []);
        this.set('quotes', []);
        this.set('sale', {});
        this.set('saleData', {});
        this.set('passengers', []);
        this.set('tripData', {});
        this.set('step', 'search');
      });
    },
    paymentReceived(paymentData) {
      paymentData.terminalId = this.get('model.terminal.id');
      this.get('authorizedRequest').ajax(ENV.apiURL + '/sale/payReservation/' + this.get('saleData.id'),
      {
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(paymentData)
      }).then((data) => {
        jQuery.ajax({
          url: ENV.apiURL + '/sale/saleData/' + data.shortId
        }).then((saleData) => {
          location.href = ENV.apiURL + '/sale/downloadTickets/' + saleData.id + '.pdf?timeZone=' + 'America/Mexico_City';
          this.set('currentIds', []);
          this.set('quotes', []);
          this.set('sale', {});
          this.set('saleData', {});
          this.set('passengers', []);
          this.set('tripData', {});
          this.set('step', 'search');
        });
      });
    },
    returnToSearch() {
      this.set('step', 'search');
    },
    lookup(confirmationCode) {
      jQuery.ajax({
        url: ENV.apiURL + '/sale/saleData/' + confirmationCode
      }).then((saleData) => {
        if(saleData.payed) {
          return;
        }
        jQuery.ajax({
          url: ENV.apiURL + '/trip/' + saleData.tripId
        }).then((tripData) => {
          let sale = {
            totalPrice: saleData.tickets.reduce(function (acc, ticket) {
              return acc + ticket.soldPrice;
            }, 0)
          };
          this.set('sale', sale);
          this.set('step', 'payment');
          this.set('saleData', saleData);
          this.set('passengers', saleData.tickets);
          this.set('tripData', tripData);
          console.log(saleData, tripData);
        });
      });
    }
  }
});
