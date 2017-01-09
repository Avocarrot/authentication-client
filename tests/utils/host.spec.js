const test = require('tape');
const Host = require('../../src/utils/host');

/**
 * Client.constructor(options)
 */

test('Host.constructor(options) should throw an error for', (t) => {

  t.test('missing `login_url` configuration', (assert) => {
    assert.plan(1);
    try {
      new Host('endpoint', null)
    } catch (err) {
      assert.equals(err.message, 'Missing `login_url`');
    }
  });

  t.test('missing `endpoint` configuration', (assert) => {
    assert.plan(1);
    try {
      new Host(null, 'login_url')
    } catch (err) {
      assert.equals(err.message, 'Missing `endpoint`');
    }
  });

});

/**
 * Host get()
 */

test('Client.id should return correct `endpoint` and `login_url` values', (assert) => {
  assert.plan(2);
  var host = new Host('endpoint', 'login_url');
  assert.equals(host.endpoint, 'endpoint');
  assert.equals(host.login_url, 'login_url');
});
