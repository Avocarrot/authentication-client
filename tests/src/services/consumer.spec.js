'use strict';
const test = require('tape');
const Consumer = require('../../../src/services/consumer');
const Client = require('../../../src/models/client');
const API = require('../../../src/api').Sandbox;
const sinon = require('sinon');

var sandbox = sinon.sandbox.create();

/**
 * Instances
 */
function getConsumerInstances() {
  let client = new Client('id', 'secret');
  let api = new API();
  let consumer = new Consumer(new Client('id', 'secret'), api);
  return {
    client,
    api,
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

  let instances = getConsumerInstances();

  t.test('missing `client` configuration', (assert) => {
    assert.plan(1);
    try {
      new Consumer(Object(), instances.api)
    } catch (err) {
      assert.equals(err.message, '`client` should be instance of Client');
    }
  });

  t.test('missing `endpoint` configuration', (assert) => {
    assert.plan(1);
    try {
      new Consumer(instances.client, Object())
    } catch (err) {
      assert.equals(err.message, '`api` should be instance of API.Production or API.Sandbox');
    }
  });

});

/**
 * Consumer._request(resource, options)
 */

test('Consumer._request(resource, options) should', (t) => {

  t.test('reject with specific error on failure', (assert) => {
    assert.plan(1);
    let instances = getConsumerInstances();
    sandbox.stub(instances.api, 'invoke', () => Promise.resolve({status: 400, body: {'error':'invalid_client'}}));
    instances.consumer._request().catch(err => assert.equals(err.message, 'Client authentication failed'));
    sandbox.restore();
  });

  t.test('reject with generic error on failure', (assert) => {
    assert.plan(1);
    let instances = getConsumerInstances();
    sandbox.stub(instances.api, 'invoke', () => Promise.resolve({status: 500, body: {}}));
    instances.consumer._request('resource', {}).catch(err => assert.equals(err.message, 'Unexpected error'));
    sandbox.restore();
  });

});

/**
 * Consumer.retrieveToken(username, password)
 */

test('Consumer.retrieveToken(username, password) should return `access_token` and `refresh_token` on success', (assert) => {
  assert.plan(4);
  let instances = getConsumerInstances();
  let apiStub = sandbox.stub(instances.api, 'invoke', () => Promise.resolve({status:200, body:TokenMocks.PaswordGrant}));
  instances.consumer.retrieveToken('username', 'password').then(res => {
    assert.ok(res, 'Response is filled');
    assert.deepEquals(apiStub.getCall(0).args[0], 'token');
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
  let instances = getConsumerInstances();
  let apiStub = sandbox.stub(instances.api, 'invoke', () => Promise.resolve({status:200, body:TokenMocks.RefreshGrant}));
  instances.consumer.refreshToken('refresh_token').then(res => {
    assert.ok(res, 'Response is filled');
    assert.deepEquals(apiStub.getCall(0).args[0], 'token');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'POST');
    assert.deepEquals(apiStub.getCall(0).args[1].body, { client_id: 'id', client_secret: 'secret', grant_type: 'refresh_token', refresh_token: 'refresh_token' });
  });
  sandbox.restore();
});


/**
 * Consumer.createUser(email, firstName, lastName, password)
 */

test('Consumer.createUser(email, firstName, lastName, password) should return details for a new User', (assert) => {
  assert.plan(4);
  let instances = getConsumerInstances();
  let apiStub = sandbox.stub(instances.api, 'invoke', () => Promise.resolve({status:201, body: Object.assign(UserMocks.User, {})}));
  instances.consumer.createUser('john.doe@mail.com', 'John', 'Doe', 'password').then((res) => {
    assert.ok(res, 'Response is filled');
    assert.deepEquals(apiStub.getCall(0).args[0], 'users');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'POST');
    assert.deepEquals(apiStub.getCall(0).args[1].body, { email:'john.doe@mail.com', first_name:'John', last_name: 'Doe', password: 'password' });
  });
  sandbox.restore();
});

/**
 * Consumer.updateUser(userId, bearer, options)
 */

test('Consumer.updateUser(userId, bearer, options) should update User and return new details', (assert) => {
  assert.plan(4);
  let instances = getConsumerInstances();
  let apiStub = sandbox.stub(instances.api, 'invoke', () => Promise.resolve({
    status:200, body: UserMocks.UserWithDetails({
      first_name: "first_name",
      last_name: "last_name"
    })
  }));
  instances.consumer.updateUser('44d2c8e0-762b-4fa5-8571-097c81c3130d', 'd4149324285e46bfb8065b6c816a12b2', {
    firstName: "John",
    lastName: "Doe"
  }).then((res) => {
    assert.ok(res, 'Response is filled');
    assert.deepEquals(apiStub.getCall(0).args[0], 'users/44d2c8e0-762b-4fa5-8571-097c81c3130d');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'PATCH');
    assert.deepEquals(apiStub.getCall(0).args[1].body, { first_name:'John', last_name: 'Doe' });
  });
  sandbox.restore();
});

/**
 * Consumer.requestPasswordReset(email)
 */

test('Consumer.requestPasswordReset(email) should send a password reset request', (assert) => {
  assert.plan(3);
  let instances = getConsumerInstances();
  let apiStub = sandbox.stub(instances.api, 'invoke', () => Promise.resolve({status:200, body:{}}));
  instances.consumer.requestPasswordReset('john.doe@mail.com').then(() => {
    assert.deepEquals(apiStub.getCall(0).args[0], 'passwords');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'POST');
    assert.deepEquals(apiStub.getCall(0).args[1].body, { email:'john.doe@mail.com'});
  });
  sandbox.restore();
});


/**
 * Consumer.resetPassword(token, password)
 */

test('Consumer.resetPassword(token, password) should reset password', (assert) => {
  assert.plan(3);
  let instances = getConsumerInstances();
  let apiStub = sandbox.stub(instances.api, 'invoke', () => Promise.resolve({status: 200, body: {}}));
  instances.consumer.resetPassword('f734c7f2-0452-414d-867b-84e4166325a', 'password').then(() => {
    assert.deepEquals(apiStub.getCall(0).args[0], 'passwords/f734c7f2-0452-414d-867b-84e4166325a');
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
  let instances = getConsumerInstances();
  let apiStub = sandbox.stub(instances.api, 'invoke', () => Promise.resolve({status: 200, body: Object.assign(UserMocks.User, {}) }));
  instances.consumer.retrieveUser('f734c7f2-0452-414d-867b-84e4166325a').then((res) => {
    assert.ok(res, 'Response is filled');
    assert.deepEquals(apiStub.getCall(0).args[0], 'users/me');
    assert.deepEquals(apiStub.getCall(0).args[1].method, 'GET');
    assert.deepEquals(apiStub.getCall(0).args[1].headers.Authorization, 'Bearer f734c7f2-0452-414d-867b-84e4166325a');
  });
  sandbox.restore();
});
