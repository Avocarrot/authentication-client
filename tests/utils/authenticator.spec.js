const test = require('tape');
const Authenticator = require('../../src/utils/authenticator');
const Store = require('store');
const Client = require('../../src/utils/client');
const Host = require('../../src/utils/host');

// Mocks

const client = new Client("id", "secret");
const host = new Host("endpoint", "login_url");

/**
 * Authenticator.constructor(options)
 */

test('Authenticator.constructor(options) should throw an error for', (t) => {

  t.test('missing `store` configuration', (assert) => {
    assert.plan(1);
    try {
      new Authenticator(null, Object(), Object());
    } catch (err) {
      assert.equals(err.message, 'Missing `store` configuration for Authenticator');
    }
  });

  t.test('missing `host` configuration', (assert) => {
    assert.plan(1);
    try {
      new Authenticator(Object(), Object(), null);
    } catch (err) {
      assert.equals(err.message, 'Missing `host` configuration for Authenticator');
    }
  });

  t.test('missing `client` configuration', (assert) => {
    assert.plan(1);
    try {
      new Authenticator(Object(), null, Object());
    } catch (err) {
      assert.equals(err.message, 'Missing `client` configuration for Authenticator');
    }
  });

});

test('Authenticator.constructor(options) should store valid options', (assert) => {
  assert.plan(3);
  var authenticator = new Authenticator(Store, client, host);
  assert.deepEquals(authenticator.host, host);
  assert.deepEquals(authenticator.client, client);
  assert.deepEquals(authenticator.store, Store);
});

/**
 * Authenticator.invalidate(username, password)
 */

test('Authenticator.invalidate(username, password) should throw an error for', (t) => {

  var authenticator = new Authenticator(Store, client, host);

  t.test('missing `username`', (assert) => {
    assert.plan(1);
    try {
      authenticator.authenticate(null, 'password');
    } catch (err) {
      assert.equals(err.message, 'Missing `username`');
    }
  });

  t.test('missing `password`', (assert) => {
    assert.plan(1);
    try {
      authenticator.authenticate('username', null);
    } catch (err) {
      assert.equals(err.message, 'Missing `password`');
    }
  });

});
