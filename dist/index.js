(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var config = require("../config/default");
var Store = require("./services/store");
var User = require("./models/user");
var Client = require("./models/client");
var Session = require("./models/session");
var Authenticator = require("./models/authenticator");
var Consumer = require("./services/consumer");
var API = require("./api");
var SandboxDatabase = require("./databases/sandbox");
var UserFixtures = require("../fixtures/users.json");
var TokenFixtures = require("../fixtures/tokens.json");
var PasswordFixtures = require("../fixtures/passwords.json");

/**
 * CrossStorageHub
 * @see https://github.com/zendesk/cross-storage
 */
var CrossStorageHub = require("cross-storage").CrossStorageHub;

/**
 * Global polyfill for {Promise}
 */
require("es6-promise").polyfill();

/**
 * Global polyfill for {fetch}
 */
require("whatwg-fetch");

/**
 * @namespace AuthenticationClient
 */
var AuthenticationClient = (function immediate() {
  /**
   * Environment ENUM
   *
   * @enum
   * return {Object}
   *
   */
  var ENV = Object.freeze({
    Production: Symbol("Production"),
    Sandbox: Symbol("Sandbox") });

  /**
   * Cached instances
   *
   * @private
   * @return {Map}
   *
   */
  var instances = new Map();

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
    var host = arguments[1] === undefined ? config.api.host : arguments[1];

    if (environment === ENV.Production) {
      return new API.Production(host);
    }
    if (environment === ENV.Sandbox) {
      return new API.Sandbox(new SandboxDatabase(UserFixtures, TokenFixtures, PasswordFixtures));
    }
    throw new Error("Invalid `environment` passed");
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
  function generateInstance(clientId, clientSecret, _x, _x2, apiHost, store) {
    var environment = arguments[2] === undefined ? ENV.Production : arguments[2];
    var loginHost = arguments[3] === undefined ? config.login.host : arguments[3];

    var api = getAPIFor(environment, apiHost);
    var client = new Client(clientId, clientSecret);
    var consumer = new Consumer(client, api);
    var user = new User(store, consumer);
    var session = new Session(user, loginHost);
    var authenticator = new Authenticator(consumer);
    return {
      user: user,
      session: session,
      authenticator: authenticator };
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
    initStorage: function initStorage(options) {
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
    getInstanceFor: function getInstanceFor(_ref) {
      var clientId = _ref.clientId;
      var clientSecret = _ref.clientSecret;
      var environment = _ref.environment;
      var loginHost = _ref.loginHost;
      var apiHost = _ref.apiHost;
      var _ref$store = _ref.store;
      var store = _ref$store === undefined ? new Store(config.store.domain, config.store.iframeHub) : _ref$store;

      var key = "" + clientId + "-" + clientSecret;
      // Return cached instance
      if (instances.has(key)) {
        return instances.get(key);
      }
      // Generate & cache new instance
      var instance = generateInstance(clientId, clientSecret, environment, loginHost, apiHost, store);
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
    reset: function reset() {
      instances.clear();
    } };
})();

/* istanbul ignore next */

if (global.window) {
  global.window.AuthenticationClient = AuthenticationClient;
}

module.exports = AuthenticationClient;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kbXRycy9jb2RlL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDNUMsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDMUMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3RDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzFDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzVDLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3hELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ2hELElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUN2RCxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN2RCxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUN6RCxJQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOzs7Ozs7QUFNL0QsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLGVBQWUsQ0FBQzs7Ozs7QUFLakUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDOzs7OztBQUtsQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7Ozs7O0FBTXhCLElBQU0sb0JBQW9CLEdBQUcsQ0FBQyxTQUFTLFNBQVMsR0FBRzs7Ozs7Ozs7QUFRakQsTUFBTSxHQUFHLEdBQUcs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Q0FBQztLQUNqQjs7Ozs7Ozs7O0FBU0QsU0FBSyxFQUFBLGlCQUFHO0FBQ04sZUFBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ25CLEVBRUYsQ0FBQztDQUNILENBQUEsRUFBRyxDQUFDOzs7O0FBSUwsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ2pCLFFBQU0sQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7Q0FDM0Q7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnL2RlZmF1bHQnKTtcbmNvbnN0IFN0b3JlID0gcmVxdWlyZSgnLi9zZXJ2aWNlcy9zdG9yZScpO1xuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4vbW9kZWxzL3VzZXInKTtcbmNvbnN0IENsaWVudCA9IHJlcXVpcmUoJy4vbW9kZWxzL2NsaWVudCcpO1xuY29uc3QgU2Vzc2lvbiA9IHJlcXVpcmUoJy4vbW9kZWxzL3Nlc3Npb24nKTtcbmNvbnN0IEF1dGhlbnRpY2F0b3IgPSByZXF1aXJlKCcuL21vZGVscy9hdXRoZW50aWNhdG9yJyk7XG5jb25zdCBDb25zdW1lciA9IHJlcXVpcmUoJy4vc2VydmljZXMvY29uc3VtZXInKTtcbmNvbnN0IEFQSSA9IHJlcXVpcmUoJy4vYXBpJyk7XG5jb25zdCBTYW5kYm94RGF0YWJhc2UgPSByZXF1aXJlKCcuL2RhdGFiYXNlcy9zYW5kYm94Jyk7XG5jb25zdCBVc2VyRml4dHVyZXMgPSByZXF1aXJlKCcuLi9maXh0dXJlcy91c2Vycy5qc29uJyk7XG5jb25zdCBUb2tlbkZpeHR1cmVzID0gcmVxdWlyZSgnLi4vZml4dHVyZXMvdG9rZW5zLmpzb24nKTtcbmNvbnN0IFBhc3N3b3JkRml4dHVyZXMgPSByZXF1aXJlKCcuLi9maXh0dXJlcy9wYXNzd29yZHMuanNvbicpO1xuXG4vKipcbiAqIENyb3NzU3RvcmFnZUh1YlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vemVuZGVzay9jcm9zcy1zdG9yYWdlXG4gKi9cbmNvbnN0IENyb3NzU3RvcmFnZUh1YiA9IHJlcXVpcmUoJ2Nyb3NzLXN0b3JhZ2UnKS5Dcm9zc1N0b3JhZ2VIdWI7XG5cbi8qKlxuICogR2xvYmFsIHBvbHlmaWxsIGZvciB7UHJvbWlzZX1cbiAqL1xucmVxdWlyZSgnZXM2LXByb21pc2UnKS5wb2x5ZmlsbCgpO1xuXG4vKipcbiAqIEdsb2JhbCBwb2x5ZmlsbCBmb3Ige2ZldGNofVxuICovXG5yZXF1aXJlKCd3aGF0d2ctZmV0Y2gnKTtcblxuXG4vKipcbiAqIEBuYW1lc3BhY2UgQXV0aGVudGljYXRpb25DbGllbnRcbiAqL1xuY29uc3QgQXV0aGVudGljYXRpb25DbGllbnQgPSAoZnVuY3Rpb24gaW1tZWRpYXRlKCkge1xuICAvKipcbiAgICogRW52aXJvbm1lbnQgRU5VTVxuICAgKlxuICAgKiBAZW51bVxuICAgKiByZXR1cm4ge09iamVjdH1cbiAgICpcbiAgICovXG4gIGNvbnN0IEVOViA9IE9iamVjdC5mcmVlemUoe1xuICAgIFByb2R1Y3Rpb246IFN5bWJvbCgnUHJvZHVjdGlvbicpLFxuICAgIFNhbmRib3g6IFN5bWJvbCgnU2FuZGJveCcpLFxuICB9KTtcblxuICAvKipcbiAgICogQ2FjaGVkIGluc3RhbmNlc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtNYXB9XG4gICAqXG4gICAqL1xuICBjb25zdCBpbnN0YW5jZXMgPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gQVBJIGluc3RhY2VzIGZvciBhbiBFTlYgc2V0dXBcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHRocm93cyB7RXJyb3J9XG4gICAqIEBwYXJhbSB7RU5WfSBlbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXQgLSBEZWZhdWx0cyB0byBgUHJvZHVjdGlvbmBcbiAgICogQHJldHVybiB7U2FuZGJveEFQSXxQcm9kdWN0aW9uQVBJfVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0QVBJRm9yKGVudmlyb25tZW50LCBob3N0ID0gY29uZmlnLmFwaS5ob3N0KSB7XG4gICAgaWYgKGVudmlyb25tZW50ID09PSBFTlYuUHJvZHVjdGlvbikge1xuICAgICAgcmV0dXJuIG5ldyBBUEkuUHJvZHVjdGlvbihob3N0KTtcbiAgICB9XG4gICAgaWYgKGVudmlyb25tZW50ID09PSBFTlYuU2FuZGJveCkge1xuICAgICAgcmV0dXJuIG5ldyBBUEkuU2FuZGJveChuZXcgU2FuZGJveERhdGFiYXNlKFVzZXJGaXh0dXJlcywgVG9rZW5GaXh0dXJlcywgUGFzc3dvcmRGaXh0dXJlcykpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYGVudmlyb25tZW50YCBwYXNzZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYW4gQXV0aGVudGljYXRpb25DbGllbnQgaW5zdGFuY2VcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudElkIC0gVGhlIGNsaWVudCBpZCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFNlY3JldCAtIFRoZSBjbGllbnQgc2VjcmV0XG4gICAqIEBwYXJhbSB7RU5WfSBlbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGxvZ2luSG9zdCAtIFRoZSBsb2dpbiBob3N0IFVSTFxuICAgKiBAcGFyYW0ge1N0cmluZ30gYXBpSG9zdCAtIFRoZSBBUEkgaG9zdFxuICAgKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZVxuICAgKiBAcmV0dXJuIHtBdXRoZW50aWNhdG9yfVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gZ2VuZXJhdGVJbnN0YW5jZShjbGllbnRJZCwgY2xpZW50U2VjcmV0LCBlbnZpcm9ubWVudCA9IEVOVi5Qcm9kdWN0aW9uLCBsb2dpbkhvc3QgPSBjb25maWcubG9naW4uaG9zdCwgYXBpSG9zdCwgc3RvcmUpIHtcbiAgICBjb25zdCBhcGkgPSBnZXRBUElGb3IoZW52aXJvbm1lbnQsIGFwaUhvc3QpO1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoY2xpZW50SWQsIGNsaWVudFNlY3JldCk7XG4gICAgY29uc3QgY29uc3VtZXIgPSBuZXcgQ29uc3VtZXIoY2xpZW50LCBhcGkpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgVXNlcihzdG9yZSwgY29uc3VtZXIpO1xuICAgIGNvbnN0IHNlc3Npb24gPSBuZXcgU2Vzc2lvbih1c2VyLCBsb2dpbkhvc3QpO1xuICAgIGNvbnN0IGF1dGhlbnRpY2F0b3IgPSBuZXcgQXV0aGVudGljYXRvcihjb25zdW1lcik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVzZXIsXG4gICAgICBzZXNzaW9uLFxuICAgICAgYXV0aGVudGljYXRvcixcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIC8qKlxuICAgICAqIEVudmlyb25tZW50IGVudW1cbiAgICAgKlxuICAgICAqIEBlbnVtXG4gICAgICogQG1lbWJlcm9mIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gICAgICpcbiAgICAgKi9cbiAgICBFbnZpcm9ubWVudDogRU5WLFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgQ3Jvc3NTdG9yYWdlSHViXG4gICAgICpcbiAgICAgKiBAZW51bVxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqXG4gICAgICovXG4gICAgaW5pdFN0b3JhZ2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIENyb3NzU3RvcmFnZUh1Yi5pbml0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIEF1dGhlbnRpY2F0b3IgaW5zdGFuY2UgZm9yIGEgY2xpZW50SWQsIGNsaWVudFNlY3JldCBjb21iaW5hdGlvblxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uIGdldEluc3RhbmNlRm9yXG4gICAgICogQG1lbWJlcm9mIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuY2xpZW50SWQgLSBUaGUgQ2xpZW50IGlkXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5jbGllbnRTZWNyZXQgLSBUaGUgQ2xpZW50IHNlY3JldFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubG9naW5Ib3N0IC0gVGhlIGxvZ2luIGhvc3QgVVJMXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5hcGlIb3N0IC0gVGhlIEFQSSBob3N0XG4gICAgICogQHBhcmFtIHtTdG9yZX0gcGFyYW1zLnN0b3JlIC0gVGhlIFN0b3JlIGluc3RhbmNlXG4gICAgICogQHBhcmFtIHtFTlZ9IHBhcmFtcy5lbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXRcbiAgICAgKiBAcmV0dXJuIHtBdXRoZW50aWNhdG9yfVxuICAgICAqXG4gICAgICovXG4gICAgZ2V0SW5zdGFuY2VGb3IoeyBjbGllbnRJZCwgY2xpZW50U2VjcmV0LCBlbnZpcm9ubWVudCwgbG9naW5Ib3N0LCBhcGlIb3N0LCBzdG9yZSA9IG5ldyBTdG9yZShjb25maWcuc3RvcmUuZG9tYWluLCBjb25maWcuc3RvcmUuaWZyYW1lSHViKSB9KSB7XG4gICAgICBjb25zdCBrZXkgPSBgJHtjbGllbnRJZH0tJHtjbGllbnRTZWNyZXR9YDtcbiAgICAgIC8vIFJldHVybiBjYWNoZWQgaW5zdGFuY2VcbiAgICAgIGlmIChpbnN0YW5jZXMuaGFzKGtleSkpIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlcy5nZXQoa2V5KTtcbiAgICAgIH1cbiAgICAgIC8vIEdlbmVyYXRlICYgY2FjaGUgbmV3IGluc3RhbmNlXG4gICAgICBjb25zdCBpbnN0YW5jZSA9IGdlbmVyYXRlSW5zdGFuY2UoY2xpZW50SWQsIGNsaWVudFNlY3JldCwgZW52aXJvbm1lbnQsIGxvZ2luSG9zdCwgYXBpSG9zdCwgc3RvcmUpO1xuICAgICAgaW5zdGFuY2VzLnNldChrZXksIGluc3RhbmNlKTtcbiAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmx1c2hlcyBjYWNoZWQgaW5zdGFuY2VzXG4gICAgICpcbiAgICAgKiBAZnVuY3Rpb24gcmVzZXRcbiAgICAgKiBAbWVtYmVyb2YgQXV0aGVudGljYXRpb25DbGllbnRcbiAgICAgKlxuICAgICAqL1xuICAgIHJlc2V0KCkge1xuICAgICAgaW5zdGFuY2VzLmNsZWFyKCk7XG4gICAgfSxcblxuICB9O1xufSkoKTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblxuaWYgKGdsb2JhbC53aW5kb3cpIHtcbiAgZ2xvYmFsLndpbmRvdy5BdXRoZW50aWNhdGlvbkNsaWVudCA9IEF1dGhlbnRpY2F0aW9uQ2xpZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGhlbnRpY2F0aW9uQ2xpZW50O1xuIl19
},{"../config/default":2,"../fixtures/passwords.json":3,"../fixtures/tokens.json":4,"../fixtures/users.json":5,"./api":21,"./databases/sandbox":24,"./models/authenticator":25,"./models/client":26,"./models/session":27,"./models/user":28,"./services/consumer":29,"./services/store":31,"cross-storage":9,"es6-promise":10,"whatwg-fetch":20}],2:[function(require,module,exports){
"use strict";

module.exports = {
  api: {
    host: "//auth.avocarrot.com" },
  login: {
    host: "//login.avocarrot.com" },
  store: {
    domain: "avocarrot",
    iframeHub: "//login.avocarrot.com/hub" } };

},{}],3:[function(require,module,exports){
module.exports=[
  {
    "user_id": "44d2c8e0-762b-4fa5-8571-097c81c3130d",
    "token": "yJhbGcieOiJIUzI1NiIsIJ9nR5cCI6IkpXVC"
  }
]

},{}],4:[function(require,module,exports){
module.exports=[
  {
    "user_id": "44d2c8e0-762b-4fa5-8571-097c81c3130d",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "access_token": "rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7"
  }
]

},{}],5:[function(require,module,exports){
module.exports=[
  {
    "id": "44d2c8e0-762b-4fa5-8571-097c81c3130d",
    "publisher_id": "55f5c8e0-762b-4fa5-8571-197c8183130a",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@mail.com",
    "password": "qwerty123"
  }
]

},{}],6:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":19}],7:[function(require,module,exports){
;(function(root) {
  /**
   * Constructs a new cross storage client given the url to a hub. By default,
   * an iframe is created within the document body that points to the url. It
   * also accepts an options object, which may include a timeout, frameId, and
   * promise. The timeout, in milliseconds, is applied to each request and
   * defaults to 5000ms. The options object may also include a frameId,
   * identifying an existing frame on which to install its listeners. If the
   * promise key is supplied the constructor for a Promise, that Promise library
   * will be used instead of the default window.Promise.
   *
   * @example
   * var storage = new CrossStorageClient('https://store.example.com/hub.html');
   *
   * @example
   * var storage = new CrossStorageClient('https://store.example.com/hub.html', {
   *   timeout: 5000,
   *   frameId: 'storageFrame'
   * });
   *
   * @constructor
   *
   * @param {string} url    The url to a cross storage hub
   * @param {object} [opts] An optional object containing additional options,
   *                        including timeout, frameId, and promise
   *
   * @property {string}   _id        A UUID v4 id
   * @property {function} _promise   The Promise object to use
   * @property {string}   _frameId   The id of the iFrame pointing to the hub url
   * @property {string}   _origin    The hub's origin
   * @property {object}   _requests  Mapping of request ids to callbacks
   * @property {bool}     _connected Whether or not it has connected
   * @property {bool}     _closed    Whether or not the client has closed
   * @property {int}      _count     Number of requests sent
   * @property {function} _listener  The listener added to the window
   * @property {Window}   _hub       The hub window
   */
  function CrossStorageClient(url, opts) {
    opts = opts || {};

    this._id        = CrossStorageClient._generateUUID();
    this._promise   = opts.promise || Promise;
    this._frameId   = opts.frameId || 'CrossStorageClient-' + this._id;
    this._origin    = CrossStorageClient._getOrigin(url);
    this._requests  = {};
    this._connected = false;
    this._closed    = false;
    this._count     = 0;
    this._timeout   = opts.timeout || 5000;
    this._listener  = null;

    this._installListener();

    var frame;
    if (opts.frameId) {
      frame = document.getElementById(opts.frameId);
    }

    // If using a passed iframe, poll the hub for a ready message
    if (frame) {
      this._poll();
    }

    // Create the frame if not found or specified
    frame = frame || this._createFrame(url);
    this._hub = frame.contentWindow;
  }

  /**
   * The styles to be applied to the generated iFrame. Defines a set of properties
   * that hide the element by positioning it outside of the visible area, and
   * by modifying its display.
   *
   * @member {Object}
   */
  CrossStorageClient.frameStyle = {
    display:  'none',
    position: 'absolute',
    top:      '-999px',
    left:     '-999px'
  };

  /**
   * Returns the origin of an url, with cross browser support. Accommodates
   * the lack of location.origin in IE, as well as the discrepancies in the
   * inclusion of the port when using the default port for a protocol, e.g.
   * 443 over https. Defaults to the origin of window.location if passed a
   * relative path.
   *
   * @param   {string} url The url to a cross storage hub
   * @returns {string} The origin of the url
   */
  CrossStorageClient._getOrigin = function(url) {
    var uri, protocol, origin;

    uri = document.createElement('a');
    uri.href = url;

    if (!uri.host) {
      uri = window.location;
    }

    if (!uri.protocol || uri.protocol === ':') {
      protocol = window.location.protocol;
    } else {
      protocol = uri.protocol;
    }

    origin = protocol + '//' + uri.host;
    origin = origin.replace(/:80$|:443$/, '');

    return origin;
  };

  /**
   * UUID v4 generation, taken from: http://stackoverflow.com/questions/
   * 105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
   *
   * @returns {string} A UUID v4 string
   */
  CrossStorageClient._generateUUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);

      return v.toString(16);
    });
  };

  /**
   * Returns a promise that is fulfilled when a connection has been established
   * with the cross storage hub. Its use is required to avoid sending any
   * requests prior to initialization being complete.
   *
   * @returns {Promise} A promise that is resolved on connect
   */
  CrossStorageClient.prototype.onConnect = function() {
    var client = this;

    if (this._connected) {
      return this._promise.resolve();
    } else if (this._closed) {
      return this._promise.reject(new Error('CrossStorageClient has closed'));
    }

    // Queue connect requests for client re-use
    if (!this._requests.connect) {
      this._requests.connect = [];
    }

    return new this._promise(function(resolve, reject) {
      var timeout = setTimeout(function() {
        reject(new Error('CrossStorageClient could not connect'));
      }, client._timeout);

      client._requests.connect.push(function(err) {
        clearTimeout(timeout);
        if (err) return reject(err);

        resolve();
      });
    });
  };

  /**
   * Sets a key to the specified value. Returns a promise that is fulfilled on
   * success, or rejected if any errors setting the key occurred, or the request
   * timed out.
   *
   * @param   {string}  key   The key to set
   * @param   {*}       value The value to assign
   * @returns {Promise} A promise that is settled on hub response or timeout
   */
  CrossStorageClient.prototype.set = function(key, value) {
    return this._request('set', {
      key:   key,
      value: value
    });
  };

  /**
   * Accepts one or more keys for which to retrieve their values. Returns a
   * promise that is settled on hub response or timeout. On success, it is
   * fulfilled with the value of the key if only passed a single argument.
   * Otherwise it's resolved with an array of values. On failure, it is rejected
   * with the corresponding error message.
   *
   * @param   {...string} key The key to retrieve
   * @returns {Promise}   A promise that is settled on hub response or timeout
   */
  CrossStorageClient.prototype.get = function(key) {
    var args = Array.prototype.slice.call(arguments);

    return this._request('get', {keys: args});
  };

  /**
   * Accepts one or more keys for deletion. Returns a promise that is settled on
   * hub response or timeout.
   *
   * @param   {...string} key The key to delete
   * @returns {Promise}   A promise that is settled on hub response or timeout
   */
  CrossStorageClient.prototype.del = function() {
    var args = Array.prototype.slice.call(arguments);

    return this._request('del', {keys: args});
  };

  /**
   * Returns a promise that, when resolved, indicates that all localStorage
   * data has been cleared.
   *
   * @returns {Promise} A promise that is settled on hub response or timeout
   */
  CrossStorageClient.prototype.clear = function() {
    return this._request('clear');
  };

  /**
   * Returns a promise that, when resolved, passes an array of all keys
   * currently in storage.
   *
   * @returns {Promise} A promise that is settled on hub response or timeout
   */
  CrossStorageClient.prototype.getKeys = function() {
    return this._request('getKeys');
  };

  /**
   * Deletes the iframe and sets the connected state to false. The client can
   * no longer be used after being invoked.
   */
  CrossStorageClient.prototype.close = function() {
    var frame = document.getElementById(this._frameId);
    if (frame) {
      frame.parentNode.removeChild(frame);
    }

    // Support IE8 with detachEvent
    if (window.removeEventListener) {
      window.removeEventListener('message', this._listener, false);
    } else {
      window.detachEvent('onmessage', this._listener);
    }

    this._connected = false;
    this._closed = true;
  };

  /**
   * Installs the necessary listener for the window message event. When a message
   * is received, the client's _connected status is changed to true, and the
   * onConnect promise is fulfilled. Given a response message, the callback
   * corresponding to its request is invoked. If response.error holds a truthy
   * value, the promise associated with the original request is rejected with
   * the error. Otherwise the promise is fulfilled and passed response.result.
   *
   * @private
   */
  CrossStorageClient.prototype._installListener = function() {
    var client = this;

    this._listener = function(message) {
      var i, origin, error, response;

      // Ignore invalid messages or those after the client has closed
      if (client._closed || !message.data || typeof message.data !== 'string') {
        return;
      }

      // postMessage returns the string "null" as the origin for "file://"
      origin = (message.origin === 'null') ? 'file://' : message.origin;

      // Ignore messages not from the correct origin
      if (origin !== client._origin) return;

      // LocalStorage isn't available in the hub
      if (message.data === 'cross-storage:unavailable') {
        if (!client._closed) client.close();
        if (!client._requests.connect) return;

        error = new Error('Closing client. Could not access localStorage in hub.');
        for (i = 0; i < client._requests.connect.length; i++) {
          client._requests.connect[i](error);
        }

        return;
      }

      // Handle initial connection
      if (message.data.indexOf('cross-storage:') !== -1 && !client._connected) {
        client._connected = true;
        if (!client._requests.connect) return;

        for (i = 0; i < client._requests.connect.length; i++) {
          client._requests.connect[i](error);
        }
        delete client._requests.connect;
      }

      if (message.data === 'cross-storage:ready') return;

      // All other messages
      try {
        response = JSON.parse(message.data);
      } catch(e) {
        return;
      }

      if (!response.id) return;

      if (client._requests[response.id]) {
        client._requests[response.id](response.error, response.result);
      }
    };

    // Support IE8 with attachEvent
    if (window.addEventListener) {
      window.addEventListener('message', this._listener, false);
    } else {
      window.attachEvent('onmessage', this._listener);
    }
  };

  /**
   * Invoked when a frame id was passed to the client, rather than allowing
   * the client to create its own iframe. Polls the hub for a ready event to
   * establish a connected state.
   */
  CrossStorageClient.prototype._poll = function() {
    var client, interval, targetOrigin;

    client = this;

    // postMessage requires that the target origin be set to "*" for "file://"
    targetOrigin = (client._origin === 'file://') ? '*' : client._origin;

    interval = setInterval(function() {
      if (client._connected) return clearInterval(interval);
      if (!client._hub) return;

      client._hub.postMessage('cross-storage:poll', targetOrigin);
    }, 1000);
  };

  /**
   * Creates a new iFrame containing the hub. Applies the necessary styles to
   * hide the element from view, prior to adding it to the document body.
   * Returns the created element.
   *
   * @private
   *
   * @param  {string}            url The url to the hub
   * returns {HTMLIFrameElement} The iFrame element itself
   */
  CrossStorageClient.prototype._createFrame = function(url) {
    var frame, key;

    frame = window.document.createElement('iframe');
    frame.id = this._frameId;

    // Style the iframe
    for (key in CrossStorageClient.frameStyle) {
      if (CrossStorageClient.frameStyle.hasOwnProperty(key)) {
        frame.style[key] = CrossStorageClient.frameStyle[key];
      }
    }

    window.document.body.appendChild(frame);
    frame.src = url;

    return frame;
  };

  /**
   * Sends a message containing the given method and params to the hub. Stores
   * a callback in the _requests object for later invocation on message, or
   * deletion on timeout. Returns a promise that is settled in either instance.
   *
   * @private
   *
   * @param   {string}  method The method to invoke
   * @param   {*}       params The arguments to pass
   * @returns {Promise} A promise that is settled on hub response or timeout
   */
  CrossStorageClient.prototype._request = function(method, params) {
    var req, client;

    if (this._closed) {
      return this._promise.reject(new Error('CrossStorageClient has closed'));
    }

    client = this;
    client._count++;

    req = {
      id:     this._id + ':' + client._count,
      method: 'cross-storage:' + method,
      params: params
    };

    return new this._promise(function(resolve, reject) {
      var timeout, originalToJSON, targetOrigin;

      // Timeout if a response isn't received after 4s
      timeout = setTimeout(function() {
        if (!client._requests[req.id]) return;

        delete client._requests[req.id];
        reject(new Error('Timeout: could not perform ' + req.method));
      }, client._timeout);

      // Add request callback
      client._requests[req.id] = function(err, result) {
        clearTimeout(timeout);
        delete client._requests[req.id];
        if (err) return reject(new Error(err));
        resolve(result);
      };

      // In case we have a broken Array.prototype.toJSON, e.g. because of
      // old versions of prototype
      if (Array.prototype.toJSON) {
        originalToJSON = Array.prototype.toJSON;
        Array.prototype.toJSON = null;
      }

      // postMessage requires that the target origin be set to "*" for "file://"
      targetOrigin = (client._origin === 'file://') ? '*' : client._origin;

      // Send serialized message
      client._hub.postMessage(JSON.stringify(req), targetOrigin);

      // Restore original toJSON
      if (originalToJSON) {
        Array.prototype.toJSON = originalToJSON;
      }
    });
  };

  /**
   * Export for various environments.
   */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrossStorageClient;
  } else if (typeof exports !== 'undefined') {
    exports.CrossStorageClient = CrossStorageClient;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return CrossStorageClient;
    });
  } else {
    root.CrossStorageClient = CrossStorageClient;
  }
}(this));

},{}],8:[function(require,module,exports){
;(function(root) {
  var CrossStorageHub = {};

  /**
   * Accepts an array of objects with two keys: origin and allow. The value
   * of origin is expected to be a RegExp, and allow, an array of strings.
   * The cross storage hub is then initialized to accept requests from any of
   * the matching origins, allowing access to the associated lists of methods.
   * Methods may include any of: get, set, del, getKeys and clear. A 'ready'
   * message is sent to the parent window once complete.
   *
   * @example
   * // Subdomain can get, but only root domain can set and del
   * CrossStorageHub.init([
   *   {origin: /\.example.com$/,        allow: ['get']},
   *   {origin: /:(www\.)?example.com$/, allow: ['get', 'set', 'del']}
   * ]);
   *
   * @param {array} permissions An array of objects with origin and allow
   */
  CrossStorageHub.init = function(permissions) {
    var available = true;

    // Return if localStorage is unavailable, or third party
    // access is disabled
    try {
      if (!window.localStorage) available = false;
    } catch (e) {
      available = false;
    }

    if (!available) {
      try {
        return window.parent.postMessage('cross-storage:unavailable', '*');
      } catch (e) {
        return;
      }
    }

    CrossStorageHub._permissions = permissions || [];
    CrossStorageHub._installListener();
    window.parent.postMessage('cross-storage:ready', '*');
  };

  /**
   * Installs the necessary listener for the window message event. Accommodates
   * IE8 and up.
   *
   * @private
   */
  CrossStorageHub._installListener = function() {
    var listener = CrossStorageHub._listener;
    if (window.addEventListener) {
      window.addEventListener('message', listener, false);
    } else {
      window.attachEvent('onmessage', listener);
    }
  };

  /**
   * The message handler for all requests posted to the window. It ignores any
   * messages having an origin that does not match the originally supplied
   * pattern. Given a JSON object with one of get, set, del or getKeys as the
   * method, the function performs the requested action and returns its result.
   *
   * @param {MessageEvent} message A message to be processed
   */
  CrossStorageHub._listener = function(message) {
    var origin, targetOrigin, request, method, error, result, response;

    // postMessage returns the string "null" as the origin for "file://"
    origin = (message.origin === 'null') ? 'file://' : message.origin;

    // Handle polling for a ready message
    if (message.data === 'cross-storage:poll') {
      return window.parent.postMessage('cross-storage:ready', message.origin);
    }

    // Ignore the ready message when viewing the hub directly
    if (message.data === 'cross-storage:ready') return;

    // Check whether message.data is a valid json
    try {
      request = JSON.parse(message.data);
    } catch (err) {
      return;
    }

    // Check whether request.method is a string
    if (!request || typeof request.method !== 'string') {
      return;
    }

    method = request.method.split('cross-storage:')[1];

    if (!method) {
      return;
    } else if (!CrossStorageHub._permitted(origin, method)) {
      error = 'Invalid permissions for ' + method;
    } else {
      try {
        result = CrossStorageHub['_' + method](request.params);
      } catch (err) {
        error = err.message;
      }
    }

    response = JSON.stringify({
      id: request.id,
      error: error,
      result: result
    });

    // postMessage requires that the target origin be set to "*" for "file://"
    targetOrigin = (origin === 'file://') ? '*' : origin;

    window.parent.postMessage(response, targetOrigin);
  };

  /**
   * Returns a boolean indicating whether or not the requested method is
   * permitted for the given origin. The argument passed to method is expected
   * to be one of 'get', 'set', 'del' or 'getKeys'.
   *
   * @param   {string} origin The origin for which to determine permissions
   * @param   {string} method Requested action
   * @returns {bool}   Whether or not the request is permitted
   */
  CrossStorageHub._permitted = function(origin, method) {
    var available, i, entry, match;

    available = ['get', 'set', 'del', 'clear', 'getKeys'];
    if (!CrossStorageHub._inArray(method, available)) {
      return false;
    }

    for (i = 0; i < CrossStorageHub._permissions.length; i++) {
      entry = CrossStorageHub._permissions[i];
      if (!(entry.origin instanceof RegExp) || !(entry.allow instanceof Array)) {
        continue;
      }

      match = entry.origin.test(origin);
      if (match && CrossStorageHub._inArray(method, entry.allow)) {
        return true;
      }
    }

    return false;
  };

  /**
   * Sets a key to the specified value.
   *
   * @param {object} params An object with key and value
   */
  CrossStorageHub._set = function(params) {
    window.localStorage.setItem(params.key, params.value);
  };

  /**
   * Accepts an object with an array of keys for which to retrieve their values.
   * Returns a single value if only one key was supplied, otherwise it returns
   * an array. Any keys not set result in a null element in the resulting array.
   *
   * @param   {object} params An object with an array of keys
   * @returns {*|*[]}  Either a single value, or an array
   */
  CrossStorageHub._get = function(params) {
    var storage, result, i, value;

    storage = window.localStorage;
    result = [];

    for (i = 0; i < params.keys.length; i++) {
      try {
        value = storage.getItem(params.keys[i]);
      } catch (e) {
        value = null;
      }

      result.push(value);
    }

    return (result.length > 1) ? result : result[0];
  };

  /**
   * Deletes all keys specified in the array found at params.keys.
   *
   * @param {object} params An object with an array of keys
   */
  CrossStorageHub._del = function(params) {
    for (var i = 0; i < params.keys.length; i++) {
      window.localStorage.removeItem(params.keys[i]);
    }
  };

  /**
   * Clears localStorage.
   */
  CrossStorageHub._clear = function() {
    window.localStorage.clear();
  };

  /**
   * Returns an array of all keys stored in localStorage.
   *
   * @returns {string[]} The array of keys
   */
  CrossStorageHub._getKeys = function(params) {
    var i, length, keys;

    keys = [];
    length = window.localStorage.length;

    for (i = 0; i < length; i++) {
      keys.push(window.localStorage.key(i));
    }

    return keys;
  };

  /**
   * Returns whether or not a value is present in the array. Consists of an
   * alternative to extending the array prototype for indexOf, since it's
   * unavailable for IE8.
   *
   * @param   {*}    value The value to find
   * @parma   {[]*}  array The array in which to search
   * @returns {bool} Whether or not the value was found
   */
  CrossStorageHub._inArray = function(value, array) {
    for (var i = 0; i < array.length; i++) {
      if (value === array[i]) return true;
    }

    return false;
  };

  /**
   * A cross-browser version of Date.now compatible with IE8 that avoids
   * modifying the Date object.
   *
   * @return {int} The current timestamp in milliseconds
   */
  CrossStorageHub._now = function() {
    if (typeof Date.now === 'function') {
      return Date.now();
    }

    return new Date().getTime();
  };

  /**
   * Export for various environments.
   */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrossStorageHub;
  } else if (typeof exports !== 'undefined') {
    exports.CrossStorageHub = CrossStorageHub;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return CrossStorageHub;
    });
  } else {
    root.CrossStorageHub = CrossStorageHub;
  }
}(this));

},{}],9:[function(require,module,exports){
module.exports = {
  CrossStorageClient: require('./client.js'),
  CrossStorageHub:    require('./hub.js')
};

},{"./client.js":7,"./hub.js":8}],10:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.0.5
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2VzNi1wcm9taXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBvdmVydmlldyBlczYtcHJvbWlzZSAtIGEgdGlueSBpbXBsZW1lbnRhdGlvbiBvZiBQcm9taXNlcy9BKy5cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE0IFllaHVkYSBLYXR6LCBUb20gRGFsZSwgU3RlZmFuIFBlbm5lciBhbmQgY29udHJpYnV0b3JzIChDb252ZXJzaW9uIHRvIEVTNiBBUEkgYnkgSmFrZSBBcmNoaWJhbGQpXG4gKiBAbGljZW5zZSAgIExpY2Vuc2VkIHVuZGVyIE1JVCBsaWNlbnNlXG4gKiAgICAgICAgICAgIFNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vc3RlZmFucGVubmVyL2VzNi1wcm9taXNlL21hc3Rlci9MSUNFTlNFXG4gKiBAdmVyc2lvbiAgIDQuMC41XG4gKi9cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgICAoZ2xvYmFsLkVTNlByb21pc2UgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG5cbnZhciBfaXNBcnJheSA9IHVuZGVmaW5lZDtcbmlmICghQXJyYXkuaXNBcnJheSkge1xuICBfaXNBcnJheSA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcbn0gZWxzZSB7XG4gIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbn1cblxudmFyIGlzQXJyYXkgPSBfaXNBcnJheTtcblxudmFyIGxlbiA9IDA7XG52YXIgdmVydHhOZXh0ID0gdW5kZWZpbmVkO1xudmFyIGN1c3RvbVNjaGVkdWxlckZuID0gdW5kZWZpbmVkO1xuXG52YXIgYXNhcCA9IGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICBxdWV1ZVtsZW5dID0gY2FsbGJhY2s7XG4gIHF1ZXVlW2xlbiArIDFdID0gYXJnO1xuICBsZW4gKz0gMjtcbiAgaWYgKGxlbiA9PT0gMikge1xuICAgIC8vIElmIGxlbiBpcyAyLCB0aGF0IG1lYW5zIHRoYXQgd2UgbmVlZCB0byBzY2hlZHVsZSBhbiBhc3luYyBmbHVzaC5cbiAgICAvLyBJZiBhZGRpdGlvbmFsIGNhbGxiYWNrcyBhcmUgcXVldWVkIGJlZm9yZSB0aGUgcXVldWUgaXMgZmx1c2hlZCwgdGhleVxuICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICBpZiAoY3VzdG9tU2NoZWR1bGVyRm4pIHtcbiAgICAgIGN1c3RvbVNjaGVkdWxlckZuKGZsdXNoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NoZWR1bGVGbHVzaCgpO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gc2V0U2NoZWR1bGVyKHNjaGVkdWxlRm4pIHtcbiAgY3VzdG9tU2NoZWR1bGVyRm4gPSBzY2hlZHVsZUZuO1xufVxuXG5mdW5jdGlvbiBzZXRBc2FwKGFzYXBGbikge1xuICBhc2FwID0gYXNhcEZuO1xufVxuXG52YXIgYnJvd3NlcldpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdW5kZWZpbmVkO1xudmFyIGJyb3dzZXJHbG9iYWwgPSBicm93c2VyV2luZG93IHx8IHt9O1xudmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBpc05vZGUgPSB0eXBlb2Ygc2VsZiA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICh7fSkudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xuXG4vLyB0ZXN0IGZvciB3ZWIgd29ya2VyIGJ1dCBub3QgaW4gSUUxMFxudmFyIGlzV29ya2VyID0gdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAndW5kZWZpbmVkJztcblxuLy8gbm9kZVxuZnVuY3Rpb24gdXNlTmV4dFRpY2soKSB7XG4gIC8vIG5vZGUgdmVyc2lvbiAwLjEwLnggZGlzcGxheXMgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdoZW4gbmV4dFRpY2sgaXMgdXNlZCByZWN1cnNpdmVseVxuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1am9qcy93aGVuL2lzc3Vlcy80MTAgZm9yIGRldGFpbHNcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gIH07XG59XG5cbi8vIHZlcnR4XG5mdW5jdGlvbiB1c2VWZXJ0eFRpbWVyKCkge1xuICBpZiAodHlwZW9mIHZlcnR4TmV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmVydHhOZXh0KGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbn1cblxuZnVuY3Rpb24gdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBub2RlLmRhdGEgPSBpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMjtcbiAgfTtcbn1cblxuLy8gd2ViIHdvcmtlclxuZnVuY3Rpb24gdXNlTWVzc2FnZUNoYW5uZWwoKSB7XG4gIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZmx1c2g7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gIC8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIGVzNi1wcm9taXNlIHdpbGwgYmUgdW5hZmZlY3RlZCBieVxuICAvLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbiAgdmFyIGdsb2JhbFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnbG9iYWxTZXRUaW1lb3V0KGZsdXNoLCAxKTtcbiAgfTtcbn1cblxudmFyIHF1ZXVlID0gbmV3IEFycmF5KDEwMDApO1xuZnVuY3Rpb24gZmx1c2goKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSBxdWV1ZVtpXTtcbiAgICB2YXIgYXJnID0gcXVldWVbaSArIDFdO1xuXG4gICAgY2FsbGJhY2soYXJnKTtcblxuICAgIHF1ZXVlW2ldID0gdW5kZWZpbmVkO1xuICAgIHF1ZXVlW2kgKyAxXSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxlbiA9IDA7XG59XG5cbmZ1bmN0aW9uIGF0dGVtcHRWZXJ0eCgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgciA9IHJlcXVpcmU7XG4gICAgdmFyIHZlcnR4ID0gcigndmVydHgnKTtcbiAgICB2ZXJ0eE5leHQgPSB2ZXJ0eC5ydW5Pbkxvb3AgfHwgdmVydHgucnVuT25Db250ZXh0O1xuICAgIHJldHVybiB1c2VWZXJ0eFRpbWVyKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdXNlU2V0VGltZW91dCgpO1xuICB9XG59XG5cbnZhciBzY2hlZHVsZUZsdXNoID0gdW5kZWZpbmVkO1xuLy8gRGVjaWRlIHdoYXQgYXN5bmMgbWV0aG9kIHRvIHVzZSB0byB0cmlnZ2VyaW5nIHByb2Nlc3Npbmcgb2YgcXVldWVkIGNhbGxiYWNrczpcbmlmIChpc05vZGUpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU5leHRUaWNrKCk7XG59IGVsc2UgaWYgKEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG59IGVsc2UgaWYgKGlzV29ya2VyKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VNZXNzYWdlQ2hhbm5lbCgpO1xufSBlbHNlIGlmIChicm93c2VyV2luZG93ID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IGF0dGVtcHRWZXJ0eCgpO1xufSBlbHNlIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZVNldFRpbWVvdXQoKTtcbn1cblxuZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICB2YXIgX2FyZ3VtZW50cyA9IGFyZ3VtZW50cztcblxuICB2YXIgcGFyZW50ID0gdGhpcztcblxuICB2YXIgY2hpbGQgPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcihub29wKTtcblxuICBpZiAoY2hpbGRbUFJPTUlTRV9JRF0gPT09IHVuZGVmaW5lZCkge1xuICAgIG1ha2VQcm9taXNlKGNoaWxkKTtcbiAgfVxuXG4gIHZhciBfc3RhdGUgPSBwYXJlbnQuX3N0YXRlO1xuXG4gIGlmIChfc3RhdGUpIHtcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNhbGxiYWNrID0gX2FyZ3VtZW50c1tfc3RhdGUgLSAxXTtcbiAgICAgIGFzYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gaW52b2tlQ2FsbGJhY2soX3N0YXRlLCBjaGlsZCwgY2FsbGJhY2ssIHBhcmVudC5fcmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pKCk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuLyoqXG4gIGBQcm9taXNlLnJlc29sdmVgIHJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgcmVzb2x2ZWQgd2l0aCB0aGVcbiAgcGFzc2VkIGB2YWx1ZWAuIEl0IGlzIHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZXNvbHZlKDEpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIHZhbHVlID09PSAxXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgxKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIHZhbHVlID09PSAxXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlc29sdmVcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FueX0gdmFsdWUgdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGhcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSBmdWxmaWxsZWQgd2l0aCB0aGUgZ2l2ZW5cbiAgYHZhbHVlYFxuKi9cbmZ1bmN0aW9uIHJlc29sdmUob2JqZWN0KSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QuY29uc3RydWN0b3IgPT09IENvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuICBfcmVzb2x2ZShwcm9taXNlLCBvYmplY3QpO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxudmFyIFBST01JU0VfSUQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMTYpO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxudmFyIFBFTkRJTkcgPSB2b2lkIDA7XG52YXIgRlVMRklMTEVEID0gMTtcbnZhciBSRUpFQ1RFRCA9IDI7XG5cbnZhciBHRVRfVEhFTl9FUlJPUiA9IG5ldyBFcnJvck9iamVjdCgpO1xuXG5mdW5jdGlvbiBzZWxmRnVsZmlsbG1lbnQoKSB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFwiWW91IGNhbm5vdCByZXNvbHZlIGEgcHJvbWlzZSB3aXRoIGl0c2VsZlwiKTtcbn1cblxuZnVuY3Rpb24gY2Fubm90UmV0dXJuT3duKCkge1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcignQSBwcm9taXNlcyBjYWxsYmFjayBjYW5ub3QgcmV0dXJuIHRoYXQgc2FtZSBwcm9taXNlLicpO1xufVxuXG5mdW5jdGlvbiBnZXRUaGVuKHByb21pc2UpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcHJvbWlzZS50aGVuO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIEdFVF9USEVOX0VSUk9SLmVycm9yID0gZXJyb3I7XG4gICAgcmV0dXJuIEdFVF9USEVOX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyeVRoZW4odGhlbiwgdmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcikge1xuICB0cnkge1xuICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSwgdGhlbikge1xuICBhc2FwKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgdmFyIHNlYWxlZCA9IGZhbHNlO1xuICAgIHZhciBlcnJvciA9IHRyeVRoZW4odGhlbiwgdGhlbmFibGUsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgaWYgKHRoZW5hYmxlICE9PSB2YWx1ZSkge1xuICAgICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICBpZiAoc2VhbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlYWxlZCA9IHRydWU7XG5cbiAgICAgIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xuXG4gICAgaWYgKCFzZWFsZWQgJiYgZXJyb3IpIHtcbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICB9XG4gIH0sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xuICBpZiAodGhlbmFibGUuX3N0YXRlID09PSBGVUxGSUxMRUQpIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICB9IGVsc2UgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICB9IGVsc2Uge1xuICAgIHN1YnNjcmliZSh0aGVuYWJsZSwgdW5kZWZpbmVkLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcmV0dXJuIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4kJCkge1xuICBpZiAobWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3RvciA9PT0gcHJvbWlzZS5jb25zdHJ1Y3RvciAmJiB0aGVuJCQgPT09IHRoZW4gJiYgbWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3Rvci5yZXNvbHZlID09PSByZXNvbHZlKSB7XG4gICAgaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoZW4kJCA9PT0gR0VUX1RIRU5fRVJST1IpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgR0VUX1RIRU5fRVJST1IuZXJyb3IpO1xuICAgIH0gZWxzZSBpZiAodGhlbiQkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoZW4kJCkpIHtcbiAgICAgIGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuJCQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIHNlbGZGdWxmaWxsbWVudCgpKTtcbiAgfSBlbHNlIGlmIChvYmplY3RPckZ1bmN0aW9uKHZhbHVlKSkge1xuICAgIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUsIGdldFRoZW4odmFsdWUpKTtcbiAgfSBlbHNlIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoUmVqZWN0aW9uKHByb21pc2UpIHtcbiAgaWYgKHByb21pc2UuX29uZXJyb3IpIHtcbiAgICBwcm9taXNlLl9vbmVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gIH1cblxuICBwdWJsaXNoKHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHByb21pc2UuX3Jlc3VsdCA9IHZhbHVlO1xuICBwcm9taXNlLl9zdGF0ZSA9IEZVTEZJTExFRDtcblxuICBpZiAocHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwcm9taXNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVqZWN0KHByb21pc2UsIHJlYXNvbikge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcHJvbWlzZS5fc3RhdGUgPSBSRUpFQ1RFRDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gcmVhc29uO1xuXG4gIGFzYXAocHVibGlzaFJlamVjdGlvbiwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICB2YXIgX3N1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgdmFyIGxlbmd0aCA9IF9zdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgcGFyZW50Ll9vbmVycm9yID0gbnVsbDtcblxuICBfc3Vic2NyaWJlcnNbbGVuZ3RoXSA9IGNoaWxkO1xuICBfc3Vic2NyaWJlcnNbbGVuZ3RoICsgRlVMRklMTEVEXSA9IG9uRnVsZmlsbG1lbnQ7XG4gIF9zdWJzY3JpYmVyc1tsZW5ndGggKyBSRUpFQ1RFRF0gPSBvblJlamVjdGlvbjtcblxuICBpZiAobGVuZ3RoID09PSAwICYmIHBhcmVudC5fc3RhdGUpIHtcbiAgICBhc2FwKHB1Ymxpc2gsIHBhcmVudCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVibGlzaChwcm9taXNlKSB7XG4gIHZhciBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzO1xuICB2YXIgc2V0dGxlZCA9IHByb21pc2UuX3N0YXRlO1xuXG4gIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgY2hpbGQgPSB1bmRlZmluZWQsXG4gICAgICBjYWxsYmFjayA9IHVuZGVmaW5lZCxcbiAgICAgIGRldGFpbCA9IHByb21pc2UuX3Jlc3VsdDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgY2hpbGQgPSBzdWJzY3JpYmVyc1tpXTtcbiAgICBjYWxsYmFjayA9IHN1YnNjcmliZXJzW2kgKyBzZXR0bGVkXTtcblxuICAgIGlmIChjaGlsZCkge1xuICAgICAgaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhkZXRhaWwpO1xuICAgIH1cbiAgfVxuXG4gIHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XG59XG5cbmZ1bmN0aW9uIEVycm9yT2JqZWN0KCkge1xuICB0aGlzLmVycm9yID0gbnVsbDtcbn1cblxudmFyIFRSWV9DQVRDSF9FUlJPUiA9IG5ldyBFcnJvck9iamVjdCgpO1xuXG5mdW5jdGlvbiB0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGRldGFpbCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xuICAgIHJldHVybiBUUllfQ0FUQ0hfRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgcHJvbWlzZSwgY2FsbGJhY2ssIGRldGFpbCkge1xuICB2YXIgaGFzQ2FsbGJhY2sgPSBpc0Z1bmN0aW9uKGNhbGxiYWNrKSxcbiAgICAgIHZhbHVlID0gdW5kZWZpbmVkLFxuICAgICAgZXJyb3IgPSB1bmRlZmluZWQsXG4gICAgICBzdWNjZWVkZWQgPSB1bmRlZmluZWQsXG4gICAgICBmYWlsZWQgPSB1bmRlZmluZWQ7XG5cbiAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgdmFsdWUgPSB0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gVFJZX0NBVENIX0VSUk9SKSB7XG4gICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgZXJyb3IgPSB2YWx1ZS5lcnJvcjtcbiAgICAgIHZhbHVlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgY2Fubm90UmV0dXJuT3duKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IGRldGFpbDtcbiAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgLy8gbm9vcFxuICB9IGVsc2UgaWYgKGhhc0NhbGxiYWNrICYmIHN1Y2NlZWRlZCkge1xuICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoZmFpbGVkKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IEZVTEZJTExFRCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBSRUpFQ1RFRCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplUHJvbWlzZShwcm9taXNlLCByZXNvbHZlcikge1xuICB0cnkge1xuICAgIHJlc29sdmVyKGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbHVlKSB7XG4gICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgZSk7XG4gIH1cbn1cblxudmFyIGlkID0gMDtcbmZ1bmN0aW9uIG5leHRJZCgpIHtcbiAgcmV0dXJuIGlkKys7XG59XG5cbmZ1bmN0aW9uIG1ha2VQcm9taXNlKHByb21pc2UpIHtcbiAgcHJvbWlzZVtQUk9NSVNFX0lEXSA9IGlkKys7XG4gIHByb21pc2UuX3N0YXRlID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9yZXN1bHQgPSB1bmRlZmluZWQ7XG4gIHByb21pc2UuX3N1YnNjcmliZXJzID0gW107XG59XG5cbmZ1bmN0aW9uIEVudW1lcmF0b3IoQ29uc3RydWN0b3IsIGlucHV0KSB7XG4gIHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgdGhpcy5wcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGlmICghdGhpcy5wcm9taXNlW1BST01JU0VfSURdKSB7XG4gICAgbWFrZVByb21pc2UodGhpcy5wcm9taXNlKTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5sZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgdGhpcy5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgdGhpcy5fcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcblxuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5sZW5ndGggfHwgMDtcbiAgICAgIHRoaXMuX2VudW1lcmF0ZSgpO1xuICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICBmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgX3JlamVjdCh0aGlzLnByb21pc2UsIHZhbGlkYXRpb25FcnJvcigpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0aW9uRXJyb3IoKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoJ0FycmF5IE1ldGhvZHMgbXVzdCBiZSBwcm92aWRlZCBhbiBBcnJheScpO1xufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICB2YXIgX2lucHV0ID0gdGhpcy5faW5wdXQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IHRoaXMuX3N0YXRlID09PSBQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHRoaXMuX2VhY2hFbnRyeShfaW5wdXRbaV0sIGkpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fZWFjaEVudHJ5ID0gZnVuY3Rpb24gKGVudHJ5LCBpKSB7XG4gIHZhciBjID0gdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvcjtcbiAgdmFyIHJlc29sdmUkJCA9IGMucmVzb2x2ZTtcblxuICBpZiAocmVzb2x2ZSQkID09PSByZXNvbHZlKSB7XG4gICAgdmFyIF90aGVuID0gZ2V0VGhlbihlbnRyeSk7XG5cbiAgICBpZiAoX3RoZW4gPT09IHRoZW4gJiYgZW50cnkuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgICB0aGlzLl9zZXR0bGVkQXQoZW50cnkuX3N0YXRlLCBpLCBlbnRyeS5fcmVzdWx0KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBfdGhlbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG4gICAgICB0aGlzLl9yZXN1bHRbaV0gPSBlbnRyeTtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFByb21pc2UpIHtcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IGMobm9vcCk7XG4gICAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIGVudHJ5LCBfdGhlbik7XG4gICAgICB0aGlzLl93aWxsU2V0dGxlQXQocHJvbWlzZSwgaSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChuZXcgYyhmdW5jdGlvbiAocmVzb2x2ZSQkKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlJCQoZW50cnkpO1xuICAgICAgfSksIGkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl93aWxsU2V0dGxlQXQocmVzb2x2ZSQkKGVudHJ5KSwgaSk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9zZXR0bGVkQXQgPSBmdW5jdGlvbiAoc3RhdGUsIGksIHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcy5wcm9taXNlO1xuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gUEVORElORykge1xuICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuXG4gICAgaWYgKHN0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl93aWxsU2V0dGxlQXQgPSBmdW5jdGlvbiAocHJvbWlzZSwgaSkge1xuICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgc3Vic2NyaWJlKHByb21pc2UsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIGVudW1lcmF0b3IuX3NldHRsZWRBdChGVUxGSUxMRUQsIGksIHZhbHVlKTtcbiAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoUkVKRUNURUQsIGksIHJlYXNvbik7XG4gIH0pO1xufTtcblxuLyoqXG4gIGBQcm9taXNlLmFsbGAgYWNjZXB0cyBhbiBhcnJheSBvZiBwcm9taXNlcywgYW5kIHJldHVybnMgYSBuZXcgcHJvbWlzZSB3aGljaFxuICBpcyBmdWxmaWxsZWQgd2l0aCBhbiBhcnJheSBvZiBmdWxmaWxsbWVudCB2YWx1ZXMgZm9yIHRoZSBwYXNzZWQgcHJvbWlzZXMsIG9yXG4gIHJlamVjdGVkIHdpdGggdGhlIHJlYXNvbiBvZiB0aGUgZmlyc3QgcGFzc2VkIHByb21pc2UgdG8gYmUgcmVqZWN0ZWQuIEl0IGNhc3RzIGFsbFxuICBlbGVtZW50cyBvZiB0aGUgcGFzc2VkIGl0ZXJhYmxlIHRvIHByb21pc2VzIGFzIGl0IHJ1bnMgdGhpcyBhbGdvcml0aG0uXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IHJlc29sdmUoMSk7XG4gIGxldCBwcm9taXNlMiA9IHJlc29sdmUoMik7XG4gIGxldCBwcm9taXNlMyA9IHJlc29sdmUoMyk7XG4gIGxldCBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBUaGUgYXJyYXkgaGVyZSB3b3VsZCBiZSBbIDEsIDIsIDMgXTtcbiAgfSk7XG4gIGBgYFxuXG4gIElmIGFueSBvZiB0aGUgYHByb21pc2VzYCBnaXZlbiB0byBgYWxsYCBhcmUgcmVqZWN0ZWQsIHRoZSBmaXJzdCBwcm9taXNlXG4gIHRoYXQgaXMgcmVqZWN0ZWQgd2lsbCBiZSBnaXZlbiBhcyBhbiBhcmd1bWVudCB0byB0aGUgcmV0dXJuZWQgcHJvbWlzZXMnc1xuICByZWplY3Rpb24gaGFuZGxlci4gRm9yIGV4YW1wbGU6XG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IHJlc29sdmUoMSk7XG4gIGxldCBwcm9taXNlMiA9IHJlamVjdChuZXcgRXJyb3IoXCIyXCIpKTtcbiAgbGV0IHByb21pc2UzID0gcmVqZWN0KG5ldyBFcnJvcihcIjNcIikpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnMgYmVjYXVzZSB0aGVyZSBhcmUgcmVqZWN0ZWQgcHJvbWlzZXMhXG4gIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgLy8gZXJyb3IubWVzc2FnZSA9PT0gXCIyXCJcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgYWxsXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBcnJheX0gZW50cmllcyBhcnJheSBvZiBwcm9taXNlc1xuICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYWxsIGBwcm9taXNlc2AgaGF2ZSBiZWVuXG4gIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQgaWYgYW55IG9mIHRoZW0gYmVjb21lIHJlamVjdGVkLlxuICBAc3RhdGljXG4qL1xuZnVuY3Rpb24gYWxsKGVudHJpZXMpIHtcbiAgcmV0dXJuIG5ldyBFbnVtZXJhdG9yKHRoaXMsIGVudHJpZXMpLnByb21pc2U7XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yYWNlYCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2ggaXMgc2V0dGxlZCBpbiB0aGUgc2FtZSB3YXkgYXMgdGhlXG4gIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIHNldHRsZS5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMicpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFByb21pc2UucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIHJlc3VsdCA9PT0gJ3Byb21pc2UgMicgYmVjYXVzZSBpdCB3YXMgcmVzb2x2ZWQgYmVmb3JlIHByb21pc2UxXG4gICAgLy8gd2FzIHJlc29sdmVkLlxuICB9KTtcbiAgYGBgXG5cbiAgYFByb21pc2UucmFjZWAgaXMgZGV0ZXJtaW5pc3RpYyBpbiB0aGF0IG9ubHkgdGhlIHN0YXRlIG9mIHRoZSBmaXJzdFxuICBzZXR0bGVkIHByb21pc2UgbWF0dGVycy4gRm9yIGV4YW1wbGUsIGV2ZW4gaWYgb3RoZXIgcHJvbWlzZXMgZ2l2ZW4gdG8gdGhlXG4gIGBwcm9taXNlc2AgYXJyYXkgYXJndW1lbnQgYXJlIHJlc29sdmVkLCBidXQgdGhlIGZpcnN0IHNldHRsZWQgcHJvbWlzZSBoYXNcbiAgYmVjb21lIHJlamVjdGVkIGJlZm9yZSB0aGUgb3RoZXIgcHJvbWlzZXMgYmVjYW1lIGZ1bGZpbGxlZCwgdGhlIHJldHVybmVkXG4gIHByb21pc2Ugd2lsbCBiZWNvbWUgcmVqZWN0ZWQ6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMScpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIGxldCBwcm9taXNlMiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcigncHJvbWlzZSAyJykpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFByb21pc2UucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgcHJvbWlzZSAyIGJlY2FtZSByZWplY3RlZCBiZWZvcmVcbiAgICAvLyBwcm9taXNlIDEgYmVjYW1lIGZ1bGZpbGxlZFxuICB9KTtcbiAgYGBgXG5cbiAgQW4gZXhhbXBsZSByZWFsLXdvcmxkIHVzZSBjYXNlIGlzIGltcGxlbWVudGluZyB0aW1lb3V0czpcblxuICBgYGBqYXZhc2NyaXB0XG4gIFByb21pc2UucmFjZShbYWpheCgnZm9vLmpzb24nKSwgdGltZW91dCg1MDAwKV0pXG4gIGBgYFxuXG4gIEBtZXRob2QgcmFjZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IHByb21pc2VzIGFycmF5IG9mIHByb21pc2VzIHRvIG9ic2VydmVcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2Ugd2hpY2ggc2V0dGxlcyBpbiB0aGUgc2FtZSB3YXkgYXMgdGhlIGZpcnN0IHBhc3NlZFxuICBwcm9taXNlIHRvIHNldHRsZS5cbiovXG5mdW5jdGlvbiByYWNlKGVudHJpZXMpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAoIWlzQXJyYXkoZW50cmllcykpIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIChfLCByZWplY3QpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byByYWNlLicpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgQ29uc3RydWN0b3IucmVzb2x2ZShlbnRyaWVzW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gIGBQcm9taXNlLnJlamVjdGAgcmV0dXJucyBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgcGFzc2VkIGByZWFzb25gLlxuICBJdCBpcyBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZWplY3RcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FueX0gcmVhc29uIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIHRoZSBnaXZlbiBgcmVhc29uYC5cbiovXG5mdW5jdGlvbiByZWplY3QocmVhc29uKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG4gIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5mdW5jdGlvbiBuZWVkc1Jlc29sdmVyKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGEgcmVzb2x2ZXIgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XG59XG5cbmZ1bmN0aW9uIG5lZWRzTmV3KCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnUHJvbWlzZSc6IFBsZWFzZSB1c2UgdGhlICduZXcnIG9wZXJhdG9yLCB0aGlzIG9iamVjdCBjb25zdHJ1Y3RvciBjYW5ub3QgYmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24uXCIpO1xufVxuXG4vKipcbiAgUHJvbWlzZSBvYmplY3RzIHJlcHJlc2VudCB0aGUgZXZlbnR1YWwgcmVzdWx0IG9mIGFuIGFzeW5jaHJvbm91cyBvcGVyYXRpb24uIFRoZVxuICBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLCB3aGljaFxuICByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZSByZWFzb25cbiAgd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG5cbiAgVGVybWlub2xvZ3lcbiAgLS0tLS0tLS0tLS1cblxuICAtIGBwcm9taXNlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gd2l0aCBhIGB0aGVuYCBtZXRob2Qgd2hvc2UgYmVoYXZpb3IgY29uZm9ybXMgdG8gdGhpcyBzcGVjaWZpY2F0aW9uLlxuICAtIGB0aGVuYWJsZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHRoYXQgZGVmaW5lcyBhIGB0aGVuYCBtZXRob2QuXG4gIC0gYHZhbHVlYCBpcyBhbnkgbGVnYWwgSmF2YVNjcmlwdCB2YWx1ZSAoaW5jbHVkaW5nIHVuZGVmaW5lZCwgYSB0aGVuYWJsZSwgb3IgYSBwcm9taXNlKS5cbiAgLSBgZXhjZXB0aW9uYCBpcyBhIHZhbHVlIHRoYXQgaXMgdGhyb3duIHVzaW5nIHRoZSB0aHJvdyBzdGF0ZW1lbnQuXG4gIC0gYHJlYXNvbmAgaXMgYSB2YWx1ZSB0aGF0IGluZGljYXRlcyB3aHkgYSBwcm9taXNlIHdhcyByZWplY3RlZC5cbiAgLSBgc2V0dGxlZGAgdGhlIGZpbmFsIHJlc3Rpbmcgc3RhdGUgb2YgYSBwcm9taXNlLCBmdWxmaWxsZWQgb3IgcmVqZWN0ZWQuXG5cbiAgQSBwcm9taXNlIGNhbiBiZSBpbiBvbmUgb2YgdGhyZWUgc3RhdGVzOiBwZW5kaW5nLCBmdWxmaWxsZWQsIG9yIHJlamVjdGVkLlxuXG4gIFByb21pc2VzIHRoYXQgYXJlIGZ1bGZpbGxlZCBoYXZlIGEgZnVsZmlsbG1lbnQgdmFsdWUgYW5kIGFyZSBpbiB0aGUgZnVsZmlsbGVkXG4gIHN0YXRlLiAgUHJvbWlzZXMgdGhhdCBhcmUgcmVqZWN0ZWQgaGF2ZSBhIHJlamVjdGlvbiByZWFzb24gYW5kIGFyZSBpbiB0aGVcbiAgcmVqZWN0ZWQgc3RhdGUuICBBIGZ1bGZpbGxtZW50IHZhbHVlIGlzIG5ldmVyIGEgdGhlbmFibGUuXG5cbiAgUHJvbWlzZXMgY2FuIGFsc28gYmUgc2FpZCB0byAqcmVzb2x2ZSogYSB2YWx1ZS4gIElmIHRoaXMgdmFsdWUgaXMgYWxzbyBhXG4gIHByb21pc2UsIHRoZW4gdGhlIG9yaWdpbmFsIHByb21pc2UncyBzZXR0bGVkIHN0YXRlIHdpbGwgbWF0Y2ggdGhlIHZhbHVlJ3NcbiAgc2V0dGxlZCBzdGF0ZS4gIFNvIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgcmVqZWN0cyB3aWxsXG4gIGl0c2VsZiByZWplY3QsIGFuZCBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdpbGxcbiAgaXRzZWxmIGZ1bGZpbGwuXG5cblxuICBCYXNpYyBVc2FnZTpcbiAgLS0tLS0tLS0tLS0tXG5cbiAgYGBganNcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAvLyBvbiBzdWNjZXNzXG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG5cbiAgICAvLyBvbiBmYWlsdXJlXG4gICAgcmVqZWN0KHJlYXNvbik7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIC8vIG9uIHJlamVjdGlvblxuICB9KTtcbiAgYGBgXG5cbiAgQWR2YW5jZWQgVXNhZ2U6XG4gIC0tLS0tLS0tLS0tLS0tLVxuXG4gIFByb21pc2VzIHNoaW5lIHdoZW4gYWJzdHJhY3RpbmcgYXdheSBhc3luY2hyb25vdXMgaW50ZXJhY3Rpb25zIHN1Y2ggYXNcbiAgYFhNTEh0dHBSZXF1ZXN0YHMuXG5cbiAgYGBganNcbiAgZnVuY3Rpb24gZ2V0SlNPTih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlcjtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHhoci5zZW5kKCk7XG5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IHRoaXMuRE9ORSkge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdnZXRKU09OOiBgJyArIHVybCArICdgIGZhaWxlZCB3aXRoIHN0YXR1czogWycgKyB0aGlzLnN0YXR1cyArICddJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEpTT04oJy9wb3N0cy5qc29uJykudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgLy8gb24gcmVqZWN0aW9uXG4gIH0pO1xuICBgYGBcblxuICBVbmxpa2UgY2FsbGJhY2tzLCBwcm9taXNlcyBhcmUgZ3JlYXQgY29tcG9zYWJsZSBwcmltaXRpdmVzLlxuXG4gIGBgYGpzXG4gIFByb21pc2UuYWxsKFtcbiAgICBnZXRKU09OKCcvcG9zdHMnKSxcbiAgICBnZXRKU09OKCcvY29tbWVudHMnKVxuICBdKS50aGVuKGZ1bmN0aW9uKHZhbHVlcyl7XG4gICAgdmFsdWVzWzBdIC8vID0+IHBvc3RzSlNPTlxuICAgIHZhbHVlc1sxXSAvLyA9PiBjb21tZW50c0pTT05cblxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0pO1xuICBgYGBcblxuICBAY2xhc3MgUHJvbWlzZVxuICBAcGFyYW0ge2Z1bmN0aW9ufSByZXNvbHZlclxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEBjb25zdHJ1Y3RvclxuKi9cbmZ1bmN0aW9uIFByb21pc2UocmVzb2x2ZXIpIHtcbiAgdGhpc1tQUk9NSVNFX0lEXSA9IG5leHRJZCgpO1xuICB0aGlzLl9yZXN1bHQgPSB0aGlzLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcblxuICBpZiAobm9vcCAhPT0gcmVzb2x2ZXIpIHtcbiAgICB0eXBlb2YgcmVzb2x2ZXIgIT09ICdmdW5jdGlvbicgJiYgbmVlZHNSZXNvbHZlcigpO1xuICAgIHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlID8gaW5pdGlhbGl6ZVByb21pc2UodGhpcywgcmVzb2x2ZXIpIDogbmVlZHNOZXcoKTtcbiAgfVxufVxuXG5Qcm9taXNlLmFsbCA9IGFsbDtcblByb21pc2UucmFjZSA9IHJhY2U7XG5Qcm9taXNlLnJlc29sdmUgPSByZXNvbHZlO1xuUHJvbWlzZS5yZWplY3QgPSByZWplY3Q7XG5Qcm9taXNlLl9zZXRTY2hlZHVsZXIgPSBzZXRTY2hlZHVsZXI7XG5Qcm9taXNlLl9zZXRBc2FwID0gc2V0QXNhcDtcblByb21pc2UuX2FzYXAgPSBhc2FwO1xuXG5Qcm9taXNlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFByb21pc2UsXG5cbiAgLyoqXG4gICAgVGhlIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsXG4gICAgd2hpY2ggcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGVcbiAgICByZWFzb24gd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgLy8gdXNlciBpcyBhdmFpbGFibGVcbiAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gdXNlciBpcyB1bmF2YWlsYWJsZSwgYW5kIHlvdSBhcmUgZ2l2ZW4gdGhlIHJlYXNvbiB3aHlcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQ2hhaW5pbmdcbiAgICAtLS0tLS0tLVxuICBcbiAgICBUaGUgcmV0dXJuIHZhbHVlIG9mIGB0aGVuYCBpcyBpdHNlbGYgYSBwcm9taXNlLiAgVGhpcyBzZWNvbmQsICdkb3duc3RyZWFtJ1xuICAgIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmaXJzdCBwcm9taXNlJ3MgZnVsZmlsbG1lbnRcbiAgICBvciByZWplY3Rpb24gaGFuZGxlciwgb3IgcmVqZWN0ZWQgaWYgdGhlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VyLm5hbWU7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcmV0dXJuICdkZWZhdWx0IG5hbWUnO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHVzZXJOYW1lKSB7XG4gICAgICAvLyBJZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHVzZXJOYW1lYCB3aWxsIGJlIHRoZSB1c2VyJ3MgbmFtZSwgb3RoZXJ3aXNlIGl0XG4gICAgICAvLyB3aWxsIGJlIGAnZGVmYXVsdCBuYW1lJ2BcbiAgICB9KTtcbiAgXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jyk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jyk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBpZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHJlYXNvbmAgd2lsbCBiZSAnRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknLlxuICAgICAgLy8gSWYgYGZpbmRVc2VyYCByZWplY3RlZCwgYHJlYXNvbmAgd2lsbCBiZSAnYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScuXG4gICAgfSk7XG4gICAgYGBgXG4gICAgSWYgdGhlIGRvd25zdHJlYW0gcHJvbWlzZSBkb2VzIG5vdCBzcGVjaWZ5IGEgcmVqZWN0aW9uIGhhbmRsZXIsIHJlamVjdGlvbiByZWFzb25zIHdpbGwgYmUgcHJvcGFnYXRlZCBmdXJ0aGVyIGRvd25zdHJlYW0uXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICB0aHJvdyBuZXcgUGVkYWdvZ2ljYWxFeGNlcHRpb24oJ1Vwc3RyZWFtIGVycm9yJyk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIFRoZSBgUGVkZ2Fnb2NpYWxFeGNlcHRpb25gIGlzIHByb3BhZ2F0ZWQgYWxsIHRoZSB3YXkgZG93biB0byBoZXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEFzc2ltaWxhdGlvblxuICAgIC0tLS0tLS0tLS0tLVxuICBcbiAgICBTb21ldGltZXMgdGhlIHZhbHVlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSB0byBhIGRvd25zdHJlYW0gcHJvbWlzZSBjYW4gb25seSBiZVxuICAgIHJldHJpZXZlZCBhc3luY2hyb25vdXNseS4gVGhpcyBjYW4gYmUgYWNoaWV2ZWQgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiB0aGVcbiAgICBmdWxmaWxsbWVudCBvciByZWplY3Rpb24gaGFuZGxlci4gVGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIHRoZW4gYmUgcGVuZGluZ1xuICAgIHVudGlsIHRoZSByZXR1cm5lZCBwcm9taXNlIGlzIHNldHRsZWQuIFRoaXMgaXMgY2FsbGVkICphc3NpbWlsYXRpb24qLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAvLyBUaGUgdXNlcidzIGNvbW1lbnRzIGFyZSBub3cgYXZhaWxhYmxlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIElmIHRoZSBhc3NpbWxpYXRlZCBwcm9taXNlIHJlamVjdHMsIHRoZW4gdGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIGFsc28gcmVqZWN0LlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIGZ1bGZpbGxzLCB3ZSdsbCBoYXZlIHRoZSB2YWx1ZSBoZXJlXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCByZWplY3RzLCB3ZSdsbCBoYXZlIHRoZSByZWFzb24gaGVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBTaW1wbGUgRXhhbXBsZVxuICAgIC0tLS0tLS0tLS0tLS0tXG4gIFxuICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGxldCByZXN1bHQ7XG4gIFxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBmaW5kUmVzdWx0KCk7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9XG4gICAgYGBgXG4gIFxuICAgIEVycmJhY2sgRXhhbXBsZVxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRSZXN1bHQoZnVuY3Rpb24ocmVzdWx0LCBlcnIpe1xuICAgICAgaWYgKGVycikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFByb21pc2UgRXhhbXBsZTtcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGZpbmRSZXN1bHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQWR2YW5jZWQgRXhhbXBsZVxuICAgIC0tLS0tLS0tLS0tLS0tXG4gIFxuICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGxldCBhdXRob3IsIGJvb2tzO1xuICBcbiAgICB0cnkge1xuICAgICAgYXV0aG9yID0gZmluZEF1dGhvcigpO1xuICAgICAgYm9va3MgID0gZmluZEJvb2tzQnlBdXRob3IoYXV0aG9yKTtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH1cbiAgICBgYGBcbiAgXG4gICAgRXJyYmFjayBFeGFtcGxlXG4gIFxuICAgIGBgYGpzXG4gIFxuICAgIGZ1bmN0aW9uIGZvdW5kQm9va3MoYm9va3MpIHtcbiAgXG4gICAgfVxuICBcbiAgICBmdW5jdGlvbiBmYWlsdXJlKHJlYXNvbikge1xuICBcbiAgICB9XG4gIFxuICAgIGZpbmRBdXRob3IoZnVuY3Rpb24oYXV0aG9yLCBlcnIpe1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmluZEJvb29rc0J5QXV0aG9yKGF1dGhvciwgZnVuY3Rpb24oYm9va3MsIGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvdW5kQm9va3MoYm9va3MpO1xuICAgICAgICAgICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAgICAgICAgIGZhaWx1cmUocmVhc29uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH1cbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgUHJvbWlzZSBFeGFtcGxlO1xuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgZmluZEF1dGhvcigpLlxuICAgICAgdGhlbihmaW5kQm9va3NCeUF1dGhvcikuXG4gICAgICB0aGVuKGZ1bmN0aW9uKGJvb2tzKXtcbiAgICAgICAgLy8gZm91bmQgYm9va3NcbiAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQG1ldGhvZCB0aGVuXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxmaWxsZWRcbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGVkXG4gICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG4gIHRoZW46IHRoZW4sXG5cbiAgLyoqXG4gICAgYGNhdGNoYCBpcyBzaW1wbHkgc3VnYXIgZm9yIGB0aGVuKHVuZGVmaW5lZCwgb25SZWplY3Rpb24pYCB3aGljaCBtYWtlcyBpdCB0aGUgc2FtZVxuICAgIGFzIHRoZSBjYXRjaCBibG9jayBvZiBhIHRyeS9jYXRjaCBzdGF0ZW1lbnQuXG4gIFxuICAgIGBgYGpzXG4gICAgZnVuY3Rpb24gZmluZEF1dGhvcigpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZG4ndCBmaW5kIHRoYXQgYXV0aG9yJyk7XG4gICAgfVxuICBcbiAgICAvLyBzeW5jaHJvbm91c1xuICAgIHRyeSB7XG4gICAgICBmaW5kQXV0aG9yKCk7XG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfVxuICBcbiAgICAvLyBhc3luYyB3aXRoIHByb21pc2VzXG4gICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBAbWV0aG9kIGNhdGNoXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cbiAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cbiAgJ2NhdGNoJzogZnVuY3Rpb24gX2NhdGNoKG9uUmVqZWN0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICAgIHZhciBsb2NhbCA9IHVuZGVmaW5lZDtcblxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsb2NhbCA9IGdsb2JhbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsb2NhbCA9IHNlbGY7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsID0gRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5ZmlsbCBmYWlsZWQgYmVjYXVzZSBnbG9iYWwgb2JqZWN0IGlzIHVuYXZhaWxhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBQID0gbG9jYWwuUHJvbWlzZTtcblxuICAgIGlmIChQKSB7XG4gICAgICAgIHZhciBwcm9taXNlVG9TdHJpbmcgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvbWlzZVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFAucmVzb2x2ZSgpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gc2lsZW50bHkgaWdub3JlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb21pc2VUb1N0cmluZyA9PT0gJ1tvYmplY3QgUHJvbWlzZV0nICYmICFQLmNhc3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvY2FsLlByb21pc2UgPSBQcm9taXNlO1xufVxuXG4vLyBTdHJhbmdlIGNvbXBhdC4uXG5Qcm9taXNlLnBvbHlmaWxsID0gcG9seWZpbGw7XG5Qcm9taXNlLlByb21pc2UgPSBQcm9taXNlO1xuXG5yZXR1cm4gUHJvbWlzZTtcblxufSkpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVzNi1wcm9taXNlLm1hcCJdfQ==
},{"_process":11}],11:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],12:[function(require,module,exports){
'use strict';

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

module.exports = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

},{}],13:[function(require,module,exports){
'use strict';

var stringify = require('./stringify');
var parse = require('./parse');
var formats = require('./formats');

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};

},{"./formats":12,"./parse":14,"./stringify":15}],14:[function(require,module,exports){
'use strict';

var utils = require('./utils');

var has = Object.prototype.hasOwnProperty;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    parameterLimit: 1000,
    plainObjects: false,
    strictNullHandling: false
};

var parseValues = function parseValues(str, options) {
    var obj = {};
    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

    for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];
        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos));
            val = options.decoder(part.slice(pos + 1));
        }
        if (has.call(obj, key)) {
            obj[key] = [].concat(obj[key]).concat(val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function parseObject(chain, val, options) {
    if (!chain.length) {
        return val;
    }

    var root = chain.shift();

    var obj;
    if (root === '[]') {
        obj = [];
        obj = obj.concat(parseObject(chain, val, options));
    } else {
        obj = options.plainObjects ? Object.create(null) : {};
        var cleanRoot = root[0] === '[' && root[root.length - 1] === ']' ? root.slice(1, root.length - 1) : root;
        var index = parseInt(cleanRoot, 10);
        if (
            !isNaN(index) &&
            root !== cleanRoot &&
            String(index) === cleanRoot &&
            index >= 0 &&
            (options.parseArrays && index <= options.arrayLimit)
        ) {
            obj = [];
            obj[index] = parseObject(chain, val, options);
        } else {
            obj[cleanRoot] = parseObject(chain, val, options);
        }
    }

    return obj;
};

var parseKeys = function parseKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^\.\[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var parent = /^([^\[\]]*)/;
    var child = /(\[[^\[\]]*\])/g;

    // Get the parent

    var segment = parent.exec(key);

    // Stash the parent if it exists

    var keys = [];
    if (segment[1]) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, segment[1])) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(segment[1]);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].replace(/\[|\]/g, ''))) {
            if (!options.allowPrototypes) {
                continue;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

module.exports = function (str, opts) {
    var options = opts || {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};

},{"./utils":16}],15:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var formats = require('./formats');

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var toISO = Date.prototype.toISOString;

var defaults = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify(object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (obj === null) {
        if (strictNullHandling) {
            return encoder ? encoder(prefix) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            return [formatter(encoder(prefix)) + '=' + formatter(encoder(obj))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            values = values.concat(stringify(
                obj[key],
                generateArrayPrefix(prefix, key),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter
            ));
        } else {
            values = values.concat(stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter
            ));
        }
    }

    return values;
};

module.exports = function (object, opts) {
    var obj = object;
    var options = opts || {};
    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = encode ? (typeof options.encoder === 'function' ? options.encoder : defaults.encoder) : null;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    if (typeof options.format === 'undefined') {
        options.format = formats.default;
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        keys = keys.concat(stringify(
            obj[key],
            key,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter
        ));
    }

    return keys.join(delimiter);
};

},{"./formats":12,"./utils":16}],16:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

exports.arrayToObject = function (source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

exports.merge = function (target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            target[source] = true;
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = exports.arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = exports.merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (Object.prototype.hasOwnProperty.call(acc, key)) {
            acc[key] = exports.merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

exports.decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

exports.encode = function (str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D || // -
            c === 0x2E || // .
            c === 0x5F || // _
            c === 0x7E || // ~
            (c >= 0x30 && c <= 0x39) || // 0-9
            (c >= 0x41 && c <= 0x5A) || // a-z
            (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)] + hexTable[0x80 | ((c >> 12) & 0x3F)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

exports.compact = function (obj, references) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    var refs = references || [];
    var lookup = refs.indexOf(obj);
    if (lookup !== -1) {
        return refs[lookup];
    }

    refs.push(obj);

    if (Array.isArray(obj)) {
        var compacted = [];

        for (var i = 0; i < obj.length; ++i) {
            if (obj[i] && typeof obj[i] === 'object') {
                compacted.push(exports.compact(obj[i], refs));
            } else if (typeof obj[i] !== 'undefined') {
                compacted.push(obj[i]);
            }
        }

        return compacted;
    }

    var keys = Object.keys(obj);
    keys.forEach(function (key) {
        obj[key] = exports.compact(obj[key], refs);
    });

    return obj;
};

exports.isRegExp = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

exports.isBuffer = function (obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

},{}],17:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],18:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],19:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiJdfQ==
},{"./support/isBuffer":18,"_process":11,"inherits":17}],20:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],21:[function(require,module,exports){
"use strict";

module.exports.Production = require("./production");
module.exports.Sandbox = require("./sandbox");

},{"./production":22,"./sandbox":23}],22:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * @class Production API
 */

var ProductionAPI = (function () {

  /**
   * Initializes ProductionAPI
   *
   * @constructor
   * @param {String} endpoint - The host endpoint
   * @param {Object} fetchFn - The function to use for fetching the data - Defaults to window.fetch
   * @return {ProductionAPI}
   */

  function ProductionAPI(endpoint) {
    var fetchFn = arguments[1] === undefined ? function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return window.fetch.apply(window, args);
    } : arguments[1];

    _classCallCheck(this, ProductionAPI);

    this._endpoint = endpoint;
    this._fetchFn = fetchFn;
  }

  _createClass(ProductionAPI, {
    invoke: {

      /**
       *
       * Propagates invoke call to _fetchFn
       * @param {String} resource - The resource to fetch from
       * @param {Object} payload - The payload to pass
       * @return {Promise}
       *
       */

      value: function invoke(resource, payload) {
        var status = 0;
        return this._fetchFn("" + this._endpoint + "/" + resource, payload).then(function (res) {
          status = res.status;
          if (status !== 204) {
            return res.json();
          }
          return Promise.resolve({});
        }).then(function (body) {
          return { body: body, status: status };
        });
      }
    }
  });

  return ProductionAPI;
})();

module.exports = ProductionAPI;

},{}],23:[function(require,module,exports){
"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Utils = require("../utils");

var stripBearer = Utils.stripBearer;

/**
 * Generates an HTTP response object
 *
 * @private
 * @return {Object}
 *
 */
var response = function () {
  var status = arguments[0] === undefined ? 200 : arguments[0];
  var body = arguments[1] === undefined ? {} : arguments[1];
  return Promise.resolve({
    status: status,
    body: body });
};

/**
 * @class Sandbox API
 */

var SandboxAPI = (function () {

  /**
   * Initializes SandboxAPI
   *
   * @constructor
   * @param {SandboxDatabase} database - The database to use for storing sesssion changes
   * @return {SandboxAPI}
   *
   */

  function SandboxAPI(database) {
    _classCallCheck(this, SandboxAPI);

    this._database = database;
  }

  _createClass(SandboxAPI, {
    invoke: {

      /**
       * Stubs API calls
       *
       * @param {String} resource - The resource to fetch from
       * @param {Object} payload - The paylod to propagate
       *
       * @return {Promise}
       */

      value: function invoke(resource, payload) {
        var _resource$split = resource.split("/");

        var _resource$split2 = _slicedToArray(_resource$split, 2);

        var route = _resource$split2[0];
        var id = _resource$split2[1];
        var method = payload.method;
        var body = payload.body;
        var headers = payload.headers;

        return SandboxAPI.resources[route][method](this._database, id, body, headers);
      }
    }
  }, {
    resources: {

      /**
       * Maps API resources to response objects
       *
       * @private
       *
       */

      get: function () {
        return {
          /**
           * Maps `/users` resource
           *
           * @private
           *
           */
          users: {
            GET: function (database, id, body, headers) {
              var token = stripBearer(headers.Authorization);
              if (!database.hasUserWithToken(token)) {
                return response(404, { error: "not_found" });
              }
              return response(200, database.getUserWithToken(token));
            },
            POST: function (database, id, body) {
              var email = body.email;
              var password = body.password;
              var first_name = body.first_name;
              var last_name = body.last_name;

              if (database.hasUserWithData(email, password)) {
                return response(400, { error: "validation_failed" });
              }
              var newUser = database.addUser(email, password, first_name, last_name);
              return response(201, newUser);
            },
            PATCH: function (database, id, body, headers) {
              var token = stripBearer(headers.Authorization);
              var first_name = body.first_name;
              var last_name = body.last_name;

              if (database.getUserWithToken(token) !== database.getUserWithId(id)) {
                return response(400, { error: "invalid_grant" });
              }
              var patchedUser = database.updateUser(id, first_name, last_name);
              return response(200, patchedUser);
            } },
          /**
           * Maps `/token` resource
           *
           * @see https://tools.ietf.org/html/rfc6749
           * @private
           *
           */
          token: {
            POST: function (database, id, body) {
              var grant_type = body.grant_type;
              var username = body.username;
              var password = body.password;
              var refresh_token = body.refresh_token;

              if (grant_type === "password") {
                if (!database.hasUserWithData(username, password)) {
                  return response(404, { error: "not_found" });
                }
                var user = database.getUserWithData(username, password);
                return response(200, database.getTokenFor(user.id));
              }
              /* istanbul ignore if */
              if (grant_type === "refresh_token") {
                if (!database.hasTokenWithRefresh(refresh_token)) {
                  return response(400, { error: "invalid_token" });
                }
                var refreshedToken = database.updateToken(refresh_token);
                return response(200, refreshedToken);
              }
              return response(404, { error: "unexpected_error" });
            } },
          /**
           * Maps `/passwords` resource
           *
           * @private
           *
           */
          passwords: {
            POST: function (database, id, body) {
              var email = body.email;

              if (!database.hasUserWithEmail(email)) {
                return response(404, { error: "not_found" });
              }
              return response();
            },
            PUT: function (database, id) {
              if (!database.hasPasswordResetToken(id)) {
                return response(404, { error: "not_found" });
              }
              return response();
            } } };
      }
    }
  });

  return SandboxAPI;
})();

module.exports = SandboxAPI;

},{"../utils":32}],24:[function(require,module,exports){
"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Utils = require("../utils");

var generateRandomString = Utils.generateRandomString;
var generateRandomUUID = Utils.generateRandomUUID;

/**
 * @class SandboxDatabase
 */

var SandboxDatabase = (function () {

  /**
   * Initializes SandboxAPI
   *
   * @constructor
   * @param {JSON} users - The initial user fixtures
   * @param {JSON} tokens - The initial token fixtures
   * @param {JSON} passwords - The initial passwords fixtures
   * @return SandboxDatabase
   *
   */

  function SandboxDatabase(users, tokens, passwords) {
    _classCallCheck(this, SandboxDatabase);

    this._users = [].concat(_toConsumableArray(users));
    this._tokens = [].concat(_toConsumableArray(tokens));
    this._passwords = [].concat(_toConsumableArray(passwords));
  }

  _createClass(SandboxDatabase, {
    users: {

      /**
       * Returns users
       *
       * @return {Array}
       *
       */

      get: function () {
        return this._users;
      }
    },
    tokens: {

      /**
       * Returns tokens
       *
       * @return {Array}
       *
       */

      get: function () {
        return this._tokens;
      }
    },
    _extractUser: {

      /**
       * Extracts `public` user data
       *
       * @private
       * @return {Object}
       *
      */

      value: function _extractUser(data) {
        return {
          id: data.id,
          publisher_id: data.publisher_id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email };
      }
    },
    _extractToken: {

      /**
       * Extracts `public` token data
       *
       * @private
       * @return {Object}
       *
      */

      value: function _extractToken(data) {
        return {
          access_token: data.access_token,
          refresh_token: data.refresh_token };
      }
    },
    hasTokenWithRefresh: {

      /**
       * Determines if database has a specific token based on refresh_token
       *
       * @param {String} refreshToken - The refresh token to lookup
       * @return {Boolean}
       *
       */

      value: function hasTokenWithRefresh(refreshToken) {
        return !! ~this._tokens.findIndex(function (token) {
          return token.refresh_token === refreshToken;
        });
      }
    },
    hasUserWithData: {

      /**
       * Determines if database has a specific user based on data
       *
       * @param {String} email - The email to lookup
       * @param {String} password - The password to lookup
       * @return {Boolean}
       *
       */

      value: function hasUserWithData(email, password) {
        return !! ~this._users.findIndex(function (user) {
          return user.email === email && user.password === password;
        });
      }
    },
    hasUserWithToken: {

      /**
       * Determines if database has a specific user based on token
       *
       * @param {String} accessToken - The token to lookup
       * @return {Boolean}
       *
       */

      value: function hasUserWithToken(accessToken) {
        return !! ~this._tokens.findIndex(function (token) {
          return token.access_token === accessToken;
        });
      }
    },
    getTokenFor: {

      /**
       * Returns token for a user
       *
       * @param {String} userId - The user id to lookup
       * @return {Object}
       *
       */

      value: function getTokenFor(userId) {
        return this._tokens.find(function (token) {
          return token.user_id === userId;
        });
      }
    },
    hasUserWithEmail: {

      /**
       * Determines if database has a specific user based on email
       *
       * @param {String} email - The email to lookup
       * @return {Boolean}
       *
       */

      value: function hasUserWithEmail(email) {
        return !! ~this._users.findIndex(function (user) {
          return user.email === email;
        });
      }
    },
    hasPasswordResetToken: {

      /**
       * Determines if database has a specific password reset token
       *
       * @param {String} token - The token to lookup
       * @return {Boolean}
       *
       */

      value: function hasPasswordResetToken(token) {
        return !! ~this._passwords.findIndex(function (record) {
          return record.token === token;
        });
      }
    },
    getUserWithData: {

      /**
       * Returns user from fixtures based on data
       *
       * @param {String} email - The target user email
       * @param {String} password - The target user password
       * @return {Boolean}
       *
       */

      value: function getUserWithData(email, password) {
        return this._extractUser(this._users.find(function (user) {
          return user.email === email && user.password === password;
        }));
      }
    },
    getUserWithId: {

      /**
       *
       * Returns user from fixtures based on `id`
       * @param {String} id - The user id to lookup
       * @return {Object} The found user data
       *
       */

      value: function getUserWithId(id) {
        return this._extractUser(this._users.find(function (user) {
          return user.id === id;
        }));
      }
    },
    getUserWithToken: {

      /**
       * Returns user from fixtures based on token
       *
       * @param {String} accessToken - The token to lookup
       * @return {Object} The found `access_token` and `refresh_token`
       *
       */

      value: function getUserWithToken(accessToken) {
        var userId = this._tokens.find(function (token) {
          return token.access_token === accessToken;
        }).user_id;
        return this.getUserWithId(userId);
      }
    },
    addUser: {

      /**
       * Adds user to fixtures
       *
       * @param {String} email - The email to set
       * @param {String} password - The password to set
       * @param {String} firstName - The firstName to set - Optional
       * @param {String} lastName - The lastName to set - Optional
       * @return {Object} The user data merged into an object
       *
       */

      value: function addUser(email, password, firstName, lastName) {
        var userId = generateRandomUUID();
        var publisherId = generateRandomUUID();
        var accessToken = generateRandomString();
        var refreshToken = generateRandomString();
        var newToken = {
          user_id: userId,
          access_token: accessToken,
          refresh_token: refreshToken };
        var newUser = {
          id: userId,
          publisher_id: publisherId,
          email: email,
          password: password,
          first_name: firstName,
          last_name: lastName };
        // Store new records
        this._tokens.push(newToken);
        this._users.push(newUser);
        // Return public user data
        return this._extractUser(newUser);
      }
    },
    updateUser: {

      /**
       * Updates user
       *
       * @param {String} id - The user id to lookup
       * @param {String} firstName - The firstName to update
       * @param {String} lastName - The lastName to update
       * @return {Object} The user data merged into an object
       *
       */

      value: function updateUser(id, firstName, lastName) {
        var user = this._users.find(function (record) {
          return record.id === id;
        });
        if (typeof firstName !== "undefined") {
          user.first_name = firstName;
        }
        if (typeof lastName !== "undefined") {
          user.last_name = lastName;
        }
        // Return public user data
        return this._extractUser(user);
      }
    },
    updateToken: {

      /**
       * Updates token
       *
       * @param {String} refreshToken - The refreshToken to use
       * @return {Object} The found `access_token` and `refresh_token`
       *
       */

      value: function updateToken(refreshToken) {
        var token = this._tokens.find(function (record) {
          return record.refresh_token === refreshToken;
        });
        token.access_token = generateRandomString();
        token.refresh_token = generateRandomString();
        // Return public user data
        return this._extractToken(token);
      }
    }
  });

  return SandboxDatabase;
})();

module.exports = SandboxDatabase;

},{"../utils":32}],25:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assert = require("assert");
var Consumer = require("../services/consumer");
var validatePassword = require("../utils").validatePassword;

/**
 * @class Authenticator
 */

var Authenticator = (function () {

  /**
   * Initializes Authenticator
   *
   * @constructor
   * @param {Store} store - The Store instance to use
   * @return {Authenticator}
   *
   */

  function Authenticator(consumer) {
    _classCallCheck(this, Authenticator);

    assert(consumer instanceof Consumer, "`consumer` should be instance of Consumer");
    this._consumer = consumer;
  }

  _createClass(Authenticator, {
    requestPasswordReset: {

      /**
       * Asks for a password reset
       *
       * @param {String} email - The email to reset the password for
       * @return {Promise}
       *
       */

      value: function requestPasswordReset(email) {
        assert(email, "Missing `email`");
        return this._consumer.requestPasswordReset(email).then(function () {
          return Promise.resolve({ message: "A reset link has been sent to your email" });
        });
      }
    },
    resetPassword: {

      /**
       * Sets a new password
       *
       * @param {String} token - The reset token provided via email
       * @param {String} password - The new password
       * @return {Promise}
       *
       */

      value: function resetPassword(token, password) {
        assert(token, "Missing `token`");
        assert(password, "Missing `password`");

        var _validatePassword = validatePassword(password);

        var isValid = _validatePassword.isValid;
        var message = _validatePassword.message;

        if (!isValid) {
          return Promise.reject(new Error(message));
        }
        return this._consumer.resetPassword(token, password).then(function () {
          return Promise.resolve({ message: "Your password has been reset" });
        });
      }
    }
  });

  return Authenticator;
})();

module.exports = Authenticator;

},{"../services/consumer":29,"../utils":32,"assert":6}],26:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assert = require("assert");

/**
 * @class Client
 */

var Client = (function () {

  /**
   * Initializes Client
   *
   * @constructor
   * @param {String} id - The Client id
   * @param {String} secret - The Client secret
   * @return {Client}
   *
   */

  function Client(id, secret) {
    _classCallCheck(this, Client);

    assert(id, "Missing `id`");
    assert(secret, "Missing `secret`");
    this._id = id;
    this._secret = secret;
  }

  _createClass(Client, {
    id: {

      /**
       * Returns Client id
       *
       * @return {String}
       *
       */

      get: function () {
        return this._id;
      }
    },
    secret: {

      /**
       * Returns Client secret
       *
       * @return {String}
       *
       */

      get: function () {
        return this._secret;
      }
    }
  });

  return Client;
})();

module.exports = Client;

},{"assert":6}],27:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assert = require("assert");
var User = require("../models/user");
var retrieveURL = require("../utils").retrieveURL;
var redirectToURL = require("../utils").redirectToURL;

/**
 * @class Session
 */

var Session = (function () {

  /**
   * Initializes User
   *
   * @constructor
   * @param {User} consumer - The User instance to use
   * @param {String} loginHost - The login app host
   * @param {String} redirectFn - The function the forces URL redirection - Defaults to `window.location.replace`
   * @param {String} pageURL - The current page URL - Defaults to `window.href`
   * @return {User}
   *
   */

  function Session(user, loginHost) {
    var redirectFn = arguments[2] === undefined ? redirectToURL : arguments[2];
    var pageURL = arguments[3] === undefined ? retrieveURL : arguments[3];

    _classCallCheck(this, Session);

    assert(user instanceof User, "`user` should be instance of User");
    assert(loginHost, "`loginHost` is not defined");
    this._user = user;
    this._loginHost = loginHost;
    this._redirectFn = redirectFn;
    this._pageURL = pageURL;
  }

  _createClass(Session, {
    isValid: {

      /**
       * Determines if session is valid (User is authenticated)
       *
       * @return {Boolean}
       *
       */

      get: function () {
        return typeof this._user.bearer !== "undefined";
      }
    },
    initialize: {

      /**
       * Initializes session for user (if defined) in Store
       * Note: This should be the FIRST call before attempting any other session operations
       *
       * @return {Promise}
       *
       */

      value: function initialize() {
        return this._user.syncWithStore();
      }
    },
    invalidate: {

      /**
       * Invalidates Session
       *
       * @return {Void}
       *
       */

      value: function invalidate() {
        // Redirect to login host with a return URL
        return this._redirectFn("" + this._loginHost + "/logout");
      }
    },
    validate: {

      /**
       * Validates Session
       * - Extracts current URL from window.location
       * - Redirects to `loginHost` with encoded URL
       *
       * @return {Void}
       *
       */

      value: function validate() {
        var redirectUrl = encodeURIComponent(this._pageURL());
        return this._redirectFn("" + this._loginHost + "/login?redirectUrl=" + redirectUrl);
      }
    }
  });

  return Session;
})();

module.exports = Session;

},{"../models/user":28,"../utils":32,"assert":6}],28:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assert = require("assert");
var Consumer = require("../services/consumer");
var Store = require("../services/store");
var validatePassword = require("../utils").validatePassword;

/**
 * @class User
 */

var User = (function () {

  /**
   * Initializes User
   *
   * @constructor
   * @param {Store} store - The Store instance to use
   * @param {Consumer} consumer - The Consumer instance to use
   * @return {User}
   *
   */

  function User(store, consumer) {
    _classCallCheck(this, User);

    assert(store instanceof Store, "`store` should be instance of Store");
    assert(consumer instanceof Consumer, "`consumer` should be instance of Consumer");
    this._store = store;
    this._consumer = consumer;
    this._bearer = undefined;
    this._id = undefined;
    this._publisherId = undefined;
    this._firstName = undefined;
    this._lastName = undefined;
    this._email = undefined;
    this._isDirty = false;
  }

  _createClass(User, {
    id: {

      /**
       * Returns User id
       *
       * @return {String} [read-only] id
       *
       */

      get: function () {
        return this._id;
      }
    },
    publisherId: {

      /**
       * Returns User publisherId
       *
       * @return {String} [read-only] publisherId
       *
       */

      get: function () {
        return this._publisherId;
      }
    },
    email: {

      /**
       * Returns User email
       *
       * @return {String} [read-only] email
       *
       */

      get: function () {
        return this._email;
      }
    },
    bearer: {

      /**
       * Returns User bearer token
       *
       * @return {String} [read-write] bearer token
       *
       */

      get: function () {
        return this._bearer;
      }
    },
    firstName: {

      /**
       * Returns User first Name
       *
       * @return {String} [read-write] first Name
       *
       */

      get: function () {
        return this._firstName;
      },
      set: function (newFirstName) {
        if (newFirstName) {
          this._isDirty = true;
          this._firstName = newFirstName;
        }
      }
    },
    lastName: {

      /**
       * Returns User last name
       *
       * @return {String} [read-write] last name
       *
       */

      get: function () {
        return this._lastName;
      },
      set: function (newLastName) {
        if (newLastName) {
          this._isDirty = true;
          this._lastName = newLastName;
        }
      }
    },
    syncWithStore: {

      /**
       * Syncr User data from Store
       * - Currently on bearer is synced to Store
       * - Store priority proceeds dirty data
       *
       * @return {Promise}
       *
       */

      value: function syncWithStore() {
        var _this = this;

        var bearer = undefined;
        return this._store.get("access_token").then(function (accessToken) {
          // Cache bearer
          bearer = accessToken;
          return _this._consumer.retrieveUser(accessToken);
        }).then(function (data) {
          _this._id = data.id;
          _this._publisherId = data.publisher_id;
          _this._email = data.email;
          _this._firstName = data.first_name;
          _this._lastName = data.last_name;
          _this._bearer = bearer;
          _this._isDirty = false;
          return Promise.resolve({
            data: data,
            message: "Synced User model with Store" });
        });
      }
    },
    save: {

      /**
       * Updates User data
       *
       * @return {Promise}
       *
       */

      value: function save() {
        var _this = this;

        if (!this._id) {
          return Promise.reject(new Error("Cannot save a non-existent User"));
        }
        if (!this._isDirty) {
          return Promise.resolve({
            message: "No User model changes to sync" });
        }
        return this._consumer.updateUser(this._id, this._bearer, {
          firstName: this._firstName,
          lastName: this._lastName }).then(function () {
          _this._isDirty = false;
          return Promise.resolve({
            message: "Updated User model" });
        });
      }
    },
    create: {

      /**
       * Creates a new User
       *
       * @param {String} email - The email to set
       * @param {String} password - The password to set
       * @param {String} firstName - The first name to set
       * @param {String} lastName - The last name to set
       * @return {Promise}
       *
       */

      value: function create(email, password, firstName, lastName) {
        var _this = this;

        assert(email, "Missing `email`");
        assert(password, "Missing `password`");

        var _validatePassword = validatePassword(password);

        var isValid = _validatePassword.isValid;
        var message = _validatePassword.message;

        if (!isValid) {
          return Promise.reject(new Error(message));
        }
        return this._consumer.createUser(email, password, firstName, lastName).then(function (data) {
          _this._id = data.id;
          _this._publisherId = data.publisher_id;
          _this._firstName = data.first_name;
          _this._lastName = data.last_name;
          _this._email = data.email;
          _this._isDirty = false;
          return Promise.resolve({
            data: data,
            message: "Created User" });
        });
      }
    },
    authenticate: {

      /**
       * Retrieves authentication tokens for a username-password combination
       *
       * @param {String} username - The username to use
       * @param {String} password - The password to use
       * @return {Promise}
       *
       */

      value: function authenticate(username, password) {
        var _this = this;

        assert(username, "Missing `username`");
        assert(password, "Missing `password`");
        var bearer = undefined;
        return this._consumer.retrieveToken(username, password).then(function (res) {
          var access_token = res.access_token;
          var refresh_token = res.refresh_token;

          // Cache bearer
          bearer = access_token;
          // Store tokens
          return _this._store.set("access_token", access_token).then(function () {
            return _this._store.set("refresh_token", refresh_token);
          }).then(function () {
            return _this._consumer.retrieveUser(access_token);
          });
          // Retrieve user data
        }).then(function (data) {
          _this._bearer = bearer;
          _this._id = data.id;
          _this._publisherId = data.publisher_id;
          _this._email = data.email;
          _this._firstName = data.first_name;
          _this._lastName = data.last_name;
          _this._isDirty = false;
          return Promise.resolve({
            data: data,
            message: "Authenticated User" });
        });
      }
    },
    authenticateWithToken: {

      /**
       * Retrieves user for an access token.
       * Fallbacks to token refresh if refreshToken is defined
       *
       * @param {String} accessToken - The access token to use
       * @param {String} refreshToken - The refresh token to use (Optional)
       * @return {Promise}
       *
       */

      value: function authenticateWithToken(accessToken, refreshToken) {
        var _this = this;

        assert(accessToken, "Missing `accessToken`");
        // Store access token
        this._store.set("access_token", accessToken);
        // Store refresh token (or clear if undefined)
        if (refreshToken) {
          this._store.set("refresh_token", refreshToken);
        } else {
          this._store.remove("refresh_token");
        }
        return this._consumer.retrieveUser(accessToken)["catch"](function (err) {
          if (!refreshToken || err.name !== "invalid_token") {
            return Promise.reject(err);
          }
          // Try to refresh the tokens if the error is of `invalid_token`
          return _this._consumer.refreshToken(refreshToken).then(function (newTokens) {
            // Store new tokens
            _this._store.set("access_token", newTokens.access_token);
            _this._store.set("refresh_token", newTokens.refresh_token);
            // Retrieve user with new token
            return _this._consumer.retrieveUser(newTokens.access_token);
          });
        }).then(function (data) {
          _this._bearer = accessToken;
          _this._id = data.id;
          _this._publisherId = data.publisher_id;
          _this._email = data.email;
          _this._firstName = data.first_name;
          _this._lastName = data.last_name;
          _this._isDirty = false;
          return Promise.resolve({
            data: data,
            message: "Authenticated User" });
        });
      }
    },
    flush: {

      /**
       * Flushes stored tokens for User (logout)
       *
       * @return {Promise}
       *
       */

      value: function flush() {
        this._bearer = undefined;
        this._id = undefined;
        this._publisherId = undefined;
        this._firstName = undefined;
        this._lastName = undefined;
        this._email = undefined;
        this._isDirty = false;
        return this._store.remove("access_token", "refresh_token").then(function () {
          return Promise.resolve({
            message: "Flushed User data" });
        });
      }
    }
  });

  return User;
})();

module.exports = User;

},{"../services/consumer":29,"../services/store":31,"../utils":32,"assert":6}],29:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assert = require("assert");
var qs = require("qs");
var Client = require("../models/client");
var ProductionAPI = require("../api").Production;
var SandboxAPI = require("../api").Sandbox;
var extractErrorMessage = require("../utils").extractErrorMessage;

/**
 * @class Consumer
 */

var Consumer = (function () {

  /**
   * Initializes Consumer
   *
   * @constructor
   * @param {Client} client - The Client instance to use
   * @param {API.Production|API.Sandbox} api - The api to use for fetching data
   * @return {Consumer}
   *
   */

  function Consumer(client, api) {
    _classCallCheck(this, Consumer);

    assert(client instanceof Client, "`client` should be instance of Client");
    assert(api instanceof ProductionAPI || api instanceof SandboxAPI, "`api` should be instance of API.Production or API.Sandbox");
    this._client = client;
    this._api = api;
  }

  _createClass(Consumer, {
    _request: {

      /**
       * Returns data from API
       *
       * @private
       * @param {String} resource - The resource to fetch from
       * @param {Object} payload - The payload to pass
       * @return {Promise}
       *
       */

      value: function _request(resource, payload) {
        return this._api.invoke(resource, payload).then(function (res) {
          var status = res.status;
          var body = res.body;

          if (parseInt(status, 10) >= 400) {
            var error = new Error(extractErrorMessage(body.error));
            error.name = body.error;
            return Promise.reject(error);
          }
          return Promise.resolve(body);
        });
      }
    },
    retrieveToken: {

      /**
       * Retrieves token from a username-password combination
       *
       * @param {String} username - The username to use
       * @param {String} password - The password to use
       * @return {Promise}
       *
       */

      value: function retrieveToken(username, password) {
        var grant_type = "password";
        return this._request("token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded" },
          body: this._formEncode({
            username: username,
            password: password,
            grant_type: grant_type,
            client_id: this._client.id,
            client_secret: this._client.secret }) });
      }
    },
    refreshToken: {

      /**
       * Returns a renewed token
       *
       * @param {String} refreshToken - The refresh token to use
       * @return {Promise}
       *
       */

      value: (function (_refreshToken) {
        var _refreshTokenWrapper = function refreshToken(_x) {
          return _refreshToken.apply(this, arguments);
        };

        _refreshTokenWrapper.toString = function () {
          return _refreshToken.toString();
        };

        return _refreshTokenWrapper;
      })(function (refreshToken) {
        var grant_type = "refresh_token";
        return this._request("token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded" },
          body: this._formEncode({
            refresh_token: refreshToken,
            grant_type: grant_type,
            client_id: this._client.id,
            client_secret: this._client.secret }) });
      })
    },
    _formEncode: {

      /**
       * Returns a url encoded string
       *
       * @param {Object} obj - Object to stringify
       * @return {String}
       *
       */

      value: function _formEncode(obj) {
        return qs.stringify(obj);
      }
    },
    _jsonEncode: {

      /**
       * Returns a json encoded string
       *
       * @param {Object} obj - Object to stringify
       * @return {String}
       *
       */

      value: function _jsonEncode(obj) {
        return JSON.stringify(obj);
      }
    },
    createUser: {

      /**
       * Creates a new User
       *
       * @param {String} email - The email to use
       * @param {String} password - The password to use
       * @param {String} firstName - The first name to use
       * @param {String} lastName - The last name to use
       * @return {Promise}
       *
       */

      value: function createUser(email, password, firstName, lastName) {
        return this._request("users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json" },
          body: this._jsonEncode({
            email: email,
            password: password,
            first_name: firstName,
            last_name: lastName }) });
      }
    },
    retrieveUser: {

      /**
       * Retrives a User
       *
       * @param {String} token - The `Bearer` token
       * @return {Promise}
       *
       */

      value: function retrieveUser(token) {
        return this._request("users/me", {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json" },
          method: "GET" });
      }
    },
    updateUser: {

      /**
       * Updates a User
       *
       * @param {String} userId - The User id
       * @param {String} token - The `Bearer` token
       * @param {String} options.firstName - The first ame to use
       * @param {String} options.lastName - The last name to use
       * @return {Promise}
       *
       */

      value: function updateUser(userId, token, options) {
        return this._request("users/" + userId, {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json" },
          body: this._jsonEncode({
            first_name: options.firstName,
            last_name: options.lastName }) });
      }
    },
    requestPasswordReset: {

      /**
       * Requests for a password reset
       *
       * @param {String} email - The email to forward the reset token to
       * @return {Promise}
       *
       */

      value: function requestPasswordReset(email) {
        return this._request("passwords", {
          method: "POST",
          headers: {
            "Content-Type": "application/json" },
          body: this._jsonEncode({
            email: email }) });
      }
    },
    resetPassword: {

      /**
       * Resets password
       *
       * @param {String} token - The reset token to use
       * @param {String} password - The new password
       * @return {Promise}
       *
       */

      value: function resetPassword(token, password) {
        return this._request("passwords/" + token, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json" },
          body: this._jsonEncode({
            password: password }) });
      }
    }
  });

  return Consumer;
})();

module.exports = Consumer;

},{"../api":21,"../models/client":26,"../utils":32,"assert":6,"qs":13}],30:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assert = require("assert");
var CrossStorageClient = require("cross-storage").CrossStorageClient;

/**
 * Wrapper around `CrossStorageClient`
 *
 * @class Store
 * @see https://github.com/zendesk/cross-storage
 *
 */

var StorageClient = (function () {

  /**
   * Initializes StorageClient
   *
   * @constructor
   * @param {String} domain - The domain under which all values will be attached
   * @param {Class} CrossStorageClientClass - The CrossStorageClient class to be instantiated (Defaults to CrossStorageClient)
   * @return {Store}
   *
   */

  function StorageClient(iframeHub) {
    var CrossStorageClientClass = arguments[1] === undefined ? CrossStorageClient : arguments[1];

    _classCallCheck(this, StorageClient);

    assert(iframeHub, "Missing `iframeHub`");
    this._iframeHub = iframeHub;
    this._CrossStorageClientClass = CrossStorageClientClass;
    this._instance = undefined;
  }

  _createClass(StorageClient, {
    onConnect: {

      /**
       * Wrapper of CrossStorageClient.onConnect();
       * CrossStorageClient injects an iframe in the DOM, so we need
       * to ensure that the insertion happens ONLY when an event is triggered
       *
       * @private
       * @return {Promise}
       */

      value: function onConnect() {
        if (!this._instance) {
          this._instance = new this._CrossStorageClientClass(this._iframeHub);
        }
        return this._instance.onConnect();
      }
    },
    get: {

      /**
       * Wrapper of CrossStorageClient.get();
       *
       * @param {Arguments} rest
       * @return {Promise}
       */

      value: function get() {
        var _this = this;

        for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
          rest[_key] = arguments[_key];
        }

        return this.onConnect().then(function () {
          var _instance;

          return (_instance = _this._instance).get.apply(_instance, rest);
        });
      }
    },
    set: {

      /**
       * Wrapper of CrossStorageClient.set();
       *
       * @param {Arguments} rest
       * @return {Promise}
       */

      value: function set() {
        var _this = this;

        for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
          rest[_key] = arguments[_key];
        }

        return this.onConnect().then(function () {
          var _instance;

          return (_instance = _this._instance).set.apply(_instance, rest);
        });
      }
    },
    del: {

      /**
       * Wrapper of CrossStorageClient.del();
       *
       * @param {Arguments} rest
       * @return {Promise}
       */

      value: function del() {
        var _this = this;

        for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
          rest[_key] = arguments[_key];
        }

        return this.onConnect().then(function () {
          var _instance;

          return (_instance = _this._instance).del.apply(_instance, rest);
        });
      }
    }
  });

  return StorageClient;
})();

module.exports = StorageClient;

},{"assert":6,"cross-storage":9}],31:[function(require,module,exports){
"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assert = require("assert");
var StorageClient = require("./storage-client");

/**
 * @class Store
 */

var Store = (function () {

  /**
   * Initializes Store
   *
   * @constructor
   * @param {String} domain - The domain under which all values will be attached
   * @param {String} iframeHub - The iframe URL where all the values will be attached
   * @param {Object} iframeHub - The iframe URL where all the values will be attached
   * @param {Class} StorageClientClass - The CrossStorageClient Class to be instantiated
   * @return {Store}
   *
   */

  function Store(domain, iframeHub) {
    var StorageClientClass = arguments[2] === undefined ? StorageClient : arguments[2];

    _classCallCheck(this, Store);

    assert(domain, "Missing `domain`");
    assert(iframeHub, "Missing `iframeHub`");
    this._domain = domain;
    this._iframeHub = iframeHub;
    this._storage = new StorageClientClass(iframeHub);
  }

  _createClass(Store, {
    _normalizeKey: {

      /**
       * Normalizes key based on domain
       *
       * @private
       * @param {String} key - The key to use
       * @return {String} The normalized key
       *
       */

      value: function _normalizeKey(key) {
        return "" + this._domain + "_" + key;
      }
    },
    set: {

      /**
       * Sets value for a key
       *
       * @param {String} key - The key to use
       * @param {String} value - The value to set
       *
       */

      value: function set(key, value) {
        return this._storage.set(this._normalizeKey(key), value);
      }
    },
    get: {

      /**
       * Returns value for a stored key
       *
       * @param {String} key - The key to use
       * @return {String}
       *
       */

      value: function get(key) {
        return this._storage.get(this._normalizeKey(key));
      }
    },
    remove: {

      /**
       * Removes one or multiple value pair if they exists
       *
       * @param {String|Array} keys - The key(s) to use
       *
       */

      value: function remove() {
        var _this = this;

        var _storage;

        for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
          keys[_key] = arguments[_key];
        }

        var normalizedKeys = keys.map(function (key) {
          return _this._normalizeKey(key);
        });
        return (_storage = this._storage).del.apply(_storage, _toConsumableArray(normalizedKeys));
      }
    }
  });

  return Store;
})();

module.exports = Store;

},{"./storage-client":30,"assert":6}],32:[function(require,module,exports){
/**
 * @namespace Utils
 */
/**
 * Generates a random string
 *
 * @memberof Utils
 * @param {Number} radix - The radix to use. Defaults to `18`
 * @return {String}
 *
 */
"use strict";

function generateRandomString() {
  return Math.random().toString(18).slice(2);
}

module.exports.generateRandomString = generateRandomString;

/**
 * Generates a random UUID
 *
 * @memberof Utils
 * @return {String}
 *
 */
function generateRandomUUID() {
  var base = "" + generateRandomString() + "" + generateRandomString();
  return "" + base.substring(0, 8) + "-" + base.substring(9, 13) + "-" + base.substring(14, 18) + "-" + base.substring(19, 23) + "-" + base.substring(24, 36);
}

module.exports.generateRandomUUID = generateRandomUUID;

/**
 * Strips Bearer from Authorization header
 *
 * @memberof Utils
 * @param {String} header - The Authorization header to strip
 * @return {String}
 *
 */
function stripBearer(header) {
  return ("" + header).replace("Bearer", "").trim();
}

module.exports.stripBearer = stripBearer;

/**
 * Returns error message for `errorCode`
 *
 * @memberof Utils
 * @param {String} errorCode - The `errorCode` to map
 * @return {String}
 *
 */

var extractErrorMessage = function (errorCode) {
  switch (errorCode) {
    case "validation_failed":
      return "Validation failed";
    case "not_found":
      return "Not found";
    case "forbidden_resource":
      return "Forbidden resource";
    case "access_denied":
      return "The resource owner or authorization server denied the request";
    case "unsupported_grant_type":
      return "The authorization grant type is not supported";
    case "invalid_grant":
      return "Invalid credentials";
    case "unauthorized_request":
      return "Unauthorized request";
    case "unauthorized_client":
      return "The authenticated client is not authorized";
    case "invalid_token":
      return "The access token provided is expired, revoked, malformed, or invalid";
    case "invalid_scope":
      return "The requested scope is invalid, unknown, or malformed";
    case "invalid_client":
      return "Client authentication failed";
    case "invalid_request":
      return "The request is missing a required parameter";
    default:
      return "Unexpected error";
  }
};

module.exports.extractErrorMessage = extractErrorMessage;

/**
 * Validates a password pair agains the following rules:
 * - Password cannot contain spaces
 * - Password must contain both numbers and characters
 * - Password must be at least 8 characters long
 *
 * @memberof Utils
 * @param {String} password - The `password` to validate
 * @return {Object} Contains `isValid {Boolean}` and `message {String}`
 *
 */
var validatePassword = function (password) {
  var containsSpaces = /\s/i.test(password);
  var containsNumber = /\d/i.test(password);
  var containsCharacters = /[a-z]/i.test(password);
  if (containsSpaces) {
    return {
      message: "Password cannot contain spaces",
      isValid: false };
  }
  if (!containsNumber || !containsCharacters) {
    return {
      message: "Password must contain both numbers and characters",
      isValid: false };
  }
  if (password.length < 8) {
    return {
      message: "Password must be at least 8 characters long",
      isValid: false };
  }
  return {
    isValid: true };
};

module.exports.validatePassword = validatePassword;

/* istanbul ignore next */

/**
 * Wrapper around window.location.replace()
 *
 * @memberof Utils
 * @param {String} url - The url to redirect to
 * @return {Void}
 *
 */
var redirectToURL = function (url) {
  window.location.replace(url);
};

module.exports.redirectToURL = redirectToURL;

/* istanbul ignore next */

/**
 * Wrapper around window.location.href
 *
 * @memberof Utils
 * @return {String}
 *
 */
var retrieveURL = function () {
  return window.location.href;
};

module.exports.retrieveURL = retrieveURL;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCIvVXNlcnMvZG10cnMvY29kZS9hdXRoZW50aWNhdGlvbi1jbGllbnQvY29uZmlnL2RlZmF1bHQuanMiLCJmaXh0dXJlcy9wYXNzd29yZHMuanNvbiIsImZpeHR1cmVzL3Rva2Vucy5qc29uIiwiZml4dHVyZXMvdXNlcnMuanNvbiIsIm5vZGVfbW9kdWxlcy9hc3NlcnQvYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzL2Nyb3NzLXN0b3JhZ2UvbGliL2NsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9jcm9zcy1zdG9yYWdlL2xpYi9odWIuanMiLCJub2RlX21vZHVsZXMvY3Jvc3Mtc3RvcmFnZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9lczYtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcXMvbGliL2Zvcm1hdHMuanMiLCJub2RlX21vZHVsZXMvcXMvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3FzL2xpYi9wYXJzZS5qcyIsIm5vZGVfbW9kdWxlcy9xcy9saWIvc3RyaW5naWZ5LmpzIiwibm9kZV9tb2R1bGVzL3FzL2xpYi91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIiwibm9kZV9tb2R1bGVzL3doYXR3Zy1mZXRjaC9mZXRjaC5qcyIsIi9Vc2Vycy9kbXRycy9jb2RlL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvYXBpL2luZGV4LmpzIiwiL1VzZXJzL2RtdHJzL2NvZGUvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9hcGkvcHJvZHVjdGlvbi5qcyIsIi9Vc2Vycy9kbXRycy9jb2RlL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvYXBpL3NhbmRib3guanMiLCIvVXNlcnMvZG10cnMvY29kZS9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL2RhdGFiYXNlcy9zYW5kYm94LmpzIiwiL1VzZXJzL2RtdHJzL2NvZGUvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9tb2RlbHMvYXV0aGVudGljYXRvci5qcyIsIi9Vc2Vycy9kbXRycy9jb2RlL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvbW9kZWxzL2NsaWVudC5qcyIsIi9Vc2Vycy9kbXRycy9jb2RlL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvbW9kZWxzL3Nlc3Npb24uanMiLCIvVXNlcnMvZG10cnMvY29kZS9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL21vZGVscy91c2VyLmpzIiwiL1VzZXJzL2RtdHJzL2NvZGUvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9zZXJ2aWNlcy9jb25zdW1lci5qcyIsIi9Vc2Vycy9kbXRycy9jb2RlL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvc2VydmljZXMvc3RvcmFnZS1jbGllbnQuanMiLCIvVXNlcnMvZG10cnMvY29kZS9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL3NlcnZpY2VzL3N0b3JlLmpzIiwiL1VzZXJzL2RtdHJzL2NvZGUvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy91dGlscy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4TEEsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLEtBQUcsRUFBRTtBQUNILFFBQUksRUFBRSxzQkFBc0IsRUFDN0I7QUFDRCxPQUFLLEVBQUU7QUFDTCxRQUFJLEVBQUUsdUJBQXVCLEVBQzlCO0FBQ0QsT0FBSyxFQUFFO0FBQ0wsVUFBTSxFQUFFLFdBQVc7QUFDbkIsYUFBUyxFQUFFLDJCQUEyQixFQUN2QyxFQUNGLENBQUM7OztBQ1hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2b0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3a0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDLFdBQVcsR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnL2RlZmF1bHRcIik7XG52YXIgU3RvcmUgPSByZXF1aXJlKFwiLi9zZXJ2aWNlcy9zdG9yZVwiKTtcbnZhciBVc2VyID0gcmVxdWlyZShcIi4vbW9kZWxzL3VzZXJcIik7XG52YXIgQ2xpZW50ID0gcmVxdWlyZShcIi4vbW9kZWxzL2NsaWVudFwiKTtcbnZhciBTZXNzaW9uID0gcmVxdWlyZShcIi4vbW9kZWxzL3Nlc3Npb25cIik7XG52YXIgQXV0aGVudGljYXRvciA9IHJlcXVpcmUoXCIuL21vZGVscy9hdXRoZW50aWNhdG9yXCIpO1xudmFyIENvbnN1bWVyID0gcmVxdWlyZShcIi4vc2VydmljZXMvY29uc3VtZXJcIik7XG52YXIgQVBJID0gcmVxdWlyZShcIi4vYXBpXCIpO1xudmFyIFNhbmRib3hEYXRhYmFzZSA9IHJlcXVpcmUoXCIuL2RhdGFiYXNlcy9zYW5kYm94XCIpO1xudmFyIFVzZXJGaXh0dXJlcyA9IHJlcXVpcmUoXCIuLi9maXh0dXJlcy91c2Vycy5qc29uXCIpO1xudmFyIFRva2VuRml4dHVyZXMgPSByZXF1aXJlKFwiLi4vZml4dHVyZXMvdG9rZW5zLmpzb25cIik7XG52YXIgUGFzc3dvcmRGaXh0dXJlcyA9IHJlcXVpcmUoXCIuLi9maXh0dXJlcy9wYXNzd29yZHMuanNvblwiKTtcblxuLyoqXG4gKiBDcm9zc1N0b3JhZ2VIdWJcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3plbmRlc2svY3Jvc3Mtc3RvcmFnZVxuICovXG52YXIgQ3Jvc3NTdG9yYWdlSHViID0gcmVxdWlyZShcImNyb3NzLXN0b3JhZ2VcIikuQ3Jvc3NTdG9yYWdlSHViO1xuXG4vKipcbiAqIEdsb2JhbCBwb2x5ZmlsbCBmb3Ige1Byb21pc2V9XG4gKi9cbnJlcXVpcmUoXCJlczYtcHJvbWlzZVwiKS5wb2x5ZmlsbCgpO1xuXG4vKipcbiAqIEdsb2JhbCBwb2x5ZmlsbCBmb3Ige2ZldGNofVxuICovXG5yZXF1aXJlKFwid2hhdHdnLWZldGNoXCIpO1xuXG4vKipcbiAqIEBuYW1lc3BhY2UgQXV0aGVudGljYXRpb25DbGllbnRcbiAqL1xudmFyIEF1dGhlbnRpY2F0aW9uQ2xpZW50ID0gKGZ1bmN0aW9uIGltbWVkaWF0ZSgpIHtcbiAgLyoqXG4gICAqIEVudmlyb25tZW50IEVOVU1cbiAgICpcbiAgICogQGVudW1cbiAgICogcmV0dXJuIHtPYmplY3R9XG4gICAqXG4gICAqL1xuICB2YXIgRU5WID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgUHJvZHVjdGlvbjogU3ltYm9sKFwiUHJvZHVjdGlvblwiKSxcbiAgICBTYW5kYm94OiBTeW1ib2woXCJTYW5kYm94XCIpIH0pO1xuXG4gIC8qKlxuICAgKiBDYWNoZWQgaW5zdGFuY2VzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge01hcH1cbiAgICpcbiAgICovXG4gIHZhciBpbnN0YW5jZXMgPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gQVBJIGluc3RhY2VzIGZvciBhbiBFTlYgc2V0dXBcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHRocm93cyB7RXJyb3J9XG4gICAqIEBwYXJhbSB7RU5WfSBlbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXQgLSBEZWZhdWx0cyB0byBgUHJvZHVjdGlvbmBcbiAgICogQHJldHVybiB7U2FuZGJveEFQSXxQcm9kdWN0aW9uQVBJfVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0QVBJRm9yKGVudmlyb25tZW50KSB7XG4gICAgdmFyIGhvc3QgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGNvbmZpZy5hcGkuaG9zdCA6IGFyZ3VtZW50c1sxXTtcblxuICAgIGlmIChlbnZpcm9ubWVudCA9PT0gRU5WLlByb2R1Y3Rpb24pIHtcbiAgICAgIHJldHVybiBuZXcgQVBJLlByb2R1Y3Rpb24oaG9zdCk7XG4gICAgfVxuICAgIGlmIChlbnZpcm9ubWVudCA9PT0gRU5WLlNhbmRib3gpIHtcbiAgICAgIHJldHVybiBuZXcgQVBJLlNhbmRib3gobmV3IFNhbmRib3hEYXRhYmFzZShVc2VyRml4dHVyZXMsIFRva2VuRml4dHVyZXMsIFBhc3N3b3JkRml4dHVyZXMpKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBgZW52aXJvbm1lbnRgIHBhc3NlZFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYW4gQXV0aGVudGljYXRpb25DbGllbnQgaW5zdGFuY2VcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudElkIC0gVGhlIGNsaWVudCBpZCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFNlY3JldCAtIFRoZSBjbGllbnQgc2VjcmV0XG4gICAqIEBwYXJhbSB7RU5WfSBlbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGxvZ2luSG9zdCAtIFRoZSBsb2dpbiBob3N0IFVSTFxuICAgKiBAcGFyYW0ge1N0cmluZ30gYXBpSG9zdCAtIFRoZSBBUEkgaG9zdFxuICAgKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZVxuICAgKiBAcmV0dXJuIHtBdXRoZW50aWNhdG9yfVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gZ2VuZXJhdGVJbnN0YW5jZShjbGllbnRJZCwgY2xpZW50U2VjcmV0LCBfeCwgX3gyLCBhcGlIb3N0LCBzdG9yZSkge1xuICAgIHZhciBlbnZpcm9ubWVudCA9IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gRU5WLlByb2R1Y3Rpb24gOiBhcmd1bWVudHNbMl07XG4gICAgdmFyIGxvZ2luSG9zdCA9IGFyZ3VtZW50c1szXSA9PT0gdW5kZWZpbmVkID8gY29uZmlnLmxvZ2luLmhvc3QgOiBhcmd1bWVudHNbM107XG5cbiAgICB2YXIgYXBpID0gZ2V0QVBJRm9yKGVudmlyb25tZW50LCBhcGlIb3N0KTtcbiAgICB2YXIgY2xpZW50ID0gbmV3IENsaWVudChjbGllbnRJZCwgY2xpZW50U2VjcmV0KTtcbiAgICB2YXIgY29uc3VtZXIgPSBuZXcgQ29uc3VtZXIoY2xpZW50LCBhcGkpO1xuICAgIHZhciB1c2VyID0gbmV3IFVzZXIoc3RvcmUsIGNvbnN1bWVyKTtcbiAgICB2YXIgc2Vzc2lvbiA9IG5ldyBTZXNzaW9uKHVzZXIsIGxvZ2luSG9zdCk7XG4gICAgdmFyIGF1dGhlbnRpY2F0b3IgPSBuZXcgQXV0aGVudGljYXRvcihjb25zdW1lcik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVzZXI6IHVzZXIsXG4gICAgICBzZXNzaW9uOiBzZXNzaW9uLFxuICAgICAgYXV0aGVudGljYXRvcjogYXV0aGVudGljYXRvciB9O1xuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIC8qKlxuICAgICAqIEVudmlyb25tZW50IGVudW1cbiAgICAgKlxuICAgICAqIEBlbnVtXG4gICAgICogQG1lbWJlcm9mIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gICAgICpcbiAgICAgKi9cbiAgICBFbnZpcm9ubWVudDogRU5WLFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgQ3Jvc3NTdG9yYWdlSHViXG4gICAgICpcbiAgICAgKiBAZW51bVxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqXG4gICAgICovXG4gICAgaW5pdFN0b3JhZ2U6IGZ1bmN0aW9uIGluaXRTdG9yYWdlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBDcm9zc1N0b3JhZ2VIdWIuaW5pdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBBdXRoZW50aWNhdG9yIGluc3RhbmNlIGZvciBhIGNsaWVudElkLCBjbGllbnRTZWNyZXQgY29tYmluYXRpb25cbiAgICAgKlxuICAgICAqIEBmdW5jdGlvbiBnZXRJbnN0YW5jZUZvclxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmNsaWVudElkIC0gVGhlIENsaWVudCBpZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuY2xpZW50U2VjcmV0IC0gVGhlIENsaWVudCBzZWNyZXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmxvZ2luSG9zdCAtIFRoZSBsb2dpbiBob3N0IFVSTFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuYXBpSG9zdCAtIFRoZSBBUEkgaG9zdFxuICAgICAqIEBwYXJhbSB7U3RvcmV9IHBhcmFtcy5zdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7RU5WfSBwYXJhbXMuZW52aXJvbm1lbnQgLSBUaGUgZW52aXJvbm1lbnQgdG8gc2V0XG4gICAgICogQHJldHVybiB7QXV0aGVudGljYXRvcn1cbiAgICAgKlxuICAgICAqL1xuICAgIGdldEluc3RhbmNlRm9yOiBmdW5jdGlvbiBnZXRJbnN0YW5jZUZvcihfcmVmKSB7XG4gICAgICB2YXIgY2xpZW50SWQgPSBfcmVmLmNsaWVudElkO1xuICAgICAgdmFyIGNsaWVudFNlY3JldCA9IF9yZWYuY2xpZW50U2VjcmV0O1xuICAgICAgdmFyIGVudmlyb25tZW50ID0gX3JlZi5lbnZpcm9ubWVudDtcbiAgICAgIHZhciBsb2dpbkhvc3QgPSBfcmVmLmxvZ2luSG9zdDtcbiAgICAgIHZhciBhcGlIb3N0ID0gX3JlZi5hcGlIb3N0O1xuICAgICAgdmFyIF9yZWYkc3RvcmUgPSBfcmVmLnN0b3JlO1xuICAgICAgdmFyIHN0b3JlID0gX3JlZiRzdG9yZSA9PT0gdW5kZWZpbmVkID8gbmV3IFN0b3JlKGNvbmZpZy5zdG9yZS5kb21haW4sIGNvbmZpZy5zdG9yZS5pZnJhbWVIdWIpIDogX3JlZiRzdG9yZTtcblxuICAgICAgdmFyIGtleSA9IFwiXCIgKyBjbGllbnRJZCArIFwiLVwiICsgY2xpZW50U2VjcmV0O1xuICAgICAgLy8gUmV0dXJuIGNhY2hlZCBpbnN0YW5jZVxuICAgICAgaWYgKGluc3RhbmNlcy5oYXMoa2V5KSkge1xuICAgICAgICByZXR1cm4gaW5zdGFuY2VzLmdldChrZXkpO1xuICAgICAgfVxuICAgICAgLy8gR2VuZXJhdGUgJiBjYWNoZSBuZXcgaW5zdGFuY2VcbiAgICAgIHZhciBpbnN0YW5jZSA9IGdlbmVyYXRlSW5zdGFuY2UoY2xpZW50SWQsIGNsaWVudFNlY3JldCwgZW52aXJvbm1lbnQsIGxvZ2luSG9zdCwgYXBpSG9zdCwgc3RvcmUpO1xuICAgICAgaW5zdGFuY2VzLnNldChrZXksIGluc3RhbmNlKTtcbiAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmx1c2hlcyBjYWNoZWQgaW5zdGFuY2VzXG4gICAgICpcbiAgICAgKiBAZnVuY3Rpb24gcmVzZXRcbiAgICAgKiBAbWVtYmVyb2YgQXV0aGVudGljYXRpb25DbGllbnRcbiAgICAgKlxuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgIGluc3RhbmNlcy5jbGVhcigpO1xuICAgIH0gfTtcbn0pKCk7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cbmlmIChnbG9iYWwud2luZG93KSB7XG4gIGdsb2JhbC53aW5kb3cuQXV0aGVudGljYXRpb25DbGllbnQgPSBBdXRoZW50aWNhdGlvbkNsaWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoZW50aWNhdGlvbkNsaWVudDtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWtiWFJ5Y3k5amIyUmxMMkYxZEdobGJuUnBZMkYwYVc5dUxXTnNhV1Z1ZEM5emNtTXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPMEZCUVVFc1NVRkJUU3hOUVVGTkxFZEJRVWNzVDBGQlR5eERRVUZETEcxQ1FVRnRRaXhEUVVGRExFTkJRVU03UVVGRE5VTXNTVUZCVFN4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExHdENRVUZyUWl4RFFVRkRMRU5CUVVNN1FVRkRNVU1zU1VGQlRTeEpRVUZKTEVkQlFVY3NUMEZCVHl4RFFVRkRMR1ZCUVdVc1EwRkJReXhEUVVGRE8wRkJRM1JETEVsQlFVMHNUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPMEZCUXpGRExFbEJRVTBzVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZETzBGQlF6VkRMRWxCUVUwc1lVRkJZU3hIUVVGSExFOUJRVThzUTBGQlF5eDNRa0ZCZDBJc1EwRkJReXhEUVVGRE8wRkJRM2hFTEVsQlFVMHNVVUZCVVN4SFFVRkhMRTlCUVU4c1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RFFVRkRPMEZCUTJoRUxFbEJRVTBzUjBGQlJ5eEhRVUZITEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVNM1FpeEpRVUZOTEdWQlFXVXNSMEZCUnl4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXp0QlFVTjJSQ3hKUVVGTkxGbEJRVmtzUjBGQlJ5eFBRVUZQTEVOQlFVTXNkMEpCUVhkQ0xFTkJRVU1zUTBGQlF6dEJRVU4yUkN4SlFVRk5MR0ZCUVdFc1IwRkJSeXhQUVVGUExFTkJRVU1zZVVKQlFYbENMRU5CUVVNc1EwRkJRenRCUVVONlJDeEpRVUZOTEdkQ1FVRm5RaXhIUVVGSExFOUJRVThzUTBGQlF5dzBRa0ZCTkVJc1EwRkJReXhEUVVGRE96czdPenM3UVVGTkwwUXNTVUZCVFN4bFFVRmxMRWRCUVVjc1QwRkJUeXhEUVVGRExHVkJRV1VzUTBGQlF5eERRVUZETEdWQlFXVXNRMEZCUXpzN096czdRVUZMYWtVc1QwRkJUeXhEUVVGRExHRkJRV0VzUTBGQlF5eERRVUZETEZGQlFWRXNSVUZCUlN4RFFVRkRPenM3T3p0QlFVdHNReXhQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdPenM3TzBGQlRYaENMRWxCUVUwc2IwSkJRVzlDTEVkQlFVY3NRMEZCUXl4VFFVRlRMRk5CUVZNc1IwRkJSenM3T3pzN096czdRVUZSYWtRc1RVRkJUU3hIUVVGSExFZEJRVWNzVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTjRRaXhqUVVGVkxFVkJRVVVzVFVGQlRTeERRVUZETEZsQlFWa3NRMEZCUXp0QlFVTm9ReXhYUVVGUExFVkJRVVVzVFVGQlRTeERRVUZETEZOQlFWTXNRMEZCUXl4RlFVTXpRaXhEUVVGRExFTkJRVU03T3pzN096czdPenRCUVZOSUxFMUJRVTBzVTBGQlV5eEhRVUZITEVsQlFVa3NSMEZCUnl4RlFVRkZMRU5CUVVNN096czdPenM3T3pzN08wRkJWelZDTEZkQlFWTXNVMEZCVXl4RFFVRkRMRmRCUVZjc1JVRkJNRUk3VVVGQmVFSXNTVUZCU1N4blEwRkJSeXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEVsQlFVazdPMEZCUTNCRUxGRkJRVWtzVjBGQlZ5eExRVUZMTEVkQlFVY3NRMEZCUXl4VlFVRlZMRVZCUVVVN1FVRkRiRU1zWVVGQlR5eEpRVUZKTEVkQlFVY3NRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UzBGRGFrTTdRVUZEUkN4UlFVRkpMRmRCUVZjc1MwRkJTeXhIUVVGSExFTkJRVU1zVDBGQlR5eEZRVUZGTzBGQlF5OUNMR0ZCUVU4c1NVRkJTU3hIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NaVUZCWlN4RFFVRkRMRmxCUVZrc1JVRkJSU3hoUVVGaExFVkJRVVVzWjBKQlFXZENMRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRelZHTzBGQlEwUXNWVUZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXc0UWtGQk9FSXNRMEZCUXl4RFFVRkRPMGRCUTJwRU96czdPenM3T3pzN096czdPenM3UVVGbFJDeFhRVUZUTEdkQ1FVRm5RaXhEUVVGRExGRkJRVkVzUlVGQlJTeFpRVUZaTEZkQlFTdEVMRTlCUVU4c1JVRkJSU3hMUVVGTExFVkJRVVU3VVVGQk4wVXNWMEZCVnl4blEwRkJSeXhIUVVGSExFTkJRVU1zVlVGQlZUdFJRVUZGTEZOQlFWTXNaME5CUVVjc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKT3p0QlFVTXpSeXhSUVVGTkxFZEJRVWNzUjBGQlJ5eFRRVUZUTEVOQlFVTXNWMEZCVnl4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRelZETEZGQlFVMHNUVUZCVFN4SFFVRkhMRWxCUVVrc1RVRkJUU3hEUVVGRExGRkJRVkVzUlVGQlJTeFpRVUZaTEVOQlFVTXNRMEZCUXp0QlFVTnNSQ3hSUVVGTkxGRkJRVkVzUjBGQlJ5eEpRVUZKTEZGQlFWRXNRMEZCUXl4TlFVRk5MRVZCUVVVc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRE0wTXNVVUZCVFN4SlFVRkpMRWRCUVVjc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eEZRVUZGTEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUTNaRExGRkJRVTBzVDBGQlR5eEhRVUZITEVsQlFVa3NUMEZCVHl4RFFVRkRMRWxCUVVrc1JVRkJSU3hUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU0zUXl4UlFVRk5MR0ZCUVdFc1IwRkJSeXhKUVVGSkxHRkJRV0VzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTnNSQ3hYUVVGUE8wRkJRMHdzVlVGQlNTeEZRVUZLTEVsQlFVazdRVUZEU2l4aFFVRlBMRVZCUVZBc1QwRkJUenRCUVVOUUxHMUNRVUZoTEVWQlFXSXNZVUZCWVN4RlFVTmtMRU5CUVVNN1IwRkRTRHM3UVVGRlJDeFRRVUZQT3pzN096czdPenM3UVVGVFRDeGxRVUZYTEVWQlFVVXNSMEZCUnpzN096czdPenM3TzBGQlUyaENMR1ZCUVZjc1JVRkJRU3h4UWtGQlF5eFBRVUZQTEVWQlFVVTdRVUZEYmtJc1lVRkJUeXhsUVVGbExFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMHRCUTNSRE96czdPenM3T3pzN096czdPenM3T3p0QlFXbENSQ3hyUWtGQll5eEZRVUZCTERoQ1FVRTRTRHRWUVVFelNDeFJRVUZSTEZGQlFWSXNVVUZCVVR0VlFVRkZMRmxCUVZrc1VVRkJXaXhaUVVGWk8xVkJRVVVzVjBGQlZ5eFJRVUZZTEZkQlFWYzdWVUZCUlN4VFFVRlRMRkZCUVZRc1UwRkJVenRWUVVGRkxFOUJRVThzVVVGQlVDeFBRVUZQT3pSQ1FVRkZMRXRCUVVzN1ZVRkJUQ3hMUVVGTExEaENRVUZITEVsQlFVa3NTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeEZRVUZGTEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRE96dEJRVU4wU1N4VlFVRk5MRWRCUVVjc1VVRkJUU3hSUVVGUkxGTkJRVWtzV1VGQldTeEJRVUZGTEVOQlFVTTdPMEZCUlRGRExGVkJRVWtzVTBGQlV5eERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVOMFFpeGxRVUZQTEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03VDBGRE0wSTdPMEZCUlVRc1ZVRkJUU3hSUVVGUkxFZEJRVWNzWjBKQlFXZENMRU5CUVVNc1VVRkJVU3hGUVVGRkxGbEJRVmtzUlVGQlJTeFhRVUZYTEVWQlFVVXNVMEZCVXl4RlFVRkZMRTlCUVU4c1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dEJRVU5zUnl4bFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTTNRaXhoUVVGUExGRkJRVkVzUTBGQlF6dExRVU5xUWpzN096czdPenM3TzBGQlUwUXNVMEZCU3l4RlFVRkJMR2xDUVVGSE8wRkJRMDRzWlVGQlV5eERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRPMHRCUTI1Q0xFVkJSVVlzUTBGQlF6dERRVU5JTEVOQlFVRXNSVUZCUnl4RFFVRkRPenM3TzBGQlNVd3NTVUZCU1N4TlFVRk5MRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRMnBDTEZGQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc2IwSkJRVzlDTEVkQlFVY3NiMEpCUVc5Q0xFTkJRVU03UTBGRE0wUTdPMEZCUlVRc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eHZRa0ZCYjBJc1EwRkJReUlzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVkyOXVjM1FnWTI5dVptbG5JRDBnY21WeGRXbHlaU2duTGk0dlkyOXVabWxuTDJSbFptRjFiSFFuS1R0Y2JtTnZibk4wSUZOMGIzSmxJRDBnY21WeGRXbHlaU2duTGk5elpYSjJhV05sY3k5emRHOXlaU2NwTzF4dVkyOXVjM1FnVlhObGNpQTlJSEpsY1hWcGNtVW9KeTR2Ylc5a1pXeHpMM1Z6WlhJbktUdGNibU52Ym5OMElFTnNhV1Z1ZENBOUlISmxjWFZwY21Vb0p5NHZiVzlrWld4ekwyTnNhV1Z1ZENjcE8xeHVZMjl1YzNRZ1UyVnpjMmx2YmlBOUlISmxjWFZwY21Vb0p5NHZiVzlrWld4ekwzTmxjM05wYjI0bktUdGNibU52Ym5OMElFRjFkR2hsYm5ScFkyRjBiM0lnUFNCeVpYRjFhWEpsS0NjdUwyMXZaR1ZzY3k5aGRYUm9aVzUwYVdOaGRHOXlKeWs3WEc1amIyNXpkQ0JEYjI1emRXMWxjaUE5SUhKbGNYVnBjbVVvSnk0dmMyVnlkbWxqWlhNdlkyOXVjM1Z0WlhJbktUdGNibU52Ym5OMElFRlFTU0E5SUhKbGNYVnBjbVVvSnk0dllYQnBKeWs3WEc1amIyNXpkQ0JUWVc1a1ltOTRSR0YwWVdKaGMyVWdQU0J5WlhGMWFYSmxLQ2N1TDJSaGRHRmlZWE5sY3k5ellXNWtZbTk0SnlrN1hHNWpiMjV6ZENCVmMyVnlSbWw0ZEhWeVpYTWdQU0J5WlhGMWFYSmxLQ2N1TGk5bWFYaDBkWEpsY3k5MWMyVnljeTVxYzI5dUp5azdYRzVqYjI1emRDQlViMnRsYmtacGVIUjFjbVZ6SUQwZ2NtVnhkV2x5WlNnbkxpNHZabWw0ZEhWeVpYTXZkRzlyWlc1ekxtcHpiMjRuS1R0Y2JtTnZibk4wSUZCaGMzTjNiM0prUm1sNGRIVnlaWE1nUFNCeVpYRjFhWEpsS0NjdUxpOW1hWGgwZFhKbGN5OXdZWE56ZDI5eVpITXVhbk52YmljcE8xeHVYRzR2S2lwY2JpQXFJRU55YjNOelUzUnZjbUZuWlVoMVlseHVJQ29nUUhObFpTQm9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZlbVZ1WkdWemF5OWpjbTl6Y3kxemRHOXlZV2RsWEc0Z0tpOWNibU52Ym5OMElFTnliM056VTNSdmNtRm5aVWgxWWlBOUlISmxjWFZwY21Vb0oyTnliM056TFhOMGIzSmhaMlVuS1M1RGNtOXpjMU4wYjNKaFoyVklkV0k3WEc1Y2JpOHFLbHh1SUNvZ1IyeHZZbUZzSUhCdmJIbG1hV3hzSUdadmNpQjdVSEp2YldselpYMWNiaUFxTDF4dWNtVnhkV2x5WlNnblpYTTJMWEJ5YjIxcGMyVW5LUzV3YjJ4NVptbHNiQ2dwTzF4dVhHNHZLaXBjYmlBcUlFZHNiMkpoYkNCd2IyeDVabWxzYkNCbWIzSWdlMlpsZEdOb2ZWeHVJQ292WEc1eVpYRjFhWEpsS0NkM2FHRjBkMmN0Wm1WMFkyZ25LVHRjYmx4dVhHNHZLaXBjYmlBcUlFQnVZVzFsYzNCaFkyVWdRWFYwYUdWdWRHbGpZWFJwYjI1RGJHbGxiblJjYmlBcUwxeHVZMjl1YzNRZ1FYVjBhR1Z1ZEdsallYUnBiMjVEYkdsbGJuUWdQU0FvWm5WdVkzUnBiMjRnYVcxdFpXUnBZWFJsS0NrZ2UxeHVJQ0F2S2lwY2JpQWdJQ29nUlc1MmFYSnZibTFsYm5RZ1JVNVZUVnh1SUNBZ0tseHVJQ0FnS2lCQVpXNTFiVnh1SUNBZ0tpQnlaWFIxY200Z2UwOWlhbVZqZEgxY2JpQWdJQ3BjYmlBZ0lDb3ZYRzRnSUdOdmJuTjBJRVZPVmlBOUlFOWlhbVZqZEM1bWNtVmxlbVVvZTF4dUlDQWdJRkJ5YjJSMVkzUnBiMjQ2SUZONWJXSnZiQ2duVUhKdlpIVmpkR2x2YmljcExGeHVJQ0FnSUZOaGJtUmliM2c2SUZONWJXSnZiQ2duVTJGdVpHSnZlQ2NwTEZ4dUlDQjlLVHRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRMkZqYUdWa0lHbHVjM1JoYm1ObGMxeHVJQ0FnS2x4dUlDQWdLaUJBY0hKcGRtRjBaVnh1SUNBZ0tpQkFjbVYwZFhKdUlIdE5ZWEI5WEc0Z0lDQXFYRzRnSUNBcUwxeHVJQ0JqYjI1emRDQnBibk4wWVc1alpYTWdQU0J1WlhjZ1RXRndLQ2s3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRkpsZEhWeWJuTWdZVzRnUVZCSklHbHVjM1JoWTJWeklHWnZjaUJoYmlCRlRsWWdjMlYwZFhCY2JpQWdJQ3BjYmlBZ0lDb2dRSEJ5YVhaaGRHVmNiaUFnSUNvZ1FIUm9jbTkzY3lCN1JYSnliM0o5WEc0Z0lDQXFJRUJ3WVhKaGJTQjdSVTVXZlNCbGJuWnBjbTl1YldWdWRDQXRJRlJvWlNCbGJuWnBjbTl1YldWdWRDQjBieUJ6WlhRZ0xTQkVaV1poZFd4MGN5QjBieUJnVUhKdlpIVmpkR2x2Ym1CY2JpQWdJQ29nUUhKbGRIVnliaUI3VTJGdVpHSnZlRUZRU1h4UWNtOWtkV04wYVc5dVFWQkpmVnh1SUNBZ0tseHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdaMlYwUVZCSlJtOXlLR1Z1ZG1seWIyNXRaVzUwTENCb2IzTjBJRDBnWTI5dVptbG5MbUZ3YVM1b2IzTjBLU0I3WEc0Z0lDQWdhV1lnS0dWdWRtbHliMjV0Wlc1MElEMDlQU0JGVGxZdVVISnZaSFZqZEdsdmJpa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHNWxkeUJCVUVrdVVISnZaSFZqZEdsdmJpaG9iM04wS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdhV1lnS0dWdWRtbHliMjV0Wlc1MElEMDlQU0JGVGxZdVUyRnVaR0p2ZUNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUc1bGR5QkJVRWt1VTJGdVpHSnZlQ2h1WlhjZ1UyRnVaR0p2ZUVSaGRHRmlZWE5sS0ZWelpYSkdhWGgwZFhKbGN5d2dWRzlyWlc1R2FYaDBkWEpsY3l3Z1VHRnpjM2R2Y21SR2FYaDBkWEpsY3lrcE8xeHVJQ0FnSUgxY2JpQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KMGx1ZG1Gc2FXUWdZR1Z1ZG1seWIyNXRaVzUwWUNCd1lYTnpaV1FuS1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkhaVzVsY21GMFpYTWdZVzRnUVhWMGFHVnVkR2xqWVhScGIyNURiR2xsYm5RZ2FXNXpkR0Z1WTJWY2JpQWdJQ3BjYmlBZ0lDb2dRSEJ5YVhaaGRHVmNiaUFnSUNvZ1FIQmhjbUZ0SUh0VGRISnBibWQ5SUdOc2FXVnVkRWxrSUMwZ1ZHaGxJR05zYVdWdWRDQnBaQ0IwYnlCelpYUmNiaUFnSUNvZ1FIQmhjbUZ0SUh0VGRISnBibWQ5SUdOc2FXVnVkRk5sWTNKbGRDQXRJRlJvWlNCamJHbGxiblFnYzJWamNtVjBYRzRnSUNBcUlFQndZWEpoYlNCN1JVNVdmU0JsYm5acGNtOXViV1Z1ZENBdElGUm9aU0JsYm5acGNtOXViV1Z1ZENCMGJ5QnpaWFJjYmlBZ0lDb2dRSEJoY21GdElIdFRkSEpwYm1kOUlHeHZaMmx1U0c5emRDQXRJRlJvWlNCc2IyZHBiaUJvYjNOMElGVlNURnh1SUNBZ0tpQkFjR0Z5WVcwZ2UxTjBjbWx1WjMwZ1lYQnBTRzl6ZENBdElGUm9aU0JCVUVrZ2FHOXpkRnh1SUNBZ0tpQkFjR0Z5WVcwZ2UxTjBiM0psZlNCemRHOXlaU0F0SUZSb1pTQlRkRzl5WlNCcGJuTjBZVzVqWlZ4dUlDQWdLaUJBY21WMGRYSnVJSHRCZFhSb1pXNTBhV05oZEc5eWZWeHVJQ0FnS2x4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z1oyVnVaWEpoZEdWSmJuTjBZVzVqWlNoamJHbGxiblJKWkN3Z1kyeHBaVzUwVTJWamNtVjBMQ0JsYm5acGNtOXViV1Z1ZENBOUlFVk9WaTVRY205a2RXTjBhVzl1TENCc2IyZHBia2h2YzNRZ1BTQmpiMjVtYVdjdWJHOW5hVzR1YUc5emRDd2dZWEJwU0c5emRDd2djM1J2Y21VcElIdGNiaUFnSUNCamIyNXpkQ0JoY0drZ1BTQm5aWFJCVUVsR2IzSW9aVzUyYVhKdmJtMWxiblFzSUdGd2FVaHZjM1FwTzF4dUlDQWdJR052Ym5OMElHTnNhV1Z1ZENBOUlHNWxkeUJEYkdsbGJuUW9ZMnhwWlc1MFNXUXNJR05zYVdWdWRGTmxZM0psZENrN1hHNGdJQ0FnWTI5dWMzUWdZMjl1YzNWdFpYSWdQU0J1WlhjZ1EyOXVjM1Z0WlhJb1kyeHBaVzUwTENCaGNHa3BPMXh1SUNBZ0lHTnZibk4wSUhWelpYSWdQU0J1WlhjZ1ZYTmxjaWh6ZEc5eVpTd2dZMjl1YzNWdFpYSXBPMXh1SUNBZ0lHTnZibk4wSUhObGMzTnBiMjRnUFNCdVpYY2dVMlZ6YzJsdmJpaDFjMlZ5TENCc2IyZHBia2h2YzNRcE8xeHVJQ0FnSUdOdmJuTjBJR0YxZEdobGJuUnBZMkYwYjNJZ1BTQnVaWGNnUVhWMGFHVnVkR2xqWVhSdmNpaGpiMjV6ZFcxbGNpazdYRzRnSUNBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0FnSUhWelpYSXNYRzRnSUNBZ0lDQnpaWE56YVc5dUxGeHVJQ0FnSUNBZ1lYVjBhR1Z1ZEdsallYUnZjaXhjYmlBZ0lDQjlPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUVWdWRtbHliMjV0Wlc1MElHVnVkVzFjYmlBZ0lDQWdLbHh1SUNBZ0lDQXFJRUJsYm5WdFhHNGdJQ0FnSUNvZ1FHMWxiV0psY205bUlFRjFkR2hsYm5ScFkyRjBhVzl1UTJ4cFpXNTBYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpOWNiaUFnSUNCRmJuWnBjbTl1YldWdWREb2dSVTVXTEZ4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1NXNXBkR2xoYkdsNlpYTWdRM0p2YzNOVGRHOXlZV2RsU0hWaVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQVpXNTFiVnh1SUNBZ0lDQXFJRUJ0WlcxaVpYSnZaaUJCZFhSb1pXNTBhV05oZEdsdmJrTnNhV1Z1ZEZ4dUlDQWdJQ0FxWEc0Z0lDQWdJQ292WEc0Z0lDQWdhVzVwZEZOMGIzSmhaMlVvYjNCMGFXOXVjeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRU55YjNOelUzUnZjbUZuWlVoMVlpNXBibWwwS0c5d2RHbHZibk1wTzF4dUlDQWdJSDBzWEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCRGNtVmhkR1Z6SUdGdUlFRjFkR2hsYm5ScFkyRjBiM0lnYVc1emRHRnVZMlVnWm05eUlHRWdZMnhwWlc1MFNXUXNJR05zYVdWdWRGTmxZM0psZENCamIyMWlhVzVoZEdsdmJseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FHWjFibU4wYVc5dUlHZGxkRWx1YzNSaGJtTmxSbTl5WEc0Z0lDQWdJQ29nUUcxbGJXSmxjbTltSUVGMWRHaGxiblJwWTJGMGFXOXVRMnhwWlc1MFhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0UFltcGxZM1I5SUhCaGNtRnRjMXh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdVM1J5YVc1bmZTQndZWEpoYlhNdVkyeHBaVzUwU1dRZ0xTQlVhR1VnUTJ4cFpXNTBJR2xrWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRUZEhKcGJtZDlJSEJoY21GdGN5NWpiR2xsYm5SVFpXTnlaWFFnTFNCVWFHVWdRMnhwWlc1MElITmxZM0psZEZ4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3VTNSeWFXNW5mU0J3WVhKaGJYTXViRzluYVc1SWIzTjBJQzBnVkdobElHeHZaMmx1SUdodmMzUWdWVkpNWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRUZEhKcGJtZDlJSEJoY21GdGN5NWhjR2xJYjNOMElDMGdWR2hsSUVGUVNTQm9iM04wWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRUZEc5eVpYMGdjR0Z5WVcxekxuTjBiM0psSUMwZ1ZHaGxJRk4wYjNKbElHbHVjM1JoYm1ObFhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0RlRsWjlJSEJoY21GdGN5NWxiblpwY205dWJXVnVkQ0F0SUZSb1pTQmxiblpwY205dWJXVnVkQ0IwYnlCelpYUmNiaUFnSUNBZ0tpQkFjbVYwZFhKdUlIdEJkWFJvWlc1MGFXTmhkRzl5ZlZ4dUlDQWdJQ0FxWEc0Z0lDQWdJQ292WEc0Z0lDQWdaMlYwU1c1emRHRnVZMlZHYjNJb2V5QmpiR2xsYm5SSlpDd2dZMnhwWlc1MFUyVmpjbVYwTENCbGJuWnBjbTl1YldWdWRDd2diRzluYVc1SWIzTjBMQ0JoY0dsSWIzTjBMQ0J6ZEc5eVpTQTlJRzVsZHlCVGRHOXlaU2hqYjI1bWFXY3VjM1J2Y21VdVpHOXRZV2x1TENCamIyNW1hV2N1YzNSdmNtVXVhV1p5WVcxbFNIVmlLU0I5S1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0JyWlhrZ1BTQmdKSHRqYkdsbGJuUkpaSDB0Skh0amJHbGxiblJUWldOeVpYUjlZRHRjYmlBZ0lDQWdJQzh2SUZKbGRIVnliaUJqWVdOb1pXUWdhVzV6ZEdGdVkyVmNiaUFnSUNBZ0lHbG1JQ2hwYm5OMFlXNWpaWE11YUdGektHdGxlU2twSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdsdWMzUmhibU5sY3k1blpYUW9hMlY1S1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUM4dklFZGxibVZ5WVhSbElDWWdZMkZqYUdVZ2JtVjNJR2x1YzNSaGJtTmxYRzRnSUNBZ0lDQmpiMjV6ZENCcGJuTjBZVzVqWlNBOUlHZGxibVZ5WVhSbFNXNXpkR0Z1WTJVb1kyeHBaVzUwU1dRc0lHTnNhV1Z1ZEZObFkzSmxkQ3dnWlc1MmFYSnZibTFsYm5Rc0lHeHZaMmx1U0c5emRDd2dZWEJwU0c5emRDd2djM1J2Y21VcE8xeHVJQ0FnSUNBZ2FXNXpkR0Z1WTJWekxuTmxkQ2hyWlhrc0lHbHVjM1JoYm1ObEtUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCcGJuTjBZVzVqWlR0Y2JpQWdJQ0I5TEZ4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1JteDFjMmhsY3lCallXTm9aV1FnYVc1emRHRnVZMlZ6WEc0Z0lDQWdJQ3BjYmlBZ0lDQWdLaUJBWm5WdVkzUnBiMjRnY21WelpYUmNiaUFnSUNBZ0tpQkFiV1Z0WW1WeWIyWWdRWFYwYUdWdWRHbGpZWFJwYjI1RGJHbGxiblJjYmlBZ0lDQWdLbHh1SUNBZ0lDQXFMMXh1SUNBZ0lISmxjMlYwS0NrZ2UxeHVJQ0FnSUNBZ2FXNXpkR0Z1WTJWekxtTnNaV0Z5S0NrN1hHNGdJQ0FnZlN4Y2JseHVJQ0I5TzF4dWZTa29LVHRjYmx4dUx5b2dhWE4wWVc1aWRXd2dhV2R1YjNKbElHNWxlSFFnS2k5Y2JseHVhV1lnS0dkc2IySmhiQzUzYVc1a2IzY3BJSHRjYmlBZ1oyeHZZbUZzTG5kcGJtUnZkeTVCZFhSb1pXNTBhV05oZEdsdmJrTnNhV1Z1ZENBOUlFRjFkR2hsYm5ScFkyRjBhVzl1UTJ4cFpXNTBPMXh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFRjFkR2hsYm5ScFkyRjBhVzl1UTJ4cFpXNTBPMXh1SWwxOSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBhcGk6IHtcbiAgICBob3N0OiAnLy9hdXRoLmF2b2NhcnJvdC5jb20nLFxuICB9LFxuICBsb2dpbjoge1xuICAgIGhvc3Q6ICcvL2xvZ2luLmF2b2NhcnJvdC5jb20nLFxuICB9LFxuICBzdG9yZToge1xuICAgIGRvbWFpbjogJ2F2b2NhcnJvdCcsXG4gICAgaWZyYW1lSHViOiAnLy9sb2dpbi5hdm9jYXJyb3QuY29tL2h1YicsXG4gIH0sXG59O1xuIiwibW9kdWxlLmV4cG9ydHM9W1xuICB7XG4gICAgXCJ1c2VyX2lkXCI6IFwiNDRkMmM4ZTAtNzYyYi00ZmE1LTg1NzEtMDk3YzgxYzMxMzBkXCIsXG4gICAgXCJ0b2tlblwiOiBcInlKaGJHY2llT2lKSVV6STFOaUlzSUo5blI1Y0NJNklrcFhWQ1wiXG4gIH1cbl1cbiIsIm1vZHVsZS5leHBvcnRzPVtcbiAge1xuICAgIFwidXNlcl9pZFwiOiBcIjQ0ZDJjOGUwLTc2MmItNGZhNS04NTcxLTA5N2M4MWMzMTMwZFwiLFxuICAgIFwicmVmcmVzaF90b2tlblwiOiBcImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOVwiLFxuICAgIFwiYWNjZXNzX3Rva2VuXCI6IFwicmtka0pIVkJkQ2pMSUlqc0lLNE5hbGF1eFBQOHVvNWhZOHRUTjdcIlxuICB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHtcbiAgICBcImlkXCI6IFwiNDRkMmM4ZTAtNzYyYi00ZmE1LTg1NzEtMDk3YzgxYzMxMzBkXCIsXG4gICAgXCJwdWJsaXNoZXJfaWRcIjogXCI1NWY1YzhlMC03NjJiLTRmYTUtODU3MS0xOTdjODE4MzEzMGFcIixcbiAgICBcImZpcnN0X25hbWVcIjogXCJKb2huXCIsXG4gICAgXCJsYXN0X25hbWVcIjogXCJEb2VcIixcbiAgICBcImVtYWlsXCI6IFwiam9obi5kb2VAbWFpbC5jb21cIixcbiAgICBcInBhc3N3b3JkXCI6IFwicXdlcnR5MTIzXCJcbiAgfVxuXVxuIiwiLy8gaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvVW5pdF9UZXN0aW5nLzEuMFxuLy9cbi8vIFRISVMgSVMgTk9UIFRFU1RFRCBOT1IgTElLRUxZIFRPIFdPUksgT1VUU0lERSBWOCFcbi8vXG4vLyBPcmlnaW5hbGx5IGZyb20gbmFyd2hhbC5qcyAoaHR0cDovL25hcndoYWxqcy5vcmcpXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDkgVGhvbWFzIFJvYmluc29uIDwyODBub3J0aC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvXG4vLyBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZVxuLy8gcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yXG4vLyBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHdoZW4gdXNlZCBpbiBub2RlLCB0aGlzIHdpbGwgYWN0dWFsbHkgbG9hZCB0aGUgdXRpbCBtb2R1bGUgd2UgZGVwZW5kIG9uXG4vLyB2ZXJzdXMgbG9hZGluZyB0aGUgYnVpbHRpbiB1dGlsIG1vZHVsZSBhcyBoYXBwZW5zIG90aGVyd2lzZVxuLy8gdGhpcyBpcyBhIGJ1ZyBpbiBub2RlIG1vZHVsZSBsb2FkaW5nIGFzIGZhciBhcyBJIGFtIGNvbmNlcm5lZFxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsLycpO1xuXG52YXIgcFNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8vIDEuIFRoZSBhc3NlcnQgbW9kdWxlIHByb3ZpZGVzIGZ1bmN0aW9ucyB0aGF0IHRocm93XG4vLyBBc3NlcnRpb25FcnJvcidzIHdoZW4gcGFydGljdWxhciBjb25kaXRpb25zIGFyZSBub3QgbWV0LiBUaGVcbi8vIGFzc2VydCBtb2R1bGUgbXVzdCBjb25mb3JtIHRvIHRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlLlxuXG52YXIgYXNzZXJ0ID0gbW9kdWxlLmV4cG9ydHMgPSBvaztcblxuLy8gMi4gVGhlIEFzc2VydGlvbkVycm9yIGlzIGRlZmluZWQgaW4gYXNzZXJ0LlxuLy8gbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7IG1lc3NhZ2U6IG1lc3NhZ2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWwsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IGV4cGVjdGVkIH0pXG5cbmFzc2VydC5Bc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIEFzc2VydGlvbkVycm9yKG9wdGlvbnMpIHtcbiAgdGhpcy5uYW1lID0gJ0Fzc2VydGlvbkVycm9yJztcbiAgdGhpcy5hY3R1YWwgPSBvcHRpb25zLmFjdHVhbDtcbiAgdGhpcy5leHBlY3RlZCA9IG9wdGlvbnMuZXhwZWN0ZWQ7XG4gIHRoaXMub3BlcmF0b3IgPSBvcHRpb25zLm9wZXJhdG9yO1xuICBpZiAob3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubWVzc2FnZSA9IGdldE1lc3NhZ2UodGhpcyk7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gdHJ1ZTtcbiAgfVxuICB2YXIgc3RhY2tTdGFydEZ1bmN0aW9uID0gb3B0aW9ucy5zdGFja1N0YXJ0RnVuY3Rpb24gfHwgZmFpbDtcblxuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIG5vbiB2OCBicm93c2VycyBzbyB3ZSBjYW4gaGF2ZSBhIHN0YWNrdHJhY2VcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XG4gICAgaWYgKGVyci5zdGFjaykge1xuICAgICAgdmFyIG91dCA9IGVyci5zdGFjaztcblxuICAgICAgLy8gdHJ5IHRvIHN0cmlwIHVzZWxlc3MgZnJhbWVzXG4gICAgICB2YXIgZm5fbmFtZSA9IHN0YWNrU3RhcnRGdW5jdGlvbi5uYW1lO1xuICAgICAgdmFyIGlkeCA9IG91dC5pbmRleE9mKCdcXG4nICsgZm5fbmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgLy8gb25jZSB3ZSBoYXZlIGxvY2F0ZWQgdGhlIGZ1bmN0aW9uIGZyYW1lXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgYmVmb3JlIGl0IChhbmQgaXRzIGxpbmUpXG4gICAgICAgIHZhciBuZXh0X2xpbmUgPSBvdXQuaW5kZXhPZignXFxuJywgaWR4ICsgMSk7XG4gICAgICAgIG91dCA9IG91dC5zdWJzdHJpbmcobmV4dF9saW5lICsgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhY2sgPSBvdXQ7XG4gICAgfVxuICB9XG59O1xuXG4vLyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IgaW5zdGFuY2VvZiBFcnJvclxudXRpbC5pbmhlcml0cyhhc3NlcnQuQXNzZXJ0aW9uRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkge1xuICBpZiAodXRpbC5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gJycgKyB2YWx1ZTtcbiAgfVxuICBpZiAodXRpbC5pc051bWJlcih2YWx1ZSkgJiYgKGlzTmFOKHZhbHVlKSB8fCAhaXNGaW5pdGUodmFsdWUpKSkge1xuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICB9XG4gIGlmICh1dGlsLmlzRnVuY3Rpb24odmFsdWUpIHx8IHV0aWwuaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZShzLCBuKSB7XG4gIGlmICh1dGlsLmlzU3RyaW5nKHMpKSB7XG4gICAgcmV0dXJuIHMubGVuZ3RoIDwgbiA/IHMgOiBzLnNsaWNlKDAsIG4pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldE1lc3NhZ2Uoc2VsZikge1xuICByZXR1cm4gdHJ1bmNhdGUoSlNPTi5zdHJpbmdpZnkoc2VsZi5hY3R1YWwsIHJlcGxhY2VyKSwgMTI4KSArICcgJyArXG4gICAgICAgICBzZWxmLm9wZXJhdG9yICsgJyAnICtcbiAgICAgICAgIHRydW5jYXRlKEpTT04uc3RyaW5naWZ5KHNlbGYuZXhwZWN0ZWQsIHJlcGxhY2VyKSwgMTI4KTtcbn1cblxuLy8gQXQgcHJlc2VudCBvbmx5IHRoZSB0aHJlZSBrZXlzIG1lbnRpb25lZCBhYm92ZSBhcmUgdXNlZCBhbmRcbi8vIHVuZGVyc3Rvb2QgYnkgdGhlIHNwZWMuIEltcGxlbWVudGF0aW9ucyBvciBzdWIgbW9kdWxlcyBjYW4gcGFzc1xuLy8gb3RoZXIga2V5cyB0byB0aGUgQXNzZXJ0aW9uRXJyb3IncyBjb25zdHJ1Y3RvciAtIHRoZXkgd2lsbCBiZVxuLy8gaWdub3JlZC5cblxuLy8gMy4gQWxsIG9mIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG11c3QgdGhyb3cgYW4gQXNzZXJ0aW9uRXJyb3Jcbi8vIHdoZW4gYSBjb3JyZXNwb25kaW5nIGNvbmRpdGlvbiBpcyBub3QgbWV0LCB3aXRoIGEgbWVzc2FnZSB0aGF0XG4vLyBtYXkgYmUgdW5kZWZpbmVkIGlmIG5vdCBwcm92aWRlZC4gIEFsbCBhc3NlcnRpb24gbWV0aG9kcyBwcm92aWRlXG4vLyBib3RoIHRoZSBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcyB0byB0aGUgYXNzZXJ0aW9uIGVycm9yIGZvclxuLy8gZGlzcGxheSBwdXJwb3Nlcy5cblxuZnVuY3Rpb24gZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBvcGVyYXRvciwgc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gIHRocm93IG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3Ioe1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgYWN0dWFsOiBhY3R1YWwsXG4gICAgZXhwZWN0ZWQ6IGV4cGVjdGVkLFxuICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICBzdGFja1N0YXJ0RnVuY3Rpb246IHN0YWNrU3RhcnRGdW5jdGlvblxuICB9KTtcbn1cblxuLy8gRVhURU5TSU9OISBhbGxvd3MgZm9yIHdlbGwgYmVoYXZlZCBlcnJvcnMgZGVmaW5lZCBlbHNld2hlcmUuXG5hc3NlcnQuZmFpbCA9IGZhaWw7XG5cbi8vIDQuIFB1cmUgYXNzZXJ0aW9uIHRlc3RzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0cnV0aHksIGFzIGRldGVybWluZWRcbi8vIGJ5ICEhZ3VhcmQuXG4vLyBhc3NlcnQub2soZ3VhcmQsIG1lc3NhZ2Vfb3B0KTtcbi8vIFRoaXMgc3RhdGVtZW50IGlzIGVxdWl2YWxlbnQgdG8gYXNzZXJ0LmVxdWFsKHRydWUsICEhZ3VhcmQsXG4vLyBtZXNzYWdlX29wdCk7LiBUbyB0ZXN0IHN0cmljdGx5IGZvciB0aGUgdmFsdWUgdHJ1ZSwgdXNlXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwodHJ1ZSwgZ3VhcmQsIG1lc3NhZ2Vfb3B0KTsuXG5cbmZ1bmN0aW9uIG9rKHZhbHVlLCBtZXNzYWdlKSB7XG4gIGlmICghdmFsdWUpIGZhaWwodmFsdWUsIHRydWUsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5vayk7XG59XG5hc3NlcnQub2sgPSBvaztcblxuLy8gNS4gVGhlIGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzaGFsbG93LCBjb2VyY2l2ZSBlcXVhbGl0eSB3aXRoXG4vLyA9PS5cbi8vIGFzc2VydC5lcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPSBleHBlY3RlZCkgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQuZXF1YWwpO1xufTtcblxuLy8gNi4gVGhlIG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHdoZXRoZXIgdHdvIG9iamVjdHMgYXJlIG5vdCBlcXVhbFxuLy8gd2l0aCAhPSBhc3NlcnQubm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RXF1YWwgPSBmdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPScsIGFzc2VydC5ub3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDcuIFRoZSBlcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgYSBkZWVwIGVxdWFsaXR5IHJlbGF0aW9uLlxuLy8gYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5kZWVwRXF1YWwgPSBmdW5jdGlvbiBkZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwRXF1YWwnLCBhc3NlcnQuZGVlcEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0J1ZmZlcihhY3R1YWwpICYmIHV0aWwuaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgaWYgKGFjdHVhbC5sZW5ndGggIT0gZXhwZWN0ZWQubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdHVhbC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFjdHVhbFtpXSAhPT0gZXhwZWN0ZWRbaV0pIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxuICAvLyA3LjIuIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIERhdGUgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIERhdGUgb2JqZWN0IHRoYXQgcmVmZXJzIHRvIHRoZSBzYW1lIHRpbWUuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0RhdGUoYWN0dWFsKSAmJiB1dGlsLmlzRGF0ZShleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLmdldFRpbWUoKSA9PT0gZXhwZWN0ZWQuZ2V0VGltZSgpO1xuXG4gIC8vIDcuMyBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIFJlZ0V4cCBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzb3VyY2UgYW5kXG4gIC8vIHByb3BlcnRpZXMgKGBnbG9iYWxgLCBgbXVsdGlsaW5lYCwgYGxhc3RJbmRleGAsIGBpZ25vcmVDYXNlYCkuXG4gIH0gZWxzZSBpZiAodXRpbC5pc1JlZ0V4cChhY3R1YWwpICYmIHV0aWwuaXNSZWdFeHAoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5zb3VyY2UgPT09IGV4cGVjdGVkLnNvdXJjZSAmJlxuICAgICAgICAgICBhY3R1YWwuZ2xvYmFsID09PSBleHBlY3RlZC5nbG9iYWwgJiZcbiAgICAgICAgICAgYWN0dWFsLm11bHRpbGluZSA9PT0gZXhwZWN0ZWQubXVsdGlsaW5lICYmXG4gICAgICAgICAgIGFjdHVhbC5sYXN0SW5kZXggPT09IGV4cGVjdGVkLmxhc3RJbmRleCAmJlxuICAgICAgICAgICBhY3R1YWwuaWdub3JlQ2FzZSA9PT0gZXhwZWN0ZWQuaWdub3JlQ2FzZTtcblxuICAvLyA3LjQuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcsXG4gIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gIH0gZWxzZSBpZiAoIXV0aWwuaXNPYmplY3QoYWN0dWFsKSAmJiAhdXRpbC5pc09iamVjdChleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsID09IGV4cGVjdGVkO1xuXG4gIC8vIDcuNSBGb3IgYWxsIG90aGVyIE9iamVjdCBwYWlycywgaW5jbHVkaW5nIEFycmF5IG9iamVjdHMsIGVxdWl2YWxlbmNlIGlzXG4gIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAvLyB3aXRoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCksIHRoZSBzYW1lIHNldCBvZiBrZXlzXG4gIC8vIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLCBlcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnlcbiAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuIE5vdGU6IHRoaXNcbiAgLy8gYWNjb3VudHMgZm9yIGJvdGggbmFtZWQgYW5kIGluZGV4ZWQgcHJvcGVydGllcyBvbiBBcnJheXMuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9iakVxdWl2KGFjdHVhbCwgZXhwZWN0ZWQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbmZ1bmN0aW9uIG9iakVxdWl2KGEsIGIpIHtcbiAgaWYgKHV0aWwuaXNOdWxsT3JVbmRlZmluZWQoYSkgfHwgdXRpbC5pc051bGxPclVuZGVmaW5lZChiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS5cbiAgaWYgKGEucHJvdG90eXBlICE9PSBiLnByb3RvdHlwZSkgcmV0dXJuIGZhbHNlO1xuICAvL35+fkkndmUgbWFuYWdlZCB0byBicmVhayBPYmplY3Qua2V5cyB0aHJvdWdoIHNjcmV3eSBhcmd1bWVudHMgcGFzc2luZy5cbiAgLy8gICBDb252ZXJ0aW5nIHRvIGFycmF5IHNvbHZlcyB0aGUgcHJvYmxlbS5cbiAgaWYgKGlzQXJndW1lbnRzKGEpKSB7XG4gICAgaWYgKCFpc0FyZ3VtZW50cyhiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBfZGVlcEVxdWFsKGEsIGIpO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIGthID0gb2JqZWN0S2V5cyhhKSxcbiAgICAgICAga2IgPSBvYmplY3RLZXlzKGIpLFxuICAgICAgICBrZXksIGk7XG4gIH0gY2F0Y2ggKGUpIHsvL2hhcHBlbnMgd2hlbiBvbmUgaXMgYSBzdHJpbmcgbGl0ZXJhbCBhbmQgdGhlIG90aGVyIGlzbid0XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoa2V5cyBpbmNvcnBvcmF0ZXNcbiAgLy8gaGFzT3duUHJvcGVydHkpXG4gIGlmIChrYS5sZW5ndGggIT0ga2IubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy90aGUgc2FtZSBzZXQgb2Yga2V5cyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSxcbiAga2Euc29ydCgpO1xuICBrYi5zb3J0KCk7XG4gIC8vfn5+Y2hlYXAga2V5IHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoa2FbaV0gIT0ga2JbaV0pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy9lcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnkgY29ycmVzcG9uZGluZyBrZXksIGFuZFxuICAvL35+fnBvc3NpYmx5IGV4cGVuc2l2ZSBkZWVwIHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBrZXkgPSBrYVtpXTtcbiAgICBpZiAoIV9kZWVwRXF1YWwoYVtrZXldLCBiW2tleV0pKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIDguIFRoZSBub24tZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGZvciBhbnkgZGVlcCBpbmVxdWFsaXR5LlxuLy8gYXNzZXJ0Lm5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3REZWVwRXF1YWwgPSBmdW5jdGlvbiBub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBFcXVhbCcsIGFzc2VydC5ub3REZWVwRXF1YWwpO1xuICB9XG59O1xuXG4vLyA5LiBUaGUgc3RyaWN0IGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzdHJpY3QgZXF1YWxpdHksIGFzIGRldGVybWluZWQgYnkgPT09LlxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnN0cmljdEVxdWFsID0gZnVuY3Rpb24gc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09PScsIGFzc2VydC5zdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDEwLiBUaGUgc3RyaWN0IG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHN0cmljdCBpbmVxdWFsaXR5LCBhc1xuLy8gZGV0ZXJtaW5lZCBieSAhPT0uICBhc3NlcnQubm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90U3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT09JywgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkge1xuICBpZiAoIWFjdHVhbCB8fCAhZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4cGVjdGVkKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgIHJldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCk7XG4gIH0gZWxzZSBpZiAoYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChleHBlY3RlZC5jYWxsKHt9LCBhY3R1YWwpID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF90aHJvd3Moc2hvdWxkVGhyb3csIGJsb2NrLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICB2YXIgYWN0dWFsO1xuXG4gIGlmICh1dGlsLmlzU3RyaW5nKGV4cGVjdGVkKSkge1xuICAgIG1lc3NhZ2UgPSBleHBlY3RlZDtcbiAgICBleHBlY3RlZCA9IG51bGw7XG4gIH1cblxuICB0cnkge1xuICAgIGJsb2NrKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBhY3R1YWwgPSBlO1xuICB9XG5cbiAgbWVzc2FnZSA9IChleHBlY3RlZCAmJiBleHBlY3RlZC5uYW1lID8gJyAoJyArIGV4cGVjdGVkLm5hbWUgKyAnKS4nIDogJy4nKSArXG4gICAgICAgICAgICAobWVzc2FnZSA/ICcgJyArIG1lc3NhZ2UgOiAnLicpO1xuXG4gIGlmIChzaG91bGRUaHJvdyAmJiAhYWN0dWFsKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnTWlzc2luZyBleHBlY3RlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoIXNob3VsZFRocm93ICYmIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnR290IHVud2FudGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICgoc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmIGV4cGVjdGVkICYmXG4gICAgICAhZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8ICghc2hvdWxkVGhyb3cgJiYgYWN0dWFsKSkge1xuICAgIHRocm93IGFjdHVhbDtcbiAgfVxufVxuXG4vLyAxMS4gRXhwZWN0ZWQgdG8gdGhyb3cgYW4gZXJyb3I6XG4vLyBhc3NlcnQudGhyb3dzKGJsb2NrLCBFcnJvcl9vcHQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnRocm93cyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzLmFwcGx5KHRoaXMsIFt0cnVlXS5jb25jYXQocFNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xufTtcblxuLy8gRVhURU5TSU9OISBUaGlzIGlzIGFubm95aW5nIHRvIHdyaXRlIG91dHNpZGUgdGhpcyBtb2R1bGUuXG5hc3NlcnQuZG9lc05vdFRocm93ID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cy5hcHBseSh0aGlzLCBbZmFsc2VdLmNvbmNhdChwU2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG59O1xuXG5hc3NlcnQuaWZFcnJvciA9IGZ1bmN0aW9uKGVycikgeyBpZiAoZXJyKSB7dGhyb3cgZXJyO319O1xuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChoYXNPd24uY2FsbChvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiBrZXlzO1xufTtcbiIsIjsoZnVuY3Rpb24ocm9vdCkge1xuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBjcm9zcyBzdG9yYWdlIGNsaWVudCBnaXZlbiB0aGUgdXJsIHRvIGEgaHViLiBCeSBkZWZhdWx0LFxuICAgKiBhbiBpZnJhbWUgaXMgY3JlYXRlZCB3aXRoaW4gdGhlIGRvY3VtZW50IGJvZHkgdGhhdCBwb2ludHMgdG8gdGhlIHVybC4gSXRcbiAgICogYWxzbyBhY2NlcHRzIGFuIG9wdGlvbnMgb2JqZWN0LCB3aGljaCBtYXkgaW5jbHVkZSBhIHRpbWVvdXQsIGZyYW1lSWQsIGFuZFxuICAgKiBwcm9taXNlLiBUaGUgdGltZW91dCwgaW4gbWlsbGlzZWNvbmRzLCBpcyBhcHBsaWVkIHRvIGVhY2ggcmVxdWVzdCBhbmRcbiAgICogZGVmYXVsdHMgdG8gNTAwMG1zLiBUaGUgb3B0aW9ucyBvYmplY3QgbWF5IGFsc28gaW5jbHVkZSBhIGZyYW1lSWQsXG4gICAqIGlkZW50aWZ5aW5nIGFuIGV4aXN0aW5nIGZyYW1lIG9uIHdoaWNoIHRvIGluc3RhbGwgaXRzIGxpc3RlbmVycy4gSWYgdGhlXG4gICAqIHByb21pc2Uga2V5IGlzIHN1cHBsaWVkIHRoZSBjb25zdHJ1Y3RvciBmb3IgYSBQcm9taXNlLCB0aGF0IFByb21pc2UgbGlicmFyeVxuICAgKiB3aWxsIGJlIHVzZWQgaW5zdGVhZCBvZiB0aGUgZGVmYXVsdCB3aW5kb3cuUHJvbWlzZS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogdmFyIHN0b3JhZ2UgPSBuZXcgQ3Jvc3NTdG9yYWdlQ2xpZW50KCdodHRwczovL3N0b3JlLmV4YW1wbGUuY29tL2h1Yi5odG1sJyk7XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHZhciBzdG9yYWdlID0gbmV3IENyb3NzU3RvcmFnZUNsaWVudCgnaHR0cHM6Ly9zdG9yZS5leGFtcGxlLmNvbS9odWIuaHRtbCcsIHtcbiAgICogICB0aW1lb3V0OiA1MDAwLFxuICAgKiAgIGZyYW1lSWQ6ICdzdG9yYWdlRnJhbWUnXG4gICAqIH0pO1xuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAgICBUaGUgdXJsIHRvIGEgY3Jvc3Mgc3RvcmFnZSBodWJcbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRzXSBBbiBvcHRpb25hbCBvYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIG9wdGlvbnMsXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkaW5nIHRpbWVvdXQsIGZyYW1lSWQsIGFuZCBwcm9taXNlXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgIF9pZCAgICAgICAgQSBVVUlEIHY0IGlkXG4gICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IF9wcm9taXNlICAgVGhlIFByb21pc2Ugb2JqZWN0IHRvIHVzZVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gICBfZnJhbWVJZCAgIFRoZSBpZCBvZiB0aGUgaUZyYW1lIHBvaW50aW5nIHRvIHRoZSBodWIgdXJsXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgIF9vcmlnaW4gICAgVGhlIGh1YidzIG9yaWdpblxuICAgKiBAcHJvcGVydHkge29iamVjdH0gICBfcmVxdWVzdHMgIE1hcHBpbmcgb2YgcmVxdWVzdCBpZHMgdG8gY2FsbGJhY2tzXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbH0gICAgIF9jb25uZWN0ZWQgV2hldGhlciBvciBub3QgaXQgaGFzIGNvbm5lY3RlZFxuICAgKiBAcHJvcGVydHkge2Jvb2x9ICAgICBfY2xvc2VkICAgIFdoZXRoZXIgb3Igbm90IHRoZSBjbGllbnQgaGFzIGNsb3NlZFxuICAgKiBAcHJvcGVydHkge2ludH0gICAgICBfY291bnQgICAgIE51bWJlciBvZiByZXF1ZXN0cyBzZW50XG4gICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IF9saXN0ZW5lciAgVGhlIGxpc3RlbmVyIGFkZGVkIHRvIHRoZSB3aW5kb3dcbiAgICogQHByb3BlcnR5IHtXaW5kb3d9ICAgX2h1YiAgICAgICBUaGUgaHViIHdpbmRvd1xuICAgKi9cbiAgZnVuY3Rpb24gQ3Jvc3NTdG9yYWdlQ2xpZW50KHVybCwgb3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgdGhpcy5faWQgICAgICAgID0gQ3Jvc3NTdG9yYWdlQ2xpZW50Ll9nZW5lcmF0ZVVVSUQoKTtcbiAgICB0aGlzLl9wcm9taXNlICAgPSBvcHRzLnByb21pc2UgfHwgUHJvbWlzZTtcbiAgICB0aGlzLl9mcmFtZUlkICAgPSBvcHRzLmZyYW1lSWQgfHwgJ0Nyb3NzU3RvcmFnZUNsaWVudC0nICsgdGhpcy5faWQ7XG4gICAgdGhpcy5fb3JpZ2luICAgID0gQ3Jvc3NTdG9yYWdlQ2xpZW50Ll9nZXRPcmlnaW4odXJsKTtcbiAgICB0aGlzLl9yZXF1ZXN0cyAgPSB7fTtcbiAgICB0aGlzLl9jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9jbG9zZWQgICAgPSBmYWxzZTtcbiAgICB0aGlzLl9jb3VudCAgICAgPSAwO1xuICAgIHRoaXMuX3RpbWVvdXQgICA9IG9wdHMudGltZW91dCB8fCA1MDAwO1xuICAgIHRoaXMuX2xpc3RlbmVyICA9IG51bGw7XG5cbiAgICB0aGlzLl9pbnN0YWxsTGlzdGVuZXIoKTtcblxuICAgIHZhciBmcmFtZTtcbiAgICBpZiAob3B0cy5mcmFtZUlkKSB7XG4gICAgICBmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdHMuZnJhbWVJZCk7XG4gICAgfVxuXG4gICAgLy8gSWYgdXNpbmcgYSBwYXNzZWQgaWZyYW1lLCBwb2xsIHRoZSBodWIgZm9yIGEgcmVhZHkgbWVzc2FnZVxuICAgIGlmIChmcmFtZSkge1xuICAgICAgdGhpcy5fcG9sbCgpO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSB0aGUgZnJhbWUgaWYgbm90IGZvdW5kIG9yIHNwZWNpZmllZFxuICAgIGZyYW1lID0gZnJhbWUgfHwgdGhpcy5fY3JlYXRlRnJhbWUodXJsKTtcbiAgICB0aGlzLl9odWIgPSBmcmFtZS5jb250ZW50V2luZG93O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdHlsZXMgdG8gYmUgYXBwbGllZCB0byB0aGUgZ2VuZXJhdGVkIGlGcmFtZS4gRGVmaW5lcyBhIHNldCBvZiBwcm9wZXJ0aWVzXG4gICAqIHRoYXQgaGlkZSB0aGUgZWxlbWVudCBieSBwb3NpdGlvbmluZyBpdCBvdXRzaWRlIG9mIHRoZSB2aXNpYmxlIGFyZWEsIGFuZFxuICAgKiBieSBtb2RpZnlpbmcgaXRzIGRpc3BsYXkuXG4gICAqXG4gICAqIEBtZW1iZXIge09iamVjdH1cbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5mcmFtZVN0eWxlID0ge1xuICAgIGRpc3BsYXk6ICAnbm9uZScsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAgICAgICctOTk5cHgnLFxuICAgIGxlZnQ6ICAgICAnLTk5OXB4J1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBvcmlnaW4gb2YgYW4gdXJsLCB3aXRoIGNyb3NzIGJyb3dzZXIgc3VwcG9ydC4gQWNjb21tb2RhdGVzXG4gICAqIHRoZSBsYWNrIG9mIGxvY2F0aW9uLm9yaWdpbiBpbiBJRSwgYXMgd2VsbCBhcyB0aGUgZGlzY3JlcGFuY2llcyBpbiB0aGVcbiAgICogaW5jbHVzaW9uIG9mIHRoZSBwb3J0IHdoZW4gdXNpbmcgdGhlIGRlZmF1bHQgcG9ydCBmb3IgYSBwcm90b2NvbCwgZS5nLlxuICAgKiA0NDMgb3ZlciBodHRwcy4gRGVmYXVsdHMgdG8gdGhlIG9yaWdpbiBvZiB3aW5kb3cubG9jYXRpb24gaWYgcGFzc2VkIGFcbiAgICogcmVsYXRpdmUgcGF0aC5cbiAgICpcbiAgICogQHBhcmFtICAge3N0cmluZ30gdXJsIFRoZSB1cmwgdG8gYSBjcm9zcyBzdG9yYWdlIGh1YlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgb3JpZ2luIG9mIHRoZSB1cmxcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5fZ2V0T3JpZ2luID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIHVyaSwgcHJvdG9jb2wsIG9yaWdpbjtcblxuICAgIHVyaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICB1cmkuaHJlZiA9IHVybDtcblxuICAgIGlmICghdXJpLmhvc3QpIHtcbiAgICAgIHVyaSA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICB9XG5cbiAgICBpZiAoIXVyaS5wcm90b2NvbCB8fCB1cmkucHJvdG9jb2wgPT09ICc6Jykge1xuICAgICAgcHJvdG9jb2wgPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2w7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3RvY29sID0gdXJpLnByb3RvY29sO1xuICAgIH1cblxuICAgIG9yaWdpbiA9IHByb3RvY29sICsgJy8vJyArIHVyaS5ob3N0O1xuICAgIG9yaWdpbiA9IG9yaWdpbi5yZXBsYWNlKC86ODAkfDo0NDMkLywgJycpO1xuXG4gICAgcmV0dXJuIG9yaWdpbjtcbiAgfTtcblxuICAvKipcbiAgICogVVVJRCB2NCBnZW5lcmF0aW9uLCB0YWtlbiBmcm9tOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zL1xuICAgKiAxMDUwMzQvaG93LXRvLWNyZWF0ZS1hLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0LzIxMTc1MjMjMjExNzUyM1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBBIFVVSUQgdjQgc3RyaW5nXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQuX2dlbmVyYXRlVVVJRCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcbiAgICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2fDAsIHYgPSBjID09ICd4JyA/IHIgOiAociYweDN8MHg4KTtcblxuICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGEgY29ubmVjdGlvbiBoYXMgYmVlbiBlc3RhYmxpc2hlZFxuICAgKiB3aXRoIHRoZSBjcm9zcyBzdG9yYWdlIGh1Yi4gSXRzIHVzZSBpcyByZXF1aXJlZCB0byBhdm9pZCBzZW5kaW5nIGFueVxuICAgKiByZXF1ZXN0cyBwcmlvciB0byBpbml0aWFsaXphdGlvbiBiZWluZyBjb21wbGV0ZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIG9uIGNvbm5lY3RcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUub25Db25uZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNsaWVudCA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5fY29ubmVjdGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9jbG9zZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ0Nyb3NzU3RvcmFnZUNsaWVudCBoYXMgY2xvc2VkJykpO1xuICAgIH1cblxuICAgIC8vIFF1ZXVlIGNvbm5lY3QgcmVxdWVzdHMgZm9yIGNsaWVudCByZS11c2VcbiAgICBpZiAoIXRoaXMuX3JlcXVlc3RzLmNvbm5lY3QpIHtcbiAgICAgIHRoaXMuX3JlcXVlc3RzLmNvbm5lY3QgPSBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IHRoaXMuX3Byb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0Nyb3NzU3RvcmFnZUNsaWVudCBjb3VsZCBub3QgY29ubmVjdCcpKTtcbiAgICAgIH0sIGNsaWVudC5fdGltZW91dCk7XG5cbiAgICAgIGNsaWVudC5fcmVxdWVzdHMuY29ubmVjdC5wdXNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKTtcblxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyBhIGtleSB0byB0aGUgc3BlY2lmaWVkIHZhbHVlLiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCBvblxuICAgKiBzdWNjZXNzLCBvciByZWplY3RlZCBpZiBhbnkgZXJyb3JzIHNldHRpbmcgdGhlIGtleSBvY2N1cnJlZCwgb3IgdGhlIHJlcXVlc3RcbiAgICogdGltZWQgb3V0LlxuICAgKlxuICAgKiBAcGFyYW0gICB7c3RyaW5nfSAga2V5ICAgVGhlIGtleSB0byBzZXRcbiAgICogQHBhcmFtICAgeyp9ICAgICAgIHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ25cbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgb24gaHViIHJlc3BvbnNlIG9yIHRpbWVvdXRcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdzZXQnLCB7XG4gICAgICBrZXk6ICAga2V5LFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFjY2VwdHMgb25lIG9yIG1vcmUga2V5cyBmb3Igd2hpY2ggdG8gcmV0cmlldmUgdGhlaXIgdmFsdWVzLiBSZXR1cm5zIGFcbiAgICogcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgb24gaHViIHJlc3BvbnNlIG9yIHRpbWVvdXQuIE9uIHN1Y2Nlc3MsIGl0IGlzXG4gICAqIGZ1bGZpbGxlZCB3aXRoIHRoZSB2YWx1ZSBvZiB0aGUga2V5IGlmIG9ubHkgcGFzc2VkIGEgc2luZ2xlIGFyZ3VtZW50LlxuICAgKiBPdGhlcndpc2UgaXQncyByZXNvbHZlZCB3aXRoIGFuIGFycmF5IG9mIHZhbHVlcy4gT24gZmFpbHVyZSwgaXQgaXMgcmVqZWN0ZWRcbiAgICogd2l0aCB0aGUgY29ycmVzcG9uZGluZyBlcnJvciBtZXNzYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gICB7Li4uc3RyaW5nfSBrZXkgVGhlIGtleSB0byByZXRyaWV2ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gICBBIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uIGh1YiByZXNwb25zZSBvciB0aW1lb3V0XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdnZXQnLCB7a2V5czogYXJnc30pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBY2NlcHRzIG9uZSBvciBtb3JlIGtleXMgZm9yIGRlbGV0aW9uLiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgb25cbiAgICogaHViIHJlc3BvbnNlIG9yIHRpbWVvdXQuXG4gICAqXG4gICAqIEBwYXJhbSAgIHsuLi5zdHJpbmd9IGtleSBUaGUga2V5IHRvIGRlbGV0ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gICBBIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uIGh1YiByZXNwb25zZSBvciB0aW1lb3V0XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLmRlbCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdkZWwnLCB7a2V5czogYXJnc30pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0LCB3aGVuIHJlc29sdmVkLCBpbmRpY2F0ZXMgdGhhdCBhbGwgbG9jYWxTdG9yYWdlXG4gICAqIGRhdGEgaGFzIGJlZW4gY2xlYXJlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgb24gaHViIHJlc3BvbnNlIG9yIHRpbWVvdXRcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnY2xlYXInKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCwgd2hlbiByZXNvbHZlZCwgcGFzc2VzIGFuIGFycmF5IG9mIGFsbCBrZXlzXG4gICAqIGN1cnJlbnRseSBpbiBzdG9yYWdlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCBvbiBodWIgcmVzcG9uc2Ugb3IgdGltZW91dFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5nZXRLZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ2dldEtleXMnKTtcbiAgfTtcblxuICAvKipcbiAgICogRGVsZXRlcyB0aGUgaWZyYW1lIGFuZCBzZXRzIHRoZSBjb25uZWN0ZWQgc3RhdGUgdG8gZmFsc2UuIFRoZSBjbGllbnQgY2FuXG4gICAqIG5vIGxvbmdlciBiZSB1c2VkIGFmdGVyIGJlaW5nIGludm9rZWQuXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5fZnJhbWVJZCk7XG4gICAgaWYgKGZyYW1lKSB7XG4gICAgICBmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZyYW1lKTtcbiAgICB9XG5cbiAgICAvLyBTdXBwb3J0IElFOCB3aXRoIGRldGFjaEV2ZW50XG4gICAgaWYgKHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuX2xpc3RlbmVyLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5kZXRhY2hFdmVudCgnb25tZXNzYWdlJywgdGhpcy5fbGlzdGVuZXIpO1xuICAgIH1cblxuICAgIHRoaXMuX2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2Nsb3NlZCA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEluc3RhbGxzIHRoZSBuZWNlc3NhcnkgbGlzdGVuZXIgZm9yIHRoZSB3aW5kb3cgbWVzc2FnZSBldmVudC4gV2hlbiBhIG1lc3NhZ2VcbiAgICogaXMgcmVjZWl2ZWQsIHRoZSBjbGllbnQncyBfY29ubmVjdGVkIHN0YXR1cyBpcyBjaGFuZ2VkIHRvIHRydWUsIGFuZCB0aGVcbiAgICogb25Db25uZWN0IHByb21pc2UgaXMgZnVsZmlsbGVkLiBHaXZlbiBhIHJlc3BvbnNlIG1lc3NhZ2UsIHRoZSBjYWxsYmFja1xuICAgKiBjb3JyZXNwb25kaW5nIHRvIGl0cyByZXF1ZXN0IGlzIGludm9rZWQuIElmIHJlc3BvbnNlLmVycm9yIGhvbGRzIGEgdHJ1dGh5XG4gICAqIHZhbHVlLCB0aGUgcHJvbWlzZSBhc3NvY2lhdGVkIHdpdGggdGhlIG9yaWdpbmFsIHJlcXVlc3QgaXMgcmVqZWN0ZWQgd2l0aFxuICAgKiB0aGUgZXJyb3IuIE90aGVyd2lzZSB0aGUgcHJvbWlzZSBpcyBmdWxmaWxsZWQgYW5kIHBhc3NlZCByZXNwb25zZS5yZXN1bHQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLl9pbnN0YWxsTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2xpZW50ID0gdGhpcztcblxuICAgIHRoaXMuX2xpc3RlbmVyID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgdmFyIGksIG9yaWdpbiwgZXJyb3IsIHJlc3BvbnNlO1xuXG4gICAgICAvLyBJZ25vcmUgaW52YWxpZCBtZXNzYWdlcyBvciB0aG9zZSBhZnRlciB0aGUgY2xpZW50IGhhcyBjbG9zZWRcbiAgICAgIGlmIChjbGllbnQuX2Nsb3NlZCB8fCAhbWVzc2FnZS5kYXRhIHx8IHR5cGVvZiBtZXNzYWdlLmRhdGEgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gcG9zdE1lc3NhZ2UgcmV0dXJucyB0aGUgc3RyaW5nIFwibnVsbFwiIGFzIHRoZSBvcmlnaW4gZm9yIFwiZmlsZTovL1wiXG4gICAgICBvcmlnaW4gPSAobWVzc2FnZS5vcmlnaW4gPT09ICdudWxsJykgPyAnZmlsZTovLycgOiBtZXNzYWdlLm9yaWdpbjtcblxuICAgICAgLy8gSWdub3JlIG1lc3NhZ2VzIG5vdCBmcm9tIHRoZSBjb3JyZWN0IG9yaWdpblxuICAgICAgaWYgKG9yaWdpbiAhPT0gY2xpZW50Ll9vcmlnaW4pIHJldHVybjtcblxuICAgICAgLy8gTG9jYWxTdG9yYWdlIGlzbid0IGF2YWlsYWJsZSBpbiB0aGUgaHViXG4gICAgICBpZiAobWVzc2FnZS5kYXRhID09PSAnY3Jvc3Mtc3RvcmFnZTp1bmF2YWlsYWJsZScpIHtcbiAgICAgICAgaWYgKCFjbGllbnQuX2Nsb3NlZCkgY2xpZW50LmNsb3NlKCk7XG4gICAgICAgIGlmICghY2xpZW50Ll9yZXF1ZXN0cy5jb25uZWN0KSByZXR1cm47XG5cbiAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ0Nsb3NpbmcgY2xpZW50LiBDb3VsZCBub3QgYWNjZXNzIGxvY2FsU3RvcmFnZSBpbiBodWIuJyk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjbGllbnQuX3JlcXVlc3RzLmNvbm5lY3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjbGllbnQuX3JlcXVlc3RzLmNvbm5lY3RbaV0oZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGUgaW5pdGlhbCBjb25uZWN0aW9uXG4gICAgICBpZiAobWVzc2FnZS5kYXRhLmluZGV4T2YoJ2Nyb3NzLXN0b3JhZ2U6JykgIT09IC0xICYmICFjbGllbnQuX2Nvbm5lY3RlZCkge1xuICAgICAgICBjbGllbnQuX2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIGlmICghY2xpZW50Ll9yZXF1ZXN0cy5jb25uZWN0KSByZXR1cm47XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNsaWVudC5fcmVxdWVzdHMuY29ubmVjdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNsaWVudC5fcmVxdWVzdHMuY29ubmVjdFtpXShlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIGNsaWVudC5fcmVxdWVzdHMuY29ubmVjdDtcbiAgICAgIH1cblxuICAgICAgaWYgKG1lc3NhZ2UuZGF0YSA9PT0gJ2Nyb3NzLXN0b3JhZ2U6cmVhZHknKSByZXR1cm47XG5cbiAgICAgIC8vIEFsbCBvdGhlciBtZXNzYWdlc1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJlc3BvbnNlLmlkKSByZXR1cm47XG5cbiAgICAgIGlmIChjbGllbnQuX3JlcXVlc3RzW3Jlc3BvbnNlLmlkXSkge1xuICAgICAgICBjbGllbnQuX3JlcXVlc3RzW3Jlc3BvbnNlLmlkXShyZXNwb25zZS5lcnJvciwgcmVzcG9uc2UucmVzdWx0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gU3VwcG9ydCBJRTggd2l0aCBhdHRhY2hFdmVudFxuICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLl9saXN0ZW5lciwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuYXR0YWNoRXZlbnQoJ29ubWVzc2FnZScsIHRoaXMuX2xpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEludm9rZWQgd2hlbiBhIGZyYW1lIGlkIHdhcyBwYXNzZWQgdG8gdGhlIGNsaWVudCwgcmF0aGVyIHRoYW4gYWxsb3dpbmdcbiAgICogdGhlIGNsaWVudCB0byBjcmVhdGUgaXRzIG93biBpZnJhbWUuIFBvbGxzIHRoZSBodWIgZm9yIGEgcmVhZHkgZXZlbnQgdG9cbiAgICogZXN0YWJsaXNoIGEgY29ubmVjdGVkIHN0YXRlLlxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5fcG9sbCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjbGllbnQsIGludGVydmFsLCB0YXJnZXRPcmlnaW47XG5cbiAgICBjbGllbnQgPSB0aGlzO1xuXG4gICAgLy8gcG9zdE1lc3NhZ2UgcmVxdWlyZXMgdGhhdCB0aGUgdGFyZ2V0IG9yaWdpbiBiZSBzZXQgdG8gXCIqXCIgZm9yIFwiZmlsZTovL1wiXG4gICAgdGFyZ2V0T3JpZ2luID0gKGNsaWVudC5fb3JpZ2luID09PSAnZmlsZTovLycpID8gJyonIDogY2xpZW50Ll9vcmlnaW47XG5cbiAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGNsaWVudC5fY29ubmVjdGVkKSByZXR1cm4gY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICBpZiAoIWNsaWVudC5faHViKSByZXR1cm47XG5cbiAgICAgIGNsaWVudC5faHViLnBvc3RNZXNzYWdlKCdjcm9zcy1zdG9yYWdlOnBvbGwnLCB0YXJnZXRPcmlnaW4pO1xuICAgIH0sIDEwMDApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGlGcmFtZSBjb250YWluaW5nIHRoZSBodWIuIEFwcGxpZXMgdGhlIG5lY2Vzc2FyeSBzdHlsZXMgdG9cbiAgICogaGlkZSB0aGUgZWxlbWVudCBmcm9tIHZpZXcsIHByaW9yIHRvIGFkZGluZyBpdCB0byB0aGUgZG9jdW1lbnQgYm9keS5cbiAgICogUmV0dXJucyB0aGUgY3JlYXRlZCBlbGVtZW50LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgdXJsIFRoZSB1cmwgdG8gdGhlIGh1YlxuICAgKiByZXR1cm5zIHtIVE1MSUZyYW1lRWxlbWVudH0gVGhlIGlGcmFtZSBlbGVtZW50IGl0c2VsZlxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5fY3JlYXRlRnJhbWUgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgZnJhbWUsIGtleTtcblxuICAgIGZyYW1lID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgIGZyYW1lLmlkID0gdGhpcy5fZnJhbWVJZDtcblxuICAgIC8vIFN0eWxlIHRoZSBpZnJhbWVcbiAgICBmb3IgKGtleSBpbiBDcm9zc1N0b3JhZ2VDbGllbnQuZnJhbWVTdHlsZSkge1xuICAgICAgaWYgKENyb3NzU3RvcmFnZUNsaWVudC5mcmFtZVN0eWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgZnJhbWUuc3R5bGVba2V5XSA9IENyb3NzU3RvcmFnZUNsaWVudC5mcmFtZVN0eWxlW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZnJhbWUpO1xuICAgIGZyYW1lLnNyYyA9IHVybDtcblxuICAgIHJldHVybiBmcmFtZTtcbiAgfTtcblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIGNvbnRhaW5pbmcgdGhlIGdpdmVuIG1ldGhvZCBhbmQgcGFyYW1zIHRvIHRoZSBodWIuIFN0b3Jlc1xuICAgKiBhIGNhbGxiYWNrIGluIHRoZSBfcmVxdWVzdHMgb2JqZWN0IGZvciBsYXRlciBpbnZvY2F0aW9uIG9uIG1lc3NhZ2UsIG9yXG4gICAqIGRlbGV0aW9uIG9uIHRpbWVvdXQuIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCBpbiBlaXRoZXIgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9ICBtZXRob2QgVGhlIG1ldGhvZCB0byBpbnZva2VcbiAgICogQHBhcmFtICAgeyp9ICAgICAgIHBhcmFtcyBUaGUgYXJndW1lbnRzIHRvIHBhc3NcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgb24gaHViIHJlc3BvbnNlIG9yIHRpbWVvdXRcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuX3JlcXVlc3QgPSBmdW5jdGlvbihtZXRob2QsIHBhcmFtcykge1xuICAgIHZhciByZXEsIGNsaWVudDtcblxuICAgIGlmICh0aGlzLl9jbG9zZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ0Nyb3NzU3RvcmFnZUNsaWVudCBoYXMgY2xvc2VkJykpO1xuICAgIH1cblxuICAgIGNsaWVudCA9IHRoaXM7XG4gICAgY2xpZW50Ll9jb3VudCsrO1xuXG4gICAgcmVxID0ge1xuICAgICAgaWQ6ICAgICB0aGlzLl9pZCArICc6JyArIGNsaWVudC5fY291bnQsXG4gICAgICBtZXRob2Q6ICdjcm9zcy1zdG9yYWdlOicgKyBtZXRob2QsXG4gICAgICBwYXJhbXM6IHBhcmFtc1xuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IHRoaXMuX3Byb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgdGltZW91dCwgb3JpZ2luYWxUb0pTT04sIHRhcmdldE9yaWdpbjtcblxuICAgICAgLy8gVGltZW91dCBpZiBhIHJlc3BvbnNlIGlzbid0IHJlY2VpdmVkIGFmdGVyIDRzXG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFjbGllbnQuX3JlcXVlc3RzW3JlcS5pZF0pIHJldHVybjtcblxuICAgICAgICBkZWxldGUgY2xpZW50Ll9yZXF1ZXN0c1tyZXEuaWRdO1xuICAgICAgICByZWplY3QobmV3IEVycm9yKCdUaW1lb3V0OiBjb3VsZCBub3QgcGVyZm9ybSAnICsgcmVxLm1ldGhvZCkpO1xuICAgICAgfSwgY2xpZW50Ll90aW1lb3V0KTtcblxuICAgICAgLy8gQWRkIHJlcXVlc3QgY2FsbGJhY2tcbiAgICAgIGNsaWVudC5fcmVxdWVzdHNbcmVxLmlkXSA9IGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgZGVsZXRlIGNsaWVudC5fcmVxdWVzdHNbcmVxLmlkXTtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoZXJyKSk7XG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgIH07XG5cbiAgICAgIC8vIEluIGNhc2Ugd2UgaGF2ZSBhIGJyb2tlbiBBcnJheS5wcm90b3R5cGUudG9KU09OLCBlLmcuIGJlY2F1c2Ugb2ZcbiAgICAgIC8vIG9sZCB2ZXJzaW9ucyBvZiBwcm90b3R5cGVcbiAgICAgIGlmIChBcnJheS5wcm90b3R5cGUudG9KU09OKSB7XG4gICAgICAgIG9yaWdpbmFsVG9KU09OID0gQXJyYXkucHJvdG90eXBlLnRvSlNPTjtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnRvSlNPTiA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIC8vIHBvc3RNZXNzYWdlIHJlcXVpcmVzIHRoYXQgdGhlIHRhcmdldCBvcmlnaW4gYmUgc2V0IHRvIFwiKlwiIGZvciBcImZpbGU6Ly9cIlxuICAgICAgdGFyZ2V0T3JpZ2luID0gKGNsaWVudC5fb3JpZ2luID09PSAnZmlsZTovLycpID8gJyonIDogY2xpZW50Ll9vcmlnaW47XG5cbiAgICAgIC8vIFNlbmQgc2VyaWFsaXplZCBtZXNzYWdlXG4gICAgICBjbGllbnQuX2h1Yi5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeShyZXEpLCB0YXJnZXRPcmlnaW4pO1xuXG4gICAgICAvLyBSZXN0b3JlIG9yaWdpbmFsIHRvSlNPTlxuICAgICAgaWYgKG9yaWdpbmFsVG9KU09OKSB7XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS50b0pTT04gPSBvcmlnaW5hbFRvSlNPTjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogRXhwb3J0IGZvciB2YXJpb3VzIGVudmlyb25tZW50cy5cbiAgICovXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gQ3Jvc3NTdG9yYWdlQ2xpZW50O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGV4cG9ydHMuQ3Jvc3NTdG9yYWdlQ2xpZW50ID0gQ3Jvc3NTdG9yYWdlQ2xpZW50O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gQ3Jvc3NTdG9yYWdlQ2xpZW50O1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuQ3Jvc3NTdG9yYWdlQ2xpZW50ID0gQ3Jvc3NTdG9yYWdlQ2xpZW50O1xuICB9XG59KHRoaXMpKTtcbiIsIjsoZnVuY3Rpb24ocm9vdCkge1xuICB2YXIgQ3Jvc3NTdG9yYWdlSHViID0ge307XG5cbiAgLyoqXG4gICAqIEFjY2VwdHMgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIHR3byBrZXlzOiBvcmlnaW4gYW5kIGFsbG93LiBUaGUgdmFsdWVcbiAgICogb2Ygb3JpZ2luIGlzIGV4cGVjdGVkIHRvIGJlIGEgUmVnRXhwLCBhbmQgYWxsb3csIGFuIGFycmF5IG9mIHN0cmluZ3MuXG4gICAqIFRoZSBjcm9zcyBzdG9yYWdlIGh1YiBpcyB0aGVuIGluaXRpYWxpemVkIHRvIGFjY2VwdCByZXF1ZXN0cyBmcm9tIGFueSBvZlxuICAgKiB0aGUgbWF0Y2hpbmcgb3JpZ2lucywgYWxsb3dpbmcgYWNjZXNzIHRvIHRoZSBhc3NvY2lhdGVkIGxpc3RzIG9mIG1ldGhvZHMuXG4gICAqIE1ldGhvZHMgbWF5IGluY2x1ZGUgYW55IG9mOiBnZXQsIHNldCwgZGVsLCBnZXRLZXlzIGFuZCBjbGVhci4gQSAncmVhZHknXG4gICAqIG1lc3NhZ2UgaXMgc2VudCB0byB0aGUgcGFyZW50IHdpbmRvdyBvbmNlIGNvbXBsZXRlLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBTdWJkb21haW4gY2FuIGdldCwgYnV0IG9ubHkgcm9vdCBkb21haW4gY2FuIHNldCBhbmQgZGVsXG4gICAqIENyb3NzU3RvcmFnZUh1Yi5pbml0KFtcbiAgICogICB7b3JpZ2luOiAvXFwuZXhhbXBsZS5jb20kLywgICAgICAgIGFsbG93OiBbJ2dldCddfSxcbiAgICogICB7b3JpZ2luOiAvOih3d3dcXC4pP2V4YW1wbGUuY29tJC8sIGFsbG93OiBbJ2dldCcsICdzZXQnLCAnZGVsJ119XG4gICAqIF0pO1xuICAgKlxuICAgKiBAcGFyYW0ge2FycmF5fSBwZXJtaXNzaW9ucyBBbiBhcnJheSBvZiBvYmplY3RzIHdpdGggb3JpZ2luIGFuZCBhbGxvd1xuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLmluaXQgPSBmdW5jdGlvbihwZXJtaXNzaW9ucykge1xuICAgIHZhciBhdmFpbGFibGUgPSB0cnVlO1xuXG4gICAgLy8gUmV0dXJuIGlmIGxvY2FsU3RvcmFnZSBpcyB1bmF2YWlsYWJsZSwgb3IgdGhpcmQgcGFydHlcbiAgICAvLyBhY2Nlc3MgaXMgZGlzYWJsZWRcbiAgICB0cnkge1xuICAgICAgaWYgKCF3aW5kb3cubG9jYWxTdG9yYWdlKSBhdmFpbGFibGUgPSBmYWxzZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBhdmFpbGFibGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIWF2YWlsYWJsZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoJ2Nyb3NzLXN0b3JhZ2U6dW5hdmFpbGFibGUnLCAnKicpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgQ3Jvc3NTdG9yYWdlSHViLl9wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zIHx8IFtdO1xuICAgIENyb3NzU3RvcmFnZUh1Yi5faW5zdGFsbExpc3RlbmVyKCk7XG4gICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSgnY3Jvc3Mtc3RvcmFnZTpyZWFkeScsICcqJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEluc3RhbGxzIHRoZSBuZWNlc3NhcnkgbGlzdGVuZXIgZm9yIHRoZSB3aW5kb3cgbWVzc2FnZSBldmVudC4gQWNjb21tb2RhdGVzXG4gICAqIElFOCBhbmQgdXAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX2luc3RhbGxMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsaXN0ZW5lciA9IENyb3NzU3RvcmFnZUh1Yi5fbGlzdGVuZXI7XG4gICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RlbmVyLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5hdHRhY2hFdmVudCgnb25tZXNzYWdlJywgbGlzdGVuZXIpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogVGhlIG1lc3NhZ2UgaGFuZGxlciBmb3IgYWxsIHJlcXVlc3RzIHBvc3RlZCB0byB0aGUgd2luZG93LiBJdCBpZ25vcmVzIGFueVxuICAgKiBtZXNzYWdlcyBoYXZpbmcgYW4gb3JpZ2luIHRoYXQgZG9lcyBub3QgbWF0Y2ggdGhlIG9yaWdpbmFsbHkgc3VwcGxpZWRcbiAgICogcGF0dGVybi4gR2l2ZW4gYSBKU09OIG9iamVjdCB3aXRoIG9uZSBvZiBnZXQsIHNldCwgZGVsIG9yIGdldEtleXMgYXMgdGhlXG4gICAqIG1ldGhvZCwgdGhlIGZ1bmN0aW9uIHBlcmZvcm1zIHRoZSByZXF1ZXN0ZWQgYWN0aW9uIGFuZCByZXR1cm5zIGl0cyByZXN1bHQuXG4gICAqXG4gICAqIEBwYXJhbSB7TWVzc2FnZUV2ZW50fSBtZXNzYWdlIEEgbWVzc2FnZSB0byBiZSBwcm9jZXNzZWRcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5fbGlzdGVuZXIgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgdmFyIG9yaWdpbiwgdGFyZ2V0T3JpZ2luLCByZXF1ZXN0LCBtZXRob2QsIGVycm9yLCByZXN1bHQsIHJlc3BvbnNlO1xuXG4gICAgLy8gcG9zdE1lc3NhZ2UgcmV0dXJucyB0aGUgc3RyaW5nIFwibnVsbFwiIGFzIHRoZSBvcmlnaW4gZm9yIFwiZmlsZTovL1wiXG4gICAgb3JpZ2luID0gKG1lc3NhZ2Uub3JpZ2luID09PSAnbnVsbCcpID8gJ2ZpbGU6Ly8nIDogbWVzc2FnZS5vcmlnaW47XG5cbiAgICAvLyBIYW5kbGUgcG9sbGluZyBmb3IgYSByZWFkeSBtZXNzYWdlXG4gICAgaWYgKG1lc3NhZ2UuZGF0YSA9PT0gJ2Nyb3NzLXN0b3JhZ2U6cG9sbCcpIHtcbiAgICAgIHJldHVybiB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKCdjcm9zcy1zdG9yYWdlOnJlYWR5JywgbWVzc2FnZS5vcmlnaW4pO1xuICAgIH1cblxuICAgIC8vIElnbm9yZSB0aGUgcmVhZHkgbWVzc2FnZSB3aGVuIHZpZXdpbmcgdGhlIGh1YiBkaXJlY3RseVxuICAgIGlmIChtZXNzYWdlLmRhdGEgPT09ICdjcm9zcy1zdG9yYWdlOnJlYWR5JykgcmV0dXJuO1xuXG4gICAgLy8gQ2hlY2sgd2hldGhlciBtZXNzYWdlLmRhdGEgaXMgYSB2YWxpZCBqc29uXG4gICAgdHJ5IHtcbiAgICAgIHJlcXVlc3QgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgd2hldGhlciByZXF1ZXN0Lm1ldGhvZCBpcyBhIHN0cmluZ1xuICAgIGlmICghcmVxdWVzdCB8fCB0eXBlb2YgcmVxdWVzdC5tZXRob2QgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbWV0aG9kID0gcmVxdWVzdC5tZXRob2Quc3BsaXQoJ2Nyb3NzLXN0b3JhZ2U6JylbMV07XG5cbiAgICBpZiAoIW1ldGhvZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoIUNyb3NzU3RvcmFnZUh1Yi5fcGVybWl0dGVkKG9yaWdpbiwgbWV0aG9kKSkge1xuICAgICAgZXJyb3IgPSAnSW52YWxpZCBwZXJtaXNzaW9ucyBmb3IgJyArIG1ldGhvZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gQ3Jvc3NTdG9yYWdlSHViWydfJyArIG1ldGhvZF0ocmVxdWVzdC5wYXJhbXMpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGVycm9yID0gZXJyLm1lc3NhZ2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzcG9uc2UgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBpZDogcmVxdWVzdC5pZCxcbiAgICAgIGVycm9yOiBlcnJvcixcbiAgICAgIHJlc3VsdDogcmVzdWx0XG4gICAgfSk7XG5cbiAgICAvLyBwb3N0TWVzc2FnZSByZXF1aXJlcyB0aGF0IHRoZSB0YXJnZXQgb3JpZ2luIGJlIHNldCB0byBcIipcIiBmb3IgXCJmaWxlOi8vXCJcbiAgICB0YXJnZXRPcmlnaW4gPSAob3JpZ2luID09PSAnZmlsZTovLycpID8gJyonIDogb3JpZ2luO1xuXG4gICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShyZXNwb25zZSwgdGFyZ2V0T3JpZ2luKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIG9yIG5vdCB0aGUgcmVxdWVzdGVkIG1ldGhvZCBpc1xuICAgKiBwZXJtaXR0ZWQgZm9yIHRoZSBnaXZlbiBvcmlnaW4uIFRoZSBhcmd1bWVudCBwYXNzZWQgdG8gbWV0aG9kIGlzIGV4cGVjdGVkXG4gICAqIHRvIGJlIG9uZSBvZiAnZ2V0JywgJ3NldCcsICdkZWwnIG9yICdnZXRLZXlzJy5cbiAgICpcbiAgICogQHBhcmFtICAge3N0cmluZ30gb3JpZ2luIFRoZSBvcmlnaW4gZm9yIHdoaWNoIHRvIGRldGVybWluZSBwZXJtaXNzaW9uc1xuICAgKiBAcGFyYW0gICB7c3RyaW5nfSBtZXRob2QgUmVxdWVzdGVkIGFjdGlvblxuICAgKiBAcmV0dXJucyB7Ym9vbH0gICBXaGV0aGVyIG9yIG5vdCB0aGUgcmVxdWVzdCBpcyBwZXJtaXR0ZWRcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5fcGVybWl0dGVkID0gZnVuY3Rpb24ob3JpZ2luLCBtZXRob2QpIHtcbiAgICB2YXIgYXZhaWxhYmxlLCBpLCBlbnRyeSwgbWF0Y2g7XG5cbiAgICBhdmFpbGFibGUgPSBbJ2dldCcsICdzZXQnLCAnZGVsJywgJ2NsZWFyJywgJ2dldEtleXMnXTtcbiAgICBpZiAoIUNyb3NzU3RvcmFnZUh1Yi5faW5BcnJheShtZXRob2QsIGF2YWlsYWJsZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgQ3Jvc3NTdG9yYWdlSHViLl9wZXJtaXNzaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgZW50cnkgPSBDcm9zc1N0b3JhZ2VIdWIuX3Blcm1pc3Npb25zW2ldO1xuICAgICAgaWYgKCEoZW50cnkub3JpZ2luIGluc3RhbmNlb2YgUmVnRXhwKSB8fCAhKGVudHJ5LmFsbG93IGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBtYXRjaCA9IGVudHJ5Lm9yaWdpbi50ZXN0KG9yaWdpbik7XG4gICAgICBpZiAobWF0Y2ggJiYgQ3Jvc3NTdG9yYWdlSHViLl9pbkFycmF5KG1ldGhvZCwgZW50cnkuYWxsb3cpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyBhIGtleSB0byB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIEFuIG9iamVjdCB3aXRoIGtleSBhbmQgdmFsdWVcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5fc2V0ID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKHBhcmFtcy5rZXksIHBhcmFtcy52YWx1ZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFjY2VwdHMgYW4gb2JqZWN0IHdpdGggYW4gYXJyYXkgb2Yga2V5cyBmb3Igd2hpY2ggdG8gcmV0cmlldmUgdGhlaXIgdmFsdWVzLlxuICAgKiBSZXR1cm5zIGEgc2luZ2xlIHZhbHVlIGlmIG9ubHkgb25lIGtleSB3YXMgc3VwcGxpZWQsIG90aGVyd2lzZSBpdCByZXR1cm5zXG4gICAqIGFuIGFycmF5LiBBbnkga2V5cyBub3Qgc2V0IHJlc3VsdCBpbiBhIG51bGwgZWxlbWVudCBpbiB0aGUgcmVzdWx0aW5nIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gICB7b2JqZWN0fSBwYXJhbXMgQW4gb2JqZWN0IHdpdGggYW4gYXJyYXkgb2Yga2V5c1xuICAgKiBAcmV0dXJucyB7KnwqW119ICBFaXRoZXIgYSBzaW5nbGUgdmFsdWUsIG9yIGFuIGFycmF5XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX2dldCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIHZhciBzdG9yYWdlLCByZXN1bHQsIGksIHZhbHVlO1xuXG4gICAgc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gICAgcmVzdWx0ID0gW107XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYW1zLmtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gc3RvcmFnZS5nZXRJdGVtKHBhcmFtcy5rZXlzW2ldKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChyZXN1bHQubGVuZ3RoID4gMSkgPyByZXN1bHQgOiByZXN1bHRbMF07XG4gIH07XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYWxsIGtleXMgc3BlY2lmaWVkIGluIHRoZSBhcnJheSBmb3VuZCBhdCBwYXJhbXMua2V5cy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBBbiBvYmplY3Qgd2l0aCBhbiBhcnJheSBvZiBrZXlzXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX2RlbCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyYW1zLmtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShwYXJhbXMua2V5c1tpXSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhcnMgbG9jYWxTdG9yYWdlLlxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwga2V5cyBzdG9yZWQgaW4gbG9jYWxTdG9yYWdlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nW119IFRoZSBhcnJheSBvZiBrZXlzXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX2dldEtleXMgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICB2YXIgaSwgbGVuZ3RoLCBrZXlzO1xuXG4gICAga2V5cyA9IFtdO1xuICAgIGxlbmd0aCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UubGVuZ3RoO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXlzLnB1c2god2luZG93LmxvY2FsU3RvcmFnZS5rZXkoaSkpO1xuICAgIH1cblxuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgdmFsdWUgaXMgcHJlc2VudCBpbiB0aGUgYXJyYXkuIENvbnNpc3RzIG9mIGFuXG4gICAqIGFsdGVybmF0aXZlIHRvIGV4dGVuZGluZyB0aGUgYXJyYXkgcHJvdG90eXBlIGZvciBpbmRleE9mLCBzaW5jZSBpdCdzXG4gICAqIHVuYXZhaWxhYmxlIGZvciBJRTguXG4gICAqXG4gICAqIEBwYXJhbSAgIHsqfSAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gZmluZFxuICAgKiBAcGFybWEgICB7W10qfSAgYXJyYXkgVGhlIGFycmF5IGluIHdoaWNoIHRvIHNlYXJjaFxuICAgKiBAcmV0dXJucyB7Ym9vbH0gV2hldGhlciBvciBub3QgdGhlIHZhbHVlIHdhcyBmb3VuZFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9pbkFycmF5ID0gZnVuY3Rpb24odmFsdWUsIGFycmF5KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZhbHVlID09PSBhcnJheVtpXSkgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBIGNyb3NzLWJyb3dzZXIgdmVyc2lvbiBvZiBEYXRlLm5vdyBjb21wYXRpYmxlIHdpdGggSUU4IHRoYXQgYXZvaWRzXG4gICAqIG1vZGlmeWluZyB0aGUgRGF0ZSBvYmplY3QuXG4gICAqXG4gICAqIEByZXR1cm4ge2ludH0gVGhlIGN1cnJlbnQgdGltZXN0YW1wIGluIG1pbGxpc2Vjb25kc1xuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9ub3cgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mIERhdGUubm93ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gRGF0ZS5ub3coKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEV4cG9ydCBmb3IgdmFyaW91cyBlbnZpcm9ubWVudHMuXG4gICAqL1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENyb3NzU3RvcmFnZUh1YjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBleHBvcnRzLkNyb3NzU3RvcmFnZUh1YiA9IENyb3NzU3RvcmFnZUh1YjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIENyb3NzU3RvcmFnZUh1YjtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByb290LkNyb3NzU3RvcmFnZUh1YiA9IENyb3NzU3RvcmFnZUh1YjtcbiAgfVxufSh0aGlzKSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50OiByZXF1aXJlKCcuL2NsaWVudC5qcycpLFxuICBDcm9zc1N0b3JhZ2VIdWI6ICAgIHJlcXVpcmUoJy4vaHViLmpzJylcbn07XG4iLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsKXtcbi8qIVxuICogQG92ZXJ2aWV3IGVzNi1wcm9taXNlIC0gYSB0aW55IGltcGxlbWVudGF0aW9uIG9mIFByb21pc2VzL0ErLlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTQgWWVodWRhIEthdHosIFRvbSBEYWxlLCBTdGVmYW4gUGVubmVyIGFuZCBjb250cmlidXRvcnMgKENvbnZlcnNpb24gdG8gRVM2IEFQSSBieSBKYWtlIEFyY2hpYmFsZClcbiAqIEBsaWNlbnNlICAgTGljZW5zZWQgdW5kZXIgTUlUIGxpY2Vuc2VcbiAqICAgICAgICAgICAgU2VlIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9zdGVmYW5wZW5uZXIvZXM2LXByb21pc2UvbWFzdGVyL0xJQ0VOU0VcbiAqIEB2ZXJzaW9uICAgNC4wLjVcbiAqL1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAgIChnbG9iYWwuRVM2UHJvbWlzZSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb2JqZWN0T3JGdW5jdGlvbih4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxudmFyIF9pc0FycmF5ID0gdW5kZWZpbmVkO1xuaWYgKCFBcnJheS5pc0FycmF5KSB7XG4gIF9pc0FycmF5ID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xufSBlbHNlIHtcbiAgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xufVxuXG52YXIgaXNBcnJheSA9IF9pc0FycmF5O1xuXG52YXIgbGVuID0gMDtcbnZhciB2ZXJ0eE5leHQgPSB1bmRlZmluZWQ7XG52YXIgY3VzdG9tU2NoZWR1bGVyRm4gPSB1bmRlZmluZWQ7XG5cbnZhciBhc2FwID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gIHF1ZXVlW2xlbl0gPSBjYWxsYmFjaztcbiAgcXVldWVbbGVuICsgMV0gPSBhcmc7XG4gIGxlbiArPSAyO1xuICBpZiAobGVuID09PSAyKSB7XG4gICAgLy8gSWYgbGVuIGlzIDIsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxuICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxuICAgIGlmIChjdXN0b21TY2hlZHVsZXJGbikge1xuICAgICAgY3VzdG9tU2NoZWR1bGVyRm4oZmx1c2gpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlZHVsZUZsdXNoKCk7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBzZXRTY2hlZHVsZXIoc2NoZWR1bGVGbikge1xuICBjdXN0b21TY2hlZHVsZXJGbiA9IHNjaGVkdWxlRm47XG59XG5cbmZ1bmN0aW9uIHNldEFzYXAoYXNhcEZuKSB7XG4gIGFzYXAgPSBhc2FwRm47XG59XG5cbnZhciBicm93c2VyV2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XG52YXIgYnJvd3Nlckdsb2JhbCA9IGJyb3dzZXJXaW5kb3cgfHwge307XG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xudmFyIGlzTm9kZSA9IHR5cGVvZiBzZWxmID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKHt9KS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXSc7XG5cbi8vIHRlc3QgZm9yIHdlYiB3b3JrZXIgYnV0IG5vdCBpbiBJRTEwXG52YXIgaXNXb3JrZXIgPSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xuXG4vLyBub2RlXG5mdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgLy8gbm9kZSB2ZXJzaW9uIDAuMTAueCBkaXNwbGF5cyBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgd2hlbiBuZXh0VGljayBpcyB1c2VkIHJlY3Vyc2l2ZWx5XG4gIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vY3Vqb2pzL3doZW4vaXNzdWVzLzQxMCBmb3IgZGV0YWlsc1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgfTtcbn1cblxuLy8gdmVydHhcbmZ1bmN0aW9uIHVzZVZlcnR4VGltZXIoKSB7XG4gIGlmICh0eXBlb2YgdmVydHhOZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2ZXJ0eE5leHQoZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiB1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIG5vZGUuZGF0YSA9IGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyO1xuICB9O1xufVxuXG4vLyB3ZWIgd29ya2VyXG5mdW5jdGlvbiB1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmbHVzaDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgLy8gU3RvcmUgc2V0VGltZW91dCByZWZlcmVuY2Ugc28gZXM2LXByb21pc2Ugd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4gIC8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxuICB2YXIgZ2xvYmFsU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdsb2JhbFNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICB9O1xufVxuXG52YXIgcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHZhciBjYWxsYmFjayA9IHF1ZXVlW2ldO1xuICAgIHZhciBhcmcgPSBxdWV1ZVtpICsgMV07XG5cbiAgICBjYWxsYmFjayhhcmcpO1xuXG4gICAgcXVldWVbaV0gPSB1bmRlZmluZWQ7XG4gICAgcXVldWVbaSArIDFdID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGVuID0gMDtcbn1cblxuZnVuY3Rpb24gYXR0ZW1wdFZlcnR4KCkge1xuICB0cnkge1xuICAgIHZhciByID0gcmVxdWlyZTtcbiAgICB2YXIgdmVydHggPSByKCd2ZXJ0eCcpO1xuICAgIHZlcnR4TmV4dCA9IHZlcnR4LnJ1bk9uTG9vcCB8fCB2ZXJ0eC5ydW5PbkNvbnRleHQ7XG4gICAgcmV0dXJuIHVzZVZlcnR4VGltZXIoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG4gIH1cbn1cblxudmFyIHNjaGVkdWxlRmx1c2ggPSB1bmRlZmluZWQ7XG4vLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuaWYgKGlzTm9kZSkge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbn0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbn0gZWxzZSBpZiAoaXNXb3JrZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU1lc3NhZ2VDaGFubmVsKCk7XG59IGVsc2UgaWYgKGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICBzY2hlZHVsZUZsdXNoID0gYXR0ZW1wdFZlcnR4KCk7XG59IGVsc2Uge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiB0aGVuKG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xuXG4gIHZhciBwYXJlbnQgPSB0aGlzO1xuXG4gIHZhciBjaGlsZCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGlmIChjaGlsZFtQUk9NSVNFX0lEXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWFrZVByb21pc2UoY2hpbGQpO1xuICB9XG5cbiAgdmFyIF9zdGF0ZSA9IHBhcmVudC5fc3RhdGU7XG5cbiAgaWYgKF9zdGF0ZSkge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBfYXJndW1lbnRzW19zdGF0ZSAtIDFdO1xuICAgICAgYXNhcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpbnZva2VDYWxsYmFjayhfc3RhdGUsIGNoaWxkLCBjYWxsYmFjaywgcGFyZW50Ll9yZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfSkoKTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG4vKipcbiAgYFByb21pc2UucmVzb2x2ZWAgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSByZXNvbHZlZCB3aXRoIHRoZVxuICBwYXNzZWQgYHZhbHVlYC4gSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlc29sdmUoMSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKDEpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVzb2x2ZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSB2YWx1ZSB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aFxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIGZ1bGZpbGxlZCB3aXRoIHRoZSBnaXZlblxuICBgdmFsdWVgXG4qL1xuZnVuY3Rpb24gcmVzb2x2ZShvYmplY3QpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIF9yZXNvbHZlKHByb21pc2UsIG9iamVjdCk7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG52YXIgUFJPTUlTRV9JRCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygxNik7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG52YXIgUEVORElORyA9IHZvaWQgMDtcbnZhciBGVUxGSUxMRUQgPSAxO1xudmFyIFJFSkVDVEVEID0gMjtcblxudmFyIEdFVF9USEVOX0VSUk9SID0gbmV3IEVycm9yT2JqZWN0KCk7XG5cbmZ1bmN0aW9uIHNlbGZGdWxmaWxsbWVudCgpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgY2Fubm90IHJlc29sdmUgYSBwcm9taXNlIHdpdGggaXRzZWxmXCIpO1xufVxuXG5mdW5jdGlvbiBjYW5ub3RSZXR1cm5Pd24oKSB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW4ocHJvbWlzZSkge1xuICB0cnkge1xuICAgIHJldHVybiBwcm9taXNlLnRoZW47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgR0VUX1RIRU5fRVJST1IuZXJyb3IgPSBlcnJvcjtcbiAgICByZXR1cm4gR0VUX1RIRU5fRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5VGhlbih0aGVuLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gIHRyeSB7XG4gICAgdGhlbi5jYWxsKHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuKSB7XG4gIGFzYXAoZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgdmFyIGVycm9yID0gdHJ5VGhlbih0aGVuLCB0aGVuYWJsZSwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoc2VhbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XG4gICAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0sICdTZXR0bGU6ICcgKyAocHJvbWlzZS5fbGFiZWwgfHwgJyB1bmtub3duIHByb21pc2UnKSk7XG5cbiAgICBpZiAoIXNlYWxlZCAmJiBlcnJvcikge1xuICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH1cbiAgfSwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlKSB7XG4gIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IEZVTEZJTExFRCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSBpZiAodGhlbmFibGUuX3N0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICByZXR1cm4gX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkKSB7XG4gIGlmIChtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yID09PSBwcm9taXNlLmNvbnN0cnVjdG9yICYmIHRoZW4kJCA9PT0gdGhlbiAmJiBtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yLnJlc29sdmUgPT09IHJlc29sdmUpIHtcbiAgICBoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodGhlbiQkID09PSBHRVRfVEhFTl9FUlJPUikge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBHRVRfVEhFTl9FUlJPUi5lcnJvcik7XG4gICAgfSBlbHNlIGlmICh0aGVuJCQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odGhlbiQkKSkge1xuICAgICAgaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4kJCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgc2VsZkZ1bGZpbGxtZW50KCkpO1xuICB9IGVsc2UgaWYgKG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSwgZ2V0VGhlbih2YWx1ZSkpO1xuICB9IGVsc2Uge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hSZWplY3Rpb24ocHJvbWlzZSkge1xuICBpZiAocHJvbWlzZS5fb25lcnJvcikge1xuICAgIHByb21pc2UuX29uZXJyb3IocHJvbWlzZS5fcmVzdWx0KTtcbiAgfVxuXG4gIHB1Ymxpc2gocHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvbWlzZS5fcmVzdWx0ID0gdmFsdWU7XG4gIHByb21pc2UuX3N0YXRlID0gRlVMRklMTEVEO1xuXG4gIGlmIChwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggIT09IDApIHtcbiAgICBhc2FwKHB1Ymxpc2gsIHByb21pc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuICBwcm9taXNlLl9zdGF0ZSA9IFJFSkVDVEVEO1xuICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XG5cbiAgYXNhcChwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfc3Vic2NyaWJlcnMgPSBwYXJlbnQuX3N1YnNjcmliZXJzO1xuICB2YXIgbGVuZ3RoID0gX3N1YnNjcmliZXJzLmxlbmd0aDtcblxuICBwYXJlbnQuX29uZXJyb3IgPSBudWxsO1xuXG4gIF9zdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gIF9zdWJzY3JpYmVyc1tsZW5ndGggKyBGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIFJFSkVDVEVEXSA9IG9uUmVqZWN0aW9uO1xuXG4gIGlmIChsZW5ndGggPT09IDAgJiYgcGFyZW50Ll9zdGF0ZSkge1xuICAgIGFzYXAocHVibGlzaCwgcGFyZW50KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoKHByb21pc2UpIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gcHJvbWlzZS5fc3Vic2NyaWJlcnM7XG4gIHZhciBzZXR0bGVkID0gcHJvbWlzZS5fc3RhdGU7XG5cbiAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBjaGlsZCA9IHVuZGVmaW5lZCxcbiAgICAgIGNhbGxiYWNrID0gdW5kZWZpbmVkLFxuICAgICAgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgaWYgKGNoaWxkKSB7XG4gICAgICBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgfVxuICB9XG5cbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcbn1cblxuZnVuY3Rpb24gRXJyb3JPYmplY3QoKSB7XG4gIHRoaXMuZXJyb3IgPSBudWxsO1xufVxuXG52YXIgVFJZX0NBVENIX0VSUk9SID0gbmV3IEVycm9yT2JqZWN0KCk7XG5cbmZ1bmN0aW9uIHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gY2FsbGJhY2soZGV0YWlsKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIFRSWV9DQVRDSF9FUlJPUi5lcnJvciA9IGU7XG4gICAgcmV0dXJuIFRSWV9DQVRDSF9FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBwcm9taXNlLCBjYWxsYmFjaywgZGV0YWlsKSB7XG4gIHZhciBoYXNDYWxsYmFjayA9IGlzRnVuY3Rpb24oY2FsbGJhY2spLFxuICAgICAgdmFsdWUgPSB1bmRlZmluZWQsXG4gICAgICBlcnJvciA9IHVuZGVmaW5lZCxcbiAgICAgIHN1Y2NlZWRlZCA9IHVuZGVmaW5lZCxcbiAgICAgIGZhaWxlZCA9IHVuZGVmaW5lZDtcblxuICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICB2YWx1ZSA9IHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpO1xuXG4gICAgaWYgKHZhbHVlID09PSBUUllfQ0FUQ0hfRVJST1IpIHtcbiAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICBlcnJvciA9IHZhbHVlLmVycm9yO1xuICAgICAgdmFsdWUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBjYW5ub3RSZXR1cm5Pd24oKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbHVlID0gZGV0YWlsO1xuICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gIH1cblxuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAvLyBub29wXG4gIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gRlVMRklMTEVEKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IFJFSkVDVEVEKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XG4gIHRyeSB7XG4gICAgcmVzb2x2ZXIoZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UodmFsdWUpIHtcbiAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgICAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCBlKTtcbiAgfVxufVxuXG52YXIgaWQgPSAwO1xuZnVuY3Rpb24gbmV4dElkKCkge1xuICByZXR1cm4gaWQrKztcbn1cblxuZnVuY3Rpb24gbWFrZVByb21pc2UocHJvbWlzZSkge1xuICBwcm9taXNlW1BST01JU0VfSURdID0gaWQrKztcbiAgcHJvbWlzZS5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gIHByb21pc2UuX3Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMgPSBbXTtcbn1cblxuZnVuY3Rpb24gRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQpIHtcbiAgdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yO1xuICB0aGlzLnByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKCF0aGlzLnByb21pc2VbUFJPTUlTRV9JRF0pIHtcbiAgICBtYWtlUHJvbWlzZSh0aGlzLnByb21pc2UpO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLmxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICB0aGlzLl9yZW1haW5pbmcgPSBpbnB1dC5sZW5ndGg7XG5cbiAgICB0aGlzLl9yZXN1bHQgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmxlbmd0aCB8fCAwO1xuICAgICAgdGhpcy5fZW51bWVyYXRlKCk7XG4gICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBfcmVqZWN0KHRoaXMucHJvbWlzZSwgdmFsaWRhdGlvbkVycm9yKCkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRpb25FcnJvcigpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fZW51bWVyYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gIHZhciBfaW5wdXQgPSB0aGlzLl9pbnB1dDtcblxuICBmb3IgKHZhciBpID0gMDsgdGhpcy5fc3RhdGUgPT09IFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5fZWFjaEVudHJ5KF9pbnB1dFtpXSwgaSk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9lYWNoRW50cnkgPSBmdW5jdGlvbiAoZW50cnksIGkpIHtcbiAgdmFyIGMgPSB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yO1xuICB2YXIgcmVzb2x2ZSQkID0gYy5yZXNvbHZlO1xuXG4gIGlmIChyZXNvbHZlJCQgPT09IHJlc29sdmUpIHtcbiAgICB2YXIgX3RoZW4gPSBnZXRUaGVuKGVudHJ5KTtcblxuICAgIGlmIChfdGhlbiA9PT0gdGhlbiAmJiBlbnRyeS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAgIHRoaXMuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIF90aGVuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLl9yZW1haW5pbmctLTtcbiAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IGVudHJ5O1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gUHJvbWlzZSkge1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgYyhub29wKTtcbiAgICAgIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgZW50cnksIF90aGVuKTtcbiAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChwcm9taXNlLCBpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KG5ldyBjKGZ1bmN0aW9uIChyZXNvbHZlJCQpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUkJChlbnRyeSk7XG4gICAgICB9KSwgaSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX3dpbGxTZXR0bGVBdChyZXNvbHZlJCQoZW50cnkpLCBpKTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uIChzdGF0ZSwgaSwgdmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzLnByb21pc2U7XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgdGhpcy5fcmVtYWluaW5nLS07XG5cbiAgICBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX3dpbGxTZXR0bGVBdCA9IGZ1bmN0aW9uIChwcm9taXNlLCBpKSB7XG4gIHZhciBlbnVtZXJhdG9yID0gdGhpcztcblxuICBzdWJzY3JpYmUocHJvbWlzZSwgdW5kZWZpbmVkLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KEZVTEZJTExFRCwgaSwgdmFsdWUpO1xuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgcmV0dXJuIGVudW1lcmF0b3IuX3NldHRsZWRBdChSRUpFQ1RFRCwgaSwgcmVhc29uKTtcbiAgfSk7XG59O1xuXG4vKipcbiAgYFByb21pc2UuYWxsYCBhY2NlcHRzIGFuIGFycmF5IG9mIHByb21pc2VzLCBhbmQgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoXG4gIGlzIGZ1bGZpbGxlZCB3aXRoIGFuIGFycmF5IG9mIGZ1bGZpbGxtZW50IHZhbHVlcyBmb3IgdGhlIHBhc3NlZCBwcm9taXNlcywgb3JcbiAgcmVqZWN0ZWQgd2l0aCB0aGUgcmVhc29uIG9mIHRoZSBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBiZSByZWplY3RlZC4gSXQgY2FzdHMgYWxsXG4gIGVsZW1lbnRzIG9mIHRoZSBwYXNzZWQgaXRlcmFibGUgdG8gcHJvbWlzZXMgYXMgaXQgcnVucyB0aGlzIGFsZ29yaXRobS5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gcmVzb2x2ZSgxKTtcbiAgbGV0IHByb21pc2UyID0gcmVzb2x2ZSgyKTtcbiAgbGV0IHByb21pc2UzID0gcmVzb2x2ZSgzKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIFRoZSBhcnJheSBoZXJlIHdvdWxkIGJlIFsgMSwgMiwgMyBdO1xuICB9KTtcbiAgYGBgXG5cbiAgSWYgYW55IG9mIHRoZSBgcHJvbWlzZXNgIGdpdmVuIHRvIGBhbGxgIGFyZSByZWplY3RlZCwgdGhlIGZpcnN0IHByb21pc2VcbiAgdGhhdCBpcyByZWplY3RlZCB3aWxsIGJlIGdpdmVuIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSByZXR1cm5lZCBwcm9taXNlcydzXG4gIHJlamVjdGlvbiBoYW5kbGVyLiBGb3IgZXhhbXBsZTpcblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gcmVzb2x2ZSgxKTtcbiAgbGV0IHByb21pc2UyID0gcmVqZWN0KG5ldyBFcnJvcihcIjJcIikpO1xuICBsZXQgcHJvbWlzZTMgPSByZWplY3QobmV3IEVycm9yKFwiM1wiKSk7XG4gIGxldCBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVucyBiZWNhdXNlIHRoZXJlIGFyZSByZWplY3RlZCBwcm9taXNlcyFcbiAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAvLyBlcnJvci5tZXNzYWdlID09PSBcIjJcIlxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCBhbGxcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBlbnRyaWVzIGFycmF5IG9mIHByb21pc2VzXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGxhYmVsaW5nIHRoZSBwcm9taXNlLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhbGwgYHByb21pc2VzYCBoYXZlIGJlZW5cbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCBpZiBhbnkgb2YgdGhlbSBiZWNvbWUgcmVqZWN0ZWQuXG4gIEBzdGF0aWNcbiovXG5mdW5jdGlvbiBhbGwoZW50cmllcykge1xuICByZXR1cm4gbmV3IEVudW1lcmF0b3IodGhpcywgZW50cmllcykucHJvbWlzZTtcbn1cblxuLyoqXG4gIGBQcm9taXNlLnJhY2VgIHJldHVybnMgYSBuZXcgcHJvbWlzZSB3aGljaCBpcyBzZXR0bGVkIGluIHRoZSBzYW1lIHdheSBhcyB0aGVcbiAgZmlyc3QgcGFzc2VkIHByb21pc2UgdG8gc2V0dGxlLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMScpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIGxldCBwcm9taXNlMiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAyJyk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUHJvbWlzZS5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gcmVzdWx0ID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIGl0IHdhcyByZXNvbHZlZCBiZWZvcmUgcHJvbWlzZTFcbiAgICAvLyB3YXMgcmVzb2x2ZWQuXG4gIH0pO1xuICBgYGBcblxuICBgUHJvbWlzZS5yYWNlYCBpcyBkZXRlcm1pbmlzdGljIGluIHRoYXQgb25seSB0aGUgc3RhdGUgb2YgdGhlIGZpcnN0XG4gIHNldHRsZWQgcHJvbWlzZSBtYXR0ZXJzLiBGb3IgZXhhbXBsZSwgZXZlbiBpZiBvdGhlciBwcm9taXNlcyBnaXZlbiB0byB0aGVcbiAgYHByb21pc2VzYCBhcnJheSBhcmd1bWVudCBhcmUgcmVzb2x2ZWQsIGJ1dCB0aGUgZmlyc3Qgc2V0dGxlZCBwcm9taXNlIGhhc1xuICBiZWNvbWUgcmVqZWN0ZWQgYmVmb3JlIHRoZSBvdGhlciBwcm9taXNlcyBiZWNhbWUgZnVsZmlsbGVkLCB0aGUgcmV0dXJuZWRcbiAgcHJvbWlzZSB3aWxsIGJlY29tZSByZWplY3RlZDpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZWplY3QobmV3IEVycm9yKCdwcm9taXNlIDInKSk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUHJvbWlzZS5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnNcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ3Byb21pc2UgMicgYmVjYXVzZSBwcm9taXNlIDIgYmVjYW1lIHJlamVjdGVkIGJlZm9yZVxuICAgIC8vIHByb21pc2UgMSBiZWNhbWUgZnVsZmlsbGVkXG4gIH0pO1xuICBgYGBcblxuICBBbiBleGFtcGxlIHJlYWwtd29ybGQgdXNlIGNhc2UgaXMgaW1wbGVtZW50aW5nIHRpbWVvdXRzOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgUHJvbWlzZS5yYWNlKFthamF4KCdmb28uanNvbicpLCB0aW1lb3V0KDUwMDApXSlcbiAgYGBgXG5cbiAgQG1ldGhvZCByYWNlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBcnJheX0gcHJvbWlzZXMgYXJyYXkgb2YgcHJvbWlzZXMgdG8gb2JzZXJ2ZVxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB3aGljaCBzZXR0bGVzIGluIHRoZSBzYW1lIHdheSBhcyB0aGUgZmlyc3QgcGFzc2VkXG4gIHByb21pc2UgdG8gc2V0dGxlLlxuKi9cbmZ1bmN0aW9uIHJhY2UoZW50cmllcykge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmICghaXNBcnJheShlbnRyaWVzKSkge1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24gKF8sIHJlamVjdCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIHJhY2UuJykpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGxlbmd0aCA9IGVudHJpZXMubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAgYFByb21pc2UucmVqZWN0YCByZXR1cm5zIGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIHRoZSBwYXNzZWQgYHJlYXNvbmAuXG4gIEl0IGlzIHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlamVjdFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSByZWFzb24gdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGguXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIGdpdmVuIGByZWFzb25gLlxuKi9cbmZ1bmN0aW9uIHJlamVjdChyZWFzb24pIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIG5lZWRzUmVzb2x2ZXIoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSByZXNvbHZlciBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIHByb21pc2UgY29uc3RydWN0b3InKTtcbn1cblxuZnVuY3Rpb24gbmVlZHNOZXcoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG59XG5cbi8qKlxuICBQcm9taXNlIG9iamVjdHMgcmVwcmVzZW50IHRoZSBldmVudHVhbCByZXN1bHQgb2YgYW4gYXN5bmNocm9ub3VzIG9wZXJhdGlvbi4gVGhlXG4gIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsIHdoaWNoXG4gIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlIHJlYXNvblxuICB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICBUZXJtaW5vbG9neVxuICAtLS0tLS0tLS0tLVxuXG4gIC0gYHByb21pc2VgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB3aXRoIGEgYHRoZW5gIG1ldGhvZCB3aG9zZSBiZWhhdmlvciBjb25mb3JtcyB0byB0aGlzIHNwZWNpZmljYXRpb24uXG4gIC0gYHRoZW5hYmxlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gdGhhdCBkZWZpbmVzIGEgYHRoZW5gIG1ldGhvZC5cbiAgLSBgdmFsdWVgIGlzIGFueSBsZWdhbCBKYXZhU2NyaXB0IHZhbHVlIChpbmNsdWRpbmcgdW5kZWZpbmVkLCBhIHRoZW5hYmxlLCBvciBhIHByb21pc2UpLlxuICAtIGBleGNlcHRpb25gIGlzIGEgdmFsdWUgdGhhdCBpcyB0aHJvd24gdXNpbmcgdGhlIHRocm93IHN0YXRlbWVudC5cbiAgLSBgcmVhc29uYCBpcyBhIHZhbHVlIHRoYXQgaW5kaWNhdGVzIHdoeSBhIHByb21pc2Ugd2FzIHJlamVjdGVkLlxuICAtIGBzZXR0bGVkYCB0aGUgZmluYWwgcmVzdGluZyBzdGF0ZSBvZiBhIHByb21pc2UsIGZ1bGZpbGxlZCBvciByZWplY3RlZC5cblxuICBBIHByb21pc2UgY2FuIGJlIGluIG9uZSBvZiB0aHJlZSBzdGF0ZXM6IHBlbmRpbmcsIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQuXG5cbiAgUHJvbWlzZXMgdGhhdCBhcmUgZnVsZmlsbGVkIGhhdmUgYSBmdWxmaWxsbWVudCB2YWx1ZSBhbmQgYXJlIGluIHRoZSBmdWxmaWxsZWRcbiAgc3RhdGUuICBQcm9taXNlcyB0aGF0IGFyZSByZWplY3RlZCBoYXZlIGEgcmVqZWN0aW9uIHJlYXNvbiBhbmQgYXJlIGluIHRoZVxuICByZWplY3RlZCBzdGF0ZS4gIEEgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmV2ZXIgYSB0aGVuYWJsZS5cblxuICBQcm9taXNlcyBjYW4gYWxzbyBiZSBzYWlkIHRvICpyZXNvbHZlKiBhIHZhbHVlLiAgSWYgdGhpcyB2YWx1ZSBpcyBhbHNvIGFcbiAgcHJvbWlzZSwgdGhlbiB0aGUgb3JpZ2luYWwgcHJvbWlzZSdzIHNldHRsZWQgc3RhdGUgd2lsbCBtYXRjaCB0aGUgdmFsdWUnc1xuICBzZXR0bGVkIHN0YXRlLiAgU28gYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCByZWplY3RzIHdpbGxcbiAgaXRzZWxmIHJlamVjdCwgYW5kIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgd2lsbFxuICBpdHNlbGYgZnVsZmlsbC5cblxuXG4gIEJhc2ljIFVzYWdlOlxuICAtLS0tLS0tLS0tLS1cblxuICBgYGBqc1xuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIC8vIG9uIHN1Y2Nlc3NcbiAgICByZXNvbHZlKHZhbHVlKTtcblxuICAgIC8vIG9uIGZhaWx1cmVcbiAgICByZWplY3QocmVhc29uKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgLy8gb24gcmVqZWN0aW9uXG4gIH0pO1xuICBgYGBcblxuICBBZHZhbmNlZCBVc2FnZTpcbiAgLS0tLS0tLS0tLS0tLS0tXG5cbiAgUHJvbWlzZXMgc2hpbmUgd2hlbiBhYnN0cmFjdGluZyBhd2F5IGFzeW5jaHJvbm91cyBpbnRlcmFjdGlvbnMgc3VjaCBhc1xuICBgWE1MSHR0cFJlcXVlc3Rgcy5cblxuICBgYGBqc1xuICBmdW5jdGlvbiBnZXRKU09OKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVyO1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgZnVuY3Rpb24gaGFuZGxlcigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gdGhpcy5ET05FKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2dldEpTT046IGAnICsgdXJsICsgJ2AgZmFpbGVkIHdpdGggc3RhdHVzOiBbJyArIHRoaXMuc3RhdHVzICsgJ10nKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0SlNPTignL3Bvc3RzLmpzb24nKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIFVubGlrZSBjYWxsYmFja3MsIHByb21pc2VzIGFyZSBncmVhdCBjb21wb3NhYmxlIHByaW1pdGl2ZXMuXG5cbiAgYGBganNcbiAgUHJvbWlzZS5hbGwoW1xuICAgIGdldEpTT04oJy9wb3N0cycpLFxuICAgIGdldEpTT04oJy9jb21tZW50cycpXG4gIF0pLnRoZW4oZnVuY3Rpb24odmFsdWVzKXtcbiAgICB2YWx1ZXNbMF0gLy8gPT4gcG9zdHNKU09OXG4gICAgdmFsdWVzWzFdIC8vID0+IGNvbW1lbnRzSlNPTlxuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSk7XG4gIGBgYFxuXG4gIEBjbGFzcyBQcm9taXNlXG4gIEBwYXJhbSB7ZnVuY3Rpb259IHJlc29sdmVyXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQGNvbnN0cnVjdG9yXG4qL1xuZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xuICB0aGlzW1BST01JU0VfSURdID0gbmV4dElkKCk7XG4gIHRoaXMuX3Jlc3VsdCA9IHRoaXMuX3N0YXRlID0gdW5kZWZpbmVkO1xuICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xuXG4gIGlmIChub29wICE9PSByZXNvbHZlcikge1xuICAgIHR5cGVvZiByZXNvbHZlciAhPT0gJ2Z1bmN0aW9uJyAmJiBuZWVkc1Jlc29sdmVyKCk7XG4gICAgdGhpcyBpbnN0YW5jZW9mIFByb21pc2UgPyBpbml0aWFsaXplUHJvbWlzZSh0aGlzLCByZXNvbHZlcikgOiBuZWVkc05ldygpO1xuICB9XG59XG5cblByb21pc2UuYWxsID0gYWxsO1xuUHJvbWlzZS5yYWNlID0gcmFjZTtcblByb21pc2UucmVzb2x2ZSA9IHJlc29sdmU7XG5Qcm9taXNlLnJlamVjdCA9IHJlamVjdDtcblByb21pc2UuX3NldFNjaGVkdWxlciA9IHNldFNjaGVkdWxlcjtcblByb21pc2UuX3NldEFzYXAgPSBzZXRBc2FwO1xuUHJvbWlzZS5fYXNhcCA9IGFzYXA7XG5cblByb21pc2UucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogUHJvbWlzZSxcblxuICAvKipcbiAgICBUaGUgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCxcbiAgICB3aGljaCByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZVxuICAgIHJlYXNvbiB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAvLyB1c2VyIGlzIGF2YWlsYWJsZVxuICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBDaGFpbmluZ1xuICAgIC0tLS0tLS0tXG4gIFxuICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgYHRoZW5gIGlzIGl0c2VsZiBhIHByb21pc2UuICBUaGlzIHNlY29uZCwgJ2Rvd25zdHJlYW0nXG4gICAgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZpcnN0IHByb21pc2UncyBmdWxmaWxsbWVudFxuICAgIG9yIHJlamVjdGlvbiBoYW5kbGVyLCBvciByZWplY3RlZCBpZiB0aGUgaGFuZGxlciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXIubmFtZTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodXNlck5hbWUpIHtcbiAgICAgIC8vIElmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgdXNlck5hbWVgIHdpbGwgYmUgdGhlIHVzZXIncyBuYW1lLCBvdGhlcndpc2UgaXRcbiAgICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxuICAgIH0pO1xuICBcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIGlmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgcmVhc29uYCB3aWxsIGJlICdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScuXG4gICAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cbiAgICB9KTtcbiAgICBgYGBcbiAgICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBQZWRhZ29naWNhbEV4Y2VwdGlvbignVXBzdHJlYW0gZXJyb3InKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gVGhlIGBQZWRnYWdvY2lhbEV4Y2VwdGlvbmAgaXMgcHJvcGFnYXRlZCBhbGwgdGhlIHdheSBkb3duIHRvIGhlcmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQXNzaW1pbGF0aW9uXG4gICAgLS0tLS0tLS0tLS0tXG4gIFxuICAgIFNvbWV0aW1lcyB0aGUgdmFsdWUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIHRvIGEgZG93bnN0cmVhbSBwcm9taXNlIGNhbiBvbmx5IGJlXG4gICAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxuICAgIGZ1bGZpbGxtZW50IG9yIHJlamVjdGlvbiBoYW5kbGVyLiBUaGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgdGhlbiBiZSBwZW5kaW5nXG4gICAgdW50aWwgdGhlIHJldHVybmVkIHByb21pc2UgaXMgc2V0dGxlZC4gVGhpcyBpcyBjYWxsZWQgKmFzc2ltaWxhdGlvbiouXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgIC8vIFRoZSB1c2VyJ3MgY29tbWVudHMgYXJlIG5vdyBhdmFpbGFibGVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgSWYgdGhlIGFzc2ltbGlhdGVkIHByb21pc2UgcmVqZWN0cywgdGhlbiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgYWxzbyByZWplY3QuXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIHJlamVjdHMsIHdlJ2xsIGhhdmUgdGhlIHJlYXNvbiBoZXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFNpbXBsZSBFeGFtcGxlXG4gICAgLS0tLS0tLS0tLS0tLS1cbiAgXG4gICAgU3luY2hyb25vdXMgRXhhbXBsZVxuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgbGV0IHJlc3VsdDtcbiAgXG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGZpbmRSZXN1bHQoKTtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH1cbiAgICBgYGBcbiAgXG4gICAgRXJyYmFjayBFeGFtcGxlXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFJlc3VsdChmdW5jdGlvbihyZXN1bHQsIGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH1cbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgUHJvbWlzZSBFeGFtcGxlO1xuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBBZHZhbmNlZCBFeGFtcGxlXG4gICAgLS0tLS0tLS0tLS0tLS1cbiAgXG4gICAgU3luY2hyb25vdXMgRXhhbXBsZVxuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgbGV0IGF1dGhvciwgYm9va3M7XG4gIFxuICAgIHRyeSB7XG4gICAgICBhdXRob3IgPSBmaW5kQXV0aG9yKCk7XG4gICAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBFcnJiYWNrIEV4YW1wbGVcbiAgXG4gICAgYGBganNcbiAgXG4gICAgZnVuY3Rpb24gZm91bmRCb29rcyhib29rcykge1xuICBcbiAgICB9XG4gIFxuICAgIGZ1bmN0aW9uIGZhaWx1cmUocmVhc29uKSB7XG4gIFxuICAgIH1cbiAgXG4gICAgZmluZEF1dGhvcihmdW5jdGlvbihhdXRob3IsIGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaW5kQm9vb2tzQnlBdXRob3IoYXV0aG9yLCBmdW5jdGlvbihib29rcywgZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm91bmRCb29rcyhib29rcyk7XG4gICAgICAgICAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgZmFpbHVyZShyZWFzb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBQcm9taXNlIEV4YW1wbGU7XG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBmaW5kQXV0aG9yKCkuXG4gICAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cbiAgICAgIHRoZW4oZnVuY3Rpb24oYm9va3Mpe1xuICAgICAgICAvLyBmb3VuZCBib29rc1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBAbWV0aG9kIHRoZW5cbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGZpbGxlZFxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0ZWRcbiAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cbiAgdGhlbjogdGhlbixcblxuICAvKipcbiAgICBgY2F0Y2hgIGlzIHNpbXBseSBzdWdhciBmb3IgYHRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbilgIHdoaWNoIG1ha2VzIGl0IHRoZSBzYW1lXG4gICAgYXMgdGhlIGNhdGNoIGJsb2NrIG9mIGEgdHJ5L2NhdGNoIHN0YXRlbWVudC5cbiAgXG4gICAgYGBganNcbiAgICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkbid0IGZpbmQgdGhhdCBhdXRob3InKTtcbiAgICB9XG4gIFxuICAgIC8vIHN5bmNocm9ub3VzXG4gICAgdHJ5IHtcbiAgICAgIGZpbmRBdXRob3IoKTtcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9XG4gIFxuICAgIC8vIGFzeW5jIHdpdGggcHJvbWlzZXNcbiAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgY2F0Y2hcbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuICAnY2F0Y2gnOiBmdW5jdGlvbiBfY2F0Y2gob25SZWplY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gICAgdmFyIGxvY2FsID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvY2FsID0gZ2xvYmFsO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvY2FsID0gc2VsZjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWwgPSBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHlmaWxsIGZhaWxlZCBiZWNhdXNlIGdsb2JhbCBvYmplY3QgaXMgdW5hdmFpbGFibGUgaW4gdGhpcyBlbnZpcm9ubWVudCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFAgPSBsb2NhbC5Qcm9taXNlO1xuXG4gICAgaWYgKFApIHtcbiAgICAgICAgdmFyIHByb21pc2VUb1N0cmluZyA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUC5yZXNvbHZlKCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBzaWxlbnRseSBpZ25vcmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvbWlzZVRvU3RyaW5nID09PSAnW29iamVjdCBQcm9taXNlXScgJiYgIVAuY2FzdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9jYWwuUHJvbWlzZSA9IFByb21pc2U7XG59XG5cbi8vIFN0cmFuZ2UgY29tcGF0Li5cblByb21pc2UucG9seWZpbGwgPSBwb2x5ZmlsbDtcblByb21pc2UuUHJvbWlzZSA9IFByb21pc2U7XG5cbnJldHVybiBQcm9taXNlO1xuXG59KSkpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZSgnX3Byb2Nlc3MnKSx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW01dlpHVmZiVzlrZFd4bGN5OWxjell0Y0hKdmJXbHpaUzlrYVhOMEwyVnpOaTF3Y205dGFYTmxMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpRmNiaUFxSUVCdmRtVnlkbWxsZHlCbGN6WXRjSEp2YldselpTQXRJR0VnZEdsdWVTQnBiWEJzWlcxbGJuUmhkR2x2YmlCdlppQlFjbTl0YVhObGN5OUJLeTVjYmlBcUlFQmpiM0I1Y21sbmFIUWdRMjl3ZVhKcFoyaDBJQ2hqS1NBeU1ERTBJRmxsYUhWa1lTQkxZWFI2TENCVWIyMGdSR0ZzWlN3Z1UzUmxabUZ1SUZCbGJtNWxjaUJoYm1RZ1kyOXVkSEpwWW5WMGIzSnpJQ2hEYjI1MlpYSnphVzl1SUhSdklFVlROaUJCVUVrZ1lua2dTbUZyWlNCQmNtTm9hV0poYkdRcFhHNGdLaUJBYkdsalpXNXpaU0FnSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNCc2FXTmxibk5sWEc0Z0tpQWdJQ0FnSUNBZ0lDQWdJRk5sWlNCb2RIUndjem92TDNKaGR5NW5hWFJvZFdKMWMyVnlZMjl1ZEdWdWRDNWpiMjB2YzNSbFptRnVjR1Z1Ym1WeUwyVnpOaTF3Y205dGFYTmxMMjFoYzNSbGNpOU1TVU5GVGxORlhHNGdLaUJBZG1WeWMybHZiaUFnSURRdU1DNDFYRzRnS2k5Y2JseHVLR1oxYm1OMGFXOXVJQ2huYkc5aVlXd3NJR1poWTNSdmNua3BJSHRjYmlBZ0lDQjBlWEJsYjJZZ1pYaHdiM0owY3lBOVBUMGdKMjlpYW1WamRDY2dKaVlnZEhsd1pXOW1JRzF2WkhWc1pTQWhQVDBnSjNWdVpHVm1hVzVsWkNjZ1B5QnRiMlIxYkdVdVpYaHdiM0owY3lBOUlHWmhZM1J2Y25rb0tTQTZYRzRnSUNBZ2RIbHdaVzltSUdSbFptbHVaU0E5UFQwZ0oyWjFibU4wYVc5dUp5QW1KaUJrWldacGJtVXVZVzFrSUQ4Z1pHVm1hVzVsS0daaFkzUnZjbmtwSURwY2JpQWdJQ0FvWjJ4dlltRnNMa1ZUTmxCeWIyMXBjMlVnUFNCbVlXTjBiM0o1S0NrcE8xeHVmU2gwYUdsekxDQW9ablZ1WTNScGIyNGdLQ2tnZXlBbmRYTmxJSE4wY21samRDYzdYRzVjYm1aMWJtTjBhVzl1SUc5aWFtVmpkRTl5Um5WdVkzUnBiMjRvZUNrZ2UxeHVJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlIZ2dQVDA5SUNkbWRXNWpkR2x2YmljZ2ZId2dkSGx3Wlc5bUlIZ2dQVDA5SUNkdlltcGxZM1FuSUNZbUlIZ2dJVDA5SUc1MWJHdzdYRzU5WEc1Y2JtWjFibU4wYVc5dUlHbHpSblZ1WTNScGIyNG9lQ2tnZTF4dUlDQnlaWFIxY200Z2RIbHdaVzltSUhnZ1BUMDlJQ2RtZFc1amRHbHZiaWM3WEc1OVhHNWNiblpoY2lCZmFYTkJjbkpoZVNBOUlIVnVaR1ZtYVc1bFpEdGNibWxtSUNnaFFYSnlZWGt1YVhOQmNuSmhlU2tnZTF4dUlDQmZhWE5CY25KaGVTQTlJR1oxYm1OMGFXOXVJQ2g0S1NCN1hHNGdJQ0FnY21WMGRYSnVJRTlpYW1WamRDNXdjbTkwYjNSNWNHVXVkRzlUZEhKcGJtY3VZMkZzYkNoNEtTQTlQVDBnSjF0dlltcGxZM1FnUVhKeVlYbGRKenRjYmlBZ2ZUdGNibjBnWld4elpTQjdYRzRnSUY5cGMwRnljbUY1SUQwZ1FYSnlZWGt1YVhOQmNuSmhlVHRjYm4xY2JseHVkbUZ5SUdselFYSnlZWGtnUFNCZmFYTkJjbkpoZVR0Y2JseHVkbUZ5SUd4bGJpQTlJREE3WEc1MllYSWdkbVZ5ZEhoT1pYaDBJRDBnZFc1a1pXWnBibVZrTzF4dWRtRnlJR04xYzNSdmJWTmphR1ZrZFd4bGNrWnVJRDBnZFc1a1pXWnBibVZrTzF4dVhHNTJZWElnWVhOaGNDQTlJR1oxYm1OMGFXOXVJR0Z6WVhBb1kyRnNiR0poWTJzc0lHRnlaeWtnZTF4dUlDQnhkV1YxWlZ0c1pXNWRJRDBnWTJGc2JHSmhZMnM3WEc0Z0lIRjFaWFZsVzJ4bGJpQXJJREZkSUQwZ1lYSm5PMXh1SUNCc1pXNGdLejBnTWp0Y2JpQWdhV1lnS0d4bGJpQTlQVDBnTWlrZ2UxeHVJQ0FnSUM4dklFbG1JR3hsYmlCcGN5QXlMQ0IwYUdGMElHMWxZVzV6SUhSb1lYUWdkMlVnYm1WbFpDQjBieUJ6WTJobFpIVnNaU0JoYmlCaGMzbHVZeUJtYkhWemFDNWNiaUFnSUNBdkx5QkpaaUJoWkdScGRHbHZibUZzSUdOaGJHeGlZV05yY3lCaGNtVWdjWFZsZFdWa0lHSmxabTl5WlNCMGFHVWdjWFZsZFdVZ2FYTWdabXgxYzJobFpDd2dkR2hsZVZ4dUlDQWdJQzh2SUhkcGJHd2dZbVVnY0hKdlkyVnpjMlZrSUdKNUlIUm9hWE1nWm14MWMyZ2dkR2hoZENCM1pTQmhjbVVnYzJOb1pXUjFiR2x1Wnk1Y2JpQWdJQ0JwWmlBb1kzVnpkRzl0VTJOb1pXUjFiR1Z5Um00cElIdGNiaUFnSUNBZ0lHTjFjM1J2YlZOamFHVmtkV3hsY2tadUtHWnNkWE5vS1R0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdjMk5vWldSMWJHVkdiSFZ6YUNncE8xeHVJQ0FnSUgxY2JpQWdmVnh1ZlR0Y2JseHVablZ1WTNScGIyNGdjMlYwVTJOb1pXUjFiR1Z5S0hOamFHVmtkV3hsUm00cElIdGNiaUFnWTNWemRHOXRVMk5vWldSMWJHVnlSbTRnUFNCelkyaGxaSFZzWlVadU8xeHVmVnh1WEc1bWRXNWpkR2x2YmlCelpYUkJjMkZ3S0dGellYQkdiaWtnZTF4dUlDQmhjMkZ3SUQwZ1lYTmhjRVp1TzF4dWZWeHVYRzUyWVhJZ1luSnZkM05sY2xkcGJtUnZkeUE5SUhSNWNHVnZaaUIzYVc1a2IzY2dJVDA5SUNkMWJtUmxabWx1WldRbklEOGdkMmx1Wkc5M0lEb2dkVzVrWldacGJtVmtPMXh1ZG1GeUlHSnliM2R6WlhKSGJHOWlZV3dnUFNCaWNtOTNjMlZ5VjJsdVpHOTNJSHg4SUh0OU8xeHVkbUZ5SUVKeWIzZHpaWEpOZFhSaGRHbHZiazlpYzJWeWRtVnlJRDBnWW5KdmQzTmxja2RzYjJKaGJDNU5kWFJoZEdsdmJrOWljMlZ5ZG1WeUlIeDhJR0p5YjNkelpYSkhiRzlpWVd3dVYyVmlTMmwwVFhWMFlYUnBiMjVQWW5ObGNuWmxjanRjYm5aaGNpQnBjMDV2WkdVZ1BTQjBlWEJsYjJZZ2MyVnNaaUE5UFQwZ0ozVnVaR1ZtYVc1bFpDY2dKaVlnZEhsd1pXOW1JSEJ5YjJObGMzTWdJVDA5SUNkMWJtUmxabWx1WldRbklDWW1JQ2g3ZlNrdWRHOVRkSEpwYm1jdVkyRnNiQ2h3Y205alpYTnpLU0E5UFQwZ0oxdHZZbXBsWTNRZ2NISnZZMlZ6YzEwbk8xeHVYRzR2THlCMFpYTjBJR1p2Y2lCM1pXSWdkMjl5YTJWeUlHSjFkQ0J1YjNRZ2FXNGdTVVV4TUZ4dWRtRnlJR2x6VjI5eWEyVnlJRDBnZEhsd1pXOW1JRlZwYm5RNFEyeGhiWEJsWkVGeWNtRjVJQ0U5UFNBbmRXNWtaV1pwYm1Wa0p5QW1KaUIwZVhCbGIyWWdhVzF3YjNKMFUyTnlhWEIwY3lBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NnSmlZZ2RIbHdaVzltSUUxbGMzTmhaMlZEYUdGdWJtVnNJQ0U5UFNBbmRXNWtaV1pwYm1Wa0p6dGNibHh1THk4Z2JtOWtaVnh1Wm5WdVkzUnBiMjRnZFhObFRtVjRkRlJwWTJzb0tTQjdYRzRnSUM4dklHNXZaR1VnZG1WeWMybHZiaUF3TGpFd0xuZ2daR2x6Y0d4aGVYTWdZU0JrWlhCeVpXTmhkR2x2YmlCM1lYSnVhVzVuSUhkb1pXNGdibVY0ZEZScFkyc2dhWE1nZFhObFpDQnlaV04xY25OcGRtVnNlVnh1SUNBdkx5QnpaV1VnYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDJOMWFtOXFjeTkzYUdWdUwybHpjM1ZsY3k4ME1UQWdabTl5SUdSbGRHRnBiSE5jYmlBZ2NtVjBkWEp1SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnY0hKdlkyVnpjeTV1WlhoMFZHbGpheWhtYkhWemFDazdYRzRnSUgwN1hHNTlYRzVjYmk4dklIWmxjblI0WEc1bWRXNWpkR2x2YmlCMWMyVldaWEowZUZScGJXVnlLQ2tnZTF4dUlDQnBaaUFvZEhsd1pXOW1JSFpsY25SNFRtVjRkQ0FoUFQwZ0ozVnVaR1ZtYVc1bFpDY3BJSHRjYmlBZ0lDQnlaWFIxY200Z1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdkbVZ5ZEhoT1pYaDBLR1pzZFhOb0tUdGNiaUFnSUNCOU8xeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlIVnpaVk5sZEZScGJXVnZkWFFvS1R0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnZFhObFRYVjBZWFJwYjI1UFluTmxjblpsY2lncElIdGNiaUFnZG1GeUlHbDBaWEpoZEdsdmJuTWdQU0F3TzF4dUlDQjJZWElnYjJKelpYSjJaWElnUFNCdVpYY2dRbkp2ZDNObGNrMTFkR0YwYVc5dVQySnpaWEoyWlhJb1pteDFjMmdwTzF4dUlDQjJZWElnYm05a1pTQTlJR1J2WTNWdFpXNTBMbU55WldGMFpWUmxlSFJPYjJSbEtDY25LVHRjYmlBZ2IySnpaWEoyWlhJdWIySnpaWEoyWlNodWIyUmxMQ0I3SUdOb1lYSmhZM1JsY2tSaGRHRTZJSFJ5ZFdVZ2ZTazdYRzVjYmlBZ2NtVjBkWEp1SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCdWIyUmxMbVJoZEdFZ1BTQnBkR1Z5WVhScGIyNXpJRDBnS3l0cGRHVnlZWFJwYjI1eklDVWdNanRjYmlBZ2ZUdGNibjFjYmx4dUx5OGdkMlZpSUhkdmNtdGxjbHh1Wm5WdVkzUnBiMjRnZFhObFRXVnpjMkZuWlVOb1lXNXVaV3dvS1NCN1hHNGdJSFpoY2lCamFHRnVibVZzSUQwZ2JtVjNJRTFsYzNOaFoyVkRhR0Z1Ym1Wc0tDazdYRzRnSUdOb1lXNXVaV3d1Y0c5eWRERXViMjV0WlhOellXZGxJRDBnWm14MWMyZzdYRzRnSUhKbGRIVnliaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJR05vWVc1dVpXd3VjRzl5ZERJdWNHOXpkRTFsYzNOaFoyVW9NQ2s3WEc0Z0lIMDdYRzU5WEc1Y2JtWjFibU4wYVc5dUlIVnpaVk5sZEZScGJXVnZkWFFvS1NCN1hHNGdJQzh2SUZOMGIzSmxJSE5sZEZScGJXVnZkWFFnY21WbVpYSmxibU5sSUhOdklHVnpOaTF3Y205dGFYTmxJSGRwYkd3Z1ltVWdkVzVoWm1abFkzUmxaQ0JpZVZ4dUlDQXZMeUJ2ZEdobGNpQmpiMlJsSUcxdlpHbG1lV2x1WnlCelpYUlVhVzFsYjNWMElDaHNhV3RsSUhOcGJtOXVMblZ6WlVaaGEyVlVhVzFsY25Nb0tTbGNiaUFnZG1GeUlHZHNiMkpoYkZObGRGUnBiV1Z2ZFhRZ1BTQnpaWFJVYVcxbGIzVjBPMXh1SUNCeVpYUjFjbTRnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUJuYkc5aVlXeFRaWFJVYVcxbGIzVjBLR1pzZFhOb0xDQXhLVHRjYmlBZ2ZUdGNibjFjYmx4dWRtRnlJSEYxWlhWbElEMGdibVYzSUVGeWNtRjVLREV3TURBcE8xeHVablZ1WTNScGIyNGdabXgxYzJnb0tTQjdYRzRnSUdadmNpQW9kbUZ5SUdrZ1BTQXdPeUJwSUR3Z2JHVnVPeUJwSUNzOUlESXBJSHRjYmlBZ0lDQjJZWElnWTJGc2JHSmhZMnNnUFNCeGRXVjFaVnRwWFR0Y2JpQWdJQ0IyWVhJZ1lYSm5JRDBnY1hWbGRXVmJhU0FySURGZE8xeHVYRzRnSUNBZ1kyRnNiR0poWTJzb1lYSm5LVHRjYmx4dUlDQWdJSEYxWlhWbFcybGRJRDBnZFc1a1pXWnBibVZrTzF4dUlDQWdJSEYxWlhWbFcya2dLeUF4WFNBOUlIVnVaR1ZtYVc1bFpEdGNiaUFnZlZ4dVhHNGdJR3hsYmlBOUlEQTdYRzU5WEc1Y2JtWjFibU4wYVc5dUlHRjBkR1Z0Y0hSV1pYSjBlQ2dwSUh0Y2JpQWdkSEo1SUh0Y2JpQWdJQ0IyWVhJZ2NpQTlJSEpsY1hWcGNtVTdYRzRnSUNBZ2RtRnlJSFpsY25SNElEMGdjaWduZG1WeWRIZ25LVHRjYmlBZ0lDQjJaWEowZUU1bGVIUWdQU0IyWlhKMGVDNXlkVzVQYmt4dmIzQWdmSHdnZG1WeWRIZ3VjblZ1VDI1RGIyNTBaWGgwTzF4dUlDQWdJSEpsZEhWeWJpQjFjMlZXWlhKMGVGUnBiV1Z5S0NrN1hHNGdJSDBnWTJGMFkyZ2dLR1VwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkWE5sVTJWMFZHbHRaVzkxZENncE8xeHVJQ0I5WEc1OVhHNWNiblpoY2lCelkyaGxaSFZzWlVac2RYTm9JRDBnZFc1a1pXWnBibVZrTzF4dUx5OGdSR1ZqYVdSbElIZG9ZWFFnWVhONWJtTWdiV1YwYUc5a0lIUnZJSFZ6WlNCMGJ5QjBjbWxuWjJWeWFXNW5JSEJ5YjJObGMzTnBibWNnYjJZZ2NYVmxkV1ZrSUdOaGJHeGlZV05yY3pwY2JtbG1JQ2hwYzA1dlpHVXBJSHRjYmlBZ2MyTm9aV1IxYkdWR2JIVnphQ0E5SUhWelpVNWxlSFJVYVdOcktDazdYRzU5SUdWc2MyVWdhV1lnS0VKeWIzZHpaWEpOZFhSaGRHbHZiazlpYzJWeWRtVnlLU0I3WEc0Z0lITmphR1ZrZFd4bFJteDFjMmdnUFNCMWMyVk5kWFJoZEdsdmJrOWljMlZ5ZG1WeUtDazdYRzU5SUdWc2MyVWdhV1lnS0dselYyOXlhMlZ5S1NCN1hHNGdJSE5qYUdWa2RXeGxSbXgxYzJnZ1BTQjFjMlZOWlhOellXZGxRMmhoYm01bGJDZ3BPMXh1ZlNCbGJITmxJR2xtSUNoaWNtOTNjMlZ5VjJsdVpHOTNJRDA5UFNCMWJtUmxabWx1WldRZ0ppWWdkSGx3Wlc5bUlISmxjWFZwY21VZ1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdjMk5vWldSMWJHVkdiSFZ6YUNBOUlHRjBkR1Z0Y0hSV1pYSjBlQ2dwTzF4dWZTQmxiSE5sSUh0Y2JpQWdjMk5vWldSMWJHVkdiSFZ6YUNBOUlIVnpaVk5sZEZScGJXVnZkWFFvS1R0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnZEdobGJpaHZia1oxYkdacGJHeHRaVzUwTENCdmJsSmxhbVZqZEdsdmJpa2dlMXh1SUNCMllYSWdYMkZ5WjNWdFpXNTBjeUE5SUdGeVozVnRaVzUwY3p0Y2JseHVJQ0IyWVhJZ2NHRnlaVzUwSUQwZ2RHaHBjenRjYmx4dUlDQjJZWElnWTJocGJHUWdQU0J1WlhjZ2RHaHBjeTVqYjI1emRISjFZM1J2Y2lodWIyOXdLVHRjYmx4dUlDQnBaaUFvWTJocGJHUmJVRkpQVFVsVFJWOUpSRjBnUFQwOUlIVnVaR1ZtYVc1bFpDa2dlMXh1SUNBZ0lHMWhhMlZRY205dGFYTmxLR05vYVd4a0tUdGNiaUFnZlZ4dVhHNGdJSFpoY2lCZmMzUmhkR1VnUFNCd1lYSmxiblF1WDNOMFlYUmxPMXh1WEc0Z0lHbG1JQ2hmYzNSaGRHVXBJSHRjYmlBZ0lDQW9ablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnZG1GeUlHTmhiR3hpWVdOcklEMGdYMkZ5WjNWdFpXNTBjMXRmYzNSaGRHVWdMU0F4WFR0Y2JpQWdJQ0FnSUdGellYQW9ablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYVc1MmIydGxRMkZzYkdKaFkyc29YM04wWVhSbExDQmphR2xzWkN3Z1kyRnNiR0poWTJzc0lIQmhjbVZ1ZEM1ZmNtVnpkV3gwS1R0Y2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwcEtDazdYRzRnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdjM1ZpYzJOeWFXSmxLSEJoY21WdWRDd2dZMmhwYkdRc0lHOXVSblZzWm1sc2JHMWxiblFzSUc5dVVtVnFaV04wYVc5dUtUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQmphR2xzWkR0Y2JuMWNibHh1THlvcVhHNGdJR0JRY205dGFYTmxMbkpsYzI5c2RtVmdJSEpsZEhWeWJuTWdZU0J3Y205dGFYTmxJSFJvWVhRZ2QybHNiQ0JpWldOdmJXVWdjbVZ6YjJ4MlpXUWdkMmwwYUNCMGFHVmNiaUFnY0dGemMyVmtJR0IyWVd4MVpXQXVJRWwwSUdseklITm9iM0owYUdGdVpDQm1iM0lnZEdobElHWnZiR3h2ZDJsdVp6cGNibHh1SUNCZ1lHQnFZWFpoYzJOeWFYQjBYRzRnSUd4bGRDQndjbTl0YVhObElEMGdibVYzSUZCeWIyMXBjMlVvWm5WdVkzUnBiMjRvY21WemIyeDJaU3dnY21WcVpXTjBLWHRjYmlBZ0lDQnlaWE52YkhabEtERXBPMXh1SUNCOUtUdGNibHh1SUNCd2NtOXRhWE5sTG5Sb1pXNG9ablZ1WTNScGIyNG9kbUZzZFdVcGUxeHVJQ0FnSUM4dklIWmhiSFZsSUQwOVBTQXhYRzRnSUgwcE8xeHVJQ0JnWUdCY2JseHVJQ0JKYm5OMFpXRmtJRzltSUhkeWFYUnBibWNnZEdobElHRmliM1psTENCNWIzVnlJR052WkdVZ2JtOTNJSE5wYlhCc2VTQmlaV052YldWeklIUm9aU0JtYjJ4c2IzZHBibWM2WEc1Y2JpQWdZR0JnYW1GMllYTmpjbWx3ZEZ4dUlDQnNaWFFnY0hKdmJXbHpaU0E5SUZCeWIyMXBjMlV1Y21WemIyeDJaU2d4S1R0Y2JseHVJQ0J3Y205dGFYTmxMblJvWlc0b1puVnVZM1JwYjI0b2RtRnNkV1VwZTF4dUlDQWdJQzh2SUhaaGJIVmxJRDA5UFNBeFhHNGdJSDBwTzF4dUlDQmdZR0JjYmx4dUlDQkFiV1YwYUc5a0lISmxjMjlzZG1WY2JpQWdRSE4wWVhScFkxeHVJQ0JBY0dGeVlXMGdlMEZ1ZVgwZ2RtRnNkV1VnZG1Gc2RXVWdkR2hoZENCMGFHVWdjbVYwZFhKdVpXUWdjSEp2YldselpTQjNhV3hzSUdKbElISmxjMjlzZG1Wa0lIZHBkR2hjYmlBZ1ZYTmxablZzSUdadmNpQjBiMjlzYVc1bkxseHVJQ0JBY21WMGRYSnVJSHRRY205dGFYTmxmU0JoSUhCeWIyMXBjMlVnZEdoaGRDQjNhV3hzSUdKbFkyOXRaU0JtZFd4bWFXeHNaV1FnZDJsMGFDQjBhR1VnWjJsMlpXNWNiaUFnWUhaaGJIVmxZRnh1S2k5Y2JtWjFibU4wYVc5dUlISmxjMjlzZG1Vb2IySnFaV04wS1NCN1hHNGdJQzhxYW5Ob2FXNTBJSFpoYkdsa2RHaHBjenAwY25WbElDb3ZYRzRnSUhaaGNpQkRiMjV6ZEhKMVkzUnZjaUE5SUhSb2FYTTdYRzVjYmlBZ2FXWWdLRzlpYW1WamRDQW1KaUIwZVhCbGIyWWdiMkpxWldOMElEMDlQU0FuYjJKcVpXTjBKeUFtSmlCdlltcGxZM1F1WTI5dWMzUnlkV04wYjNJZ1BUMDlJRU52Ym5OMGNuVmpkRzl5S1NCN1hHNGdJQ0FnY21WMGRYSnVJRzlpYW1WamREdGNiaUFnZlZ4dVhHNGdJSFpoY2lCd2NtOXRhWE5sSUQwZ2JtVjNJRU52Ym5OMGNuVmpkRzl5S0c1dmIzQXBPMXh1SUNCZmNtVnpiMngyWlNod2NtOXRhWE5sTENCdlltcGxZM1FwTzF4dUlDQnlaWFIxY200Z2NISnZiV2x6WlR0Y2JuMWNibHh1ZG1GeUlGQlNUMDFKVTBWZlNVUWdQU0JOWVhSb0xuSmhibVJ2YlNncExuUnZVM1J5YVc1bktETTJLUzV6ZFdKemRISnBibWNvTVRZcE8xeHVYRzVtZFc1amRHbHZiaUJ1YjI5d0tDa2dlMzFjYmx4dWRtRnlJRkJGVGtSSlRrY2dQU0IyYjJsa0lEQTdYRzUyWVhJZ1JsVk1Sa2xNVEVWRUlEMGdNVHRjYm5aaGNpQlNSVXBGUTFSRlJDQTlJREk3WEc1Y2JuWmhjaUJIUlZSZlZFaEZUbDlGVWxKUFVpQTlJRzVsZHlCRmNuSnZjazlpYW1WamRDZ3BPMXh1WEc1bWRXNWpkR2x2YmlCelpXeG1SblZzWm1sc2JHMWxiblFvS1NCN1hHNGdJSEpsZEhWeWJpQnVaWGNnVkhsd1pVVnljbTl5S0Z3aVdXOTFJR05oYm01dmRDQnlaWE52YkhabElHRWdjSEp2YldselpTQjNhWFJvSUdsMGMyVnNabHdpS1R0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnWTJGdWJtOTBVbVYwZFhKdVQzZHVLQ2tnZTF4dUlDQnlaWFIxY200Z2JtVjNJRlI1Y0dWRmNuSnZjaWduUVNCd2NtOXRhWE5sY3lCallXeHNZbUZqYXlCallXNXViM1FnY21WMGRYSnVJSFJvWVhRZ2MyRnRaU0J3Y205dGFYTmxMaWNwTzF4dWZWeHVYRzVtZFc1amRHbHZiaUJuWlhSVWFHVnVLSEJ5YjIxcGMyVXBJSHRjYmlBZ2RISjVJSHRjYmlBZ0lDQnlaWFIxY200Z2NISnZiV2x6WlM1MGFHVnVPMXh1SUNCOUlHTmhkR05vSUNobGNuSnZjaWtnZTF4dUlDQWdJRWRGVkY5VVNFVk9YMFZTVWs5U0xtVnljbTl5SUQwZ1pYSnliM0k3WEc0Z0lDQWdjbVYwZFhKdUlFZEZWRjlVU0VWT1gwVlNVazlTTzF4dUlDQjlYRzU5WEc1Y2JtWjFibU4wYVc5dUlIUnllVlJvWlc0b2RHaGxiaXdnZG1Gc2RXVXNJR1oxYkdacGJHeHRaVzUwU0dGdVpHeGxjaXdnY21WcVpXTjBhVzl1U0dGdVpHeGxjaWtnZTF4dUlDQjBjbmtnZTF4dUlDQWdJSFJvWlc0dVkyRnNiQ2gyWVd4MVpTd2dablZzWm1sc2JHMWxiblJJWVc1a2JHVnlMQ0J5WldwbFkzUnBiMjVJWVc1a2JHVnlLVHRjYmlBZ2ZTQmpZWFJqYUNBb1pTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCbE8xeHVJQ0I5WEc1OVhHNWNibVoxYm1OMGFXOXVJR2hoYm1Sc1pVWnZjbVZwWjI1VWFHVnVZV0pzWlNod2NtOXRhWE5sTENCMGFHVnVZV0pzWlN3Z2RHaGxiaWtnZTF4dUlDQmhjMkZ3S0daMWJtTjBhVzl1SUNod2NtOXRhWE5sS1NCN1hHNGdJQ0FnZG1GeUlITmxZV3hsWkNBOUlHWmhiSE5sTzF4dUlDQWdJSFpoY2lCbGNuSnZjaUE5SUhSeWVWUm9aVzRvZEdobGJpd2dkR2hsYm1GaWJHVXNJR1oxYm1OMGFXOXVJQ2gyWVd4MVpTa2dlMXh1SUNBZ0lDQWdhV1lnS0hObFlXeGxaQ2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTQ3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0J6WldGc1pXUWdQU0IwY25WbE8xeHVJQ0FnSUNBZ2FXWWdLSFJvWlc1aFlteGxJQ0U5UFNCMllXeDFaU2tnZTF4dUlDQWdJQ0FnSUNCZmNtVnpiMngyWlNod2NtOXRhWE5sTENCMllXeDFaU2s3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0JtZFd4bWFXeHNLSEJ5YjIxcGMyVXNJSFpoYkhWbEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUxDQm1kVzVqZEdsdmJpQW9jbVZoYzI5dUtTQjdYRzRnSUNBZ0lDQnBaaUFvYzJWaGJHVmtLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJSE5sWVd4bFpDQTlJSFJ5ZFdVN1hHNWNiaUFnSUNBZ0lGOXlaV3BsWTNRb2NISnZiV2x6WlN3Z2NtVmhjMjl1S1R0Y2JpQWdJQ0I5TENBblUyVjBkR3hsT2lBbklDc2dLSEJ5YjIxcGMyVXVYMnhoWW1Wc0lIeDhJQ2NnZFc1cmJtOTNiaUJ3Y205dGFYTmxKeWtwTzF4dVhHNGdJQ0FnYVdZZ0tDRnpaV0ZzWldRZ0ppWWdaWEp5YjNJcElIdGNiaUFnSUNBZ0lITmxZV3hsWkNBOUlIUnlkV1U3WEc0Z0lDQWdJQ0JmY21WcVpXTjBLSEJ5YjIxcGMyVXNJR1Z5Y205eUtUdGNiaUFnSUNCOVhHNGdJSDBzSUhCeWIyMXBjMlVwTzF4dWZWeHVYRzVtZFc1amRHbHZiaUJvWVc1a2JHVlBkMjVVYUdWdVlXSnNaU2h3Y205dGFYTmxMQ0IwYUdWdVlXSnNaU2tnZTF4dUlDQnBaaUFvZEdobGJtRmliR1V1WDNOMFlYUmxJRDA5UFNCR1ZVeEdTVXhNUlVRcElIdGNiaUFnSUNCbWRXeG1hV3hzS0hCeWIyMXBjMlVzSUhSb1pXNWhZbXhsTGw5eVpYTjFiSFFwTzF4dUlDQjlJR1ZzYzJVZ2FXWWdLSFJvWlc1aFlteGxMbDl6ZEdGMFpTQTlQVDBnVWtWS1JVTlVSVVFwSUh0Y2JpQWdJQ0JmY21WcVpXTjBLSEJ5YjIxcGMyVXNJSFJvWlc1aFlteGxMbDl5WlhOMWJIUXBPMXh1SUNCOUlHVnNjMlVnZTF4dUlDQWdJSE4xWW5OamNtbGlaU2gwYUdWdVlXSnNaU3dnZFc1a1pXWnBibVZrTENCbWRXNWpkR2x2YmlBb2RtRnNkV1VwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJmY21WemIyeDJaU2h3Y205dGFYTmxMQ0IyWVd4MVpTazdYRzRnSUNBZ2ZTd2dablZ1WTNScGIyNGdLSEpsWVhOdmJpa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlGOXlaV3BsWTNRb2NISnZiV2x6WlN3Z2NtVmhjMjl1S1R0Y2JpQWdJQ0I5S1R0Y2JpQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQm9ZVzVrYkdWTllYbGlaVlJvWlc1aFlteGxLSEJ5YjIxcGMyVXNJRzFoZVdKbFZHaGxibUZpYkdVc0lIUm9aVzRrSkNrZ2UxeHVJQ0JwWmlBb2JXRjVZbVZVYUdWdVlXSnNaUzVqYjI1emRISjFZM1J2Y2lBOVBUMGdjSEp2YldselpTNWpiMjV6ZEhKMVkzUnZjaUFtSmlCMGFHVnVKQ1FnUFQwOUlIUm9aVzRnSmlZZ2JXRjVZbVZVYUdWdVlXSnNaUzVqYjI1emRISjFZM1J2Y2k1eVpYTnZiSFpsSUQwOVBTQnlaWE52YkhabEtTQjdYRzRnSUNBZ2FHRnVaR3hsVDNkdVZHaGxibUZpYkdVb2NISnZiV2x6WlN3Z2JXRjVZbVZVYUdWdVlXSnNaU2s3WEc0Z0lIMGdaV3h6WlNCN1hHNGdJQ0FnYVdZZ0tIUm9aVzRrSkNBOVBUMGdSMFZVWDFSSVJVNWZSVkpTVDFJcElIdGNiaUFnSUNBZ0lGOXlaV3BsWTNRb2NISnZiV2x6WlN3Z1IwVlVYMVJJUlU1ZlJWSlNUMUl1WlhKeWIzSXBPMXh1SUNBZ0lIMGdaV3h6WlNCcFppQW9kR2hsYmlRa0lEMDlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUdaMWJHWnBiR3dvY0hKdmJXbHpaU3dnYldGNVltVlVhR1Z1WVdKc1pTazdYRzRnSUNBZ2ZTQmxiSE5sSUdsbUlDaHBjMFoxYm1OMGFXOXVLSFJvWlc0a0pDa3BJSHRjYmlBZ0lDQWdJR2hoYm1Sc1pVWnZjbVZwWjI1VWFHVnVZV0pzWlNod2NtOXRhWE5sTENCdFlYbGlaVlJvWlc1aFlteGxMQ0IwYUdWdUpDUXBPMXh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCbWRXeG1hV3hzS0hCeWIyMXBjMlVzSUcxaGVXSmxWR2hsYm1GaWJHVXBPMXh1SUNBZ0lIMWNiaUFnZlZ4dWZWeHVYRzVtZFc1amRHbHZiaUJmY21WemIyeDJaU2h3Y205dGFYTmxMQ0IyWVd4MVpTa2dlMXh1SUNCcFppQW9jSEp2YldselpTQTlQVDBnZG1Gc2RXVXBJSHRjYmlBZ0lDQmZjbVZxWldOMEtIQnliMjFwYzJVc0lITmxiR1pHZFd4bWFXeHNiV1Z1ZENncEtUdGNiaUFnZlNCbGJITmxJR2xtSUNodlltcGxZM1JQY2taMWJtTjBhVzl1S0haaGJIVmxLU2tnZTF4dUlDQWdJR2hoYm1Sc1pVMWhlV0psVkdobGJtRmliR1VvY0hKdmJXbHpaU3dnZG1Gc2RXVXNJR2RsZEZSb1pXNG9kbUZzZFdVcEtUdGNiaUFnZlNCbGJITmxJSHRjYmlBZ0lDQm1kV3htYVd4c0tIQnliMjFwYzJVc0lIWmhiSFZsS1R0Y2JpQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQndkV0pzYVhOb1VtVnFaV04wYVc5dUtIQnliMjFwYzJVcElIdGNiaUFnYVdZZ0tIQnliMjFwYzJVdVgyOXVaWEp5YjNJcElIdGNiaUFnSUNCd2NtOXRhWE5sTGw5dmJtVnljbTl5S0hCeWIyMXBjMlV1WDNKbGMzVnNkQ2s3WEc0Z0lIMWNibHh1SUNCd2RXSnNhWE5vS0hCeWIyMXBjMlVwTzF4dWZWeHVYRzVtZFc1amRHbHZiaUJtZFd4bWFXeHNLSEJ5YjIxcGMyVXNJSFpoYkhWbEtTQjdYRzRnSUdsbUlDaHdjbTl0YVhObExsOXpkR0YwWlNBaFBUMGdVRVZPUkVsT1J5a2dlMXh1SUNBZ0lISmxkSFZ5Ymp0Y2JpQWdmVnh1WEc0Z0lIQnliMjFwYzJVdVgzSmxjM1ZzZENBOUlIWmhiSFZsTzF4dUlDQndjbTl0YVhObExsOXpkR0YwWlNBOUlFWlZURVpKVEV4RlJEdGNibHh1SUNCcFppQW9jSEp2YldselpTNWZjM1ZpYzJOeWFXSmxjbk11YkdWdVozUm9JQ0U5UFNBd0tTQjdYRzRnSUNBZ1lYTmhjQ2h3ZFdKc2FYTm9MQ0J3Y205dGFYTmxLVHRjYmlBZ2ZWeHVmVnh1WEc1bWRXNWpkR2x2YmlCZmNtVnFaV04wS0hCeWIyMXBjMlVzSUhKbFlYTnZiaWtnZTF4dUlDQnBaaUFvY0hKdmJXbHpaUzVmYzNSaGRHVWdJVDA5SUZCRlRrUkpUa2NwSUh0Y2JpQWdJQ0J5WlhSMWNtNDdYRzRnSUgxY2JpQWdjSEp2YldselpTNWZjM1JoZEdVZ1BTQlNSVXBGUTFSRlJEdGNiaUFnY0hKdmJXbHpaUzVmY21WemRXeDBJRDBnY21WaGMyOXVPMXh1WEc0Z0lHRnpZWEFvY0hWaWJHbHphRkpsYW1WamRHbHZiaXdnY0hKdmJXbHpaU2s3WEc1OVhHNWNibVoxYm1OMGFXOXVJSE4xWW5OamNtbGlaU2h3WVhKbGJuUXNJR05vYVd4a0xDQnZia1oxYkdacGJHeHRaVzUwTENCdmJsSmxhbVZqZEdsdmJpa2dlMXh1SUNCMllYSWdYM04xWW5OamNtbGlaWEp6SUQwZ2NHRnlaVzUwTGw5emRXSnpZM0pwWW1WeWN6dGNiaUFnZG1GeUlHeGxibWQwYUNBOUlGOXpkV0p6WTNKcFltVnljeTVzWlc1bmRHZzdYRzVjYmlBZ2NHRnlaVzUwTGw5dmJtVnljbTl5SUQwZ2JuVnNiRHRjYmx4dUlDQmZjM1ZpYzJOeWFXSmxjbk5iYkdWdVozUm9YU0E5SUdOb2FXeGtPMXh1SUNCZmMzVmljMk55YVdKbGNuTmJiR1Z1WjNSb0lDc2dSbFZNUmtsTVRFVkVYU0E5SUc5dVJuVnNabWxzYkcxbGJuUTdYRzRnSUY5emRXSnpZM0pwWW1WeWMxdHNaVzVuZEdnZ0t5QlNSVXBGUTFSRlJGMGdQU0J2YmxKbGFtVmpkR2x2Ymp0Y2JseHVJQ0JwWmlBb2JHVnVaM1JvSUQwOVBTQXdJQ1ltSUhCaGNtVnVkQzVmYzNSaGRHVXBJSHRjYmlBZ0lDQmhjMkZ3S0hCMVlteHBjMmdzSUhCaGNtVnVkQ2s3WEc0Z0lIMWNibjFjYmx4dVpuVnVZM1JwYjI0Z2NIVmliR2x6YUNod2NtOXRhWE5sS1NCN1hHNGdJSFpoY2lCemRXSnpZM0pwWW1WeWN5QTlJSEJ5YjIxcGMyVXVYM04xWW5OamNtbGlaWEp6TzF4dUlDQjJZWElnYzJWMGRHeGxaQ0E5SUhCeWIyMXBjMlV1WDNOMFlYUmxPMXh1WEc0Z0lHbG1JQ2h6ZFdKelkzSnBZbVZ5Y3k1c1pXNW5kR2dnUFQwOUlEQXBJSHRjYmlBZ0lDQnlaWFIxY200N1hHNGdJSDFjYmx4dUlDQjJZWElnWTJocGJHUWdQU0IxYm1SbFptbHVaV1FzWEc0Z0lDQWdJQ0JqWVd4c1ltRmpheUE5SUhWdVpHVm1hVzVsWkN4Y2JpQWdJQ0FnSUdSbGRHRnBiQ0E5SUhCeWIyMXBjMlV1WDNKbGMzVnNkRHRjYmx4dUlDQm1iM0lnS0haaGNpQnBJRDBnTURzZ2FTQThJSE4xWW5OamNtbGlaWEp6TG14bGJtZDBhRHNnYVNBclBTQXpLU0I3WEc0Z0lDQWdZMmhwYkdRZ1BTQnpkV0p6WTNKcFltVnljMXRwWFR0Y2JpQWdJQ0JqWVd4c1ltRmpheUE5SUhOMVluTmpjbWxpWlhKelcya2dLeUJ6WlhSMGJHVmtYVHRjYmx4dUlDQWdJR2xtSUNoamFHbHNaQ2tnZTF4dUlDQWdJQ0FnYVc1MmIydGxRMkZzYkdKaFkyc29jMlYwZEd4bFpDd2dZMmhwYkdRc0lHTmhiR3hpWVdOckxDQmtaWFJoYVd3cE8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0JqWVd4c1ltRmpheWhrWlhSaGFXd3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEJ5YjIxcGMyVXVYM04xWW5OamNtbGlaWEp6TG14bGJtZDBhQ0E5SURBN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUVWeWNtOXlUMkpxWldOMEtDa2dlMXh1SUNCMGFHbHpMbVZ5Y205eUlEMGdiblZzYkR0Y2JuMWNibHh1ZG1GeUlGUlNXVjlEUVZSRFNGOUZVbEpQVWlBOUlHNWxkeUJGY25KdmNrOWlhbVZqZENncE8xeHVYRzVtZFc1amRHbHZiaUIwY25sRFlYUmphQ2hqWVd4c1ltRmpheXdnWkdWMFlXbHNLU0I3WEc0Z0lIUnllU0I3WEc0Z0lDQWdjbVYwZFhKdUlHTmhiR3hpWVdOcktHUmxkR0ZwYkNrN1hHNGdJSDBnWTJGMFkyZ2dLR1VwSUh0Y2JpQWdJQ0JVVWxsZlEwRlVRMGhmUlZKU1QxSXVaWEp5YjNJZ1BTQmxPMXh1SUNBZ0lISmxkSFZ5YmlCVVVsbGZRMEZVUTBoZlJWSlNUMUk3WEc0Z0lIMWNibjFjYmx4dVpuVnVZM1JwYjI0Z2FXNTJiMnRsUTJGc2JHSmhZMnNvYzJWMGRHeGxaQ3dnY0hKdmJXbHpaU3dnWTJGc2JHSmhZMnNzSUdSbGRHRnBiQ2tnZTF4dUlDQjJZWElnYUdGelEyRnNiR0poWTJzZ1BTQnBjMFoxYm1OMGFXOXVLR05oYkd4aVlXTnJLU3hjYmlBZ0lDQWdJSFpoYkhWbElEMGdkVzVrWldacGJtVmtMRnh1SUNBZ0lDQWdaWEp5YjNJZ1BTQjFibVJsWm1sdVpXUXNYRzRnSUNBZ0lDQnpkV05qWldWa1pXUWdQU0IxYm1SbFptbHVaV1FzWEc0Z0lDQWdJQ0JtWVdsc1pXUWdQU0IxYm1SbFptbHVaV1E3WEc1Y2JpQWdhV1lnS0doaGMwTmhiR3hpWVdOcktTQjdYRzRnSUNBZ2RtRnNkV1VnUFNCMGNubERZWFJqYUNoallXeHNZbUZqYXl3Z1pHVjBZV2xzS1R0Y2JseHVJQ0FnSUdsbUlDaDJZV3gxWlNBOVBUMGdWRkpaWDBOQlZFTklYMFZTVWs5U0tTQjdYRzRnSUNBZ0lDQm1ZV2xzWldRZ1BTQjBjblZsTzF4dUlDQWdJQ0FnWlhKeWIzSWdQU0IyWVd4MVpTNWxjbkp2Y2p0Y2JpQWdJQ0FnSUhaaGJIVmxJRDBnYm5Wc2JEdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnYzNWalkyVmxaR1ZrSUQwZ2RISjFaVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvY0hKdmJXbHpaU0E5UFQwZ2RtRnNkV1VwSUh0Y2JpQWdJQ0FnSUY5eVpXcGxZM1FvY0hKdmJXbHpaU3dnWTJGdWJtOTBVbVYwZFhKdVQzZHVLQ2twTzF4dUlDQWdJQ0FnY21WMGRYSnVPMXh1SUNBZ0lIMWNiaUFnZlNCbGJITmxJSHRjYmlBZ0lDQjJZV3gxWlNBOUlHUmxkR0ZwYkR0Y2JpQWdJQ0J6ZFdOalpXVmtaV1FnUFNCMGNuVmxPMXh1SUNCOVhHNWNiaUFnYVdZZ0tIQnliMjFwYzJVdVgzTjBZWFJsSUNFOVBTQlFSVTVFU1U1SEtTQjdYRzRnSUNBZ0x5OGdibTl2Y0Z4dUlDQjlJR1ZzYzJVZ2FXWWdLR2hoYzBOaGJHeGlZV05ySUNZbUlITjFZMk5sWldSbFpDa2dlMXh1SUNBZ0lDQWdYM0psYzI5c2RtVW9jSEp2YldselpTd2dkbUZzZFdVcE8xeHVJQ0FnSUgwZ1pXeHpaU0JwWmlBb1ptRnBiR1ZrS1NCN1hHNGdJQ0FnSUNCZmNtVnFaV04wS0hCeWIyMXBjMlVzSUdWeWNtOXlLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2FXWWdLSE5sZEhSc1pXUWdQVDA5SUVaVlRFWkpURXhGUkNrZ2UxeHVJQ0FnSUNBZ1puVnNabWxzYkNod2NtOXRhWE5sTENCMllXeDFaU2s3WEc0Z0lDQWdmU0JsYkhObElHbG1JQ2h6WlhSMGJHVmtJRDA5UFNCU1JVcEZRMVJGUkNrZ2UxeHVJQ0FnSUNBZ1gzSmxhbVZqZENod2NtOXRhWE5sTENCMllXeDFaU2s3WEc0Z0lDQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQnBibWwwYVdGc2FYcGxVSEp2YldselpTaHdjbTl0YVhObExDQnlaWE52YkhabGNpa2dlMXh1SUNCMGNua2dlMXh1SUNBZ0lISmxjMjlzZG1WeUtHWjFibU4wYVc5dUlISmxjMjlzZG1WUWNtOXRhWE5sS0haaGJIVmxLU0I3WEc0Z0lDQWdJQ0JmY21WemIyeDJaU2h3Y205dGFYTmxMQ0IyWVd4MVpTazdYRzRnSUNBZ2ZTd2dablZ1WTNScGIyNGdjbVZxWldOMFVISnZiV2x6WlNoeVpXRnpiMjRwSUh0Y2JpQWdJQ0FnSUY5eVpXcGxZM1FvY0hKdmJXbHpaU3dnY21WaGMyOXVLVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZTQmpZWFJqYUNBb1pTa2dlMXh1SUNBZ0lGOXlaV3BsWTNRb2NISnZiV2x6WlN3Z1pTazdYRzRnSUgxY2JuMWNibHh1ZG1GeUlHbGtJRDBnTUR0Y2JtWjFibU4wYVc5dUlHNWxlSFJKWkNncElIdGNiaUFnY21WMGRYSnVJR2xrS3lzN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUcxaGEyVlFjbTl0YVhObEtIQnliMjFwYzJVcElIdGNiaUFnY0hKdmJXbHpaVnRRVWs5TlNWTkZYMGxFWFNBOUlHbGtLeXM3WEc0Z0lIQnliMjFwYzJVdVgzTjBZWFJsSUQwZ2RXNWtaV1pwYm1Wa08xeHVJQ0J3Y205dGFYTmxMbDl5WlhOMWJIUWdQU0IxYm1SbFptbHVaV1E3WEc0Z0lIQnliMjFwYzJVdVgzTjFZbk5qY21saVpYSnpJRDBnVzEwN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUVWdWRXMWxjbUYwYjNJb1EyOXVjM1J5ZFdOMGIzSXNJR2x1Y0hWMEtTQjdYRzRnSUhSb2FYTXVYMmx1YzNSaGJtTmxRMjl1YzNSeWRXTjBiM0lnUFNCRGIyNXpkSEoxWTNSdmNqdGNiaUFnZEdocGN5NXdjbTl0YVhObElEMGdibVYzSUVOdmJuTjBjblZqZEc5eUtHNXZiM0FwTzF4dVhHNGdJR2xtSUNnaGRHaHBjeTV3Y205dGFYTmxXMUJTVDAxSlUwVmZTVVJkS1NCN1hHNGdJQ0FnYldGclpWQnliMjFwYzJVb2RHaHBjeTV3Y205dGFYTmxLVHRjYmlBZ2ZWeHVYRzRnSUdsbUlDaHBjMEZ5Y21GNUtHbHVjSFYwS1NrZ2UxeHVJQ0FnSUhSb2FYTXVYMmx1Y0hWMElEMGdhVzV3ZFhRN1hHNGdJQ0FnZEdocGN5NXNaVzVuZEdnZ1BTQnBibkIxZEM1c1pXNW5kR2c3WEc0Z0lDQWdkR2hwY3k1ZmNtVnRZV2x1YVc1bklEMGdhVzV3ZFhRdWJHVnVaM1JvTzF4dVhHNGdJQ0FnZEdocGN5NWZjbVZ6ZFd4MElEMGdibVYzSUVGeWNtRjVLSFJvYVhNdWJHVnVaM1JvS1R0Y2JseHVJQ0FnSUdsbUlDaDBhR2x6TG14bGJtZDBhQ0E5UFQwZ01Da2dlMXh1SUNBZ0lDQWdablZzWm1sc2JDaDBhR2x6TG5CeWIyMXBjMlVzSUhSb2FYTXVYM0psYzNWc2RDazdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhSb2FYTXViR1Z1WjNSb0lEMGdkR2hwY3k1c1pXNW5kR2dnZkh3Z01EdGNiaUFnSUNBZ0lIUm9hWE11WDJWdWRXMWxjbUYwWlNncE8xeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVgzSmxiV0ZwYm1sdVp5QTlQVDBnTUNrZ2UxeHVJQ0FnSUNBZ0lDQm1kV3htYVd4c0tIUm9hWE11Y0hKdmJXbHpaU3dnZEdocGN5NWZjbVZ6ZFd4MEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNGdJSDBnWld4elpTQjdYRzRnSUNBZ1gzSmxhbVZqZENoMGFHbHpMbkJ5YjIxcGMyVXNJSFpoYkdsa1lYUnBiMjVGY25KdmNpZ3BLVHRjYmlBZ2ZWeHVmVnh1WEc1bWRXNWpkR2x2YmlCMllXeHBaR0YwYVc5dVJYSnliM0lvS1NCN1hHNGdJSEpsZEhWeWJpQnVaWGNnUlhKeWIzSW9KMEZ5Y21GNUlFMWxkR2h2WkhNZ2JYVnpkQ0JpWlNCd2NtOTJhV1JsWkNCaGJpQkJjbkpoZVNjcE8xeHVmVHRjYmx4dVJXNTFiV1Z5WVhSdmNpNXdjbTkwYjNSNWNHVXVYMlZ1ZFcxbGNtRjBaU0E5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnZG1GeUlHeGxibWQwYUNBOUlIUm9hWE11YkdWdVozUm9PMXh1SUNCMllYSWdYMmx1Y0hWMElEMGdkR2hwY3k1ZmFXNXdkWFE3WEc1Y2JpQWdabTl5SUNoMllYSWdhU0E5SURBN0lIUm9hWE11WDNOMFlYUmxJRDA5UFNCUVJVNUVTVTVISUNZbUlHa2dQQ0JzWlc1bmRHZzdJR2tyS3lrZ2UxeHVJQ0FnSUhSb2FYTXVYMlZoWTJoRmJuUnllU2hmYVc1d2RYUmJhVjBzSUdrcE8xeHVJQ0I5WEc1OU8xeHVYRzVGYm5WdFpYSmhkRzl5TG5CeWIzUnZkSGx3WlM1ZlpXRmphRVZ1ZEhKNUlEMGdablZ1WTNScGIyNGdLR1Z1ZEhKNUxDQnBLU0I3WEc0Z0lIWmhjaUJqSUQwZ2RHaHBjeTVmYVc1emRHRnVZMlZEYjI1emRISjFZM1J2Y2p0Y2JpQWdkbUZ5SUhKbGMyOXNkbVVrSkNBOUlHTXVjbVZ6YjJ4MlpUdGNibHh1SUNCcFppQW9jbVZ6YjJ4MlpTUWtJRDA5UFNCeVpYTnZiSFpsS1NCN1hHNGdJQ0FnZG1GeUlGOTBhR1Z1SUQwZ1oyVjBWR2hsYmlobGJuUnllU2s3WEc1Y2JpQWdJQ0JwWmlBb1gzUm9aVzRnUFQwOUlIUm9aVzRnSmlZZ1pXNTBjbmt1WDNOMFlYUmxJQ0U5UFNCUVJVNUVTVTVIS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbDl6WlhSMGJHVmtRWFFvWlc1MGNua3VYM04wWVhSbExDQnBMQ0JsYm5SeWVTNWZjbVZ6ZFd4MEtUdGNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tIUjVjR1Z2WmlCZmRHaGxiaUFoUFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lDQWdkR2hwY3k1ZmNtVnRZV2x1YVc1bkxTMDdYRzRnSUNBZ0lDQjBhR2x6TGw5eVpYTjFiSFJiYVYwZ1BTQmxiblJ5ZVR0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0dNZ1BUMDlJRkJ5YjIxcGMyVXBJSHRjYmlBZ0lDQWdJSFpoY2lCd2NtOXRhWE5sSUQwZ2JtVjNJR01vYm05dmNDazdYRzRnSUNBZ0lDQm9ZVzVrYkdWTllYbGlaVlJvWlc1aFlteGxLSEJ5YjIxcGMyVXNJR1Z1ZEhKNUxDQmZkR2hsYmlrN1hHNGdJQ0FnSUNCMGFHbHpMbDkzYVd4c1UyVjBkR3hsUVhRb2NISnZiV2x6WlN3Z2FTazdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYM2RwYkd4VFpYUjBiR1ZCZENodVpYY2dZeWhtZFc1amRHbHZiaUFvY21WemIyeDJaU1FrS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCeVpYTnZiSFpsSkNRb1pXNTBjbmtwTzF4dUlDQWdJQ0FnZlNrc0lHa3BPMXh1SUNBZ0lIMWNiaUFnZlNCbGJITmxJSHRjYmlBZ0lDQjBhR2x6TGw5M2FXeHNVMlYwZEd4bFFYUW9jbVZ6YjJ4MlpTUWtLR1Z1ZEhKNUtTd2dhU2s3WEc0Z0lIMWNibjA3WEc1Y2JrVnVkVzFsY21GMGIzSXVjSEp2ZEc5MGVYQmxMbDl6WlhSMGJHVmtRWFFnUFNCbWRXNWpkR2x2YmlBb2MzUmhkR1VzSUdrc0lIWmhiSFZsS1NCN1hHNGdJSFpoY2lCd2NtOXRhWE5sSUQwZ2RHaHBjeTV3Y205dGFYTmxPMXh1WEc0Z0lHbG1JQ2h3Y205dGFYTmxMbDl6ZEdGMFpTQTlQVDBnVUVWT1JFbE9SeWtnZTF4dUlDQWdJSFJvYVhNdVgzSmxiV0ZwYm1sdVp5MHRPMXh1WEc0Z0lDQWdhV1lnS0hOMFlYUmxJRDA5UFNCU1JVcEZRMVJGUkNrZ2UxeHVJQ0FnSUNBZ1gzSmxhbVZqZENod2NtOXRhWE5sTENCMllXeDFaU2s3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lIUm9hWE11WDNKbGMzVnNkRnRwWFNBOUlIWmhiSFZsTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUdsbUlDaDBhR2x6TGw5eVpXMWhhVzVwYm1jZ1BUMDlJREFwSUh0Y2JpQWdJQ0JtZFd4bWFXeHNLSEJ5YjIxcGMyVXNJSFJvYVhNdVgzSmxjM1ZzZENrN1hHNGdJSDFjYm4wN1hHNWNia1Z1ZFcxbGNtRjBiM0l1Y0hKdmRHOTBlWEJsTGw5M2FXeHNVMlYwZEd4bFFYUWdQU0JtZFc1amRHbHZiaUFvY0hKdmJXbHpaU3dnYVNrZ2UxeHVJQ0IyWVhJZ1pXNTFiV1Z5WVhSdmNpQTlJSFJvYVhNN1hHNWNiaUFnYzNWaWMyTnlhV0psS0hCeWIyMXBjMlVzSUhWdVpHVm1hVzVsWkN3Z1puVnVZM1JwYjI0Z0tIWmhiSFZsS1NCN1hHNGdJQ0FnY21WMGRYSnVJR1Z1ZFcxbGNtRjBiM0l1WDNObGRIUnNaV1JCZENoR1ZVeEdTVXhNUlVRc0lHa3NJSFpoYkhWbEtUdGNiaUFnZlN3Z1puVnVZM1JwYjI0Z0tISmxZWE52YmlrZ2UxeHVJQ0FnSUhKbGRIVnliaUJsYm5WdFpYSmhkRzl5TGw5elpYUjBiR1ZrUVhRb1VrVktSVU5VUlVRc0lHa3NJSEpsWVhOdmJpazdYRzRnSUgwcE8xeHVmVHRjYmx4dUx5b3FYRzRnSUdCUWNtOXRhWE5sTG1Gc2JHQWdZV05qWlhCMGN5QmhiaUJoY25KaGVTQnZaaUJ3Y205dGFYTmxjeXdnWVc1a0lISmxkSFZ5Ym5NZ1lTQnVaWGNnY0hKdmJXbHpaU0IzYUdsamFGeHVJQ0JwY3lCbWRXeG1hV3hzWldRZ2QybDBhQ0JoYmlCaGNuSmhlU0J2WmlCbWRXeG1hV3hzYldWdWRDQjJZV3gxWlhNZ1ptOXlJSFJvWlNCd1lYTnpaV1FnY0hKdmJXbHpaWE1zSUc5eVhHNGdJSEpsYW1WamRHVmtJSGRwZEdnZ2RHaGxJSEpsWVhOdmJpQnZaaUIwYUdVZ1ptbHljM1FnY0dGemMyVmtJSEJ5YjIxcGMyVWdkRzhnWW1VZ2NtVnFaV04wWldRdUlFbDBJR05oYzNSeklHRnNiRnh1SUNCbGJHVnRaVzUwY3lCdlppQjBhR1VnY0dGemMyVmtJR2wwWlhKaFlteGxJSFJ2SUhCeWIyMXBjMlZ6SUdGeklHbDBJSEoxYm5NZ2RHaHBjeUJoYkdkdmNtbDBhRzB1WEc1Y2JpQWdSWGhoYlhCc1pUcGNibHh1SUNCZ1lHQnFZWFpoYzJOeWFYQjBYRzRnSUd4bGRDQndjbTl0YVhObE1TQTlJSEpsYzI5c2RtVW9NU2s3WEc0Z0lHeGxkQ0J3Y205dGFYTmxNaUE5SUhKbGMyOXNkbVVvTWlrN1hHNGdJR3hsZENCd2NtOXRhWE5sTXlBOUlISmxjMjlzZG1Vb015azdYRzRnSUd4bGRDQndjbTl0YVhObGN5QTlJRnNnY0hKdmJXbHpaVEVzSUhCeWIyMXBjMlV5TENCd2NtOXRhWE5sTXlCZE8xeHVYRzRnSUZCeWIyMXBjMlV1WVd4c0tIQnliMjFwYzJWektTNTBhR1Z1S0daMWJtTjBhVzl1S0dGeWNtRjVLWHRjYmlBZ0lDQXZMeUJVYUdVZ1lYSnlZWGtnYUdWeVpTQjNiM1ZzWkNCaVpTQmJJREVzSURJc0lETWdYVHRjYmlBZ2ZTazdYRzRnSUdCZ1lGeHVYRzRnSUVsbUlHRnVlU0J2WmlCMGFHVWdZSEJ5YjIxcGMyVnpZQ0JuYVhabGJpQjBieUJnWVd4c1lDQmhjbVVnY21WcVpXTjBaV1FzSUhSb1pTQm1hWEp6ZENCd2NtOXRhWE5sWEc0Z0lIUm9ZWFFnYVhNZ2NtVnFaV04wWldRZ2QybHNiQ0JpWlNCbmFYWmxiaUJoY3lCaGJpQmhjbWQxYldWdWRDQjBieUIwYUdVZ2NtVjBkWEp1WldRZ2NISnZiV2x6WlhNbmMxeHVJQ0J5WldwbFkzUnBiMjRnYUdGdVpHeGxjaTRnUm05eUlHVjRZVzF3YkdVNlhHNWNiaUFnUlhoaGJYQnNaVHBjYmx4dUlDQmdZR0JxWVhaaGMyTnlhWEIwWEc0Z0lHeGxkQ0J3Y205dGFYTmxNU0E5SUhKbGMyOXNkbVVvTVNrN1hHNGdJR3hsZENCd2NtOXRhWE5sTWlBOUlISmxhbVZqZENodVpYY2dSWEp5YjNJb1hDSXlYQ0lwS1R0Y2JpQWdiR1YwSUhCeWIyMXBjMlV6SUQwZ2NtVnFaV04wS0c1bGR5QkZjbkp2Y2loY0lqTmNJaWtwTzF4dUlDQnNaWFFnY0hKdmJXbHpaWE1nUFNCYklIQnliMjFwYzJVeExDQndjbTl0YVhObE1pd2djSEp2YldselpUTWdYVHRjYmx4dUlDQlFjbTl0YVhObExtRnNiQ2h3Y205dGFYTmxjeWt1ZEdobGJpaG1kVzVqZEdsdmJpaGhjbkpoZVNsN1hHNGdJQ0FnTHk4Z1EyOWtaU0JvWlhKbElHNWxkbVZ5SUhKMWJuTWdZbVZqWVhWelpTQjBhR1Z5WlNCaGNtVWdjbVZxWldOMFpXUWdjSEp2YldselpYTWhYRzRnSUgwc0lHWjFibU4wYVc5dUtHVnljbTl5S1NCN1hHNGdJQ0FnTHk4Z1pYSnliM0l1YldWemMyRm5aU0E5UFQwZ1hDSXlYQ0pjYmlBZ2ZTazdYRzRnSUdCZ1lGeHVYRzRnSUVCdFpYUm9iMlFnWVd4c1hHNGdJRUJ6ZEdGMGFXTmNiaUFnUUhCaGNtRnRJSHRCY25KaGVYMGdaVzUwY21sbGN5QmhjbkpoZVNCdlppQndjbTl0YVhObGMxeHVJQ0JBY0dGeVlXMGdlMU4wY21sdVozMGdiR0ZpWld3Z2IzQjBhVzl1WVd3Z2MzUnlhVzVuSUdadmNpQnNZV0psYkdsdVp5QjBhR1VnY0hKdmJXbHpaUzVjYmlBZ1ZYTmxablZzSUdadmNpQjBiMjlzYVc1bkxseHVJQ0JBY21WMGRYSnVJSHRRY205dGFYTmxmU0J3Y205dGFYTmxJSFJvWVhRZ2FYTWdablZzWm1sc2JHVmtJSGRvWlc0Z1lXeHNJR0J3Y205dGFYTmxjMkFnYUdGMlpTQmlaV1Z1WEc0Z0lHWjFiR1pwYkd4bFpDd2diM0lnY21WcVpXTjBaV1FnYVdZZ1lXNTVJRzltSUhSb1pXMGdZbVZqYjIxbElISmxhbVZqZEdWa0xseHVJQ0JBYzNSaGRHbGpYRzRxTDF4dVpuVnVZM1JwYjI0Z1lXeHNLR1Z1ZEhKcFpYTXBJSHRjYmlBZ2NtVjBkWEp1SUc1bGR5QkZiblZ0WlhKaGRHOXlLSFJvYVhNc0lHVnVkSEpwWlhNcExuQnliMjFwYzJVN1hHNTlYRzVjYmk4cUtseHVJQ0JnVUhKdmJXbHpaUzV5WVdObFlDQnlaWFIxY201eklHRWdibVYzSUhCeWIyMXBjMlVnZDJocFkyZ2dhWE1nYzJWMGRHeGxaQ0JwYmlCMGFHVWdjMkZ0WlNCM1lYa2dZWE1nZEdobFhHNGdJR1pwY25OMElIQmhjM05sWkNCd2NtOXRhWE5sSUhSdklITmxkSFJzWlM1Y2JseHVJQ0JGZUdGdGNHeGxPbHh1WEc0Z0lHQmdZR3BoZG1GelkzSnBjSFJjYmlBZ2JHVjBJSEJ5YjIxcGMyVXhJRDBnYm1WM0lGQnliMjFwYzJVb1puVnVZM1JwYjI0b2NtVnpiMngyWlN3Z2NtVnFaV04wS1h0Y2JpQWdJQ0J6WlhSVWFXMWxiM1YwS0daMWJtTjBhVzl1S0NsN1hHNGdJQ0FnSUNCeVpYTnZiSFpsS0Nkd2NtOXRhWE5sSURFbktUdGNiaUFnSUNCOUxDQXlNREFwTzF4dUlDQjlLVHRjYmx4dUlDQnNaWFFnY0hKdmJXbHpaVElnUFNCdVpYY2dVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabExDQnlaV3BsWTNRcGUxeHVJQ0FnSUhObGRGUnBiV1Z2ZFhRb1puVnVZM1JwYjI0b0tYdGNiaUFnSUNBZ0lISmxjMjlzZG1Vb0ozQnliMjFwYzJVZ01pY3BPMXh1SUNBZ0lIMHNJREV3TUNrN1hHNGdJSDBwTzF4dVhHNGdJRkJ5YjIxcGMyVXVjbUZqWlNoYmNISnZiV2x6WlRFc0lIQnliMjFwYzJVeVhTa3VkR2hsYmlobWRXNWpkR2x2YmloeVpYTjFiSFFwZTF4dUlDQWdJQzh2SUhKbGMzVnNkQ0E5UFQwZ0ozQnliMjFwYzJVZ01pY2dZbVZqWVhWelpTQnBkQ0IzWVhNZ2NtVnpiMngyWldRZ1ltVm1iM0psSUhCeWIyMXBjMlV4WEc0Z0lDQWdMeThnZDJGeklISmxjMjlzZG1Wa0xseHVJQ0I5S1R0Y2JpQWdZR0JnWEc1Y2JpQWdZRkJ5YjIxcGMyVXVjbUZqWldBZ2FYTWdaR1YwWlhKdGFXNXBjM1JwWXlCcGJpQjBhR0YwSUc5dWJIa2dkR2hsSUhOMFlYUmxJRzltSUhSb1pTQm1hWEp6ZEZ4dUlDQnpaWFIwYkdWa0lIQnliMjFwYzJVZ2JXRjBkR1Z5Y3k0Z1JtOXlJR1Y0WVcxd2JHVXNJR1YyWlc0Z2FXWWdiM1JvWlhJZ2NISnZiV2x6WlhNZ1oybDJaVzRnZEc4Z2RHaGxYRzRnSUdCd2NtOXRhWE5sYzJBZ1lYSnlZWGtnWVhKbmRXMWxiblFnWVhKbElISmxjMjlzZG1Wa0xDQmlkWFFnZEdobElHWnBjbk4wSUhObGRIUnNaV1FnY0hKdmJXbHpaU0JvWVhOY2JpQWdZbVZqYjIxbElISmxhbVZqZEdWa0lHSmxabTl5WlNCMGFHVWdiM1JvWlhJZ2NISnZiV2x6WlhNZ1ltVmpZVzFsSUdaMWJHWnBiR3hsWkN3Z2RHaGxJSEpsZEhWeWJtVmtYRzRnSUhCeWIyMXBjMlVnZDJsc2JDQmlaV052YldVZ2NtVnFaV04wWldRNlhHNWNiaUFnWUdCZ2FtRjJZWE5qY21sd2RGeHVJQ0JzWlhRZ2NISnZiV2x6WlRFZ1BTQnVaWGNnVUhKdmJXbHpaU2htZFc1amRHbHZiaWh5WlhOdmJIWmxMQ0J5WldwbFkzUXBlMXh1SUNBZ0lITmxkRlJwYldWdmRYUW9ablZ1WTNScGIyNG9LWHRjYmlBZ0lDQWdJSEpsYzI5c2RtVW9KM0J5YjIxcGMyVWdNU2NwTzF4dUlDQWdJSDBzSURJd01DazdYRzRnSUgwcE8xeHVYRzRnSUd4bGRDQndjbTl0YVhObE1pQTlJRzVsZHlCUWNtOXRhWE5sS0daMWJtTjBhVzl1S0hKbGMyOXNkbVVzSUhKbGFtVmpkQ2w3WEc0Z0lDQWdjMlYwVkdsdFpXOTFkQ2htZFc1amRHbHZiaWdwZTF4dUlDQWdJQ0FnY21WcVpXTjBLRzVsZHlCRmNuSnZjaWduY0hKdmJXbHpaU0F5SnlrcE8xeHVJQ0FnSUgwc0lERXdNQ2s3WEc0Z0lIMHBPMXh1WEc0Z0lGQnliMjFwYzJVdWNtRmpaU2hiY0hKdmJXbHpaVEVzSUhCeWIyMXBjMlV5WFNrdWRHaGxiaWhtZFc1amRHbHZiaWh5WlhOMWJIUXBlMXh1SUNBZ0lDOHZJRU52WkdVZ2FHVnlaU0J1WlhabGNpQnlkVzV6WEc0Z0lIMHNJR1oxYm1OMGFXOXVLSEpsWVhOdmJpbDdYRzRnSUNBZ0x5OGdjbVZoYzI5dUxtMWxjM05oWjJVZ1BUMDlJQ2R3Y205dGFYTmxJREluSUdKbFkyRjFjMlVnY0hKdmJXbHpaU0F5SUdKbFkyRnRaU0J5WldwbFkzUmxaQ0JpWldadmNtVmNiaUFnSUNBdkx5QndjbTl0YVhObElERWdZbVZqWVcxbElHWjFiR1pwYkd4bFpGeHVJQ0I5S1R0Y2JpQWdZR0JnWEc1Y2JpQWdRVzRnWlhoaGJYQnNaU0J5WldGc0xYZHZjbXhrSUhWelpTQmpZWE5sSUdseklHbHRjR3hsYldWdWRHbHVaeUIwYVcxbGIzVjBjenBjYmx4dUlDQmdZR0JxWVhaaGMyTnlhWEIwWEc0Z0lGQnliMjFwYzJVdWNtRmpaU2hiWVdwaGVDZ25abTl2TG1wemIyNG5LU3dnZEdsdFpXOTFkQ2cxTURBd0tWMHBYRzRnSUdCZ1lGeHVYRzRnSUVCdFpYUm9iMlFnY21GalpWeHVJQ0JBYzNSaGRHbGpYRzRnSUVCd1lYSmhiU0I3UVhKeVlYbDlJSEJ5YjIxcGMyVnpJR0Z5Y21GNUlHOW1JSEJ5YjIxcGMyVnpJSFJ2SUc5aWMyVnlkbVZjYmlBZ1ZYTmxablZzSUdadmNpQjBiMjlzYVc1bkxseHVJQ0JBY21WMGRYSnVJSHRRY205dGFYTmxmU0JoSUhCeWIyMXBjMlVnZDJocFkyZ2djMlYwZEd4bGN5QnBiaUIwYUdVZ2MyRnRaU0IzWVhrZ1lYTWdkR2hsSUdacGNuTjBJSEJoYzNObFpGeHVJQ0J3Y205dGFYTmxJSFJ2SUhObGRIUnNaUzVjYmlvdlhHNW1kVzVqZEdsdmJpQnlZV05sS0dWdWRISnBaWE1wSUh0Y2JpQWdMeXBxYzJocGJuUWdkbUZzYVdSMGFHbHpPblJ5ZFdVZ0tpOWNiaUFnZG1GeUlFTnZibk4wY25WamRHOXlJRDBnZEdocGN6dGNibHh1SUNCcFppQW9JV2x6UVhKeVlYa29aVzUwY21sbGN5a3BJSHRjYmlBZ0lDQnlaWFIxY200Z2JtVjNJRU52Ym5OMGNuVmpkRzl5S0daMWJtTjBhVzl1SUNoZkxDQnlaV3BsWTNRcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCeVpXcGxZM1FvYm1WM0lGUjVjR1ZGY25KdmNpZ25XVzkxSUcxMWMzUWdjR0Z6Y3lCaGJpQmhjbkpoZVNCMGJ5QnlZV05sTGljcEtUdGNiaUFnSUNCOUtUdGNiaUFnZlNCbGJITmxJSHRjYmlBZ0lDQnlaWFIxY200Z2JtVjNJRU52Ym5OMGNuVmpkRzl5S0daMWJtTjBhVzl1SUNoeVpYTnZiSFpsTENCeVpXcGxZM1FwSUh0Y2JpQWdJQ0FnSUhaaGNpQnNaVzVuZEdnZ1BTQmxiblJ5YVdWekxteGxibWQwYUR0Y2JpQWdJQ0FnSUdadmNpQW9kbUZ5SUdrZ1BTQXdPeUJwSUR3Z2JHVnVaM1JvT3lCcEt5c3BJSHRjYmlBZ0lDQWdJQ0FnUTI5dWMzUnlkV04wYjNJdWNtVnpiMngyWlNobGJuUnlhV1Z6VzJsZEtTNTBhR1Z1S0hKbGMyOXNkbVVzSUhKbGFtVmpkQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU2s3WEc0Z0lIMWNibjFjYmx4dUx5b3FYRzRnSUdCUWNtOXRhWE5sTG5KbGFtVmpkR0FnY21WMGRYSnVjeUJoSUhCeWIyMXBjMlVnY21WcVpXTjBaV1FnZDJsMGFDQjBhR1VnY0dGemMyVmtJR0J5WldGemIyNWdMbHh1SUNCSmRDQnBjeUJ6YUc5eWRHaGhibVFnWm05eUlIUm9aU0JtYjJ4c2IzZHBibWM2WEc1Y2JpQWdZR0JnYW1GMllYTmpjbWx3ZEZ4dUlDQnNaWFFnY0hKdmJXbHpaU0E5SUc1bGR5QlFjbTl0YVhObEtHWjFibU4wYVc5dUtISmxjMjlzZG1Vc0lISmxhbVZqZENsN1hHNGdJQ0FnY21WcVpXTjBLRzVsZHlCRmNuSnZjaWduVjBoUFQxQlRKeWtwTzF4dUlDQjlLVHRjYmx4dUlDQndjbTl0YVhObExuUm9aVzRvWm5WdVkzUnBiMjRvZG1Gc2RXVXBlMXh1SUNBZ0lDOHZJRU52WkdVZ2FHVnlaU0JrYjJWemJpZDBJSEoxYmlCaVpXTmhkWE5sSUhSb1pTQndjbTl0YVhObElHbHpJSEpsYW1WamRHVmtJVnh1SUNCOUxDQm1kVzVqZEdsdmJpaHlaV0Z6YjI0cGUxeHVJQ0FnSUM4dklISmxZWE52Ymk1dFpYTnpZV2RsSUQwOVBTQW5WMGhQVDFCVEoxeHVJQ0I5S1R0Y2JpQWdZR0JnWEc1Y2JpQWdTVzV6ZEdWaFpDQnZaaUIzY21sMGFXNW5JSFJvWlNCaFltOTJaU3dnZVc5MWNpQmpiMlJsSUc1dmR5QnphVzF3YkhrZ1ltVmpiMjFsY3lCMGFHVWdabTlzYkc5M2FXNW5PbHh1WEc0Z0lHQmdZR3BoZG1GelkzSnBjSFJjYmlBZ2JHVjBJSEJ5YjIxcGMyVWdQU0JRY205dGFYTmxMbkpsYW1WamRDaHVaWGNnUlhKeWIzSW9KMWRJVDA5UVV5Y3BLVHRjYmx4dUlDQndjbTl0YVhObExuUm9aVzRvWm5WdVkzUnBiMjRvZG1Gc2RXVXBlMXh1SUNBZ0lDOHZJRU52WkdVZ2FHVnlaU0JrYjJWemJpZDBJSEoxYmlCaVpXTmhkWE5sSUhSb1pTQndjbTl0YVhObElHbHpJSEpsYW1WamRHVmtJVnh1SUNCOUxDQm1kVzVqZEdsdmJpaHlaV0Z6YjI0cGUxeHVJQ0FnSUM4dklISmxZWE52Ymk1dFpYTnpZV2RsSUQwOVBTQW5WMGhQVDFCVEoxeHVJQ0I5S1R0Y2JpQWdZR0JnWEc1Y2JpQWdRRzFsZEdodlpDQnlaV3BsWTNSY2JpQWdRSE4wWVhScFkxeHVJQ0JBY0dGeVlXMGdlMEZ1ZVgwZ2NtVmhjMjl1SUhaaGJIVmxJSFJvWVhRZ2RHaGxJSEpsZEhWeWJtVmtJSEJ5YjIxcGMyVWdkMmxzYkNCaVpTQnlaV3BsWTNSbFpDQjNhWFJvTGx4dUlDQlZjMlZtZFd3Z1ptOXlJSFJ2YjJ4cGJtY3VYRzRnSUVCeVpYUjFjbTRnZTFCeWIyMXBjMlY5SUdFZ2NISnZiV2x6WlNCeVpXcGxZM1JsWkNCM2FYUm9JSFJvWlNCbmFYWmxiaUJnY21WaGMyOXVZQzVjYmlvdlhHNW1kVzVqZEdsdmJpQnlaV3BsWTNRb2NtVmhjMjl1S1NCN1hHNGdJQzhxYW5Ob2FXNTBJSFpoYkdsa2RHaHBjenAwY25WbElDb3ZYRzRnSUhaaGNpQkRiMjV6ZEhKMVkzUnZjaUE5SUhSb2FYTTdYRzRnSUhaaGNpQndjbTl0YVhObElEMGdibVYzSUVOdmJuTjBjblZqZEc5eUtHNXZiM0FwTzF4dUlDQmZjbVZxWldOMEtIQnliMjFwYzJVc0lISmxZWE52YmlrN1hHNGdJSEpsZEhWeWJpQndjbTl0YVhObE8xeHVmVnh1WEc1bWRXNWpkR2x2YmlCdVpXVmtjMUpsYzI5c2RtVnlLQ2tnZTF4dUlDQjBhSEp2ZHlCdVpYY2dWSGx3WlVWeWNtOXlLQ2RaYjNVZ2JYVnpkQ0J3WVhOeklHRWdjbVZ6YjJ4MlpYSWdablZ1WTNScGIyNGdZWE1nZEdobElHWnBjbk4wSUdGeVozVnRaVzUwSUhSdklIUm9aU0J3Y205dGFYTmxJR052Ym5OMGNuVmpkRzl5SnlrN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUc1bFpXUnpUbVYzS0NrZ2UxeHVJQ0IwYUhKdmR5QnVaWGNnVkhsd1pVVnljbTl5S0Z3aVJtRnBiR1ZrSUhSdklHTnZibk4wY25WamRDQW5VSEp2YldselpTYzZJRkJzWldGelpTQjFjMlVnZEdobElDZHVaWGNuSUc5d1pYSmhkRzl5TENCMGFHbHpJRzlpYW1WamRDQmpiMjV6ZEhKMVkzUnZjaUJqWVc1dWIzUWdZbVVnWTJGc2JHVmtJR0Z6SUdFZ1puVnVZM1JwYjI0dVhDSXBPMXh1ZlZ4dVhHNHZLaXBjYmlBZ1VISnZiV2x6WlNCdlltcGxZM1J6SUhKbGNISmxjMlZ1ZENCMGFHVWdaWFpsYm5SMVlXd2djbVZ6ZFd4MElHOW1JR0Z1SUdGemVXNWphSEp2Ym05MWN5QnZjR1Z5WVhScGIyNHVJRlJvWlZ4dUlDQndjbWx0WVhKNUlIZGhlU0J2WmlCcGJuUmxjbUZqZEdsdVp5QjNhWFJvSUdFZ2NISnZiV2x6WlNCcGN5QjBhSEp2ZFdkb0lHbDBjeUJnZEdobGJtQWdiV1YwYUc5a0xDQjNhR2xqYUZ4dUlDQnlaV2RwYzNSbGNuTWdZMkZzYkdKaFkydHpJSFJ2SUhKbFkyVnBkbVVnWldsMGFHVnlJR0VnY0hKdmJXbHpaU2R6SUdWMlpXNTBkV0ZzSUhaaGJIVmxJRzl5SUhSb1pTQnlaV0Z6YjI1Y2JpQWdkMmg1SUhSb1pTQndjbTl0YVhObElHTmhibTV2ZENCaVpTQm1kV3htYVd4c1pXUXVYRzVjYmlBZ1ZHVnliV2x1YjJ4dlozbGNiaUFnTFMwdExTMHRMUzB0TFMxY2JseHVJQ0F0SUdCd2NtOXRhWE5sWUNCcGN5QmhiaUJ2WW1wbFkzUWdiM0lnWm5WdVkzUnBiMjRnZDJsMGFDQmhJR0IwYUdWdVlDQnRaWFJvYjJRZ2QyaHZjMlVnWW1Wb1lYWnBiM0lnWTI5dVptOXliWE1nZEc4Z2RHaHBjeUJ6Y0dWamFXWnBZMkYwYVc5dUxseHVJQ0F0SUdCMGFHVnVZV0pzWldBZ2FYTWdZVzRnYjJKcVpXTjBJRzl5SUdaMWJtTjBhVzl1SUhSb1lYUWdaR1ZtYVc1bGN5QmhJR0IwYUdWdVlDQnRaWFJvYjJRdVhHNGdJQzBnWUhaaGJIVmxZQ0JwY3lCaGJua2diR1ZuWVd3Z1NtRjJZVk5qY21sd2RDQjJZV3gxWlNBb2FXNWpiSFZrYVc1bklIVnVaR1ZtYVc1bFpDd2dZU0IwYUdWdVlXSnNaU3dnYjNJZ1lTQndjbTl0YVhObEtTNWNiaUFnTFNCZ1pYaGpaWEIwYVc5dVlDQnBjeUJoSUhaaGJIVmxJSFJvWVhRZ2FYTWdkR2h5YjNkdUlIVnphVzVuSUhSb1pTQjBhSEp2ZHlCemRHRjBaVzFsYm5RdVhHNGdJQzBnWUhKbFlYTnZibUFnYVhNZ1lTQjJZV3gxWlNCMGFHRjBJR2x1WkdsallYUmxjeUIzYUhrZ1lTQndjbTl0YVhObElIZGhjeUJ5WldwbFkzUmxaQzVjYmlBZ0xTQmdjMlYwZEd4bFpHQWdkR2hsSUdacGJtRnNJSEpsYzNScGJtY2djM1JoZEdVZ2IyWWdZU0J3Y205dGFYTmxMQ0JtZFd4bWFXeHNaV1FnYjNJZ2NtVnFaV04wWldRdVhHNWNiaUFnUVNCd2NtOXRhWE5sSUdOaGJpQmlaU0JwYmlCdmJtVWdiMllnZEdoeVpXVWdjM1JoZEdWek9pQndaVzVrYVc1bkxDQm1kV3htYVd4c1pXUXNJRzl5SUhKbGFtVmpkR1ZrTGx4dVhHNGdJRkJ5YjIxcGMyVnpJSFJvWVhRZ1lYSmxJR1oxYkdacGJHeGxaQ0JvWVhabElHRWdablZzWm1sc2JHMWxiblFnZG1Gc2RXVWdZVzVrSUdGeVpTQnBiaUIwYUdVZ1puVnNabWxzYkdWa1hHNGdJSE4wWVhSbExpQWdVSEp2YldselpYTWdkR2hoZENCaGNtVWdjbVZxWldOMFpXUWdhR0YyWlNCaElISmxhbVZqZEdsdmJpQnlaV0Z6YjI0Z1lXNWtJR0Z5WlNCcGJpQjBhR1ZjYmlBZ2NtVnFaV04wWldRZ2MzUmhkR1V1SUNCQklHWjFiR1pwYkd4dFpXNTBJSFpoYkhWbElHbHpJRzVsZG1WeUlHRWdkR2hsYm1GaWJHVXVYRzVjYmlBZ1VISnZiV2x6WlhNZ1kyRnVJR0ZzYzI4Z1ltVWdjMkZwWkNCMGJ5QXFjbVZ6YjJ4MlpTb2dZU0IyWVd4MVpTNGdJRWxtSUhSb2FYTWdkbUZzZFdVZ2FYTWdZV3h6YnlCaFhHNGdJSEJ5YjIxcGMyVXNJSFJvWlc0Z2RHaGxJRzl5YVdkcGJtRnNJSEJ5YjIxcGMyVW5jeUJ6WlhSMGJHVmtJSE4wWVhSbElIZHBiR3dnYldGMFkyZ2dkR2hsSUhaaGJIVmxKM05jYmlBZ2MyVjBkR3hsWkNCemRHRjBaUzRnSUZOdklHRWdjSEp2YldselpTQjBhR0YwSUNweVpYTnZiSFpsY3lvZ1lTQndjbTl0YVhObElIUm9ZWFFnY21WcVpXTjBjeUIzYVd4c1hHNGdJR2wwYzJWc1ppQnlaV3BsWTNRc0lHRnVaQ0JoSUhCeWIyMXBjMlVnZEdoaGRDQXFjbVZ6YjJ4MlpYTXFJR0VnY0hKdmJXbHpaU0IwYUdGMElHWjFiR1pwYkd4eklIZHBiR3hjYmlBZ2FYUnpaV3htSUdaMWJHWnBiR3d1WEc1Y2JseHVJQ0JDWVhOcFl5QlZjMkZuWlRwY2JpQWdMUzB0TFMwdExTMHRMUzB0WEc1Y2JpQWdZR0JnYW5OY2JpQWdiR1YwSUhCeWIyMXBjMlVnUFNCdVpYY2dVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNiaUFnSUNBdkx5QnZiaUJ6ZFdOalpYTnpYRzRnSUNBZ2NtVnpiMngyWlNoMllXeDFaU2s3WEc1Y2JpQWdJQ0F2THlCdmJpQm1ZV2xzZFhKbFhHNGdJQ0FnY21WcVpXTjBLSEpsWVhOdmJpazdYRzRnSUgwcE8xeHVYRzRnSUhCeWIyMXBjMlV1ZEdobGJpaG1kVzVqZEdsdmJpaDJZV3gxWlNrZ2UxeHVJQ0FnSUM4dklHOXVJR1oxYkdacGJHeHRaVzUwWEc0Z0lIMHNJR1oxYm1OMGFXOXVLSEpsWVhOdmJpa2dlMXh1SUNBZ0lDOHZJRzl1SUhKbGFtVmpkR2x2Ymx4dUlDQjlLVHRjYmlBZ1lHQmdYRzVjYmlBZ1FXUjJZVzVqWldRZ1ZYTmhaMlU2WEc0Z0lDMHRMUzB0TFMwdExTMHRMUzB0TFZ4dVhHNGdJRkJ5YjIxcGMyVnpJSE5vYVc1bElIZG9aVzRnWVdKemRISmhZM1JwYm1jZ1lYZGhlU0JoYzNsdVkyaHliMjV2ZFhNZ2FXNTBaWEpoWTNScGIyNXpJSE4xWTJnZ1lYTmNiaUFnWUZoTlRFaDBkSEJTWlhGMVpYTjBZSE11WEc1Y2JpQWdZR0JnYW5OY2JpQWdablZ1WTNScGIyNGdaMlYwU2xOUFRpaDFjbXdwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdibVYzSUZCeWIyMXBjMlVvWm5WdVkzUnBiMjRvY21WemIyeDJaU3dnY21WcVpXTjBLWHRjYmlBZ0lDQWdJR3hsZENCNGFISWdQU0J1WlhjZ1dFMU1TSFIwY0ZKbGNYVmxjM1FvS1R0Y2JseHVJQ0FnSUNBZ2VHaHlMbTl3Wlc0b0owZEZWQ2NzSUhWeWJDazdYRzRnSUNBZ0lDQjRhSEl1YjI1eVpXRmtlWE4wWVhSbFkyaGhibWRsSUQwZ2FHRnVaR3hsY2p0Y2JpQWdJQ0FnSUhob2NpNXlaWE53YjI1elpWUjVjR1VnUFNBbmFuTnZiaWM3WEc0Z0lDQWdJQ0I0YUhJdWMyVjBVbVZ4ZFdWemRFaGxZV1JsY2lnblFXTmpaWEIwSnl3Z0oyRndjR3hwWTJGMGFXOXVMMnB6YjI0bktUdGNiaUFnSUNBZ0lIaG9jaTV6Wlc1a0tDazdYRzVjYmlBZ0lDQWdJR1oxYm1OMGFXOXVJR2hoYm1Sc1pYSW9LU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG5KbFlXUjVVM1JoZEdVZ1BUMDlJSFJvYVhNdVJFOU9SU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxuTjBZWFIxY3lBOVBUMGdNakF3S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhOdmJIWmxLSFJvYVhNdWNtVnpjRzl1YzJVcE8xeHVJQ0FnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpXcGxZM1FvYm1WM0lFVnljbTl5S0NkblpYUktVMDlPT2lCZ0p5QXJJSFZ5YkNBcklDZGdJR1poYVd4bFpDQjNhWFJvSUhOMFlYUjFjem9nV3ljZ0t5QjBhR2x6TG5OMFlYUjFjeUFySUNkZEp5a3BPMXh1SUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZUdGNiaUFnSUNCOUtUdGNiaUFnZlZ4dVhHNGdJR2RsZEVwVFQwNG9KeTl3YjNOMGN5NXFjMjl1SnlrdWRHaGxiaWhtZFc1amRHbHZiaWhxYzI5dUtTQjdYRzRnSUNBZ0x5OGdiMjRnWm5Wc1ptbHNiRzFsYm5SY2JpQWdmU3dnWm5WdVkzUnBiMjRvY21WaGMyOXVLU0I3WEc0Z0lDQWdMeThnYjI0Z2NtVnFaV04wYVc5dVhHNGdJSDBwTzF4dUlDQmdZR0JjYmx4dUlDQlZibXhwYTJVZ1kyRnNiR0poWTJ0ekxDQndjbTl0YVhObGN5QmhjbVVnWjNKbFlYUWdZMjl0Y0c5ellXSnNaU0J3Y21sdGFYUnBkbVZ6TGx4dVhHNGdJR0JnWUdwelhHNGdJRkJ5YjIxcGMyVXVZV3hzS0Z0Y2JpQWdJQ0JuWlhSS1UwOU9LQ2N2Y0c5emRITW5LU3hjYmlBZ0lDQm5aWFJLVTA5T0tDY3ZZMjl0YldWdWRITW5LVnh1SUNCZEtTNTBhR1Z1S0daMWJtTjBhVzl1S0haaGJIVmxjeWw3WEc0Z0lDQWdkbUZzZFdWeld6QmRJQzh2SUQwK0lIQnZjM1J6U2xOUFRseHVJQ0FnSUhaaGJIVmxjMXN4WFNBdkx5QTlQaUJqYjIxdFpXNTBjMHBUVDA1Y2JseHVJQ0FnSUhKbGRIVnliaUIyWVd4MVpYTTdYRzRnSUgwcE8xeHVJQ0JnWUdCY2JseHVJQ0JBWTJ4aGMzTWdVSEp2YldselpWeHVJQ0JBY0dGeVlXMGdlMloxYm1OMGFXOXVmU0J5WlhOdmJIWmxjbHh1SUNCVmMyVm1kV3dnWm05eUlIUnZiMnhwYm1jdVhHNGdJRUJqYjI1emRISjFZM1J2Y2x4dUtpOWNibVoxYm1OMGFXOXVJRkJ5YjIxcGMyVW9jbVZ6YjJ4MlpYSXBJSHRjYmlBZ2RHaHBjMXRRVWs5TlNWTkZYMGxFWFNBOUlHNWxlSFJKWkNncE8xeHVJQ0IwYUdsekxsOXlaWE4xYkhRZ1BTQjBhR2x6TGw5emRHRjBaU0E5SUhWdVpHVm1hVzVsWkR0Y2JpQWdkR2hwY3k1ZmMzVmljMk55YVdKbGNuTWdQU0JiWFR0Y2JseHVJQ0JwWmlBb2JtOXZjQ0FoUFQwZ2NtVnpiMngyWlhJcElIdGNiaUFnSUNCMGVYQmxiMllnY21WemIyeDJaWElnSVQwOUlDZG1kVzVqZEdsdmJpY2dKaVlnYm1WbFpITlNaWE52YkhabGNpZ3BPMXh1SUNBZ0lIUm9hWE1nYVc1emRHRnVZMlZ2WmlCUWNtOXRhWE5sSUQ4Z2FXNXBkR2xoYkdsNlpWQnliMjFwYzJVb2RHaHBjeXdnY21WemIyeDJaWElwSURvZ2JtVmxaSE5PWlhjb0tUdGNiaUFnZlZ4dWZWeHVYRzVRY205dGFYTmxMbUZzYkNBOUlHRnNiRHRjYmxCeWIyMXBjMlV1Y21GalpTQTlJSEpoWTJVN1hHNVFjbTl0YVhObExuSmxjMjlzZG1VZ1BTQnlaWE52YkhabE8xeHVVSEp2YldselpTNXlaV3BsWTNRZ1BTQnlaV3BsWTNRN1hHNVFjbTl0YVhObExsOXpaWFJUWTJobFpIVnNaWElnUFNCelpYUlRZMmhsWkhWc1pYSTdYRzVRY205dGFYTmxMbDl6WlhSQmMyRndJRDBnYzJWMFFYTmhjRHRjYmxCeWIyMXBjMlV1WDJGellYQWdQU0JoYzJGd08xeHVYRzVRY205dGFYTmxMbkJ5YjNSdmRIbHdaU0E5SUh0Y2JpQWdZMjl1YzNSeWRXTjBiM0k2SUZCeWIyMXBjMlVzWEc1Y2JpQWdMeW9xWEc0Z0lDQWdWR2hsSUhCeWFXMWhjbmtnZDJGNUlHOW1JR2x1ZEdWeVlXTjBhVzVuSUhkcGRHZ2dZU0J3Y205dGFYTmxJR2x6SUhSb2NtOTFaMmdnYVhSeklHQjBhR1Z1WUNCdFpYUm9iMlFzWEc0Z0lDQWdkMmhwWTJnZ2NtVm5hWE4wWlhKeklHTmhiR3hpWVdOcmN5QjBieUJ5WldObGFYWmxJR1ZwZEdobGNpQmhJSEJ5YjIxcGMyVW5jeUJsZG1WdWRIVmhiQ0IyWVd4MVpTQnZjaUIwYUdWY2JpQWdJQ0J5WldGemIyNGdkMmg1SUhSb1pTQndjbTl0YVhObElHTmhibTV2ZENCaVpTQm1kV3htYVd4c1pXUXVYRzRnSUZ4dUlDQWdJR0JnWUdwelhHNGdJQ0FnWm1sdVpGVnpaWElvS1M1MGFHVnVLR1oxYm1OMGFXOXVLSFZ6WlhJcGUxeHVJQ0FnSUNBZ0x5OGdkWE5sY2lCcGN5QmhkbUZwYkdGaWJHVmNiaUFnSUNCOUxDQm1kVzVqZEdsdmJpaHlaV0Z6YjI0cGUxeHVJQ0FnSUNBZ0x5OGdkWE5sY2lCcGN5QjFibUYyWVdsc1lXSnNaU3dnWVc1a0lIbHZkU0JoY21VZ1oybDJaVzRnZEdobElISmxZWE52YmlCM2FIbGNiaUFnSUNCOUtUdGNiaUFnSUNCZ1lHQmNiaUFnWEc0Z0lDQWdRMmhoYVc1cGJtZGNiaUFnSUNBdExTMHRMUzB0TFZ4dUlDQmNiaUFnSUNCVWFHVWdjbVYwZFhKdUlIWmhiSFZsSUc5bUlHQjBhR1Z1WUNCcGN5QnBkSE5sYkdZZ1lTQndjbTl0YVhObExpQWdWR2hwY3lCelpXTnZibVFzSUNka2IzZHVjM1J5WldGdEoxeHVJQ0FnSUhCeWIyMXBjMlVnYVhNZ2NtVnpiMngyWldRZ2QybDBhQ0IwYUdVZ2NtVjBkWEp1SUhaaGJIVmxJRzltSUhSb1pTQm1hWEp6ZENCd2NtOXRhWE5sSjNNZ1puVnNabWxzYkcxbGJuUmNiaUFnSUNCdmNpQnlaV3BsWTNScGIyNGdhR0Z1Wkd4bGNpd2diM0lnY21WcVpXTjBaV1FnYVdZZ2RHaGxJR2hoYm1Sc1pYSWdkR2h5YjNkeklHRnVJR1Y0WTJWd2RHbHZiaTVjYmlBZ1hHNGdJQ0FnWUdCZ2FuTmNiaUFnSUNCbWFXNWtWWE5sY2lncExuUm9aVzRvWm5WdVkzUnBiMjRnS0hWelpYSXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjFjMlZ5TG01aGJXVTdYRzRnSUNBZ2ZTd2dablZ1WTNScGIyNGdLSEpsWVhOdmJpa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlDZGtaV1poZFd4MElHNWhiV1VuTzF4dUlDQWdJSDBwTG5Sb1pXNG9ablZ1WTNScGIyNGdLSFZ6WlhKT1lXMWxLU0I3WEc0Z0lDQWdJQ0F2THlCSlppQmdabWx1WkZWelpYSmdJR1oxYkdacGJHeGxaQ3dnWUhWelpYSk9ZVzFsWUNCM2FXeHNJR0psSUhSb1pTQjFjMlZ5SjNNZ2JtRnRaU3dnYjNSb1pYSjNhWE5sSUdsMFhHNGdJQ0FnSUNBdkx5QjNhV3hzSUdKbElHQW5aR1ZtWVhWc2RDQnVZVzFsSjJCY2JpQWdJQ0I5S1R0Y2JpQWdYRzRnSUNBZ1ptbHVaRlZ6WlhJb0tTNTBhR1Z1S0daMWJtTjBhVzl1SUNoMWMyVnlLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KMFp2ZFc1a0lIVnpaWElzSUdKMWRDQnpkR2xzYkNCMWJtaGhjSEI1SnlrN1hHNGdJQ0FnZlN3Z1puVnVZM1JwYjI0Z0tISmxZWE52YmlrZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkZ1ptbHVaRlZ6WlhKZ0lISmxhbVZqZEdWa0lHRnVaQ0IzWlNkeVpTQjFibWhoY0hCNUp5azdYRzRnSUNBZ2ZTa3VkR2hsYmlobWRXNWpkR2x2YmlBb2RtRnNkV1VwSUh0Y2JpQWdJQ0FnSUM4dklHNWxkbVZ5SUhKbFlXTm9aV1JjYmlBZ0lDQjlMQ0JtZFc1amRHbHZiaUFvY21WaGMyOXVLU0I3WEc0Z0lDQWdJQ0F2THlCcFppQmdabWx1WkZWelpYSmdJR1oxYkdacGJHeGxaQ3dnWUhKbFlYTnZibUFnZDJsc2JDQmlaU0FuUm05MWJtUWdkWE5sY2l3Z1luVjBJSE4wYVd4c0lIVnVhR0Z3Y0hrbkxseHVJQ0FnSUNBZ0x5OGdTV1lnWUdacGJtUlZjMlZ5WUNCeVpXcGxZM1JsWkN3Z1lISmxZWE52Ym1BZ2QybHNiQ0JpWlNBbllHWnBibVJWYzJWeVlDQnlaV3BsWTNSbFpDQmhibVFnZDJVbmNtVWdkVzVvWVhCd2VTY3VYRzRnSUNBZ2ZTazdYRzRnSUNBZ1lHQmdYRzRnSUNBZ1NXWWdkR2hsSUdSdmQyNXpkSEpsWVcwZ2NISnZiV2x6WlNCa2IyVnpJRzV2ZENCemNHVmphV1o1SUdFZ2NtVnFaV04wYVc5dUlHaGhibVJzWlhJc0lISmxhbVZqZEdsdmJpQnlaV0Z6YjI1eklIZHBiR3dnWW1VZ2NISnZjR0ZuWVhSbFpDQm1kWEowYUdWeUlHUnZkMjV6ZEhKbFlXMHVYRzRnSUZ4dUlDQWdJR0JnWUdwelhHNGdJQ0FnWm1sdVpGVnpaWElvS1M1MGFHVnVLR1oxYm1OMGFXOXVJQ2gxYzJWeUtTQjdYRzRnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dVR1ZrWVdkdloybGpZV3hGZUdObGNIUnBiMjRvSjFWd2MzUnlaV0Z0SUdWeWNtOXlKeWs3WEc0Z0lDQWdmU2t1ZEdobGJpaG1kVzVqZEdsdmJpQW9kbUZzZFdVcElIdGNiaUFnSUNBZ0lDOHZJRzVsZG1WeUlISmxZV05vWldSY2JpQWdJQ0I5S1M1MGFHVnVLR1oxYm1OMGFXOXVJQ2gyWVd4MVpTa2dlMXh1SUNBZ0lDQWdMeThnYm1WMlpYSWdjbVZoWTJobFpGeHVJQ0FnSUgwc0lHWjFibU4wYVc5dUlDaHlaV0Z6YjI0cElIdGNiaUFnSUNBZ0lDOHZJRlJvWlNCZ1VHVmtaMkZuYjJOcFlXeEZlR05sY0hScGIyNWdJR2x6SUhCeWIzQmhaMkYwWldRZ1lXeHNJSFJvWlNCM1lYa2daRzkzYmlCMGJ5Qm9aWEpsWEc0Z0lDQWdmU2s3WEc0Z0lDQWdZR0JnWEc0Z0lGeHVJQ0FnSUVGemMybHRhV3hoZEdsdmJseHVJQ0FnSUMwdExTMHRMUzB0TFMwdExWeHVJQ0JjYmlBZ0lDQlRiMjFsZEdsdFpYTWdkR2hsSUhaaGJIVmxJSGx2ZFNCM1lXNTBJSFJ2SUhCeWIzQmhaMkYwWlNCMGJ5QmhJR1J2ZDI1emRISmxZVzBnY0hKdmJXbHpaU0JqWVc0Z2IyNXNlU0JpWlZ4dUlDQWdJSEpsZEhKcFpYWmxaQ0JoYzNsdVkyaHliMjV2ZFhOc2VTNGdWR2hwY3lCallXNGdZbVVnWVdOb2FXVjJaV1FnWW5rZ2NtVjBkWEp1YVc1bklHRWdjSEp2YldselpTQnBiaUIwYUdWY2JpQWdJQ0JtZFd4bWFXeHNiV1Z1ZENCdmNpQnlaV3BsWTNScGIyNGdhR0Z1Wkd4bGNpNGdWR2hsSUdSdmQyNXpkSEpsWVcwZ2NISnZiV2x6WlNCM2FXeHNJSFJvWlc0Z1ltVWdjR1Z1WkdsdVoxeHVJQ0FnSUhWdWRHbHNJSFJvWlNCeVpYUjFjbTVsWkNCd2NtOXRhWE5sSUdseklITmxkSFJzWldRdUlGUm9hWE1nYVhNZ1kyRnNiR1ZrSUNwaGMzTnBiV2xzWVhScGIyNHFMbHh1SUNCY2JpQWdJQ0JnWUdCcWMxeHVJQ0FnSUdacGJtUlZjMlZ5S0NrdWRHaGxiaWhtZFc1amRHbHZiaUFvZFhObGNpa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHWnBibVJEYjIxdFpXNTBjMEo1UVhWMGFHOXlLSFZ6WlhJcE8xeHVJQ0FnSUgwcExuUm9aVzRvWm5WdVkzUnBiMjRnS0dOdmJXMWxiblJ6S1NCN1hHNGdJQ0FnSUNBdkx5QlVhR1VnZFhObGNpZHpJR052YlcxbGJuUnpJR0Z5WlNCdWIzY2dZWFpoYVd4aFlteGxYRzRnSUNBZ2ZTazdYRzRnSUNBZ1lHQmdYRzRnSUZ4dUlDQWdJRWxtSUhSb1pTQmhjM05wYld4cFlYUmxaQ0J3Y205dGFYTmxJSEpsYW1WamRITXNJSFJvWlc0Z2RHaGxJR1J2ZDI1emRISmxZVzBnY0hKdmJXbHpaU0IzYVd4c0lHRnNjMjhnY21WcVpXTjBMbHh1SUNCY2JpQWdJQ0JnWUdCcWMxeHVJQ0FnSUdacGJtUlZjMlZ5S0NrdWRHaGxiaWhtZFc1amRHbHZiaUFvZFhObGNpa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHWnBibVJEYjIxdFpXNTBjMEo1UVhWMGFHOXlLSFZ6WlhJcE8xeHVJQ0FnSUgwcExuUm9aVzRvWm5WdVkzUnBiMjRnS0dOdmJXMWxiblJ6S1NCN1hHNGdJQ0FnSUNBdkx5QkpaaUJnWm1sdVpFTnZiVzFsYm5SelFubEJkWFJvYjNKZ0lHWjFiR1pwYkd4ekxDQjNaU2RzYkNCb1lYWmxJSFJvWlNCMllXeDFaU0JvWlhKbFhHNGdJQ0FnZlN3Z1puVnVZM1JwYjI0Z0tISmxZWE52YmlrZ2UxeHVJQ0FnSUNBZ0x5OGdTV1lnWUdacGJtUkRiMjF0Wlc1MGMwSjVRWFYwYUc5eVlDQnlaV3BsWTNSekxDQjNaU2RzYkNCb1lYWmxJSFJvWlNCeVpXRnpiMjRnYUdWeVpWeHVJQ0FnSUgwcE8xeHVJQ0FnSUdCZ1lGeHVJQ0JjYmlBZ0lDQlRhVzF3YkdVZ1JYaGhiWEJzWlZ4dUlDQWdJQzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJRnh1SUNBZ0lGTjVibU5vY205dWIzVnpJRVY0WVcxd2JHVmNiaUFnWEc0Z0lDQWdZR0JnYW1GMllYTmpjbWx3ZEZ4dUlDQWdJR3hsZENCeVpYTjFiSFE3WEc0Z0lGeHVJQ0FnSUhSeWVTQjdYRzRnSUNBZ0lDQnlaWE4xYkhRZ1BTQm1hVzVrVW1WemRXeDBLQ2s3WEc0Z0lDQWdJQ0F2THlCemRXTmpaWE56WEc0Z0lDQWdmU0JqWVhSamFDaHlaV0Z6YjI0cElIdGNiaUFnSUNBZ0lDOHZJR1poYVd4MWNtVmNiaUFnSUNCOVhHNGdJQ0FnWUdCZ1hHNGdJRnh1SUNBZ0lFVnljbUpoWTJzZ1JYaGhiWEJzWlZ4dUlDQmNiaUFnSUNCZ1lHQnFjMXh1SUNBZ0lHWnBibVJTWlhOMWJIUW9ablZ1WTNScGIyNG9jbVZ6ZFd4MExDQmxjbklwZTF4dUlDQWdJQ0FnYVdZZ0tHVnljaWtnZTF4dUlDQWdJQ0FnSUNBdkx5Qm1ZV2xzZFhKbFhHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBdkx5QnpkV05qWlhOelhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlNrN1hHNGdJQ0FnWUdCZ1hHNGdJRnh1SUNBZ0lGQnliMjFwYzJVZ1JYaGhiWEJzWlR0Y2JpQWdYRzRnSUNBZ1lHQmdhbUYyWVhOamNtbHdkRnh1SUNBZ0lHWnBibVJTWlhOMWJIUW9LUzUwYUdWdUtHWjFibU4wYVc5dUtISmxjM1ZzZENsN1hHNGdJQ0FnSUNBdkx5QnpkV05qWlhOelhHNGdJQ0FnZlN3Z1puVnVZM1JwYjI0b2NtVmhjMjl1S1h0Y2JpQWdJQ0FnSUM4dklHWmhhV3gxY21WY2JpQWdJQ0I5S1R0Y2JpQWdJQ0JnWUdCY2JpQWdYRzRnSUNBZ1FXUjJZVzVqWldRZ1JYaGhiWEJzWlZ4dUlDQWdJQzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJRnh1SUNBZ0lGTjVibU5vY205dWIzVnpJRVY0WVcxd2JHVmNiaUFnWEc0Z0lDQWdZR0JnYW1GMllYTmpjbWx3ZEZ4dUlDQWdJR3hsZENCaGRYUm9iM0lzSUdKdmIydHpPMXh1SUNCY2JpQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ1lYVjBhRzl5SUQwZ1ptbHVaRUYxZEdodmNpZ3BPMXh1SUNBZ0lDQWdZbTl2YTNNZ0lEMGdabWx1WkVKdmIydHpRbmxCZFhSb2IzSW9ZWFYwYUc5eUtUdGNiaUFnSUNBZ0lDOHZJSE4xWTJObGMzTmNiaUFnSUNCOUlHTmhkR05vS0hKbFlYTnZiaWtnZTF4dUlDQWdJQ0FnTHk4Z1ptRnBiSFZ5WlZ4dUlDQWdJSDFjYmlBZ0lDQmdZR0JjYmlBZ1hHNGdJQ0FnUlhKeVltRmpheUJGZUdGdGNHeGxYRzRnSUZ4dUlDQWdJR0JnWUdwelhHNGdJRnh1SUNBZ0lHWjFibU4wYVc5dUlHWnZkVzVrUW05dmEzTW9ZbTl2YTNNcElIdGNiaUFnWEc0Z0lDQWdmVnh1SUNCY2JpQWdJQ0JtZFc1amRHbHZiaUJtWVdsc2RYSmxLSEpsWVhOdmJpa2dlMXh1SUNCY2JpQWdJQ0I5WEc0Z0lGeHVJQ0FnSUdacGJtUkJkWFJvYjNJb1puVnVZM1JwYjI0b1lYVjBhRzl5TENCbGNuSXBlMXh1SUNBZ0lDQWdhV1lnS0dWeWNpa2dlMXh1SUNBZ0lDQWdJQ0JtWVdsc2RYSmxLR1Z5Y2lrN1hHNGdJQ0FnSUNBZ0lDOHZJR1poYVd4MWNtVmNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lIUnllU0I3WEc0Z0lDQWdJQ0FnSUNBZ1ptbHVaRUp2YjI5cmMwSjVRWFYwYUc5eUtHRjFkR2h2Y2l3Z1puVnVZM1JwYjI0b1ltOXZhM01zSUdWeWNpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1Z5Y2lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCbVlXbHNkWEpsS0dWeWNpazdYRzRnSUNBZ0lDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHWnZkVzVrUW05dmEzTW9ZbTl2YTNNcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUlHTmhkR05vS0hKbFlYTnZiaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdaaGFXeDFjbVVvY21WaGMyOXVLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnSUNCOUlHTmhkR05vS0dWeWNtOXlLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1ptRnBiSFZ5WlNobGNuSXBPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUM4dklITjFZMk5sYzNOY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5S1R0Y2JpQWdJQ0JnWUdCY2JpQWdYRzRnSUNBZ1VISnZiV2x6WlNCRmVHRnRjR3hsTzF4dUlDQmNiaUFnSUNCZ1lHQnFZWFpoYzJOeWFYQjBYRzRnSUNBZ1ptbHVaRUYxZEdodmNpZ3BMbHh1SUNBZ0lDQWdkR2hsYmlobWFXNWtRbTl2YTNOQ2VVRjFkR2h2Y2lrdVhHNGdJQ0FnSUNCMGFHVnVLR1oxYm1OMGFXOXVLR0p2YjJ0ektYdGNiaUFnSUNBZ0lDQWdMeThnWm05MWJtUWdZbTl2YTNOY2JpQWdJQ0I5S1M1allYUmphQ2htZFc1amRHbHZiaWh5WldGemIyNHBlMXh1SUNBZ0lDQWdMeThnYzI5dFpYUm9hVzVuSUhkbGJuUWdkM0p2Ym1kY2JpQWdJQ0I5S1R0Y2JpQWdJQ0JnWUdCY2JpQWdYRzRnSUNBZ1FHMWxkR2h2WkNCMGFHVnVYRzRnSUNBZ1FIQmhjbUZ0SUh0R2RXNWpkR2x2Ym4wZ2IyNUdkV3htYVd4c1pXUmNiaUFnSUNCQWNHRnlZVzBnZTBaMWJtTjBhVzl1ZlNCdmJsSmxhbVZqZEdWa1hHNGdJQ0FnVlhObFpuVnNJR1p2Y2lCMGIyOXNhVzVuTGx4dUlDQWdJRUJ5WlhSMWNtNGdlMUJ5YjIxcGMyVjlYRzRnSUNvdlhHNGdJSFJvWlc0NklIUm9aVzRzWEc1Y2JpQWdMeW9xWEc0Z0lDQWdZR05oZEdOb1lDQnBjeUJ6YVcxd2JIa2djM1ZuWVhJZ1ptOXlJR0IwYUdWdUtIVnVaR1ZtYVc1bFpDd2diMjVTWldwbFkzUnBiMjRwWUNCM2FHbGphQ0J0WVd0bGN5QnBkQ0IwYUdVZ2MyRnRaVnh1SUNBZ0lHRnpJSFJvWlNCallYUmphQ0JpYkc5amF5QnZaaUJoSUhSeWVTOWpZWFJqYUNCemRHRjBaVzFsYm5RdVhHNGdJRnh1SUNBZ0lHQmdZR3B6WEc0Z0lDQWdablZ1WTNScGIyNGdabWx1WkVGMWRHaHZjaWdwZTF4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2RqYjNWc1pHNG5kQ0JtYVc1a0lIUm9ZWFFnWVhWMGFHOXlKeWs3WEc0Z0lDQWdmVnh1SUNCY2JpQWdJQ0F2THlCemVXNWphSEp2Ym05MWMxeHVJQ0FnSUhSeWVTQjdYRzRnSUNBZ0lDQm1hVzVrUVhWMGFHOXlLQ2s3WEc0Z0lDQWdmU0JqWVhSamFDaHlaV0Z6YjI0cElIdGNiaUFnSUNBZ0lDOHZJSE52YldWMGFHbHVaeUIzWlc1MElIZHliMjVuWEc0Z0lDQWdmVnh1SUNCY2JpQWdJQ0F2THlCaGMzbHVZeUIzYVhSb0lIQnliMjFwYzJWelhHNGdJQ0FnWm1sdVpFRjFkR2h2Y2lncExtTmhkR05vS0daMWJtTjBhVzl1S0hKbFlYTnZiaWw3WEc0Z0lDQWdJQ0F2THlCemIyMWxkR2hwYm1jZ2QyVnVkQ0IzY205dVoxeHVJQ0FnSUgwcE8xeHVJQ0FnSUdCZ1lGeHVJQ0JjYmlBZ0lDQkFiV1YwYUc5a0lHTmhkR05vWEc0Z0lDQWdRSEJoY21GdElIdEdkVzVqZEdsdmJuMGdiMjVTWldwbFkzUnBiMjVjYmlBZ0lDQlZjMlZtZFd3Z1ptOXlJSFJ2YjJ4cGJtY3VYRzRnSUNBZ1FISmxkSFZ5YmlCN1VISnZiV2x6WlgxY2JpQWdLaTljYmlBZ0oyTmhkR05vSnpvZ1puVnVZM1JwYjI0Z1gyTmhkR05vS0c5dVVtVnFaV04wYVc5dUtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVkR2hsYmlodWRXeHNMQ0J2YmxKbGFtVmpkR2x2YmlrN1hHNGdJSDFjYm4wN1hHNWNibVoxYm1OMGFXOXVJSEJ2YkhsbWFXeHNLQ2tnZTF4dUlDQWdJSFpoY2lCc2IyTmhiQ0E5SUhWdVpHVm1hVzVsWkR0Y2JseHVJQ0FnSUdsbUlDaDBlWEJsYjJZZ1oyeHZZbUZzSUNFOVBTQW5kVzVrWldacGJtVmtKeWtnZTF4dUlDQWdJQ0FnSUNCc2IyTmhiQ0E5SUdkc2IySmhiRHRjYmlBZ0lDQjlJR1ZzYzJVZ2FXWWdLSFI1Y0dWdlppQnpaV3htSUNFOVBTQW5kVzVrWldacGJtVmtKeWtnZTF4dUlDQWdJQ0FnSUNCc2IyTmhiQ0E5SUhObGJHWTdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ2RISjVJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHeHZZMkZzSUQwZ1JuVnVZM1JwYjI0b0ozSmxkSFZ5YmlCMGFHbHpKeWtvS1R0Y2JpQWdJQ0FnSUNBZ2ZTQmpZWFJqYUNBb1pTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Nkd2IyeDVabWxzYkNCbVlXbHNaV1FnWW1WallYVnpaU0JuYkc5aVlXd2diMkpxWldOMElHbHpJSFZ1WVhaaGFXeGhZbXhsSUdsdUlIUm9hWE1nWlc1MmFYSnZibTFsYm5RbktUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lIWmhjaUJRSUQwZ2JHOWpZV3d1VUhKdmJXbHpaVHRjYmx4dUlDQWdJR2xtSUNoUUtTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCd2NtOXRhWE5sVkc5VGRISnBibWNnUFNCdWRXeHNPMXh1SUNBZ0lDQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnY0hKdmJXbHpaVlJ2VTNSeWFXNW5JRDBnVDJKcVpXTjBMbkJ5YjNSdmRIbHdaUzUwYjFOMGNtbHVaeTVqWVd4c0tGQXVjbVZ6YjJ4MlpTZ3BLVHRjYmlBZ0lDQWdJQ0FnZlNCallYUmphQ0FvWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2MybHNaVzUwYkhrZ2FXZHViM0psWkZ4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0hCeWIyMXBjMlZVYjFOMGNtbHVaeUE5UFQwZ0oxdHZZbXBsWTNRZ1VISnZiV2x6WlYwbklDWW1JQ0ZRTG1OaGMzUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUd4dlkyRnNMbEJ5YjIxcGMyVWdQU0JRY205dGFYTmxPMXh1ZlZ4dVhHNHZMeUJUZEhKaGJtZGxJR052YlhCaGRDNHVYRzVRY205dGFYTmxMbkJ2YkhsbWFXeHNJRDBnY0c5c2VXWnBiR3c3WEc1UWNtOXRhWE5sTGxCeWIyMXBjMlVnUFNCUWNtOXRhWE5sTzF4dVhHNXlaWFIxY200Z1VISnZiV2x6WlR0Y2JseHVmU2twS1R0Y2JpOHZJeUJ6YjNWeVkyVk5ZWEJ3YVc1blZWSk1QV1Z6Tmkxd2NtOXRhWE5sTG0xaGNDSmRmUT09IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuTXV0YXRpb25PYnNlcnZlciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXI7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgdmFyIHF1ZXVlID0gW107XG5cbiAgICBpZiAoY2FuTXV0YXRpb25PYnNlcnZlcikge1xuICAgICAgICB2YXIgaGlkZGVuRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXVlTGlzdCA9IHF1ZXVlLnNsaWNlKCk7XG4gICAgICAgICAgICBxdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgcXVldWVMaXN0LmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGhpZGRlbkRpdiwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgaWYgKCFxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBoaWRkZW5EaXYuc2V0QXR0cmlidXRlKCd5ZXMnLCAnbm8nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlcGxhY2UgPSBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2U7XG52YXIgcGVyY2VudFR3ZW50aWVzID0gLyUyMC9nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAnZGVmYXVsdCc6ICdSRkMzOTg2JyxcbiAgICBmb3JtYXR0ZXJzOiB7XG4gICAgICAgIFJGQzE3Mzg6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2UuY2FsbCh2YWx1ZSwgcGVyY2VudFR3ZW50aWVzLCAnKycpO1xuICAgICAgICB9LFxuICAgICAgICBSRkMzOTg2OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgUkZDMTczODogJ1JGQzE3MzgnLFxuICAgIFJGQzM5ODY6ICdSRkMzOTg2J1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vc3RyaW5naWZ5Jyk7XG52YXIgcGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlJyk7XG52YXIgZm9ybWF0cyA9IHJlcXVpcmUoJy4vZm9ybWF0cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBmb3JtYXRzOiBmb3JtYXRzLFxuICAgIHBhcnNlOiBwYXJzZSxcbiAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxudmFyIGRlZmF1bHRzID0ge1xuICAgIGFsbG93RG90czogZmFsc2UsXG4gICAgYWxsb3dQcm90b3R5cGVzOiBmYWxzZSxcbiAgICBhcnJheUxpbWl0OiAyMCxcbiAgICBkZWNvZGVyOiB1dGlscy5kZWNvZGUsXG4gICAgZGVsaW1pdGVyOiAnJicsXG4gICAgZGVwdGg6IDUsXG4gICAgcGFyYW1ldGVyTGltaXQ6IDEwMDAsXG4gICAgcGxhaW5PYmplY3RzOiBmYWxzZSxcbiAgICBzdHJpY3ROdWxsSGFuZGxpbmc6IGZhbHNlXG59O1xuXG52YXIgcGFyc2VWYWx1ZXMgPSBmdW5jdGlvbiBwYXJzZVZhbHVlcyhzdHIsIG9wdGlvbnMpIHtcbiAgICB2YXIgb2JqID0ge307XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KG9wdGlvbnMuZGVsaW1pdGVyLCBvcHRpb25zLnBhcmFtZXRlckxpbWl0ID09PSBJbmZpbml0eSA/IHVuZGVmaW5lZCA6IG9wdGlvbnMucGFyYW1ldGVyTGltaXQpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgcGFydCA9IHBhcnRzW2ldO1xuICAgICAgICB2YXIgcG9zID0gcGFydC5pbmRleE9mKCddPScpID09PSAtMSA/IHBhcnQuaW5kZXhPZignPScpIDogcGFydC5pbmRleE9mKCddPScpICsgMTtcblxuICAgICAgICB2YXIga2V5LCB2YWw7XG4gICAgICAgIGlmIChwb3MgPT09IC0xKSB7XG4gICAgICAgICAgICBrZXkgPSBvcHRpb25zLmRlY29kZXIocGFydCk7XG4gICAgICAgICAgICB2YWwgPSBvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyA/IG51bGwgOiAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleSA9IG9wdGlvbnMuZGVjb2RlcihwYXJ0LnNsaWNlKDAsIHBvcykpO1xuICAgICAgICAgICAgdmFsID0gb3B0aW9ucy5kZWNvZGVyKHBhcnQuc2xpY2UocG9zICsgMSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXMuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgICAgIG9ialtrZXldID0gW10uY29uY2F0KG9ialtrZXldKS5jb25jYXQodmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9ialtrZXldID0gdmFsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBwYXJzZU9iamVjdCA9IGZ1bmN0aW9uIHBhcnNlT2JqZWN0KGNoYWluLCB2YWwsIG9wdGlvbnMpIHtcbiAgICBpZiAoIWNoYWluLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cblxuICAgIHZhciByb290ID0gY2hhaW4uc2hpZnQoKTtcblxuICAgIHZhciBvYmo7XG4gICAgaWYgKHJvb3QgPT09ICdbXScpIHtcbiAgICAgICAgb2JqID0gW107XG4gICAgICAgIG9iaiA9IG9iai5jb25jYXQocGFyc2VPYmplY3QoY2hhaW4sIHZhbCwgb3B0aW9ucykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9iaiA9IG9wdGlvbnMucGxhaW5PYmplY3RzID8gT2JqZWN0LmNyZWF0ZShudWxsKSA6IHt9O1xuICAgICAgICB2YXIgY2xlYW5Sb290ID0gcm9vdFswXSA9PT0gJ1snICYmIHJvb3Rbcm9vdC5sZW5ndGggLSAxXSA9PT0gJ10nID8gcm9vdC5zbGljZSgxLCByb290Lmxlbmd0aCAtIDEpIDogcm9vdDtcbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoY2xlYW5Sb290LCAxMCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICFpc05hTihpbmRleCkgJiZcbiAgICAgICAgICAgIHJvb3QgIT09IGNsZWFuUm9vdCAmJlxuICAgICAgICAgICAgU3RyaW5nKGluZGV4KSA9PT0gY2xlYW5Sb290ICYmXG4gICAgICAgICAgICBpbmRleCA+PSAwICYmXG4gICAgICAgICAgICAob3B0aW9ucy5wYXJzZUFycmF5cyAmJiBpbmRleCA8PSBvcHRpb25zLmFycmF5TGltaXQpXG4gICAgICAgICkge1xuICAgICAgICAgICAgb2JqID0gW107XG4gICAgICAgICAgICBvYmpbaW5kZXhdID0gcGFyc2VPYmplY3QoY2hhaW4sIHZhbCwgb3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmpbY2xlYW5Sb290XSA9IHBhcnNlT2JqZWN0KGNoYWluLCB2YWwsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBwYXJzZUtleXMgPSBmdW5jdGlvbiBwYXJzZUtleXMoZ2l2ZW5LZXksIHZhbCwgb3B0aW9ucykge1xuICAgIGlmICghZ2l2ZW5LZXkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRyYW5zZm9ybSBkb3Qgbm90YXRpb24gdG8gYnJhY2tldCBub3RhdGlvblxuICAgIHZhciBrZXkgPSBvcHRpb25zLmFsbG93RG90cyA/IGdpdmVuS2V5LnJlcGxhY2UoL1xcLihbXlxcLlxcW10rKS9nLCAnWyQxXScpIDogZ2l2ZW5LZXk7XG5cbiAgICAvLyBUaGUgcmVnZXggY2h1bmtzXG5cbiAgICB2YXIgcGFyZW50ID0gL14oW15cXFtcXF1dKikvO1xuICAgIHZhciBjaGlsZCA9IC8oXFxbW15cXFtcXF1dKlxcXSkvZztcblxuICAgIC8vIEdldCB0aGUgcGFyZW50XG5cbiAgICB2YXIgc2VnbWVudCA9IHBhcmVudC5leGVjKGtleSk7XG5cbiAgICAvLyBTdGFzaCB0aGUgcGFyZW50IGlmIGl0IGV4aXN0c1xuXG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBpZiAoc2VnbWVudFsxXSkge1xuICAgICAgICAvLyBJZiB3ZSBhcmVuJ3QgdXNpbmcgcGxhaW4gb2JqZWN0cywgb3B0aW9uYWxseSBwcmVmaXgga2V5c1xuICAgICAgICAvLyB0aGF0IHdvdWxkIG92ZXJ3cml0ZSBvYmplY3QgcHJvdG90eXBlIHByb3BlcnRpZXNcbiAgICAgICAgaWYgKCFvcHRpb25zLnBsYWluT2JqZWN0cyAmJiBoYXMuY2FsbChPYmplY3QucHJvdG90eXBlLCBzZWdtZW50WzFdKSkge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93UHJvdG90eXBlcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGtleXMucHVzaChzZWdtZW50WzFdKTtcbiAgICB9XG5cbiAgICAvLyBMb29wIHRocm91Z2ggY2hpbGRyZW4gYXBwZW5kaW5nIHRvIHRoZSBhcnJheSB1bnRpbCB3ZSBoaXQgZGVwdGhcblxuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoKHNlZ21lbnQgPSBjaGlsZC5leGVjKGtleSkpICE9PSBudWxsICYmIGkgPCBvcHRpb25zLmRlcHRoKSB7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgICAgaWYgKCFvcHRpb25zLnBsYWluT2JqZWN0cyAmJiBoYXMuY2FsbChPYmplY3QucHJvdG90eXBlLCBzZWdtZW50WzFdLnJlcGxhY2UoL1xcW3xcXF0vZywgJycpKSkge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93UHJvdG90eXBlcykge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGtleXMucHVzaChzZWdtZW50WzFdKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSdzIGEgcmVtYWluZGVyLCBqdXN0IGFkZCB3aGF0ZXZlciBpcyBsZWZ0XG5cbiAgICBpZiAoc2VnbWVudCkge1xuICAgICAgICBrZXlzLnB1c2goJ1snICsga2V5LnNsaWNlKHNlZ21lbnQuaW5kZXgpICsgJ10nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VPYmplY3Qoa2V5cywgdmFsLCBvcHRpb25zKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0ciwgb3B0cykge1xuICAgIHZhciBvcHRpb25zID0gb3B0cyB8fCB7fTtcblxuICAgIGlmIChvcHRpb25zLmRlY29kZXIgIT09IG51bGwgJiYgb3B0aW9ucy5kZWNvZGVyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMuZGVjb2RlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdEZWNvZGVyIGhhcyB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIG9wdGlvbnMuZGVsaW1pdGVyID0gdHlwZW9mIG9wdGlvbnMuZGVsaW1pdGVyID09PSAnc3RyaW5nJyB8fCB1dGlscy5pc1JlZ0V4cChvcHRpb25zLmRlbGltaXRlcikgPyBvcHRpb25zLmRlbGltaXRlciA6IGRlZmF1bHRzLmRlbGltaXRlcjtcbiAgICBvcHRpb25zLmRlcHRoID0gdHlwZW9mIG9wdGlvbnMuZGVwdGggPT09ICdudW1iZXInID8gb3B0aW9ucy5kZXB0aCA6IGRlZmF1bHRzLmRlcHRoO1xuICAgIG9wdGlvbnMuYXJyYXlMaW1pdCA9IHR5cGVvZiBvcHRpb25zLmFycmF5TGltaXQgPT09ICdudW1iZXInID8gb3B0aW9ucy5hcnJheUxpbWl0IDogZGVmYXVsdHMuYXJyYXlMaW1pdDtcbiAgICBvcHRpb25zLnBhcnNlQXJyYXlzID0gb3B0aW9ucy5wYXJzZUFycmF5cyAhPT0gZmFsc2U7XG4gICAgb3B0aW9ucy5kZWNvZGVyID0gdHlwZW9mIG9wdGlvbnMuZGVjb2RlciA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuZGVjb2RlciA6IGRlZmF1bHRzLmRlY29kZXI7XG4gICAgb3B0aW9ucy5hbGxvd0RvdHMgPSB0eXBlb2Ygb3B0aW9ucy5hbGxvd0RvdHMgPT09ICdib29sZWFuJyA/IG9wdGlvbnMuYWxsb3dEb3RzIDogZGVmYXVsdHMuYWxsb3dEb3RzO1xuICAgIG9wdGlvbnMucGxhaW5PYmplY3RzID0gdHlwZW9mIG9wdGlvbnMucGxhaW5PYmplY3RzID09PSAnYm9vbGVhbicgPyBvcHRpb25zLnBsYWluT2JqZWN0cyA6IGRlZmF1bHRzLnBsYWluT2JqZWN0cztcbiAgICBvcHRpb25zLmFsbG93UHJvdG90eXBlcyA9IHR5cGVvZiBvcHRpb25zLmFsbG93UHJvdG90eXBlcyA9PT0gJ2Jvb2xlYW4nID8gb3B0aW9ucy5hbGxvd1Byb3RvdHlwZXMgOiBkZWZhdWx0cy5hbGxvd1Byb3RvdHlwZXM7XG4gICAgb3B0aW9ucy5wYXJhbWV0ZXJMaW1pdCA9IHR5cGVvZiBvcHRpb25zLnBhcmFtZXRlckxpbWl0ID09PSAnbnVtYmVyJyA/IG9wdGlvbnMucGFyYW1ldGVyTGltaXQgOiBkZWZhdWx0cy5wYXJhbWV0ZXJMaW1pdDtcbiAgICBvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyA9IHR5cGVvZiBvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyA9PT0gJ2Jvb2xlYW4nID8gb3B0aW9ucy5zdHJpY3ROdWxsSGFuZGxpbmcgOiBkZWZhdWx0cy5zdHJpY3ROdWxsSGFuZGxpbmc7XG5cbiAgICBpZiAoc3RyID09PSAnJyB8fCBzdHIgPT09IG51bGwgfHwgdHlwZW9mIHN0ciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMucGxhaW5PYmplY3RzID8gT2JqZWN0LmNyZWF0ZShudWxsKSA6IHt9O1xuICAgIH1cblxuICAgIHZhciB0ZW1wT2JqID0gdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgPyBwYXJzZVZhbHVlcyhzdHIsIG9wdGlvbnMpIDogc3RyO1xuICAgIHZhciBvYmogPSBvcHRpb25zLnBsYWluT2JqZWN0cyA/IE9iamVjdC5jcmVhdGUobnVsbCkgOiB7fTtcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUga2V5cyBhbmQgc2V0dXAgdGhlIG5ldyBvYmplY3RcblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGVtcE9iaik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICB2YXIgbmV3T2JqID0gcGFyc2VLZXlzKGtleSwgdGVtcE9ialtrZXldLCBvcHRpb25zKTtcbiAgICAgICAgb2JqID0gdXRpbHMubWVyZ2Uob2JqLCBuZXdPYmosIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB1dGlscy5jb21wYWN0KG9iaik7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgZm9ybWF0cyA9IHJlcXVpcmUoJy4vZm9ybWF0cycpO1xuXG52YXIgYXJyYXlQcmVmaXhHZW5lcmF0b3JzID0ge1xuICAgIGJyYWNrZXRzOiBmdW5jdGlvbiBicmFja2V0cyhwcmVmaXgpIHtcbiAgICAgICAgcmV0dXJuIHByZWZpeCArICdbXSc7XG4gICAgfSxcbiAgICBpbmRpY2VzOiBmdW5jdGlvbiBpbmRpY2VzKHByZWZpeCwga2V5KSB7XG4gICAgICAgIHJldHVybiBwcmVmaXggKyAnWycgKyBrZXkgKyAnXSc7XG4gICAgfSxcbiAgICByZXBlYXQ6IGZ1bmN0aW9uIHJlcGVhdChwcmVmaXgpIHtcbiAgICAgICAgcmV0dXJuIHByZWZpeDtcbiAgICB9XG59O1xuXG52YXIgdG9JU08gPSBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZztcblxudmFyIGRlZmF1bHRzID0ge1xuICAgIGRlbGltaXRlcjogJyYnLFxuICAgIGVuY29kZTogdHJ1ZSxcbiAgICBlbmNvZGVyOiB1dGlscy5lbmNvZGUsXG4gICAgc2VyaWFsaXplRGF0ZTogZnVuY3Rpb24gc2VyaWFsaXplRGF0ZShkYXRlKSB7XG4gICAgICAgIHJldHVybiB0b0lTTy5jYWxsKGRhdGUpO1xuICAgIH0sXG4gICAgc2tpcE51bGxzOiBmYWxzZSxcbiAgICBzdHJpY3ROdWxsSGFuZGxpbmc6IGZhbHNlXG59O1xuXG52YXIgc3RyaW5naWZ5ID0gZnVuY3Rpb24gc3RyaW5naWZ5KG9iamVjdCwgcHJlZml4LCBnZW5lcmF0ZUFycmF5UHJlZml4LCBzdHJpY3ROdWxsSGFuZGxpbmcsIHNraXBOdWxscywgZW5jb2RlciwgZmlsdGVyLCBzb3J0LCBhbGxvd0RvdHMsIHNlcmlhbGl6ZURhdGUsIGZvcm1hdHRlcikge1xuICAgIHZhciBvYmogPSBvYmplY3Q7XG4gICAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb2JqID0gZmlsdGVyKHByZWZpeCwgb2JqKTtcbiAgICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgb2JqID0gc2VyaWFsaXplRGF0ZShvYmopO1xuICAgIH0gZWxzZSBpZiAob2JqID09PSBudWxsKSB7XG4gICAgICAgIGlmIChzdHJpY3ROdWxsSGFuZGxpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBlbmNvZGVyID8gZW5jb2RlcihwcmVmaXgpIDogcHJlZml4O1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqID0gJyc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBvYmogPT09ICdudW1iZXInIHx8IHR5cGVvZiBvYmogPT09ICdib29sZWFuJyB8fCB1dGlscy5pc0J1ZmZlcihvYmopKSB7XG4gICAgICAgIGlmIChlbmNvZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gW2Zvcm1hdHRlcihlbmNvZGVyKHByZWZpeCkpICsgJz0nICsgZm9ybWF0dGVyKGVuY29kZXIob2JqKSldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbZm9ybWF0dGVyKHByZWZpeCkgKyAnPScgKyBmb3JtYXR0ZXIoU3RyaW5nKG9iaikpXTtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG5cbiAgICB2YXIgb2JqS2V5cztcbiAgICBpZiAoQXJyYXkuaXNBcnJheShmaWx0ZXIpKSB7XG4gICAgICAgIG9iaktleXMgPSBmaWx0ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgICBvYmpLZXlzID0gc29ydCA/IGtleXMuc29ydChzb3J0KSA6IGtleXM7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpLZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBvYmpLZXlzW2ldO1xuXG4gICAgICAgIGlmIChza2lwTnVsbHMgJiYgb2JqW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzLmNvbmNhdChzdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgb2JqW2tleV0sXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeChwcmVmaXgsIGtleSksXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeCxcbiAgICAgICAgICAgICAgICBzdHJpY3ROdWxsSGFuZGxpbmcsXG4gICAgICAgICAgICAgICAgc2tpcE51bGxzLFxuICAgICAgICAgICAgICAgIGVuY29kZXIsXG4gICAgICAgICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgICAgICAgIHNvcnQsXG4gICAgICAgICAgICAgICAgYWxsb3dEb3RzLFxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZURhdGUsXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlcyA9IHZhbHVlcy5jb25jYXQoc3RyaW5naWZ5KFxuICAgICAgICAgICAgICAgIG9ialtrZXldLFxuICAgICAgICAgICAgICAgIHByZWZpeCArIChhbGxvd0RvdHMgPyAnLicgKyBrZXkgOiAnWycgKyBrZXkgKyAnXScpLFxuICAgICAgICAgICAgICAgIGdlbmVyYXRlQXJyYXlQcmVmaXgsXG4gICAgICAgICAgICAgICAgc3RyaWN0TnVsbEhhbmRsaW5nLFxuICAgICAgICAgICAgICAgIHNraXBOdWxscyxcbiAgICAgICAgICAgICAgICBlbmNvZGVyLFxuICAgICAgICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICAgICAgICBzb3J0LFxuICAgICAgICAgICAgICAgIGFsbG93RG90cyxcbiAgICAgICAgICAgICAgICBzZXJpYWxpemVEYXRlLFxuICAgICAgICAgICAgICAgIGZvcm1hdHRlclxuICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBvcHRzKSB7XG4gICAgdmFyIG9iaiA9IG9iamVjdDtcbiAgICB2YXIgb3B0aW9ucyA9IG9wdHMgfHwge307XG4gICAgdmFyIGRlbGltaXRlciA9IHR5cGVvZiBvcHRpb25zLmRlbGltaXRlciA9PT0gJ3VuZGVmaW5lZCcgPyBkZWZhdWx0cy5kZWxpbWl0ZXIgOiBvcHRpb25zLmRlbGltaXRlcjtcbiAgICB2YXIgc3RyaWN0TnVsbEhhbmRsaW5nID0gdHlwZW9mIG9wdGlvbnMuc3RyaWN0TnVsbEhhbmRsaW5nID09PSAnYm9vbGVhbicgPyBvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyA6IGRlZmF1bHRzLnN0cmljdE51bGxIYW5kbGluZztcbiAgICB2YXIgc2tpcE51bGxzID0gdHlwZW9mIG9wdGlvbnMuc2tpcE51bGxzID09PSAnYm9vbGVhbicgPyBvcHRpb25zLnNraXBOdWxscyA6IGRlZmF1bHRzLnNraXBOdWxscztcbiAgICB2YXIgZW5jb2RlID0gdHlwZW9mIG9wdGlvbnMuZW5jb2RlID09PSAnYm9vbGVhbicgPyBvcHRpb25zLmVuY29kZSA6IGRlZmF1bHRzLmVuY29kZTtcbiAgICB2YXIgZW5jb2RlciA9IGVuY29kZSA/ICh0eXBlb2Ygb3B0aW9ucy5lbmNvZGVyID09PSAnZnVuY3Rpb24nID8gb3B0aW9ucy5lbmNvZGVyIDogZGVmYXVsdHMuZW5jb2RlcikgOiBudWxsO1xuICAgIHZhciBzb3J0ID0gdHlwZW9mIG9wdGlvbnMuc29ydCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuc29ydCA6IG51bGw7XG4gICAgdmFyIGFsbG93RG90cyA9IHR5cGVvZiBvcHRpb25zLmFsbG93RG90cyA9PT0gJ3VuZGVmaW5lZCcgPyBmYWxzZSA6IG9wdGlvbnMuYWxsb3dEb3RzO1xuICAgIHZhciBzZXJpYWxpemVEYXRlID0gdHlwZW9mIG9wdGlvbnMuc2VyaWFsaXplRGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuc2VyaWFsaXplRGF0ZSA6IGRlZmF1bHRzLnNlcmlhbGl6ZURhdGU7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmZvcm1hdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgb3B0aW9ucy5mb3JtYXQgPSBmb3JtYXRzLmRlZmF1bHQ7XG4gICAgfSBlbHNlIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGZvcm1hdHMuZm9ybWF0dGVycywgb3B0aW9ucy5mb3JtYXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZm9ybWF0IG9wdGlvbiBwcm92aWRlZC4nKTtcbiAgICB9XG4gICAgdmFyIGZvcm1hdHRlciA9IGZvcm1hdHMuZm9ybWF0dGVyc1tvcHRpb25zLmZvcm1hdF07XG4gICAgdmFyIG9iaktleXM7XG4gICAgdmFyIGZpbHRlcjtcblxuICAgIGlmIChvcHRpb25zLmVuY29kZXIgIT09IG51bGwgJiYgb3B0aW9ucy5lbmNvZGVyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMuZW5jb2RlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFbmNvZGVyIGhhcyB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5maWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZmlsdGVyID0gb3B0aW9ucy5maWx0ZXI7XG4gICAgICAgIG9iaiA9IGZpbHRlcignJywgb2JqKTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5maWx0ZXIpKSB7XG4gICAgICAgIGZpbHRlciA9IG9wdGlvbnMuZmlsdGVyO1xuICAgICAgICBvYmpLZXlzID0gZmlsdGVyO1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gW107XG5cbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICB2YXIgYXJyYXlGb3JtYXQ7XG4gICAgaWYgKG9wdGlvbnMuYXJyYXlGb3JtYXQgaW4gYXJyYXlQcmVmaXhHZW5lcmF0b3JzKSB7XG4gICAgICAgIGFycmF5Rm9ybWF0ID0gb3B0aW9ucy5hcnJheUZvcm1hdDtcbiAgICB9IGVsc2UgaWYgKCdpbmRpY2VzJyBpbiBvcHRpb25zKSB7XG4gICAgICAgIGFycmF5Rm9ybWF0ID0gb3B0aW9ucy5pbmRpY2VzID8gJ2luZGljZXMnIDogJ3JlcGVhdCc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXlGb3JtYXQgPSAnaW5kaWNlcyc7XG4gICAgfVxuXG4gICAgdmFyIGdlbmVyYXRlQXJyYXlQcmVmaXggPSBhcnJheVByZWZpeEdlbmVyYXRvcnNbYXJyYXlGb3JtYXRdO1xuXG4gICAgaWYgKCFvYmpLZXlzKSB7XG4gICAgICAgIG9iaktleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIH1cblxuICAgIGlmIChzb3J0KSB7XG4gICAgICAgIG9iaktleXMuc29ydChzb3J0KTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iaktleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IG9iaktleXNbaV07XG5cbiAgICAgICAgaWYgKHNraXBOdWxscyAmJiBvYmpba2V5XSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBrZXlzID0ga2V5cy5jb25jYXQoc3RyaW5naWZ5KFxuICAgICAgICAgICAgb2JqW2tleV0sXG4gICAgICAgICAgICBrZXksXG4gICAgICAgICAgICBnZW5lcmF0ZUFycmF5UHJlZml4LFxuICAgICAgICAgICAgc3RyaWN0TnVsbEhhbmRsaW5nLFxuICAgICAgICAgICAgc2tpcE51bGxzLFxuICAgICAgICAgICAgZW5jb2RlcixcbiAgICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICAgIHNvcnQsXG4gICAgICAgICAgICBhbGxvd0RvdHMsXG4gICAgICAgICAgICBzZXJpYWxpemVEYXRlLFxuICAgICAgICAgICAgZm9ybWF0dGVyXG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIHJldHVybiBrZXlzLmpvaW4oZGVsaW1pdGVyKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgaGV4VGFibGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcnJheSA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgICAgICAgYXJyYXkucHVzaCgnJScgKyAoKGkgPCAxNiA/ICcwJyA6ICcnKSArIGkudG9TdHJpbmcoMTYpKS50b1VwcGVyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG59KCkpO1xuXG5leHBvcnRzLmFycmF5VG9PYmplY3QgPSBmdW5jdGlvbiAoc291cmNlLCBvcHRpb25zKSB7XG4gICAgdmFyIG9iaiA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wbGFpbk9iamVjdHMgPyBPYmplY3QuY3JlYXRlKG51bGwpIDoge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2VbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvYmpbaV0gPSBzb3VyY2VbaV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuICAgIGlmICghc291cmNlKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzb3VyY2UgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgICAgIHRhcmdldC5wdXNoKHNvdXJjZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRhcmdldFtzb3VyY2VdID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbdGFyZ2V0LCBzb3VyY2VdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIFt0YXJnZXRdLmNvbmNhdChzb3VyY2UpO1xuICAgIH1cblxuICAgIHZhciBtZXJnZVRhcmdldCA9IHRhcmdldDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpICYmICFBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgICAgbWVyZ2VUYXJnZXQgPSBleHBvcnRzLmFycmF5VG9PYmplY3QodGFyZ2V0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpICYmIEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICBzb3VyY2UuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgaWYgKGhhcy5jYWxsKHRhcmdldCwgaSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0W2ldICYmIHR5cGVvZiB0YXJnZXRbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFtpXSA9IGV4cG9ydHMubWVyZ2UodGFyZ2V0W2ldLCBpdGVtLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFtpXSA9IGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3Qua2V5cyhzb3VyY2UpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gc291cmNlW2tleV07XG5cbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhY2MsIGtleSkpIHtcbiAgICAgICAgICAgIGFjY1trZXldID0gZXhwb3J0cy5tZXJnZShhY2Nba2V5XSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWNjW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIG1lcmdlVGFyZ2V0KTtcbn07XG5cbmV4cG9ydHMuZGVjb2RlID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxufTtcblxuZXhwb3J0cy5lbmNvZGUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgLy8gVGhpcyBjb2RlIHdhcyBvcmlnaW5hbGx5IHdyaXR0ZW4gYnkgQnJpYW4gV2hpdGUgKG1zY2RleCkgZm9yIHRoZSBpby5qcyBjb3JlIHF1ZXJ5c3RyaW5nIGxpYnJhcnkuXG4gICAgLy8gSXQgaGFzIGJlZW4gYWRhcHRlZCBoZXJlIGZvciBzdHJpY3RlciBhZGhlcmVuY2UgdG8gUkZDIDM5ODZcbiAgICBpZiAoc3RyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIHZhciBzdHJpbmcgPSB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyA/IHN0ciA6IFN0cmluZyhzdHIpO1xuXG4gICAgdmFyIG91dCA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBjID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgYyA9PT0gMHgyRCB8fCAvLyAtXG4gICAgICAgICAgICBjID09PSAweDJFIHx8IC8vIC5cbiAgICAgICAgICAgIGMgPT09IDB4NUYgfHwgLy8gX1xuICAgICAgICAgICAgYyA9PT0gMHg3RSB8fCAvLyB+XG4gICAgICAgICAgICAoYyA+PSAweDMwICYmIGMgPD0gMHgzOSkgfHwgLy8gMC05XG4gICAgICAgICAgICAoYyA+PSAweDQxICYmIGMgPD0gMHg1QSkgfHwgLy8gYS16XG4gICAgICAgICAgICAoYyA+PSAweDYxICYmIGMgPD0gMHg3QSkgLy8gQS1aXG4gICAgICAgICkge1xuICAgICAgICAgICAgb3V0ICs9IHN0cmluZy5jaGFyQXQoaSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjIDwgMHg4MCkge1xuICAgICAgICAgICAgb3V0ID0gb3V0ICsgaGV4VGFibGVbY107XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjIDwgMHg4MDApIHtcbiAgICAgICAgICAgIG91dCA9IG91dCArIChoZXhUYWJsZVsweEMwIHwgKGMgPj4gNildICsgaGV4VGFibGVbMHg4MCB8IChjICYgMHgzRildKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGMgPCAweEQ4MDAgfHwgYyA+PSAweEUwMDApIHtcbiAgICAgICAgICAgIG91dCA9IG91dCArIChoZXhUYWJsZVsweEUwIHwgKGMgPj4gMTIpXSArIGhleFRhYmxlWzB4ODAgfCAoKGMgPj4gNikgJiAweDNGKV0gKyBoZXhUYWJsZVsweDgwIHwgKGMgJiAweDNGKV0pO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpICs9IDE7XG4gICAgICAgIGMgPSAweDEwMDAwICsgKCgoYyAmIDB4M0ZGKSA8PCAxMCkgfCAoc3RyaW5nLmNoYXJDb2RlQXQoaSkgJiAweDNGRikpO1xuICAgICAgICBvdXQgKz0gaGV4VGFibGVbMHhGMCB8IChjID4+IDE4KV0gKyBoZXhUYWJsZVsweDgwIHwgKChjID4+IDEyKSAmIDB4M0YpXSArIGhleFRhYmxlWzB4ODAgfCAoKGMgPj4gNikgJiAweDNGKV0gKyBoZXhUYWJsZVsweDgwIHwgKGMgJiAweDNGKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbmV4cG9ydHMuY29tcGFjdCA9IGZ1bmN0aW9uIChvYmosIHJlZmVyZW5jZXMpIHtcbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgdmFyIHJlZnMgPSByZWZlcmVuY2VzIHx8IFtdO1xuICAgIHZhciBsb29rdXAgPSByZWZzLmluZGV4T2Yob2JqKTtcbiAgICBpZiAobG9va3VwICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gcmVmc1tsb29rdXBdO1xuICAgIH1cblxuICAgIHJlZnMucHVzaChvYmopO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICB2YXIgY29tcGFjdGVkID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChvYmpbaV0gJiYgdHlwZW9mIG9ialtpXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBjb21wYWN0ZWQucHVzaChleHBvcnRzLmNvbXBhY3Qob2JqW2ldLCByZWZzKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgY29tcGFjdGVkLnB1c2gob2JqW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb21wYWN0ZWQ7XG4gICAgfVxuXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIG9ialtrZXldID0gZXhwb3J0cy5jb21wYWN0KG9ialtrZXldLCByZWZzKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnRzLmlzUmVnRXhwID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59O1xuXG5leHBvcnRzLmlzQnVmZmVyID0gZnVuY3Rpb24gKG9iaikge1xuICAgIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAhIShvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopKTtcbn07XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsKXtcbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJyksdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTkxZEdsc0wzVjBhV3d1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWp0QlFVRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFaUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaTh2SUVOdmNIbHlhV2RvZENCS2IzbGxiblFzSUVsdVl5NGdZVzVrSUc5MGFHVnlJRTV2WkdVZ1kyOXVkSEpwWW5WMGIzSnpMbHh1THk5Y2JpOHZJRkJsY20xcGMzTnBiMjRnYVhNZ2FHVnlaV0o1SUdkeVlXNTBaV1FzSUdaeVpXVWdiMllnWTJoaGNtZGxMQ0IwYnlCaGJua2djR1Z5YzI5dUlHOWlkR0ZwYm1sdVp5QmhYRzR2THlCamIzQjVJRzltSUhSb2FYTWdjMjltZEhkaGNtVWdZVzVrSUdGemMyOWphV0YwWldRZ1pHOWpkVzFsYm5SaGRHbHZiaUJtYVd4bGN5QW9kR2hsWEc0dkx5QmNJbE52Wm5SM1lYSmxYQ0lwTENCMGJ5QmtaV0ZzSUdsdUlIUm9aU0JUYjJaMGQyRnlaU0IzYVhSb2IzVjBJSEpsYzNSeWFXTjBhVzl1TENCcGJtTnNkV1JwYm1kY2JpOHZJSGRwZEdodmRYUWdiR2x0YVhSaGRHbHZiaUIwYUdVZ2NtbG5hSFJ6SUhSdklIVnpaU3dnWTI5d2VTd2diVzlrYVdaNUxDQnRaWEpuWlN3Z2NIVmliR2x6YUN4Y2JpOHZJR1JwYzNSeWFXSjFkR1VzSUhOMVlteHBZMlZ1YzJVc0lHRnVaQzl2Y2lCelpXeHNJR052Y0dsbGN5QnZaaUIwYUdVZ1UyOW1kSGRoY21Vc0lHRnVaQ0IwYnlCd1pYSnRhWFJjYmk4dklIQmxjbk52Ym5NZ2RHOGdkMmh2YlNCMGFHVWdVMjltZEhkaGNtVWdhWE1nWm5WeWJtbHphR1ZrSUhSdklHUnZJSE52TENCemRXSnFaV04wSUhSdklIUm9aVnh1THk4Z1ptOXNiRzkzYVc1bklHTnZibVJwZEdsdmJuTTZYRzR2TDF4dUx5OGdWR2hsSUdGaWIzWmxJR052Y0hseWFXZG9kQ0J1YjNScFkyVWdZVzVrSUhSb2FYTWdjR1Z5YldsemMybHZiaUJ1YjNScFkyVWdjMmhoYkd3Z1ltVWdhVzVqYkhWa1pXUmNiaTh2SUdsdUlHRnNiQ0JqYjNCcFpYTWdiM0lnYzNWaWMzUmhiblJwWVd3Z2NHOXlkR2x2Ym5NZ2IyWWdkR2hsSUZOdlpuUjNZWEpsTGx4dUx5OWNiaTh2SUZSSVJTQlRUMFpVVjBGU1JTQkpVeUJRVWs5V1NVUkZSQ0JjSWtGVElFbFRYQ0lzSUZkSlZFaFBWVlFnVjBGU1VrRk9WRmtnVDBZZ1FVNVpJRXRKVGtRc0lFVllVRkpGVTFOY2JpOHZJRTlTSUVsTlVFeEpSVVFzSUVsT1EweFZSRWxPUnlCQ1ZWUWdUazlVSUV4SlRVbFVSVVFnVkU4Z1ZFaEZJRmRCVWxKQlRsUkpSVk1nVDBaY2JpOHZJRTFGVWtOSVFVNVVRVUpKVEVsVVdTd2dSa2xVVGtWVFV5QkdUMUlnUVNCUVFWSlVTVU5WVEVGU0lGQlZVbEJQVTBVZ1FVNUVJRTVQVGtsT1JsSkpUa2RGVFVWT1ZDNGdTVTVjYmk4dklFNVBJRVZXUlU1VUlGTklRVXhNSUZSSVJTQkJWVlJJVDFKVElFOVNJRU5QVUZsU1NVZElWQ0JJVDB4RVJWSlRJRUpGSUV4SlFVSk1SU0JHVDFJZ1FVNVpJRU5NUVVsTkxGeHVMeThnUkVGTlFVZEZVeUJQVWlCUFZFaEZVaUJNU1VGQ1NVeEpWRmtzSUZkSVJWUklSVklnU1U0Z1FVNGdRVU5VU1U5T0lFOUdJRU5QVGxSU1FVTlVMQ0JVVDFKVUlFOVNYRzR2THlCUFZFaEZVbGRKVTBVc0lFRlNTVk5KVGtjZ1JsSlBUU3dnVDFWVUlFOUdJRTlTSUVsT0lFTlBUazVGUTFSSlQwNGdWMGxVU0NCVVNFVWdVMDlHVkZkQlVrVWdUMUlnVkVoRlhHNHZMeUJWVTBVZ1QxSWdUMVJJUlZJZ1JFVkJURWxPUjFNZ1NVNGdWRWhGSUZOUFJsUlhRVkpGTGx4dVhHNTJZWElnWm05eWJXRjBVbVZuUlhod0lEMGdMeVZiYzJScUpWMHZaenRjYm1WNGNHOXlkSE11Wm05eWJXRjBJRDBnWm5WdVkzUnBiMjRvWmlrZ2UxeHVJQ0JwWmlBb0lXbHpVM1J5YVc1bktHWXBLU0I3WEc0Z0lDQWdkbUZ5SUc5aWFtVmpkSE1nUFNCYlhUdGNiaUFnSUNCbWIzSWdLSFpoY2lCcElEMGdNRHNnYVNBOElHRnlaM1Z0Wlc1MGN5NXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJQ0FnYjJKcVpXTjBjeTV3ZFhOb0tHbHVjM0JsWTNRb1lYSm5kVzFsYm5SelcybGRLU2s3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCdlltcGxZM1J6TG1wdmFXNG9KeUFuS1R0Y2JpQWdmVnh1WEc0Z0lIWmhjaUJwSUQwZ01UdGNiaUFnZG1GeUlHRnlaM01nUFNCaGNtZDFiV1Z1ZEhNN1hHNGdJSFpoY2lCc1pXNGdQU0JoY21kekxteGxibWQwYUR0Y2JpQWdkbUZ5SUhOMGNpQTlJRk4wY21sdVp5aG1LUzV5WlhCc1lXTmxLR1p2Y20xaGRGSmxaMFY0Y0N3Z1puVnVZM1JwYjI0b2VDa2dlMXh1SUNBZ0lHbG1JQ2g0SUQwOVBTQW5KU1VuS1NCeVpYUjFjbTRnSnlVbk8xeHVJQ0FnSUdsbUlDaHBJRDQ5SUd4bGJpa2djbVYwZFhKdUlIZzdYRzRnSUNBZ2MzZHBkR05vSUNoNEtTQjdYRzRnSUNBZ0lDQmpZWE5sSUNjbGN5YzZJSEpsZEhWeWJpQlRkSEpwYm1jb1lYSm5jMXRwS3l0ZEtUdGNiaUFnSUNBZ0lHTmhjMlVnSnlWa0p6b2djbVYwZFhKdUlFNTFiV0psY2loaGNtZHpXMmtySzEwcE8xeHVJQ0FnSUNBZ1kyRnpaU0FuSldvbk9seHVJQ0FnSUNBZ0lDQjBjbmtnZTF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCS1UwOU9Mbk4wY21sdVoybG1lU2hoY21kelcya3JLMTBwTzF4dUlDQWdJQ0FnSUNCOUlHTmhkR05vSUNoZktTQjdYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQ2RiUTJseVkzVnNZWEpkSnp0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ1pHVm1ZWFZzZERwY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhnN1hHNGdJQ0FnZlZ4dUlDQjlLVHRjYmlBZ1ptOXlJQ2gyWVhJZ2VDQTlJR0Z5WjNOYmFWMDdJR2tnUENCc1pXNDdJSGdnUFNCaGNtZHpXeXNyYVYwcElIdGNiaUFnSUNCcFppQW9hWE5PZFd4c0tIZ3BJSHg4SUNGcGMwOWlhbVZqZENoNEtTa2dlMXh1SUNBZ0lDQWdjM1J5SUNzOUlDY2dKeUFySUhnN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSE4wY2lBclBTQW5JQ2NnS3lCcGJuTndaV04wS0hncE8xeHVJQ0FnSUgxY2JpQWdmVnh1SUNCeVpYUjFjbTRnYzNSeU8xeHVmVHRjYmx4dVhHNHZMeUJOWVhKcklIUm9ZWFFnWVNCdFpYUm9iMlFnYzJodmRXeGtJRzV2ZENCaVpTQjFjMlZrTGx4dUx5OGdVbVYwZFhKdWN5QmhJRzF2WkdsbWFXVmtJR1oxYm1OMGFXOXVJSGRvYVdOb0lIZGhjbTV6SUc5dVkyVWdZbmtnWkdWbVlYVnNkQzVjYmk4dklFbG1JQzB0Ym04dFpHVndjbVZqWVhScGIyNGdhWE1nYzJWMExDQjBhR1Z1SUdsMElHbHpJR0VnYm04dGIzQXVYRzVsZUhCdmNuUnpMbVJsY0hKbFkyRjBaU0E5SUdaMWJtTjBhVzl1S0dadUxDQnRjMmNwSUh0Y2JpQWdMeThnUVd4c2IzY2dabTl5SUdSbGNISmxZMkYwYVc1bklIUm9hVzVuY3lCcGJpQjBhR1VnY0hKdlkyVnpjeUJ2WmlCemRHRnlkR2x1WnlCMWNDNWNiaUFnYVdZZ0tHbHpWVzVrWldacGJtVmtLR2RzYjJKaGJDNXdjbTlqWlhOektTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCbGVIQnZjblJ6TG1SbGNISmxZMkYwWlNobWJpd2diWE5uS1M1aGNIQnNlU2gwYUdsekxDQmhjbWQxYldWdWRITXBPMXh1SUNBZ0lIMDdYRzRnSUgxY2JseHVJQ0JwWmlBb2NISnZZMlZ6Y3k1dWIwUmxjSEpsWTJGMGFXOXVJRDA5UFNCMGNuVmxLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHWnVPMXh1SUNCOVhHNWNiaUFnZG1GeUlIZGhjbTVsWkNBOUlHWmhiSE5sTzF4dUlDQm1kVzVqZEdsdmJpQmtaWEJ5WldOaGRHVmtLQ2tnZTF4dUlDQWdJR2xtSUNnaGQyRnlibVZrS1NCN1hHNGdJQ0FnSUNCcFppQW9jSEp2WTJWemN5NTBhSEp2ZDBSbGNISmxZMkYwYVc5dUtTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaHRjMmNwTzF4dUlDQWdJQ0FnZlNCbGJITmxJR2xtSUNod2NtOWpaWE56TG5SeVlXTmxSR1Z3Y21WallYUnBiMjRwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1MGNtRmpaU2h0YzJjcE8xeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1bGNuSnZjaWh0YzJjcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2QyRnlibVZrSUQwZ2RISjFaVHRjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUdadUxtRndjR3g1S0hSb2FYTXNJR0Z5WjNWdFpXNTBjeWs3WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnWkdWd2NtVmpZWFJsWkR0Y2JuMDdYRzVjYmx4dWRtRnlJR1JsWW5WbmN5QTlJSHQ5TzF4dWRtRnlJR1JsWW5WblJXNTJhWEp2Ymp0Y2JtVjRjRzl5ZEhNdVpHVmlkV2RzYjJjZ1BTQm1kVzVqZEdsdmJpaHpaWFFwSUh0Y2JpQWdhV1lnS0dselZXNWtaV1pwYm1Wa0tHUmxZblZuUlc1MmFYSnZiaWtwWEc0Z0lDQWdaR1ZpZFdkRmJuWnBjbTl1SUQwZ2NISnZZMlZ6Y3k1bGJuWXVUazlFUlY5RVJVSlZSeUI4ZkNBbkp6dGNiaUFnYzJWMElEMGdjMlYwTG5SdlZYQndaWEpEWVhObEtDazdYRzRnSUdsbUlDZ2haR1ZpZFdkelczTmxkRjBwSUh0Y2JpQWdJQ0JwWmlBb2JtVjNJRkpsWjBWNGNDZ25YRnhjWEdJbklDc2djMlYwSUNzZ0oxeGNYRnhpSnl3Z0oya25LUzUwWlhOMEtHUmxZblZuUlc1MmFYSnZiaWtwSUh0Y2JpQWdJQ0FnSUhaaGNpQndhV1FnUFNCd2NtOWpaWE56TG5CcFpEdGNiaUFnSUNBZ0lHUmxZblZuYzF0elpYUmRJRDBnWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnSUNBZ0lIWmhjaUJ0YzJjZ1BTQmxlSEJ2Y25SekxtWnZjbTFoZEM1aGNIQnNlU2hsZUhCdmNuUnpMQ0JoY21kMWJXVnVkSE1wTzF4dUlDQWdJQ0FnSUNCamIyNXpiMnhsTG1WeWNtOXlLQ2NsY3lBbFpEb2dKWE1uTENCelpYUXNJSEJwWkN3Z2JYTm5LVHRjYmlBZ0lDQWdJSDA3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lHUmxZblZuYzF0elpYUmRJRDBnWm5WdVkzUnBiMjRvS1NCN2ZUdGNiaUFnSUNCOVhHNGdJSDFjYmlBZ2NtVjBkWEp1SUdSbFluVm5jMXR6WlhSZE8xeHVmVHRjYmx4dVhHNHZLaXBjYmlBcUlFVmphRzl6SUhSb1pTQjJZV3gxWlNCdlppQmhJSFpoYkhWbExpQlVjbmx6SUhSdklIQnlhVzUwSUhSb1pTQjJZV3gxWlNCdmRYUmNiaUFxSUdsdUlIUm9aU0JpWlhOMElIZGhlU0J3YjNOemFXSnNaU0JuYVhabGJpQjBhR1VnWkdsbVptVnlaVzUwSUhSNWNHVnpMbHh1SUNwY2JpQXFJRUJ3WVhKaGJTQjdUMkpxWldOMGZTQnZZbW9nVkdobElHOWlhbVZqZENCMGJ5QndjbWx1ZENCdmRYUXVYRzRnS2lCQWNHRnlZVzBnZTA5aWFtVmpkSDBnYjNCMGN5QlBjSFJwYjI1aGJDQnZjSFJwYjI1eklHOWlhbVZqZENCMGFHRjBJR0ZzZEdWeWN5QjBhR1VnYjNWMGNIVjBMbHh1SUNvdlhHNHZLaUJzWldkaFkzazZJRzlpYWl3Z2MyaHZkMGhwWkdSbGJpd2daR1Z3ZEdnc0lHTnZiRzl5Y3lvdlhHNW1kVzVqZEdsdmJpQnBibk53WldOMEtHOWlhaXdnYjNCMGN5a2dlMXh1SUNBdkx5QmtaV1poZFd4MElHOXdkR2x2Ym5OY2JpQWdkbUZ5SUdOMGVDQTlJSHRjYmlBZ0lDQnpaV1Z1T2lCYlhTeGNiaUFnSUNCemRIbHNhWHBsT2lCemRIbHNhWHBsVG05RGIyeHZjbHh1SUNCOU8xeHVJQ0F2THlCc1pXZGhZM2t1TGk1Y2JpQWdhV1lnS0dGeVozVnRaVzUwY3k1c1pXNW5kR2dnUGowZ015a2dZM1I0TG1SbGNIUm9JRDBnWVhKbmRXMWxiblJ6V3pKZE8xeHVJQ0JwWmlBb1lYSm5kVzFsYm5SekxteGxibWQwYUNBK1BTQTBLU0JqZEhndVkyOXNiM0p6SUQwZ1lYSm5kVzFsYm5Seld6TmRPMXh1SUNCcFppQW9hWE5DYjI5c1pXRnVLRzl3ZEhNcEtTQjdYRzRnSUNBZ0x5OGdiR1ZuWVdONUxpNHVYRzRnSUNBZ1kzUjRMbk5vYjNkSWFXUmtaVzRnUFNCdmNIUnpPMXh1SUNCOUlHVnNjMlVnYVdZZ0tHOXdkSE1wSUh0Y2JpQWdJQ0F2THlCbmIzUWdZVzRnWENKdmNIUnBiMjV6WENJZ2IySnFaV04wWEc0Z0lDQWdaWGh3YjNKMGN5NWZaWGgwWlc1a0tHTjBlQ3dnYjNCMGN5azdYRzRnSUgxY2JpQWdMeThnYzJWMElHUmxabUYxYkhRZ2IzQjBhVzl1YzF4dUlDQnBaaUFvYVhOVmJtUmxabWx1WldRb1kzUjRMbk5vYjNkSWFXUmtaVzRwS1NCamRIZ3VjMmh2ZDBocFpHUmxiaUE5SUdaaGJITmxPMXh1SUNCcFppQW9hWE5WYm1SbFptbHVaV1FvWTNSNExtUmxjSFJvS1NrZ1kzUjRMbVJsY0hSb0lEMGdNanRjYmlBZ2FXWWdLR2x6Vlc1a1pXWnBibVZrS0dOMGVDNWpiMnh2Y25NcEtTQmpkSGd1WTI5c2IzSnpJRDBnWm1Gc2MyVTdYRzRnSUdsbUlDaHBjMVZ1WkdWbWFXNWxaQ2hqZEhndVkzVnpkRzl0U1c1emNHVmpkQ2twSUdOMGVDNWpkWE4wYjIxSmJuTndaV04wSUQwZ2RISjFaVHRjYmlBZ2FXWWdLR04wZUM1amIyeHZjbk1wSUdOMGVDNXpkSGxzYVhwbElEMGdjM1I1YkdsNlpWZHBkR2hEYjJ4dmNqdGNiaUFnY21WMGRYSnVJR1p2Y20xaGRGWmhiSFZsS0dOMGVDd2diMkpxTENCamRIZ3VaR1Z3ZEdncE8xeHVmVnh1Wlhod2IzSjBjeTVwYm5Od1pXTjBJRDBnYVc1emNHVmpkRHRjYmx4dVhHNHZMeUJvZEhSd09pOHZaVzR1ZDJscmFYQmxaR2xoTG05eVp5OTNhV3RwTDBGT1UwbGZaWE5qWVhCbFgyTnZaR1VqWjNKaGNHaHBZM05jYm1sdWMzQmxZM1F1WTI5c2IzSnpJRDBnZTF4dUlDQW5ZbTlzWkNjZ09pQmJNU3dnTWpKZExGeHVJQ0FuYVhSaGJHbGpKeUE2SUZzekxDQXlNMTBzWEc0Z0lDZDFibVJsY214cGJtVW5JRG9nV3pRc0lESTBYU3hjYmlBZ0oybHVkbVZ5YzJVbklEb2dXemNzSURJM1hTeGNiaUFnSjNkb2FYUmxKeUE2SUZzek55d2dNemxkTEZ4dUlDQW5aM0psZVNjZ09pQmJPVEFzSURNNVhTeGNiaUFnSjJKc1lXTnJKeUE2SUZzek1Dd2dNemxkTEZ4dUlDQW5ZbXgxWlNjZ09pQmJNelFzSURNNVhTeGNiaUFnSjJONVlXNG5JRG9nV3pNMkxDQXpPVjBzWEc0Z0lDZG5jbVZsYmljZ09pQmJNeklzSURNNVhTeGNiaUFnSjIxaFoyVnVkR0VuSURvZ1d6TTFMQ0F6T1Ywc1hHNGdJQ2R5WldRbklEb2dXek14TENBek9WMHNYRzRnSUNkNVpXeHNiM2NuSURvZ1d6TXpMQ0F6T1YxY2JuMDdYRzVjYmk4dklFUnZiaWQwSUhWelpTQW5ZbXgxWlNjZ2JtOTBJSFpwYzJsaWJHVWdiMjRnWTIxa0xtVjRaVnh1YVc1emNHVmpkQzV6ZEhsc1pYTWdQU0I3WEc0Z0lDZHpjR1ZqYVdGc0p6b2dKMk41WVc0bkxGeHVJQ0FuYm5WdFltVnlKem9nSjNsbGJHeHZkeWNzWEc0Z0lDZGliMjlzWldGdUp6b2dKM2xsYkd4dmR5Y3NYRzRnSUNkMWJtUmxabWx1WldRbk9pQW5aM0psZVNjc1hHNGdJQ2R1ZFd4c0p6b2dKMkp2YkdRbkxGeHVJQ0FuYzNSeWFXNW5Kem9nSjJkeVpXVnVKeXhjYmlBZ0oyUmhkR1VuT2lBbmJXRm5aVzUwWVNjc1hHNGdJQzh2SUZ3aWJtRnRaVndpT2lCcGJuUmxiblJwYjI1aGJHeDVJRzV2ZENCemRIbHNhVzVuWEc0Z0lDZHlaV2RsZUhBbk9pQW5jbVZrSjF4dWZUdGNibHh1WEc1bWRXNWpkR2x2YmlCemRIbHNhWHBsVjJsMGFFTnZiRzl5S0hOMGNpd2djM1I1YkdWVWVYQmxLU0I3WEc0Z0lIWmhjaUJ6ZEhsc1pTQTlJR2x1YzNCbFkzUXVjM1I1YkdWelczTjBlV3hsVkhsd1pWMDdYRzVjYmlBZ2FXWWdLSE4wZVd4bEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUNkY1hIVXdNREZpV3ljZ0t5QnBibk53WldOMExtTnZiRzl5YzF0emRIbHNaVjFiTUYwZ0t5QW5iU2NnS3lCemRISWdLMXh1SUNBZ0lDQWdJQ0FnSUNBblhGeDFNREF4WWxzbklDc2dhVzV6Y0dWamRDNWpiMnh2Y25OYmMzUjViR1ZkV3pGZElDc2dKMjBuTzF4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUhKbGRIVnliaUJ6ZEhJN1hHNGdJSDFjYm4xY2JseHVYRzVtZFc1amRHbHZiaUJ6ZEhsc2FYcGxUbTlEYjJ4dmNpaHpkSElzSUhOMGVXeGxWSGx3WlNrZ2UxeHVJQ0J5WlhSMWNtNGdjM1J5TzF4dWZWeHVYRzVjYm1aMWJtTjBhVzl1SUdGeWNtRjVWRzlJWVhOb0tHRnljbUY1S1NCN1hHNGdJSFpoY2lCb1lYTm9JRDBnZTMwN1hHNWNiaUFnWVhKeVlYa3VabTl5UldGamFDaG1kVzVqZEdsdmJpaDJZV3dzSUdsa2VDa2dlMXh1SUNBZ0lHaGhjMmhiZG1Gc1hTQTlJSFJ5ZFdVN1hHNGdJSDBwTzF4dVhHNGdJSEpsZEhWeWJpQm9ZWE5vTzF4dWZWeHVYRzVjYm1aMWJtTjBhVzl1SUdadmNtMWhkRlpoYkhWbEtHTjBlQ3dnZG1Gc2RXVXNJSEpsWTNWeWMyVlVhVzFsY3lrZ2UxeHVJQ0F2THlCUWNtOTJhV1JsSUdFZ2FHOXZheUJtYjNJZ2RYTmxjaTF6Y0dWamFXWnBaV1FnYVc1emNHVmpkQ0JtZFc1amRHbHZibk11WEc0Z0lDOHZJRU5vWldOcklIUm9ZWFFnZG1Gc2RXVWdhWE1nWVc0Z2IySnFaV04wSUhkcGRHZ2dZVzRnYVc1emNHVmpkQ0JtZFc1amRHbHZiaUJ2YmlCcGRGeHVJQ0JwWmlBb1kzUjRMbU4xYzNSdmJVbHVjM0JsWTNRZ0ppWmNiaUFnSUNBZ0lIWmhiSFZsSUNZbVhHNGdJQ0FnSUNCcGMwWjFibU4wYVc5dUtIWmhiSFZsTG1sdWMzQmxZM1FwSUNZbVhHNGdJQ0FnSUNBdkx5QkdhV3gwWlhJZ2IzVjBJSFJvWlNCMWRHbHNJRzF2WkhWc1pTd2dhWFFuY3lCcGJuTndaV04wSUdaMWJtTjBhVzl1SUdseklITndaV05wWVd4Y2JpQWdJQ0FnSUhaaGJIVmxMbWx1YzNCbFkzUWdJVDA5SUdWNGNHOXlkSE11YVc1emNHVmpkQ0FtSmx4dUlDQWdJQ0FnTHk4Z1FXeHpieUJtYVd4MFpYSWdiM1YwSUdGdWVTQndjbTkwYjNSNWNHVWdiMkpxWldOMGN5QjFjMmx1WnlCMGFHVWdZMmx5WTNWc1lYSWdZMmhsWTJzdVhHNGdJQ0FnSUNBaEtIWmhiSFZsTG1OdmJuTjBjblZqZEc5eUlDWW1JSFpoYkhWbExtTnZibk4wY25WamRHOXlMbkJ5YjNSdmRIbHdaU0E5UFQwZ2RtRnNkV1VwS1NCN1hHNGdJQ0FnZG1GeUlISmxkQ0E5SUhaaGJIVmxMbWx1YzNCbFkzUW9jbVZqZFhKelpWUnBiV1Z6TENCamRIZ3BPMXh1SUNBZ0lHbG1JQ2doYVhOVGRISnBibWNvY21WMEtTa2dlMXh1SUNBZ0lDQWdjbVYwSUQwZ1ptOXliV0YwVm1Gc2RXVW9ZM1I0TENCeVpYUXNJSEpsWTNWeWMyVlVhVzFsY3lrN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQnlaWFE3WEc0Z0lIMWNibHh1SUNBdkx5QlFjbWx0YVhScGRtVWdkSGx3WlhNZ1kyRnVibTkwSUdoaGRtVWdjSEp2Y0dWeWRHbGxjMXh1SUNCMllYSWdjSEpwYldsMGFYWmxJRDBnWm05eWJXRjBVSEpwYldsMGFYWmxLR04wZUN3Z2RtRnNkV1VwTzF4dUlDQnBaaUFvY0hKcGJXbDBhWFpsS1NCN1hHNGdJQ0FnY21WMGRYSnVJSEJ5YVcxcGRHbDJaVHRjYmlBZ2ZWeHVYRzRnSUM4dklFeHZiMnNnZFhBZ2RHaGxJR3RsZVhNZ2IyWWdkR2hsSUc5aWFtVmpkQzVjYmlBZ2RtRnlJR3RsZVhNZ1BTQlBZbXBsWTNRdWEyVjVjeWgyWVd4MVpTazdYRzRnSUhaaGNpQjJhWE5wWW14bFMyVjVjeUE5SUdGeWNtRjVWRzlJWVhOb0tHdGxlWE1wTzF4dVhHNGdJR2xtSUNoamRIZ3VjMmh2ZDBocFpHUmxiaWtnZTF4dUlDQWdJR3RsZVhNZ1BTQlBZbXBsWTNRdVoyVjBUM2R1VUhKdmNHVnlkSGxPWVcxbGN5aDJZV3gxWlNrN1hHNGdJSDFjYmx4dUlDQXZMeUJKUlNCa2IyVnpiaWQwSUcxaGEyVWdaWEp5YjNJZ1ptbGxiR1J6SUc1dmJpMWxiblZ0WlhKaFlteGxYRzRnSUM4dklHaDBkSEE2THk5dGMyUnVMbTFwWTNKdmMyOW1kQzVqYjIwdlpXNHRkWE12YkdsaWNtRnllUzlwWlM5a2QzYzFNbk5pZENoMlBYWnpMamswS1M1aGMzQjRYRzRnSUdsbUlDaHBjMFZ5Y205eUtIWmhiSFZsS1Z4dUlDQWdJQ0FnSmlZZ0tHdGxlWE11YVc1a1pYaFBaaWduYldWemMyRm5aU2NwSUQ0OUlEQWdmSHdnYTJWNWN5NXBibVJsZUU5bUtDZGtaWE5qY21sd2RHbHZiaWNwSUQ0OUlEQXBLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHWnZjbTFoZEVWeWNtOXlLSFpoYkhWbEtUdGNiaUFnZlZ4dVhHNGdJQzh2SUZOdmJXVWdkSGx3WlNCdlppQnZZbXBsWTNRZ2QybDBhRzkxZENCd2NtOXdaWEowYVdWeklHTmhiaUJpWlNCemFHOXlkR04xZEhSbFpDNWNiaUFnYVdZZ0tHdGxlWE11YkdWdVozUm9JRDA5UFNBd0tTQjdYRzRnSUNBZ2FXWWdLR2x6Um5WdVkzUnBiMjRvZG1Gc2RXVXBLU0I3WEc0Z0lDQWdJQ0IyWVhJZ2JtRnRaU0E5SUhaaGJIVmxMbTVoYldVZ1B5QW5PaUFuSUNzZ2RtRnNkV1V1Ym1GdFpTQTZJQ2NuTzF4dUlDQWdJQ0FnY21WMGRYSnVJR04wZUM1emRIbHNhWHBsS0NkYlJuVnVZM1JwYjI0bklDc2dibUZ0WlNBcklDZGRKeXdnSjNOd1pXTnBZV3duS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdhV1lnS0dselVtVm5SWGh3S0haaGJIVmxLU2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR04wZUM1emRIbHNhWHBsS0ZKbFowVjRjQzV3Y205MGIzUjVjR1V1ZEc5VGRISnBibWN1WTJGc2JDaDJZV3gxWlNrc0lDZHlaV2RsZUhBbktUdGNiaUFnSUNCOVhHNGdJQ0FnYVdZZ0tHbHpSR0YwWlNoMllXeDFaU2twSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJqZEhndWMzUjViR2w2WlNoRVlYUmxMbkJ5YjNSdmRIbHdaUzUwYjFOMGNtbHVaeTVqWVd4c0tIWmhiSFZsS1N3Z0oyUmhkR1VuS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdhV1lnS0dselJYSnliM0lvZG1Gc2RXVXBLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdabTl5YldGMFJYSnliM0lvZG1Gc2RXVXBPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSFpoY2lCaVlYTmxJRDBnSnljc0lHRnljbUY1SUQwZ1ptRnNjMlVzSUdKeVlXTmxjeUE5SUZzbmV5Y3NJQ2Q5SjEwN1hHNWNiaUFnTHk4Z1RXRnJaU0JCY25KaGVTQnpZWGtnZEdoaGRDQjBhR1Y1SUdGeVpTQkJjbkpoZVZ4dUlDQnBaaUFvYVhOQmNuSmhlU2gyWVd4MVpTa3BJSHRjYmlBZ0lDQmhjbkpoZVNBOUlIUnlkV1U3WEc0Z0lDQWdZbkpoWTJWeklEMGdXeWRiSnl3Z0oxMG5YVHRjYmlBZ2ZWeHVYRzRnSUM4dklFMWhhMlVnWm5WdVkzUnBiMjV6SUhOaGVTQjBhR0YwSUhSb1pYa2dZWEpsSUdaMWJtTjBhVzl1YzF4dUlDQnBaaUFvYVhOR2RXNWpkR2x2YmloMllXeDFaU2twSUh0Y2JpQWdJQ0IyWVhJZ2JpQTlJSFpoYkhWbExtNWhiV1VnUHlBbk9pQW5JQ3NnZG1Gc2RXVXVibUZ0WlNBNklDY25PMXh1SUNBZ0lHSmhjMlVnUFNBbklGdEdkVzVqZEdsdmJpY2dLeUJ1SUNzZ0oxMG5PMXh1SUNCOVhHNWNiaUFnTHk4Z1RXRnJaU0JTWldkRmVIQnpJSE5oZVNCMGFHRjBJSFJvWlhrZ1lYSmxJRkpsWjBWNGNITmNiaUFnYVdZZ0tHbHpVbVZuUlhod0tIWmhiSFZsS1NrZ2UxeHVJQ0FnSUdKaGMyVWdQU0FuSUNjZ0t5QlNaV2RGZUhBdWNISnZkRzkwZVhCbExuUnZVM1J5YVc1bkxtTmhiR3dvZG1Gc2RXVXBPMXh1SUNCOVhHNWNiaUFnTHk4Z1RXRnJaU0JrWVhSbGN5QjNhWFJvSUhCeWIzQmxjblJwWlhNZ1ptbHljM1FnYzJGNUlIUm9aU0JrWVhSbFhHNGdJR2xtSUNocGMwUmhkR1VvZG1Gc2RXVXBLU0I3WEc0Z0lDQWdZbUZ6WlNBOUlDY2dKeUFySUVSaGRHVXVjSEp2ZEc5MGVYQmxMblJ2VlZSRFUzUnlhVzVuTG1OaGJHd29kbUZzZFdVcE8xeHVJQ0I5WEc1Y2JpQWdMeThnVFdGclpTQmxjbkp2Y2lCM2FYUm9JRzFsYzNOaFoyVWdabWx5YzNRZ2MyRjVJSFJvWlNCbGNuSnZjbHh1SUNCcFppQW9hWE5GY25KdmNpaDJZV3gxWlNrcElIdGNiaUFnSUNCaVlYTmxJRDBnSnlBbklDc2dabTl5YldGMFJYSnliM0lvZG1Gc2RXVXBPMXh1SUNCOVhHNWNiaUFnYVdZZ0tHdGxlWE11YkdWdVozUm9JRDA5UFNBd0lDWW1JQ2doWVhKeVlYa2dmSHdnZG1Gc2RXVXViR1Z1WjNSb0lEMDlJREFwS1NCN1hHNGdJQ0FnY21WMGRYSnVJR0p5WVdObGMxc3dYU0FySUdKaGMyVWdLeUJpY21GalpYTmJNVjA3WEc0Z0lIMWNibHh1SUNCcFppQW9jbVZqZFhKelpWUnBiV1Z6SUR3Z01Da2dlMXh1SUNBZ0lHbG1JQ2hwYzFKbFowVjRjQ2gyWVd4MVpTa3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmpkSGd1YzNSNWJHbDZaU2hTWldkRmVIQXVjSEp2ZEc5MGVYQmxMblJ2VTNSeWFXNW5MbU5oYkd3b2RtRnNkV1VwTENBbmNtVm5aWGh3SnlrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmpkSGd1YzNSNWJHbDZaU2duVzA5aWFtVmpkRjBuTENBbmMzQmxZMmxoYkNjcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lHTjBlQzV6WldWdUxuQjFjMmdvZG1Gc2RXVXBPMXh1WEc0Z0lIWmhjaUJ2ZFhSd2RYUTdYRzRnSUdsbUlDaGhjbkpoZVNrZ2UxeHVJQ0FnSUc5MWRIQjFkQ0E5SUdadmNtMWhkRUZ5Y21GNUtHTjBlQ3dnZG1Gc2RXVXNJSEpsWTNWeWMyVlVhVzFsY3l3Z2RtbHphV0pzWlV0bGVYTXNJR3RsZVhNcE8xeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lHOTFkSEIxZENBOUlHdGxlWE11YldGd0tHWjFibU4wYVc5dUtHdGxlU2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1p2Y20xaGRGQnliM0JsY25SNUtHTjBlQ3dnZG1Gc2RXVXNJSEpsWTNWeWMyVlVhVzFsY3l3Z2RtbHphV0pzWlV0bGVYTXNJR3RsZVN3Z1lYSnlZWGtwTzF4dUlDQWdJSDBwTzF4dUlDQjlYRzVjYmlBZ1kzUjRMbk5sWlc0dWNHOXdLQ2s3WEc1Y2JpQWdjbVYwZFhKdUlISmxaSFZqWlZSdlUybHVaMnhsVTNSeWFXNW5LRzkxZEhCMWRDd2dZbUZ6WlN3Z1luSmhZMlZ6S1R0Y2JuMWNibHh1WEc1bWRXNWpkR2x2YmlCbWIzSnRZWFJRY21sdGFYUnBkbVVvWTNSNExDQjJZV3gxWlNrZ2UxeHVJQ0JwWmlBb2FYTlZibVJsWm1sdVpXUW9kbUZzZFdVcEtWeHVJQ0FnSUhKbGRIVnliaUJqZEhndWMzUjViR2w2WlNnbmRXNWtaV1pwYm1Wa0p5d2dKM1Z1WkdWbWFXNWxaQ2NwTzF4dUlDQnBaaUFvYVhOVGRISnBibWNvZG1Gc2RXVXBLU0I3WEc0Z0lDQWdkbUZ5SUhOcGJYQnNaU0E5SUNkY1hDY25JQ3NnU2xOUFRpNXpkSEpwYm1kcFpua29kbUZzZFdVcExuSmxjR3hoWTJVb0wxNWNJbnhjSWlRdlp5d2dKeWNwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdWNtVndiR0ZqWlNndkp5OW5MQ0JjSWx4Y1hGd25YQ0lwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdWNtVndiR0ZqWlNndlhGeGNYRndpTDJjc0lDZGNJaWNwSUNzZ0oxeGNKeWM3WEc0Z0lDQWdjbVYwZFhKdUlHTjBlQzV6ZEhsc2FYcGxLSE5wYlhCc1pTd2dKM04wY21sdVp5Y3BPMXh1SUNCOVhHNGdJR2xtSUNocGMwNTFiV0psY2loMllXeDFaU2twWEc0Z0lDQWdjbVYwZFhKdUlHTjBlQzV6ZEhsc2FYcGxLQ2NuSUNzZ2RtRnNkV1VzSUNkdWRXMWlaWEluS1R0Y2JpQWdhV1lnS0dselFtOXZiR1ZoYmloMllXeDFaU2twWEc0Z0lDQWdjbVYwZFhKdUlHTjBlQzV6ZEhsc2FYcGxLQ2NuSUNzZ2RtRnNkV1VzSUNkaWIyOXNaV0Z1SnlrN1hHNGdJQzh2SUVadmNpQnpiMjFsSUhKbFlYTnZiaUIwZVhCbGIyWWdiblZzYkNCcGN5QmNJbTlpYW1WamRGd2lMQ0J6YnlCemNHVmphV0ZzSUdOaGMyVWdhR1Z5WlM1Y2JpQWdhV1lnS0dselRuVnNiQ2gyWVd4MVpTa3BYRzRnSUNBZ2NtVjBkWEp1SUdOMGVDNXpkSGxzYVhwbEtDZHVkV3hzSnl3Z0oyNTFiR3duS1R0Y2JuMWNibHh1WEc1bWRXNWpkR2x2YmlCbWIzSnRZWFJGY25KdmNpaDJZV3gxWlNrZ2UxeHVJQ0J5WlhSMWNtNGdKMXNuSUNzZ1JYSnliM0l1Y0hKdmRHOTBlWEJsTG5SdlUzUnlhVzVuTG1OaGJHd29kbUZzZFdVcElDc2dKMTBuTzF4dWZWeHVYRzVjYm1aMWJtTjBhVzl1SUdadmNtMWhkRUZ5Y21GNUtHTjBlQ3dnZG1Gc2RXVXNJSEpsWTNWeWMyVlVhVzFsY3l3Z2RtbHphV0pzWlV0bGVYTXNJR3RsZVhNcElIdGNiaUFnZG1GeUlHOTFkSEIxZENBOUlGdGRPMXh1SUNCbWIzSWdLSFpoY2lCcElEMGdNQ3dnYkNBOUlIWmhiSFZsTG14bGJtZDBhRHNnYVNBOElHdzdJQ3NyYVNrZ2UxeHVJQ0FnSUdsbUlDaG9ZWE5QZDI1UWNtOXdaWEowZVNoMllXeDFaU3dnVTNSeWFXNW5LR2twS1NrZ2UxeHVJQ0FnSUNBZ2IzVjBjSFYwTG5CMWMyZ29abTl5YldGMFVISnZjR1Z5ZEhrb1kzUjRMQ0IyWVd4MVpTd2djbVZqZFhKelpWUnBiV1Z6TENCMmFYTnBZbXhsUzJWNWN5eGNiaUFnSUNBZ0lDQWdJQ0JUZEhKcGJtY29hU2tzSUhSeWRXVXBLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2IzVjBjSFYwTG5CMWMyZ29KeWNwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVJQ0JyWlhsekxtWnZja1ZoWTJnb1puVnVZM1JwYjI0b2EyVjVLU0I3WEc0Z0lDQWdhV1lnS0NGclpYa3ViV0YwWTJnb0wxNWNYR1FySkM4cEtTQjdYRzRnSUNBZ0lDQnZkWFJ3ZFhRdWNIVnphQ2htYjNKdFlYUlFjbTl3WlhKMGVTaGpkSGdzSUhaaGJIVmxMQ0J5WldOMWNuTmxWR2x0WlhNc0lIWnBjMmxpYkdWTFpYbHpMRnh1SUNBZ0lDQWdJQ0FnSUd0bGVTd2dkSEoxWlNrcE8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc0Z0lISmxkSFZ5YmlCdmRYUndkWFE3WEc1OVhHNWNibHh1Wm5WdVkzUnBiMjRnWm05eWJXRjBVSEp2Y0dWeWRIa29ZM1I0TENCMllXeDFaU3dnY21WamRYSnpaVlJwYldWekxDQjJhWE5wWW14bFMyVjVjeXdnYTJWNUxDQmhjbkpoZVNrZ2UxeHVJQ0IyWVhJZ2JtRnRaU3dnYzNSeUxDQmtaWE5qTzF4dUlDQmtaWE5qSUQwZ1QySnFaV04wTG1kbGRFOTNibEJ5YjNCbGNuUjVSR1Z6WTNKcGNIUnZjaWgyWVd4MVpTd2dhMlY1S1NCOGZDQjdJSFpoYkhWbE9pQjJZV3gxWlZ0clpYbGRJSDA3WEc0Z0lHbG1JQ2hrWlhOakxtZGxkQ2tnZTF4dUlDQWdJR2xtSUNoa1pYTmpMbk5sZENrZ2UxeHVJQ0FnSUNBZ2MzUnlJRDBnWTNSNExuTjBlV3hwZW1Vb0oxdEhaWFIwWlhJdlUyVjBkR1Z5WFNjc0lDZHpjR1ZqYVdGc0p5azdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhOMGNpQTlJR04wZUM1emRIbHNhWHBsS0NkYlIyVjBkR1Z5WFNjc0lDZHpjR1ZqYVdGc0p5azdYRzRnSUNBZ2ZWeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lHbG1JQ2hrWlhOakxuTmxkQ2tnZTF4dUlDQWdJQ0FnYzNSeUlEMGdZM1I0TG5OMGVXeHBlbVVvSjF0VFpYUjBaWEpkSnl3Z0ozTndaV05wWVd3bktUdGNiaUFnSUNCOVhHNGdJSDFjYmlBZ2FXWWdLQ0ZvWVhOUGQyNVFjbTl3WlhKMGVTaDJhWE5wWW14bFMyVjVjeXdnYTJWNUtTa2dlMXh1SUNBZ0lHNWhiV1VnUFNBbld5Y2dLeUJyWlhrZ0t5QW5YU2M3WEc0Z0lIMWNiaUFnYVdZZ0tDRnpkSElwSUh0Y2JpQWdJQ0JwWmlBb1kzUjRMbk5sWlc0dWFXNWtaWGhQWmloa1pYTmpMblpoYkhWbEtTQThJREFwSUh0Y2JpQWdJQ0FnSUdsbUlDaHBjMDUxYkd3b2NtVmpkWEp6WlZScGJXVnpLU2tnZTF4dUlDQWdJQ0FnSUNCemRISWdQU0JtYjNKdFlYUldZV3gxWlNoamRIZ3NJR1JsYzJNdWRtRnNkV1VzSUc1MWJHd3BPMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdjM1J5SUQwZ1ptOXliV0YwVm1Gc2RXVW9ZM1I0TENCa1pYTmpMblpoYkhWbExDQnlaV04xY25ObFZHbHRaWE1nTFNBeEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHbG1JQ2h6ZEhJdWFXNWtaWGhQWmlnblhGeHVKeWtnUGlBdE1Ta2dlMXh1SUNBZ0lDQWdJQ0JwWmlBb1lYSnlZWGtwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnpkSElnUFNCemRISXVjM0JzYVhRb0oxeGNiaWNwTG0xaGNDaG1kVzVqZEdsdmJpaHNhVzVsS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdKeUFnSnlBcklHeHBibVU3WEc0Z0lDQWdJQ0FnSUNBZ2ZTa3VhbTlwYmlnblhGeHVKeWt1YzNWaWMzUnlLRElwTzF4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lITjBjaUE5SUNkY1hHNG5JQ3NnYzNSeUxuTndiR2wwS0NkY1hHNG5LUzV0WVhBb1puVnVZM1JwYjI0b2JHbHVaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlDY2dJQ0FuSUNzZ2JHbHVaVHRjYmlBZ0lDQWdJQ0FnSUNCOUtTNXFiMmx1S0NkY1hHNG5LVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQnpkSElnUFNCamRIZ3VjM1I1YkdsNlpTZ25XME5wY21OMWJHRnlYU2NzSUNkemNHVmphV0ZzSnlrN1hHNGdJQ0FnZlZ4dUlDQjlYRzRnSUdsbUlDaHBjMVZ1WkdWbWFXNWxaQ2h1WVcxbEtTa2dlMXh1SUNBZ0lHbG1JQ2hoY25KaGVTQW1KaUJyWlhrdWJXRjBZMmdvTDE1Y1hHUXJKQzhwS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYzNSeU8xeHVJQ0FnSUgxY2JpQWdJQ0J1WVcxbElEMGdTbE5QVGk1emRISnBibWRwWm5rb0p5Y2dLeUJyWlhrcE8xeHVJQ0FnSUdsbUlDaHVZVzFsTG0xaGRHTm9LQzllWENJb1cyRXRla0V0V2w5ZFcyRXRla0V0V2w4d0xUbGRLaWxjSWlRdktTa2dlMXh1SUNBZ0lDQWdibUZ0WlNBOUlHNWhiV1V1YzNWaWMzUnlLREVzSUc1aGJXVXViR1Z1WjNSb0lDMGdNaWs3WEc0Z0lDQWdJQ0J1WVcxbElEMGdZM1I0TG5OMGVXeHBlbVVvYm1GdFpTd2dKMjVoYldVbktUdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnYm1GdFpTQTlJRzVoYldVdWNtVndiR0ZqWlNndkp5OW5MQ0JjSWx4Y1hGd25YQ0lwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM1eVpYQnNZV05sS0M5Y1hGeGNYQ0l2Wnl3Z0oxd2lKeWxjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTG5KbGNHeGhZMlVvTHloZVhDSjhYQ0lrS1M5bkxDQmNJaWRjSWlrN1hHNGdJQ0FnSUNCdVlXMWxJRDBnWTNSNExuTjBlV3hwZW1Vb2JtRnRaU3dnSjNOMGNtbHVaeWNwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJ1WVcxbElDc2dKem9nSnlBcklITjBjanRjYm4xY2JseHVYRzVtZFc1amRHbHZiaUJ5WldSMVkyVlViMU5wYm1kc1pWTjBjbWx1WnlodmRYUndkWFFzSUdKaGMyVXNJR0p5WVdObGN5a2dlMXh1SUNCMllYSWdiblZ0VEdsdVpYTkZjM1FnUFNBd08xeHVJQ0IyWVhJZ2JHVnVaM1JvSUQwZ2IzVjBjSFYwTG5KbFpIVmpaU2htZFc1amRHbHZiaWh3Y21WMkxDQmpkWElwSUh0Y2JpQWdJQ0J1ZFcxTWFXNWxjMFZ6ZENzck8xeHVJQ0FnSUdsbUlDaGpkWEl1YVc1a1pYaFBaaWduWEZ4dUp5a2dQajBnTUNrZ2JuVnRUR2x1WlhORmMzUXJLenRjYmlBZ0lDQnlaWFIxY200Z2NISmxkaUFySUdOMWNpNXlaWEJzWVdObEtDOWNYSFV3TURGaVhGeGJYRnhrWEZ4a1AyMHZaeXdnSnljcExteGxibWQwYUNBcklERTdYRzRnSUgwc0lEQXBPMXh1WEc0Z0lHbG1JQ2hzWlc1bmRHZ2dQaUEyTUNrZ2UxeHVJQ0FnSUhKbGRIVnliaUJpY21GalpYTmJNRjBnSzF4dUlDQWdJQ0FnSUNBZ0lDQW9ZbUZ6WlNBOVBUMGdKeWNnUHlBbkp5QTZJR0poYzJVZ0t5QW5YRnh1SUNjcElDdGNiaUFnSUNBZ0lDQWdJQ0FnSnlBbklDdGNiaUFnSUNBZ0lDQWdJQ0FnYjNWMGNIVjBMbXB2YVc0b0p5eGNYRzRnSUNjcElDdGNiaUFnSUNBZ0lDQWdJQ0FnSnlBbklDdGNiaUFnSUNBZ0lDQWdJQ0FnWW5KaFkyVnpXekZkTzF4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUdKeVlXTmxjMXN3WFNBcklHSmhjMlVnS3lBbklDY2dLeUJ2ZFhSd2RYUXVhbTlwYmlnbkxDQW5LU0FySUNjZ0p5QXJJR0p5WVdObGMxc3hYVHRjYm4xY2JseHVYRzR2THlCT1QxUkZPaUJVYUdWelpTQjBlWEJsSUdOb1pXTnJhVzVuSUdaMWJtTjBhVzl1Y3lCcGJuUmxiblJwYjI1aGJHeDVJR1J2YmlkMElIVnpaU0JnYVc1emRHRnVZMlZ2Wm1CY2JpOHZJR0psWTJGMWMyVWdhWFFnYVhNZ1puSmhaMmxzWlNCaGJtUWdZMkZ1SUdKbElHVmhjMmxzZVNCbVlXdGxaQ0IzYVhSb0lHQlBZbXBsWTNRdVkzSmxZWFJsS0NsZ0xseHVablZ1WTNScGIyNGdhWE5CY25KaGVTaGhjaWtnZTF4dUlDQnlaWFIxY200Z1FYSnlZWGt1YVhOQmNuSmhlU2hoY2lrN1hHNTlYRzVsZUhCdmNuUnpMbWx6UVhKeVlYa2dQU0JwYzBGeWNtRjVPMXh1WEc1bWRXNWpkR2x2YmlCcGMwSnZiMnhsWVc0b1lYSm5LU0I3WEc0Z0lISmxkSFZ5YmlCMGVYQmxiMllnWVhKbklEMDlQU0FuWW05dmJHVmhiaWM3WEc1OVhHNWxlSEJ2Y25SekxtbHpRbTl2YkdWaGJpQTlJR2x6UW05dmJHVmhianRjYmx4dVpuVnVZM1JwYjI0Z2FYTk9kV3hzS0dGeVp5a2dlMXh1SUNCeVpYUjFjbTRnWVhKbklEMDlQU0J1ZFd4c08xeHVmVnh1Wlhod2IzSjBjeTVwYzA1MWJHd2dQU0JwYzA1MWJHdzdYRzVjYm1aMWJtTjBhVzl1SUdselRuVnNiRTl5Vlc1a1pXWnBibVZrS0dGeVp5a2dlMXh1SUNCeVpYUjFjbTRnWVhKbklEMDlJRzUxYkd3N1hHNTlYRzVsZUhCdmNuUnpMbWx6VG5Wc2JFOXlWVzVrWldacGJtVmtJRDBnYVhOT2RXeHNUM0pWYm1SbFptbHVaV1E3WEc1Y2JtWjFibU4wYVc5dUlHbHpUblZ0WW1WeUtHRnlaeWtnZTF4dUlDQnlaWFIxY200Z2RIbHdaVzltSUdGeVp5QTlQVDBnSjI1MWJXSmxjaWM3WEc1OVhHNWxlSEJ2Y25SekxtbHpUblZ0WW1WeUlEMGdhWE5PZFcxaVpYSTdYRzVjYm1aMWJtTjBhVzl1SUdselUzUnlhVzVuS0dGeVp5a2dlMXh1SUNCeVpYUjFjbTRnZEhsd1pXOW1JR0Z5WnlBOVBUMGdKM04wY21sdVp5YzdYRzU5WEc1bGVIQnZjblJ6TG1selUzUnlhVzVuSUQwZ2FYTlRkSEpwYm1jN1hHNWNibVoxYm1OMGFXOXVJR2x6VTNsdFltOXNLR0Z5WnlrZ2UxeHVJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlHRnlaeUE5UFQwZ0ozTjViV0p2YkNjN1hHNTlYRzVsZUhCdmNuUnpMbWx6VTNsdFltOXNJRDBnYVhOVGVXMWliMnc3WEc1Y2JtWjFibU4wYVc5dUlHbHpWVzVrWldacGJtVmtLR0Z5WnlrZ2UxeHVJQ0J5WlhSMWNtNGdZWEpuSUQwOVBTQjJiMmxrSURBN1hHNTlYRzVsZUhCdmNuUnpMbWx6Vlc1a1pXWnBibVZrSUQwZ2FYTlZibVJsWm1sdVpXUTdYRzVjYm1aMWJtTjBhVzl1SUdselVtVm5SWGh3S0hKbEtTQjdYRzRnSUhKbGRIVnliaUJwYzA5aWFtVmpkQ2h5WlNrZ0ppWWdiMkpxWldOMFZHOVRkSEpwYm1jb2NtVXBJRDA5UFNBblcyOWlhbVZqZENCU1pXZEZlSEJkSnp0Y2JuMWNibVY0Y0c5eWRITXVhWE5TWldkRmVIQWdQU0JwYzFKbFowVjRjRHRjYmx4dVpuVnVZM1JwYjI0Z2FYTlBZbXBsWTNRb1lYSm5LU0I3WEc0Z0lISmxkSFZ5YmlCMGVYQmxiMllnWVhKbklEMDlQU0FuYjJKcVpXTjBKeUFtSmlCaGNtY2dJVDA5SUc1MWJHdzdYRzU5WEc1bGVIQnZjblJ6TG1selQySnFaV04wSUQwZ2FYTlBZbXBsWTNRN1hHNWNibVoxYm1OMGFXOXVJR2x6UkdGMFpTaGtLU0I3WEc0Z0lISmxkSFZ5YmlCcGMwOWlhbVZqZENoa0tTQW1KaUJ2WW1wbFkzUlViMU4wY21sdVp5aGtLU0E5UFQwZ0oxdHZZbXBsWTNRZ1JHRjBaVjBuTzF4dWZWeHVaWGh3YjNKMGN5NXBjMFJoZEdVZ1BTQnBjMFJoZEdVN1hHNWNibVoxYm1OMGFXOXVJR2x6UlhKeWIzSW9aU2tnZTF4dUlDQnlaWFIxY200Z2FYTlBZbXBsWTNRb1pTa2dKaVpjYmlBZ0lDQWdJQ2h2WW1wbFkzUlViMU4wY21sdVp5aGxLU0E5UFQwZ0oxdHZZbXBsWTNRZ1JYSnliM0pkSnlCOGZDQmxJR2x1YzNSaGJtTmxiMllnUlhKeWIzSXBPMXh1ZlZ4dVpYaHdiM0owY3k1cGMwVnljbTl5SUQwZ2FYTkZjbkp2Y2p0Y2JseHVablZ1WTNScGIyNGdhWE5HZFc1amRHbHZiaWhoY21jcElIdGNiaUFnY21WMGRYSnVJSFI1Y0dWdlppQmhjbWNnUFQwOUlDZG1kVzVqZEdsdmJpYzdYRzU5WEc1bGVIQnZjblJ6TG1selJuVnVZM1JwYjI0Z1BTQnBjMFoxYm1OMGFXOXVPMXh1WEc1bWRXNWpkR2x2YmlCcGMxQnlhVzFwZEdsMlpTaGhjbWNwSUh0Y2JpQWdjbVYwZFhKdUlHRnlaeUE5UFQwZ2JuVnNiQ0I4ZkZ4dUlDQWdJQ0FnSUNBZ2RIbHdaVzltSUdGeVp5QTlQVDBnSjJKdmIyeGxZVzRuSUh4OFhHNGdJQ0FnSUNBZ0lDQjBlWEJsYjJZZ1lYSm5JRDA5UFNBbmJuVnRZbVZ5SnlCOGZGeHVJQ0FnSUNBZ0lDQWdkSGx3Wlc5bUlHRnlaeUE5UFQwZ0ozTjBjbWx1WnljZ2ZIeGNiaUFnSUNBZ0lDQWdJSFI1Y0dWdlppQmhjbWNnUFQwOUlDZHplVzFpYjJ3bklIeDhJQ0F2THlCRlV6WWdjM2x0WW05c1hHNGdJQ0FnSUNBZ0lDQjBlWEJsYjJZZ1lYSm5JRDA5UFNBbmRXNWtaV1pwYm1Wa0p6dGNibjFjYm1WNGNHOXlkSE11YVhOUWNtbHRhWFJwZG1VZ1BTQnBjMUJ5YVcxcGRHbDJaVHRjYmx4dVpYaHdiM0owY3k1cGMwSjFabVpsY2lBOUlISmxjWFZwY21Vb0p5NHZjM1Z3Y0c5eWRDOXBjMEoxWm1abGNpY3BPMXh1WEc1bWRXNWpkR2x2YmlCdlltcGxZM1JVYjFOMGNtbHVaeWh2S1NCN1hHNGdJSEpsZEhWeWJpQlBZbXBsWTNRdWNISnZkRzkwZVhCbExuUnZVM1J5YVc1bkxtTmhiR3dvYnlrN1hHNTlYRzVjYmx4dVpuVnVZM1JwYjI0Z2NHRmtLRzRwSUh0Y2JpQWdjbVYwZFhKdUlHNGdQQ0F4TUNBL0lDY3dKeUFySUc0dWRHOVRkSEpwYm1jb01UQXBJRG9nYmk1MGIxTjBjbWx1WnlneE1DazdYRzU5WEc1Y2JseHVkbUZ5SUcxdmJuUm9jeUE5SUZzblNtRnVKeXdnSjBabFlpY3NJQ2ROWVhJbkxDQW5RWEJ5Snl3Z0owMWhlU2NzSUNkS2RXNG5MQ0FuU25Wc0p5d2dKMEYxWnljc0lDZFRaWEFuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FuVDJOMEp5d2dKMDV2ZGljc0lDZEVaV01uWFR0Y2JseHVMeThnTWpZZ1JtVmlJREUyT2pFNU9qTTBYRzVtZFc1amRHbHZiaUIwYVcxbGMzUmhiWEFvS1NCN1hHNGdJSFpoY2lCa0lEMGdibVYzSUVSaGRHVW9LVHRjYmlBZ2RtRnlJSFJwYldVZ1BTQmJjR0ZrS0dRdVoyVjBTRzkxY25Nb0tTa3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIQmhaQ2hrTG1kbGRFMXBiblYwWlhNb0tTa3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIQmhaQ2hrTG1kbGRGTmxZMjl1WkhNb0tTbGRMbXB2YVc0b0p6b25LVHRjYmlBZ2NtVjBkWEp1SUZ0a0xtZGxkRVJoZEdVb0tTd2diVzl1ZEdoelcyUXVaMlYwVFc5dWRHZ29LVjBzSUhScGJXVmRMbXB2YVc0b0p5QW5LVHRjYm4xY2JseHVYRzR2THlCc2IyY2dhWE1nYW5WemRDQmhJSFJvYVc0Z2QzSmhjSEJsY2lCMGJ5QmpiMjV6YjJ4bExteHZaeUIwYUdGMElIQnlaWEJsYm1SeklHRWdkR2x0WlhOMFlXMXdYRzVsZUhCdmNuUnpMbXh2WnlBOUlHWjFibU4wYVc5dUtDa2dlMXh1SUNCamIyNXpiMnhsTG14dlp5Z25KWE1nTFNBbGN5Y3NJSFJwYldWemRHRnRjQ2dwTENCbGVIQnZjblJ6TG1admNtMWhkQzVoY0hCc2VTaGxlSEJ2Y25SekxDQmhjbWQxYldWdWRITXBLVHRjYm4wN1hHNWNibHh1THlvcVhHNGdLaUJKYm1obGNtbDBJSFJvWlNCd2NtOTBiM1I1Y0dVZ2JXVjBhRzlrY3lCbWNtOXRJRzl1WlNCamIyNXpkSEoxWTNSdmNpQnBiblJ2SUdGdWIzUm9aWEl1WEc0Z0tseHVJQ29nVkdobElFWjFibU4wYVc5dUxuQnliM1J2ZEhsd1pTNXBibWhsY21sMGN5Qm1jbTl0SUd4aGJtY3Vhbk1nY21WM2NtbDBkR1Z1SUdGeklHRWdjM1JoYm1SaGJHOXVaVnh1SUNvZ1puVnVZM1JwYjI0Z0tHNXZkQ0J2YmlCR2RXNWpkR2x2Ymk1d2NtOTBiM1I1Y0dVcExpQk9UMVJGT2lCSlppQjBhR2x6SUdacGJHVWdhWE1nZEc4Z1ltVWdiRzloWkdWa1hHNGdLaUJrZFhKcGJtY2dZbTl2ZEhOMGNtRndjR2x1WnlCMGFHbHpJR1oxYm1OMGFXOXVJRzVsWldSeklIUnZJR0psSUhKbGQzSnBkSFJsYmlCMWMybHVaeUJ6YjIxbElHNWhkR2wyWlZ4dUlDb2dablZ1WTNScGIyNXpJR0Z6SUhCeWIzUnZkSGx3WlNCelpYUjFjQ0IxYzJsdVp5QnViM0p0WVd3Z1NtRjJZVk5qY21sd2RDQmtiMlZ6SUc1dmRDQjNiM0pySUdGelhHNGdLaUJsZUhCbFkzUmxaQ0JrZFhKcGJtY2dZbTl2ZEhOMGNtRndjR2x1WnlBb2MyVmxJRzFwY25KdmNpNXFjeUJwYmlCeU1URTBPVEF6S1M1Y2JpQXFYRzRnS2lCQWNHRnlZVzBnZTJaMWJtTjBhVzl1ZlNCamRHOXlJRU52Ym5OMGNuVmpkRzl5SUdaMWJtTjBhVzl1SUhkb2FXTm9JRzVsWldSeklIUnZJR2x1YUdWeWFYUWdkR2hsWEc0Z0tpQWdJQ0FnY0hKdmRHOTBlWEJsTGx4dUlDb2dRSEJoY21GdElIdG1kVzVqZEdsdmJuMGdjM1Z3WlhKRGRHOXlJRU52Ym5OMGNuVmpkRzl5SUdaMWJtTjBhVzl1SUhSdklHbHVhR1Z5YVhRZ2NISnZkRzkwZVhCbElHWnliMjB1WEc0Z0tpOWNibVY0Y0c5eWRITXVhVzVvWlhKcGRITWdQU0J5WlhGMWFYSmxLQ2RwYm1obGNtbDBjeWNwTzF4dVhHNWxlSEJ2Y25SekxsOWxlSFJsYm1RZ1BTQm1kVzVqZEdsdmJpaHZjbWxuYVc0c0lHRmtaQ2tnZTF4dUlDQXZMeUJFYjI0bmRDQmtieUJoYm5sMGFHbHVaeUJwWmlCaFpHUWdhWE51SjNRZ1lXNGdiMkpxWldOMFhHNGdJR2xtSUNnaFlXUmtJSHg4SUNGcGMwOWlhbVZqZENoaFpHUXBLU0J5WlhSMWNtNGdiM0pwWjJsdU8xeHVYRzRnSUhaaGNpQnJaWGx6SUQwZ1QySnFaV04wTG10bGVYTW9ZV1JrS1R0Y2JpQWdkbUZ5SUdrZ1BTQnJaWGx6TG14bGJtZDBhRHRjYmlBZ2QyaHBiR1VnS0drdExTa2dlMXh1SUNBZ0lHOXlhV2RwYmx0clpYbHpXMmxkWFNBOUlHRmtaRnRyWlhselcybGRYVHRjYmlBZ2ZWeHVJQ0J5WlhSMWNtNGdiM0pwWjJsdU8xeHVmVHRjYmx4dVpuVnVZM1JwYjI0Z2FHRnpUM2R1VUhKdmNHVnlkSGtvYjJKcUxDQndjbTl3S1NCN1hHNGdJSEpsZEhWeWJpQlBZbXBsWTNRdWNISnZkRzkwZVhCbExtaGhjMDkzYmxCeWIzQmxjblI1TG1OaGJHd29iMkpxTENCd2NtOXdLVHRjYm4xY2JpSmRmUT09IiwiKGZ1bmN0aW9uKHNlbGYpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGlmIChzZWxmLmZldGNoKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgc3VwcG9ydCA9IHtcbiAgICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gICAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gICAgYmxvYjogJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiYgJ0Jsb2InIGluIHNlbGYgJiYgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gICAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXG4gIH1cblxuICBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICAgIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICAgIF1cblxuICAgIHZhciBpc0RhdGFWaWV3ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbiAgICB9XG5cbiAgICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPSBBcnJheUJ1ZmZlci5pc1ZpZXcgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gICAgfVxuICAgIGlmICgvW15hLXowLTlcXC0jJCUmJyorLlxcXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICAgIH1cbiAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICAvLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxuICBmdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICAgIHZhciBpdGVyYXRvciA9IHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvclxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpdGVyYXRvclxuICB9XG5cbiAgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgdGhpcy5tYXAgPSB7fVxuXG4gICAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgICB9LCB0aGlzKVxuXG4gICAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gICAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUrJywnK3ZhbHVlIDogdmFsdWVcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2gobmFtZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkgeyBpdGVtcy5wdXNoKHZhbHVlKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xuICB9XG5cbiAgZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICAgIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gICAgfVxuICAgIGJvZHkuYm9keVVzZWQgPSB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgICB9XG4gICAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gICAgfVxuICAgIHJldHVybiBjaGFycy5qb2luKCcnKVxuICB9XG5cbiAgZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gICAgaWYgKGJ1Zi5zbGljZSkge1xuICAgICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEJvZHkoKSB7XG4gICAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgICAgaWYgKCFib2R5KSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKVxuICAgICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgQm9keUluaXQgdHlwZScpXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxuICB2YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgcmV0dXJuIChtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSkgPyB1cGNhc2VkIDogbWV0aG9kXG4gIH1cblxuICBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuXG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgICB9XG4gICAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgICAgfVxuICAgICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgICB9XG5cbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdvbWl0J1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcbiAgICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gICAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICAgIH1cbiAgICB0aGlzLl9pbml0Qm9keShib2R5KVxuICB9XG5cbiAgUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywgeyBib2R5OiB0aGlzLl9ib2R5SW5pdCB9KVxuICB9XG5cbiAgZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgYm9keS50cmltKCkuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAgIHJhd0hlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgICAgdmFyIGtleSA9IHBhcnRzLnNoaWZ0KCkudHJpbSgpXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBoZWFkZXJzXG4gIH1cblxuICBCb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbiAgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fVxuICAgIH1cblxuICAgIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICAgIHRoaXMuc3RhdHVzID0gJ3N0YXR1cycgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzIDogMjAwXG4gICAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICAgIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJ1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gICAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG4gIH1cblxuICBCb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG4gIFJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgICAgdXJsOiB0aGlzLnVybFxuICAgIH0pXG4gIH1cblxuICBSZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gICAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIHZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG4gIFJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG4gIH1cblxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG5cbiAgc2VsZi5mZXRjaCA9IGZ1bmN0aW9uKGlucHV0LCBpbml0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKVxuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJylcbiAgICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICAgIH1cblxuICAgICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgICB9KVxuXG4gICAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICAgIH0pXG4gIH1cbiAgc2VsZi5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzKTtcbiIsIm1vZHVsZS5leHBvcnRzLlByb2R1Y3Rpb24gPSByZXF1aXJlKCcuL3Byb2R1Y3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzLlNhbmRib3ggPSByZXF1aXJlKCcuL3NhbmRib3gnKTtcbiIsIi8qKlxuICogQGNsYXNzIFByb2R1Y3Rpb24gQVBJXG4gKi9cbmNsYXNzIFByb2R1Y3Rpb25BUEkge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBQcm9kdWN0aW9uQVBJXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW5kcG9pbnQgLSBUaGUgaG9zdCBlbmRwb2ludFxuICAgKiBAcGFyYW0ge09iamVjdH0gZmV0Y2hGbiAtIFRoZSBmdW5jdGlvbiB0byB1c2UgZm9yIGZldGNoaW5nIHRoZSBkYXRhIC0gRGVmYXVsdHMgdG8gd2luZG93LmZldGNoXG4gICAqIEByZXR1cm4ge1Byb2R1Y3Rpb25BUEl9XG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbmRwb2ludCwgZmV0Y2hGbiA9ICguLi5hcmdzKSA9PiB3aW5kb3cuZmV0Y2goLi4uYXJncykpIHtcbiAgICB0aGlzLl9lbmRwb2ludCA9IGVuZHBvaW50O1xuICAgIHRoaXMuX2ZldGNoRm4gPSBmZXRjaEZuO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIFByb3BhZ2F0ZXMgaW52b2tlIGNhbGwgdG8gX2ZldGNoRm5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlc291cmNlIC0gVGhlIHJlc291cmNlIHRvIGZldGNoIGZyb21cbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWQgLSBUaGUgcGF5bG9hZCB0byBwYXNzXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBpbnZva2UocmVzb3VyY2UsIHBheWxvYWQpIHtcbiAgICBsZXQgc3RhdHVzID0gMDtcbiAgICByZXR1cm4gdGhpcy5fZmV0Y2hGbihgJHt0aGlzLl9lbmRwb2ludH0vJHtyZXNvdXJjZX1gLCBwYXlsb2FkKS50aGVuKChyZXMpID0+IHtcbiAgICAgIHN0YXR1cyA9IHJlcy5zdGF0dXM7XG4gICAgICBpZiAoc3RhdHVzICE9PSAyMDQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICB9KS50aGVuKGJvZHkgPT4gKHsgYm9keSwgc3RhdHVzIH0pKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2R1Y3Rpb25BUEk7XG4iLCJjb25zdCBVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmNvbnN0IHN0cmlwQmVhcmVyID0gVXRpbHMuc3RyaXBCZWFyZXI7XG5cbi8qKlxuICogR2VuZXJhdGVzIGFuIEhUVFAgcmVzcG9uc2Ugb2JqZWN0XG4gKlxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqXG4gKi9cbmNvbnN0IHJlc3BvbnNlID0gKHN0YXR1cyA9IDIwMCwgYm9keSA9IHt9KSA9PiAoUHJvbWlzZS5yZXNvbHZlKHtcbiAgc3RhdHVzLFxuICBib2R5LFxufSkpO1xuXG4vKipcbiAqIEBjbGFzcyBTYW5kYm94IEFQSVxuICovXG5jbGFzcyBTYW5kYm94QVBJIHtcblxuICAvKipcbiAgICogTWFwcyBBUEkgcmVzb3VyY2VzIHRvIHJlc3BvbnNlIG9iamVjdHNcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICovXG4gIHN0YXRpYyBnZXQgcmVzb3VyY2VzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIE1hcHMgYC91c2Vyc2AgcmVzb3VyY2VcbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICpcbiAgICAgICAqL1xuICAgICAgdXNlcnM6IHtcbiAgICAgICAgR0VUOiAoZGF0YWJhc2UsIGlkLCBib2R5LCBoZWFkZXJzKSA9PiB7XG4gICAgICAgICAgY29uc3QgdG9rZW4gPSBzdHJpcEJlYXJlcihoZWFkZXJzLkF1dGhvcml6YXRpb24pO1xuICAgICAgICAgIGlmICghZGF0YWJhc2UuaGFzVXNlcldpdGhUb2tlbih0b2tlbikpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZSg0MDQsIHsgZXJyb3I6ICdub3RfZm91bmQnIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoMjAwLCBkYXRhYmFzZS5nZXRVc2VyV2l0aFRva2VuKHRva2VuKSk7XG4gICAgICAgIH0sXG4gICAgICAgIFBPU1Q6IChkYXRhYmFzZSwgaWQsIGJvZHkpID0+IHtcbiAgICAgICAgICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCwgZmlyc3RfbmFtZSwgbGFzdF9uYW1lIH0gPSBib2R5O1xuICAgICAgICAgIGlmIChkYXRhYmFzZS5oYXNVc2VyV2l0aERhdGEoZW1haWwsIHBhc3N3b3JkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDQwMCwgeyBlcnJvcjogJ3ZhbGlkYXRpb25fZmFpbGVkJyB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbmV3VXNlciA9IGRhdGFiYXNlLmFkZFVzZXIoZW1haWwsIHBhc3N3b3JkLCBmaXJzdF9uYW1lLCBsYXN0X25hbWUpO1xuICAgICAgICAgIHJldHVybiByZXNwb25zZSgyMDEsIG5ld1VzZXIpO1xuICAgICAgICB9LFxuICAgICAgICBQQVRDSDogKGRhdGFiYXNlLCBpZCwgYm9keSwgaGVhZGVycykgPT4ge1xuICAgICAgICAgIGNvbnN0IHRva2VuID0gc3RyaXBCZWFyZXIoaGVhZGVycy5BdXRob3JpemF0aW9uKTtcbiAgICAgICAgICBjb25zdCB7IGZpcnN0X25hbWUsIGxhc3RfbmFtZSB9ID0gYm9keTtcbiAgICAgICAgICBpZiAoZGF0YWJhc2UuZ2V0VXNlcldpdGhUb2tlbih0b2tlbikgIT09IGRhdGFiYXNlLmdldFVzZXJXaXRoSWQoaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoNDAwLCB7IGVycm9yOiAnaW52YWxpZF9ncmFudCcgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHBhdGNoZWRVc2VyID0gZGF0YWJhc2UudXBkYXRlVXNlcihpZCwgZmlyc3RfbmFtZSwgbGFzdF9uYW1lKTtcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoMjAwLCBwYXRjaGVkVXNlcik7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLyoqXG4gICAgICAgKiBNYXBzIGAvdG9rZW5gIHJlc291cmNlXG4gICAgICAgKlxuICAgICAgICogQHNlZSBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNjc0OVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqXG4gICAgICAgKi9cbiAgICAgIHRva2VuOiB7XG4gICAgICAgIFBPU1Q6IChkYXRhYmFzZSwgaWQsIGJvZHkpID0+IHtcbiAgICAgICAgICBjb25zdCB7IGdyYW50X3R5cGUsIHVzZXJuYW1lLCBwYXNzd29yZCwgcmVmcmVzaF90b2tlbiB9ID0gYm9keTtcbiAgICAgICAgICBpZiAoZ3JhbnRfdHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAgICAgaWYgKCFkYXRhYmFzZS5oYXNVc2VyV2l0aERhdGEodXNlcm5hbWUsIHBhc3N3b3JkKSkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoNDA0LCB7IGVycm9yOiAnbm90X2ZvdW5kJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBkYXRhYmFzZS5nZXRVc2VyV2l0aERhdGEodXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZSgyMDAsIGRhdGFiYXNlLmdldFRva2VuRm9yKHVzZXIuaWQpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgaWYgKGdyYW50X3R5cGUgPT09ICdyZWZyZXNoX3Rva2VuJykge1xuICAgICAgICAgICAgaWYgKCFkYXRhYmFzZS5oYXNUb2tlbldpdGhSZWZyZXNoKHJlZnJlc2hfdG9rZW4pKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXNwb25zZSg0MDAsIHsgZXJyb3I6ICdpbnZhbGlkX3Rva2VuJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlZnJlc2hlZFRva2VuID0gZGF0YWJhc2UudXBkYXRlVG9rZW4ocmVmcmVzaF90b2tlbik7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoMjAwLCByZWZyZXNoZWRUb2tlbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXNwb25zZSg0MDQsIHsgZXJyb3I6ICd1bmV4cGVjdGVkX2Vycm9yJyB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIE1hcHMgYC9wYXNzd29yZHNgIHJlc291cmNlXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqXG4gICAgICAgKi9cbiAgICAgIHBhc3N3b3Jkczoge1xuICAgICAgICBQT1NUOiAoZGF0YWJhc2UsIGlkLCBib2R5KSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBlbWFpbCB9ID0gYm9keTtcbiAgICAgICAgICBpZiAoIWRhdGFiYXNlLmhhc1VzZXJXaXRoRW1haWwoZW1haWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoNDA0LCB7IGVycm9yOiAnbm90X2ZvdW5kJyB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIFBVVDogKGRhdGFiYXNlLCBpZCkgPT4ge1xuICAgICAgICAgIGlmICghZGF0YWJhc2UuaGFzUGFzc3dvcmRSZXNldFRva2VuKGlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDQwNCwgeyBlcnJvcjogJ25vdF9mb3VuZCcgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXNwb25zZSgpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIFNhbmRib3hBUElcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7U2FuZGJveERhdGFiYXNlfSBkYXRhYmFzZSAtIFRoZSBkYXRhYmFzZSB0byB1c2UgZm9yIHN0b3Jpbmcgc2Vzc3Npb24gY2hhbmdlc1xuICAgKiBAcmV0dXJuIHtTYW5kYm94QVBJfVxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YWJhc2UpIHtcbiAgICB0aGlzLl9kYXRhYmFzZSA9IGRhdGFiYXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0dWJzIEFQSSBjYWxsc1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVzb3VyY2UgLSBUaGUgcmVzb3VyY2UgdG8gZmV0Y2ggZnJvbVxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIFRoZSBwYXlsb2QgdG8gcHJvcGFnYXRlXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBpbnZva2UocmVzb3VyY2UsIHBheWxvYWQpIHtcbiAgICBjb25zdCBbcm91dGUsIGlkXSA9IHJlc291cmNlLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgeyBtZXRob2QsIGJvZHksIGhlYWRlcnMgfSA9IHBheWxvYWQ7XG4gICAgcmV0dXJuIFNhbmRib3hBUEkucmVzb3VyY2VzW3JvdXRlXVttZXRob2RdKHRoaXMuX2RhdGFiYXNlLCBpZCwgYm9keSwgaGVhZGVycyk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNhbmRib3hBUEk7XG4iLCJjb25zdCBVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmNvbnN0IGdlbmVyYXRlUmFuZG9tU3RyaW5nID0gVXRpbHMuZ2VuZXJhdGVSYW5kb21TdHJpbmc7XG5jb25zdCBnZW5lcmF0ZVJhbmRvbVVVSUQgPSBVdGlscy5nZW5lcmF0ZVJhbmRvbVVVSUQ7XG5cbi8qKlxuICogQGNsYXNzIFNhbmRib3hEYXRhYmFzZVxuICovXG5jbGFzcyBTYW5kYm94RGF0YWJhc2Uge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBTYW5kYm94QVBJXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0pTT059IHVzZXJzIC0gVGhlIGluaXRpYWwgdXNlciBmaXh0dXJlc1xuICAgKiBAcGFyYW0ge0pTT059IHRva2VucyAtIFRoZSBpbml0aWFsIHRva2VuIGZpeHR1cmVzXG4gICAqIEBwYXJhbSB7SlNPTn0gcGFzc3dvcmRzIC0gVGhlIGluaXRpYWwgcGFzc3dvcmRzIGZpeHR1cmVzXG4gICAqIEByZXR1cm4gU2FuZGJveERhdGFiYXNlXG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih1c2VycywgdG9rZW5zLCBwYXNzd29yZHMpIHtcbiAgICB0aGlzLl91c2VycyA9IFsuLi51c2Vyc107XG4gICAgdGhpcy5fdG9rZW5zID0gWy4uLnRva2Vuc107XG4gICAgdGhpcy5fcGFzc3dvcmRzID0gWy4uLnBhc3N3b3Jkc107XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB1c2Vyc1xuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICpcbiAgICovXG4gIGdldCB1c2VycygpIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlcnM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0b2tlbnNcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqXG4gICAqL1xuICBnZXQgdG9rZW5zKCkge1xuICAgIHJldHVybiB0aGlzLl90b2tlbnM7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdHMgYHB1YmxpY2AgdXNlciBkYXRhXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICpcbiAgKi9cbiAgX2V4dHJhY3RVc2VyKGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGRhdGEuaWQsXG4gICAgICBwdWJsaXNoZXJfaWQ6IGRhdGEucHVibGlzaGVyX2lkLFxuICAgICAgZmlyc3RfbmFtZTogZGF0YS5maXJzdF9uYW1lLFxuICAgICAgbGFzdF9uYW1lOiBkYXRhLmxhc3RfbmFtZSxcbiAgICAgIGVtYWlsOiBkYXRhLmVtYWlsLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdHMgYHB1YmxpY2AgdG9rZW4gZGF0YVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqXG4gICovXG4gIF9leHRyYWN0VG9rZW4oZGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICBhY2Nlc3NfdG9rZW46IGRhdGEuYWNjZXNzX3Rva2VuLFxuICAgICAgcmVmcmVzaF90b2tlbjogZGF0YS5yZWZyZXNoX3Rva2VuLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBkYXRhYmFzZSBoYXMgYSBzcGVjaWZpYyB0b2tlbiBiYXNlZCBvbiByZWZyZXNoX3Rva2VuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZWZyZXNoVG9rZW4gLSBUaGUgcmVmcmVzaCB0b2tlbiB0byBsb29rdXBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICpcbiAgICovXG4gIGhhc1Rva2VuV2l0aFJlZnJlc2gocmVmcmVzaFRva2VuKSB7XG4gICAgcmV0dXJuICEhfnRoaXMuX3Rva2Vucy5maW5kSW5kZXgodG9rZW4gPT4gdG9rZW4ucmVmcmVzaF90b2tlbiA9PT0gcmVmcmVzaFRva2VuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIGRhdGFiYXNlIGhhcyBhIHNwZWNpZmljIHVzZXIgYmFzZWQgb24gZGF0YVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwgdG8gbG9va3VwXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSBwYXNzd29yZCB0byBsb29rdXBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICpcbiAgICovXG4gIGhhc1VzZXJXaXRoRGF0YShlbWFpbCwgcGFzc3dvcmQpIHtcbiAgICByZXR1cm4gISF+dGhpcy5fdXNlcnMuZmluZEluZGV4KHVzZXIgPT4gdXNlci5lbWFpbCA9PT0gZW1haWwgJiYgdXNlci5wYXNzd29yZCA9PT0gcGFzc3dvcmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgZGF0YWJhc2UgaGFzIGEgc3BlY2lmaWMgdXNlciBiYXNlZCBvbiB0b2tlblxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWNjZXNzVG9rZW4gLSBUaGUgdG9rZW4gdG8gbG9va3VwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqXG4gICAqL1xuICBoYXNVc2VyV2l0aFRva2VuKGFjY2Vzc1Rva2VuKSB7XG4gICAgcmV0dXJuICEhfnRoaXMuX3Rva2Vucy5maW5kSW5kZXgodG9rZW4gPT4gdG9rZW4uYWNjZXNzX3Rva2VuID09PSBhY2Nlc3NUb2tlbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0b2tlbiBmb3IgYSB1c2VyXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgLSBUaGUgdXNlciBpZCB0byBsb29rdXBcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKlxuICAgKi9cbiAgZ2V0VG9rZW5Gb3IodXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rva2Vucy5maW5kKHRva2VuID0+IHRva2VuLnVzZXJfaWQgPT09IHVzZXJJZCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBkYXRhYmFzZSBoYXMgYSBzcGVjaWZpYyB1c2VyIGJhc2VkIG9uIGVtYWlsXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCB0byBsb29rdXBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICpcbiAgICovXG4gIGhhc1VzZXJXaXRoRW1haWwoZW1haWwpIHtcbiAgICByZXR1cm4gISF+dGhpcy5fdXNlcnMuZmluZEluZGV4KHVzZXIgPT4gdXNlci5lbWFpbCA9PT0gZW1haWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgZGF0YWJhc2UgaGFzIGEgc3BlY2lmaWMgcGFzc3dvcmQgcmVzZXQgdG9rZW5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIC0gVGhlIHRva2VuIHRvIGxvb2t1cFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKlxuICAgKi9cbiAgaGFzUGFzc3dvcmRSZXNldFRva2VuKHRva2VuKSB7XG4gICAgcmV0dXJuICEhfnRoaXMuX3Bhc3N3b3Jkcy5maW5kSW5kZXgocmVjb3JkID0+IHJlY29yZC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdXNlciBmcm9tIGZpeHR1cmVzIGJhc2VkIG9uIGRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsIC0gVGhlIHRhcmdldCB1c2VyIGVtYWlsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSB0YXJnZXQgdXNlciBwYXNzd29yZFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKlxuICAgKi9cbiAgZ2V0VXNlcldpdGhEYXRhKGVtYWlsLCBwYXNzd29yZCkge1xuICAgIHJldHVybiB0aGlzLl9leHRyYWN0VXNlcih0aGlzLl91c2Vycy5maW5kKHVzZXIgPT4gKHVzZXIuZW1haWwgPT09IGVtYWlsICYmIHVzZXIucGFzc3dvcmQgPT09IHBhc3N3b3JkKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIFJldHVybnMgdXNlciBmcm9tIGZpeHR1cmVzIGJhc2VkIG9uIGBpZGBcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIHVzZXIgaWQgdG8gbG9va3VwXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGZvdW5kIHVzZXIgZGF0YVxuICAgKlxuICAgKi9cbiAgZ2V0VXNlcldpdGhJZChpZCkge1xuICAgIHJldHVybiB0aGlzLl9leHRyYWN0VXNlcih0aGlzLl91c2Vycy5maW5kKHVzZXIgPT4gdXNlci5pZCA9PT0gaWQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHVzZXIgZnJvbSBmaXh0dXJlcyBiYXNlZCBvbiB0b2tlblxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWNjZXNzVG9rZW4gLSBUaGUgdG9rZW4gdG8gbG9va3VwXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGZvdW5kIGBhY2Nlc3NfdG9rZW5gIGFuZCBgcmVmcmVzaF90b2tlbmBcbiAgICpcbiAgICovXG4gIGdldFVzZXJXaXRoVG9rZW4oYWNjZXNzVG9rZW4pIHtcbiAgICBjb25zdCB1c2VySWQgPSB0aGlzLl90b2tlbnMuZmluZCh0b2tlbiA9PiB0b2tlbi5hY2Nlc3NfdG9rZW4gPT09IGFjY2Vzc1Rva2VuKS51c2VyX2lkO1xuICAgIHJldHVybiB0aGlzLmdldFVzZXJXaXRoSWQodXNlcklkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHVzZXIgdG8gZml4dHVyZXNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsIHRvIHNldFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgcGFzc3dvcmQgdG8gc2V0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmaXJzdE5hbWUgLSBUaGUgZmlyc3ROYW1lIHRvIHNldCAtIE9wdGlvbmFsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYXN0TmFtZSAtIFRoZSBsYXN0TmFtZSB0byBzZXQgLSBPcHRpb25hbFxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB1c2VyIGRhdGEgbWVyZ2VkIGludG8gYW4gb2JqZWN0XG4gICAqXG4gICAqL1xuICBhZGRVc2VyKGVtYWlsLCBwYXNzd29yZCwgZmlyc3ROYW1lLCBsYXN0TmFtZSkge1xuICAgIGNvbnN0IHVzZXJJZCA9IGdlbmVyYXRlUmFuZG9tVVVJRCgpO1xuICAgIGNvbnN0IHB1Ymxpc2hlcklkID0gZ2VuZXJhdGVSYW5kb21VVUlEKCk7XG4gICAgY29uc3QgYWNjZXNzVG9rZW4gPSBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICAgIGNvbnN0IHJlZnJlc2hUb2tlbiA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gICAgY29uc3QgbmV3VG9rZW4gPSB7XG4gICAgICB1c2VyX2lkOiB1c2VySWQsXG4gICAgICBhY2Nlc3NfdG9rZW46IGFjY2Vzc1Rva2VuLFxuICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuICAgIH07XG4gICAgY29uc3QgbmV3VXNlciA9IHtcbiAgICAgIGlkOiB1c2VySWQsXG4gICAgICBwdWJsaXNoZXJfaWQ6IHB1Ymxpc2hlcklkLFxuICAgICAgZW1haWwsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIGZpcnN0X25hbWU6IGZpcnN0TmFtZSxcbiAgICAgIGxhc3RfbmFtZTogbGFzdE5hbWUsXG4gICAgfTtcbiAgICAvLyBTdG9yZSBuZXcgcmVjb3Jkc1xuICAgIHRoaXMuX3Rva2Vucy5wdXNoKG5ld1Rva2VuKTtcbiAgICB0aGlzLl91c2Vycy5wdXNoKG5ld1VzZXIpO1xuICAgIC8vIFJldHVybiBwdWJsaWMgdXNlciBkYXRhXG4gICAgcmV0dXJuIHRoaXMuX2V4dHJhY3RVc2VyKG5ld1VzZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdXNlclxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgdXNlciBpZCB0byBsb29rdXBcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpcnN0TmFtZSAtIFRoZSBmaXJzdE5hbWUgdG8gdXBkYXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYXN0TmFtZSAtIFRoZSBsYXN0TmFtZSB0byB1cGRhdGVcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdXNlciBkYXRhIG1lcmdlZCBpbnRvIGFuIG9iamVjdFxuICAgKlxuICAgKi9cbiAgdXBkYXRlVXNlcihpZCwgZmlyc3ROYW1lLCBsYXN0TmFtZSkge1xuICAgIGNvbnN0IHVzZXIgPSB0aGlzLl91c2Vycy5maW5kKHJlY29yZCA9PiByZWNvcmQuaWQgPT09IGlkKTtcbiAgICBpZiAodHlwZW9mIGZpcnN0TmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHVzZXIuZmlyc3RfbmFtZSA9IGZpcnN0TmFtZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsYXN0TmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHVzZXIubGFzdF9uYW1lID0gbGFzdE5hbWU7XG4gICAgfVxuICAgIC8vIFJldHVybiBwdWJsaWMgdXNlciBkYXRhXG4gICAgcmV0dXJuIHRoaXMuX2V4dHJhY3RVc2VyKHVzZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdG9rZW5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlZnJlc2hUb2tlbiAtIFRoZSByZWZyZXNoVG9rZW4gdG8gdXNlXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGZvdW5kIGBhY2Nlc3NfdG9rZW5gIGFuZCBgcmVmcmVzaF90b2tlbmBcbiAgICpcbiAgICovXG4gIHVwZGF0ZVRva2VuKHJlZnJlc2hUb2tlbikge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5fdG9rZW5zLmZpbmQocmVjb3JkID0+IHJlY29yZC5yZWZyZXNoX3Rva2VuID09PSByZWZyZXNoVG9rZW4pO1xuICAgIHRva2VuLmFjY2Vzc190b2tlbiA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gICAgdG9rZW4ucmVmcmVzaF90b2tlbiA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gICAgLy8gUmV0dXJuIHB1YmxpYyB1c2VyIGRhdGFcbiAgICByZXR1cm4gdGhpcy5fZXh0cmFjdFRva2VuKHRva2VuKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FuZGJveERhdGFiYXNlO1xuIiwiY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5jb25zdCBDb25zdW1lciA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2NvbnN1bWVyJyk7XG5jb25zdCB2YWxpZGF0ZVBhc3N3b3JkID0gcmVxdWlyZSgnLi4vdXRpbHMnKS52YWxpZGF0ZVBhc3N3b3JkO1xuXG4vKipcbiAqIEBjbGFzcyBBdXRoZW50aWNhdG9yXG4gKi9cbmNsYXNzIEF1dGhlbnRpY2F0b3Ige1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBBdXRoZW50aWNhdG9yXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZSB0byB1c2VcbiAgICogQHJldHVybiB7QXV0aGVudGljYXRvcn1cbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbnN1bWVyKSB7XG4gICAgYXNzZXJ0KGNvbnN1bWVyIGluc3RhbmNlb2YgQ29uc3VtZXIsICdgY29uc3VtZXJgIHNob3VsZCBiZSBpbnN0YW5jZSBvZiBDb25zdW1lcicpO1xuICAgIHRoaXMuX2NvbnN1bWVyID0gY29uc3VtZXI7XG4gIH1cblxuICAvKipcbiAgICogQXNrcyBmb3IgYSBwYXNzd29yZCByZXNldFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwgdG8gcmVzZXQgdGhlIHBhc3N3b3JkIGZvclxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmVxdWVzdFBhc3N3b3JkUmVzZXQoZW1haWwpIHtcbiAgICBhc3NlcnQoZW1haWwsICdNaXNzaW5nIGBlbWFpbGAnKTtcbiAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIucmVxdWVzdFBhc3N3b3JkUmVzZXQoZW1haWwpLnRoZW4oKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgbWVzc2FnZTogJ0EgcmVzZXQgbGluayBoYXMgYmVlbiBzZW50IHRvIHlvdXIgZW1haWwnIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgbmV3IHBhc3N3b3JkXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiAtIFRoZSByZXNldCB0b2tlbiBwcm92aWRlZCB2aWEgZW1haWxcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIG5ldyBwYXNzd29yZFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmVzZXRQYXNzd29yZCh0b2tlbiwgcGFzc3dvcmQpIHtcbiAgICBhc3NlcnQodG9rZW4sICdNaXNzaW5nIGB0b2tlbmAnKTtcbiAgICBhc3NlcnQocGFzc3dvcmQsICdNaXNzaW5nIGBwYXNzd29yZGAnKTtcbiAgICBjb25zdCB7IGlzVmFsaWQsIG1lc3NhZ2UgfSA9IHZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpO1xuICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihtZXNzYWdlKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb25zdW1lci5yZXNldFBhc3N3b3JkKHRva2VuLCBwYXNzd29yZCkudGhlbigoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBtZXNzYWdlOiAnWW91ciBwYXNzd29yZCBoYXMgYmVlbiByZXNldCcgfSkpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoZW50aWNhdG9yO1xuIiwiY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbi8qKlxuICogQGNsYXNzIENsaWVudFxuICovXG5jbGFzcyBDbGllbnQge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBDbGllbnRcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBDbGllbnQgaWRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlY3JldCAtIFRoZSBDbGllbnQgc2VjcmV0XG4gICAqIEByZXR1cm4ge0NsaWVudH1cbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKGlkLCBzZWNyZXQpIHtcbiAgICBhc3NlcnQoaWQsICdNaXNzaW5nIGBpZGAnKTtcbiAgICBhc3NlcnQoc2VjcmV0LCAnTWlzc2luZyBgc2VjcmV0YCcpO1xuICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgdGhpcy5fc2VjcmV0ID0gc2VjcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgQ2xpZW50IGlkXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICpcbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBDbGllbnQgc2VjcmV0XG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICpcbiAgICovXG4gIGdldCBzZWNyZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlY3JldDtcbiAgfVxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IENsaWVudDtcbiIsImNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJyk7XG5jb25zdCByZXRyaWV2ZVVSTCA9IHJlcXVpcmUoJy4uL3V0aWxzJykucmV0cmlldmVVUkw7XG5jb25zdCByZWRpcmVjdFRvVVJMID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5yZWRpcmVjdFRvVVJMO1xuXG4vKipcbiAqIEBjbGFzcyBTZXNzaW9uXG4gKi9cbmNsYXNzIFNlc3Npb24ge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBVc2VyXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1VzZXJ9IGNvbnN1bWVyIC0gVGhlIFVzZXIgaW5zdGFuY2UgdG8gdXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsb2dpbkhvc3QgLSBUaGUgbG9naW4gYXBwIGhvc3RcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlZGlyZWN0Rm4gLSBUaGUgZnVuY3Rpb24gdGhlIGZvcmNlcyBVUkwgcmVkaXJlY3Rpb24gLSBEZWZhdWx0cyB0byBgd2luZG93LmxvY2F0aW9uLnJlcGxhY2VgXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYWdlVVJMIC0gVGhlIGN1cnJlbnQgcGFnZSBVUkwgLSBEZWZhdWx0cyB0byBgd2luZG93LmhyZWZgXG4gICAqIEByZXR1cm4ge1VzZXJ9XG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih1c2VyLCBsb2dpbkhvc3QsIHJlZGlyZWN0Rm4gPSByZWRpcmVjdFRvVVJMLCBwYWdlVVJMID0gcmV0cmlldmVVUkwpIHtcbiAgICBhc3NlcnQodXNlciBpbnN0YW5jZW9mIFVzZXIsICdgdXNlcmAgc2hvdWxkIGJlIGluc3RhbmNlIG9mIFVzZXInKTtcbiAgICBhc3NlcnQobG9naW5Ib3N0LCAnYGxvZ2luSG9zdGAgaXMgbm90IGRlZmluZWQnKTtcbiAgICB0aGlzLl91c2VyID0gdXNlcjtcbiAgICB0aGlzLl9sb2dpbkhvc3QgPSBsb2dpbkhvc3Q7XG4gICAgdGhpcy5fcmVkaXJlY3RGbiA9IHJlZGlyZWN0Rm47XG4gICAgdGhpcy5fcGFnZVVSTCA9IHBhZ2VVUkw7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBzZXNzaW9uIGlzIHZhbGlkIChVc2VyIGlzIGF1dGhlbnRpY2F0ZWQpXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqXG4gICAqL1xuICBnZXQgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuX3VzZXIuYmVhcmVyICE9PSAndW5kZWZpbmVkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBzZXNzaW9uIGZvciB1c2VyIChpZiBkZWZpbmVkKSBpbiBTdG9yZVxuICAgKiBOb3RlOiBUaGlzIHNob3VsZCBiZSB0aGUgRklSU1QgY2FsbCBiZWZvcmUgYXR0ZW1wdGluZyBhbnkgb3RoZXIgc2Vzc2lvbiBvcGVyYXRpb25zXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHJldHVybiB0aGlzLl91c2VyLnN5bmNXaXRoU3RvcmUoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEludmFsaWRhdGVzIFNlc3Npb25cbiAgICpcbiAgICogQHJldHVybiB7Vm9pZH1cbiAgICpcbiAgICovXG4gIGludmFsaWRhdGUoKSB7XG4gICAgLy8gUmVkaXJlY3QgdG8gbG9naW4gaG9zdCB3aXRoIGEgcmV0dXJuIFVSTFxuICAgIHJldHVybiB0aGlzLl9yZWRpcmVjdEZuKGAke3RoaXMuX2xvZ2luSG9zdH0vbG9nb3V0YCk7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGVzIFNlc3Npb25cbiAgICogLSBFeHRyYWN0cyBjdXJyZW50IFVSTCBmcm9tIHdpbmRvdy5sb2NhdGlvblxuICAgKiAtIFJlZGlyZWN0cyB0byBgbG9naW5Ib3N0YCB3aXRoIGVuY29kZWQgVVJMXG4gICAqXG4gICAqIEByZXR1cm4ge1ZvaWR9XG4gICAqXG4gICAqL1xuICB2YWxpZGF0ZSgpIHtcbiAgICBjb25zdCByZWRpcmVjdFVybCA9IGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLl9wYWdlVVJMKCkpO1xuICAgIHJldHVybiB0aGlzLl9yZWRpcmVjdEZuKGAke3RoaXMuX2xvZ2luSG9zdH0vbG9naW4/cmVkaXJlY3RVcmw9JHtyZWRpcmVjdFVybH1gKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlc3Npb247XG4iLCJjb25zdCBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcbmNvbnN0IENvbnN1bWVyID0gcmVxdWlyZSgnLi4vc2VydmljZXMvY29uc3VtZXInKTtcbmNvbnN0IFN0b3JlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvc3RvcmUnKTtcbmNvbnN0IHZhbGlkYXRlUGFzc3dvcmQgPSByZXF1aXJlKCcuLi91dGlscycpLnZhbGlkYXRlUGFzc3dvcmQ7XG5cbi8qKlxuICogQGNsYXNzIFVzZXJcbiAqL1xuY2xhc3MgVXNlciB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIFVzZXJcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7U3RvcmV9IHN0b3JlIC0gVGhlIFN0b3JlIGluc3RhbmNlIHRvIHVzZVxuICAgKiBAcGFyYW0ge0NvbnN1bWVyfSBjb25zdW1lciAtIFRoZSBDb25zdW1lciBpbnN0YW5jZSB0byB1c2VcbiAgICogQHJldHVybiB7VXNlcn1cbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKHN0b3JlLCBjb25zdW1lcikge1xuICAgIGFzc2VydChzdG9yZSBpbnN0YW5jZW9mIFN0b3JlLCAnYHN0b3JlYCBzaG91bGQgYmUgaW5zdGFuY2Ugb2YgU3RvcmUnKTtcbiAgICBhc3NlcnQoY29uc3VtZXIgaW5zdGFuY2VvZiBDb25zdW1lciwgJ2Bjb25zdW1lcmAgc2hvdWxkIGJlIGluc3RhbmNlIG9mIENvbnN1bWVyJyk7XG4gICAgdGhpcy5fc3RvcmUgPSBzdG9yZTtcbiAgICB0aGlzLl9jb25zdW1lciA9IGNvbnN1bWVyO1xuICAgIHRoaXMuX2JlYXJlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9pZCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9wdWJsaXNoZXJJZCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9maXJzdE5hbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fbGFzdE5hbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZW1haWwgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5faXNEaXJ0eSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgVXNlciBpZFxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFtyZWFkLW9ubHldIGlkXG4gICAqXG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgVXNlciBwdWJsaXNoZXJJZFxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFtyZWFkLW9ubHldIHB1Ymxpc2hlcklkXG4gICAqXG4gICAqL1xuICBnZXQgcHVibGlzaGVySWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3B1Ymxpc2hlcklkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgVXNlciBlbWFpbFxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFtyZWFkLW9ubHldIGVtYWlsXG4gICAqXG4gICAqL1xuICBnZXQgZW1haWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VtYWlsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgVXNlciBiZWFyZXIgdG9rZW5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfSBbcmVhZC13cml0ZV0gYmVhcmVyIHRva2VuXG4gICAqXG4gICAqL1xuICBnZXQgYmVhcmVyKCkge1xuICAgIHJldHVybiB0aGlzLl9iZWFyZXI7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBVc2VyIGZpcnN0IE5hbWVcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfSBbcmVhZC13cml0ZV0gZmlyc3QgTmFtZVxuICAgKlxuICAgKi9cbiAgZ2V0IGZpcnN0TmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZmlyc3ROYW1lO1xuICB9XG4gIHNldCBmaXJzdE5hbWUobmV3Rmlyc3ROYW1lKSB7XG4gICAgaWYgKG5ld0ZpcnN0TmFtZSkge1xuICAgICAgdGhpcy5faXNEaXJ0eSA9IHRydWU7XG4gICAgICB0aGlzLl9maXJzdE5hbWUgPSBuZXdGaXJzdE5hbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgVXNlciBsYXN0IG5hbWVcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfSBbcmVhZC13cml0ZV0gbGFzdCBuYW1lXG4gICAqXG4gICAqL1xuICBnZXQgbGFzdE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3ROYW1lO1xuICB9XG4gIHNldCBsYXN0TmFtZShuZXdMYXN0TmFtZSkge1xuICAgIGlmIChuZXdMYXN0TmFtZSkge1xuICAgICAgdGhpcy5faXNEaXJ0eSA9IHRydWU7XG4gICAgICB0aGlzLl9sYXN0TmFtZSA9IG5ld0xhc3ROYW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jciBVc2VyIGRhdGEgZnJvbSBTdG9yZVxuICAgKiAtIEN1cnJlbnRseSBvbiBiZWFyZXIgaXMgc3luY2VkIHRvIFN0b3JlXG4gICAqIC0gU3RvcmUgcHJpb3JpdHkgcHJvY2VlZHMgZGlydHkgZGF0YVxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgc3luY1dpdGhTdG9yZSgpIHtcbiAgICBsZXQgYmVhcmVyO1xuICAgIHJldHVybiB0aGlzLl9zdG9yZS5nZXQoJ2FjY2Vzc190b2tlbicpLnRoZW4oKGFjY2Vzc1Rva2VuKSA9PiB7XG4gICAgICAvLyBDYWNoZSBiZWFyZXJcbiAgICAgIGJlYXJlciA9IGFjY2Vzc1Rva2VuO1xuICAgICAgcmV0dXJuIHRoaXMuX2NvbnN1bWVyLnJldHJpZXZlVXNlcihhY2Nlc3NUb2tlbik7XG4gICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5faWQgPSBkYXRhLmlkO1xuICAgICAgdGhpcy5fcHVibGlzaGVySWQgPSBkYXRhLnB1Ymxpc2hlcl9pZDtcbiAgICAgIHRoaXMuX2VtYWlsID0gZGF0YS5lbWFpbDtcbiAgICAgIHRoaXMuX2ZpcnN0TmFtZSA9IGRhdGEuZmlyc3RfbmFtZTtcbiAgICAgIHRoaXMuX2xhc3ROYW1lID0gZGF0YS5sYXN0X25hbWU7XG4gICAgICB0aGlzLl9iZWFyZXIgPSBiZWFyZXI7XG4gICAgICB0aGlzLl9pc0RpcnR5ID0gZmFsc2U7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgZGF0YSxcbiAgICAgICAgbWVzc2FnZTogJ1N5bmNlZCBVc2VyIG1vZGVsIHdpdGggU3RvcmUnLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBVc2VyIGRhdGFcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIHNhdmUoKSB7XG4gICAgaWYgKCF0aGlzLl9pZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignQ2Fubm90IHNhdmUgYSBub24tZXhpc3RlbnQgVXNlcicpKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9pc0RpcnR5KSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgbWVzc2FnZTogJ05vIFVzZXIgbW9kZWwgY2hhbmdlcyB0byBzeW5jJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIudXBkYXRlVXNlcih0aGlzLl9pZCwgdGhpcy5fYmVhcmVyLCB7XG4gICAgICBmaXJzdE5hbWU6IHRoaXMuX2ZpcnN0TmFtZSxcbiAgICAgIGxhc3ROYW1lOiB0aGlzLl9sYXN0TmFtZSxcbiAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSBmYWxzZTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBtZXNzYWdlOiAnVXBkYXRlZCBVc2VyIG1vZGVsJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVXNlclxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwgdG8gc2V0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSBwYXNzd29yZCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpcnN0TmFtZSAtIFRoZSBmaXJzdCBuYW1lIHRvIHNldFxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFzdE5hbWUgLSBUaGUgbGFzdCBuYW1lIHRvIHNldFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgY3JlYXRlKGVtYWlsLCBwYXNzd29yZCwgZmlyc3ROYW1lLCBsYXN0TmFtZSkge1xuICAgIGFzc2VydChlbWFpbCwgJ01pc3NpbmcgYGVtYWlsYCcpO1xuICAgIGFzc2VydChwYXNzd29yZCwgJ01pc3NpbmcgYHBhc3N3b3JkYCcpO1xuICAgIGNvbnN0IHsgaXNWYWxpZCwgbWVzc2FnZSB9ID0gdmFsaWRhdGVQYXNzd29yZChwYXNzd29yZCk7XG4gICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKG1lc3NhZ2UpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NvbnN1bWVyLmNyZWF0ZVVzZXIoZW1haWwsIHBhc3N3b3JkLCBmaXJzdE5hbWUsIGxhc3ROYW1lKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICB0aGlzLl9pZCA9IGRhdGEuaWQ7XG4gICAgICB0aGlzLl9wdWJsaXNoZXJJZCA9IGRhdGEucHVibGlzaGVyX2lkO1xuICAgICAgdGhpcy5fZmlyc3ROYW1lID0gZGF0YS5maXJzdF9uYW1lO1xuICAgICAgdGhpcy5fbGFzdE5hbWUgPSBkYXRhLmxhc3RfbmFtZTtcbiAgICAgIHRoaXMuX2VtYWlsID0gZGF0YS5lbWFpbDtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSBmYWxzZTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBtZXNzYWdlOiAnQ3JlYXRlZCBVc2VyJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyBhdXRoZW50aWNhdGlvbiB0b2tlbnMgZm9yIGEgdXNlcm5hbWUtcGFzc3dvcmQgY29tYmluYXRpb25cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJuYW1lIC0gVGhlIHVzZXJuYW1lIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgcGFzc3dvcmQgdG8gdXNlXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBhdXRoZW50aWNhdGUodXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gICAgYXNzZXJ0KHVzZXJuYW1lLCAnTWlzc2luZyBgdXNlcm5hbWVgJyk7XG4gICAgYXNzZXJ0KHBhc3N3b3JkLCAnTWlzc2luZyBgcGFzc3dvcmRgJyk7XG4gICAgbGV0IGJlYXJlcjtcbiAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIucmV0cmlldmVUb2tlbih1c2VybmFtZSwgcGFzc3dvcmQpLnRoZW4oKHJlcykgPT4ge1xuICAgICAgY29uc3QgeyBhY2Nlc3NfdG9rZW4sIHJlZnJlc2hfdG9rZW4gfSA9IHJlcztcbiAgICAgIC8vIENhY2hlIGJlYXJlclxuICAgICAgYmVhcmVyID0gYWNjZXNzX3Rva2VuO1xuICAgICAgLy8gU3RvcmUgdG9rZW5zXG4gICAgICByZXR1cm4gdGhpcy5fc3RvcmUuc2V0KCdhY2Nlc3NfdG9rZW4nLCBhY2Nlc3NfdG9rZW4pXG4gICAgICAgIC50aGVuKCgpID0+IHRoaXMuX3N0b3JlLnNldCgncmVmcmVzaF90b2tlbicsIHJlZnJlc2hfdG9rZW4pKVxuICAgICAgICAudGhlbigoKSA9PiB0aGlzLl9jb25zdW1lci5yZXRyaWV2ZVVzZXIoYWNjZXNzX3Rva2VuKSk7XG4gICAgICAvLyBSZXRyaWV2ZSB1c2VyIGRhdGFcbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICB0aGlzLl9iZWFyZXIgPSBiZWFyZXI7XG4gICAgICB0aGlzLl9pZCA9IGRhdGEuaWQ7XG4gICAgICB0aGlzLl9wdWJsaXNoZXJJZCA9IGRhdGEucHVibGlzaGVyX2lkO1xuICAgICAgdGhpcy5fZW1haWwgPSBkYXRhLmVtYWlsO1xuICAgICAgdGhpcy5fZmlyc3ROYW1lID0gZGF0YS5maXJzdF9uYW1lO1xuICAgICAgdGhpcy5fbGFzdE5hbWUgPSBkYXRhLmxhc3RfbmFtZTtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSBmYWxzZTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBtZXNzYWdlOiAnQXV0aGVudGljYXRlZCBVc2VyJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB1c2VyIGZvciBhbiBhY2Nlc3MgdG9rZW4uXG4gICAqIEZhbGxiYWNrcyB0byB0b2tlbiByZWZyZXNoIGlmIHJlZnJlc2hUb2tlbiBpcyBkZWZpbmVkXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhY2Nlc3NUb2tlbiAtIFRoZSBhY2Nlc3MgdG9rZW4gdG8gdXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZWZyZXNoVG9rZW4gLSBUaGUgcmVmcmVzaCB0b2tlbiB0byB1c2UgKE9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgYXV0aGVudGljYXRlV2l0aFRva2VuKGFjY2Vzc1Rva2VuLCByZWZyZXNoVG9rZW4pIHtcbiAgICBhc3NlcnQoYWNjZXNzVG9rZW4sICdNaXNzaW5nIGBhY2Nlc3NUb2tlbmAnKTtcbiAgICAvLyBTdG9yZSBhY2Nlc3MgdG9rZW5cbiAgICB0aGlzLl9zdG9yZS5zZXQoJ2FjY2Vzc190b2tlbicsIGFjY2Vzc1Rva2VuKTtcbiAgICAvLyBTdG9yZSByZWZyZXNoIHRva2VuIChvciBjbGVhciBpZiB1bmRlZmluZWQpXG4gICAgaWYgKHJlZnJlc2hUb2tlbikge1xuICAgICAgdGhpcy5fc3RvcmUuc2V0KCdyZWZyZXNoX3Rva2VuJywgcmVmcmVzaFRva2VuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc3RvcmUucmVtb3ZlKCdyZWZyZXNoX3Rva2VuJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb25zdW1lci5yZXRyaWV2ZVVzZXIoYWNjZXNzVG9rZW4pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGlmICghcmVmcmVzaFRva2VuIHx8IGVyci5uYW1lICE9PSAnaW52YWxpZF90b2tlbicpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgICAvLyBUcnkgdG8gcmVmcmVzaCB0aGUgdG9rZW5zIGlmIHRoZSBlcnJvciBpcyBvZiBgaW52YWxpZF90b2tlbmBcbiAgICAgIHJldHVybiB0aGlzLl9jb25zdW1lci5yZWZyZXNoVG9rZW4ocmVmcmVzaFRva2VuKS50aGVuKChuZXdUb2tlbnMpID0+IHtcbiAgICAgICAgLy8gU3RvcmUgbmV3IHRva2Vuc1xuICAgICAgICB0aGlzLl9zdG9yZS5zZXQoJ2FjY2Vzc190b2tlbicsIG5ld1Rva2Vucy5hY2Nlc3NfdG9rZW4pO1xuICAgICAgICB0aGlzLl9zdG9yZS5zZXQoJ3JlZnJlc2hfdG9rZW4nLCBuZXdUb2tlbnMucmVmcmVzaF90b2tlbik7XG4gICAgICAgIC8vIFJldHJpZXZlIHVzZXIgd2l0aCBuZXcgdG9rZW5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnN1bWVyLnJldHJpZXZlVXNlcihuZXdUb2tlbnMuYWNjZXNzX3Rva2VuKTtcbiAgICAgIH0pO1xuICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIHRoaXMuX2JlYXJlciA9IGFjY2Vzc1Rva2VuO1xuICAgICAgdGhpcy5faWQgPSBkYXRhLmlkO1xuICAgICAgdGhpcy5fcHVibGlzaGVySWQgPSBkYXRhLnB1Ymxpc2hlcl9pZDtcbiAgICAgIHRoaXMuX2VtYWlsID0gZGF0YS5lbWFpbDtcbiAgICAgIHRoaXMuX2ZpcnN0TmFtZSA9IGRhdGEuZmlyc3RfbmFtZTtcbiAgICAgIHRoaXMuX2xhc3ROYW1lID0gZGF0YS5sYXN0X25hbWU7XG4gICAgICB0aGlzLl9pc0RpcnR5ID0gZmFsc2U7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgZGF0YSxcbiAgICAgICAgbWVzc2FnZTogJ0F1dGhlbnRpY2F0ZWQgVXNlcicsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGbHVzaGVzIHN0b3JlZCB0b2tlbnMgZm9yIFVzZXIgKGxvZ291dClcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIGZsdXNoKCkge1xuICAgIHRoaXMuX2JlYXJlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9pZCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9wdWJsaXNoZXJJZCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9maXJzdE5hbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fbGFzdE5hbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZW1haWwgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5faXNEaXJ0eSA9IGZhbHNlO1xuICAgIHJldHVybiB0aGlzLl9zdG9yZS5yZW1vdmUoJ2FjY2Vzc190b2tlbicsICdyZWZyZXNoX3Rva2VuJykudGhlbigoKSA9PiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgbWVzc2FnZTogJ0ZsdXNoZWQgVXNlciBkYXRhJyxcbiAgICB9KSk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXI7XG4iLCJjb25zdCBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcbmNvbnN0IHFzID0gcmVxdWlyZSgncXMnKTtcbmNvbnN0IENsaWVudCA9IHJlcXVpcmUoJy4uL21vZGVscy9jbGllbnQnKTtcbmNvbnN0IFByb2R1Y3Rpb25BUEkgPSByZXF1aXJlKCcuLi9hcGknKS5Qcm9kdWN0aW9uO1xuY29uc3QgU2FuZGJveEFQSSA9IHJlcXVpcmUoJy4uL2FwaScpLlNhbmRib3g7XG5jb25zdCBleHRyYWN0RXJyb3JNZXNzYWdlID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5leHRyYWN0RXJyb3JNZXNzYWdlO1xuXG4vKipcbiAqIEBjbGFzcyBDb25zdW1lclxuICovXG5jbGFzcyBDb25zdW1lciB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIENvbnN1bWVyXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIENsaWVudCBpbnN0YW5jZSB0byB1c2VcbiAgICogQHBhcmFtIHtBUEkuUHJvZHVjdGlvbnxBUEkuU2FuZGJveH0gYXBpIC0gVGhlIGFwaSB0byB1c2UgZm9yIGZldGNoaW5nIGRhdGFcbiAgICogQHJldHVybiB7Q29uc3VtZXJ9XG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjbGllbnQsIGFwaSkge1xuICAgIGFzc2VydChjbGllbnQgaW5zdGFuY2VvZiBDbGllbnQsICdgY2xpZW50YCBzaG91bGQgYmUgaW5zdGFuY2Ugb2YgQ2xpZW50Jyk7XG4gICAgYXNzZXJ0KGFwaSBpbnN0YW5jZW9mIFByb2R1Y3Rpb25BUEkgfHwgYXBpIGluc3RhbmNlb2YgU2FuZGJveEFQSSwgJ2BhcGlgIHNob3VsZCBiZSBpbnN0YW5jZSBvZiBBUEkuUHJvZHVjdGlvbiBvciBBUEkuU2FuZGJveCcpO1xuICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLl9hcGkgPSBhcGk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBkYXRhIGZyb20gQVBJXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZXNvdXJjZSAtIFRoZSByZXNvdXJjZSB0byBmZXRjaCBmcm9tXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkIC0gVGhlIHBheWxvYWQgdG8gcGFzc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgX3JlcXVlc3QocmVzb3VyY2UsIHBheWxvYWQpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBpLmludm9rZShyZXNvdXJjZSwgcGF5bG9hZCkudGhlbigocmVzKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YXR1cywgYm9keSB9ID0gcmVzO1xuICAgICAgaWYgKHBhcnNlSW50KHN0YXR1cywgMTApID49IDQwMCkge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihleHRyYWN0RXJyb3JNZXNzYWdlKGJvZHkuZXJyb3IpKTtcbiAgICAgICAgZXJyb3IubmFtZSA9IGJvZHkuZXJyb3I7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGJvZHkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0b2tlbiBmcm9tIGEgdXNlcm5hbWUtcGFzc3dvcmQgY29tYmluYXRpb25cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJuYW1lIC0gVGhlIHVzZXJuYW1lIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgcGFzc3dvcmQgdG8gdXNlXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICByZXRyaWV2ZVRva2VuKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgIGNvbnN0IGdyYW50X3R5cGUgPSAncGFzc3dvcmQnO1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCd0b2tlbicsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICB9LFxuICAgICAgYm9keTogdGhpcy5fZm9ybUVuY29kZSh7XG4gICAgICAgIHVzZXJuYW1lLFxuICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgZ3JhbnRfdHlwZSxcbiAgICAgICAgY2xpZW50X2lkOiB0aGlzLl9jbGllbnQuaWQsXG4gICAgICAgIGNsaWVudF9zZWNyZXQ6IHRoaXMuX2NsaWVudC5zZWNyZXQsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcmVuZXdlZCB0b2tlblxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVmcmVzaFRva2VuIC0gVGhlIHJlZnJlc2ggdG9rZW4gdG8gdXNlXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICByZWZyZXNoVG9rZW4ocmVmcmVzaFRva2VuKSB7XG4gICAgY29uc3QgZ3JhbnRfdHlwZSA9ICdyZWZyZXNoX3Rva2VuJztcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgndG9rZW4nLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IHRoaXMuX2Zvcm1FbmNvZGUoe1xuICAgICAgICByZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4sXG4gICAgICAgIGdyYW50X3R5cGUsXG4gICAgICAgIGNsaWVudF9pZDogdGhpcy5fY2xpZW50LmlkLFxuICAgICAgICBjbGllbnRfc2VjcmV0OiB0aGlzLl9jbGllbnQuc2VjcmV0LFxuICAgICAgfSksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHVybCBlbmNvZGVkIHN0cmluZ1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIC0gT2JqZWN0IHRvIHN0cmluZ2lmeVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqXG4gICAqL1xuICBfZm9ybUVuY29kZShvYmopIHtcbiAgICByZXR1cm4gcXMuc3RyaW5naWZ5KG9iaik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGpzb24gZW5jb2RlZCBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iaiAtIE9iamVjdCB0byBzdHJpbmdpZnlcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKlxuICAgKi9cbiAgX2pzb25FbmNvZGUob2JqKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBVc2VyXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIHBhc3N3b3JkIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlyc3ROYW1lIC0gVGhlIGZpcnN0IG5hbWUgdG8gdXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYXN0TmFtZSAtIFRoZSBsYXN0IG5hbWUgdG8gdXNlXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBjcmVhdGVVc2VyKGVtYWlsLCBwYXNzd29yZCwgZmlyc3ROYW1lLCBsYXN0TmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCd1c2VycycsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IHRoaXMuX2pzb25FbmNvZGUoe1xuICAgICAgICBlbWFpbCxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIGZpcnN0X25hbWU6IGZpcnN0TmFtZSxcbiAgICAgICAgbGFzdF9uYW1lOiBsYXN0TmFtZSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpdmVzIGEgVXNlclxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gLSBUaGUgYEJlYXJlcmAgdG9rZW5cbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIHJldHJpZXZlVXNlcih0b2tlbikge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCd1c2Vycy9tZScsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAsXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGEgVXNlclxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIC0gVGhlIFVzZXIgaWRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIC0gVGhlIGBCZWFyZXJgIHRva2VuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmZpcnN0TmFtZSAtIFRoZSBmaXJzdCBhbWUgdG8gdXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmxhc3ROYW1lIC0gVGhlIGxhc3QgbmFtZSB0byB1c2VcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIHVwZGF0ZVVzZXIodXNlcklkLCB0b2tlbiwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KGB1c2Vycy8ke3VzZXJJZH1gLCB7XG4gICAgICBtZXRob2Q6ICdQQVRDSCcsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gLFxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IHRoaXMuX2pzb25FbmNvZGUoe1xuICAgICAgICBmaXJzdF9uYW1lOiBvcHRpb25zLmZpcnN0TmFtZSxcbiAgICAgICAgbGFzdF9uYW1lOiBvcHRpb25zLmxhc3ROYW1lLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdHMgZm9yIGEgcGFzc3dvcmQgcmVzZXRcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsIHRvIGZvcndhcmQgdGhlIHJlc2V0IHRva2VuIHRvXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICByZXF1ZXN0UGFzc3dvcmRSZXNldChlbWFpbCkge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdwYXNzd29yZHMnLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiB0aGlzLl9qc29uRW5jb2RlKHtcbiAgICAgICAgZW1haWwsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgcGFzc3dvcmRcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIC0gVGhlIHJlc2V0IHRva2VuIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgbmV3IHBhc3N3b3JkXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICByZXNldFBhc3N3b3JkKHRva2VuLCBwYXNzd29yZCkge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KGBwYXNzd29yZHMvJHt0b2tlbn1gLCB7XG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IHRoaXMuX2pzb25FbmNvZGUoe1xuICAgICAgICBwYXNzd29yZCxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25zdW1lcjtcbiIsImNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuY29uc3QgQ3Jvc3NTdG9yYWdlQ2xpZW50ID0gcmVxdWlyZSgnY3Jvc3Mtc3RvcmFnZScpLkNyb3NzU3RvcmFnZUNsaWVudDtcblxuLyoqXG4gKiBXcmFwcGVyIGFyb3VuZCBgQ3Jvc3NTdG9yYWdlQ2xpZW50YFxuICpcbiAqIEBjbGFzcyBTdG9yZVxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vemVuZGVzay9jcm9zcy1zdG9yYWdlXG4gKlxuICovXG5cbmNsYXNzIFN0b3JhZ2VDbGllbnQge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBTdG9yYWdlQ2xpZW50XG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZG9tYWluIC0gVGhlIGRvbWFpbiB1bmRlciB3aGljaCBhbGwgdmFsdWVzIHdpbGwgYmUgYXR0YWNoZWRcbiAgICogQHBhcmFtIHtDbGFzc30gQ3Jvc3NTdG9yYWdlQ2xpZW50Q2xhc3MgLSBUaGUgQ3Jvc3NTdG9yYWdlQ2xpZW50IGNsYXNzIHRvIGJlIGluc3RhbnRpYXRlZCAoRGVmYXVsdHMgdG8gQ3Jvc3NTdG9yYWdlQ2xpZW50KVxuICAgKiBAcmV0dXJuIHtTdG9yZX1cbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKGlmcmFtZUh1YiwgQ3Jvc3NTdG9yYWdlQ2xpZW50Q2xhc3MgPSBDcm9zc1N0b3JhZ2VDbGllbnQpIHtcbiAgICBhc3NlcnQoaWZyYW1lSHViLCAnTWlzc2luZyBgaWZyYW1lSHViYCcpO1xuICAgIHRoaXMuX2lmcmFtZUh1YiA9IGlmcmFtZUh1YjtcbiAgICB0aGlzLl9Dcm9zc1N0b3JhZ2VDbGllbnRDbGFzcyA9IENyb3NzU3RvcmFnZUNsaWVudENsYXNzO1xuICAgIHRoaXMuX2luc3RhbmNlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgb2YgQ3Jvc3NTdG9yYWdlQ2xpZW50Lm9uQ29ubmVjdCgpO1xuICAgKiBDcm9zc1N0b3JhZ2VDbGllbnQgaW5qZWN0cyBhbiBpZnJhbWUgaW4gdGhlIERPTSwgc28gd2UgbmVlZFxuICAgKiB0byBlbnN1cmUgdGhhdCB0aGUgaW5zZXJ0aW9uIGhhcHBlbnMgT05MWSB3aGVuIGFuIGV2ZW50IGlzIHRyaWdnZXJlZFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgb25Db25uZWN0KCkge1xuICAgIGlmICghdGhpcy5faW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IHRoaXMuX0Nyb3NzU3RvcmFnZUNsaWVudENsYXNzKHRoaXMuX2lmcmFtZUh1Yik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZS5vbkNvbm5lY3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIG9mIENyb3NzU3RvcmFnZUNsaWVudC5nZXQoKTtcbiAgICpcbiAgICogQHBhcmFtIHtBcmd1bWVudHN9IHJlc3RcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGdldCguLi5yZXN0KSB7XG4gICAgcmV0dXJuIHRoaXMub25Db25uZWN0KCkudGhlbigoKSA9PiB0aGlzLl9pbnN0YW5jZS5nZXQoLi4ucmVzdCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgb2YgQ3Jvc3NTdG9yYWdlQ2xpZW50LnNldCgpO1xuICAgKlxuICAgKiBAcGFyYW0ge0FyZ3VtZW50c30gcmVzdFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgc2V0KC4uLnJlc3QpIHtcbiAgICByZXR1cm4gdGhpcy5vbkNvbm5lY3QoKS50aGVuKCgpID0+IHRoaXMuX2luc3RhbmNlLnNldCguLi5yZXN0KSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBvZiBDcm9zc1N0b3JhZ2VDbGllbnQuZGVsKCk7XG4gICAqXG4gICAqIEBwYXJhbSB7QXJndW1lbnRzfSByZXN0XG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBkZWwoLi4ucmVzdCkge1xuICAgIHJldHVybiB0aGlzLm9uQ29ubmVjdCgpLnRoZW4oKCkgPT4gdGhpcy5faW5zdGFuY2UuZGVsKC4uLnJlc3QpKTtcbiAgfVxuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdG9yYWdlQ2xpZW50O1xuIiwiY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5jb25zdCBTdG9yYWdlQ2xpZW50ID0gcmVxdWlyZSgnLi9zdG9yYWdlLWNsaWVudCcpO1xuXG4vKipcbiAqIEBjbGFzcyBTdG9yZVxuICovXG5jbGFzcyBTdG9yZSB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIFN0b3JlXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZG9tYWluIC0gVGhlIGRvbWFpbiB1bmRlciB3aGljaCBhbGwgdmFsdWVzIHdpbGwgYmUgYXR0YWNoZWRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlmcmFtZUh1YiAtIFRoZSBpZnJhbWUgVVJMIHdoZXJlIGFsbCB0aGUgdmFsdWVzIHdpbGwgYmUgYXR0YWNoZWRcbiAgICogQHBhcmFtIHtPYmplY3R9IGlmcmFtZUh1YiAtIFRoZSBpZnJhbWUgVVJMIHdoZXJlIGFsbCB0aGUgdmFsdWVzIHdpbGwgYmUgYXR0YWNoZWRcbiAgICogQHBhcmFtIHtDbGFzc30gU3RvcmFnZUNsaWVudENsYXNzIC0gVGhlIENyb3NzU3RvcmFnZUNsaWVudCBDbGFzcyB0byBiZSBpbnN0YW50aWF0ZWRcbiAgICogQHJldHVybiB7U3RvcmV9XG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihkb21haW4sIGlmcmFtZUh1YiwgU3RvcmFnZUNsaWVudENsYXNzID0gU3RvcmFnZUNsaWVudCkge1xuICAgIGFzc2VydChkb21haW4sICdNaXNzaW5nIGBkb21haW5gJyk7XG4gICAgYXNzZXJ0KGlmcmFtZUh1YiwgJ01pc3NpbmcgYGlmcmFtZUh1YmAnKTtcbiAgICB0aGlzLl9kb21haW4gPSBkb21haW47XG4gICAgdGhpcy5faWZyYW1lSHViID0gaWZyYW1lSHViO1xuICAgIHRoaXMuX3N0b3JhZ2UgPSBuZXcgU3RvcmFnZUNsaWVudENsYXNzKGlmcmFtZUh1Yik7XG4gIH1cblxuICAvKipcbiAgICogTm9ybWFsaXplcyBrZXkgYmFzZWQgb24gZG9tYWluXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLSBUaGUga2V5IHRvIHVzZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBub3JtYWxpemVkIGtleVxuICAgKlxuICAgKi9cbiAgX25vcm1hbGl6ZUtleShrZXkpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5fZG9tYWlufV8ke2tleX1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdmFsdWUgZm9yIGEga2V5XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLSBUaGUga2V5IHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgLSBUaGUgdmFsdWUgdG8gc2V0XG4gICAqXG4gICAqL1xuICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9zdG9yYWdlLnNldCh0aGlzLl9ub3JtYWxpemVLZXkoa2V5KSwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdmFsdWUgZm9yIGEgc3RvcmVkIGtleVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gVGhlIGtleSB0byB1c2VcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKlxuICAgKi9cbiAgZ2V0KGtleSkge1xuICAgIHJldHVybiB0aGlzLl9zdG9yYWdlLmdldCh0aGlzLl9ub3JtYWxpemVLZXkoa2V5KSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBvbmUgb3IgbXVsdGlwbGUgdmFsdWUgcGFpciBpZiB0aGV5IGV4aXN0c1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0ga2V5cyAtIFRoZSBrZXkocykgdG8gdXNlXG4gICAqXG4gICAqL1xuICByZW1vdmUoLi4ua2V5cykge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRLZXlzID0ga2V5cy5tYXAoa2V5ID0+IHRoaXMuX25vcm1hbGl6ZUtleShrZXkpKTtcbiAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5kZWwoLi4ubm9ybWFsaXplZEtleXMpO1xuICB9XG5cbn1cbm1vZHVsZS5leHBvcnRzID0gU3RvcmU7XG4iLCIvKipcbiAqIEBuYW1lc3BhY2UgVXRpbHNcbiAqL1xuLyoqXG4gKiBHZW5lcmF0ZXMgYSByYW5kb20gc3RyaW5nXG4gKlxuICogQG1lbWJlcm9mIFV0aWxzXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkaXggLSBUaGUgcmFkaXggdG8gdXNlLiBEZWZhdWx0cyB0byBgMThgXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKlxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVN0cmluZygpIHtcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMTgpLnNsaWNlKDIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5nZW5lcmF0ZVJhbmRvbVN0cmluZyA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHJhbmRvbSBVVUlEXG4gKlxuICogQG1lbWJlcm9mIFV0aWxzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKlxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVVVSUQoKSB7XG4gIGNvbnN0IGJhc2UgPSBgJHtnZW5lcmF0ZVJhbmRvbVN0cmluZygpfSR7Z2VuZXJhdGVSYW5kb21TdHJpbmcoKX1gO1xuICByZXR1cm4gYCR7YmFzZS5zdWJzdHJpbmcoMCwgOCl9LSR7YmFzZS5zdWJzdHJpbmcoOSwgMTMpfS0ke2Jhc2Uuc3Vic3RyaW5nKDE0LCAxOCl9LSR7YmFzZS5zdWJzdHJpbmcoMTksIDIzKX0tJHtiYXNlLnN1YnN0cmluZygyNCwgMzYpfWA7XG59XG5cbm1vZHVsZS5leHBvcnRzLmdlbmVyYXRlUmFuZG9tVVVJRCA9IGdlbmVyYXRlUmFuZG9tVVVJRDtcblxuLyoqXG4gKiBTdHJpcHMgQmVhcmVyIGZyb20gQXV0aG9yaXphdGlvbiBoZWFkZXJcbiAqXG4gKiBAbWVtYmVyb2YgVXRpbHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXIgLSBUaGUgQXV0aG9yaXphdGlvbiBoZWFkZXIgdG8gc3RyaXBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQmVhcmVyKGhlYWRlcikge1xuICByZXR1cm4gYCR7aGVhZGVyfWAucmVwbGFjZSgnQmVhcmVyJywgJycpLnRyaW0oKTtcbn1cblxubW9kdWxlLmV4cG9ydHMuc3RyaXBCZWFyZXIgPSBzdHJpcEJlYXJlcjtcblxuLyoqXG4gKiBSZXR1cm5zIGVycm9yIG1lc3NhZ2UgZm9yIGBlcnJvckNvZGVgXG4gKlxuICogQG1lbWJlcm9mIFV0aWxzXG4gKiBAcGFyYW0ge1N0cmluZ30gZXJyb3JDb2RlIC0gVGhlIGBlcnJvckNvZGVgIHRvIG1hcFxuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xuXG5jb25zdCBleHRyYWN0RXJyb3JNZXNzYWdlID0gKGVycm9yQ29kZSkgPT4ge1xuICBzd2l0Y2ggKGVycm9yQ29kZSkge1xuICAgIGNhc2UgJ3ZhbGlkYXRpb25fZmFpbGVkJzpcbiAgICAgIHJldHVybiAnVmFsaWRhdGlvbiBmYWlsZWQnO1xuICAgIGNhc2UgJ25vdF9mb3VuZCc6XG4gICAgICByZXR1cm4gJ05vdCBmb3VuZCc7XG4gICAgY2FzZSAnZm9yYmlkZGVuX3Jlc291cmNlJzpcbiAgICAgIHJldHVybiAnRm9yYmlkZGVuIHJlc291cmNlJztcbiAgICBjYXNlICdhY2Nlc3NfZGVuaWVkJzpcbiAgICAgIHJldHVybiAnVGhlIHJlc291cmNlIG93bmVyIG9yIGF1dGhvcml6YXRpb24gc2VydmVyIGRlbmllZCB0aGUgcmVxdWVzdCc7XG4gICAgY2FzZSAndW5zdXBwb3J0ZWRfZ3JhbnRfdHlwZSc6XG4gICAgICByZXR1cm4gJ1RoZSBhdXRob3JpemF0aW9uIGdyYW50IHR5cGUgaXMgbm90IHN1cHBvcnRlZCc7XG4gICAgY2FzZSAnaW52YWxpZF9ncmFudCc6XG4gICAgICByZXR1cm4gJ0ludmFsaWQgY3JlZGVudGlhbHMnO1xuICAgIGNhc2UgJ3VuYXV0aG9yaXplZF9yZXF1ZXN0JzpcbiAgICAgIHJldHVybiAnVW5hdXRob3JpemVkIHJlcXVlc3QnO1xuICAgIGNhc2UgJ3VuYXV0aG9yaXplZF9jbGllbnQnOlxuICAgICAgcmV0dXJuICdUaGUgYXV0aGVudGljYXRlZCBjbGllbnQgaXMgbm90IGF1dGhvcml6ZWQnO1xuICAgIGNhc2UgJ2ludmFsaWRfdG9rZW4nOlxuICAgICAgcmV0dXJuICdUaGUgYWNjZXNzIHRva2VuIHByb3ZpZGVkIGlzIGV4cGlyZWQsIHJldm9rZWQsIG1hbGZvcm1lZCwgb3IgaW52YWxpZCc7XG4gICAgY2FzZSAnaW52YWxpZF9zY29wZSc6XG4gICAgICByZXR1cm4gJ1RoZSByZXF1ZXN0ZWQgc2NvcGUgaXMgaW52YWxpZCwgdW5rbm93biwgb3IgbWFsZm9ybWVkJztcbiAgICBjYXNlICdpbnZhbGlkX2NsaWVudCc6XG4gICAgICByZXR1cm4gJ0NsaWVudCBhdXRoZW50aWNhdGlvbiBmYWlsZWQnO1xuICAgIGNhc2UgJ2ludmFsaWRfcmVxdWVzdCc6XG4gICAgICByZXR1cm4gJ1RoZSByZXF1ZXN0IGlzIG1pc3NpbmcgYSByZXF1aXJlZCBwYXJhbWV0ZXInO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJ1VuZXhwZWN0ZWQgZXJyb3InO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5leHRyYWN0RXJyb3JNZXNzYWdlID0gZXh0cmFjdEVycm9yTWVzc2FnZTtcblxuLyoqXG4gKiBWYWxpZGF0ZXMgYSBwYXNzd29yZCBwYWlyIGFnYWlucyB0aGUgZm9sbG93aW5nIHJ1bGVzOlxuICogLSBQYXNzd29yZCBjYW5ub3QgY29udGFpbiBzcGFjZXNcbiAqIC0gUGFzc3dvcmQgbXVzdCBjb250YWluIGJvdGggbnVtYmVycyBhbmQgY2hhcmFjdGVyc1xuICogLSBQYXNzd29yZCBtdXN0IGJlIGF0IGxlYXN0IDggY2hhcmFjdGVycyBsb25nXG4gKlxuICogQG1lbWJlcm9mIFV0aWxzXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgYHBhc3N3b3JkYCB0byB2YWxpZGF0ZVxuICogQHJldHVybiB7T2JqZWN0fSBDb250YWlucyBgaXNWYWxpZCB7Qm9vbGVhbn1gIGFuZCBgbWVzc2FnZSB7U3RyaW5nfWBcbiAqXG4gKi9cbmNvbnN0IHZhbGlkYXRlUGFzc3dvcmQgPSAocGFzc3dvcmQpID0+IHtcbiAgY29uc3QgY29udGFpbnNTcGFjZXMgPSAvXFxzL2kudGVzdChwYXNzd29yZCk7XG4gIGNvbnN0IGNvbnRhaW5zTnVtYmVyID0gL1xcZC9pLnRlc3QocGFzc3dvcmQpO1xuICBjb25zdCBjb250YWluc0NoYXJhY3RlcnMgPSAvW2Etel0vaS50ZXN0KHBhc3N3b3JkKTtcbiAgaWYgKGNvbnRhaW5zU3BhY2VzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6ICdQYXNzd29yZCBjYW5ub3QgY29udGFpbiBzcGFjZXMnLFxuICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgfTtcbiAgfVxuICBpZiAoIWNvbnRhaW5zTnVtYmVyIHx8ICFjb250YWluc0NoYXJhY3RlcnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogJ1Bhc3N3b3JkIG11c3QgY29udGFpbiBib3RoIG51bWJlcnMgYW5kIGNoYXJhY3RlcnMnLFxuICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgfTtcbiAgfVxuICBpZiAocGFzc3dvcmQubGVuZ3RoIDwgOCkge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiAnUGFzc3dvcmQgbXVzdCBiZSBhdCBsZWFzdCA4IGNoYXJhY3RlcnMgbG9uZycsXG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICB9O1xuICB9XG4gIHJldHVybiB7XG4gICAgaXNWYWxpZDogdHJ1ZSxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnZhbGlkYXRlUGFzc3dvcmQgPSB2YWxpZGF0ZVBhc3N3b3JkO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXG4vKipcbiAqIFdyYXBwZXIgYXJvdW5kIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKClcbiAqXG4gKiBAbWVtYmVyb2YgVXRpbHNcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIHJlZGlyZWN0IHRvXG4gKiBAcmV0dXJuIHtWb2lkfVxuICpcbiAqL1xuY29uc3QgcmVkaXJlY3RUb1VSTCA9ICh1cmwpID0+IHtcbiAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UodXJsKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnJlZGlyZWN0VG9VUkwgPSByZWRpcmVjdFRvVVJMO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXG4vKipcbiAqIFdyYXBwZXIgYXJvdW5kIHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gKlxuICogQG1lbWJlcm9mIFV0aWxzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKlxuICovXG5jb25zdCByZXRyaWV2ZVVSTCA9ICgpID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXG5tb2R1bGUuZXhwb3J0cy5yZXRyaWV2ZVVSTCA9IHJldHJpZXZlVVJMO1xuIl19
