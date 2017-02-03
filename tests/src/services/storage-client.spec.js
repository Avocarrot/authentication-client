const test = require('tape');
const sinon = require('sinon');
const StorageClient = require('../../../src/services/storage-client');
const mockCrossStore = require('../../mocks/store');

const sandbox = sinon.sandbox.create();

/**
 * StorageClient.constructor()
 */

test('StorageClient.constructor() should throw an error for missing `iframeHub`', (assert) => {
  assert.plan(1);
  try {
    new StorageClient();
  } catch (err) {
    assert.equals(err.message, 'Missing `iframeHub`');
  }
});

/**
 * StorageClient.onConnect()
 */

test('StorageClient.onConnect() should generate storage instance once', (assert) => {
  assert.plan(3);
  const instances = mockCrossStore(sandbox);
  const storageClient = new StorageClient('https://login.domain.com/hub', instances.Client);
  assert.equals(storageClient._instance, undefined);
  storageClient.onConnect().then(() => storageClient.onConnect()).then(() => {
    assert.notEquals(storageClient._instance, null);
    assert.equals(instances.ClientConnectStub.callCount, 2);
  });
});

/**
 * StorageClient.get()
 */

test('StorageClient.get() should proxy CrossStorageClient.get()', (assert) => {
  assert.plan(3);
  const instances = mockCrossStore(sandbox);
  const storageClient = new StorageClient('https://login.domain.com/hub', instances.Client);
  storageClient.get('key').then(() => {
    assert.equals(instances.ClientConnectStub.callCount, 1);
    assert.equals(instances.ClientGetStub.callCount, 1);
    assert.deepEquals(instances.ClientGetStub.getCall(0).args, ['key']);
  });
});

/**
 * StorageClient.set()
 */

test('StorageClient.set() should proxy CrossStorageClient.set()', (assert) => {
  assert.plan(3);
  const instances = mockCrossStore(sandbox);
  const storageClient = new StorageClient('https://login.domain.com/hub', instances.Client);
  storageClient.set('key', 'value').then(() => {
    assert.equals(instances.ClientConnectStub.callCount, 1);
    assert.equals(instances.ClientSetStub.callCount, 1);
    assert.deepEquals(instances.ClientSetStub.getCall(0).args, ['key', 'value']);
  });
});

/**
 * StorageClient.del()
 */

test('StorageClient.del() should proxy CrossStorageClient.del()', (assert) => {
  assert.plan(3);
  const instances = mockCrossStore(sandbox);
  const storageClient = new StorageClient('https://login.domain.com/hub', instances.Client);
  storageClient.del('key').then(() => {
    assert.equals(instances.ClientConnectStub.callCount, 1);
    assert.equals(instances.ClientDelStub.callCount, 1);
    assert.deepEquals(instances.ClientDelStub.getCall(0).args, ['key']);
  });
});
