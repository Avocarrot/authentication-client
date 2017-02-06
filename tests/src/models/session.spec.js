const test = require('tape');
const sinon = require('sinon');
const Session = require('../../../src/models/session');
const User = require('../../../src/models/user');
const Client = require('../../../src/models/client');
const Store = require('../../../src/services/store');
const API = require('../../../src/api').Sandbox;
const Consumer = require('../../../src/services/consumer');
const mockCrossStore = require('../../mocks/store');

const sandbox = sinon.sandbox.create();

/**
 * Instances
 */
function getSessionInstances(redirectFn, pageURL) {
  const crossStoreInstances = mockCrossStore(sandbox);
  const store = new Store('domain', 'https://login.domain.com/hub', crossStoreInstances.Client);
  const api = new API('http://auth.mock.com');
  const client = new Client('id', 'secret');
  const consumer = new Consumer(client, api);
  const user = new User(store, consumer);
  const session = new Session(user, 'http://login.mock.com', redirectFn, pageURL);
  return {
    store,
    api,
    client,
    consumer,
    user,
    session,
  };
}

/**
 * Session.constructor(options)
 */

test('Session.constructor(options) should throw an error for', (t) => {
  t.test('missing `user`', (assert) => {
    assert.plan(1);
    try {
      new Session(Object(), 'http://login.mock.com');
    } catch (err) {
      assert.equals(err.message, '`user` should be instance of User');
    }
  });

  t.test('missing `loginHost`', (assert) => {
    assert.plan(1);
    const instances = getSessionInstances();
    try {
      new Session(instances.user);
    } catch (err) {
      assert.equals(err.message, '`loginHost` is not defined');
    }
  });
});

/**
 * Session.initialize()
 */

test('Session.initialize() should initialize session', (assert) => {
  assert.plan(1);
  const instances = getSessionInstances();
  const syncWithStoreStub = sandbox.stub();
  syncWithStoreStub.returns(Promise.resolve());
  instances.user.syncWithStore = syncWithStoreStub;
  instances.session.initialize().then(() => {
    assert.equals(syncWithStoreStub.callCount, 1);
  });
});

/**
 * Session.isValid
 */

test('Session.isValid() should return', (t) => {
  t.test('true for authenticated User', (assert) => {
    assert.plan(1);
    const instances = getSessionInstances();
    instances.user._bearer = 'rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7';
    assert.equals(instances.session.isValid, true);
    sandbox.restore();
  });

  t.test('false for non authenticated User', (assert) => {
    assert.plan(1);
    const instances = getSessionInstances();
    instances.user._bearer = undefined;
    assert.equals(instances.session.isValid, false);
    sandbox.restore();
  });
});

/**
 * Session.invalidate()
 */

test('Session.invalidate() should redirect to login host', (assert) => {
  assert.plan(2);
  const redirectFnSpy = sandbox.spy();
  const instances = getSessionInstances(redirectFnSpy);
  instances.session.invalidate();
  assert.equals(redirectFnSpy.callCount, 1);
  assert.equals(redirectFnSpy.getCall(0).args[0], 'http://login.mock.com/logout');
  sandbox.restore();
});

/**
 * Session.validate()
 */

test('Session.validate() should redirect to login host with a return URL', (assert) => {
  assert.plan(3);
  const redirectFnSpy = sandbox.spy();
  const pageURLStub = sandbox.stub();
  pageURLStub.returns('http://subdomain.mock.com');
  const instances = getSessionInstances(redirectFnSpy, pageURLStub);
  instances.session.validate();
  assert.equals(pageURLStub.callCount, 1);
  assert.equals(redirectFnSpy.callCount, 1);
  assert.equals(redirectFnSpy.getCall(0).args[0], 'http://login.mock.com/login?redirectUrl=http%3A%2F%2Fsubdomain.mock.com');
  sandbox.restore();
});
