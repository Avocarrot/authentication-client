const test = require('tape');
const Session = require('../../../src/models/session');
const User = require('../../../src/models/user');
const Client = require('../../../src/models/client');
const Store = require('../../../src/services/store');
const API = require('../../../src/api').Sandbox;
const Consumer = require('../../../src/services/consumer');
const sinon = require('sinon');

const sandbox = sinon.sandbox.create();

/**
 * Instances
 */
function getSessionInstances(redirectFn, pageURL) {
  const store = new Store('namespace');
  const api = new API('http://auth.mock.com');
  const client = new Client('id', 'secret');
  const consumer = new Consumer(client, api);
  const user = new User(store, consumer);
  const session = new Session(store, user, 'http://login.mock.com', redirectFn, pageURL);
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
  t.test('missing `store`', (assert) => {
    assert.plan(1);
    const instances = getSessionInstances();
    try {
      new Session(Object(), instances.user, 'http://login.mock.com');
    } catch (err) {
      assert.equals(err.message, '`store` should be instance of Store');
    }
  });

  t.test('missing `user`', (assert) => {
    assert.plan(1);
    const instances = getSessionInstances();
    try {
      new Session(instances.store, Object(), 'http://login.mock.com');
    } catch (err) {
      assert.equals(err.message, '`user` should be instance of User');
    }
  });

  t.test('missing `loginHost`', (assert) => {
    assert.plan(1);
    const instances = getSessionInstances();
    try {
      new Session(instances.store, instances.user);
    } catch (err) {
      assert.equals(err.message, '`loginHost` is not defined');
    }
  });
});

/**
 * Session.isValid
 */

test('Session.isValid() should return', (t) => {
  t.test('true for authenticated User', (assert) => {
    assert.plan(1);
    const instances = getSessionInstances();
    sandbox.stub(instances.store, 'get', () => undefined);
    assert.equals(instances.session.isValid, false);
    sandbox.restore();
  });

  t.test('false for non authenticated User', (assert) => {
    assert.plan(1);
    const instances = getSessionInstances();
    sandbox.stub(instances.store, 'get', () => 'rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7');
    assert.equals(instances.session.isValid, true);
    sandbox.restore();
  });
});

/**
 * Session.invalidate()
 */

test('Session.invalidate() should flush store data and redirect to login host', (assert) => {
  assert.plan(5);
  const redirectFnSpy = sandbox.spy();
  const instances = getSessionInstances(redirectFnSpy);
  const storeRemoveStub = sandbox.stub(instances.store, 'remove', () => {});
  instances.session.invalidate();
  assert.equals(storeRemoveStub.callCount, 2);
  assert.equals(storeRemoveStub.getCall(0).args[0], 'access_token');
  assert.equals(storeRemoveStub.getCall(1).args[0], 'refresh_token');
  assert.equals(redirectFnSpy.callCount, 1);
  assert.equals(redirectFnSpy.getCall(0).args[0], 'http://login.mock.com/login');
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
