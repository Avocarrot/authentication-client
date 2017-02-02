/**
 * Mocks for Store class
 * @private mockCrossStore
 */
function mockCrossStore(sandbox) {
  const ClientGetStub = sandbox.stub();
  const ClientSetStub = sandbox.stub();
  const ClientDelStub = sandbox.stub();
  const HubInitStub = sandbox.stub();
  HubInitStub.returns(Promise.resolve());
  return {
    Hub: {
      init: HubInitStub,
    },
    Client: function CrossStorageClient() {
      return {
        onConnect: () => Promise.resolve(),
        get: ClientGetStub,
        set: ClientSetStub,
        del: ClientDelStub,
      };
    },
    HubInitStub,
    ClientSetStub,
    ClientGetStub,
    ClientDelStub,
  };
}
module.exports = mockCrossStore;
