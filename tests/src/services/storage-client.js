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

test('StorageClient.onConnect() should generate storage instance', (assert) => {
  assert.plan(1);
  const instances = mockCrossStore(sandbox);
  const storageClient = new StorageClient('https://login.domain.com/hub', instances.Client);
  storageClient.onConnect().then(() => {
    assert.equals(instances.ClientConncectStub.callCount, 1);
  });
});
