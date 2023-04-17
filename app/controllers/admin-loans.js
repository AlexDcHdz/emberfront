import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  section: null,
  selected: {
    operator: null,
    type: null,
    concept: null
  },
  concepts: [
    {
      id: 'unit-damage',
      text: 'Daño general a la unidad'
    },
    {
      id: 'personal',
      text: 'Personal'
    },
    {
      id: 'forgotten-passenger',
      text: 'Pasajero olvidado'
    },
    {
      id: 'lost-suitcase',
      text: 'Equipaje perdido'
    },
    {
      id: 'advance',
      text: 'Anticipo de sueldo'
    },
    {
      id: 'diesel-exceded',
      text: 'Excedente de diesel'
    },
    {
      id: 'other',
      text: 'Otro'
    }
  ],
  types: [
    {
      id: 'percentage',
      text: 'Porcentaje'
    },
    {
      id: 'number',
      text: 'Monto'
    }
  ],
  account: Ember.computed('selected.operator', function () {
    if(this.get('selected.operator')) {
      this.set('section', 'authorize');
    }
		return DS.PromiseObject.create({
			promise: jQuery.get(ENV.apiURL + '/loan/account/' + this.get('selected.operator'))
		});
  }),
  actions: {
    modify(loan) {
      this.set('section', 'modify');
      this.set('selectedLoan', loan);
    },
    saveNewAmount(loan, newAmount) {
      this.get('authorizedRequest').ajax(ENV.apiURL + '/loan/changeAmount', {
        method: 'POST',
        data: JSON.stringify({
          id: loan.id,
          amount: newAmount
        }),
        contentType: 'application/json; charset=utf-8',
      }).then(() => {
        this.set('selected.operator', null);
        this.set('section', null);
      });
    },
    authorize(userId, amount, type, num, observations, concept) {
      this.get('authorizedRequest').ajax(ENV.apiURL + '/loan/authorizeLoan', {
        method: 'POST',
        data: JSON.stringify({
          userId: userId,
          amount: amount,
          observations: observations,
          concept: concept,
          type: type,
          num: num
        }),
        contentType: 'application/json; charset=utf-8',
      }).then(() => {
        this.set('selected.operator', null);
      });
    }
  }
});
