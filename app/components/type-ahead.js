import Em from 'ember';
var substringMatcher = function(container, key) {
  return function findMatches(q, cb, acb) {
		var fn = container.get('content');

		fn(q).then(function (data) {
			acb(data.map((it) => {
				var obj = {obj: it};
				obj[key] = it[key];
				return obj;
			}));
		});

    cb([]);
  };
};

export default Em.TextField.extend({
	content: null,
  highlight: false,
  hint: true,
  minLength: 0,
  autofocus: true,
  _typeahead: null,
  selection: null,

  focusOut: function(){
    this.sendAction('targetAction', "focus-out");
  },

  focusIn: function(){
    this.sendAction('targetAction', "focus-in");
  },

  keyUp: function(){
    this.sendAction('targetAction', "key-up");
  },

  keyDown: function(){
    this.sendAction('targetAction', "key-down");
  },

  /* Can add more event catchers here */

  didInsertElement: function() {
    this._super();
    this.initializeTypeahead();
    if (this.get('autofocus') === true) {
      this.$().focus();
    }
  },
  initializeTypeahead: function() {
    var that=this, t=null,
        options = {
          highlight: this.get('highlight'),
          hint: this.get('hint'),
          minLength: this.get('minLength')
        },
        dataset = this.get('dataset');
    t = this.$().typeahead(options, dataset);
    this.set('_typeahead', t);

    // Set selected object
    t.on('typeahead:selected', function(event, item) {
      Em.debug("Setting suggestion");
      that.set('selection', item.obj);
    });

    t.on('typeahead:autocompleted', function(event, item) {
      Em.debug("Setting suggestion");
      that.set('selection', item.obj);
    });
  },
  dataset: function() {
    return this.loadDataset(this);
  }.property(),
  loadDataset: function(content) {
    var name = this.get('name') || 'default',
        key = this.get('displayKey') || 'value';
    return {
      name: name,
      displayKey: key,
      source: substringMatcher(content, key),
			limit: 100
    };
  },
  clearDataset: function() {
    if (Em.isBlank(this.get('selection'))) {
      this.$().val('');
    }
  }.observes('selection')
});
