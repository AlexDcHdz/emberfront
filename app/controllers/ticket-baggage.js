import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  step: 'search',
  sale: {
    totalPrice: 0
  },
  baggage: {
  },
  getTripData(quote) {
    var tripData = ENV.apiURL + '/search/tripData';
    return DS.PromiseObject.create({
      promise: jQuery.get(tripData, {
        serviceLevelId: quote.serviceLevelId,
        routeId: quote.route.id,
        originId: quote.origin.id,
        destinationId: quote.destination.id,
        tripDate: quote.routeDepartingDate,
        reverse: quote.reverse
      })
    });
  },
  actions: {
    searchTrip(params) {
      let searchButton = params.searchButton;
      params.olderAdultCount = 0;
      params.infantCount = 0;
      params.childrenCount = 0;
      params.adultCount = 0;
      params.timeZone = 'America/Mexico_City';
      delete params.searchButton;
      jQuery.ajax({
        url: ENV.apiURL + '/search/trip',
        data: JSON.stringify(params),
        contentType: 'application/json; charset=utf-8',
        method: 'POST'
      }).then((data) => {
        let startTime = moment(params.departureDate).startOf('day');
        let endTime = moment(params.departureDate).endOf('day');
        this.set('searchDepartures', data.departureQuotes.filter((current) => {
          let currentDate = moment(current.departingDate);
          return startTime.isSameOrBefore(currentDate) && currentDate.isSameOrBefore(endTime);
        }));
        searchButton.stop();
      }, () => {
        searchButton.stop();
      });
    },
    selectQuote(quote) {
      let trip = this.getTripData(quote);
      this.set('sale.departureTrip', trip);
      this.set('sale.departureQuote', quote);
      this.set('step', 'sell');
      this.set('quote', quote);
    },
    payment() {
      this.set('step', 'payment');
    },
    paymentReceived(paymentData) {
      paymentData.email = 'dev.tickets.medrano@gmail.com';
      paymentData.terminalId = this.get('model.terminal.id');
      paymentData.baggage = this.get('baggage');
      paymentData.baggage.totalPrice = parseInt(this.get('sale.totalPrice'), 10);
      jQuery('.loading').show();
      this.get('authorizedRequest').ajax(ENV.apiURL + '/sale/payBooth',
      {
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(paymentData)
      }).then((data) => {
        jQuery.ajax({
          url: ENV.apiURL + '/sale/saleData/' + data.shortId
        }).then((saleData) => {
          jQuery('.loading').hide();
          location.href = ENV.apiURL + '/sale/downloadBaggageTicket/' + saleData.shortId + '?timeZone=' + 'America/Mexico_City';
          this.set('step', 'payed');
          this.set('finishedSale', saleData);
        });
      });
    }
  }
});
