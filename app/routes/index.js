import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service('session'),
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  sessionAuthenticated() {
    jQuery('.opacity-overlay').fadeOut();
  },
  beforeModel(transition) {
    if(!this.get('session.isAuthenticated')) {
      this.set('session.data.profile', null);
    }
    return this._super(...arguments);
  },
  activate() {
    let profile = (this.get('session.data.profile'));
    if(profile) {
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
    }
  }
});
