'use strict';
const test = require('tape');
const sinon = require('sinon');
const User = require('../../../src/models/user');
const Client = require('../../../src/models/client');
const Store = require('../../../src/services/store');
const Consumer = require('../../../src/services/consumer');

var sandbox = sinon.sandbox.create();

/**
 * Instances
 */
function userInstances() {
  let client = new Client('id', 'secret');
  let store = new Store('namespace');
  let consumer = new Consumer(client, 'http://auth.mock.com', 'http://login.mock.com');
  let user = new User(store, consumer);
  return {
    user,
    store,
    consumer
  }
}

/**
 * User.constructor(options)
 */

test('User.constructor(options) should throw an error for', (t) => {

  let instances = userInstances();

  t.test('missing `store`', (assert) => {
    assert.plan(1);
    try {
      new User(Object(), instances.consumer)
    } catch (err) {
      assert.equals(err.message, 'Missing `store`');
    }
  });

  t.test('missing `consumer`', (assert) => {
    assert.plan(1);
    try {
      new User(instances.store, Object())
    } catch (err) {
      assert.equals(err.message, 'Missing `consumer`');
    }
  });

})

/**
 * User.id
 */

test('User.id should be read-only', (assert) => {
  assert.plan(2);
  let instances = userInstances();
  assert.equals(instances.user.id, undefined);
  try {
    instances.user.id = 'id';
  } catch (err) {
    assert.equals(err.message, 'Cannot set property id of #<User> which has only a getter');
  }
});

/**
 * User.publisherId
 */

test('User.publisherId should be read-only', (assert) => {
  assert.plan(2);
  let instances = userInstances();
  assert.equals(instances.user.publisherId, undefined);
  try {
    instances.user.publisherId = 'publisherId';
  } catch (err) {
    assert.equals(err.message, 'Cannot set property publisherId of #<User> which has only a getter');
  }
});

/**
 * User.email
 */

test('User.email should be read-write', (assert) => {
  assert.plan(2);
  let instances = userInstances();
  instances.user.email = 'mock@email.com';
  assert.equals(instances.user.email, 'mock@email.com');
  instances.user.email = null;
  assert.equals(instances.user.email, 'mock@email.com');
});

/**
 * User.firstName
 */

test('User.firstName should be read-write', (assert) => {
  assert.plan(2);
  let instances = userInstances();
  instances.user.firstName = 'Doe';
  assert.equals(instances.user.firstName, 'Doe');
  instances.user.firstName = null;
  assert.equals(instances.user.firstName, 'Doe');
});

/**
 * User.lastName
 */

test('User.lastName should be read-write', (assert) => {
  assert.plan(2);
  let instances = userInstances();
  instances.user.lastName = 'Doe';
  assert.equals(instances.user.lastName, 'Doe');
  instances.user.lastName = null;
  assert.equals(instances.user.lastName, 'Doe');
});

/**
 * User.bearer
 */

test('User.bearer should be read-write', (assert) => {
  assert.plan(3);
  let instances = userInstances();
  let storeSetStub = sandbox.stub(instances.store, 'set', () => {});
  sandbox.stub(instances.store, 'get', () => 'mock_access_token');
  // Assert Store.get()
  assert.equals(instances.user.bearer, 'mock_access_token');
  instances.user.bearer = 'new_access_token';
  // Assert Store.set()
  assert.deepEquals(storeSetStub.getCall(0).args, ['access_token', 'new_access_token']);
  instances.user.bearer = null;
  // Assert Store.set() with no value
  assert.deepEquals(storeSetStub.callCount, 1);
  sandbox.restore();
});

/**
 * User.authenticate(username, password)
 */

test('User.authenticate(username, password) should throw an error for', (t) => {

  let instances = userInstances();

  t.test('missing `username`', (assert) => {
    assert.plan(1);
    try {
      instances.user.authenticate(null, 'password');
    } catch (err) {
      assert.equals(err.message, 'Missing `username`');
    }
  });

  t.test('missing `password`', (assert) => {
    assert.plan(1);
    try {
      instances.user.authenticate('username', null);
    } catch (err) {
      assert.equals(err.message, 'Missing `password`');
    }
  });
});

test('Authenticator.authenticate(username, password) should store `access_token` and `refresh_token` on success', (assert) => {
  assert.plan(1);
  let instances = userInstances();
  let storeSetSpy = sandbox.spy();
  instances.store.set = storeSetSpy;
  sandbox.stub(instances.consumer, 'retrieveToken', () => Promise.resolve({
    'refresh_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'access_token': 'rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7',
  }));
  instances.user.authenticate('username', 'password').then(() => {
    assert.deepEquals(storeSetSpy.getCall(0).args, ['access_token', 'rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7']);
  });
  sandbox.restore();
});

/**
 * User.create(email, firstName, lastName, password)
 */

test('User.create(email, firstName, lastName, password) should throw an error for', (t) => {

  let instances = userInstances();

  t.test('missing `email`', (assert) => {
    assert.plan(1);
    try {
      instances.user.create(null, 'password', 'firstName', 'lastName');
    } catch (err) {
      assert.equals(err.message, 'Missing `email`');
    }
  });

  t.test('missing `password`', (assert) => {
    assert.plan(1);
    try {
      instances.user.create('email', null, 'firstName', 'lastName');
    } catch (err) {
      assert.equals(err.message, 'Missing `password`');
    }
  });

});
