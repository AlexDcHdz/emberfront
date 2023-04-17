import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Route.extend({
	queryParams: {
		departureDate: {
			refreshModel: true
		},
		returningDate: {
			refreshModel: true
		},
		origin: {
			refreshModel: true
		},
		destination: {
			refreshModel: true
		},
		roundTrip: {
			refreshModel: true
		},
		adultCount: {
			refreshModel: true
		},
		childrenCount: {
			refreshModel: true
		},
		infantCount: {
			refreshModel: true
		},
		olderAdultCount: {
			refreshModel: true
		}
	},
	model(params) {
		if(params.departureDate) {
			params.departureDate = new Date(params.departureDate);
		}
		if(params.returningDate) {
			params.returningDate = new Date(params.returningDate);
		}
		if(!params.olderAdultCount) {
			params.olderAdultCount = 0;
		}
		if(!params.infantCount) {
			params.infantCount = 0;
		}
		if(!params.childrenCount) {
			params.childrenCount = 0;
		}
		if(!params.adultCount) {
			params.adultCount = 0;
		}
    params.timeZone = 'America/Mexico_City';
		return DS.PromiseObject.create({
			promise: jQuery.ajax({
				url: ENV.apiURL + '/search/trip',
				data: JSON.stringify(params),
				contentType: 'application/json; charset=utf-8',
				method: 'POST'
			}).then((data) => {
        let currentTime = moment();
        let startTime = moment(params.departureDate).startOf('day');
        let endTime = moment(params.departureDate).endOf('day');
        let returnStartTime = moment(params.returningDate).startOf('day');
        let returnEndTime = moment(params.returningDate).endOf('day');
        data.departureQuotes = data.departureQuotes.filter((current) => {
          let currentDate = moment(current.departingDate);
          return currentTime.isSameOrBefore(currentDate)
            && startTime.isSameOrBefore(currentDate)
            && currentDate.isSameOrBefore(endTime)
            && !['1060SEC', '6010SEC'].contains(current.route.name);
        });
        data.departureQuotes.sort((a, b) => {
          return new Date(a.departingDate) - new Date(b.departingDate);
        });
        data.returnQuotes = data.returnQuotes.filter((current) => {
          let currentDate = moment(current.departingDate);
          return returnStartTime.isSameOrBefore(currentDate) && currentDate.isSameOrBefore(returnEndTime);
        });
        data.returnQuotes.sort((a, b) => {
          return new Date(a.departingDate) - new Date(b.departingDate);
        });
        return data;
      })
		});
	}
});
