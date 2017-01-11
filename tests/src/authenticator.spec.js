'use strict';
const test = require('tape');
const sinon = require('sinon');
const Authenticator = require('../../src/authenticator');
const Store = require('../../src/services/store');
const User = require('../../src/models/user');
const Client = require('../../src/models/client');
const Consumer = require('../../src/services/consumer');
const Promise = require('es6-promise').Promise;

var sandbox = sinon.sandbox.create();

/**
 * Instances
 */
function authenticatorInstances() {
  let store = new Store('namespace');
  let consumer = new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com');
  let user = new User(store, consumer);
  let authenticator = new Authenticator(user, consumer);
  return {
    store,
    user,
    consumer,
    authenticator
  }
}

/**
 * Authenticator.constructor(options)
 */

test('Authenticator.constructor(options) should throw an error for', (t) => {

  let instances = authenticatorInstances();

  t.test('missing `store` configuration', (assert) => {
    assert.plan(1);
    try {
      new Authenticator(Object(), instances.consumer);
    } catch (err) {
      assert.equals(err.message, 'Missing `user` configuration for Authenticator');
    }
  });

  t.test('missing `consumer` configuration', (assert) => {
    assert.plan(1);
    try {
      new Authenticator(instances.user, Object());
    } catch (err) {
      assert.equals(err.message, 'Missing `consumer` configuration for Authenticator');
    }
  });

});

/**
 * Authenticator.user
 */

test('Authenticator.user should return User instance', (assert) => {
  assert.plan(1);
  let instances = authenticatorInstances();
  assert.deepEquals(instances.authenticator.user, instances.user);
});

/**
 * Authenticator.requestPasswordReset(email)
 */

test('Authenticator.requestPasswordReset(email) should', (t) => {

  let instances = authenticatorInstances();

  t.test('throw error for missing `email`', (assert) => {
    assert.plan(1);
    try {
      instances.authenticator.requestPasswordReset()
    } catch (err) {
      assert.equals(err.message, 'Missing `email`');
    }
  });

  t.test('resolve on success', (assert) => {
    assert.plan(1);
    let instances = authenticatorInstances();
    sandbox.stub(instances.consumer, 'requestPasswordReset', () => Promise.resolve());
    instances.authenticator.requestPasswordReset('mock@email.com').then(() => {
      assert.ok('requestPasswordReset() resolved')
    })
    sandbox.restore();
  });

});

/**
 * Authenticator.resetPassword(token, password)
 */

test('Authenticator.resetPassword(token, password) should', (t) => {

  let instances = authenticatorInstances();

  t.test('throw error for missing `token`', (assert) => {
    assert.plan(1);
    try {
      instances.authenticator.resetPassword(null, 'password');
    } catch (err) {
      assert.equals(err.message, 'Missing `token`');
    }
  });

  t.test('throw error for missing `password`', (assert) => {
    assert.plan(1);
    try {
      instances.authenticator.resetPassword("token", null)
    } catch (err) {
      assert.equals(err.message, 'Missing `password`');
    }
  });

  t.test('resolve on success', (assert) => {
    assert.plan(1);
    let instances = authenticatorInstances();
    sandbox.stub(instances.consumer, 'resetPassword', () => Promise.resolve());
    instances.authenticator.resetPassword('token', 'password').then(() => {
      assert.ok('resetPassword() resolved')
    })
    sandbox.restore();
  });

});
