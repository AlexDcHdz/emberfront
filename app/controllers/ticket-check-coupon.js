import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  actions: {
    search(number) {
			jQuery.ajax({
				url: ENV.apiURL + '/sale/accountData/' + number,
				contentType: 'application/json; charset=utf-8'
			}).then((data) => {
        this.set('data', data);
			});
    }
  }
});
