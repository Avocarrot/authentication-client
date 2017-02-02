/**
 * Mocks for Store class
 * @private mockCrossStore
 */
function mockCrossStore(sandbox) {
  const ClientGetStub = sandbox.stub();
  const ClientSetStub = sandbox.stub();
  const ClientDelStub = sandbox.stub();
  return {
    Client: function CrossStorageClient() {
      return {
        onConnect: () => Promise.resolve(),
        get: ClientGetStub,
        set: ClientSetStub,
        del: ClientDelStub,
      };
    },
    ClientSetStub,
    ClientGetStub,
    ClientDelStub,
  };
}
module.exports = mockCrossStore;
