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
  function generateInstance(clientId, clientSecret) {
    var environment = arguments[2] === undefined ? ENV.Production : arguments[2];
    var loginHost = arguments[3] === undefined ? config.login.host : arguments[3];
    var apiHost = arguments[4] === undefined ? config.api.host : arguments[4];
    var storeDomain = arguments[5] === undefined ? config.store.domain : arguments[5];

    var store = new Store(storeDomain, "" + loginHost + "/hub");
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

      var key = "" + clientId + "-" + clientSecret;
      // Return cached instance
      if (instances.has(key)) {
        return instances.get(key);
      }
      // Generate & cache new instance
      var instance = generateInstance(clientId, clientSecret, environment, loginHost, apiHost);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9nZWUvRGVza3RvcC9kZXYvcmVwb3MvbG9naW4tYXBwL25vZGVfbW9kdWxlcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzVDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzFDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN0QyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMxQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM1QyxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN4RCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNoRCxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDdkQsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDdkQsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDekQsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQzs7Ozs7O0FBTS9ELElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxlQUFlLENBQUM7Ozs7O0FBS2pFLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7Ozs7QUFLbEMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOzs7OztBQU14QixJQUFNLG9CQUFvQixHQUFHLENBQUMsU0FBUyxTQUFT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QUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM3QixhQUFPLFFBQVEsQ0FBQztLQUNqQjs7Ozs7Ozs7O0FBU0QsU0FBSyxFQUFBLGlCQUFHO0FBQ04sZUFBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ25CLEVBRUYsQ0FBQztDQUNILENBQUEsRUFBRyxDQUFDOzs7O0FBSUwsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ2pCLFFBQU0sQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7Q0FDM0Q7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnL2RlZmF1bHQnKTtcbmNvbnN0IFN0b3JlID0gcmVxdWlyZSgnLi9zZXJ2aWNlcy9zdG9yZScpO1xuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4vbW9kZWxzL3VzZXInKTtcbmNvbnN0IENsaWVudCA9IHJlcXVpcmUoJy4vbW9kZWxzL2NsaWVudCcpO1xuY29uc3QgU2Vzc2lvbiA9IHJlcXVpcmUoJy4vbW9kZWxzL3Nlc3Npb24nKTtcbmNvbnN0IEF1dGhlbnRpY2F0b3IgPSByZXF1aXJlKCcuL21vZGVscy9hdXRoZW50aWNhdG9yJyk7XG5jb25zdCBDb25zdW1lciA9IHJlcXVpcmUoJy4vc2VydmljZXMvY29uc3VtZXInKTtcbmNvbnN0IEFQSSA9IHJlcXVpcmUoJy4vYXBpJyk7XG5jb25zdCBTYW5kYm94RGF0YWJhc2UgPSByZXF1aXJlKCcuL2RhdGFiYXNlcy9zYW5kYm94Jyk7XG5jb25zdCBVc2VyRml4dHVyZXMgPSByZXF1aXJlKCcuLi9maXh0dXJlcy91c2Vycy5qc29uJyk7XG5jb25zdCBUb2tlbkZpeHR1cmVzID0gcmVxdWlyZSgnLi4vZml4dHVyZXMvdG9rZW5zLmpzb24nKTtcbmNvbnN0IFBhc3N3b3JkRml4dHVyZXMgPSByZXF1aXJlKCcuLi9maXh0dXJlcy9wYXNzd29yZHMuanNvbicpO1xuXG4vKipcbiAqIENyb3NzU3RvcmFnZUh1YlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vemVuZGVzay9jcm9zcy1zdG9yYWdlXG4gKi9cbmNvbnN0IENyb3NzU3RvcmFnZUh1YiA9IHJlcXVpcmUoJ2Nyb3NzLXN0b3JhZ2UnKS5Dcm9zc1N0b3JhZ2VIdWI7XG5cbi8qKlxuICogR2xvYmFsIHBvbHlmaWxsIGZvciB7UHJvbWlzZX1cbiAqL1xucmVxdWlyZSgnZXM2LXByb21pc2UnKS5wb2x5ZmlsbCgpO1xuXG4vKipcbiAqIEdsb2JhbCBwb2x5ZmlsbCBmb3Ige2ZldGNofVxuICovXG5yZXF1aXJlKCd3aGF0d2ctZmV0Y2gnKTtcblxuXG4vKipcbiAqIEBuYW1lc3BhY2UgQXV0aGVudGljYXRpb25DbGllbnRcbiAqL1xuY29uc3QgQXV0aGVudGljYXRpb25DbGllbnQgPSAoZnVuY3Rpb24gaW1tZWRpYXRlKCkge1xuICAvKipcbiAgICogRW52aXJvbm1lbnQgRU5VTVxuICAgKlxuICAgKiBAZW51bVxuICAgKiByZXR1cm4ge09iamVjdH1cbiAgICpcbiAgICovXG4gIGNvbnN0IEVOViA9IE9iamVjdC5mcmVlemUoe1xuICAgIFByb2R1Y3Rpb246IFN5bWJvbCgnUHJvZHVjdGlvbicpLFxuICAgIFNhbmRib3g6IFN5bWJvbCgnU2FuZGJveCcpLFxuICB9KTtcblxuICAvKipcbiAgICogQ2FjaGVkIGluc3RhbmNlc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtNYXB9XG4gICAqXG4gICAqL1xuICBjb25zdCBpbnN0YW5jZXMgPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gQVBJIGluc3RhY2VzIGZvciBhbiBFTlYgc2V0dXBcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHRocm93cyB7RXJyb3J9XG4gICAqIEBwYXJhbSB7RU5WfSBlbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXQgLSBEZWZhdWx0cyB0byBgUHJvZHVjdGlvbmBcbiAgICogQHJldHVybiB7U2FuZGJveEFQSXxQcm9kdWN0aW9uQVBJfVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0QVBJRm9yKGVudmlyb25tZW50LCBob3N0ID0gY29uZmlnLmFwaS5ob3N0KSB7XG4gICAgaWYgKGVudmlyb25tZW50ID09PSBFTlYuUHJvZHVjdGlvbikge1xuICAgICAgcmV0dXJuIG5ldyBBUEkuUHJvZHVjdGlvbihob3N0KTtcbiAgICB9XG4gICAgaWYgKGVudmlyb25tZW50ID09PSBFTlYuU2FuZGJveCkge1xuICAgICAgcmV0dXJuIG5ldyBBUEkuU2FuZGJveChuZXcgU2FuZGJveERhdGFiYXNlKFVzZXJGaXh0dXJlcywgVG9rZW5GaXh0dXJlcywgUGFzc3dvcmRGaXh0dXJlcykpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYGVudmlyb25tZW50YCBwYXNzZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYW4gQXV0aGVudGljYXRpb25DbGllbnQgaW5zdGFuY2VcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudElkIC0gVGhlIGNsaWVudCBpZCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFNlY3JldCAtIFRoZSBjbGllbnQgc2VjcmV0XG4gICAqIEBwYXJhbSB7RU5WfSBlbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGxvZ2luSG9zdCAtIFRoZSBsb2dpbiBob3N0IFVSTFxuICAgKiBAcGFyYW0ge1N0cmluZ30gYXBpSG9zdCAtIFRoZSBBUEkgaG9zdFxuICAgKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZVxuICAgKiBAcmV0dXJuIHtBdXRoZW50aWNhdG9yfVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gZ2VuZXJhdGVJbnN0YW5jZShjbGllbnRJZCwgY2xpZW50U2VjcmV0LCBlbnZpcm9ubWVudCA9IEVOVi5Qcm9kdWN0aW9uLCBsb2dpbkhvc3QgPSBjb25maWcubG9naW4uaG9zdCwgYXBpSG9zdCA9IGNvbmZpZy5hcGkuaG9zdCwgc3RvcmVEb21haW4gPSBjb25maWcuc3RvcmUuZG9tYWluKSB7XG4gICAgY29uc3Qgc3RvcmUgPSBuZXcgU3RvcmUoc3RvcmVEb21haW4sIGAke2xvZ2luSG9zdH0vaHViYCk7XG4gICAgY29uc3QgYXBpID0gZ2V0QVBJRm9yKGVudmlyb25tZW50LCBhcGlIb3N0KTtcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KGNsaWVudElkLCBjbGllbnRTZWNyZXQpO1xuICAgIGNvbnN0IGNvbnN1bWVyID0gbmV3IENvbnN1bWVyKGNsaWVudCwgYXBpKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIoc3RvcmUsIGNvbnN1bWVyKTtcbiAgICBjb25zdCBzZXNzaW9uID0gbmV3IFNlc3Npb24odXNlciwgbG9naW5Ib3N0KTtcbiAgICBjb25zdCBhdXRoZW50aWNhdG9yID0gbmV3IEF1dGhlbnRpY2F0b3IoY29uc3VtZXIpO1xuICAgIHJldHVybiB7XG4gICAgICB1c2VyLFxuICAgICAgc2Vzc2lvbixcbiAgICAgIGF1dGhlbnRpY2F0b3IsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG5cbiAgICAvKipcbiAgICAgKiBFbnZpcm9ubWVudCBlbnVtXG4gICAgICpcbiAgICAgKiBAZW51bVxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqXG4gICAgICovXG4gICAgRW52aXJvbm1lbnQ6IEVOVixcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIENyb3NzU3RvcmFnZUh1YlxuICAgICAqXG4gICAgICogQGVudW1cbiAgICAgKiBAbWVtYmVyb2YgQXV0aGVudGljYXRpb25DbGllbnRcbiAgICAgKlxuICAgICAqL1xuICAgIGluaXRTdG9yYWdlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBDcm9zc1N0b3JhZ2VIdWIuaW5pdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBBdXRoZW50aWNhdG9yIGluc3RhbmNlIGZvciBhIGNsaWVudElkLCBjbGllbnRTZWNyZXQgY29tYmluYXRpb25cbiAgICAgKlxuICAgICAqIEBmdW5jdGlvbiBnZXRJbnN0YW5jZUZvclxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmNsaWVudElkIC0gVGhlIENsaWVudCBpZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuY2xpZW50U2VjcmV0IC0gVGhlIENsaWVudCBzZWNyZXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmxvZ2luSG9zdCAtIFRoZSBsb2dpbiBob3N0IFVSTFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuYXBpSG9zdCAtIFRoZSBBUEkgaG9zdFxuICAgICAqIEBwYXJhbSB7U3RvcmV9IHBhcmFtcy5zdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7RU5WfSBwYXJhbXMuZW52aXJvbm1lbnQgLSBUaGUgZW52aXJvbm1lbnQgdG8gc2V0XG4gICAgICogQHJldHVybiB7QXV0aGVudGljYXRvcn1cbiAgICAgKlxuICAgICAqL1xuICAgIGdldEluc3RhbmNlRm9yKHsgY2xpZW50SWQsIGNsaWVudFNlY3JldCwgZW52aXJvbm1lbnQsIGxvZ2luSG9zdCwgYXBpSG9zdCB9KSB7XG4gICAgICBjb25zdCBrZXkgPSBgJHtjbGllbnRJZH0tJHtjbGllbnRTZWNyZXR9YDtcbiAgICAgIC8vIFJldHVybiBjYWNoZWQgaW5zdGFuY2VcbiAgICAgIGlmIChpbnN0YW5jZXMuaGFzKGtleSkpIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlcy5nZXQoa2V5KTtcbiAgICAgIH1cbiAgICAgIC8vIEdlbmVyYXRlICYgY2FjaGUgbmV3IGluc3RhbmNlXG4gICAgICBjb25zdCBpbnN0YW5jZSA9IGdlbmVyYXRlSW5zdGFuY2UoY2xpZW50SWQsIGNsaWVudFNlY3JldCwgZW52aXJvbm1lbnQsIGxvZ2luSG9zdCwgYXBpSG9zdCk7XG4gICAgICBpbnN0YW5jZXMuc2V0KGtleSwgaW5zdGFuY2UpO1xuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGbHVzaGVzIGNhY2hlZCBpbnN0YW5jZXNcbiAgICAgKlxuICAgICAqIEBmdW5jdGlvbiByZXNldFxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqXG4gICAgICovXG4gICAgcmVzZXQoKSB7XG4gICAgICBpbnN0YW5jZXMuY2xlYXIoKTtcbiAgICB9LFxuXG4gIH07XG59KSgpO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXG5pZiAoZ2xvYmFsLndpbmRvdykge1xuICBnbG9iYWwud2luZG93LkF1dGhlbnRpY2F0aW9uQ2xpZW50ID0gQXV0aGVudGljYXRpb25DbGllbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aGVudGljYXRpb25DbGllbnQ7XG4iXX0=
},{"../config/default":2,"../fixtures/passwords.json":3,"../fixtures/tokens.json":4,"../fixtures/users.json":5,"./api":21,"./databases/sandbox":24,"./models/authenticator":25,"./models/client":26,"./models/session":27,"./models/user":28,"./services/consumer":29,"./services/store":31,"cross-storage":9,"es6-promise":10,"whatwg-fetch":20}],2:[function(require,module,exports){
"use strict";

module.exports = {
  api: {
    host: "//auth.avocarrot.com" },
  login: {
    host: "//login.avocarrot.com" },
  store: {
    domain: "avocarrot" } };

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

var parseValues = function parseQueryStringValues(str, options) {
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

var parseObject = function parseObjectRecursive(chain, val, options) {
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
        var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
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

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
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
    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
        return prefix;
    }
};

var toISO = Date.prototype.toISOString;

var defaults = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix);
            return [formatter(keyValue) + '=' + formatter(encoder(obj))];
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
                formatter,
                encodeValuesOnly
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
                formatter,
                encodeValuesOnly
            ));
        }
    }

    return values;
};

module.exports = function (object, opts) {
    var obj = object;
    var options = opts || {};

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
    if (typeof options.format === 'undefined') {
        options.format = formats.default;
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

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
            encode ? encoder : null,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter,
            encodeValuesOnly
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
            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
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
        out += hexTable[0xF0 | (c >> 18)] + hexTable[0x80 | ((c >> 12) & 0x3F)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]; // eslint-disable-line max-len
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
var qs = require("qs");

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
              var _JSON$parse = JSON.parse(body);

              var email = _JSON$parse.email;
              var password = _JSON$parse.password;
              var first_name = _JSON$parse.first_name;
              var last_name = _JSON$parse.last_name;

              if (database.hasUserWithData(email, password)) {
                return response(400, { error: "validation_failed" });
              }
              var newUser = database.addUser(email, password, first_name, last_name);
              return response(201, newUser);
            },
            PATCH: function (database, id, body, headers) {
              var token = stripBearer(headers.Authorization);

              var _JSON$parse = JSON.parse(body);

              var first_name = _JSON$parse.first_name;
              var last_name = _JSON$parse.last_name;

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
              var decodedBody = qs.parse(body);
              var grant_type = decodedBody.grant_type;
              var username = decodedBody.username;
              var password = decodedBody.password;
              var refresh_token = decodedBody.refresh_token;

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
              var _JSON$parse = JSON.parse(body);

              var email = _JSON$parse.email;

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

},{"../utils":32,"qs":13}],24:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCIvVXNlcnMvZ2VlL0Rlc2t0b3AvZGV2L3JlcG9zL2xvZ2luLWFwcC9ub2RlX21vZHVsZXMvYXV0aGVudGljYXRpb24tY2xpZW50L2NvbmZpZy9kZWZhdWx0LmpzIiwiZml4dHVyZXMvcGFzc3dvcmRzLmpzb24iLCJmaXh0dXJlcy90b2tlbnMuanNvbiIsImZpeHR1cmVzL3VzZXJzLmpzb24iLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9jcm9zcy1zdG9yYWdlL2xpYi9jbGllbnQuanMiLCJub2RlX21vZHVsZXMvY3Jvc3Mtc3RvcmFnZS9saWIvaHViLmpzIiwibm9kZV9tb2R1bGVzL2Nyb3NzLXN0b3JhZ2UvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvZXM2LXByb21pc2UuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3FzL2xpYi9mb3JtYXRzLmpzIiwibm9kZV9tb2R1bGVzL3FzL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9xcy9saWIvcGFyc2UuanMiLCJub2RlX21vZHVsZXMvcXMvbGliL3N0cmluZ2lmeS5qcyIsIm5vZGVfbW9kdWxlcy9xcy9saWIvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvdXRpbC9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIvVXNlcnMvZ2VlL0Rlc2t0b3AvZGV2L3JlcG9zL2xvZ2luLWFwcC9ub2RlX21vZHVsZXMvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9hcGkvaW5kZXguanMiLCIvVXNlcnMvZ2VlL0Rlc2t0b3AvZGV2L3JlcG9zL2xvZ2luLWFwcC9ub2RlX21vZHVsZXMvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9hcGkvcHJvZHVjdGlvbi5qcyIsIi9Vc2Vycy9nZWUvRGVza3RvcC9kZXYvcmVwb3MvbG9naW4tYXBwL25vZGVfbW9kdWxlcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL2FwaS9zYW5kYm94LmpzIiwiL1VzZXJzL2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9sb2dpbi1hcHAvbm9kZV9tb2R1bGVzL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvZGF0YWJhc2VzL3NhbmRib3guanMiLCIvVXNlcnMvZ2VlL0Rlc2t0b3AvZGV2L3JlcG9zL2xvZ2luLWFwcC9ub2RlX21vZHVsZXMvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9tb2RlbHMvYXV0aGVudGljYXRvci5qcyIsIi9Vc2Vycy9nZWUvRGVza3RvcC9kZXYvcmVwb3MvbG9naW4tYXBwL25vZGVfbW9kdWxlcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL21vZGVscy9jbGllbnQuanMiLCIvVXNlcnMvZ2VlL0Rlc2t0b3AvZGV2L3JlcG9zL2xvZ2luLWFwcC9ub2RlX21vZHVsZXMvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9tb2RlbHMvc2Vzc2lvbi5qcyIsIi9Vc2Vycy9nZWUvRGVza3RvcC9kZXYvcmVwb3MvbG9naW4tYXBwL25vZGVfbW9kdWxlcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL21vZGVscy91c2VyLmpzIiwiL1VzZXJzL2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9sb2dpbi1hcHAvbm9kZV9tb2R1bGVzL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvc2VydmljZXMvY29uc3VtZXIuanMiLCIvVXNlcnMvZ2VlL0Rlc2t0b3AvZGV2L3JlcG9zL2xvZ2luLWFwcC9ub2RlX21vZHVsZXMvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9zZXJ2aWNlcy9zdG9yYWdlLWNsaWVudC5qcyIsIi9Vc2Vycy9nZWUvRGVza3RvcC9kZXYvcmVwb3MvbG9naW4tYXBwL25vZGVfbW9kdWxlcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL3NlcnZpY2VzL3N0b3JlLmpzIiwiL1VzZXJzL2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9sb2dpbi1hcHAvbm9kZV9tb2R1bGVzL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvdXRpbHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN6TEEsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLEtBQUcsRUFBRTtBQUNILFFBQUksRUFBRSxzQkFBc0IsRUFDN0I7QUFDRCxPQUFLLEVBQUU7QUFDTCxRQUFJLEVBQUUsdUJBQXVCLEVBQzlCO0FBQ0QsT0FBSyxFQUFFO0FBQ0wsVUFBTSxFQUFFLFdBQVcsRUFDcEIsRUFDRixDQUFDOzs7QUNWRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdm9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMWNBLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwRCxNQUFN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LFFBQVEsQ0FBQyxDQUFDO0FBQ25ELE1BQUksY0FBYyxFQUFFO0FBQ2xCLFdBQU87QUFDTCxhQUFPLEVBQUUsZ0NBQWdDO0FBQ3pDLGFBQU8sRUFBRSxLQUFLLEVBQ2YsQ0FBQztHQUNIO0FBQ0QsTUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO0FBQzFDLFdBQU87QUFDTCxhQUFPLEVBQUUsbURBQW1EO0FBQzVELGFBQU8sRUFBRSxLQUFLLEVBQ2YsQ0FBQztHQUNIO0FBQ0QsTUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN2QixXQUFPO0FBQ0wsYUFBTyxFQUFFLDZDQUE2QztBQUN0RCxhQUFPLEVBQUUsS0FBSyxFQUNmLENBQUM7R0FDSDtBQUNELFNBQU87QUFDTCxXQUFPLEVBQUUsSUFBSSxFQUNkLENBQUM7Q0FDSCxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7Ozs7Ozs7Ozs7OztBQVluRCxJQUFNLGFBQWEsR0FBRyxVQUFDLEdBQUcsRUFBSztBQUM3QixRQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUM5QixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQzs7Ozs7Ozs7Ozs7QUFXN0MsSUFBTSxXQUFXLEdBQUc7U0FBTSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUk7Q0FBQSxDQUFDOztBQUUvQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnL2RlZmF1bHRcIik7XG52YXIgU3RvcmUgPSByZXF1aXJlKFwiLi9zZXJ2aWNlcy9zdG9yZVwiKTtcbnZhciBVc2VyID0gcmVxdWlyZShcIi4vbW9kZWxzL3VzZXJcIik7XG52YXIgQ2xpZW50ID0gcmVxdWlyZShcIi4vbW9kZWxzL2NsaWVudFwiKTtcbnZhciBTZXNzaW9uID0gcmVxdWlyZShcIi4vbW9kZWxzL3Nlc3Npb25cIik7XG52YXIgQXV0aGVudGljYXRvciA9IHJlcXVpcmUoXCIuL21vZGVscy9hdXRoZW50aWNhdG9yXCIpO1xudmFyIENvbnN1bWVyID0gcmVxdWlyZShcIi4vc2VydmljZXMvY29uc3VtZXJcIik7XG52YXIgQVBJID0gcmVxdWlyZShcIi4vYXBpXCIpO1xudmFyIFNhbmRib3hEYXRhYmFzZSA9IHJlcXVpcmUoXCIuL2RhdGFiYXNlcy9zYW5kYm94XCIpO1xudmFyIFVzZXJGaXh0dXJlcyA9IHJlcXVpcmUoXCIuLi9maXh0dXJlcy91c2Vycy5qc29uXCIpO1xudmFyIFRva2VuRml4dHVyZXMgPSByZXF1aXJlKFwiLi4vZml4dHVyZXMvdG9rZW5zLmpzb25cIik7XG52YXIgUGFzc3dvcmRGaXh0dXJlcyA9IHJlcXVpcmUoXCIuLi9maXh0dXJlcy9wYXNzd29yZHMuanNvblwiKTtcblxuLyoqXG4gKiBDcm9zc1N0b3JhZ2VIdWJcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3plbmRlc2svY3Jvc3Mtc3RvcmFnZVxuICovXG52YXIgQ3Jvc3NTdG9yYWdlSHViID0gcmVxdWlyZShcImNyb3NzLXN0b3JhZ2VcIikuQ3Jvc3NTdG9yYWdlSHViO1xuXG4vKipcbiAqIEdsb2JhbCBwb2x5ZmlsbCBmb3Ige1Byb21pc2V9XG4gKi9cbnJlcXVpcmUoXCJlczYtcHJvbWlzZVwiKS5wb2x5ZmlsbCgpO1xuXG4vKipcbiAqIEdsb2JhbCBwb2x5ZmlsbCBmb3Ige2ZldGNofVxuICovXG5yZXF1aXJlKFwid2hhdHdnLWZldGNoXCIpO1xuXG4vKipcbiAqIEBuYW1lc3BhY2UgQXV0aGVudGljYXRpb25DbGllbnRcbiAqL1xudmFyIEF1dGhlbnRpY2F0aW9uQ2xpZW50ID0gKGZ1bmN0aW9uIGltbWVkaWF0ZSgpIHtcbiAgLyoqXG4gICAqIEVudmlyb25tZW50IEVOVU1cbiAgICpcbiAgICogQGVudW1cbiAgICogcmV0dXJuIHtPYmplY3R9XG4gICAqXG4gICAqL1xuICB2YXIgRU5WID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgUHJvZHVjdGlvbjogU3ltYm9sKFwiUHJvZHVjdGlvblwiKSxcbiAgICBTYW5kYm94OiBTeW1ib2woXCJTYW5kYm94XCIpIH0pO1xuXG4gIC8qKlxuICAgKiBDYWNoZWQgaW5zdGFuY2VzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge01hcH1cbiAgICpcbiAgICovXG4gIHZhciBpbnN0YW5jZXMgPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gQVBJIGluc3RhY2VzIGZvciBhbiBFTlYgc2V0dXBcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHRocm93cyB7RXJyb3J9XG4gICAqIEBwYXJhbSB7RU5WfSBlbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXQgLSBEZWZhdWx0cyB0byBgUHJvZHVjdGlvbmBcbiAgICogQHJldHVybiB7U2FuZGJveEFQSXxQcm9kdWN0aW9uQVBJfVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0QVBJRm9yKGVudmlyb25tZW50KSB7XG4gICAgdmFyIGhvc3QgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGNvbmZpZy5hcGkuaG9zdCA6IGFyZ3VtZW50c1sxXTtcblxuICAgIGlmIChlbnZpcm9ubWVudCA9PT0gRU5WLlByb2R1Y3Rpb24pIHtcbiAgICAgIHJldHVybiBuZXcgQVBJLlByb2R1Y3Rpb24oaG9zdCk7XG4gICAgfVxuICAgIGlmIChlbnZpcm9ubWVudCA9PT0gRU5WLlNhbmRib3gpIHtcbiAgICAgIHJldHVybiBuZXcgQVBJLlNhbmRib3gobmV3IFNhbmRib3hEYXRhYmFzZShVc2VyRml4dHVyZXMsIFRva2VuRml4dHVyZXMsIFBhc3N3b3JkRml4dHVyZXMpKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBgZW52aXJvbm1lbnRgIHBhc3NlZFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYW4gQXV0aGVudGljYXRpb25DbGllbnQgaW5zdGFuY2VcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudElkIC0gVGhlIGNsaWVudCBpZCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFNlY3JldCAtIFRoZSBjbGllbnQgc2VjcmV0XG4gICAqIEBwYXJhbSB7RU5WfSBlbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGxvZ2luSG9zdCAtIFRoZSBsb2dpbiBob3N0IFVSTFxuICAgKiBAcGFyYW0ge1N0cmluZ30gYXBpSG9zdCAtIFRoZSBBUEkgaG9zdFxuICAgKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZVxuICAgKiBAcmV0dXJuIHtBdXRoZW50aWNhdG9yfVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gZ2VuZXJhdGVJbnN0YW5jZShjbGllbnRJZCwgY2xpZW50U2VjcmV0KSB7XG4gICAgdmFyIGVudmlyb25tZW50ID0gYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyBFTlYuUHJvZHVjdGlvbiA6IGFyZ3VtZW50c1syXTtcbiAgICB2YXIgbG9naW5Ib3N0ID0gYXJndW1lbnRzWzNdID09PSB1bmRlZmluZWQgPyBjb25maWcubG9naW4uaG9zdCA6IGFyZ3VtZW50c1szXTtcbiAgICB2YXIgYXBpSG9zdCA9IGFyZ3VtZW50c1s0XSA9PT0gdW5kZWZpbmVkID8gY29uZmlnLmFwaS5ob3N0IDogYXJndW1lbnRzWzRdO1xuICAgIHZhciBzdG9yZURvbWFpbiA9IGFyZ3VtZW50c1s1XSA9PT0gdW5kZWZpbmVkID8gY29uZmlnLnN0b3JlLmRvbWFpbiA6IGFyZ3VtZW50c1s1XTtcblxuICAgIHZhciBzdG9yZSA9IG5ldyBTdG9yZShzdG9yZURvbWFpbiwgXCJcIiArIGxvZ2luSG9zdCArIFwiL2h1YlwiKTtcbiAgICB2YXIgYXBpID0gZ2V0QVBJRm9yKGVudmlyb25tZW50LCBhcGlIb3N0KTtcbiAgICB2YXIgY2xpZW50ID0gbmV3IENsaWVudChjbGllbnRJZCwgY2xpZW50U2VjcmV0KTtcbiAgICB2YXIgY29uc3VtZXIgPSBuZXcgQ29uc3VtZXIoY2xpZW50LCBhcGkpO1xuICAgIHZhciB1c2VyID0gbmV3IFVzZXIoc3RvcmUsIGNvbnN1bWVyKTtcbiAgICB2YXIgc2Vzc2lvbiA9IG5ldyBTZXNzaW9uKHVzZXIsIGxvZ2luSG9zdCk7XG4gICAgdmFyIGF1dGhlbnRpY2F0b3IgPSBuZXcgQXV0aGVudGljYXRvcihjb25zdW1lcik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVzZXI6IHVzZXIsXG4gICAgICBzZXNzaW9uOiBzZXNzaW9uLFxuICAgICAgYXV0aGVudGljYXRvcjogYXV0aGVudGljYXRvciB9O1xuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIC8qKlxuICAgICAqIEVudmlyb25tZW50IGVudW1cbiAgICAgKlxuICAgICAqIEBlbnVtXG4gICAgICogQG1lbWJlcm9mIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gICAgICpcbiAgICAgKi9cbiAgICBFbnZpcm9ubWVudDogRU5WLFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgQ3Jvc3NTdG9yYWdlSHViXG4gICAgICpcbiAgICAgKiBAZW51bVxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqXG4gICAgICovXG4gICAgaW5pdFN0b3JhZ2U6IGZ1bmN0aW9uIGluaXRTdG9yYWdlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBDcm9zc1N0b3JhZ2VIdWIuaW5pdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBBdXRoZW50aWNhdG9yIGluc3RhbmNlIGZvciBhIGNsaWVudElkLCBjbGllbnRTZWNyZXQgY29tYmluYXRpb25cbiAgICAgKlxuICAgICAqIEBmdW5jdGlvbiBnZXRJbnN0YW5jZUZvclxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmNsaWVudElkIC0gVGhlIENsaWVudCBpZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuY2xpZW50U2VjcmV0IC0gVGhlIENsaWVudCBzZWNyZXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmxvZ2luSG9zdCAtIFRoZSBsb2dpbiBob3N0IFVSTFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuYXBpSG9zdCAtIFRoZSBBUEkgaG9zdFxuICAgICAqIEBwYXJhbSB7U3RvcmV9IHBhcmFtcy5zdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7RU5WfSBwYXJhbXMuZW52aXJvbm1lbnQgLSBUaGUgZW52aXJvbm1lbnQgdG8gc2V0XG4gICAgICogQHJldHVybiB7QXV0aGVudGljYXRvcn1cbiAgICAgKlxuICAgICAqL1xuICAgIGdldEluc3RhbmNlRm9yOiBmdW5jdGlvbiBnZXRJbnN0YW5jZUZvcihfcmVmKSB7XG4gICAgICB2YXIgY2xpZW50SWQgPSBfcmVmLmNsaWVudElkO1xuICAgICAgdmFyIGNsaWVudFNlY3JldCA9IF9yZWYuY2xpZW50U2VjcmV0O1xuICAgICAgdmFyIGVudmlyb25tZW50ID0gX3JlZi5lbnZpcm9ubWVudDtcbiAgICAgIHZhciBsb2dpbkhvc3QgPSBfcmVmLmxvZ2luSG9zdDtcbiAgICAgIHZhciBhcGlIb3N0ID0gX3JlZi5hcGlIb3N0O1xuXG4gICAgICB2YXIga2V5ID0gXCJcIiArIGNsaWVudElkICsgXCItXCIgKyBjbGllbnRTZWNyZXQ7XG4gICAgICAvLyBSZXR1cm4gY2FjaGVkIGluc3RhbmNlXG4gICAgICBpZiAoaW5zdGFuY2VzLmhhcyhrZXkpKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZXMuZ2V0KGtleSk7XG4gICAgICB9XG4gICAgICAvLyBHZW5lcmF0ZSAmIGNhY2hlIG5ldyBpbnN0YW5jZVxuICAgICAgdmFyIGluc3RhbmNlID0gZ2VuZXJhdGVJbnN0YW5jZShjbGllbnRJZCwgY2xpZW50U2VjcmV0LCBlbnZpcm9ubWVudCwgbG9naW5Ib3N0LCBhcGlIb3N0KTtcbiAgICAgIGluc3RhbmNlcy5zZXQoa2V5LCBpbnN0YW5jZSk7XG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZsdXNoZXMgY2FjaGVkIGluc3RhbmNlc1xuICAgICAqXG4gICAgICogQGZ1bmN0aW9uIHJlc2V0XG4gICAgICogQG1lbWJlcm9mIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gICAgICpcbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICBpbnN0YW5jZXMuY2xlYXIoKTtcbiAgICB9IH07XG59KSgpO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXG5pZiAoZ2xvYmFsLndpbmRvdykge1xuICBnbG9iYWwud2luZG93LkF1dGhlbnRpY2F0aW9uQ2xpZW50ID0gQXV0aGVudGljYXRpb25DbGllbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aGVudGljYXRpb25DbGllbnQ7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluWldVdlJHVnphM1J2Y0M5a1pYWXZjbVZ3YjNNdmJHOW5hVzR0WVhCd0wyNXZaR1ZmYlc5a2RXeGxjeTloZFhSb1pXNTBhV05oZEdsdmJpMWpiR2xsYm5RdmMzSmpMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenRCUVVGQkxFbEJRVTBzVFVGQlRTeEhRVUZITEU5QlFVOHNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eERRVUZETzBGQlF6VkRMRWxCUVUwc1MwRkJTeXhIUVVGSExFOUJRVThzUTBGQlF5eHJRa0ZCYTBJc1EwRkJReXhEUVVGRE8wRkJRekZETEVsQlFVMHNTVUZCU1N4SFFVRkhMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dEJRVU4wUXl4SlFVRk5MRTFCUVUwc1IwRkJSeXhQUVVGUExFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1EwRkJRenRCUVVNeFF5eEpRVUZOTEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhKUVVGTkxHRkJRV0VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNkMEpCUVhkQ0xFTkJRVU1zUTBGQlF6dEJRVU40UkN4SlFVRk5MRkZCUVZFc1IwRkJSeXhQUVVGUExFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1EwRkJRenRCUVVOb1JDeEpRVUZOTEVkQlFVY3NSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRE4wSXNTVUZCVFN4bFFVRmxMRWRCUVVjc1QwRkJUeXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRU5CUVVNN1FVRkRka1FzU1VGQlRTeFpRVUZaTEVkQlFVY3NUMEZCVHl4RFFVRkRMSGRDUVVGM1FpeERRVUZETEVOQlFVTTdRVUZEZGtRc1NVRkJUU3hoUVVGaExFZEJRVWNzVDBGQlR5eERRVUZETEhsQ1FVRjVRaXhEUVVGRExFTkJRVU03UVVGRGVrUXNTVUZCVFN4blFrRkJaMElzUjBGQlJ5eFBRVUZQTEVOQlFVTXNORUpCUVRSQ0xFTkJRVU1zUTBGQlF6czdPenM3TzBGQlRTOUVMRWxCUVUwc1pVRkJaU3hIUVVGSExFOUJRVThzUTBGQlF5eGxRVUZsTEVOQlFVTXNRMEZCUXl4bFFVRmxMRU5CUVVNN096czdPMEZCUzJwRkxFOUJRVThzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXl4UlFVRlJMRVZCUVVVc1EwRkJRenM3T3pzN1FVRkxiRU1zVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkRPenM3T3p0QlFVMTRRaXhKUVVGTkxHOUNRVUZ2UWl4SFFVRkhMRU5CUVVNc1UwRkJVeXhUUVVGVExFZEJRVWM3T3pzN096czdPMEZCVVdwRUxFMUJRVTBzUjBGQlJ5eEhRVUZITEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNN1FVRkRlRUlzWTBGQlZTeEZRVUZGTEUxQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNN1FVRkRhRU1zVjBGQlR5eEZRVUZGTEUxQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNc1JVRkRNMElzUTBGQlF5eERRVUZET3pzN096czdPenM3UVVGVFNDeE5RVUZOTEZOQlFWTXNSMEZCUnl4SlFVRkpMRWRCUVVjc1JVRkJSU3hEUVVGRE96czdPenM3T3pzN096dEJRVmMxUWl4WFFVRlRMRk5CUVZNc1EwRkJReXhYUVVGWExFVkJRVEJDTzFGQlFYaENMRWxCUVVrc1owTkJRVWNzVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpPenRCUVVOd1JDeFJRVUZKTEZkQlFWY3NTMEZCU3l4SFFVRkhMRU5CUVVNc1ZVRkJWU3hGUVVGRk8wRkJRMnhETEdGQlFVOHNTVUZCU1N4SFFVRkhMRU5CUVVNc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzB0QlEycERPMEZCUTBRc1VVRkJTU3hYUVVGWExFdEJRVXNzUjBGQlJ5eERRVUZETEU5QlFVOHNSVUZCUlR0QlFVTXZRaXhoUVVGUExFbEJRVWtzUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMR1ZCUVdVc1EwRkJReXhaUVVGWkxFVkJRVVVzWVVGQllTeEZRVUZGTEdkQ1FVRm5RaXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVU0xUmp0QlFVTkVMRlZCUVUwc1NVRkJTU3hMUVVGTExFTkJRVU1zT0VKQlFUaENMRU5CUVVNc1EwRkJRenRIUVVOcVJEczdPenM3T3pzN096czdPenM3TzBGQlpVUXNWMEZCVXl4blFrRkJaMElzUTBGQlF5eFJRVUZSTEVWQlFVVXNXVUZCV1N4RlFVRTJTRHRSUVVFelNDeFhRVUZYTEdkRFFVRkhMRWRCUVVjc1EwRkJReXhWUVVGVk8xRkJRVVVzVTBGQlV5eG5RMEZCUnl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWs3VVVGQlJTeFBRVUZQTEdkRFFVRkhMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNUdFJRVUZGTEZkQlFWY3NaME5CUVVjc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOT3p0QlFVTjZTeXhSUVVGTkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEV0QlFVc3NRMEZCUXl4WFFVRlhMRTlCUVVzc1UwRkJVeXhWUVVGUExFTkJRVU03UVVGRGVrUXNVVUZCVFN4SFFVRkhMRWRCUVVjc1UwRkJVeXhEUVVGRExGZEJRVmNzUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhSUVVGTkxFMUJRVTBzUjBGQlJ5eEpRVUZKTEUxQlFVMHNRMEZCUXl4UlFVRlJMRVZCUVVVc1dVRkJXU3hEUVVGRExFTkJRVU03UVVGRGJFUXNVVUZCVFN4UlFVRlJMRWRCUVVjc1NVRkJTU3hSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUXpORExGRkJRVTBzU1VGQlNTeEhRVUZITEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU4yUXl4UlFVRk5MRTlCUVU4c1IwRkJSeXhKUVVGSkxFOUJRVThzUTBGQlF5eEpRVUZKTEVWQlFVVXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkROME1zVVVGQlRTeGhRVUZoTEVkQlFVY3NTVUZCU1N4aFFVRmhMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UVVGRGJFUXNWMEZCVHp0QlFVTk1MRlZCUVVrc1JVRkJTaXhKUVVGSk8wRkJRMG9zWVVGQlR5eEZRVUZRTEU5QlFVODdRVUZEVUN4dFFrRkJZU3hGUVVGaUxHRkJRV0VzUlVGRFpDeERRVUZETzBkQlEwZzdPMEZCUlVRc1UwRkJUenM3T3pzN096czdPMEZCVTB3c1pVRkJWeXhGUVVGRkxFZEJRVWM3T3pzN096czdPenRCUVZOb1FpeGxRVUZYTEVWQlFVRXNjVUpCUVVNc1QwRkJUeXhGUVVGRk8wRkJRMjVDTEdGQlFVOHNaVUZCWlN4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dExRVU4wUXpzN096czdPenM3T3pzN096czdPenM3UVVGcFFrUXNhMEpCUVdNc1JVRkJRU3c0UWtGQk9FUTdWVUZCTTBRc1VVRkJVU3hSUVVGU0xGRkJRVkU3VlVGQlJTeFpRVUZaTEZGQlFWb3NXVUZCV1R0VlFVRkZMRmRCUVZjc1VVRkJXQ3hYUVVGWE8xVkJRVVVzVTBGQlV5eFJRVUZVTEZOQlFWTTdWVUZCUlN4UFFVRlBMRkZCUVZBc1QwRkJUenM3UVVGRGRFVXNWVUZCVFN4SFFVRkhMRkZCUVUwc1VVRkJVU3hUUVVGSkxGbEJRVmtzUVVGQlJTeERRVUZET3p0QlFVVXhReXhWUVVGSkxGTkJRVk1zUTBGQlF5eEhRVUZITEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVN1FVRkRkRUlzWlVGQlR5eFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8wOUJRek5DT3p0QlFVVkVMRlZCUVUwc1VVRkJVU3hIUVVGSExHZENRVUZuUWl4RFFVRkRMRkZCUVZFc1JVRkJSU3haUVVGWkxFVkJRVVVzVjBGQlZ5eEZRVUZGTEZOQlFWTXNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVNelJpeGxRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU0zUWl4aFFVRlBMRkZCUVZFc1EwRkJRenRMUVVOcVFqczdPenM3T3pzN08wRkJVMFFzVTBGQlN5eEZRVUZCTEdsQ1FVRkhPMEZCUTA0c1pVRkJVeXhEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETzB0QlEyNUNMRVZCUlVZc1EwRkJRenREUVVOSUxFTkJRVUVzUlVGQlJ5eERRVUZET3pzN08wRkJTVXdzU1VGQlNTeE5RVUZOTEVOQlFVTXNUVUZCVFN4RlFVRkZPMEZCUTJwQ0xGRkJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNiMEpCUVc5Q0xFZEJRVWNzYjBKQlFXOUNMRU5CUVVNN1EwRkRNMFE3TzBGQlJVUXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXh2UWtGQmIwSXNRMEZCUXlJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lZMjl1YzNRZ1kyOXVabWxuSUQwZ2NtVnhkV2x5WlNnbkxpNHZZMjl1Wm1sbkwyUmxabUYxYkhRbktUdGNibU52Ym5OMElGTjBiM0psSUQwZ2NtVnhkV2x5WlNnbkxpOXpaWEoyYVdObGN5OXpkRzl5WlNjcE8xeHVZMjl1YzNRZ1ZYTmxjaUE5SUhKbGNYVnBjbVVvSnk0dmJXOWtaV3h6TDNWelpYSW5LVHRjYm1OdmJuTjBJRU5zYVdWdWRDQTlJSEpsY1hWcGNtVW9KeTR2Ylc5a1pXeHpMMk5zYVdWdWRDY3BPMXh1WTI5dWMzUWdVMlZ6YzJsdmJpQTlJSEpsY1hWcGNtVW9KeTR2Ylc5a1pXeHpMM05sYzNOcGIyNG5LVHRjYm1OdmJuTjBJRUYxZEdobGJuUnBZMkYwYjNJZ1BTQnlaWEYxYVhKbEtDY3VMMjF2WkdWc2N5OWhkWFJvWlc1MGFXTmhkRzl5SnlrN1hHNWpiMjV6ZENCRGIyNXpkVzFsY2lBOUlISmxjWFZwY21Vb0p5NHZjMlZ5ZG1salpYTXZZMjl1YzNWdFpYSW5LVHRjYm1OdmJuTjBJRUZRU1NBOUlISmxjWFZwY21Vb0p5NHZZWEJwSnlrN1hHNWpiMjV6ZENCVFlXNWtZbTk0UkdGMFlXSmhjMlVnUFNCeVpYRjFhWEpsS0NjdUwyUmhkR0ZpWVhObGN5OXpZVzVrWW05NEp5azdYRzVqYjI1emRDQlZjMlZ5Um1sNGRIVnlaWE1nUFNCeVpYRjFhWEpsS0NjdUxpOW1hWGgwZFhKbGN5OTFjMlZ5Y3k1cWMyOXVKeWs3WEc1amIyNXpkQ0JVYjJ0bGJrWnBlSFIxY21WeklEMGdjbVZ4ZFdseVpTZ25MaTR2Wm1sNGRIVnlaWE12ZEc5clpXNXpMbXB6YjI0bktUdGNibU52Ym5OMElGQmhjM04zYjNKa1JtbDRkSFZ5WlhNZ1BTQnlaWEYxYVhKbEtDY3VMaTltYVhoMGRYSmxjeTl3WVhOemQyOXlaSE11YW5OdmJpY3BPMXh1WEc0dktpcGNiaUFxSUVOeWIzTnpVM1J2Y21GblpVaDFZbHh1SUNvZ1FITmxaU0JvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2ZW1WdVpHVnpheTlqY205emN5MXpkRzl5WVdkbFhHNGdLaTljYm1OdmJuTjBJRU55YjNOelUzUnZjbUZuWlVoMVlpQTlJSEpsY1hWcGNtVW9KMk55YjNOekxYTjBiM0poWjJVbktTNURjbTl6YzFOMGIzSmhaMlZJZFdJN1hHNWNiaThxS2x4dUlDb2dSMnh2WW1Gc0lIQnZiSGxtYVd4c0lHWnZjaUI3VUhKdmJXbHpaWDFjYmlBcUwxeHVjbVZ4ZFdseVpTZ25aWE0yTFhCeWIyMXBjMlVuS1M1d2IyeDVabWxzYkNncE8xeHVYRzR2S2lwY2JpQXFJRWRzYjJKaGJDQndiMng1Wm1sc2JDQm1iM0lnZTJabGRHTm9mVnh1SUNvdlhHNXlaWEYxYVhKbEtDZDNhR0YwZDJjdFptVjBZMmduS1R0Y2JseHVYRzR2S2lwY2JpQXFJRUJ1WVcxbGMzQmhZMlVnUVhWMGFHVnVkR2xqWVhScGIyNURiR2xsYm5SY2JpQXFMMXh1WTI5dWMzUWdRWFYwYUdWdWRHbGpZWFJwYjI1RGJHbGxiblFnUFNBb1puVnVZM1JwYjI0Z2FXMXRaV1JwWVhSbEtDa2dlMXh1SUNBdktpcGNiaUFnSUNvZ1JXNTJhWEp2Ym0xbGJuUWdSVTVWVFZ4dUlDQWdLbHh1SUNBZ0tpQkFaVzUxYlZ4dUlDQWdLaUJ5WlhSMWNtNGdlMDlpYW1WamRIMWNiaUFnSUNwY2JpQWdJQ292WEc0Z0lHTnZibk4wSUVWT1ZpQTlJRTlpYW1WamRDNW1jbVZsZW1Vb2UxeHVJQ0FnSUZCeWIyUjFZM1JwYjI0NklGTjViV0p2YkNnblVISnZaSFZqZEdsdmJpY3BMRnh1SUNBZ0lGTmhibVJpYjNnNklGTjViV0p2YkNnblUyRnVaR0p2ZUNjcExGeHVJQ0I5S1R0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUTJGamFHVmtJR2x1YzNSaGJtTmxjMXh1SUNBZ0tseHVJQ0FnS2lCQWNISnBkbUYwWlZ4dUlDQWdLaUJBY21WMGRYSnVJSHROWVhCOVhHNGdJQ0FxWEc0Z0lDQXFMMXh1SUNCamIyNXpkQ0JwYm5OMFlXNWpaWE1nUFNCdVpYY2dUV0Z3S0NrN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUZKbGRIVnlibk1nWVc0Z1FWQkpJR2x1YzNSaFkyVnpJR1p2Y2lCaGJpQkZUbFlnYzJWMGRYQmNiaUFnSUNwY2JpQWdJQ29nUUhCeWFYWmhkR1ZjYmlBZ0lDb2dRSFJvY205M2N5QjdSWEp5YjNKOVhHNGdJQ0FxSUVCd1lYSmhiU0I3UlU1V2ZTQmxiblpwY205dWJXVnVkQ0F0SUZSb1pTQmxiblpwY205dWJXVnVkQ0IwYnlCelpYUWdMU0JFWldaaGRXeDBjeUIwYnlCZ1VISnZaSFZqZEdsdmJtQmNiaUFnSUNvZ1FISmxkSFZ5YmlCN1UyRnVaR0p2ZUVGUVNYeFFjbTlrZFdOMGFXOXVRVkJKZlZ4dUlDQWdLbHh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnWjJWMFFWQkpSbTl5S0dWdWRtbHliMjV0Wlc1MExDQm9iM04wSUQwZ1kyOXVabWxuTG1Gd2FTNW9iM04wS1NCN1hHNGdJQ0FnYVdZZ0tHVnVkbWx5YjI1dFpXNTBJRDA5UFNCRlRsWXVVSEp2WkhWamRHbHZiaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRzVsZHlCQlVFa3VVSEp2WkhWamRHbHZiaWhvYjNOMEtUdGNiaUFnSUNCOVhHNGdJQ0FnYVdZZ0tHVnVkbWx5YjI1dFpXNTBJRDA5UFNCRlRsWXVVMkZ1WkdKdmVDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHNWxkeUJCVUVrdVUyRnVaR0p2ZUNodVpYY2dVMkZ1WkdKdmVFUmhkR0ZpWVhObEtGVnpaWEpHYVhoMGRYSmxjeXdnVkc5clpXNUdhWGgwZFhKbGN5d2dVR0Z6YzNkdmNtUkdhWGgwZFhKbGN5a3BPMXh1SUNBZ0lIMWNiaUFnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjBsdWRtRnNhV1FnWUdWdWRtbHliMjV0Wlc1MFlDQndZWE56WldRbktUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJIWlc1bGNtRjBaWE1nWVc0Z1FYVjBhR1Z1ZEdsallYUnBiMjVEYkdsbGJuUWdhVzV6ZEdGdVkyVmNiaUFnSUNwY2JpQWdJQ29nUUhCeWFYWmhkR1ZjYmlBZ0lDb2dRSEJoY21GdElIdFRkSEpwYm1kOUlHTnNhV1Z1ZEVsa0lDMGdWR2hsSUdOc2FXVnVkQ0JwWkNCMGJ5QnpaWFJjYmlBZ0lDb2dRSEJoY21GdElIdFRkSEpwYm1kOUlHTnNhV1Z1ZEZObFkzSmxkQ0F0SUZSb1pTQmpiR2xsYm5RZ2MyVmpjbVYwWEc0Z0lDQXFJRUJ3WVhKaGJTQjdSVTVXZlNCbGJuWnBjbTl1YldWdWRDQXRJRlJvWlNCbGJuWnBjbTl1YldWdWRDQjBieUJ6WlhSY2JpQWdJQ29nUUhCaGNtRnRJSHRUZEhKcGJtZDlJR3h2WjJsdVNHOXpkQ0F0SUZSb1pTQnNiMmRwYmlCb2IzTjBJRlZTVEZ4dUlDQWdLaUJBY0dGeVlXMGdlMU4wY21sdVozMGdZWEJwU0c5emRDQXRJRlJvWlNCQlVFa2dhRzl6ZEZ4dUlDQWdLaUJBY0dGeVlXMGdlMU4wYjNKbGZTQnpkRzl5WlNBdElGUm9aU0JUZEc5eVpTQnBibk4wWVc1alpWeHVJQ0FnS2lCQWNtVjBkWEp1SUh0QmRYUm9aVzUwYVdOaGRHOXlmVnh1SUNBZ0tseHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdaMlZ1WlhKaGRHVkpibk4wWVc1alpTaGpiR2xsYm5SSlpDd2dZMnhwWlc1MFUyVmpjbVYwTENCbGJuWnBjbTl1YldWdWRDQTlJRVZPVmk1UWNtOWtkV04wYVc5dUxDQnNiMmRwYmtodmMzUWdQU0JqYjI1bWFXY3ViRzluYVc0dWFHOXpkQ3dnWVhCcFNHOXpkQ0E5SUdOdmJtWnBaeTVoY0drdWFHOXpkQ3dnYzNSdmNtVkViMjFoYVc0Z1BTQmpiMjVtYVdjdWMzUnZjbVV1Wkc5dFlXbHVLU0I3WEc0Z0lDQWdZMjl1YzNRZ2MzUnZjbVVnUFNCdVpYY2dVM1J2Y21Vb2MzUnZjbVZFYjIxaGFXNHNJR0FrZTJ4dloybHVTRzl6ZEgwdmFIVmlZQ2s3WEc0Z0lDQWdZMjl1YzNRZ1lYQnBJRDBnWjJWMFFWQkpSbTl5S0dWdWRtbHliMjV0Wlc1MExDQmhjR2xJYjNOMEtUdGNiaUFnSUNCamIyNXpkQ0JqYkdsbGJuUWdQU0J1WlhjZ1EyeHBaVzUwS0dOc2FXVnVkRWxrTENCamJHbGxiblJUWldOeVpYUXBPMXh1SUNBZ0lHTnZibk4wSUdOdmJuTjFiV1Z5SUQwZ2JtVjNJRU52Ym5OMWJXVnlLR05zYVdWdWRDd2dZWEJwS1R0Y2JpQWdJQ0JqYjI1emRDQjFjMlZ5SUQwZ2JtVjNJRlZ6WlhJb2MzUnZjbVVzSUdOdmJuTjFiV1Z5S1R0Y2JpQWdJQ0JqYjI1emRDQnpaWE56YVc5dUlEMGdibVYzSUZObGMzTnBiMjRvZFhObGNpd2diRzluYVc1SWIzTjBLVHRjYmlBZ0lDQmpiMjV6ZENCaGRYUm9aVzUwYVdOaGRHOXlJRDBnYm1WM0lFRjFkR2hsYm5ScFkyRjBiM0lvWTI5dWMzVnRaWElwTzF4dUlDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQjFjMlZ5TEZ4dUlDQWdJQ0FnYzJWemMybHZiaXhjYmlBZ0lDQWdJR0YxZEdobGJuUnBZMkYwYjNJc1hHNGdJQ0FnZlR0Y2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkZiblpwY205dWJXVnVkQ0JsYm5WdFhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQVpXNTFiVnh1SUNBZ0lDQXFJRUJ0WlcxaVpYSnZaaUJCZFhSb1pXNTBhV05oZEdsdmJrTnNhV1Z1ZEZ4dUlDQWdJQ0FxWEc0Z0lDQWdJQ292WEc0Z0lDQWdSVzUyYVhKdmJtMWxiblE2SUVWT1ZpeGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRWx1YVhScFlXeHBlbVZ6SUVOeWIzTnpVM1J2Y21GblpVaDFZbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRR1Z1ZFcxY2JpQWdJQ0FnS2lCQWJXVnRZbVZ5YjJZZ1FYVjBhR1Z1ZEdsallYUnBiMjVEYkdsbGJuUmNiaUFnSUNBZ0tseHVJQ0FnSUNBcUwxeHVJQ0FnSUdsdWFYUlRkRzl5WVdkbEtHOXdkR2x2Ym5NcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCRGNtOXpjMU4wYjNKaFoyVklkV0l1YVc1cGRDaHZjSFJwYjI1ektUdGNiaUFnSUNCOUxGeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRM0psWVhSbGN5QmhiaUJCZFhSb1pXNTBhV05oZEc5eUlHbHVjM1JoYm1ObElHWnZjaUJoSUdOc2FXVnVkRWxrTENCamJHbGxiblJUWldOeVpYUWdZMjl0WW1sdVlYUnBiMjVjYmlBZ0lDQWdLbHh1SUNBZ0lDQXFJRUJtZFc1amRHbHZiaUJuWlhSSmJuTjBZVzVqWlVadmNseHVJQ0FnSUNBcUlFQnRaVzFpWlhKdlppQkJkWFJvWlc1MGFXTmhkR2x2YmtOc2FXVnVkRnh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdUMkpxWldOMGZTQndZWEpoYlhOY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnY0dGeVlXMXpMbU5zYVdWdWRFbGtJQzBnVkdobElFTnNhV1Z1ZENCcFpGeHVJQ0FnSUNBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNCd1lYSmhiWE11WTJ4cFpXNTBVMlZqY21WMElDMGdWR2hsSUVOc2FXVnVkQ0J6WldOeVpYUmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UxTjBjbWx1WjMwZ2NHRnlZVzF6TG14dloybHVTRzl6ZENBdElGUm9aU0JzYjJkcGJpQm9iM04wSUZWU1RGeHVJQ0FnSUNBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNCd1lYSmhiWE11WVhCcFNHOXpkQ0F0SUZSb1pTQkJVRWtnYUc5emRGeHVJQ0FnSUNBcUlFQndZWEpoYlNCN1UzUnZjbVY5SUhCaGNtRnRjeTV6ZEc5eVpTQXRJRlJvWlNCVGRHOXlaU0JwYm5OMFlXNWpaVnh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdSVTVXZlNCd1lYSmhiWE11Wlc1MmFYSnZibTFsYm5RZ0xTQlVhR1VnWlc1MmFYSnZibTFsYm5RZ2RHOGdjMlYwWEc0Z0lDQWdJQ29nUUhKbGRIVnliaUI3UVhWMGFHVnVkR2xqWVhSdmNuMWNiaUFnSUNBZ0tseHVJQ0FnSUNBcUwxeHVJQ0FnSUdkbGRFbHVjM1JoYm1ObFJtOXlLSHNnWTJ4cFpXNTBTV1FzSUdOc2FXVnVkRk5sWTNKbGRDd2daVzUyYVhKdmJtMWxiblFzSUd4dloybHVTRzl6ZEN3Z1lYQnBTRzl6ZENCOUtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCclpYa2dQU0JnSkh0amJHbGxiblJKWkgwdEpIdGpiR2xsYm5SVFpXTnlaWFI5WUR0Y2JpQWdJQ0FnSUM4dklGSmxkSFZ5YmlCallXTm9aV1FnYVc1emRHRnVZMlZjYmlBZ0lDQWdJR2xtSUNocGJuTjBZVzVqWlhNdWFHRnpLR3RsZVNrcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHbHVjM1JoYm1ObGN5NW5aWFFvYTJWNUtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lDOHZJRWRsYm1WeVlYUmxJQ1lnWTJGamFHVWdibVYzSUdsdWMzUmhibU5sWEc0Z0lDQWdJQ0JqYjI1emRDQnBibk4wWVc1alpTQTlJR2RsYm1WeVlYUmxTVzV6ZEdGdVkyVW9ZMnhwWlc1MFNXUXNJR05zYVdWdWRGTmxZM0psZEN3Z1pXNTJhWEp2Ym0xbGJuUXNJR3h2WjJsdVNHOXpkQ3dnWVhCcFNHOXpkQ2s3WEc0Z0lDQWdJQ0JwYm5OMFlXNWpaWE11YzJWMEtHdGxlU3dnYVc1emRHRnVZMlVwTzF4dUlDQWdJQ0FnY21WMGRYSnVJR2x1YzNSaGJtTmxPMXh1SUNBZ0lIMHNYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJHYkhWemFHVnpJR05oWTJobFpDQnBibk4wWVc1alpYTmNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQm1kVzVqZEdsdmJpQnlaWE5sZEZ4dUlDQWdJQ0FxSUVCdFpXMWlaWEp2WmlCQmRYUm9aVzUwYVdOaGRHbHZia05zYVdWdWRGeHVJQ0FnSUNBcVhHNGdJQ0FnSUNvdlhHNGdJQ0FnY21WelpYUW9LU0I3WEc0Z0lDQWdJQ0JwYm5OMFlXNWpaWE11WTJ4bFlYSW9LVHRjYmlBZ0lDQjlMRnh1WEc0Z0lIMDdYRzU5S1NncE8xeHVYRzR2S2lCcGMzUmhibUoxYkNCcFoyNXZjbVVnYm1WNGRDQXFMMXh1WEc1cFppQW9aMnh2WW1Gc0xuZHBibVJ2ZHlrZ2UxeHVJQ0JuYkc5aVlXd3VkMmx1Wkc5M0xrRjFkR2hsYm5ScFkyRjBhVzl1UTJ4cFpXNTBJRDBnUVhWMGFHVnVkR2xqWVhScGIyNURiR2xsYm5RN1hHNTlYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnUVhWMGFHVnVkR2xqWVhScGIyNURiR2xsYm5RN1hHNGlYWDA9IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFwaToge1xuICAgIGhvc3Q6ICcvL2F1dGguYXZvY2Fycm90LmNvbScsXG4gIH0sXG4gIGxvZ2luOiB7XG4gICAgaG9zdDogJy8vbG9naW4uYXZvY2Fycm90LmNvbScsXG4gIH0sXG4gIHN0b3JlOiB7XG4gICAgZG9tYWluOiAnYXZvY2Fycm90JyxcbiAgfSxcbn07XG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHtcbiAgICBcInVzZXJfaWRcIjogXCI0NGQyYzhlMC03NjJiLTRmYTUtODU3MS0wOTdjODFjMzEzMGRcIixcbiAgICBcInRva2VuXCI6IFwieUpoYkdjaWVPaUpJVXpJMU5pSXNJSjluUjVjQ0k2SWtwWFZDXCJcbiAgfVxuXVxuIiwibW9kdWxlLmV4cG9ydHM9W1xuICB7XG4gICAgXCJ1c2VyX2lkXCI6IFwiNDRkMmM4ZTAtNzYyYi00ZmE1LTg1NzEtMDk3YzgxYzMxMzBkXCIsXG4gICAgXCJyZWZyZXNoX3Rva2VuXCI6IFwiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5XCIsXG4gICAgXCJhY2Nlc3NfdG9rZW5cIjogXCJya2RrSkhWQmRDakxJSWpzSUs0TmFsYXV4UFA4dW81aFk4dFRON1wiXG4gIH1cbl1cbiIsIm1vZHVsZS5leHBvcnRzPVtcbiAge1xuICAgIFwiaWRcIjogXCI0NGQyYzhlMC03NjJiLTRmYTUtODU3MS0wOTdjODFjMzEzMGRcIixcbiAgICBcInB1Ymxpc2hlcl9pZFwiOiBcIjU1ZjVjOGUwLTc2MmItNGZhNS04NTcxLTE5N2M4MTgzMTMwYVwiLFxuICAgIFwiZmlyc3RfbmFtZVwiOiBcIkpvaG5cIixcbiAgICBcImxhc3RfbmFtZVwiOiBcIkRvZVwiLFxuICAgIFwiZW1haWxcIjogXCJqb2huLmRvZUBtYWlsLmNvbVwiLFxuICAgIFwicGFzc3dvcmRcIjogXCJxd2VydHkxMjNcIlxuICB9XG5dXG4iLCIvLyBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Vbml0X1Rlc3RpbmcvMS4wXG4vL1xuLy8gVEhJUyBJUyBOT1QgVEVTVEVEIE5PUiBMSUtFTFkgVE8gV09SSyBPVVRTSURFIFY4IVxuLy9cbi8vIE9yaWdpbmFsbHkgZnJvbSBuYXJ3aGFsLmpzIChodHRwOi8vbmFyd2hhbGpzLm9yZylcbi8vIENvcHlyaWdodCAoYykgMjAwOSBUaG9tYXMgUm9iaW5zb24gPDI4MG5vcnRoLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG9cbi8vIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlXG4vLyByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Jcbi8vIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4vLyBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gd2hlbiB1c2VkIGluIG5vZGUsIHRoaXMgd2lsbCBhY3R1YWxseSBsb2FkIHRoZSB1dGlsIG1vZHVsZSB3ZSBkZXBlbmQgb25cbi8vIHZlcnN1cyBsb2FkaW5nIHRoZSBidWlsdGluIHV0aWwgbW9kdWxlIGFzIGhhcHBlbnMgb3RoZXJ3aXNlXG4vLyB0aGlzIGlzIGEgYnVnIGluIG5vZGUgbW9kdWxlIGxvYWRpbmcgYXMgZmFyIGFzIEkgYW0gY29uY2VybmVkXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwvJyk7XG5cbnZhciBwU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLy8gMS4gVGhlIGFzc2VydCBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25zIHRoYXQgdGhyb3dcbi8vIEFzc2VydGlvbkVycm9yJ3Mgd2hlbiBwYXJ0aWN1bGFyIGNvbmRpdGlvbnMgYXJlIG5vdCBtZXQuIFRoZVxuLy8gYXNzZXJ0IG1vZHVsZSBtdXN0IGNvbmZvcm0gdG8gdGhlIGZvbGxvd2luZyBpbnRlcmZhY2UuXG5cbnZhciBhc3NlcnQgPSBtb2R1bGUuZXhwb3J0cyA9IG9rO1xuXG4vLyAyLiBUaGUgQXNzZXJ0aW9uRXJyb3IgaXMgZGVmaW5lZCBpbiBhc3NlcnQuXG4vLyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHsgbWVzc2FnZTogbWVzc2FnZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWw6IGFjdHVhbCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWQgfSlcblxuYXNzZXJ0LkFzc2VydGlvbkVycm9yID0gZnVuY3Rpb24gQXNzZXJ0aW9uRXJyb3Iob3B0aW9ucykge1xuICB0aGlzLm5hbWUgPSAnQXNzZXJ0aW9uRXJyb3InO1xuICB0aGlzLmFjdHVhbCA9IG9wdGlvbnMuYWN0dWFsO1xuICB0aGlzLmV4cGVjdGVkID0gb3B0aW9ucy5leHBlY3RlZDtcbiAgdGhpcy5vcGVyYXRvciA9IG9wdGlvbnMub3BlcmF0b3I7XG4gIGlmIChvcHRpb25zLm1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tZXNzYWdlID0gZ2V0TWVzc2FnZSh0aGlzKTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSB0cnVlO1xuICB9XG4gIHZhciBzdGFja1N0YXJ0RnVuY3Rpb24gPSBvcHRpb25zLnN0YWNrU3RhcnRGdW5jdGlvbiB8fCBmYWlsO1xuXG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gbm9uIHY4IGJyb3dzZXJzIHNvIHdlIGNhbiBoYXZlIGEgc3RhY2t0cmFjZVxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcbiAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICB2YXIgb3V0ID0gZXJyLnN0YWNrO1xuXG4gICAgICAvLyB0cnkgdG8gc3RyaXAgdXNlbGVzcyBmcmFtZXNcbiAgICAgIHZhciBmbl9uYW1lID0gc3RhY2tTdGFydEZ1bmN0aW9uLm5hbWU7XG4gICAgICB2YXIgaWR4ID0gb3V0LmluZGV4T2YoJ1xcbicgKyBmbl9uYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAvLyBvbmNlIHdlIGhhdmUgbG9jYXRlZCB0aGUgZnVuY3Rpb24gZnJhbWVcbiAgICAgICAgLy8gd2UgbmVlZCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBiZWZvcmUgaXQgKGFuZCBpdHMgbGluZSlcbiAgICAgICAgdmFyIG5leHRfbGluZSA9IG91dC5pbmRleE9mKCdcXG4nLCBpZHggKyAxKTtcbiAgICAgICAgb3V0ID0gb3V0LnN1YnN0cmluZyhuZXh0X2xpbmUgKyAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFjayA9IG91dDtcbiAgICB9XG4gIH1cbn07XG5cbi8vIGFzc2VydC5Bc3NlcnRpb25FcnJvciBpbnN0YW5jZW9mIEVycm9yXG51dGlsLmluaGVyaXRzKGFzc2VydC5Bc3NlcnRpb25FcnJvciwgRXJyb3IpO1xuXG5mdW5jdGlvbiByZXBsYWNlcihrZXksIHZhbHVlKSB7XG4gIGlmICh1dGlsLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgIHJldHVybiAnJyArIHZhbHVlO1xuICB9XG4gIGlmICh1dGlsLmlzTnVtYmVyKHZhbHVlKSAmJiAoaXNOYU4odmFsdWUpIHx8ICFpc0Zpbml0ZSh2YWx1ZSkpKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbiAgaWYgKHV0aWwuaXNGdW5jdGlvbih2YWx1ZSkgfHwgdXRpbC5pc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlKHMsIG4pIHtcbiAgaWYgKHV0aWwuaXNTdHJpbmcocykpIHtcbiAgICByZXR1cm4gcy5sZW5ndGggPCBuID8gcyA6IHMuc2xpY2UoMCwgbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHM7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TWVzc2FnZShzZWxmKSB7XG4gIHJldHVybiB0cnVuY2F0ZShKU09OLnN0cmluZ2lmeShzZWxmLmFjdHVhbCwgcmVwbGFjZXIpLCAxMjgpICsgJyAnICtcbiAgICAgICAgIHNlbGYub3BlcmF0b3IgKyAnICcgK1xuICAgICAgICAgdHJ1bmNhdGUoSlNPTi5zdHJpbmdpZnkoc2VsZi5leHBlY3RlZCwgcmVwbGFjZXIpLCAxMjgpO1xufVxuXG4vLyBBdCBwcmVzZW50IG9ubHkgdGhlIHRocmVlIGtleXMgbWVudGlvbmVkIGFib3ZlIGFyZSB1c2VkIGFuZFxuLy8gdW5kZXJzdG9vZCBieSB0aGUgc3BlYy4gSW1wbGVtZW50YXRpb25zIG9yIHN1YiBtb2R1bGVzIGNhbiBwYXNzXG4vLyBvdGhlciBrZXlzIHRvIHRoZSBBc3NlcnRpb25FcnJvcidzIGNvbnN0cnVjdG9yIC0gdGhleSB3aWxsIGJlXG4vLyBpZ25vcmVkLlxuXG4vLyAzLiBBbGwgb2YgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgbXVzdCB0aHJvdyBhbiBBc3NlcnRpb25FcnJvclxuLy8gd2hlbiBhIGNvcnJlc3BvbmRpbmcgY29uZGl0aW9uIGlzIG5vdCBtZXQsIHdpdGggYSBtZXNzYWdlIHRoYXRcbi8vIG1heSBiZSB1bmRlZmluZWQgaWYgbm90IHByb3ZpZGVkLiAgQWxsIGFzc2VydGlvbiBtZXRob2RzIHByb3ZpZGVcbi8vIGJvdGggdGhlIGFjdHVhbCBhbmQgZXhwZWN0ZWQgdmFsdWVzIHRvIHRoZSBhc3NlcnRpb24gZXJyb3IgZm9yXG4vLyBkaXNwbGF5IHB1cnBvc2VzLlxuXG5mdW5jdGlvbiBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsIG9wZXJhdG9yLCBzdGFja1N0YXJ0RnVuY3Rpb24pIHtcbiAgdGhyb3cgbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBhY3R1YWw6IGFjdHVhbCxcbiAgICBleHBlY3RlZDogZXhwZWN0ZWQsXG4gICAgb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgIHN0YWNrU3RhcnRGdW5jdGlvbjogc3RhY2tTdGFydEZ1bmN0aW9uXG4gIH0pO1xufVxuXG4vLyBFWFRFTlNJT04hIGFsbG93cyBmb3Igd2VsbCBiZWhhdmVkIGVycm9ycyBkZWZpbmVkIGVsc2V3aGVyZS5cbmFzc2VydC5mYWlsID0gZmFpbDtcblxuLy8gNC4gUHVyZSBhc3NlcnRpb24gdGVzdHMgd2hldGhlciBhIHZhbHVlIGlzIHRydXRoeSwgYXMgZGV0ZXJtaW5lZFxuLy8gYnkgISFndWFyZC5cbi8vIGFzc2VydC5vayhndWFyZCwgbWVzc2FnZV9vcHQpO1xuLy8gVGhpcyBzdGF0ZW1lbnQgaXMgZXF1aXZhbGVudCB0byBhc3NlcnQuZXF1YWwodHJ1ZSwgISFndWFyZCxcbi8vIG1lc3NhZ2Vfb3B0KTsuIFRvIHRlc3Qgc3RyaWN0bHkgZm9yIHRoZSB2YWx1ZSB0cnVlLCB1c2Vcbi8vIGFzc2VydC5zdHJpY3RFcXVhbCh0cnVlLCBndWFyZCwgbWVzc2FnZV9vcHQpOy5cblxuZnVuY3Rpb24gb2sodmFsdWUsIG1lc3NhZ2UpIHtcbiAgaWYgKCF2YWx1ZSkgZmFpbCh2YWx1ZSwgdHJ1ZSwgbWVzc2FnZSwgJz09JywgYXNzZXJ0Lm9rKTtcbn1cbmFzc2VydC5vayA9IG9rO1xuXG4vLyA1LiBUaGUgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHNoYWxsb3csIGNvZXJjaXZlIGVxdWFsaXR5IHdpdGhcbi8vID09LlxuLy8gYXNzZXJ0LmVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmVxdWFsID0gZnVuY3Rpb24gZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9IGV4cGVjdGVkKSBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5lcXVhbCk7XG59O1xuXG4vLyA2LiBUaGUgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igd2hldGhlciB0d28gb2JqZWN0cyBhcmUgbm90IGVxdWFsXG4vLyB3aXRoICE9IGFzc2VydC5ub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RFcXVhbCA9IGZ1bmN0aW9uIG5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9JywgYXNzZXJ0Lm5vdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gNy4gVGhlIGVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBhIGRlZXAgZXF1YWxpdHkgcmVsYXRpb24uXG4vLyBhc3NlcnQuZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmRlZXBFcXVhbCA9IGZ1bmN0aW9uIGRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ2RlZXBFcXVhbCcsIGFzc2VydC5kZWVwRXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgLy8gNy4xLiBBbGwgaWRlbnRpY2FsIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmICh1dGlsLmlzQnVmZmVyKGFjdHVhbCkgJiYgdXRpbC5pc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICBpZiAoYWN0dWFsLmxlbmd0aCAhPSBleHBlY3RlZC5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0dWFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWN0dWFsW2ldICE9PSBleHBlY3RlZFtpXSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG4gIC8vIDcuMi4gSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgRGF0ZSBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgRGF0ZSBvYmplY3QgdGhhdCByZWZlcnMgdG8gdGhlIHNhbWUgdGltZS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzRGF0ZShhY3R1YWwpICYmIHV0aWwuaXNEYXRlKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuZ2V0VGltZSgpID09PSBleHBlY3RlZC5nZXRUaW1lKCk7XG5cbiAgLy8gNy4zIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIFJlZ0V4cCBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgUmVnRXhwIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNvdXJjZSBhbmRcbiAgLy8gcHJvcGVydGllcyAoYGdsb2JhbGAsIGBtdWx0aWxpbmVgLCBgbGFzdEluZGV4YCwgYGlnbm9yZUNhc2VgKS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzUmVnRXhwKGFjdHVhbCkgJiYgdXRpbC5pc1JlZ0V4cChleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLnNvdXJjZSA9PT0gZXhwZWN0ZWQuc291cmNlICYmXG4gICAgICAgICAgIGFjdHVhbC5nbG9iYWwgPT09IGV4cGVjdGVkLmdsb2JhbCAmJlxuICAgICAgICAgICBhY3R1YWwubXVsdGlsaW5lID09PSBleHBlY3RlZC5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgYWN0dWFsLmxhc3RJbmRleCA9PT0gZXhwZWN0ZWQubGFzdEluZGV4ICYmXG4gICAgICAgICAgIGFjdHVhbC5pZ25vcmVDYXNlID09PSBleHBlY3RlZC5pZ25vcmVDYXNlO1xuXG4gIC8vIDcuNC4gT3RoZXIgcGFpcnMgdGhhdCBkbyBub3QgYm90aCBwYXNzIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyxcbiAgLy8gZXF1aXZhbGVuY2UgaXMgZGV0ZXJtaW5lZCBieSA9PS5cbiAgfSBlbHNlIGlmICghdXRpbC5pc09iamVjdChhY3R1YWwpICYmICF1dGlsLmlzT2JqZWN0KGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgLy8gNy41IEZvciBhbGwgb3RoZXIgT2JqZWN0IHBhaXJzLCBpbmNsdWRpbmcgQXJyYXkgb2JqZWN0cywgZXF1aXZhbGVuY2UgaXNcbiAgLy8gZGV0ZXJtaW5lZCBieSBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGFzIHZlcmlmaWVkXG4gIC8vIHdpdGggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKSwgdGhlIHNhbWUgc2V0IG9mIGtleXNcbiAgLy8gKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksIGVxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeVxuICAvLyBjb3JyZXNwb25kaW5nIGtleSwgYW5kIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS4gTm90ZTogdGhpc1xuICAvLyBhY2NvdW50cyBmb3IgYm90aCBuYW1lZCBhbmQgaW5kZXhlZCBwcm9wZXJ0aWVzIG9uIEFycmF5cy5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuZnVuY3Rpb24gb2JqRXF1aXYoYSwgYikge1xuICBpZiAodXRpbC5pc051bGxPclVuZGVmaW5lZChhKSB8fCB1dGlsLmlzTnVsbE9yVW5kZWZpbmVkKGIpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LlxuICBpZiAoYS5wcm90b3R5cGUgIT09IGIucHJvdG90eXBlKSByZXR1cm4gZmFsc2U7XG4gIC8vfn5+SSd2ZSBtYW5hZ2VkIHRvIGJyZWFrIE9iamVjdC5rZXlzIHRocm91Z2ggc2NyZXd5IGFyZ3VtZW50cyBwYXNzaW5nLlxuICAvLyAgIENvbnZlcnRpbmcgdG8gYXJyYXkgc29sdmVzIHRoZSBwcm9ibGVtLlxuICBpZiAoaXNBcmd1bWVudHMoYSkpIHtcbiAgICBpZiAoIWlzQXJndW1lbnRzKGIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgcmV0dXJuIF9kZWVwRXF1YWwoYSwgYik7XG4gIH1cbiAgdHJ5IHtcbiAgICB2YXIga2EgPSBvYmplY3RLZXlzKGEpLFxuICAgICAgICBrYiA9IG9iamVjdEtleXMoYiksXG4gICAgICAgIGtleSwgaTtcbiAgfSBjYXRjaCAoZSkgey8vaGFwcGVucyB3aGVuIG9uZSBpcyBhIHN0cmluZyBsaXRlcmFsIGFuZCB0aGUgb3RoZXIgaXNuJ3RcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlc1xuICAvLyBoYXNPd25Qcm9wZXJ0eSlcbiAgaWYgKGthLmxlbmd0aCAhPSBrYi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvL3RoZSBzYW1lIHNldCBvZiBrZXlzIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLFxuICBrYS5zb3J0KCk7XG4gIGtiLnNvcnQoKTtcbiAgLy9+fn5jaGVhcCBrZXkgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChrYVtpXSAhPSBrYltpXSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvL2VxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeSBjb3JyZXNwb25kaW5nIGtleSwgYW5kXG4gIC8vfn5+cG9zc2libHkgZXhwZW5zaXZlIGRlZXAgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGtleSA9IGthW2ldO1xuICAgIGlmICghX2RlZXBFcXVhbChhW2tleV0sIGJba2V5XSkpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gOC4gVGhlIG5vbi1lcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgZm9yIGFueSBkZWVwIGluZXF1YWxpdHkuXG4vLyBhc3NlcnQubm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdERlZXBFcXVhbCA9IGZ1bmN0aW9uIG5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcEVxdWFsJywgYXNzZXJ0Lm5vdERlZXBFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDkuIFRoZSBzdHJpY3QgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHN0cmljdCBlcXVhbGl0eSwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuc3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBzdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT09JywgYXNzZXJ0LnN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gMTAuIFRoZSBzdHJpY3Qgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igc3RyaWN0IGluZXF1YWxpdHksIGFzXG4vLyBkZXRlcm1pbmVkIGJ5ICE9PS4gIGFzc2VydC5ub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIG5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPT0nLCBhc3NlcnQubm90U3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIGlmICghYWN0dWFsIHx8ICFleHBlY3RlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZXhwZWN0ZWQpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgcmV0dXJuIGV4cGVjdGVkLnRlc3QoYWN0dWFsKTtcbiAgfSBlbHNlIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGV4cGVjdGVkLmNhbGwoe30sIGFjdHVhbCkgPT09IHRydWUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdywgYmxvY2ssIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIHZhciBhY3R1YWw7XG5cbiAgaWYgKHV0aWwuaXNTdHJpbmcoZXhwZWN0ZWQpKSB7XG4gICAgbWVzc2FnZSA9IGV4cGVjdGVkO1xuICAgIGV4cGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgYmxvY2soKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGFjdHVhbCA9IGU7XG4gIH1cblxuICBtZXNzYWdlID0gKGV4cGVjdGVkICYmIGV4cGVjdGVkLm5hbWUgPyAnICgnICsgZXhwZWN0ZWQubmFtZSArICcpLicgOiAnLicpICtcbiAgICAgICAgICAgIChtZXNzYWdlID8gJyAnICsgbWVzc2FnZSA6ICcuJyk7XG5cbiAgaWYgKHNob3VsZFRocm93ICYmICFhY3R1YWwpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdNaXNzaW5nIGV4cGVjdGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICghc2hvdWxkVGhyb3cgJiYgZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdHb3QgdW53YW50ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKChzaG91bGRUaHJvdyAmJiBhY3R1YWwgJiYgZXhwZWN0ZWQgJiZcbiAgICAgICFleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHwgKCFzaG91bGRUaHJvdyAmJiBhY3R1YWwpKSB7XG4gICAgdGhyb3cgYWN0dWFsO1xuICB9XG59XG5cbi8vIDExLiBFeHBlY3RlZCB0byB0aHJvdyBhbiBlcnJvcjpcbi8vIGFzc2VydC50aHJvd3MoYmxvY2ssIEVycm9yX29wdCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQudGhyb3dzID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MuYXBwbHkodGhpcywgW3RydWVdLmNvbmNhdChwU2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG59O1xuXG4vLyBFWFRFTlNJT04hIFRoaXMgaXMgYW5ub3lpbmcgdG8gd3JpdGUgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbmFzc2VydC5kb2VzTm90VGhyb3cgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzLmFwcGx5KHRoaXMsIFtmYWxzZV0uY29uY2F0KHBTbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbn07XG5cbmFzc2VydC5pZkVycm9yID0gZnVuY3Rpb24oZXJyKSB7IGlmIChlcnIpIHt0aHJvdyBlcnI7fX07XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093bi5jYWxsKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59O1xuIiwiOyhmdW5jdGlvbihyb290KSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGNyb3NzIHN0b3JhZ2UgY2xpZW50IGdpdmVuIHRoZSB1cmwgdG8gYSBodWIuIEJ5IGRlZmF1bHQsXG4gICAqIGFuIGlmcmFtZSBpcyBjcmVhdGVkIHdpdGhpbiB0aGUgZG9jdW1lbnQgYm9keSB0aGF0IHBvaW50cyB0byB0aGUgdXJsLiBJdFxuICAgKiBhbHNvIGFjY2VwdHMgYW4gb3B0aW9ucyBvYmplY3QsIHdoaWNoIG1heSBpbmNsdWRlIGEgdGltZW91dCwgZnJhbWVJZCwgYW5kXG4gICAqIHByb21pc2UuIFRoZSB0aW1lb3V0LCBpbiBtaWxsaXNlY29uZHMsIGlzIGFwcGxpZWQgdG8gZWFjaCByZXF1ZXN0IGFuZFxuICAgKiBkZWZhdWx0cyB0byA1MDAwbXMuIFRoZSBvcHRpb25zIG9iamVjdCBtYXkgYWxzbyBpbmNsdWRlIGEgZnJhbWVJZCxcbiAgICogaWRlbnRpZnlpbmcgYW4gZXhpc3RpbmcgZnJhbWUgb24gd2hpY2ggdG8gaW5zdGFsbCBpdHMgbGlzdGVuZXJzLiBJZiB0aGVcbiAgICogcHJvbWlzZSBrZXkgaXMgc3VwcGxpZWQgdGhlIGNvbnN0cnVjdG9yIGZvciBhIFByb21pc2UsIHRoYXQgUHJvbWlzZSBsaWJyYXJ5XG4gICAqIHdpbGwgYmUgdXNlZCBpbnN0ZWFkIG9mIHRoZSBkZWZhdWx0IHdpbmRvdy5Qcm9taXNlLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgc3RvcmFnZSA9IG5ldyBDcm9zc1N0b3JhZ2VDbGllbnQoJ2h0dHBzOi8vc3RvcmUuZXhhbXBsZS5jb20vaHViLmh0bWwnKTtcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogdmFyIHN0b3JhZ2UgPSBuZXcgQ3Jvc3NTdG9yYWdlQ2xpZW50KCdodHRwczovL3N0b3JlLmV4YW1wbGUuY29tL2h1Yi5odG1sJywge1xuICAgKiAgIHRpbWVvdXQ6IDUwMDAsXG4gICAqICAgZnJhbWVJZDogJ3N0b3JhZ2VGcmFtZSdcbiAgICogfSk7XG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsICAgIFRoZSB1cmwgdG8gYSBjcm9zcyBzdG9yYWdlIGh1YlxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdHNdIEFuIG9wdGlvbmFsIG9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgb3B0aW9ucyxcbiAgICogICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRpbmcgdGltZW91dCwgZnJhbWVJZCwgYW5kIHByb21pc2VcbiAgICpcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9ICAgX2lkICAgICAgICBBIFVVSUQgdjQgaWRcbiAgICogQHByb3BlcnR5IHtmdW5jdGlvbn0gX3Byb21pc2UgICBUaGUgUHJvbWlzZSBvYmplY3QgdG8gdXNlXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgIF9mcmFtZUlkICAgVGhlIGlkIG9mIHRoZSBpRnJhbWUgcG9pbnRpbmcgdG8gdGhlIGh1YiB1cmxcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9ICAgX29yaWdpbiAgICBUaGUgaHViJ3Mgb3JpZ2luXG4gICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSAgIF9yZXF1ZXN0cyAgTWFwcGluZyBvZiByZXF1ZXN0IGlkcyB0byBjYWxsYmFja3NcbiAgICogQHByb3BlcnR5IHtib29sfSAgICAgX2Nvbm5lY3RlZCBXaGV0aGVyIG9yIG5vdCBpdCBoYXMgY29ubmVjdGVkXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbH0gICAgIF9jbG9zZWQgICAgV2hldGhlciBvciBub3QgdGhlIGNsaWVudCBoYXMgY2xvc2VkXG4gICAqIEBwcm9wZXJ0eSB7aW50fSAgICAgIF9jb3VudCAgICAgTnVtYmVyIG9mIHJlcXVlc3RzIHNlbnRcbiAgICogQHByb3BlcnR5IHtmdW5jdGlvbn0gX2xpc3RlbmVyICBUaGUgbGlzdGVuZXIgYWRkZWQgdG8gdGhlIHdpbmRvd1xuICAgKiBAcHJvcGVydHkge1dpbmRvd30gICBfaHViICAgICAgIFRoZSBodWIgd2luZG93XG4gICAqL1xuICBmdW5jdGlvbiBDcm9zc1N0b3JhZ2VDbGllbnQodXJsLCBvcHRzKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgICB0aGlzLl9pZCAgICAgICAgPSBDcm9zc1N0b3JhZ2VDbGllbnQuX2dlbmVyYXRlVVVJRCgpO1xuICAgIHRoaXMuX3Byb21pc2UgICA9IG9wdHMucHJvbWlzZSB8fCBQcm9taXNlO1xuICAgIHRoaXMuX2ZyYW1lSWQgICA9IG9wdHMuZnJhbWVJZCB8fCAnQ3Jvc3NTdG9yYWdlQ2xpZW50LScgKyB0aGlzLl9pZDtcbiAgICB0aGlzLl9vcmlnaW4gICAgPSBDcm9zc1N0b3JhZ2VDbGllbnQuX2dldE9yaWdpbih1cmwpO1xuICAgIHRoaXMuX3JlcXVlc3RzICA9IHt9O1xuICAgIHRoaXMuX2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2Nsb3NlZCAgICA9IGZhbHNlO1xuICAgIHRoaXMuX2NvdW50ICAgICA9IDA7XG4gICAgdGhpcy5fdGltZW91dCAgID0gb3B0cy50aW1lb3V0IHx8IDUwMDA7XG4gICAgdGhpcy5fbGlzdGVuZXIgID0gbnVsbDtcblxuICAgIHRoaXMuX2luc3RhbGxMaXN0ZW5lcigpO1xuXG4gICAgdmFyIGZyYW1lO1xuICAgIGlmIChvcHRzLmZyYW1lSWQpIHtcbiAgICAgIGZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3B0cy5mcmFtZUlkKTtcbiAgICB9XG5cbiAgICAvLyBJZiB1c2luZyBhIHBhc3NlZCBpZnJhbWUsIHBvbGwgdGhlIGh1YiBmb3IgYSByZWFkeSBtZXNzYWdlXG4gICAgaWYgKGZyYW1lKSB7XG4gICAgICB0aGlzLl9wb2xsKCk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIHRoZSBmcmFtZSBpZiBub3QgZm91bmQgb3Igc3BlY2lmaWVkXG4gICAgZnJhbWUgPSBmcmFtZSB8fCB0aGlzLl9jcmVhdGVGcmFtZSh1cmwpO1xuICAgIHRoaXMuX2h1YiA9IGZyYW1lLmNvbnRlbnRXaW5kb3c7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHN0eWxlcyB0byBiZSBhcHBsaWVkIHRvIHRoZSBnZW5lcmF0ZWQgaUZyYW1lLiBEZWZpbmVzIGEgc2V0IG9mIHByb3BlcnRpZXNcbiAgICogdGhhdCBoaWRlIHRoZSBlbGVtZW50IGJ5IHBvc2l0aW9uaW5nIGl0IG91dHNpZGUgb2YgdGhlIHZpc2libGUgYXJlYSwgYW5kXG4gICAqIGJ5IG1vZGlmeWluZyBpdHMgZGlzcGxheS5cbiAgICpcbiAgICogQG1lbWJlciB7T2JqZWN0fVxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LmZyYW1lU3R5bGUgPSB7XG4gICAgZGlzcGxheTogICdub25lJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6ICAgICAgJy05OTlweCcsXG4gICAgbGVmdDogICAgICctOTk5cHgnXG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9yaWdpbiBvZiBhbiB1cmwsIHdpdGggY3Jvc3MgYnJvd3NlciBzdXBwb3J0LiBBY2NvbW1vZGF0ZXNcbiAgICogdGhlIGxhY2sgb2YgbG9jYXRpb24ub3JpZ2luIGluIElFLCBhcyB3ZWxsIGFzIHRoZSBkaXNjcmVwYW5jaWVzIGluIHRoZVxuICAgKiBpbmNsdXNpb24gb2YgdGhlIHBvcnQgd2hlbiB1c2luZyB0aGUgZGVmYXVsdCBwb3J0IGZvciBhIHByb3RvY29sLCBlLmcuXG4gICAqIDQ0MyBvdmVyIGh0dHBzLiBEZWZhdWx0cyB0byB0aGUgb3JpZ2luIG9mIHdpbmRvdy5sb2NhdGlvbiBpZiBwYXNzZWQgYVxuICAgKiByZWxhdGl2ZSBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0gICB7c3RyaW5nfSB1cmwgVGhlIHVybCB0byBhIGNyb3NzIHN0b3JhZ2UgaHViXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBvcmlnaW4gb2YgdGhlIHVybFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50Ll9nZXRPcmlnaW4gPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgdXJpLCBwcm90b2NvbCwgb3JpZ2luO1xuXG4gICAgdXJpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIHVyaS5ocmVmID0gdXJsO1xuXG4gICAgaWYgKCF1cmkuaG9zdCkge1xuICAgICAgdXJpID0gd2luZG93LmxvY2F0aW9uO1xuICAgIH1cblxuICAgIGlmICghdXJpLnByb3RvY29sIHx8IHVyaS5wcm90b2NvbCA9PT0gJzonKSB7XG4gICAgICBwcm90b2NvbCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvdG9jb2wgPSB1cmkucHJvdG9jb2w7XG4gICAgfVxuXG4gICAgb3JpZ2luID0gcHJvdG9jb2wgKyAnLy8nICsgdXJpLmhvc3Q7XG4gICAgb3JpZ2luID0gb3JpZ2luLnJlcGxhY2UoLzo4MCR8OjQ0MyQvLCAnJyk7XG5cbiAgICByZXR1cm4gb3JpZ2luO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVVUlEIHY0IGdlbmVyYXRpb24sIHRha2VuIGZyb206IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvXG4gICAqIDEwNTAzNC9ob3ctdG8tY3JlYXRlLWEtZ3VpZC11dWlkLWluLWphdmFzY3JpcHQvMjExNzUyMyMyMTE3NTIzXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IEEgVVVJRCB2NCBzdHJpbmdcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5fZ2VuZXJhdGVVVUlEID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xuICAgICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpICogMTZ8MCwgdiA9IGMgPT0gJ3gnID8gciA6IChyJjB4M3wweDgpO1xuXG4gICAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYSBjb25uZWN0aW9uIGhhcyBiZWVuIGVzdGFibGlzaGVkXG4gICAqIHdpdGggdGhlIGNyb3NzIHN0b3JhZ2UgaHViLiBJdHMgdXNlIGlzIHJlcXVpcmVkIHRvIGF2b2lkIHNlbmRpbmcgYW55XG4gICAqIHJlcXVlc3RzIHByaW9yIHRvIGluaXRpYWxpemF0aW9uIGJlaW5nIGNvbXBsZXRlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgb24gY29ubmVjdFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5vbkNvbm5lY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2xpZW50ID0gdGhpcztcblxuICAgIGlmICh0aGlzLl9jb25uZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wcm9taXNlLnJlc29sdmUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2Nsb3NlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Byb21pc2UucmVqZWN0KG5ldyBFcnJvcignQ3Jvc3NTdG9yYWdlQ2xpZW50IGhhcyBjbG9zZWQnKSk7XG4gICAgfVxuXG4gICAgLy8gUXVldWUgY29ubmVjdCByZXF1ZXN0cyBmb3IgY2xpZW50IHJlLXVzZVxuICAgIGlmICghdGhpcy5fcmVxdWVzdHMuY29ubmVjdCkge1xuICAgICAgdGhpcy5fcmVxdWVzdHMuY29ubmVjdCA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgdGhpcy5fcHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignQ3Jvc3NTdG9yYWdlQ2xpZW50IGNvdWxkIG5vdCBjb25uZWN0JykpO1xuICAgICAgfSwgY2xpZW50Ll90aW1lb3V0KTtcblxuICAgICAgY2xpZW50Ll9yZXF1ZXN0cy5jb25uZWN0LnB1c2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpO1xuXG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXRzIGEga2V5IHRvIHRoZSBzcGVjaWZpZWQgdmFsdWUuIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIG9uXG4gICAqIHN1Y2Nlc3MsIG9yIHJlamVjdGVkIGlmIGFueSBlcnJvcnMgc2V0dGluZyB0aGUga2V5IG9jY3VycmVkLCBvciB0aGUgcmVxdWVzdFxuICAgKiB0aW1lZCBvdXQuXG4gICAqXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9ICBrZXkgICBUaGUga2V5IHRvIHNldFxuICAgKiBAcGFyYW0gICB7Kn0gICAgICAgdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnblxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCBvbiBodWIgcmVzcG9uc2Ugb3IgdGltZW91dFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3NldCcsIHtcbiAgICAgIGtleTogICBrZXksXG4gICAgICB2YWx1ZTogdmFsdWVcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQWNjZXB0cyBvbmUgb3IgbW9yZSBrZXlzIGZvciB3aGljaCB0byByZXRyaWV2ZSB0aGVpciB2YWx1ZXMuIFJldHVybnMgYVxuICAgKiBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCBvbiBodWIgcmVzcG9uc2Ugb3IgdGltZW91dC4gT24gc3VjY2VzcywgaXQgaXNcbiAgICogZnVsZmlsbGVkIHdpdGggdGhlIHZhbHVlIG9mIHRoZSBrZXkgaWYgb25seSBwYXNzZWQgYSBzaW5nbGUgYXJndW1lbnQuXG4gICAqIE90aGVyd2lzZSBpdCdzIHJlc29sdmVkIHdpdGggYW4gYXJyYXkgb2YgdmFsdWVzLiBPbiBmYWlsdXJlLCBpdCBpcyByZWplY3RlZFxuICAgKiB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIGVycm9yIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSAgIHsuLi5zdHJpbmd9IGtleSBUaGUga2V5IHRvIHJldHJpZXZlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSAgIEEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgb24gaHViIHJlc3BvbnNlIG9yIHRpbWVvdXRcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ2dldCcsIHtrZXlzOiBhcmdzfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFjY2VwdHMgb25lIG9yIG1vcmUga2V5cyBmb3IgZGVsZXRpb24uIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCBvblxuICAgKiBodWIgcmVzcG9uc2Ugb3IgdGltZW91dC5cbiAgICpcbiAgICogQHBhcmFtICAgey4uLnN0cmluZ30ga2V5IFRoZSBrZXkgdG8gZGVsZXRlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSAgIEEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgb24gaHViIHJlc3BvbnNlIG9yIHRpbWVvdXRcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuZGVsID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ2RlbCcsIHtrZXlzOiBhcmdzfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQsIHdoZW4gcmVzb2x2ZWQsIGluZGljYXRlcyB0aGF0IGFsbCBsb2NhbFN0b3JhZ2VcbiAgICogZGF0YSBoYXMgYmVlbiBjbGVhcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCBvbiBodWIgcmVzcG9uc2Ugb3IgdGltZW91dFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdjbGVhcicpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0LCB3aGVuIHJlc29sdmVkLCBwYXNzZXMgYW4gYXJyYXkgb2YgYWxsIGtleXNcbiAgICogY3VycmVudGx5IGluIHN0b3JhZ2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uIGh1YiByZXNwb25zZSBvciB0aW1lb3V0XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLmdldEtleXMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnZ2V0S2V5cycpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZWxldGVzIHRoZSBpZnJhbWUgYW5kIHNldHMgdGhlIGNvbm5lY3RlZCBzdGF0ZSB0byBmYWxzZS4gVGhlIGNsaWVudCBjYW5cbiAgICogbm8gbG9uZ2VyIGJlIHVzZWQgYWZ0ZXIgYmVpbmcgaW52b2tlZC5cbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLl9mcmFtZUlkKTtcbiAgICBpZiAoZnJhbWUpIHtcbiAgICAgIGZyYW1lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZnJhbWUpO1xuICAgIH1cblxuICAgIC8vIFN1cHBvcnQgSUU4IHdpdGggZGV0YWNoRXZlbnRcbiAgICBpZiAod2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5fbGlzdGVuZXIsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmRldGFjaEV2ZW50KCdvbm1lc3NhZ2UnLCB0aGlzLl9saXN0ZW5lcik7XG4gICAgfVxuXG4gICAgdGhpcy5fY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5fY2xvc2VkID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogSW5zdGFsbHMgdGhlIG5lY2Vzc2FyeSBsaXN0ZW5lciBmb3IgdGhlIHdpbmRvdyBtZXNzYWdlIGV2ZW50LiBXaGVuIGEgbWVzc2FnZVxuICAgKiBpcyByZWNlaXZlZCwgdGhlIGNsaWVudCdzIF9jb25uZWN0ZWQgc3RhdHVzIGlzIGNoYW5nZWQgdG8gdHJ1ZSwgYW5kIHRoZVxuICAgKiBvbkNvbm5lY3QgcHJvbWlzZSBpcyBmdWxmaWxsZWQuIEdpdmVuIGEgcmVzcG9uc2UgbWVzc2FnZSwgdGhlIGNhbGxiYWNrXG4gICAqIGNvcnJlc3BvbmRpbmcgdG8gaXRzIHJlcXVlc3QgaXMgaW52b2tlZC4gSWYgcmVzcG9uc2UuZXJyb3IgaG9sZHMgYSB0cnV0aHlcbiAgICogdmFsdWUsIHRoZSBwcm9taXNlIGFzc29jaWF0ZWQgd2l0aCB0aGUgb3JpZ2luYWwgcmVxdWVzdCBpcyByZWplY3RlZCB3aXRoXG4gICAqIHRoZSBlcnJvci4gT3RoZXJ3aXNlIHRoZSBwcm9taXNlIGlzIGZ1bGZpbGxlZCBhbmQgcGFzc2VkIHJlc3BvbnNlLnJlc3VsdC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuX2luc3RhbGxMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjbGllbnQgPSB0aGlzO1xuXG4gICAgdGhpcy5fbGlzdGVuZXIgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICB2YXIgaSwgb3JpZ2luLCBlcnJvciwgcmVzcG9uc2U7XG5cbiAgICAgIC8vIElnbm9yZSBpbnZhbGlkIG1lc3NhZ2VzIG9yIHRob3NlIGFmdGVyIHRoZSBjbGllbnQgaGFzIGNsb3NlZFxuICAgICAgaWYgKGNsaWVudC5fY2xvc2VkIHx8ICFtZXNzYWdlLmRhdGEgfHwgdHlwZW9mIG1lc3NhZ2UuZGF0YSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBwb3N0TWVzc2FnZSByZXR1cm5zIHRoZSBzdHJpbmcgXCJudWxsXCIgYXMgdGhlIG9yaWdpbiBmb3IgXCJmaWxlOi8vXCJcbiAgICAgIG9yaWdpbiA9IChtZXNzYWdlLm9yaWdpbiA9PT0gJ251bGwnKSA/ICdmaWxlOi8vJyA6IG1lc3NhZ2Uub3JpZ2luO1xuXG4gICAgICAvLyBJZ25vcmUgbWVzc2FnZXMgbm90IGZyb20gdGhlIGNvcnJlY3Qgb3JpZ2luXG4gICAgICBpZiAob3JpZ2luICE9PSBjbGllbnQuX29yaWdpbikgcmV0dXJuO1xuXG4gICAgICAvLyBMb2NhbFN0b3JhZ2UgaXNuJ3QgYXZhaWxhYmxlIGluIHRoZSBodWJcbiAgICAgIGlmIChtZXNzYWdlLmRhdGEgPT09ICdjcm9zcy1zdG9yYWdlOnVuYXZhaWxhYmxlJykge1xuICAgICAgICBpZiAoIWNsaWVudC5fY2xvc2VkKSBjbGllbnQuY2xvc2UoKTtcbiAgICAgICAgaWYgKCFjbGllbnQuX3JlcXVlc3RzLmNvbm5lY3QpIHJldHVybjtcblxuICAgICAgICBlcnJvciA9IG5ldyBFcnJvcignQ2xvc2luZyBjbGllbnQuIENvdWxkIG5vdCBhY2Nlc3MgbG9jYWxTdG9yYWdlIGluIGh1Yi4nKTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNsaWVudC5fcmVxdWVzdHMuY29ubmVjdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNsaWVudC5fcmVxdWVzdHMuY29ubmVjdFtpXShlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZSBpbml0aWFsIGNvbm5lY3Rpb25cbiAgICAgIGlmIChtZXNzYWdlLmRhdGEuaW5kZXhPZignY3Jvc3Mtc3RvcmFnZTonKSAhPT0gLTEgJiYgIWNsaWVudC5fY29ubmVjdGVkKSB7XG4gICAgICAgIGNsaWVudC5fY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKCFjbGllbnQuX3JlcXVlc3RzLmNvbm5lY3QpIHJldHVybjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2xpZW50Ll9yZXF1ZXN0cy5jb25uZWN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY2xpZW50Ll9yZXF1ZXN0cy5jb25uZWN0W2ldKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgY2xpZW50Ll9yZXF1ZXN0cy5jb25uZWN0O1xuICAgICAgfVxuXG4gICAgICBpZiAobWVzc2FnZS5kYXRhID09PSAnY3Jvc3Mtc3RvcmFnZTpyZWFkeScpIHJldHVybjtcblxuICAgICAgLy8gQWxsIG90aGVyIG1lc3NhZ2VzXG4gICAgICB0cnkge1xuICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVzcG9uc2UuaWQpIHJldHVybjtcblxuICAgICAgaWYgKGNsaWVudC5fcmVxdWVzdHNbcmVzcG9uc2UuaWRdKSB7XG4gICAgICAgIGNsaWVudC5fcmVxdWVzdHNbcmVzcG9uc2UuaWRdKHJlc3BvbnNlLmVycm9yLCByZXNwb25zZS5yZXN1bHQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBTdXBwb3J0IElFOCB3aXRoIGF0dGFjaEV2ZW50XG4gICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuX2xpc3RlbmVyLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5hdHRhY2hFdmVudCgnb25tZXNzYWdlJywgdGhpcy5fbGlzdGVuZXIpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSW52b2tlZCB3aGVuIGEgZnJhbWUgaWQgd2FzIHBhc3NlZCB0byB0aGUgY2xpZW50LCByYXRoZXIgdGhhbiBhbGxvd2luZ1xuICAgKiB0aGUgY2xpZW50IHRvIGNyZWF0ZSBpdHMgb3duIGlmcmFtZS4gUG9sbHMgdGhlIGh1YiBmb3IgYSByZWFkeSBldmVudCB0b1xuICAgKiBlc3RhYmxpc2ggYSBjb25uZWN0ZWQgc3RhdGUuXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLl9wb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNsaWVudCwgaW50ZXJ2YWwsIHRhcmdldE9yaWdpbjtcblxuICAgIGNsaWVudCA9IHRoaXM7XG5cbiAgICAvLyBwb3N0TWVzc2FnZSByZXF1aXJlcyB0aGF0IHRoZSB0YXJnZXQgb3JpZ2luIGJlIHNldCB0byBcIipcIiBmb3IgXCJmaWxlOi8vXCJcbiAgICB0YXJnZXRPcmlnaW4gPSAoY2xpZW50Ll9vcmlnaW4gPT09ICdmaWxlOi8vJykgPyAnKicgOiBjbGllbnQuX29yaWdpbjtcblxuICAgIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoY2xpZW50Ll9jb25uZWN0ZWQpIHJldHVybiBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgIGlmICghY2xpZW50Ll9odWIpIHJldHVybjtcblxuICAgICAgY2xpZW50Ll9odWIucG9zdE1lc3NhZ2UoJ2Nyb3NzLXN0b3JhZ2U6cG9sbCcsIHRhcmdldE9yaWdpbik7XG4gICAgfSwgMTAwMCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaUZyYW1lIGNvbnRhaW5pbmcgdGhlIGh1Yi4gQXBwbGllcyB0aGUgbmVjZXNzYXJ5IHN0eWxlcyB0b1xuICAgKiBoaWRlIHRoZSBlbGVtZW50IGZyb20gdmlldywgcHJpb3IgdG8gYWRkaW5nIGl0IHRvIHRoZSBkb2N1bWVudCBib2R5LlxuICAgKiBSZXR1cm5zIHRoZSBjcmVhdGVkIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICB1cmwgVGhlIHVybCB0byB0aGUgaHViXG4gICAqIHJldHVybnMge0hUTUxJRnJhbWVFbGVtZW50fSBUaGUgaUZyYW1lIGVsZW1lbnQgaXRzZWxmXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLl9jcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBmcmFtZSwga2V5O1xuXG4gICAgZnJhbWUgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gICAgZnJhbWUuaWQgPSB0aGlzLl9mcmFtZUlkO1xuXG4gICAgLy8gU3R5bGUgdGhlIGlmcmFtZVxuICAgIGZvciAoa2V5IGluIENyb3NzU3RvcmFnZUNsaWVudC5mcmFtZVN0eWxlKSB7XG4gICAgICBpZiAoQ3Jvc3NTdG9yYWdlQ2xpZW50LmZyYW1lU3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBmcmFtZS5zdHlsZVtrZXldID0gQ3Jvc3NTdG9yYWdlQ2xpZW50LmZyYW1lU3R5bGVba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmcmFtZSk7XG4gICAgZnJhbWUuc3JjID0gdXJsO1xuXG4gICAgcmV0dXJuIGZyYW1lO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgY29udGFpbmluZyB0aGUgZ2l2ZW4gbWV0aG9kIGFuZCBwYXJhbXMgdG8gdGhlIGh1Yi4gU3RvcmVzXG4gICAqIGEgY2FsbGJhY2sgaW4gdGhlIF9yZXF1ZXN0cyBvYmplY3QgZm9yIGxhdGVyIGludm9jYXRpb24gb24gbWVzc2FnZSwgb3JcbiAgICogZGVsZXRpb24gb24gdGltZW91dC4gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIGluIGVpdGhlciBpbnN0YW5jZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtICAge3N0cmluZ30gIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGludm9rZVxuICAgKiBAcGFyYW0gICB7Kn0gICAgICAgcGFyYW1zIFRoZSBhcmd1bWVudHMgdG8gcGFzc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCBvbiBodWIgcmVzcG9uc2Ugb3IgdGltZW91dFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5fcmVxdWVzdCA9IGZ1bmN0aW9uKG1ldGhvZCwgcGFyYW1zKSB7XG4gICAgdmFyIHJlcSwgY2xpZW50O1xuXG4gICAgaWYgKHRoaXMuX2Nsb3NlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Byb21pc2UucmVqZWN0KG5ldyBFcnJvcignQ3Jvc3NTdG9yYWdlQ2xpZW50IGhhcyBjbG9zZWQnKSk7XG4gICAgfVxuXG4gICAgY2xpZW50ID0gdGhpcztcbiAgICBjbGllbnQuX2NvdW50Kys7XG5cbiAgICByZXEgPSB7XG4gICAgICBpZDogICAgIHRoaXMuX2lkICsgJzonICsgY2xpZW50Ll9jb3VudCxcbiAgICAgIG1ldGhvZDogJ2Nyb3NzLXN0b3JhZ2U6JyArIG1ldGhvZCxcbiAgICAgIHBhcmFtczogcGFyYW1zXG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgdGhpcy5fcHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciB0aW1lb3V0LCBvcmlnaW5hbFRvSlNPTiwgdGFyZ2V0T3JpZ2luO1xuXG4gICAgICAvLyBUaW1lb3V0IGlmIGEgcmVzcG9uc2UgaXNuJ3QgcmVjZWl2ZWQgYWZ0ZXIgNHNcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIWNsaWVudC5fcmVxdWVzdHNbcmVxLmlkXSkgcmV0dXJuO1xuXG4gICAgICAgIGRlbGV0ZSBjbGllbnQuX3JlcXVlc3RzW3JlcS5pZF07XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ1RpbWVvdXQ6IGNvdWxkIG5vdCBwZXJmb3JtICcgKyByZXEubWV0aG9kKSk7XG4gICAgICB9LCBjbGllbnQuX3RpbWVvdXQpO1xuXG4gICAgICAvLyBBZGQgcmVxdWVzdCBjYWxsYmFja1xuICAgICAgY2xpZW50Ll9yZXF1ZXN0c1tyZXEuaWRdID0gZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICBkZWxldGUgY2xpZW50Ll9yZXF1ZXN0c1tyZXEuaWRdO1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihlcnIpKTtcbiAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgfTtcblxuICAgICAgLy8gSW4gY2FzZSB3ZSBoYXZlIGEgYnJva2VuIEFycmF5LnByb3RvdHlwZS50b0pTT04sIGUuZy4gYmVjYXVzZSBvZlxuICAgICAgLy8gb2xkIHZlcnNpb25zIG9mIHByb3RvdHlwZVxuICAgICAgaWYgKEFycmF5LnByb3RvdHlwZS50b0pTT04pIHtcbiAgICAgICAgb3JpZ2luYWxUb0pTT04gPSBBcnJheS5wcm90b3R5cGUudG9KU09OO1xuICAgICAgICBBcnJheS5wcm90b3R5cGUudG9KU09OID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gcG9zdE1lc3NhZ2UgcmVxdWlyZXMgdGhhdCB0aGUgdGFyZ2V0IG9yaWdpbiBiZSBzZXQgdG8gXCIqXCIgZm9yIFwiZmlsZTovL1wiXG4gICAgICB0YXJnZXRPcmlnaW4gPSAoY2xpZW50Ll9vcmlnaW4gPT09ICdmaWxlOi8vJykgPyAnKicgOiBjbGllbnQuX29yaWdpbjtcblxuICAgICAgLy8gU2VuZCBzZXJpYWxpemVkIG1lc3NhZ2VcbiAgICAgIGNsaWVudC5faHViLnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHJlcSksIHRhcmdldE9yaWdpbik7XG5cbiAgICAgIC8vIFJlc3RvcmUgb3JpZ2luYWwgdG9KU09OXG4gICAgICBpZiAob3JpZ2luYWxUb0pTT04pIHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnRvSlNPTiA9IG9yaWdpbmFsVG9KU09OO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBFeHBvcnQgZm9yIHZhcmlvdXMgZW52aXJvbm1lbnRzLlxuICAgKi9cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDcm9zc1N0b3JhZ2VDbGllbnQ7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZXhwb3J0cy5Dcm9zc1N0b3JhZ2VDbGllbnQgPSBDcm9zc1N0b3JhZ2VDbGllbnQ7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBDcm9zc1N0b3JhZ2VDbGllbnQ7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5Dcm9zc1N0b3JhZ2VDbGllbnQgPSBDcm9zc1N0b3JhZ2VDbGllbnQ7XG4gIH1cbn0odGhpcykpO1xuIiwiOyhmdW5jdGlvbihyb290KSB7XG4gIHZhciBDcm9zc1N0b3JhZ2VIdWIgPSB7fTtcblxuICAvKipcbiAgICogQWNjZXB0cyBhbiBhcnJheSBvZiBvYmplY3RzIHdpdGggdHdvIGtleXM6IG9yaWdpbiBhbmQgYWxsb3cuIFRoZSB2YWx1ZVxuICAgKiBvZiBvcmlnaW4gaXMgZXhwZWN0ZWQgdG8gYmUgYSBSZWdFeHAsIGFuZCBhbGxvdywgYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAgICogVGhlIGNyb3NzIHN0b3JhZ2UgaHViIGlzIHRoZW4gaW5pdGlhbGl6ZWQgdG8gYWNjZXB0IHJlcXVlc3RzIGZyb20gYW55IG9mXG4gICAqIHRoZSBtYXRjaGluZyBvcmlnaW5zLCBhbGxvd2luZyBhY2Nlc3MgdG8gdGhlIGFzc29jaWF0ZWQgbGlzdHMgb2YgbWV0aG9kcy5cbiAgICogTWV0aG9kcyBtYXkgaW5jbHVkZSBhbnkgb2Y6IGdldCwgc2V0LCBkZWwsIGdldEtleXMgYW5kIGNsZWFyLiBBICdyZWFkeSdcbiAgICogbWVzc2FnZSBpcyBzZW50IHRvIHRoZSBwYXJlbnQgd2luZG93IG9uY2UgY29tcGxldGUuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIFN1YmRvbWFpbiBjYW4gZ2V0LCBidXQgb25seSByb290IGRvbWFpbiBjYW4gc2V0IGFuZCBkZWxcbiAgICogQ3Jvc3NTdG9yYWdlSHViLmluaXQoW1xuICAgKiAgIHtvcmlnaW46IC9cXC5leGFtcGxlLmNvbSQvLCAgICAgICAgYWxsb3c6IFsnZ2V0J119LFxuICAgKiAgIHtvcmlnaW46IC86KHd3d1xcLik/ZXhhbXBsZS5jb20kLywgYWxsb3c6IFsnZ2V0JywgJ3NldCcsICdkZWwnXX1cbiAgICogXSk7XG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXl9IHBlcm1pc3Npb25zIEFuIGFycmF5IG9mIG9iamVjdHMgd2l0aCBvcmlnaW4gYW5kIGFsbG93XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuaW5pdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25zKSB7XG4gICAgdmFyIGF2YWlsYWJsZSA9IHRydWU7XG5cbiAgICAvLyBSZXR1cm4gaWYgbG9jYWxTdG9yYWdlIGlzIHVuYXZhaWxhYmxlLCBvciB0aGlyZCBwYXJ0eVxuICAgIC8vIGFjY2VzcyBpcyBkaXNhYmxlZFxuICAgIHRyeSB7XG4gICAgICBpZiAoIXdpbmRvdy5sb2NhbFN0b3JhZ2UpIGF2YWlsYWJsZSA9IGZhbHNlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGF2YWlsYWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghYXZhaWxhYmxlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSgnY3Jvc3Mtc3RvcmFnZTp1bmF2YWlsYWJsZScsICcqJyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBDcm9zc1N0b3JhZ2VIdWIuX3Blcm1pc3Npb25zID0gcGVybWlzc2lvbnMgfHwgW107XG4gICAgQ3Jvc3NTdG9yYWdlSHViLl9pbnN0YWxsTGlzdGVuZXIoKTtcbiAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKCdjcm9zcy1zdG9yYWdlOnJlYWR5JywgJyonKTtcbiAgfTtcblxuICAvKipcbiAgICogSW5zdGFsbHMgdGhlIG5lY2Vzc2FyeSBsaXN0ZW5lciBmb3IgdGhlIHdpbmRvdyBtZXNzYWdlIGV2ZW50LiBBY2NvbW1vZGF0ZXNcbiAgICogSUU4IGFuZCB1cC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5faW5zdGFsbExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxpc3RlbmVyID0gQ3Jvc3NTdG9yYWdlSHViLl9saXN0ZW5lcjtcbiAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmF0dGFjaEV2ZW50KCdvbm1lc3NhZ2UnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBUaGUgbWVzc2FnZSBoYW5kbGVyIGZvciBhbGwgcmVxdWVzdHMgcG9zdGVkIHRvIHRoZSB3aW5kb3cuIEl0IGlnbm9yZXMgYW55XG4gICAqIG1lc3NhZ2VzIGhhdmluZyBhbiBvcmlnaW4gdGhhdCBkb2VzIG5vdCBtYXRjaCB0aGUgb3JpZ2luYWxseSBzdXBwbGllZFxuICAgKiBwYXR0ZXJuLiBHaXZlbiBhIEpTT04gb2JqZWN0IHdpdGggb25lIG9mIGdldCwgc2V0LCBkZWwgb3IgZ2V0S2V5cyBhcyB0aGVcbiAgICogbWV0aG9kLCB0aGUgZnVuY3Rpb24gcGVyZm9ybXMgdGhlIHJlcXVlc3RlZCBhY3Rpb24gYW5kIHJldHVybnMgaXRzIHJlc3VsdC5cbiAgICpcbiAgICogQHBhcmFtIHtNZXNzYWdlRXZlbnR9IG1lc3NhZ2UgQSBtZXNzYWdlIHRvIGJlIHByb2Nlc3NlZFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9saXN0ZW5lciA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICB2YXIgb3JpZ2luLCB0YXJnZXRPcmlnaW4sIHJlcXVlc3QsIG1ldGhvZCwgZXJyb3IsIHJlc3VsdCwgcmVzcG9uc2U7XG5cbiAgICAvLyBwb3N0TWVzc2FnZSByZXR1cm5zIHRoZSBzdHJpbmcgXCJudWxsXCIgYXMgdGhlIG9yaWdpbiBmb3IgXCJmaWxlOi8vXCJcbiAgICBvcmlnaW4gPSAobWVzc2FnZS5vcmlnaW4gPT09ICdudWxsJykgPyAnZmlsZTovLycgOiBtZXNzYWdlLm9yaWdpbjtcblxuICAgIC8vIEhhbmRsZSBwb2xsaW5nIGZvciBhIHJlYWR5IG1lc3NhZ2VcbiAgICBpZiAobWVzc2FnZS5kYXRhID09PSAnY3Jvc3Mtc3RvcmFnZTpwb2xsJykge1xuICAgICAgcmV0dXJuIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoJ2Nyb3NzLXN0b3JhZ2U6cmVhZHknLCBtZXNzYWdlLm9yaWdpbik7XG4gICAgfVxuXG4gICAgLy8gSWdub3JlIHRoZSByZWFkeSBtZXNzYWdlIHdoZW4gdmlld2luZyB0aGUgaHViIGRpcmVjdGx5XG4gICAgaWYgKG1lc3NhZ2UuZGF0YSA9PT0gJ2Nyb3NzLXN0b3JhZ2U6cmVhZHknKSByZXR1cm47XG5cbiAgICAvLyBDaGVjayB3aGV0aGVyIG1lc3NhZ2UuZGF0YSBpcyBhIHZhbGlkIGpzb25cbiAgICB0cnkge1xuICAgICAgcmVxdWVzdCA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayB3aGV0aGVyIHJlcXVlc3QubWV0aG9kIGlzIGEgc3RyaW5nXG4gICAgaWYgKCFyZXF1ZXN0IHx8IHR5cGVvZiByZXF1ZXN0Lm1ldGhvZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBtZXRob2QgPSByZXF1ZXN0Lm1ldGhvZC5zcGxpdCgnY3Jvc3Mtc3RvcmFnZTonKVsxXTtcblxuICAgIGlmICghbWV0aG9kKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmICghQ3Jvc3NTdG9yYWdlSHViLl9wZXJtaXR0ZWQob3JpZ2luLCBtZXRob2QpKSB7XG4gICAgICBlcnJvciA9ICdJbnZhbGlkIHBlcm1pc3Npb25zIGZvciAnICsgbWV0aG9kO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBDcm9zc1N0b3JhZ2VIdWJbJ18nICsgbWV0aG9kXShyZXF1ZXN0LnBhcmFtcyk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgZXJyb3IgPSBlcnIubWVzc2FnZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXNwb25zZSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGlkOiByZXF1ZXN0LmlkLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgICAgcmVzdWx0OiByZXN1bHRcbiAgICB9KTtcblxuICAgIC8vIHBvc3RNZXNzYWdlIHJlcXVpcmVzIHRoYXQgdGhlIHRhcmdldCBvcmlnaW4gYmUgc2V0IHRvIFwiKlwiIGZvciBcImZpbGU6Ly9cIlxuICAgIHRhcmdldE9yaWdpbiA9IChvcmlnaW4gPT09ICdmaWxlOi8vJykgPyAnKicgOiBvcmlnaW47XG5cbiAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHJlc3BvbnNlLCB0YXJnZXRPcmlnaW4pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgb3Igbm90IHRoZSByZXF1ZXN0ZWQgbWV0aG9kIGlzXG4gICAqIHBlcm1pdHRlZCBmb3IgdGhlIGdpdmVuIG9yaWdpbi4gVGhlIGFyZ3VtZW50IHBhc3NlZCB0byBtZXRob2QgaXMgZXhwZWN0ZWRcbiAgICogdG8gYmUgb25lIG9mICdnZXQnLCAnc2V0JywgJ2RlbCcgb3IgJ2dldEtleXMnLlxuICAgKlxuICAgKiBAcGFyYW0gICB7c3RyaW5nfSBvcmlnaW4gVGhlIG9yaWdpbiBmb3Igd2hpY2ggdG8gZGV0ZXJtaW5lIHBlcm1pc3Npb25zXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9IG1ldGhvZCBSZXF1ZXN0ZWQgYWN0aW9uXG4gICAqIEByZXR1cm5zIHtib29sfSAgIFdoZXRoZXIgb3Igbm90IHRoZSByZXF1ZXN0IGlzIHBlcm1pdHRlZFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9wZXJtaXR0ZWQgPSBmdW5jdGlvbihvcmlnaW4sIG1ldGhvZCkge1xuICAgIHZhciBhdmFpbGFibGUsIGksIGVudHJ5LCBtYXRjaDtcblxuICAgIGF2YWlsYWJsZSA9IFsnZ2V0JywgJ3NldCcsICdkZWwnLCAnY2xlYXInLCAnZ2V0S2V5cyddO1xuICAgIGlmICghQ3Jvc3NTdG9yYWdlSHViLl9pbkFycmF5KG1ldGhvZCwgYXZhaWxhYmxlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBDcm9zc1N0b3JhZ2VIdWIuX3Blcm1pc3Npb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBlbnRyeSA9IENyb3NzU3RvcmFnZUh1Yi5fcGVybWlzc2lvbnNbaV07XG4gICAgICBpZiAoIShlbnRyeS5vcmlnaW4gaW5zdGFuY2VvZiBSZWdFeHApIHx8ICEoZW50cnkuYWxsb3cgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIG1hdGNoID0gZW50cnkub3JpZ2luLnRlc3Qob3JpZ2luKTtcbiAgICAgIGlmIChtYXRjaCAmJiBDcm9zc1N0b3JhZ2VIdWIuX2luQXJyYXkobWV0aG9kLCBlbnRyeS5hbGxvdykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXRzIGEga2V5IHRvIHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgQW4gb2JqZWN0IHdpdGgga2V5IGFuZCB2YWx1ZVxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9zZXQgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0ocGFyYW1zLmtleSwgcGFyYW1zLnZhbHVlKTtcbiAgfTtcblxuICAvKipcbiAgICogQWNjZXB0cyBhbiBvYmplY3Qgd2l0aCBhbiBhcnJheSBvZiBrZXlzIGZvciB3aGljaCB0byByZXRyaWV2ZSB0aGVpciB2YWx1ZXMuXG4gICAqIFJldHVybnMgYSBzaW5nbGUgdmFsdWUgaWYgb25seSBvbmUga2V5IHdhcyBzdXBwbGllZCwgb3RoZXJ3aXNlIGl0IHJldHVybnNcbiAgICogYW4gYXJyYXkuIEFueSBrZXlzIG5vdCBzZXQgcmVzdWx0IGluIGEgbnVsbCBlbGVtZW50IGluIHRoZSByZXN1bHRpbmcgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSAgIHtvYmplY3R9IHBhcmFtcyBBbiBvYmplY3Qgd2l0aCBhbiBhcnJheSBvZiBrZXlzXG4gICAqIEByZXR1cm5zIHsqfCpbXX0gIEVpdGhlciBhIHNpbmdsZSB2YWx1ZSwgb3IgYW4gYXJyYXlcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5fZ2V0ID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgdmFyIHN0b3JhZ2UsIHJlc3VsdCwgaSwgdmFsdWU7XG5cbiAgICBzdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICByZXN1bHQgPSBbXTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBwYXJhbXMua2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBzdG9yYWdlLmdldEl0ZW0ocGFyYW1zLmtleXNbaV0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKHJlc3VsdC5sZW5ndGggPiAxKSA/IHJlc3VsdCA6IHJlc3VsdFswXTtcbiAgfTtcblxuICAvKipcbiAgICogRGVsZXRlcyBhbGwga2V5cyBzcGVjaWZpZWQgaW4gdGhlIGFycmF5IGZvdW5kIGF0IHBhcmFtcy5rZXlzLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIEFuIG9iamVjdCB3aXRoIGFuIGFycmF5IG9mIGtleXNcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5fZGVsID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbXMua2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHBhcmFtcy5rZXlzW2ldKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENsZWFycyBsb2NhbFN0b3JhZ2UuXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX2NsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBrZXlzIHN0b3JlZCBpbiBsb2NhbFN0b3JhZ2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmdbXX0gVGhlIGFycmF5IG9mIGtleXNcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5fZ2V0S2V5cyA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIHZhciBpLCBsZW5ndGgsIGtleXM7XG5cbiAgICBrZXlzID0gW107XG4gICAgbGVuZ3RoID0gd2luZG93LmxvY2FsU3RvcmFnZS5sZW5ndGg7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleXMucHVzaCh3aW5kb3cubG9jYWxTdG9yYWdlLmtleShpKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgYSB2YWx1ZSBpcyBwcmVzZW50IGluIHRoZSBhcnJheS4gQ29uc2lzdHMgb2YgYW5cbiAgICogYWx0ZXJuYXRpdmUgdG8gZXh0ZW5kaW5nIHRoZSBhcnJheSBwcm90b3R5cGUgZm9yIGluZGV4T2YsIHNpbmNlIGl0J3NcbiAgICogdW5hdmFpbGFibGUgZm9yIElFOC5cbiAgICpcbiAgICogQHBhcmFtICAgeyp9ICAgIHZhbHVlIFRoZSB2YWx1ZSB0byBmaW5kXG4gICAqIEBwYXJtYSAgIHtbXSp9ICBhcnJheSBUaGUgYXJyYXkgaW4gd2hpY2ggdG8gc2VhcmNoXG4gICAqIEByZXR1cm5zIHtib29sfSBXaGV0aGVyIG9yIG5vdCB0aGUgdmFsdWUgd2FzIGZvdW5kXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX2luQXJyYXkgPSBmdW5jdGlvbih2YWx1ZSwgYXJyYXkpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWUgPT09IGFycmF5W2ldKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIEEgY3Jvc3MtYnJvd3NlciB2ZXJzaW9uIG9mIERhdGUubm93IGNvbXBhdGlibGUgd2l0aCBJRTggdGhhdCBhdm9pZHNcbiAgICogbW9kaWZ5aW5nIHRoZSBEYXRlIG9iamVjdC5cbiAgICpcbiAgICogQHJldHVybiB7aW50fSBUaGUgY3VycmVudCB0aW1lc3RhbXAgaW4gbWlsbGlzZWNvbmRzXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX25vdyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0eXBlb2YgRGF0ZS5ub3cgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBEYXRlLm5vdygpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfTtcblxuICAvKipcbiAgICogRXhwb3J0IGZvciB2YXJpb3VzIGVudmlyb25tZW50cy5cbiAgICovXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gQ3Jvc3NTdG9yYWdlSHViO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGV4cG9ydHMuQ3Jvc3NTdG9yYWdlSHViID0gQ3Jvc3NTdG9yYWdlSHViO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gQ3Jvc3NTdG9yYWdlSHViO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuQ3Jvc3NTdG9yYWdlSHViID0gQ3Jvc3NTdG9yYWdlSHViO1xuICB9XG59KHRoaXMpKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBDcm9zc1N0b3JhZ2VDbGllbnQ6IHJlcXVpcmUoJy4vY2xpZW50LmpzJyksXG4gIENyb3NzU3RvcmFnZUh1YjogICAgcmVxdWlyZSgnLi9odWIuanMnKVxufTtcbiIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuLyohXG4gKiBAb3ZlcnZpZXcgZXM2LXByb21pc2UgLSBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsuXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNCBZZWh1ZGEgS2F0eiwgVG9tIERhbGUsIFN0ZWZhbiBQZW5uZXIgYW5kIGNvbnRyaWJ1dG9ycyAoQ29udmVyc2lvbiB0byBFUzYgQVBJIGJ5IEpha2UgQXJjaGliYWxkKVxuICogQGxpY2Vuc2UgICBMaWNlbnNlZCB1bmRlciBNSVQgbGljZW5zZVxuICogICAgICAgICAgICBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3N0ZWZhbnBlbm5lci9lczYtcHJvbWlzZS9tYXN0ZXIvTElDRU5TRVxuICogQHZlcnNpb24gICA0LjAuNVxuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgKGdsb2JhbC5FUzZQcm9taXNlID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuXG52YXIgX2lzQXJyYXkgPSB1bmRlZmluZWQ7XG5pZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgX2lzQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG59IGVsc2Uge1xuICBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG59XG5cbnZhciBpc0FycmF5ID0gX2lzQXJyYXk7XG5cbnZhciBsZW4gPSAwO1xudmFyIHZlcnR4TmV4dCA9IHVuZGVmaW5lZDtcbnZhciBjdXN0b21TY2hlZHVsZXJGbiA9IHVuZGVmaW5lZDtcblxudmFyIGFzYXAgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgcXVldWVbbGVuXSA9IGNhbGxiYWNrO1xuICBxdWV1ZVtsZW4gKyAxXSA9IGFyZztcbiAgbGVuICs9IDI7XG4gIGlmIChsZW4gPT09IDIpIHtcbiAgICAvLyBJZiBsZW4gaXMgMiwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgLy8gSWYgYWRkaXRpb25hbCBjYWxsYmFja3MgYXJlIHF1ZXVlZCBiZWZvcmUgdGhlIHF1ZXVlIGlzIGZsdXNoZWQsIHRoZXlcbiAgICAvLyB3aWxsIGJlIHByb2Nlc3NlZCBieSB0aGlzIGZsdXNoIHRoYXQgd2UgYXJlIHNjaGVkdWxpbmcuXG4gICAgaWYgKGN1c3RvbVNjaGVkdWxlckZuKSB7XG4gICAgICBjdXN0b21TY2hlZHVsZXJGbihmbHVzaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHNldFNjaGVkdWxlcihzY2hlZHVsZUZuKSB7XG4gIGN1c3RvbVNjaGVkdWxlckZuID0gc2NoZWR1bGVGbjtcbn1cblxuZnVuY3Rpb24gc2V0QXNhcChhc2FwRm4pIHtcbiAgYXNhcCA9IGFzYXBGbjtcbn1cblxudmFyIGJyb3dzZXJXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcbnZhciBicm93c2VyR2xvYmFsID0gYnJvd3NlcldpbmRvdyB8fCB7fTtcbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgaXNOb2RlID0gdHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAoe30pLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcblxuLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbnZhciBpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIG5vZGVcbmZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcbiAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jdWpvanMvd2hlbi9pc3N1ZXMvNDEwIGZvciBkZXRhaWxzXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xufVxuXG4vLyB2ZXJ0eFxuZnVuY3Rpb24gdXNlVmVydHhUaW1lcigpIHtcbiAgaWYgKHR5cGVvZiB2ZXJ0eE5leHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZlcnR4TmV4dChmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gIHZhciBpdGVyYXRpb25zID0gMDtcbiAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gIG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgbm9kZS5kYXRhID0gaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDI7XG4gIH07XG59XG5cbi8vIHdlYiB3b3JrZXJcbmZ1bmN0aW9uIHVzZU1lc3NhZ2VDaGFubmVsKCkge1xuICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZsdXNoO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VTZXRUaW1lb3V0KCkge1xuICAvLyBTdG9yZSBzZXRUaW1lb3V0IHJlZmVyZW5jZSBzbyBlczYtcHJvbWlzZSB3aWxsIGJlIHVuYWZmZWN0ZWQgYnlcbiAgLy8gb3RoZXIgY29kZSBtb2RpZnlpbmcgc2V0VGltZW91dCAobGlrZSBzaW5vbi51c2VGYWtlVGltZXJzKCkpXG4gIHZhciBnbG9iYWxTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2xvYmFsU2V0VGltZW91dChmbHVzaCwgMSk7XG4gIH07XG59XG5cbnZhciBxdWV1ZSA9IG5ldyBBcnJheSgxMDAwKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gcXVldWVbaV07XG4gICAgdmFyIGFyZyA9IHF1ZXVlW2kgKyAxXTtcblxuICAgIGNhbGxiYWNrKGFyZyk7XG5cbiAgICBxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcbiAgICBxdWV1ZVtpICsgMV0gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBsZW4gPSAwO1xufVxuXG5mdW5jdGlvbiBhdHRlbXB0VmVydHgoKSB7XG4gIHRyeSB7XG4gICAgdmFyIHIgPSByZXF1aXJlO1xuICAgIHZhciB2ZXJ0eCA9IHIoJ3ZlcnR4Jyk7XG4gICAgdmVydHhOZXh0ID0gdmVydHgucnVuT25Mb29wIHx8IHZlcnR4LnJ1bk9uQ29udGV4dDtcbiAgICByZXR1cm4gdXNlVmVydHhUaW1lcigpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbiAgfVxufVxuXG52YXIgc2NoZWR1bGVGbHVzaCA9IHVuZGVmaW5lZDtcbi8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG5pZiAoaXNOb2RlKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xufSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTXV0YXRpb25PYnNlcnZlcigpO1xufSBlbHNlIGlmIChpc1dvcmtlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTWVzc2FnZUNoYW5uZWwoKTtcbn0gZWxzZSBpZiAoYnJvd3NlcldpbmRvdyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSBhdHRlbXB0VmVydHgoKTtcbn0gZWxzZSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XG5cbiAgdmFyIHBhcmVudCA9IHRoaXM7XG5cbiAgdmFyIGNoaWxkID0gbmV3IHRoaXMuY29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKGNoaWxkW1BST01JU0VfSURdID09PSB1bmRlZmluZWQpIHtcbiAgICBtYWtlUHJvbWlzZShjaGlsZCk7XG4gIH1cblxuICB2YXIgX3N0YXRlID0gcGFyZW50Ll9zdGF0ZTtcblxuICBpZiAoX3N0YXRlKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjYWxsYmFjayA9IF9hcmd1bWVudHNbX3N0YXRlIC0gMV07XG4gICAgICBhc2FwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGludm9rZUNhbGxiYWNrKF9zdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCBwYXJlbnQuX3Jlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9IGVsc2Uge1xuICAgIHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZXNvbHZlYCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIHJlc29sdmVkIHdpdGggdGhlXG4gIHBhc3NlZCBgdmFsdWVgLiBJdCBpcyBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVzb2x2ZSgxKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoMSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZXNvbHZlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHZhbHVlIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgZnVsZmlsbGVkIHdpdGggdGhlIGdpdmVuXG4gIGB2YWx1ZWBcbiovXG5mdW5jdGlvbiByZXNvbHZlKG9iamVjdCkge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgX3Jlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbnZhciBQUk9NSVNFX0lEID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDE2KTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnZhciBQRU5ESU5HID0gdm9pZCAwO1xudmFyIEZVTEZJTExFRCA9IDE7XG52YXIgUkVKRUNURUQgPSAyO1xuXG52YXIgR0VUX1RIRU5fRVJST1IgPSBuZXcgRXJyb3JPYmplY3QoKTtcblxuZnVuY3Rpb24gc2VsZkZ1bGZpbGxtZW50KCkge1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcIllvdSBjYW5ub3QgcmVzb2x2ZSBhIHByb21pc2Ugd2l0aCBpdHNlbGZcIik7XG59XG5cbmZ1bmN0aW9uIGNhbm5vdFJldHVybk93bigpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS4nKTtcbn1cblxuZnVuY3Rpb24gZ2V0VGhlbihwcm9taXNlKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHByb21pc2UudGhlbjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBHRVRfVEhFTl9FUlJPUi5lcnJvciA9IGVycm9yO1xuICAgIHJldHVybiBHRVRfVEhFTl9FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cnlUaGVuKHRoZW4sIHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpIHtcbiAgdHJ5IHtcbiAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUsIHRoZW4pIHtcbiAgYXNhcChmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgIHZhciBzZWFsZWQgPSBmYWxzZTtcbiAgICB2YXIgZXJyb3IgPSB0cnlUaGVuKHRoZW4sIHRoZW5hYmxlLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuXG4gICAgICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSwgJ1NldHRsZTogJyArIChwcm9taXNlLl9sYWJlbCB8fCAnIHVua25vd24gcHJvbWlzZScpKTtcblxuICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgX3JlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgfVxuICB9LCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUpIHtcbiAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gRlVMRklMTEVEKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUodGhlbmFibGUsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuJCQpIHtcbiAgaWYgKG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IgPT09IHByb21pc2UuY29uc3RydWN0b3IgJiYgdGhlbiQkID09PSB0aGVuICYmIG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IucmVzb2x2ZSA9PT0gcmVzb2x2ZSkge1xuICAgIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICB9IGVsc2Uge1xuICAgIGlmICh0aGVuJCQgPT09IEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIEdFVF9USEVOX0VSUk9SLmVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHRoZW4kJCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih0aGVuJCQpKSB7XG4gICAgICBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCBzZWxmRnVsZmlsbG1lbnQoKSk7XG4gIH0gZWxzZSBpZiAob2JqZWN0T3JGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlLCBnZXRUaGVuKHZhbHVlKSk7XG4gIH0gZWxzZSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gIGlmIChwcm9taXNlLl9vbmVycm9yKSB7XG4gICAgcHJvbWlzZS5fb25lcnJvcihwcm9taXNlLl9yZXN1bHQpO1xuICB9XG5cbiAgcHVibGlzaChwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fc3RhdGUgPSBGVUxGSUxMRUQ7XG5cbiAgaWYgKHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgIGFzYXAocHVibGlzaCwgcHJvbWlzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3JlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHByb21pc2UuX3N0YXRlID0gUkVKRUNURUQ7XG4gIHByb21pc2UuX3Jlc3VsdCA9IHJlYXNvbjtcblxuICBhc2FwKHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIF9zdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gIHZhciBsZW5ndGggPSBfc3Vic2NyaWJlcnMubGVuZ3RoO1xuXG4gIHBhcmVudC5fb25lcnJvciA9IG51bGw7XG5cbiAgX3N1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICBfc3Vic2NyaWJlcnNbbGVuZ3RoICsgUkVKRUNURURdID0gb25SZWplY3Rpb247XG5cbiAgaWYgKGxlbmd0aCA9PT0gMCAmJiBwYXJlbnQuX3N0YXRlKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwYXJlbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2gocHJvbWlzZSkge1xuICB2YXIgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycztcbiAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGNoaWxkID0gdW5kZWZpbmVkLFxuICAgICAgY2FsbGJhY2sgPSB1bmRlZmluZWQsXG4gICAgICBkZXRhaWwgPSBwcm9taXNlLl9yZXN1bHQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgY2FsbGJhY2sgPSBzdWJzY3JpYmVyc1tpICsgc2V0dGxlZF07XG5cbiAgICBpZiAoY2hpbGQpIHtcbiAgICAgIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soZGV0YWlsKTtcbiAgICB9XG4gIH1cblxuICBwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBFcnJvck9iamVjdCgpIHtcbiAgdGhpcy5lcnJvciA9IG51bGw7XG59XG5cbnZhciBUUllfQ0FUQ0hfRVJST1IgPSBuZXcgRXJyb3JPYmplY3QoKTtcblxuZnVuY3Rpb24gdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCkge1xuICB0cnkge1xuICAgIHJldHVybiBjYWxsYmFjayhkZXRhaWwpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgVFJZX0NBVENIX0VSUk9SLmVycm9yID0gZTtcbiAgICByZXR1cm4gVFJZX0NBVENIX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdmFyIGhhc0NhbGxiYWNrID0gaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICB2YWx1ZSA9IHVuZGVmaW5lZCxcbiAgICAgIGVycm9yID0gdW5kZWZpbmVkLFxuICAgICAgc3VjY2VlZGVkID0gdW5kZWZpbmVkLFxuICAgICAgZmFpbGVkID0gdW5kZWZpbmVkO1xuXG4gIGlmIChoYXNDYWxsYmFjaykge1xuICAgIHZhbHVlID0gdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCk7XG5cbiAgICBpZiAodmFsdWUgPT09IFRSWV9DQVRDSF9FUlJPUikge1xuICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGVycm9yID0gdmFsdWUuZXJyb3I7XG4gICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGNhbm5vdFJldHVybk93bigpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIC8vIG5vb3BcbiAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcbiAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGZhaWxlZCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBGVUxGSUxMRUQpIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gUkVKRUNURUQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVByb21pc2UocHJvbWlzZSwgcmVzb2x2ZXIpIHtcbiAgdHJ5IHtcbiAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSkge1xuICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIHJlamVjdFByb21pc2UocmVhc29uKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIGUpO1xuICB9XG59XG5cbnZhciBpZCA9IDA7XG5mdW5jdGlvbiBuZXh0SWQoKSB7XG4gIHJldHVybiBpZCsrO1xufVxuXG5mdW5jdGlvbiBtYWtlUHJvbWlzZShwcm9taXNlKSB7XG4gIHByb21pc2VbUFJPTUlTRV9JRF0gPSBpZCsrO1xuICBwcm9taXNlLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9zdWJzY3JpYmVycyA9IFtdO1xufVxuXG5mdW5jdGlvbiBFbnVtZXJhdG9yKENvbnN0cnVjdG9yLCBpbnB1dCkge1xuICB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcblxuICBpZiAoIXRoaXMucHJvbWlzZVtQUk9NSVNFX0lEXSkge1xuICAgIG1ha2VQcm9taXNlKHRoaXMucHJvbWlzZSk7XG4gIH1cblxuICBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuICAgIHRoaXMubGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICAgIHRoaXMuX3JlbWFpbmluZyA9IGlucHV0Lmxlbmd0aDtcblxuICAgIHRoaXMuX3Jlc3VsdCA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XG5cbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubGVuZ3RoIHx8IDA7XG4gICAgICB0aGlzLl9lbnVtZXJhdGUoKTtcbiAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIF9yZWplY3QodGhpcy5wcm9taXNlLCB2YWxpZGF0aW9uRXJyb3IoKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGlvbkVycm9yKCkge1xuICByZXR1cm4gbmV3IEVycm9yKCdBcnJheSBNZXRob2RzIG11c3QgYmUgcHJvdmlkZWQgYW4gQXJyYXknKTtcbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgdmFyIF9pbnB1dCA9IHRoaXMuX2lucHV0O1xuXG4gIGZvciAodmFyIGkgPSAwOyB0aGlzLl9zdGF0ZSA9PT0gUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLl9lYWNoRW50cnkoX2lucHV0W2ldLCBpKTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uIChlbnRyeSwgaSkge1xuICB2YXIgYyA9IHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3I7XG4gIHZhciByZXNvbHZlJCQgPSBjLnJlc29sdmU7XG5cbiAgaWYgKHJlc29sdmUkJCA9PT0gcmVzb2x2ZSkge1xuICAgIHZhciBfdGhlbiA9IGdldFRoZW4oZW50cnkpO1xuXG4gICAgaWYgKF90aGVuID09PSB0aGVuICYmIGVudHJ5Ll9zdGF0ZSAhPT0gUEVORElORykge1xuICAgICAgdGhpcy5fc2V0dGxlZEF0KGVudHJ5Ll9zdGF0ZSwgaSwgZW50cnkuX3Jlc3VsdCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgX3RoZW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuICAgICAgdGhpcy5fcmVzdWx0W2ldID0gZW50cnk7XG4gICAgfSBlbHNlIGlmIChjID09PSBQcm9taXNlKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBjKG5vb3ApO1xuICAgICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBlbnRyeSwgX3RoZW4pO1xuICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHByb21pc2UsIGkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93aWxsU2V0dGxlQXQobmV3IGMoZnVuY3Rpb24gKHJlc29sdmUkJCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSQkKGVudHJ5KTtcbiAgICAgIH0pLCBpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fd2lsbFNldHRsZUF0KHJlc29sdmUkJChlbnRyeSksIGkpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fc2V0dGxlZEF0ID0gZnVuY3Rpb24gKHN0YXRlLCBpLCB2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXMucHJvbWlzZTtcblxuICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICB0aGlzLl9yZW1haW5pbmctLTtcblxuICAgIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZXN1bHRbaV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fd2lsbFNldHRsZUF0ID0gZnVuY3Rpb24gKHByb21pc2UsIGkpIHtcbiAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gIHN1YnNjcmliZShwcm9taXNlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoRlVMRklMTEVELCBpLCB2YWx1ZSk7XG4gIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KFJFSkVDVEVELCBpLCByZWFzb24pO1xuICB9KTtcbn07XG5cbi8qKlxuICBgUHJvbWlzZS5hbGxgIGFjY2VwdHMgYW4gYXJyYXkgb2YgcHJvbWlzZXMsIGFuZCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2hcbiAgaXMgZnVsZmlsbGVkIHdpdGggYW4gYXJyYXkgb2YgZnVsZmlsbG1lbnQgdmFsdWVzIGZvciB0aGUgcGFzc2VkIHByb21pc2VzLCBvclxuICByZWplY3RlZCB3aXRoIHRoZSByZWFzb24gb2YgdGhlIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIGJlIHJlamVjdGVkLiBJdCBjYXN0cyBhbGxcbiAgZWxlbWVudHMgb2YgdGhlIHBhc3NlZCBpdGVyYWJsZSB0byBwcm9taXNlcyBhcyBpdCBydW5zIHRoaXMgYWxnb3JpdGhtLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZXNvbHZlKDIpO1xuICBsZXQgcHJvbWlzZTMgPSByZXNvbHZlKDMpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gVGhlIGFycmF5IGhlcmUgd291bGQgYmUgWyAxLCAyLCAzIF07XG4gIH0pO1xuICBgYGBcblxuICBJZiBhbnkgb2YgdGhlIGBwcm9taXNlc2AgZ2l2ZW4gdG8gYGFsbGAgYXJlIHJlamVjdGVkLCB0aGUgZmlyc3QgcHJvbWlzZVxuICB0aGF0IGlzIHJlamVjdGVkIHdpbGwgYmUgZ2l2ZW4gYXMgYW4gYXJndW1lbnQgdG8gdGhlIHJldHVybmVkIHByb21pc2VzJ3NcbiAgcmVqZWN0aW9uIGhhbmRsZXIuIEZvciBleGFtcGxlOlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZWplY3QobmV3IEVycm9yKFwiMlwiKSk7XG4gIGxldCBwcm9taXNlMyA9IHJlamVjdChuZXcgRXJyb3IoXCIzXCIpKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zIGJlY2F1c2UgdGhlcmUgYXJlIHJlamVjdGVkIHByb21pc2VzIVxuICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgIC8vIGVycm9yLm1lc3NhZ2UgPT09IFwiMlwiXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIGFsbFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IGVudHJpZXMgYXJyYXkgb2YgcHJvbWlzZXNcbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGFsbCBgcHJvbWlzZXNgIGhhdmUgYmVlblxuICBmdWxmaWxsZWQsIG9yIHJlamVjdGVkIGlmIGFueSBvZiB0aGVtIGJlY29tZSByZWplY3RlZC5cbiAgQHN0YXRpY1xuKi9cbmZ1bmN0aW9uIGFsbChlbnRyaWVzKSB7XG4gIHJldHVybiBuZXcgRW51bWVyYXRvcih0aGlzLCBlbnRyaWVzKS5wcm9taXNlO1xufVxuXG4vKipcbiAgYFByb21pc2UucmFjZWAgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoIGlzIHNldHRsZWQgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZVxuICBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBzZXR0bGUuXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDInKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyByZXN1bHQgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgaXQgd2FzIHJlc29sdmVkIGJlZm9yZSBwcm9taXNlMVxuICAgIC8vIHdhcyByZXNvbHZlZC5cbiAgfSk7XG4gIGBgYFxuXG4gIGBQcm9taXNlLnJhY2VgIGlzIGRldGVybWluaXN0aWMgaW4gdGhhdCBvbmx5IHRoZSBzdGF0ZSBvZiB0aGUgZmlyc3RcbiAgc2V0dGxlZCBwcm9taXNlIG1hdHRlcnMuIEZvciBleGFtcGxlLCBldmVuIGlmIG90aGVyIHByb21pc2VzIGdpdmVuIHRvIHRoZVxuICBgcHJvbWlzZXNgIGFycmF5IGFyZ3VtZW50IGFyZSByZXNvbHZlZCwgYnV0IHRoZSBmaXJzdCBzZXR0bGVkIHByb21pc2UgaGFzXG4gIGJlY29tZSByZWplY3RlZCBiZWZvcmUgdGhlIG90aGVyIHByb21pc2VzIGJlY2FtZSBmdWxmaWxsZWQsIHRoZSByZXR1cm5lZFxuICBwcm9taXNlIHdpbGwgYmVjb21lIHJlamVjdGVkOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoJ3Byb21pc2UgMicpKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVuc1xuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIHByb21pc2UgMiBiZWNhbWUgcmVqZWN0ZWQgYmVmb3JlXG4gICAgLy8gcHJvbWlzZSAxIGJlY2FtZSBmdWxmaWxsZWRcbiAgfSk7XG4gIGBgYFxuXG4gIEFuIGV4YW1wbGUgcmVhbC13b3JsZCB1c2UgY2FzZSBpcyBpbXBsZW1lbnRpbmcgdGltZW91dHM6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBQcm9taXNlLnJhY2UoW2FqYXgoJ2Zvby5qc29uJyksIHRpbWVvdXQoNTAwMCldKVxuICBgYGBcblxuICBAbWV0aG9kIHJhY2VcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBwcm9taXNlcyBhcnJheSBvZiBwcm9taXNlcyB0byBvYnNlcnZlXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHdoaWNoIHNldHRsZXMgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZSBmaXJzdCBwYXNzZWRcbiAgcHJvbWlzZSB0byBzZXR0bGUuXG4qL1xuZnVuY3Rpb24gcmFjZShlbnRyaWVzKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgaWYgKCFpc0FycmF5KGVudHJpZXMpKSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAoXywgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIENvbnN0cnVjdG9yLnJlc29sdmUoZW50cmllc1tpXSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZWplY3RgIHJldHVybnMgYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIHBhc3NlZCBgcmVhc29uYC5cbiAgSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVqZWN0XG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHJlYXNvbiB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aC5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgZ2l2ZW4gYHJlYXNvbmAuXG4qL1xuZnVuY3Rpb24gcmVqZWN0KHJlYXNvbikge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gbmVlZHNSZXNvbHZlcigpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xufVxuXG5mdW5jdGlvbiBuZWVkc05ldygpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbn1cblxuLyoqXG4gIFByb21pc2Ugb2JqZWN0cyByZXByZXNlbnQgdGhlIGV2ZW50dWFsIHJlc3VsdCBvZiBhbiBhc3luY2hyb25vdXMgb3BlcmF0aW9uLiBUaGVcbiAgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCwgd2hpY2hcbiAgcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGUgcmVhc29uXG4gIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuXG4gIFRlcm1pbm9sb2d5XG4gIC0tLS0tLS0tLS0tXG5cbiAgLSBgcHJvbWlzZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHdpdGggYSBgdGhlbmAgbWV0aG9kIHdob3NlIGJlaGF2aW9yIGNvbmZvcm1zIHRvIHRoaXMgc3BlY2lmaWNhdGlvbi5cbiAgLSBgdGhlbmFibGVgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB0aGF0IGRlZmluZXMgYSBgdGhlbmAgbWV0aG9kLlxuICAtIGB2YWx1ZWAgaXMgYW55IGxlZ2FsIEphdmFTY3JpcHQgdmFsdWUgKGluY2x1ZGluZyB1bmRlZmluZWQsIGEgdGhlbmFibGUsIG9yIGEgcHJvbWlzZSkuXG4gIC0gYGV4Y2VwdGlvbmAgaXMgYSB2YWx1ZSB0aGF0IGlzIHRocm93biB1c2luZyB0aGUgdGhyb3cgc3RhdGVtZW50LlxuICAtIGByZWFzb25gIGlzIGEgdmFsdWUgdGhhdCBpbmRpY2F0ZXMgd2h5IGEgcHJvbWlzZSB3YXMgcmVqZWN0ZWQuXG4gIC0gYHNldHRsZWRgIHRoZSBmaW5hbCByZXN0aW5nIHN0YXRlIG9mIGEgcHJvbWlzZSwgZnVsZmlsbGVkIG9yIHJlamVjdGVkLlxuXG4gIEEgcHJvbWlzZSBjYW4gYmUgaW4gb25lIG9mIHRocmVlIHN0YXRlczogcGVuZGluZywgZnVsZmlsbGVkLCBvciByZWplY3RlZC5cblxuICBQcm9taXNlcyB0aGF0IGFyZSBmdWxmaWxsZWQgaGF2ZSBhIGZ1bGZpbGxtZW50IHZhbHVlIGFuZCBhcmUgaW4gdGhlIGZ1bGZpbGxlZFxuICBzdGF0ZS4gIFByb21pc2VzIHRoYXQgYXJlIHJlamVjdGVkIGhhdmUgYSByZWplY3Rpb24gcmVhc29uIGFuZCBhcmUgaW4gdGhlXG4gIHJlamVjdGVkIHN0YXRlLiAgQSBmdWxmaWxsbWVudCB2YWx1ZSBpcyBuZXZlciBhIHRoZW5hYmxlLlxuXG4gIFByb21pc2VzIGNhbiBhbHNvIGJlIHNhaWQgdG8gKnJlc29sdmUqIGEgdmFsdWUuICBJZiB0aGlzIHZhbHVlIGlzIGFsc28gYVxuICBwcm9taXNlLCB0aGVuIHRoZSBvcmlnaW5hbCBwcm9taXNlJ3Mgc2V0dGxlZCBzdGF0ZSB3aWxsIG1hdGNoIHRoZSB2YWx1ZSdzXG4gIHNldHRsZWQgc3RhdGUuICBTbyBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IHJlamVjdHMgd2lsbFxuICBpdHNlbGYgcmVqZWN0LCBhbmQgYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCBmdWxmaWxscyB3aWxsXG4gIGl0c2VsZiBmdWxmaWxsLlxuXG5cbiAgQmFzaWMgVXNhZ2U6XG4gIC0tLS0tLS0tLS0tLVxuXG4gIGBgYGpzXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgLy8gb24gc3VjY2Vzc1xuICAgIHJlc29sdmUodmFsdWUpO1xuXG4gICAgLy8gb24gZmFpbHVyZVxuICAgIHJlamVjdChyZWFzb24pO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIEFkdmFuY2VkIFVzYWdlOlxuICAtLS0tLS0tLS0tLS0tLS1cblxuICBQcm9taXNlcyBzaGluZSB3aGVuIGFic3RyYWN0aW5nIGF3YXkgYXN5bmNocm9ub3VzIGludGVyYWN0aW9ucyBzdWNoIGFzXG4gIGBYTUxIdHRwUmVxdWVzdGBzLlxuXG4gIGBgYGpzXG4gIGZ1bmN0aW9uIGdldEpTT04odXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZXI7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB4aHIuc2VuZCgpO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSB0aGlzLkRPTkUpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignZ2V0SlNPTjogYCcgKyB1cmwgKyAnYCBmYWlsZWQgd2l0aCBzdGF0dXM6IFsnICsgdGhpcy5zdGF0dXMgKyAnXScpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBnZXRKU09OKCcvcG9zdHMuanNvbicpLnRoZW4oZnVuY3Rpb24oanNvbikge1xuICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIC8vIG9uIHJlamVjdGlvblxuICB9KTtcbiAgYGBgXG5cbiAgVW5saWtlIGNhbGxiYWNrcywgcHJvbWlzZXMgYXJlIGdyZWF0IGNvbXBvc2FibGUgcHJpbWl0aXZlcy5cblxuICBgYGBqc1xuICBQcm9taXNlLmFsbChbXG4gICAgZ2V0SlNPTignL3Bvc3RzJyksXG4gICAgZ2V0SlNPTignL2NvbW1lbnRzJylcbiAgXSkudGhlbihmdW5jdGlvbih2YWx1ZXMpe1xuICAgIHZhbHVlc1swXSAvLyA9PiBwb3N0c0pTT05cbiAgICB2YWx1ZXNbMV0gLy8gPT4gY29tbWVudHNKU09OXG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9KTtcbiAgYGBgXG5cbiAgQGNsYXNzIFByb21pc2VcbiAgQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZXJcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAY29uc3RydWN0b3JcbiovXG5mdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gIHRoaXNbUFJPTUlTRV9JRF0gPSBuZXh0SWQoKTtcbiAgdGhpcy5fcmVzdWx0ID0gdGhpcy5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgaWYgKG5vb3AgIT09IHJlc29sdmVyKSB7XG4gICAgdHlwZW9mIHJlc29sdmVyICE9PSAnZnVuY3Rpb24nICYmIG5lZWRzUmVzb2x2ZXIoKTtcbiAgICB0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSA/IGluaXRpYWxpemVQcm9taXNlKHRoaXMsIHJlc29sdmVyKSA6IG5lZWRzTmV3KCk7XG4gIH1cbn1cblxuUHJvbWlzZS5hbGwgPSBhbGw7XG5Qcm9taXNlLnJhY2UgPSByYWNlO1xuUHJvbWlzZS5yZXNvbHZlID0gcmVzb2x2ZTtcblByb21pc2UucmVqZWN0ID0gcmVqZWN0O1xuUHJvbWlzZS5fc2V0U2NoZWR1bGVyID0gc2V0U2NoZWR1bGVyO1xuUHJvbWlzZS5fc2V0QXNhcCA9IHNldEFzYXA7XG5Qcm9taXNlLl9hc2FwID0gYXNhcDtcblxuUHJvbWlzZS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBQcm9taXNlLFxuXG4gIC8qKlxuICAgIFRoZSBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLFxuICAgIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXG4gICAgcmVhc29uIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgIC8vIHVzZXIgaXMgYXZhaWxhYmxlXG4gICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHVzZXIgaXMgdW5hdmFpbGFibGUsIGFuZCB5b3UgYXJlIGdpdmVuIHRoZSByZWFzb24gd2h5XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIENoYWluaW5nXG4gICAgLS0tLS0tLS1cbiAgXG4gICAgVGhlIHJldHVybiB2YWx1ZSBvZiBgdGhlbmAgaXMgaXRzZWxmIGEgcHJvbWlzZS4gIFRoaXMgc2Vjb25kLCAnZG93bnN0cmVhbSdcbiAgICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XG4gICAgb3IgcmVqZWN0aW9uIGhhbmRsZXIsIG9yIHJlamVjdGVkIGlmIHRoZSBoYW5kbGVyIHRocm93cyBhbiBleGNlcHRpb24uXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiAnZGVmYXVsdCBuYW1lJztcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh1c2VyTmFtZSkge1xuICAgICAgLy8gSWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGB1c2VyTmFtZWAgd2lsbCBiZSB0aGUgdXNlcidzIG5hbWUsIG90aGVyd2lzZSBpdFxuICAgICAgLy8gd2lsbCBiZSBgJ2RlZmF1bHQgbmFtZSdgXG4gICAgfSk7XG4gIFxuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gaWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGByZWFzb25gIHdpbGwgYmUgJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jy5cbiAgICAgIC8vIElmIGBmaW5kVXNlcmAgcmVqZWN0ZWQsIGByZWFzb25gIHdpbGwgYmUgJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknLlxuICAgIH0pO1xuICAgIGBgYFxuICAgIElmIHRoZSBkb3duc3RyZWFtIHByb21pc2UgZG9lcyBub3Qgc3BlY2lmeSBhIHJlamVjdGlvbiBoYW5kbGVyLCByZWplY3Rpb24gcmVhc29ucyB3aWxsIGJlIHByb3BhZ2F0ZWQgZnVydGhlciBkb3duc3RyZWFtLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IFBlZGFnb2dpY2FsRXhjZXB0aW9uKCdVcHN0cmVhbSBlcnJvcicpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBUaGUgYFBlZGdhZ29jaWFsRXhjZXB0aW9uYCBpcyBwcm9wYWdhdGVkIGFsbCB0aGUgd2F5IGRvd24gdG8gaGVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBBc3NpbWlsYXRpb25cbiAgICAtLS0tLS0tLS0tLS1cbiAgXG4gICAgU29tZXRpbWVzIHRoZSB2YWx1ZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgdG8gYSBkb3duc3RyZWFtIHByb21pc2UgY2FuIG9ubHkgYmVcbiAgICByZXRyaWV2ZWQgYXN5bmNocm9ub3VzbHkuIFRoaXMgY2FuIGJlIGFjaGlldmVkIGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gdGhlXG4gICAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcbiAgICB1bnRpbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpcyBzZXR0bGVkLiBUaGlzIGlzIGNhbGxlZCAqYXNzaW1pbGF0aW9uKi5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgLy8gVGhlIHVzZXIncyBjb21tZW50cyBhcmUgbm93IGF2YWlsYWJsZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBJZiB0aGUgYXNzaW1saWF0ZWQgcHJvbWlzZSByZWplY3RzLCB0aGVuIHRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCBhbHNvIHJlamVjdC5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCBmdWxmaWxscywgd2UnbGwgaGF2ZSB0aGUgdmFsdWUgaGVyZVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgcmVqZWN0cywgd2UnbGwgaGF2ZSB0aGUgcmVhc29uIGhlcmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgU2ltcGxlIEV4YW1wbGVcbiAgICAtLS0tLS0tLS0tLS0tLVxuICBcbiAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBsZXQgcmVzdWx0O1xuICBcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBFcnJiYWNrIEV4YW1wbGVcbiAgXG4gICAgYGBganNcbiAgICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBQcm9taXNlIEV4YW1wbGU7XG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBmaW5kUmVzdWx0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEFkdmFuY2VkIEV4YW1wbGVcbiAgICAtLS0tLS0tLS0tLS0tLVxuICBcbiAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBsZXQgYXV0aG9yLCBib29rcztcbiAgXG4gICAgdHJ5IHtcbiAgICAgIGF1dGhvciA9IGZpbmRBdXRob3IoKTtcbiAgICAgIGJvb2tzICA9IGZpbmRCb29rc0J5QXV0aG9yKGF1dGhvcik7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9XG4gICAgYGBgXG4gIFxuICAgIEVycmJhY2sgRXhhbXBsZVxuICBcbiAgICBgYGBqc1xuICBcbiAgICBmdW5jdGlvbiBmb3VuZEJvb2tzKGJvb2tzKSB7XG4gIFxuICAgIH1cbiAgXG4gICAgZnVuY3Rpb24gZmFpbHVyZShyZWFzb24pIHtcbiAgXG4gICAgfVxuICBcbiAgICBmaW5kQXV0aG9yKGZ1bmN0aW9uKGF1dGhvciwgZXJyKXtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpbmRCb29va3NCeUF1dGhvcihhdXRob3IsIGZ1bmN0aW9uKGJvb2tzLCBlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcbiAgICAgICAgICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICBmYWlsdXJlKHJlYXNvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFByb21pc2UgRXhhbXBsZTtcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGZpbmRBdXRob3IoKS5cbiAgICAgIHRoZW4oZmluZEJvb2tzQnlBdXRob3IpLlxuICAgICAgdGhlbihmdW5jdGlvbihib29rcyl7XG4gICAgICAgIC8vIGZvdW5kIGJvb2tzXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgdGhlblxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbGVkXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3RlZFxuICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuICB0aGVuOiB0aGVuLFxuXG4gIC8qKlxuICAgIGBjYXRjaGAgaXMgc2ltcGx5IHN1Z2FyIGZvciBgdGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uKWAgd2hpY2ggbWFrZXMgaXQgdGhlIHNhbWVcbiAgICBhcyB0aGUgY2F0Y2ggYmxvY2sgb2YgYSB0cnkvY2F0Y2ggc3RhdGVtZW50LlxuICBcbiAgICBgYGBqc1xuICAgIGZ1bmN0aW9uIGZpbmRBdXRob3IoKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xuICAgIH1cbiAgXG4gICAgLy8gc3luY2hyb25vdXNcbiAgICB0cnkge1xuICAgICAgZmluZEF1dGhvcigpO1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH1cbiAgXG4gICAgLy8gYXN5bmMgd2l0aCBwcm9taXNlc1xuICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQG1ldGhvZCBjYXRjaFxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXG4gICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG4gICdjYXRjaCc6IGZ1bmN0aW9uIF9jYXRjaChvblJlamVjdGlvbikge1xuICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3Rpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgICB2YXIgbG9jYWwgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9jYWwgPSBnbG9iYWw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9jYWwgPSBzZWxmO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbCA9IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seWZpbGwgZmFpbGVkIGJlY2F1c2UgZ2xvYmFsIG9iamVjdCBpcyB1bmF2YWlsYWJsZSBpbiB0aGlzIGVudmlyb25tZW50Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgUCA9IGxvY2FsLlByb21pc2U7XG5cbiAgICBpZiAoUCkge1xuICAgICAgICB2YXIgcHJvbWlzZVRvU3RyaW5nID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2VUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChQLnJlc29sdmUoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIHNpbGVudGx5IGlnbm9yZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9taXNlVG9TdHJpbmcgPT09ICdbb2JqZWN0IFByb21pc2VdJyAmJiAhUC5jYXN0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbC5Qcm9taXNlID0gUHJvbWlzZTtcbn1cblxuLy8gU3RyYW5nZSBjb21wYXQuLlxuUHJvbWlzZS5wb2x5ZmlsbCA9IHBvbHlmaWxsO1xuUHJvbWlzZS5Qcm9taXNlID0gUHJvbWlzZTtcblxucmV0dXJuIFByb21pc2U7XG5cbn0pKSk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKCdfcHJvY2VzcycpLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5bGN6WXRjSEp2YldselpTOWthWE4wTDJWek5pMXdjbTl0YVhObExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQklpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lGY2JpQXFJRUJ2ZG1WeWRtbGxkeUJsY3pZdGNISnZiV2x6WlNBdElHRWdkR2x1ZVNCcGJYQnNaVzFsYm5SaGRHbHZiaUJ2WmlCUWNtOXRhWE5sY3k5Qkt5NWNiaUFxSUVCamIzQjVjbWxuYUhRZ1EyOXdlWEpwWjJoMElDaGpLU0F5TURFMElGbGxhSFZrWVNCTFlYUjZMQ0JVYjIwZ1JHRnNaU3dnVTNSbFptRnVJRkJsYm01bGNpQmhibVFnWTI5dWRISnBZblYwYjNKeklDaERiMjUyWlhKemFXOXVJSFJ2SUVWVE5pQkJVRWtnWW5rZ1NtRnJaU0JCY21Ob2FXSmhiR1FwWEc0Z0tpQkFiR2xqWlc1elpTQWdJRXhwWTJWdWMyVmtJSFZ1WkdWeUlFMUpWQ0JzYVdObGJuTmxYRzRnS2lBZ0lDQWdJQ0FnSUNBZ0lGTmxaU0JvZEhSd2N6b3ZMM0poZHk1bmFYUm9kV0oxYzJWeVkyOXVkR1Z1ZEM1amIyMHZjM1JsWm1GdWNHVnVibVZ5TDJWek5pMXdjbTl0YVhObEwyMWhjM1JsY2k5TVNVTkZUbE5GWEc0Z0tpQkFkbVZ5YzJsdmJpQWdJRFF1TUM0MVhHNGdLaTljYmx4dUtHWjFibU4wYVc5dUlDaG5iRzlpWVd3c0lHWmhZM1J2Y25rcElIdGNiaUFnSUNCMGVYQmxiMllnWlhod2IzSjBjeUE5UFQwZ0oyOWlhbVZqZENjZ0ppWWdkSGx3Wlc5bUlHMXZaSFZzWlNBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NnUHlCdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaaFkzUnZjbmtvS1NBNlhHNGdJQ0FnZEhsd1pXOW1JR1JsWm1sdVpTQTlQVDBnSjJaMWJtTjBhVzl1SnlBbUppQmtaV1pwYm1VdVlXMWtJRDhnWkdWbWFXNWxLR1poWTNSdmNua3BJRHBjYmlBZ0lDQW9aMnh2WW1Gc0xrVlRObEJ5YjIxcGMyVWdQU0JtWVdOMGIzSjVLQ2twTzF4dWZTaDBhR2x6TENBb1puVnVZM1JwYjI0Z0tDa2dleUFuZFhObElITjBjbWxqZENjN1hHNWNibVoxYm1OMGFXOXVJRzlpYW1WamRFOXlSblZ1WTNScGIyNG9lQ2tnZTF4dUlDQnlaWFIxY200Z2RIbHdaVzltSUhnZ1BUMDlJQ2RtZFc1amRHbHZiaWNnZkh3Z2RIbHdaVzltSUhnZ1BUMDlJQ2R2WW1wbFkzUW5JQ1ltSUhnZ0lUMDlJRzUxYkd3N1hHNTlYRzVjYm1aMWJtTjBhVzl1SUdselJuVnVZM1JwYjI0b2VDa2dlMXh1SUNCeVpYUjFjbTRnZEhsd1pXOW1JSGdnUFQwOUlDZG1kVzVqZEdsdmJpYzdYRzU5WEc1Y2JuWmhjaUJmYVhOQmNuSmhlU0E5SUhWdVpHVm1hVzVsWkR0Y2JtbG1JQ2doUVhKeVlYa3VhWE5CY25KaGVTa2dlMXh1SUNCZmFYTkJjbkpoZVNBOUlHWjFibU4wYVc5dUlDaDRLU0I3WEc0Z0lDQWdjbVYwZFhKdUlFOWlhbVZqZEM1d2NtOTBiM1I1Y0dVdWRHOVRkSEpwYm1jdVkyRnNiQ2g0S1NBOVBUMGdKMXR2WW1wbFkzUWdRWEp5WVhsZEp6dGNiaUFnZlR0Y2JuMGdaV3h6WlNCN1hHNGdJRjlwYzBGeWNtRjVJRDBnUVhKeVlYa3VhWE5CY25KaGVUdGNibjFjYmx4dWRtRnlJR2x6UVhKeVlYa2dQU0JmYVhOQmNuSmhlVHRjYmx4dWRtRnlJR3hsYmlBOUlEQTdYRzUyWVhJZ2RtVnlkSGhPWlhoMElEMGdkVzVrWldacGJtVmtPMXh1ZG1GeUlHTjFjM1J2YlZOamFHVmtkV3hsY2tadUlEMGdkVzVrWldacGJtVmtPMXh1WEc1MllYSWdZWE5oY0NBOUlHWjFibU4wYVc5dUlHRnpZWEFvWTJGc2JHSmhZMnNzSUdGeVp5a2dlMXh1SUNCeGRXVjFaVnRzWlc1ZElEMGdZMkZzYkdKaFkyczdYRzRnSUhGMVpYVmxXMnhsYmlBcklERmRJRDBnWVhKbk8xeHVJQ0JzWlc0Z0t6MGdNanRjYmlBZ2FXWWdLR3hsYmlBOVBUMGdNaWtnZTF4dUlDQWdJQzh2SUVsbUlHeGxiaUJwY3lBeUxDQjBhR0YwSUcxbFlXNXpJSFJvWVhRZ2QyVWdibVZsWkNCMGJ5QnpZMmhsWkhWc1pTQmhiaUJoYzNsdVl5Qm1iSFZ6YUM1Y2JpQWdJQ0F2THlCSlppQmhaR1JwZEdsdmJtRnNJR05oYkd4aVlXTnJjeUJoY21VZ2NYVmxkV1ZrSUdKbFptOXlaU0IwYUdVZ2NYVmxkV1VnYVhNZ1pteDFjMmhsWkN3Z2RHaGxlVnh1SUNBZ0lDOHZJSGRwYkd3Z1ltVWdjSEp2WTJWemMyVmtJR0o1SUhSb2FYTWdabXgxYzJnZ2RHaGhkQ0IzWlNCaGNtVWdjMk5vWldSMWJHbHVaeTVjYmlBZ0lDQnBaaUFvWTNWemRHOXRVMk5vWldSMWJHVnlSbTRwSUh0Y2JpQWdJQ0FnSUdOMWMzUnZiVk5qYUdWa2RXeGxja1p1S0dac2RYTm9LVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2MyTm9aV1IxYkdWR2JIVnphQ2dwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVmVHRjYmx4dVpuVnVZM1JwYjI0Z2MyVjBVMk5vWldSMWJHVnlLSE5qYUdWa2RXeGxSbTRwSUh0Y2JpQWdZM1Z6ZEc5dFUyTm9aV1IxYkdWeVJtNGdQU0J6WTJobFpIVnNaVVp1TzF4dWZWeHVYRzVtZFc1amRHbHZiaUJ6WlhSQmMyRndLR0Z6WVhCR2Jpa2dlMXh1SUNCaGMyRndJRDBnWVhOaGNFWnVPMXh1ZlZ4dVhHNTJZWElnWW5KdmQzTmxjbGRwYm1SdmR5QTlJSFI1Y0dWdlppQjNhVzVrYjNjZ0lUMDlJQ2QxYm1SbFptbHVaV1FuSUQ4Z2QybHVaRzkzSURvZ2RXNWtaV1pwYm1Wa08xeHVkbUZ5SUdKeWIzZHpaWEpIYkc5aVlXd2dQU0JpY205M2MyVnlWMmx1Wkc5M0lIeDhJSHQ5TzF4dWRtRnlJRUp5YjNkelpYSk5kWFJoZEdsdmJrOWljMlZ5ZG1WeUlEMGdZbkp2ZDNObGNrZHNiMkpoYkM1TmRYUmhkR2x2Yms5aWMyVnlkbVZ5SUh4OElHSnliM2R6WlhKSGJHOWlZV3d1VjJWaVMybDBUWFYwWVhScGIyNVBZbk5sY25abGNqdGNiblpoY2lCcGMwNXZaR1VnUFNCMGVYQmxiMllnYzJWc1ppQTlQVDBnSjNWdVpHVm1hVzVsWkNjZ0ppWWdkSGx3Wlc5bUlIQnliMk5sYzNNZ0lUMDlJQ2QxYm1SbFptbHVaV1FuSUNZbUlDaDdmU2t1ZEc5VGRISnBibWN1WTJGc2JDaHdjbTlqWlhOektTQTlQVDBnSjF0dlltcGxZM1FnY0hKdlkyVnpjMTBuTzF4dVhHNHZMeUIwWlhOMElHWnZjaUIzWldJZ2QyOXlhMlZ5SUdKMWRDQnViM1FnYVc0Z1NVVXhNRnh1ZG1GeUlHbHpWMjl5YTJWeUlEMGdkSGx3Wlc5bUlGVnBiblE0UTJ4aGJYQmxaRUZ5Y21GNUlDRTlQU0FuZFc1a1pXWnBibVZrSnlBbUppQjBlWEJsYjJZZ2FXMXdiM0owVTJOeWFYQjBjeUFoUFQwZ0ozVnVaR1ZtYVc1bFpDY2dKaVlnZEhsd1pXOW1JRTFsYzNOaFoyVkRhR0Z1Ym1Wc0lDRTlQU0FuZFc1a1pXWnBibVZrSnp0Y2JseHVMeThnYm05a1pWeHVablZ1WTNScGIyNGdkWE5sVG1WNGRGUnBZMnNvS1NCN1hHNGdJQzh2SUc1dlpHVWdkbVZ5YzJsdmJpQXdMakV3TG5nZ1pHbHpjR3hoZVhNZ1lTQmtaWEJ5WldOaGRHbHZiaUIzWVhKdWFXNW5JSGRvWlc0Z2JtVjRkRlJwWTJzZ2FYTWdkWE5sWkNCeVpXTjFjbk5wZG1Wc2VWeHVJQ0F2THlCelpXVWdhSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMMk4xYW05cWN5OTNhR1Z1TDJsemMzVmxjeTgwTVRBZ1ptOXlJR1JsZEdGcGJITmNiaUFnY21WMGRYSnVJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdjSEp2WTJWemN5NXVaWGgwVkdsamF5aG1iSFZ6YUNrN1hHNGdJSDA3WEc1OVhHNWNiaTh2SUhabGNuUjRYRzVtZFc1amRHbHZiaUIxYzJWV1pYSjBlRlJwYldWeUtDa2dlMXh1SUNCcFppQW9kSGx3Wlc5bUlIWmxjblI0VG1WNGRDQWhQVDBnSjNWdVpHVm1hVzVsWkNjcElIdGNiaUFnSUNCeVpYUjFjbTRnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ2RtVnlkSGhPWlhoMEtHWnNkWE5vS1R0Y2JpQWdJQ0I5TzF4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUhWelpWTmxkRlJwYldWdmRYUW9LVHRjYm4xY2JseHVablZ1WTNScGIyNGdkWE5sVFhWMFlYUnBiMjVQWW5ObGNuWmxjaWdwSUh0Y2JpQWdkbUZ5SUdsMFpYSmhkR2x2Ym5NZ1BTQXdPMXh1SUNCMllYSWdiMkp6WlhKMlpYSWdQU0J1WlhjZ1FuSnZkM05sY2sxMWRHRjBhVzl1VDJKelpYSjJaWElvWm14MWMyZ3BPMXh1SUNCMllYSWdibTlrWlNBOUlHUnZZM1Z0Wlc1MExtTnlaV0YwWlZSbGVIUk9iMlJsS0NjbktUdGNiaUFnYjJKelpYSjJaWEl1YjJKelpYSjJaU2h1YjJSbExDQjdJR05vWVhKaFkzUmxja1JoZEdFNklIUnlkV1VnZlNrN1hHNWNiaUFnY21WMGRYSnVJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J1YjJSbExtUmhkR0VnUFNCcGRHVnlZWFJwYjI1eklEMGdLeXRwZEdWeVlYUnBiMjV6SUNVZ01qdGNiaUFnZlR0Y2JuMWNibHh1THk4Z2QyVmlJSGR2Y210bGNseHVablZ1WTNScGIyNGdkWE5sVFdWemMyRm5aVU5vWVc1dVpXd29LU0I3WEc0Z0lIWmhjaUJqYUdGdWJtVnNJRDBnYm1WM0lFMWxjM05oWjJWRGFHRnVibVZzS0NrN1hHNGdJR05vWVc1dVpXd3VjRzl5ZERFdWIyNXRaWE56WVdkbElEMGdabXgxYzJnN1hHNGdJSEpsZEhWeWJpQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlHTm9ZVzV1Wld3dWNHOXlkREl1Y0c5emRFMWxjM05oWjJVb01DazdYRzRnSUgwN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUhWelpWTmxkRlJwYldWdmRYUW9LU0I3WEc0Z0lDOHZJRk4wYjNKbElITmxkRlJwYldWdmRYUWdjbVZtWlhKbGJtTmxJSE52SUdWek5pMXdjbTl0YVhObElIZHBiR3dnWW1VZ2RXNWhabVpsWTNSbFpDQmllVnh1SUNBdkx5QnZkR2hsY2lCamIyUmxJRzF2WkdsbWVXbHVaeUJ6WlhSVWFXMWxiM1YwSUNoc2FXdGxJSE5wYm05dUxuVnpaVVpoYTJWVWFXMWxjbk1vS1NsY2JpQWdkbUZ5SUdkc2IySmhiRk5sZEZScGJXVnZkWFFnUFNCelpYUlVhVzFsYjNWME8xeHVJQ0J5WlhSMWNtNGdablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQm5iRzlpWVd4VFpYUlVhVzFsYjNWMEtHWnNkWE5vTENBeEtUdGNiaUFnZlR0Y2JuMWNibHh1ZG1GeUlIRjFaWFZsSUQwZ2JtVjNJRUZ5Y21GNUtERXdNREFwTzF4dVpuVnVZM1JwYjI0Z1pteDFjMmdvS1NCN1hHNGdJR1p2Y2lBb2RtRnlJR2tnUFNBd095QnBJRHdnYkdWdU95QnBJQ3M5SURJcElIdGNiaUFnSUNCMllYSWdZMkZzYkdKaFkyc2dQU0J4ZFdWMVpWdHBYVHRjYmlBZ0lDQjJZWElnWVhKbklEMGdjWFZsZFdWYmFTQXJJREZkTzF4dVhHNGdJQ0FnWTJGc2JHSmhZMnNvWVhKbktUdGNibHh1SUNBZ0lIRjFaWFZsVzJsZElEMGdkVzVrWldacGJtVmtPMXh1SUNBZ0lIRjFaWFZsVzJrZ0t5QXhYU0E5SUhWdVpHVm1hVzVsWkR0Y2JpQWdmVnh1WEc0Z0lHeGxiaUE5SURBN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUdGMGRHVnRjSFJXWlhKMGVDZ3BJSHRjYmlBZ2RISjVJSHRjYmlBZ0lDQjJZWElnY2lBOUlISmxjWFZwY21VN1hHNGdJQ0FnZG1GeUlIWmxjblI0SUQwZ2NpZ25kbVZ5ZEhnbktUdGNiaUFnSUNCMlpYSjBlRTVsZUhRZ1BTQjJaWEowZUM1eWRXNVBia3h2YjNBZ2ZId2dkbVZ5ZEhndWNuVnVUMjVEYjI1MFpYaDBPMXh1SUNBZ0lISmxkSFZ5YmlCMWMyVldaWEowZUZScGJXVnlLQ2s3WEc0Z0lIMGdZMkYwWTJnZ0tHVXBJSHRjYmlBZ0lDQnlaWFIxY200Z2RYTmxVMlYwVkdsdFpXOTFkQ2dwTzF4dUlDQjlYRzU5WEc1Y2JuWmhjaUJ6WTJobFpIVnNaVVpzZFhOb0lEMGdkVzVrWldacGJtVmtPMXh1THk4Z1JHVmphV1JsSUhkb1lYUWdZWE41Ym1NZ2JXVjBhRzlrSUhSdklIVnpaU0IwYnlCMGNtbG5aMlZ5YVc1bklIQnliMk5sYzNOcGJtY2diMllnY1hWbGRXVmtJR05oYkd4aVlXTnJjenBjYm1sbUlDaHBjMDV2WkdVcElIdGNiaUFnYzJOb1pXUjFiR1ZHYkhWemFDQTlJSFZ6WlU1bGVIUlVhV05yS0NrN1hHNTlJR1ZzYzJVZ2FXWWdLRUp5YjNkelpYSk5kWFJoZEdsdmJrOWljMlZ5ZG1WeUtTQjdYRzRnSUhOamFHVmtkV3hsUm14MWMyZ2dQU0IxYzJWTmRYUmhkR2x2Yms5aWMyVnlkbVZ5S0NrN1hHNTlJR1ZzYzJVZ2FXWWdLR2x6VjI5eWEyVnlLU0I3WEc0Z0lITmphR1ZrZFd4bFJteDFjMmdnUFNCMWMyVk5aWE56WVdkbFEyaGhibTVsYkNncE8xeHVmU0JsYkhObElHbG1JQ2hpY205M2MyVnlWMmx1Wkc5M0lEMDlQU0IxYm1SbFptbHVaV1FnSmlZZ2RIbHdaVzltSUhKbGNYVnBjbVVnUFQwOUlDZG1kVzVqZEdsdmJpY3BJSHRjYmlBZ2MyTm9aV1IxYkdWR2JIVnphQ0E5SUdGMGRHVnRjSFJXWlhKMGVDZ3BPMXh1ZlNCbGJITmxJSHRjYmlBZ2MyTm9aV1IxYkdWR2JIVnphQ0E5SUhWelpWTmxkRlJwYldWdmRYUW9LVHRjYm4xY2JseHVablZ1WTNScGIyNGdkR2hsYmlodmJrWjFiR1pwYkd4dFpXNTBMQ0J2YmxKbGFtVmpkR2x2YmlrZ2UxeHVJQ0IyWVhJZ1gyRnlaM1Z0Wlc1MGN5QTlJR0Z5WjNWdFpXNTBjenRjYmx4dUlDQjJZWElnY0dGeVpXNTBJRDBnZEdocGN6dGNibHh1SUNCMllYSWdZMmhwYkdRZ1BTQnVaWGNnZEdocGN5NWpiMjV6ZEhKMVkzUnZjaWh1YjI5d0tUdGNibHh1SUNCcFppQW9ZMmhwYkdSYlVGSlBUVWxUUlY5SlJGMGdQVDA5SUhWdVpHVm1hVzVsWkNrZ2UxeHVJQ0FnSUcxaGEyVlFjbTl0YVhObEtHTm9hV3hrS1R0Y2JpQWdmVnh1WEc0Z0lIWmhjaUJmYzNSaGRHVWdQU0J3WVhKbGJuUXVYM04wWVhSbE8xeHVYRzRnSUdsbUlDaGZjM1JoZEdVcElIdGNiaUFnSUNBb1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdkbUZ5SUdOaGJHeGlZV05ySUQwZ1gyRnlaM1Z0Wlc1MGMxdGZjM1JoZEdVZ0xTQXhYVHRjYmlBZ0lDQWdJR0Z6WVhBb1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdhVzUyYjJ0bFEyRnNiR0poWTJzb1gzTjBZWFJsTENCamFHbHNaQ3dnWTJGc2JHSmhZMnNzSUhCaGNtVnVkQzVmY21WemRXeDBLVHRjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJSDBwS0NrN1hHNGdJSDBnWld4elpTQjdYRzRnSUNBZ2MzVmljMk55YVdKbEtIQmhjbVZ1ZEN3Z1kyaHBiR1FzSUc5dVJuVnNabWxzYkcxbGJuUXNJRzl1VW1WcVpXTjBhVzl1S1R0Y2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCamFHbHNaRHRjYm4xY2JseHVMeW9xWEc0Z0lHQlFjbTl0YVhObExuSmxjMjlzZG1WZ0lISmxkSFZ5Ym5NZ1lTQndjbTl0YVhObElIUm9ZWFFnZDJsc2JDQmlaV052YldVZ2NtVnpiMngyWldRZ2QybDBhQ0IwYUdWY2JpQWdjR0Z6YzJWa0lHQjJZV3gxWldBdUlFbDBJR2x6SUhOb2IzSjBhR0Z1WkNCbWIzSWdkR2hsSUdadmJHeHZkMmx1WnpwY2JseHVJQ0JnWUdCcVlYWmhjMk55YVhCMFhHNGdJR3hsZENCd2NtOXRhWE5sSUQwZ2JtVjNJRkJ5YjIxcGMyVW9ablZ1WTNScGIyNG9jbVZ6YjJ4MlpTd2djbVZxWldOMEtYdGNiaUFnSUNCeVpYTnZiSFpsS0RFcE8xeHVJQ0I5S1R0Y2JseHVJQ0J3Y205dGFYTmxMblJvWlc0b1puVnVZM1JwYjI0b2RtRnNkV1VwZTF4dUlDQWdJQzh2SUhaaGJIVmxJRDA5UFNBeFhHNGdJSDBwTzF4dUlDQmdZR0JjYmx4dUlDQkpibk4wWldGa0lHOW1JSGR5YVhScGJtY2dkR2hsSUdGaWIzWmxMQ0I1YjNWeUlHTnZaR1VnYm05M0lITnBiWEJzZVNCaVpXTnZiV1Z6SUhSb1pTQm1iMnhzYjNkcGJtYzZYRzVjYmlBZ1lHQmdhbUYyWVhOamNtbHdkRnh1SUNCc1pYUWdjSEp2YldselpTQTlJRkJ5YjIxcGMyVXVjbVZ6YjJ4MlpTZ3hLVHRjYmx4dUlDQndjbTl0YVhObExuUm9aVzRvWm5WdVkzUnBiMjRvZG1Gc2RXVXBlMXh1SUNBZ0lDOHZJSFpoYkhWbElEMDlQU0F4WEc0Z0lIMHBPMXh1SUNCZ1lHQmNibHh1SUNCQWJXVjBhRzlrSUhKbGMyOXNkbVZjYmlBZ1FITjBZWFJwWTF4dUlDQkFjR0Z5WVcwZ2UwRnVlWDBnZG1Gc2RXVWdkbUZzZFdVZ2RHaGhkQ0IwYUdVZ2NtVjBkWEp1WldRZ2NISnZiV2x6WlNCM2FXeHNJR0psSUhKbGMyOXNkbVZrSUhkcGRHaGNiaUFnVlhObFpuVnNJR1p2Y2lCMGIyOXNhVzVuTGx4dUlDQkFjbVYwZFhKdUlIdFFjbTl0YVhObGZTQmhJSEJ5YjIxcGMyVWdkR2hoZENCM2FXeHNJR0psWTI5dFpTQm1kV3htYVd4c1pXUWdkMmwwYUNCMGFHVWdaMmwyWlc1Y2JpQWdZSFpoYkhWbFlGeHVLaTljYm1aMWJtTjBhVzl1SUhKbGMyOXNkbVVvYjJKcVpXTjBLU0I3WEc0Z0lDOHFhbk5vYVc1MElIWmhiR2xrZEdocGN6cDBjblZsSUNvdlhHNGdJSFpoY2lCRGIyNXpkSEoxWTNSdmNpQTlJSFJvYVhNN1hHNWNiaUFnYVdZZ0tHOWlhbVZqZENBbUppQjBlWEJsYjJZZ2IySnFaV04wSUQwOVBTQW5iMkpxWldOMEp5QW1KaUJ2WW1wbFkzUXVZMjl1YzNSeWRXTjBiM0lnUFQwOUlFTnZibk4wY25WamRHOXlLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHOWlhbVZqZER0Y2JpQWdmVnh1WEc0Z0lIWmhjaUJ3Y205dGFYTmxJRDBnYm1WM0lFTnZibk4wY25WamRHOXlLRzV2YjNBcE8xeHVJQ0JmY21WemIyeDJaU2h3Y205dGFYTmxMQ0J2WW1wbFkzUXBPMXh1SUNCeVpYUjFjbTRnY0hKdmJXbHpaVHRjYm4xY2JseHVkbUZ5SUZCU1QwMUpVMFZmU1VRZ1BTQk5ZWFJvTG5KaGJtUnZiU2dwTG5SdlUzUnlhVzVuS0RNMktTNXpkV0p6ZEhKcGJtY29NVFlwTzF4dVhHNW1kVzVqZEdsdmJpQnViMjl3S0NrZ2UzMWNibHh1ZG1GeUlGQkZUa1JKVGtjZ1BTQjJiMmxrSURBN1hHNTJZWElnUmxWTVJrbE1URVZFSUQwZ01UdGNiblpoY2lCU1JVcEZRMVJGUkNBOUlESTdYRzVjYm5aaGNpQkhSVlJmVkVoRlRsOUZVbEpQVWlBOUlHNWxkeUJGY25KdmNrOWlhbVZqZENncE8xeHVYRzVtZFc1amRHbHZiaUJ6Wld4bVJuVnNabWxzYkcxbGJuUW9LU0I3WEc0Z0lISmxkSFZ5YmlCdVpYY2dWSGx3WlVWeWNtOXlLRndpV1c5MUlHTmhibTV2ZENCeVpYTnZiSFpsSUdFZ2NISnZiV2x6WlNCM2FYUm9JR2wwYzJWc1psd2lLVHRjYm4xY2JseHVablZ1WTNScGIyNGdZMkZ1Ym05MFVtVjBkWEp1VDNkdUtDa2dlMXh1SUNCeVpYUjFjbTRnYm1WM0lGUjVjR1ZGY25KdmNpZ25RU0J3Y205dGFYTmxjeUJqWVd4c1ltRmpheUJqWVc1dWIzUWdjbVYwZFhKdUlIUm9ZWFFnYzJGdFpTQndjbTl0YVhObExpY3BPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQm5aWFJVYUdWdUtIQnliMjFwYzJVcElIdGNiaUFnZEhKNUlIdGNiaUFnSUNCeVpYUjFjbTRnY0hKdmJXbHpaUzUwYUdWdU8xeHVJQ0I5SUdOaGRHTm9JQ2hsY25KdmNpa2dlMXh1SUNBZ0lFZEZWRjlVU0VWT1gwVlNVazlTTG1WeWNtOXlJRDBnWlhKeWIzSTdYRzRnSUNBZ2NtVjBkWEp1SUVkRlZGOVVTRVZPWDBWU1VrOVNPMXh1SUNCOVhHNTlYRzVjYm1aMWJtTjBhVzl1SUhSeWVWUm9aVzRvZEdobGJpd2dkbUZzZFdVc0lHWjFiR1pwYkd4dFpXNTBTR0Z1Wkd4bGNpd2djbVZxWldOMGFXOXVTR0Z1Wkd4bGNpa2dlMXh1SUNCMGNua2dlMXh1SUNBZ0lIUm9aVzR1WTJGc2JDaDJZV3gxWlN3Z1puVnNabWxzYkcxbGJuUklZVzVrYkdWeUxDQnlaV3BsWTNScGIyNUlZVzVrYkdWeUtUdGNiaUFnZlNCallYUmphQ0FvWlNrZ2UxeHVJQ0FnSUhKbGRIVnliaUJsTzF4dUlDQjlYRzU5WEc1Y2JtWjFibU4wYVc5dUlHaGhibVJzWlVadmNtVnBaMjVVYUdWdVlXSnNaU2h3Y205dGFYTmxMQ0IwYUdWdVlXSnNaU3dnZEdobGJpa2dlMXh1SUNCaGMyRndLR1oxYm1OMGFXOXVJQ2h3Y205dGFYTmxLU0I3WEc0Z0lDQWdkbUZ5SUhObFlXeGxaQ0E5SUdaaGJITmxPMXh1SUNBZ0lIWmhjaUJsY25KdmNpQTlJSFJ5ZVZSb1pXNG9kR2hsYml3Z2RHaGxibUZpYkdVc0lHWjFibU4wYVc5dUlDaDJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ2FXWWdLSE5sWVd4bFpDa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNDdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnpaV0ZzWldRZ1BTQjBjblZsTzF4dUlDQWdJQ0FnYVdZZ0tIUm9aVzVoWW14bElDRTlQU0IyWVd4MVpTa2dlMXh1SUNBZ0lDQWdJQ0JmY21WemIyeDJaU2h3Y205dGFYTmxMQ0IyWVd4MVpTazdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQm1kV3htYVd4c0tIQnliMjFwYzJVc0lIWmhiSFZsS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5TENCbWRXNWpkR2x2YmlBb2NtVmhjMjl1S1NCN1hHNGdJQ0FnSUNCcFppQW9jMlZoYkdWa0tTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJqdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lITmxZV3hsWkNBOUlIUnlkV1U3WEc1Y2JpQWdJQ0FnSUY5eVpXcGxZM1FvY0hKdmJXbHpaU3dnY21WaGMyOXVLVHRjYmlBZ0lDQjlMQ0FuVTJWMGRHeGxPaUFuSUNzZ0tIQnliMjFwYzJVdVgyeGhZbVZzSUh4OElDY2dkVzVyYm05M2JpQndjbTl0YVhObEp5a3BPMXh1WEc0Z0lDQWdhV1lnS0NGelpXRnNaV1FnSmlZZ1pYSnliM0lwSUh0Y2JpQWdJQ0FnSUhObFlXeGxaQ0E5SUhSeWRXVTdYRzRnSUNBZ0lDQmZjbVZxWldOMEtIQnliMjFwYzJVc0lHVnljbTl5S1R0Y2JpQWdJQ0I5WEc0Z0lIMHNJSEJ5YjIxcGMyVXBPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQm9ZVzVrYkdWUGQyNVVhR1Z1WVdKc1pTaHdjbTl0YVhObExDQjBhR1Z1WVdKc1pTa2dlMXh1SUNCcFppQW9kR2hsYm1GaWJHVXVYM04wWVhSbElEMDlQU0JHVlV4R1NVeE1SVVFwSUh0Y2JpQWdJQ0JtZFd4bWFXeHNLSEJ5YjIxcGMyVXNJSFJvWlc1aFlteGxMbDl5WlhOMWJIUXBPMXh1SUNCOUlHVnNjMlVnYVdZZ0tIUm9aVzVoWW14bExsOXpkR0YwWlNBOVBUMGdVa1ZLUlVOVVJVUXBJSHRjYmlBZ0lDQmZjbVZxWldOMEtIQnliMjFwYzJVc0lIUm9aVzVoWW14bExsOXlaWE4xYkhRcE8xeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lITjFZbk5qY21saVpTaDBhR1Z1WVdKc1pTd2dkVzVrWldacGJtVmtMQ0JtZFc1amRHbHZiaUFvZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmZjbVZ6YjJ4MlpTaHdjbTl0YVhObExDQjJZV3gxWlNrN1hHNGdJQ0FnZlN3Z1puVnVZM1JwYjI0Z0tISmxZWE52YmlrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUY5eVpXcGxZM1FvY0hKdmJXbHpaU3dnY21WaGMyOXVLVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVmVnh1WEc1bWRXNWpkR2x2YmlCb1lXNWtiR1ZOWVhsaVpWUm9aVzVoWW14bEtIQnliMjFwYzJVc0lHMWhlV0psVkdobGJtRmliR1VzSUhSb1pXNGtKQ2tnZTF4dUlDQnBaaUFvYldGNVltVlVhR1Z1WVdKc1pTNWpiMjV6ZEhKMVkzUnZjaUE5UFQwZ2NISnZiV2x6WlM1amIyNXpkSEoxWTNSdmNpQW1KaUIwYUdWdUpDUWdQVDA5SUhSb1pXNGdKaVlnYldGNVltVlVhR1Z1WVdKc1pTNWpiMjV6ZEhKMVkzUnZjaTV5WlhOdmJIWmxJRDA5UFNCeVpYTnZiSFpsS1NCN1hHNGdJQ0FnYUdGdVpHeGxUM2R1VkdobGJtRmliR1VvY0hKdmJXbHpaU3dnYldGNVltVlVhR1Z1WVdKc1pTazdYRzRnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdhV1lnS0hSb1pXNGtKQ0E5UFQwZ1IwVlVYMVJJUlU1ZlJWSlNUMUlwSUh0Y2JpQWdJQ0FnSUY5eVpXcGxZM1FvY0hKdmJXbHpaU3dnUjBWVVgxUklSVTVmUlZKU1QxSXVaWEp5YjNJcE8xeHVJQ0FnSUgwZ1pXeHpaU0JwWmlBb2RHaGxiaVFrSUQwOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJR1oxYkdacGJHd29jSEp2YldselpTd2diV0Y1WW1WVWFHVnVZV0pzWlNrN1hHNGdJQ0FnZlNCbGJITmxJR2xtSUNocGMwWjFibU4wYVc5dUtIUm9aVzRrSkNrcElIdGNiaUFnSUNBZ0lHaGhibVJzWlVadmNtVnBaMjVVYUdWdVlXSnNaU2h3Y205dGFYTmxMQ0J0WVhsaVpWUm9aVzVoWW14bExDQjBhR1Z1SkNRcE8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0JtZFd4bWFXeHNLSEJ5YjIxcGMyVXNJRzFoZVdKbFZHaGxibUZpYkdVcE8xeHVJQ0FnSUgxY2JpQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQmZjbVZ6YjJ4MlpTaHdjbTl0YVhObExDQjJZV3gxWlNrZ2UxeHVJQ0JwWmlBb2NISnZiV2x6WlNBOVBUMGdkbUZzZFdVcElIdGNiaUFnSUNCZmNtVnFaV04wS0hCeWIyMXBjMlVzSUhObGJHWkdkV3htYVd4c2JXVnVkQ2dwS1R0Y2JpQWdmU0JsYkhObElHbG1JQ2h2WW1wbFkzUlBja1oxYm1OMGFXOXVLSFpoYkhWbEtTa2dlMXh1SUNBZ0lHaGhibVJzWlUxaGVXSmxWR2hsYm1GaWJHVW9jSEp2YldselpTd2dkbUZzZFdVc0lHZGxkRlJvWlc0b2RtRnNkV1VwS1R0Y2JpQWdmU0JsYkhObElIdGNiaUFnSUNCbWRXeG1hV3hzS0hCeWIyMXBjMlVzSUhaaGJIVmxLVHRjYmlBZ2ZWeHVmVnh1WEc1bWRXNWpkR2x2YmlCd2RXSnNhWE5vVW1WcVpXTjBhVzl1S0hCeWIyMXBjMlVwSUh0Y2JpQWdhV1lnS0hCeWIyMXBjMlV1WDI5dVpYSnliM0lwSUh0Y2JpQWdJQ0J3Y205dGFYTmxMbDl2Ym1WeWNtOXlLSEJ5YjIxcGMyVXVYM0psYzNWc2RDazdYRzRnSUgxY2JseHVJQ0J3ZFdKc2FYTm9LSEJ5YjIxcGMyVXBPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQm1kV3htYVd4c0tIQnliMjFwYzJVc0lIWmhiSFZsS1NCN1hHNGdJR2xtSUNod2NtOXRhWE5sTGw5emRHRjBaU0FoUFQwZ1VFVk9SRWxPUnlrZ2UxeHVJQ0FnSUhKbGRIVnlianRjYmlBZ2ZWeHVYRzRnSUhCeWIyMXBjMlV1WDNKbGMzVnNkQ0E5SUhaaGJIVmxPMXh1SUNCd2NtOXRhWE5sTGw5emRHRjBaU0E5SUVaVlRFWkpURXhGUkR0Y2JseHVJQ0JwWmlBb2NISnZiV2x6WlM1ZmMzVmljMk55YVdKbGNuTXViR1Z1WjNSb0lDRTlQU0F3S1NCN1hHNGdJQ0FnWVhOaGNDaHdkV0pzYVhOb0xDQndjbTl0YVhObEtUdGNiaUFnZlZ4dWZWeHVYRzVtZFc1amRHbHZiaUJmY21WcVpXTjBLSEJ5YjIxcGMyVXNJSEpsWVhOdmJpa2dlMXh1SUNCcFppQW9jSEp2YldselpTNWZjM1JoZEdVZ0lUMDlJRkJGVGtSSlRrY3BJSHRjYmlBZ0lDQnlaWFIxY200N1hHNGdJSDFjYmlBZ2NISnZiV2x6WlM1ZmMzUmhkR1VnUFNCU1JVcEZRMVJGUkR0Y2JpQWdjSEp2YldselpTNWZjbVZ6ZFd4MElEMGdjbVZoYzI5dU8xeHVYRzRnSUdGellYQW9jSFZpYkdsemFGSmxhbVZqZEdsdmJpd2djSEp2YldselpTazdYRzU5WEc1Y2JtWjFibU4wYVc5dUlITjFZbk5qY21saVpTaHdZWEpsYm5Rc0lHTm9hV3hrTENCdmJrWjFiR1pwYkd4dFpXNTBMQ0J2YmxKbGFtVmpkR2x2YmlrZ2UxeHVJQ0IyWVhJZ1gzTjFZbk5qY21saVpYSnpJRDBnY0dGeVpXNTBMbDl6ZFdKelkzSnBZbVZ5Y3p0Y2JpQWdkbUZ5SUd4bGJtZDBhQ0E5SUY5emRXSnpZM0pwWW1WeWN5NXNaVzVuZEdnN1hHNWNiaUFnY0dGeVpXNTBMbDl2Ym1WeWNtOXlJRDBnYm5Wc2JEdGNibHh1SUNCZmMzVmljMk55YVdKbGNuTmJiR1Z1WjNSb1hTQTlJR05vYVd4a08xeHVJQ0JmYzNWaWMyTnlhV0psY25OYmJHVnVaM1JvSUNzZ1JsVk1Sa2xNVEVWRVhTQTlJRzl1Um5Wc1ptbHNiRzFsYm5RN1hHNGdJRjl6ZFdKelkzSnBZbVZ5YzF0c1pXNW5kR2dnS3lCU1JVcEZRMVJGUkYwZ1BTQnZibEpsYW1WamRHbHZianRjYmx4dUlDQnBaaUFvYkdWdVozUm9JRDA5UFNBd0lDWW1JSEJoY21WdWRDNWZjM1JoZEdVcElIdGNiaUFnSUNCaGMyRndLSEIxWW14cGMyZ3NJSEJoY21WdWRDazdYRzRnSUgxY2JuMWNibHh1Wm5WdVkzUnBiMjRnY0hWaWJHbHphQ2h3Y205dGFYTmxLU0I3WEc0Z0lIWmhjaUJ6ZFdKelkzSnBZbVZ5Y3lBOUlIQnliMjFwYzJVdVgzTjFZbk5qY21saVpYSnpPMXh1SUNCMllYSWdjMlYwZEd4bFpDQTlJSEJ5YjIxcGMyVXVYM04wWVhSbE8xeHVYRzRnSUdsbUlDaHpkV0p6WTNKcFltVnljeTVzWlc1bmRHZ2dQVDA5SURBcElIdGNiaUFnSUNCeVpYUjFjbTQ3WEc0Z0lIMWNibHh1SUNCMllYSWdZMmhwYkdRZ1BTQjFibVJsWm1sdVpXUXNYRzRnSUNBZ0lDQmpZV3hzWW1GamF5QTlJSFZ1WkdWbWFXNWxaQ3hjYmlBZ0lDQWdJR1JsZEdGcGJDQTlJSEJ5YjIxcGMyVXVYM0psYzNWc2REdGNibHh1SUNCbWIzSWdLSFpoY2lCcElEMGdNRHNnYVNBOElITjFZbk5qY21saVpYSnpMbXhsYm1kMGFEc2dhU0FyUFNBektTQjdYRzRnSUNBZ1kyaHBiR1FnUFNCemRXSnpZM0pwWW1WeWMxdHBYVHRjYmlBZ0lDQmpZV3hzWW1GamF5QTlJSE4xWW5OamNtbGlaWEp6VzJrZ0t5QnpaWFIwYkdWa1hUdGNibHh1SUNBZ0lHbG1JQ2hqYUdsc1pDa2dlMXh1SUNBZ0lDQWdhVzUyYjJ0bFEyRnNiR0poWTJzb2MyVjBkR3hsWkN3Z1kyaHBiR1FzSUdOaGJHeGlZV05yTENCa1pYUmhhV3dwTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQmpZV3hzWW1GamF5aGtaWFJoYVd3cE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lIQnliMjFwYzJVdVgzTjFZbk5qY21saVpYSnpMbXhsYm1kMGFDQTlJREE3WEc1OVhHNWNibVoxYm1OMGFXOXVJRVZ5Y205eVQySnFaV04wS0NrZ2UxeHVJQ0IwYUdsekxtVnljbTl5SUQwZ2JuVnNiRHRjYm4xY2JseHVkbUZ5SUZSU1dWOURRVlJEU0Y5RlVsSlBVaUE5SUc1bGR5QkZjbkp2Y2s5aWFtVmpkQ2dwTzF4dVhHNW1kVzVqZEdsdmJpQjBjbmxEWVhSamFDaGpZV3hzWW1GamF5d2daR1YwWVdsc0tTQjdYRzRnSUhSeWVTQjdYRzRnSUNBZ2NtVjBkWEp1SUdOaGJHeGlZV05yS0dSbGRHRnBiQ2s3WEc0Z0lIMGdZMkYwWTJnZ0tHVXBJSHRjYmlBZ0lDQlVVbGxmUTBGVVEwaGZSVkpTVDFJdVpYSnliM0lnUFNCbE8xeHVJQ0FnSUhKbGRIVnliaUJVVWxsZlEwRlVRMGhmUlZKU1QxSTdYRzRnSUgxY2JuMWNibHh1Wm5WdVkzUnBiMjRnYVc1MmIydGxRMkZzYkdKaFkyc29jMlYwZEd4bFpDd2djSEp2YldselpTd2dZMkZzYkdKaFkyc3NJR1JsZEdGcGJDa2dlMXh1SUNCMllYSWdhR0Z6UTJGc2JHSmhZMnNnUFNCcGMwWjFibU4wYVc5dUtHTmhiR3hpWVdOcktTeGNiaUFnSUNBZ0lIWmhiSFZsSUQwZ2RXNWtaV1pwYm1Wa0xGeHVJQ0FnSUNBZ1pYSnliM0lnUFNCMWJtUmxabWx1WldRc1hHNGdJQ0FnSUNCemRXTmpaV1ZrWldRZ1BTQjFibVJsWm1sdVpXUXNYRzRnSUNBZ0lDQm1ZV2xzWldRZ1BTQjFibVJsWm1sdVpXUTdYRzVjYmlBZ2FXWWdLR2hoYzBOaGJHeGlZV05yS1NCN1hHNGdJQ0FnZG1Gc2RXVWdQU0IwY25sRFlYUmphQ2hqWVd4c1ltRmpheXdnWkdWMFlXbHNLVHRjYmx4dUlDQWdJR2xtSUNoMllXeDFaU0E5UFQwZ1ZGSlpYME5CVkVOSVgwVlNVazlTS1NCN1hHNGdJQ0FnSUNCbVlXbHNaV1FnUFNCMGNuVmxPMXh1SUNBZ0lDQWdaWEp5YjNJZ1BTQjJZV3gxWlM1bGNuSnZjanRjYmlBZ0lDQWdJSFpoYkhWbElEMGdiblZzYkR0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdjM1ZqWTJWbFpHVmtJRDBnZEhKMVpUdGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9jSEp2YldselpTQTlQVDBnZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJRjl5WldwbFkzUW9jSEp2YldselpTd2dZMkZ1Ym05MFVtVjBkWEp1VDNkdUtDa3BPMXh1SUNBZ0lDQWdjbVYwZFhKdU8xeHVJQ0FnSUgxY2JpQWdmU0JsYkhObElIdGNiaUFnSUNCMllXeDFaU0E5SUdSbGRHRnBiRHRjYmlBZ0lDQnpkV05qWldWa1pXUWdQU0IwY25WbE8xeHVJQ0I5WEc1Y2JpQWdhV1lnS0hCeWIyMXBjMlV1WDNOMFlYUmxJQ0U5UFNCUVJVNUVTVTVIS1NCN1hHNGdJQ0FnTHk4Z2JtOXZjRnh1SUNCOUlHVnNjMlVnYVdZZ0tHaGhjME5oYkd4aVlXTnJJQ1ltSUhOMVkyTmxaV1JsWkNrZ2UxeHVJQ0FnSUNBZ1gzSmxjMjlzZG1Vb2NISnZiV2x6WlN3Z2RtRnNkV1VwTzF4dUlDQWdJSDBnWld4elpTQnBaaUFvWm1GcGJHVmtLU0I3WEc0Z0lDQWdJQ0JmY21WcVpXTjBLSEJ5YjIxcGMyVXNJR1Z5Y205eUtUdGNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tITmxkSFJzWldRZ1BUMDlJRVpWVEVaSlRFeEZSQ2tnZTF4dUlDQWdJQ0FnWm5Wc1ptbHNiQ2h3Y205dGFYTmxMQ0IyWVd4MVpTazdYRzRnSUNBZ2ZTQmxiSE5sSUdsbUlDaHpaWFIwYkdWa0lEMDlQU0JTUlVwRlExUkZSQ2tnZTF4dUlDQWdJQ0FnWDNKbGFtVmpkQ2h3Y205dGFYTmxMQ0IyWVd4MVpTazdYRzRnSUNBZ2ZWeHVmVnh1WEc1bWRXNWpkR2x2YmlCcGJtbDBhV0ZzYVhwbFVISnZiV2x6WlNod2NtOXRhWE5sTENCeVpYTnZiSFpsY2lrZ2UxeHVJQ0IwY25rZ2UxeHVJQ0FnSUhKbGMyOXNkbVZ5S0daMWJtTjBhVzl1SUhKbGMyOXNkbVZRY205dGFYTmxLSFpoYkhWbEtTQjdYRzRnSUNBZ0lDQmZjbVZ6YjJ4MlpTaHdjbTl0YVhObExDQjJZV3gxWlNrN1hHNGdJQ0FnZlN3Z1puVnVZM1JwYjI0Z2NtVnFaV04wVUhKdmJXbHpaU2h5WldGemIyNHBJSHRjYmlBZ0lDQWdJRjl5WldwbFkzUW9jSEp2YldselpTd2djbVZoYzI5dUtUdGNiaUFnSUNCOUtUdGNiaUFnZlNCallYUmphQ0FvWlNrZ2UxeHVJQ0FnSUY5eVpXcGxZM1FvY0hKdmJXbHpaU3dnWlNrN1hHNGdJSDFjYm4xY2JseHVkbUZ5SUdsa0lEMGdNRHRjYm1aMWJtTjBhVzl1SUc1bGVIUkpaQ2dwSUh0Y2JpQWdjbVYwZFhKdUlHbGtLeXM3WEc1OVhHNWNibVoxYm1OMGFXOXVJRzFoYTJWUWNtOXRhWE5sS0hCeWIyMXBjMlVwSUh0Y2JpQWdjSEp2YldselpWdFFVazlOU1ZORlgwbEVYU0E5SUdsa0t5czdYRzRnSUhCeWIyMXBjMlV1WDNOMFlYUmxJRDBnZFc1a1pXWnBibVZrTzF4dUlDQndjbTl0YVhObExsOXlaWE4xYkhRZ1BTQjFibVJsWm1sdVpXUTdYRzRnSUhCeWIyMXBjMlV1WDNOMVluTmpjbWxpWlhKeklEMGdXMTA3WEc1OVhHNWNibVoxYm1OMGFXOXVJRVZ1ZFcxbGNtRjBiM0lvUTI5dWMzUnlkV04wYjNJc0lHbHVjSFYwS1NCN1hHNGdJSFJvYVhNdVgybHVjM1JoYm1ObFEyOXVjM1J5ZFdOMGIzSWdQU0JEYjI1emRISjFZM1J2Y2p0Y2JpQWdkR2hwY3k1d2NtOXRhWE5sSUQwZ2JtVjNJRU52Ym5OMGNuVmpkRzl5S0c1dmIzQXBPMXh1WEc0Z0lHbG1JQ2doZEdocGN5NXdjbTl0YVhObFcxQlNUMDFKVTBWZlNVUmRLU0I3WEc0Z0lDQWdiV0ZyWlZCeWIyMXBjMlVvZEdocGN5NXdjbTl0YVhObEtUdGNiaUFnZlZ4dVhHNGdJR2xtSUNocGMwRnljbUY1S0dsdWNIVjBLU2tnZTF4dUlDQWdJSFJvYVhNdVgybHVjSFYwSUQwZ2FXNXdkWFE3WEc0Z0lDQWdkR2hwY3k1c1pXNW5kR2dnUFNCcGJuQjFkQzVzWlc1bmRHZzdYRzRnSUNBZ2RHaHBjeTVmY21WdFlXbHVhVzVuSUQwZ2FXNXdkWFF1YkdWdVozUm9PMXh1WEc0Z0lDQWdkR2hwY3k1ZmNtVnpkV3gwSUQwZ2JtVjNJRUZ5Y21GNUtIUm9hWE11YkdWdVozUm9LVHRjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbXhsYm1kMGFDQTlQVDBnTUNrZ2UxeHVJQ0FnSUNBZ1puVnNabWxzYkNoMGFHbHpMbkJ5YjIxcGMyVXNJSFJvYVhNdVgzSmxjM1ZzZENrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSFJvYVhNdWJHVnVaM1JvSUQwZ2RHaHBjeTVzWlc1bmRHZ2dmSHdnTUR0Y2JpQWdJQ0FnSUhSb2FYTXVYMlZ1ZFcxbGNtRjBaU2dwTzF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11WDNKbGJXRnBibWx1WnlBOVBUMGdNQ2tnZTF4dUlDQWdJQ0FnSUNCbWRXeG1hV3hzS0hSb2FYTXVjSEp2YldselpTd2dkR2hwY3k1ZmNtVnpkV3gwS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lIMGdaV3h6WlNCN1hHNGdJQ0FnWDNKbGFtVmpkQ2gwYUdsekxuQnliMjFwYzJVc0lIWmhiR2xrWVhScGIyNUZjbkp2Y2lncEtUdGNiaUFnZlZ4dWZWeHVYRzVtZFc1amRHbHZiaUIyWVd4cFpHRjBhVzl1UlhKeWIzSW9LU0I3WEc0Z0lISmxkSFZ5YmlCdVpYY2dSWEp5YjNJb0owRnljbUY1SUUxbGRHaHZaSE1nYlhWemRDQmlaU0J3Y205MmFXUmxaQ0JoYmlCQmNuSmhlU2NwTzF4dWZUdGNibHh1Ulc1MWJXVnlZWFJ2Y2k1d2NtOTBiM1I1Y0dVdVgyVnVkVzFsY21GMFpTQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdkbUZ5SUd4bGJtZDBhQ0E5SUhSb2FYTXViR1Z1WjNSb08xeHVJQ0IyWVhJZ1gybHVjSFYwSUQwZ2RHaHBjeTVmYVc1d2RYUTdYRzVjYmlBZ1ptOXlJQ2gyWVhJZ2FTQTlJREE3SUhSb2FYTXVYM04wWVhSbElEMDlQU0JRUlU1RVNVNUhJQ1ltSUdrZ1BDQnNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJSFJvYVhNdVgyVmhZMmhGYm5SeWVTaGZhVzV3ZFhSYmFWMHNJR2twTzF4dUlDQjlYRzU5TzF4dVhHNUZiblZ0WlhKaGRHOXlMbkJ5YjNSdmRIbHdaUzVmWldGamFFVnVkSEo1SUQwZ1puVnVZM1JwYjI0Z0tHVnVkSEo1TENCcEtTQjdYRzRnSUhaaGNpQmpJRDBnZEdocGN5NWZhVzV6ZEdGdVkyVkRiMjV6ZEhKMVkzUnZjanRjYmlBZ2RtRnlJSEpsYzI5c2RtVWtKQ0E5SUdNdWNtVnpiMngyWlR0Y2JseHVJQ0JwWmlBb2NtVnpiMngyWlNRa0lEMDlQU0J5WlhOdmJIWmxLU0I3WEc0Z0lDQWdkbUZ5SUY5MGFHVnVJRDBnWjJWMFZHaGxiaWhsYm5SeWVTazdYRzVjYmlBZ0lDQnBaaUFvWDNSb1pXNGdQVDA5SUhSb1pXNGdKaVlnWlc1MGNua3VYM04wWVhSbElDRTlQU0JRUlU1RVNVNUhLU0I3WEc0Z0lDQWdJQ0IwYUdsekxsOXpaWFIwYkdWa1FYUW9aVzUwY25rdVgzTjBZWFJsTENCcExDQmxiblJ5ZVM1ZmNtVnpkV3gwS1R0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0hSNWNHVnZaaUJmZEdobGJpQWhQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVmY21WdFlXbHVhVzVuTFMwN1hHNGdJQ0FnSUNCMGFHbHpMbDl5WlhOMWJIUmJhVjBnUFNCbGJuUnllVHRjYmlBZ0lDQjlJR1ZzYzJVZ2FXWWdLR01nUFQwOUlGQnliMjFwYzJVcElIdGNiaUFnSUNBZ0lIWmhjaUJ3Y205dGFYTmxJRDBnYm1WM0lHTW9ibTl2Y0NrN1hHNGdJQ0FnSUNCb1lXNWtiR1ZOWVhsaVpWUm9aVzVoWW14bEtIQnliMjFwYzJVc0lHVnVkSEo1TENCZmRHaGxiaWs3WEc0Z0lDQWdJQ0IwYUdsekxsOTNhV3hzVTJWMGRHeGxRWFFvY0hKdmJXbHpaU3dnYVNrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSFJvYVhNdVgzZHBiR3hUWlhSMGJHVkJkQ2h1WlhjZ1l5aG1kVzVqZEdsdmJpQW9jbVZ6YjJ4MlpTUWtLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ5WlhOdmJIWmxKQ1FvWlc1MGNua3BPMXh1SUNBZ0lDQWdmU2tzSUdrcE8xeHVJQ0FnSUgxY2JpQWdmU0JsYkhObElIdGNiaUFnSUNCMGFHbHpMbDkzYVd4c1UyVjBkR3hsUVhRb2NtVnpiMngyWlNRa0tHVnVkSEo1S1N3Z2FTazdYRzRnSUgxY2JuMDdYRzVjYmtWdWRXMWxjbUYwYjNJdWNISnZkRzkwZVhCbExsOXpaWFIwYkdWa1FYUWdQU0JtZFc1amRHbHZiaUFvYzNSaGRHVXNJR2tzSUhaaGJIVmxLU0I3WEc0Z0lIWmhjaUJ3Y205dGFYTmxJRDBnZEdocGN5NXdjbTl0YVhObE8xeHVYRzRnSUdsbUlDaHdjbTl0YVhObExsOXpkR0YwWlNBOVBUMGdVRVZPUkVsT1J5a2dlMXh1SUNBZ0lIUm9hWE11WDNKbGJXRnBibWx1WnkwdE8xeHVYRzRnSUNBZ2FXWWdLSE4wWVhSbElEMDlQU0JTUlVwRlExUkZSQ2tnZTF4dUlDQWdJQ0FnWDNKbGFtVmpkQ2h3Y205dGFYTmxMQ0IyWVd4MVpTazdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYM0psYzNWc2RGdHBYU0E5SUhaaGJIVmxPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJR2xtSUNoMGFHbHpMbDl5WlcxaGFXNXBibWNnUFQwOUlEQXBJSHRjYmlBZ0lDQm1kV3htYVd4c0tIQnliMjFwYzJVc0lIUm9hWE11WDNKbGMzVnNkQ2s3WEc0Z0lIMWNibjA3WEc1Y2JrVnVkVzFsY21GMGIzSXVjSEp2ZEc5MGVYQmxMbDkzYVd4c1UyVjBkR3hsUVhRZ1BTQm1kVzVqZEdsdmJpQW9jSEp2YldselpTd2dhU2tnZTF4dUlDQjJZWElnWlc1MWJXVnlZWFJ2Y2lBOUlIUm9hWE03WEc1Y2JpQWdjM1ZpYzJOeWFXSmxLSEJ5YjIxcGMyVXNJSFZ1WkdWbWFXNWxaQ3dnWm5WdVkzUnBiMjRnS0haaGJIVmxLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHVnVkVzFsY21GMGIzSXVYM05sZEhSc1pXUkJkQ2hHVlV4R1NVeE1SVVFzSUdrc0lIWmhiSFZsS1R0Y2JpQWdmU3dnWm5WdVkzUnBiMjRnS0hKbFlYTnZiaWtnZTF4dUlDQWdJSEpsZEhWeWJpQmxiblZ0WlhKaGRHOXlMbDl6WlhSMGJHVmtRWFFvVWtWS1JVTlVSVVFzSUdrc0lISmxZWE52YmlrN1hHNGdJSDBwTzF4dWZUdGNibHh1THlvcVhHNGdJR0JRY205dGFYTmxMbUZzYkdBZ1lXTmpaWEIwY3lCaGJpQmhjbkpoZVNCdlppQndjbTl0YVhObGN5d2dZVzVrSUhKbGRIVnlibk1nWVNCdVpYY2djSEp2YldselpTQjNhR2xqYUZ4dUlDQnBjeUJtZFd4bWFXeHNaV1FnZDJsMGFDQmhiaUJoY25KaGVTQnZaaUJtZFd4bWFXeHNiV1Z1ZENCMllXeDFaWE1nWm05eUlIUm9aU0J3WVhOelpXUWdjSEp2YldselpYTXNJRzl5WEc0Z0lISmxhbVZqZEdWa0lIZHBkR2dnZEdobElISmxZWE52YmlCdlppQjBhR1VnWm1seWMzUWdjR0Z6YzJWa0lIQnliMjFwYzJVZ2RHOGdZbVVnY21WcVpXTjBaV1F1SUVsMElHTmhjM1J6SUdGc2JGeHVJQ0JsYkdWdFpXNTBjeUJ2WmlCMGFHVWdjR0Z6YzJWa0lHbDBaWEpoWW14bElIUnZJSEJ5YjIxcGMyVnpJR0Z6SUdsMElISjFibk1nZEdocGN5QmhiR2R2Y21sMGFHMHVYRzVjYmlBZ1JYaGhiWEJzWlRwY2JseHVJQ0JnWUdCcVlYWmhjMk55YVhCMFhHNGdJR3hsZENCd2NtOXRhWE5sTVNBOUlISmxjMjlzZG1Vb01TazdYRzRnSUd4bGRDQndjbTl0YVhObE1pQTlJSEpsYzI5c2RtVW9NaWs3WEc0Z0lHeGxkQ0J3Y205dGFYTmxNeUE5SUhKbGMyOXNkbVVvTXlrN1hHNGdJR3hsZENCd2NtOXRhWE5sY3lBOUlGc2djSEp2YldselpURXNJSEJ5YjIxcGMyVXlMQ0J3Y205dGFYTmxNeUJkTzF4dVhHNGdJRkJ5YjIxcGMyVXVZV3hzS0hCeWIyMXBjMlZ6S1M1MGFHVnVLR1oxYm1OMGFXOXVLR0Z5Y21GNUtYdGNiaUFnSUNBdkx5QlVhR1VnWVhKeVlYa2dhR1Z5WlNCM2IzVnNaQ0JpWlNCYklERXNJRElzSURNZ1hUdGNiaUFnZlNrN1hHNGdJR0JnWUZ4dVhHNGdJRWxtSUdGdWVTQnZaaUIwYUdVZ1lIQnliMjFwYzJWellDQm5hWFpsYmlCMGJ5QmdZV3hzWUNCaGNtVWdjbVZxWldOMFpXUXNJSFJvWlNCbWFYSnpkQ0J3Y205dGFYTmxYRzRnSUhSb1lYUWdhWE1nY21WcVpXTjBaV1FnZDJsc2JDQmlaU0JuYVhabGJpQmhjeUJoYmlCaGNtZDFiV1Z1ZENCMGJ5QjBhR1VnY21WMGRYSnVaV1FnY0hKdmJXbHpaWE1uYzF4dUlDQnlaV3BsWTNScGIyNGdhR0Z1Wkd4bGNpNGdSbTl5SUdWNFlXMXdiR1U2WEc1Y2JpQWdSWGhoYlhCc1pUcGNibHh1SUNCZ1lHQnFZWFpoYzJOeWFYQjBYRzRnSUd4bGRDQndjbTl0YVhObE1TQTlJSEpsYzI5c2RtVW9NU2s3WEc0Z0lHeGxkQ0J3Y205dGFYTmxNaUE5SUhKbGFtVmpkQ2h1WlhjZ1JYSnliM0lvWENJeVhDSXBLVHRjYmlBZ2JHVjBJSEJ5YjIxcGMyVXpJRDBnY21WcVpXTjBLRzVsZHlCRmNuSnZjaWhjSWpOY0lpa3BPMXh1SUNCc1pYUWdjSEp2YldselpYTWdQU0JiSUhCeWIyMXBjMlV4TENCd2NtOXRhWE5sTWl3Z2NISnZiV2x6WlRNZ1hUdGNibHh1SUNCUWNtOXRhWE5sTG1Gc2JDaHdjbTl0YVhObGN5a3VkR2hsYmlobWRXNWpkR2x2YmloaGNuSmhlU2w3WEc0Z0lDQWdMeThnUTI5a1pTQm9aWEpsSUc1bGRtVnlJSEoxYm5NZ1ltVmpZWFZ6WlNCMGFHVnlaU0JoY21VZ2NtVnFaV04wWldRZ2NISnZiV2x6WlhNaFhHNGdJSDBzSUdaMWJtTjBhVzl1S0dWeWNtOXlLU0I3WEc0Z0lDQWdMeThnWlhKeWIzSXViV1Z6YzJGblpTQTlQVDBnWENJeVhDSmNiaUFnZlNrN1hHNGdJR0JnWUZ4dVhHNGdJRUJ0WlhSb2IyUWdZV3hzWEc0Z0lFQnpkR0YwYVdOY2JpQWdRSEJoY21GdElIdEJjbkpoZVgwZ1pXNTBjbWxsY3lCaGNuSmhlU0J2WmlCd2NtOXRhWE5sYzF4dUlDQkFjR0Z5WVcwZ2UxTjBjbWx1WjMwZ2JHRmlaV3dnYjNCMGFXOXVZV3dnYzNSeWFXNW5JR1p2Y2lCc1lXSmxiR2x1WnlCMGFHVWdjSEp2YldselpTNWNiaUFnVlhObFpuVnNJR1p2Y2lCMGIyOXNhVzVuTGx4dUlDQkFjbVYwZFhKdUlIdFFjbTl0YVhObGZTQndjbTl0YVhObElIUm9ZWFFnYVhNZ1puVnNabWxzYkdWa0lIZG9aVzRnWVd4c0lHQndjbTl0YVhObGMyQWdhR0YyWlNCaVpXVnVYRzRnSUdaMWJHWnBiR3hsWkN3Z2IzSWdjbVZxWldOMFpXUWdhV1lnWVc1NUlHOW1JSFJvWlcwZ1ltVmpiMjFsSUhKbGFtVmpkR1ZrTGx4dUlDQkFjM1JoZEdsalhHNHFMMXh1Wm5WdVkzUnBiMjRnWVd4c0tHVnVkSEpwWlhNcElIdGNiaUFnY21WMGRYSnVJRzVsZHlCRmJuVnRaWEpoZEc5eUtIUm9hWE1zSUdWdWRISnBaWE1wTG5CeWIyMXBjMlU3WEc1OVhHNWNiaThxS2x4dUlDQmdVSEp2YldselpTNXlZV05sWUNCeVpYUjFjbTV6SUdFZ2JtVjNJSEJ5YjIxcGMyVWdkMmhwWTJnZ2FYTWdjMlYwZEd4bFpDQnBiaUIwYUdVZ2MyRnRaU0IzWVhrZ1lYTWdkR2hsWEc0Z0lHWnBjbk4wSUhCaGMzTmxaQ0J3Y205dGFYTmxJSFJ2SUhObGRIUnNaUzVjYmx4dUlDQkZlR0Z0Y0d4bE9seHVYRzRnSUdCZ1lHcGhkbUZ6WTNKcGNIUmNiaUFnYkdWMElIQnliMjFwYzJVeElEMGdibVYzSUZCeWIyMXBjMlVvWm5WdVkzUnBiMjRvY21WemIyeDJaU3dnY21WcVpXTjBLWHRjYmlBZ0lDQnpaWFJVYVcxbGIzVjBLR1oxYm1OMGFXOXVLQ2w3WEc0Z0lDQWdJQ0J5WlhOdmJIWmxLQ2R3Y205dGFYTmxJREVuS1R0Y2JpQWdJQ0I5TENBeU1EQXBPMXh1SUNCOUtUdGNibHh1SUNCc1pYUWdjSEp2YldselpUSWdQU0J1WlhjZ1VISnZiV2x6WlNobWRXNWpkR2x2YmloeVpYTnZiSFpsTENCeVpXcGxZM1FwZTF4dUlDQWdJSE5sZEZScGJXVnZkWFFvWm5WdVkzUnBiMjRvS1h0Y2JpQWdJQ0FnSUhKbGMyOXNkbVVvSjNCeWIyMXBjMlVnTWljcE8xeHVJQ0FnSUgwc0lERXdNQ2s3WEc0Z0lIMHBPMXh1WEc0Z0lGQnliMjFwYzJVdWNtRmpaU2hiY0hKdmJXbHpaVEVzSUhCeWIyMXBjMlV5WFNrdWRHaGxiaWhtZFc1amRHbHZiaWh5WlhOMWJIUXBlMXh1SUNBZ0lDOHZJSEpsYzNWc2RDQTlQVDBnSjNCeWIyMXBjMlVnTWljZ1ltVmpZWFZ6WlNCcGRDQjNZWE1nY21WemIyeDJaV1FnWW1WbWIzSmxJSEJ5YjIxcGMyVXhYRzRnSUNBZ0x5OGdkMkZ6SUhKbGMyOXNkbVZrTGx4dUlDQjlLVHRjYmlBZ1lHQmdYRzVjYmlBZ1lGQnliMjFwYzJVdWNtRmpaV0FnYVhNZ1pHVjBaWEp0YVc1cGMzUnBZeUJwYmlCMGFHRjBJRzl1YkhrZ2RHaGxJSE4wWVhSbElHOW1JSFJvWlNCbWFYSnpkRnh1SUNCelpYUjBiR1ZrSUhCeWIyMXBjMlVnYldGMGRHVnljeTRnUm05eUlHVjRZVzF3YkdVc0lHVjJaVzRnYVdZZ2IzUm9aWElnY0hKdmJXbHpaWE1nWjJsMlpXNGdkRzhnZEdobFhHNGdJR0J3Y205dGFYTmxjMkFnWVhKeVlYa2dZWEpuZFcxbGJuUWdZWEpsSUhKbGMyOXNkbVZrTENCaWRYUWdkR2hsSUdacGNuTjBJSE5sZEhSc1pXUWdjSEp2YldselpTQm9ZWE5jYmlBZ1ltVmpiMjFsSUhKbGFtVmpkR1ZrSUdKbFptOXlaU0IwYUdVZ2IzUm9aWElnY0hKdmJXbHpaWE1nWW1WallXMWxJR1oxYkdacGJHeGxaQ3dnZEdobElISmxkSFZ5Ym1Wa1hHNGdJSEJ5YjIxcGMyVWdkMmxzYkNCaVpXTnZiV1VnY21WcVpXTjBaV1E2WEc1Y2JpQWdZR0JnYW1GMllYTmpjbWx3ZEZ4dUlDQnNaWFFnY0hKdmJXbHpaVEVnUFNCdVpYY2dVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabExDQnlaV3BsWTNRcGUxeHVJQ0FnSUhObGRGUnBiV1Z2ZFhRb1puVnVZM1JwYjI0b0tYdGNiaUFnSUNBZ0lISmxjMjlzZG1Vb0ozQnliMjFwYzJVZ01TY3BPMXh1SUNBZ0lIMHNJREl3TUNrN1hHNGdJSDBwTzF4dVhHNGdJR3hsZENCd2NtOXRhWE5sTWlBOUlHNWxkeUJRY205dGFYTmxLR1oxYm1OMGFXOXVLSEpsYzI5c2RtVXNJSEpsYW1WamRDbDdYRzRnSUNBZ2MyVjBWR2x0Wlc5MWRDaG1kVzVqZEdsdmJpZ3BlMXh1SUNBZ0lDQWdjbVZxWldOMEtHNWxkeUJGY25KdmNpZ25jSEp2YldselpTQXlKeWtwTzF4dUlDQWdJSDBzSURFd01DazdYRzRnSUgwcE8xeHVYRzRnSUZCeWIyMXBjMlV1Y21GalpTaGJjSEp2YldselpURXNJSEJ5YjIxcGMyVXlYU2t1ZEdobGJpaG1kVzVqZEdsdmJpaHlaWE4xYkhRcGUxeHVJQ0FnSUM4dklFTnZaR1VnYUdWeVpTQnVaWFpsY2lCeWRXNXpYRzRnSUgwc0lHWjFibU4wYVc5dUtISmxZWE52YmlsN1hHNGdJQ0FnTHk4Z2NtVmhjMjl1TG0xbGMzTmhaMlVnUFQwOUlDZHdjbTl0YVhObElESW5JR0psWTJGMWMyVWdjSEp2YldselpTQXlJR0psWTJGdFpTQnlaV3BsWTNSbFpDQmlaV1p2Y21WY2JpQWdJQ0F2THlCd2NtOXRhWE5sSURFZ1ltVmpZVzFsSUdaMWJHWnBiR3hsWkZ4dUlDQjlLVHRjYmlBZ1lHQmdYRzVjYmlBZ1FXNGdaWGhoYlhCc1pTQnlaV0ZzTFhkdmNteGtJSFZ6WlNCallYTmxJR2x6SUdsdGNHeGxiV1Z1ZEdsdVp5QjBhVzFsYjNWMGN6cGNibHh1SUNCZ1lHQnFZWFpoYzJOeWFYQjBYRzRnSUZCeWIyMXBjMlV1Y21GalpTaGJZV3BoZUNnblptOXZMbXB6YjI0bktTd2dkR2x0Wlc5MWRDZzFNREF3S1YwcFhHNGdJR0JnWUZ4dVhHNGdJRUJ0WlhSb2IyUWdjbUZqWlZ4dUlDQkFjM1JoZEdsalhHNGdJRUJ3WVhKaGJTQjdRWEp5WVhsOUlIQnliMjFwYzJWeklHRnljbUY1SUc5bUlIQnliMjFwYzJWeklIUnZJRzlpYzJWeWRtVmNiaUFnVlhObFpuVnNJR1p2Y2lCMGIyOXNhVzVuTGx4dUlDQkFjbVYwZFhKdUlIdFFjbTl0YVhObGZTQmhJSEJ5YjIxcGMyVWdkMmhwWTJnZ2MyVjBkR3hsY3lCcGJpQjBhR1VnYzJGdFpTQjNZWGtnWVhNZ2RHaGxJR1pwY25OMElIQmhjM05sWkZ4dUlDQndjbTl0YVhObElIUnZJSE5sZEhSc1pTNWNiaW92WEc1bWRXNWpkR2x2YmlCeVlXTmxLR1Z1ZEhKcFpYTXBJSHRjYmlBZ0x5cHFjMmhwYm5RZ2RtRnNhV1IwYUdsek9uUnlkV1VnS2k5Y2JpQWdkbUZ5SUVOdmJuTjBjblZqZEc5eUlEMGdkR2hwY3p0Y2JseHVJQ0JwWmlBb0lXbHpRWEp5WVhrb1pXNTBjbWxsY3lrcElIdGNiaUFnSUNCeVpYUjFjbTRnYm1WM0lFTnZibk4wY25WamRHOXlLR1oxYm1OMGFXOXVJQ2hmTENCeVpXcGxZM1FwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ5WldwbFkzUW9ibVYzSUZSNWNHVkZjbkp2Y2lnbldXOTFJRzExYzNRZ2NHRnpjeUJoYmlCaGNuSmhlU0IwYnlCeVlXTmxMaWNwS1R0Y2JpQWdJQ0I5S1R0Y2JpQWdmU0JsYkhObElIdGNiaUFnSUNCeVpYUjFjbTRnYm1WM0lFTnZibk4wY25WamRHOXlLR1oxYm1OMGFXOXVJQ2h5WlhOdmJIWmxMQ0J5WldwbFkzUXBJSHRjYmlBZ0lDQWdJSFpoY2lCc1pXNW5kR2dnUFNCbGJuUnlhV1Z6TG14bGJtZDBhRHRjYmlBZ0lDQWdJR1p2Y2lBb2RtRnlJR2tnUFNBd095QnBJRHdnYkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNBZ0lDQWdRMjl1YzNSeWRXTjBiM0l1Y21WemIyeDJaU2hsYm5SeWFXVnpXMmxkS1M1MGFHVnVLSEpsYzI5c2RtVXNJSEpsYW1WamRDazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTazdYRzRnSUgxY2JuMWNibHh1THlvcVhHNGdJR0JRY205dGFYTmxMbkpsYW1WamRHQWdjbVYwZFhKdWN5QmhJSEJ5YjIxcGMyVWdjbVZxWldOMFpXUWdkMmwwYUNCMGFHVWdjR0Z6YzJWa0lHQnlaV0Z6YjI1Z0xseHVJQ0JKZENCcGN5QnphRzl5ZEdoaGJtUWdabTl5SUhSb1pTQm1iMnhzYjNkcGJtYzZYRzVjYmlBZ1lHQmdhbUYyWVhOamNtbHdkRnh1SUNCc1pYUWdjSEp2YldselpTQTlJRzVsZHlCUWNtOXRhWE5sS0daMWJtTjBhVzl1S0hKbGMyOXNkbVVzSUhKbGFtVmpkQ2w3WEc0Z0lDQWdjbVZxWldOMEtHNWxkeUJGY25KdmNpZ25WMGhQVDFCVEp5a3BPMXh1SUNCOUtUdGNibHh1SUNCd2NtOXRhWE5sTG5Sb1pXNG9ablZ1WTNScGIyNG9kbUZzZFdVcGUxeHVJQ0FnSUM4dklFTnZaR1VnYUdWeVpTQmtiMlZ6YmlkMElISjFiaUJpWldOaGRYTmxJSFJvWlNCd2NtOXRhWE5sSUdseklISmxhbVZqZEdWa0lWeHVJQ0I5TENCbWRXNWpkR2x2YmloeVpXRnpiMjRwZTF4dUlDQWdJQzh2SUhKbFlYTnZiaTV0WlhOellXZGxJRDA5UFNBblYwaFBUMUJUSjF4dUlDQjlLVHRjYmlBZ1lHQmdYRzVjYmlBZ1NXNXpkR1ZoWkNCdlppQjNjbWwwYVc1bklIUm9aU0JoWW05MlpTd2dlVzkxY2lCamIyUmxJRzV2ZHlCemFXMXdiSGtnWW1WamIyMWxjeUIwYUdVZ1ptOXNiRzkzYVc1bk9seHVYRzRnSUdCZ1lHcGhkbUZ6WTNKcGNIUmNiaUFnYkdWMElIQnliMjFwYzJVZ1BTQlFjbTl0YVhObExuSmxhbVZqZENodVpYY2dSWEp5YjNJb0oxZElUMDlRVXljcEtUdGNibHh1SUNCd2NtOXRhWE5sTG5Sb1pXNG9ablZ1WTNScGIyNG9kbUZzZFdVcGUxeHVJQ0FnSUM4dklFTnZaR1VnYUdWeVpTQmtiMlZ6YmlkMElISjFiaUJpWldOaGRYTmxJSFJvWlNCd2NtOXRhWE5sSUdseklISmxhbVZqZEdWa0lWeHVJQ0I5TENCbWRXNWpkR2x2YmloeVpXRnpiMjRwZTF4dUlDQWdJQzh2SUhKbFlYTnZiaTV0WlhOellXZGxJRDA5UFNBblYwaFBUMUJUSjF4dUlDQjlLVHRjYmlBZ1lHQmdYRzVjYmlBZ1FHMWxkR2h2WkNCeVpXcGxZM1JjYmlBZ1FITjBZWFJwWTF4dUlDQkFjR0Z5WVcwZ2UwRnVlWDBnY21WaGMyOXVJSFpoYkhWbElIUm9ZWFFnZEdobElISmxkSFZ5Ym1Wa0lIQnliMjFwYzJVZ2QybHNiQ0JpWlNCeVpXcGxZM1JsWkNCM2FYUm9MbHh1SUNCVmMyVm1kV3dnWm05eUlIUnZiMnhwYm1jdVhHNGdJRUJ5WlhSMWNtNGdlMUJ5YjIxcGMyVjlJR0VnY0hKdmJXbHpaU0J5WldwbFkzUmxaQ0IzYVhSb0lIUm9aU0JuYVhabGJpQmdjbVZoYzI5dVlDNWNiaW92WEc1bWRXNWpkR2x2YmlCeVpXcGxZM1FvY21WaGMyOXVLU0I3WEc0Z0lDOHFhbk5vYVc1MElIWmhiR2xrZEdocGN6cDBjblZsSUNvdlhHNGdJSFpoY2lCRGIyNXpkSEoxWTNSdmNpQTlJSFJvYVhNN1hHNGdJSFpoY2lCd2NtOXRhWE5sSUQwZ2JtVjNJRU52Ym5OMGNuVmpkRzl5S0c1dmIzQXBPMXh1SUNCZmNtVnFaV04wS0hCeWIyMXBjMlVzSUhKbFlYTnZiaWs3WEc0Z0lISmxkSFZ5YmlCd2NtOXRhWE5sTzF4dWZWeHVYRzVtZFc1amRHbHZiaUJ1WldWa2MxSmxjMjlzZG1WeUtDa2dlMXh1SUNCMGFISnZkeUJ1WlhjZ1ZIbHdaVVZ5Y205eUtDZFpiM1VnYlhWemRDQndZWE56SUdFZ2NtVnpiMngyWlhJZ1puVnVZM1JwYjI0Z1lYTWdkR2hsSUdacGNuTjBJR0Z5WjNWdFpXNTBJSFJ2SUhSb1pTQndjbTl0YVhObElHTnZibk4wY25WamRHOXlKeWs3WEc1OVhHNWNibVoxYm1OMGFXOXVJRzVsWldSelRtVjNLQ2tnZTF4dUlDQjBhSEp2ZHlCdVpYY2dWSGx3WlVWeWNtOXlLRndpUm1GcGJHVmtJSFJ2SUdOdmJuTjBjblZqZENBblVISnZiV2x6WlNjNklGQnNaV0Z6WlNCMWMyVWdkR2hsSUNkdVpYY25JRzl3WlhKaGRHOXlMQ0IwYUdseklHOWlhbVZqZENCamIyNXpkSEoxWTNSdmNpQmpZVzV1YjNRZ1ltVWdZMkZzYkdWa0lHRnpJR0VnWm5WdVkzUnBiMjR1WENJcE8xeHVmVnh1WEc0dktpcGNiaUFnVUhKdmJXbHpaU0J2WW1wbFkzUnpJSEpsY0hKbGMyVnVkQ0IwYUdVZ1pYWmxiblIxWVd3Z2NtVnpkV3gwSUc5bUlHRnVJR0Z6ZVc1amFISnZibTkxY3lCdmNHVnlZWFJwYjI0dUlGUm9aVnh1SUNCd2NtbHRZWEo1SUhkaGVTQnZaaUJwYm5SbGNtRmpkR2x1WnlCM2FYUm9JR0VnY0hKdmJXbHpaU0JwY3lCMGFISnZkV2RvSUdsMGN5QmdkR2hsYm1BZ2JXVjBhRzlrTENCM2FHbGphRnh1SUNCeVpXZHBjM1JsY25NZ1kyRnNiR0poWTJ0eklIUnZJSEpsWTJWcGRtVWdaV2wwYUdWeUlHRWdjSEp2YldselpTZHpJR1YyWlc1MGRXRnNJSFpoYkhWbElHOXlJSFJvWlNCeVpXRnpiMjVjYmlBZ2QyaDVJSFJvWlNCd2NtOXRhWE5sSUdOaGJtNXZkQ0JpWlNCbWRXeG1hV3hzWldRdVhHNWNiaUFnVkdWeWJXbHViMnh2WjNsY2JpQWdMUzB0TFMwdExTMHRMUzFjYmx4dUlDQXRJR0J3Y205dGFYTmxZQ0JwY3lCaGJpQnZZbXBsWTNRZ2IzSWdablZ1WTNScGIyNGdkMmwwYUNCaElHQjBhR1Z1WUNCdFpYUm9iMlFnZDJodmMyVWdZbVZvWVhacGIzSWdZMjl1Wm05eWJYTWdkRzhnZEdocGN5QnpjR1ZqYVdacFkyRjBhVzl1TGx4dUlDQXRJR0IwYUdWdVlXSnNaV0FnYVhNZ1lXNGdiMkpxWldOMElHOXlJR1oxYm1OMGFXOXVJSFJvWVhRZ1pHVm1hVzVsY3lCaElHQjBhR1Z1WUNCdFpYUm9iMlF1WEc0Z0lDMGdZSFpoYkhWbFlDQnBjeUJoYm5rZ2JHVm5ZV3dnU21GMllWTmpjbWx3ZENCMllXeDFaU0FvYVc1amJIVmthVzVuSUhWdVpHVm1hVzVsWkN3Z1lTQjBhR1Z1WVdKc1pTd2diM0lnWVNCd2NtOXRhWE5sS1M1Y2JpQWdMU0JnWlhoalpYQjBhVzl1WUNCcGN5QmhJSFpoYkhWbElIUm9ZWFFnYVhNZ2RHaHliM2R1SUhWemFXNW5JSFJvWlNCMGFISnZkeUJ6ZEdGMFpXMWxiblF1WEc0Z0lDMGdZSEpsWVhOdmJtQWdhWE1nWVNCMllXeDFaU0IwYUdGMElHbHVaR2xqWVhSbGN5QjNhSGtnWVNCd2NtOXRhWE5sSUhkaGN5QnlaV3BsWTNSbFpDNWNiaUFnTFNCZ2MyVjBkR3hsWkdBZ2RHaGxJR1pwYm1Gc0lISmxjM1JwYm1jZ2MzUmhkR1VnYjJZZ1lTQndjbTl0YVhObExDQm1kV3htYVd4c1pXUWdiM0lnY21WcVpXTjBaV1F1WEc1Y2JpQWdRU0J3Y205dGFYTmxJR05oYmlCaVpTQnBiaUJ2Ym1VZ2IyWWdkR2h5WldVZ2MzUmhkR1Z6T2lCd1pXNWthVzVuTENCbWRXeG1hV3hzWldRc0lHOXlJSEpsYW1WamRHVmtMbHh1WEc0Z0lGQnliMjFwYzJWeklIUm9ZWFFnWVhKbElHWjFiR1pwYkd4bFpDQm9ZWFpsSUdFZ1puVnNabWxzYkcxbGJuUWdkbUZzZFdVZ1lXNWtJR0Z5WlNCcGJpQjBhR1VnWm5Wc1ptbHNiR1ZrWEc0Z0lITjBZWFJsTGlBZ1VISnZiV2x6WlhNZ2RHaGhkQ0JoY21VZ2NtVnFaV04wWldRZ2FHRjJaU0JoSUhKbGFtVmpkR2x2YmlCeVpXRnpiMjRnWVc1a0lHRnlaU0JwYmlCMGFHVmNiaUFnY21WcVpXTjBaV1FnYzNSaGRHVXVJQ0JCSUdaMWJHWnBiR3h0Wlc1MElIWmhiSFZsSUdseklHNWxkbVZ5SUdFZ2RHaGxibUZpYkdVdVhHNWNiaUFnVUhKdmJXbHpaWE1nWTJGdUlHRnNjMjhnWW1VZ2MyRnBaQ0IwYnlBcWNtVnpiMngyWlNvZ1lTQjJZV3gxWlM0Z0lFbG1JSFJvYVhNZ2RtRnNkV1VnYVhNZ1lXeHpieUJoWEc0Z0lIQnliMjFwYzJVc0lIUm9aVzRnZEdobElHOXlhV2RwYm1Gc0lIQnliMjFwYzJVbmN5QnpaWFIwYkdWa0lITjBZWFJsSUhkcGJHd2diV0YwWTJnZ2RHaGxJSFpoYkhWbEozTmNiaUFnYzJWMGRHeGxaQ0J6ZEdGMFpTNGdJRk52SUdFZ2NISnZiV2x6WlNCMGFHRjBJQ3B5WlhOdmJIWmxjeW9nWVNCd2NtOXRhWE5sSUhSb1lYUWdjbVZxWldOMGN5QjNhV3hzWEc0Z0lHbDBjMlZzWmlCeVpXcGxZM1FzSUdGdVpDQmhJSEJ5YjIxcGMyVWdkR2hoZENBcWNtVnpiMngyWlhNcUlHRWdjSEp2YldselpTQjBhR0YwSUdaMWJHWnBiR3h6SUhkcGJHeGNiaUFnYVhSelpXeG1JR1oxYkdacGJHd3VYRzVjYmx4dUlDQkNZWE5wWXlCVmMyRm5aVHBjYmlBZ0xTMHRMUzB0TFMwdExTMHRYRzVjYmlBZ1lHQmdhbk5jYmlBZ2JHVjBJSEJ5YjIxcGMyVWdQU0J1WlhjZ1VISnZiV2x6WlNobWRXNWpkR2x2YmloeVpYTnZiSFpsTENCeVpXcGxZM1FwSUh0Y2JpQWdJQ0F2THlCdmJpQnpkV05qWlhOelhHNGdJQ0FnY21WemIyeDJaU2gyWVd4MVpTazdYRzVjYmlBZ0lDQXZMeUJ2YmlCbVlXbHNkWEpsWEc0Z0lDQWdjbVZxWldOMEtISmxZWE52YmlrN1hHNGdJSDBwTzF4dVhHNGdJSEJ5YjIxcGMyVXVkR2hsYmlobWRXNWpkR2x2YmloMllXeDFaU2tnZTF4dUlDQWdJQzh2SUc5dUlHWjFiR1pwYkd4dFpXNTBYRzRnSUgwc0lHWjFibU4wYVc5dUtISmxZWE52YmlrZ2UxeHVJQ0FnSUM4dklHOXVJSEpsYW1WamRHbHZibHh1SUNCOUtUdGNiaUFnWUdCZ1hHNWNiaUFnUVdSMllXNWpaV1FnVlhOaFoyVTZYRzRnSUMwdExTMHRMUzB0TFMwdExTMHRMVnh1WEc0Z0lGQnliMjFwYzJWeklITm9hVzVsSUhkb1pXNGdZV0p6ZEhKaFkzUnBibWNnWVhkaGVTQmhjM2x1WTJoeWIyNXZkWE1nYVc1MFpYSmhZM1JwYjI1eklITjFZMmdnWVhOY2JpQWdZRmhOVEVoMGRIQlNaWEYxWlhOMFlITXVYRzVjYmlBZ1lHQmdhbk5jYmlBZ1puVnVZM1JwYjI0Z1oyVjBTbE5QVGloMWNtd3BJSHRjYmlBZ0lDQnlaWFIxY200Z2JtVjNJRkJ5YjIxcGMyVW9ablZ1WTNScGIyNG9jbVZ6YjJ4MlpTd2djbVZxWldOMEtYdGNiaUFnSUNBZ0lHeGxkQ0I0YUhJZ1BTQnVaWGNnV0UxTVNIUjBjRkpsY1hWbGMzUW9LVHRjYmx4dUlDQWdJQ0FnZUdoeUxtOXdaVzRvSjBkRlZDY3NJSFZ5YkNrN1hHNGdJQ0FnSUNCNGFISXViMjV5WldGa2VYTjBZWFJsWTJoaGJtZGxJRDBnYUdGdVpHeGxjanRjYmlBZ0lDQWdJSGhvY2k1eVpYTndiMjV6WlZSNWNHVWdQU0FuYW5OdmJpYzdYRzRnSUNBZ0lDQjRhSEl1YzJWMFVtVnhkV1Z6ZEVobFlXUmxjaWduUVdOalpYQjBKeXdnSjJGd2NHeHBZMkYwYVc5dUwycHpiMjRuS1R0Y2JpQWdJQ0FnSUhob2NpNXpaVzVrS0NrN1hHNWNiaUFnSUNBZ0lHWjFibU4wYVc5dUlHaGhibVJzWlhJb0tTQjdYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbkpsWVdSNVUzUmhkR1VnUFQwOUlIUm9hWE11UkU5T1JTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG5OMFlYUjFjeUE5UFQwZ01qQXdLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWE52YkhabEtIUm9hWE11Y21WemNHOXVjMlVwTzF4dUlDQWdJQ0FnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WldwbFkzUW9ibVYzSUVWeWNtOXlLQ2RuWlhSS1UwOU9PaUJnSnlBcklIVnliQ0FySUNkZ0lHWmhhV3hsWkNCM2FYUm9JSE4wWVhSMWN6b2dXeWNnS3lCMGFHbHpMbk4wWVhSMWN5QXJJQ2RkSnlrcE8xeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlR0Y2JpQWdJQ0I5S1R0Y2JpQWdmVnh1WEc0Z0lHZGxkRXBUVDA0b0p5OXdiM04wY3k1cWMyOXVKeWt1ZEdobGJpaG1kVzVqZEdsdmJpaHFjMjl1S1NCN1hHNGdJQ0FnTHk4Z2IyNGdablZzWm1sc2JHMWxiblJjYmlBZ2ZTd2dablZ1WTNScGIyNG9jbVZoYzI5dUtTQjdYRzRnSUNBZ0x5OGdiMjRnY21WcVpXTjBhVzl1WEc0Z0lIMHBPMXh1SUNCZ1lHQmNibHh1SUNCVmJteHBhMlVnWTJGc2JHSmhZMnR6TENCd2NtOXRhWE5sY3lCaGNtVWdaM0psWVhRZ1kyOXRjRzl6WVdKc1pTQndjbWx0YVhScGRtVnpMbHh1WEc0Z0lHQmdZR3B6WEc0Z0lGQnliMjFwYzJVdVlXeHNLRnRjYmlBZ0lDQm5aWFJLVTA5T0tDY3ZjRzl6ZEhNbktTeGNiaUFnSUNCblpYUktVMDlPS0NjdlkyOXRiV1Z1ZEhNbktWeHVJQ0JkS1M1MGFHVnVLR1oxYm1OMGFXOXVLSFpoYkhWbGN5bDdYRzRnSUNBZ2RtRnNkV1Z6V3pCZElDOHZJRDArSUhCdmMzUnpTbE5QVGx4dUlDQWdJSFpoYkhWbGMxc3hYU0F2THlBOVBpQmpiMjF0Wlc1MGMwcFRUMDVjYmx4dUlDQWdJSEpsZEhWeWJpQjJZV3gxWlhNN1hHNGdJSDBwTzF4dUlDQmdZR0JjYmx4dUlDQkFZMnhoYzNNZ1VISnZiV2x6WlZ4dUlDQkFjR0Z5WVcwZ2UyWjFibU4wYVc5dWZTQnlaWE52YkhabGNseHVJQ0JWYzJWbWRXd2dabTl5SUhSdmIyeHBibWN1WEc0Z0lFQmpiMjV6ZEhKMVkzUnZjbHh1S2k5Y2JtWjFibU4wYVc5dUlGQnliMjFwYzJVb2NtVnpiMngyWlhJcElIdGNiaUFnZEdocGMxdFFVazlOU1ZORlgwbEVYU0E5SUc1bGVIUkpaQ2dwTzF4dUlDQjBhR2x6TGw5eVpYTjFiSFFnUFNCMGFHbHpMbDl6ZEdGMFpTQTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ2RHaHBjeTVmYzNWaWMyTnlhV0psY25NZ1BTQmJYVHRjYmx4dUlDQnBaaUFvYm05dmNDQWhQVDBnY21WemIyeDJaWElwSUh0Y2JpQWdJQ0IwZVhCbGIyWWdjbVZ6YjJ4MlpYSWdJVDA5SUNkbWRXNWpkR2x2YmljZ0ppWWdibVZsWkhOU1pYTnZiSFpsY2lncE8xeHVJQ0FnSUhSb2FYTWdhVzV6ZEdGdVkyVnZaaUJRY205dGFYTmxJRDhnYVc1cGRHbGhiR2w2WlZCeWIyMXBjMlVvZEdocGN5d2djbVZ6YjJ4MlpYSXBJRG9nYm1WbFpITk9aWGNvS1R0Y2JpQWdmVnh1ZlZ4dVhHNVFjbTl0YVhObExtRnNiQ0E5SUdGc2JEdGNibEJ5YjIxcGMyVXVjbUZqWlNBOUlISmhZMlU3WEc1UWNtOXRhWE5sTG5KbGMyOXNkbVVnUFNCeVpYTnZiSFpsTzF4dVVISnZiV2x6WlM1eVpXcGxZM1FnUFNCeVpXcGxZM1E3WEc1UWNtOXRhWE5sTGw5elpYUlRZMmhsWkhWc1pYSWdQU0J6WlhSVFkyaGxaSFZzWlhJN1hHNVFjbTl0YVhObExsOXpaWFJCYzJGd0lEMGdjMlYwUVhOaGNEdGNibEJ5YjIxcGMyVXVYMkZ6WVhBZ1BTQmhjMkZ3TzF4dVhHNVFjbTl0YVhObExuQnliM1J2ZEhsd1pTQTlJSHRjYmlBZ1kyOXVjM1J5ZFdOMGIzSTZJRkJ5YjIxcGMyVXNYRzVjYmlBZ0x5b3FYRzRnSUNBZ1ZHaGxJSEJ5YVcxaGNua2dkMkY1SUc5bUlHbHVkR1Z5WVdOMGFXNW5JSGRwZEdnZ1lTQndjbTl0YVhObElHbHpJSFJvY205MVoyZ2dhWFJ6SUdCMGFHVnVZQ0J0WlhSb2IyUXNYRzRnSUNBZ2QyaHBZMmdnY21WbmFYTjBaWEp6SUdOaGJHeGlZV05yY3lCMGJ5QnlaV05sYVhabElHVnBkR2hsY2lCaElIQnliMjFwYzJVbmN5QmxkbVZ1ZEhWaGJDQjJZV3gxWlNCdmNpQjBhR1ZjYmlBZ0lDQnlaV0Z6YjI0Z2QyaDVJSFJvWlNCd2NtOXRhWE5sSUdOaGJtNXZkQ0JpWlNCbWRXeG1hV3hzWldRdVhHNGdJRnh1SUNBZ0lHQmdZR3B6WEc0Z0lDQWdabWx1WkZWelpYSW9LUzUwYUdWdUtHWjFibU4wYVc5dUtIVnpaWElwZTF4dUlDQWdJQ0FnTHk4Z2RYTmxjaUJwY3lCaGRtRnBiR0ZpYkdWY2JpQWdJQ0I5TENCbWRXNWpkR2x2YmloeVpXRnpiMjRwZTF4dUlDQWdJQ0FnTHk4Z2RYTmxjaUJwY3lCMWJtRjJZV2xzWVdKc1pTd2dZVzVrSUhsdmRTQmhjbVVnWjJsMlpXNGdkR2hsSUhKbFlYTnZiaUIzYUhsY2JpQWdJQ0I5S1R0Y2JpQWdJQ0JnWUdCY2JpQWdYRzRnSUNBZ1EyaGhhVzVwYm1kY2JpQWdJQ0F0TFMwdExTMHRMVnh1SUNCY2JpQWdJQ0JVYUdVZ2NtVjBkWEp1SUhaaGJIVmxJRzltSUdCMGFHVnVZQ0JwY3lCcGRITmxiR1lnWVNCd2NtOXRhWE5sTGlBZ1ZHaHBjeUJ6WldOdmJtUXNJQ2RrYjNkdWMzUnlaV0Z0SjF4dUlDQWdJSEJ5YjIxcGMyVWdhWE1nY21WemIyeDJaV1FnZDJsMGFDQjBhR1VnY21WMGRYSnVJSFpoYkhWbElHOW1JSFJvWlNCbWFYSnpkQ0J3Y205dGFYTmxKM01nWm5Wc1ptbHNiRzFsYm5SY2JpQWdJQ0J2Y2lCeVpXcGxZM1JwYjI0Z2FHRnVaR3hsY2l3Z2IzSWdjbVZxWldOMFpXUWdhV1lnZEdobElHaGhibVJzWlhJZ2RHaHliM2R6SUdGdUlHVjRZMlZ3ZEdsdmJpNWNiaUFnWEc0Z0lDQWdZR0JnYW5OY2JpQWdJQ0JtYVc1a1ZYTmxjaWdwTG5Sb1pXNG9ablZ1WTNScGIyNGdLSFZ6WlhJcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMWMyVnlMbTVoYldVN1hHNGdJQ0FnZlN3Z1puVnVZM1JwYjI0Z0tISmxZWE52YmlrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUNka1pXWmhkV3gwSUc1aGJXVW5PMXh1SUNBZ0lIMHBMblJvWlc0b1puVnVZM1JwYjI0Z0tIVnpaWEpPWVcxbEtTQjdYRzRnSUNBZ0lDQXZMeUJKWmlCZ1ptbHVaRlZ6WlhKZ0lHWjFiR1pwYkd4bFpDd2dZSFZ6WlhKT1lXMWxZQ0IzYVd4c0lHSmxJSFJvWlNCMWMyVnlKM01nYm1GdFpTd2diM1JvWlhKM2FYTmxJR2wwWEc0Z0lDQWdJQ0F2THlCM2FXeHNJR0psSUdBblpHVm1ZWFZzZENCdVlXMWxKMkJjYmlBZ0lDQjlLVHRjYmlBZ1hHNGdJQ0FnWm1sdVpGVnpaWElvS1M1MGFHVnVLR1oxYm1OMGFXOXVJQ2gxYzJWeUtTQjdYRzRnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0owWnZkVzVrSUhWelpYSXNJR0oxZENCemRHbHNiQ0IxYm1oaGNIQjVKeWs3WEc0Z0lDQWdmU3dnWm5WdVkzUnBiMjRnS0hKbFlYTnZiaWtnZTF4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2RnWm1sdVpGVnpaWEpnSUhKbGFtVmpkR1ZrSUdGdVpDQjNaU2R5WlNCMWJtaGhjSEI1SnlrN1hHNGdJQ0FnZlNrdWRHaGxiaWhtZFc1amRHbHZiaUFvZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJQzh2SUc1bGRtVnlJSEpsWVdOb1pXUmNiaUFnSUNCOUxDQm1kVzVqZEdsdmJpQW9jbVZoYzI5dUtTQjdYRzRnSUNBZ0lDQXZMeUJwWmlCZ1ptbHVaRlZ6WlhKZ0lHWjFiR1pwYkd4bFpDd2dZSEpsWVhOdmJtQWdkMmxzYkNCaVpTQW5SbTkxYm1RZ2RYTmxjaXdnWW5WMElITjBhV3hzSUhWdWFHRndjSGtuTGx4dUlDQWdJQ0FnTHk4Z1NXWWdZR1pwYm1SVmMyVnlZQ0J5WldwbFkzUmxaQ3dnWUhKbFlYTnZibUFnZDJsc2JDQmlaU0FuWUdacGJtUlZjMlZ5WUNCeVpXcGxZM1JsWkNCaGJtUWdkMlVuY21VZ2RXNW9ZWEJ3ZVNjdVhHNGdJQ0FnZlNrN1hHNGdJQ0FnWUdCZ1hHNGdJQ0FnU1dZZ2RHaGxJR1J2ZDI1emRISmxZVzBnY0hKdmJXbHpaU0JrYjJWeklHNXZkQ0J6Y0dWamFXWjVJR0VnY21WcVpXTjBhVzl1SUdoaGJtUnNaWElzSUhKbGFtVmpkR2x2YmlCeVpXRnpiMjV6SUhkcGJHd2dZbVVnY0hKdmNHRm5ZWFJsWkNCbWRYSjBhR1Z5SUdSdmQyNXpkSEpsWVcwdVhHNGdJRnh1SUNBZ0lHQmdZR3B6WEc0Z0lDQWdabWx1WkZWelpYSW9LUzUwYUdWdUtHWjFibU4wYVc5dUlDaDFjMlZ5S1NCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1VHVmtZV2R2WjJsallXeEZlR05sY0hScGIyNG9KMVZ3YzNSeVpXRnRJR1Z5Y205eUp5azdYRzRnSUNBZ2ZTa3VkR2hsYmlobWRXNWpkR2x2YmlBb2RtRnNkV1VwSUh0Y2JpQWdJQ0FnSUM4dklHNWxkbVZ5SUhKbFlXTm9aV1JjYmlBZ0lDQjlLUzUwYUdWdUtHWjFibU4wYVc5dUlDaDJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ0x5OGdibVYyWlhJZ2NtVmhZMmhsWkZ4dUlDQWdJSDBzSUdaMWJtTjBhVzl1SUNoeVpXRnpiMjRwSUh0Y2JpQWdJQ0FnSUM4dklGUm9aU0JnVUdWa1oyRm5iMk5wWVd4RmVHTmxjSFJwYjI1Z0lHbHpJSEJ5YjNCaFoyRjBaV1FnWVd4c0lIUm9aU0IzWVhrZ1pHOTNiaUIwYnlCb1pYSmxYRzRnSUNBZ2ZTazdYRzRnSUNBZ1lHQmdYRzRnSUZ4dUlDQWdJRUZ6YzJsdGFXeGhkR2x2Ymx4dUlDQWdJQzB0TFMwdExTMHRMUzB0TFZ4dUlDQmNiaUFnSUNCVGIyMWxkR2x0WlhNZ2RHaGxJSFpoYkhWbElIbHZkU0IzWVc1MElIUnZJSEJ5YjNCaFoyRjBaU0IwYnlCaElHUnZkMjV6ZEhKbFlXMGdjSEp2YldselpTQmpZVzRnYjI1c2VTQmlaVnh1SUNBZ0lISmxkSEpwWlhabFpDQmhjM2x1WTJoeWIyNXZkWE5zZVM0Z1ZHaHBjeUJqWVc0Z1ltVWdZV05vYVdWMlpXUWdZbmtnY21WMGRYSnVhVzVuSUdFZ2NISnZiV2x6WlNCcGJpQjBhR1ZjYmlBZ0lDQm1kV3htYVd4c2JXVnVkQ0J2Y2lCeVpXcGxZM1JwYjI0Z2FHRnVaR3hsY2k0Z1ZHaGxJR1J2ZDI1emRISmxZVzBnY0hKdmJXbHpaU0IzYVd4c0lIUm9aVzRnWW1VZ2NHVnVaR2x1WjF4dUlDQWdJSFZ1ZEdsc0lIUm9aU0J5WlhSMWNtNWxaQ0J3Y205dGFYTmxJR2x6SUhObGRIUnNaV1F1SUZSb2FYTWdhWE1nWTJGc2JHVmtJQ3BoYzNOcGJXbHNZWFJwYjI0cUxseHVJQ0JjYmlBZ0lDQmdZR0JxYzF4dUlDQWdJR1pwYm1SVmMyVnlLQ2t1ZEdobGJpaG1kVzVqZEdsdmJpQW9kWE5sY2lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdacGJtUkRiMjF0Wlc1MGMwSjVRWFYwYUc5eUtIVnpaWElwTzF4dUlDQWdJSDBwTG5Sb1pXNG9ablZ1WTNScGIyNGdLR052YlcxbGJuUnpLU0I3WEc0Z0lDQWdJQ0F2THlCVWFHVWdkWE5sY2lkeklHTnZiVzFsYm5SeklHRnlaU0J1YjNjZ1lYWmhhV3hoWW14bFhHNGdJQ0FnZlNrN1hHNGdJQ0FnWUdCZ1hHNGdJRnh1SUNBZ0lFbG1JSFJvWlNCaGMzTnBiV3hwWVhSbFpDQndjbTl0YVhObElISmxhbVZqZEhNc0lIUm9aVzRnZEdobElHUnZkMjV6ZEhKbFlXMGdjSEp2YldselpTQjNhV3hzSUdGc2MyOGdjbVZxWldOMExseHVJQ0JjYmlBZ0lDQmdZR0JxYzF4dUlDQWdJR1pwYm1SVmMyVnlLQ2t1ZEdobGJpaG1kVzVqZEdsdmJpQW9kWE5sY2lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdacGJtUkRiMjF0Wlc1MGMwSjVRWFYwYUc5eUtIVnpaWElwTzF4dUlDQWdJSDBwTG5Sb1pXNG9ablZ1WTNScGIyNGdLR052YlcxbGJuUnpLU0I3WEc0Z0lDQWdJQ0F2THlCSlppQmdabWx1WkVOdmJXMWxiblJ6UW5sQmRYUm9iM0pnSUdaMWJHWnBiR3h6TENCM1pTZHNiQ0JvWVhabElIUm9aU0IyWVd4MVpTQm9aWEpsWEc0Z0lDQWdmU3dnWm5WdVkzUnBiMjRnS0hKbFlYTnZiaWtnZTF4dUlDQWdJQ0FnTHk4Z1NXWWdZR1pwYm1SRGIyMXRaVzUwYzBKNVFYVjBhRzl5WUNCeVpXcGxZM1J6TENCM1pTZHNiQ0JvWVhabElIUm9aU0J5WldGemIyNGdhR1Z5WlZ4dUlDQWdJSDBwTzF4dUlDQWdJR0JnWUZ4dUlDQmNiaUFnSUNCVGFXMXdiR1VnUlhoaGJYQnNaVnh1SUNBZ0lDMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lGeHVJQ0FnSUZONWJtTm9jbTl1YjNWeklFVjRZVzF3YkdWY2JpQWdYRzRnSUNBZ1lHQmdhbUYyWVhOamNtbHdkRnh1SUNBZ0lHeGxkQ0J5WlhOMWJIUTdYRzRnSUZ4dUlDQWdJSFJ5ZVNCN1hHNGdJQ0FnSUNCeVpYTjFiSFFnUFNCbWFXNWtVbVZ6ZFd4MEtDazdYRzRnSUNBZ0lDQXZMeUJ6ZFdOalpYTnpYRzRnSUNBZ2ZTQmpZWFJqYUNoeVpXRnpiMjRwSUh0Y2JpQWdJQ0FnSUM4dklHWmhhV3gxY21WY2JpQWdJQ0I5WEc0Z0lDQWdZR0JnWEc0Z0lGeHVJQ0FnSUVWeWNtSmhZMnNnUlhoaGJYQnNaVnh1SUNCY2JpQWdJQ0JnWUdCcWMxeHVJQ0FnSUdacGJtUlNaWE4xYkhRb1puVnVZM1JwYjI0b2NtVnpkV3gwTENCbGNuSXBlMXh1SUNBZ0lDQWdhV1lnS0dWeWNpa2dlMXh1SUNBZ0lDQWdJQ0F2THlCbVlXbHNkWEpsWEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0F2THlCemRXTmpaWE56WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU2s3WEc0Z0lDQWdZR0JnWEc0Z0lGeHVJQ0FnSUZCeWIyMXBjMlVnUlhoaGJYQnNaVHRjYmlBZ1hHNGdJQ0FnWUdCZ2FtRjJZWE5qY21sd2RGeHVJQ0FnSUdacGJtUlNaWE4xYkhRb0tTNTBhR1Z1S0daMWJtTjBhVzl1S0hKbGMzVnNkQ2w3WEc0Z0lDQWdJQ0F2THlCemRXTmpaWE56WEc0Z0lDQWdmU3dnWm5WdVkzUnBiMjRvY21WaGMyOXVLWHRjYmlBZ0lDQWdJQzh2SUdaaGFXeDFjbVZjYmlBZ0lDQjlLVHRjYmlBZ0lDQmdZR0JjYmlBZ1hHNGdJQ0FnUVdSMllXNWpaV1FnUlhoaGJYQnNaVnh1SUNBZ0lDMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lGeHVJQ0FnSUZONWJtTm9jbTl1YjNWeklFVjRZVzF3YkdWY2JpQWdYRzRnSUNBZ1lHQmdhbUYyWVhOamNtbHdkRnh1SUNBZ0lHeGxkQ0JoZFhSb2IzSXNJR0p2YjJ0ek8xeHVJQ0JjYmlBZ0lDQjBjbmtnZTF4dUlDQWdJQ0FnWVhWMGFHOXlJRDBnWm1sdVpFRjFkR2h2Y2lncE8xeHVJQ0FnSUNBZ1ltOXZhM01nSUQwZ1ptbHVaRUp2YjJ0elFubEJkWFJvYjNJb1lYVjBhRzl5S1R0Y2JpQWdJQ0FnSUM4dklITjFZMk5sYzNOY2JpQWdJQ0I5SUdOaGRHTm9LSEpsWVhOdmJpa2dlMXh1SUNBZ0lDQWdMeThnWm1GcGJIVnlaVnh1SUNBZ0lIMWNiaUFnSUNCZ1lHQmNiaUFnWEc0Z0lDQWdSWEp5WW1GamF5QkZlR0Z0Y0d4bFhHNGdJRnh1SUNBZ0lHQmdZR3B6WEc0Z0lGeHVJQ0FnSUdaMWJtTjBhVzl1SUdadmRXNWtRbTl2YTNNb1ltOXZhM01wSUh0Y2JpQWdYRzRnSUNBZ2ZWeHVJQ0JjYmlBZ0lDQm1kVzVqZEdsdmJpQm1ZV2xzZFhKbEtISmxZWE52YmlrZ2UxeHVJQ0JjYmlBZ0lDQjlYRzRnSUZ4dUlDQWdJR1pwYm1SQmRYUm9iM0lvWm5WdVkzUnBiMjRvWVhWMGFHOXlMQ0JsY25JcGUxeHVJQ0FnSUNBZ2FXWWdLR1Z5Y2lrZ2UxeHVJQ0FnSUNBZ0lDQm1ZV2xzZFhKbEtHVnljaWs3WEc0Z0lDQWdJQ0FnSUM4dklHWmhhV3gxY21WY2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUhSeWVTQjdYRzRnSUNBZ0lDQWdJQ0FnWm1sdVpFSnZiMjlyYzBKNVFYVjBhRzl5S0dGMWRHaHZjaXdnWm5WdVkzUnBiMjRvWW05dmEzTXNJR1Z5Y2lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHVnljaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JtWVdsc2RYSmxLR1Z5Y2lrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjBjbmtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdadmRXNWtRbTl2YTNNb1ltOXZhM01wTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0I5SUdOaGRHTm9LSEpsWVhOdmJpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1poYVd4MWNtVW9jbVZoYzI5dUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdJQ0I5SUdOaGRHTm9LR1Z5Y205eUtTQjdYRzRnSUNBZ0lDQWdJQ0FnWm1GcGJIVnlaU2hsY25JcE8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQzh2SUhOMVkyTmxjM05jYmlBZ0lDQWdJSDFjYmlBZ0lDQjlLVHRjYmlBZ0lDQmdZR0JjYmlBZ1hHNGdJQ0FnVUhKdmJXbHpaU0JGZUdGdGNHeGxPMXh1SUNCY2JpQWdJQ0JnWUdCcVlYWmhjMk55YVhCMFhHNGdJQ0FnWm1sdVpFRjFkR2h2Y2lncExseHVJQ0FnSUNBZ2RHaGxiaWhtYVc1a1FtOXZhM05DZVVGMWRHaHZjaWt1WEc0Z0lDQWdJQ0IwYUdWdUtHWjFibU4wYVc5dUtHSnZiMnR6S1h0Y2JpQWdJQ0FnSUNBZ0x5OGdabTkxYm1RZ1ltOXZhM05jYmlBZ0lDQjlLUzVqWVhSamFDaG1kVzVqZEdsdmJpaHlaV0Z6YjI0cGUxeHVJQ0FnSUNBZ0x5OGdjMjl0WlhSb2FXNW5JSGRsYm5RZ2QzSnZibWRjYmlBZ0lDQjlLVHRjYmlBZ0lDQmdZR0JjYmlBZ1hHNGdJQ0FnUUcxbGRHaHZaQ0IwYUdWdVhHNGdJQ0FnUUhCaGNtRnRJSHRHZFc1amRHbHZibjBnYjI1R2RXeG1hV3hzWldSY2JpQWdJQ0JBY0dGeVlXMGdlMFoxYm1OMGFXOXVmU0J2YmxKbGFtVmpkR1ZrWEc0Z0lDQWdWWE5sWm5Wc0lHWnZjaUIwYjI5c2FXNW5MbHh1SUNBZ0lFQnlaWFIxY200Z2UxQnliMjFwYzJWOVhHNGdJQ292WEc0Z0lIUm9aVzQ2SUhSb1pXNHNYRzVjYmlBZ0x5b3FYRzRnSUNBZ1lHTmhkR05vWUNCcGN5QnphVzF3YkhrZ2MzVm5ZWElnWm05eUlHQjBhR1Z1S0hWdVpHVm1hVzVsWkN3Z2IyNVNaV3BsWTNScGIyNHBZQ0IzYUdsamFDQnRZV3RsY3lCcGRDQjBhR1VnYzJGdFpWeHVJQ0FnSUdGeklIUm9aU0JqWVhSamFDQmliRzlqYXlCdlppQmhJSFJ5ZVM5allYUmphQ0J6ZEdGMFpXMWxiblF1WEc0Z0lGeHVJQ0FnSUdCZ1lHcHpYRzRnSUNBZ1puVnVZM1JwYjI0Z1ptbHVaRUYxZEdodmNpZ3BlMXh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZGpiM1ZzWkc0bmRDQm1hVzVrSUhSb1lYUWdZWFYwYUc5eUp5azdYRzRnSUNBZ2ZWeHVJQ0JjYmlBZ0lDQXZMeUJ6ZVc1amFISnZibTkxYzF4dUlDQWdJSFJ5ZVNCN1hHNGdJQ0FnSUNCbWFXNWtRWFYwYUc5eUtDazdYRzRnSUNBZ2ZTQmpZWFJqYUNoeVpXRnpiMjRwSUh0Y2JpQWdJQ0FnSUM4dklITnZiV1YwYUdsdVp5QjNaVzUwSUhkeWIyNW5YRzRnSUNBZ2ZWeHVJQ0JjYmlBZ0lDQXZMeUJoYzNsdVl5QjNhWFJvSUhCeWIyMXBjMlZ6WEc0Z0lDQWdabWx1WkVGMWRHaHZjaWdwTG1OaGRHTm9LR1oxYm1OMGFXOXVLSEpsWVhOdmJpbDdYRzRnSUNBZ0lDQXZMeUJ6YjIxbGRHaHBibWNnZDJWdWRDQjNjbTl1WjF4dUlDQWdJSDBwTzF4dUlDQWdJR0JnWUZ4dUlDQmNiaUFnSUNCQWJXVjBhRzlrSUdOaGRHTm9YRzRnSUNBZ1FIQmhjbUZ0SUh0R2RXNWpkR2x2Ym4wZ2IyNVNaV3BsWTNScGIyNWNiaUFnSUNCVmMyVm1kV3dnWm05eUlIUnZiMnhwYm1jdVhHNGdJQ0FnUUhKbGRIVnliaUI3VUhKdmJXbHpaWDFjYmlBZ0tpOWNiaUFnSjJOaGRHTm9Kem9nWm5WdVkzUnBiMjRnWDJOaGRHTm9LRzl1VW1WcVpXTjBhVzl1S1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdWRHaGxiaWh1ZFd4c0xDQnZibEpsYW1WamRHbHZiaWs3WEc0Z0lIMWNibjA3WEc1Y2JtWjFibU4wYVc5dUlIQnZiSGxtYVd4c0tDa2dlMXh1SUNBZ0lIWmhjaUJzYjJOaGJDQTlJSFZ1WkdWbWFXNWxaRHRjYmx4dUlDQWdJR2xtSUNoMGVYQmxiMllnWjJ4dlltRnNJQ0U5UFNBbmRXNWtaV1pwYm1Wa0p5a2dlMXh1SUNBZ0lDQWdJQ0JzYjJOaGJDQTlJR2RzYjJKaGJEdGNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tIUjVjR1Z2WmlCelpXeG1JQ0U5UFNBbmRXNWtaV1pwYm1Wa0p5a2dlMXh1SUNBZ0lDQWdJQ0JzYjJOaGJDQTlJSE5sYkdZN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnZEhKNUlIdGNiaUFnSUNBZ0lDQWdJQ0FnSUd4dlkyRnNJRDBnUm5WdVkzUnBiMjRvSjNKbGRIVnliaUIwYUdsekp5a29LVHRjYmlBZ0lDQWdJQ0FnZlNCallYUmphQ0FvWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2R3YjJ4NVptbHNiQ0JtWVdsc1pXUWdZbVZqWVhWelpTQm5iRzlpWVd3Z2IySnFaV04wSUdseklIVnVZWFpoYVd4aFlteGxJR2x1SUhSb2FYTWdaVzUyYVhKdmJtMWxiblFuS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUhaaGNpQlFJRDBnYkc5allXd3VVSEp2YldselpUdGNibHh1SUNBZ0lHbG1JQ2hRS1NCN1hHNGdJQ0FnSUNBZ0lIWmhjaUJ3Y205dGFYTmxWRzlUZEhKcGJtY2dQU0J1ZFd4c08xeHVJQ0FnSUNBZ0lDQjBjbmtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjSEp2YldselpWUnZVM1J5YVc1bklEMGdUMkpxWldOMExuQnliM1J2ZEhsd1pTNTBiMU4wY21sdVp5NWpZV3hzS0ZBdWNtVnpiMngyWlNncEtUdGNiaUFnSUNBZ0lDQWdmU0JqWVhSamFDQW9aU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnYzJsc1pXNTBiSGtnYVdkdWIzSmxaRnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSEJ5YjIxcGMyVlViMU4wY21sdVp5QTlQVDBnSjF0dlltcGxZM1FnVUhKdmJXbHpaVjBuSUNZbUlDRlFMbU5oYzNRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJR3h2WTJGc0xsQnliMjFwYzJVZ1BTQlFjbTl0YVhObE8xeHVmVnh1WEc0dkx5QlRkSEpoYm1kbElHTnZiWEJoZEM0dVhHNVFjbTl0YVhObExuQnZiSGxtYVd4c0lEMGdjRzlzZVdacGJHdzdYRzVRY205dGFYTmxMbEJ5YjIxcGMyVWdQU0JRY205dGFYTmxPMXh1WEc1eVpYUjFjbTRnVUhKdmJXbHpaVHRjYmx4dWZTa3BLVHRjYmk4dkl5QnpiM1Z5WTJWTllYQndhVzVuVlZKTVBXVnpOaTF3Y205dGFYTmxMbTFoY0NKZGZRPT0iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5NdXRhdGlvbk9ic2VydmVyID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuTXV0YXRpb25PYnNlcnZlcjtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICB2YXIgcXVldWUgPSBbXTtcblxuICAgIGlmIChjYW5NdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgICAgIHZhciBoaWRkZW5EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcXVldWVMaXN0ID0gcXVldWUuc2xpY2UoKTtcbiAgICAgICAgICAgIHF1ZXVlLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBxdWV1ZUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoaGlkZGVuRGl2LCB7IGF0dHJpYnV0ZXM6IHRydWUgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBpZiAoIXF1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGhpZGRlbkRpdi5zZXRBdHRyaWJ1dGUoJ3llcycsICdubycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVwbGFjZSA9IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZTtcbnZhciBwZXJjZW50VHdlbnRpZXMgPSAvJTIwL2c7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgICdkZWZhdWx0JzogJ1JGQzM5ODYnLFxuICAgIGZvcm1hdHRlcnM6IHtcbiAgICAgICAgUkZDMTczODogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVwbGFjZS5jYWxsKHZhbHVlLCBwZXJjZW50VHdlbnRpZXMsICcrJyk7XG4gICAgICAgIH0sXG4gICAgICAgIFJGQzM5ODY6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBSRkMxNzM4OiAnUkZDMTczOCcsXG4gICAgUkZDMzk4NjogJ1JGQzM5ODYnXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9zdHJpbmdpZnknKTtcbnZhciBwYXJzZSA9IHJlcXVpcmUoJy4vcGFyc2UnKTtcbnZhciBmb3JtYXRzID0gcmVxdWlyZSgnLi9mb3JtYXRzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZvcm1hdHM6IGZvcm1hdHMsXG4gICAgcGFyc2U6IHBhcnNlLFxuICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgZGVmYXVsdHMgPSB7XG4gICAgYWxsb3dEb3RzOiBmYWxzZSxcbiAgICBhbGxvd1Byb3RvdHlwZXM6IGZhbHNlLFxuICAgIGFycmF5TGltaXQ6IDIwLFxuICAgIGRlY29kZXI6IHV0aWxzLmRlY29kZSxcbiAgICBkZWxpbWl0ZXI6ICcmJyxcbiAgICBkZXB0aDogNSxcbiAgICBwYXJhbWV0ZXJMaW1pdDogMTAwMCxcbiAgICBwbGFpbk9iamVjdHM6IGZhbHNlLFxuICAgIHN0cmljdE51bGxIYW5kbGluZzogZmFsc2Vcbn07XG5cbnZhciBwYXJzZVZhbHVlcyA9IGZ1bmN0aW9uIHBhcnNlUXVlcnlTdHJpbmdWYWx1ZXMoc3RyLCBvcHRpb25zKSB7XG4gICAgdmFyIG9iaiA9IHt9O1xuICAgIHZhciBwYXJ0cyA9IHN0ci5zcGxpdChvcHRpb25zLmRlbGltaXRlciwgb3B0aW9ucy5wYXJhbWV0ZXJMaW1pdCA9PT0gSW5maW5pdHkgPyB1bmRlZmluZWQgOiBvcHRpb25zLnBhcmFtZXRlckxpbWl0KTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIHBhcnQgPSBwYXJ0c1tpXTtcbiAgICAgICAgdmFyIHBvcyA9IHBhcnQuaW5kZXhPZignXT0nKSA9PT0gLTEgPyBwYXJ0LmluZGV4T2YoJz0nKSA6IHBhcnQuaW5kZXhPZignXT0nKSArIDE7XG5cbiAgICAgICAgdmFyIGtleSwgdmFsO1xuICAgICAgICBpZiAocG9zID09PSAtMSkge1xuICAgICAgICAgICAga2V5ID0gb3B0aW9ucy5kZWNvZGVyKHBhcnQpO1xuICAgICAgICAgICAgdmFsID0gb3B0aW9ucy5zdHJpY3ROdWxsSGFuZGxpbmcgPyBudWxsIDogJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBrZXkgPSBvcHRpb25zLmRlY29kZXIocGFydC5zbGljZSgwLCBwb3MpKTtcbiAgICAgICAgICAgIHZhbCA9IG9wdGlvbnMuZGVjb2RlcihwYXJ0LnNsaWNlKHBvcyArIDEpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzLmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgICAgICBvYmpba2V5XSA9IFtdLmNvbmNhdChvYmpba2V5XSkuY29uY2F0KHZhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmpba2V5XSA9IHZhbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG59O1xuXG52YXIgcGFyc2VPYmplY3QgPSBmdW5jdGlvbiBwYXJzZU9iamVjdFJlY3Vyc2l2ZShjaGFpbiwgdmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKCFjaGFpbi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICB2YXIgcm9vdCA9IGNoYWluLnNoaWZ0KCk7XG5cbiAgICB2YXIgb2JqO1xuICAgIGlmIChyb290ID09PSAnW10nKSB7XG4gICAgICAgIG9iaiA9IFtdO1xuICAgICAgICBvYmogPSBvYmouY29uY2F0KHBhcnNlT2JqZWN0KGNoYWluLCB2YWwsIG9wdGlvbnMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmogPSBvcHRpb25zLnBsYWluT2JqZWN0cyA/IE9iamVjdC5jcmVhdGUobnVsbCkgOiB7fTtcbiAgICAgICAgdmFyIGNsZWFuUm9vdCA9IHJvb3QuY2hhckF0KDApID09PSAnWycgJiYgcm9vdC5jaGFyQXQocm9vdC5sZW5ndGggLSAxKSA9PT0gJ10nID8gcm9vdC5zbGljZSgxLCAtMSkgOiByb290O1xuICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludChjbGVhblJvb3QsIDEwKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWlzTmFOKGluZGV4KSAmJlxuICAgICAgICAgICAgcm9vdCAhPT0gY2xlYW5Sb290ICYmXG4gICAgICAgICAgICBTdHJpbmcoaW5kZXgpID09PSBjbGVhblJvb3QgJiZcbiAgICAgICAgICAgIGluZGV4ID49IDAgJiZcbiAgICAgICAgICAgIChvcHRpb25zLnBhcnNlQXJyYXlzICYmIGluZGV4IDw9IG9wdGlvbnMuYXJyYXlMaW1pdClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBvYmogPSBbXTtcbiAgICAgICAgICAgIG9ialtpbmRleF0gPSBwYXJzZU9iamVjdChjaGFpbiwgdmFsLCBvcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9ialtjbGVhblJvb3RdID0gcGFyc2VPYmplY3QoY2hhaW4sIHZhbCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxudmFyIHBhcnNlS2V5cyA9IGZ1bmN0aW9uIHBhcnNlUXVlcnlTdHJpbmdLZXlzKGdpdmVuS2V5LCB2YWwsIG9wdGlvbnMpIHtcbiAgICBpZiAoIWdpdmVuS2V5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUcmFuc2Zvcm0gZG90IG5vdGF0aW9uIHRvIGJyYWNrZXQgbm90YXRpb25cbiAgICB2YXIga2V5ID0gb3B0aW9ucy5hbGxvd0RvdHMgPyBnaXZlbktleS5yZXBsYWNlKC9cXC4oW14uW10rKS9nLCAnWyQxXScpIDogZ2l2ZW5LZXk7XG5cbiAgICAvLyBUaGUgcmVnZXggY2h1bmtzXG5cbiAgICB2YXIgYnJhY2tldHMgPSAvKFxcW1teW1xcXV0qXSkvO1xuICAgIHZhciBjaGlsZCA9IC8oXFxbW15bXFxdXSpdKS9nO1xuXG4gICAgLy8gR2V0IHRoZSBwYXJlbnRcblxuICAgIHZhciBzZWdtZW50ID0gYnJhY2tldHMuZXhlYyhrZXkpO1xuICAgIHZhciBwYXJlbnQgPSBzZWdtZW50ID8ga2V5LnNsaWNlKDAsIHNlZ21lbnQuaW5kZXgpIDoga2V5O1xuXG4gICAgLy8gU3Rhc2ggdGhlIHBhcmVudCBpZiBpdCBleGlzdHNcblxuICAgIHZhciBrZXlzID0gW107XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgICAvLyBJZiB3ZSBhcmVuJ3QgdXNpbmcgcGxhaW4gb2JqZWN0cywgb3B0aW9uYWxseSBwcmVmaXgga2V5c1xuICAgICAgICAvLyB0aGF0IHdvdWxkIG92ZXJ3cml0ZSBvYmplY3QgcHJvdG90eXBlIHByb3BlcnRpZXNcbiAgICAgICAgaWYgKCFvcHRpb25zLnBsYWluT2JqZWN0cyAmJiBoYXMuY2FsbChPYmplY3QucHJvdG90eXBlLCBwYXJlbnQpKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuYWxsb3dQcm90b3R5cGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAga2V5cy5wdXNoKHBhcmVudCk7XG4gICAgfVxuXG4gICAgLy8gTG9vcCB0aHJvdWdoIGNoaWxkcmVuIGFwcGVuZGluZyB0byB0aGUgYXJyYXkgdW50aWwgd2UgaGl0IGRlcHRoXG5cbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKChzZWdtZW50ID0gY2hpbGQuZXhlYyhrZXkpKSAhPT0gbnVsbCAmJiBpIDwgb3B0aW9ucy5kZXB0aCkge1xuICAgICAgICBpICs9IDE7XG4gICAgICAgIGlmICghb3B0aW9ucy5wbGFpbk9iamVjdHMgJiYgaGFzLmNhbGwoT2JqZWN0LnByb3RvdHlwZSwgc2VnbWVudFsxXS5zbGljZSgxLCAtMSkpKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuYWxsb3dQcm90b3R5cGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGtleXMucHVzaChzZWdtZW50WzFdKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSdzIGEgcmVtYWluZGVyLCBqdXN0IGFkZCB3aGF0ZXZlciBpcyBsZWZ0XG5cbiAgICBpZiAoc2VnbWVudCkge1xuICAgICAgICBrZXlzLnB1c2goJ1snICsga2V5LnNsaWNlKHNlZ21lbnQuaW5kZXgpICsgJ10nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VPYmplY3Qoa2V5cywgdmFsLCBvcHRpb25zKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0ciwgb3B0cykge1xuICAgIHZhciBvcHRpb25zID0gb3B0cyB8fCB7fTtcblxuICAgIGlmIChvcHRpb25zLmRlY29kZXIgIT09IG51bGwgJiYgb3B0aW9ucy5kZWNvZGVyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMuZGVjb2RlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdEZWNvZGVyIGhhcyB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIG9wdGlvbnMuZGVsaW1pdGVyID0gdHlwZW9mIG9wdGlvbnMuZGVsaW1pdGVyID09PSAnc3RyaW5nJyB8fCB1dGlscy5pc1JlZ0V4cChvcHRpb25zLmRlbGltaXRlcikgPyBvcHRpb25zLmRlbGltaXRlciA6IGRlZmF1bHRzLmRlbGltaXRlcjtcbiAgICBvcHRpb25zLmRlcHRoID0gdHlwZW9mIG9wdGlvbnMuZGVwdGggPT09ICdudW1iZXInID8gb3B0aW9ucy5kZXB0aCA6IGRlZmF1bHRzLmRlcHRoO1xuICAgIG9wdGlvbnMuYXJyYXlMaW1pdCA9IHR5cGVvZiBvcHRpb25zLmFycmF5TGltaXQgPT09ICdudW1iZXInID8gb3B0aW9ucy5hcnJheUxpbWl0IDogZGVmYXVsdHMuYXJyYXlMaW1pdDtcbiAgICBvcHRpb25zLnBhcnNlQXJyYXlzID0gb3B0aW9ucy5wYXJzZUFycmF5cyAhPT0gZmFsc2U7XG4gICAgb3B0aW9ucy5kZWNvZGVyID0gdHlwZW9mIG9wdGlvbnMuZGVjb2RlciA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuZGVjb2RlciA6IGRlZmF1bHRzLmRlY29kZXI7XG4gICAgb3B0aW9ucy5hbGxvd0RvdHMgPSB0eXBlb2Ygb3B0aW9ucy5hbGxvd0RvdHMgPT09ICdib29sZWFuJyA/IG9wdGlvbnMuYWxsb3dEb3RzIDogZGVmYXVsdHMuYWxsb3dEb3RzO1xuICAgIG9wdGlvbnMucGxhaW5PYmplY3RzID0gdHlwZW9mIG9wdGlvbnMucGxhaW5PYmplY3RzID09PSAnYm9vbGVhbicgPyBvcHRpb25zLnBsYWluT2JqZWN0cyA6IGRlZmF1bHRzLnBsYWluT2JqZWN0cztcbiAgICBvcHRpb25zLmFsbG93UHJvdG90eXBlcyA9IHR5cGVvZiBvcHRpb25zLmFsbG93UHJvdG90eXBlcyA9PT0gJ2Jvb2xlYW4nID8gb3B0aW9ucy5hbGxvd1Byb3RvdHlwZXMgOiBkZWZhdWx0cy5hbGxvd1Byb3RvdHlwZXM7XG4gICAgb3B0aW9ucy5wYXJhbWV0ZXJMaW1pdCA9IHR5cGVvZiBvcHRpb25zLnBhcmFtZXRlckxpbWl0ID09PSAnbnVtYmVyJyA/IG9wdGlvbnMucGFyYW1ldGVyTGltaXQgOiBkZWZhdWx0cy5wYXJhbWV0ZXJMaW1pdDtcbiAgICBvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyA9IHR5cGVvZiBvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyA9PT0gJ2Jvb2xlYW4nID8gb3B0aW9ucy5zdHJpY3ROdWxsSGFuZGxpbmcgOiBkZWZhdWx0cy5zdHJpY3ROdWxsSGFuZGxpbmc7XG5cbiAgICBpZiAoc3RyID09PSAnJyB8fCBzdHIgPT09IG51bGwgfHwgdHlwZW9mIHN0ciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMucGxhaW5PYmplY3RzID8gT2JqZWN0LmNyZWF0ZShudWxsKSA6IHt9O1xuICAgIH1cblxuICAgIHZhciB0ZW1wT2JqID0gdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgPyBwYXJzZVZhbHVlcyhzdHIsIG9wdGlvbnMpIDogc3RyO1xuICAgIHZhciBvYmogPSBvcHRpb25zLnBsYWluT2JqZWN0cyA/IE9iamVjdC5jcmVhdGUobnVsbCkgOiB7fTtcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUga2V5cyBhbmQgc2V0dXAgdGhlIG5ldyBvYmplY3RcblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGVtcE9iaik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICB2YXIgbmV3T2JqID0gcGFyc2VLZXlzKGtleSwgdGVtcE9ialtrZXldLCBvcHRpb25zKTtcbiAgICAgICAgb2JqID0gdXRpbHMubWVyZ2Uob2JqLCBuZXdPYmosIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB1dGlscy5jb21wYWN0KG9iaik7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgZm9ybWF0cyA9IHJlcXVpcmUoJy4vZm9ybWF0cycpO1xuXG52YXIgYXJyYXlQcmVmaXhHZW5lcmF0b3JzID0ge1xuICAgIGJyYWNrZXRzOiBmdW5jdGlvbiBicmFja2V0cyhwcmVmaXgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBmdW5jLW5hbWUtbWF0Y2hpbmdcbiAgICAgICAgcmV0dXJuIHByZWZpeCArICdbXSc7XG4gICAgfSxcbiAgICBpbmRpY2VzOiBmdW5jdGlvbiBpbmRpY2VzKHByZWZpeCwga2V5KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZnVuYy1uYW1lLW1hdGNoaW5nXG4gICAgICAgIHJldHVybiBwcmVmaXggKyAnWycgKyBrZXkgKyAnXSc7XG4gICAgfSxcbiAgICByZXBlYXQ6IGZ1bmN0aW9uIHJlcGVhdChwcmVmaXgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBmdW5jLW5hbWUtbWF0Y2hpbmdcbiAgICAgICAgcmV0dXJuIHByZWZpeDtcbiAgICB9XG59O1xuXG52YXIgdG9JU08gPSBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZztcblxudmFyIGRlZmF1bHRzID0ge1xuICAgIGRlbGltaXRlcjogJyYnLFxuICAgIGVuY29kZTogdHJ1ZSxcbiAgICBlbmNvZGVyOiB1dGlscy5lbmNvZGUsXG4gICAgZW5jb2RlVmFsdWVzT25seTogZmFsc2UsXG4gICAgc2VyaWFsaXplRGF0ZTogZnVuY3Rpb24gc2VyaWFsaXplRGF0ZShkYXRlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZnVuYy1uYW1lLW1hdGNoaW5nXG4gICAgICAgIHJldHVybiB0b0lTTy5jYWxsKGRhdGUpO1xuICAgIH0sXG4gICAgc2tpcE51bGxzOiBmYWxzZSxcbiAgICBzdHJpY3ROdWxsSGFuZGxpbmc6IGZhbHNlXG59O1xuXG52YXIgc3RyaW5naWZ5ID0gZnVuY3Rpb24gc3RyaW5naWZ5KCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGZ1bmMtbmFtZS1tYXRjaGluZ1xuICAgIG9iamVjdCxcbiAgICBwcmVmaXgsXG4gICAgZ2VuZXJhdGVBcnJheVByZWZpeCxcbiAgICBzdHJpY3ROdWxsSGFuZGxpbmcsXG4gICAgc2tpcE51bGxzLFxuICAgIGVuY29kZXIsXG4gICAgZmlsdGVyLFxuICAgIHNvcnQsXG4gICAgYWxsb3dEb3RzLFxuICAgIHNlcmlhbGl6ZURhdGUsXG4gICAgZm9ybWF0dGVyLFxuICAgIGVuY29kZVZhbHVlc09ubHlcbikge1xuICAgIHZhciBvYmogPSBvYmplY3Q7XG4gICAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb2JqID0gZmlsdGVyKHByZWZpeCwgb2JqKTtcbiAgICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgb2JqID0gc2VyaWFsaXplRGF0ZShvYmopO1xuICAgIH0gZWxzZSBpZiAob2JqID09PSBudWxsKSB7XG4gICAgICAgIGlmIChzdHJpY3ROdWxsSGFuZGxpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBlbmNvZGVyICYmICFlbmNvZGVWYWx1ZXNPbmx5ID8gZW5jb2RlcihwcmVmaXgpIDogcHJlZml4O1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqID0gJyc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBvYmogPT09ICdudW1iZXInIHx8IHR5cGVvZiBvYmogPT09ICdib29sZWFuJyB8fCB1dGlscy5pc0J1ZmZlcihvYmopKSB7XG4gICAgICAgIGlmIChlbmNvZGVyKSB7XG4gICAgICAgICAgICB2YXIga2V5VmFsdWUgPSBlbmNvZGVWYWx1ZXNPbmx5ID8gcHJlZml4IDogZW5jb2RlcihwcmVmaXgpO1xuICAgICAgICAgICAgcmV0dXJuIFtmb3JtYXR0ZXIoa2V5VmFsdWUpICsgJz0nICsgZm9ybWF0dGVyKGVuY29kZXIob2JqKSldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbZm9ybWF0dGVyKHByZWZpeCkgKyAnPScgKyBmb3JtYXR0ZXIoU3RyaW5nKG9iaikpXTtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG5cbiAgICB2YXIgb2JqS2V5cztcbiAgICBpZiAoQXJyYXkuaXNBcnJheShmaWx0ZXIpKSB7XG4gICAgICAgIG9iaktleXMgPSBmaWx0ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgICBvYmpLZXlzID0gc29ydCA/IGtleXMuc29ydChzb3J0KSA6IGtleXM7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpLZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBvYmpLZXlzW2ldO1xuXG4gICAgICAgIGlmIChza2lwTnVsbHMgJiYgb2JqW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzLmNvbmNhdChzdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgb2JqW2tleV0sXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeChwcmVmaXgsIGtleSksXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeCxcbiAgICAgICAgICAgICAgICBzdHJpY3ROdWxsSGFuZGxpbmcsXG4gICAgICAgICAgICAgICAgc2tpcE51bGxzLFxuICAgICAgICAgICAgICAgIGVuY29kZXIsXG4gICAgICAgICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgICAgICAgIHNvcnQsXG4gICAgICAgICAgICAgICAgYWxsb3dEb3RzLFxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZURhdGUsXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyLFxuICAgICAgICAgICAgICAgIGVuY29kZVZhbHVlc09ubHlcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzLmNvbmNhdChzdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgb2JqW2tleV0sXG4gICAgICAgICAgICAgICAgcHJlZml4ICsgKGFsbG93RG90cyA/ICcuJyArIGtleSA6ICdbJyArIGtleSArICddJyksXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeCxcbiAgICAgICAgICAgICAgICBzdHJpY3ROdWxsSGFuZGxpbmcsXG4gICAgICAgICAgICAgICAgc2tpcE51bGxzLFxuICAgICAgICAgICAgICAgIGVuY29kZXIsXG4gICAgICAgICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgICAgICAgIHNvcnQsXG4gICAgICAgICAgICAgICAgYWxsb3dEb3RzLFxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZURhdGUsXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyLFxuICAgICAgICAgICAgICAgIGVuY29kZVZhbHVlc09ubHlcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgb3B0cykge1xuICAgIHZhciBvYmogPSBvYmplY3Q7XG4gICAgdmFyIG9wdGlvbnMgPSBvcHRzIHx8IHt9O1xuXG4gICAgaWYgKG9wdGlvbnMuZW5jb2RlciAhPT0gbnVsbCAmJiBvcHRpb25zLmVuY29kZXIgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5lbmNvZGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0VuY29kZXIgaGFzIHRvIGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgfVxuXG4gICAgdmFyIGRlbGltaXRlciA9IHR5cGVvZiBvcHRpb25zLmRlbGltaXRlciA9PT0gJ3VuZGVmaW5lZCcgPyBkZWZhdWx0cy5kZWxpbWl0ZXIgOiBvcHRpb25zLmRlbGltaXRlcjtcbiAgICB2YXIgc3RyaWN0TnVsbEhhbmRsaW5nID0gdHlwZW9mIG9wdGlvbnMuc3RyaWN0TnVsbEhhbmRsaW5nID09PSAnYm9vbGVhbicgPyBvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyA6IGRlZmF1bHRzLnN0cmljdE51bGxIYW5kbGluZztcbiAgICB2YXIgc2tpcE51bGxzID0gdHlwZW9mIG9wdGlvbnMuc2tpcE51bGxzID09PSAnYm9vbGVhbicgPyBvcHRpb25zLnNraXBOdWxscyA6IGRlZmF1bHRzLnNraXBOdWxscztcbiAgICB2YXIgZW5jb2RlID0gdHlwZW9mIG9wdGlvbnMuZW5jb2RlID09PSAnYm9vbGVhbicgPyBvcHRpb25zLmVuY29kZSA6IGRlZmF1bHRzLmVuY29kZTtcbiAgICB2YXIgZW5jb2RlciA9IHR5cGVvZiBvcHRpb25zLmVuY29kZXIgPT09ICdmdW5jdGlvbicgPyBvcHRpb25zLmVuY29kZXIgOiBkZWZhdWx0cy5lbmNvZGVyO1xuICAgIHZhciBzb3J0ID0gdHlwZW9mIG9wdGlvbnMuc29ydCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuc29ydCA6IG51bGw7XG4gICAgdmFyIGFsbG93RG90cyA9IHR5cGVvZiBvcHRpb25zLmFsbG93RG90cyA9PT0gJ3VuZGVmaW5lZCcgPyBmYWxzZSA6IG9wdGlvbnMuYWxsb3dEb3RzO1xuICAgIHZhciBzZXJpYWxpemVEYXRlID0gdHlwZW9mIG9wdGlvbnMuc2VyaWFsaXplRGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuc2VyaWFsaXplRGF0ZSA6IGRlZmF1bHRzLnNlcmlhbGl6ZURhdGU7XG4gICAgdmFyIGVuY29kZVZhbHVlc09ubHkgPSB0eXBlb2Ygb3B0aW9ucy5lbmNvZGVWYWx1ZXNPbmx5ID09PSAnYm9vbGVhbicgPyBvcHRpb25zLmVuY29kZVZhbHVlc09ubHkgOiBkZWZhdWx0cy5lbmNvZGVWYWx1ZXNPbmx5O1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5mb3JtYXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG9wdGlvbnMuZm9ybWF0ID0gZm9ybWF0cy5kZWZhdWx0O1xuICAgIH0gZWxzZSBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChmb3JtYXRzLmZvcm1hdHRlcnMsIG9wdGlvbnMuZm9ybWF0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGZvcm1hdCBvcHRpb24gcHJvdmlkZWQuJyk7XG4gICAgfVxuICAgIHZhciBmb3JtYXR0ZXIgPSBmb3JtYXRzLmZvcm1hdHRlcnNbb3B0aW9ucy5mb3JtYXRdO1xuICAgIHZhciBvYmpLZXlzO1xuICAgIHZhciBmaWx0ZXI7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuZmlsdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZpbHRlciA9IG9wdGlvbnMuZmlsdGVyO1xuICAgICAgICBvYmogPSBmaWx0ZXIoJycsIG9iaik7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbnMuZmlsdGVyKSkge1xuICAgICAgICBmaWx0ZXIgPSBvcHRpb25zLmZpbHRlcjtcbiAgICAgICAgb2JqS2V5cyA9IGZpbHRlcjtcbiAgICB9XG5cbiAgICB2YXIga2V5cyA9IFtdO1xuXG4gICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgdmFyIGFycmF5Rm9ybWF0O1xuICAgIGlmIChvcHRpb25zLmFycmF5Rm9ybWF0IGluIGFycmF5UHJlZml4R2VuZXJhdG9ycykge1xuICAgICAgICBhcnJheUZvcm1hdCA9IG9wdGlvbnMuYXJyYXlGb3JtYXQ7XG4gICAgfSBlbHNlIGlmICgnaW5kaWNlcycgaW4gb3B0aW9ucykge1xuICAgICAgICBhcnJheUZvcm1hdCA9IG9wdGlvbnMuaW5kaWNlcyA/ICdpbmRpY2VzJyA6ICdyZXBlYXQnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5Rm9ybWF0ID0gJ2luZGljZXMnO1xuICAgIH1cblxuICAgIHZhciBnZW5lcmF0ZUFycmF5UHJlZml4ID0gYXJyYXlQcmVmaXhHZW5lcmF0b3JzW2FycmF5Rm9ybWF0XTtcblxuICAgIGlmICghb2JqS2V5cykge1xuICAgICAgICBvYmpLZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICB9XG5cbiAgICBpZiAoc29ydCkge1xuICAgICAgICBvYmpLZXlzLnNvcnQoc29ydCk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpLZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBvYmpLZXlzW2ldO1xuXG4gICAgICAgIGlmIChza2lwTnVsbHMgJiYgb2JqW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAga2V5cyA9IGtleXMuY29uY2F0KHN0cmluZ2lmeShcbiAgICAgICAgICAgIG9ialtrZXldLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeCxcbiAgICAgICAgICAgIHN0cmljdE51bGxIYW5kbGluZyxcbiAgICAgICAgICAgIHNraXBOdWxscyxcbiAgICAgICAgICAgIGVuY29kZSA/IGVuY29kZXIgOiBudWxsLFxuICAgICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgICAgc29ydCxcbiAgICAgICAgICAgIGFsbG93RG90cyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZURhdGUsXG4gICAgICAgICAgICBmb3JtYXR0ZXIsXG4gICAgICAgICAgICBlbmNvZGVWYWx1ZXNPbmx5XG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIHJldHVybiBrZXlzLmpvaW4oZGVsaW1pdGVyKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgaGV4VGFibGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcnJheSA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgICAgICAgYXJyYXkucHVzaCgnJScgKyAoKGkgPCAxNiA/ICcwJyA6ICcnKSArIGkudG9TdHJpbmcoMTYpKS50b1VwcGVyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG59KCkpO1xuXG5leHBvcnRzLmFycmF5VG9PYmplY3QgPSBmdW5jdGlvbiAoc291cmNlLCBvcHRpb25zKSB7XG4gICAgdmFyIG9iaiA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wbGFpbk9iamVjdHMgPyBPYmplY3QuY3JlYXRlKG51bGwpIDoge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2VbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvYmpbaV0gPSBzb3VyY2VbaV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuICAgIGlmICghc291cmNlKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzb3VyY2UgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgICAgIHRhcmdldC5wdXNoKHNvdXJjZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnBsYWluT2JqZWN0cyB8fCBvcHRpb25zLmFsbG93UHJvdG90eXBlcyB8fCAhaGFzLmNhbGwoT2JqZWN0LnByb3RvdHlwZSwgc291cmNlKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtzb3VyY2VdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbdGFyZ2V0LCBzb3VyY2VdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIFt0YXJnZXRdLmNvbmNhdChzb3VyY2UpO1xuICAgIH1cblxuICAgIHZhciBtZXJnZVRhcmdldCA9IHRhcmdldDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpICYmICFBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgICAgbWVyZ2VUYXJnZXQgPSBleHBvcnRzLmFycmF5VG9PYmplY3QodGFyZ2V0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpICYmIEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICBzb3VyY2UuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgaWYgKGhhcy5jYWxsKHRhcmdldCwgaSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0W2ldICYmIHR5cGVvZiB0YXJnZXRbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFtpXSA9IGV4cG9ydHMubWVyZ2UodGFyZ2V0W2ldLCBpdGVtLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFtpXSA9IGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3Qua2V5cyhzb3VyY2UpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gc291cmNlW2tleV07XG5cbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhY2MsIGtleSkpIHtcbiAgICAgICAgICAgIGFjY1trZXldID0gZXhwb3J0cy5tZXJnZShhY2Nba2V5XSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWNjW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIG1lcmdlVGFyZ2V0KTtcbn07XG5cbmV4cG9ydHMuZGVjb2RlID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxufTtcblxuZXhwb3J0cy5lbmNvZGUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgLy8gVGhpcyBjb2RlIHdhcyBvcmlnaW5hbGx5IHdyaXR0ZW4gYnkgQnJpYW4gV2hpdGUgKG1zY2RleCkgZm9yIHRoZSBpby5qcyBjb3JlIHF1ZXJ5c3RyaW5nIGxpYnJhcnkuXG4gICAgLy8gSXQgaGFzIGJlZW4gYWRhcHRlZCBoZXJlIGZvciBzdHJpY3RlciBhZGhlcmVuY2UgdG8gUkZDIDM5ODZcbiAgICBpZiAoc3RyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIHZhciBzdHJpbmcgPSB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyA/IHN0ciA6IFN0cmluZyhzdHIpO1xuXG4gICAgdmFyIG91dCA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBjID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgYyA9PT0gMHgyRCB8fCAvLyAtXG4gICAgICAgICAgICBjID09PSAweDJFIHx8IC8vIC5cbiAgICAgICAgICAgIGMgPT09IDB4NUYgfHwgLy8gX1xuICAgICAgICAgICAgYyA9PT0gMHg3RSB8fCAvLyB+XG4gICAgICAgICAgICAoYyA+PSAweDMwICYmIGMgPD0gMHgzOSkgfHwgLy8gMC05XG4gICAgICAgICAgICAoYyA+PSAweDQxICYmIGMgPD0gMHg1QSkgfHwgLy8gYS16XG4gICAgICAgICAgICAoYyA+PSAweDYxICYmIGMgPD0gMHg3QSkgLy8gQS1aXG4gICAgICAgICkge1xuICAgICAgICAgICAgb3V0ICs9IHN0cmluZy5jaGFyQXQoaSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjIDwgMHg4MCkge1xuICAgICAgICAgICAgb3V0ID0gb3V0ICsgaGV4VGFibGVbY107XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjIDwgMHg4MDApIHtcbiAgICAgICAgICAgIG91dCA9IG91dCArIChoZXhUYWJsZVsweEMwIHwgKGMgPj4gNildICsgaGV4VGFibGVbMHg4MCB8IChjICYgMHgzRildKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGMgPCAweEQ4MDAgfHwgYyA+PSAweEUwMDApIHtcbiAgICAgICAgICAgIG91dCA9IG91dCArIChoZXhUYWJsZVsweEUwIHwgKGMgPj4gMTIpXSArIGhleFRhYmxlWzB4ODAgfCAoKGMgPj4gNikgJiAweDNGKV0gKyBoZXhUYWJsZVsweDgwIHwgKGMgJiAweDNGKV0pO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpICs9IDE7XG4gICAgICAgIGMgPSAweDEwMDAwICsgKCgoYyAmIDB4M0ZGKSA8PCAxMCkgfCAoc3RyaW5nLmNoYXJDb2RlQXQoaSkgJiAweDNGRikpO1xuICAgICAgICBvdXQgKz0gaGV4VGFibGVbMHhGMCB8IChjID4+IDE4KV0gKyBoZXhUYWJsZVsweDgwIHwgKChjID4+IDEyKSAmIDB4M0YpXSArIGhleFRhYmxlWzB4ODAgfCAoKGMgPj4gNikgJiAweDNGKV0gKyBoZXhUYWJsZVsweDgwIHwgKGMgJiAweDNGKV07IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxlblxuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG5leHBvcnRzLmNvbXBhY3QgPSBmdW5jdGlvbiAob2JqLCByZWZlcmVuY2VzKSB7XG4gICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIHZhciByZWZzID0gcmVmZXJlbmNlcyB8fCBbXTtcbiAgICB2YXIgbG9va3VwID0gcmVmcy5pbmRleE9mKG9iaik7XG4gICAgaWYgKGxvb2t1cCAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHJlZnNbbG9va3VwXTtcbiAgICB9XG5cbiAgICByZWZzLnB1c2gob2JqKTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgdmFyIGNvbXBhY3RlZCA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAob2JqW2ldICYmIHR5cGVvZiBvYmpbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgY29tcGFjdGVkLnB1c2goZXhwb3J0cy5jb21wYWN0KG9ialtpXSwgcmVmcykpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW2ldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGNvbXBhY3RlZC5wdXNoKG9ialtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcGFjdGVkO1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBvYmpba2V5XSA9IGV4cG9ydHMuY29tcGFjdChvYmpba2V5XSwgcmVmcyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuZXhwb3J0cy5pc1JlZ0V4cCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gISEob2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKSk7XG59O1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCl7XG4vLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKCdfcHJvY2VzcycpLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5MWRHbHNMM1YwYVd3dWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVUZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRWlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4dklFTnZjSGx5YVdkb2RDQktiM2xsYm5Rc0lFbHVZeTRnWVc1a0lHOTBhR1Z5SUU1dlpHVWdZMjl1ZEhKcFluVjBiM0p6TGx4dUx5OWNiaTh2SUZCbGNtMXBjM05wYjI0Z2FYTWdhR1Z5WldKNUlHZHlZVzUwWldRc0lHWnlaV1VnYjJZZ1kyaGhjbWRsTENCMGJ5QmhibmtnY0dWeWMyOXVJRzlpZEdGcGJtbHVaeUJoWEc0dkx5QmpiM0I1SUc5bUlIUm9hWE1nYzI5bWRIZGhjbVVnWVc1a0lHRnpjMjlqYVdGMFpXUWdaRzlqZFcxbGJuUmhkR2x2YmlCbWFXeGxjeUFvZEdobFhHNHZMeUJjSWxOdlpuUjNZWEpsWENJcExDQjBieUJrWldGc0lHbHVJSFJvWlNCVGIyWjBkMkZ5WlNCM2FYUm9iM1YwSUhKbGMzUnlhV04wYVc5dUxDQnBibU5zZFdScGJtZGNiaTh2SUhkcGRHaHZkWFFnYkdsdGFYUmhkR2x2YmlCMGFHVWdjbWxuYUhSeklIUnZJSFZ6WlN3Z1kyOXdlU3dnYlc5a2FXWjVMQ0J0WlhKblpTd2djSFZpYkdsemFDeGNiaTh2SUdScGMzUnlhV0oxZEdVc0lITjFZbXhwWTJWdWMyVXNJR0Z1WkM5dmNpQnpaV3hzSUdOdmNHbGxjeUJ2WmlCMGFHVWdVMjltZEhkaGNtVXNJR0Z1WkNCMGJ5QndaWEp0YVhSY2JpOHZJSEJsY25OdmJuTWdkRzhnZDJodmJTQjBhR1VnVTI5bWRIZGhjbVVnYVhNZ1puVnlibWx6YUdWa0lIUnZJR1J2SUhOdkxDQnpkV0pxWldOMElIUnZJSFJvWlZ4dUx5OGdabTlzYkc5M2FXNW5JR052Ym1ScGRHbHZibk02WEc0dkwxeHVMeThnVkdobElHRmliM1psSUdOdmNIbHlhV2RvZENCdWIzUnBZMlVnWVc1a0lIUm9hWE1nY0dWeWJXbHpjMmx2YmlCdWIzUnBZMlVnYzJoaGJHd2dZbVVnYVc1amJIVmtaV1JjYmk4dklHbHVJR0ZzYkNCamIzQnBaWE1nYjNJZ2MzVmljM1JoYm5ScFlXd2djRzl5ZEdsdmJuTWdiMllnZEdobElGTnZablIzWVhKbExseHVMeTljYmk4dklGUklSU0JUVDBaVVYwRlNSU0JKVXlCUVVrOVdTVVJGUkNCY0lrRlRJRWxUWENJc0lGZEpWRWhQVlZRZ1YwRlNVa0ZPVkZrZ1QwWWdRVTVaSUV0SlRrUXNJRVZZVUZKRlUxTmNiaTh2SUU5U0lFbE5VRXhKUlVRc0lFbE9RMHhWUkVsT1J5QkNWVlFnVGs5VUlFeEpUVWxVUlVRZ1ZFOGdWRWhGSUZkQlVsSkJUbFJKUlZNZ1QwWmNiaTh2SUUxRlVrTklRVTVVUVVKSlRFbFVXU3dnUmtsVVRrVlRVeUJHVDFJZ1FTQlFRVkpVU1VOVlRFRlNJRkJWVWxCUFUwVWdRVTVFSUU1UFRrbE9SbEpKVGtkRlRVVk9WQzRnU1U1Y2JpOHZJRTVQSUVWV1JVNVVJRk5JUVV4TUlGUklSU0JCVlZSSVQxSlRJRTlTSUVOUFVGbFNTVWRJVkNCSVQweEVSVkpUSUVKRklFeEpRVUpNUlNCR1QxSWdRVTVaSUVOTVFVbE5MRnh1THk4Z1JFRk5RVWRGVXlCUFVpQlBWRWhGVWlCTVNVRkNTVXhKVkZrc0lGZElSVlJJUlZJZ1NVNGdRVTRnUVVOVVNVOU9JRTlHSUVOUFRsUlNRVU5VTENCVVQxSlVJRTlTWEc0dkx5QlBWRWhGVWxkSlUwVXNJRUZTU1ZOSlRrY2dSbEpQVFN3Z1QxVlVJRTlHSUU5U0lFbE9JRU5QVGs1RlExUkpUMDRnVjBsVVNDQlVTRVVnVTA5R1ZGZEJVa1VnVDFJZ1ZFaEZYRzR2THlCVlUwVWdUMUlnVDFSSVJWSWdSRVZCVEVsT1IxTWdTVTRnVkVoRklGTlBSbFJYUVZKRkxseHVYRzUyWVhJZ1ptOXliV0YwVW1WblJYaHdJRDBnTHlWYmMyUnFKVjB2Wnp0Y2JtVjRjRzl5ZEhNdVptOXliV0YwSUQwZ1puVnVZM1JwYjI0b1ppa2dlMXh1SUNCcFppQW9JV2x6VTNSeWFXNW5LR1lwS1NCN1hHNGdJQ0FnZG1GeUlHOWlhbVZqZEhNZ1BTQmJYVHRjYmlBZ0lDQm1iM0lnS0haaGNpQnBJRDBnTURzZ2FTQThJR0Z5WjNWdFpXNTBjeTVzWlc1bmRHZzdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ2IySnFaV04wY3k1d2RYTm9LR2x1YzNCbFkzUW9ZWEpuZFcxbGJuUnpXMmxkS1NrN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQnZZbXBsWTNSekxtcHZhVzRvSnlBbktUdGNiaUFnZlZ4dVhHNGdJSFpoY2lCcElEMGdNVHRjYmlBZ2RtRnlJR0Z5WjNNZ1BTQmhjbWQxYldWdWRITTdYRzRnSUhaaGNpQnNaVzRnUFNCaGNtZHpMbXhsYm1kMGFEdGNiaUFnZG1GeUlITjBjaUE5SUZOMGNtbHVaeWhtS1M1eVpYQnNZV05sS0dadmNtMWhkRkpsWjBWNGNDd2dablZ1WTNScGIyNG9lQ2tnZTF4dUlDQWdJR2xtSUNoNElEMDlQU0FuSlNVbktTQnlaWFIxY200Z0p5VW5PMXh1SUNBZ0lHbG1JQ2hwSUQ0OUlHeGxiaWtnY21WMGRYSnVJSGc3WEc0Z0lDQWdjM2RwZEdOb0lDaDRLU0I3WEc0Z0lDQWdJQ0JqWVhObElDY2xjeWM2SUhKbGRIVnliaUJUZEhKcGJtY29ZWEpuYzF0cEt5dGRLVHRjYmlBZ0lDQWdJR05oYzJVZ0p5VmtKem9nY21WMGRYSnVJRTUxYldKbGNpaGhjbWR6VzJrcksxMHBPMXh1SUNBZ0lDQWdZMkZ6WlNBbkpXb25PbHh1SUNBZ0lDQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQktVMDlPTG5OMGNtbHVaMmxtZVNoaGNtZHpXMmtySzEwcE8xeHVJQ0FnSUNBZ0lDQjlJR05oZEdOb0lDaGZLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUNkYlEybHlZM1ZzWVhKZEp6dGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdaR1ZtWVhWc2REcGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIZzdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JpQWdabTl5SUNoMllYSWdlQ0E5SUdGeVozTmJhVjA3SUdrZ1BDQnNaVzQ3SUhnZ1BTQmhjbWR6V3lzcmFWMHBJSHRjYmlBZ0lDQnBaaUFvYVhOT2RXeHNLSGdwSUh4OElDRnBjMDlpYW1WamRDaDRLU2tnZTF4dUlDQWdJQ0FnYzNSeUlDczlJQ2NnSnlBcklIZzdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhOMGNpQXJQU0FuSUNjZ0t5QnBibk53WldOMEtIZ3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dUlDQnlaWFIxY200Z2MzUnlPMXh1ZlR0Y2JseHVYRzR2THlCTllYSnJJSFJvWVhRZ1lTQnRaWFJvYjJRZ2MyaHZkV3hrSUc1dmRDQmlaU0IxYzJWa0xseHVMeThnVW1WMGRYSnVjeUJoSUcxdlpHbG1hV1ZrSUdaMWJtTjBhVzl1SUhkb2FXTm9JSGRoY201eklHOXVZMlVnWW5rZ1pHVm1ZWFZzZEM1Y2JpOHZJRWxtSUMwdGJtOHRaR1Z3Y21WallYUnBiMjRnYVhNZ2MyVjBMQ0IwYUdWdUlHbDBJR2x6SUdFZ2JtOHRiM0F1WEc1bGVIQnZjblJ6TG1SbGNISmxZMkYwWlNBOUlHWjFibU4wYVc5dUtHWnVMQ0J0YzJjcElIdGNiaUFnTHk4Z1FXeHNiM2NnWm05eUlHUmxjSEpsWTJGMGFXNW5JSFJvYVc1bmN5QnBiaUIwYUdVZ2NISnZZMlZ6Y3lCdlppQnpkR0Z5ZEdsdVp5QjFjQzVjYmlBZ2FXWWdLR2x6Vlc1a1pXWnBibVZrS0dkc2IySmhiQzV3Y205alpYTnpLU2tnZTF4dUlDQWdJSEpsZEhWeWJpQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmxlSEJ2Y25SekxtUmxjSEpsWTJGMFpTaG1iaXdnYlhObktTNWhjSEJzZVNoMGFHbHpMQ0JoY21kMWJXVnVkSE1wTzF4dUlDQWdJSDA3WEc0Z0lIMWNibHh1SUNCcFppQW9jSEp2WTJWemN5NXViMFJsY0hKbFkyRjBhVzl1SUQwOVBTQjBjblZsS1NCN1hHNGdJQ0FnY21WMGRYSnVJR1p1TzF4dUlDQjlYRzVjYmlBZ2RtRnlJSGRoY201bFpDQTlJR1poYkhObE8xeHVJQ0JtZFc1amRHbHZiaUJrWlhCeVpXTmhkR1ZrS0NrZ2UxeHVJQ0FnSUdsbUlDZ2hkMkZ5Ym1Wa0tTQjdYRzRnSUNBZ0lDQnBaaUFvY0hKdlkyVnpjeTUwYUhKdmQwUmxjSEpsWTJGMGFXOXVLU0I3WEc0Z0lDQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWh0YzJjcE8xeHVJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaHdjbTlqWlhOekxuUnlZV05sUkdWd2NtVmpZWFJwYjI0cElIdGNiaUFnSUNBZ0lDQWdZMjl1YzI5c1pTNTBjbUZqWlNodGMyY3BPMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdZMjl1YzI5c1pTNWxjbkp2Y2lodGMyY3BPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdkMkZ5Ym1Wa0lEMGdkSEoxWlR0Y2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlHWnVMbUZ3Y0d4NUtIUm9hWE1zSUdGeVozVnRaVzUwY3lrN1hHNGdJSDFjYmx4dUlDQnlaWFIxY200Z1pHVndjbVZqWVhSbFpEdGNibjA3WEc1Y2JseHVkbUZ5SUdSbFluVm5jeUE5SUh0OU8xeHVkbUZ5SUdSbFluVm5SVzUyYVhKdmJqdGNibVY0Y0c5eWRITXVaR1ZpZFdkc2IyY2dQU0JtZFc1amRHbHZiaWh6WlhRcElIdGNiaUFnYVdZZ0tHbHpWVzVrWldacGJtVmtLR1JsWW5WblJXNTJhWEp2YmlrcFhHNGdJQ0FnWkdWaWRXZEZiblpwY205dUlEMGdjSEp2WTJWemN5NWxibll1VGs5RVJWOUVSVUpWUnlCOGZDQW5KenRjYmlBZ2MyVjBJRDBnYzJWMExuUnZWWEJ3WlhKRFlYTmxLQ2s3WEc0Z0lHbG1JQ2doWkdWaWRXZHpXM05sZEYwcElIdGNiaUFnSUNCcFppQW9ibVYzSUZKbFowVjRjQ2duWEZ4Y1hHSW5JQ3NnYzJWMElDc2dKMXhjWEZ4aUp5d2dKMmtuS1M1MFpYTjBLR1JsWW5WblJXNTJhWEp2YmlrcElIdGNiaUFnSUNBZ0lIWmhjaUJ3YVdRZ1BTQndjbTlqWlhOekxuQnBaRHRjYmlBZ0lDQWdJR1JsWW5WbmMxdHpaWFJkSUQwZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCdGMyY2dQU0JsZUhCdmNuUnpMbVp2Y20xaGRDNWhjSEJzZVNobGVIQnZjblJ6TENCaGNtZDFiV1Z1ZEhNcE8xeHVJQ0FnSUNBZ0lDQmpiMjV6YjJ4bExtVnljbTl5S0NjbGN5QWxaRG9nSlhNbkxDQnpaWFFzSUhCcFpDd2diWE5uS1R0Y2JpQWdJQ0FnSUgwN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJR1JsWW5WbmMxdHpaWFJkSUQwZ1puVnVZM1JwYjI0b0tTQjdmVHRjYmlBZ0lDQjlYRzRnSUgxY2JpQWdjbVYwZFhKdUlHUmxZblZuYzF0elpYUmRPMXh1ZlR0Y2JseHVYRzR2S2lwY2JpQXFJRVZqYUc5eklIUm9aU0IyWVd4MVpTQnZaaUJoSUhaaGJIVmxMaUJVY25seklIUnZJSEJ5YVc1MElIUm9aU0IyWVd4MVpTQnZkWFJjYmlBcUlHbHVJSFJvWlNCaVpYTjBJSGRoZVNCd2IzTnphV0pzWlNCbmFYWmxiaUIwYUdVZ1pHbG1abVZ5Wlc1MElIUjVjR1Z6TGx4dUlDcGNiaUFxSUVCd1lYSmhiU0I3VDJKcVpXTjBmU0J2WW1vZ1ZHaGxJRzlpYW1WamRDQjBieUJ3Y21sdWRDQnZkWFF1WEc0Z0tpQkFjR0Z5WVcwZ2UwOWlhbVZqZEgwZ2IzQjBjeUJQY0hScGIyNWhiQ0J2Y0hScGIyNXpJRzlpYW1WamRDQjBhR0YwSUdGc2RHVnljeUIwYUdVZ2IzVjBjSFYwTGx4dUlDb3ZYRzR2S2lCc1pXZGhZM2s2SUc5aWFpd2djMmh2ZDBocFpHUmxiaXdnWkdWd2RHZ3NJR052Ykc5eWN5b3ZYRzVtZFc1amRHbHZiaUJwYm5Od1pXTjBLRzlpYWl3Z2IzQjBjeWtnZTF4dUlDQXZMeUJrWldaaGRXeDBJRzl3ZEdsdmJuTmNiaUFnZG1GeUlHTjBlQ0E5SUh0Y2JpQWdJQ0J6WldWdU9pQmJYU3hjYmlBZ0lDQnpkSGxzYVhwbE9pQnpkSGxzYVhwbFRtOURiMnh2Y2x4dUlDQjlPMXh1SUNBdkx5QnNaV2RoWTNrdUxpNWNiaUFnYVdZZ0tHRnlaM1Z0Wlc1MGN5NXNaVzVuZEdnZ1BqMGdNeWtnWTNSNExtUmxjSFJvSUQwZ1lYSm5kVzFsYm5Seld6SmRPMXh1SUNCcFppQW9ZWEpuZFcxbGJuUnpMbXhsYm1kMGFDQStQU0EwS1NCamRIZ3VZMjlzYjNKeklEMGdZWEpuZFcxbGJuUnpXek5kTzF4dUlDQnBaaUFvYVhOQ2IyOXNaV0Z1S0c5d2RITXBLU0I3WEc0Z0lDQWdMeThnYkdWbllXTjVMaTR1WEc0Z0lDQWdZM1I0TG5Ob2IzZElhV1JrWlc0Z1BTQnZjSFJ6TzF4dUlDQjlJR1ZzYzJVZ2FXWWdLRzl3ZEhNcElIdGNiaUFnSUNBdkx5Qm5iM1FnWVc0Z1hDSnZjSFJwYjI1elhDSWdiMkpxWldOMFhHNGdJQ0FnWlhod2IzSjBjeTVmWlhoMFpXNWtLR04wZUN3Z2IzQjBjeWs3WEc0Z0lIMWNiaUFnTHk4Z2MyVjBJR1JsWm1GMWJIUWdiM0IwYVc5dWMxeHVJQ0JwWmlBb2FYTlZibVJsWm1sdVpXUW9ZM1I0TG5Ob2IzZElhV1JrWlc0cEtTQmpkSGd1YzJodmQwaHBaR1JsYmlBOUlHWmhiSE5sTzF4dUlDQnBaaUFvYVhOVmJtUmxabWx1WldRb1kzUjRMbVJsY0hSb0tTa2dZM1I0TG1SbGNIUm9JRDBnTWp0Y2JpQWdhV1lnS0dselZXNWtaV1pwYm1Wa0tHTjBlQzVqYjJ4dmNuTXBLU0JqZEhndVkyOXNiM0p6SUQwZ1ptRnNjMlU3WEc0Z0lHbG1JQ2hwYzFWdVpHVm1hVzVsWkNoamRIZ3VZM1Z6ZEc5dFNXNXpjR1ZqZENrcElHTjBlQzVqZFhOMGIyMUpibk53WldOMElEMGdkSEoxWlR0Y2JpQWdhV1lnS0dOMGVDNWpiMnh2Y25NcElHTjBlQzV6ZEhsc2FYcGxJRDBnYzNSNWJHbDZaVmRwZEdoRGIyeHZjanRjYmlBZ2NtVjBkWEp1SUdadmNtMWhkRlpoYkhWbEtHTjBlQ3dnYjJKcUxDQmpkSGd1WkdWd2RHZ3BPMXh1ZlZ4dVpYaHdiM0owY3k1cGJuTndaV04wSUQwZ2FXNXpjR1ZqZER0Y2JseHVYRzR2THlCb2RIUndPaTh2Wlc0dWQybHJhWEJsWkdsaExtOXlaeTkzYVd0cEwwRk9VMGxmWlhOallYQmxYMk52WkdValozSmhjR2hwWTNOY2JtbHVjM0JsWTNRdVkyOXNiM0p6SUQwZ2UxeHVJQ0FuWW05c1pDY2dPaUJiTVN3Z01qSmRMRnh1SUNBbmFYUmhiR2xqSnlBNklGc3pMQ0F5TTEwc1hHNGdJQ2QxYm1SbGNteHBibVVuSURvZ1d6UXNJREkwWFN4Y2JpQWdKMmx1ZG1WeWMyVW5JRG9nV3pjc0lESTNYU3hjYmlBZ0ozZG9hWFJsSnlBNklGc3pOeXdnTXpsZExGeHVJQ0FuWjNKbGVTY2dPaUJiT1RBc0lETTVYU3hjYmlBZ0oySnNZV05ySnlBNklGc3pNQ3dnTXpsZExGeHVJQ0FuWW14MVpTY2dPaUJiTXpRc0lETTVYU3hjYmlBZ0oyTjVZVzRuSURvZ1d6TTJMQ0F6T1Ywc1hHNGdJQ2RuY21WbGJpY2dPaUJiTXpJc0lETTVYU3hjYmlBZ0oyMWhaMlZ1ZEdFbklEb2dXek0xTENBek9WMHNYRzRnSUNkeVpXUW5JRG9nV3pNeExDQXpPVjBzWEc0Z0lDZDVaV3hzYjNjbklEb2dXek16TENBek9WMWNibjA3WEc1Y2JpOHZJRVJ2YmlkMElIVnpaU0FuWW14MVpTY2dibTkwSUhacGMybGliR1VnYjI0Z1kyMWtMbVY0WlZ4dWFXNXpjR1ZqZEM1emRIbHNaWE1nUFNCN1hHNGdJQ2R6Y0dWamFXRnNKem9nSjJONVlXNG5MRnh1SUNBbmJuVnRZbVZ5SnpvZ0ozbGxiR3h2ZHljc1hHNGdJQ2RpYjI5c1pXRnVKem9nSjNsbGJHeHZkeWNzWEc0Z0lDZDFibVJsWm1sdVpXUW5PaUFuWjNKbGVTY3NYRzRnSUNkdWRXeHNKem9nSjJKdmJHUW5MRnh1SUNBbmMzUnlhVzVuSnpvZ0oyZHlaV1Z1Snl4Y2JpQWdKMlJoZEdVbk9pQW5iV0ZuWlc1MFlTY3NYRzRnSUM4dklGd2libUZ0WlZ3aU9pQnBiblJsYm5ScGIyNWhiR3g1SUc1dmRDQnpkSGxzYVc1blhHNGdJQ2R5WldkbGVIQW5PaUFuY21Wa0oxeHVmVHRjYmx4dVhHNW1kVzVqZEdsdmJpQnpkSGxzYVhwbFYybDBhRU52Ykc5eUtITjBjaXdnYzNSNWJHVlVlWEJsS1NCN1hHNGdJSFpoY2lCemRIbHNaU0E5SUdsdWMzQmxZM1F1YzNSNWJHVnpXM04wZVd4bFZIbHdaVjA3WEc1Y2JpQWdhV1lnS0hOMGVXeGxLU0I3WEc0Z0lDQWdjbVYwZFhKdUlDZGNYSFV3TURGaVd5Y2dLeUJwYm5Od1pXTjBMbU52Ykc5eWMxdHpkSGxzWlYxYk1GMGdLeUFuYlNjZ0t5QnpkSElnSzF4dUlDQWdJQ0FnSUNBZ0lDQW5YRngxTURBeFlsc25JQ3NnYVc1emNHVmpkQzVqYjJ4dmNuTmJjM1I1YkdWZFd6RmRJQ3NnSjIwbk8xeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lISmxkSFZ5YmlCemRISTdYRzRnSUgxY2JuMWNibHh1WEc1bWRXNWpkR2x2YmlCemRIbHNhWHBsVG05RGIyeHZjaWh6ZEhJc0lITjBlV3hsVkhsd1pTa2dlMXh1SUNCeVpYUjFjbTRnYzNSeU8xeHVmVnh1WEc1Y2JtWjFibU4wYVc5dUlHRnljbUY1Vkc5SVlYTm9LR0Z5Y21GNUtTQjdYRzRnSUhaaGNpQm9ZWE5vSUQwZ2UzMDdYRzVjYmlBZ1lYSnlZWGt1Wm05eVJXRmphQ2htZFc1amRHbHZiaWgyWVd3c0lHbGtlQ2tnZTF4dUlDQWdJR2hoYzJoYmRtRnNYU0E5SUhSeWRXVTdYRzRnSUgwcE8xeHVYRzRnSUhKbGRIVnliaUJvWVhOb08xeHVmVnh1WEc1Y2JtWjFibU4wYVc5dUlHWnZjbTFoZEZaaGJIVmxLR04wZUN3Z2RtRnNkV1VzSUhKbFkzVnljMlZVYVcxbGN5a2dlMXh1SUNBdkx5QlFjbTkyYVdSbElHRWdhRzl2YXlCbWIzSWdkWE5sY2kxemNHVmphV1pwWldRZ2FXNXpjR1ZqZENCbWRXNWpkR2x2Ym5NdVhHNGdJQzh2SUVOb1pXTnJJSFJvWVhRZ2RtRnNkV1VnYVhNZ1lXNGdiMkpxWldOMElIZHBkR2dnWVc0Z2FXNXpjR1ZqZENCbWRXNWpkR2x2YmlCdmJpQnBkRnh1SUNCcFppQW9ZM1I0TG1OMWMzUnZiVWx1YzNCbFkzUWdKaVpjYmlBZ0lDQWdJSFpoYkhWbElDWW1YRzRnSUNBZ0lDQnBjMFoxYm1OMGFXOXVLSFpoYkhWbExtbHVjM0JsWTNRcElDWW1YRzRnSUNBZ0lDQXZMeUJHYVd4MFpYSWdiM1YwSUhSb1pTQjFkR2xzSUcxdlpIVnNaU3dnYVhRbmN5QnBibk53WldOMElHWjFibU4wYVc5dUlHbHpJSE53WldOcFlXeGNiaUFnSUNBZ0lIWmhiSFZsTG1sdWMzQmxZM1FnSVQwOUlHVjRjRzl5ZEhNdWFXNXpjR1ZqZENBbUpseHVJQ0FnSUNBZ0x5OGdRV3h6YnlCbWFXeDBaWElnYjNWMElHRnVlU0J3Y205MGIzUjVjR1VnYjJKcVpXTjBjeUIxYzJsdVp5QjBhR1VnWTJseVkzVnNZWElnWTJobFkyc3VYRzRnSUNBZ0lDQWhLSFpoYkhWbExtTnZibk4wY25WamRHOXlJQ1ltSUhaaGJIVmxMbU52Ym5OMGNuVmpkRzl5TG5CeWIzUnZkSGx3WlNBOVBUMGdkbUZzZFdVcEtTQjdYRzRnSUNBZ2RtRnlJSEpsZENBOUlIWmhiSFZsTG1sdWMzQmxZM1FvY21WamRYSnpaVlJwYldWekxDQmpkSGdwTzF4dUlDQWdJR2xtSUNnaGFYTlRkSEpwYm1jb2NtVjBLU2tnZTF4dUlDQWdJQ0FnY21WMElEMGdabTl5YldGMFZtRnNkV1VvWTNSNExDQnlaWFFzSUhKbFkzVnljMlZVYVcxbGN5azdYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUJ5WlhRN1hHNGdJSDFjYmx4dUlDQXZMeUJRY21sdGFYUnBkbVVnZEhsd1pYTWdZMkZ1Ym05MElHaGhkbVVnY0hKdmNHVnlkR2xsYzF4dUlDQjJZWElnY0hKcGJXbDBhWFpsSUQwZ1ptOXliV0YwVUhKcGJXbDBhWFpsS0dOMGVDd2dkbUZzZFdVcE8xeHVJQ0JwWmlBb2NISnBiV2wwYVhabEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhCeWFXMXBkR2wyWlR0Y2JpQWdmVnh1WEc0Z0lDOHZJRXh2YjJzZ2RYQWdkR2hsSUd0bGVYTWdiMllnZEdobElHOWlhbVZqZEM1Y2JpQWdkbUZ5SUd0bGVYTWdQU0JQWW1wbFkzUXVhMlY1Y3loMllXeDFaU2s3WEc0Z0lIWmhjaUIyYVhOcFlteGxTMlY1Y3lBOUlHRnljbUY1Vkc5SVlYTm9LR3RsZVhNcE8xeHVYRzRnSUdsbUlDaGpkSGd1YzJodmQwaHBaR1JsYmlrZ2UxeHVJQ0FnSUd0bGVYTWdQU0JQWW1wbFkzUXVaMlYwVDNkdVVISnZjR1Z5ZEhsT1lXMWxjeWgyWVd4MVpTazdYRzRnSUgxY2JseHVJQ0F2THlCSlJTQmtiMlZ6YmlkMElHMWhhMlVnWlhKeWIzSWdabWxsYkdSeklHNXZiaTFsYm5WdFpYSmhZbXhsWEc0Z0lDOHZJR2gwZEhBNkx5OXRjMlJ1TG0xcFkzSnZjMjltZEM1amIyMHZaVzR0ZFhNdmJHbGljbUZ5ZVM5cFpTOWtkM2MxTW5OaWRDaDJQWFp6TGprMEtTNWhjM0I0WEc0Z0lHbG1JQ2hwYzBWeWNtOXlLSFpoYkhWbEtWeHVJQ0FnSUNBZ0ppWWdLR3RsZVhNdWFXNWtaWGhQWmlnbmJXVnpjMkZuWlNjcElENDlJREFnZkh3Z2EyVjVjeTVwYm1SbGVFOW1LQ2RrWlhOamNtbHdkR2x2YmljcElENDlJREFwS1NCN1hHNGdJQ0FnY21WMGRYSnVJR1p2Y20xaGRFVnljbTl5S0haaGJIVmxLVHRjYmlBZ2ZWeHVYRzRnSUM4dklGTnZiV1VnZEhsd1pTQnZaaUJ2WW1wbFkzUWdkMmwwYUc5MWRDQndjbTl3WlhKMGFXVnpJR05oYmlCaVpTQnphRzl5ZEdOMWRIUmxaQzVjYmlBZ2FXWWdLR3RsZVhNdWJHVnVaM1JvSUQwOVBTQXdLU0I3WEc0Z0lDQWdhV1lnS0dselJuVnVZM1JwYjI0b2RtRnNkV1VwS1NCN1hHNGdJQ0FnSUNCMllYSWdibUZ0WlNBOUlIWmhiSFZsTG01aGJXVWdQeUFuT2lBbklDc2dkbUZzZFdVdWJtRnRaU0E2SUNjbk8xeHVJQ0FnSUNBZ2NtVjBkWEp1SUdOMGVDNXpkSGxzYVhwbEtDZGJSblZ1WTNScGIyNG5JQ3NnYm1GdFpTQXJJQ2RkSnl3Z0ozTndaV05wWVd3bktUdGNiaUFnSUNCOVhHNGdJQ0FnYVdZZ0tHbHpVbVZuUlhod0tIWmhiSFZsS1NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdOMGVDNXpkSGxzYVhwbEtGSmxaMFY0Y0M1d2NtOTBiM1I1Y0dVdWRHOVRkSEpwYm1jdVkyRnNiQ2gyWVd4MVpTa3NJQ2R5WldkbGVIQW5LVHRjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLR2x6UkdGMFpTaDJZV3gxWlNrcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCamRIZ3VjM1I1YkdsNlpTaEVZWFJsTG5CeWIzUnZkSGx3WlM1MGIxTjBjbWx1Wnk1allXeHNLSFpoYkhWbEtTd2dKMlJoZEdVbktUdGNiaUFnSUNCOVhHNGdJQ0FnYVdZZ0tHbHpSWEp5YjNJb2RtRnNkV1VwS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnWm05eWJXRjBSWEp5YjNJb2RtRnNkV1VwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhaaGNpQmlZWE5sSUQwZ0p5Y3NJR0Z5Y21GNUlEMGdabUZzYzJVc0lHSnlZV05sY3lBOUlGc25leWNzSUNkOUoxMDdYRzVjYmlBZ0x5OGdUV0ZyWlNCQmNuSmhlU0J6WVhrZ2RHaGhkQ0IwYUdWNUlHRnlaU0JCY25KaGVWeHVJQ0JwWmlBb2FYTkJjbkpoZVNoMllXeDFaU2twSUh0Y2JpQWdJQ0JoY25KaGVTQTlJSFJ5ZFdVN1hHNGdJQ0FnWW5KaFkyVnpJRDBnV3lkYkp5d2dKMTBuWFR0Y2JpQWdmVnh1WEc0Z0lDOHZJRTFoYTJVZ1puVnVZM1JwYjI1eklITmhlU0IwYUdGMElIUm9aWGtnWVhKbElHWjFibU4wYVc5dWMxeHVJQ0JwWmlBb2FYTkdkVzVqZEdsdmJpaDJZV3gxWlNrcElIdGNiaUFnSUNCMllYSWdiaUE5SUhaaGJIVmxMbTVoYldVZ1B5QW5PaUFuSUNzZ2RtRnNkV1V1Ym1GdFpTQTZJQ2NuTzF4dUlDQWdJR0poYzJVZ1BTQW5JRnRHZFc1amRHbHZiaWNnS3lCdUlDc2dKMTBuTzF4dUlDQjlYRzVjYmlBZ0x5OGdUV0ZyWlNCU1pXZEZlSEJ6SUhOaGVTQjBhR0YwSUhSb1pYa2dZWEpsSUZKbFowVjRjSE5jYmlBZ2FXWWdLR2x6VW1WblJYaHdLSFpoYkhWbEtTa2dlMXh1SUNBZ0lHSmhjMlVnUFNBbklDY2dLeUJTWldkRmVIQXVjSEp2ZEc5MGVYQmxMblJ2VTNSeWFXNW5MbU5oYkd3b2RtRnNkV1VwTzF4dUlDQjlYRzVjYmlBZ0x5OGdUV0ZyWlNCa1lYUmxjeUIzYVhSb0lIQnliM0JsY25ScFpYTWdabWx5YzNRZ2MyRjVJSFJvWlNCa1lYUmxYRzRnSUdsbUlDaHBjMFJoZEdVb2RtRnNkV1VwS1NCN1hHNGdJQ0FnWW1GelpTQTlJQ2NnSnlBcklFUmhkR1V1Y0hKdmRHOTBlWEJsTG5SdlZWUkRVM1J5YVc1bkxtTmhiR3dvZG1Gc2RXVXBPMXh1SUNCOVhHNWNiaUFnTHk4Z1RXRnJaU0JsY25KdmNpQjNhWFJvSUcxbGMzTmhaMlVnWm1seWMzUWdjMkY1SUhSb1pTQmxjbkp2Y2x4dUlDQnBaaUFvYVhORmNuSnZjaWgyWVd4MVpTa3BJSHRjYmlBZ0lDQmlZWE5sSUQwZ0p5QW5JQ3NnWm05eWJXRjBSWEp5YjNJb2RtRnNkV1VwTzF4dUlDQjlYRzVjYmlBZ2FXWWdLR3RsZVhNdWJHVnVaM1JvSUQwOVBTQXdJQ1ltSUNnaFlYSnlZWGtnZkh3Z2RtRnNkV1V1YkdWdVozUm9JRDA5SURBcEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUdKeVlXTmxjMXN3WFNBcklHSmhjMlVnS3lCaWNtRmpaWE5iTVYwN1hHNGdJSDFjYmx4dUlDQnBaaUFvY21WamRYSnpaVlJwYldWeklEd2dNQ2tnZTF4dUlDQWdJR2xtSUNocGMxSmxaMFY0Y0NoMllXeDFaU2twSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJqZEhndWMzUjViR2w2WlNoU1pXZEZlSEF1Y0hKdmRHOTBlWEJsTG5SdlUzUnlhVzVuTG1OaGJHd29kbUZzZFdVcExDQW5jbVZuWlhod0p5azdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJqZEhndWMzUjViR2w2WlNnblcwOWlhbVZqZEYwbkxDQW5jM0JsWTJsaGJDY3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJR04wZUM1elpXVnVMbkIxYzJnb2RtRnNkV1VwTzF4dVhHNGdJSFpoY2lCdmRYUndkWFE3WEc0Z0lHbG1JQ2hoY25KaGVTa2dlMXh1SUNBZ0lHOTFkSEIxZENBOUlHWnZjbTFoZEVGeWNtRjVLR04wZUN3Z2RtRnNkV1VzSUhKbFkzVnljMlZVYVcxbGN5d2dkbWx6YVdKc1pVdGxlWE1zSUd0bGVYTXBPMXh1SUNCOUlHVnNjMlVnZTF4dUlDQWdJRzkxZEhCMWRDQTlJR3RsZVhNdWJXRndLR1oxYm1OMGFXOXVLR3RsZVNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdadmNtMWhkRkJ5YjNCbGNuUjVLR04wZUN3Z2RtRnNkV1VzSUhKbFkzVnljMlZVYVcxbGN5d2dkbWx6YVdKc1pVdGxlWE1zSUd0bGVTd2dZWEp5WVhrcE8xeHVJQ0FnSUgwcE8xeHVJQ0I5WEc1Y2JpQWdZM1I0TG5ObFpXNHVjRzl3S0NrN1hHNWNiaUFnY21WMGRYSnVJSEpsWkhWalpWUnZVMmx1WjJ4bFUzUnlhVzVuS0c5MWRIQjFkQ3dnWW1GelpTd2dZbkpoWTJWektUdGNibjFjYmx4dVhHNW1kVzVqZEdsdmJpQm1iM0p0WVhSUWNtbHRhWFJwZG1Vb1kzUjRMQ0IyWVd4MVpTa2dlMXh1SUNCcFppQW9hWE5WYm1SbFptbHVaV1FvZG1Gc2RXVXBLVnh1SUNBZ0lISmxkSFZ5YmlCamRIZ3VjM1I1YkdsNlpTZ25kVzVrWldacGJtVmtKeXdnSjNWdVpHVm1hVzVsWkNjcE8xeHVJQ0JwWmlBb2FYTlRkSEpwYm1jb2RtRnNkV1VwS1NCN1hHNGdJQ0FnZG1GeUlITnBiWEJzWlNBOUlDZGNYQ2NuSUNzZ1NsTlBUaTV6ZEhKcGJtZHBabmtvZG1Gc2RXVXBMbkpsY0d4aFkyVW9MMTVjSW54Y0lpUXZaeXdnSnljcFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXVjbVZ3YkdGalpTZ3ZKeTluTENCY0lseGNYRnduWENJcFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXVjbVZ3YkdGalpTZ3ZYRnhjWEZ3aUwyY3NJQ2RjSWljcElDc2dKMXhjSnljN1hHNGdJQ0FnY21WMGRYSnVJR04wZUM1emRIbHNhWHBsS0hOcGJYQnNaU3dnSjNOMGNtbHVaeWNwTzF4dUlDQjlYRzRnSUdsbUlDaHBjMDUxYldKbGNpaDJZV3gxWlNrcFhHNGdJQ0FnY21WMGRYSnVJR04wZUM1emRIbHNhWHBsS0NjbklDc2dkbUZzZFdVc0lDZHVkVzFpWlhJbktUdGNiaUFnYVdZZ0tHbHpRbTl2YkdWaGJpaDJZV3gxWlNrcFhHNGdJQ0FnY21WMGRYSnVJR04wZUM1emRIbHNhWHBsS0NjbklDc2dkbUZzZFdVc0lDZGliMjlzWldGdUp5azdYRzRnSUM4dklFWnZjaUJ6YjIxbElISmxZWE52YmlCMGVYQmxiMllnYm5Wc2JDQnBjeUJjSW05aWFtVmpkRndpTENCemJ5QnpjR1ZqYVdGc0lHTmhjMlVnYUdWeVpTNWNiaUFnYVdZZ0tHbHpUblZzYkNoMllXeDFaU2twWEc0Z0lDQWdjbVYwZFhKdUlHTjBlQzV6ZEhsc2FYcGxLQ2R1ZFd4c0p5d2dKMjUxYkd3bktUdGNibjFjYmx4dVhHNW1kVzVqZEdsdmJpQm1iM0p0WVhSRmNuSnZjaWgyWVd4MVpTa2dlMXh1SUNCeVpYUjFjbTRnSjFzbklDc2dSWEp5YjNJdWNISnZkRzkwZVhCbExuUnZVM1J5YVc1bkxtTmhiR3dvZG1Gc2RXVXBJQ3NnSjEwbk8xeHVmVnh1WEc1Y2JtWjFibU4wYVc5dUlHWnZjbTFoZEVGeWNtRjVLR04wZUN3Z2RtRnNkV1VzSUhKbFkzVnljMlZVYVcxbGN5d2dkbWx6YVdKc1pVdGxlWE1zSUd0bGVYTXBJSHRjYmlBZ2RtRnlJRzkxZEhCMWRDQTlJRnRkTzF4dUlDQm1iM0lnS0haaGNpQnBJRDBnTUN3Z2JDQTlJSFpoYkhWbExteGxibWQwYURzZ2FTQThJR3c3SUNzcmFTa2dlMXh1SUNBZ0lHbG1JQ2hvWVhOUGQyNVFjbTl3WlhKMGVTaDJZV3gxWlN3Z1UzUnlhVzVuS0drcEtTa2dlMXh1SUNBZ0lDQWdiM1YwY0hWMExuQjFjMmdvWm05eWJXRjBVSEp2Y0dWeWRIa29ZM1I0TENCMllXeDFaU3dnY21WamRYSnpaVlJwYldWekxDQjJhWE5wWW14bFMyVjVjeXhjYmlBZ0lDQWdJQ0FnSUNCVGRISnBibWNvYVNrc0lIUnlkV1VwS1R0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdiM1YwY0hWMExuQjFjMmdvSnljcE8xeHVJQ0FnSUgxY2JpQWdmVnh1SUNCclpYbHpMbVp2Y2tWaFkyZ29ablZ1WTNScGIyNG9hMlY1S1NCN1hHNGdJQ0FnYVdZZ0tDRnJaWGt1YldGMFkyZ29MMTVjWEdRckpDOHBLU0I3WEc0Z0lDQWdJQ0J2ZFhSd2RYUXVjSFZ6YUNobWIzSnRZWFJRY205d1pYSjBlU2hqZEhnc0lIWmhiSFZsTENCeVpXTjFjbk5sVkdsdFpYTXNJSFpwYzJsaWJHVkxaWGx6TEZ4dUlDQWdJQ0FnSUNBZ0lHdGxlU3dnZEhKMVpTa3BPMXh1SUNBZ0lIMWNiaUFnZlNrN1hHNGdJSEpsZEhWeWJpQnZkWFJ3ZFhRN1hHNTlYRzVjYmx4dVpuVnVZM1JwYjI0Z1ptOXliV0YwVUhKdmNHVnlkSGtvWTNSNExDQjJZV3gxWlN3Z2NtVmpkWEp6WlZScGJXVnpMQ0IyYVhOcFlteGxTMlY1Y3l3Z2EyVjVMQ0JoY25KaGVTa2dlMXh1SUNCMllYSWdibUZ0WlN3Z2MzUnlMQ0JrWlhOak8xeHVJQ0JrWlhOaklEMGdUMkpxWldOMExtZGxkRTkzYmxCeWIzQmxjblI1UkdWelkzSnBjSFJ2Y2loMllXeDFaU3dnYTJWNUtTQjhmQ0I3SUhaaGJIVmxPaUIyWVd4MVpWdHJaWGxkSUgwN1hHNGdJR2xtSUNoa1pYTmpMbWRsZENrZ2UxeHVJQ0FnSUdsbUlDaGtaWE5qTG5ObGRDa2dlMXh1SUNBZ0lDQWdjM1J5SUQwZ1kzUjRMbk4wZVd4cGVtVW9KMXRIWlhSMFpYSXZVMlYwZEdWeVhTY3NJQ2R6Y0dWamFXRnNKeWs3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lITjBjaUE5SUdOMGVDNXpkSGxzYVhwbEtDZGJSMlYwZEdWeVhTY3NJQ2R6Y0dWamFXRnNKeWs3WEc0Z0lDQWdmVnh1SUNCOUlHVnNjMlVnZTF4dUlDQWdJR2xtSUNoa1pYTmpMbk5sZENrZ2UxeHVJQ0FnSUNBZ2MzUnlJRDBnWTNSNExuTjBlV3hwZW1Vb0oxdFRaWFIwWlhKZEp5d2dKM053WldOcFlXd25LVHRjYmlBZ0lDQjlYRzRnSUgxY2JpQWdhV1lnS0NGb1lYTlBkMjVRY205d1pYSjBlU2gyYVhOcFlteGxTMlY1Y3l3Z2EyVjVLU2tnZTF4dUlDQWdJRzVoYldVZ1BTQW5XeWNnS3lCclpYa2dLeUFuWFNjN1hHNGdJSDFjYmlBZ2FXWWdLQ0Z6ZEhJcElIdGNiaUFnSUNCcFppQW9ZM1I0TG5ObFpXNHVhVzVrWlhoUFppaGtaWE5qTG5aaGJIVmxLU0E4SURBcElIdGNiaUFnSUNBZ0lHbG1JQ2hwYzA1MWJHd29jbVZqZFhKelpWUnBiV1Z6S1NrZ2UxeHVJQ0FnSUNBZ0lDQnpkSElnUFNCbWIzSnRZWFJXWVd4MVpTaGpkSGdzSUdSbGMyTXVkbUZzZFdVc0lHNTFiR3dwTzF4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnYzNSeUlEMGdabTl5YldGMFZtRnNkV1VvWTNSNExDQmtaWE5qTG5aaGJIVmxMQ0J5WldOMWNuTmxWR2x0WlhNZ0xTQXhLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJR2xtSUNoemRISXVhVzVrWlhoUFppZ25YRnh1SnlrZ1BpQXRNU2tnZTF4dUlDQWdJQ0FnSUNCcFppQW9ZWEp5WVhrcElIdGNiaUFnSUNBZ0lDQWdJQ0J6ZEhJZ1BTQnpkSEl1YzNCc2FYUW9KMXhjYmljcExtMWhjQ2htZFc1amRHbHZiaWhzYVc1bEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnSnlBZ0p5QXJJR3hwYm1VN1hHNGdJQ0FnSUNBZ0lDQWdmU2t1YW05cGJpZ25YRnh1SnlrdWMzVmljM1J5S0RJcE8xeHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJSE4wY2lBOUlDZGNYRzRuSUNzZ2MzUnlMbk53YkdsMEtDZGNYRzRuS1M1dFlYQW9ablZ1WTNScGIyNG9iR2x1WlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQ2NnSUNBbklDc2diR2x1WlR0Y2JpQWdJQ0FnSUNBZ0lDQjlLUzVxYjJsdUtDZGNYRzRuS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0J6ZEhJZ1BTQmpkSGd1YzNSNWJHbDZaU2duVzBOcGNtTjFiR0Z5WFNjc0lDZHpjR1ZqYVdGc0p5azdYRzRnSUNBZ2ZWeHVJQ0I5WEc0Z0lHbG1JQ2hwYzFWdVpHVm1hVzVsWkNodVlXMWxLU2tnZTF4dUlDQWdJR2xtSUNoaGNuSmhlU0FtSmlCclpYa3ViV0YwWTJnb0wxNWNYR1FySkM4cEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2MzUnlPMXh1SUNBZ0lIMWNiaUFnSUNCdVlXMWxJRDBnU2xOUFRpNXpkSEpwYm1kcFpua29KeWNnS3lCclpYa3BPMXh1SUNBZ0lHbG1JQ2h1WVcxbExtMWhkR05vS0M5ZVhDSW9XMkV0ZWtFdFdsOWRXMkV0ZWtFdFdsOHdMVGxkS2lsY0lpUXZLU2tnZTF4dUlDQWdJQ0FnYm1GdFpTQTlJRzVoYldVdWMzVmljM1J5S0RFc0lHNWhiV1V1YkdWdVozUm9JQzBnTWlrN1hHNGdJQ0FnSUNCdVlXMWxJRDBnWTNSNExuTjBlV3hwZW1Vb2JtRnRaU3dnSjI1aGJXVW5LVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2JtRnRaU0E5SUc1aGJXVXVjbVZ3YkdGalpTZ3ZKeTluTENCY0lseGNYRnduWENJcFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDNXlaWEJzWVdObEtDOWNYRnhjWENJdlp5d2dKMXdpSnlsY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0xuSmxjR3hoWTJVb0x5aGVYQ0o4WENJa0tTOW5MQ0JjSWlkY0lpazdYRzRnSUNBZ0lDQnVZVzFsSUQwZ1kzUjRMbk4wZVd4cGVtVW9ibUZ0WlN3Z0ozTjBjbWx1WnljcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCdVlXMWxJQ3NnSnpvZ0p5QXJJSE4wY2p0Y2JuMWNibHh1WEc1bWRXNWpkR2x2YmlCeVpXUjFZMlZVYjFOcGJtZHNaVk4wY21sdVp5aHZkWFJ3ZFhRc0lHSmhjMlVzSUdKeVlXTmxjeWtnZTF4dUlDQjJZWElnYm5WdFRHbHVaWE5GYzNRZ1BTQXdPMXh1SUNCMllYSWdiR1Z1WjNSb0lEMGdiM1YwY0hWMExuSmxaSFZqWlNobWRXNWpkR2x2Ymlod2NtVjJMQ0JqZFhJcElIdGNiaUFnSUNCdWRXMU1hVzVsYzBWemRDc3JPMXh1SUNBZ0lHbG1JQ2hqZFhJdWFXNWtaWGhQWmlnblhGeHVKeWtnUGowZ01Da2diblZ0VEdsdVpYTkZjM1FyS3p0Y2JpQWdJQ0J5WlhSMWNtNGdjSEpsZGlBcklHTjFjaTV5WlhCc1lXTmxLQzljWEhVd01ERmlYRnhiWEZ4a1hGeGtQMjB2Wnl3Z0p5Y3BMbXhsYm1kMGFDQXJJREU3WEc0Z0lIMHNJREFwTzF4dVhHNGdJR2xtSUNoc1pXNW5kR2dnUGlBMk1Da2dlMXh1SUNBZ0lISmxkSFZ5YmlCaWNtRmpaWE5iTUYwZ0sxeHVJQ0FnSUNBZ0lDQWdJQ0FvWW1GelpTQTlQVDBnSnljZ1B5QW5KeUE2SUdKaGMyVWdLeUFuWEZ4dUlDY3BJQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0p5QW5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ2IzVjBjSFYwTG1wdmFXNG9KeXhjWEc0Z0lDY3BJQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0p5QW5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ1luSmhZMlZ6V3pGZE8xeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlHSnlZV05sYzFzd1hTQXJJR0poYzJVZ0t5QW5JQ2NnS3lCdmRYUndkWFF1YW05cGJpZ25MQ0FuS1NBcklDY2dKeUFySUdKeVlXTmxjMXN4WFR0Y2JuMWNibHh1WEc0dkx5Qk9UMVJGT2lCVWFHVnpaU0IwZVhCbElHTm9aV05yYVc1bklHWjFibU4wYVc5dWN5QnBiblJsYm5ScGIyNWhiR3g1SUdSdmJpZDBJSFZ6WlNCZ2FXNXpkR0Z1WTJWdlptQmNiaTh2SUdKbFkyRjFjMlVnYVhRZ2FYTWdabkpoWjJsc1pTQmhibVFnWTJGdUlHSmxJR1ZoYzJsc2VTQm1ZV3RsWkNCM2FYUm9JR0JQWW1wbFkzUXVZM0psWVhSbEtDbGdMbHh1Wm5WdVkzUnBiMjRnYVhOQmNuSmhlU2hoY2lrZ2UxeHVJQ0J5WlhSMWNtNGdRWEp5WVhrdWFYTkJjbkpoZVNoaGNpazdYRzU5WEc1bGVIQnZjblJ6TG1selFYSnlZWGtnUFNCcGMwRnljbUY1TzF4dVhHNW1kVzVqZEdsdmJpQnBjMEp2YjJ4bFlXNG9ZWEpuS1NCN1hHNGdJSEpsZEhWeWJpQjBlWEJsYjJZZ1lYSm5JRDA5UFNBblltOXZiR1ZoYmljN1hHNTlYRzVsZUhCdmNuUnpMbWx6UW05dmJHVmhiaUE5SUdselFtOXZiR1ZoYmp0Y2JseHVablZ1WTNScGIyNGdhWE5PZFd4c0tHRnlaeWtnZTF4dUlDQnlaWFIxY200Z1lYSm5JRDA5UFNCdWRXeHNPMXh1ZlZ4dVpYaHdiM0owY3k1cGMwNTFiR3dnUFNCcGMwNTFiR3c3WEc1Y2JtWjFibU4wYVc5dUlHbHpUblZzYkU5eVZXNWtaV1pwYm1Wa0tHRnlaeWtnZTF4dUlDQnlaWFIxY200Z1lYSm5JRDA5SUc1MWJHdzdYRzU5WEc1bGVIQnZjblJ6TG1selRuVnNiRTl5Vlc1a1pXWnBibVZrSUQwZ2FYTk9kV3hzVDNKVmJtUmxabWx1WldRN1hHNWNibVoxYm1OMGFXOXVJR2x6VG5WdFltVnlLR0Z5WnlrZ2UxeHVJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlHRnlaeUE5UFQwZ0oyNTFiV0psY2ljN1hHNTlYRzVsZUhCdmNuUnpMbWx6VG5WdFltVnlJRDBnYVhOT2RXMWlaWEk3WEc1Y2JtWjFibU4wYVc5dUlHbHpVM1J5YVc1bktHRnlaeWtnZTF4dUlDQnlaWFIxY200Z2RIbHdaVzltSUdGeVp5QTlQVDBnSjNOMGNtbHVaeWM3WEc1OVhHNWxlSEJ2Y25SekxtbHpVM1J5YVc1bklEMGdhWE5UZEhKcGJtYzdYRzVjYm1aMWJtTjBhVzl1SUdselUzbHRZbTlzS0dGeVp5a2dlMXh1SUNCeVpYUjFjbTRnZEhsd1pXOW1JR0Z5WnlBOVBUMGdKM041YldKdmJDYzdYRzU5WEc1bGVIQnZjblJ6TG1selUzbHRZbTlzSUQwZ2FYTlRlVzFpYjJ3N1hHNWNibVoxYm1OMGFXOXVJR2x6Vlc1a1pXWnBibVZrS0dGeVp5a2dlMXh1SUNCeVpYUjFjbTRnWVhKbklEMDlQU0IyYjJsa0lEQTdYRzU5WEc1bGVIQnZjblJ6TG1selZXNWtaV1pwYm1Wa0lEMGdhWE5WYm1SbFptbHVaV1E3WEc1Y2JtWjFibU4wYVc5dUlHbHpVbVZuUlhod0tISmxLU0I3WEc0Z0lISmxkSFZ5YmlCcGMwOWlhbVZqZENoeVpTa2dKaVlnYjJKcVpXTjBWRzlUZEhKcGJtY29jbVVwSUQwOVBTQW5XMjlpYW1WamRDQlNaV2RGZUhCZEp6dGNibjFjYm1WNGNHOXlkSE11YVhOU1pXZEZlSEFnUFNCcGMxSmxaMFY0Y0R0Y2JseHVablZ1WTNScGIyNGdhWE5QWW1wbFkzUW9ZWEpuS1NCN1hHNGdJSEpsZEhWeWJpQjBlWEJsYjJZZ1lYSm5JRDA5UFNBbmIySnFaV04wSnlBbUppQmhjbWNnSVQwOUlHNTFiR3c3WEc1OVhHNWxlSEJ2Y25SekxtbHpUMkpxWldOMElEMGdhWE5QWW1wbFkzUTdYRzVjYm1aMWJtTjBhVzl1SUdselJHRjBaU2hrS1NCN1hHNGdJSEpsZEhWeWJpQnBjMDlpYW1WamRDaGtLU0FtSmlCdlltcGxZM1JVYjFOMGNtbHVaeWhrS1NBOVBUMGdKMXR2WW1wbFkzUWdSR0YwWlYwbk8xeHVmVnh1Wlhod2IzSjBjeTVwYzBSaGRHVWdQU0JwYzBSaGRHVTdYRzVjYm1aMWJtTjBhVzl1SUdselJYSnliM0lvWlNrZ2UxeHVJQ0J5WlhSMWNtNGdhWE5QWW1wbFkzUW9aU2tnSmlaY2JpQWdJQ0FnSUNodlltcGxZM1JVYjFOMGNtbHVaeWhsS1NBOVBUMGdKMXR2WW1wbFkzUWdSWEp5YjNKZEp5QjhmQ0JsSUdsdWMzUmhibU5sYjJZZ1JYSnliM0lwTzF4dWZWeHVaWGh3YjNKMGN5NXBjMFZ5Y205eUlEMGdhWE5GY25KdmNqdGNibHh1Wm5WdVkzUnBiMjRnYVhOR2RXNWpkR2x2YmloaGNtY3BJSHRjYmlBZ2NtVjBkWEp1SUhSNWNHVnZaaUJoY21jZ1BUMDlJQ2RtZFc1amRHbHZiaWM3WEc1OVhHNWxlSEJ2Y25SekxtbHpSblZ1WTNScGIyNGdQU0JwYzBaMWJtTjBhVzl1TzF4dVhHNW1kVzVqZEdsdmJpQnBjMUJ5YVcxcGRHbDJaU2hoY21jcElIdGNiaUFnY21WMGRYSnVJR0Z5WnlBOVBUMGdiblZzYkNCOGZGeHVJQ0FnSUNBZ0lDQWdkSGx3Wlc5bUlHRnlaeUE5UFQwZ0oySnZiMnhsWVc0bklIeDhYRzRnSUNBZ0lDQWdJQ0IwZVhCbGIyWWdZWEpuSUQwOVBTQW5iblZ0WW1WeUp5QjhmRnh1SUNBZ0lDQWdJQ0FnZEhsd1pXOW1JR0Z5WnlBOVBUMGdKM04wY21sdVp5Y2dmSHhjYmlBZ0lDQWdJQ0FnSUhSNWNHVnZaaUJoY21jZ1BUMDlJQ2R6ZVcxaWIyd25JSHg4SUNBdkx5QkZVellnYzNsdFltOXNYRzRnSUNBZ0lDQWdJQ0IwZVhCbGIyWWdZWEpuSUQwOVBTQW5kVzVrWldacGJtVmtKenRjYm4xY2JtVjRjRzl5ZEhNdWFYTlFjbWx0YVhScGRtVWdQU0JwYzFCeWFXMXBkR2wyWlR0Y2JseHVaWGh3YjNKMGN5NXBjMEoxWm1abGNpQTlJSEpsY1hWcGNtVW9KeTR2YzNWd2NHOXlkQzlwYzBKMVptWmxjaWNwTzF4dVhHNW1kVzVqZEdsdmJpQnZZbXBsWTNSVWIxTjBjbWx1WnlodktTQjdYRzRnSUhKbGRIVnliaUJQWW1wbFkzUXVjSEp2ZEc5MGVYQmxMblJ2VTNSeWFXNW5MbU5oYkd3b2J5azdYRzU5WEc1Y2JseHVablZ1WTNScGIyNGdjR0ZrS0c0cElIdGNiaUFnY21WMGRYSnVJRzRnUENBeE1DQS9JQ2N3SnlBcklHNHVkRzlUZEhKcGJtY29NVEFwSURvZ2JpNTBiMU4wY21sdVp5Z3hNQ2s3WEc1OVhHNWNibHh1ZG1GeUlHMXZiblJvY3lBOUlGc25TbUZ1Snl3Z0owWmxZaWNzSUNkTllYSW5MQ0FuUVhCeUp5d2dKMDFoZVNjc0lDZEtkVzRuTENBblNuVnNKeXdnSjBGMVp5Y3NJQ2RUWlhBbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBblQyTjBKeXdnSjA1dmRpY3NJQ2RFWldNblhUdGNibHh1THk4Z01qWWdSbVZpSURFMk9qRTVPak0wWEc1bWRXNWpkR2x2YmlCMGFXMWxjM1JoYlhBb0tTQjdYRzRnSUhaaGNpQmtJRDBnYm1WM0lFUmhkR1VvS1R0Y2JpQWdkbUZ5SUhScGJXVWdQU0JiY0dGa0tHUXVaMlYwU0c5MWNuTW9LU2tzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSEJoWkNoa0xtZGxkRTFwYm5WMFpYTW9LU2tzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSEJoWkNoa0xtZGxkRk5sWTI5dVpITW9LU2xkTG1wdmFXNG9Kem9uS1R0Y2JpQWdjbVYwZFhKdUlGdGtMbWRsZEVSaGRHVW9LU3dnYlc5dWRHaHpXMlF1WjJWMFRXOXVkR2dvS1Ywc0lIUnBiV1ZkTG1wdmFXNG9KeUFuS1R0Y2JuMWNibHh1WEc0dkx5QnNiMmNnYVhNZ2FuVnpkQ0JoSUhSb2FXNGdkM0poY0hCbGNpQjBieUJqYjI1emIyeGxMbXh2WnlCMGFHRjBJSEJ5WlhCbGJtUnpJR0VnZEdsdFpYTjBZVzF3WEc1bGVIQnZjblJ6TG14dlp5QTlJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQmpiMjV6YjJ4bExteHZaeWduSlhNZ0xTQWxjeWNzSUhScGJXVnpkR0Z0Y0NncExDQmxlSEJ2Y25SekxtWnZjbTFoZEM1aGNIQnNlU2hsZUhCdmNuUnpMQ0JoY21kMWJXVnVkSE1wS1R0Y2JuMDdYRzVjYmx4dUx5b3FYRzRnS2lCSmJtaGxjbWwwSUhSb1pTQndjbTkwYjNSNWNHVWdiV1YwYUc5a2N5Qm1jbTl0SUc5dVpTQmpiMjV6ZEhKMVkzUnZjaUJwYm5SdklHRnViM1JvWlhJdVhHNGdLbHh1SUNvZ1ZHaGxJRVoxYm1OMGFXOXVMbkJ5YjNSdmRIbHdaUzVwYm1obGNtbDBjeUJtY205dElHeGhibWN1YW5NZ2NtVjNjbWwwZEdWdUlHRnpJR0VnYzNSaGJtUmhiRzl1WlZ4dUlDb2dablZ1WTNScGIyNGdLRzV2ZENCdmJpQkdkVzVqZEdsdmJpNXdjbTkwYjNSNWNHVXBMaUJPVDFSRk9pQkpaaUIwYUdseklHWnBiR1VnYVhNZ2RHOGdZbVVnYkc5aFpHVmtYRzRnS2lCa2RYSnBibWNnWW05dmRITjBjbUZ3Y0dsdVp5QjBhR2x6SUdaMWJtTjBhVzl1SUc1bFpXUnpJSFJ2SUdKbElISmxkM0pwZEhSbGJpQjFjMmx1WnlCemIyMWxJRzVoZEdsMlpWeHVJQ29nWm5WdVkzUnBiMjV6SUdGeklIQnliM1J2ZEhsd1pTQnpaWFIxY0NCMWMybHVaeUJ1YjNKdFlXd2dTbUYyWVZOamNtbHdkQ0JrYjJWeklHNXZkQ0IzYjNKcklHRnpYRzRnS2lCbGVIQmxZM1JsWkNCa2RYSnBibWNnWW05dmRITjBjbUZ3Y0dsdVp5QW9jMlZsSUcxcGNuSnZjaTVxY3lCcGJpQnlNVEUwT1RBektTNWNiaUFxWEc0Z0tpQkFjR0Z5WVcwZ2UyWjFibU4wYVc5dWZTQmpkRzl5SUVOdmJuTjBjblZqZEc5eUlHWjFibU4wYVc5dUlIZG9hV05vSUc1bFpXUnpJSFJ2SUdsdWFHVnlhWFFnZEdobFhHNGdLaUFnSUNBZ2NISnZkRzkwZVhCbExseHVJQ29nUUhCaGNtRnRJSHRtZFc1amRHbHZibjBnYzNWd1pYSkRkRzl5SUVOdmJuTjBjblZqZEc5eUlHWjFibU4wYVc5dUlIUnZJR2x1YUdWeWFYUWdjSEp2ZEc5MGVYQmxJR1p5YjIwdVhHNGdLaTljYm1WNGNHOXlkSE11YVc1b1pYSnBkSE1nUFNCeVpYRjFhWEpsS0NkcGJtaGxjbWwwY3ljcE8xeHVYRzVsZUhCdmNuUnpMbDlsZUhSbGJtUWdQU0JtZFc1amRHbHZiaWh2Y21sbmFXNHNJR0ZrWkNrZ2UxeHVJQ0F2THlCRWIyNG5kQ0JrYnlCaGJubDBhR2x1WnlCcFppQmhaR1FnYVhOdUozUWdZVzRnYjJKcVpXTjBYRzRnSUdsbUlDZ2hZV1JrSUh4OElDRnBjMDlpYW1WamRDaGhaR1FwS1NCeVpYUjFjbTRnYjNKcFoybHVPMXh1WEc0Z0lIWmhjaUJyWlhseklEMGdUMkpxWldOMExtdGxlWE1vWVdSa0tUdGNiaUFnZG1GeUlHa2dQU0JyWlhsekxteGxibWQwYUR0Y2JpQWdkMmhwYkdVZ0tHa3RMU2tnZTF4dUlDQWdJRzl5YVdkcGJsdHJaWGx6VzJsZFhTQTlJR0ZrWkZ0clpYbHpXMmxkWFR0Y2JpQWdmVnh1SUNCeVpYUjFjbTRnYjNKcFoybHVPMXh1ZlR0Y2JseHVablZ1WTNScGIyNGdhR0Z6VDNkdVVISnZjR1Z5ZEhrb2IySnFMQ0J3Y205d0tTQjdYRzRnSUhKbGRIVnliaUJQWW1wbFkzUXVjSEp2ZEc5MGVYQmxMbWhoYzA5M2JsQnliM0JsY25SNUxtTmhiR3dvYjJKcUxDQndjbTl3S1R0Y2JuMWNiaUpkZlE9PSIsIihmdW5jdGlvbihzZWxmKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBpZiAoc2VsZi5mZXRjaCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIHN1cHBvcnQgPSB7XG4gICAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICAgIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICAgIGJsb2I6ICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmICdCbG9iJyBpbiBzZWxmICYmIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KSgpLFxuICAgIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gICAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxuICB9XG5cbiAgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgICBdXG5cbiAgICB2YXIgaXNEYXRhVmlldyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopXG4gICAgfVxuXG4gICAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICAgIH1cbiAgICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5cXF5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgICB9XG4gICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbiAgZnVuY3Rpb24gaXRlcmF0b3JGb3IoaXRlbXMpIHtcbiAgICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKVxuICAgICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXRlcmF0b3JcbiAgfVxuXG4gIGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMubWFwID0ge31cblxuICAgIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgICAgfSwgdGhpcylcblxuICAgIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXG4gICAgICB9LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMubWFwW25hbWVdXG4gICAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlKycsJyt2YWx1ZSA6IHZhbHVlXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICAgIGlmICh0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMubWFwW25hbWVdLCBuYW1lLCB0aGlzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKG5hbWUpIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHsgaXRlbXMucHVzaCh2YWx1ZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXNcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgICBpZiAoYm9keS5ib2R5VXNlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpKVxuICAgIH1cbiAgICBib2R5LmJvZHlVc2VkID0gdHJ1ZVxuICB9XG5cbiAgZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgICAgfVxuICAgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpXG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRBcnJheUJ1ZmZlckFzVGV4dChidWYpIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKVxuICAgIH1cbiAgICByZXR1cm4gY2hhcnMuam9pbignJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICAgIGlmIChidWYuc2xpY2UpIHtcbiAgICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aClcbiAgICAgIHZpZXcuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZikpXG4gICAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBCb2R5KCkge1xuICAgIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxuXG4gICAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICAgIGlmICghYm9keSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZm9ybURhdGEgJiYgRm9ybURhdGEucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5LnRvU3RyaW5nKClcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgICAgLy8gSUUgMTAtMTEgY2FuJ3QgaGFuZGxlIGEgRGF0YVZpZXcgYm9keS5cbiAgICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vuc3VwcG9ydGVkIEJvZHlJbml0IHR5cGUnKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSlcbiAgICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICByZXR1cm4gY29uc3VtZWQodGhpcykgfHwgUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gcmVhZEJsb2JBc1RleHQodGhpcy5fYm9keUJsb2IpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbiAgdmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuICBmdW5jdGlvbiBub3JtYWxpemVNZXRob2QobWV0aG9kKSB7XG4gICAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICAgIHJldHVybiAobWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEpID8gdXBjYXNlZCA6IG1ldGhvZFxuICB9XG5cbiAgZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHtcbiAgICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgICAgfVxuICAgICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICAgIH1cbiAgICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kXG4gICAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgICBpZiAoIWJvZHkgJiYgaW5wdXQuX2JvZHlJbml0ICE9IG51bGwpIHtcbiAgICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgICBpbnB1dC5ib2R5VXNlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpXG4gICAgfVxuXG4gICAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnb21pdCdcbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gICAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gICAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICAgIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgICB9XG4gICAgdGhpcy5faW5pdEJvZHkoYm9keSlcbiAgfVxuXG4gIFJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMsIHsgYm9keTogdGhpcy5fYm9keUluaXQgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlY29kZShib2R5KSB7XG4gICAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKVxuICAgIGJvZHkudHJpbSgpLnNwbGl0KCcmJykuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gZm9ybVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKClcbiAgICByYXdIZWFkZXJzLnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6JylcbiAgICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpLnRyaW0oKVxuICAgICAgaWYgKGtleSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5qb2luKCc6JykudHJpbSgpXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gaGVhZGVyc1xuICB9XG5cbiAgQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG4gIGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG5cbiAgICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgICB0aGlzLnN0YXR1cyA9ICdzdGF0dXMnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1cyA6IDIwMFxuICAgIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDBcbiAgICB0aGlzLnN0YXR1c1RleHQgPSAnc3RhdHVzVGV4dCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzVGV4dCA6ICdPSydcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xuICAgIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxuICB9XG5cbiAgQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcblxuICBSZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICAgIHVybDogdGhpcy51cmxcbiAgICB9KVxuICB9XG5cbiAgUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICAgIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH1cblxuICB2YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuICBSZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gICAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxuICB9XG5cbiAgc2VsZi5IZWFkZXJzID0gSGVhZGVyc1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZVxuXG4gIHNlbGYuZmV0Y2ggPSBmdW5jdGlvbihpbnB1dCwgaW5pdCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnVybCA9ICdyZXNwb25zZVVSTCcgaW4geGhyID8geGhyLnJlc3BvbnNlVVJMIDogb3B0aW9ucy5oZWFkZXJzLmdldCgnWC1SZXF1ZXN0LVVSTCcpXG4gICAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgICAgfVxuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSlcblxuICAgICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgICAgfSlcblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgICB9KVxuICB9XG4gIHNlbGYuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcyk7XG4iLCJtb2R1bGUuZXhwb3J0cy5Qcm9kdWN0aW9uID0gcmVxdWlyZSgnLi9wcm9kdWN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cy5TYW5kYm94ID0gcmVxdWlyZSgnLi9zYW5kYm94Jyk7XG4iLCIvKipcbiAqIEBjbGFzcyBQcm9kdWN0aW9uIEFQSVxuICovXG5jbGFzcyBQcm9kdWN0aW9uQVBJIHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgUHJvZHVjdGlvbkFQSVxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVuZHBvaW50IC0gVGhlIGhvc3QgZW5kcG9pbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IGZldGNoRm4gLSBUaGUgZnVuY3Rpb24gdG8gdXNlIGZvciBmZXRjaGluZyB0aGUgZGF0YSAtIERlZmF1bHRzIHRvIHdpbmRvdy5mZXRjaFxuICAgKiBAcmV0dXJuIHtQcm9kdWN0aW9uQVBJfVxuICAgKi9cbiAgY29uc3RydWN0b3IoZW5kcG9pbnQsIGZldGNoRm4gPSAoLi4uYXJncykgPT4gd2luZG93LmZldGNoKC4uLmFyZ3MpKSB7XG4gICAgdGhpcy5fZW5kcG9pbnQgPSBlbmRwb2ludDtcbiAgICB0aGlzLl9mZXRjaEZuID0gZmV0Y2hGbjtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBQcm9wYWdhdGVzIGludm9rZSBjYWxsIHRvIF9mZXRjaEZuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZXNvdXJjZSAtIFRoZSByZXNvdXJjZSB0byBmZXRjaCBmcm9tXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkIC0gVGhlIHBheWxvYWQgdG8gcGFzc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgaW52b2tlKHJlc291cmNlLCBwYXlsb2FkKSB7XG4gICAgbGV0IHN0YXR1cyA9IDA7XG4gICAgcmV0dXJuIHRoaXMuX2ZldGNoRm4oYCR7dGhpcy5fZW5kcG9pbnR9LyR7cmVzb3VyY2V9YCwgcGF5bG9hZCkudGhlbigocmVzKSA9PiB7XG4gICAgICBzdGF0dXMgPSByZXMuc3RhdHVzO1xuICAgICAgaWYgKHN0YXR1cyAhPT0gMjA0KSB7XG4gICAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgfSkudGhlbihib2R5ID0+ICh7IGJvZHksIHN0YXR1cyB9KSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm9kdWN0aW9uQVBJO1xuIiwiY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuY29uc3QgcXMgPSByZXF1aXJlKCdxcycpO1xuXG5jb25zdCBzdHJpcEJlYXJlciA9IFV0aWxzLnN0cmlwQmVhcmVyO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhbiBIVFRQIHJlc3BvbnNlIG9iamVjdFxuICpcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKlxuICovXG5jb25zdCByZXNwb25zZSA9IChzdGF0dXMgPSAyMDAsIGJvZHkgPSB7fSkgPT4gKFByb21pc2UucmVzb2x2ZSh7XG4gIHN0YXR1cyxcbiAgYm9keSxcbn0pKTtcblxuLyoqXG4gKiBAY2xhc3MgU2FuZGJveCBBUElcbiAqL1xuY2xhc3MgU2FuZGJveEFQSSB7XG5cbiAgLyoqXG4gICAqIE1hcHMgQVBJIHJlc291cmNlcyB0byByZXNwb25zZSBvYmplY3RzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlc291cmNlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBNYXBzIGAvdXNlcnNgIHJlc291cmNlXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqXG4gICAgICAgKi9cbiAgICAgIHVzZXJzOiB7XG4gICAgICAgIEdFVDogKGRhdGFiYXNlLCBpZCwgYm9keSwgaGVhZGVycykgPT4ge1xuICAgICAgICAgIGNvbnN0IHRva2VuID0gc3RyaXBCZWFyZXIoaGVhZGVycy5BdXRob3JpemF0aW9uKTtcbiAgICAgICAgICBpZiAoIWRhdGFiYXNlLmhhc1VzZXJXaXRoVG9rZW4odG9rZW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoNDA0LCB7IGVycm9yOiAnbm90X2ZvdW5kJyB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDIwMCwgZGF0YWJhc2UuZ2V0VXNlcldpdGhUb2tlbih0b2tlbikpO1xuICAgICAgICB9LFxuICAgICAgICBQT1NUOiAoZGF0YWJhc2UsIGlkLCBib2R5KSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQsIGZpcnN0X25hbWUsIGxhc3RfbmFtZSB9ID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICBpZiAoZGF0YWJhc2UuaGFzVXNlcldpdGhEYXRhKGVtYWlsLCBwYXNzd29yZCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZSg0MDAsIHsgZXJyb3I6ICd2YWxpZGF0aW9uX2ZhaWxlZCcgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG5ld1VzZXIgPSBkYXRhYmFzZS5hZGRVc2VyKGVtYWlsLCBwYXNzd29yZCwgZmlyc3RfbmFtZSwgbGFzdF9uYW1lKTtcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoMjAxLCBuZXdVc2VyKTtcbiAgICAgICAgfSxcbiAgICAgICAgUEFUQ0g6IChkYXRhYmFzZSwgaWQsIGJvZHksIGhlYWRlcnMpID0+IHtcbiAgICAgICAgICBjb25zdCB0b2tlbiA9IHN0cmlwQmVhcmVyKGhlYWRlcnMuQXV0aG9yaXphdGlvbik7XG4gICAgICAgICAgY29uc3QgeyBmaXJzdF9uYW1lLCBsYXN0X25hbWUgfSA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICAgICAgaWYgKGRhdGFiYXNlLmdldFVzZXJXaXRoVG9rZW4odG9rZW4pICE9PSBkYXRhYmFzZS5nZXRVc2VyV2l0aElkKGlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDQwMCwgeyBlcnJvcjogJ2ludmFsaWRfZ3JhbnQnIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBwYXRjaGVkVXNlciA9IGRhdGFiYXNlLnVwZGF0ZVVzZXIoaWQsIGZpcnN0X25hbWUsIGxhc3RfbmFtZSk7XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDIwMCwgcGF0Y2hlZFVzZXIpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIC8qKlxuICAgICAgICogTWFwcyBgL3Rva2VuYCByZXNvdXJjZVxuICAgICAgICpcbiAgICAgICAqIEBzZWUgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzY3NDlcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKlxuICAgICAgICovXG4gICAgICB0b2tlbjoge1xuICAgICAgICBQT1NUOiAoZGF0YWJhc2UsIGlkLCBib2R5KSA9PiB7XG4gICAgICAgICAgY29uc3QgZGVjb2RlZEJvZHkgPSBxcy5wYXJzZShib2R5KTtcbiAgICAgICAgICBjb25zdCB7IGdyYW50X3R5cGUsIHVzZXJuYW1lLCBwYXNzd29yZCwgcmVmcmVzaF90b2tlbiB9ID0gZGVjb2RlZEJvZHk7XG4gICAgICAgICAgaWYgKGdyYW50X3R5cGUgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgICAgIGlmICghZGF0YWJhc2UuaGFzVXNlcldpdGhEYXRhKHVzZXJuYW1lLCBwYXNzd29yZCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDQwNCwgeyBlcnJvcjogJ25vdF9mb3VuZCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB1c2VyID0gZGF0YWJhc2UuZ2V0VXNlcldpdGhEYXRhKHVzZXJuYW1lLCBwYXNzd29yZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoMjAwLCBkYXRhYmFzZS5nZXRUb2tlbkZvcih1c2VyLmlkKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgIGlmIChncmFudF90eXBlID09PSAncmVmcmVzaF90b2tlbicpIHtcbiAgICAgICAgICAgIGlmICghZGF0YWJhc2UuaGFzVG9rZW5XaXRoUmVmcmVzaChyZWZyZXNoX3Rva2VuKSkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoNDAwLCB7IGVycm9yOiAnaW52YWxpZF90b2tlbicgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZWZyZXNoZWRUb2tlbiA9IGRhdGFiYXNlLnVwZGF0ZVRva2VuKHJlZnJlc2hfdG9rZW4pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDIwMCwgcmVmcmVzaGVkVG9rZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoNDA0LCB7IGVycm9yOiAndW5leHBlY3RlZF9lcnJvcicgfSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLyoqXG4gICAgICAgKiBNYXBzIGAvcGFzc3dvcmRzYCByZXNvdXJjZVxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKlxuICAgICAgICovXG4gICAgICBwYXNzd29yZHM6IHtcbiAgICAgICAgUE9TVDogKGRhdGFiYXNlLCBpZCwgYm9keSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgZW1haWwgfSA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICAgICAgaWYgKCFkYXRhYmFzZS5oYXNVc2VyV2l0aEVtYWlsKGVtYWlsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDQwNCwgeyBlcnJvcjogJ25vdF9mb3VuZCcgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXNwb25zZSgpO1xuICAgICAgICB9LFxuICAgICAgICBQVVQ6IChkYXRhYmFzZSwgaWQpID0+IHtcbiAgICAgICAgICBpZiAoIWRhdGFiYXNlLmhhc1Bhc3N3b3JkUmVzZXRUb2tlbihpZCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZSg0MDQsIHsgZXJyb3I6ICdub3RfZm91bmQnIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBTYW5kYm94QVBJXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1NhbmRib3hEYXRhYmFzZX0gZGF0YWJhc2UgLSBUaGUgZGF0YWJhc2UgdG8gdXNlIGZvciBzdG9yaW5nIHNlc3NzaW9uIGNoYW5nZXNcbiAgICogQHJldHVybiB7U2FuZGJveEFQSX1cbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGFiYXNlKSB7XG4gICAgdGhpcy5fZGF0YWJhc2UgPSBkYXRhYmFzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdHVicyBBUEkgY2FsbHNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlc291cmNlIC0gVGhlIHJlc291cmNlIHRvIGZldGNoIGZyb21cbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWQgLSBUaGUgcGF5bG9kIHRvIHByb3BhZ2F0ZVxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgaW52b2tlKHJlc291cmNlLCBwYXlsb2FkKSB7XG4gICAgY29uc3QgW3JvdXRlLCBpZF0gPSByZXNvdXJjZS5zcGxpdCgnLycpO1xuICAgIGNvbnN0IHsgbWV0aG9kLCBib2R5LCBoZWFkZXJzIH0gPSBwYXlsb2FkO1xuICAgIHJldHVybiBTYW5kYm94QVBJLnJlc291cmNlc1tyb3V0ZV1bbWV0aG9kXSh0aGlzLl9kYXRhYmFzZSwgaWQsIGJvZHksIGhlYWRlcnMpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTYW5kYm94QVBJO1xuIiwiY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5jb25zdCBnZW5lcmF0ZVJhbmRvbVN0cmluZyA9IFV0aWxzLmdlbmVyYXRlUmFuZG9tU3RyaW5nO1xuY29uc3QgZ2VuZXJhdGVSYW5kb21VVUlEID0gVXRpbHMuZ2VuZXJhdGVSYW5kb21VVUlEO1xuXG4vKipcbiAqIEBjbGFzcyBTYW5kYm94RGF0YWJhc2VcbiAqL1xuY2xhc3MgU2FuZGJveERhdGFiYXNlIHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgU2FuZGJveEFQSVxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtKU09OfSB1c2VycyAtIFRoZSBpbml0aWFsIHVzZXIgZml4dHVyZXNcbiAgICogQHBhcmFtIHtKU09OfSB0b2tlbnMgLSBUaGUgaW5pdGlhbCB0b2tlbiBmaXh0dXJlc1xuICAgKiBAcGFyYW0ge0pTT059IHBhc3N3b3JkcyAtIFRoZSBpbml0aWFsIHBhc3N3b3JkcyBmaXh0dXJlc1xuICAgKiBAcmV0dXJuIFNhbmRib3hEYXRhYmFzZVxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IodXNlcnMsIHRva2VucywgcGFzc3dvcmRzKSB7XG4gICAgdGhpcy5fdXNlcnMgPSBbLi4udXNlcnNdO1xuICAgIHRoaXMuX3Rva2VucyA9IFsuLi50b2tlbnNdO1xuICAgIHRoaXMuX3Bhc3N3b3JkcyA9IFsuLi5wYXNzd29yZHNdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdXNlcnNcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqXG4gICAqL1xuICBnZXQgdXNlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdG9rZW5zXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKlxuICAgKi9cbiAgZ2V0IHRva2VucygpIHtcbiAgICByZXR1cm4gdGhpcy5fdG9rZW5zO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3RzIGBwdWJsaWNgIHVzZXIgZGF0YVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqXG4gICovXG4gIF9leHRyYWN0VXNlcihkYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBkYXRhLmlkLFxuICAgICAgcHVibGlzaGVyX2lkOiBkYXRhLnB1Ymxpc2hlcl9pZCxcbiAgICAgIGZpcnN0X25hbWU6IGRhdGEuZmlyc3RfbmFtZSxcbiAgICAgIGxhc3RfbmFtZTogZGF0YS5sYXN0X25hbWUsXG4gICAgICBlbWFpbDogZGF0YS5lbWFpbCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3RzIGBwdWJsaWNgIHRva2VuIGRhdGFcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKlxuICAqL1xuICBfZXh0cmFjdFRva2VuKGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNjZXNzX3Rva2VuOiBkYXRhLmFjY2Vzc190b2tlbixcbiAgICAgIHJlZnJlc2hfdG9rZW46IGRhdGEucmVmcmVzaF90b2tlbixcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgZGF0YWJhc2UgaGFzIGEgc3BlY2lmaWMgdG9rZW4gYmFzZWQgb24gcmVmcmVzaF90b2tlblxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVmcmVzaFRva2VuIC0gVGhlIHJlZnJlc2ggdG9rZW4gdG8gbG9va3VwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqXG4gICAqL1xuICBoYXNUb2tlbldpdGhSZWZyZXNoKHJlZnJlc2hUb2tlbikge1xuICAgIHJldHVybiAhIX50aGlzLl90b2tlbnMuZmluZEluZGV4KHRva2VuID0+IHRva2VuLnJlZnJlc2hfdG9rZW4gPT09IHJlZnJlc2hUb2tlbik7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBkYXRhYmFzZSBoYXMgYSBzcGVjaWZpYyB1c2VyIGJhc2VkIG9uIGRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsIHRvIGxvb2t1cFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgcGFzc3dvcmQgdG8gbG9va3VwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqXG4gICAqL1xuICBoYXNVc2VyV2l0aERhdGEoZW1haWwsIHBhc3N3b3JkKSB7XG4gICAgcmV0dXJuICEhfnRoaXMuX3VzZXJzLmZpbmRJbmRleCh1c2VyID0+IHVzZXIuZW1haWwgPT09IGVtYWlsICYmIHVzZXIucGFzc3dvcmQgPT09IHBhc3N3b3JkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIGRhdGFiYXNlIGhhcyBhIHNwZWNpZmljIHVzZXIgYmFzZWQgb24gdG9rZW5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGFjY2Vzc1Rva2VuIC0gVGhlIHRva2VuIHRvIGxvb2t1cFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKlxuICAgKi9cbiAgaGFzVXNlcldpdGhUb2tlbihhY2Nlc3NUb2tlbikge1xuICAgIHJldHVybiAhIX50aGlzLl90b2tlbnMuZmluZEluZGV4KHRva2VuID0+IHRva2VuLmFjY2Vzc190b2tlbiA9PT0gYWNjZXNzVG9rZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdG9rZW4gZm9yIGEgdXNlclxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIC0gVGhlIHVzZXIgaWQgdG8gbG9va3VwXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICpcbiAgICovXG4gIGdldFRva2VuRm9yKHVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLl90b2tlbnMuZmluZCh0b2tlbiA9PiB0b2tlbi51c2VyX2lkID09PSB1c2VySWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgZGF0YWJhc2UgaGFzIGEgc3BlY2lmaWMgdXNlciBiYXNlZCBvbiBlbWFpbFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwgdG8gbG9va3VwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqXG4gICAqL1xuICBoYXNVc2VyV2l0aEVtYWlsKGVtYWlsKSB7XG4gICAgcmV0dXJuICEhfnRoaXMuX3VzZXJzLmZpbmRJbmRleCh1c2VyID0+IHVzZXIuZW1haWwgPT09IGVtYWlsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIGRhdGFiYXNlIGhhcyBhIHNwZWNpZmljIHBhc3N3b3JkIHJlc2V0IHRva2VuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiAtIFRoZSB0b2tlbiB0byBsb29rdXBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICpcbiAgICovXG4gIGhhc1Bhc3N3b3JkUmVzZXRUb2tlbih0b2tlbikge1xuICAgIHJldHVybiAhIX50aGlzLl9wYXNzd29yZHMuZmluZEluZGV4KHJlY29yZCA9PiByZWNvcmQudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHVzZXIgZnJvbSBmaXh0dXJlcyBiYXNlZCBvbiBkYXRhXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCAtIFRoZSB0YXJnZXQgdXNlciBlbWFpbFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgdGFyZ2V0IHVzZXIgcGFzc3dvcmRcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICpcbiAgICovXG4gIGdldFVzZXJXaXRoRGF0YShlbWFpbCwgcGFzc3dvcmQpIHtcbiAgICByZXR1cm4gdGhpcy5fZXh0cmFjdFVzZXIodGhpcy5fdXNlcnMuZmluZCh1c2VyID0+ICh1c2VyLmVtYWlsID09PSBlbWFpbCAmJiB1c2VyLnBhc3N3b3JkID09PSBwYXNzd29yZCkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBSZXR1cm5zIHVzZXIgZnJvbSBmaXh0dXJlcyBiYXNlZCBvbiBgaWRgXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSB1c2VyIGlkIHRvIGxvb2t1cFxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBmb3VuZCB1c2VyIGRhdGFcbiAgICpcbiAgICovXG4gIGdldFVzZXJXaXRoSWQoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5fZXh0cmFjdFVzZXIodGhpcy5fdXNlcnMuZmluZCh1c2VyID0+IHVzZXIuaWQgPT09IGlkKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB1c2VyIGZyb20gZml4dHVyZXMgYmFzZWQgb24gdG9rZW5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGFjY2Vzc1Rva2VuIC0gVGhlIHRva2VuIHRvIGxvb2t1cFxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBmb3VuZCBgYWNjZXNzX3Rva2VuYCBhbmQgYHJlZnJlc2hfdG9rZW5gXG4gICAqXG4gICAqL1xuICBnZXRVc2VyV2l0aFRva2VuKGFjY2Vzc1Rva2VuKSB7XG4gICAgY29uc3QgdXNlcklkID0gdGhpcy5fdG9rZW5zLmZpbmQodG9rZW4gPT4gdG9rZW4uYWNjZXNzX3Rva2VuID09PSBhY2Nlc3NUb2tlbikudXNlcl9pZDtcbiAgICByZXR1cm4gdGhpcy5nZXRVc2VyV2l0aElkKHVzZXJJZCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB1c2VyIHRvIGZpeHR1cmVzXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIHBhc3N3b3JkIHRvIHNldFxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlyc3ROYW1lIC0gVGhlIGZpcnN0TmFtZSB0byBzZXQgLSBPcHRpb25hbFxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFzdE5hbWUgLSBUaGUgbGFzdE5hbWUgdG8gc2V0IC0gT3B0aW9uYWxcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdXNlciBkYXRhIG1lcmdlZCBpbnRvIGFuIG9iamVjdFxuICAgKlxuICAgKi9cbiAgYWRkVXNlcihlbWFpbCwgcGFzc3dvcmQsIGZpcnN0TmFtZSwgbGFzdE5hbWUpIHtcbiAgICBjb25zdCB1c2VySWQgPSBnZW5lcmF0ZVJhbmRvbVVVSUQoKTtcbiAgICBjb25zdCBwdWJsaXNoZXJJZCA9IGdlbmVyYXRlUmFuZG9tVVVJRCgpO1xuICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKTtcbiAgICBjb25zdCByZWZyZXNoVG9rZW4gPSBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICAgIGNvbnN0IG5ld1Rva2VuID0ge1xuICAgICAgdXNlcl9pZDogdXNlcklkLFxuICAgICAgYWNjZXNzX3Rva2VuOiBhY2Nlc3NUb2tlbixcbiAgICAgIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hUb2tlbixcbiAgICB9O1xuICAgIGNvbnN0IG5ld1VzZXIgPSB7XG4gICAgICBpZDogdXNlcklkLFxuICAgICAgcHVibGlzaGVyX2lkOiBwdWJsaXNoZXJJZCxcbiAgICAgIGVtYWlsLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBmaXJzdF9uYW1lOiBmaXJzdE5hbWUsXG4gICAgICBsYXN0X25hbWU6IGxhc3ROYW1lLFxuICAgIH07XG4gICAgLy8gU3RvcmUgbmV3IHJlY29yZHNcbiAgICB0aGlzLl90b2tlbnMucHVzaChuZXdUb2tlbik7XG4gICAgdGhpcy5fdXNlcnMucHVzaChuZXdVc2VyKTtcbiAgICAvLyBSZXR1cm4gcHVibGljIHVzZXIgZGF0YVxuICAgIHJldHVybiB0aGlzLl9leHRyYWN0VXNlcihuZXdVc2VyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHVzZXJcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIHVzZXIgaWQgdG8gbG9va3VwXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmaXJzdE5hbWUgLSBUaGUgZmlyc3ROYW1lIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFzdE5hbWUgLSBUaGUgbGFzdE5hbWUgdG8gdXBkYXRlXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHVzZXIgZGF0YSBtZXJnZWQgaW50byBhbiBvYmplY3RcbiAgICpcbiAgICovXG4gIHVwZGF0ZVVzZXIoaWQsIGZpcnN0TmFtZSwgbGFzdE5hbWUpIHtcbiAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnMuZmluZChyZWNvcmQgPT4gcmVjb3JkLmlkID09PSBpZCk7XG4gICAgaWYgKHR5cGVvZiBmaXJzdE5hbWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB1c2VyLmZpcnN0X25hbWUgPSBmaXJzdE5hbWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbGFzdE5hbWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB1c2VyLmxhc3RfbmFtZSA9IGxhc3ROYW1lO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gcHVibGljIHVzZXIgZGF0YVxuICAgIHJldHVybiB0aGlzLl9leHRyYWN0VXNlcih1c2VyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRva2VuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZWZyZXNoVG9rZW4gLSBUaGUgcmVmcmVzaFRva2VuIHRvIHVzZVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBmb3VuZCBgYWNjZXNzX3Rva2VuYCBhbmQgYHJlZnJlc2hfdG9rZW5gXG4gICAqXG4gICAqL1xuICB1cGRhdGVUb2tlbihyZWZyZXNoVG9rZW4pIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMuX3Rva2Vucy5maW5kKHJlY29yZCA9PiByZWNvcmQucmVmcmVzaF90b2tlbiA9PT0gcmVmcmVzaFRva2VuKTtcbiAgICB0b2tlbi5hY2Nlc3NfdG9rZW4gPSBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICAgIHRva2VuLnJlZnJlc2hfdG9rZW4gPSBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICAgIC8vIFJldHVybiBwdWJsaWMgdXNlciBkYXRhXG4gICAgcmV0dXJuIHRoaXMuX2V4dHJhY3RUb2tlbih0b2tlbik7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNhbmRib3hEYXRhYmFzZTtcbiIsImNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuY29uc3QgQ29uc3VtZXIgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9jb25zdW1lcicpO1xuY29uc3QgdmFsaWRhdGVQYXNzd29yZCA9IHJlcXVpcmUoJy4uL3V0aWxzJykudmFsaWRhdGVQYXNzd29yZDtcblxuLyoqXG4gKiBAY2xhc3MgQXV0aGVudGljYXRvclxuICovXG5jbGFzcyBBdXRoZW50aWNhdG9yIHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgQXV0aGVudGljYXRvclxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdG9yZX0gc3RvcmUgLSBUaGUgU3RvcmUgaW5zdGFuY2UgdG8gdXNlXG4gICAqIEByZXR1cm4ge0F1dGhlbnRpY2F0b3J9XG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25zdW1lcikge1xuICAgIGFzc2VydChjb25zdW1lciBpbnN0YW5jZW9mIENvbnN1bWVyLCAnYGNvbnN1bWVyYCBzaG91bGQgYmUgaW5zdGFuY2Ugb2YgQ29uc3VtZXInKTtcbiAgICB0aGlzLl9jb25zdW1lciA9IGNvbnN1bWVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEFza3MgZm9yIGEgcGFzc3dvcmQgcmVzZXRcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsIHRvIHJlc2V0IHRoZSBwYXNzd29yZCBmb3JcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIHJlcXVlc3RQYXNzd29yZFJlc2V0KGVtYWlsKSB7XG4gICAgYXNzZXJ0KGVtYWlsLCAnTWlzc2luZyBgZW1haWxgJyk7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnN1bWVyLnJlcXVlc3RQYXNzd29yZFJlc2V0KGVtYWlsKS50aGVuKCgpID0+IFByb21pc2UucmVzb2x2ZSh7IG1lc3NhZ2U6ICdBIHJlc2V0IGxpbmsgaGFzIGJlZW4gc2VudCB0byB5b3VyIGVtYWlsJyB9KSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIG5ldyBwYXNzd29yZFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gLSBUaGUgcmVzZXQgdG9rZW4gcHJvdmlkZWQgdmlhIGVtYWlsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSBuZXcgcGFzc3dvcmRcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIHJlc2V0UGFzc3dvcmQodG9rZW4sIHBhc3N3b3JkKSB7XG4gICAgYXNzZXJ0KHRva2VuLCAnTWlzc2luZyBgdG9rZW5gJyk7XG4gICAgYXNzZXJ0KHBhc3N3b3JkLCAnTWlzc2luZyBgcGFzc3dvcmRgJyk7XG4gICAgY29uc3QgeyBpc1ZhbGlkLCBtZXNzYWdlIH0gPSB2YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKTtcbiAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IobWVzc2FnZSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIucmVzZXRQYXNzd29yZCh0b2tlbiwgcGFzc3dvcmQpLnRoZW4oKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgbWVzc2FnZTogJ1lvdXIgcGFzc3dvcmQgaGFzIGJlZW4gcmVzZXQnIH0pKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aGVudGljYXRvcjtcbiIsImNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG4vKipcbiAqIEBjbGFzcyBDbGllbnRcbiAqL1xuY2xhc3MgQ2xpZW50IHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgQ2xpZW50XG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgQ2xpZW50IGlkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWNyZXQgLSBUaGUgQ2xpZW50IHNlY3JldFxuICAgKiBAcmV0dXJuIHtDbGllbnR9XG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZCwgc2VjcmV0KSB7XG4gICAgYXNzZXJ0KGlkLCAnTWlzc2luZyBgaWRgJyk7XG4gICAgYXNzZXJ0KHNlY3JldCwgJ01pc3NpbmcgYHNlY3JldGAnKTtcbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIHRoaXMuX3NlY3JldCA9IHNlY3JldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIENsaWVudCBpZFxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqXG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgQ2xpZW50IHNlY3JldFxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqXG4gICAqL1xuICBnZXQgc2VjcmV0KCkge1xuICAgIHJldHVybiB0aGlzLl9zZWNyZXQ7XG4gIH1cblxufVxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnQ7XG4iLCJjb25zdCBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcbmNvbnN0IFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvdXNlcicpO1xuY29uc3QgcmV0cmlldmVVUkwgPSByZXF1aXJlKCcuLi91dGlscycpLnJldHJpZXZlVVJMO1xuY29uc3QgcmVkaXJlY3RUb1VSTCA9IHJlcXVpcmUoJy4uL3V0aWxzJykucmVkaXJlY3RUb1VSTDtcblxuLyoqXG4gKiBAY2xhc3MgU2Vzc2lvblxuICovXG5jbGFzcyBTZXNzaW9uIHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgVXNlclxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtVc2VyfSBjb25zdW1lciAtIFRoZSBVc2VyIGluc3RhbmNlIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbG9naW5Ib3N0IC0gVGhlIGxvZ2luIGFwcCBob3N0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZWRpcmVjdEZuIC0gVGhlIGZ1bmN0aW9uIHRoZSBmb3JjZXMgVVJMIHJlZGlyZWN0aW9uIC0gRGVmYXVsdHMgdG8gYHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlYFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFnZVVSTCAtIFRoZSBjdXJyZW50IHBhZ2UgVVJMIC0gRGVmYXVsdHMgdG8gYHdpbmRvdy5ocmVmYFxuICAgKiBAcmV0dXJuIHtVc2VyfVxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IodXNlciwgbG9naW5Ib3N0LCByZWRpcmVjdEZuID0gcmVkaXJlY3RUb1VSTCwgcGFnZVVSTCA9IHJldHJpZXZlVVJMKSB7XG4gICAgYXNzZXJ0KHVzZXIgaW5zdGFuY2VvZiBVc2VyLCAnYHVzZXJgIHNob3VsZCBiZSBpbnN0YW5jZSBvZiBVc2VyJyk7XG4gICAgYXNzZXJ0KGxvZ2luSG9zdCwgJ2Bsb2dpbkhvc3RgIGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgdGhpcy5fdXNlciA9IHVzZXI7XG4gICAgdGhpcy5fbG9naW5Ib3N0ID0gbG9naW5Ib3N0O1xuICAgIHRoaXMuX3JlZGlyZWN0Rm4gPSByZWRpcmVjdEZuO1xuICAgIHRoaXMuX3BhZ2VVUkwgPSBwYWdlVVJMO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgc2Vzc2lvbiBpcyB2YWxpZCAoVXNlciBpcyBhdXRoZW50aWNhdGVkKVxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKlxuICAgKi9cbiAgZ2V0IGlzVmFsaWQoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLl91c2VyLmJlYXJlciAhPT0gJ3VuZGVmaW5lZCc7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgc2Vzc2lvbiBmb3IgdXNlciAoaWYgZGVmaW5lZCkgaW4gU3RvcmVcbiAgICogTm90ZTogVGhpcyBzaG91bGQgYmUgdGhlIEZJUlNUIGNhbGwgYmVmb3JlIGF0dGVtcHRpbmcgYW55IG90aGVyIHNlc3Npb24gb3BlcmF0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlci5zeW5jV2l0aFN0b3JlKCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBJbnZhbGlkYXRlcyBTZXNzaW9uXG4gICAqXG4gICAqIEByZXR1cm4ge1ZvaWR9XG4gICAqXG4gICAqL1xuICBpbnZhbGlkYXRlKCkge1xuICAgIC8vIFJlZGlyZWN0IHRvIGxvZ2luIGhvc3Qgd2l0aCBhIHJldHVybiBVUkxcbiAgICByZXR1cm4gdGhpcy5fcmVkaXJlY3RGbihgJHt0aGlzLl9sb2dpbkhvc3R9L2xvZ291dGApO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyBTZXNzaW9uXG4gICAqIC0gRXh0cmFjdHMgY3VycmVudCBVUkwgZnJvbSB3aW5kb3cubG9jYXRpb25cbiAgICogLSBSZWRpcmVjdHMgdG8gYGxvZ2luSG9zdGAgd2l0aCBlbmNvZGVkIFVSTFxuICAgKlxuICAgKiBAcmV0dXJuIHtWb2lkfVxuICAgKlxuICAgKi9cbiAgdmFsaWRhdGUoKSB7XG4gICAgY29uc3QgcmVkaXJlY3RVcmwgPSBlbmNvZGVVUklDb21wb25lbnQodGhpcy5fcGFnZVVSTCgpKTtcbiAgICByZXR1cm4gdGhpcy5fcmVkaXJlY3RGbihgJHt0aGlzLl9sb2dpbkhvc3R9L2xvZ2luP3JlZGlyZWN0VXJsPSR7cmVkaXJlY3RVcmx9YCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXNzaW9uO1xuIiwiY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5jb25zdCBDb25zdW1lciA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2NvbnN1bWVyJyk7XG5jb25zdCBTdG9yZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL3N0b3JlJyk7XG5jb25zdCB2YWxpZGF0ZVBhc3N3b3JkID0gcmVxdWlyZSgnLi4vdXRpbHMnKS52YWxpZGF0ZVBhc3N3b3JkO1xuXG4vKipcbiAqIEBjbGFzcyBVc2VyXG4gKi9cbmNsYXNzIFVzZXIge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBVc2VyXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZSB0byB1c2VcbiAgICogQHBhcmFtIHtDb25zdW1lcn0gY29uc3VtZXIgLSBUaGUgQ29uc3VtZXIgaW5zdGFuY2UgdG8gdXNlXG4gICAqIEByZXR1cm4ge1VzZXJ9XG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzdG9yZSwgY29uc3VtZXIpIHtcbiAgICBhc3NlcnQoc3RvcmUgaW5zdGFuY2VvZiBTdG9yZSwgJ2BzdG9yZWAgc2hvdWxkIGJlIGluc3RhbmNlIG9mIFN0b3JlJyk7XG4gICAgYXNzZXJ0KGNvbnN1bWVyIGluc3RhbmNlb2YgQ29uc3VtZXIsICdgY29uc3VtZXJgIHNob3VsZCBiZSBpbnN0YW5jZSBvZiBDb25zdW1lcicpO1xuICAgIHRoaXMuX3N0b3JlID0gc3RvcmU7XG4gICAgdGhpcy5fY29uc3VtZXIgPSBjb25zdW1lcjtcbiAgICB0aGlzLl9iZWFyZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5faWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcHVibGlzaGVySWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZmlyc3ROYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2xhc3ROYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2VtYWlsID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2lzRGlydHkgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIFVzZXIgaWRcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfSBbcmVhZC1vbmx5XSBpZFxuICAgKlxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLl9pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIFVzZXIgcHVibGlzaGVySWRcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfSBbcmVhZC1vbmx5XSBwdWJsaXNoZXJJZFxuICAgKlxuICAgKi9cbiAgZ2V0IHB1Ymxpc2hlcklkKCkge1xuICAgIHJldHVybiB0aGlzLl9wdWJsaXNoZXJJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIFVzZXIgZW1haWxcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfSBbcmVhZC1vbmx5XSBlbWFpbFxuICAgKlxuICAgKi9cbiAgZ2V0IGVtYWlsKCkge1xuICAgIHJldHVybiB0aGlzLl9lbWFpbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIFVzZXIgYmVhcmVyIHRva2VuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ30gW3JlYWQtd3JpdGVdIGJlYXJlciB0b2tlblxuICAgKlxuICAgKi9cbiAgZ2V0IGJlYXJlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fYmVhcmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgVXNlciBmaXJzdCBOYW1lXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ30gW3JlYWQtd3JpdGVdIGZpcnN0IE5hbWVcbiAgICpcbiAgICovXG4gIGdldCBmaXJzdE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpcnN0TmFtZTtcbiAgfVxuICBzZXQgZmlyc3ROYW1lKG5ld0ZpcnN0TmFtZSkge1xuICAgIGlmIChuZXdGaXJzdE5hbWUpIHtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSB0cnVlO1xuICAgICAgdGhpcy5fZmlyc3ROYW1lID0gbmV3Rmlyc3ROYW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIFVzZXIgbGFzdCBuYW1lXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ30gW3JlYWQtd3JpdGVdIGxhc3QgbmFtZVxuICAgKlxuICAgKi9cbiAgZ2V0IGxhc3ROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9sYXN0TmFtZTtcbiAgfVxuICBzZXQgbGFzdE5hbWUobmV3TGFzdE5hbWUpIHtcbiAgICBpZiAobmV3TGFzdE5hbWUpIHtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSB0cnVlO1xuICAgICAgdGhpcy5fbGFzdE5hbWUgPSBuZXdMYXN0TmFtZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3luY3IgVXNlciBkYXRhIGZyb20gU3RvcmVcbiAgICogLSBDdXJyZW50bHkgb24gYmVhcmVyIGlzIHN5bmNlZCB0byBTdG9yZVxuICAgKiAtIFN0b3JlIHByaW9yaXR5IHByb2NlZWRzIGRpcnR5IGRhdGFcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIHN5bmNXaXRoU3RvcmUoKSB7XG4gICAgbGV0IGJlYXJlcjtcbiAgICByZXR1cm4gdGhpcy5fc3RvcmUuZ2V0KCdhY2Nlc3NfdG9rZW4nKS50aGVuKChhY2Nlc3NUb2tlbikgPT4ge1xuICAgICAgLy8gQ2FjaGUgYmVhcmVyXG4gICAgICBiZWFyZXIgPSBhY2Nlc3NUb2tlbjtcbiAgICAgIHJldHVybiB0aGlzLl9jb25zdW1lci5yZXRyaWV2ZVVzZXIoYWNjZXNzVG9rZW4pO1xuICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIHRoaXMuX2lkID0gZGF0YS5pZDtcbiAgICAgIHRoaXMuX3B1Ymxpc2hlcklkID0gZGF0YS5wdWJsaXNoZXJfaWQ7XG4gICAgICB0aGlzLl9lbWFpbCA9IGRhdGEuZW1haWw7XG4gICAgICB0aGlzLl9maXJzdE5hbWUgPSBkYXRhLmZpcnN0X25hbWU7XG4gICAgICB0aGlzLl9sYXN0TmFtZSA9IGRhdGEubGFzdF9uYW1lO1xuICAgICAgdGhpcy5fYmVhcmVyID0gYmVhcmVyO1xuICAgICAgdGhpcy5faXNEaXJ0eSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIG1lc3NhZ2U6ICdTeW5jZWQgVXNlciBtb2RlbCB3aXRoIFN0b3JlJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgVXNlciBkYXRhXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBzYXZlKCkge1xuICAgIGlmICghdGhpcy5faWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ0Nhbm5vdCBzYXZlIGEgbm9uLWV4aXN0ZW50IFVzZXInKSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5faXNEaXJ0eSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIG1lc3NhZ2U6ICdObyBVc2VyIG1vZGVsIGNoYW5nZXMgdG8gc3luYycsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NvbnN1bWVyLnVwZGF0ZVVzZXIodGhpcy5faWQsIHRoaXMuX2JlYXJlciwge1xuICAgICAgZmlyc3ROYW1lOiB0aGlzLl9maXJzdE5hbWUsXG4gICAgICBsYXN0TmFtZTogdGhpcy5fbGFzdE5hbWUsXG4gICAgfSkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLl9pc0RpcnR5ID0gZmFsc2U7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgbWVzc2FnZTogJ1VwZGF0ZWQgVXNlciBtb2RlbCcsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFVzZXJcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsIHRvIHNldFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgcGFzc3dvcmQgdG8gc2V0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmaXJzdE5hbWUgLSBUaGUgZmlyc3QgbmFtZSB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhc3ROYW1lIC0gVGhlIGxhc3QgbmFtZSB0byBzZXRcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIGNyZWF0ZShlbWFpbCwgcGFzc3dvcmQsIGZpcnN0TmFtZSwgbGFzdE5hbWUpIHtcbiAgICBhc3NlcnQoZW1haWwsICdNaXNzaW5nIGBlbWFpbGAnKTtcbiAgICBhc3NlcnQocGFzc3dvcmQsICdNaXNzaW5nIGBwYXNzd29yZGAnKTtcbiAgICBjb25zdCB7IGlzVmFsaWQsIG1lc3NhZ2UgfSA9IHZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpO1xuICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihtZXNzYWdlKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb25zdW1lci5jcmVhdGVVc2VyKGVtYWlsLCBwYXNzd29yZCwgZmlyc3ROYW1lLCBsYXN0TmFtZSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5faWQgPSBkYXRhLmlkO1xuICAgICAgdGhpcy5fcHVibGlzaGVySWQgPSBkYXRhLnB1Ymxpc2hlcl9pZDtcbiAgICAgIHRoaXMuX2ZpcnN0TmFtZSA9IGRhdGEuZmlyc3RfbmFtZTtcbiAgICAgIHRoaXMuX2xhc3ROYW1lID0gZGF0YS5sYXN0X25hbWU7XG4gICAgICB0aGlzLl9lbWFpbCA9IGRhdGEuZW1haWw7XG4gICAgICB0aGlzLl9pc0RpcnR5ID0gZmFsc2U7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgZGF0YSxcbiAgICAgICAgbWVzc2FnZTogJ0NyZWF0ZWQgVXNlcicsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYXV0aGVudGljYXRpb24gdG9rZW5zIGZvciBhIHVzZXJuYW1lLXBhc3N3b3JkIGNvbWJpbmF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VybmFtZSAtIFRoZSB1c2VybmFtZSB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIHBhc3N3b3JkIHRvIHVzZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgYXV0aGVudGljYXRlKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgIGFzc2VydCh1c2VybmFtZSwgJ01pc3NpbmcgYHVzZXJuYW1lYCcpO1xuICAgIGFzc2VydChwYXNzd29yZCwgJ01pc3NpbmcgYHBhc3N3b3JkYCcpO1xuICAgIGxldCBiZWFyZXI7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnN1bWVyLnJldHJpZXZlVG9rZW4odXNlcm5hbWUsIHBhc3N3b3JkKS50aGVuKChyZXMpID0+IHtcbiAgICAgIGNvbnN0IHsgYWNjZXNzX3Rva2VuLCByZWZyZXNoX3Rva2VuIH0gPSByZXM7XG4gICAgICAvLyBDYWNoZSBiZWFyZXJcbiAgICAgIGJlYXJlciA9IGFjY2Vzc190b2tlbjtcbiAgICAgIC8vIFN0b3JlIHRva2Vuc1xuICAgICAgcmV0dXJuIHRoaXMuX3N0b3JlLnNldCgnYWNjZXNzX3Rva2VuJywgYWNjZXNzX3Rva2VuKVxuICAgICAgICAudGhlbigoKSA9PiB0aGlzLl9zdG9yZS5zZXQoJ3JlZnJlc2hfdG9rZW4nLCByZWZyZXNoX3Rva2VuKSlcbiAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5fY29uc3VtZXIucmV0cmlldmVVc2VyKGFjY2Vzc190b2tlbikpO1xuICAgICAgLy8gUmV0cmlldmUgdXNlciBkYXRhXG4gICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5fYmVhcmVyID0gYmVhcmVyO1xuICAgICAgdGhpcy5faWQgPSBkYXRhLmlkO1xuICAgICAgdGhpcy5fcHVibGlzaGVySWQgPSBkYXRhLnB1Ymxpc2hlcl9pZDtcbiAgICAgIHRoaXMuX2VtYWlsID0gZGF0YS5lbWFpbDtcbiAgICAgIHRoaXMuX2ZpcnN0TmFtZSA9IGRhdGEuZmlyc3RfbmFtZTtcbiAgICAgIHRoaXMuX2xhc3ROYW1lID0gZGF0YS5sYXN0X25hbWU7XG4gICAgICB0aGlzLl9pc0RpcnR5ID0gZmFsc2U7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgZGF0YSxcbiAgICAgICAgbWVzc2FnZTogJ0F1dGhlbnRpY2F0ZWQgVXNlcicsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdXNlciBmb3IgYW4gYWNjZXNzIHRva2VuLlxuICAgKiBGYWxsYmFja3MgdG8gdG9rZW4gcmVmcmVzaCBpZiByZWZyZXNoVG9rZW4gaXMgZGVmaW5lZFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWNjZXNzVG9rZW4gLSBUaGUgYWNjZXNzIHRva2VuIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVmcmVzaFRva2VuIC0gVGhlIHJlZnJlc2ggdG9rZW4gdG8gdXNlIChPcHRpb25hbClcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIGF1dGhlbnRpY2F0ZVdpdGhUb2tlbihhY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuKSB7XG4gICAgYXNzZXJ0KGFjY2Vzc1Rva2VuLCAnTWlzc2luZyBgYWNjZXNzVG9rZW5gJyk7XG4gICAgLy8gU3RvcmUgYWNjZXNzIHRva2VuXG4gICAgdGhpcy5fc3RvcmUuc2V0KCdhY2Nlc3NfdG9rZW4nLCBhY2Nlc3NUb2tlbik7XG4gICAgLy8gU3RvcmUgcmVmcmVzaCB0b2tlbiAob3IgY2xlYXIgaWYgdW5kZWZpbmVkKVxuICAgIGlmIChyZWZyZXNoVG9rZW4pIHtcbiAgICAgIHRoaXMuX3N0b3JlLnNldCgncmVmcmVzaF90b2tlbicsIHJlZnJlc2hUb2tlbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3N0b3JlLnJlbW92ZSgncmVmcmVzaF90b2tlbicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIucmV0cmlldmVVc2VyKGFjY2Vzc1Rva2VuKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBpZiAoIXJlZnJlc2hUb2tlbiB8fCBlcnIubmFtZSAhPT0gJ2ludmFsaWRfdG9rZW4nKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgfVxuICAgICAgLy8gVHJ5IHRvIHJlZnJlc2ggdGhlIHRva2VucyBpZiB0aGUgZXJyb3IgaXMgb2YgYGludmFsaWRfdG9rZW5gXG4gICAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIucmVmcmVzaFRva2VuKHJlZnJlc2hUb2tlbikudGhlbigobmV3VG9rZW5zKSA9PiB7XG4gICAgICAgIC8vIFN0b3JlIG5ldyB0b2tlbnNcbiAgICAgICAgdGhpcy5fc3RvcmUuc2V0KCdhY2Nlc3NfdG9rZW4nLCBuZXdUb2tlbnMuYWNjZXNzX3Rva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmUuc2V0KCdyZWZyZXNoX3Rva2VuJywgbmV3VG9rZW5zLnJlZnJlc2hfdG9rZW4pO1xuICAgICAgICAvLyBSZXRyaWV2ZSB1c2VyIHdpdGggbmV3IHRva2VuXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25zdW1lci5yZXRyaWV2ZVVzZXIobmV3VG9rZW5zLmFjY2Vzc190b2tlbik7XG4gICAgICB9KTtcbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICB0aGlzLl9iZWFyZXIgPSBhY2Nlc3NUb2tlbjtcbiAgICAgIHRoaXMuX2lkID0gZGF0YS5pZDtcbiAgICAgIHRoaXMuX3B1Ymxpc2hlcklkID0gZGF0YS5wdWJsaXNoZXJfaWQ7XG4gICAgICB0aGlzLl9lbWFpbCA9IGRhdGEuZW1haWw7XG4gICAgICB0aGlzLl9maXJzdE5hbWUgPSBkYXRhLmZpcnN0X25hbWU7XG4gICAgICB0aGlzLl9sYXN0TmFtZSA9IGRhdGEubGFzdF9uYW1lO1xuICAgICAgdGhpcy5faXNEaXJ0eSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIG1lc3NhZ2U6ICdBdXRoZW50aWNhdGVkIFVzZXInLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmx1c2hlcyBzdG9yZWQgdG9rZW5zIGZvciBVc2VyIChsb2dvdXQpXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBmbHVzaCgpIHtcbiAgICB0aGlzLl9iZWFyZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5faWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcHVibGlzaGVySWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZmlyc3ROYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2xhc3ROYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2VtYWlsID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2lzRGlydHkgPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcy5fc3RvcmUucmVtb3ZlKCdhY2Nlc3NfdG9rZW4nLCAncmVmcmVzaF90b2tlbicpLnRoZW4oKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgIG1lc3NhZ2U6ICdGbHVzaGVkIFVzZXIgZGF0YScsXG4gICAgfSkpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyO1xuIiwiY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5jb25zdCBxcyA9IHJlcXVpcmUoJ3FzJyk7XG5jb25zdCBDbGllbnQgPSByZXF1aXJlKCcuLi9tb2RlbHMvY2xpZW50Jyk7XG5jb25zdCBQcm9kdWN0aW9uQVBJID0gcmVxdWlyZSgnLi4vYXBpJykuUHJvZHVjdGlvbjtcbmNvbnN0IFNhbmRib3hBUEkgPSByZXF1aXJlKCcuLi9hcGknKS5TYW5kYm94O1xuY29uc3QgZXh0cmFjdEVycm9yTWVzc2FnZSA9IHJlcXVpcmUoJy4uL3V0aWxzJykuZXh0cmFjdEVycm9yTWVzc2FnZTtcblxuLyoqXG4gKiBAY2xhc3MgQ29uc3VtZXJcbiAqL1xuY2xhc3MgQ29uc3VtZXIge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBDb25zdW1lclxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBDbGllbnQgaW5zdGFuY2UgdG8gdXNlXG4gICAqIEBwYXJhbSB7QVBJLlByb2R1Y3Rpb258QVBJLlNhbmRib3h9IGFwaSAtIFRoZSBhcGkgdG8gdXNlIGZvciBmZXRjaGluZyBkYXRhXG4gICAqIEByZXR1cm4ge0NvbnN1bWVyfVxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoY2xpZW50LCBhcGkpIHtcbiAgICBhc3NlcnQoY2xpZW50IGluc3RhbmNlb2YgQ2xpZW50LCAnYGNsaWVudGAgc2hvdWxkIGJlIGluc3RhbmNlIG9mIENsaWVudCcpO1xuICAgIGFzc2VydChhcGkgaW5zdGFuY2VvZiBQcm9kdWN0aW9uQVBJIHx8IGFwaSBpbnN0YW5jZW9mIFNhbmRib3hBUEksICdgYXBpYCBzaG91bGQgYmUgaW5zdGFuY2Ugb2YgQVBJLlByb2R1Y3Rpb24gb3IgQVBJLlNhbmRib3gnKTtcbiAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XG4gICAgdGhpcy5fYXBpID0gYXBpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgZGF0YSBmcm9tIEFQSVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVzb3VyY2UgLSBUaGUgcmVzb3VyY2UgdG8gZmV0Y2ggZnJvbVxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIFRoZSBwYXlsb2FkIHRvIHBhc3NcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIF9yZXF1ZXN0KHJlc291cmNlLCBwYXlsb2FkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FwaS5pbnZva2UocmVzb3VyY2UsIHBheWxvYWQpLnRoZW4oKHJlcykgPT4ge1xuICAgICAgY29uc3QgeyBzdGF0dXMsIGJvZHkgfSA9IHJlcztcbiAgICAgIGlmIChwYXJzZUludChzdGF0dXMsIDEwKSA+PSA0MDApIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoZXh0cmFjdEVycm9yTWVzc2FnZShib2R5LmVycm9yKSk7XG4gICAgICAgIGVycm9yLm5hbWUgPSBib2R5LmVycm9yO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShib2R5KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdG9rZW4gZnJvbSBhIHVzZXJuYW1lLXBhc3N3b3JkIGNvbWJpbmF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VybmFtZSAtIFRoZSB1c2VybmFtZSB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIHBhc3N3b3JkIHRvIHVzZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmV0cmlldmVUb2tlbih1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICBjb25zdCBncmFudF90eXBlID0gJ3Bhc3N3b3JkJztcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgndG9rZW4nLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IHRoaXMuX2Zvcm1FbmNvZGUoe1xuICAgICAgICB1c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIGdyYW50X3R5cGUsXG4gICAgICAgIGNsaWVudF9pZDogdGhpcy5fY2xpZW50LmlkLFxuICAgICAgICBjbGllbnRfc2VjcmV0OiB0aGlzLl9jbGllbnQuc2VjcmV0LFxuICAgICAgfSksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHJlbmV3ZWQgdG9rZW5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlZnJlc2hUb2tlbiAtIFRoZSByZWZyZXNoIHRva2VuIHRvIHVzZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmVmcmVzaFRva2VuKHJlZnJlc2hUb2tlbikge1xuICAgIGNvbnN0IGdyYW50X3R5cGUgPSAncmVmcmVzaF90b2tlbic7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3Rva2VuJywge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiB0aGlzLl9mb3JtRW5jb2RlKHtcbiAgICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgICBncmFudF90eXBlLFxuICAgICAgICBjbGllbnRfaWQ6IHRoaXMuX2NsaWVudC5pZCxcbiAgICAgICAgY2xpZW50X3NlY3JldDogdGhpcy5fY2xpZW50LnNlY3JldCxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSB1cmwgZW5jb2RlZCBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iaiAtIE9iamVjdCB0byBzdHJpbmdpZnlcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKlxuICAgKi9cbiAgX2Zvcm1FbmNvZGUob2JqKSB7XG4gICAgcmV0dXJuIHFzLnN0cmluZ2lmeShvYmopO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBqc29uIGVuY29kZWQgc3RyaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogLSBPYmplY3QgdG8gc3RyaW5naWZ5XG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICpcbiAgICovXG4gIF9qc29uRW5jb2RlKG9iaikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVXNlclxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwgdG8gdXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSBwYXNzd29yZCB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpcnN0TmFtZSAtIFRoZSBmaXJzdCBuYW1lIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFzdE5hbWUgLSBUaGUgbGFzdCBuYW1lIHRvIHVzZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgY3JlYXRlVXNlcihlbWFpbCwgcGFzc3dvcmQsIGZpcnN0TmFtZSwgbGFzdE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgndXNlcnMnLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiB0aGlzLl9qc29uRW5jb2RlKHtcbiAgICAgICAgZW1haWwsXG4gICAgICAgIHBhc3N3b3JkLFxuICAgICAgICBmaXJzdF9uYW1lOiBmaXJzdE5hbWUsXG4gICAgICAgIGxhc3RfbmFtZTogbGFzdE5hbWUsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaXZlcyBhIFVzZXJcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIC0gVGhlIGBCZWFyZXJgIHRva2VuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICByZXRyaWV2ZVVzZXIodG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgndXNlcnMvbWUnLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gLFxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgfSxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhIFVzZXJcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJJZCAtIFRoZSBVc2VyIGlkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiAtIFRoZSBgQmVhcmVyYCB0b2tlblxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5maXJzdE5hbWUgLSBUaGUgZmlyc3QgYW1lIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5sYXN0TmFtZSAtIFRoZSBsYXN0IG5hbWUgdG8gdXNlXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICB1cGRhdGVVc2VyKHVzZXJJZCwgdG9rZW4sIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdChgdXNlcnMvJHt1c2VySWR9YCwge1xuICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiB0aGlzLl9qc29uRW5jb2RlKHtcbiAgICAgICAgZmlyc3RfbmFtZTogb3B0aW9ucy5maXJzdE5hbWUsXG4gICAgICAgIGxhc3RfbmFtZTogb3B0aW9ucy5sYXN0TmFtZSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3RzIGZvciBhIHBhc3N3b3JkIHJlc2V0XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCB0byBmb3J3YXJkIHRoZSByZXNldCB0b2tlbiB0b1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmVxdWVzdFBhc3N3b3JkUmVzZXQoZW1haWwpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgncGFzc3dvcmRzJywge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICB9LFxuICAgICAgYm9keTogdGhpcy5fanNvbkVuY29kZSh7XG4gICAgICAgIGVtYWlsLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHBhc3N3b3JkXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiAtIFRoZSByZXNldCB0b2tlbiB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIG5ldyBwYXNzd29yZFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmVzZXRQYXNzd29yZCh0b2tlbiwgcGFzc3dvcmQpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdChgcGFzc3dvcmRzLyR7dG9rZW59YCwge1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiB0aGlzLl9qc29uRW5jb2RlKHtcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uc3VtZXI7XG4iLCJjb25zdCBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcbmNvbnN0IENyb3NzU3RvcmFnZUNsaWVudCA9IHJlcXVpcmUoJ2Nyb3NzLXN0b3JhZ2UnKS5Dcm9zc1N0b3JhZ2VDbGllbnQ7XG5cbi8qKlxuICogV3JhcHBlciBhcm91bmQgYENyb3NzU3RvcmFnZUNsaWVudGBcbiAqXG4gKiBAY2xhc3MgU3RvcmVcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3plbmRlc2svY3Jvc3Mtc3RvcmFnZVxuICpcbiAqL1xuXG5jbGFzcyBTdG9yYWdlQ2xpZW50IHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgU3RvcmFnZUNsaWVudFxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiAtIFRoZSBkb21haW4gdW5kZXIgd2hpY2ggYWxsIHZhbHVlcyB3aWxsIGJlIGF0dGFjaGVkXG4gICAqIEBwYXJhbSB7Q2xhc3N9IENyb3NzU3RvcmFnZUNsaWVudENsYXNzIC0gVGhlIENyb3NzU3RvcmFnZUNsaWVudCBjbGFzcyB0byBiZSBpbnN0YW50aWF0ZWQgKERlZmF1bHRzIHRvIENyb3NzU3RvcmFnZUNsaWVudClcbiAgICogQHJldHVybiB7U3RvcmV9XG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZnJhbWVIdWIsIENyb3NzU3RvcmFnZUNsaWVudENsYXNzID0gQ3Jvc3NTdG9yYWdlQ2xpZW50KSB7XG4gICAgYXNzZXJ0KGlmcmFtZUh1YiwgJ01pc3NpbmcgYGlmcmFtZUh1YmAnKTtcbiAgICB0aGlzLl9pZnJhbWVIdWIgPSBpZnJhbWVIdWI7XG4gICAgdGhpcy5fQ3Jvc3NTdG9yYWdlQ2xpZW50Q2xhc3MgPSBDcm9zc1N0b3JhZ2VDbGllbnRDbGFzcztcbiAgICB0aGlzLl9pbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIG9mIENyb3NzU3RvcmFnZUNsaWVudC5vbkNvbm5lY3QoKTtcbiAgICogQ3Jvc3NTdG9yYWdlQ2xpZW50IGluamVjdHMgYW4gaWZyYW1lIGluIHRoZSBET00sIHNvIHdlIG5lZWRcbiAgICogdG8gZW5zdXJlIHRoYXQgdGhlIGluc2VydGlvbiBoYXBwZW5zIE9OTFkgd2hlbiBhbiBldmVudCBpcyB0cmlnZ2VyZWRcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIG9uQ29ubmVjdCgpIHtcbiAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XG4gICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyB0aGlzLl9Dcm9zc1N0b3JhZ2VDbGllbnRDbGFzcyh0aGlzLl9pZnJhbWVIdWIpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5faW5zdGFuY2Uub25Db25uZWN0KCk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBvZiBDcm9zc1N0b3JhZ2VDbGllbnQuZ2V0KCk7XG4gICAqXG4gICAqIEBwYXJhbSB7QXJndW1lbnRzfSByZXN0XG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBnZXQoLi4ucmVzdCkge1xuICAgIHJldHVybiB0aGlzLm9uQ29ubmVjdCgpLnRoZW4oKCkgPT4gdGhpcy5faW5zdGFuY2UuZ2V0KC4uLnJlc3QpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIG9mIENyb3NzU3RvcmFnZUNsaWVudC5zZXQoKTtcbiAgICpcbiAgICogQHBhcmFtIHtBcmd1bWVudHN9IHJlc3RcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIHNldCguLi5yZXN0KSB7XG4gICAgcmV0dXJuIHRoaXMub25Db25uZWN0KCkudGhlbigoKSA9PiB0aGlzLl9pbnN0YW5jZS5zZXQoLi4ucmVzdCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgb2YgQ3Jvc3NTdG9yYWdlQ2xpZW50LmRlbCgpO1xuICAgKlxuICAgKiBAcGFyYW0ge0FyZ3VtZW50c30gcmVzdFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgZGVsKC4uLnJlc3QpIHtcbiAgICByZXR1cm4gdGhpcy5vbkNvbm5lY3QoKS50aGVuKCgpID0+IHRoaXMuX2luc3RhbmNlLmRlbCguLi5yZXN0KSk7XG4gIH1cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmFnZUNsaWVudDtcbiIsImNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuY29uc3QgU3RvcmFnZUNsaWVudCA9IHJlcXVpcmUoJy4vc3RvcmFnZS1jbGllbnQnKTtcblxuLyoqXG4gKiBAY2xhc3MgU3RvcmVcbiAqL1xuY2xhc3MgU3RvcmUge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBTdG9yZVxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiAtIFRoZSBkb21haW4gdW5kZXIgd2hpY2ggYWxsIHZhbHVlcyB3aWxsIGJlIGF0dGFjaGVkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZnJhbWVIdWIgLSBUaGUgaWZyYW1lIFVSTCB3aGVyZSBhbGwgdGhlIHZhbHVlcyB3aWxsIGJlIGF0dGFjaGVkXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBpZnJhbWVIdWIgLSBUaGUgaWZyYW1lIFVSTCB3aGVyZSBhbGwgdGhlIHZhbHVlcyB3aWxsIGJlIGF0dGFjaGVkXG4gICAqIEBwYXJhbSB7Q2xhc3N9IFN0b3JhZ2VDbGllbnRDbGFzcyAtIFRoZSBDcm9zc1N0b3JhZ2VDbGllbnQgQ2xhc3MgdG8gYmUgaW5zdGFudGlhdGVkXG4gICAqIEByZXR1cm4ge1N0b3JlfVxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoZG9tYWluLCBpZnJhbWVIdWIsIFN0b3JhZ2VDbGllbnRDbGFzcyA9IFN0b3JhZ2VDbGllbnQpIHtcbiAgICBhc3NlcnQoZG9tYWluLCAnTWlzc2luZyBgZG9tYWluYCcpO1xuICAgIGFzc2VydChpZnJhbWVIdWIsICdNaXNzaW5nIGBpZnJhbWVIdWJgJyk7XG4gICAgdGhpcy5fZG9tYWluID0gZG9tYWluO1xuICAgIHRoaXMuX2lmcmFtZUh1YiA9IGlmcmFtZUh1YjtcbiAgICB0aGlzLl9zdG9yYWdlID0gbmV3IFN0b3JhZ2VDbGllbnRDbGFzcyhpZnJhbWVIdWIpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZXMga2V5IGJhc2VkIG9uIGRvbWFpblxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gVGhlIGtleSB0byB1c2VcbiAgICogQHJldHVybiB7U3RyaW5nfSBUaGUgbm9ybWFsaXplZCBrZXlcbiAgICpcbiAgICovXG4gIF9ub3JtYWxpemVLZXkoa2V5KSB7XG4gICAgcmV0dXJuIGAke3RoaXMuX2RvbWFpbn1fJHtrZXl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHZhbHVlIGZvciBhIGtleVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gVGhlIGtleSB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIC0gVGhlIHZhbHVlIHRvIHNldFxuICAgKlxuICAgKi9cbiAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5zZXQodGhpcy5fbm9ybWFsaXplS2V5KGtleSksIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHZhbHVlIGZvciBhIHN0b3JlZCBrZXlcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAtIFRoZSBrZXkgdG8gdXNlXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICpcbiAgICovXG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5nZXQodGhpcy5fbm9ybWFsaXplS2V5KGtleSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgb25lIG9yIG11bHRpcGxlIHZhbHVlIHBhaXIgaWYgdGhleSBleGlzdHNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGtleXMgLSBUaGUga2V5KHMpIHRvIHVzZVxuICAgKlxuICAgKi9cbiAgcmVtb3ZlKC4uLmtleXMpIHtcbiAgICBjb25zdCBub3JtYWxpemVkS2V5cyA9IGtleXMubWFwKGtleSA9PiB0aGlzLl9ub3JtYWxpemVLZXkoa2V5KSk7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3JhZ2UuZGVsKC4uLm5vcm1hbGl6ZWRLZXlzKTtcbiAgfVxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlO1xuIiwiLyoqXG4gKiBAbmFtZXNwYWNlIFV0aWxzXG4gKi9cbi8qKlxuICogR2VuZXJhdGVzIGEgcmFuZG9tIHN0cmluZ1xuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl4IC0gVGhlIHJhZGl4IHRvIHVzZS4gRGVmYXVsdHMgdG8gYDE4YFxuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDE4KS5zbGljZSgyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMuZ2VuZXJhdGVSYW5kb21TdHJpbmcgPSBnZW5lcmF0ZVJhbmRvbVN0cmluZztcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSByYW5kb20gVVVJRFxuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21VVUlEKCkge1xuICBjb25zdCBiYXNlID0gYCR7Z2VuZXJhdGVSYW5kb21TdHJpbmcoKX0ke2dlbmVyYXRlUmFuZG9tU3RyaW5nKCl9YDtcbiAgcmV0dXJuIGAke2Jhc2Uuc3Vic3RyaW5nKDAsIDgpfS0ke2Jhc2Uuc3Vic3RyaW5nKDksIDEzKX0tJHtiYXNlLnN1YnN0cmluZygxNCwgMTgpfS0ke2Jhc2Uuc3Vic3RyaW5nKDE5LCAyMyl9LSR7YmFzZS5zdWJzdHJpbmcoMjQsIDM2KX1gO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5nZW5lcmF0ZVJhbmRvbVVVSUQgPSBnZW5lcmF0ZVJhbmRvbVVVSUQ7XG5cbi8qKlxuICogU3RyaXBzIEJlYXJlciBmcm9tIEF1dGhvcml6YXRpb24gaGVhZGVyXG4gKlxuICogQG1lbWJlcm9mIFV0aWxzXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVyIC0gVGhlIEF1dGhvcml6YXRpb24gaGVhZGVyIHRvIHN0cmlwXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKlxuICovXG5mdW5jdGlvbiBzdHJpcEJlYXJlcihoZWFkZXIpIHtcbiAgcmV0dXJuIGAke2hlYWRlcn1gLnJlcGxhY2UoJ0JlYXJlcicsICcnKS50cmltKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzLnN0cmlwQmVhcmVyID0gc3RyaXBCZWFyZXI7XG5cbi8qKlxuICogUmV0dXJucyBlcnJvciBtZXNzYWdlIGZvciBgZXJyb3JDb2RlYFxuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHBhcmFtIHtTdHJpbmd9IGVycm9yQ29kZSAtIFRoZSBgZXJyb3JDb2RlYCB0byBtYXBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqXG4gKi9cblxuY29uc3QgZXh0cmFjdEVycm9yTWVzc2FnZSA9IChlcnJvckNvZGUpID0+IHtcbiAgc3dpdGNoIChlcnJvckNvZGUpIHtcbiAgICBjYXNlICd2YWxpZGF0aW9uX2ZhaWxlZCc6XG4gICAgICByZXR1cm4gJ1ZhbGlkYXRpb24gZmFpbGVkJztcbiAgICBjYXNlICdub3RfZm91bmQnOlxuICAgICAgcmV0dXJuICdOb3QgZm91bmQnO1xuICAgIGNhc2UgJ2ZvcmJpZGRlbl9yZXNvdXJjZSc6XG4gICAgICByZXR1cm4gJ0ZvcmJpZGRlbiByZXNvdXJjZSc7XG4gICAgY2FzZSAnYWNjZXNzX2RlbmllZCc6XG4gICAgICByZXR1cm4gJ1RoZSByZXNvdXJjZSBvd25lciBvciBhdXRob3JpemF0aW9uIHNlcnZlciBkZW5pZWQgdGhlIHJlcXVlc3QnO1xuICAgIGNhc2UgJ3Vuc3VwcG9ydGVkX2dyYW50X3R5cGUnOlxuICAgICAgcmV0dXJuICdUaGUgYXV0aG9yaXphdGlvbiBncmFudCB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQnO1xuICAgIGNhc2UgJ2ludmFsaWRfZ3JhbnQnOlxuICAgICAgcmV0dXJuICdJbnZhbGlkIGNyZWRlbnRpYWxzJztcbiAgICBjYXNlICd1bmF1dGhvcml6ZWRfcmVxdWVzdCc6XG4gICAgICByZXR1cm4gJ1VuYXV0aG9yaXplZCByZXF1ZXN0JztcbiAgICBjYXNlICd1bmF1dGhvcml6ZWRfY2xpZW50JzpcbiAgICAgIHJldHVybiAnVGhlIGF1dGhlbnRpY2F0ZWQgY2xpZW50IGlzIG5vdCBhdXRob3JpemVkJztcbiAgICBjYXNlICdpbnZhbGlkX3Rva2VuJzpcbiAgICAgIHJldHVybiAnVGhlIGFjY2VzcyB0b2tlbiBwcm92aWRlZCBpcyBleHBpcmVkLCByZXZva2VkLCBtYWxmb3JtZWQsIG9yIGludmFsaWQnO1xuICAgIGNhc2UgJ2ludmFsaWRfc2NvcGUnOlxuICAgICAgcmV0dXJuICdUaGUgcmVxdWVzdGVkIHNjb3BlIGlzIGludmFsaWQsIHVua25vd24sIG9yIG1hbGZvcm1lZCc7XG4gICAgY2FzZSAnaW52YWxpZF9jbGllbnQnOlxuICAgICAgcmV0dXJuICdDbGllbnQgYXV0aGVudGljYXRpb24gZmFpbGVkJztcbiAgICBjYXNlICdpbnZhbGlkX3JlcXVlc3QnOlxuICAgICAgcmV0dXJuICdUaGUgcmVxdWVzdCBpcyBtaXNzaW5nIGEgcmVxdWlyZWQgcGFyYW1ldGVyJztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICdVbmV4cGVjdGVkIGVycm9yJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZXh0cmFjdEVycm9yTWVzc2FnZSA9IGV4dHJhY3RFcnJvck1lc3NhZ2U7XG5cbi8qKlxuICogVmFsaWRhdGVzIGEgcGFzc3dvcmQgcGFpciBhZ2FpbnMgdGhlIGZvbGxvd2luZyBydWxlczpcbiAqIC0gUGFzc3dvcmQgY2Fubm90IGNvbnRhaW4gc3BhY2VzXG4gKiAtIFBhc3N3b3JkIG11c3QgY29udGFpbiBib3RoIG51bWJlcnMgYW5kIGNoYXJhY3RlcnNcbiAqIC0gUGFzc3dvcmQgbXVzdCBiZSBhdCBsZWFzdCA4IGNoYXJhY3RlcnMgbG9uZ1xuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIGBwYXNzd29yZGAgdG8gdmFsaWRhdGVcbiAqIEByZXR1cm4ge09iamVjdH0gQ29udGFpbnMgYGlzVmFsaWQge0Jvb2xlYW59YCBhbmQgYG1lc3NhZ2Uge1N0cmluZ31gXG4gKlxuICovXG5jb25zdCB2YWxpZGF0ZVBhc3N3b3JkID0gKHBhc3N3b3JkKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5zU3BhY2VzID0gL1xccy9pLnRlc3QocGFzc3dvcmQpO1xuICBjb25zdCBjb250YWluc051bWJlciA9IC9cXGQvaS50ZXN0KHBhc3N3b3JkKTtcbiAgY29uc3QgY29udGFpbnNDaGFyYWN0ZXJzID0gL1thLXpdL2kudGVzdChwYXNzd29yZCk7XG4gIGlmIChjb250YWluc1NwYWNlcykge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiAnUGFzc3dvcmQgY2Fubm90IGNvbnRhaW4gc3BhY2VzJyxcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgIH07XG4gIH1cbiAgaWYgKCFjb250YWluc051bWJlciB8fCAhY29udGFpbnNDaGFyYWN0ZXJzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6ICdQYXNzd29yZCBtdXN0IGNvbnRhaW4gYm90aCBudW1iZXJzIGFuZCBjaGFyYWN0ZXJzJyxcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgIH07XG4gIH1cbiAgaWYgKHBhc3N3b3JkLmxlbmd0aCA8IDgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogJ1Bhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgOCBjaGFyYWN0ZXJzIGxvbmcnLFxuICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgfTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGlzVmFsaWQ6IHRydWUsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cy52YWxpZGF0ZVBhc3N3b3JkID0gdmFsaWRhdGVQYXNzd29yZDtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblxuLyoqXG4gKiBXcmFwcGVyIGFyb3VuZCB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgpXG4gKlxuICogQG1lbWJlcm9mIFV0aWxzXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gVGhlIHVybCB0byByZWRpcmVjdCB0b1xuICogQHJldHVybiB7Vm9pZH1cbiAqXG4gKi9cbmNvbnN0IHJlZGlyZWN0VG9VUkwgPSAodXJsKSA9PiB7XG4gIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHVybCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5yZWRpcmVjdFRvVVJMID0gcmVkaXJlY3RUb1VSTDtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblxuLyoqXG4gKiBXcmFwcGVyIGFyb3VuZCB3aW5kb3cubG9jYXRpb24uaHJlZlxuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xuY29uc3QgcmV0cmlldmVVUkwgPSAoKSA9PiB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxubW9kdWxlLmV4cG9ydHMucmV0cmlldmVVUkwgPSByZXRyaWV2ZVVSTDtcbiJdfQ==
