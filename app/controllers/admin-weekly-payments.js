import Ember from 'ember';

export default Ember.Controller.extend({
  types: ['Anticipo', 'Seguro'],
  paymentData: {},
  actions: {
    uploadFinished(data) {
      this.set('uploadedData', data.payments);
      this.set('invalidPayments', data.invalidUsers);
    }
  }
});
