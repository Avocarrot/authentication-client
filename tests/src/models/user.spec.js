const test = require('tape');
const sinon = require('sinon');
const User = require('../../../src/models/user');
const Client = require('../../../src/models/client');
const Store = require('../../../src/services/store');
const Consumer = require('../../../src/services/consumer');
const API = require('../../../src/api').Sandbox;
const mockCrossStore = require('../../mocks/store');

const sandbox = sinon.sandbox.create();

/**
 * Helpers
 */
function generateError({ name, message }) {
  const error = new Error(message);
  error.name = name;
  return error;
}

/**
 * Instances
 */
function getUserInstances() {
  const client = new Client('id', 'secret');
  const api = new API();
  const crossStoreInstances = mockCrossStore(sandbox);
  const store = new Store('domain', 'https://login.domain.com/hub', crossStoreInstances.Client);
  const consumer = new Consumer(client, api);
  const user = new User(store, consumer);
  return {
    client,
    api,
    user,
    store,
    consumer,
  };
}

/**
 * Mocks
 */
const UserMocks = require('../../mocks/user');
const TokenMocks = require('../../mocks/token');

/**
 * User.constructor(options)
 */

test('User.constructor(options) should throw an error for', (t) => {
  t.test('missing `store`', (assert) => {
    assert.plan(1);
    const instances = getUserInstances();
    try {
      new User(Object(), instances.consumer);
    } catch (err) {
      assert.equals(err.message, '`store` should be instance of Store');
    }
  });

  t.test('missing `consumer`', (assert) => {
    assert.plan(1);
    const instances = getUserInstances();
    try {
      new User(instances.store, Object());
    } catch (err) {
      assert.equals(err.message, '`consumer` should be instance of Consumer');
    }
  });
});

/**
 * User.id
 */

test('User.id should be read-only', (assert) => {
  assert.plan(2);
  const instances = getUserInstances();
  assert.equals(instances.user.id, undefined);
  instances.user.id = 'id';
  assert.equals(instances.user.id, undefined);
});

/**
 * User.publisherId
 */

test('User.publisherId should be read-only', (assert) => {
  assert.plan(2);
  const instances = getUserInstances();
  assert.equals(instances.user.publisherId, undefined);
  instances.user.publisherId = 'publisherId';
  assert.equals(instances.user.publisherId, undefined);
});

/**
 * User.email
 */

test('User.email should be read-write', (assert) => {
  assert.plan(2);
  const instances = getUserInstances();
  instances.user.email = 'john.doe@mail.com';
  assert.equals(instances.user.email, 'john.doe@mail.com');
  instances.user.email = null;
  assert.equals(instances.user.email, 'john.doe@mail.com');
});

/**
 * User.firstName
 */

test('User.firstName should be read-write', (assert) => {
  assert.plan(2);
  const instances = getUserInstances();
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
  const instances = getUserInstances();
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
  const instances = getUserInstances();
  const storeSetStub = sandbox.stub(instances.store, 'set', () => {});
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
  t.test('missing `username`', (assert) => {
    assert.plan(1);
    const instances = getUserInstances();
    try {
      instances.user.authenticate(null, 'password');
    } catch (err) {
      assert.equals(err.message, 'Missing `username`');
    }
  });

  t.test('missing `password`', (assert) => {
    assert.plan(1);
    const instances = getUserInstances();
    try {
      instances.user.authenticate('username', null);
    } catch (err) {
      assert.equals(err.message, 'Missing `password`');
    }
  });
});

test('User.authenticate(username, password) should store user and token on success', (assert) => {
  assert.plan(9);
  const instances = getUserInstances();
  const storeSetStub = sandbox.stub();
  const retrieveUserStub = sandbox.stub();
  const retrieveTokenStub = sandbox.stub();
  storeSetStub.returns(Promise.resolve());
  retrieveUserStub.returns({
    id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
    publisher_id: '55f5c8e0-762b-4fa5-8571-197c8183130a',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@mail.com',
  });
  retrieveTokenStub.returns(Promise.resolve({
    refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    access_token: 'rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7',
  }));
  instances.store.set = storeSetStub;
  instances.consumer.retrieveUser = retrieveUserStub;
  instances.consumer.retrieveToken = retrieveTokenStub;
  instances.user.authenticate('username', 'password').then((res) => {
    assert.deepEquals(storeSetStub.getCall(0).args, ['access_token', 'rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7']);
    assert.deepEquals(storeSetStub.getCall(1).args, ['refresh_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9']);
    assert.equals(instances.user.id, '44d2c8e0-762b-4fa5-8571-097c81c3130d');
    assert.equals(instances.user.publisherId, '55f5c8e0-762b-4fa5-8571-197c8183130a');
    assert.equals(instances.user.email, 'john.doe@mail.com');
    assert.equals(instances.user.firstName, 'John');
    assert.equals(instances.user.lastName, 'Doe');
    assert.equals(res.message, 'Authenticated User');
    assert.deepEquals(res.data, {
      email: 'john.doe@mail.com',
      first_name: 'John',
      id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
      last_name: 'Doe',
      publisher_id: '55f5c8e0-762b-4fa5-8571-197c8183130a',
    });
  });
  sandbox.restore();
});

/**
 * User.authenticateWithToken(accessToken, refreshToken)
 */

test('User.authenticateWithToken(accessToken, refreshToken) should', (t) => {
  t.test('throw an error for missing `token`', (assert) => {
    assert.plan(1);
    const instances = getUserInstances();
    try {
      instances.user.authenticateWithToken();
    } catch (err) {
      assert.equals(err.message, 'Missing `accessToken`');
    }
  });

  t.test('store user and token on success', (assert) => {
    assert.plan(8);
    const instances = getUserInstances();
    const storeSetStub = sandbox.stub();
    const storeRemoveStub = sandbox.stub();
    const retrieveUserStub = sandbox.stub();
    storeSetStub.returns(Promise.resolve());
    storeRemoveStub.returns(Promise.resolve());
    retrieveUserStub.returns(Promise.resolve({
      id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
      publisher_id: '55f5c8e0-762b-4fa5-8571-197c8183130a',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@mail.com',
    }));
    instances.store.set = storeSetStub;
    instances.store.remove = storeRemoveStub;
    instances.consumer.retrieveUser = retrieveUserStub;
    instances.user.authenticateWithToken('rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7').then((res) => {
      assert.deepEquals(storeSetStub.getCall(0).args, ['access_token', 'rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7']);
      assert.equals(instances.user.id, '44d2c8e0-762b-4fa5-8571-097c81c3130d');
      assert.equals(instances.user.publisherId, '55f5c8e0-762b-4fa5-8571-197c8183130a');
      assert.equals(instances.user.email, 'john.doe@mail.com');
      assert.equals(instances.user.firstName, 'John');
      assert.equals(instances.user.lastName, 'Doe');
      assert.equals(res.message, 'Authenticated User');
      assert.deepEquals(res.data, {
        email: 'john.doe@mail.com',
        first_name: 'John',
        id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
        last_name: 'Doe',
        publisher_id: '55f5c8e0-762b-4fa5-8571-197c8183130a',
      });
    });
    sandbox.restore();
  });

  t.test('successfully refresh tokens on `invalid_grant` failure', (assert) => {
    assert.plan(14);
    const instances = getUserInstances();
    const storeSetStub = sandbox.stub();
    const storeRemoveStub = sandbox.stub();
    const retrieveUserStub = sandbox.stub();
    const refreshTokenStub = sandbox.stub();
    storeSetStub.returns(Promise.resolve());
    storeRemoveStub.returns(Promise.resolve());
    refreshTokenStub.onCall(0).returns(Promise.resolve(TokenMocks.RefreshGrant));
    retrieveUserStub.onCall(0).returns(Promise.reject(generateError({
      name: 'invalid_token',
      message: 'The access token provided is expired, revoked, malformed, or invalid',
    })));
    retrieveUserStub.onCall(1).returns(Promise.resolve({
      id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
      publisher_id: '55f5c8e0-762b-4fa5-8571-197c8183130a',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@mail.com',
    }));
    instances.store.set = storeSetStub;
    instances.store.remove = storeRemoveStub;
    instances.consumer.retrieveUser = retrieveUserStub;
    instances.consumer.refreshToken = refreshTokenStub;
    instances.user.authenticateWithToken('IK4NarkdkJHVBdCjLIIjslauxPP8uo5hY8tTN7', 'sInR5ceyJhbGciOiJIUzI1NiICI6IkpXVCJ9').then((res) => {
      assert.equals(storeSetStub.callCount, 4);
      assert.equals(storeRemoveStub.callCount, 0);
      assert.equals(refreshTokenStub.callCount, 1);
      assert.deepEquals(storeSetStub.getCall(0).args, ['access_token', 'IK4NarkdkJHVBdCjLIIjslauxPP8uo5hY8tTN7']);
      assert.deepEquals(storeSetStub.getCall(1).args, ['refresh_token', 'sInR5ceyJhbGciOiJIUzI1NiICI6IkpXVCJ9']);
      assert.deepEquals(storeSetStub.getCall(2).args, ['access_token', TokenMocks.RefreshGrant.access_token]);
      assert.deepEquals(storeSetStub.getCall(3).args, ['refresh_token', TokenMocks.RefreshGrant.refresh_token]);
      assert.deepEquals(refreshTokenStub.getCall(0).args, ['sInR5ceyJhbGciOiJIUzI1NiICI6IkpXVCJ9']);
      assert.equals(instances.user.publisherId, '55f5c8e0-762b-4fa5-8571-197c8183130a');
      assert.equals(instances.user.email, 'john.doe@mail.com');
      assert.equals(instances.user.firstName, 'John');
      assert.equals(instances.user.lastName, 'Doe');
      assert.equals(res.message, 'Authenticated User');
      assert.deepEquals(res.data, {
        email: 'john.doe@mail.com',
        first_name: 'John',
        id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
        last_name: 'Doe',
        publisher_id: '55f5c8e0-762b-4fa5-8571-197c8183130a',
      });
    });
    sandbox.restore();
  });

  t.test('gracefully skip token refresh if `refreshToken` is not defined', (assert) => {
    assert.plan(7);
    const instances = getUserInstances();
    const storeSetStub = sandbox.stub();
    const storeRemoveStub = sandbox.stub();
    const retrieveUserStub = sandbox.stub();
    const refreshTokenStub = sandbox.stub();
    storeSetStub.returns(Promise.resolve());
    storeRemoveStub.returns(Promise.resolve());
    refreshTokenStub.onCall(0).returns(Promise.resolve(TokenMocks.RefreshGrant));
    retrieveUserStub.onCall(0).returns(Promise.reject(generateError({
      name: 'unauthorized_client',
      message: 'The authenticated client is not authorized',
    })));
    instances.store.set = storeSetStub;
    instances.store.remove = storeRemoveStub;
    instances.consumer.retrieveUser = retrieveUserStub;
    instances.consumer.refreshToken = refreshTokenStub;
    instances.user.authenticateWithToken('IK4NarkdkJHVBdCjLIIjslauxPP8uo5hY8tTN7').catch((err) => {
      assert.equals(storeSetStub.callCount, 1);
      assert.equals(storeRemoveStub.callCount, 1);
      assert.equals(refreshTokenStub.callCount, 0);
      assert.deepEquals(storeSetStub.getCall(0).args, ['access_token', 'IK4NarkdkJHVBdCjLIIjslauxPP8uo5hY8tTN7']);
      assert.deepEquals(storeRemoveStub.getCall(0).args, ['refresh_token']);
      assert.equals(err.message, 'The authenticated client is not authorized');
      assert.equals(err.name, 'unauthorized_client');
    });
    sandbox.restore();
  });
});

/**
 * User.create(email, password, firstName, lastName)
 */

test('User.create(email, password, firstName, lastName) should throw an error', (t) => {
  t.test('for missing `email`', (assert) => {
    assert.plan(1);
    const instances = getUserInstances();
    try {
      instances.user.create(null, 'password', 'firstName', 'lastName');
    } catch (err) {
      assert.equals(err.message, 'Missing `email`');
    }
  });

  t.test('for missing `password`', (assert) => {
    assert.plan(1);
    const instances = getUserInstances();
    try {
      instances.user.create('john.doe@mail.com', null, 'firstName', 'lastName');
    } catch (err) {
      assert.equals(err.message, 'Missing `password`');
    }
  });
});

test('User.create(email, password, firstName, lastName) should reject invalid password', (assert) => {
  assert.plan(1);
  const instances = getUserInstances();
  instances.user.create('john.doe@mail.com', 'password').catch((err) => {
    assert.equals(err.message, 'Password must contain both numbers and characters');
  });
});

test('User.create(email, password, firstName, lastName) should set User data on success', (assert) => {
  assert.plan(11);
  const response = Object.assign(UserMocks.User, {});
  const instances = getUserInstances();
  sandbox.stub(instances.consumer, 'createUser', () => Promise.resolve(response));
  instances.user.create('john.doe@mail.com', 'password123456', 'firstName', 'lastName').then((res) => {
    assert.equals(res.message, 'Created User');
    assert.equals(instances.user.id, response.id);
    assert.equals(instances.user.publisherId, response.publisher_id);
    assert.equals(instances.user.firstName, response.first_name);
    assert.equals(instances.user.lastName, response.last_name);
    assert.equals(instances.user.email, response.email);
    assert.equals(res.data.first_name, response.first_name);
    assert.equals(res.data.last_name, response.last_name);
    assert.equals(res.data.email, response.email);
    assert.ok(res.data.id);
    assert.ok(res.data.publisher_id);
  });
  sandbox.restore();
});


/**
 * User.save()
 */

test('User.save() should not allow saving an unauthenticated User', (assert) => {
  assert.plan(1);
  const instances = getUserInstances();
  instances.user.email = 'john.doe@mail.com';
  instances.user.save().catch((err) => {
    assert.equals(err.message, 'Cannot save a non-existent User');
  });
});

test('User.save() should update User with new data', (assert) => {
  assert.plan(2);
  const instances = getUserInstances();
  sandbox.stub(instances.consumer, 'createUser', () => Promise.resolve(Object.assign(UserMocks.User, {})));
  instances.user.create('john.doe@mail.com', 'password123456').then(() => {
    // Update user details
    instances.user.firstName = 'Foo';
    instances.user.lastName = 'Bar';
    // Stub token retrieval
    sandbox.stub(instances.store, 'get', () => 'bearer');
    const updateUserStub = sandbox.stub(instances.consumer, 'updateUser', () => Promise.resolve());
    instances.user.save().then((res) => {
      assert.deepEquals(updateUserStub.getCall(0).args, ['44d2c8e0-762b-4fa5-8571-097c81c3130d', 'bearer', { firstName: 'Foo', lastName: 'Bar' }]);
      assert.equals(res.message, 'Updated User model');
    });
  });
  sandbox.restore();
});


/**
 * User.flush()
 */

test('User.flush() removes stored tokens for User', (assert) => {
  assert.plan(4);
  const instances = getUserInstances();
  const storeRemoveStub = sandbox.stub(instances.store, 'remove', () => {});
  instances.user.flush().then((res) => {
    assert.equals(res.message, 'Flushed User');
    assert.equals(storeRemoveStub.callCount, 2);
    assert.equals(storeRemoveStub.getCall(0).args[0], 'access_token');
    assert.equals(storeRemoveStub.getCall(1).args[0], 'refresh_token');
  });
});
