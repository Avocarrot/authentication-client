const test = require('tape');
const Client = require('../../src/utils/client');

/**
 * Client.constructor(options)
 */

test('Client.constructor(options) should throw an error for', (t) => {

  t.test('missing `id`', (assert) => {
    assert.plan(1);
    try {
      new Client(null, "secret")
    } catch (err) {
      assert.equals(err.message, 'Missing `id`');
    }
  });

  t.test('missing `secret`', (assert) => {
    assert.plan(1);
    try {
      new Client("id", null)
    } catch (err) {
      assert.equals(err.message, 'Missing `secret`');
    }
  });

});

/**
 * Client get()
 */

test('Client.id should return correct `id` and `secret` values', (assert) => {
  assert.plan(2);
  var client = new Client("id", "secret");
  assert.equals(client.id, "id");
  assert.equals(client.secret, "secret");
});
