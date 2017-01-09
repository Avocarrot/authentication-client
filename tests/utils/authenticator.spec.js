const test = require('tape');
const Authenticator = require('../../src/utils/authenticator');

/**
 * Authenticator.constructor(options)
 */

test('Authenticator.constructor(options) should show error message for missing store configuration', (assert) => {
  assert.plan(1);
  try {
    new Authenticator({
      host: "host",
      login_page_endpoint: "login_page_endpoint"
    });
  } catch (err) {
    assert.equals(err.message, 'Missing store configuration for Authenticator');
  }
});

test('Authenticator.constructor(options) should show error message for missing host configuration', (assert) => {
  assert.plan(1);
  try {
    new Authenticator({
      store: Object(),
      login_page_endpoint: "login_page_endpoint"
    });
  } catch (err) {
    assert.equals(err.message, 'Missing host configuration for Authenticator');
  }
});

test('Authenticator.constructor(options) should show error message for missing login page endpoint configuration', (assert) => {
  assert.plan(1);
  try {
    new Authenticator({
      store: Object(),
      host: "host"
    });
  } catch (err) {
    assert.equals(err.message, 'Missing login page endpoint configuration for Authenticator');
  }
});

test('Authenticator.constructor(options) should store valid options', (assert) => {
  assert.plan(3);
  var store = Object();
  var authenticator = new Authenticator({
    store: store,
    host: "host",
    login_page_endpoint: "login_page_endpoint"
  });
  assert.equals(authenticator.host, "host");
  assert.equals(authenticator.login_page_endpoint, "login_page_endpoint");
  assert.equals(authenticator.store, store);
});
