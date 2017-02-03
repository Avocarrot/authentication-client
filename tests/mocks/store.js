/**
 * Mocks for Store class
 * @private mockCrossStore
 */
function mockCrossStore(sandbox) {
  const ClientGetStub = sandbox.stub();
  const ClientSetStub = sandbox.stub();
  const ClientDelStub = sandbox.stub();
  const ClientConnectStub = sandbox.stub();
  ClientConnectStub.returns(Promise.resolve());
  ClientGetStub.returns(Promise.resolve());
  ClientSetStub.returns(Promise.resolve());
  ClientDelStub.returns(Promise.resolve());
  return {
    Client: function CrossStorageClient() {
      return {
        onConnect: ClientConnectStub,
        get: ClientGetStub,
        set: ClientSetStub,
        del: ClientDelStub,
      };
    },
    ClientConnectStub,
    ClientSetStub,
    ClientGetStub,
    ClientDelStub,
  };
}
module.exports = mockCrossStore;
