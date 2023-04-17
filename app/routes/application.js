import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
	moment: Ember.inject.service(),
  beforeModel() {
    let profile = this.get('session.data.profile');
    this.get('moment').changeLocale('es');
    moment.tz.setDefault('America/Mexico_City');
    // if(profile && profile.roles && profile.roles.indexOf('oficina') >= 0) {
    //   this.transitionTo('admin-dashboard');
    // }
  },
  actions: {
    logout() {
      if(gapi && gapi.auth2) {
        gapi.auth2.getAuthInstance().signOut();
      }
      this.set('session.data.profile', null);
      this.get('session').invalidate();
      this.container.lookup('controller:application').transitionToRoute('index');
    }
  }
});
