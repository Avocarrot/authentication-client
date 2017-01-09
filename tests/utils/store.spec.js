'use strict'
const test = require('tape');
const sinon = require('sinon');
const StoreJS = require('store');
const Store = require('../../src/utils/store');

const store = new Store('prefix');
var sandbox = sinon.sandbox.create();

/**
 * Store.constructor(options)
 */

test('Store.constructor(options) should throw an error for missing `prefix`', (assert) => {
  assert.plan(1);
  try {
    new Store()
  } catch (err) {
    assert.equals(err.message, 'Missing `prefix`');
  }
});

/**
 * Store.set(key, value)
 */

test('Store.set(key, value) should call StoreJS.set(key, value) with normalized key', (assert) => {
  assert.plan(1);
  let setSpy = sandbox.spy(StoreJS, "set");
  store.set('key', 'value');
  assert.deepEquals(setSpy.getCall(0).args, ['prefix_key', 'value']);
  sandbox.restore();
});

/**
 * Store.get(key)
 */

test('Store.get(key) should call StoreJS.get(key) with normalized key', (assert) => {
  assert.plan(1);
  let getSpy = sandbox.spy(StoreJS, 'get');
  store.get('key');
  assert.deepEquals(getSpy.getCall(0).args, ['prefix_key']);
  sandbox.restore();
});

/**
 * Store.remove(key)
 */

test('Store.remove(key) should call StoreJS.remove(key) with normalized key', (assert) => {
  assert.plan(1);
  let removeSpy = sandbox.spy(StoreJS, 'remove');
  store.remove('key');
  assert.deepEquals(removeSpy.getCall(0).args, ['prefix_key']);
  sandbox.restore();
});
