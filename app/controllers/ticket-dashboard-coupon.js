import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  step: 'sale',
  tz: 'America/Mexico_City',
  actions: {
    paymentReceived(data) {
      let paymentData = {
        paymentParts: data.paymentParts,
        cardNumber: this.get('cardNumber'),
        name: this.get('name')
      };
      paymentData.terminalId = this.get('model.terminal.id');
      jQuery.ajax({
        url: ENV.apiURL + '/sale/payCoupon',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(paymentData)
      }).then((response) => {
        this.set('step', 'result');
        this.set('response', response);
      });
    }
  }
});
