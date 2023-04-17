import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import Ember from 'ember';
import ENV from '../config/environment';

const { isEmpty } = Ember;

export default OAuth2PasswordGrant.extend({
  serverTokenEndpoint: ENV.apiURL + '/oauth/token',
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
	}
});
