'use strict';
const Authenticator = require('./utils/authenticator');
const Store = require('./utils/store');
const Client = require('./utils/client');
const Consumer = require('./utils/consumer');

var AuthenticationClient = (function() {
  let client = new Client('id', 'secret');
  let consumer = new Consumer(client, 'http://localhost:3013', 'https://login.avocarrot.com');
  let store = new Store('avocarrot');

  return new Authenticator(store, consumer);
})();

global.window.AuthenticationClient = AuthenticationClient;
