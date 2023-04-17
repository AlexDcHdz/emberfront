import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import Ember from 'ember';

const { RSVP, isEmpty } = Ember;

export default OAuth2PasswordGrant.extend({
  serverTokenEndpoint: 'http://api.sales.medrano.iamedu.io/oauth/token',
  clientId: 'clientapp',
  clientSecret: '123456',
	makeRequest(url, data) {
		const options = {
			url,
			data,
			type:        'POST',
			dataType:    'json',
			contentType: 'application/x-www-form-urlencoded'

		};
		const clientId = this.get('clientId');
		const clientSecret = this.get('clientSecret');

		if (!isEmpty(clientId)) {
			const base64ClientId = window.btoa(clientId.concat(':').concat(clientSecret));
			Ember.merge(options, {
				headers: {
					Authorization: `Basic ${base64ClientId}`
				}
			});
		}

		return Ember.$.ajax(options);
	},
  authenticate(token) {
		return RSVP.resolve(token);
  }
});
