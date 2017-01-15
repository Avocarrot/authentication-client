'use strict';
const config = require('../config/default');
const Authenticator = require('./authenticator');
const Store = require('./services/store');
const User = require('./models/user');
const Client = require('./models/client');
const Consumer = require('./services/consumer');

/**
 * @namespace AuthenticationClient
 */
const AuthenticationClient = (function() {

  /**
   * Store instance
   * @private
   */
  const store = new Store(config.store.namespace);

  /**
   * Cached instances
   * @private
   */
  const instances = new Map();

  /**
   * Generates an AuthenticationClient instance
   * @private
   * @param {String} client_id - The client_id to set
   * @param {String} client_secret - The client_secret
   * @return {Authenticator}
   */
  const generateInstance = function(client_id, client_secret){
    const client = new Client(client_id, client_secret);
    const consumer =  new Consumer(client, config.host.endpoint, config.host.login_url);
    const user = new User(store, consumer);
    return new Authenticator(user, consumer);
  }

  return {
    /**
     * Creates an Authenticator instance for a client_id, client_secret combination
     * @function getInstanceFor
     * @memberof AuthenticationClient
     * @param {String} client_id - The Client id
     * @param {String} client_secret - The Client secret
     */
    getInstanceFor(client_id, client_secret) {
      const key = `${client_id}-${client_secret}`;
      if (instances.has(key)){
        return instances.get(key);
      }
      let instance = generateInstance(...arguments);
      instances.set(key, instance);
      return instance;
    }
  }
})();

module.exports = AuthenticationClient;
