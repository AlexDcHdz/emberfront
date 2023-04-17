import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  session: Ember.inject.service('session'),
  section: 'listing',
  subsection: 'paradas',
  advances: [],
  selectedBeginning: {
    name: null
  },
  trips: Ember.computed('selectedBeginning.name', function () {
    let beginning = this.get('selectedBeginning.name');
		return DS.PromiseArray.create({
			promise: jQuery.get(ENV.apiURL + '/trip/beginnings?stopOff=' + this.get('selectedBeginning.name')).then(data => {
        return data;
      })
		});
  }),
  actions: {
    print(tripDetail, advances) {
      var total = 0;
      for(var advance in advances) {
        if(advances.hasOwnProperty(advance)) {
          if(advances[advance].amount) {
            total += parseInt(advances[advance].amount, 10);
          }
        }
      }
      console.log(this.get('session.data.profile'));
      location.href = ENV.apiURL + '/trip/downloadGuide/' + tripDetail.id + '.pdf?amount=' + total + '&timeZone=' + 'America/Mexico_City' + '&userId=' + this.get('session.data.profile.username');
    },
    save(tripDetail, advances, description) {
      this.get('authorizedRequest').ajax(ENV.apiURL + '/trip/generateGuide', {
        method: 'POST',
        data: JSON.stringify({
          tripId: tripDetail.id,
          advances: advances,
          description: description
        }),
        contentType: 'application/json; charset=utf-8',
      }).then(() => {
        this.set('selectedBeginning.name', null);
        this.set('section', 'listing');
        this.set('subsection', 'paradas');
      });
    },
    selectSubsection(subsection) {
      this.set('subsection', subsection);
    },
    addAdvance() {
      this.get('advances').pushObject({});
    },
    removeAdvance(advance) {
      if(!advance.fixed) {
        this.get('advances').removeObject(advance);
      }
    },
    showTrip(trip) {
      this.set('advances', [{
        description: 'Anticipo',
        amount: trip.advance,
        fixed: true
      }]);
      this.set('description', '');
      jQuery.get(ENV.apiURL + '/trip/' + trip.id)
      .then(data => {
        let stops = {
          beginnings: {},
          endings: {}
        };
        var departureDate = new Date(data.departureDate);
        departureDate.setTime(departureDate.getTime());
        data.tripData.tickets.forEach((ticket) => {
          if(!stops.beginnings[ticket.startingStop.name]) {
            stops.beginnings[ticket.startingStop.name] = [];
          }
          if(!stops.endings[ticket.endingStop.name]) {
            stops.endings[ticket.endingStop.name] = [];
          }
          stops.beginnings[ticket.startingStop.name].push({
            passengerName: ticket.passengerName,
            seatName: ticket.seatName,
            ticketId: ticket.ticketId
          });
          stops.endings[ticket.endingStop.name].push({
            passengerName: ticket.endingStop.name,
            seatName: ticket.seatName,
            ticketId: ticket.ticketId
          });
        });
        data.tripData.stops.forEach((stop) => {
          stop.beginnings = stops.beginnings[stop.name];
          stop.endings = stops.endings[stop.name];
          stop.departureDate = new Date(departureDate.getTime());
          stop.hasOps = (stop.beginnings && stop.beginnings.length > 0) || (stop.endings && stop.endings.length > 0);
          departureDate.setTime(departureDate.getTime() + (stop.travelMinutes + stop.waitingMinutes) * 60 * 1000);
        });
        return data;
      })
      .then(data => {
        this.set('section', 'detail');
        this.set('tripDetail', data);
      });
    }
  }
});
