const test = require('tape');
const AuthenticationClient = require('../../src/index');
const SandboxAPI = require('../../src/api').Sandbox;

/**
 * AuthenticationClient.getInstanceFor(client_id, client_secret)
 */

test('AuthenticationClient.getInstanceFor(client_id, client_secret, environment) should ', (t) => {
  t.test('return new instance for different pair of client_id and client_secret', (assert) => {
    assert.plan(1);
    const instance1 = AuthenticationClient.getInstanceFor({
      clientId: '1234',
      clientSecret: '5678',
    });
    const instance2 = AuthenticationClient.getInstanceFor({
      clientId: '12345',
      clientSecret: '6789',
    });
    assert.notSame(instance1, instance2);
    AuthenticationClient.reset();
  });

  t.test('return the cached instance for same pair of client_id and client_secret', (assert) => {
    assert.plan(1);
    const instance1 = AuthenticationClient.getInstanceFor({
      clientId: '1234',
      clientSecret: '5678',
    });
    const instance2 = AuthenticationClient.getInstanceFor({
      clientId: '1234',
      clientSecret: '5678',
    });
    assert.same(instance1, instance2);
    AuthenticationClient.reset();
  });

  t.test('accepts loginHost configuration', (assert) => {
    assert.plan(1);
    const instance = AuthenticationClient.getInstanceFor({
      clientId: '1234',
      clientSecret: '5678',
      loginHost: 'http://login.mock.com',
    });
    assert.equals(instance._loginHost, 'http://login.mock.com');
    AuthenticationClient.reset();
  });

  t.test('accepts Sandbox configuration', (assert) => {
    assert.plan(1);
    const instance = AuthenticationClient.getInstanceFor({
      clientId: '1234',
      clientSecret: '5678',
      environment: AuthenticationClient.Environment.Sandbox,
    });
    assert.equals(instance._consumer._api instanceof SandboxAPI, true);
    AuthenticationClient.reset();
  });

  t.test('rejects invalid environment setup', (assert) => {
    assert.plan(1);
    try {
      AuthenticationClient.getInstanceFor({
        clientId: '1234',
        clientSecret: '5678',
        environment: 'Sandbox',
      });
    } catch (err) {
      assert.equals(err.message, 'Invalid `environment` passed');
    }
    AuthenticationClient.reset();
  });
});
