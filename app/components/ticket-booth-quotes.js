import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		selectQuote(quote) {
			this.sendAction('selectQuoteAction', quote);
		}
  }
});
