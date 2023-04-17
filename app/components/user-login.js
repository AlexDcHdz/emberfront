import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  authorizedRequest: Ember.inject.service('authorizedRequest'),
	register: Ember.Object.create({
		username: '',
		email: ''
	}),
	init() {
    this._super();

		this.get('register').addObserver('username', this, this.checkUnique);
		this.get('register').addObserver('email', this, this.checkUnique);

		window.googleLogin = (googleUser) => {
			var id_token = googleUser.getAuthResponse().id_token;
			this.send('googleLogin', id_token);
		};
	},
	checkUnique() {
		var register = this.get('register');
		jQuery.ajax({
			url: ENV.apiURL + '/register/uniques',
			data: JSON.stringify(register),
			contentType: 'application/json; charset=utf-8',
			method: 'POST',
			success: (data) => {
				this.set('usernameRepeatedError', data.username);
				this.set('emailRepeatedError', data.email);
				this.set('repeatedError', data.username || data.email);
			}
		});
	},
	isPopupShowing() {
		return jQuery('#soap-popupbox').length > 0 && jQuery('#soap-popupbox').css('display') === 'block';
	},
	continueRegistration(socialData) {
		if(!this.isPopupShowing()) {
			return false;
		}
		this.get('register').setProperties(socialData);
		jQuery('.goto-signup-form').click();
	},
	continueSocialLogin(provider, token) {
		var socialDataURL = ENV.apiURL + '/social/validate';
		jQuery.get(socialDataURL, {
			tokenId: token,
			provider: provider
		}).done((data) => {
			if(!data.username) {
				this.continueRegistration(data);
			} else {
				this.get('session').authenticate('authenticator:social', data).catch(() => {
					jQuery('.opacity-overlay').fadeOut();
				});
			}
		});
	},
	isRegisterValid() {
		var register = this.get('register');
		return register &&
			register.password &&
			register.username &&
			register.name &&
			register.lastName &&
			register.confirmPassword;
	},
	actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      console.log('MUERETE');
      this.get('session').authenticate('authenticator:oauth2', identification, password)
      .then(() => {
        this.get('authorizedRequest').ajax(ENV.apiURL + '/currentProfile').then((profile) => {
          this.get('session').set('data.profile', profile);
          console.log(profile.permissions);
          if(profile.permissions.indexOf('configure-id') >= 0) {
            this.container.lookup('controller:application').transitionToRoute('admin-dashboard');
          } else if(profile.permissions.indexOf('weekly-payment-id') >= 0) {
            this.container.lookup('controller:application').transitionToRoute('admin-weekly-payments');
          } else if(profile.permissions.indexOf('payments-id') >= 0) {
            this.container.lookup('controller:application').transitionToRoute('admin-payments');
          } else {
            this.container.lookup('controller:application').transitionToRoute('ticket-dashboard');
          }
        });
      })
      .catch((reason) => {
        console.log('ERROR', reason);
      });
    },
		facebookLogin() {
			FB.getLoginStatus((response) => {
				if (response.status === 'connected') {
					this.continueSocialLogin('facebook', response.authResponse.accessToken);
				} else {
					FB.login((response) => {
						this.continueSocialLogin('facebook', response.authResponse.accessToken);
					}, {scope: 'email,public_profile'});
				}
			});
		},
		googleLogin(tokenId) {
			this.continueSocialLogin('google', tokenId);
		},
		registerUser() {
			var register = this.get('register');
			var session = this.get('session');
			if(this.isRegisterValid() && !this.get('repeatedError')) {
				if(register.password !== register.confirmPassword) {
					this.set('registerPasswordErrors', true);
					return;
				}
				this.set('registerPasswordErrors', false);
				this.set('registerErrors', false);

				jQuery.ajax({
					url: ENV.apiURL + '/register',
					data: JSON.stringify(register),
					contentType: 'application/json; charset=utf-8',
					method: 'POST',
					success: function (data) {
						session.authenticate('authenticator:social', data).then(() => {
							jQuery('.opacity-overlay').fadeOut();
						});
					}
				});

			} else {
				this.set('registerErrors', true);
			}
		}
	}
});
