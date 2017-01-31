const config = require('../config/default');
const Store = require('./services/store');
const User = require('./models/user');
const Client = require('./models/client');
const Session = require('./models/session');
const Authenticator = require('./models/authenticator');
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
 * Global polyfill for {fetch}
 */
require('whatwg-fetch');


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
  let store;

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
  function getAPIFor(environment, host = config.api.host) {
    if (environment === ENV.Production) {
      return new API.Production(host);
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
   * @param {String} loginHost - The login host URL
   * @param {String} apiHost - The API host
   * @param {String} namespace - The Store namespace prefix to use
   * @return {Authenticator}
   *
   */
  function generateInstance(clientId, clientSecret, environment = ENV.Production, loginHost = config.login.host, apiHost, namespace = config.store.namespace) {
    // Setup store instance once
    if (!(store instanceof Store)) {
      store = new Store(namespace);
    }
    // Configure and return models
    const api = getAPIFor(environment, apiHost);
    const client = new Client(clientId, clientSecret);
    const consumer = new Consumer(client, api);
    const user = new User(store, consumer);
    const session = new Session(store, user, loginHost);
    const authenticator = new Authenticator(consumer);
    return {
      user,
      session,
      authenticator,
    };
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
     * @param {Object} params
     * @param {String} params.clientId - The Client id
     * @param {String} params.clientSecret - The Client secret
     * @param {String} params.loginHost - The login host URL
     * @param {String} params.apiHost - The API host
     * @param {String} params.namespace - The Store namespace prefix to use
     * @param {ENV} params.environment - The environment to set
     * @return {Authenticator}
     *
     */
    getInstanceFor({ clientId, clientSecret, environment, loginHost, apiHost, namespace }) {
      const key = `${clientId}-${clientSecret}`;
      // Return cached instance
      if (instances.has(key)) {
        return instances.get(key);
      }
      // Generate & cache new instance
      const instance = generateInstance(clientId, clientSecret, environment, loginHost, apiHost, namespace);
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
