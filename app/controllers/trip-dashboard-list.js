import Ember from 'ember';

export default Ember.Controller.extend({
  selectedStop: null,
  stops: [
    {name: 'hola'}
  ],
  actions: {
    goOn(selectedStop) {
      location.href = '/tripDashboard/' + selectedStop.id;
    }
  }
});
