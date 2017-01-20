const test = require('tape');
const AuthenticationClient = require('../../src/index');
const SandboxAPI = require('../../src/api').Sandbox;

/**
 * AuthenticationClient.getInstanceFor(client_id, client_secret)
 */

test('AuthenticationClient.getInstanceFor(client_id, client_secret, environment) should ', (t) => {
  t.test('return new instance for different pair of client_id and client_secret', (assert) => {
    assert.plan(1);
    const instance1 = AuthenticationClient.getInstanceFor('<id>', '<secret>');
    const instance2 = AuthenticationClient.getInstanceFor('<new_id>', '<new_secret>');
    assert.notSame(instance1, instance2);
    AuthenticationClient.reset();
  });
  t.test('return the cached instance for same pair of client_id and client_secret', (assert) => {
    assert.plan(1);
    const instance1 = AuthenticationClient.getInstanceFor('<id>', '<secret>');
    const instance2 = AuthenticationClient.getInstanceFor('<id>', '<secret>');
    assert.same(instance1, instance2);
    AuthenticationClient.reset();
  });
  t.test('accepts Sandbox environment', (assert) => {
    assert.plan(1);
    const instance = AuthenticationClient.getInstanceFor('<id>', '<secret>', AuthenticationClient.Environment.Sandbox);
    assert.equals(instance._consumer._api instanceof SandboxAPI, true);
    AuthenticationClient.reset();
  });
  t.test('rejects invalid environment setup', (assert) => {
    assert.plan(1);
    try {
      AuthenticationClient.getInstanceFor('<id>', '<secret>', 1);
    } catch (err) {
      assert.equals(err.message, 'Invalid `environment` passed');
    }
    AuthenticationClient.reset();
  });
});
