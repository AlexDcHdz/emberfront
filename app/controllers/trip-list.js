import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  search: {},
  actions: {
    searchTrips(search) {
      let startDate = moment(search.from).toISOString();
      let endDate = moment(search.to).toISOString();


      let trips = DS.PromiseArray.create({
        promise: jQuery.get(ENV.apiURL + '/trip/trips/listTrips?startingDate=' + startDate + '&endingDate=' + endDate)
      });
      this.set('trips', trips);
    },
    downloadTripGuide(trip) {
      location.href = ENV.apiURL + '/trip/downloadBoardingList/' + trip.id + '.pdf?timeZone=' + 'America/Mexico_City';
    }
  }
});
