const config = require('../config/default');
const fetch = require('whatwg-fetch');
const Authenticator = require('./authenticator');
const Store = require('./services/store');
const User = require('./models/user');
const Client = require('./models/client');
const Consumer = require('./services/consumer');
const API = require('./api');
const SandboxDatabase = require('./databases/sandbox');
const UserFixtures = require('../fixtures/users.json');
const TokenFixtures = require('../fixtures/tokens.json');

/**
 * Global polyfill for {Promise}
 */
require('es6-promise').polyfill();

/**
 * @namespace AuthenticationClient
 */
const AuthenticationClient = (function immediate() {
  /**
   * Environment ENUM
   *
   * @enum
   * return {Object}
   *
   */
  const ENV = Object.freeze({
    Production: Symbol('Production'),
    Sandbox: Symbol('Sandbox'),
  });

  /**
   * Store instance
   *
   * @private
   * @return {Store}
   *
   */
  const store = new Store(config.store.namespace);

  /**
   * Cached instances
   *
   * @private
   * @return {Map}
   *
   */
  const instances = new Map();

  /**
   * Returns an API instaces for an ENV setup
   *
   * @private
   * @throws {Error}
   * @param {ENV} environment - The environment to set - Defaults to `Production`
   * @return {SandboxAPI|ProductionAPI}
   *
   */
  function getAPIFor(environment) {
    if (environment === ENV.Production) {
      return new API.Production(config.api.host, fetch);
    }
    if (environment === ENV.Sandbox) {
      return new API.Sandbox(new SandboxDatabase(UserFixtures, TokenFixtures));
    }
    throw new Error('Invalid `environment` passed');
  }

  /**
   * Generates an AuthenticationClient instance
   *
   * @private
   * @param {String} clientId - The client id to set
   * @param {String} clientSecret - The client secret
   * @param {ENV} environment - The environment to set
   * @return {Authenticator}
   *
   */
  function generateInstance(clientId, clientSecret, environment = ENV.Production) {
    const api = getAPIFor(environment);
    const client = new Client(clientId, clientSecret);
    const consumer = new Consumer(client, api);
    const user = new User(store, consumer);
    return new Authenticator(user, consumer);
  }

  return {

    /**
     * Environment enum
     *
     * @enum
     * @memberof AuthenticationClient
     *
     */
    Environment: ENV,

    /**
     * Creates an Authenticator instance for a clientId, clientSecret combination
     *
     * @function getInstanceFor
     * @memberof AuthenticationClient
     * @param {String} clientId - The Client id
     * @param {String} clientSecret - The Client secret
     * @param {ENV} environment - The environment to set
     * @return {Authenticator}
     *
     */
    getInstanceFor(clientId, clientSecret, environment) {
      const key = `${clientId}-${clientSecret}`;
      if (instances.has(key)) {
        return instances.get(key);
      }
      // Generate & cache new instance
      const instance = generateInstance(clientId, clientSecret, environment);
      instances.set(key, instance);
      return instance;
    },

    /**
     * Flushes cached instances
     *
     * @function reset
     * @memberof AuthenticationClient
     *
     */
    reset() {
      instances.clear();
    },

  };
})();

/* istanbul ignore next */

if (global.window) {
  global.window.AuthenticationClient = AuthenticationClient;
}

module.exports = AuthenticationClient;
