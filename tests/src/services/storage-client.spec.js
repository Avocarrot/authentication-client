const test = require('tape');
const sinon = require('sinon');
const HubStorageClient = require('../../../src/services/hub-storage-client');
const mockCrossStore = require('../../mocks/store');

const sandbox = sinon.sandbox.create();

/**
 * HubStorageClient.constructor()
 */

test('HubStorageClient.constructor() should throw an error for missing `iframeHub`', (assert) => {
  assert.plan(1);
  try {
    new HubStorageClient();
  } catch (err) {
    assert.equals(err.message, 'Missing `iframeHub`');
  }
});

/**
 * HubStorageClient.onConnect()
 */

test('HubStorageClient.onConnect() should generate storage instance once', (assert) => {
  assert.plan(3);
  const instances = mockCrossStore(sandbox);
  const hubStorageClient = new HubStorageClient('https://login.domain.com/hub', instances.Client);
  assert.equals(hubStorageClient._instance, undefined);
  hubStorageClient.onConnect().then(() => hubStorageClient.onConnect()).then(() => {
    assert.notEquals(hubStorageClient._instance, null);
    assert.equals(instances.ClientConnectStub.callCount, 2);
  });
});

/**
 * HubStorageClient.get()
 */

test('HubStorageClient.get() should proxy CrossStorageClient.get()', (assert) => {
  assert.plan(3);
  const instances = mockCrossStore(sandbox);
  const hubStorageClient = new HubStorageClient('https://login.domain.com/hub', instances.Client);
  hubStorageClient.get('key').then(() => {
    assert.equals(instances.ClientConnectStub.callCount, 1);
    assert.equals(instances.ClientGetStub.callCount, 1);
    assert.deepEquals(instances.ClientGetStub.getCall(0).args, ['key']);
  });
});

/**
 * HubStorageClient.set()
 */

test('HubStorageClient.set() should proxy CrossStorageClient.set()', (assert) => {
  assert.plan(3);
  const instances = mockCrossStore(sandbox);
  const hubStorageClient = new HubStorageClient('https://login.domain.com/hub', instances.Client);
  hubStorageClient.set('key', 'value').then(() => {
    assert.equals(instances.ClientConnectStub.callCount, 1);
    assert.equals(instances.ClientSetStub.callCount, 1);
    assert.deepEquals(instances.ClientSetStub.getCall(0).args, ['key', 'value']);
  });
});

/**
 * StorageClient.del()
 */

test('HubStorageClient.del() should proxy CrossStorageClient.del()', (assert) => {
  assert.plan(3);
  const instances = mockCrossStore(sandbox);
  const hubStorageClient = new HubStorageClient('https://login.domain.com/hub', instances.Client);
  hubStorageClient.del('key').then(() => {
    assert.equals(instances.ClientConnectStub.callCount, 1);
    assert.equals(instances.ClientDelStub.callCount, 1);
    assert.deepEquals(instances.ClientDelStub.getCall(0).args, ['key']);
  });
});
