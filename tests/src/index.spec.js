const test = require('tape');
const sinon = require('sinon');
const AuthenticationClient = require('../../src/index');
const Store = require('../../src/services/store');
const SandboxAPI = require('../../src/api').Sandbox;
const mockCrossStore = require('../mocks/store');
const CrossStorageHub = require('cross-storage').CrossStorageHub;

const sandbox = sinon.sandbox.create();

/**
 * Instances
 */
function generateStoreInstance(...rest) {
  const crossStoreInstances = mockCrossStore(...rest);
  return new Store('domain', 'https://login.domain.com/hub', crossStoreInstances.Client);
}

/**
 * AuthenticationClient.getInstanceFor(client_id, client_secret)
 */
test('AuthenticationClient.getInstanceFor(client_id, client_secret, environment) should ', (t) => {
  t.test('return new instance for different pair of client_id and client_secret', (assert) => {
    assert.plan(1);
    const instance1 = AuthenticationClient.getInstanceFor({
      clientId: '1234',
      clientSecret: '5678',
      store: generateStoreInstance(sandbox),
    });
    const instance2 = AuthenticationClient.getInstanceFor({
      clientId: '12345',
      clientSecret: '6789',
      store: generateStoreInstance(sandbox),
    });
    assert.notSame(instance1, instance2);
    AuthenticationClient.reset();
    sandbox.restore();
  });

  t.test('return the cached instance for same pair of client_id and client_secret', (assert) => {
    assert.plan(1);
    const instance1 = AuthenticationClient.getInstanceFor({
      clientId: '1234',
      clientSecret: '5678',
      store: generateStoreInstance(sandbox),
    });
    const instance2 = AuthenticationClient.getInstanceFor({
      clientId: '1234',
      clientSecret: '5678',
      store: generateStoreInstance(sandbox),
    });
    assert.same(instance1, instance2);
    AuthenticationClient.reset();
    sandbox.restore();
  });

  t.test('accepts Sandbox environment setup', (assert) => {
    assert.plan(1);
    const instance = AuthenticationClient.getInstanceFor({
      clientId: '1234',
      clientSecret: '5678',
      environment: AuthenticationClient.Environment.Sandbox,
      store: generateStoreInstance(sandbox),
    });
    assert.equals(instance.authenticator._consumer._api instanceof SandboxAPI, true);
    AuthenticationClient.reset();
    sandbox.restore();
  });

  t.test('rejects invalid environment setup', (assert) => {
    assert.plan(1);
    try {
      AuthenticationClient.getInstanceFor({
        clientId: '1234',
        clientSecret: '5678',
        environment: 'Sandbox',
        store: generateStoreInstance(sandbox),
      });
    } catch (err) {
      assert.equals(err.message, 'Invalid `environment` passed');
    }
    AuthenticationClient.reset();
    sandbox.restore();
  });
});

/**
 * AuthenticationClient.initStorage(options)
 */

test('AuthenticationClient.initStorage(options) should initialise CrossStorageHub', (assert) => {
  assert.plan(2);
  const initStorageStub = sandbox.stub(CrossStorageHub, 'init', () => {});
  AuthenticationClient.initStorage([{
    origin: /.*subdomain.domain.com\d$/,
    allow: ['get', 'set', 'del'],
  }]);
  assert.equals(initStorageStub.callCount, 1);
  assert.deepEquals(initStorageStub.getCall(0).args[0], [{
    origin: /.*subdomain.domain.com\d$/,
    allow: ['get', 'set', 'del'],
  }]);
  sandbox.restore();
});
