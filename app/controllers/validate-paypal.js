import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Controller.extend({
	queryParams: ['paymentId', 'token', 'PayerID'],
	paymentId: null,
	token: null,
	PayerID: null,
	init() {
		this._super();
		Ember.run.scheduleOnce('afterRender', this, () => {
			jQuery('.loading').show();
			this.confirmPaypal().then((data) => {
				jQuery('.loading').hide();
				this.transitionToRoute('finishedPayment', data.shortId);
			});
		});
	},
	confirmPaypal() {
		let params = {
			paymentId: this.get('paymentId'),
			token: this.get('token'),
			PayerID: this.get('PayerID')
		};
		return DS.PromiseObject.create({
			promise: jQuery.ajax({
				url: ENV.apiURL + '/sale/confirmPaypal',
				data: params,
				method: 'GET'
			})
		});
  }
});
