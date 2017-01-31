const test = require('tape');
const ProductionAPI = require('../../../src/api').Production;
const sinon = require('sinon');

const sandbox = sinon.sandbox.create();

/**
 * ProductionAPI.invoke()
 */
test('ProductionAPI.invoke() should call API fetcher with correct resources and payload', (assert) => {
  assert.plan(4);
  const clientStub = sandbox.stub();
  clientStub.returns(Promise.resolve({
    status: 200,
    json: () => Promise.resolve({
      key: 'value',
    }),
  }));
  const payload = {
    method: 'POST',
    body: {
      email: 'john.doe@mail.com',
    },
  };
  // Setup api
  const api = new ProductionAPI('http://auth.mock.com', clientStub);
  api.invoke('resource', payload).then((res) => {
    assert.deepEquals(res, {
      body: {
        key: 'value',
      },
      status: 200,
    });
  });
  // Assert spy calls
  assert.equals(clientStub.calledOnce, true);
  assert.equals(clientStub.getCall(0).args[0], 'http://auth.mock.com/resource');
  assert.deepEquals(clientStub.getCall(0).args[1], payload);
  sandbox.restore();
});


test('ProductionAPI.invoke() should handle 204 requests gracefully', (assert) => {
  assert.plan(4);
  const clientStub = sandbox.stub();
  clientStub.returns(Promise.resolve({
    status: 204,
  }));
  const payload = {
    method: 'POST',
    body: {
      email: 'john.doe@mail.com',
    },
  };
  // Setup api
  const api = new ProductionAPI('http://auth.mock.com', clientStub);
  api.invoke('resource', payload).then((res) => {
    assert.deepEquals(res, {
      body: {
      },
      status: 204,
    });
  });
  // Assert spy calls
  assert.equals(clientStub.calledOnce, true);
  assert.equals(clientStub.getCall(0).args[0], 'http://auth.mock.com/resource');
  assert.deepEquals(clientStub.getCall(0).args[1], payload);
  sandbox.restore();
});
