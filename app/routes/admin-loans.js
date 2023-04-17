import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Route.extend({
	model() {
		return DS.PromiseArray.create({
			promise: jQuery.get(ENV.apiURL + '/loan/operators').then(data => {
        data.forEach(el => {
          el.fullName = el.name + ' ' + el.lastName;
          if(el.secondLastName) {
            el.fullName += ' ' + el.secondLastName;
          }
          return el;
        });
        data.sort((a, b) => {
          return a.fullName.localeCompare(b.fullName);
        });
        return data;
      })
		});
	}
});
