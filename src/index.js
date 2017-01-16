'use strict';
const assert = require('assert');
const config = require('../config/default');
const Authenticator = require('./authenticator');
const Store = require('./services/store');
const User = require('./models/user');
const Client = require('./models/client');
const Consumer = require('./services/consumer');
const API = require('./api');

/**
 * @namespace AuthenticationClient
 */
const AuthenticationClient = (function() {

  /**
   * Environment ENUM
   * @enum
   */
  const ENV = Object.freeze({
    PRODUCTION: Symbol.for('Production'),
    SANDBOX: Symbol.for('Sandbox'),
  });

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
   * @param {ENV} environment - The environment to set
   * @return {Authenticator}
   */
  var generateInstance = function(client_id, client_secret, environment){
    // Determine API handler based on environment
    const api = new API[Symbol.keyFor(environment)](config.api.host);
    // Generate components
    const client = new Client(client_id, client_secret);
    const consumer = new Consumer(client, api);
    const user = new User(store, consumer);
    // Compose and return Authenticator
    return new Authenticator(user, consumer);
  }

  return {

    /**
     * Environment enum
     * @memberof AuthenticationClient
     */
    Environment: ENV,

    /**
     * Creates an Authenticator instance for a client_id, client_secret combination
     * @function getInstanceFor
     * @memberof AuthenticationClient
     * @param {String} client_id - The Client id
     * @param {String} client_secret - The Client secret
     * @param {ENV} environment - The environment to set
     */
    getInstanceFor(client_id, client_secret, environment ) {
      const key = `${client_id}-${client_secret}`;
      // Avoid invalid environment setup
      assert(!ENV.hasOwnProperty(Symbol.keyFor(environment || ENV.PRODUCTION)), 'Invalid `Environment`');
      // Return cached instance
      if (instances.has(key)){
        return instances.get(key);
      }
      // Generate new instance
      let instance = generateInstance(client_id, client_secret, environment);
      instances.set(key, instance);
      return instance;
    }
  }
})();

module.exports = AuthenticationClient;
