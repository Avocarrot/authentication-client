'use strict';
const config = require('../config/default');
const Authenticator = require('./authenticator');
const Store = require('./services/store');
const User = require('./models/user');
const Client = require('./models/client');
const Consumer = require('./services/consumer');

/**
 * AuthenticationClient
 * @namespace
 */
var AuthenticationClient = (function() {

  /**
   * Store instance
   * @private
   */
  const store = new Store(config.store.namespace);

  return {
    /**
     * Creates an Authenticator instance for a client_id, client_secret combination
     * @function getInstanceFor
     * @memberof AuthenticationClient
     * @param {String} client_id - The Client id
     * @param {String} client_secret - The Client secret
     */
    getInstanceFor(client_id, client_secret) {
      const consumer =  new Consumer(new Client(client_id, client_secret), config.host.endpoint, config.host.login_url);
      const user = new User(store, consumer);
      const authenticator = new Authenticator(user, consumer);
      return authenticator;
    }
  }
})();

global.window.AuthenticationClient = AuthenticationClient;
