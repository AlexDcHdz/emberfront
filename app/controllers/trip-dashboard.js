import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  step: 'begin',
  init() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.updateCall();
    });
  },
  updateCall() {
    if (this.get('step') === 'begin') {
      jQuery.get(ENV.apiURL + '/routes/stopsSchedule/' + this.get('model').id)
        .then((data) => {
          this.set('allStops', data);
          this.set('stops', this.get('allStops').slice(0, 15));
          this.set('step', 'next');
          this.set('current', 15);
        });
    } else if(this.get('step') === 'next') {
      let start = this.get('current');
      this.set('stops', this.get('allStops').slice(start, start + 15));
      if (start + 15 > this.get('allStops').length) {
        this.set('step', 'begin');
      }
    }
    setTimeout(() => {
      this.updateCall();
    }, 15000)
  }
});
