const test = require('tape');
const sinon = require('sinon');
const Store = require('../../../src/services/store');
const mockCrossStore = require('../../mocks/store');

const sandbox = sinon.sandbox.create();

/**
 * Store.constructor(options)
 */

test('Store.constructor(options) ', (t) => {
  t.test('should throw an error for missing `domain`', (assert) => {
    assert.plan(1);
    try {
      new Store();
    } catch (err) {
      assert.equals(err.message, 'Missing `domain`');
    }
  });
  t.test('should throw an error for missing `iframeHub`', (assert) => {
    assert.plan(1);
    try {
      new Store('domain');
    } catch (err) {
      assert.equals(err.message, 'Missing `iframeHub`');
    }
  });
});

/**
 * Store.set(key, value)
 */

test('Store.set(key, value) should call CrossStorage.set(key, value) with normalized key', (assert) => {
  assert.plan(2);
  const instances = mockCrossStore(sandbox);
  const store = new Store('domain', 'https://login.domain.com/hub', instances.Client);
  store.set('key', 'value').then(() => {
    assert.equals(instances.ClientSetStub.callCount, 1);
    assert.deepEquals(instances.ClientSetStub.getCall(0).args, ['domain_key', 'value']);
  });
  sandbox.restore();
});

/**
 * Store.get(key)
 */

test('Store.get(key) should call CrossStorage.set(key) with normalized key', (assert) => {
  assert.plan(2);
  const instances = mockCrossStore(sandbox);
  const store = new Store('domain', 'https://login.domain.com/hub', instances.Client);
  store.get('key').then(() => {
    assert.equals(instances.ClientGetStub.callCount, 1);
    assert.deepEquals(instances.ClientGetStub.getCall(0).args, ['domain_key']);
  });
  sandbox.restore();
});

/**
 * Store.remove(key)
 */

test('Store.remove(key) should call CrossStorage.del(key) with normalized key', (assert) => {
  assert.plan(2);
  const instances = mockCrossStore(sandbox);
  const store = new Store('domain', 'https://login.domain.com/hub', instances.Client);
  store.remove('key').then(() => {
    assert.equals(instances.ClientDelStub.callCount, 1);
    assert.deepEquals(instances.ClientDelStub.getCall(0).args, ['domain_key']);
  });
  sandbox.restore();
});
