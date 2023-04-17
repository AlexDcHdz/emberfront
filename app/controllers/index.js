import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
	register: {},
  init() {
    this._super();
    Ember.run.schedule('afterRender', this, function () {
      this.send('startRevolution');
    });
  },
  actions: {
    startRevolution() {
      jQuery('.revolution-slider').revolution({
        dottedOverlay: 'none',
        delay: 8000,
        startwidth: 1170,
        startheight: 646,
        onHoverStop: 'on',
        hideThumbs: 10,
        fullWidth: 'on',
        navigationType: 'none',
        shadow: 0,
        spinner: 'spinner4',
        hideTimeBar: 'on'
      });
    },
		searchTrip(search) {
      search.searchButton.stop();
      delete search.searchButton;
			this.transitionToRoute('searchResults', {queryParams: search});
    }
  }
});
