/**
 * Mocks for Store class
 * @private mockCrossStore
 */
function mockCrossStore(sandbox) {
  const ClientGetStub = sandbox.stub();
  const ClientSetStub = sandbox.stub();
  const ClientDelStub = sandbox.stub();
  const ClientConncectStub = sandbox.stub();
  ClientConncectStub.returns(Promise.resolve());
  return {
    Client: function CrossStorageClient() {
      return {
        onConnect: ClientConncectStub,
        get: ClientGetStub,
        set: ClientSetStub,
        del: ClientDelStub,
      };
    },
    ClientConncectStub,
    ClientSetStub,
    ClientGetStub,
    ClientDelStub,
  };
}
module.exports = mockCrossStore;
