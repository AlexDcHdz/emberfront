import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default Ember.Component.extend({
	search: Ember.Object.create({
		origin: {},
		destination: {},
    departureDate: new Date()
  }),
  showPeople: true,
  currentDate: moment().subtract(1, 'days').toDate(),
  defaultOrigin: '',
	init() {
		this._super();
		this.lookupDestinations = this.lookupDestinations.bind(this);
    if(this.get('defaultOriginal')) {
      this.set('search.origin', {
        value: this.get('defaultOrigin')
      });
    }
	},
  reset() {
    this.set('search.destination', {});
    this.set('search.departureDate', new Date());
    this.set('search.origin', {
      value: this.get('defaultOrigin')
    });
  },
  didInsertElement() {
    this.set('searchButton', Ladda.create(this.$().find('button').get(0)));
    this.set('register-as', this);
  },
	lookupBeginnings(text) {
		var beginningSuggestionsUrl = ENV.apiURL + '/search/beginning';
		return jQuery.get(beginningSuggestionsUrl, {s: text});
	},
	lookupDestinations(text) {
		var destinationSuggestionsUrl = ENV.apiURL + '/search/destination';
		return jQuery.get(destinationSuggestionsUrl, {
			o: this.get('search').origin.value,
			s: text
		});
	},
	actions: {
    setInitialBeginningOpts() {
      if (!this.get('options')) {
        var destinationSuggestionsUrl = ENV.apiURL + '/search/beginning';
        var data = DS.PromiseArray.create({
          promise: jQuery.get(destinationSuggestionsUrl, {
            s: ''
          })
        });
        this.set('beginningOptions', data);
      }
    },
    setDestinationOpts() {
      var destinationSuggestionsUrl = ENV.apiURL + '/search/destination';
      var data = DS.PromiseArray.create({
        promise: jQuery.get(destinationSuggestionsUrl, {
          o: this.get('search').origin.value,
          s: ''
        })
      });
      this.set('destinationOptions', data);
    },
    searchBeginningDestinations(text) {
      var destinationSuggestionsUrl = ENV.apiURL + '/search/beginning';
      return DS.PromiseArray.create({
        promise: jQuery.get(destinationSuggestionsUrl, {
          s: text
        })
      });
    },
    searchEndingDestinations(text) {
      var destinationSuggestionsUrl = ENV.apiURL + '/search/destination';
      return DS.PromiseArray.create({
        promise: jQuery.get(destinationSuggestionsUrl, {
          o: this.get('search').origin.value,
          s: text
        })
      });
    },
		searchTrip() {
      this.get('searchButton').start();
			var search = Ember.merge({}, this.get('search'));

			search.origin = search.origin.value;
			search.destination = search.destination.value;
			search.departureDate = search.departureDate && search.departureDate.toISOString();
			search.returningDate = search.returningDate && search.returningDate.toISOString();
      search.searchButton = this.get('searchButton');


			this.sendAction('searchAction', search);
		}
  }
});
