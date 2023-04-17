import Ember from 'ember';

export default Ember.Route.extend({
	queryParams: {
		paymentId: {
			refreshModel: true
		},
		token: {
			refreshModel: true
		},
		PayerID: {
			refreshModel: true
		}
	}
});
