'use strict';
const test = require('tape');
const sinon = require('sinon');
const Authenticator = require('../../src/utils/authenticator');
const Store = require('../../src/utils/store');
const Client = require('../../src/utils/client');
const Consumer = require('../../src/utils/consumer');
const Promise = require('es6-promise').Promise;

var sandbox = sinon.sandbox.create();

/**
 * Authenticator.constructor(options)
 */

test('Authenticator.constructor(options) should throw an error for', (t) => {

  let store = new Store('namespace');
  let consumer = new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com');

  t.test('missing `store` configuration', (assert) => {
    assert.plan(1);
    try {
      new Authenticator(Object(), consumer);
    } catch (err) {
      assert.equals(err.message, 'Missing `store` configuration for Authenticator');
    }
  });

  t.test('missing `consumer` configuration', (assert) => {
    assert.plan(1);
    try {
      new Authenticator(store, Object());
    } catch (err) {
      assert.equals(err.message, 'Missing `consumer` configuration for Authenticator');
    }
  });

});

test('Authenticator.constructor(options) should store valid options', (assert) => {
  assert.plan(2);
  let store = new Store('namespace');
  let consumer = new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com');
  let authenticator = new Authenticator(store, consumer);
  assert.deepEquals(authenticator.consumer, consumer);
  assert.deepEquals(authenticator.store, store);
});

/**
 * Authenticator.authenticate(username, password)
 */

test('Authenticator.authenticate(username, password) should throw an error for', (t) => {

  let authenticator = new Authenticator(new Store('namespace'), new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com'));

  t.test('missing `username`', (assert) => {
    assert.plan(1);
    try {
      authenticator.authenticate(null, 'password');
    } catch (err) {
      assert.equals(err.message, 'Missing `username`');
    }
  });

  t.test('missing `password`', (assert) => {
    assert.plan(1);
    try {
      authenticator.authenticate('username', null);
    } catch (err) {
      assert.equals(err.message, 'Missing `password`');
    }
  });
});

/**
 * Authenticator.authenticate(username, password)
 */

test('Authenticator.authenticate(username, password) should store `access_token` and `refresh_token` on success', (assert) => {
  assert.plan(2);
  let store = new Store('namespace');
  let consumer = new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com');
  let authenticator = new Authenticator(store, consumer);
  let storeSpy = sandbox.spy();
  store.set = storeSpy;
  sandbox.stub(consumer, 'retrieveToken', () => Promise.resolve({
    'refresh_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'access_token': 'rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7',
  }));
  authenticator.authenticate('username', 'password').then(() => {
    assert.deepEquals(storeSpy.getCall(0).args, ['access_token', 'rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7']);
    assert.deepEquals(storeSpy.getCall(1).args, ['refresh_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9']);
  });
  sandbox.restore();
});

test('Authenticator.authenticate(username, password) should reject with error if authentication fails', (assert) => {
  assert.plan(1);
  let consumer = new Consumer(new Client('id', 'secret'), 'enedpoint', 'http://login.mock.com');
  let authenticator = new Authenticator(new Store('namespace'), consumer);
  sandbox.stub(consumer, 'retrieveToken', () => Promise.reject(new Error('invalid_request')));
  authenticator.authenticate('username', 'password').catch(error => {
    assert.equals(error.message, 'invalid_request');
  });
  sandbox.restore();
});

/**
 * Authenticator.register(email, first_name, last_name, password)
 */

test('Authenticator.register(email, first_name, last_name, password) should throw an error for', (t) => {

  let authenticator = new Authenticator(new Store('namespace'), new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com'));

  t.test('missing `email`', (assert) => {
    assert.plan(1);
    try {
      authenticator.register(null, 'first_name', 'last_name', 'password');
    } catch (err) {
      assert.equals(err.message, 'Missing `email`');
    }
  });

  t.test('missing `first_name`', (assert) => {
    assert.plan(1);
    try {
      authenticator.register('email', null, 'last_name', 'password');
    } catch (err) {
      assert.equals(err.message, 'Missing `first_name`');
    }
  });

  t.test('missing `last_name`', (assert) => {
    assert.plan(1);
    try {
      authenticator.register('email', 'first_name', null, 'password');
    } catch (err) {
      assert.equals(err.message, 'Missing `last_name`');
    }
  });

  t.test('missing `password`', (assert) => {
    assert.plan(1);
    try {
      authenticator.register('email', 'first_name', 'last_name', null);
    } catch (err) {
      assert.equals(err.message, 'Missing `password`');
    }
  });

});
