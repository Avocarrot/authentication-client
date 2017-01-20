const test = require('tape');
const ProductionAPI = require('../../../src/api').Production;
const sinon = require('sinon');

const sandbox = sinon.sandbox.create();

/**
 * ProductionAPI.invoke()
 */
test('ProductionAPI.invoke() should call API fetcher with correct resources and payload', (assert) => {
  assert.plan(3);
  // Prepare spy
  const clientSpy = sandbox.spy();
  const payload = {
    method: 'POST',
    body: {
      email: 'john.doe@mail.com',
    },
  };
  // Setup api
  const api = new ProductionAPI('http://auth.mock.com', clientSpy);
  api.invoke('resource', payload);
  // Assert spy calls
  assert.equals(clientSpy.calledOnce, true);
  assert.equals(clientSpy.getCall(0).args[0], 'http://auth.mock.com/resource');
  assert.deepEquals(clientSpy.getCall(0).args[1], payload);
  sandbox.restore();
});
