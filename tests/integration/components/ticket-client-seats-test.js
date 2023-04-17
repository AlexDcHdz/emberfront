import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ticket-client-seats', 'Integration | Component | ticket client seats', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{ticket-client-seats}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#ticket-client-seats}}
      template block text
    {{/ticket-client-seats}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
