import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Route.extend({
  model(params) {
		return DS.PromiseObject.create({
			promise: new Promise((resolve) => {
        jQuery.get(ENV.apiURL + '/sale/saleData/' + params.id, function (data) {
          if (!data.payed) {
            jQuery('.loading').show();
            setTimeout(function () {
              location.reload();
            }, 5000);
          }
          resolve(data);
        });
      })
    });
  }
});
