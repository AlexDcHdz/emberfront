import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  selectedBeginning: {
    name: null
  },
  search: {
    driverName: ''
  },
  actions: {
    showTrip(trip) {
      this.set('trip', trip);
      this.set('trips', null);
    },
    searchData(stopOff, driverName, date) {
      jQuery.get(ENV.apiURL + '/trip/findTrips', {
        stopOff: stopOff,
        driverName: driverName,
        date: date.toISOString()
      }).then(data => {
        data.forEach(trip => {
          var start;
          var end;
          if(trip.tripData.reverse) {
            start = trip.tripData.stops[0].name;
            end = trip.tripData.stops[trip.tripData.stops.length - 1].name;
          } else {
            start = trip.tripData.stops[trip.tripData.stops.length - 1].name;
            end = trip.tripData.stops[0].name;
          }
          trip.startingStop = start;
          trip.endingStop = end;
        });
        this.set('trips', data);
      });
    }
  }
});
