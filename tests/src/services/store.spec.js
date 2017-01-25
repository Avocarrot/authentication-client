const test = require('tape');
const sinon = require('sinon');
const Cookies = require('js-cookie');
const Store = require('../../../src/services/store');

const store = new Store('namespace');
const sandbox = sinon.sandbox.create();

/**
 * Store.constructor(options)
 */

test('Store.constructor(options) should throw an error for missing `namespace`', (assert) => {
  assert.plan(1);
  try {
    new Store();
  } catch (err) {
    assert.equals(err.message, 'Missing `namespace`');
  }
});

/**
 * Store.set(key, value)
 */

test('Store.set(key, value) should call Cookies.set(key, value) with normalized key', (assert) => {
  assert.plan(1);
  const setSpy = sandbox.spy(Cookies, 'set');
  store.set('key', 'value');
  assert.deepEquals(setSpy.getCall(0).args, ['namespace_key', 'value']);
  sandbox.restore();
});

/**
 * Store.get(key)
 */

test('Store.get(key) should call Cookies.get(key) with normalized key', (assert) => {
  assert.plan(1);
  const getSpy = sandbox.spy(Cookies, 'get');
  store.get('key');
  assert.deepEquals(getSpy.getCall(0).args, ['namespace_key']);
  sandbox.restore();
});

/**
 * Store.remove(key)
 */

test('Store.remove(key) should call Cookies.remove(key) with normalized key', (assert) => {
  assert.plan(1);
  const removeSpy = sandbox.spy(Cookies, 'remove');
  store.remove('key');
  assert.deepEquals(removeSpy.getCall(0).args, ['namespace_key']);
  sandbox.restore();
});
