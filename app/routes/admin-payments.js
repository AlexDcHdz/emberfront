import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Route.extend({
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  session: Ember.inject.service('session'),
	model() {
		return DS.PromiseObject.create({
			promise: new Promise((resolve) => {
        localforage.getItem('terminalData').then((data) => {
          if(!data) {
            jQuery.get(ENV.apiURL + '/search/destinations').then((destinations) => {
              resolve({
                status: null,
                destinations: destinations
              });
              return;
            });
          }
          this.get('authorizedRequest').ajax(ENV.apiURL + '/payment/status?terminalId=' + data.id).then((boothStatus) => {
            jQuery.get(ENV.apiURL + '/search/destinations').then((destinations) => {
              resolve({
                status: boothStatus,
                destinations: destinations
              })
            });
          }, (error) => {
            console.log(error);
            if(gapi && gapi.auth2) {
              gapi.auth2.getAuthInstance().signOut();
            }
            this.set('session.data.profile', null);
            this.get('session').invalidate();
            this.container.lookup('controller:application').transitionToRoute('index');
          });
        });
      })
		});
	}
});
