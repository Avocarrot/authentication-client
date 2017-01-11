'use strict';
const test = require('tape');
const Consumer = require('../../../src/services/consumer');
const Client = require('../../../src/models/client');
const sinon = require('sinon');

var sandbox = sinon.sandbox.create();

/**
 * Mocks
 */
const TokenMocks = require('../../mocks/token');
const UserMocks = require('../../mocks/user');

/**
 * Consumer.constructor(options)
 */

test('Consumer.constructor(options) should throw an error for', (t) => {

  var client = new Client('id', 'secret');

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
      new Consumer(client, 'http://auth.mock.com', null)
    } catch (err) {
      assert.equals(err.message, 'Missing `login_url`');
    }
  });

  t.test('missing `endpoint` configuration', (assert) => {
    assert.plan(1);
    try {
      new Consumer(client, null, 'http://login.mock.com')
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
  let consumer = new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com');
  assert.equals(consumer.endpoint, 'http://auth.mock.com');
  assert.equals(consumer.login_url, 'http://login.mock.com');
});

/**
 * Consumer._request(resource, options)
 */

test('Consumer._request(resource, options) should', (t) => {

  t.test('reject with specific error on failure', (assert) => {
    assert.plan(1);
    let apiStub = sandbox.stub().returns(Promise.reject({'error':'error_message'}));
    let consumer = new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com', apiStub);
    consumer._request().catch(err => assert.equals(err.message, 'error_message'));
    sandbox.restore();
  });

  t.test('reject with generic error on failure', (assert) => {
    assert.plan(1);
    let apiStub = sandbox.stub().returns(Promise.reject());
    let consumer = new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com', apiStub);
    consumer._request('resource', {}).catch(err => assert.equals(err.message, 'Unexpected error'));
    sandbox.restore();
  });

});

/**
 * Consumer.retrieveToken(username, password)
 */

test('Consumer.retrieveToken(username, password) should return `access_token` and `refresh_token` on success', (assert) => {
  assert.plan(4);
  let apiStub = sandbox.stub().returns(Promise.resolve(TokenMocks.PaswordGrant));
  let consumer = new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com', apiStub);
  consumer.retrieveToken('username', 'password').then(res => {
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
  let consumer = new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com', apiStub);
  consumer.refreshToken('refresh_token').then(res => {
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
  let consumer = new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com', apiStub);
  consumer.createUser('mock@email.com', 'first_name', 'last_name', 'password').then((res) => {
    assert.ok(res, 'Response is filled');
    assert.deepEquals(apiStub.getCall(0).args[0], 'http://auth.mock.com/users');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'POST');
    assert.deepEquals(apiStub.getCall(0).args[1].body, { client_id: 'id', client_secret: 'secret', email:'mock@email.com', first_name:'first_name', last_name: 'last_name', password: 'password' });
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
  let consumer = new Consumer(new Client('id', 'secret'), 'http://auth.mock.com', 'http://login.mock.com', apiStub);
  consumer.updateUser('44d2c8e0-762b-4fa5-8571-097c81c3130d', 'd4149324285e46bfb8065b6c816a12b2', {
    email: "mock@email.com",
    first_name: "first_name",
    last_name: "last_name"
  }).then((res) => {
    assert.ok(res, 'Response is filled');
    assert.deepEquals(apiStub.getCall(0).args[0], 'http://auth.mock.com/users/44d2c8e0-762b-4fa5-8571-097c81c3130d');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'PATCH');
    assert.deepEquals(apiStub.getCall(0).args[1].body, { client_id: 'id', client_secret: 'secret', email:'mock@email.com', first_name:'first_name', last_name: 'last_name' });
  });
  sandbox.restore();
});
