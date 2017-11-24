const config = require('../config/default');
const Store = require('./services/store');
const User = require('./models/user');
const Client = require('./models/client');
const Session = require('./models/session');
const Authenticator = require('./models/authenticator');
const AdblockerDetector = require('./services/adblocker-detector');
const Redirector = require('./services/redirector');
const Consumer = require('./services/consumer');
const API = require('./api');
const SandboxDatabase = require('./databases/sandbox');
const UserFixtures = require('../fixtures/users.json');
const TokenFixtures = require('../fixtures/tokens.json');
const PasswordFixtures = require('../fixtures/passwords.json');
const ConfirmationFixtures = require('../fixtures/confirmations.json');

/**
 * CrossStorageHub
 * @see https://github.com/zendesk/cross-storage
 */
const CrossStorageHub = require('cross-storage').CrossStorageHub;

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
      return new API.Sandbox(new SandboxDatabase(UserFixtures, TokenFixtures, PasswordFixtures, ConfirmationFixtures));
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
   * @param {Store} store - The Store instance
   * @return {Authenticator}
   *
   */
  function generateInstance(clientId, clientSecret, environment = ENV.Production, loginHost = config.login.host, apiHost = config.api.host, storeDomain = config.store.domain) {
    const store = new Store(storeDomain, `${loginHost}/hub`);
    const api = getAPIFor(environment, apiHost);
    const client = new Client(clientId, clientSecret);
    const consumer = new Consumer(client, api);
    const user = new User(store, consumer);
    const session = new Session(user, loginHost);
    const authenticator = new Authenticator(consumer);
    const redirector = new Redirector(store, user);
    const adblockerDetector = new AdblockerDetector();
    return {
      user,
      session,
      authenticator,
      redirector,
      adblockerDetector,
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
     * Initializes CrossStorageHub
     *
     * @enum
     * @memberof AuthenticationClient
     *
     */
    initStorage(options) {
      return CrossStorageHub.init(options);
    },

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
     * @param {Store} params.store - The Store instance
     * @param {ENV} params.environment - The environment to set
     * @return {Authenticator}
     *
     */
    getInstanceFor({ clientId, clientSecret, environment, loginHost, apiHost }) {
      const key = `${clientId}-${clientSecret}`;
      // Return cached instance
      if (instances.has(key)) {
        return instances.get(key);
      }
      // Generate & cache new instance
      const instance = generateInstance(clientId, clientSecret, environment, loginHost, apiHost);
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

module.exports = AuthenticationClient;
