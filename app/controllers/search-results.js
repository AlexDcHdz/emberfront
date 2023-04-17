import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

 export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
	totalPrice: 0,
	queryParams: ['departureDate', 'returningDate', 'roundTrip', 'adultCount', 'childrenCount', 'infantCount', 'olderAdultCount', 'origin', 'destination'],
	currentStep: 'departureSelection',
	sale: {},
  counts: {
    adult: 1,
    child: 0,
    student: 0,
    olderAdult: 0,
    infants: 0
  },
  adultCountOptions: [0],
  studentCountOptions: [0],
  childrenCountOptions: [0],
  olderAdultCountOptions: [0],
  infantCountOptions: [0],
	isDepartSelection: Ember.computed('currentStep', function() {
		return ['departureSelection', 'departureSeatSelection'].indexOf(this.get('currentStep')) >= 0;
	}),
	isReturnSelection: Ember.computed('currentStep', function() {
		return ['returnSelection', 'returnSeatSelection'].indexOf(this.get('currentStep')) >= 0;
	}),
	currentQuotes: Ember.computed('currentStep', 'model', function() {
		if(this.get('currentStep') === 'departureSelection') {
			return this.get('model').departureQuotes;
		} else if(this.get('currentStep') === 'returnSelection') {
				return this.get('model').returnQuotes;
		} else {
			return [];
		}
	}),
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
  selectDeparture(quote, step) {
    let returnQuote = this.get('sale.returnQuote');
		var currentPrice = 0;
		if(returnQuote) {
      currentPrice += this.get('counts.adult') * returnQuote.adultPrice;
      currentPrice += this.get('counts.child') * returnQuote.childPrice;
      currentPrice += this.get('counts.student') * returnQuote.studentPrice;
      currentPrice += this.get('counts.olderAdult') * returnQuote.olderAdultPrice;
		}
		currentPrice += this.get('counts.adult') * quote.adultPrice;
		currentPrice += this.get('counts.child') * quote.childPrice;
		currentPrice += this.get('counts.student') * quote.studentPrice;
		currentPrice += this.get('counts.olderAdult') * quote.olderAdultPrice;
		this.set('sale.totalPrice', currentPrice);
		this.set('totalPrice', currentPrice);
    this.set('tripType', 'departure');
		this.set('currentTrip', this.getTripData(quote));
		this.set('currentQuote', quote);
		this.set('sale.departureTrip', this.get('currentTrip'));
		this.set('sale.departureQuote', quote);
		this.set('tripMode', 'departure');
    if(step) {
      this.set('direction', 'backwards');
      this.set('currentStep', step);
    } else {
      this.set('direction', 'forward');
      this.set('currentStep', 'selectNames');
    }
	},
  selectNumbers(quote) {
    // this.selectDeparture(quote);
		this.getTripData(quote).then((tripData) => {
		  var countUrl = ENV.apiURL + '/search/trip/' + tripData.id + '/counts';
		  DS.PromiseObject.create({
        promise: jQuery.get(countUrl)
      }).then((countData) => {
        var maxStudents = countData.maxStudents - countData.reservedStudents;
        var maxOlderAdults = countData.maxOlderAdults - countData.reservedOlderAdults;

        countData.maxStudents = maxStudents;
        countData.maxOlderAdults = maxOlderAdults;
        countData.maxChildren = countData.maxTotal;
        countData.maxInfants = countData.maxTotal;
        countData.maxAdults = countData.maxTotal;

        countData.showStudents = countData.maxStudents > 0;
        countData.showOlderAdults = countData.maxOlderAdults > 0;
        countData.showChildren = countData.maxChildren > 0;
        countData.showInfants = countData.maxInfants > 0;

        var students = [];
        var olderAdults = [];
        var children = [];
        var infants = [];
        var adults = [];

        for(var i = 0; i <= countData.maxStudents; i++) {
          students.push(i);
        }

        for(var i = 0; i <= countData.maxOlderAdults; i++) {
          olderAdults.push(i);
        }

        for(var i = 0; i <= countData.maxChildren; i++) {
          children.push(i);
        }

        for(var i = 0; i <= countData.maxInfants; i++) {
          infants.push(i);
        }

        for(var i = 0; i <= countData.maxAdults; i++) {
          adults.push(i);
        }

        this.set('adultCountOptions', adults);
        this.set('childrenCountOptions', children);
        this.set('studentCountOptions', students);
        this.set('infantCountOptions', infants);
        this.set('olderAdultCountOptions', olderAdults);

        this.set('countData', countData);
        this.set('temporaryQuote', quote);
        this.set('temporaryTripData', tripData);
        this.set('currentStep', 'selectNumbers');
      });
    });
  },
	selectReturn(quote) {
		let departureQuote = this.get('sale.departureQuote');
		var currentPrice = 0;
		if(departureQuote) {
      currentPrice += this.get('counts.adult') * departureQuote.adultPrice;
      currentPrice += this.get('counts.child') * departureQuote.childPrice;
      currentPrice += this.get('counts.student') * departureQuote.studentPrice;
      currentPrice += this.get('counts.olderAdult') * departureQuote.olderAdultPrice;
		}
		currentPrice += this.get('counts.adult') * quote.adultPrice;
		currentPrice += this.get('counts.child') * quote.childPrice;
		currentPrice += this.get('counts.student') * quote.studentPrice;
		currentPrice += this.get('counts.olderAdult') * quote.olderAdultPrice;
		this.set('sale.totalPrice', currentPrice);
		this.set('totalPrice', currentPrice);
		this.set('currentTrip', this.getTripData(quote));
    this.set('tripType', 'return');
		this.set('currentQuote', quote);
		this.set('sale.returnTrip', this.get('currentTrip'));
		this.set('sale.returnQuote', quote);
		this.set('currentStep', 'returnSeatSelection');
		this.set('tripMode', 'return');
    this.set('direction', 'forward');
    this.set('enableContinuation', false);
	},
	actions: {
    countsSelected() {
      var passengers = [];
      var counts = this.get('counts');
      var currentPassenger = 1;
      for(var i = 0; i < counts.adult; i++) {
        var passenger = {
          comments: null,
          departurePrice: null,
          departureSeat: null,
          name: '',
          originalName: 'Pasajero ' + currentPassenger,
          passengerType: 'ADULT',
          returnPrice: null,
          returnSeat: null
        };
        passengers.push(passenger);
        currentPassenger++;
      }
      for(var i = 0; i < counts.child; i++) {
        var passenger = {
          comments: null,
          departurePrice: null,
          departureSeat: null,
          name: '',
          originalName: 'Pasajero ' + currentPassenger,
          passengerType: 'CHILD',
          returnPrice: null,
          returnSeat: null
        };
        passengers.push(passenger);
        currentPassenger++;
      }
      for(var i = 0; i < counts.student; i++) {
        var passenger = {
          comments: null,
          departurePrice: null,
          departureSeat: null,
          name: '',
          originalName: 'Pasajero ' + currentPassenger,
          passengerType: 'STUDENT',
          returnPrice: null,
          returnSeat: null
        };
        passengers.push(passenger);
        currentPassenger++;
      }
      for(var i = 0; i < counts.olderAdult; i++) {
        var passenger = {
          comments: null,
          departurePrice: null,
          departureSeat: null,
          name: '',
          originalName: 'Pasajero ' + currentPassenger,
          passengerType: 'OLDER_ADULT',
          returnPrice: null,
          returnSeat: null
        };
        passengers.push(passenger);
        currentPassenger++;
      }
      for(var i = 0; i < counts.infants; i++) {
        var passenger = {
          comments: null,
          departurePrice: null,
          departureSeat: null,
          name: '',
          originalName: 'Pasajero ' + currentPassenger,
          passengerType: 'INFANT',
          returnPrice: null,
          returnSeat: null
        };
        passengers.push(passenger);
        currentPassenger++;
      }
      this.set('model.passengers', passengers);
      this.selectDeparture(this.get('temporaryQuote'));
    },
		finishedSale(shortId) {
			this.transitionToRoute('finishedPayment', shortId);
		},
		pendingSale(shortId) {
			this.transitionToRoute('pendingPayment', shortId);
		},
    returnData() {
      if(this.get('returningDate') && this.get('model').returnQuotes && this.get('model').returnQuotes.length > 0) {
        this.selectReturn(this.get('sale.returnQuote'));
		    this.set('direction', 'backwards');
      } else {
        this.selectDeparture(this.get('sale.departureQuote'));
      }
    },
		confirmData() {
      let quote = this.get('sale.departureQuote');
      this.get('model.passengers').forEach((passenger) => {
        if(passenger.passengerType === 'ADULT') {
          passenger.originalPrice = quote.adultPrice;
          passenger.departurePrice = quote.adultPrice;
          passenger.returnPrice = quote.adultPrice;
        } else if(passenger.passengerType === 'OLDER_ADULT') {
          passenger.originalPrice = quote.adultPrice;
          passenger.departurePrice = quote.olderAdultPrice;
          passenger.returnPrice = quote.olderAdultPrice;
        } else if(passenger.passengerType === 'CHILD') {
          passenger.originalPrice = quote.adultPrice;
          passenger.departurePrice = quote.childPrice;
          passenger.returnPrice = quote.childPrice;
        } else if(passenger.passengerType === 'STUDENT') {
          passenger.originalPrice = quote.adultPrice;
          passenger.departurePrice = quote.studentPrice;
          passenger.returnPrice = quote.studentPrice;
        } else {
          passenger.originalPrice = 0;
          passenger.departurePrice = 0;
          passenger.returnPrice = 0;
        }
      });
			this.set('currentStep', 'payment');
      window.scrollTo(0, 0);
		},
    returnPayment() {
		  this.set('currentStep', 'confirmation');
    },
		seatsSelected() {
      this.set('enableContinuation', true);
    },
		continueConfirmation() {
			let currentStep = this.get('currentStep');
			this.set('currentTrip', null);
			this.set('currentQuote', null);
			if(currentStep === 'departureSeatSelection') {
        if(this.get('returningDate') && this.get('model').returnQuotes && this.get('model').returnQuotes.length > 0) {
					this.set('currentStep', 'returnSelection');
				} else {
					this.set('currentStep', 'confirmation');
				}
			} else if(currentStep === 'returnSeatSelection') {
				this.set('currentStep', 'confirmation');
			}
		},
    returnSearch() {
			let currentStep = this.get('currentStep');
      if(currentStep === 'departureSelection') {
        window.history.back();
      } else if(currentStep === 'returnSelection') {
        this.selectDeparture(this.get('sale.departureQuote'), 'departureSeatSelection');
      }
    },
    returnQuotes() {
			let currentStep = this.get('currentStep');
			this.set('currentTrip', null);
      this.set('tripType', null);
      console.log(currentStep);
			if(currentStep === 'selectNumbers') {
        this.set('currentStep', 'departureSelection');
      } else if(currentStep === 'selectNames') {
        this.set('currentStep', 'departureSelection');
      } else if(currentStep === 'returnSeatSelection') {
        this.set('currentStep', 'returnSelection');
      }
    },
    namesSelected() {
		  this.set('currentStep', 'departureSeatSelection');
    },
		selectQuote(quote) {
			let currentStep = this.get('currentStep');
			if(currentStep === 'departureSelection') {
        this.selectNumbers(quote);
			} else if(currentStep === 'returnSelection') {
				this.selectReturn(quote);
			}
		},
    returnFromReturnSeats() {
      this.set('currentStep', 'returnSelection');
    },
    continueFromReturnSeats() {
			this.set('currentTrip', null);
			this.set('currentQuote', null);
      this.set('currentStep', 'confirmation');
    },
    returnFromDepartureSeats() {
      this.set('direction', 'forward');
      this.set('currentStep', 'selectNames');
    },
    continueFromDepartureSeats() {
			this.set('currentTrip', null);
			this.set('currentQuote', null);
      if(this.get('returningDate') && this.get('model').returnQuotes && this.get('model').returnQuotes.length > 0) {
        this.set('currentStep', 'returnSelection');
      } else {
        this.set('currentStep', 'confirmation');
      }
    }
	}
});
