const test = require('tape');
const Store = require('../../../src/services/store');
const Redirector = require('../../../src/services/redirector');
const mockCrossStore = require('../../mocks/store');
const API = require('../../../src/api').Sandbox;
const Client = require('../../../src/models/client');
const User = require('../../../src/models/user');
const Consumer = require('../../../src/services/consumer');
const sinon = require('sinon');

const sandbox = sinon.sandbox.create();

/**
 * Instances
 */
function getRedirectorInstances(sanbox, isCrossStorageAvailable) {
    const crossStoreInstances = mockCrossStore(sandbox);
    const store = new Store('domain', 'https://login.domain.com/hub', crossStoreInstances.Client, isCrossStorageAvailable, () => 'http://mock.app?loginToken=123456789');
    const api = new API('http://auth.mock.com');
    const client = new Client('id', 'secret');
    const consumer = new Consumer(client, api);
    const user = new User(store, consumer);
    return {store, user};
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
        const retrieveURLStub = sandbox.stub();
        retrieveURLStub.returns(() => 'http://mock.app.com/resource');
        const instances = getRedirectorInstances(sandbox, true);
        const redirector = new Redirector(instances.store, instances.user, redirectFnSpy, retrieveURLStub);

        redirector.authenticatedRedirect('http://mock.domain.com/resource?flag=true', '123456789');
        assert.equals(redirectFnSpy.callCount, 1);
        assert.equals(redirectFnSpy.getCall(0).args[0], 'http://mock.domain.com/resource?flag=true');
        sandbox.restore();
    });

    t.test('redirect to url with token parameter from user.bearer if store supports does not support cross storage', (assert) => {
        assert.plan(2);
        const redirectFnSpy = sandbox.spy();
        const retrieveURLStub = sandbox.stub();
        retrieveURLStub.returns(() => 'http://mock.app.com/resource');
        const instances = getRedirectorInstances(sandbox, false);
        instances.user._bearer = 'abcdefghij';
        const redirector = new Redirector(instances.store, instances.user, redirectFnSpy, retrieveURLStub);
        redirector.authenticatedRedirect('http://mock.reporting.com/resource');
        assert.equals(redirectFnSpy.callCount, 1);
        assert.equals(redirectFnSpy.getCall(0).args[0], 'http://mock.reporting.com/resource?loginToken=abcdefghij');
        sandbox.restore();
    });

    t.test('redirect to url with token parameter in function call if store supports does not support cross storage', (assert) => {
        assert.plan(2);
        const redirectFnSpy = sandbox.spy();
        const retrieveURLStub = sandbox.stub();
        retrieveURLStub.returns(() => 'http://mock.app.com/resource');
        const instances = getRedirectorInstances(sandbox, false);
        const redirector = new Redirector(instances.store, instances.user, redirectFnSpy, retrieveURLStub);

        redirector.authenticatedRedirect('http://mock.domain.com/resource', '123456789');
        assert.equals(redirectFnSpy.callCount, 1);
        assert.equals(redirectFnSpy.getCall(0).args[0], 'http://mock.domain.com/resource?loginToken=123456789');
        sandbox.restore();
    });

    t.test('redirect to url with ?loginToken parameter from URL if store supports does not support cross storage', (assert) => {
        assert.plan(2);
        const redirectFnSpy = sandbox.spy();
        const retrieveURLStub = sandbox.stub();
        retrieveURLStub.returns('http://mock.app.com/resource?loginToken=123456789');
        const instances = getRedirectorInstances(sandbox, false);
        const redirector = new Redirector(instances.store, instances.user, redirectFnSpy, retrieveURLStub);

        redirector.authenticatedRedirect('http://mock.domain.com/resource');
        assert.equals(redirectFnSpy.callCount, 1);
        assert.equals(redirectFnSpy.getCall(0).args[0], 'http://mock.domain.com/resource?loginToken=123456789');
        sandbox.restore();
    });

    t.test('redirect to url with &loginToken parameter from URL if store supports does not support cross storage', (assert) => {
      assert.plan(2);
      const redirectFnSpy = sandbox.spy();
      const retrieveURLStub = sandbox.stub();
      retrieveURLStub.returns('http://mock.app.com/resource?loginToken=123456789');
      const instances = getRedirectorInstances(sandbox, false);
      const redirector = new Redirector(instances.store, instances.user, redirectFnSpy, retrieveURLStub);

      redirector.authenticatedRedirect('http://mock.domain.com/resource?flag=true&foo=bar');
      assert.equals(redirectFnSpy.callCount, 1);
      assert.equals(redirectFnSpy.getCall(0).args[0], 'http://mock.domain.com/resource?flag=true&foo=bar&loginToken=123456789');
      sandbox.restore();
    });
});
