import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

let expenseTypes = [
  {
    name: 'Diesel (contado)',
  },
  {
    name: 'Reparación de llantas',
  },
  {
    name: 'Estacionamiento',
  },
  {
    name: 'Autopistas (crédito)',
  },
  {
    name: 'Autopistas (contado)',
  },
  {
    name: 'Artículos de limpieza',
  },
  {
    name: 'Pensión / Hotel',
  },
  {
    name: 'Conferencia telefónica',
  },
  {
    name: 'Engrasado / Lavado',
  },
  {
    name: 'Refacciones y accesorios',
  },
  {
    name: 'Mano de obra reparación',
  },
  {
    name: 'Daño a unidad',
  },
  {
    name: 'Pasajero olvidado',
  },
  {
    name: 'Maleta Extraviada',
  },
  {
    name: 'Otros gastos'
  }
];

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  section: 'listing',
  expenses: [],
  startShift: false,
  startSnapshot: false,
  startEnding: false,
  amount: 0,
  expenseTypes: expenseTypes,
  tripDetail: null,
  checklist: {
    hasAllPlaces: false,
    hasAllStamps: false,
    packageArrived: false
  },
  selectedEnding: {
    name: null
  },
  dieselTotal: Ember.computed('tripDetail.trips.@each.dieselLiters', 'tripDetail.dieselCost', function () {
    var total = 0;
    this.get('tripDetail.trips').forEach((trip) => {
      if(trip.dieselLiters) {
        total += this.get('tripDetail.dieselCost') * trip.dieselLiters;
      }
    });
    return total;
  }),
  driver2Total: Ember.computed('tripDetail', 'expenses.@each.amount', 'expenses.@each.type', function () {
    return this.get('driver2Earnings') - this.get('driver2ExpensesSubtotal') - this.get('driver2Loans') - (this.get('tripDetail.driver2NominalDiscount.weekAmount') || 0) - (this.get('tripDetail.driver2InsuranceDiscount.weekAmount') || 0);;
  }),
  driver1Total: Ember.computed('tripDetail', 'expenses.@each.amount', 'expenses.@each.type', function () {
    return this.get('driver1Earnings') - this.get('driver1ExpensesSubtotal') - this.get('driver1Loans') - (this.get('tripDetail.driver1NominalDiscount.weekAmount') || 0) - (this.get('tripDetail.driver1InsuranceDiscount.weekAmount') || 0);;
  }),
  driver1Earnings: Ember.computed('tripDetail', 'expenses.@each.amount', 'expenses.@each.type', function () {
    var percentage = 0.08;
    if(!this.get('tripDetail.driver2')) {
      percentage = 0.13;
    }
    let baggageTotal = this.get('tripDetail.baggageData').map(t => t.paymentPrice).reduce(function (a, b) {
      return a + b;
    }, 0);
    let total = this.get('tripDetail.tripData.tickets').map(t => t.payment).reduce(function (a, b) {
      return a + b;
    }, 0);
    let returnValue = (total + baggageTotal) * percentage;
    if(returnValue < 0) {
      return 0;
    }
    return returnValue;
  }),
  driver2Earnings: Ember.computed('tripDetail', function () {
    if(!this.get('tripDetail.driver2')) {
      return 0;
    }
    let baggageTotal = this.get('tripDetail.baggageData').map(t => t.paymentPrice).reduce(function (a, b) {
      return a + b;
    }, 0);
    let total = this.get('tripDetail.tripData.tickets').map(t => t.payment).reduce(function (a, b) {
      return a + b;
    }, 0);
    let returnValue = (total + baggageTotal) * 0.08;
    if(returnValue < 0) {
      return 0;
    }
    return returnValue;
  }),
  driver1Loans: Ember.computed('tripDetail', 'expenses.@each.amount', 'expenses.@each.type', function () {
    var loans = this.get('tripDetail.driver1.loans');
    if(!loans) {
      loans = [];
    }
    return loans.map(l => {
      var discount;
      if(l.type === 'NUMBER') {
        discount = l.number;
      } else {
        discount = (l.loanAmount * l.number / 100);
      }
      if(discount > l.missingAmount) {
        discount = l.missingAmount;
      }
      return discount;
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
  }),
  driver2Loans: Ember.computed('tripDetail', 'expenses.@each.amount', 'expenses.@each.type', function () {
    let loans = this.get('tripDetail.driver2.loans');
    if(!loans) {
      loans = [];
    }
    return loans.map(l => {
      var discount;
      if(l.type === 'NUMBER') {
        discount = l.number;
      } else {
        discount = (l.loanAmount * l.number / 100);
      }
      return discount;
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
  }),
  driver1Expenses: Ember.computed('tripDetail', 'expenses.@each.amount', 'expenses.@each.type', function () {
    // var percentage = 0.08;
    // if(!this.get('tripDetail.driver2')) {
    //   percentage = 0.13;
    // }
    // let discount = this.get('tripDetail.driver1.loans').map(l => {
    //   var discount;
    //   if(l.type === 'NUMBER') {
    //     discount = (l.loanAmount / l.number);
    //   } else {
    //     discount = (l.loanAmount * l.number / 100);
    //   }
    //   return discount;
    // }).reduce(function (a, b) {
    //   return a + b;
    // }, 0);
    // let baggageTotal = this.get('tripDetail.baggageData').map(t => t.paymentPrice).reduce(function (a, b) {
    //   return a + b;
    // }, 0);
    // let total = this.get('tripDetail.tripData.tickets').map(t => t.payment).reduce(function (a, b) {
    //   return a + b;
    // }, 0);
    // let advanceTotal = this.get('tripDetail.advances').map(a => a.amount).reduce(function (a, b) {
    //   return a + b;
    // }, 0);
    let expenseTotal = this.get('expenses').filter(e => e.type && e.type.indexOf('crédito') < 0)
          .map(e => parseInt(e.amount, 10)).reduce(function (a, b) {
            return a + b;
          }, 0)
    return expenseTotal;
  }),
  driver2Expenses: 0,
  trips: Ember.computed('selectedEnding.name', function () {
    let ending = this.get('selectedEnding.name');
    return DS.PromiseArray.create({
      promise: jQuery.get(ENV.apiURL + '/trip/endings?stopOff=' + this.get('selectedEnding.name')).then(data => {
        return data;
      })
    });
  }),
  driver1ExpensesSubtotal: Ember.computed('tripDetail', 'expenses.@each.amount', 'expenses.@each.type', function () {
    return this.get('driver1ExpensesAdvance') - this.get('driver1Expenses');
  }),
  driver2ExpensesSubtotal: 0,
  driver1ExpensesAdvance: Ember.computed('tripDetail', 'expenses.@each.amount', 'expenses.@each.type', function () {
    let advanceTotal = this.get('tripDetail.advances').map(a => a.amount).reduce(function (a, b) {
      return a + b;
    }, 0);
    return advanceTotal;
  }),
  paymentPossible: Ember.computed('allow', 'dieselTotal', function () {
    return this.get('allow') && this.get('dieselTotal') >= 0;
  }),
  driver2ExpensesAdvance: 0,
  actions: {
    startShift() {
      let username = this.get('session.data.profile.username');
      localforage.getItem('terminalData').then((data) => {
        this.get('authorizedRequest').ajax(ENV.apiURL + '/payment/startShift?terminalId=' + data.id + '&employeeId=' + username).then((start) => {
          this.set('model.status', true);
          location.href = ENV.apiURL + '/payment/downloadStartShift/' + data.id + '.pdf?timeZone=' + 'America/Mexico_City';
        });
      });
    },
    startSnapshot() {
      this.set('startSnapshot', true);
    },
    saveSnapshot() {
      localforage.getItem('terminalData').then((data) => {
        console.log(data);
        this.get('authorizedRequest').ajax(ENV.apiURL + '/payment/recordSnapshot?terminalId=' + data.id + '&amount=' + this.get('amount')).then((close) => {
          this.set('startSnapshot', false);
          location.href = ENV.apiURL + '/payment/downloadRecordSnapshot/' + data.id + '.pdf?timeZone=' + 'America/Mexico_City';
        });
      });
    },
    startClose() {
      this.set('startEnding', true);
    },
    closeShift() {
      localforage.getItem('terminalData').then((data) => {
        this.get('authorizedRequest').ajax(ENV.apiURL + '/payment/closeShift?terminalId=' + data.id + '&amount=' + this.get('amount')).then((close) => {
          this.set('model.status', false);
          location.href = ENV.apiURL + '/payment/downloadCloseShift/' + data.id + '.pdf?timeZone=' + 'America/Mexico_City';
        });
      });
    },
    addExpense() {
      this.get('expenses').pushObject({receipt: false});
    },
    removeExpense(expense) {
      this.get('expenses').removeObject(expense);
    },
    saveTemporal(tripDetail, expenses, checklist) {
      let saveButton = Ladda.create($('#saveButton').get(0));
      saveButton.start();
      this.get('authorizedRequest').ajax(ENV.apiURL + '/trip/savePaymentSnapshot', {
        method: 'POST',
        data: JSON.stringify({
          tripId: tripDetail.id,
          expenses: expenses,
          checklist: checklist,
          trips: this.get('tripDetail.trips'),
          dieselCost: this.get('tripDetail.dieselCost'),
          driver1Id: this.get('tripDetail.driver1.id'),
          driver2Id: this.get('tripDetail.driver2.id'),
          driver1Earnings: this.get('driver1Earnings'),
          driver2Earnings: this.get('driver2Earnings'),
          driver1ExpensesAdvance: this.get('driver1ExpensesAdvance'),
          driver2ExpensesAdvance: this.get('driver2ExpensesAdvance'),
          driver1Expenses: this.get('driver1Expenses'),
          driver2Expenses: this.get('driver2Expenses'),
          driver1Loans: this.get('driver1Loans'),
          driver2Loans: this.get('driver2Loans'),
          driver1Amount: this.get('driver1Total'),
          driver2Amount: this.get('driver2Total')
        }),
        contentType: 'application/json; charset=utf-8',
      }).then((data) => {
        console.log(data);
        saveButton.stop();
      }, (error) => {
        console.error(error);
        saveButton.stop();
      });
    },
    save(tripDetail, expenses, checklist) {
      var found = false;
      expenses.forEach((e) => {
        if(e.comments === 'Diesel, automático') {
          found = true;
          Ember.set(e, 'amount', this.get('dieselTotal'));
        }
      });
      if(!found) {
        expenses.push({
          receipt: false,
          comments: 'Diesel, automático',
          amount: this.get('dieselTotal'),
          type: 'Diesel (crédito)'
        });
      }
      this.get('authorizedRequest').ajax(ENV.apiURL + '/trip/savePayment', {
        method: 'POST',
        data: JSON.stringify({
          tripId: tripDetail.id,
          expenses: expenses,
          checklist: checklist,
          dieselCost: this.get('tripDetail.dieselCost'),
          trips: this.get('tripDetail.trips'),
          driver1Id: this.get('tripDetail.driver1.id'),
          driver2Id: this.get('tripDetail.driver2.id'),
          driver1Earnings: this.get('driver1Earnings'),
          driver2Earnings: this.get('driver2Earnings'),
          driver1ExpensesAdvance: this.get('driver1ExpensesAdvance'),
          driver2ExpensesAdvance: this.get('driver2ExpensesAdvance'),
          driver1Expenses: this.get('driver1Expenses'),
          driver2Expenses: this.get('driver2Expenses'),
          driver1Loans: this.get('driver1Loans'),
          driver2Loans: this.get('driver2Loans'),
          driver1Amount: this.get('driver1Total'),
          driver2Amount: this.get('driver2Total')
        }),
        contentType: 'application/json; charset=utf-8',
      }).then(() => {
        this.set('selectedEnding.name', null);
        this.set('section', 'listing');
        location.href = ENV.apiURL + '/trip/paymentReport/' + tripDetail.id + '.pdf?timeZone=' + 'America/Mexico_City';
      });
    },
    showTrip(trip) {
      this.set('expenses', []);
      localforage.getItem('terminalData').then((data) => {
        this.get('authorizedRequest').ajax(ENV.apiURL + '/terminal/' + data.id).then((terminalData) => {
          this.set('expenseTypes', expenseTypes.filter(type => {
            return type.name != 'Reparación de llantas' || terminalData.officeName == 'Tampico';
          }));
        });
      });
      jQuery.get(ENV.apiURL + '/trip/groups/' + trip.id)
        .then(data => {
          var allow = true;
          console.log(data);
          if(data.expenses) {
            this.set('expenses', data.expenses);
          }
          if(data.stopControlData) {
            for(var stop in data.stopControlData) {
              if(data.stopControlData.hasOwnProperty(stop)) {
                if(!data.stopControlData[stop].visited) {
                  allow = false;
                  break;
                }
              }
            }
          }
          data.tripData.tickets = data.tripData.tickets.filter((ticket) => {
            return ticket.status === 'USED';
          });

          this.set('allow', allow);
          this.set('section', 'detail');
          this.set('tripDetail', data);
        });
    }
  }
});
