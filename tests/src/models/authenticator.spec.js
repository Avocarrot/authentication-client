const test = require('tape');
const sinon = require('sinon');
const Authenticator = require('../../../src/models/authenticator');
const Store = require('../../../src/services/store');
const Client = require('../../../src/models/client');
const Consumer = require('../../../src/services/consumer');
const API = require('../../../src/api').Sandbox;
const mockCrossStore = require('../../mocks/store');

const sandbox = sinon.sandbox.create();

/**
 * Instances
 */
function getAuthenticatorInstances(...rest) {
  const crossStoreInstances = mockCrossStore(...rest);
  const store = new Store('domain', 'https://login.domain.com/hub', crossStoreInstances.Client);
  const api = new API('http://auth.mock.com');
  const client = new Client('id', 'secret');
  const consumer = new Consumer(client, api);
  const authenticator = new Authenticator(consumer);
  return {
    client,
    store,
    consumer,
    authenticator,
  };
}

/**
 * Authenticator.constructor(options)
 */

test('Authenticator.constructor(options) should throw an error for', (t) => {
  t.test('missing `consumer` configuration', (assert) => {
    assert.plan(1);
    try {
      new Authenticator();
    } catch (err) {
      assert.equals(err.message, '`consumer` should be instance of Consumer');
    }
  });
});

/**
 * Authenticator.user
 */

test('Authenticator.user should return User instance', (assert) => {
  assert.plan(1);
  const instances = getAuthenticatorInstances(sandbox);
  assert.deepEquals(instances.authenticator.user, instances.user);
});

/**
 * Authenticator.requestPasswordReset(email)
 */

test('Authenticator.requestPasswordReset(email) should', (t) => {
  t.test('throw error for missing `email`', (assert) => {
    assert.plan(1);
    const instances = getAuthenticatorInstances(sandbox);
    try {
      instances.authenticator.requestPasswordReset();
    } catch (err) {
      assert.equals(err.message, 'Missing `email`');
    }
  });

  t.test('resolve on success', (assert) => {
    assert.plan(2);
    const instances = getAuthenticatorInstances(sandbox);
    sandbox.stub(instances.consumer, 'requestPasswordReset', () => Promise.resolve());
    instances.authenticator.requestPasswordReset('john.doe@mail.com').then((res) => {
      assert.ok('requestPasswordReset() resolved');
      assert.equals(res.message, 'A reset link has been sent to your email');
    });
    sandbox.restore();
  });
});

/**
 * Authenticator.resetPassword(token, password)
 */

test('Authenticator.resetPassword(token, password) should', (t) => {
  t.test('throw error for missing `token`', (assert) => {
    assert.plan(1);
    const instances = getAuthenticatorInstances(sandbox);
    try {
      instances.authenticator.resetPassword(null, 'password');
    } catch (err) {
      assert.equals(err.message, 'Missing `token`');
    }
  });

  t.test('throw error for missing `password`', (assert) => {
    assert.plan(1);
    const instances = getAuthenticatorInstances(sandbox);
    try {
      instances.authenticator.resetPassword('token', null);
    } catch (err) {
      assert.equals(err.message, 'Missing `password`');
    }
  });

  t.test('reject for invalid password', (assert) => {
    assert.plan(1);
    const instances = getAuthenticatorInstances(sandbox);
    sandbox.stub(instances.consumer, 'resetPassword', () => Promise.resolve());
    instances.authenticator.resetPassword('token', 'password').catch((err) => {
      assert.equals(err.message, 'Password must contain both numbers and characters');
    });
    sandbox.restore();
  });

  t.test('resolve on success', (assert) => {
    assert.plan(2);
    const instances = getAuthenticatorInstances(sandbox);
    sandbox.stub(instances.consumer, 'resetPassword', () => Promise.resolve());
    instances.authenticator.resetPassword('token', 'password123456').then((res) => {
      assert.ok('resetPassword() resolved');
      assert.equals(res.message, 'Your password has been reset');
    });
    sandbox.restore();
  });
});
