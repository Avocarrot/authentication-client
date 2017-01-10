'use strict';
const config = require('../config/default');
const Authenticator = require('./utils/authenticator');
const Store = require('./utils/store');
const Client = require('./utils/client');
const Consumer = require('./utils/consumer');

/**
 * AuthenticationClient Factory
 * @module
 */
var AuthenticationClient = (function() {

  /**
   * Store object
   * @private
   */
  const store = new Store(config.store.namespace);

  return {
    /**
     * Creates an Authenticator instance for a client_id, client_secret combination
     * @param {String} client_id - The Client id
     * @param {String} client_secret - The Client secret
     */
    getInstanceFor(client_id, client_secret) {
      return new Authenticator(store, new Consumer(new Client(client_id, client_secret), config.host.endpoint, config.host.login_url));
    }
  }
})();

global.window.AuthenticationClient = AuthenticationClient;
