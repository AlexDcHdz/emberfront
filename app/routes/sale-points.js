import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Route.extend({
  model() {
		return DS.PromiseObject.create({
			promise: jQuery.ajax({
				url: ENV.apiURL + '/booth/offices'
      })
    });
  }
});
