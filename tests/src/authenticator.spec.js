const test = require('tape');
const sinon = require('sinon');
const Authenticator = require('../../src/authenticator');
const Store = require('../../src/services/store');
const User = require('../../src/models/user');
const Client = require('../../src/models/client');
const Consumer = require('../../src/services/consumer');
const API = require('../../src/api').Sandbox;

const sandbox = sinon.sandbox.create();

/**
 * Instances
 */
function getAuthenticatorInstances(redirectFn) {
  const store = new Store('namespace');
  const api = new API('http://auth.mock.com');
  const client = new Client('id', 'secret');
  const consumer = new Consumer(client, api);
  const user = new User(store, consumer);
  const authenticator = new Authenticator(user, consumer, 'http://login.mock.com', redirectFn);
  return {
    client,
    store,
    user,
    consumer,
    authenticator,
  };
}

/**
 * Authenticator.constructor(options)
 */

test('Authenticator.constructor(options) should throw an error for', (t) => {
  t.test('missing `store` configuration', (assert) => {
    assert.plan(1);
    const instances = getAuthenticatorInstances();
    try {
      new Authenticator(Object(), instances.consumer, 'http://login.mock.com');
    } catch (err) {
      assert.equals(err.message, '`user` should be instance of User');
    }
  });

  t.test('missing `loginHost` configuration', (assert) => {
    assert.plan(1);
    const instances = getAuthenticatorInstances();
    try {
      new Authenticator(instances.user, instances.consumer);
    } catch (err) {
      assert.equals(err.message, '`loginHost` not defined');
    }
  });

  t.test('missing `consumer` configuration', (assert) => {
    assert.plan(1);
    const instances = getAuthenticatorInstances();
    try {
      new Authenticator(instances.user, Object(), 'http://login.mock.com');
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
  const instances = getAuthenticatorInstances();
  assert.deepEquals(instances.authenticator.user, instances.user);
});

/**
 * Authenticator.requestPasswordReset(email)
 */

test('Authenticator.requestPasswordReset(email) should', (t) => {
  t.test('throw error for missing `email`', (assert) => {
    assert.plan(1);
    const instances = getAuthenticatorInstances();
    try {
      instances.authenticator.requestPasswordReset();
    } catch (err) {
      assert.equals(err.message, 'Missing `email`');
    }
  });

  t.test('resolve on success', (assert) => {
    assert.plan(1);
    const instances = getAuthenticatorInstances();
    sandbox.stub(instances.consumer, 'requestPasswordReset', () => Promise.resolve());
    instances.authenticator.requestPasswordReset('john.doe@mail.com').then(() => {
      assert.ok('requestPasswordReset() resolved');
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
    const instances = getAuthenticatorInstances();
    try {
      instances.authenticator.resetPassword(null, 'password');
    } catch (err) {
      assert.equals(err.message, 'Missing `token`');
    }
  });

  t.test('throw error for missing `password`', (assert) => {
    assert.plan(1);
    const instances = getAuthenticatorInstances();
    try {
      instances.authenticator.resetPassword('token', null);
    } catch (err) {
      assert.equals(err.message, 'Missing `password`');
    }
  });

  t.test('reject for invalid password', (assert) => {
    assert.plan(1);
    const instances = getAuthenticatorInstances();
    sandbox.stub(instances.consumer, 'resetPassword', () => Promise.resolve());
    instances.authenticator.resetPassword('token', 'password').catch((err) => {
      assert.equals(err.message, 'Password must contain both numbers and characters');
    });
    sandbox.restore();
  });

  t.test('resolve on success', (assert) => {
    assert.plan(1);
    const instances = getAuthenticatorInstances();
    sandbox.stub(instances.consumer, 'resetPassword', () => Promise.resolve());
    instances.authenticator.resetPassword('token', 'password123456').then(() => {
      assert.ok('resetPassword() resolved');
    });
    sandbox.restore();
  });
});

/**
 * Authenticator.redirect(resource, next)
 */
test('Authenticator.redirect(resource, successUrl) should redirect to encoded url', (assert) => {
  assert.plan(1);
  const URLRedirectStub = sandbox.stub();
  const instances = getAuthenticatorInstances(URLRedirectStub);
  instances.authenticator.redirect('login', 'http://apps.mock.com?id=1');
  assert.deepEquals(URLRedirectStub.getCall(0).args, ['http://login.mock.com/login?redirectUrl=http%3A%2F%2Fapps.mock.com%3Fid%3D1']);
  sandbox.restore();
});
