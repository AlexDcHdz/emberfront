import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  billingData: {},
  billingAddress: {},
  tz: 'America/Mexico_City',
  actions: {
    search(ticketNumber) {
      this.set('saleId', ticketNumber);
      jQuery.ajax({
        url: ENV.apiURL + '/sale/saleData/' + ticketNumber
      }).then((saleData) => {
        this.set('sale', saleData);
      });
    },
    searchRfc(rfc) {
      jQuery.ajax({
				url: ENV.apiURL + '/sale/lookupBill?rfc=' + rfc
      }).then((data) => {
        this.set('billingData', data.billingData);
        this.set('billingAddress', data.billingAddress);
      });
    },
    generateBill(billingData, billingAddress) {
			jQuery('.loading').show();
			jQuery.ajax({
				url: ENV.apiURL + '/sale/generateBill/' + this.get('saleId'),
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
        data: JSON.stringify({
          billingData: billingData,
          billingAddress: billingAddress
        })
			}).then((data) => {
        this.set('sale', data);
				jQuery('.loading').hide();
			});
    }
  }
});
