'use strict';
const test = require('tape');
const Consumer = require('../../../src/services/consumer');
const Client = require('../../../src/models/client');
const sinon = require('sinon');

var sandbox = sinon.sandbox.create();

/**
 * Instances
 */
function consumerInstances(apiStub) {
  let client = new Client('id', 'secret');
  let consumer = new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com', apiStub);
  return {
    client,
    consumer
  }
}

/**
 * Mocks
 */
const TokenMocks = require('../../mocks/token');
const UserMocks = require('../../mocks/user');

/**
 * Consumer.constructor(options)
 */

test('Consumer.constructor(options) should throw an error for', (t) => {

  let instances = consumerInstances();

  t.test('missing `client` configuration', (assert) => {
    assert.plan(1);
    try {
      new Consumer(Object(), 'http://auth.mock.com', 'http://login.mock.com')
    } catch (err) {
      assert.equals(err.message, 'Missing `client`');
    }
  });

  t.test('missing `login_url` configuration', (assert) => {
    assert.plan(1);
    try {
      new Consumer(instances.client, 'http://auth.mock.com', null)
    } catch (err) {
      assert.equals(err.message, 'Missing `login_url`');
    }
  });

  t.test('missing `endpoint` configuration', (assert) => {
    assert.plan(1);
    try {
      new Consumer(instances.client, null, 'http://login.mock.com')
    } catch (err) {
      assert.equals(err.message, 'Missing `endpoint`');
    }
  });

});

/**
 * Consumer get()
 */

test('Client.id should return correct `endpoint` and `login_url` values', (assert) => {
  assert.plan(2);
  let instances = consumerInstances();
  assert.equals(instances.consumer.endpoint, 'http://auth.mock.com');
  assert.equals(instances.consumer.login_url, 'http://login.mock.com');
});

/**
 * Consumer._request(resource, options)
 */

test('Consumer._request(resource, options) should', (t) => {

  t.test('reject with specific error on failure', (assert) => {
    assert.plan(1);
    let apiStub = sandbox.stub().returns(Promise.reject({'error':'error_message'}));
    let instances = consumerInstances(apiStub);
    instances.consumer._request().catch(err => assert.equals(err.message, 'error_message'));
    sandbox.restore();
  });

  t.test('reject with generic error on failure', (assert) => {
    assert.plan(1);
    let apiStub = sandbox.stub().returns(Promise.reject());
    let instances = consumerInstances(apiStub);
    instances.consumer._request('resource', {}).catch(err => assert.equals(err.message, 'Unexpected error'));
    sandbox.restore();
  });

});

/**
 * Consumer.retrieveToken(username, password)
 */

test('Consumer.retrieveToken(username, password) should return `access_token` and `refresh_token` on success', (assert) => {
  assert.plan(4);
  let apiStub = sandbox.stub().returns(Promise.resolve(TokenMocks.PaswordGrant));
  let instances = consumerInstances(apiStub);
  instances.consumer.retrieveToken('username', 'password').then(res => {
    assert.ok(res, 'Response is filled');
    assert.deepEquals(apiStub.getCall(0).args[0], 'http://auth.mock.com/token');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'POST');
    assert.deepEquals(apiStub.getCall(0).args[1].body, { client_id: 'id', client_secret: 'secret', grant_type: 'password', password: 'password', username: 'username' });
  });
  sandbox.restore();
});

/**
 * Consumer.refreshToken(refresh_token)
 */

test('Consumer.refreshToken(refresh_token) should return a renewed token', (assert) => {
  assert.plan(4);
  let apiStub = sandbox.stub().returns(Promise.resolve(TokenMocks.RefreshGrant));
  let instances = consumerInstances(apiStub);
  instances.consumer.refreshToken('refresh_token').then(res => {
    assert.ok(res, 'Response is filled');
    assert.deepEquals(apiStub.getCall(0).args[0], 'http://auth.mock.com/token');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'POST');
    assert.deepEquals(apiStub.getCall(0).args[1].body, { client_id: 'id', client_secret: 'secret', grant_type: 'refresh_token', refresh_token: 'refresh_token' });
  });
  sandbox.restore();
});


/**
 * Consumer.createUser(email, first_name, last_name, password)
 */

test('Consumer.createUser(email, first_name, last_name, password) should return details for a new User', (assert) => {
  assert.plan(4);
  let apiStub = sandbox.stub().returns(Promise.resolve(UserMocks.User));
  let instances = consumerInstances(apiStub);
  instances.consumer.createUser('mock@email.com', 'first_name', 'last_name', 'password').then((res) => {
    assert.ok(res, 'Response is filled');
    assert.deepEquals(apiStub.getCall(0).args[0], 'http://auth.mock.com/users');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'POST');
    assert.deepEquals(apiStub.getCall(0).args[1].body, { email:'mock@email.com', first_name:'first_name', last_name: 'last_name', password: 'password' });
  });
  sandbox.restore();
});

/**
 * Consumer.updateUser(userId, bearer, options)
 */

test('Consumer.updateUser(userId, bearer, options) should update User and return new details', (assert) => {
  assert.plan(4);
  let apiStub = sandbox.stub().returns(Promise.resolve(UserMocks.UserWithDetails({
    email: "mock@email.com",
    first_name: "first_name",
    last_name: "last_name"
  })));
  let instances = consumerInstances(apiStub);
  instances.consumer.updateUser('44d2c8e0-762b-4fa5-8571-097c81c3130d', 'd4149324285e46bfb8065b6c816a12b2', {
    email: "mock@email.com",
    first_name: "first_name",
    last_name: "last_name"
  }).then((res) => {
    assert.ok(res, 'Response is filled');
    assert.deepEquals(apiStub.getCall(0).args[0], 'http://auth.mock.com/users/44d2c8e0-762b-4fa5-8571-097c81c3130d');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'PATCH');
    assert.deepEquals(apiStub.getCall(0).args[1].body, { email:'mock@email.com', first_name:'first_name', last_name: 'last_name' });
  });
  sandbox.restore();
});

/**
 * Consumer.requestPasswordReset(email)
 */

test('Consumer.requestPasswordReset(email) should send a password reset request', (assert) => {
  assert.plan(3);
  let apiStub = sandbox.stub().returns(Promise.resolve());
  let instances = consumerInstances(apiStub);
  instances.consumer.requestPasswordReset('mock@email.com').then(() => {
    assert.deepEquals(apiStub.getCall(0).args[0], 'http://auth.mock.com/passwords');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'POST');
    assert.deepEquals(apiStub.getCall(0).args[1].body, { email:'mock@email.com'});
  });
  sandbox.restore();
});


/**
 * Consumer.resetPassword(token, password)
 */

test('Consumer.resetPassword(token, password) should reset password', (assert) => {
  assert.plan(3);
  let apiStub = sandbox.stub().returns(Promise.resolve());
  let instances = consumerInstances(apiStub);
  instances.consumer.resetPassword('f734c7f2-0452-414d-867b-84e4166325a', 'password').then(() => {
    assert.deepEquals(apiStub.getCall(0).args[0], 'http://auth.mock.com/passwords/f734c7f2-0452-414d-867b-84e4166325a');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'PUT');
    assert.deepEquals(apiStub.getCall(0).args[1].body, {password: 'password'});
  });
  sandbox.restore();
});


/**
 * Consumer.retrieveUser(token)
 */

test('Consumer.retrieveUser(token) should retrieve User based on token', (assert) => {
  assert.plan(4);
  let apiStub = sandbox.stub().returns(Promise.resolve(UserMocks.User));
  let instances = consumerInstances(apiStub);
  instances.consumer.retrieveUser('f734c7f2-0452-414d-867b-84e4166325a').then((res) => {
    assert.ok(res, 'Response is filled');
    assert.deepEquals(apiStub.getCall(0).args[0], 'http://auth.mock.com/users/me');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'GET');
    assert.deepEquals(apiStub.getCall(0).args[1].headers.Authorization, 'Bearer f734c7f2-0452-414d-867b-84e4166325a');
  });
  sandbox.restore();
});
