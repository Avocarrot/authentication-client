const test = require('tape');
const Store = require('../../../src/services/store');
const Redirector = require('../../../src/services/redirector');
const mockCrossStore = require('../../mocks/store');
const sinon = require('sinon');

const sandbox = sinon.sandbox.create();

/**
 * Instances
 */
function getRedirectorInstances(sanbox, isCrossStorageAvailable) {
  const crossStoreInstances = mockCrossStore(sandbox);
  const store = new Store('domain', 'https://login.domain.com/hub', crossStoreInstances.Client, isCrossStorageAvailable);
  return {
    store,
  };
}

/**
 * Redirector.constructor(store, redirectFn)
 */

test('Redirector.constructor(store, redirectFn) should throw an error for', (t) => {
  t.test('missing `store` configuration', (assert) => {
    assert.plan(1);
    try {
      new Redirector(Object());
    } catch (err) {
      assert.equals(err.message, '`store` should be instance of Store');
    }
  });
});

/**
 * Redirector.authenticatedRedirect(url, loginToken)
 */

test('Redirector.authenticatedRedirect(url, loginToken) should', (t) => {
  t.test('redirect to url if store supports cross storage', (assert) => {
    assert.plan(2);
    const redirectFnSpy = sandbox.spy();
    const instances = getRedirectorInstances(sandbox, true);
    const redirector = new Redirector(instances.store, redirectFnSpy);

    redirector.authenticatedRedirect('http://mock.domain.com/resource?flag=true', '123456789');
    assert.equals(redirectFnSpy.callCount, 1);
    assert.equals(redirectFnSpy.getCall(0).args[0], 'http://mock.domain.com/resource?flag=true');
    sandbox.restore();
  });

  t.test('redirect to url with ?loginToken parameter if store supports does not support cross storage', (assert) => {
    assert.plan(2);
    const redirectFnSpy = sandbox.spy();
    const instances = getRedirectorInstances(sandbox, false);
    const redirector = new Redirector(instances.store, redirectFnSpy);

    redirector.authenticatedRedirect('http://mock.domain.com/resource', '123456789');
    assert.equals(redirectFnSpy.callCount, 1);
    assert.equals(redirectFnSpy.getCall(0).args[0], 'http://mock.domain.com/resource?loginToken=123456789');
    sandbox.restore();
  });

  t.test('redirect to url with &loginToken parameter if store supports does not support cross storage', (assert) => {
    assert.plan(2);
    const redirectFnSpy = sandbox.spy();
    const instances = getRedirectorInstances(sandbox, false);
    const redirector = new Redirector(instances.store, redirectFnSpy);

    redirector.authenticatedRedirect('http://mock.domain.com/resource?flag=true&foo=bar', '123456789');
    assert.equals(redirectFnSpy.callCount, 1);
    assert.equals(redirectFnSpy.getCall(0).args[0], 'http://mock.domain.com/resource?flag=true&foo=bar&loginToken=123456789');
    sandbox.restore();
  });
});
