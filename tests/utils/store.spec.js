'use strict'
const test = require('tape');
const sinon = require('sinon');
const LocalStorage = require('store');
const Store = require('../../src/utils/store');

const store = new Store('namespace');
var sandbox = sinon.sandbox.create();

/**
 * Store.constructor(options)
 */

test('Store.constructor(options) should throw an error for missing `namespace`', (assert) => {
  assert.plan(1);
  try {
    new Store()
  } catch (err) {
    assert.equals(err.message, 'Missing `namespace`');
  }
});

/**
 * Store.set(key, value)
 */

test('Store.set(key, value) should call LocalStorage.set(key, value) with normalized key', (assert) => {
  assert.plan(1);
  let setSpy = sandbox.spy(LocalStorage, 'set');
  store.set('key', 'value');
  assert.deepEquals(setSpy.getCall(0).args, ['namespace_key', 'value']);
  sandbox.restore();
});

/**
 * Store.get(key)
 */

test('Store.get(key) should call LocalStorage.get(key) with normalized key', (assert) => {
  assert.plan(1);
  let getSpy = sandbox.spy(LocalStorage, 'get');
  store.get('key');
  assert.deepEquals(getSpy.getCall(0).args, ['namespace_key']);
  sandbox.restore();
});

/**
 * Store.remove(key)
 */

test('Store.remove(key) should call LocalStorage.remove(key) with normalized key', (assert) => {
  assert.plan(1);
  let removeSpy = sandbox.spy(LocalStorage, 'remove');
  store.remove('key');
  assert.deepEquals(removeSpy.getCall(0).args, ['namespace_key']);
  sandbox.restore();
});
