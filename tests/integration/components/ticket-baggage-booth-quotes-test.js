import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ticket-baggage-booth-quotes', 'Integration | Component | ticket baggage booth quotes', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{ticket-baggage-booth-quotes}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#ticket-baggage-booth-quotes}}
      template block text
    {{/ticket-baggage-booth-quotes}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
