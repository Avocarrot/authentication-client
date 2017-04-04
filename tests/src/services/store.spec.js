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

test('Store.set(key, value) should call StorageClient.set(key, value) with normalized key', (assert) => {
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

test('Store.get(key) should call StorageClient.set(key) with normalized key', (assert) => {
  assert.plan(2);
  const instances = mockCrossStore(sandbox);
  const store = new Store('domain', 'https://login.domain.com/hub', instances.Client);
  store.get('key', 'value').then(() => {
    assert.equals(instances.ClientGetStub.callCount, 1);
    assert.deepEquals(instances.ClientGetStub.getCall(0).args, ['domain_key']);
  });
  sandbox.restore();
});

/**
 * Store.remove(key)
 */

test('Store.remove(key) should call StorageClient.del(key) with normalized key', (assert) => {
  assert.plan(2);
  const instances = mockCrossStore(sandbox);
  const store = new Store('domain', 'https://login.domain.com/hub', instances.Client);
  store.remove('key1', 'key2').then(() => {
    assert.equals(instances.ClientDelStub.callCount, 1);
    assert.deepEquals(instances.ClientDelStub.getCall(0).args, ['domain_key1', 'domain_key2']);
  });
  sandbox.restore();
});

/**
 * Store.retrieveToken()
 */

test('Store.retriveToken() should return extracted URL login token from URL if store does not support cross storage', (assert) => {
  assert.plan(1);
  const instances = mockCrossStore(sandbox);
  const store = new Store('domain', 'https://login.domain.com/hub', instances.Client, false, () => 'http://mock.app?loginToken=123456789');
  store.retriveToken().then((token) => {
    assert.equals(token, '123456789');
  });
  sandbox.restore();
});
