import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  booth: {},
  tz: 'America/Mexico_City',
  saleType: 'search',
  currentStep: 'departure',
  currentIds: [],
  quotes: [],
  sale: {},
  discount: {},
  passengerTypes: [
    {id: 'ADULT', name: 'Adulto'},
    {id: 'OLDER_ADULT', name: 'Adulto Mayor'},
    {id: 'CHILD', name: 'Niño'},
    {id: 'STUDENT', name: 'Estudiante'},
    {id: 'INFANT', name: 'Infante'}
  ],
  canReserve: Ember.computed('sale.departureTrip.maxReserved', 'sale.departureTrip.reservedCount', 'passengers', function () {
    let passengers = this.get('passengers');
    return passengers.length + this.get('sale.departureTrip.reservedCount') <= this.get('sale.departureTrip.maxReserved');
  }),
  passengers: [{delete:false, passengerType: 'ADULT'}],
  subtotalPrice: Ember.computed('totalPrice', function () {
    return this.get('totalPrice') / 1.16;
  }),
  taxes: Ember.computed('subtotalPrice', function () {
    return this.get('subtotalPrice') * 0.16;
  }),
  totalPrice: Ember.computed('passengers.@each.passengerType', function () {
    this.calculatePrice();
    return this.get('sale.totalPrice');
  }),
  sufficientSeats: Ember.observer('enablePayment', 'passengers.@each.passengerType', function () {
    var studentCount = this.get('sale.departureTrip.studentCount');
    var olderAdultCount = this.get('sale.departureTrip.olderAdultCount');

    var maxStudents = this.get('sale.departureTrip.maxStudents');
    var maxOlderAdultCount = this.get('sale.departureTrip.maxOlderAdults');

    let passengers = this.get('passengers');

    let soldStudents = passengers.filter((passenger) => {
      return passenger.passengerType == 'STUDENT';
    }).length;

    let soldOlderAdults = passengers.filter((passenger) => {
      return passenger.passengerType == 'OLDER_ADULT';
    }).length;

    let enoughPlace = (studentCount + soldStudents <= maxStudents) && (olderAdultCount + soldOlderAdults <= maxOlderAdultCount);

    return enoughPlace && this.get('enablePayment');
  }),
  getTripData(quote) {
    var tripData = ENV.apiURL + '/search/tripData';
    return DS.PromiseObject.create({
      promise: jQuery.get(tripData, {
        routeId: quote.route.id,
        serviceLevelId: quote.serviceLevelId,
        originId: quote.origin.id,
        destinationId: quote.destination.id,
        tripDate: quote.routeDepartingDate,
        reverse: quote.reverse
      })
    });
  },
  calculatePrice() {
    var totalPrice = 0;
    let passengers = this.get('passengers');
    this.get('quotes').forEach((quote) => {
      var quotePrice = 0;
      passengers.forEach((passenger) => {
        if(passenger.passengerType === 'ADULT') {
          quotePrice += quote.quote.adultPrice;
          passenger.originalPrice = quote.quote.adultPrice;
          passenger.departurePrice = quote.quote.adultPrice;
          passenger.returnPrice = quote.quote.adultPrice;
        } else if(passenger.passengerType === 'OLDER_ADULT') {
          quotePrice += quote.quote.olderAdultPrice;
          passenger.originalPrice = quote.quote.adultPrice;
          passenger.departurePrice = quote.quote.olderAdultPrice;
          passenger.returnPrice = quote.quote.olderAdultPrice;
        } else if(passenger.passengerType === 'CHILD') {
          quotePrice += quote.quote.childPrice;
          passenger.originalPrice = quote.quote.adultPrice;
          passenger.departurePrice = quote.quote.childPrice;
          passenger.returnPrice = quote.quote.childPrice;
        } else if(passenger.passengerType === 'STUDENT') {
          quotePrice += quote.quote.studentPrice;
          passenger.originalPrice = quote.quote.adultPrice;
          passenger.departurePrice = quote.quote.studentPrice;
          passenger.returnPrice = quote.quote.studentPrice;
        } else {
          passenger.originalPrice = 0;
          passenger.departurePrice = 0;
          passenger.returnPrice = 0;
        }
      });
      Ember.set(quote, 'subtotalPrice', quotePrice / 1.16);
      Ember.set(quote, 'taxes', (quotePrice / 1.16) * 0.16);
      Ember.set(quote, 'totalPrice', quotePrice);
      totalPrice += quotePrice;
    });

    this.set('sale.totalPrice', totalPrice);
  },
  actions: {
    startShift() {
      let username = this.get('session.data.profile.username');
      localforage.getItem('terminalData').then((data) => {
        this.get('authorizedRequest').ajax(ENV.apiURL + '/booth/startShift?terminalId=' + data.id + '&employeeId=' + username + '&amount=0').then(() => {
          this.set('model.boothStatus', true);
          location.href = ENV.apiURL + '/booth/downloadStartShift/' + data.id + '.pdf?timeZone=' + 'America/Mexico_City';
        });
      });
    },
    recordSnapshot() {
      this.set('startSnapshot', true);
    },
    saveRecordSnapshot(booth) {
      console.log(booth);
      localforage.getItem('terminalData').then((data) => {
        this.get('authorizedRequest').ajax(ENV.apiURL + '/booth/recordSnapshot?terminalId=' + data.id + '&amount=' + booth.amount).then((start) => {
          Ember.set(booth, 'startSnapshot', false);
          location.href = ENV.apiURL + '/booth/downloadRecordSnapshot/' + data.id + '.pdf?timeZone=' + 'America/Mexico_City';
        });
      });
    },
    endShift() {
      localforage.getItem('terminalData').then((data) => {
        this.get('authorizedRequest').ajax(ENV.apiURL + '/booth/closeShift?terminalId=' + data.id).then((close) => {
          this.set('model.boothStatus', false);
          location.href = ENV.apiURL + '/booth/downloadCloseShift/' + data.id + '.pdf?timeZone=' + 'America/Mexico_City';
        });
      });
    },
    addPassenger() {
      var idx = 0;
      this.get('passengers').addObject({delete:true, passengerType: 'ADULT'});
      this.get('passengers').forEach(p => {
        Ember.set(p, 'idx', idx++);
      });
    },
    deletePassenger(passenger) {
      this.get('passengers').removeObject(passenger);
    },
    selectQuote(quote) {
      window.scrollTo(0, 0);
      let trip = this.getTripData(quote);
      let mode = this.get('currentStep');
      quote.mode = mode;
      //this.set('searchDepartures', null);
      let passengers = this.get('passengers');
      this.set('sale.departureTrip', trip);
      this.set('sale.departureQuote', quote);
      this.set('currentStep', 'confirm');
      this.set('currentSearchParams', {
        origin: quote.origin.name,
        destination: quote.destination.name,
        olderAdultCount: 0,
        infantCount: 0,
        childrenCount: 0,
        adultCount: 1
      });
      if(this.get('quotes').length > 0) {
        this.get('quotes').popObject();
      }
      if(passengers) {
        passengers.forEach((passenger) => {
          Ember.set(passenger, 'departureSeat', null);
        });
      }
      this.get('quotes').addObject({
        quote: quote,
        trip: trip
      });
    },
    selectLocal() {
      this.set('saleType', 'local');
    },
    selectSearch() {
      this.set('saleType', 'search');
    },
    searchTrip(params) {
      let searchButton = params.searchButton;
      params.olderAdultCount = 0;
      params.infantCount = 0;
      params.childrenCount = 0;
      params.adultCount = 1;
      params.timeZone = 'America/Mexico_City';
      delete params.searchButton;
      if(params.departureDate == '2017-04-03T05:00:00.000Z') {
        params.departureDate = '2017-04-03T07:00:00.000Z';
      }
      jQuery.ajax({
          url: ENV.apiURL + '/search/trip',
          data: JSON.stringify(params),
          contentType: 'application/json; charset=utf-8',
          method: 'POST'
      }).then((data) => {
        let startTime = moment(params.departureDate).startOf('day');
        let endTime = moment(params.departureDate).endOf('day');
        this.set('searchDepartures', data.departureQuotes);
        this.set('searchDepartures', data.departureQuotes.filter((current) => {
          let currentDate = moment(current.departingDate);
          return startTime.isSameOrBefore(currentDate) && currentDate.isSameOrBefore(endTime);
        }));
        searchButton.stop();
      }, () => {
        searchButton.stop();
      });
    },
    continueWithoutReturn() {
      this.set('currentStep', 'confirm');
    },
    returnToBus() {
      this.set('currentStep', 'confirm');
    },
    reserve(sale, passengers) {
      let saleRequest = {
        passengers: passengers,
        timeZone: 'America/Mexico_City',
        email: 'dev.tickets.medrano@gmail.com',
        terminalId: this.get('model.terminal.id'),
        departureTrip: {
          id: sale && sale.departureTrip && sale.departureTrip.get('id')
        },
        departureSegment: {
          startingStop: {
            id: sale && sale.departureQuote && sale.departureQuote.origin.id
          },
          endingStop: {
            id: sale && sale.departureQuote && sale.departureQuote.destination.id
          }
        }
      };
      jQuery('.loading').show();
      this.get('authorizedRequest').ajax(ENV.apiURL + '/sale/reserve',
      {
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(saleRequest)
      }).then((data) => {
        jQuery('.loading').hide();
        this.set('currentStep', 'reserved');
        this.set('reservationCode', data.shortId);
        this.set('currentIds', []);
        this.set('quotes', []);
        this.set('sale', {});
        this.set('passengers', [{
          delete: false,
          passengerType: 'ADULT'
        }]);
        this.set('searchDepartures', null);
        this.get('paymentComponent').reset();
        this.get('ticketSearch').reset();
      });
    },
    paymentReceived(paymentData) {
      paymentData.email = 'dev.tickets.medrano@gmail.com';
      paymentData.terminalId = this.get('model.terminal.id');
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
          location.href = ENV.apiURL + '/sale/downloadTickets/' + saleData.id + '.pdf?timeZone=' + 'America/Mexico_City';
          jQuery('.loading').hide();
          this.set('currentStep', 'departure');
          this.set('currentIds', []);
          this.set('quotes', []);
          this.set('sale', {});
          this.set('passengers', [{
            delete: false,
            passengerType: 'ADULT'
          }]);
          this.set('searchDepartures', null);
          this.get('paymentComponent').reset();
          this.get('ticketSearch').reset();
        });
      });
    },
    seatsSelected(trip/*, quote*/) {
      this.get('currentIds').addObject(trip.content.id);
      let allIds = this.get('quotes').map((quote) => {
        return quote.trip.content.id;
      });
      let currentIds = this.get('currentIds');
      let allSelected = allIds.every(el => {
        return currentIds.indexOf(el) >= 0;
      });

      this.calculatePrice();

      if(allSelected) {
        this.set('enablePayment', true);
        //this.set('currentStep', 'payment');
      }
    },
    returnToQuotes() {
      this.set('currentStep', 'departure');
    },
    selectPayment() {
      let passengers = this.get('passengers');
      let discountedPassengers = passengers.filter((passenger) => {
        return passenger.passengerType !== 'ADULT';
      }).length;

      if (discountedPassengers > 0) {
        // this.set('currentStep', 'discountPassword');
        this.set('currentStep', 'payment');
      } else {
        this.set('currentStep', 'payment');
      }
    },
    checkDiscountPassword() {
      jQuery('.loading').show();
      let discount = this.get('discount');
      this.get('authorizedRequest').ajax(ENV.apiURL + '/sale/checkUserDetail',
      {
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(discount)
      }).then((data) => {
        jQuery('.loading').hide();

        if (data.valid) {
          this.set('currentStep', 'payment');
        } else {
          this.set('discountError', 'El password es incorrecto');
        }

      });
    }
  }
});
