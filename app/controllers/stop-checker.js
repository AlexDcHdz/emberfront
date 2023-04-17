import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  selectedStop: {
    name: ''
  },
  mustRefresh: false,
  missingStops: Ember.computed('selectedStop.name', 'mustRefresh', function () {
    return DS.PromiseArray.create({
      promise: jQuery.get(ENV.apiURL + '/trip/missingStops/' + this.get('selectedStop.name')).then(data => {
        return data;
      })
    });
  }),
  actions: {
    visited(id) {
      this.set('mustRefresh', false);
      jQuery.post(ENV.apiURL + '/trip/missingStops/' + id).then(data => {
        console.log('hola');
        this.set('mustRefresh', true);
      });
    }
  }
});
