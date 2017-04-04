(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var config = require("../config/default");
var Store = require("./services/store");
var User = require("./models/user");
var Client = require("./models/client");
var Session = require("./models/session");
var Authenticator = require("./models/authenticator");
var Redirector = require("./services/redirector");
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
    var redirector = new Redirector(store, user);
    return {
      user: user,
      session: session,
      authenticator: authenticator,
      redirector: redirector };
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9nZWUvRGVza3RvcC9kZXYvcmVwb3MvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM1QyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUMxQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDdEMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDMUMsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDNUMsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDeEQsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDcEQsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDaEQsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3ZELElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3ZELElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3pELElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7Ozs7OztBQU0vRCxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsZUFBZSxDQUFDOzs7OztBQUtqRSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Ozs7O0FBS2xDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7Ozs7QUFNeEIsSUFBTSxv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RUQsVUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzNGLGVBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7Ozs7Ozs7QUFTRCxTQUFLLEVBQUEsaUJBQUc7QUFDTixlQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDbkIsRUFFRixDQUFDO0NBQ0gsQ0FBQSxFQUFHLENBQUM7Ozs7QUFJTCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDakIsUUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztDQUMzRDs7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcvZGVmYXVsdCcpO1xuY29uc3QgU3RvcmUgPSByZXF1aXJlKCcuL3NlcnZpY2VzL3N0b3JlJyk7XG5jb25zdCBVc2VyID0gcmVxdWlyZSgnLi9tb2RlbHMvdXNlcicpO1xuY29uc3QgQ2xpZW50ID0gcmVxdWlyZSgnLi9tb2RlbHMvY2xpZW50Jyk7XG5jb25zdCBTZXNzaW9uID0gcmVxdWlyZSgnLi9tb2RlbHMvc2Vzc2lvbicpO1xuY29uc3QgQXV0aGVudGljYXRvciA9IHJlcXVpcmUoJy4vbW9kZWxzL2F1dGhlbnRpY2F0b3InKTtcbmNvbnN0IFJlZGlyZWN0b3IgPSByZXF1aXJlKCcuL3NlcnZpY2VzL3JlZGlyZWN0b3InKTtcbmNvbnN0IENvbnN1bWVyID0gcmVxdWlyZSgnLi9zZXJ2aWNlcy9jb25zdW1lcicpO1xuY29uc3QgQVBJID0gcmVxdWlyZSgnLi9hcGknKTtcbmNvbnN0IFNhbmRib3hEYXRhYmFzZSA9IHJlcXVpcmUoJy4vZGF0YWJhc2VzL3NhbmRib3gnKTtcbmNvbnN0IFVzZXJGaXh0dXJlcyA9IHJlcXVpcmUoJy4uL2ZpeHR1cmVzL3VzZXJzLmpzb24nKTtcbmNvbnN0IFRva2VuRml4dHVyZXMgPSByZXF1aXJlKCcuLi9maXh0dXJlcy90b2tlbnMuanNvbicpO1xuY29uc3QgUGFzc3dvcmRGaXh0dXJlcyA9IHJlcXVpcmUoJy4uL2ZpeHR1cmVzL3Bhc3N3b3Jkcy5qc29uJyk7XG5cbi8qKlxuICogQ3Jvc3NTdG9yYWdlSHViXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS96ZW5kZXNrL2Nyb3NzLXN0b3JhZ2VcbiAqL1xuY29uc3QgQ3Jvc3NTdG9yYWdlSHViID0gcmVxdWlyZSgnY3Jvc3Mtc3RvcmFnZScpLkNyb3NzU3RvcmFnZUh1YjtcblxuLyoqXG4gKiBHbG9iYWwgcG9seWZpbGwgZm9yIHtQcm9taXNlfVxuICovXG5yZXF1aXJlKCdlczYtcHJvbWlzZScpLnBvbHlmaWxsKCk7XG5cbi8qKlxuICogR2xvYmFsIHBvbHlmaWxsIGZvciB7ZmV0Y2h9XG4gKi9cbnJlcXVpcmUoJ3doYXR3Zy1mZXRjaCcpO1xuXG5cbi8qKlxuICogQG5hbWVzcGFjZSBBdXRoZW50aWNhdGlvbkNsaWVudFxuICovXG5jb25zdCBBdXRoZW50aWNhdGlvbkNsaWVudCA9IChmdW5jdGlvbiBpbW1lZGlhdGUoKSB7XG4gIC8qKlxuICAgKiBFbnZpcm9ubWVudCBFTlVNXG4gICAqXG4gICAqIEBlbnVtXG4gICAqIHJldHVybiB7T2JqZWN0fVxuICAgKlxuICAgKi9cbiAgY29uc3QgRU5WID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgUHJvZHVjdGlvbjogU3ltYm9sKCdQcm9kdWN0aW9uJyksXG4gICAgU2FuZGJveDogU3ltYm9sKCdTYW5kYm94JyksXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBDYWNoZWQgaW5zdGFuY2VzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge01hcH1cbiAgICpcbiAgICovXG4gIGNvbnN0IGluc3RhbmNlcyA9IG5ldyBNYXAoKTtcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBBUEkgaW5zdGFjZXMgZm9yIGFuIEVOViBzZXR1cFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdGhyb3dzIHtFcnJvcn1cbiAgICogQHBhcmFtIHtFTlZ9IGVudmlyb25tZW50IC0gVGhlIGVudmlyb25tZW50IHRvIHNldCAtIERlZmF1bHRzIHRvIGBQcm9kdWN0aW9uYFxuICAgKiBAcmV0dXJuIHtTYW5kYm94QVBJfFByb2R1Y3Rpb25BUEl9XG4gICAqXG4gICAqL1xuICBmdW5jdGlvbiBnZXRBUElGb3IoZW52aXJvbm1lbnQsIGhvc3QgPSBjb25maWcuYXBpLmhvc3QpIHtcbiAgICBpZiAoZW52aXJvbm1lbnQgPT09IEVOVi5Qcm9kdWN0aW9uKSB7XG4gICAgICByZXR1cm4gbmV3IEFQSS5Qcm9kdWN0aW9uKGhvc3QpO1xuICAgIH1cbiAgICBpZiAoZW52aXJvbm1lbnQgPT09IEVOVi5TYW5kYm94KSB7XG4gICAgICByZXR1cm4gbmV3IEFQSS5TYW5kYm94KG5ldyBTYW5kYm94RGF0YWJhc2UoVXNlckZpeHR1cmVzLCBUb2tlbkZpeHR1cmVzLCBQYXNzd29yZEZpeHR1cmVzKSk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBgZW52aXJvbm1lbnRgIHBhc3NlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhbiBBdXRoZW50aWNhdGlvbkNsaWVudCBpbnN0YW5jZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50SWQgLSBUaGUgY2xpZW50IGlkIHRvIHNldFxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50U2VjcmV0IC0gVGhlIGNsaWVudCBzZWNyZXRcbiAgICogQHBhcmFtIHtFTlZ9IGVudmlyb25tZW50IC0gVGhlIGVudmlyb25tZW50IHRvIHNldFxuICAgKiBAcGFyYW0ge1N0cmluZ30gbG9naW5Ib3N0IC0gVGhlIGxvZ2luIGhvc3QgVVJMXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhcGlIb3N0IC0gVGhlIEFQSSBob3N0XG4gICAqIEBwYXJhbSB7U3RvcmV9IHN0b3JlIC0gVGhlIFN0b3JlIGluc3RhbmNlXG4gICAqIEByZXR1cm4ge0F1dGhlbnRpY2F0b3J9XG4gICAqXG4gICAqL1xuICBmdW5jdGlvbiBnZW5lcmF0ZUluc3RhbmNlKGNsaWVudElkLCBjbGllbnRTZWNyZXQsIGVudmlyb25tZW50ID0gRU5WLlByb2R1Y3Rpb24sIGxvZ2luSG9zdCA9IGNvbmZpZy5sb2dpbi5ob3N0LCBhcGlIb3N0ID0gY29uZmlnLmFwaS5ob3N0LCBzdG9yZURvbWFpbiA9IGNvbmZpZy5zdG9yZS5kb21haW4pIHtcbiAgICBjb25zdCBzdG9yZSA9IG5ldyBTdG9yZShzdG9yZURvbWFpbiwgYCR7bG9naW5Ib3N0fS9odWJgKTtcbiAgICBjb25zdCBhcGkgPSBnZXRBUElGb3IoZW52aXJvbm1lbnQsIGFwaUhvc3QpO1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoY2xpZW50SWQsIGNsaWVudFNlY3JldCk7XG4gICAgY29uc3QgY29uc3VtZXIgPSBuZXcgQ29uc3VtZXIoY2xpZW50LCBhcGkpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgVXNlcihzdG9yZSwgY29uc3VtZXIpO1xuICAgIGNvbnN0IHNlc3Npb24gPSBuZXcgU2Vzc2lvbih1c2VyLCBsb2dpbkhvc3QpO1xuICAgIGNvbnN0IGF1dGhlbnRpY2F0b3IgPSBuZXcgQXV0aGVudGljYXRvcihjb25zdW1lcik7XG4gICAgY29uc3QgcmVkaXJlY3RvciA9IG5ldyBSZWRpcmVjdG9yKHN0b3JlLCB1c2VyKTtcbiAgICByZXR1cm4ge1xuICAgICAgdXNlcixcbiAgICAgIHNlc3Npb24sXG4gICAgICBhdXRoZW50aWNhdG9yLFxuICAgICAgcmVkaXJlY3RvcixcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIC8qKlxuICAgICAqIEVudmlyb25tZW50IGVudW1cbiAgICAgKlxuICAgICAqIEBlbnVtXG4gICAgICogQG1lbWJlcm9mIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gICAgICpcbiAgICAgKi9cbiAgICBFbnZpcm9ubWVudDogRU5WLFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgQ3Jvc3NTdG9yYWdlSHViXG4gICAgICpcbiAgICAgKiBAZW51bVxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqXG4gICAgICovXG4gICAgaW5pdFN0b3JhZ2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIENyb3NzU3RvcmFnZUh1Yi5pbml0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIEF1dGhlbnRpY2F0b3IgaW5zdGFuY2UgZm9yIGEgY2xpZW50SWQsIGNsaWVudFNlY3JldCBjb21iaW5hdGlvblxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uIGdldEluc3RhbmNlRm9yXG4gICAgICogQG1lbWJlcm9mIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuY2xpZW50SWQgLSBUaGUgQ2xpZW50IGlkXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5jbGllbnRTZWNyZXQgLSBUaGUgQ2xpZW50IHNlY3JldFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubG9naW5Ib3N0IC0gVGhlIGxvZ2luIGhvc3QgVVJMXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5hcGlIb3N0IC0gVGhlIEFQSSBob3N0XG4gICAgICogQHBhcmFtIHtTdG9yZX0gcGFyYW1zLnN0b3JlIC0gVGhlIFN0b3JlIGluc3RhbmNlXG4gICAgICogQHBhcmFtIHtFTlZ9IHBhcmFtcy5lbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXRcbiAgICAgKiBAcmV0dXJuIHtBdXRoZW50aWNhdG9yfVxuICAgICAqXG4gICAgICovXG4gICAgZ2V0SW5zdGFuY2VGb3IoeyBjbGllbnRJZCwgY2xpZW50U2VjcmV0LCBlbnZpcm9ubWVudCwgbG9naW5Ib3N0LCBhcGlIb3N0IH0pIHtcbiAgICAgIGNvbnN0IGtleSA9IGAke2NsaWVudElkfS0ke2NsaWVudFNlY3JldH1gO1xuICAgICAgLy8gUmV0dXJuIGNhY2hlZCBpbnN0YW5jZVxuICAgICAgaWYgKGluc3RhbmNlcy5oYXMoa2V5KSkge1xuICAgICAgICByZXR1cm4gaW5zdGFuY2VzLmdldChrZXkpO1xuICAgICAgfVxuICAgICAgLy8gR2VuZXJhdGUgJiBjYWNoZSBuZXcgaW5zdGFuY2VcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gZ2VuZXJhdGVJbnN0YW5jZShjbGllbnRJZCwgY2xpZW50U2VjcmV0LCBlbnZpcm9ubWVudCwgbG9naW5Ib3N0LCBhcGlIb3N0KTtcbiAgICAgIGluc3RhbmNlcy5zZXQoa2V5LCBpbnN0YW5jZSk7XG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZsdXNoZXMgY2FjaGVkIGluc3RhbmNlc1xuICAgICAqXG4gICAgICogQGZ1bmN0aW9uIHJlc2V0XG4gICAgICogQG1lbWJlcm9mIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gICAgICpcbiAgICAgKi9cbiAgICByZXNldCgpIHtcbiAgICAgIGluc3RhbmNlcy5jbGVhcigpO1xuICAgIH0sXG5cbiAgfTtcbn0pKCk7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cbmlmIChnbG9iYWwud2luZG93KSB7XG4gIGdsb2JhbC53aW5kb3cuQXV0aGVudGljYXRpb25DbGllbnQgPSBBdXRoZW50aWNhdGlvbkNsaWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoZW50aWNhdGlvbkNsaWVudDtcbiJdfQ==
},{"../config/default":2,"../fixtures/passwords.json":3,"../fixtures/tokens.json":4,"../fixtures/users.json":5,"./api":22,"./databases/sandbox":25,"./models/authenticator":26,"./models/client":27,"./models/session":28,"./models/user":29,"./services/consumer":30,"./services/redirector":32,"./services/store":33,"cross-storage":11,"es6-promise":12,"whatwg-fetch":21}],2:[function(require,module,exports){
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

},{"util/":20}],7:[function(require,module,exports){
/*!
 * Bowser - a browser detector
 * https://github.com/ded/bowser
 * MIT License | (c) Dustin Diaz 2015
 */

!function (root, name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(name, definition)
  else root[name] = definition()
}(this, 'bowser', function () {
  /**
    * See useragents.js for examples of navigator.userAgent
    */

  var t = true

  function detect(ua) {

    function getFirstMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[1]) || '';
    }

    function getSecondMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[2]) || '';
    }

    var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
      , likeAndroid = /like android/i.test(ua)
      , android = !likeAndroid && /android/i.test(ua)
      , nexusMobile = /nexus\s*[0-6]\s*/i.test(ua)
      , nexusTablet = !nexusMobile && /nexus\s*[0-9]+/i.test(ua)
      , chromeos = /CrOS/.test(ua)
      , silk = /silk/i.test(ua)
      , sailfish = /sailfish/i.test(ua)
      , tizen = /tizen/i.test(ua)
      , webos = /(web|hpw)os/i.test(ua)
      , windowsphone = /windows phone/i.test(ua)
      , samsungBrowser = /SamsungBrowser/i.test(ua)
      , windows = !windowsphone && /windows/i.test(ua)
      , mac = !iosdevice && !silk && /macintosh/i.test(ua)
      , linux = !android && !sailfish && !tizen && !webos && /linux/i.test(ua)
      , edgeVersion = getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
      , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
      , tablet = /tablet/i.test(ua)
      , mobile = !tablet && /[^-]mobi/i.test(ua)
      , xbox = /xbox/i.test(ua)
      , result

    if (/opera/i.test(ua)) {
      //  an old Opera
      result = {
        name: 'Opera'
      , opera: t
      , version: versionIdentifier || getFirstMatch(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
      }
    } else if (/opr|opios/i.test(ua)) {
      // a new Opera
      result = {
        name: 'Opera'
        , opera: t
        , version: getFirstMatch(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (/SamsungBrowser/i.test(ua)) {
      result = {
        name: 'Samsung Internet for Android'
        , samsungBrowser: t
        , version: versionIdentifier || getFirstMatch(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/coast/i.test(ua)) {
      result = {
        name: 'Opera Coast'
        , coast: t
        , version: versionIdentifier || getFirstMatch(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/yabrowser/i.test(ua)) {
      result = {
        name: 'Yandex Browser'
      , yandexbrowser: t
      , version: versionIdentifier || getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/ucbrowser/i.test(ua)) {
      result = {
          name: 'UC Browser'
        , ucbrowser: t
        , version: getFirstMatch(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/mxios/i.test(ua)) {
      result = {
        name: 'Maxthon'
        , maxthon: t
        , version: getFirstMatch(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/epiphany/i.test(ua)) {
      result = {
        name: 'Epiphany'
        , epiphany: t
        , version: getFirstMatch(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/puffin/i.test(ua)) {
      result = {
        name: 'Puffin'
        , puffin: t
        , version: getFirstMatch(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
      }
    }
    else if (/sleipnir/i.test(ua)) {
      result = {
        name: 'Sleipnir'
        , sleipnir: t
        , version: getFirstMatch(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/k-meleon/i.test(ua)) {
      result = {
        name: 'K-Meleon'
        , kMeleon: t
        , version: getFirstMatch(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (windowsphone) {
      result = {
        name: 'Windows Phone'
      , windowsphone: t
      }
      if (edgeVersion) {
        result.msedge = t
        result.version = edgeVersion
      }
      else {
        result.msie = t
        result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/msie|trident/i.test(ua)) {
      result = {
        name: 'Internet Explorer'
      , msie: t
      , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
      }
    } else if (chromeos) {
      result = {
        name: 'Chrome'
      , chromeos: t
      , chromeBook: t
      , chrome: t
      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    } else if (/chrome.+? edge/i.test(ua)) {
      result = {
        name: 'Microsoft Edge'
      , msedge: t
      , version: edgeVersion
      }
    }
    else if (/vivaldi/i.test(ua)) {
      result = {
        name: 'Vivaldi'
        , vivaldi: t
        , version: getFirstMatch(/vivaldi\/(\d+(\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (sailfish) {
      result = {
        name: 'Sailfish'
      , sailfish: t
      , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/seamonkey\//i.test(ua)) {
      result = {
        name: 'SeaMonkey'
      , seamonkey: t
      , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/firefox|iceweasel|fxios/i.test(ua)) {
      result = {
        name: 'Firefox'
      , firefox: t
      , version: getFirstMatch(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
      }
      if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
        result.firefoxos = t
      }
    }
    else if (silk) {
      result =  {
        name: 'Amazon Silk'
      , silk: t
      , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/phantom/i.test(ua)) {
      result = {
        name: 'PhantomJS'
      , phantom: t
      , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/slimerjs/i.test(ua)) {
      result = {
        name: 'SlimerJS'
        , slimer: t
        , version: getFirstMatch(/slimerjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
      result = {
        name: 'BlackBerry'
      , blackberry: t
      , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
      }
    }
    else if (webos) {
      result = {
        name: 'WebOS'
      , webos: t
      , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
      };
      /touchpad\//i.test(ua) && (result.touchpad = t)
    }
    else if (/bada/i.test(ua)) {
      result = {
        name: 'Bada'
      , bada: t
      , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
      };
    }
    else if (tizen) {
      result = {
        name: 'Tizen'
      , tizen: t
      , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (/qupzilla/i.test(ua)) {
      result = {
        name: 'QupZilla'
        , qupzilla: t
        , version: getFirstMatch(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || versionIdentifier
      }
    }
    else if (/chromium/i.test(ua)) {
      result = {
        name: 'Chromium'
        , chromium: t
        , version: getFirstMatch(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (/chrome|crios|crmo/i.test(ua)) {
      result = {
        name: 'Chrome'
        , chrome: t
        , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    }
    else if (android) {
      result = {
        name: 'Android'
        , version: versionIdentifier
      }
    }
    else if (/safari|applewebkit/i.test(ua)) {
      result = {
        name: 'Safari'
      , safari: t
      }
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if (iosdevice) {
      result = {
        name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
      }
      // WTF: version is not part of user agent in web apps
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if(/googlebot/i.test(ua)) {
      result = {
        name: 'Googlebot'
      , googlebot: t
      , version: getFirstMatch(/googlebot\/(\d+(\.\d+))/i) || versionIdentifier
      }
    }
    else {
      result = {
        name: getFirstMatch(/^(.*)\/(.*) /),
        version: getSecondMatch(/^(.*)\/(.*) /)
     };
   }

    // set webkit or gecko flag for browsers based on these engines
    if (!result.msedge && /(apple)?webkit/i.test(ua)) {
      if (/(apple)?webkit\/537\.36/i.test(ua)) {
        result.name = result.name || "Blink"
        result.blink = t
      } else {
        result.name = result.name || "Webkit"
        result.webkit = t
      }
      if (!result.version && versionIdentifier) {
        result.version = versionIdentifier
      }
    } else if (!result.opera && /gecko\//i.test(ua)) {
      result.name = result.name || "Gecko"
      result.gecko = t
      result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
    }

    // set OS flags for platforms that have multiple browsers
    if (!result.windowsphone && !result.msedge && (android || result.silk)) {
      result.android = t
    } else if (!result.windowsphone && !result.msedge && iosdevice) {
      result[iosdevice] = t
      result.ios = t
    } else if (mac) {
      result.mac = t
    } else if (xbox) {
      result.xbox = t
    } else if (windows) {
      result.windows = t
    } else if (linux) {
      result.linux = t
    }

    // OS version extraction
    var osVersion = '';
    if (result.windowsphone) {
      osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
    } else if (iosdevice) {
      osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (android) {
      osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
    } else if (result.webos) {
      osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
    } else if (result.blackberry) {
      osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
    } else if (result.bada) {
      osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
    } else if (result.tizen) {
      osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
    }
    if (osVersion) {
      result.osversion = osVersion;
    }

    // device type extraction
    var osMajorVersion = osVersion.split('.')[0];
    if (
         tablet
      || nexusTablet
      || iosdevice == 'ipad'
      || (android && (osMajorVersion == 3 || (osMajorVersion >= 4 && !mobile)))
      || result.silk
    ) {
      result.tablet = t
    } else if (
         mobile
      || iosdevice == 'iphone'
      || iosdevice == 'ipod'
      || android
      || nexusMobile
      || result.blackberry
      || result.webos
      || result.bada
    ) {
      result.mobile = t
    }

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if (result.msedge ||
        (result.msie && result.version >= 10) ||
        (result.yandexbrowser && result.version >= 15) ||
		    (result.vivaldi && result.version >= 1.0) ||
        (result.chrome && result.version >= 20) ||
        (result.samsungBrowser && result.version >= 4) ||
        (result.firefox && result.version >= 20.0) ||
        (result.safari && result.version >= 6) ||
        (result.opera && result.version >= 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] >= 6) ||
        (result.blackberry && result.version >= 10.1)
        || (result.chromium && result.version >= 20)
        ) {
      result.a = t;
    }
    else if ((result.msie && result.version < 10) ||
        (result.chrome && result.version < 20) ||
        (result.firefox && result.version < 20.0) ||
        (result.safari && result.version < 6) ||
        (result.opera && result.version < 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
        || (result.chromium && result.version < 20)
        ) {
      result.c = t
    } else result.x = t

    return result
  }

  var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent || '' : '')

  bowser.test = function (browserList) {
    for (var i = 0; i < browserList.length; ++i) {
      var browserItem = browserList[i];
      if (typeof browserItem=== 'string') {
        if (browserItem in bowser) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get version precisions count
   *
   * @example
   *   getVersionPrecision("1.10.3") // 3
   *
   * @param  {string} version
   * @return {number}
   */
  function getVersionPrecision(version) {
    return version.split(".").length;
  }

  /**
   * Array::map polyfill
   *
   * @param  {Array} arr
   * @param  {Function} iterator
   * @return {Array}
   */
  function map(arr, iterator) {
    var result = [], i;
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, iterator);
    }
    for (i = 0; i < arr.length; i++) {
      result.push(iterator(arr[i]));
    }
    return result;
  }

  /**
   * Calculate browser version weight
   *
   * @example
   *   compareVersions(['1.10.2.1',  '1.8.2.1.90'])    // 1
   *   compareVersions(['1.010.2.1', '1.09.2.1.90']);  // 1
   *   compareVersions(['1.10.2.1',  '1.10.2.1']);     // 0
   *   compareVersions(['1.10.2.1',  '1.0800.2']);     // -1
   *
   * @param  {Array<String>} versions versions to compare
   * @return {Number} comparison result
   */
  function compareVersions(versions) {
    // 1) get common precision for both versions, for example for "10.0" and "9" it should be 2
    var precision = Math.max(getVersionPrecision(versions[0]), getVersionPrecision(versions[1]));
    var chunks = map(versions, function (version) {
      var delta = precision - getVersionPrecision(version);

      // 2) "9" -> "9.0" (for precision = 2)
      version = version + new Array(delta + 1).join(".0");

      // 3) "9.0" -> ["000000000"", "000000009"]
      return map(version.split("."), function (chunk) {
        return new Array(20 - chunk.length).join("0") + chunk;
      }).reverse();
    });

    // iterate in reverse order by reversed chunks array
    while (--precision >= 0) {
      // 4) compare: "000000009" > "000000010" = false (but "9" > "10" = true)
      if (chunks[0][precision] > chunks[1][precision]) {
        return 1;
      }
      else if (chunks[0][precision] === chunks[1][precision]) {
        if (precision === 0) {
          // all version chunks are same
          return 0;
        }
      }
      else {
        return -1;
      }
    }
  }

  /**
   * Check if browser is unsupported
   *
   * @example
   *   bowser.isUnsupportedBrowser({
   *     msie: "10",
   *     firefox: "23",
   *     chrome: "29",
   *     safari: "5.1",
   *     opera: "16",
   *     phantom: "534"
   *   });
   *
   * @param  {Object}  minVersions map of minimal version to browser
   * @param  {Boolean} [strictMode = false] flag to return false if browser wasn't found in map
   * @param  {String}  [ua] user agent string
   * @return {Boolean}
   */
  function isUnsupportedBrowser(minVersions, strictMode, ua) {
    var _bowser = bowser;

    // make strictMode param optional with ua param usage
    if (typeof strictMode === 'string') {
      ua = strictMode;
      strictMode = void(0);
    }

    if (strictMode === void(0)) {
      strictMode = false;
    }
    if (ua) {
      _bowser = detect(ua);
    }

    var version = "" + _bowser.version;
    for (var browser in minVersions) {
      if (minVersions.hasOwnProperty(browser)) {
        if (_bowser[browser]) {
          if (typeof minVersions[browser] !== 'string') {
            throw new Error('Browser version in the minVersion map should be a string: ' + browser + ': ' + String(minVersions));
          }

          // browser version and min supported version.
          return compareVersions([version, minVersions[browser]]) < 0;
        }
      }
    }

    return strictMode; // not found
  }

  /**
   * Check if browser is supported
   *
   * @param  {Object} minVersions map of minimal version to browser
   * @param  {Boolean} [strictMode = false] flag to return false if browser wasn't found in map
   * @param  {String}  [ua] user agent string
   * @return {Boolean}
   */
  function check(minVersions, strictMode, ua) {
    return !isUnsupportedBrowser(minVersions, strictMode, ua);
  }

  bowser.isUnsupportedBrowser = isUnsupportedBrowser;
  bowser.compareVersions = compareVersions;
  bowser.check = check;

  /*
   * Set our detect method to the main bowser object so we can
   * reuse it to test other user agents.
   * This is needed to implement future tests.
   */
  bowser._detect = detect;

  return bowser
});

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
module.exports = {
  CrossStorageClient: require('./client.js'),
  CrossStorageHub:    require('./hub.js')
};

},{"./client.js":9,"./hub.js":10}],12:[function(require,module,exports){
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
},{"_process":8}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
'use strict';

var stringify = require('./stringify');
var parse = require('./parse');
var formats = require('./formats');

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};

},{"./formats":13,"./parse":15,"./stringify":16}],15:[function(require,module,exports){
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

},{"./utils":17}],16:[function(require,module,exports){
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

},{"./formats":13,"./utils":17}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],20:[function(require,module,exports){
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
},{"./support/isBuffer":19,"_process":8,"inherits":18}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
"use strict";

module.exports.Production = require("./production");
module.exports.Sandbox = require("./sandbox");

},{"./production":23,"./sandbox":24}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"../utils":34,"qs":14}],25:[function(require,module,exports){
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

},{"../utils":34}],26:[function(require,module,exports){
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

},{"../services/consumer":30,"../utils":34,"assert":6}],27:[function(require,module,exports){
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

},{"assert":6}],28:[function(require,module,exports){
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

},{"../models/user":29,"../utils":34,"assert":6}],29:[function(require,module,exports){
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
       * Syncs User data from Store
       * - Currently on bearer is synced to Store
       * - Store priority proceeds dirty data
       *
       * @return {Promise}
       *
       */

      value: function syncWithStore() {
        var _this = this;

        var bearer = undefined;
        return this._store.retriveToken().then(function (accessToken) {
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

},{"../services/consumer":30,"../services/store":33,"../utils":34,"assert":6}],30:[function(require,module,exports){
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
            var error = new Error(extractErrorMessage(body));
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

},{"../api":22,"../models/client":27,"../utils":34,"assert":6,"qs":14}],31:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assert = require("assert");
var CrossStorageClient = require("cross-storage").CrossStorageClient;

/**
 * Wrapper around `CrossStorageClient`
 *
 * @class HubStorageClient
 * @see https://github.com/zendesk/cross-storage
 *
 */

var HubStorageClient = (function () {

  /**
   * Initializes HubStorageClient
   *
   * @constructor
   * @param {String} domain - The domain under which all values will be attached
   * @param {Class} CrossStorageClientClass - The CrossStorageClient class to be instantiated (Defaults to CrossStorageClient)
   * @return {HubStorageClient}
   *
   */

  function HubStorageClient(iframeHub) {
    var CrossStorageClientClass = arguments[1] === undefined ? CrossStorageClient : arguments[1];

    _classCallCheck(this, HubStorageClient);

    assert(iframeHub, "Missing `iframeHub`");
    this._iframeHub = iframeHub;
    this._CrossStorageClientClass = CrossStorageClientClass;
    this._instance = undefined;
  }

  _createClass(HubStorageClient, {
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

  return HubStorageClient;
})();

module.exports = HubStorageClient;

},{"assert":6,"cross-storage":11}],32:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assert = require("assert");
var User = require("../models/user");
var Store = require("./store");
var redirectToURL = require("../utils").redirectToURL;
var extractLoginTokenFromURL = require("../utils").extractLoginTokenFromURL;
var retrieveURL = require("../utils").retrieveURL;

/**
 * @class Redirector
 */

var Redirector = (function () {

  /**
   * Initializes Redirector
   *
   * @constructor
   * @param {Store} store - The Store instance to use
   * @param {Function} redirectFn - The redirect function to use. Defaults to `Utils.redirectToURL`
   * @return {Redirector}
   *
   */

  function Redirector(store, user) {
    var redirectFn = arguments[2] === undefined ? redirectToURL : arguments[2];
    var retrieveURLFn = arguments[3] === undefined ? retrieveURL : arguments[3];

    _classCallCheck(this, Redirector);

    assert(store instanceof Store, "`store` should be instance of Store");
    assert(user instanceof User, "`store` should be instance of Store");
    this._store = store;
    this._user = user;
    this._redirectFn = redirectFn;
    this._retrieveURLFn = retrieveURLFn;
  }

  _createClass(Redirector, {
    authenticatedRedirect: {

      /**
         * Redirects to  for a password reset
         *  - Adds loginToken param to query if browser does not support cross storage support
         *
         * @param {String} targetUrl - The URL to redirect to
         * @param {String} loginToken - The login token to use (optional)
         *
         */

      value: function authenticatedRedirect(targetUrl, loginToken) {
        if (this._store.supportsCrossStorage()) {
          return this._redirectFn(targetUrl);
        }
        var postfix = ~targetUrl.indexOf("?") ? "&" : "?";
        var token = loginToken || extractLoginTokenFromURL(this._retrieveURLFn()) || this._user.bearer;
        return this._redirectFn("" + targetUrl + "" + postfix + "loginToken=" + token);
      }
    }
  });

  return Redirector;
})();

module.exports = Redirector;

},{"../models/user":29,"../utils":34,"./store":33,"assert":6}],33:[function(require,module,exports){
"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assert = require("assert");
var HubStorageClient = require("./hub-storage-client");
var retrieveBrowserName = require("../utils").retrieveBrowserName;
var extractLoginTokenFromURL = require("../utils").extractLoginTokenFromURL;
var retrieveURL = require("../utils").retrieveURL;

/**
 * Determines if browser supports cross storage
 * @ignore
 */
var supportsCrossStorage = retrieveBrowserName() !== "Safari";

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
   * @param {Boolean} isCrossStorageAvailable - Flaf that determines if cross storage canb be used or not
   * @param {Function} retrieveURLFn - The function that returns the current URL
   * @return {Store}
   *
   */

  function Store(domain, iframeHub) {
    var HubStorageClientClass = arguments[2] === undefined ? HubStorageClient : arguments[2];
    var isCrossStorageAvailable = arguments[3] === undefined ? supportsCrossStorage : arguments[3];
    var retrieveURLFn = arguments[4] === undefined ? retrieveURL : arguments[4];

    _classCallCheck(this, Store);

    assert(domain, "Missing `domain`");
    assert(iframeHub, "Missing `iframeHub`");
    this._domain = domain;
    this._iframeHub = iframeHub;
    this._hubStorage = new HubStorageClientClass(iframeHub);
    this._isCrossStorageAvailable = isCrossStorageAvailable;
    this._retrieveURLFn = retrieveURLFn;
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
    supportsCrossStorage: {

      /**
       * Detrmines if Store supports cross storage
       *
       * @return {Boolean} value
       *
       */

      value: function supportsCrossStorage() {
        return this._isCrossStorageAvailable;
      }
    },
    retriveToken: {

      /**
       * Retieves token
       *
       * @return {Promise}
       *
       */

      value: function retriveToken() {
        if (this._isCrossStorageAvailable) {
          return this.get("access_token");
        }
        return Promise.resolve(extractLoginTokenFromURL(this._retrieveURLFn()));
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
        return this._hubStorage.set(this._normalizeKey(key), value);
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
        return this._hubStorage.get(this._normalizeKey(key));
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

        var _hubStorage;

        for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
          keys[_key] = arguments[_key];
        }

        var normalizedKeys = keys.map(function (key) {
          return _this._normalizeKey(key);
        });
        return (_hubStorage = this._hubStorage).del.apply(_hubStorage, _toConsumableArray(normalizedKeys));
      }
    }
  });

  return Store;
})();

module.exports = Store;

},{"../utils":34,"./hub-storage-client":31,"assert":6}],34:[function(require,module,exports){
"use strict";

var bowser = require("bowser");

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
 * @param {String} body - The `body` response to parse
 * @param {String} body.error - The error code to use for mapping
 * @param {String} body.error_description - The optional error description to show
 * @return {String}
 *
 */

var extractErrorMessage = function (body) {
  switch (body.error) {
    case "validation_failed":
      return "Validation failed: " + body.error_description;
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

/**
 * Extracts loginToken from URL
 *
 * @memberof Utils
 * @return {String} url - The URL to
 *
 */
var extractLoginTokenFromURL = function (url) {
  try {
    var params = decodeURIComponent(url).split("?")[1].split("&");
    return params.find(function (param) {
      return String(param).includes("loginToken");
    }).replace("loginToken=", "");
  } catch (err) {
    return "";
  }
};

module.exports.extractLoginTokenFromURL = extractLoginTokenFromURL;

/**
 * Returns browser name
 *
 * @memberof Utils
 * @return {String} name - The browser name
 *
 */
var retrieveBrowserName = function () {
  var lookupMap = arguments[0] === undefined ? bowser : arguments[0];
  return lookupMap.name;
};

module.exports.retrieveBrowserName = retrieveBrowserName;

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

},{"bowser":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCIvVXNlcnMvZ2VlL0Rlc2t0b3AvZGV2L3JlcG9zL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9jb25maWcvZGVmYXVsdC5qcyIsImZpeHR1cmVzL3Bhc3N3b3Jkcy5qc29uIiwiZml4dHVyZXMvdG9rZW5zLmpzb24iLCJmaXh0dXJlcy91c2Vycy5qc29uIiwibm9kZV9tb2R1bGVzL2Fzc2VydC9hc3NlcnQuanMiLCJub2RlX21vZHVsZXMvYm93c2VyL3NyYy9ib3dzZXIuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nyb3NzLXN0b3JhZ2UvbGliL2NsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9jcm9zcy1zdG9yYWdlL2xpYi9odWIuanMiLCJub2RlX21vZHVsZXMvY3Jvc3Mtc3RvcmFnZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9lczYtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9xcy9saWIvZm9ybWF0cy5qcyIsIm5vZGVfbW9kdWxlcy9xcy9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcXMvbGliL3BhcnNlLmpzIiwibm9kZV9tb2R1bGVzL3FzL2xpYi9zdHJpbmdpZnkuanMiLCJub2RlX21vZHVsZXMvcXMvbGliL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCJub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzIiwiL1VzZXJzL2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL2FwaS9pbmRleC5qcyIsIi9Vc2Vycy9nZWUvRGVza3RvcC9kZXYvcmVwb3MvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9hcGkvcHJvZHVjdGlvbi5qcyIsIi9Vc2Vycy9nZWUvRGVza3RvcC9kZXYvcmVwb3MvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9hcGkvc2FuZGJveC5qcyIsIi9Vc2Vycy9nZWUvRGVza3RvcC9kZXYvcmVwb3MvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9kYXRhYmFzZXMvc2FuZGJveC5qcyIsIi9Vc2Vycy9nZWUvRGVza3RvcC9kZXYvcmVwb3MvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9tb2RlbHMvYXV0aGVudGljYXRvci5qcyIsIi9Vc2Vycy9nZWUvRGVza3RvcC9kZXYvcmVwb3MvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9tb2RlbHMvY2xpZW50LmpzIiwiL1VzZXJzL2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL21vZGVscy9zZXNzaW9uLmpzIiwiL1VzZXJzL2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL21vZGVscy91c2VyLmpzIiwiL1VzZXJzL2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL3NlcnZpY2VzL2NvbnN1bWVyLmpzIiwiL1VzZXJzL2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL3NlcnZpY2VzL2h1Yi1zdG9yYWdlLWNsaWVudC5qcyIsIi9Vc2Vycy9nZWUvRGVza3RvcC9kZXYvcmVwb3MvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9zZXJ2aWNlcy9yZWRpcmVjdG9yLmpzIiwiL1VzZXJzL2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL3NlcnZpY2VzL3N0b3JlLmpzIiwiL1VzZXJzL2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL3V0aWxzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNUxBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixLQUFHLEVBQUU7QUFDSCxRQUFJLEVBQUUsc0JBQXNCLEVBQzdCO0FBQ0QsT0FBSyxFQUFFO0FBQ0wsUUFBSSxFQUFFLHVCQUF1QixFQUM5QjtBQUNELE9BQUssRUFBRTtBQUNMLFVBQU0sRUFBRSxXQUFXLEVBQ3BCLEVBQ0YsQ0FBQzs7O0FDVkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3a0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFjQSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxD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QyxJQUFJO0NBQUEsQUFBQyxDQUFDOztBQUVyRSxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDOzs7Ozs7Ozs7Ozs7QUFZekQsSUFBTSxhQUFhLEdBQUcsVUFBQyxHQUFHLEVBQUs7QUFDN0IsUUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDOUIsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7Ozs7Ozs7Ozs7O0FBVzdDLElBQU0sV0FBVyxHQUFHO1NBQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJO0NBQUEsQ0FBQzs7QUFFL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZy9kZWZhdWx0XCIpO1xudmFyIFN0b3JlID0gcmVxdWlyZShcIi4vc2VydmljZXMvc3RvcmVcIik7XG52YXIgVXNlciA9IHJlcXVpcmUoXCIuL21vZGVscy91c2VyXCIpO1xudmFyIENsaWVudCA9IHJlcXVpcmUoXCIuL21vZGVscy9jbGllbnRcIik7XG52YXIgU2Vzc2lvbiA9IHJlcXVpcmUoXCIuL21vZGVscy9zZXNzaW9uXCIpO1xudmFyIEF1dGhlbnRpY2F0b3IgPSByZXF1aXJlKFwiLi9tb2RlbHMvYXV0aGVudGljYXRvclwiKTtcbnZhciBSZWRpcmVjdG9yID0gcmVxdWlyZShcIi4vc2VydmljZXMvcmVkaXJlY3RvclwiKTtcbnZhciBDb25zdW1lciA9IHJlcXVpcmUoXCIuL3NlcnZpY2VzL2NvbnN1bWVyXCIpO1xudmFyIEFQSSA9IHJlcXVpcmUoXCIuL2FwaVwiKTtcbnZhciBTYW5kYm94RGF0YWJhc2UgPSByZXF1aXJlKFwiLi9kYXRhYmFzZXMvc2FuZGJveFwiKTtcbnZhciBVc2VyRml4dHVyZXMgPSByZXF1aXJlKFwiLi4vZml4dHVyZXMvdXNlcnMuanNvblwiKTtcbnZhciBUb2tlbkZpeHR1cmVzID0gcmVxdWlyZShcIi4uL2ZpeHR1cmVzL3Rva2Vucy5qc29uXCIpO1xudmFyIFBhc3N3b3JkRml4dHVyZXMgPSByZXF1aXJlKFwiLi4vZml4dHVyZXMvcGFzc3dvcmRzLmpzb25cIik7XG5cbi8qKlxuICogQ3Jvc3NTdG9yYWdlSHViXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS96ZW5kZXNrL2Nyb3NzLXN0b3JhZ2VcbiAqL1xudmFyIENyb3NzU3RvcmFnZUh1YiA9IHJlcXVpcmUoXCJjcm9zcy1zdG9yYWdlXCIpLkNyb3NzU3RvcmFnZUh1YjtcblxuLyoqXG4gKiBHbG9iYWwgcG9seWZpbGwgZm9yIHtQcm9taXNlfVxuICovXG5yZXF1aXJlKFwiZXM2LXByb21pc2VcIikucG9seWZpbGwoKTtcblxuLyoqXG4gKiBHbG9iYWwgcG9seWZpbGwgZm9yIHtmZXRjaH1cbiAqL1xucmVxdWlyZShcIndoYXR3Zy1mZXRjaFwiKTtcblxuLyoqXG4gKiBAbmFtZXNwYWNlIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gKi9cbnZhciBBdXRoZW50aWNhdGlvbkNsaWVudCA9IChmdW5jdGlvbiBpbW1lZGlhdGUoKSB7XG4gIC8qKlxuICAgKiBFbnZpcm9ubWVudCBFTlVNXG4gICAqXG4gICAqIEBlbnVtXG4gICAqIHJldHVybiB7T2JqZWN0fVxuICAgKlxuICAgKi9cbiAgdmFyIEVOViA9IE9iamVjdC5mcmVlemUoe1xuICAgIFByb2R1Y3Rpb246IFN5bWJvbChcIlByb2R1Y3Rpb25cIiksXG4gICAgU2FuZGJveDogU3ltYm9sKFwiU2FuZGJveFwiKSB9KTtcblxuICAvKipcbiAgICogQ2FjaGVkIGluc3RhbmNlc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtNYXB9XG4gICAqXG4gICAqL1xuICB2YXIgaW5zdGFuY2VzID0gbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIEFQSSBpbnN0YWNlcyBmb3IgYW4gRU5WIHNldHVwXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0aHJvd3Mge0Vycm9yfVxuICAgKiBAcGFyYW0ge0VOVn0gZW52aXJvbm1lbnQgLSBUaGUgZW52aXJvbm1lbnQgdG8gc2V0IC0gRGVmYXVsdHMgdG8gYFByb2R1Y3Rpb25gXG4gICAqIEByZXR1cm4ge1NhbmRib3hBUEl8UHJvZHVjdGlvbkFQSX1cbiAgICpcbiAgICovXG4gIGZ1bmN0aW9uIGdldEFQSUZvcihlbnZpcm9ubWVudCkge1xuICAgIHZhciBob3N0ID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBjb25maWcuYXBpLmhvc3QgOiBhcmd1bWVudHNbMV07XG5cbiAgICBpZiAoZW52aXJvbm1lbnQgPT09IEVOVi5Qcm9kdWN0aW9uKSB7XG4gICAgICByZXR1cm4gbmV3IEFQSS5Qcm9kdWN0aW9uKGhvc3QpO1xuICAgIH1cbiAgICBpZiAoZW52aXJvbm1lbnQgPT09IEVOVi5TYW5kYm94KSB7XG4gICAgICByZXR1cm4gbmV3IEFQSS5TYW5kYm94KG5ldyBTYW5kYm94RGF0YWJhc2UoVXNlckZpeHR1cmVzLCBUb2tlbkZpeHR1cmVzLCBQYXNzd29yZEZpeHR1cmVzKSk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYGVudmlyb25tZW50YCBwYXNzZWRcIik7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGFuIEF1dGhlbnRpY2F0aW9uQ2xpZW50IGluc3RhbmNlXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRJZCAtIFRoZSBjbGllbnQgaWQgdG8gc2V0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRTZWNyZXQgLSBUaGUgY2xpZW50IHNlY3JldFxuICAgKiBAcGFyYW0ge0VOVn0gZW52aXJvbm1lbnQgLSBUaGUgZW52aXJvbm1lbnQgdG8gc2V0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsb2dpbkhvc3QgLSBUaGUgbG9naW4gaG9zdCBVUkxcbiAgICogQHBhcmFtIHtTdHJpbmd9IGFwaUhvc3QgLSBUaGUgQVBJIGhvc3RcbiAgICogQHBhcmFtIHtTdG9yZX0gc3RvcmUgLSBUaGUgU3RvcmUgaW5zdGFuY2VcbiAgICogQHJldHVybiB7QXV0aGVudGljYXRvcn1cbiAgICpcbiAgICovXG4gIGZ1bmN0aW9uIGdlbmVyYXRlSW5zdGFuY2UoY2xpZW50SWQsIGNsaWVudFNlY3JldCkge1xuICAgIHZhciBlbnZpcm9ubWVudCA9IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gRU5WLlByb2R1Y3Rpb24gOiBhcmd1bWVudHNbMl07XG4gICAgdmFyIGxvZ2luSG9zdCA9IGFyZ3VtZW50c1szXSA9PT0gdW5kZWZpbmVkID8gY29uZmlnLmxvZ2luLmhvc3QgOiBhcmd1bWVudHNbM107XG4gICAgdmFyIGFwaUhvc3QgPSBhcmd1bWVudHNbNF0gPT09IHVuZGVmaW5lZCA/IGNvbmZpZy5hcGkuaG9zdCA6IGFyZ3VtZW50c1s0XTtcbiAgICB2YXIgc3RvcmVEb21haW4gPSBhcmd1bWVudHNbNV0gPT09IHVuZGVmaW5lZCA/IGNvbmZpZy5zdG9yZS5kb21haW4gOiBhcmd1bWVudHNbNV07XG5cbiAgICB2YXIgc3RvcmUgPSBuZXcgU3RvcmUoc3RvcmVEb21haW4sIFwiXCIgKyBsb2dpbkhvc3QgKyBcIi9odWJcIik7XG4gICAgdmFyIGFwaSA9IGdldEFQSUZvcihlbnZpcm9ubWVudCwgYXBpSG9zdCk7XG4gICAgdmFyIGNsaWVudCA9IG5ldyBDbGllbnQoY2xpZW50SWQsIGNsaWVudFNlY3JldCk7XG4gICAgdmFyIGNvbnN1bWVyID0gbmV3IENvbnN1bWVyKGNsaWVudCwgYXBpKTtcbiAgICB2YXIgdXNlciA9IG5ldyBVc2VyKHN0b3JlLCBjb25zdW1lcik7XG4gICAgdmFyIHNlc3Npb24gPSBuZXcgU2Vzc2lvbih1c2VyLCBsb2dpbkhvc3QpO1xuICAgIHZhciBhdXRoZW50aWNhdG9yID0gbmV3IEF1dGhlbnRpY2F0b3IoY29uc3VtZXIpO1xuICAgIHZhciByZWRpcmVjdG9yID0gbmV3IFJlZGlyZWN0b3Ioc3RvcmUsIHVzZXIpO1xuICAgIHJldHVybiB7XG4gICAgICB1c2VyOiB1c2VyLFxuICAgICAgc2Vzc2lvbjogc2Vzc2lvbixcbiAgICAgIGF1dGhlbnRpY2F0b3I6IGF1dGhlbnRpY2F0b3IsXG4gICAgICByZWRpcmVjdG9yOiByZWRpcmVjdG9yIH07XG4gIH1cblxuICByZXR1cm4ge1xuXG4gICAgLyoqXG4gICAgICogRW52aXJvbm1lbnQgZW51bVxuICAgICAqXG4gICAgICogQGVudW1cbiAgICAgKiBAbWVtYmVyb2YgQXV0aGVudGljYXRpb25DbGllbnRcbiAgICAgKlxuICAgICAqL1xuICAgIEVudmlyb25tZW50OiBFTlYsXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBDcm9zc1N0b3JhZ2VIdWJcbiAgICAgKlxuICAgICAqIEBlbnVtXG4gICAgICogQG1lbWJlcm9mIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gICAgICpcbiAgICAgKi9cbiAgICBpbml0U3RvcmFnZTogZnVuY3Rpb24gaW5pdFN0b3JhZ2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIENyb3NzU3RvcmFnZUh1Yi5pbml0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIEF1dGhlbnRpY2F0b3IgaW5zdGFuY2UgZm9yIGEgY2xpZW50SWQsIGNsaWVudFNlY3JldCBjb21iaW5hdGlvblxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uIGdldEluc3RhbmNlRm9yXG4gICAgICogQG1lbWJlcm9mIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuY2xpZW50SWQgLSBUaGUgQ2xpZW50IGlkXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5jbGllbnRTZWNyZXQgLSBUaGUgQ2xpZW50IHNlY3JldFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubG9naW5Ib3N0IC0gVGhlIGxvZ2luIGhvc3QgVVJMXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5hcGlIb3N0IC0gVGhlIEFQSSBob3N0XG4gICAgICogQHBhcmFtIHtTdG9yZX0gcGFyYW1zLnN0b3JlIC0gVGhlIFN0b3JlIGluc3RhbmNlXG4gICAgICogQHBhcmFtIHtFTlZ9IHBhcmFtcy5lbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXRcbiAgICAgKiBAcmV0dXJuIHtBdXRoZW50aWNhdG9yfVxuICAgICAqXG4gICAgICovXG4gICAgZ2V0SW5zdGFuY2VGb3I6IGZ1bmN0aW9uIGdldEluc3RhbmNlRm9yKF9yZWYpIHtcbiAgICAgIHZhciBjbGllbnRJZCA9IF9yZWYuY2xpZW50SWQ7XG4gICAgICB2YXIgY2xpZW50U2VjcmV0ID0gX3JlZi5jbGllbnRTZWNyZXQ7XG4gICAgICB2YXIgZW52aXJvbm1lbnQgPSBfcmVmLmVudmlyb25tZW50O1xuICAgICAgdmFyIGxvZ2luSG9zdCA9IF9yZWYubG9naW5Ib3N0O1xuICAgICAgdmFyIGFwaUhvc3QgPSBfcmVmLmFwaUhvc3Q7XG5cbiAgICAgIHZhciBrZXkgPSBcIlwiICsgY2xpZW50SWQgKyBcIi1cIiArIGNsaWVudFNlY3JldDtcbiAgICAgIC8vIFJldHVybiBjYWNoZWQgaW5zdGFuY2VcbiAgICAgIGlmIChpbnN0YW5jZXMuaGFzKGtleSkpIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlcy5nZXQoa2V5KTtcbiAgICAgIH1cbiAgICAgIC8vIEdlbmVyYXRlICYgY2FjaGUgbmV3IGluc3RhbmNlXG4gICAgICB2YXIgaW5zdGFuY2UgPSBnZW5lcmF0ZUluc3RhbmNlKGNsaWVudElkLCBjbGllbnRTZWNyZXQsIGVudmlyb25tZW50LCBsb2dpbkhvc3QsIGFwaUhvc3QpO1xuICAgICAgaW5zdGFuY2VzLnNldChrZXksIGluc3RhbmNlKTtcbiAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmx1c2hlcyBjYWNoZWQgaW5zdGFuY2VzXG4gICAgICpcbiAgICAgKiBAZnVuY3Rpb24gcmVzZXRcbiAgICAgKiBAbWVtYmVyb2YgQXV0aGVudGljYXRpb25DbGllbnRcbiAgICAgKlxuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgIGluc3RhbmNlcy5jbGVhcigpO1xuICAgIH0gfTtcbn0pKCk7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cbmlmIChnbG9iYWwud2luZG93KSB7XG4gIGdsb2JhbC53aW5kb3cuQXV0aGVudGljYXRpb25DbGllbnQgPSBBdXRoZW50aWNhdGlvbkNsaWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoZW50aWNhdGlvbkNsaWVudDtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5aV1V2UkdWemEzUnZjQzlrWlhZdmNtVndiM012WVhWMGFHVnVkR2xqWVhScGIyNHRZMnhwWlc1MEwzTnlZeTlwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3UVVGQlFTeEpRVUZOTEUxQlFVMHNSMEZCUnl4UFFVRlBMRU5CUVVNc2JVSkJRVzFDTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhKUVVGTkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNhMEpCUVd0Q0xFTkJRVU1zUTBGQlF6dEJRVU14UXl4SlFVRk5MRWxCUVVrc1IwRkJSeXhQUVVGUExFTkJRVU1zWlVGQlpTeERRVUZETEVOQlFVTTdRVUZEZEVNc1NVRkJUU3hOUVVGTkxFZEJRVWNzVDBGQlR5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03UVVGRE1VTXNTVUZCVFN4UFFVRlBMRWRCUVVjc1QwRkJUeXhEUVVGRExHdENRVUZyUWl4RFFVRkRMRU5CUVVNN1FVRkROVU1zU1VGQlRTeGhRVUZoTEVkQlFVY3NUMEZCVHl4RFFVRkRMSGRDUVVGM1FpeERRVUZETEVOQlFVTTdRVUZEZUVRc1NVRkJUU3hWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEhWQ1FVRjFRaXhEUVVGRExFTkJRVU03UVVGRGNFUXNTVUZCVFN4UlFVRlJMRWRCUVVjc1QwRkJUeXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRU5CUVVNN1FVRkRhRVFzU1VGQlRTeEhRVUZITEVkQlFVY3NUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRemRDTEVsQlFVMHNaVUZCWlN4SFFVRkhMRTlCUVU4c1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RFFVRkRPMEZCUTNaRUxFbEJRVTBzV1VGQldTeEhRVUZITEU5QlFVOHNRMEZCUXl4M1FrRkJkMElzUTBGQlF5eERRVUZETzBGQlEzWkVMRWxCUVUwc1lVRkJZU3hIUVVGSExFOUJRVThzUTBGQlF5eDVRa0ZCZVVJc1EwRkJReXhEUVVGRE8wRkJRM3BFTEVsQlFVMHNaMEpCUVdkQ0xFZEJRVWNzVDBGQlR5eERRVUZETERSQ1FVRTBRaXhEUVVGRExFTkJRVU03T3pzN096dEJRVTB2UkN4SlFVRk5MR1ZCUVdVc1IwRkJSeXhQUVVGUExFTkJRVU1zWlVGQlpTeERRVUZETEVOQlFVTXNaVUZCWlN4RFFVRkRPenM3T3p0QlFVdHFSU3hQUVVGUExFTkJRVU1zWVVGQllTeERRVUZETEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVNN096czdPMEZCUzJ4RExFOUJRVThzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXpzN096czdRVUZOZUVJc1NVRkJUU3h2UWtGQmIwSXNSMEZCUnl4RFFVRkRMRk5CUVZNc1UwRkJVeXhIUVVGSE96czdPenM3T3p0QlFWRnFSQ3hOUVVGTkxFZEJRVWNzUjBGQlJ5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUTNoQ0xHTkJRVlVzUlVGQlJTeE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRPMEZCUTJoRExGZEJRVThzUlVGQlJTeE5RVUZOTEVOQlFVTXNVMEZCVXl4RFFVRkRMRVZCUXpOQ0xFTkJRVU1zUTBGQlF6czdPenM3T3pzN08wRkJVMGdzVFVGQlRTeFRRVUZUTEVkQlFVY3NTVUZCU1N4SFFVRkhMRVZCUVVVc1EwRkJRenM3T3pzN096czdPenM3UVVGWE5VSXNWMEZCVXl4VFFVRlRMRU5CUVVNc1YwRkJWeXhGUVVFd1FqdFJRVUY0UWl4SlFVRkpMR2REUVVGSExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1RzN1FVRkRjRVFzVVVGQlNTeFhRVUZYTEV0QlFVc3NSMEZCUnl4RFFVRkRMRlZCUVZVc1JVRkJSVHRCUVVOc1F5eGhRVUZQTEVsQlFVa3NSMEZCUnl4RFFVRkRMRlZCUVZVc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dExRVU5xUXp0QlFVTkVMRkZCUVVrc1YwRkJWeXhMUVVGTExFZEJRVWNzUTBGQlF5eFBRVUZQTEVWQlFVVTdRVUZETDBJc1lVRkJUeXhKUVVGSkxFZEJRVWNzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4bFFVRmxMRU5CUVVNc1dVRkJXU3hGUVVGRkxHRkJRV0VzUlVGQlJTeG5Ra0ZCWjBJc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRE5VWTdRVUZEUkN4VlFVRk5MRWxCUVVrc1MwRkJTeXhEUVVGRExEaENRVUU0UWl4RFFVRkRMRU5CUVVNN1IwRkRha1E3T3pzN096czdPenM3T3pzN096dEJRV1ZFTEZkQlFWTXNaMEpCUVdkQ0xFTkJRVU1zVVVGQlVTeEZRVUZGTEZsQlFWa3NSVUZCTmtnN1VVRkJNMGdzVjBGQlZ5eG5RMEZCUnl4SFFVRkhMRU5CUVVNc1ZVRkJWVHRSUVVGRkxGTkJRVk1zWjBOQlFVY3NUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSk8xRkJRVVVzVDBGQlR5eG5RMEZCUnl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFbEJRVWs3VVVGQlJTeFhRVUZYTEdkRFFVRkhMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRUczdRVUZEZWtzc1VVRkJUU3hMUVVGTExFZEJRVWNzU1VGQlNTeExRVUZMTEVOQlFVTXNWMEZCVnl4UFFVRkxMRk5CUVZNc1ZVRkJUeXhEUVVGRE8wRkJRM3BFTEZGQlFVMHNSMEZCUnl4SFFVRkhMRk5CUVZNc1EwRkJReXhYUVVGWExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdRVUZETlVNc1VVRkJUU3hOUVVGTkxFZEJRVWNzU1VGQlNTeE5RVUZOTEVOQlFVTXNVVUZCVVN4RlFVRkZMRmxCUVZrc1EwRkJReXhEUVVGRE8wRkJRMnhFTEZGQlFVMHNVVUZCVVN4SFFVRkhMRWxCUVVrc1VVRkJVU3hEUVVGRExFMUJRVTBzUlVGQlJTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTXpReXhSUVVGTkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03UVVGRGRrTXNVVUZCVFN4UFFVRlBMRWRCUVVjc1NVRkJTU3hQUVVGUExFTkJRVU1zU1VGQlNTeEZRVUZGTEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUXpkRExGRkJRVTBzWVVGQllTeEhRVUZITEVsQlFVa3NZVUZCWVN4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRMnhFTEZGQlFVMHNWVUZCVlN4SFFVRkhMRWxCUVVrc1ZVRkJWU3hEUVVGRExFdEJRVXNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTXZReXhYUVVGUE8wRkJRMHdzVlVGQlNTeEZRVUZLTEVsQlFVazdRVUZEU2l4aFFVRlBMRVZCUVZBc1QwRkJUenRCUVVOUUxHMUNRVUZoTEVWQlFXSXNZVUZCWVR0QlFVTmlMR2RDUVVGVkxFVkJRVllzVlVGQlZTeEZRVU5ZTEVOQlFVTTdSMEZEU0RzN1FVRkZSQ3hUUVVGUE96czdPenM3T3pzN1FVRlRUQ3hsUVVGWExFVkJRVVVzUjBGQlJ6czdPenM3T3pzN08wRkJVMmhDTEdWQlFWY3NSVUZCUVN4eFFrRkJReXhQUVVGUExFVkJRVVU3UVVGRGJrSXNZVUZCVHl4bFFVRmxMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzB0QlEzUkRPenM3T3pzN096czdPenM3T3pzN096dEJRV2xDUkN4clFrRkJZeXhGUVVGQkxEaENRVUU0UkR0VlFVRXpSQ3hSUVVGUkxGRkJRVklzVVVGQlVUdFZRVUZGTEZsQlFWa3NVVUZCV2l4WlFVRlpPMVZCUVVVc1YwRkJWeXhSUVVGWUxGZEJRVmM3VlVGQlJTeFRRVUZUTEZGQlFWUXNVMEZCVXp0VlFVRkZMRTlCUVU4c1VVRkJVQ3hQUVVGUE96dEJRVU4wUlN4VlFVRk5MRWRCUVVjc1VVRkJUU3hSUVVGUkxGTkJRVWtzV1VGQldTeEJRVUZGTEVOQlFVTTdPMEZCUlRGRExGVkJRVWtzVTBGQlV5eERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVOMFFpeGxRVUZQTEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03VDBGRE0wSTdPMEZCUlVRc1ZVRkJUU3hSUVVGUkxFZEJRVWNzWjBKQlFXZENMRU5CUVVNc1VVRkJVU3hGUVVGRkxGbEJRVmtzUlVGQlJTeFhRVUZYTEVWQlFVVXNVMEZCVXl4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRek5HTEdWQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzBGQlF6ZENMR0ZCUVU4c1VVRkJVU3hEUVVGRE8wdEJRMnBDT3pzN096czdPenM3UVVGVFJDeFRRVUZMTEVWQlFVRXNhVUpCUVVjN1FVRkRUaXhsUVVGVExFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTTdTMEZEYmtJc1JVRkZSaXhEUVVGRE8wTkJRMGdzUTBGQlFTeEZRVUZITEVOQlFVTTdPenM3UVVGSlRDeEpRVUZKTEUxQlFVMHNRMEZCUXl4TlFVRk5MRVZCUVVVN1FVRkRha0lzVVVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4dlFrRkJiMElzUjBGQlJ5eHZRa0ZCYjBJc1EwRkJRenREUVVNelJEczdRVUZGUkN4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExHOUNRVUZ2UWl4RFFVRkRJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKamIyNXpkQ0JqYjI1bWFXY2dQU0J5WlhGMWFYSmxLQ2N1TGk5amIyNW1hV2N2WkdWbVlYVnNkQ2NwTzF4dVkyOXVjM1FnVTNSdmNtVWdQU0J5WlhGMWFYSmxLQ2N1TDNObGNuWnBZMlZ6TDNOMGIzSmxKeWs3WEc1amIyNXpkQ0JWYzJWeUlEMGdjbVZ4ZFdseVpTZ25MaTl0YjJSbGJITXZkWE5sY2ljcE8xeHVZMjl1YzNRZ1EyeHBaVzUwSUQwZ2NtVnhkV2x5WlNnbkxpOXRiMlJsYkhNdlkyeHBaVzUwSnlrN1hHNWpiMjV6ZENCVFpYTnphVzl1SUQwZ2NtVnhkV2x5WlNnbkxpOXRiMlJsYkhNdmMyVnpjMmx2YmljcE8xeHVZMjl1YzNRZ1FYVjBhR1Z1ZEdsallYUnZjaUE5SUhKbGNYVnBjbVVvSnk0dmJXOWtaV3h6TDJGMWRHaGxiblJwWTJGMGIzSW5LVHRjYm1OdmJuTjBJRkpsWkdseVpXTjBiM0lnUFNCeVpYRjFhWEpsS0NjdUwzTmxjblpwWTJWekwzSmxaR2x5WldOMGIzSW5LVHRjYm1OdmJuTjBJRU52Ym5OMWJXVnlJRDBnY21WeGRXbHlaU2duTGk5elpYSjJhV05sY3k5amIyNXpkVzFsY2ljcE8xeHVZMjl1YzNRZ1FWQkpJRDBnY21WeGRXbHlaU2duTGk5aGNHa25LVHRjYm1OdmJuTjBJRk5oYm1SaWIzaEVZWFJoWW1GelpTQTlJSEpsY1hWcGNtVW9KeTR2WkdGMFlXSmhjMlZ6TDNOaGJtUmliM2duS1R0Y2JtTnZibk4wSUZWelpYSkdhWGgwZFhKbGN5QTlJSEpsY1hWcGNtVW9KeTR1TDJacGVIUjFjbVZ6TDNWelpYSnpMbXB6YjI0bktUdGNibU52Ym5OMElGUnZhMlZ1Um1sNGRIVnlaWE1nUFNCeVpYRjFhWEpsS0NjdUxpOW1hWGgwZFhKbGN5OTBiMnRsYm5NdWFuTnZiaWNwTzF4dVkyOXVjM1FnVUdGemMzZHZjbVJHYVhoMGRYSmxjeUE5SUhKbGNYVnBjbVVvSnk0dUwyWnBlSFIxY21WekwzQmhjM04zYjNKa2N5NXFjMjl1SnlrN1hHNWNiaThxS2x4dUlDb2dRM0p2YzNOVGRHOXlZV2RsU0hWaVhHNGdLaUJBYzJWbElHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOTZaVzVrWlhOckwyTnliM056TFhOMGIzSmhaMlZjYmlBcUwxeHVZMjl1YzNRZ1EzSnZjM05UZEc5eVlXZGxTSFZpSUQwZ2NtVnhkV2x5WlNnblkzSnZjM010YzNSdmNtRm5aU2NwTGtOeWIzTnpVM1J2Y21GblpVaDFZanRjYmx4dUx5b3FYRzRnS2lCSGJHOWlZV3dnY0c5c2VXWnBiR3dnWm05eUlIdFFjbTl0YVhObGZWeHVJQ292WEc1eVpYRjFhWEpsS0NkbGN6WXRjSEp2YldselpTY3BMbkJ2YkhsbWFXeHNLQ2s3WEc1Y2JpOHFLbHh1SUNvZ1IyeHZZbUZzSUhCdmJIbG1hV3hzSUdadmNpQjdabVYwWTJoOVhHNGdLaTljYm5KbGNYVnBjbVVvSjNkb1lYUjNaeTFtWlhSamFDY3BPMXh1WEc1Y2JpOHFLbHh1SUNvZ1FHNWhiV1Z6Y0dGalpTQkJkWFJvWlc1MGFXTmhkR2x2YmtOc2FXVnVkRnh1SUNvdlhHNWpiMjV6ZENCQmRYUm9aVzUwYVdOaGRHbHZia05zYVdWdWRDQTlJQ2htZFc1amRHbHZiaUJwYlcxbFpHbGhkR1VvS1NCN1hHNGdJQzhxS2x4dUlDQWdLaUJGYm5acGNtOXViV1Z1ZENCRlRsVk5YRzRnSUNBcVhHNGdJQ0FxSUVCbGJuVnRYRzRnSUNBcUlISmxkSFZ5YmlCN1QySnFaV04wZlZ4dUlDQWdLbHh1SUNBZ0tpOWNiaUFnWTI5dWMzUWdSVTVXSUQwZ1QySnFaV04wTG1aeVpXVjZaU2g3WEc0Z0lDQWdVSEp2WkhWamRHbHZiam9nVTNsdFltOXNLQ2RRY205a2RXTjBhVzl1Snlrc1hHNGdJQ0FnVTJGdVpHSnZlRG9nVTNsdFltOXNLQ2RUWVc1a1ltOTRKeWtzWEc0Z0lIMHBPMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRZV05vWldRZ2FXNXpkR0Z1WTJWelhHNGdJQ0FxWEc0Z0lDQXFJRUJ3Y21sMllYUmxYRzRnSUNBcUlFQnlaWFIxY200Z2UwMWhjSDFjYmlBZ0lDcGNiaUFnSUNvdlhHNGdJR052Ym5OMElHbHVjM1JoYm1ObGN5QTlJRzVsZHlCTllYQW9LVHRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVbVYwZFhKdWN5QmhiaUJCVUVrZ2FXNXpkR0ZqWlhNZ1ptOXlJR0Z1SUVWT1ZpQnpaWFIxY0Z4dUlDQWdLbHh1SUNBZ0tpQkFjSEpwZG1GMFpWeHVJQ0FnS2lCQWRHaHliM2R6SUh0RmNuSnZjbjFjYmlBZ0lDb2dRSEJoY21GdElIdEZUbFo5SUdWdWRtbHliMjV0Wlc1MElDMGdWR2hsSUdWdWRtbHliMjV0Wlc1MElIUnZJSE5sZENBdElFUmxabUYxYkhSeklIUnZJR0JRY205a2RXTjBhVzl1WUZ4dUlDQWdLaUJBY21WMGRYSnVJSHRUWVc1a1ltOTRRVkJKZkZCeWIyUjFZM1JwYjI1QlVFbDlYRzRnSUNBcVhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQm5aWFJCVUVsR2IzSW9aVzUyYVhKdmJtMWxiblFzSUdodmMzUWdQU0JqYjI1bWFXY3VZWEJwTG1odmMzUXBJSHRjYmlBZ0lDQnBaaUFvWlc1MmFYSnZibTFsYm5RZ1BUMDlJRVZPVmk1UWNtOWtkV04wYVc5dUtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2JtVjNJRUZRU1M1UWNtOWtkV04wYVc5dUtHaHZjM1FwTzF4dUlDQWdJSDFjYmlBZ0lDQnBaaUFvWlc1MmFYSnZibTFsYm5RZ1BUMDlJRVZPVmk1VFlXNWtZbTk0S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYm1WM0lFRlFTUzVUWVc1a1ltOTRLRzVsZHlCVFlXNWtZbTk0UkdGMFlXSmhjMlVvVlhObGNrWnBlSFIxY21WekxDQlViMnRsYmtacGVIUjFjbVZ6TENCUVlYTnpkMjl5WkVacGVIUjFjbVZ6S1NrN1hHNGdJQ0FnZlZ4dUlDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpZ25TVzUyWVd4cFpDQmdaVzUyYVhKdmJtMWxiblJnSUhCaGMzTmxaQ2NwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFZGxibVZ5WVhSbGN5QmhiaUJCZFhSb1pXNTBhV05oZEdsdmJrTnNhV1Z1ZENCcGJuTjBZVzVqWlZ4dUlDQWdLbHh1SUNBZ0tpQkFjSEpwZG1GMFpWeHVJQ0FnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnWTJ4cFpXNTBTV1FnTFNCVWFHVWdZMnhwWlc1MElHbGtJSFJ2SUhObGRGeHVJQ0FnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnWTJ4cFpXNTBVMlZqY21WMElDMGdWR2hsSUdOc2FXVnVkQ0J6WldOeVpYUmNiaUFnSUNvZ1FIQmhjbUZ0SUh0RlRsWjlJR1Z1ZG1seWIyNXRaVzUwSUMwZ1ZHaGxJR1Z1ZG1seWIyNXRaVzUwSUhSdklITmxkRnh1SUNBZ0tpQkFjR0Z5WVcwZ2UxTjBjbWx1WjMwZ2JHOW5hVzVJYjNOMElDMGdWR2hsSUd4dloybHVJR2h2YzNRZ1ZWSk1YRzRnSUNBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNCaGNHbEliM04wSUMwZ1ZHaGxJRUZRU1NCb2IzTjBYRzRnSUNBcUlFQndZWEpoYlNCN1UzUnZjbVY5SUhOMGIzSmxJQzBnVkdobElGTjBiM0psSUdsdWMzUmhibU5sWEc0Z0lDQXFJRUJ5WlhSMWNtNGdlMEYxZEdobGJuUnBZMkYwYjNKOVhHNGdJQ0FxWEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCblpXNWxjbUYwWlVsdWMzUmhibU5sS0dOc2FXVnVkRWxrTENCamJHbGxiblJUWldOeVpYUXNJR1Z1ZG1seWIyNXRaVzUwSUQwZ1JVNVdMbEJ5YjJSMVkzUnBiMjRzSUd4dloybHVTRzl6ZENBOUlHTnZibVpwWnk1c2IyZHBiaTVvYjNOMExDQmhjR2xJYjNOMElEMGdZMjl1Wm1sbkxtRndhUzVvYjNOMExDQnpkRzl5WlVSdmJXRnBiaUE5SUdOdmJtWnBaeTV6ZEc5eVpTNWtiMjFoYVc0cElIdGNiaUFnSUNCamIyNXpkQ0J6ZEc5eVpTQTlJRzVsZHlCVGRHOXlaU2h6ZEc5eVpVUnZiV0ZwYml3Z1lDUjdiRzluYVc1SWIzTjBmUzlvZFdKZ0tUdGNiaUFnSUNCamIyNXpkQ0JoY0drZ1BTQm5aWFJCVUVsR2IzSW9aVzUyYVhKdmJtMWxiblFzSUdGd2FVaHZjM1FwTzF4dUlDQWdJR052Ym5OMElHTnNhV1Z1ZENBOUlHNWxkeUJEYkdsbGJuUW9ZMnhwWlc1MFNXUXNJR05zYVdWdWRGTmxZM0psZENrN1hHNGdJQ0FnWTI5dWMzUWdZMjl1YzNWdFpYSWdQU0J1WlhjZ1EyOXVjM1Z0WlhJb1kyeHBaVzUwTENCaGNHa3BPMXh1SUNBZ0lHTnZibk4wSUhWelpYSWdQU0J1WlhjZ1ZYTmxjaWh6ZEc5eVpTd2dZMjl1YzNWdFpYSXBPMXh1SUNBZ0lHTnZibk4wSUhObGMzTnBiMjRnUFNCdVpYY2dVMlZ6YzJsdmJpaDFjMlZ5TENCc2IyZHBia2h2YzNRcE8xeHVJQ0FnSUdOdmJuTjBJR0YxZEdobGJuUnBZMkYwYjNJZ1BTQnVaWGNnUVhWMGFHVnVkR2xqWVhSdmNpaGpiMjV6ZFcxbGNpazdYRzRnSUNBZ1kyOXVjM1FnY21Wa2FYSmxZM1J2Y2lBOUlHNWxkeUJTWldScGNtVmpkRzl5S0hOMGIzSmxMQ0IxYzJWeUtUdGNiaUFnSUNCeVpYUjFjbTRnZTF4dUlDQWdJQ0FnZFhObGNpeGNiaUFnSUNBZ0lITmxjM05wYjI0c1hHNGdJQ0FnSUNCaGRYUm9aVzUwYVdOaGRHOXlMRnh1SUNBZ0lDQWdjbVZrYVhKbFkzUnZjaXhjYmlBZ0lDQjlPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUVWdWRtbHliMjV0Wlc1MElHVnVkVzFjYmlBZ0lDQWdLbHh1SUNBZ0lDQXFJRUJsYm5WdFhHNGdJQ0FnSUNvZ1FHMWxiV0psY205bUlFRjFkR2hsYm5ScFkyRjBhVzl1UTJ4cFpXNTBYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpOWNiaUFnSUNCRmJuWnBjbTl1YldWdWREb2dSVTVXTEZ4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1NXNXBkR2xoYkdsNlpYTWdRM0p2YzNOVGRHOXlZV2RsU0hWaVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQVpXNTFiVnh1SUNBZ0lDQXFJRUJ0WlcxaVpYSnZaaUJCZFhSb1pXNTBhV05oZEdsdmJrTnNhV1Z1ZEZ4dUlDQWdJQ0FxWEc0Z0lDQWdJQ292WEc0Z0lDQWdhVzVwZEZOMGIzSmhaMlVvYjNCMGFXOXVjeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRU55YjNOelUzUnZjbUZuWlVoMVlpNXBibWwwS0c5d2RHbHZibk1wTzF4dUlDQWdJSDBzWEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCRGNtVmhkR1Z6SUdGdUlFRjFkR2hsYm5ScFkyRjBiM0lnYVc1emRHRnVZMlVnWm05eUlHRWdZMnhwWlc1MFNXUXNJR05zYVdWdWRGTmxZM0psZENCamIyMWlhVzVoZEdsdmJseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FHWjFibU4wYVc5dUlHZGxkRWx1YzNSaGJtTmxSbTl5WEc0Z0lDQWdJQ29nUUcxbGJXSmxjbTltSUVGMWRHaGxiblJwWTJGMGFXOXVRMnhwWlc1MFhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0UFltcGxZM1I5SUhCaGNtRnRjMXh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdVM1J5YVc1bmZTQndZWEpoYlhNdVkyeHBaVzUwU1dRZ0xTQlVhR1VnUTJ4cFpXNTBJR2xrWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRUZEhKcGJtZDlJSEJoY21GdGN5NWpiR2xsYm5SVFpXTnlaWFFnTFNCVWFHVWdRMnhwWlc1MElITmxZM0psZEZ4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3VTNSeWFXNW5mU0J3WVhKaGJYTXViRzluYVc1SWIzTjBJQzBnVkdobElHeHZaMmx1SUdodmMzUWdWVkpNWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRUZEhKcGJtZDlJSEJoY21GdGN5NWhjR2xJYjNOMElDMGdWR2hsSUVGUVNTQm9iM04wWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRUZEc5eVpYMGdjR0Z5WVcxekxuTjBiM0psSUMwZ1ZHaGxJRk4wYjNKbElHbHVjM1JoYm1ObFhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0RlRsWjlJSEJoY21GdGN5NWxiblpwY205dWJXVnVkQ0F0SUZSb1pTQmxiblpwY205dWJXVnVkQ0IwYnlCelpYUmNiaUFnSUNBZ0tpQkFjbVYwZFhKdUlIdEJkWFJvWlc1MGFXTmhkRzl5ZlZ4dUlDQWdJQ0FxWEc0Z0lDQWdJQ292WEc0Z0lDQWdaMlYwU1c1emRHRnVZMlZHYjNJb2V5QmpiR2xsYm5SSlpDd2dZMnhwWlc1MFUyVmpjbVYwTENCbGJuWnBjbTl1YldWdWRDd2diRzluYVc1SWIzTjBMQ0JoY0dsSWIzTjBJSDBwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR3RsZVNBOUlHQWtlMk5zYVdWdWRFbGtmUzBrZTJOc2FXVnVkRk5sWTNKbGRIMWdPMXh1SUNBZ0lDQWdMeThnVW1WMGRYSnVJR05oWTJobFpDQnBibk4wWVc1alpWeHVJQ0FnSUNBZ2FXWWdLR2x1YzNSaGJtTmxjeTVvWVhNb2EyVjVLU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYVc1emRHRnVZMlZ6TG1kbGRDaHJaWGtwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnTHk4Z1IyVnVaWEpoZEdVZ0ppQmpZV05vWlNCdVpYY2dhVzV6ZEdGdVkyVmNiaUFnSUNBZ0lHTnZibk4wSUdsdWMzUmhibU5sSUQwZ1oyVnVaWEpoZEdWSmJuTjBZVzVqWlNoamJHbGxiblJKWkN3Z1kyeHBaVzUwVTJWamNtVjBMQ0JsYm5acGNtOXViV1Z1ZEN3Z2JHOW5hVzVJYjNOMExDQmhjR2xJYjNOMEtUdGNiaUFnSUNBZ0lHbHVjM1JoYm1ObGN5NXpaWFFvYTJWNUxDQnBibk4wWVc1alpTazdYRzRnSUNBZ0lDQnlaWFIxY200Z2FXNXpkR0Z1WTJVN1hHNGdJQ0FnZlN4Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFWnNkWE5vWlhNZ1kyRmphR1ZrSUdsdWMzUmhibU5sYzF4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUdaMWJtTjBhVzl1SUhKbGMyVjBYRzRnSUNBZ0lDb2dRRzFsYldKbGNtOW1JRUYxZEdobGJuUnBZMkYwYVc5dVEyeHBaVzUwWEc0Z0lDQWdJQ3BjYmlBZ0lDQWdLaTljYmlBZ0lDQnlaWE5sZENncElIdGNiaUFnSUNBZ0lHbHVjM1JoYm1ObGN5NWpiR1ZoY2lncE8xeHVJQ0FnSUgwc1hHNWNiaUFnZlR0Y2JuMHBLQ2s3WEc1Y2JpOHFJR2x6ZEdGdVluVnNJR2xuYm05eVpTQnVaWGgwSUNvdlhHNWNibWxtSUNobmJHOWlZV3d1ZDJsdVpHOTNLU0I3WEc0Z0lHZHNiMkpoYkM1M2FXNWtiM2N1UVhWMGFHVnVkR2xqWVhScGIyNURiR2xsYm5RZ1BTQkJkWFJvWlc1MGFXTmhkR2x2YmtOc2FXVnVkRHRjYm4xY2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQkJkWFJvWlc1MGFXTmhkR2x2YmtOc2FXVnVkRHRjYmlKZGZRPT0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBpOiB7XG4gICAgaG9zdDogJy8vYXV0aC5hdm9jYXJyb3QuY29tJyxcbiAgfSxcbiAgbG9naW46IHtcbiAgICBob3N0OiAnLy9sb2dpbi5hdm9jYXJyb3QuY29tJyxcbiAgfSxcbiAgc3RvcmU6IHtcbiAgICBkb21haW46ICdhdm9jYXJyb3QnLFxuICB9LFxufTtcbiIsIm1vZHVsZS5leHBvcnRzPVtcbiAge1xuICAgIFwidXNlcl9pZFwiOiBcIjQ0ZDJjOGUwLTc2MmItNGZhNS04NTcxLTA5N2M4MWMzMTMwZFwiLFxuICAgIFwidG9rZW5cIjogXCJ5SmhiR2NpZU9pSklVekkxTmlJc0lKOW5SNWNDSTZJa3BYVkNcIlxuICB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHtcbiAgICBcInVzZXJfaWRcIjogXCI0NGQyYzhlMC03NjJiLTRmYTUtODU3MS0wOTdjODFjMzEzMGRcIixcbiAgICBcInJlZnJlc2hfdG9rZW5cIjogXCJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjlcIixcbiAgICBcImFjY2Vzc190b2tlblwiOiBcInJrZGtKSFZCZENqTElJanNJSzROYWxhdXhQUDh1bzVoWTh0VE43XCJcbiAgfVxuXVxuIiwibW9kdWxlLmV4cG9ydHM9W1xuICB7XG4gICAgXCJpZFwiOiBcIjQ0ZDJjOGUwLTc2MmItNGZhNS04NTcxLTA5N2M4MWMzMTMwZFwiLFxuICAgIFwicHVibGlzaGVyX2lkXCI6IFwiNTVmNWM4ZTAtNzYyYi00ZmE1LTg1NzEtMTk3YzgxODMxMzBhXCIsXG4gICAgXCJmaXJzdF9uYW1lXCI6IFwiSm9oblwiLFxuICAgIFwibGFzdF9uYW1lXCI6IFwiRG9lXCIsXG4gICAgXCJlbWFpbFwiOiBcImpvaG4uZG9lQG1haWwuY29tXCIsXG4gICAgXCJwYXNzd29yZFwiOiBcInF3ZXJ0eTEyM1wiXG4gIH1cbl1cbiIsIi8vIGh0dHA6Ly93aWtpLmNvbW1vbmpzLm9yZy93aWtpL1VuaXRfVGVzdGluZy8xLjBcbi8vXG4vLyBUSElTIElTIE5PVCBURVNURUQgTk9SIExJS0VMWSBUTyBXT1JLIE9VVFNJREUgVjghXG4vL1xuLy8gT3JpZ2luYWxseSBmcm9tIG5hcndoYWwuanMgKGh0dHA6Ly9uYXJ3aGFsanMub3JnKVxuLy8gQ29weXJpZ2h0IChjKSAyMDA5IFRob21hcyBSb2JpbnNvbiA8Mjgwbm9ydGguY29tPlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0b1xuLy8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGVcbi8vIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vclxuLy8gc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbi8vIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyB3aGVuIHVzZWQgaW4gbm9kZSwgdGhpcyB3aWxsIGFjdHVhbGx5IGxvYWQgdGhlIHV0aWwgbW9kdWxlIHdlIGRlcGVuZCBvblxuLy8gdmVyc3VzIGxvYWRpbmcgdGhlIGJ1aWx0aW4gdXRpbCBtb2R1bGUgYXMgaGFwcGVucyBvdGhlcndpc2Vcbi8vIHRoaXMgaXMgYSBidWcgaW4gbm9kZSBtb2R1bGUgbG9hZGluZyBhcyBmYXIgYXMgSSBhbSBjb25jZXJuZWRcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbC8nKTtcblxudmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vLyAxLiBUaGUgYXNzZXJ0IG1vZHVsZSBwcm92aWRlcyBmdW5jdGlvbnMgdGhhdCB0aHJvd1xuLy8gQXNzZXJ0aW9uRXJyb3IncyB3aGVuIHBhcnRpY3VsYXIgY29uZGl0aW9ucyBhcmUgbm90IG1ldC4gVGhlXG4vLyBhc3NlcnQgbW9kdWxlIG11c3QgY29uZm9ybSB0byB0aGUgZm9sbG93aW5nIGludGVyZmFjZS5cblxudmFyIGFzc2VydCA9IG1vZHVsZS5leHBvcnRzID0gb2s7XG5cbi8vIDIuIFRoZSBBc3NlcnRpb25FcnJvciBpcyBkZWZpbmVkIGluIGFzc2VydC5cbi8vIG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IoeyBtZXNzYWdlOiBtZXNzYWdlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbDogYWN0dWFsLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBleHBlY3RlZCB9KVxuXG5hc3NlcnQuQXNzZXJ0aW9uRXJyb3IgPSBmdW5jdGlvbiBBc3NlcnRpb25FcnJvcihvcHRpb25zKSB7XG4gIHRoaXMubmFtZSA9ICdBc3NlcnRpb25FcnJvcic7XG4gIHRoaXMuYWN0dWFsID0gb3B0aW9ucy5hY3R1YWw7XG4gIHRoaXMuZXhwZWN0ZWQgPSBvcHRpb25zLmV4cGVjdGVkO1xuICB0aGlzLm9wZXJhdG9yID0gb3B0aW9ucy5vcGVyYXRvcjtcbiAgaWYgKG9wdGlvbnMubWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBnZXRNZXNzYWdlKHRoaXMpO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IHRydWU7XG4gIH1cbiAgdmFyIHN0YWNrU3RhcnRGdW5jdGlvbiA9IG9wdGlvbnMuc3RhY2tTdGFydEZ1bmN0aW9uIHx8IGZhaWw7XG5cbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgc3RhY2tTdGFydEZ1bmN0aW9uKTtcbiAgfVxuICBlbHNlIHtcbiAgICAvLyBub24gdjggYnJvd3NlcnMgc28gd2UgY2FuIGhhdmUgYSBzdGFja3RyYWNlXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xuICAgIGlmIChlcnIuc3RhY2spIHtcbiAgICAgIHZhciBvdXQgPSBlcnIuc3RhY2s7XG5cbiAgICAgIC8vIHRyeSB0byBzdHJpcCB1c2VsZXNzIGZyYW1lc1xuICAgICAgdmFyIGZuX25hbWUgPSBzdGFja1N0YXJ0RnVuY3Rpb24ubmFtZTtcbiAgICAgIHZhciBpZHggPSBvdXQuaW5kZXhPZignXFxuJyArIGZuX25hbWUpO1xuICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgIC8vIG9uY2Ugd2UgaGF2ZSBsb2NhdGVkIHRoZSBmdW5jdGlvbiBmcmFtZVxuICAgICAgICAvLyB3ZSBuZWVkIHRvIHN0cmlwIG91dCBldmVyeXRoaW5nIGJlZm9yZSBpdCAoYW5kIGl0cyBsaW5lKVxuICAgICAgICB2YXIgbmV4dF9saW5lID0gb3V0LmluZGV4T2YoJ1xcbicsIGlkeCArIDEpO1xuICAgICAgICBvdXQgPSBvdXQuc3Vic3RyaW5nKG5leHRfbGluZSArIDEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YWNrID0gb3V0O1xuICAgIH1cbiAgfVxufTtcblxuLy8gYXNzZXJ0LkFzc2VydGlvbkVycm9yIGluc3RhbmNlb2YgRXJyb3JcbnV0aWwuaW5oZXJpdHMoYXNzZXJ0LkFzc2VydGlvbkVycm9yLCBFcnJvcik7XG5cbmZ1bmN0aW9uIHJlcGxhY2VyKGtleSwgdmFsdWUpIHtcbiAgaWYgKHV0aWwuaXNVbmRlZmluZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuICcnICsgdmFsdWU7XG4gIH1cbiAgaWYgKHV0aWwuaXNOdW1iZXIodmFsdWUpICYmIChpc05hTih2YWx1ZSkgfHwgIWlzRmluaXRlKHZhbHVlKSkpIHtcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgfVxuICBpZiAodXRpbC5pc0Z1bmN0aW9uKHZhbHVlKSB8fCB1dGlsLmlzUmVnRXhwKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gdHJ1bmNhdGUocywgbikge1xuICBpZiAodXRpbC5pc1N0cmluZyhzKSkge1xuICAgIHJldHVybiBzLmxlbmd0aCA8IG4gPyBzIDogcy5zbGljZSgwLCBuKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRNZXNzYWdlKHNlbGYpIHtcbiAgcmV0dXJuIHRydW5jYXRlKEpTT04uc3RyaW5naWZ5KHNlbGYuYWN0dWFsLCByZXBsYWNlciksIDEyOCkgKyAnICcgK1xuICAgICAgICAgc2VsZi5vcGVyYXRvciArICcgJyArXG4gICAgICAgICB0cnVuY2F0ZShKU09OLnN0cmluZ2lmeShzZWxmLmV4cGVjdGVkLCByZXBsYWNlciksIDEyOCk7XG59XG5cbi8vIEF0IHByZXNlbnQgb25seSB0aGUgdGhyZWUga2V5cyBtZW50aW9uZWQgYWJvdmUgYXJlIHVzZWQgYW5kXG4vLyB1bmRlcnN0b29kIGJ5IHRoZSBzcGVjLiBJbXBsZW1lbnRhdGlvbnMgb3Igc3ViIG1vZHVsZXMgY2FuIHBhc3Ncbi8vIG90aGVyIGtleXMgdG8gdGhlIEFzc2VydGlvbkVycm9yJ3MgY29uc3RydWN0b3IgLSB0aGV5IHdpbGwgYmVcbi8vIGlnbm9yZWQuXG5cbi8vIDMuIEFsbCBvZiB0aGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBtdXN0IHRocm93IGFuIEFzc2VydGlvbkVycm9yXG4vLyB3aGVuIGEgY29ycmVzcG9uZGluZyBjb25kaXRpb24gaXMgbm90IG1ldCwgd2l0aCBhIG1lc3NhZ2UgdGhhdFxuLy8gbWF5IGJlIHVuZGVmaW5lZCBpZiBub3QgcHJvdmlkZWQuICBBbGwgYXNzZXJ0aW9uIG1ldGhvZHMgcHJvdmlkZVxuLy8gYm90aCB0aGUgYWN0dWFsIGFuZCBleHBlY3RlZCB2YWx1ZXMgdG8gdGhlIGFzc2VydGlvbiBlcnJvciBmb3Jcbi8vIGRpc3BsYXkgcHVycG9zZXMuXG5cbmZ1bmN0aW9uIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgb3BlcmF0b3IsIHN0YWNrU3RhcnRGdW5jdGlvbikge1xuICB0aHJvdyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGFjdHVhbDogYWN0dWFsLFxuICAgIGV4cGVjdGVkOiBleHBlY3RlZCxcbiAgICBvcGVyYXRvcjogb3BlcmF0b3IsXG4gICAgc3RhY2tTdGFydEZ1bmN0aW9uOiBzdGFja1N0YXJ0RnVuY3Rpb25cbiAgfSk7XG59XG5cbi8vIEVYVEVOU0lPTiEgYWxsb3dzIGZvciB3ZWxsIGJlaGF2ZWQgZXJyb3JzIGRlZmluZWQgZWxzZXdoZXJlLlxuYXNzZXJ0LmZhaWwgPSBmYWlsO1xuXG4vLyA0LiBQdXJlIGFzc2VydGlvbiB0ZXN0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdHJ1dGh5LCBhcyBkZXRlcm1pbmVkXG4vLyBieSAhIWd1YXJkLlxuLy8gYXNzZXJ0Lm9rKGd1YXJkLCBtZXNzYWdlX29wdCk7XG4vLyBUaGlzIHN0YXRlbWVudCBpcyBlcXVpdmFsZW50IHRvIGFzc2VydC5lcXVhbCh0cnVlLCAhIWd1YXJkLFxuLy8gbWVzc2FnZV9vcHQpOy4gVG8gdGVzdCBzdHJpY3RseSBmb3IgdGhlIHZhbHVlIHRydWUsIHVzZVxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKHRydWUsIGd1YXJkLCBtZXNzYWdlX29wdCk7LlxuXG5mdW5jdGlvbiBvayh2YWx1ZSwgbWVzc2FnZSkge1xuICBpZiAoIXZhbHVlKSBmYWlsKHZhbHVlLCB0cnVlLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQub2spO1xufVxuYXNzZXJ0Lm9rID0gb2s7XG5cbi8vIDUuIFRoZSBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc2hhbGxvdywgY29lcmNpdmUgZXF1YWxpdHkgd2l0aFxuLy8gPT0uXG4vLyBhc3NlcnQuZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZXF1YWwgPSBmdW5jdGlvbiBlcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT0gZXhwZWN0ZWQpIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09JywgYXNzZXJ0LmVxdWFsKTtcbn07XG5cbi8vIDYuIFRoZSBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciB3aGV0aGVyIHR3byBvYmplY3RzIGFyZSBub3QgZXF1YWxcbi8vIHdpdGggIT0gYXNzZXJ0Lm5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdEVxdWFsID0gZnVuY3Rpb24gbm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT0nLCBhc3NlcnQubm90RXF1YWwpO1xuICB9XG59O1xuXG4vLyA3LiBUaGUgZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGEgZGVlcCBlcXVhbGl0eSByZWxhdGlvbi5cbi8vIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZGVlcEVxdWFsID0gZnVuY3Rpb24gZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcEVxdWFsJywgYXNzZXJ0LmRlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkge1xuICAvLyA3LjEuIEFsbCBpZGVudGljYWwgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2UgaWYgKHV0aWwuaXNCdWZmZXIoYWN0dWFsKSAmJiB1dGlsLmlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIGlmIChhY3R1YWwubGVuZ3RoICE9IGV4cGVjdGVkLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY3R1YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhY3R1YWxbaV0gIT09IGV4cGVjdGVkW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBEYXRlIG9iamVjdCB0aGF0IHJlZmVycyB0byB0aGUgc2FtZSB0aW1lLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNEYXRlKGFjdHVhbCkgJiYgdXRpbC5pc0RhdGUoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAvLyA3LjMgSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBSZWdFeHAgb2JqZWN0IHdpdGggdGhlIHNhbWUgc291cmNlIGFuZFxuICAvLyBwcm9wZXJ0aWVzIChgZ2xvYmFsYCwgYG11bHRpbGluZWAsIGBsYXN0SW5kZXhgLCBgaWdub3JlQ2FzZWApLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNSZWdFeHAoYWN0dWFsKSAmJiB1dGlsLmlzUmVnRXhwKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuc291cmNlID09PSBleHBlY3RlZC5zb3VyY2UgJiZcbiAgICAgICAgICAgYWN0dWFsLmdsb2JhbCA9PT0gZXhwZWN0ZWQuZ2xvYmFsICYmXG4gICAgICAgICAgIGFjdHVhbC5tdWx0aWxpbmUgPT09IGV4cGVjdGVkLm11bHRpbGluZSAmJlxuICAgICAgICAgICBhY3R1YWwubGFzdEluZGV4ID09PSBleHBlY3RlZC5sYXN0SW5kZXggJiZcbiAgICAgICAgICAgYWN0dWFsLmlnbm9yZUNhc2UgPT09IGV4cGVjdGVkLmlnbm9yZUNhc2U7XG5cbiAgLy8gNy40LiBPdGhlciBwYWlycyB0aGF0IGRvIG5vdCBib3RoIHBhc3MgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnLFxuICAvLyBlcXVpdmFsZW5jZSBpcyBkZXRlcm1pbmVkIGJ5ID09LlxuICB9IGVsc2UgaWYgKCF1dGlsLmlzT2JqZWN0KGFjdHVhbCkgJiYgIXV0aWwuaXNPYmplY3QoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAvLyA3LjUgRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgLy8gd2l0aCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwpLCB0aGUgc2FtZSBzZXQgb2Yga2V5c1xuICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICB9IGVsc2Uge1xuICAgIHJldHVybiBvYmpFcXVpdihhY3R1YWwsIGV4cGVjdGVkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xufVxuXG5mdW5jdGlvbiBvYmpFcXVpdihhLCBiKSB7XG4gIGlmICh1dGlsLmlzTnVsbE9yVW5kZWZpbmVkKGEpIHx8IHV0aWwuaXNOdWxsT3JVbmRlZmluZWQoYikpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuXG4gIGlmIChhLnByb3RvdHlwZSAhPT0gYi5wcm90b3R5cGUpIHJldHVybiBmYWxzZTtcbiAgLy9+fn5JJ3ZlIG1hbmFnZWQgdG8gYnJlYWsgT2JqZWN0LmtleXMgdGhyb3VnaCBzY3Jld3kgYXJndW1lbnRzIHBhc3NpbmcuXG4gIC8vICAgQ29udmVydGluZyB0byBhcnJheSBzb2x2ZXMgdGhlIHByb2JsZW0uXG4gIGlmIChpc0FyZ3VtZW50cyhhKSkge1xuICAgIGlmICghaXNBcmd1bWVudHMoYikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgYSA9IHBTbGljZS5jYWxsKGEpO1xuICAgIGIgPSBwU2xpY2UuY2FsbChiKTtcbiAgICByZXR1cm4gX2RlZXBFcXVhbChhLCBiKTtcbiAgfVxuICB0cnkge1xuICAgIHZhciBrYSA9IG9iamVjdEtleXMoYSksXG4gICAgICAgIGtiID0gb2JqZWN0S2V5cyhiKSxcbiAgICAgICAga2V5LCBpO1xuICB9IGNhdGNoIChlKSB7Ly9oYXBwZW5zIHdoZW4gb25lIGlzIGEgc3RyaW5nIGxpdGVyYWwgYW5kIHRoZSBvdGhlciBpc24ndFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzXG4gIC8vIGhhc093blByb3BlcnR5KVxuICBpZiAoa2EubGVuZ3RoICE9IGtiLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gIGthLnNvcnQoKTtcbiAga2Iuc29ydCgpO1xuICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGthW2ldICE9IGtiW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcga2V5LCBhbmRcbiAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAga2V5ID0ga2FbaV07XG4gICAgaWYgKCFfZGVlcEVxdWFsKGFba2V5XSwgYltrZXldKSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyA4LiBUaGUgbm9uLWVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBmb3IgYW55IGRlZXAgaW5lcXVhbGl0eS5cbi8vIGFzc2VydC5ub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RGVlcEVxdWFsID0gZnVuY3Rpb24gbm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwRXF1YWwnLCBhc3NlcnQubm90RGVlcEVxdWFsKTtcbiAgfVxufTtcblxuLy8gOS4gVGhlIHN0cmljdCBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc3RyaWN0IGVxdWFsaXR5LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbi8vIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5zdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIHN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PT0nLCBhc3NlcnQuc3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG4vLyAxMC4gVGhlIHN0cmljdCBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciBzdHJpY3QgaW5lcXVhbGl0eSwgYXNcbi8vIGRldGVybWluZWQgYnkgIT09LiAgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdFN0cmljdEVxdWFsID0gZnVuY3Rpb24gbm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9PScsIGFzc2VydC5ub3RTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgaWYgKCFhY3R1YWwgfHwgIWV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChleHBlY3RlZCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICByZXR1cm4gZXhwZWN0ZWQudGVzdChhY3R1YWwpO1xuICB9IGVsc2UgaWYgKGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoZXhwZWN0ZWQuY2FsbCh7fSwgYWN0dWFsKSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfdGhyb3dzKHNob3VsZFRocm93LCBibG9jaywgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgdmFyIGFjdHVhbDtcblxuICBpZiAodXRpbC5pc1N0cmluZyhleHBlY3RlZCkpIHtcbiAgICBtZXNzYWdlID0gZXhwZWN0ZWQ7XG4gICAgZXhwZWN0ZWQgPSBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBibG9jaygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgYWN0dWFsID0gZTtcbiAgfVxuXG4gIG1lc3NhZ2UgPSAoZXhwZWN0ZWQgJiYgZXhwZWN0ZWQubmFtZSA/ICcgKCcgKyBleHBlY3RlZC5uYW1lICsgJykuJyA6ICcuJykgK1xuICAgICAgICAgICAgKG1lc3NhZ2UgPyAnICcgKyBtZXNzYWdlIDogJy4nKTtcblxuICBpZiAoc2hvdWxkVGhyb3cgJiYgIWFjdHVhbCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ01pc3NpbmcgZXhwZWN0ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKCFzaG91bGRUaHJvdyAmJiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ0dvdCB1bndhbnRlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoKHNob3VsZFRocm93ICYmIGFjdHVhbCAmJiBleHBlY3RlZCAmJlxuICAgICAgIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fCAoIXNob3VsZFRocm93ICYmIGFjdHVhbCkpIHtcbiAgICB0aHJvdyBhY3R1YWw7XG4gIH1cbn1cblxuLy8gMTEuIEV4cGVjdGVkIHRvIHRocm93IGFuIGVycm9yOlxuLy8gYXNzZXJ0LnRocm93cyhibG9jaywgRXJyb3Jfb3B0LCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC50aHJvd3MgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cy5hcHBseSh0aGlzLCBbdHJ1ZV0uY29uY2F0KHBTbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbn07XG5cbi8vIEVYVEVOU0lPTiEgVGhpcyBpcyBhbm5veWluZyB0byB3cml0ZSBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuYXNzZXJ0LmRvZXNOb3RUaHJvdyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MuYXBwbHkodGhpcywgW2ZhbHNlXS5jb25jYXQocFNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xufTtcblxuYXNzZXJ0LmlmRXJyb3IgPSBmdW5jdGlvbihlcnIpIHsgaWYgKGVycikge3Rocm93IGVycjt9fTtcblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBrZXlzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzT3duLmNhbGwob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4ga2V5cztcbn07XG4iLCIvKiFcbiAqIEJvd3NlciAtIGEgYnJvd3NlciBkZXRlY3RvclxuICogaHR0cHM6Ly9naXRodWIuY29tL2RlZC9ib3dzZXJcbiAqIE1JVCBMaWNlbnNlIHwgKGMpIER1c3RpbiBEaWF6IDIwMTVcbiAqL1xuXG4hZnVuY3Rpb24gKHJvb3QsIG5hbWUsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUobmFtZSwgZGVmaW5pdGlvbilcbiAgZWxzZSByb290W25hbWVdID0gZGVmaW5pdGlvbigpXG59KHRoaXMsICdib3dzZXInLCBmdW5jdGlvbiAoKSB7XG4gIC8qKlxuICAgICogU2VlIHVzZXJhZ2VudHMuanMgZm9yIGV4YW1wbGVzIG9mIG5hdmlnYXRvci51c2VyQWdlbnRcbiAgICAqL1xuXG4gIHZhciB0ID0gdHJ1ZVxuXG4gIGZ1bmN0aW9uIGRldGVjdCh1YSkge1xuXG4gICAgZnVuY3Rpb24gZ2V0Rmlyc3RNYXRjaChyZWdleCkge1xuICAgICAgdmFyIG1hdGNoID0gdWEubWF0Y2gocmVnZXgpO1xuICAgICAgcmV0dXJuIChtYXRjaCAmJiBtYXRjaC5sZW5ndGggPiAxICYmIG1hdGNoWzFdKSB8fCAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZWNvbmRNYXRjaChyZWdleCkge1xuICAgICAgdmFyIG1hdGNoID0gdWEubWF0Y2gocmVnZXgpO1xuICAgICAgcmV0dXJuIChtYXRjaCAmJiBtYXRjaC5sZW5ndGggPiAxICYmIG1hdGNoWzJdKSB8fCAnJztcbiAgICB9XG5cbiAgICB2YXIgaW9zZGV2aWNlID0gZ2V0Rmlyc3RNYXRjaCgvKGlwb2R8aXBob25lfGlwYWQpL2kpLnRvTG93ZXJDYXNlKClcbiAgICAgICwgbGlrZUFuZHJvaWQgPSAvbGlrZSBhbmRyb2lkL2kudGVzdCh1YSlcbiAgICAgICwgYW5kcm9pZCA9ICFsaWtlQW5kcm9pZCAmJiAvYW5kcm9pZC9pLnRlc3QodWEpXG4gICAgICAsIG5leHVzTW9iaWxlID0gL25leHVzXFxzKlswLTZdXFxzKi9pLnRlc3QodWEpXG4gICAgICAsIG5leHVzVGFibGV0ID0gIW5leHVzTW9iaWxlICYmIC9uZXh1c1xccypbMC05XSsvaS50ZXN0KHVhKVxuICAgICAgLCBjaHJvbWVvcyA9IC9Dck9TLy50ZXN0KHVhKVxuICAgICAgLCBzaWxrID0gL3NpbGsvaS50ZXN0KHVhKVxuICAgICAgLCBzYWlsZmlzaCA9IC9zYWlsZmlzaC9pLnRlc3QodWEpXG4gICAgICAsIHRpemVuID0gL3RpemVuL2kudGVzdCh1YSlcbiAgICAgICwgd2Vib3MgPSAvKHdlYnxocHcpb3MvaS50ZXN0KHVhKVxuICAgICAgLCB3aW5kb3dzcGhvbmUgPSAvd2luZG93cyBwaG9uZS9pLnRlc3QodWEpXG4gICAgICAsIHNhbXN1bmdCcm93c2VyID0gL1NhbXN1bmdCcm93c2VyL2kudGVzdCh1YSlcbiAgICAgICwgd2luZG93cyA9ICF3aW5kb3dzcGhvbmUgJiYgL3dpbmRvd3MvaS50ZXN0KHVhKVxuICAgICAgLCBtYWMgPSAhaW9zZGV2aWNlICYmICFzaWxrICYmIC9tYWNpbnRvc2gvaS50ZXN0KHVhKVxuICAgICAgLCBsaW51eCA9ICFhbmRyb2lkICYmICFzYWlsZmlzaCAmJiAhdGl6ZW4gJiYgIXdlYm9zICYmIC9saW51eC9pLnRlc3QodWEpXG4gICAgICAsIGVkZ2VWZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvZWRnZVxcLyhcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgICwgdmVyc2lvbklkZW50aWZpZXIgPSBnZXRGaXJzdE1hdGNoKC92ZXJzaW9uXFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgLCB0YWJsZXQgPSAvdGFibGV0L2kudGVzdCh1YSlcbiAgICAgICwgbW9iaWxlID0gIXRhYmxldCAmJiAvW14tXW1vYmkvaS50ZXN0KHVhKVxuICAgICAgLCB4Ym94ID0gL3hib3gvaS50ZXN0KHVhKVxuICAgICAgLCByZXN1bHRcblxuICAgIGlmICgvb3BlcmEvaS50ZXN0KHVhKSkge1xuICAgICAgLy8gIGFuIG9sZCBPcGVyYVxuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnT3BlcmEnXG4gICAgICAsIG9wZXJhOiB0XG4gICAgICAsIHZlcnNpb246IHZlcnNpb25JZGVudGlmaWVyIHx8IGdldEZpcnN0TWF0Y2goLyg/Om9wZXJhfG9wcnxvcGlvcylbXFxzXFwvXShcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKC9vcHJ8b3Bpb3MvaS50ZXN0KHVhKSkge1xuICAgICAgLy8gYSBuZXcgT3BlcmFcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ09wZXJhJ1xuICAgICAgICAsIG9wZXJhOiB0XG4gICAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvKD86b3ByfG9waW9zKVtcXHNcXC9dKFxcZCsoXFwuXFxkKyk/KS9pKSB8fCB2ZXJzaW9uSWRlbnRpZmllclxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvU2Ftc3VuZ0Jyb3dzZXIvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnU2Ftc3VuZyBJbnRlcm5ldCBmb3IgQW5kcm9pZCdcbiAgICAgICAgLCBzYW1zdW5nQnJvd3NlcjogdFxuICAgICAgICAsIHZlcnNpb246IHZlcnNpb25JZGVudGlmaWVyIHx8IGdldEZpcnN0TWF0Y2goLyg/OlNhbXN1bmdCcm93c2VyKVtcXHNcXC9dKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvY29hc3QvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnT3BlcmEgQ29hc3QnXG4gICAgICAgICwgY29hc3Q6IHRcbiAgICAgICAgLCB2ZXJzaW9uOiB2ZXJzaW9uSWRlbnRpZmllciB8fCBnZXRGaXJzdE1hdGNoKC8oPzpjb2FzdClbXFxzXFwvXShcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL3lhYnJvd3Nlci9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdZYW5kZXggQnJvd3NlcidcbiAgICAgICwgeWFuZGV4YnJvd3NlcjogdFxuICAgICAgLCB2ZXJzaW9uOiB2ZXJzaW9uSWRlbnRpZmllciB8fCBnZXRGaXJzdE1hdGNoKC8oPzp5YWJyb3dzZXIpW1xcc1xcL10oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC91Y2Jyb3dzZXIvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgIG5hbWU6ICdVQyBCcm93c2VyJ1xuICAgICAgICAsIHVjYnJvd3NlcjogdFxuICAgICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/OnVjYnJvd3NlcilbXFxzXFwvXShcXGQrKD86XFwuXFxkKykrKS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvbXhpb3MvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnTWF4dGhvbidcbiAgICAgICAgLCBtYXh0aG9uOiB0XG4gICAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvKD86bXhpb3MpW1xcc1xcL10oXFxkKyg/OlxcLlxcZCspKykvaSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL2VwaXBoYW55L2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ0VwaXBoYW55J1xuICAgICAgICAsIGVwaXBoYW55OiB0XG4gICAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvKD86ZXBpcGhhbnkpW1xcc1xcL10oXFxkKyg/OlxcLlxcZCspKykvaSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL3B1ZmZpbi9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdQdWZmaW4nXG4gICAgICAgICwgcHVmZmluOiB0XG4gICAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvKD86cHVmZmluKVtcXHNcXC9dKFxcZCsoPzpcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC9zbGVpcG5pci9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdTbGVpcG5pcidcbiAgICAgICAgLCBzbGVpcG5pcjogdFxuICAgICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/OnNsZWlwbmlyKVtcXHNcXC9dKFxcZCsoPzpcXC5cXGQrKSspL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC9rLW1lbGVvbi9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdLLU1lbGVvbidcbiAgICAgICAgLCBrTWVsZW9uOiB0XG4gICAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvKD86ay1tZWxlb24pW1xcc1xcL10oXFxkKyg/OlxcLlxcZCspKykvaSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAod2luZG93c3Bob25lKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdXaW5kb3dzIFBob25lJ1xuICAgICAgLCB3aW5kb3dzcGhvbmU6IHRcbiAgICAgIH1cbiAgICAgIGlmIChlZGdlVmVyc2lvbikge1xuICAgICAgICByZXN1bHQubXNlZGdlID0gdFxuICAgICAgICByZXN1bHQudmVyc2lvbiA9IGVkZ2VWZXJzaW9uXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0Lm1zaWUgPSB0XG4gICAgICAgIHJlc3VsdC52ZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvaWVtb2JpbGVcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC9tc2llfHRyaWRlbnQvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnSW50ZXJuZXQgRXhwbG9yZXInXG4gICAgICAsIG1zaWU6IHRcbiAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvKD86bXNpZSB8cnY6KShcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNocm9tZW9zKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdDaHJvbWUnXG4gICAgICAsIGNocm9tZW9zOiB0XG4gICAgICAsIGNocm9tZUJvb2s6IHRcbiAgICAgICwgY2hyb21lOiB0XG4gICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/OmNocm9tZXxjcmlvc3xjcm1vKVxcLyhcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKC9jaHJvbWUuKz8gZWRnZS9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdNaWNyb3NvZnQgRWRnZSdcbiAgICAgICwgbXNlZGdlOiB0XG4gICAgICAsIHZlcnNpb246IGVkZ2VWZXJzaW9uXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC92aXZhbGRpL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ1ZpdmFsZGknXG4gICAgICAgICwgdml2YWxkaTogdFxuICAgICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goL3ZpdmFsZGlcXC8oXFxkKyhcXC5cXGQrKT8pL2kpIHx8IHZlcnNpb25JZGVudGlmaWVyXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHNhaWxmaXNoKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdTYWlsZmlzaCdcbiAgICAgICwgc2FpbGZpc2g6IHRcbiAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvc2FpbGZpc2hcXHM/YnJvd3NlclxcLyhcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL3NlYW1vbmtleVxcLy9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdTZWFNb25rZXknXG4gICAgICAsIHNlYW1vbmtleTogdFxuICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC9zZWFtb25rZXlcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC9maXJlZm94fGljZXdlYXNlbHxmeGlvcy9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdGaXJlZm94J1xuICAgICAgLCBmaXJlZm94OiB0XG4gICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/OmZpcmVmb3h8aWNld2Vhc2VsfGZ4aW9zKVsgXFwvXShcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH1cbiAgICAgIGlmICgvXFwoKG1vYmlsZXx0YWJsZXQpO1teXFwpXSpydjpbXFxkXFwuXStcXCkvaS50ZXN0KHVhKSkge1xuICAgICAgICByZXN1bHQuZmlyZWZveG9zID0gdFxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChzaWxrKSB7XG4gICAgICByZXN1bHQgPSAge1xuICAgICAgICBuYW1lOiAnQW1hem9uIFNpbGsnXG4gICAgICAsIHNpbGs6IHRcbiAgICAgICwgdmVyc2lvbiA6IGdldEZpcnN0TWF0Y2goL3NpbGtcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC9waGFudG9tL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ1BoYW50b21KUydcbiAgICAgICwgcGhhbnRvbTogdFxuICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC9waGFudG9tanNcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC9zbGltZXJqcy9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdTbGltZXJKUydcbiAgICAgICAgLCBzbGltZXI6IHRcbiAgICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC9zbGltZXJqc1xcLyhcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL2JsYWNrYmVycnl8XFxiYmJcXGQrL2kudGVzdCh1YSkgfHwgL3JpbVxcc3RhYmxldC9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdCbGFja0JlcnJ5J1xuICAgICAgLCBibGFja2JlcnJ5OiB0XG4gICAgICAsIHZlcnNpb246IHZlcnNpb25JZGVudGlmaWVyIHx8IGdldEZpcnN0TWF0Y2goL2JsYWNrYmVycnlbXFxkXStcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHdlYm9zKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdXZWJPUydcbiAgICAgICwgd2Vib3M6IHRcbiAgICAgICwgdmVyc2lvbjogdmVyc2lvbklkZW50aWZpZXIgfHwgZ2V0Rmlyc3RNYXRjaCgvdyg/OmViKT9vc2Jyb3dzZXJcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9O1xuICAgICAgL3RvdWNocGFkXFwvL2kudGVzdCh1YSkgJiYgKHJlc3VsdC50b3VjaHBhZCA9IHQpXG4gICAgfVxuICAgIGVsc2UgaWYgKC9iYWRhL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ0JhZGEnXG4gICAgICAsIGJhZGE6IHRcbiAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvZG9sZmluXFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGl6ZW4pIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ1RpemVuJ1xuICAgICAgLCB0aXplbjogdFxuICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC8oPzp0aXplblxccz8pP2Jyb3dzZXJcXC8oXFxkKyhcXC5cXGQrKT8pL2kpIHx8IHZlcnNpb25JZGVudGlmaWVyXG4gICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGlmICgvcXVwemlsbGEvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnUXVwWmlsbGEnXG4gICAgICAgICwgcXVwemlsbGE6IHRcbiAgICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC8oPzpxdXB6aWxsYSlbXFxzXFwvXShcXGQrKD86XFwuXFxkKykrKS9pKSB8fCB2ZXJzaW9uSWRlbnRpZmllclxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvY2hyb21pdW0vaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnQ2hyb21pdW0nXG4gICAgICAgICwgY2hyb21pdW06IHRcbiAgICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC8oPzpjaHJvbWl1bSlbXFxzXFwvXShcXGQrKD86XFwuXFxkKyk/KS9pKSB8fCB2ZXJzaW9uSWRlbnRpZmllclxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvY2hyb21lfGNyaW9zfGNybW8vaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnQ2hyb21lJ1xuICAgICAgICAsIGNocm9tZTogdFxuICAgICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/OmNocm9tZXxjcmlvc3xjcm1vKVxcLyhcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoYW5kcm9pZCkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnQW5kcm9pZCdcbiAgICAgICAgLCB2ZXJzaW9uOiB2ZXJzaW9uSWRlbnRpZmllclxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvc2FmYXJpfGFwcGxld2Via2l0L2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ1NhZmFyaSdcbiAgICAgICwgc2FmYXJpOiB0XG4gICAgICB9XG4gICAgICBpZiAodmVyc2lvbklkZW50aWZpZXIpIHtcbiAgICAgICAgcmVzdWx0LnZlcnNpb24gPSB2ZXJzaW9uSWRlbnRpZmllclxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChpb3NkZXZpY2UpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZSA6IGlvc2RldmljZSA9PSAnaXBob25lJyA/ICdpUGhvbmUnIDogaW9zZGV2aWNlID09ICdpcGFkJyA/ICdpUGFkJyA6ICdpUG9kJ1xuICAgICAgfVxuICAgICAgLy8gV1RGOiB2ZXJzaW9uIGlzIG5vdCBwYXJ0IG9mIHVzZXIgYWdlbnQgaW4gd2ViIGFwcHNcbiAgICAgIGlmICh2ZXJzaW9uSWRlbnRpZmllcikge1xuICAgICAgICByZXN1bHQudmVyc2lvbiA9IHZlcnNpb25JZGVudGlmaWVyXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYoL2dvb2dsZWJvdC9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdHb29nbGVib3QnXG4gICAgICAsIGdvb2dsZWJvdDogdFxuICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC9nb29nbGVib3RcXC8oXFxkKyhcXC5cXGQrKSkvaSkgfHwgdmVyc2lvbklkZW50aWZpZXJcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6IGdldEZpcnN0TWF0Y2goL14oLiopXFwvKC4qKSAvKSxcbiAgICAgICAgdmVyc2lvbjogZ2V0U2Vjb25kTWF0Y2goL14oLiopXFwvKC4qKSAvKVxuICAgICB9O1xuICAgfVxuXG4gICAgLy8gc2V0IHdlYmtpdCBvciBnZWNrbyBmbGFnIGZvciBicm93c2VycyBiYXNlZCBvbiB0aGVzZSBlbmdpbmVzXG4gICAgaWYgKCFyZXN1bHQubXNlZGdlICYmIC8oYXBwbGUpP3dlYmtpdC9pLnRlc3QodWEpKSB7XG4gICAgICBpZiAoLyhhcHBsZSk/d2Via2l0XFwvNTM3XFwuMzYvaS50ZXN0KHVhKSkge1xuICAgICAgICByZXN1bHQubmFtZSA9IHJlc3VsdC5uYW1lIHx8IFwiQmxpbmtcIlxuICAgICAgICByZXN1bHQuYmxpbmsgPSB0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQubmFtZSA9IHJlc3VsdC5uYW1lIHx8IFwiV2Via2l0XCJcbiAgICAgICAgcmVzdWx0LndlYmtpdCA9IHRcbiAgICAgIH1cbiAgICAgIGlmICghcmVzdWx0LnZlcnNpb24gJiYgdmVyc2lvbklkZW50aWZpZXIpIHtcbiAgICAgICAgcmVzdWx0LnZlcnNpb24gPSB2ZXJzaW9uSWRlbnRpZmllclxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIXJlc3VsdC5vcGVyYSAmJiAvZ2Vja29cXC8vaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0Lm5hbWUgPSByZXN1bHQubmFtZSB8fCBcIkdlY2tvXCJcbiAgICAgIHJlc3VsdC5nZWNrbyA9IHRcbiAgICAgIHJlc3VsdC52ZXJzaW9uID0gcmVzdWx0LnZlcnNpb24gfHwgZ2V0Rmlyc3RNYXRjaCgvZ2Vja29cXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgfVxuXG4gICAgLy8gc2V0IE9TIGZsYWdzIGZvciBwbGF0Zm9ybXMgdGhhdCBoYXZlIG11bHRpcGxlIGJyb3dzZXJzXG4gICAgaWYgKCFyZXN1bHQud2luZG93c3Bob25lICYmICFyZXN1bHQubXNlZGdlICYmIChhbmRyb2lkIHx8IHJlc3VsdC5zaWxrKSkge1xuICAgICAgcmVzdWx0LmFuZHJvaWQgPSB0XG4gICAgfSBlbHNlIGlmICghcmVzdWx0LndpbmRvd3NwaG9uZSAmJiAhcmVzdWx0Lm1zZWRnZSAmJiBpb3NkZXZpY2UpIHtcbiAgICAgIHJlc3VsdFtpb3NkZXZpY2VdID0gdFxuICAgICAgcmVzdWx0LmlvcyA9IHRcbiAgICB9IGVsc2UgaWYgKG1hYykge1xuICAgICAgcmVzdWx0Lm1hYyA9IHRcbiAgICB9IGVsc2UgaWYgKHhib3gpIHtcbiAgICAgIHJlc3VsdC54Ym94ID0gdFxuICAgIH0gZWxzZSBpZiAod2luZG93cykge1xuICAgICAgcmVzdWx0LndpbmRvd3MgPSB0XG4gICAgfSBlbHNlIGlmIChsaW51eCkge1xuICAgICAgcmVzdWx0LmxpbnV4ID0gdFxuICAgIH1cblxuICAgIC8vIE9TIHZlcnNpb24gZXh0cmFjdGlvblxuICAgIHZhciBvc1ZlcnNpb24gPSAnJztcbiAgICBpZiAocmVzdWx0LndpbmRvd3NwaG9uZSkge1xuICAgICAgb3NWZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvd2luZG93cyBwaG9uZSAoPzpvcyk/XFxzPyhcXGQrKFxcLlxcZCspKikvaSk7XG4gICAgfSBlbHNlIGlmIChpb3NkZXZpY2UpIHtcbiAgICAgIG9zVmVyc2lvbiA9IGdldEZpcnN0TWF0Y2goL29zIChcXGQrKFtfXFxzXVxcZCspKikgbGlrZSBtYWMgb3MgeC9pKTtcbiAgICAgIG9zVmVyc2lvbiA9IG9zVmVyc2lvbi5yZXBsYWNlKC9bX1xcc10vZywgJy4nKTtcbiAgICB9IGVsc2UgaWYgKGFuZHJvaWQpIHtcbiAgICAgIG9zVmVyc2lvbiA9IGdldEZpcnN0TWF0Y2goL2FuZHJvaWRbIFxcLy1dKFxcZCsoXFwuXFxkKykqKS9pKTtcbiAgICB9IGVsc2UgaWYgKHJlc3VsdC53ZWJvcykge1xuICAgICAgb3NWZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvKD86d2VifGhwdylvc1xcLyhcXGQrKFxcLlxcZCspKikvaSk7XG4gICAgfSBlbHNlIGlmIChyZXN1bHQuYmxhY2tiZXJyeSkge1xuICAgICAgb3NWZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvcmltXFxzdGFibGV0XFxzb3NcXHMoXFxkKyhcXC5cXGQrKSopL2kpO1xuICAgIH0gZWxzZSBpZiAocmVzdWx0LmJhZGEpIHtcbiAgICAgIG9zVmVyc2lvbiA9IGdldEZpcnN0TWF0Y2goL2JhZGFcXC8oXFxkKyhcXC5cXGQrKSopL2kpO1xuICAgIH0gZWxzZSBpZiAocmVzdWx0LnRpemVuKSB7XG4gICAgICBvc1ZlcnNpb24gPSBnZXRGaXJzdE1hdGNoKC90aXplbltcXC9cXHNdKFxcZCsoXFwuXFxkKykqKS9pKTtcbiAgICB9XG4gICAgaWYgKG9zVmVyc2lvbikge1xuICAgICAgcmVzdWx0Lm9zdmVyc2lvbiA9IG9zVmVyc2lvbjtcbiAgICB9XG5cbiAgICAvLyBkZXZpY2UgdHlwZSBleHRyYWN0aW9uXG4gICAgdmFyIG9zTWFqb3JWZXJzaW9uID0gb3NWZXJzaW9uLnNwbGl0KCcuJylbMF07XG4gICAgaWYgKFxuICAgICAgICAgdGFibGV0XG4gICAgICB8fCBuZXh1c1RhYmxldFxuICAgICAgfHwgaW9zZGV2aWNlID09ICdpcGFkJ1xuICAgICAgfHwgKGFuZHJvaWQgJiYgKG9zTWFqb3JWZXJzaW9uID09IDMgfHwgKG9zTWFqb3JWZXJzaW9uID49IDQgJiYgIW1vYmlsZSkpKVxuICAgICAgfHwgcmVzdWx0LnNpbGtcbiAgICApIHtcbiAgICAgIHJlc3VsdC50YWJsZXQgPSB0XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICAgIG1vYmlsZVxuICAgICAgfHwgaW9zZGV2aWNlID09ICdpcGhvbmUnXG4gICAgICB8fCBpb3NkZXZpY2UgPT0gJ2lwb2QnXG4gICAgICB8fCBhbmRyb2lkXG4gICAgICB8fCBuZXh1c01vYmlsZVxuICAgICAgfHwgcmVzdWx0LmJsYWNrYmVycnlcbiAgICAgIHx8IHJlc3VsdC53ZWJvc1xuICAgICAgfHwgcmVzdWx0LmJhZGFcbiAgICApIHtcbiAgICAgIHJlc3VsdC5tb2JpbGUgPSB0XG4gICAgfVxuXG4gICAgLy8gR3JhZGVkIEJyb3dzZXIgU3VwcG9ydFxuICAgIC8vIGh0dHA6Ly9kZXZlbG9wZXIueWFob28uY29tL3l1aS9hcnRpY2xlcy9nYnNcbiAgICBpZiAocmVzdWx0Lm1zZWRnZSB8fFxuICAgICAgICAocmVzdWx0Lm1zaWUgJiYgcmVzdWx0LnZlcnNpb24gPj0gMTApIHx8XG4gICAgICAgIChyZXN1bHQueWFuZGV4YnJvd3NlciAmJiByZXN1bHQudmVyc2lvbiA+PSAxNSkgfHxcblx0XHQgICAgKHJlc3VsdC52aXZhbGRpICYmIHJlc3VsdC52ZXJzaW9uID49IDEuMCkgfHxcbiAgICAgICAgKHJlc3VsdC5jaHJvbWUgJiYgcmVzdWx0LnZlcnNpb24gPj0gMjApIHx8XG4gICAgICAgIChyZXN1bHQuc2Ftc3VuZ0Jyb3dzZXIgJiYgcmVzdWx0LnZlcnNpb24gPj0gNCkgfHxcbiAgICAgICAgKHJlc3VsdC5maXJlZm94ICYmIHJlc3VsdC52ZXJzaW9uID49IDIwLjApIHx8XG4gICAgICAgIChyZXN1bHQuc2FmYXJpICYmIHJlc3VsdC52ZXJzaW9uID49IDYpIHx8XG4gICAgICAgIChyZXN1bHQub3BlcmEgJiYgcmVzdWx0LnZlcnNpb24gPj0gMTAuMCkgfHxcbiAgICAgICAgKHJlc3VsdC5pb3MgJiYgcmVzdWx0Lm9zdmVyc2lvbiAmJiByZXN1bHQub3N2ZXJzaW9uLnNwbGl0KFwiLlwiKVswXSA+PSA2KSB8fFxuICAgICAgICAocmVzdWx0LmJsYWNrYmVycnkgJiYgcmVzdWx0LnZlcnNpb24gPj0gMTAuMSlcbiAgICAgICAgfHwgKHJlc3VsdC5jaHJvbWl1bSAmJiByZXN1bHQudmVyc2lvbiA+PSAyMClcbiAgICAgICAgKSB7XG4gICAgICByZXN1bHQuYSA9IHQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKChyZXN1bHQubXNpZSAmJiByZXN1bHQudmVyc2lvbiA8IDEwKSB8fFxuICAgICAgICAocmVzdWx0LmNocm9tZSAmJiByZXN1bHQudmVyc2lvbiA8IDIwKSB8fFxuICAgICAgICAocmVzdWx0LmZpcmVmb3ggJiYgcmVzdWx0LnZlcnNpb24gPCAyMC4wKSB8fFxuICAgICAgICAocmVzdWx0LnNhZmFyaSAmJiByZXN1bHQudmVyc2lvbiA8IDYpIHx8XG4gICAgICAgIChyZXN1bHQub3BlcmEgJiYgcmVzdWx0LnZlcnNpb24gPCAxMC4wKSB8fFxuICAgICAgICAocmVzdWx0LmlvcyAmJiByZXN1bHQub3N2ZXJzaW9uICYmIHJlc3VsdC5vc3ZlcnNpb24uc3BsaXQoXCIuXCIpWzBdIDwgNilcbiAgICAgICAgfHwgKHJlc3VsdC5jaHJvbWl1bSAmJiByZXN1bHQudmVyc2lvbiA8IDIwKVxuICAgICAgICApIHtcbiAgICAgIHJlc3VsdC5jID0gdFxuICAgIH0gZWxzZSByZXN1bHQueCA9IHRcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIHZhciBib3dzZXIgPSBkZXRlY3QodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgPyBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnIDogJycpXG5cbiAgYm93c2VyLnRlc3QgPSBmdW5jdGlvbiAoYnJvd3Nlckxpc3QpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJyb3dzZXJMaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgYnJvd3Nlckl0ZW0gPSBicm93c2VyTGlzdFtpXTtcbiAgICAgIGlmICh0eXBlb2YgYnJvd3Nlckl0ZW09PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKGJyb3dzZXJJdGVtIGluIGJvd3Nlcikge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdmVyc2lvbiBwcmVjaXNpb25zIGNvdW50XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqICAgZ2V0VmVyc2lvblByZWNpc2lvbihcIjEuMTAuM1wiKSAvLyAzXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdmVyc2lvblxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRWZXJzaW9uUHJlY2lzaW9uKHZlcnNpb24pIHtcbiAgICByZXR1cm4gdmVyc2lvbi5zcGxpdChcIi5cIikubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIEFycmF5OjptYXAgcG9seWZpbGxcbiAgICpcbiAgICogQHBhcmFtICB7QXJyYXl9IGFyclxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gaXRlcmF0b3JcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuICBmdW5jdGlvbiBtYXAoYXJyLCBpdGVyYXRvcikge1xuICAgIHZhciByZXN1bHQgPSBbXSwgaTtcbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLm1hcCkge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChhcnIsIGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0LnB1c2goaXRlcmF0b3IoYXJyW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIGJyb3dzZXIgdmVyc2lvbiB3ZWlnaHRcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogICBjb21wYXJlVmVyc2lvbnMoWycxLjEwLjIuMScsICAnMS44LjIuMS45MCddKSAgICAvLyAxXG4gICAqICAgY29tcGFyZVZlcnNpb25zKFsnMS4wMTAuMi4xJywgJzEuMDkuMi4xLjkwJ10pOyAgLy8gMVxuICAgKiAgIGNvbXBhcmVWZXJzaW9ucyhbJzEuMTAuMi4xJywgICcxLjEwLjIuMSddKTsgICAgIC8vIDBcbiAgICogICBjb21wYXJlVmVyc2lvbnMoWycxLjEwLjIuMScsICAnMS4wODAwLjInXSk7ICAgICAvLyAtMVxuICAgKlxuICAgKiBAcGFyYW0gIHtBcnJheTxTdHJpbmc+fSB2ZXJzaW9ucyB2ZXJzaW9ucyB0byBjb21wYXJlXG4gICAqIEByZXR1cm4ge051bWJlcn0gY29tcGFyaXNvbiByZXN1bHRcbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBhcmVWZXJzaW9ucyh2ZXJzaW9ucykge1xuICAgIC8vIDEpIGdldCBjb21tb24gcHJlY2lzaW9uIGZvciBib3RoIHZlcnNpb25zLCBmb3IgZXhhbXBsZSBmb3IgXCIxMC4wXCIgYW5kIFwiOVwiIGl0IHNob3VsZCBiZSAyXG4gICAgdmFyIHByZWNpc2lvbiA9IE1hdGgubWF4KGdldFZlcnNpb25QcmVjaXNpb24odmVyc2lvbnNbMF0pLCBnZXRWZXJzaW9uUHJlY2lzaW9uKHZlcnNpb25zWzFdKSk7XG4gICAgdmFyIGNodW5rcyA9IG1hcCh2ZXJzaW9ucywgZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICAgIHZhciBkZWx0YSA9IHByZWNpc2lvbiAtIGdldFZlcnNpb25QcmVjaXNpb24odmVyc2lvbik7XG5cbiAgICAgIC8vIDIpIFwiOVwiIC0+IFwiOS4wXCIgKGZvciBwcmVjaXNpb24gPSAyKVxuICAgICAgdmVyc2lvbiA9IHZlcnNpb24gKyBuZXcgQXJyYXkoZGVsdGEgKyAxKS5qb2luKFwiLjBcIik7XG5cbiAgICAgIC8vIDMpIFwiOS4wXCIgLT4gW1wiMDAwMDAwMDAwXCJcIiwgXCIwMDAwMDAwMDlcIl1cbiAgICAgIHJldHVybiBtYXAodmVyc2lvbi5zcGxpdChcIi5cIiksIGZ1bmN0aW9uIChjaHVuaykge1xuICAgICAgICByZXR1cm4gbmV3IEFycmF5KDIwIC0gY2h1bmsubGVuZ3RoKS5qb2luKFwiMFwiKSArIGNodW5rO1xuICAgICAgfSkucmV2ZXJzZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gaXRlcmF0ZSBpbiByZXZlcnNlIG9yZGVyIGJ5IHJldmVyc2VkIGNodW5rcyBhcnJheVxuICAgIHdoaWxlICgtLXByZWNpc2lvbiA+PSAwKSB7XG4gICAgICAvLyA0KSBjb21wYXJlOiBcIjAwMDAwMDAwOVwiID4gXCIwMDAwMDAwMTBcIiA9IGZhbHNlIChidXQgXCI5XCIgPiBcIjEwXCIgPSB0cnVlKVxuICAgICAgaWYgKGNodW5rc1swXVtwcmVjaXNpb25dID4gY2h1bmtzWzFdW3ByZWNpc2lvbl0pIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChjaHVua3NbMF1bcHJlY2lzaW9uXSA9PT0gY2h1bmtzWzFdW3ByZWNpc2lvbl0pIHtcbiAgICAgICAgaWYgKHByZWNpc2lvbiA9PT0gMCkge1xuICAgICAgICAgIC8vIGFsbCB2ZXJzaW9uIGNodW5rcyBhcmUgc2FtZVxuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBicm93c2VyIGlzIHVuc3VwcG9ydGVkXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqICAgYm93c2VyLmlzVW5zdXBwb3J0ZWRCcm93c2VyKHtcbiAgICogICAgIG1zaWU6IFwiMTBcIixcbiAgICogICAgIGZpcmVmb3g6IFwiMjNcIixcbiAgICogICAgIGNocm9tZTogXCIyOVwiLFxuICAgKiAgICAgc2FmYXJpOiBcIjUuMVwiLFxuICAgKiAgICAgb3BlcmE6IFwiMTZcIixcbiAgICogICAgIHBoYW50b206IFwiNTM0XCJcbiAgICogICB9KTtcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgbWluVmVyc2lvbnMgbWFwIG9mIG1pbmltYWwgdmVyc2lvbiB0byBicm93c2VyXG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IFtzdHJpY3RNb2RlID0gZmFsc2VdIGZsYWcgdG8gcmV0dXJuIGZhbHNlIGlmIGJyb3dzZXIgd2Fzbid0IGZvdW5kIGluIG1hcFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBbdWFdIHVzZXIgYWdlbnQgc3RyaW5nXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBpc1Vuc3VwcG9ydGVkQnJvd3NlcihtaW5WZXJzaW9ucywgc3RyaWN0TW9kZSwgdWEpIHtcbiAgICB2YXIgX2Jvd3NlciA9IGJvd3NlcjtcblxuICAgIC8vIG1ha2Ugc3RyaWN0TW9kZSBwYXJhbSBvcHRpb25hbCB3aXRoIHVhIHBhcmFtIHVzYWdlXG4gICAgaWYgKHR5cGVvZiBzdHJpY3RNb2RlID09PSAnc3RyaW5nJykge1xuICAgICAgdWEgPSBzdHJpY3RNb2RlO1xuICAgICAgc3RyaWN0TW9kZSA9IHZvaWQoMCk7XG4gICAgfVxuXG4gICAgaWYgKHN0cmljdE1vZGUgPT09IHZvaWQoMCkpIHtcbiAgICAgIHN0cmljdE1vZGUgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHVhKSB7XG4gICAgICBfYm93c2VyID0gZGV0ZWN0KHVhKTtcbiAgICB9XG5cbiAgICB2YXIgdmVyc2lvbiA9IFwiXCIgKyBfYm93c2VyLnZlcnNpb247XG4gICAgZm9yICh2YXIgYnJvd3NlciBpbiBtaW5WZXJzaW9ucykge1xuICAgICAgaWYgKG1pblZlcnNpb25zLmhhc093blByb3BlcnR5KGJyb3dzZXIpKSB7XG4gICAgICAgIGlmIChfYm93c2VyW2Jyb3dzZXJdKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBtaW5WZXJzaW9uc1ticm93c2VyXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQnJvd3NlciB2ZXJzaW9uIGluIHRoZSBtaW5WZXJzaW9uIG1hcCBzaG91bGQgYmUgYSBzdHJpbmc6ICcgKyBicm93c2VyICsgJzogJyArIFN0cmluZyhtaW5WZXJzaW9ucykpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGJyb3dzZXIgdmVyc2lvbiBhbmQgbWluIHN1cHBvcnRlZCB2ZXJzaW9uLlxuICAgICAgICAgIHJldHVybiBjb21wYXJlVmVyc2lvbnMoW3ZlcnNpb24sIG1pblZlcnNpb25zW2Jyb3dzZXJdXSkgPCAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmljdE1vZGU7IC8vIG5vdCBmb3VuZFxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGJyb3dzZXIgaXMgc3VwcG9ydGVkXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gbWluVmVyc2lvbnMgbWFwIG9mIG1pbmltYWwgdmVyc2lvbiB0byBicm93c2VyXG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IFtzdHJpY3RNb2RlID0gZmFsc2VdIGZsYWcgdG8gcmV0dXJuIGZhbHNlIGlmIGJyb3dzZXIgd2Fzbid0IGZvdW5kIGluIG1hcFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBbdWFdIHVzZXIgYWdlbnQgc3RyaW5nXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBjaGVjayhtaW5WZXJzaW9ucywgc3RyaWN0TW9kZSwgdWEpIHtcbiAgICByZXR1cm4gIWlzVW5zdXBwb3J0ZWRCcm93c2VyKG1pblZlcnNpb25zLCBzdHJpY3RNb2RlLCB1YSk7XG4gIH1cblxuICBib3dzZXIuaXNVbnN1cHBvcnRlZEJyb3dzZXIgPSBpc1Vuc3VwcG9ydGVkQnJvd3NlcjtcbiAgYm93c2VyLmNvbXBhcmVWZXJzaW9ucyA9IGNvbXBhcmVWZXJzaW9ucztcbiAgYm93c2VyLmNoZWNrID0gY2hlY2s7XG5cbiAgLypcbiAgICogU2V0IG91ciBkZXRlY3QgbWV0aG9kIHRvIHRoZSBtYWluIGJvd3NlciBvYmplY3Qgc28gd2UgY2FuXG4gICAqIHJldXNlIGl0IHRvIHRlc3Qgb3RoZXIgdXNlciBhZ2VudHMuXG4gICAqIFRoaXMgaXMgbmVlZGVkIHRvIGltcGxlbWVudCBmdXR1cmUgdGVzdHMuXG4gICAqL1xuICBib3dzZXIuX2RldGVjdCA9IGRldGVjdDtcblxuICByZXR1cm4gYm93c2VyXG59KTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhbk11dGF0aW9uT2JzZXJ2ZXIgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIHZhciBxdWV1ZSA9IFtdO1xuXG4gICAgaWYgKGNhbk11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgICAgICAgdmFyIGhpZGRlbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBxdWV1ZUxpc3QgPSBxdWV1ZS5zbGljZSgpO1xuICAgICAgICAgICAgcXVldWUubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHF1ZXVlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShoaWRkZW5EaXYsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIGlmICghcXVldWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaGlkZGVuRGl2LnNldEF0dHJpYnV0ZSgneWVzJywgJ25vJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCI7KGZ1bmN0aW9uKHJvb3QpIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgY3Jvc3Mgc3RvcmFnZSBjbGllbnQgZ2l2ZW4gdGhlIHVybCB0byBhIGh1Yi4gQnkgZGVmYXVsdCxcbiAgICogYW4gaWZyYW1lIGlzIGNyZWF0ZWQgd2l0aGluIHRoZSBkb2N1bWVudCBib2R5IHRoYXQgcG9pbnRzIHRvIHRoZSB1cmwuIEl0XG4gICAqIGFsc28gYWNjZXB0cyBhbiBvcHRpb25zIG9iamVjdCwgd2hpY2ggbWF5IGluY2x1ZGUgYSB0aW1lb3V0LCBmcmFtZUlkLCBhbmRcbiAgICogcHJvbWlzZS4gVGhlIHRpbWVvdXQsIGluIG1pbGxpc2Vjb25kcywgaXMgYXBwbGllZCB0byBlYWNoIHJlcXVlc3QgYW5kXG4gICAqIGRlZmF1bHRzIHRvIDUwMDBtcy4gVGhlIG9wdGlvbnMgb2JqZWN0IG1heSBhbHNvIGluY2x1ZGUgYSBmcmFtZUlkLFxuICAgKiBpZGVudGlmeWluZyBhbiBleGlzdGluZyBmcmFtZSBvbiB3aGljaCB0byBpbnN0YWxsIGl0cyBsaXN0ZW5lcnMuIElmIHRoZVxuICAgKiBwcm9taXNlIGtleSBpcyBzdXBwbGllZCB0aGUgY29uc3RydWN0b3IgZm9yIGEgUHJvbWlzZSwgdGhhdCBQcm9taXNlIGxpYnJhcnlcbiAgICogd2lsbCBiZSB1c2VkIGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgd2luZG93LlByb21pc2UuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHZhciBzdG9yYWdlID0gbmV3IENyb3NzU3RvcmFnZUNsaWVudCgnaHR0cHM6Ly9zdG9yZS5leGFtcGxlLmNvbS9odWIuaHRtbCcpO1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgc3RvcmFnZSA9IG5ldyBDcm9zc1N0b3JhZ2VDbGllbnQoJ2h0dHBzOi8vc3RvcmUuZXhhbXBsZS5jb20vaHViLmh0bWwnLCB7XG4gICAqICAgdGltZW91dDogNTAwMCxcbiAgICogICBmcmFtZUlkOiAnc3RvcmFnZUZyYW1lJ1xuICAgKiB9KTtcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgICAgVGhlIHVybCB0byBhIGNyb3NzIHN0b3JhZ2UgaHViXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0c10gQW4gb3B0aW9uYWwgb2JqZWN0IGNvbnRhaW5pbmcgYWRkaXRpb25hbCBvcHRpb25zLFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGluZyB0aW1lb3V0LCBmcmFtZUlkLCBhbmQgcHJvbWlzZVxuICAgKlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gICBfaWQgICAgICAgIEEgVVVJRCB2NCBpZFxuICAgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBfcHJvbWlzZSAgIFRoZSBQcm9taXNlIG9iamVjdCB0byB1c2VcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9ICAgX2ZyYW1lSWQgICBUaGUgaWQgb2YgdGhlIGlGcmFtZSBwb2ludGluZyB0byB0aGUgaHViIHVybFxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gICBfb3JpZ2luICAgIFRoZSBodWIncyBvcmlnaW5cbiAgICogQHByb3BlcnR5IHtvYmplY3R9ICAgX3JlcXVlc3RzICBNYXBwaW5nIG9mIHJlcXVlc3QgaWRzIHRvIGNhbGxiYWNrc1xuICAgKiBAcHJvcGVydHkge2Jvb2x9ICAgICBfY29ubmVjdGVkIFdoZXRoZXIgb3Igbm90IGl0IGhhcyBjb25uZWN0ZWRcbiAgICogQHByb3BlcnR5IHtib29sfSAgICAgX2Nsb3NlZCAgICBXaGV0aGVyIG9yIG5vdCB0aGUgY2xpZW50IGhhcyBjbG9zZWRcbiAgICogQHByb3BlcnR5IHtpbnR9ICAgICAgX2NvdW50ICAgICBOdW1iZXIgb2YgcmVxdWVzdHMgc2VudFxuICAgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBfbGlzdGVuZXIgIFRoZSBsaXN0ZW5lciBhZGRlZCB0byB0aGUgd2luZG93XG4gICAqIEBwcm9wZXJ0eSB7V2luZG93fSAgIF9odWIgICAgICAgVGhlIGh1YiB3aW5kb3dcbiAgICovXG4gIGZ1bmN0aW9uIENyb3NzU3RvcmFnZUNsaWVudCh1cmwsIG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcblxuICAgIHRoaXMuX2lkICAgICAgICA9IENyb3NzU3RvcmFnZUNsaWVudC5fZ2VuZXJhdGVVVUlEKCk7XG4gICAgdGhpcy5fcHJvbWlzZSAgID0gb3B0cy5wcm9taXNlIHx8IFByb21pc2U7XG4gICAgdGhpcy5fZnJhbWVJZCAgID0gb3B0cy5mcmFtZUlkIHx8ICdDcm9zc1N0b3JhZ2VDbGllbnQtJyArIHRoaXMuX2lkO1xuICAgIHRoaXMuX29yaWdpbiAgICA9IENyb3NzU3RvcmFnZUNsaWVudC5fZ2V0T3JpZ2luKHVybCk7XG4gICAgdGhpcy5fcmVxdWVzdHMgID0ge307XG4gICAgdGhpcy5fY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5fY2xvc2VkICAgID0gZmFsc2U7XG4gICAgdGhpcy5fY291bnQgICAgID0gMDtcbiAgICB0aGlzLl90aW1lb3V0ICAgPSBvcHRzLnRpbWVvdXQgfHwgNTAwMDtcbiAgICB0aGlzLl9saXN0ZW5lciAgPSBudWxsO1xuXG4gICAgdGhpcy5faW5zdGFsbExpc3RlbmVyKCk7XG5cbiAgICB2YXIgZnJhbWU7XG4gICAgaWYgKG9wdHMuZnJhbWVJZCkge1xuICAgICAgZnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcHRzLmZyYW1lSWQpO1xuICAgIH1cblxuICAgIC8vIElmIHVzaW5nIGEgcGFzc2VkIGlmcmFtZSwgcG9sbCB0aGUgaHViIGZvciBhIHJlYWR5IG1lc3NhZ2VcbiAgICBpZiAoZnJhbWUpIHtcbiAgICAgIHRoaXMuX3BvbGwoKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIGZyYW1lIGlmIG5vdCBmb3VuZCBvciBzcGVjaWZpZWRcbiAgICBmcmFtZSA9IGZyYW1lIHx8IHRoaXMuX2NyZWF0ZUZyYW1lKHVybCk7XG4gICAgdGhpcy5faHViID0gZnJhbWUuY29udGVudFdpbmRvdztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc3R5bGVzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGdlbmVyYXRlZCBpRnJhbWUuIERlZmluZXMgYSBzZXQgb2YgcHJvcGVydGllc1xuICAgKiB0aGF0IGhpZGUgdGhlIGVsZW1lbnQgYnkgcG9zaXRpb25pbmcgaXQgb3V0c2lkZSBvZiB0aGUgdmlzaWJsZSBhcmVhLCBhbmRcbiAgICogYnkgbW9kaWZ5aW5nIGl0cyBkaXNwbGF5LlxuICAgKlxuICAgKiBAbWVtYmVyIHtPYmplY3R9XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQuZnJhbWVTdHlsZSA9IHtcbiAgICBkaXNwbGF5OiAgJ25vbmUnLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogICAgICAnLTk5OXB4JyxcbiAgICBsZWZ0OiAgICAgJy05OTlweCdcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgb3JpZ2luIG9mIGFuIHVybCwgd2l0aCBjcm9zcyBicm93c2VyIHN1cHBvcnQuIEFjY29tbW9kYXRlc1xuICAgKiB0aGUgbGFjayBvZiBsb2NhdGlvbi5vcmlnaW4gaW4gSUUsIGFzIHdlbGwgYXMgdGhlIGRpc2NyZXBhbmNpZXMgaW4gdGhlXG4gICAqIGluY2x1c2lvbiBvZiB0aGUgcG9ydCB3aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHBvcnQgZm9yIGEgcHJvdG9jb2wsIGUuZy5cbiAgICogNDQzIG92ZXIgaHR0cHMuIERlZmF1bHRzIHRvIHRoZSBvcmlnaW4gb2Ygd2luZG93LmxvY2F0aW9uIGlmIHBhc3NlZCBhXG4gICAqIHJlbGF0aXZlIHBhdGguXG4gICAqXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9IHVybCBUaGUgdXJsIHRvIGEgY3Jvc3Mgc3RvcmFnZSBodWJcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIG9yaWdpbiBvZiB0aGUgdXJsXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQuX2dldE9yaWdpbiA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciB1cmksIHByb3RvY29sLCBvcmlnaW47XG5cbiAgICB1cmkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgdXJpLmhyZWYgPSB1cmw7XG5cbiAgICBpZiAoIXVyaS5ob3N0KSB7XG4gICAgICB1cmkgPSB3aW5kb3cubG9jYXRpb247XG4gICAgfVxuXG4gICAgaWYgKCF1cmkucHJvdG9jb2wgfHwgdXJpLnByb3RvY29sID09PSAnOicpIHtcbiAgICAgIHByb3RvY29sID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm90b2NvbCA9IHVyaS5wcm90b2NvbDtcbiAgICB9XG5cbiAgICBvcmlnaW4gPSBwcm90b2NvbCArICcvLycgKyB1cmkuaG9zdDtcbiAgICBvcmlnaW4gPSBvcmlnaW4ucmVwbGFjZSgvOjgwJHw6NDQzJC8sICcnKTtcblxuICAgIHJldHVybiBvcmlnaW47XG4gIH07XG5cbiAgLyoqXG4gICAqIFVVSUQgdjQgZ2VuZXJhdGlvbiwgdGFrZW4gZnJvbTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy9cbiAgICogMTA1MDM0L2hvdy10by1jcmVhdGUtYS1ndWlkLXV1aWQtaW4tamF2YXNjcmlwdC8yMTE3NTIzIzIxMTc1MjNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gQSBVVUlEIHY0IHN0cmluZ1xuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50Ll9nZW5lcmF0ZVVVSUQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNnwwLCB2ID0gYyA9PSAneCcgPyByIDogKHImMHgzfDB4OCk7XG5cbiAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhIGNvbm5lY3Rpb24gaGFzIGJlZW4gZXN0YWJsaXNoZWRcbiAgICogd2l0aCB0aGUgY3Jvc3Mgc3RvcmFnZSBodWIuIEl0cyB1c2UgaXMgcmVxdWlyZWQgdG8gYXZvaWQgc2VuZGluZyBhbnlcbiAgICogcmVxdWVzdHMgcHJpb3IgdG8gaW5pdGlhbGl6YXRpb24gYmVpbmcgY29tcGxldGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCBvbiBjb25uZWN0XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLm9uQ29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjbGllbnQgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX2Nvbm5lY3RlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Byb21pc2UucmVzb2x2ZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fY2xvc2VkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdDcm9zc1N0b3JhZ2VDbGllbnQgaGFzIGNsb3NlZCcpKTtcbiAgICB9XG5cbiAgICAvLyBRdWV1ZSBjb25uZWN0IHJlcXVlc3RzIGZvciBjbGllbnQgcmUtdXNlXG4gICAgaWYgKCF0aGlzLl9yZXF1ZXN0cy5jb25uZWN0KSB7XG4gICAgICB0aGlzLl9yZXF1ZXN0cy5jb25uZWN0ID0gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyB0aGlzLl9wcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKCdDcm9zc1N0b3JhZ2VDbGllbnQgY291bGQgbm90IGNvbm5lY3QnKSk7XG4gICAgICB9LCBjbGllbnQuX3RpbWVvdXQpO1xuXG4gICAgICBjbGllbnQuX3JlcXVlc3RzLmNvbm5lY3QucHVzaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycik7XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgYSBrZXkgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZS4gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgb25cbiAgICogc3VjY2Vzcywgb3IgcmVqZWN0ZWQgaWYgYW55IGVycm9ycyBzZXR0aW5nIHRoZSBrZXkgb2NjdXJyZWQsIG9yIHRoZSByZXF1ZXN0XG4gICAqIHRpbWVkIG91dC5cbiAgICpcbiAgICogQHBhcmFtICAge3N0cmluZ30gIGtleSAgIFRoZSBrZXkgdG8gc2V0XG4gICAqIEBwYXJhbSAgIHsqfSAgICAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uIGh1YiByZXNwb25zZSBvciB0aW1lb3V0XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnc2V0Jywge1xuICAgICAga2V5OiAgIGtleSxcbiAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBY2NlcHRzIG9uZSBvciBtb3JlIGtleXMgZm9yIHdoaWNoIHRvIHJldHJpZXZlIHRoZWlyIHZhbHVlcy4gUmV0dXJucyBhXG4gICAqIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uIGh1YiByZXNwb25zZSBvciB0aW1lb3V0LiBPbiBzdWNjZXNzLCBpdCBpc1xuICAgKiBmdWxmaWxsZWQgd2l0aCB0aGUgdmFsdWUgb2YgdGhlIGtleSBpZiBvbmx5IHBhc3NlZCBhIHNpbmdsZSBhcmd1bWVudC5cbiAgICogT3RoZXJ3aXNlIGl0J3MgcmVzb2x2ZWQgd2l0aCBhbiBhcnJheSBvZiB2YWx1ZXMuIE9uIGZhaWx1cmUsIGl0IGlzIHJlamVjdGVkXG4gICAqIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgZXJyb3IgbWVzc2FnZS5cbiAgICpcbiAgICogQHBhcmFtICAgey4uLnN0cmluZ30ga2V5IFRoZSBrZXkgdG8gcmV0cmlldmVcbiAgICogQHJldHVybnMge1Byb21pc2V9ICAgQSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCBvbiBodWIgcmVzcG9uc2Ugb3IgdGltZW91dFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnZ2V0Jywge2tleXM6IGFyZ3N9KTtcbiAgfTtcblxuICAvKipcbiAgICogQWNjZXB0cyBvbmUgb3IgbW9yZSBrZXlzIGZvciBkZWxldGlvbi4gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uXG4gICAqIGh1YiByZXNwb25zZSBvciB0aW1lb3V0LlxuICAgKlxuICAgKiBAcGFyYW0gICB7Li4uc3RyaW5nfSBrZXkgVGhlIGtleSB0byBkZWxldGVcbiAgICogQHJldHVybnMge1Byb21pc2V9ICAgQSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCBvbiBodWIgcmVzcG9uc2Ugb3IgdGltZW91dFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5kZWwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnZGVsJywge2tleXM6IGFyZ3N9KTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCwgd2hlbiByZXNvbHZlZCwgaW5kaWNhdGVzIHRoYXQgYWxsIGxvY2FsU3RvcmFnZVxuICAgKiBkYXRhIGhhcyBiZWVuIGNsZWFyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uIGh1YiByZXNwb25zZSBvciB0aW1lb3V0XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ2NsZWFyJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQsIHdoZW4gcmVzb2x2ZWQsIHBhc3NlcyBhbiBhcnJheSBvZiBhbGwga2V5c1xuICAgKiBjdXJyZW50bHkgaW4gc3RvcmFnZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgb24gaHViIHJlc3BvbnNlIG9yIHRpbWVvdXRcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuZ2V0S2V5cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdnZXRLZXlzJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgdGhlIGlmcmFtZSBhbmQgc2V0cyB0aGUgY29ubmVjdGVkIHN0YXRlIHRvIGZhbHNlLiBUaGUgY2xpZW50IGNhblxuICAgKiBubyBsb25nZXIgYmUgdXNlZCBhZnRlciBiZWluZyBpbnZva2VkLlxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuX2ZyYW1lSWQpO1xuICAgIGlmIChmcmFtZSkge1xuICAgICAgZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmcmFtZSk7XG4gICAgfVxuXG4gICAgLy8gU3VwcG9ydCBJRTggd2l0aCBkZXRhY2hFdmVudFxuICAgIGlmICh3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLl9saXN0ZW5lciwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuZGV0YWNoRXZlbnQoJ29ubWVzc2FnZScsIHRoaXMuX2xpc3RlbmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9jbG9zZWQgPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbnN0YWxscyB0aGUgbmVjZXNzYXJ5IGxpc3RlbmVyIGZvciB0aGUgd2luZG93IG1lc3NhZ2UgZXZlbnQuIFdoZW4gYSBtZXNzYWdlXG4gICAqIGlzIHJlY2VpdmVkLCB0aGUgY2xpZW50J3MgX2Nvbm5lY3RlZCBzdGF0dXMgaXMgY2hhbmdlZCB0byB0cnVlLCBhbmQgdGhlXG4gICAqIG9uQ29ubmVjdCBwcm9taXNlIGlzIGZ1bGZpbGxlZC4gR2l2ZW4gYSByZXNwb25zZSBtZXNzYWdlLCB0aGUgY2FsbGJhY2tcbiAgICogY29ycmVzcG9uZGluZyB0byBpdHMgcmVxdWVzdCBpcyBpbnZva2VkLiBJZiByZXNwb25zZS5lcnJvciBob2xkcyBhIHRydXRoeVxuICAgKiB2YWx1ZSwgdGhlIHByb21pc2UgYXNzb2NpYXRlZCB3aXRoIHRoZSBvcmlnaW5hbCByZXF1ZXN0IGlzIHJlamVjdGVkIHdpdGhcbiAgICogdGhlIGVycm9yLiBPdGhlcndpc2UgdGhlIHByb21pc2UgaXMgZnVsZmlsbGVkIGFuZCBwYXNzZWQgcmVzcG9uc2UucmVzdWx0LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5faW5zdGFsbExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNsaWVudCA9IHRoaXM7XG5cbiAgICB0aGlzLl9saXN0ZW5lciA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIHZhciBpLCBvcmlnaW4sIGVycm9yLCByZXNwb25zZTtcblxuICAgICAgLy8gSWdub3JlIGludmFsaWQgbWVzc2FnZXMgb3IgdGhvc2UgYWZ0ZXIgdGhlIGNsaWVudCBoYXMgY2xvc2VkXG4gICAgICBpZiAoY2xpZW50Ll9jbG9zZWQgfHwgIW1lc3NhZ2UuZGF0YSB8fCB0eXBlb2YgbWVzc2FnZS5kYXRhICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIHBvc3RNZXNzYWdlIHJldHVybnMgdGhlIHN0cmluZyBcIm51bGxcIiBhcyB0aGUgb3JpZ2luIGZvciBcImZpbGU6Ly9cIlxuICAgICAgb3JpZ2luID0gKG1lc3NhZ2Uub3JpZ2luID09PSAnbnVsbCcpID8gJ2ZpbGU6Ly8nIDogbWVzc2FnZS5vcmlnaW47XG5cbiAgICAgIC8vIElnbm9yZSBtZXNzYWdlcyBub3QgZnJvbSB0aGUgY29ycmVjdCBvcmlnaW5cbiAgICAgIGlmIChvcmlnaW4gIT09IGNsaWVudC5fb3JpZ2luKSByZXR1cm47XG5cbiAgICAgIC8vIExvY2FsU3RvcmFnZSBpc24ndCBhdmFpbGFibGUgaW4gdGhlIGh1YlxuICAgICAgaWYgKG1lc3NhZ2UuZGF0YSA9PT0gJ2Nyb3NzLXN0b3JhZ2U6dW5hdmFpbGFibGUnKSB7XG4gICAgICAgIGlmICghY2xpZW50Ll9jbG9zZWQpIGNsaWVudC5jbG9zZSgpO1xuICAgICAgICBpZiAoIWNsaWVudC5fcmVxdWVzdHMuY29ubmVjdCkgcmV0dXJuO1xuXG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdDbG9zaW5nIGNsaWVudC4gQ291bGQgbm90IGFjY2VzcyBsb2NhbFN0b3JhZ2UgaW4gaHViLicpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2xpZW50Ll9yZXF1ZXN0cy5jb25uZWN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY2xpZW50Ll9yZXF1ZXN0cy5jb25uZWN0W2ldKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIGluaXRpYWwgY29ubmVjdGlvblxuICAgICAgaWYgKG1lc3NhZ2UuZGF0YS5pbmRleE9mKCdjcm9zcy1zdG9yYWdlOicpICE9PSAtMSAmJiAhY2xpZW50Ll9jb25uZWN0ZWQpIHtcbiAgICAgICAgY2xpZW50Ll9jb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICBpZiAoIWNsaWVudC5fcmVxdWVzdHMuY29ubmVjdCkgcmV0dXJuO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjbGllbnQuX3JlcXVlc3RzLmNvbm5lY3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjbGllbnQuX3JlcXVlc3RzLmNvbm5lY3RbaV0oZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBjbGllbnQuX3JlcXVlc3RzLmNvbm5lY3Q7XG4gICAgICB9XG5cbiAgICAgIGlmIChtZXNzYWdlLmRhdGEgPT09ICdjcm9zcy1zdG9yYWdlOnJlYWR5JykgcmV0dXJuO1xuXG4gICAgICAvLyBBbGwgb3RoZXIgbWVzc2FnZXNcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXNwb25zZS5pZCkgcmV0dXJuO1xuXG4gICAgICBpZiAoY2xpZW50Ll9yZXF1ZXN0c1tyZXNwb25zZS5pZF0pIHtcbiAgICAgICAgY2xpZW50Ll9yZXF1ZXN0c1tyZXNwb25zZS5pZF0ocmVzcG9uc2UuZXJyb3IsIHJlc3BvbnNlLnJlc3VsdCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFN1cHBvcnQgSUU4IHdpdGggYXR0YWNoRXZlbnRcbiAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5fbGlzdGVuZXIsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmF0dGFjaEV2ZW50KCdvbm1lc3NhZ2UnLCB0aGlzLl9saXN0ZW5lcik7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoZW4gYSBmcmFtZSBpZCB3YXMgcGFzc2VkIHRvIHRoZSBjbGllbnQsIHJhdGhlciB0aGFuIGFsbG93aW5nXG4gICAqIHRoZSBjbGllbnQgdG8gY3JlYXRlIGl0cyBvd24gaWZyYW1lLiBQb2xscyB0aGUgaHViIGZvciBhIHJlYWR5IGV2ZW50IHRvXG4gICAqIGVzdGFibGlzaCBhIGNvbm5lY3RlZCBzdGF0ZS5cbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuX3BvbGwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2xpZW50LCBpbnRlcnZhbCwgdGFyZ2V0T3JpZ2luO1xuXG4gICAgY2xpZW50ID0gdGhpcztcblxuICAgIC8vIHBvc3RNZXNzYWdlIHJlcXVpcmVzIHRoYXQgdGhlIHRhcmdldCBvcmlnaW4gYmUgc2V0IHRvIFwiKlwiIGZvciBcImZpbGU6Ly9cIlxuICAgIHRhcmdldE9yaWdpbiA9IChjbGllbnQuX29yaWdpbiA9PT0gJ2ZpbGU6Ly8nKSA/ICcqJyA6IGNsaWVudC5fb3JpZ2luO1xuXG4gICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIGlmIChjbGllbnQuX2Nvbm5lY3RlZCkgcmV0dXJuIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgaWYgKCFjbGllbnQuX2h1YikgcmV0dXJuO1xuXG4gICAgICBjbGllbnQuX2h1Yi5wb3N0TWVzc2FnZSgnY3Jvc3Mtc3RvcmFnZTpwb2xsJywgdGFyZ2V0T3JpZ2luKTtcbiAgICB9LCAxMDAwKTtcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpRnJhbWUgY29udGFpbmluZyB0aGUgaHViLiBBcHBsaWVzIHRoZSBuZWNlc3Nhcnkgc3R5bGVzIHRvXG4gICAqIGhpZGUgdGhlIGVsZW1lbnQgZnJvbSB2aWV3LCBwcmlvciB0byBhZGRpbmcgaXQgdG8gdGhlIGRvY3VtZW50IGJvZHkuXG4gICAqIFJldHVybnMgdGhlIGNyZWF0ZWQgZWxlbWVudC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgIHVybCBUaGUgdXJsIHRvIHRoZSBodWJcbiAgICogcmV0dXJucyB7SFRNTElGcmFtZUVsZW1lbnR9IFRoZSBpRnJhbWUgZWxlbWVudCBpdHNlbGZcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuX2NyZWF0ZUZyYW1lID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGZyYW1lLCBrZXk7XG5cbiAgICBmcmFtZSA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICBmcmFtZS5pZCA9IHRoaXMuX2ZyYW1lSWQ7XG5cbiAgICAvLyBTdHlsZSB0aGUgaWZyYW1lXG4gICAgZm9yIChrZXkgaW4gQ3Jvc3NTdG9yYWdlQ2xpZW50LmZyYW1lU3R5bGUpIHtcbiAgICAgIGlmIChDcm9zc1N0b3JhZ2VDbGllbnQuZnJhbWVTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGZyYW1lLnN0eWxlW2tleV0gPSBDcm9zc1N0b3JhZ2VDbGllbnQuZnJhbWVTdHlsZVtrZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZyYW1lKTtcbiAgICBmcmFtZS5zcmMgPSB1cmw7XG5cbiAgICByZXR1cm4gZnJhbWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSBjb250YWluaW5nIHRoZSBnaXZlbiBtZXRob2QgYW5kIHBhcmFtcyB0byB0aGUgaHViLiBTdG9yZXNcbiAgICogYSBjYWxsYmFjayBpbiB0aGUgX3JlcXVlc3RzIG9iamVjdCBmb3IgbGF0ZXIgaW52b2NhdGlvbiBvbiBtZXNzYWdlLCBvclxuICAgKiBkZWxldGlvbiBvbiB0aW1lb3V0LiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgaW4gZWl0aGVyIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0gICB7c3RyaW5nfSAgbWV0aG9kIFRoZSBtZXRob2QgdG8gaW52b2tlXG4gICAqIEBwYXJhbSAgIHsqfSAgICAgICBwYXJhbXMgVGhlIGFyZ3VtZW50cyB0byBwYXNzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uIGh1YiByZXNwb25zZSBvciB0aW1lb3V0XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLl9yZXF1ZXN0ID0gZnVuY3Rpb24obWV0aG9kLCBwYXJhbXMpIHtcbiAgICB2YXIgcmVxLCBjbGllbnQ7XG5cbiAgICBpZiAodGhpcy5fY2xvc2VkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdDcm9zc1N0b3JhZ2VDbGllbnQgaGFzIGNsb3NlZCcpKTtcbiAgICB9XG5cbiAgICBjbGllbnQgPSB0aGlzO1xuICAgIGNsaWVudC5fY291bnQrKztcblxuICAgIHJlcSA9IHtcbiAgICAgIGlkOiAgICAgdGhpcy5faWQgKyAnOicgKyBjbGllbnQuX2NvdW50LFxuICAgICAgbWV0aG9kOiAnY3Jvc3Mtc3RvcmFnZTonICsgbWV0aG9kLFxuICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyB0aGlzLl9wcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHRpbWVvdXQsIG9yaWdpbmFsVG9KU09OLCB0YXJnZXRPcmlnaW47XG5cbiAgICAgIC8vIFRpbWVvdXQgaWYgYSByZXNwb25zZSBpc24ndCByZWNlaXZlZCBhZnRlciA0c1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghY2xpZW50Ll9yZXF1ZXN0c1tyZXEuaWRdKSByZXR1cm47XG5cbiAgICAgICAgZGVsZXRlIGNsaWVudC5fcmVxdWVzdHNbcmVxLmlkXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignVGltZW91dDogY291bGQgbm90IHBlcmZvcm0gJyArIHJlcS5tZXRob2QpKTtcbiAgICAgIH0sIGNsaWVudC5fdGltZW91dCk7XG5cbiAgICAgIC8vIEFkZCByZXF1ZXN0IGNhbGxiYWNrXG4gICAgICBjbGllbnQuX3JlcXVlc3RzW3JlcS5pZF0gPSBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIGRlbGV0ZSBjbGllbnQuX3JlcXVlc3RzW3JlcS5pZF07XG4gICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QobmV3IEVycm9yKGVycikpO1xuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBJbiBjYXNlIHdlIGhhdmUgYSBicm9rZW4gQXJyYXkucHJvdG90eXBlLnRvSlNPTiwgZS5nLiBiZWNhdXNlIG9mXG4gICAgICAvLyBvbGQgdmVyc2lvbnMgb2YgcHJvdG90eXBlXG4gICAgICBpZiAoQXJyYXkucHJvdG90eXBlLnRvSlNPTikge1xuICAgICAgICBvcmlnaW5hbFRvSlNPTiA9IEFycmF5LnByb3RvdHlwZS50b0pTT047XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS50b0pTT04gPSBudWxsO1xuICAgICAgfVxuXG4gICAgICAvLyBwb3N0TWVzc2FnZSByZXF1aXJlcyB0aGF0IHRoZSB0YXJnZXQgb3JpZ2luIGJlIHNldCB0byBcIipcIiBmb3IgXCJmaWxlOi8vXCJcbiAgICAgIHRhcmdldE9yaWdpbiA9IChjbGllbnQuX29yaWdpbiA9PT0gJ2ZpbGU6Ly8nKSA/ICcqJyA6IGNsaWVudC5fb3JpZ2luO1xuXG4gICAgICAvLyBTZW5kIHNlcmlhbGl6ZWQgbWVzc2FnZVxuICAgICAgY2xpZW50Ll9odWIucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkocmVxKSwgdGFyZ2V0T3JpZ2luKTtcblxuICAgICAgLy8gUmVzdG9yZSBvcmlnaW5hbCB0b0pTT05cbiAgICAgIGlmIChvcmlnaW5hbFRvSlNPTikge1xuICAgICAgICBBcnJheS5wcm90b3R5cGUudG9KU09OID0gb3JpZ2luYWxUb0pTT047XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEV4cG9ydCBmb3IgdmFyaW91cyBlbnZpcm9ubWVudHMuXG4gICAqL1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENyb3NzU3RvcmFnZUNsaWVudDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBleHBvcnRzLkNyb3NzU3RvcmFnZUNsaWVudCA9IENyb3NzU3RvcmFnZUNsaWVudDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIENyb3NzU3RvcmFnZUNsaWVudDtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByb290LkNyb3NzU3RvcmFnZUNsaWVudCA9IENyb3NzU3RvcmFnZUNsaWVudDtcbiAgfVxufSh0aGlzKSk7XG4iLCI7KGZ1bmN0aW9uKHJvb3QpIHtcbiAgdmFyIENyb3NzU3RvcmFnZUh1YiA9IHt9O1xuXG4gIC8qKlxuICAgKiBBY2NlcHRzIGFuIGFycmF5IG9mIG9iamVjdHMgd2l0aCB0d28ga2V5czogb3JpZ2luIGFuZCBhbGxvdy4gVGhlIHZhbHVlXG4gICAqIG9mIG9yaWdpbiBpcyBleHBlY3RlZCB0byBiZSBhIFJlZ0V4cCwgYW5kIGFsbG93LCBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICAgKiBUaGUgY3Jvc3Mgc3RvcmFnZSBodWIgaXMgdGhlbiBpbml0aWFsaXplZCB0byBhY2NlcHQgcmVxdWVzdHMgZnJvbSBhbnkgb2ZcbiAgICogdGhlIG1hdGNoaW5nIG9yaWdpbnMsIGFsbG93aW5nIGFjY2VzcyB0byB0aGUgYXNzb2NpYXRlZCBsaXN0cyBvZiBtZXRob2RzLlxuICAgKiBNZXRob2RzIG1heSBpbmNsdWRlIGFueSBvZjogZ2V0LCBzZXQsIGRlbCwgZ2V0S2V5cyBhbmQgY2xlYXIuIEEgJ3JlYWR5J1xuICAgKiBtZXNzYWdlIGlzIHNlbnQgdG8gdGhlIHBhcmVudCB3aW5kb3cgb25jZSBjb21wbGV0ZS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gU3ViZG9tYWluIGNhbiBnZXQsIGJ1dCBvbmx5IHJvb3QgZG9tYWluIGNhbiBzZXQgYW5kIGRlbFxuICAgKiBDcm9zc1N0b3JhZ2VIdWIuaW5pdChbXG4gICAqICAge29yaWdpbjogL1xcLmV4YW1wbGUuY29tJC8sICAgICAgICBhbGxvdzogWydnZXQnXX0sXG4gICAqICAge29yaWdpbjogLzood3d3XFwuKT9leGFtcGxlLmNvbSQvLCBhbGxvdzogWydnZXQnLCAnc2V0JywgJ2RlbCddfVxuICAgKiBdKTtcbiAgICpcbiAgICogQHBhcmFtIHthcnJheX0gcGVybWlzc2lvbnMgQW4gYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIG9yaWdpbiBhbmQgYWxsb3dcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5pbml0ID0gZnVuY3Rpb24ocGVybWlzc2lvbnMpIHtcbiAgICB2YXIgYXZhaWxhYmxlID0gdHJ1ZTtcblxuICAgIC8vIFJldHVybiBpZiBsb2NhbFN0b3JhZ2UgaXMgdW5hdmFpbGFibGUsIG9yIHRoaXJkIHBhcnR5XG4gICAgLy8gYWNjZXNzIGlzIGRpc2FibGVkXG4gICAgdHJ5IHtcbiAgICAgIGlmICghd2luZG93LmxvY2FsU3RvcmFnZSkgYXZhaWxhYmxlID0gZmFsc2U7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgYXZhaWxhYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFhdmFpbGFibGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKCdjcm9zcy1zdG9yYWdlOnVuYXZhaWxhYmxlJywgJyonKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIENyb3NzU3RvcmFnZUh1Yi5fcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucyB8fCBbXTtcbiAgICBDcm9zc1N0b3JhZ2VIdWIuX2luc3RhbGxMaXN0ZW5lcigpO1xuICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoJ2Nyb3NzLXN0b3JhZ2U6cmVhZHknLCAnKicpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbnN0YWxscyB0aGUgbmVjZXNzYXJ5IGxpc3RlbmVyIGZvciB0aGUgd2luZG93IG1lc3NhZ2UgZXZlbnQuIEFjY29tbW9kYXRlc1xuICAgKiBJRTggYW5kIHVwLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9pbnN0YWxsTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGlzdGVuZXIgPSBDcm9zc1N0b3JhZ2VIdWIuX2xpc3RlbmVyO1xuICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuYXR0YWNoRXZlbnQoJ29ubWVzc2FnZScsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoZSBtZXNzYWdlIGhhbmRsZXIgZm9yIGFsbCByZXF1ZXN0cyBwb3N0ZWQgdG8gdGhlIHdpbmRvdy4gSXQgaWdub3JlcyBhbnlcbiAgICogbWVzc2FnZXMgaGF2aW5nIGFuIG9yaWdpbiB0aGF0IGRvZXMgbm90IG1hdGNoIHRoZSBvcmlnaW5hbGx5IHN1cHBsaWVkXG4gICAqIHBhdHRlcm4uIEdpdmVuIGEgSlNPTiBvYmplY3Qgd2l0aCBvbmUgb2YgZ2V0LCBzZXQsIGRlbCBvciBnZXRLZXlzIGFzIHRoZVxuICAgKiBtZXRob2QsIHRoZSBmdW5jdGlvbiBwZXJmb3JtcyB0aGUgcmVxdWVzdGVkIGFjdGlvbiBhbmQgcmV0dXJucyBpdHMgcmVzdWx0LlxuICAgKlxuICAgKiBAcGFyYW0ge01lc3NhZ2VFdmVudH0gbWVzc2FnZSBBIG1lc3NhZ2UgdG8gYmUgcHJvY2Vzc2VkXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX2xpc3RlbmVyID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIHZhciBvcmlnaW4sIHRhcmdldE9yaWdpbiwgcmVxdWVzdCwgbWV0aG9kLCBlcnJvciwgcmVzdWx0LCByZXNwb25zZTtcblxuICAgIC8vIHBvc3RNZXNzYWdlIHJldHVybnMgdGhlIHN0cmluZyBcIm51bGxcIiBhcyB0aGUgb3JpZ2luIGZvciBcImZpbGU6Ly9cIlxuICAgIG9yaWdpbiA9IChtZXNzYWdlLm9yaWdpbiA9PT0gJ251bGwnKSA/ICdmaWxlOi8vJyA6IG1lc3NhZ2Uub3JpZ2luO1xuXG4gICAgLy8gSGFuZGxlIHBvbGxpbmcgZm9yIGEgcmVhZHkgbWVzc2FnZVxuICAgIGlmIChtZXNzYWdlLmRhdGEgPT09ICdjcm9zcy1zdG9yYWdlOnBvbGwnKSB7XG4gICAgICByZXR1cm4gd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSgnY3Jvc3Mtc3RvcmFnZTpyZWFkeScsIG1lc3NhZ2Uub3JpZ2luKTtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgdGhlIHJlYWR5IG1lc3NhZ2Ugd2hlbiB2aWV3aW5nIHRoZSBodWIgZGlyZWN0bHlcbiAgICBpZiAobWVzc2FnZS5kYXRhID09PSAnY3Jvc3Mtc3RvcmFnZTpyZWFkeScpIHJldHVybjtcblxuICAgIC8vIENoZWNrIHdoZXRoZXIgbWVzc2FnZS5kYXRhIGlzIGEgdmFsaWQganNvblxuICAgIHRyeSB7XG4gICAgICByZXF1ZXN0ID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIHdoZXRoZXIgcmVxdWVzdC5tZXRob2QgaXMgYSBzdHJpbmdcbiAgICBpZiAoIXJlcXVlc3QgfHwgdHlwZW9mIHJlcXVlc3QubWV0aG9kICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1ldGhvZCA9IHJlcXVlc3QubWV0aG9kLnNwbGl0KCdjcm9zcy1zdG9yYWdlOicpWzFdO1xuXG4gICAgaWYgKCFtZXRob2QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKCFDcm9zc1N0b3JhZ2VIdWIuX3Blcm1pdHRlZChvcmlnaW4sIG1ldGhvZCkpIHtcbiAgICAgIGVycm9yID0gJ0ludmFsaWQgcGVybWlzc2lvbnMgZm9yICcgKyBtZXRob2Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IENyb3NzU3RvcmFnZUh1YlsnXycgKyBtZXRob2RdKHJlcXVlc3QucGFyYW1zKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBlcnJvciA9IGVyci5tZXNzYWdlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3BvbnNlID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgaWQ6IHJlcXVlc3QuaWQsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgICByZXN1bHQ6IHJlc3VsdFxuICAgIH0pO1xuXG4gICAgLy8gcG9zdE1lc3NhZ2UgcmVxdWlyZXMgdGhhdCB0aGUgdGFyZ2V0IG9yaWdpbiBiZSBzZXQgdG8gXCIqXCIgZm9yIFwiZmlsZTovL1wiXG4gICAgdGFyZ2V0T3JpZ2luID0gKG9yaWdpbiA9PT0gJ2ZpbGU6Ly8nKSA/ICcqJyA6IG9yaWdpbjtcblxuICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UocmVzcG9uc2UsIHRhcmdldE9yaWdpbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciBvciBub3QgdGhlIHJlcXVlc3RlZCBtZXRob2QgaXNcbiAgICogcGVybWl0dGVkIGZvciB0aGUgZ2l2ZW4gb3JpZ2luLiBUaGUgYXJndW1lbnQgcGFzc2VkIHRvIG1ldGhvZCBpcyBleHBlY3RlZFxuICAgKiB0byBiZSBvbmUgb2YgJ2dldCcsICdzZXQnLCAnZGVsJyBvciAnZ2V0S2V5cycuXG4gICAqXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9IG9yaWdpbiBUaGUgb3JpZ2luIGZvciB3aGljaCB0byBkZXRlcm1pbmUgcGVybWlzc2lvbnNcbiAgICogQHBhcmFtICAge3N0cmluZ30gbWV0aG9kIFJlcXVlc3RlZCBhY3Rpb25cbiAgICogQHJldHVybnMge2Jvb2x9ICAgV2hldGhlciBvciBub3QgdGhlIHJlcXVlc3QgaXMgcGVybWl0dGVkXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX3Blcm1pdHRlZCA9IGZ1bmN0aW9uKG9yaWdpbiwgbWV0aG9kKSB7XG4gICAgdmFyIGF2YWlsYWJsZSwgaSwgZW50cnksIG1hdGNoO1xuXG4gICAgYXZhaWxhYmxlID0gWydnZXQnLCAnc2V0JywgJ2RlbCcsICdjbGVhcicsICdnZXRLZXlzJ107XG4gICAgaWYgKCFDcm9zc1N0b3JhZ2VIdWIuX2luQXJyYXkobWV0aG9kLCBhdmFpbGFibGUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IENyb3NzU3RvcmFnZUh1Yi5fcGVybWlzc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGVudHJ5ID0gQ3Jvc3NTdG9yYWdlSHViLl9wZXJtaXNzaW9uc1tpXTtcbiAgICAgIGlmICghKGVudHJ5Lm9yaWdpbiBpbnN0YW5jZW9mIFJlZ0V4cCkgfHwgIShlbnRyeS5hbGxvdyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbWF0Y2ggPSBlbnRyeS5vcmlnaW4udGVzdChvcmlnaW4pO1xuICAgICAgaWYgKG1hdGNoICYmIENyb3NzU3RvcmFnZUh1Yi5faW5BcnJheShtZXRob2QsIGVudHJ5LmFsbG93KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgYSBrZXkgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBBbiBvYmplY3Qgd2l0aCBrZXkgYW5kIHZhbHVlXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX3NldCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShwYXJhbXMua2V5LCBwYXJhbXMudmFsdWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBY2NlcHRzIGFuIG9iamVjdCB3aXRoIGFuIGFycmF5IG9mIGtleXMgZm9yIHdoaWNoIHRvIHJldHJpZXZlIHRoZWlyIHZhbHVlcy5cbiAgICogUmV0dXJucyBhIHNpbmdsZSB2YWx1ZSBpZiBvbmx5IG9uZSBrZXkgd2FzIHN1cHBsaWVkLCBvdGhlcndpc2UgaXQgcmV0dXJuc1xuICAgKiBhbiBhcnJheS4gQW55IGtleXMgbm90IHNldCByZXN1bHQgaW4gYSBudWxsIGVsZW1lbnQgaW4gdGhlIHJlc3VsdGluZyBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtICAge29iamVjdH0gcGFyYW1zIEFuIG9iamVjdCB3aXRoIGFuIGFycmF5IG9mIGtleXNcbiAgICogQHJldHVybnMgeyp8KltdfSAgRWl0aGVyIGEgc2luZ2xlIHZhbHVlLCBvciBhbiBhcnJheVxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9nZXQgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICB2YXIgc3RvcmFnZSwgcmVzdWx0LCBpLCB2YWx1ZTtcblxuICAgIHN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHBhcmFtcy5rZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IHN0b3JhZ2UuZ2V0SXRlbShwYXJhbXMua2V5c1tpXSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiAocmVzdWx0Lmxlbmd0aCA+IDEpID8gcmVzdWx0IDogcmVzdWx0WzBdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZWxldGVzIGFsbCBrZXlzIHNwZWNpZmllZCBpbiB0aGUgYXJyYXkgZm91bmQgYXQgcGFyYW1zLmtleXMuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgQW4gb2JqZWN0IHdpdGggYW4gYXJyYXkgb2Yga2V5c1xuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9kZWwgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtcy5rZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0ocGFyYW1zLmtleXNbaV0pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ2xlYXJzIGxvY2FsU3RvcmFnZS5cbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5fY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIGtleXMgc3RvcmVkIGluIGxvY2FsU3RvcmFnZS5cbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ1tdfSBUaGUgYXJyYXkgb2Yga2V5c1xuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9nZXRLZXlzID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgdmFyIGksIGxlbmd0aCwga2V5cztcblxuICAgIGtleXMgPSBbXTtcbiAgICBsZW5ndGggPSB3aW5kb3cubG9jYWxTdG9yYWdlLmxlbmd0aDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5cy5wdXNoKHdpbmRvdy5sb2NhbFN0b3JhZ2Uua2V5KGkpKTtcbiAgICB9XG5cbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIHZhbHVlIGlzIHByZXNlbnQgaW4gdGhlIGFycmF5LiBDb25zaXN0cyBvZiBhblxuICAgKiBhbHRlcm5hdGl2ZSB0byBleHRlbmRpbmcgdGhlIGFycmF5IHByb3RvdHlwZSBmb3IgaW5kZXhPZiwgc2luY2UgaXQnc1xuICAgKiB1bmF2YWlsYWJsZSBmb3IgSUU4LlxuICAgKlxuICAgKiBAcGFyYW0gICB7Kn0gICAgdmFsdWUgVGhlIHZhbHVlIHRvIGZpbmRcbiAgICogQHBhcm1hICAge1tdKn0gIGFycmF5IFRoZSBhcnJheSBpbiB3aGljaCB0byBzZWFyY2hcbiAgICogQHJldHVybnMge2Jvb2x9IFdoZXRoZXIgb3Igbm90IHRoZSB2YWx1ZSB3YXMgZm91bmRcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5faW5BcnJheSA9IGZ1bmN0aW9uKHZhbHVlLCBhcnJheSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gYXJyYXlbaV0pIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvKipcbiAgICogQSBjcm9zcy1icm93c2VyIHZlcnNpb24gb2YgRGF0ZS5ub3cgY29tcGF0aWJsZSB3aXRoIElFOCB0aGF0IGF2b2lkc1xuICAgKiBtb2RpZnlpbmcgdGhlIERhdGUgb2JqZWN0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtpbnR9IFRoZSBjdXJyZW50IHRpbWVzdGFtcCBpbiBtaWxsaXNlY29uZHNcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5fbm93ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZiBEYXRlLm5vdyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIERhdGUubm93KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBFeHBvcnQgZm9yIHZhcmlvdXMgZW52aXJvbm1lbnRzLlxuICAgKi9cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDcm9zc1N0b3JhZ2VIdWI7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZXhwb3J0cy5Dcm9zc1N0b3JhZ2VIdWIgPSBDcm9zc1N0b3JhZ2VIdWI7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBDcm9zc1N0b3JhZ2VIdWI7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5Dcm9zc1N0b3JhZ2VIdWIgPSBDcm9zc1N0b3JhZ2VIdWI7XG4gIH1cbn0odGhpcykpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIENyb3NzU3RvcmFnZUNsaWVudDogcmVxdWlyZSgnLi9jbGllbnQuanMnKSxcbiAgQ3Jvc3NTdG9yYWdlSHViOiAgICByZXF1aXJlKCcuL2h1Yi5qcycpXG59O1xuIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCl7XG4vKiFcbiAqIEBvdmVydmlldyBlczYtcHJvbWlzZSAtIGEgdGlueSBpbXBsZW1lbnRhdGlvbiBvZiBQcm9taXNlcy9BKy5cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE0IFllaHVkYSBLYXR6LCBUb20gRGFsZSwgU3RlZmFuIFBlbm5lciBhbmQgY29udHJpYnV0b3JzIChDb252ZXJzaW9uIHRvIEVTNiBBUEkgYnkgSmFrZSBBcmNoaWJhbGQpXG4gKiBAbGljZW5zZSAgIExpY2Vuc2VkIHVuZGVyIE1JVCBsaWNlbnNlXG4gKiAgICAgICAgICAgIFNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vc3RlZmFucGVubmVyL2VzNi1wcm9taXNlL21hc3Rlci9MSUNFTlNFXG4gKiBAdmVyc2lvbiAgIDQuMC41XG4gKi9cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgICAoZ2xvYmFsLkVTNlByb21pc2UgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG5cbnZhciBfaXNBcnJheSA9IHVuZGVmaW5lZDtcbmlmICghQXJyYXkuaXNBcnJheSkge1xuICBfaXNBcnJheSA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcbn0gZWxzZSB7XG4gIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbn1cblxudmFyIGlzQXJyYXkgPSBfaXNBcnJheTtcblxudmFyIGxlbiA9IDA7XG52YXIgdmVydHhOZXh0ID0gdW5kZWZpbmVkO1xudmFyIGN1c3RvbVNjaGVkdWxlckZuID0gdW5kZWZpbmVkO1xuXG52YXIgYXNhcCA9IGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICBxdWV1ZVtsZW5dID0gY2FsbGJhY2s7XG4gIHF1ZXVlW2xlbiArIDFdID0gYXJnO1xuICBsZW4gKz0gMjtcbiAgaWYgKGxlbiA9PT0gMikge1xuICAgIC8vIElmIGxlbiBpcyAyLCB0aGF0IG1lYW5zIHRoYXQgd2UgbmVlZCB0byBzY2hlZHVsZSBhbiBhc3luYyBmbHVzaC5cbiAgICAvLyBJZiBhZGRpdGlvbmFsIGNhbGxiYWNrcyBhcmUgcXVldWVkIGJlZm9yZSB0aGUgcXVldWUgaXMgZmx1c2hlZCwgdGhleVxuICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICBpZiAoY3VzdG9tU2NoZWR1bGVyRm4pIHtcbiAgICAgIGN1c3RvbVNjaGVkdWxlckZuKGZsdXNoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NoZWR1bGVGbHVzaCgpO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gc2V0U2NoZWR1bGVyKHNjaGVkdWxlRm4pIHtcbiAgY3VzdG9tU2NoZWR1bGVyRm4gPSBzY2hlZHVsZUZuO1xufVxuXG5mdW5jdGlvbiBzZXRBc2FwKGFzYXBGbikge1xuICBhc2FwID0gYXNhcEZuO1xufVxuXG52YXIgYnJvd3NlcldpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdW5kZWZpbmVkO1xudmFyIGJyb3dzZXJHbG9iYWwgPSBicm93c2VyV2luZG93IHx8IHt9O1xudmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBpc05vZGUgPSB0eXBlb2Ygc2VsZiA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICh7fSkudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xuXG4vLyB0ZXN0IGZvciB3ZWIgd29ya2VyIGJ1dCBub3QgaW4gSUUxMFxudmFyIGlzV29ya2VyID0gdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAndW5kZWZpbmVkJztcblxuLy8gbm9kZVxuZnVuY3Rpb24gdXNlTmV4dFRpY2soKSB7XG4gIC8vIG5vZGUgdmVyc2lvbiAwLjEwLnggZGlzcGxheXMgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdoZW4gbmV4dFRpY2sgaXMgdXNlZCByZWN1cnNpdmVseVxuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1am9qcy93aGVuL2lzc3Vlcy80MTAgZm9yIGRldGFpbHNcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gIH07XG59XG5cbi8vIHZlcnR4XG5mdW5jdGlvbiB1c2VWZXJ0eFRpbWVyKCkge1xuICBpZiAodHlwZW9mIHZlcnR4TmV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmVydHhOZXh0KGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbn1cblxuZnVuY3Rpb24gdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBub2RlLmRhdGEgPSBpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMjtcbiAgfTtcbn1cblxuLy8gd2ViIHdvcmtlclxuZnVuY3Rpb24gdXNlTWVzc2FnZUNoYW5uZWwoKSB7XG4gIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZmx1c2g7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gIC8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIGVzNi1wcm9taXNlIHdpbGwgYmUgdW5hZmZlY3RlZCBieVxuICAvLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbiAgdmFyIGdsb2JhbFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnbG9iYWxTZXRUaW1lb3V0KGZsdXNoLCAxKTtcbiAgfTtcbn1cblxudmFyIHF1ZXVlID0gbmV3IEFycmF5KDEwMDApO1xuZnVuY3Rpb24gZmx1c2goKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSBxdWV1ZVtpXTtcbiAgICB2YXIgYXJnID0gcXVldWVbaSArIDFdO1xuXG4gICAgY2FsbGJhY2soYXJnKTtcblxuICAgIHF1ZXVlW2ldID0gdW5kZWZpbmVkO1xuICAgIHF1ZXVlW2kgKyAxXSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxlbiA9IDA7XG59XG5cbmZ1bmN0aW9uIGF0dGVtcHRWZXJ0eCgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgciA9IHJlcXVpcmU7XG4gICAgdmFyIHZlcnR4ID0gcigndmVydHgnKTtcbiAgICB2ZXJ0eE5leHQgPSB2ZXJ0eC5ydW5Pbkxvb3AgfHwgdmVydHgucnVuT25Db250ZXh0O1xuICAgIHJldHVybiB1c2VWZXJ0eFRpbWVyKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdXNlU2V0VGltZW91dCgpO1xuICB9XG59XG5cbnZhciBzY2hlZHVsZUZsdXNoID0gdW5kZWZpbmVkO1xuLy8gRGVjaWRlIHdoYXQgYXN5bmMgbWV0aG9kIHRvIHVzZSB0byB0cmlnZ2VyaW5nIHByb2Nlc3Npbmcgb2YgcXVldWVkIGNhbGxiYWNrczpcbmlmIChpc05vZGUpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU5leHRUaWNrKCk7XG59IGVsc2UgaWYgKEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG59IGVsc2UgaWYgKGlzV29ya2VyKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VNZXNzYWdlQ2hhbm5lbCgpO1xufSBlbHNlIGlmIChicm93c2VyV2luZG93ID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IGF0dGVtcHRWZXJ0eCgpO1xufSBlbHNlIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZVNldFRpbWVvdXQoKTtcbn1cblxuZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICB2YXIgX2FyZ3VtZW50cyA9IGFyZ3VtZW50cztcblxuICB2YXIgcGFyZW50ID0gdGhpcztcblxuICB2YXIgY2hpbGQgPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcihub29wKTtcblxuICBpZiAoY2hpbGRbUFJPTUlTRV9JRF0gPT09IHVuZGVmaW5lZCkge1xuICAgIG1ha2VQcm9taXNlKGNoaWxkKTtcbiAgfVxuXG4gIHZhciBfc3RhdGUgPSBwYXJlbnQuX3N0YXRlO1xuXG4gIGlmIChfc3RhdGUpIHtcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNhbGxiYWNrID0gX2FyZ3VtZW50c1tfc3RhdGUgLSAxXTtcbiAgICAgIGFzYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gaW52b2tlQ2FsbGJhY2soX3N0YXRlLCBjaGlsZCwgY2FsbGJhY2ssIHBhcmVudC5fcmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pKCk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuLyoqXG4gIGBQcm9taXNlLnJlc29sdmVgIHJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgcmVzb2x2ZWQgd2l0aCB0aGVcbiAgcGFzc2VkIGB2YWx1ZWAuIEl0IGlzIHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZXNvbHZlKDEpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIHZhbHVlID09PSAxXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgxKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIHZhbHVlID09PSAxXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlc29sdmVcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FueX0gdmFsdWUgdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGhcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSBmdWxmaWxsZWQgd2l0aCB0aGUgZ2l2ZW5cbiAgYHZhbHVlYFxuKi9cbmZ1bmN0aW9uIHJlc29sdmUob2JqZWN0KSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QuY29uc3RydWN0b3IgPT09IENvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuICBfcmVzb2x2ZShwcm9taXNlLCBvYmplY3QpO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxudmFyIFBST01JU0VfSUQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMTYpO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxudmFyIFBFTkRJTkcgPSB2b2lkIDA7XG52YXIgRlVMRklMTEVEID0gMTtcbnZhciBSRUpFQ1RFRCA9IDI7XG5cbnZhciBHRVRfVEhFTl9FUlJPUiA9IG5ldyBFcnJvck9iamVjdCgpO1xuXG5mdW5jdGlvbiBzZWxmRnVsZmlsbG1lbnQoKSB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFwiWW91IGNhbm5vdCByZXNvbHZlIGEgcHJvbWlzZSB3aXRoIGl0c2VsZlwiKTtcbn1cblxuZnVuY3Rpb24gY2Fubm90UmV0dXJuT3duKCkge1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcignQSBwcm9taXNlcyBjYWxsYmFjayBjYW5ub3QgcmV0dXJuIHRoYXQgc2FtZSBwcm9taXNlLicpO1xufVxuXG5mdW5jdGlvbiBnZXRUaGVuKHByb21pc2UpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcHJvbWlzZS50aGVuO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIEdFVF9USEVOX0VSUk9SLmVycm9yID0gZXJyb3I7XG4gICAgcmV0dXJuIEdFVF9USEVOX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyeVRoZW4odGhlbiwgdmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcikge1xuICB0cnkge1xuICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSwgdGhlbikge1xuICBhc2FwKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgdmFyIHNlYWxlZCA9IGZhbHNlO1xuICAgIHZhciBlcnJvciA9IHRyeVRoZW4odGhlbiwgdGhlbmFibGUsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgaWYgKHRoZW5hYmxlICE9PSB2YWx1ZSkge1xuICAgICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICBpZiAoc2VhbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlYWxlZCA9IHRydWU7XG5cbiAgICAgIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xuXG4gICAgaWYgKCFzZWFsZWQgJiYgZXJyb3IpIHtcbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICB9XG4gIH0sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xuICBpZiAodGhlbmFibGUuX3N0YXRlID09PSBGVUxGSUxMRUQpIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICB9IGVsc2UgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICB9IGVsc2Uge1xuICAgIHN1YnNjcmliZSh0aGVuYWJsZSwgdW5kZWZpbmVkLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcmV0dXJuIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4kJCkge1xuICBpZiAobWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3RvciA9PT0gcHJvbWlzZS5jb25zdHJ1Y3RvciAmJiB0aGVuJCQgPT09IHRoZW4gJiYgbWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3Rvci5yZXNvbHZlID09PSByZXNvbHZlKSB7XG4gICAgaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoZW4kJCA9PT0gR0VUX1RIRU5fRVJST1IpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgR0VUX1RIRU5fRVJST1IuZXJyb3IpO1xuICAgIH0gZWxzZSBpZiAodGhlbiQkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoZW4kJCkpIHtcbiAgICAgIGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuJCQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIHNlbGZGdWxmaWxsbWVudCgpKTtcbiAgfSBlbHNlIGlmIChvYmplY3RPckZ1bmN0aW9uKHZhbHVlKSkge1xuICAgIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUsIGdldFRoZW4odmFsdWUpKTtcbiAgfSBlbHNlIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoUmVqZWN0aW9uKHByb21pc2UpIHtcbiAgaWYgKHByb21pc2UuX29uZXJyb3IpIHtcbiAgICBwcm9taXNlLl9vbmVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gIH1cblxuICBwdWJsaXNoKHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHByb21pc2UuX3Jlc3VsdCA9IHZhbHVlO1xuICBwcm9taXNlLl9zdGF0ZSA9IEZVTEZJTExFRDtcblxuICBpZiAocHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwcm9taXNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVqZWN0KHByb21pc2UsIHJlYXNvbikge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcHJvbWlzZS5fc3RhdGUgPSBSRUpFQ1RFRDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gcmVhc29uO1xuXG4gIGFzYXAocHVibGlzaFJlamVjdGlvbiwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICB2YXIgX3N1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgdmFyIGxlbmd0aCA9IF9zdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgcGFyZW50Ll9vbmVycm9yID0gbnVsbDtcblxuICBfc3Vic2NyaWJlcnNbbGVuZ3RoXSA9IGNoaWxkO1xuICBfc3Vic2NyaWJlcnNbbGVuZ3RoICsgRlVMRklMTEVEXSA9IG9uRnVsZmlsbG1lbnQ7XG4gIF9zdWJzY3JpYmVyc1tsZW5ndGggKyBSRUpFQ1RFRF0gPSBvblJlamVjdGlvbjtcblxuICBpZiAobGVuZ3RoID09PSAwICYmIHBhcmVudC5fc3RhdGUpIHtcbiAgICBhc2FwKHB1Ymxpc2gsIHBhcmVudCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVibGlzaChwcm9taXNlKSB7XG4gIHZhciBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzO1xuICB2YXIgc2V0dGxlZCA9IHByb21pc2UuX3N0YXRlO1xuXG4gIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgY2hpbGQgPSB1bmRlZmluZWQsXG4gICAgICBjYWxsYmFjayA9IHVuZGVmaW5lZCxcbiAgICAgIGRldGFpbCA9IHByb21pc2UuX3Jlc3VsdDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgY2hpbGQgPSBzdWJzY3JpYmVyc1tpXTtcbiAgICBjYWxsYmFjayA9IHN1YnNjcmliZXJzW2kgKyBzZXR0bGVkXTtcblxuICAgIGlmIChjaGlsZCkge1xuICAgICAgaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhkZXRhaWwpO1xuICAgIH1cbiAgfVxuXG4gIHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XG59XG5cbmZ1bmN0aW9uIEVycm9yT2JqZWN0KCkge1xuICB0aGlzLmVycm9yID0gbnVsbDtcbn1cblxudmFyIFRSWV9DQVRDSF9FUlJPUiA9IG5ldyBFcnJvck9iamVjdCgpO1xuXG5mdW5jdGlvbiB0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGRldGFpbCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xuICAgIHJldHVybiBUUllfQ0FUQ0hfRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgcHJvbWlzZSwgY2FsbGJhY2ssIGRldGFpbCkge1xuICB2YXIgaGFzQ2FsbGJhY2sgPSBpc0Z1bmN0aW9uKGNhbGxiYWNrKSxcbiAgICAgIHZhbHVlID0gdW5kZWZpbmVkLFxuICAgICAgZXJyb3IgPSB1bmRlZmluZWQsXG4gICAgICBzdWNjZWVkZWQgPSB1bmRlZmluZWQsXG4gICAgICBmYWlsZWQgPSB1bmRlZmluZWQ7XG5cbiAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgdmFsdWUgPSB0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gVFJZX0NBVENIX0VSUk9SKSB7XG4gICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgZXJyb3IgPSB2YWx1ZS5lcnJvcjtcbiAgICAgIHZhbHVlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgY2Fubm90UmV0dXJuT3duKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IGRldGFpbDtcbiAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgLy8gbm9vcFxuICB9IGVsc2UgaWYgKGhhc0NhbGxiYWNrICYmIHN1Y2NlZWRlZCkge1xuICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoZmFpbGVkKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IEZVTEZJTExFRCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBSRUpFQ1RFRCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplUHJvbWlzZShwcm9taXNlLCByZXNvbHZlcikge1xuICB0cnkge1xuICAgIHJlc29sdmVyKGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbHVlKSB7XG4gICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgZSk7XG4gIH1cbn1cblxudmFyIGlkID0gMDtcbmZ1bmN0aW9uIG5leHRJZCgpIHtcbiAgcmV0dXJuIGlkKys7XG59XG5cbmZ1bmN0aW9uIG1ha2VQcm9taXNlKHByb21pc2UpIHtcbiAgcHJvbWlzZVtQUk9NSVNFX0lEXSA9IGlkKys7XG4gIHByb21pc2UuX3N0YXRlID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9yZXN1bHQgPSB1bmRlZmluZWQ7XG4gIHByb21pc2UuX3N1YnNjcmliZXJzID0gW107XG59XG5cbmZ1bmN0aW9uIEVudW1lcmF0b3IoQ29uc3RydWN0b3IsIGlucHV0KSB7XG4gIHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgdGhpcy5wcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGlmICghdGhpcy5wcm9taXNlW1BST01JU0VfSURdKSB7XG4gICAgbWFrZVByb21pc2UodGhpcy5wcm9taXNlKTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5sZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgdGhpcy5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgdGhpcy5fcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcblxuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5sZW5ndGggfHwgMDtcbiAgICAgIHRoaXMuX2VudW1lcmF0ZSgpO1xuICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICBmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgX3JlamVjdCh0aGlzLnByb21pc2UsIHZhbGlkYXRpb25FcnJvcigpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0aW9uRXJyb3IoKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoJ0FycmF5IE1ldGhvZHMgbXVzdCBiZSBwcm92aWRlZCBhbiBBcnJheScpO1xufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICB2YXIgX2lucHV0ID0gdGhpcy5faW5wdXQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IHRoaXMuX3N0YXRlID09PSBQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHRoaXMuX2VhY2hFbnRyeShfaW5wdXRbaV0sIGkpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fZWFjaEVudHJ5ID0gZnVuY3Rpb24gKGVudHJ5LCBpKSB7XG4gIHZhciBjID0gdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvcjtcbiAgdmFyIHJlc29sdmUkJCA9IGMucmVzb2x2ZTtcblxuICBpZiAocmVzb2x2ZSQkID09PSByZXNvbHZlKSB7XG4gICAgdmFyIF90aGVuID0gZ2V0VGhlbihlbnRyeSk7XG5cbiAgICBpZiAoX3RoZW4gPT09IHRoZW4gJiYgZW50cnkuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgICB0aGlzLl9zZXR0bGVkQXQoZW50cnkuX3N0YXRlLCBpLCBlbnRyeS5fcmVzdWx0KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBfdGhlbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG4gICAgICB0aGlzLl9yZXN1bHRbaV0gPSBlbnRyeTtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFByb21pc2UpIHtcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IGMobm9vcCk7XG4gICAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIGVudHJ5LCBfdGhlbik7XG4gICAgICB0aGlzLl93aWxsU2V0dGxlQXQocHJvbWlzZSwgaSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChuZXcgYyhmdW5jdGlvbiAocmVzb2x2ZSQkKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlJCQoZW50cnkpO1xuICAgICAgfSksIGkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl93aWxsU2V0dGxlQXQocmVzb2x2ZSQkKGVudHJ5KSwgaSk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9zZXR0bGVkQXQgPSBmdW5jdGlvbiAoc3RhdGUsIGksIHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcy5wcm9taXNlO1xuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gUEVORElORykge1xuICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuXG4gICAgaWYgKHN0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl93aWxsU2V0dGxlQXQgPSBmdW5jdGlvbiAocHJvbWlzZSwgaSkge1xuICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgc3Vic2NyaWJlKHByb21pc2UsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIGVudW1lcmF0b3IuX3NldHRsZWRBdChGVUxGSUxMRUQsIGksIHZhbHVlKTtcbiAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoUkVKRUNURUQsIGksIHJlYXNvbik7XG4gIH0pO1xufTtcblxuLyoqXG4gIGBQcm9taXNlLmFsbGAgYWNjZXB0cyBhbiBhcnJheSBvZiBwcm9taXNlcywgYW5kIHJldHVybnMgYSBuZXcgcHJvbWlzZSB3aGljaFxuICBpcyBmdWxmaWxsZWQgd2l0aCBhbiBhcnJheSBvZiBmdWxmaWxsbWVudCB2YWx1ZXMgZm9yIHRoZSBwYXNzZWQgcHJvbWlzZXMsIG9yXG4gIHJlamVjdGVkIHdpdGggdGhlIHJlYXNvbiBvZiB0aGUgZmlyc3QgcGFzc2VkIHByb21pc2UgdG8gYmUgcmVqZWN0ZWQuIEl0IGNhc3RzIGFsbFxuICBlbGVtZW50cyBvZiB0aGUgcGFzc2VkIGl0ZXJhYmxlIHRvIHByb21pc2VzIGFzIGl0IHJ1bnMgdGhpcyBhbGdvcml0aG0uXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IHJlc29sdmUoMSk7XG4gIGxldCBwcm9taXNlMiA9IHJlc29sdmUoMik7XG4gIGxldCBwcm9taXNlMyA9IHJlc29sdmUoMyk7XG4gIGxldCBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBUaGUgYXJyYXkgaGVyZSB3b3VsZCBiZSBbIDEsIDIsIDMgXTtcbiAgfSk7XG4gIGBgYFxuXG4gIElmIGFueSBvZiB0aGUgYHByb21pc2VzYCBnaXZlbiB0byBgYWxsYCBhcmUgcmVqZWN0ZWQsIHRoZSBmaXJzdCBwcm9taXNlXG4gIHRoYXQgaXMgcmVqZWN0ZWQgd2lsbCBiZSBnaXZlbiBhcyBhbiBhcmd1bWVudCB0byB0aGUgcmV0dXJuZWQgcHJvbWlzZXMnc1xuICByZWplY3Rpb24gaGFuZGxlci4gRm9yIGV4YW1wbGU6XG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IHJlc29sdmUoMSk7XG4gIGxldCBwcm9taXNlMiA9IHJlamVjdChuZXcgRXJyb3IoXCIyXCIpKTtcbiAgbGV0IHByb21pc2UzID0gcmVqZWN0KG5ldyBFcnJvcihcIjNcIikpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnMgYmVjYXVzZSB0aGVyZSBhcmUgcmVqZWN0ZWQgcHJvbWlzZXMhXG4gIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgLy8gZXJyb3IubWVzc2FnZSA9PT0gXCIyXCJcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgYWxsXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBcnJheX0gZW50cmllcyBhcnJheSBvZiBwcm9taXNlc1xuICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYWxsIGBwcm9taXNlc2AgaGF2ZSBiZWVuXG4gIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQgaWYgYW55IG9mIHRoZW0gYmVjb21lIHJlamVjdGVkLlxuICBAc3RhdGljXG4qL1xuZnVuY3Rpb24gYWxsKGVudHJpZXMpIHtcbiAgcmV0dXJuIG5ldyBFbnVtZXJhdG9yKHRoaXMsIGVudHJpZXMpLnByb21pc2U7XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yYWNlYCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2ggaXMgc2V0dGxlZCBpbiB0aGUgc2FtZSB3YXkgYXMgdGhlXG4gIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIHNldHRsZS5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMicpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFByb21pc2UucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIHJlc3VsdCA9PT0gJ3Byb21pc2UgMicgYmVjYXVzZSBpdCB3YXMgcmVzb2x2ZWQgYmVmb3JlIHByb21pc2UxXG4gICAgLy8gd2FzIHJlc29sdmVkLlxuICB9KTtcbiAgYGBgXG5cbiAgYFByb21pc2UucmFjZWAgaXMgZGV0ZXJtaW5pc3RpYyBpbiB0aGF0IG9ubHkgdGhlIHN0YXRlIG9mIHRoZSBmaXJzdFxuICBzZXR0bGVkIHByb21pc2UgbWF0dGVycy4gRm9yIGV4YW1wbGUsIGV2ZW4gaWYgb3RoZXIgcHJvbWlzZXMgZ2l2ZW4gdG8gdGhlXG4gIGBwcm9taXNlc2AgYXJyYXkgYXJndW1lbnQgYXJlIHJlc29sdmVkLCBidXQgdGhlIGZpcnN0IHNldHRsZWQgcHJvbWlzZSBoYXNcbiAgYmVjb21lIHJlamVjdGVkIGJlZm9yZSB0aGUgb3RoZXIgcHJvbWlzZXMgYmVjYW1lIGZ1bGZpbGxlZCwgdGhlIHJldHVybmVkXG4gIHByb21pc2Ugd2lsbCBiZWNvbWUgcmVqZWN0ZWQ6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMScpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIGxldCBwcm9taXNlMiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcigncHJvbWlzZSAyJykpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFByb21pc2UucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgcHJvbWlzZSAyIGJlY2FtZSByZWplY3RlZCBiZWZvcmVcbiAgICAvLyBwcm9taXNlIDEgYmVjYW1lIGZ1bGZpbGxlZFxuICB9KTtcbiAgYGBgXG5cbiAgQW4gZXhhbXBsZSByZWFsLXdvcmxkIHVzZSBjYXNlIGlzIGltcGxlbWVudGluZyB0aW1lb3V0czpcblxuICBgYGBqYXZhc2NyaXB0XG4gIFByb21pc2UucmFjZShbYWpheCgnZm9vLmpzb24nKSwgdGltZW91dCg1MDAwKV0pXG4gIGBgYFxuXG4gIEBtZXRob2QgcmFjZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IHByb21pc2VzIGFycmF5IG9mIHByb21pc2VzIHRvIG9ic2VydmVcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2Ugd2hpY2ggc2V0dGxlcyBpbiB0aGUgc2FtZSB3YXkgYXMgdGhlIGZpcnN0IHBhc3NlZFxuICBwcm9taXNlIHRvIHNldHRsZS5cbiovXG5mdW5jdGlvbiByYWNlKGVudHJpZXMpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAoIWlzQXJyYXkoZW50cmllcykpIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIChfLCByZWplY3QpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byByYWNlLicpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgQ29uc3RydWN0b3IucmVzb2x2ZShlbnRyaWVzW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gIGBQcm9taXNlLnJlamVjdGAgcmV0dXJucyBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgcGFzc2VkIGByZWFzb25gLlxuICBJdCBpcyBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZWplY3RcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FueX0gcmVhc29uIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIHRoZSBnaXZlbiBgcmVhc29uYC5cbiovXG5mdW5jdGlvbiByZWplY3QocmVhc29uKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG4gIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5mdW5jdGlvbiBuZWVkc1Jlc29sdmVyKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGEgcmVzb2x2ZXIgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XG59XG5cbmZ1bmN0aW9uIG5lZWRzTmV3KCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnUHJvbWlzZSc6IFBsZWFzZSB1c2UgdGhlICduZXcnIG9wZXJhdG9yLCB0aGlzIG9iamVjdCBjb25zdHJ1Y3RvciBjYW5ub3QgYmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24uXCIpO1xufVxuXG4vKipcbiAgUHJvbWlzZSBvYmplY3RzIHJlcHJlc2VudCB0aGUgZXZlbnR1YWwgcmVzdWx0IG9mIGFuIGFzeW5jaHJvbm91cyBvcGVyYXRpb24uIFRoZVxuICBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLCB3aGljaFxuICByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZSByZWFzb25cbiAgd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG5cbiAgVGVybWlub2xvZ3lcbiAgLS0tLS0tLS0tLS1cblxuICAtIGBwcm9taXNlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gd2l0aCBhIGB0aGVuYCBtZXRob2Qgd2hvc2UgYmVoYXZpb3IgY29uZm9ybXMgdG8gdGhpcyBzcGVjaWZpY2F0aW9uLlxuICAtIGB0aGVuYWJsZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHRoYXQgZGVmaW5lcyBhIGB0aGVuYCBtZXRob2QuXG4gIC0gYHZhbHVlYCBpcyBhbnkgbGVnYWwgSmF2YVNjcmlwdCB2YWx1ZSAoaW5jbHVkaW5nIHVuZGVmaW5lZCwgYSB0aGVuYWJsZSwgb3IgYSBwcm9taXNlKS5cbiAgLSBgZXhjZXB0aW9uYCBpcyBhIHZhbHVlIHRoYXQgaXMgdGhyb3duIHVzaW5nIHRoZSB0aHJvdyBzdGF0ZW1lbnQuXG4gIC0gYHJlYXNvbmAgaXMgYSB2YWx1ZSB0aGF0IGluZGljYXRlcyB3aHkgYSBwcm9taXNlIHdhcyByZWplY3RlZC5cbiAgLSBgc2V0dGxlZGAgdGhlIGZpbmFsIHJlc3Rpbmcgc3RhdGUgb2YgYSBwcm9taXNlLCBmdWxmaWxsZWQgb3IgcmVqZWN0ZWQuXG5cbiAgQSBwcm9taXNlIGNhbiBiZSBpbiBvbmUgb2YgdGhyZWUgc3RhdGVzOiBwZW5kaW5nLCBmdWxmaWxsZWQsIG9yIHJlamVjdGVkLlxuXG4gIFByb21pc2VzIHRoYXQgYXJlIGZ1bGZpbGxlZCBoYXZlIGEgZnVsZmlsbG1lbnQgdmFsdWUgYW5kIGFyZSBpbiB0aGUgZnVsZmlsbGVkXG4gIHN0YXRlLiAgUHJvbWlzZXMgdGhhdCBhcmUgcmVqZWN0ZWQgaGF2ZSBhIHJlamVjdGlvbiByZWFzb24gYW5kIGFyZSBpbiB0aGVcbiAgcmVqZWN0ZWQgc3RhdGUuICBBIGZ1bGZpbGxtZW50IHZhbHVlIGlzIG5ldmVyIGEgdGhlbmFibGUuXG5cbiAgUHJvbWlzZXMgY2FuIGFsc28gYmUgc2FpZCB0byAqcmVzb2x2ZSogYSB2YWx1ZS4gIElmIHRoaXMgdmFsdWUgaXMgYWxzbyBhXG4gIHByb21pc2UsIHRoZW4gdGhlIG9yaWdpbmFsIHByb21pc2UncyBzZXR0bGVkIHN0YXRlIHdpbGwgbWF0Y2ggdGhlIHZhbHVlJ3NcbiAgc2V0dGxlZCBzdGF0ZS4gIFNvIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgcmVqZWN0cyB3aWxsXG4gIGl0c2VsZiByZWplY3QsIGFuZCBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdpbGxcbiAgaXRzZWxmIGZ1bGZpbGwuXG5cblxuICBCYXNpYyBVc2FnZTpcbiAgLS0tLS0tLS0tLS0tXG5cbiAgYGBganNcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAvLyBvbiBzdWNjZXNzXG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG5cbiAgICAvLyBvbiBmYWlsdXJlXG4gICAgcmVqZWN0KHJlYXNvbik7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIC8vIG9uIHJlamVjdGlvblxuICB9KTtcbiAgYGBgXG5cbiAgQWR2YW5jZWQgVXNhZ2U6XG4gIC0tLS0tLS0tLS0tLS0tLVxuXG4gIFByb21pc2VzIHNoaW5lIHdoZW4gYWJzdHJhY3RpbmcgYXdheSBhc3luY2hyb25vdXMgaW50ZXJhY3Rpb25zIHN1Y2ggYXNcbiAgYFhNTEh0dHBSZXF1ZXN0YHMuXG5cbiAgYGBganNcbiAgZnVuY3Rpb24gZ2V0SlNPTih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlcjtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHhoci5zZW5kKCk7XG5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IHRoaXMuRE9ORSkge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdnZXRKU09OOiBgJyArIHVybCArICdgIGZhaWxlZCB3aXRoIHN0YXR1czogWycgKyB0aGlzLnN0YXR1cyArICddJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEpTT04oJy9wb3N0cy5qc29uJykudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgLy8gb24gcmVqZWN0aW9uXG4gIH0pO1xuICBgYGBcblxuICBVbmxpa2UgY2FsbGJhY2tzLCBwcm9taXNlcyBhcmUgZ3JlYXQgY29tcG9zYWJsZSBwcmltaXRpdmVzLlxuXG4gIGBgYGpzXG4gIFByb21pc2UuYWxsKFtcbiAgICBnZXRKU09OKCcvcG9zdHMnKSxcbiAgICBnZXRKU09OKCcvY29tbWVudHMnKVxuICBdKS50aGVuKGZ1bmN0aW9uKHZhbHVlcyl7XG4gICAgdmFsdWVzWzBdIC8vID0+IHBvc3RzSlNPTlxuICAgIHZhbHVlc1sxXSAvLyA9PiBjb21tZW50c0pTT05cblxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0pO1xuICBgYGBcblxuICBAY2xhc3MgUHJvbWlzZVxuICBAcGFyYW0ge2Z1bmN0aW9ufSByZXNvbHZlclxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEBjb25zdHJ1Y3RvclxuKi9cbmZ1bmN0aW9uIFByb21pc2UocmVzb2x2ZXIpIHtcbiAgdGhpc1tQUk9NSVNFX0lEXSA9IG5leHRJZCgpO1xuICB0aGlzLl9yZXN1bHQgPSB0aGlzLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcblxuICBpZiAobm9vcCAhPT0gcmVzb2x2ZXIpIHtcbiAgICB0eXBlb2YgcmVzb2x2ZXIgIT09ICdmdW5jdGlvbicgJiYgbmVlZHNSZXNvbHZlcigpO1xuICAgIHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlID8gaW5pdGlhbGl6ZVByb21pc2UodGhpcywgcmVzb2x2ZXIpIDogbmVlZHNOZXcoKTtcbiAgfVxufVxuXG5Qcm9taXNlLmFsbCA9IGFsbDtcblByb21pc2UucmFjZSA9IHJhY2U7XG5Qcm9taXNlLnJlc29sdmUgPSByZXNvbHZlO1xuUHJvbWlzZS5yZWplY3QgPSByZWplY3Q7XG5Qcm9taXNlLl9zZXRTY2hlZHVsZXIgPSBzZXRTY2hlZHVsZXI7XG5Qcm9taXNlLl9zZXRBc2FwID0gc2V0QXNhcDtcblByb21pc2UuX2FzYXAgPSBhc2FwO1xuXG5Qcm9taXNlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFByb21pc2UsXG5cbiAgLyoqXG4gICAgVGhlIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsXG4gICAgd2hpY2ggcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGVcbiAgICByZWFzb24gd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgLy8gdXNlciBpcyBhdmFpbGFibGVcbiAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gdXNlciBpcyB1bmF2YWlsYWJsZSwgYW5kIHlvdSBhcmUgZ2l2ZW4gdGhlIHJlYXNvbiB3aHlcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQ2hhaW5pbmdcbiAgICAtLS0tLS0tLVxuICBcbiAgICBUaGUgcmV0dXJuIHZhbHVlIG9mIGB0aGVuYCBpcyBpdHNlbGYgYSBwcm9taXNlLiAgVGhpcyBzZWNvbmQsICdkb3duc3RyZWFtJ1xuICAgIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmaXJzdCBwcm9taXNlJ3MgZnVsZmlsbG1lbnRcbiAgICBvciByZWplY3Rpb24gaGFuZGxlciwgb3IgcmVqZWN0ZWQgaWYgdGhlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VyLm5hbWU7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcmV0dXJuICdkZWZhdWx0IG5hbWUnO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHVzZXJOYW1lKSB7XG4gICAgICAvLyBJZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHVzZXJOYW1lYCB3aWxsIGJlIHRoZSB1c2VyJ3MgbmFtZSwgb3RoZXJ3aXNlIGl0XG4gICAgICAvLyB3aWxsIGJlIGAnZGVmYXVsdCBuYW1lJ2BcbiAgICB9KTtcbiAgXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jyk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jyk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBpZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHJlYXNvbmAgd2lsbCBiZSAnRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknLlxuICAgICAgLy8gSWYgYGZpbmRVc2VyYCByZWplY3RlZCwgYHJlYXNvbmAgd2lsbCBiZSAnYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScuXG4gICAgfSk7XG4gICAgYGBgXG4gICAgSWYgdGhlIGRvd25zdHJlYW0gcHJvbWlzZSBkb2VzIG5vdCBzcGVjaWZ5IGEgcmVqZWN0aW9uIGhhbmRsZXIsIHJlamVjdGlvbiByZWFzb25zIHdpbGwgYmUgcHJvcGFnYXRlZCBmdXJ0aGVyIGRvd25zdHJlYW0uXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICB0aHJvdyBuZXcgUGVkYWdvZ2ljYWxFeGNlcHRpb24oJ1Vwc3RyZWFtIGVycm9yJyk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIFRoZSBgUGVkZ2Fnb2NpYWxFeGNlcHRpb25gIGlzIHByb3BhZ2F0ZWQgYWxsIHRoZSB3YXkgZG93biB0byBoZXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEFzc2ltaWxhdGlvblxuICAgIC0tLS0tLS0tLS0tLVxuICBcbiAgICBTb21ldGltZXMgdGhlIHZhbHVlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSB0byBhIGRvd25zdHJlYW0gcHJvbWlzZSBjYW4gb25seSBiZVxuICAgIHJldHJpZXZlZCBhc3luY2hyb25vdXNseS4gVGhpcyBjYW4gYmUgYWNoaWV2ZWQgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiB0aGVcbiAgICBmdWxmaWxsbWVudCBvciByZWplY3Rpb24gaGFuZGxlci4gVGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIHRoZW4gYmUgcGVuZGluZ1xuICAgIHVudGlsIHRoZSByZXR1cm5lZCBwcm9taXNlIGlzIHNldHRsZWQuIFRoaXMgaXMgY2FsbGVkICphc3NpbWlsYXRpb24qLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAvLyBUaGUgdXNlcidzIGNvbW1lbnRzIGFyZSBub3cgYXZhaWxhYmxlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIElmIHRoZSBhc3NpbWxpYXRlZCBwcm9taXNlIHJlamVjdHMsIHRoZW4gdGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIGFsc28gcmVqZWN0LlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIGZ1bGZpbGxzLCB3ZSdsbCBoYXZlIHRoZSB2YWx1ZSBoZXJlXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCByZWplY3RzLCB3ZSdsbCBoYXZlIHRoZSByZWFzb24gaGVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBTaW1wbGUgRXhhbXBsZVxuICAgIC0tLS0tLS0tLS0tLS0tXG4gIFxuICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGxldCByZXN1bHQ7XG4gIFxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBmaW5kUmVzdWx0KCk7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9XG4gICAgYGBgXG4gIFxuICAgIEVycmJhY2sgRXhhbXBsZVxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRSZXN1bHQoZnVuY3Rpb24ocmVzdWx0LCBlcnIpe1xuICAgICAgaWYgKGVycikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFByb21pc2UgRXhhbXBsZTtcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGZpbmRSZXN1bHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQWR2YW5jZWQgRXhhbXBsZVxuICAgIC0tLS0tLS0tLS0tLS0tXG4gIFxuICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGxldCBhdXRob3IsIGJvb2tzO1xuICBcbiAgICB0cnkge1xuICAgICAgYXV0aG9yID0gZmluZEF1dGhvcigpO1xuICAgICAgYm9va3MgID0gZmluZEJvb2tzQnlBdXRob3IoYXV0aG9yKTtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH1cbiAgICBgYGBcbiAgXG4gICAgRXJyYmFjayBFeGFtcGxlXG4gIFxuICAgIGBgYGpzXG4gIFxuICAgIGZ1bmN0aW9uIGZvdW5kQm9va3MoYm9va3MpIHtcbiAgXG4gICAgfVxuICBcbiAgICBmdW5jdGlvbiBmYWlsdXJlKHJlYXNvbikge1xuICBcbiAgICB9XG4gIFxuICAgIGZpbmRBdXRob3IoZnVuY3Rpb24oYXV0aG9yLCBlcnIpe1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmluZEJvb29rc0J5QXV0aG9yKGF1dGhvciwgZnVuY3Rpb24oYm9va3MsIGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvdW5kQm9va3MoYm9va3MpO1xuICAgICAgICAgICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAgICAgICAgIGZhaWx1cmUocmVhc29uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH1cbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgUHJvbWlzZSBFeGFtcGxlO1xuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgZmluZEF1dGhvcigpLlxuICAgICAgdGhlbihmaW5kQm9va3NCeUF1dGhvcikuXG4gICAgICB0aGVuKGZ1bmN0aW9uKGJvb2tzKXtcbiAgICAgICAgLy8gZm91bmQgYm9va3NcbiAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQG1ldGhvZCB0aGVuXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxmaWxsZWRcbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGVkXG4gICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG4gIHRoZW46IHRoZW4sXG5cbiAgLyoqXG4gICAgYGNhdGNoYCBpcyBzaW1wbHkgc3VnYXIgZm9yIGB0aGVuKHVuZGVmaW5lZCwgb25SZWplY3Rpb24pYCB3aGljaCBtYWtlcyBpdCB0aGUgc2FtZVxuICAgIGFzIHRoZSBjYXRjaCBibG9jayBvZiBhIHRyeS9jYXRjaCBzdGF0ZW1lbnQuXG4gIFxuICAgIGBgYGpzXG4gICAgZnVuY3Rpb24gZmluZEF1dGhvcigpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZG4ndCBmaW5kIHRoYXQgYXV0aG9yJyk7XG4gICAgfVxuICBcbiAgICAvLyBzeW5jaHJvbm91c1xuICAgIHRyeSB7XG4gICAgICBmaW5kQXV0aG9yKCk7XG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfVxuICBcbiAgICAvLyBhc3luYyB3aXRoIHByb21pc2VzXG4gICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBAbWV0aG9kIGNhdGNoXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cbiAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cbiAgJ2NhdGNoJzogZnVuY3Rpb24gX2NhdGNoKG9uUmVqZWN0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICAgIHZhciBsb2NhbCA9IHVuZGVmaW5lZDtcblxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsb2NhbCA9IGdsb2JhbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsb2NhbCA9IHNlbGY7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsID0gRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5ZmlsbCBmYWlsZWQgYmVjYXVzZSBnbG9iYWwgb2JqZWN0IGlzIHVuYXZhaWxhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBQID0gbG9jYWwuUHJvbWlzZTtcblxuICAgIGlmIChQKSB7XG4gICAgICAgIHZhciBwcm9taXNlVG9TdHJpbmcgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvbWlzZVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFAucmVzb2x2ZSgpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gc2lsZW50bHkgaWdub3JlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb21pc2VUb1N0cmluZyA9PT0gJ1tvYmplY3QgUHJvbWlzZV0nICYmICFQLmNhc3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvY2FsLlByb21pc2UgPSBQcm9taXNlO1xufVxuXG4vLyBTdHJhbmdlIGNvbXBhdC4uXG5Qcm9taXNlLnBvbHlmaWxsID0gcG9seWZpbGw7XG5Qcm9taXNlLlByb21pc2UgPSBQcm9taXNlO1xuXG5yZXR1cm4gUHJvbWlzZTtcblxufSkpKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJyksdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlsY3pZdGNISnZiV2x6WlM5a2FYTjBMMlZ6Tmkxd2NtOXRhWE5sTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaUZjYmlBcUlFQnZkbVZ5ZG1sbGR5Qmxjell0Y0hKdmJXbHpaU0F0SUdFZ2RHbHVlU0JwYlhCc1pXMWxiblJoZEdsdmJpQnZaaUJRY205dGFYTmxjeTlCS3k1Y2JpQXFJRUJqYjNCNWNtbG5hSFFnUTI5d2VYSnBaMmgwSUNoaktTQXlNREUwSUZsbGFIVmtZU0JMWVhSNkxDQlViMjBnUkdGc1pTd2dVM1JsWm1GdUlGQmxibTVsY2lCaGJtUWdZMjl1ZEhKcFluVjBiM0p6SUNoRGIyNTJaWEp6YVc5dUlIUnZJRVZUTmlCQlVFa2dZbmtnU21GclpTQkJjbU5vYVdKaGJHUXBYRzRnS2lCQWJHbGpaVzV6WlNBZ0lFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQnNhV05sYm5ObFhHNGdLaUFnSUNBZ0lDQWdJQ0FnSUZObFpTQm9kSFJ3Y3pvdkwzSmhkeTVuYVhSb2RXSjFjMlZ5WTI5dWRHVnVkQzVqYjIwdmMzUmxabUZ1Y0dWdWJtVnlMMlZ6Tmkxd2NtOXRhWE5sTDIxaGMzUmxjaTlNU1VORlRsTkZYRzRnS2lCQWRtVnljMmx2YmlBZ0lEUXVNQzQxWEc0Z0tpOWNibHh1S0daMWJtTjBhVzl1SUNobmJHOWlZV3dzSUdaaFkzUnZjbmtwSUh0Y2JpQWdJQ0IwZVhCbGIyWWdaWGh3YjNKMGN5QTlQVDBnSjI5aWFtVmpkQ2NnSmlZZ2RIbHdaVzltSUcxdlpIVnNaU0FoUFQwZ0ozVnVaR1ZtYVc1bFpDY2dQeUJ0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR1poWTNSdmNua29LU0E2WEc0Z0lDQWdkSGx3Wlc5bUlHUmxabWx1WlNBOVBUMGdKMloxYm1OMGFXOXVKeUFtSmlCa1pXWnBibVV1WVcxa0lEOGdaR1ZtYVc1bEtHWmhZM1J2Y25rcElEcGNiaUFnSUNBb1oyeHZZbUZzTGtWVE5sQnliMjFwYzJVZ1BTQm1ZV04wYjNKNUtDa3BPMXh1ZlNoMGFHbHpMQ0FvWm5WdVkzUnBiMjRnS0NrZ2V5QW5kWE5sSUhOMGNtbGpkQ2M3WEc1Y2JtWjFibU4wYVc5dUlHOWlhbVZqZEU5eVJuVnVZM1JwYjI0b2VDa2dlMXh1SUNCeVpYUjFjbTRnZEhsd1pXOW1JSGdnUFQwOUlDZG1kVzVqZEdsdmJpY2dmSHdnZEhsd1pXOW1JSGdnUFQwOUlDZHZZbXBsWTNRbklDWW1JSGdnSVQwOUlHNTFiR3c3WEc1OVhHNWNibVoxYm1OMGFXOXVJR2x6Um5WdVkzUnBiMjRvZUNrZ2UxeHVJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlIZ2dQVDA5SUNkbWRXNWpkR2x2YmljN1hHNTlYRzVjYm5aaGNpQmZhWE5CY25KaGVTQTlJSFZ1WkdWbWFXNWxaRHRjYm1sbUlDZ2hRWEp5WVhrdWFYTkJjbkpoZVNrZ2UxeHVJQ0JmYVhOQmNuSmhlU0E5SUdaMWJtTjBhVzl1SUNoNEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUU5aWFtVmpkQzV3Y205MGIzUjVjR1V1ZEc5VGRISnBibWN1WTJGc2JDaDRLU0E5UFQwZ0oxdHZZbXBsWTNRZ1FYSnlZWGxkSnp0Y2JpQWdmVHRjYm4wZ1pXeHpaU0I3WEc0Z0lGOXBjMEZ5Y21GNUlEMGdRWEp5WVhrdWFYTkJjbkpoZVR0Y2JuMWNibHh1ZG1GeUlHbHpRWEp5WVhrZ1BTQmZhWE5CY25KaGVUdGNibHh1ZG1GeUlHeGxiaUE5SURBN1hHNTJZWElnZG1WeWRIaE9aWGgwSUQwZ2RXNWtaV1pwYm1Wa08xeHVkbUZ5SUdOMWMzUnZiVk5qYUdWa2RXeGxja1p1SUQwZ2RXNWtaV1pwYm1Wa08xeHVYRzUyWVhJZ1lYTmhjQ0E5SUdaMWJtTjBhVzl1SUdGellYQW9ZMkZzYkdKaFkyc3NJR0Z5WnlrZ2UxeHVJQ0J4ZFdWMVpWdHNaVzVkSUQwZ1kyRnNiR0poWTJzN1hHNGdJSEYxWlhWbFcyeGxiaUFySURGZElEMGdZWEpuTzF4dUlDQnNaVzRnS3owZ01qdGNiaUFnYVdZZ0tHeGxiaUE5UFQwZ01pa2dlMXh1SUNBZ0lDOHZJRWxtSUd4bGJpQnBjeUF5TENCMGFHRjBJRzFsWVc1eklIUm9ZWFFnZDJVZ2JtVmxaQ0IwYnlCelkyaGxaSFZzWlNCaGJpQmhjM2x1WXlCbWJIVnphQzVjYmlBZ0lDQXZMeUJKWmlCaFpHUnBkR2x2Ym1Gc0lHTmhiR3hpWVdOcmN5QmhjbVVnY1hWbGRXVmtJR0psWm05eVpTQjBhR1VnY1hWbGRXVWdhWE1nWm14MWMyaGxaQ3dnZEdobGVWeHVJQ0FnSUM4dklIZHBiR3dnWW1VZ2NISnZZMlZ6YzJWa0lHSjVJSFJvYVhNZ1pteDFjMmdnZEdoaGRDQjNaU0JoY21VZ2MyTm9aV1IxYkdsdVp5NWNiaUFnSUNCcFppQW9ZM1Z6ZEc5dFUyTm9aV1IxYkdWeVJtNHBJSHRjYmlBZ0lDQWdJR04xYzNSdmJWTmphR1ZrZFd4bGNrWnVLR1pzZFhOb0tUdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnYzJOb1pXUjFiR1ZHYkhWemFDZ3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dWZUdGNibHh1Wm5WdVkzUnBiMjRnYzJWMFUyTm9aV1IxYkdWeUtITmphR1ZrZFd4bFJtNHBJSHRjYmlBZ1kzVnpkRzl0VTJOb1pXUjFiR1Z5Um00Z1BTQnpZMmhsWkhWc1pVWnVPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQnpaWFJCYzJGd0tHRnpZWEJHYmlrZ2UxeHVJQ0JoYzJGd0lEMGdZWE5oY0VadU8xeHVmVnh1WEc1MllYSWdZbkp2ZDNObGNsZHBibVJ2ZHlBOUlIUjVjR1Z2WmlCM2FXNWtiM2NnSVQwOUlDZDFibVJsWm1sdVpXUW5JRDhnZDJsdVpHOTNJRG9nZFc1a1pXWnBibVZrTzF4dWRtRnlJR0p5YjNkelpYSkhiRzlpWVd3Z1BTQmljbTkzYzJWeVYybHVaRzkzSUh4OElIdDlPMXh1ZG1GeUlFSnliM2R6WlhKTmRYUmhkR2x2Yms5aWMyVnlkbVZ5SUQwZ1luSnZkM05sY2tkc2IySmhiQzVOZFhSaGRHbHZiazlpYzJWeWRtVnlJSHg4SUdKeWIzZHpaWEpIYkc5aVlXd3VWMlZpUzJsMFRYVjBZWFJwYjI1UFluTmxjblpsY2p0Y2JuWmhjaUJwYzA1dlpHVWdQU0IwZVhCbGIyWWdjMlZzWmlBOVBUMGdKM1Z1WkdWbWFXNWxaQ2NnSmlZZ2RIbHdaVzltSUhCeWIyTmxjM01nSVQwOUlDZDFibVJsWm1sdVpXUW5JQ1ltSUNoN2ZTa3VkRzlUZEhKcGJtY3VZMkZzYkNod2NtOWpaWE56S1NBOVBUMGdKMXR2WW1wbFkzUWdjSEp2WTJWemMxMG5PMXh1WEc0dkx5QjBaWE4wSUdadmNpQjNaV0lnZDI5eWEyVnlJR0oxZENCdWIzUWdhVzRnU1VVeE1GeHVkbUZ5SUdselYyOXlhMlZ5SUQwZ2RIbHdaVzltSUZWcGJuUTRRMnhoYlhCbFpFRnljbUY1SUNFOVBTQW5kVzVrWldacGJtVmtKeUFtSmlCMGVYQmxiMllnYVcxd2IzSjBVMk55YVhCMGN5QWhQVDBnSjNWdVpHVm1hVzVsWkNjZ0ppWWdkSGx3Wlc5bUlFMWxjM05oWjJWRGFHRnVibVZzSUNFOVBTQW5kVzVrWldacGJtVmtKenRjYmx4dUx5OGdibTlrWlZ4dVpuVnVZM1JwYjI0Z2RYTmxUbVY0ZEZScFkyc29LU0I3WEc0Z0lDOHZJRzV2WkdVZ2RtVnljMmx2YmlBd0xqRXdMbmdnWkdsemNHeGhlWE1nWVNCa1pYQnlaV05oZEdsdmJpQjNZWEp1YVc1bklIZG9aVzRnYm1WNGRGUnBZMnNnYVhNZ2RYTmxaQ0J5WldOMWNuTnBkbVZzZVZ4dUlDQXZMeUJ6WldVZ2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwyTjFhbTlxY3k5M2FHVnVMMmx6YzNWbGN5ODBNVEFnWm05eUlHUmxkR0ZwYkhOY2JpQWdjbVYwZFhKdUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2NISnZZMlZ6Y3k1dVpYaDBWR2xqYXlobWJIVnphQ2s3WEc0Z0lIMDdYRzU5WEc1Y2JpOHZJSFpsY25SNFhHNW1kVzVqZEdsdmJpQjFjMlZXWlhKMGVGUnBiV1Z5S0NrZ2UxeHVJQ0JwWmlBb2RIbHdaVzltSUhabGNuUjRUbVY0ZENBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnZG1WeWRIaE9aWGgwS0dac2RYTm9LVHRjYmlBZ0lDQjlPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSFZ6WlZObGRGUnBiV1Z2ZFhRb0tUdGNibjFjYmx4dVpuVnVZM1JwYjI0Z2RYTmxUWFYwWVhScGIyNVBZbk5sY25abGNpZ3BJSHRjYmlBZ2RtRnlJR2wwWlhKaGRHbHZibk1nUFNBd08xeHVJQ0IyWVhJZ2IySnpaWEoyWlhJZ1BTQnVaWGNnUW5KdmQzTmxjazExZEdGMGFXOXVUMkp6WlhKMlpYSW9abXgxYzJncE8xeHVJQ0IyWVhJZ2JtOWtaU0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVlJsZUhST2IyUmxLQ2NuS1R0Y2JpQWdiMkp6WlhKMlpYSXViMkp6WlhKMlpTaHViMlJsTENCN0lHTm9ZWEpoWTNSbGNrUmhkR0U2SUhSeWRXVWdmU2s3WEc1Y2JpQWdjbVYwZFhKdUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnViMlJsTG1SaGRHRWdQU0JwZEdWeVlYUnBiMjV6SUQwZ0t5dHBkR1Z5WVhScGIyNXpJQ1VnTWp0Y2JpQWdmVHRjYm4xY2JseHVMeThnZDJWaUlIZHZjbXRsY2x4dVpuVnVZM1JwYjI0Z2RYTmxUV1Z6YzJGblpVTm9ZVzV1Wld3b0tTQjdYRzRnSUhaaGNpQmphR0Z1Ym1Wc0lEMGdibVYzSUUxbGMzTmhaMlZEYUdGdWJtVnNLQ2s3WEc0Z0lHTm9ZVzV1Wld3dWNHOXlkREV1YjI1dFpYTnpZV2RsSUQwZ1pteDFjMmc3WEc0Z0lISmxkSFZ5YmlCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUdOb1lXNXVaV3d1Y0c5eWRESXVjRzl6ZEUxbGMzTmhaMlVvTUNrN1hHNGdJSDA3WEc1OVhHNWNibVoxYm1OMGFXOXVJSFZ6WlZObGRGUnBiV1Z2ZFhRb0tTQjdYRzRnSUM4dklGTjBiM0psSUhObGRGUnBiV1Z2ZFhRZ2NtVm1aWEpsYm1ObElITnZJR1Z6Tmkxd2NtOXRhWE5sSUhkcGJHd2dZbVVnZFc1aFptWmxZM1JsWkNCaWVWeHVJQ0F2THlCdmRHaGxjaUJqYjJSbElHMXZaR2xtZVdsdVp5QnpaWFJVYVcxbGIzVjBJQ2hzYVd0bElITnBibTl1TG5WelpVWmhhMlZVYVcxbGNuTW9LU2xjYmlBZ2RtRnlJR2RzYjJKaGJGTmxkRlJwYldWdmRYUWdQU0J6WlhSVWFXMWxiM1YwTzF4dUlDQnlaWFIxY200Z1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCbmJHOWlZV3hUWlhSVWFXMWxiM1YwS0dac2RYTm9MQ0F4S1R0Y2JpQWdmVHRjYm4xY2JseHVkbUZ5SUhGMVpYVmxJRDBnYm1WM0lFRnljbUY1S0RFd01EQXBPMXh1Wm5WdVkzUnBiMjRnWm14MWMyZ29LU0I3WEc0Z0lHWnZjaUFvZG1GeUlHa2dQU0F3T3lCcElEd2diR1Z1T3lCcElDczlJRElwSUh0Y2JpQWdJQ0IyWVhJZ1kyRnNiR0poWTJzZ1BTQnhkV1YxWlZ0cFhUdGNiaUFnSUNCMllYSWdZWEpuSUQwZ2NYVmxkV1ZiYVNBcklERmRPMXh1WEc0Z0lDQWdZMkZzYkdKaFkyc29ZWEpuS1R0Y2JseHVJQ0FnSUhGMVpYVmxXMmxkSUQwZ2RXNWtaV1pwYm1Wa08xeHVJQ0FnSUhGMVpYVmxXMmtnS3lBeFhTQTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ2ZWeHVYRzRnSUd4bGJpQTlJREE3WEc1OVhHNWNibVoxYm1OMGFXOXVJR0YwZEdWdGNIUldaWEowZUNncElIdGNiaUFnZEhKNUlIdGNiaUFnSUNCMllYSWdjaUE5SUhKbGNYVnBjbVU3WEc0Z0lDQWdkbUZ5SUhabGNuUjRJRDBnY2lnbmRtVnlkSGduS1R0Y2JpQWdJQ0IyWlhKMGVFNWxlSFFnUFNCMlpYSjBlQzV5ZFc1UGJreHZiM0FnZkh3Z2RtVnlkSGd1Y25WdVQyNURiMjUwWlhoME8xeHVJQ0FnSUhKbGRIVnliaUIxYzJWV1pYSjBlRlJwYldWeUtDazdYRzRnSUgwZ1kyRjBZMmdnS0dVcElIdGNiaUFnSUNCeVpYUjFjbTRnZFhObFUyVjBWR2x0Wlc5MWRDZ3BPMXh1SUNCOVhHNTlYRzVjYm5aaGNpQnpZMmhsWkhWc1pVWnNkWE5vSUQwZ2RXNWtaV1pwYm1Wa08xeHVMeThnUkdWamFXUmxJSGRvWVhRZ1lYTjVibU1nYldWMGFHOWtJSFJ2SUhWelpTQjBieUIwY21sbloyVnlhVzVuSUhCeWIyTmxjM05wYm1jZ2IyWWdjWFZsZFdWa0lHTmhiR3hpWVdOcmN6cGNibWxtSUNocGMwNXZaR1VwSUh0Y2JpQWdjMk5vWldSMWJHVkdiSFZ6YUNBOUlIVnpaVTVsZUhSVWFXTnJLQ2s3WEc1OUlHVnNjMlVnYVdZZ0tFSnliM2R6WlhKTmRYUmhkR2x2Yms5aWMyVnlkbVZ5S1NCN1hHNGdJSE5qYUdWa2RXeGxSbXgxYzJnZ1BTQjFjMlZOZFhSaGRHbHZiazlpYzJWeWRtVnlLQ2s3WEc1OUlHVnNjMlVnYVdZZ0tHbHpWMjl5YTJWeUtTQjdYRzRnSUhOamFHVmtkV3hsUm14MWMyZ2dQU0IxYzJWTlpYTnpZV2RsUTJoaGJtNWxiQ2dwTzF4dWZTQmxiSE5sSUdsbUlDaGljbTkzYzJWeVYybHVaRzkzSUQwOVBTQjFibVJsWm1sdVpXUWdKaVlnZEhsd1pXOW1JSEpsY1hWcGNtVWdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnYzJOb1pXUjFiR1ZHYkhWemFDQTlJR0YwZEdWdGNIUldaWEowZUNncE8xeHVmU0JsYkhObElIdGNiaUFnYzJOb1pXUjFiR1ZHYkhWemFDQTlJSFZ6WlZObGRGUnBiV1Z2ZFhRb0tUdGNibjFjYmx4dVpuVnVZM1JwYjI0Z2RHaGxiaWh2YmtaMWJHWnBiR3h0Wlc1MExDQnZibEpsYW1WamRHbHZiaWtnZTF4dUlDQjJZWElnWDJGeVozVnRaVzUwY3lBOUlHRnlaM1Z0Wlc1MGN6dGNibHh1SUNCMllYSWdjR0Z5Wlc1MElEMGdkR2hwY3p0Y2JseHVJQ0IyWVhJZ1kyaHBiR1FnUFNCdVpYY2dkR2hwY3k1amIyNXpkSEoxWTNSdmNpaHViMjl3S1R0Y2JseHVJQ0JwWmlBb1kyaHBiR1JiVUZKUFRVbFRSVjlKUkYwZ1BUMDlJSFZ1WkdWbWFXNWxaQ2tnZTF4dUlDQWdJRzFoYTJWUWNtOXRhWE5sS0dOb2FXeGtLVHRjYmlBZ2ZWeHVYRzRnSUhaaGNpQmZjM1JoZEdVZ1BTQndZWEpsYm5RdVgzTjBZWFJsTzF4dVhHNGdJR2xtSUNoZmMzUmhkR1VwSUh0Y2JpQWdJQ0FvWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ2RtRnlJR05oYkd4aVlXTnJJRDBnWDJGeVozVnRaVzUwYzF0ZmMzUmhkR1VnTFNBeFhUdGNiaUFnSUNBZ0lHRnpZWEFvWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2FXNTJiMnRsUTJGc2JHSmhZMnNvWDNOMFlYUmxMQ0JqYUdsc1pDd2dZMkZzYkdKaFkyc3NJSEJoY21WdWRDNWZjbVZ6ZFd4MEtUdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMHBLQ2s3WEc0Z0lIMGdaV3h6WlNCN1hHNGdJQ0FnYzNWaWMyTnlhV0psS0hCaGNtVnVkQ3dnWTJocGJHUXNJRzl1Um5Wc1ptbHNiRzFsYm5Rc0lHOXVVbVZxWldOMGFXOXVLVHRjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJqYUdsc1pEdGNibjFjYmx4dUx5b3FYRzRnSUdCUWNtOXRhWE5sTG5KbGMyOXNkbVZnSUhKbGRIVnlibk1nWVNCd2NtOXRhWE5sSUhSb1lYUWdkMmxzYkNCaVpXTnZiV1VnY21WemIyeDJaV1FnZDJsMGFDQjBhR1ZjYmlBZ2NHRnpjMlZrSUdCMllXeDFaV0F1SUVsMElHbHpJSE5vYjNKMGFHRnVaQ0JtYjNJZ2RHaGxJR1p2Ykd4dmQybHVaenBjYmx4dUlDQmdZR0JxWVhaaGMyTnlhWEIwWEc0Z0lHeGxkQ0J3Y205dGFYTmxJRDBnYm1WM0lGQnliMjFwYzJVb1puVnVZM1JwYjI0b2NtVnpiMngyWlN3Z2NtVnFaV04wS1h0Y2JpQWdJQ0J5WlhOdmJIWmxLREVwTzF4dUlDQjlLVHRjYmx4dUlDQndjbTl0YVhObExuUm9aVzRvWm5WdVkzUnBiMjRvZG1Gc2RXVXBlMXh1SUNBZ0lDOHZJSFpoYkhWbElEMDlQU0F4WEc0Z0lIMHBPMXh1SUNCZ1lHQmNibHh1SUNCSmJuTjBaV0ZrSUc5bUlIZHlhWFJwYm1jZ2RHaGxJR0ZpYjNabExDQjViM1Z5SUdOdlpHVWdibTkzSUhOcGJYQnNlU0JpWldOdmJXVnpJSFJvWlNCbWIyeHNiM2RwYm1jNlhHNWNiaUFnWUdCZ2FtRjJZWE5qY21sd2RGeHVJQ0JzWlhRZ2NISnZiV2x6WlNBOUlGQnliMjFwYzJVdWNtVnpiMngyWlNneEtUdGNibHh1SUNCd2NtOXRhWE5sTG5Sb1pXNG9ablZ1WTNScGIyNG9kbUZzZFdVcGUxeHVJQ0FnSUM4dklIWmhiSFZsSUQwOVBTQXhYRzRnSUgwcE8xeHVJQ0JnWUdCY2JseHVJQ0JBYldWMGFHOWtJSEpsYzI5c2RtVmNiaUFnUUhOMFlYUnBZMXh1SUNCQWNHRnlZVzBnZTBGdWVYMGdkbUZzZFdVZ2RtRnNkV1VnZEdoaGRDQjBhR1VnY21WMGRYSnVaV1FnY0hKdmJXbHpaU0IzYVd4c0lHSmxJSEpsYzI5c2RtVmtJSGRwZEdoY2JpQWdWWE5sWm5Wc0lHWnZjaUIwYjI5c2FXNW5MbHh1SUNCQWNtVjBkWEp1SUh0UWNtOXRhWE5sZlNCaElIQnliMjFwYzJVZ2RHaGhkQ0IzYVd4c0lHSmxZMjl0WlNCbWRXeG1hV3hzWldRZ2QybDBhQ0IwYUdVZ1oybDJaVzVjYmlBZ1lIWmhiSFZsWUZ4dUtpOWNibVoxYm1OMGFXOXVJSEpsYzI5c2RtVW9iMkpxWldOMEtTQjdYRzRnSUM4cWFuTm9hVzUwSUhaaGJHbGtkR2hwY3pwMGNuVmxJQ292WEc0Z0lIWmhjaUJEYjI1emRISjFZM1J2Y2lBOUlIUm9hWE03WEc1Y2JpQWdhV1lnS0c5aWFtVmpkQ0FtSmlCMGVYQmxiMllnYjJKcVpXTjBJRDA5UFNBbmIySnFaV04wSnlBbUppQnZZbXBsWTNRdVkyOXVjM1J5ZFdOMGIzSWdQVDA5SUVOdmJuTjBjblZqZEc5eUtTQjdYRzRnSUNBZ2NtVjBkWEp1SUc5aWFtVmpkRHRjYmlBZ2ZWeHVYRzRnSUhaaGNpQndjbTl0YVhObElEMGdibVYzSUVOdmJuTjBjblZqZEc5eUtHNXZiM0FwTzF4dUlDQmZjbVZ6YjJ4MlpTaHdjbTl0YVhObExDQnZZbXBsWTNRcE8xeHVJQ0J5WlhSMWNtNGdjSEp2YldselpUdGNibjFjYmx4dWRtRnlJRkJTVDAxSlUwVmZTVVFnUFNCTllYUm9MbkpoYm1SdmJTZ3BMblJ2VTNSeWFXNW5LRE0yS1M1emRXSnpkSEpwYm1jb01UWXBPMXh1WEc1bWRXNWpkR2x2YmlCdWIyOXdLQ2tnZTMxY2JseHVkbUZ5SUZCRlRrUkpUa2NnUFNCMmIybGtJREE3WEc1MllYSWdSbFZNUmtsTVRFVkVJRDBnTVR0Y2JuWmhjaUJTUlVwRlExUkZSQ0E5SURJN1hHNWNiblpoY2lCSFJWUmZWRWhGVGw5RlVsSlBVaUE5SUc1bGR5QkZjbkp2Y2s5aWFtVmpkQ2dwTzF4dVhHNW1kVzVqZEdsdmJpQnpaV3htUm5Wc1ptbHNiRzFsYm5Rb0tTQjdYRzRnSUhKbGRIVnliaUJ1WlhjZ1ZIbHdaVVZ5Y205eUtGd2lXVzkxSUdOaGJtNXZkQ0J5WlhOdmJIWmxJR0VnY0hKdmJXbHpaU0IzYVhSb0lHbDBjMlZzWmx3aUtUdGNibjFjYmx4dVpuVnVZM1JwYjI0Z1kyRnVibTkwVW1WMGRYSnVUM2R1S0NrZ2UxeHVJQ0J5WlhSMWNtNGdibVYzSUZSNWNHVkZjbkp2Y2lnblFTQndjbTl0YVhObGN5QmpZV3hzWW1GamF5QmpZVzV1YjNRZ2NtVjBkWEp1SUhSb1lYUWdjMkZ0WlNCd2NtOXRhWE5sTGljcE8xeHVmVnh1WEc1bWRXNWpkR2x2YmlCblpYUlVhR1Z1S0hCeWIyMXBjMlVwSUh0Y2JpQWdkSEo1SUh0Y2JpQWdJQ0J5WlhSMWNtNGdjSEp2YldselpTNTBhR1Z1TzF4dUlDQjlJR05oZEdOb0lDaGxjbkp2Y2lrZ2UxeHVJQ0FnSUVkRlZGOVVTRVZPWDBWU1VrOVNMbVZ5Y205eUlEMGdaWEp5YjNJN1hHNGdJQ0FnY21WMGRYSnVJRWRGVkY5VVNFVk9YMFZTVWs5U08xeHVJQ0I5WEc1OVhHNWNibVoxYm1OMGFXOXVJSFJ5ZVZSb1pXNG9kR2hsYml3Z2RtRnNkV1VzSUdaMWJHWnBiR3h0Wlc1MFNHRnVaR3hsY2l3Z2NtVnFaV04wYVc5dVNHRnVaR3hsY2lrZ2UxeHVJQ0IwY25rZ2UxeHVJQ0FnSUhSb1pXNHVZMkZzYkNoMllXeDFaU3dnWm5Wc1ptbHNiRzFsYm5SSVlXNWtiR1Z5TENCeVpXcGxZM1JwYjI1SVlXNWtiR1Z5S1R0Y2JpQWdmU0JqWVhSamFDQW9aU2tnZTF4dUlDQWdJSEpsZEhWeWJpQmxPMXh1SUNCOVhHNTlYRzVjYm1aMWJtTjBhVzl1SUdoaGJtUnNaVVp2Y21WcFoyNVVhR1Z1WVdKc1pTaHdjbTl0YVhObExDQjBhR1Z1WVdKc1pTd2dkR2hsYmlrZ2UxeHVJQ0JoYzJGd0tHWjFibU4wYVc5dUlDaHdjbTl0YVhObEtTQjdYRzRnSUNBZ2RtRnlJSE5sWVd4bFpDQTlJR1poYkhObE8xeHVJQ0FnSUhaaGNpQmxjbkp2Y2lBOUlIUnllVlJvWlc0b2RHaGxiaXdnZEdobGJtRmliR1VzSUdaMWJtTjBhVzl1SUNoMllXeDFaU2tnZTF4dUlDQWdJQ0FnYVdZZ0tITmxZV3hsWkNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200N1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCelpXRnNaV1FnUFNCMGNuVmxPMXh1SUNBZ0lDQWdhV1lnS0hSb1pXNWhZbXhsSUNFOVBTQjJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ0lDQmZjbVZ6YjJ4MlpTaHdjbTl0YVhObExDQjJZV3gxWlNrN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCbWRXeG1hV3hzS0hCeWIyMXBjMlVzSUhaaGJIVmxLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlMQ0JtZFc1amRHbHZiaUFvY21WaGMyOXVLU0I3WEc0Z0lDQWdJQ0JwWmlBb2MyVmhiR1ZrS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUhObFlXeGxaQ0E5SUhSeWRXVTdYRzVjYmlBZ0lDQWdJRjl5WldwbFkzUW9jSEp2YldselpTd2djbVZoYzI5dUtUdGNiaUFnSUNCOUxDQW5VMlYwZEd4bE9pQW5JQ3NnS0hCeWIyMXBjMlV1WDJ4aFltVnNJSHg4SUNjZ2RXNXJibTkzYmlCd2NtOXRhWE5sSnlrcE8xeHVYRzRnSUNBZ2FXWWdLQ0Z6WldGc1pXUWdKaVlnWlhKeWIzSXBJSHRjYmlBZ0lDQWdJSE5sWVd4bFpDQTlJSFJ5ZFdVN1hHNGdJQ0FnSUNCZmNtVnFaV04wS0hCeWIyMXBjMlVzSUdWeWNtOXlLVHRjYmlBZ0lDQjlYRzRnSUgwc0lIQnliMjFwYzJVcE8xeHVmVnh1WEc1bWRXNWpkR2x2YmlCb1lXNWtiR1ZQZDI1VWFHVnVZV0pzWlNod2NtOXRhWE5sTENCMGFHVnVZV0pzWlNrZ2UxeHVJQ0JwWmlBb2RHaGxibUZpYkdVdVgzTjBZWFJsSUQwOVBTQkdWVXhHU1V4TVJVUXBJSHRjYmlBZ0lDQm1kV3htYVd4c0tIQnliMjFwYzJVc0lIUm9aVzVoWW14bExsOXlaWE4xYkhRcE8xeHVJQ0I5SUdWc2MyVWdhV1lnS0hSb1pXNWhZbXhsTGw5emRHRjBaU0E5UFQwZ1VrVktSVU5VUlVRcElIdGNiaUFnSUNCZmNtVnFaV04wS0hCeWIyMXBjMlVzSUhSb1pXNWhZbXhsTGw5eVpYTjFiSFFwTzF4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUhOMVluTmpjbWxpWlNoMGFHVnVZV0pzWlN3Z2RXNWtaV1pwYm1Wa0xDQm1kVzVqZEdsdmJpQW9kbUZzZFdVcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCZmNtVnpiMngyWlNod2NtOXRhWE5sTENCMllXeDFaU2s3WEc0Z0lDQWdmU3dnWm5WdVkzUnBiMjRnS0hKbFlYTnZiaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRjl5WldwbFkzUW9jSEp2YldselpTd2djbVZoYzI5dUtUdGNiaUFnSUNCOUtUdGNiaUFnZlZ4dWZWeHVYRzVtZFc1amRHbHZiaUJvWVc1a2JHVk5ZWGxpWlZSb1pXNWhZbXhsS0hCeWIyMXBjMlVzSUcxaGVXSmxWR2hsYm1GaWJHVXNJSFJvWlc0a0pDa2dlMXh1SUNCcFppQW9iV0Y1WW1WVWFHVnVZV0pzWlM1amIyNXpkSEoxWTNSdmNpQTlQVDBnY0hKdmJXbHpaUzVqYjI1emRISjFZM1J2Y2lBbUppQjBhR1Z1SkNRZ1BUMDlJSFJvWlc0Z0ppWWdiV0Y1WW1WVWFHVnVZV0pzWlM1amIyNXpkSEoxWTNSdmNpNXlaWE52YkhabElEMDlQU0J5WlhOdmJIWmxLU0I3WEc0Z0lDQWdhR0Z1Wkd4bFQzZHVWR2hsYm1GaWJHVW9jSEp2YldselpTd2diV0Y1WW1WVWFHVnVZV0pzWlNrN1hHNGdJSDBnWld4elpTQjdYRzRnSUNBZ2FXWWdLSFJvWlc0a0pDQTlQVDBnUjBWVVgxUklSVTVmUlZKU1QxSXBJSHRjYmlBZ0lDQWdJRjl5WldwbFkzUW9jSEp2YldselpTd2dSMFZVWDFSSVJVNWZSVkpTVDFJdVpYSnliM0lwTzF4dUlDQWdJSDBnWld4elpTQnBaaUFvZEdobGJpUWtJRDA5UFNCMWJtUmxabWx1WldRcElIdGNiaUFnSUNBZ0lHWjFiR1pwYkd3b2NISnZiV2x6WlN3Z2JXRjVZbVZVYUdWdVlXSnNaU2s3WEc0Z0lDQWdmU0JsYkhObElHbG1JQ2hwYzBaMWJtTjBhVzl1S0hSb1pXNGtKQ2twSUh0Y2JpQWdJQ0FnSUdoaGJtUnNaVVp2Y21WcFoyNVVhR1Z1WVdKc1pTaHdjbTl0YVhObExDQnRZWGxpWlZSb1pXNWhZbXhsTENCMGFHVnVKQ1FwTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQm1kV3htYVd4c0tIQnliMjFwYzJVc0lHMWhlV0psVkdobGJtRmliR1VwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVmVnh1WEc1bWRXNWpkR2x2YmlCZmNtVnpiMngyWlNod2NtOXRhWE5sTENCMllXeDFaU2tnZTF4dUlDQnBaaUFvY0hKdmJXbHpaU0E5UFQwZ2RtRnNkV1VwSUh0Y2JpQWdJQ0JmY21WcVpXTjBLSEJ5YjIxcGMyVXNJSE5sYkdaR2RXeG1hV3hzYldWdWRDZ3BLVHRjYmlBZ2ZTQmxiSE5sSUdsbUlDaHZZbXBsWTNSUGNrWjFibU4wYVc5dUtIWmhiSFZsS1NrZ2UxeHVJQ0FnSUdoaGJtUnNaVTFoZVdKbFZHaGxibUZpYkdVb2NISnZiV2x6WlN3Z2RtRnNkV1VzSUdkbGRGUm9aVzRvZG1Gc2RXVXBLVHRjYmlBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0JtZFd4bWFXeHNLSEJ5YjIxcGMyVXNJSFpoYkhWbEtUdGNiaUFnZlZ4dWZWeHVYRzVtZFc1amRHbHZiaUJ3ZFdKc2FYTm9VbVZxWldOMGFXOXVLSEJ5YjIxcGMyVXBJSHRjYmlBZ2FXWWdLSEJ5YjIxcGMyVXVYMjl1WlhKeWIzSXBJSHRjYmlBZ0lDQndjbTl0YVhObExsOXZibVZ5Y205eUtIQnliMjFwYzJVdVgzSmxjM1ZzZENrN1hHNGdJSDFjYmx4dUlDQndkV0pzYVhOb0tIQnliMjFwYzJVcE8xeHVmVnh1WEc1bWRXNWpkR2x2YmlCbWRXeG1hV3hzS0hCeWIyMXBjMlVzSUhaaGJIVmxLU0I3WEc0Z0lHbG1JQ2h3Y205dGFYTmxMbDl6ZEdGMFpTQWhQVDBnVUVWT1JFbE9SeWtnZTF4dUlDQWdJSEpsZEhWeWJqdGNiaUFnZlZ4dVhHNGdJSEJ5YjIxcGMyVXVYM0psYzNWc2RDQTlJSFpoYkhWbE8xeHVJQ0J3Y205dGFYTmxMbDl6ZEdGMFpTQTlJRVpWVEVaSlRFeEZSRHRjYmx4dUlDQnBaaUFvY0hKdmJXbHpaUzVmYzNWaWMyTnlhV0psY25NdWJHVnVaM1JvSUNFOVBTQXdLU0I3WEc0Z0lDQWdZWE5oY0Nod2RXSnNhWE5vTENCd2NtOXRhWE5sS1R0Y2JpQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQmZjbVZxWldOMEtIQnliMjFwYzJVc0lISmxZWE52YmlrZ2UxeHVJQ0JwWmlBb2NISnZiV2x6WlM1ZmMzUmhkR1VnSVQwOUlGQkZUa1JKVGtjcElIdGNiaUFnSUNCeVpYUjFjbTQ3WEc0Z0lIMWNiaUFnY0hKdmJXbHpaUzVmYzNSaGRHVWdQU0JTUlVwRlExUkZSRHRjYmlBZ2NISnZiV2x6WlM1ZmNtVnpkV3gwSUQwZ2NtVmhjMjl1TzF4dVhHNGdJR0Z6WVhBb2NIVmliR2x6YUZKbGFtVmpkR2x2Yml3Z2NISnZiV2x6WlNrN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUhOMVluTmpjbWxpWlNod1lYSmxiblFzSUdOb2FXeGtMQ0J2YmtaMWJHWnBiR3h0Wlc1MExDQnZibEpsYW1WamRHbHZiaWtnZTF4dUlDQjJZWElnWDNOMVluTmpjbWxpWlhKeklEMGdjR0Z5Wlc1MExsOXpkV0p6WTNKcFltVnljenRjYmlBZ2RtRnlJR3hsYm1kMGFDQTlJRjl6ZFdKelkzSnBZbVZ5Y3k1c1pXNW5kR2c3WEc1Y2JpQWdjR0Z5Wlc1MExsOXZibVZ5Y205eUlEMGdiblZzYkR0Y2JseHVJQ0JmYzNWaWMyTnlhV0psY25OYmJHVnVaM1JvWFNBOUlHTm9hV3hrTzF4dUlDQmZjM1ZpYzJOeWFXSmxjbk5iYkdWdVozUm9JQ3NnUmxWTVJrbE1URVZFWFNBOUlHOXVSblZzWm1sc2JHMWxiblE3WEc0Z0lGOXpkV0p6WTNKcFltVnljMXRzWlc1bmRHZ2dLeUJTUlVwRlExUkZSRjBnUFNCdmJsSmxhbVZqZEdsdmJqdGNibHh1SUNCcFppQW9iR1Z1WjNSb0lEMDlQU0F3SUNZbUlIQmhjbVZ1ZEM1ZmMzUmhkR1VwSUh0Y2JpQWdJQ0JoYzJGd0tIQjFZbXhwYzJnc0lIQmhjbVZ1ZENrN1hHNGdJSDFjYm4xY2JseHVablZ1WTNScGIyNGdjSFZpYkdsemFDaHdjbTl0YVhObEtTQjdYRzRnSUhaaGNpQnpkV0p6WTNKcFltVnljeUE5SUhCeWIyMXBjMlV1WDNOMVluTmpjbWxpWlhKek8xeHVJQ0IyWVhJZ2MyVjBkR3hsWkNBOUlIQnliMjFwYzJVdVgzTjBZWFJsTzF4dVhHNGdJR2xtSUNoemRXSnpZM0pwWW1WeWN5NXNaVzVuZEdnZ1BUMDlJREFwSUh0Y2JpQWdJQ0J5WlhSMWNtNDdYRzRnSUgxY2JseHVJQ0IyWVhJZ1kyaHBiR1FnUFNCMWJtUmxabWx1WldRc1hHNGdJQ0FnSUNCallXeHNZbUZqYXlBOUlIVnVaR1ZtYVc1bFpDeGNiaUFnSUNBZ0lHUmxkR0ZwYkNBOUlIQnliMjFwYzJVdVgzSmxjM1ZzZER0Y2JseHVJQ0JtYjNJZ0tIWmhjaUJwSUQwZ01Ec2dhU0E4SUhOMVluTmpjbWxpWlhKekxteGxibWQwYURzZ2FTQXJQU0F6S1NCN1hHNGdJQ0FnWTJocGJHUWdQU0J6ZFdKelkzSnBZbVZ5YzF0cFhUdGNiaUFnSUNCallXeHNZbUZqYXlBOUlITjFZbk5qY21saVpYSnpXMmtnS3lCelpYUjBiR1ZrWFR0Y2JseHVJQ0FnSUdsbUlDaGphR2xzWkNrZ2UxeHVJQ0FnSUNBZ2FXNTJiMnRsUTJGc2JHSmhZMnNvYzJWMGRHeGxaQ3dnWTJocGJHUXNJR05oYkd4aVlXTnJMQ0JrWlhSaGFXd3BPMXh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCallXeHNZbUZqYXloa1pYUmhhV3dwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhCeWIyMXBjMlV1WDNOMVluTmpjbWxpWlhKekxteGxibWQwYUNBOUlEQTdYRzU5WEc1Y2JtWjFibU4wYVc5dUlFVnljbTl5VDJKcVpXTjBLQ2tnZTF4dUlDQjBhR2x6TG1WeWNtOXlJRDBnYm5Wc2JEdGNibjFjYmx4dWRtRnlJRlJTV1Y5RFFWUkRTRjlGVWxKUFVpQTlJRzVsZHlCRmNuSnZjazlpYW1WamRDZ3BPMXh1WEc1bWRXNWpkR2x2YmlCMGNubERZWFJqYUNoallXeHNZbUZqYXl3Z1pHVjBZV2xzS1NCN1hHNGdJSFJ5ZVNCN1hHNGdJQ0FnY21WMGRYSnVJR05oYkd4aVlXTnJLR1JsZEdGcGJDazdYRzRnSUgwZ1kyRjBZMmdnS0dVcElIdGNiaUFnSUNCVVVsbGZRMEZVUTBoZlJWSlNUMUl1WlhKeWIzSWdQU0JsTzF4dUlDQWdJSEpsZEhWeWJpQlVVbGxmUTBGVVEwaGZSVkpTVDFJN1hHNGdJSDFjYm4xY2JseHVablZ1WTNScGIyNGdhVzUyYjJ0bFEyRnNiR0poWTJzb2MyVjBkR3hsWkN3Z2NISnZiV2x6WlN3Z1kyRnNiR0poWTJzc0lHUmxkR0ZwYkNrZ2UxeHVJQ0IyWVhJZ2FHRnpRMkZzYkdKaFkyc2dQU0JwYzBaMWJtTjBhVzl1S0dOaGJHeGlZV05yS1N4Y2JpQWdJQ0FnSUhaaGJIVmxJRDBnZFc1a1pXWnBibVZrTEZ4dUlDQWdJQ0FnWlhKeWIzSWdQU0IxYm1SbFptbHVaV1FzWEc0Z0lDQWdJQ0J6ZFdOalpXVmtaV1FnUFNCMWJtUmxabWx1WldRc1hHNGdJQ0FnSUNCbVlXbHNaV1FnUFNCMWJtUmxabWx1WldRN1hHNWNiaUFnYVdZZ0tHaGhjME5oYkd4aVlXTnJLU0I3WEc0Z0lDQWdkbUZzZFdVZ1BTQjBjbmxEWVhSamFDaGpZV3hzWW1GamF5d2daR1YwWVdsc0tUdGNibHh1SUNBZ0lHbG1JQ2gyWVd4MVpTQTlQVDBnVkZKWlgwTkJWRU5JWDBWU1VrOVNLU0I3WEc0Z0lDQWdJQ0JtWVdsc1pXUWdQU0IwY25WbE8xeHVJQ0FnSUNBZ1pYSnliM0lnUFNCMllXeDFaUzVsY25KdmNqdGNiaUFnSUNBZ0lIWmhiSFZsSUQwZ2JuVnNiRHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2MzVmpZMlZsWkdWa0lEMGdkSEoxWlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2NISnZiV2x6WlNBOVBUMGdkbUZzZFdVcElIdGNiaUFnSUNBZ0lGOXlaV3BsWTNRb2NISnZiV2x6WlN3Z1kyRnVibTkwVW1WMGRYSnVUM2R1S0NrcE8xeHVJQ0FnSUNBZ2NtVjBkWEp1TzF4dUlDQWdJSDFjYmlBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0IyWVd4MVpTQTlJR1JsZEdGcGJEdGNiaUFnSUNCemRXTmpaV1ZrWldRZ1BTQjBjblZsTzF4dUlDQjlYRzVjYmlBZ2FXWWdLSEJ5YjIxcGMyVXVYM04wWVhSbElDRTlQU0JRUlU1RVNVNUhLU0I3WEc0Z0lDQWdMeThnYm05dmNGeHVJQ0I5SUdWc2MyVWdhV1lnS0doaGMwTmhiR3hpWVdOcklDWW1JSE4xWTJObFpXUmxaQ2tnZTF4dUlDQWdJQ0FnWDNKbGMyOXNkbVVvY0hKdmJXbHpaU3dnZG1Gc2RXVXBPMXh1SUNBZ0lIMGdaV3h6WlNCcFppQW9abUZwYkdWa0tTQjdYRzRnSUNBZ0lDQmZjbVZxWldOMEtIQnliMjFwYzJVc0lHVnljbTl5S1R0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0hObGRIUnNaV1FnUFQwOUlFWlZURVpKVEV4RlJDa2dlMXh1SUNBZ0lDQWdablZzWm1sc2JDaHdjbTl0YVhObExDQjJZV3gxWlNrN1hHNGdJQ0FnZlNCbGJITmxJR2xtSUNoelpYUjBiR1ZrSUQwOVBTQlNSVXBGUTFSRlJDa2dlMXh1SUNBZ0lDQWdYM0psYW1WamRDaHdjbTl0YVhObExDQjJZV3gxWlNrN1hHNGdJQ0FnZlZ4dWZWeHVYRzVtZFc1amRHbHZiaUJwYm1sMGFXRnNhWHBsVUhKdmJXbHpaU2h3Y205dGFYTmxMQ0J5WlhOdmJIWmxjaWtnZTF4dUlDQjBjbmtnZTF4dUlDQWdJSEpsYzI5c2RtVnlLR1oxYm1OMGFXOXVJSEpsYzI5c2RtVlFjbTl0YVhObEtIWmhiSFZsS1NCN1hHNGdJQ0FnSUNCZmNtVnpiMngyWlNod2NtOXRhWE5sTENCMllXeDFaU2s3WEc0Z0lDQWdmU3dnWm5WdVkzUnBiMjRnY21WcVpXTjBVSEp2YldselpTaHlaV0Z6YjI0cElIdGNiaUFnSUNBZ0lGOXlaV3BsWTNRb2NISnZiV2x6WlN3Z2NtVmhjMjl1S1R0Y2JpQWdJQ0I5S1R0Y2JpQWdmU0JqWVhSamFDQW9aU2tnZTF4dUlDQWdJRjl5WldwbFkzUW9jSEp2YldselpTd2daU2s3WEc0Z0lIMWNibjFjYmx4dWRtRnlJR2xrSUQwZ01EdGNibVoxYm1OMGFXOXVJRzVsZUhSSlpDZ3BJSHRjYmlBZ2NtVjBkWEp1SUdsa0t5czdYRzU5WEc1Y2JtWjFibU4wYVc5dUlHMWhhMlZRY205dGFYTmxLSEJ5YjIxcGMyVXBJSHRjYmlBZ2NISnZiV2x6WlZ0UVVrOU5TVk5GWDBsRVhTQTlJR2xrS3lzN1hHNGdJSEJ5YjIxcGMyVXVYM04wWVhSbElEMGdkVzVrWldacGJtVmtPMXh1SUNCd2NtOXRhWE5sTGw5eVpYTjFiSFFnUFNCMWJtUmxabWx1WldRN1hHNGdJSEJ5YjIxcGMyVXVYM04xWW5OamNtbGlaWEp6SUQwZ1cxMDdYRzU5WEc1Y2JtWjFibU4wYVc5dUlFVnVkVzFsY21GMGIzSW9RMjl1YzNSeWRXTjBiM0lzSUdsdWNIVjBLU0I3WEc0Z0lIUm9hWE11WDJsdWMzUmhibU5sUTI5dWMzUnlkV04wYjNJZ1BTQkRiMjV6ZEhKMVkzUnZjanRjYmlBZ2RHaHBjeTV3Y205dGFYTmxJRDBnYm1WM0lFTnZibk4wY25WamRHOXlLRzV2YjNBcE8xeHVYRzRnSUdsbUlDZ2hkR2hwY3k1d2NtOXRhWE5sVzFCU1QwMUpVMFZmU1VSZEtTQjdYRzRnSUNBZ2JXRnJaVkJ5YjIxcGMyVW9kR2hwY3k1d2NtOXRhWE5sS1R0Y2JpQWdmVnh1WEc0Z0lHbG1JQ2hwYzBGeWNtRjVLR2x1Y0hWMEtTa2dlMXh1SUNBZ0lIUm9hWE11WDJsdWNIVjBJRDBnYVc1d2RYUTdYRzRnSUNBZ2RHaHBjeTVzWlc1bmRHZ2dQU0JwYm5CMWRDNXNaVzVuZEdnN1hHNGdJQ0FnZEdocGN5NWZjbVZ0WVdsdWFXNW5JRDBnYVc1d2RYUXViR1Z1WjNSb08xeHVYRzRnSUNBZ2RHaHBjeTVmY21WemRXeDBJRDBnYm1WM0lFRnljbUY1S0hSb2FYTXViR1Z1WjNSb0tUdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxteGxibWQwYUNBOVBUMGdNQ2tnZTF4dUlDQWdJQ0FnWm5Wc1ptbHNiQ2gwYUdsekxuQnliMjFwYzJVc0lIUm9hWE11WDNKbGMzVnNkQ2s3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lIUm9hWE11YkdWdVozUm9JRDBnZEdocGN5NXNaVzVuZEdnZ2ZId2dNRHRjYmlBZ0lDQWdJSFJvYVhNdVgyVnVkVzFsY21GMFpTZ3BPMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVYM0psYldGcGJtbHVaeUE5UFQwZ01Da2dlMXh1SUNBZ0lDQWdJQ0JtZFd4bWFXeHNLSFJvYVhNdWNISnZiV2x6WlN3Z2RHaHBjeTVmY21WemRXeDBLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdYM0psYW1WamRDaDBhR2x6TG5CeWIyMXBjMlVzSUhaaGJHbGtZWFJwYjI1RmNuSnZjaWdwS1R0Y2JpQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQjJZV3hwWkdGMGFXOXVSWEp5YjNJb0tTQjdYRzRnSUhKbGRIVnliaUJ1WlhjZ1JYSnliM0lvSjBGeWNtRjVJRTFsZEdodlpITWdiWFZ6ZENCaVpTQndjbTkyYVdSbFpDQmhiaUJCY25KaGVTY3BPMXh1ZlR0Y2JseHVSVzUxYldWeVlYUnZjaTV3Y205MGIzUjVjR1V1WDJWdWRXMWxjbUYwWlNBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ2RtRnlJR3hsYm1kMGFDQTlJSFJvYVhNdWJHVnVaM1JvTzF4dUlDQjJZWElnWDJsdWNIVjBJRDBnZEdocGN5NWZhVzV3ZFhRN1hHNWNiaUFnWm05eUlDaDJZWElnYVNBOUlEQTdJSFJvYVhNdVgzTjBZWFJsSUQwOVBTQlFSVTVFU1U1SElDWW1JR2tnUENCc1pXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lIUm9hWE11WDJWaFkyaEZiblJ5ZVNoZmFXNXdkWFJiYVYwc0lHa3BPMXh1SUNCOVhHNTlPMXh1WEc1RmJuVnRaWEpoZEc5eUxuQnliM1J2ZEhsd1pTNWZaV0ZqYUVWdWRISjVJRDBnWm5WdVkzUnBiMjRnS0dWdWRISjVMQ0JwS1NCN1hHNGdJSFpoY2lCaklEMGdkR2hwY3k1ZmFXNXpkR0Z1WTJWRGIyNXpkSEoxWTNSdmNqdGNiaUFnZG1GeUlISmxjMjlzZG1Va0pDQTlJR011Y21WemIyeDJaVHRjYmx4dUlDQnBaaUFvY21WemIyeDJaU1FrSUQwOVBTQnlaWE52YkhabEtTQjdYRzRnSUNBZ2RtRnlJRjkwYUdWdUlEMGdaMlYwVkdobGJpaGxiblJ5ZVNrN1hHNWNiaUFnSUNCcFppQW9YM1JvWlc0Z1BUMDlJSFJvWlc0Z0ppWWdaVzUwY25rdVgzTjBZWFJsSUNFOVBTQlFSVTVFU1U1SEtTQjdYRzRnSUNBZ0lDQjBhR2x6TGw5elpYUjBiR1ZrUVhRb1pXNTBjbmt1WDNOMFlYUmxMQ0JwTENCbGJuUnllUzVmY21WemRXeDBLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2FXWWdLSFI1Y0dWdlppQmZkR2hsYmlBaFBUMGdKMloxYm1OMGFXOXVKeWtnZTF4dUlDQWdJQ0FnZEdocGN5NWZjbVZ0WVdsdWFXNW5MUzA3WEc0Z0lDQWdJQ0IwYUdsekxsOXlaWE4xYkhSYmFWMGdQU0JsYm5SeWVUdGNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tHTWdQVDA5SUZCeWIyMXBjMlVwSUh0Y2JpQWdJQ0FnSUhaaGNpQndjbTl0YVhObElEMGdibVYzSUdNb2JtOXZjQ2s3WEc0Z0lDQWdJQ0JvWVc1a2JHVk5ZWGxpWlZSb1pXNWhZbXhsS0hCeWIyMXBjMlVzSUdWdWRISjVMQ0JmZEdobGJpazdYRzRnSUNBZ0lDQjBhR2x6TGw5M2FXeHNVMlYwZEd4bFFYUW9jSEp2YldselpTd2dhU2s3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lIUm9hWE11WDNkcGJHeFRaWFIwYkdWQmRDaHVaWGNnWXlobWRXNWpkR2x2YmlBb2NtVnpiMngyWlNRa0tTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnlaWE52YkhabEpDUW9aVzUwY25rcE8xeHVJQ0FnSUNBZ2ZTa3NJR2twTzF4dUlDQWdJSDFjYmlBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0IwYUdsekxsOTNhV3hzVTJWMGRHeGxRWFFvY21WemIyeDJaU1FrS0dWdWRISjVLU3dnYVNrN1hHNGdJSDFjYm4wN1hHNWNia1Z1ZFcxbGNtRjBiM0l1Y0hKdmRHOTBlWEJsTGw5elpYUjBiR1ZrUVhRZ1BTQm1kVzVqZEdsdmJpQW9jM1JoZEdVc0lHa3NJSFpoYkhWbEtTQjdYRzRnSUhaaGNpQndjbTl0YVhObElEMGdkR2hwY3k1d2NtOXRhWE5sTzF4dVhHNGdJR2xtSUNod2NtOXRhWE5sTGw5emRHRjBaU0E5UFQwZ1VFVk9SRWxPUnlrZ2UxeHVJQ0FnSUhSb2FYTXVYM0psYldGcGJtbHVaeTB0TzF4dVhHNGdJQ0FnYVdZZ0tITjBZWFJsSUQwOVBTQlNSVXBGUTFSRlJDa2dlMXh1SUNBZ0lDQWdYM0psYW1WamRDaHdjbTl0YVhObExDQjJZV3gxWlNrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSFJvYVhNdVgzSmxjM1ZzZEZ0cFhTQTlJSFpoYkhWbE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lHbG1JQ2gwYUdsekxsOXlaVzFoYVc1cGJtY2dQVDA5SURBcElIdGNiaUFnSUNCbWRXeG1hV3hzS0hCeWIyMXBjMlVzSUhSb2FYTXVYM0psYzNWc2RDazdYRzRnSUgxY2JuMDdYRzVjYmtWdWRXMWxjbUYwYjNJdWNISnZkRzkwZVhCbExsOTNhV3hzVTJWMGRHeGxRWFFnUFNCbWRXNWpkR2x2YmlBb2NISnZiV2x6WlN3Z2FTa2dlMXh1SUNCMllYSWdaVzUxYldWeVlYUnZjaUE5SUhSb2FYTTdYRzVjYmlBZ2MzVmljMk55YVdKbEtIQnliMjFwYzJVc0lIVnVaR1ZtYVc1bFpDd2dablZ1WTNScGIyNGdLSFpoYkhWbEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUdWdWRXMWxjbUYwYjNJdVgzTmxkSFJzWldSQmRDaEdWVXhHU1V4TVJVUXNJR2tzSUhaaGJIVmxLVHRjYmlBZ2ZTd2dablZ1WTNScGIyNGdLSEpsWVhOdmJpa2dlMXh1SUNBZ0lISmxkSFZ5YmlCbGJuVnRaWEpoZEc5eUxsOXpaWFIwYkdWa1FYUW9Va1ZLUlVOVVJVUXNJR2tzSUhKbFlYTnZiaWs3WEc0Z0lIMHBPMXh1ZlR0Y2JseHVMeW9xWEc0Z0lHQlFjbTl0YVhObExtRnNiR0FnWVdOalpYQjBjeUJoYmlCaGNuSmhlU0J2WmlCd2NtOXRhWE5sY3l3Z1lXNWtJSEpsZEhWeWJuTWdZU0J1WlhjZ2NISnZiV2x6WlNCM2FHbGphRnh1SUNCcGN5Qm1kV3htYVd4c1pXUWdkMmwwYUNCaGJpQmhjbkpoZVNCdlppQm1kV3htYVd4c2JXVnVkQ0IyWVd4MVpYTWdabTl5SUhSb1pTQndZWE56WldRZ2NISnZiV2x6WlhNc0lHOXlYRzRnSUhKbGFtVmpkR1ZrSUhkcGRHZ2dkR2hsSUhKbFlYTnZiaUJ2WmlCMGFHVWdabWx5YzNRZ2NHRnpjMlZrSUhCeWIyMXBjMlVnZEc4Z1ltVWdjbVZxWldOMFpXUXVJRWwwSUdOaGMzUnpJR0ZzYkZ4dUlDQmxiR1Z0Wlc1MGN5QnZaaUIwYUdVZ2NHRnpjMlZrSUdsMFpYSmhZbXhsSUhSdklIQnliMjFwYzJWeklHRnpJR2wwSUhKMWJuTWdkR2hwY3lCaGJHZHZjbWwwYUcwdVhHNWNiaUFnUlhoaGJYQnNaVHBjYmx4dUlDQmdZR0JxWVhaaGMyTnlhWEIwWEc0Z0lHeGxkQ0J3Y205dGFYTmxNU0E5SUhKbGMyOXNkbVVvTVNrN1hHNGdJR3hsZENCd2NtOXRhWE5sTWlBOUlISmxjMjlzZG1Vb01pazdYRzRnSUd4bGRDQndjbTl0YVhObE15QTlJSEpsYzI5c2RtVW9NeWs3WEc0Z0lHeGxkQ0J3Y205dGFYTmxjeUE5SUZzZ2NISnZiV2x6WlRFc0lIQnliMjFwYzJVeUxDQndjbTl0YVhObE15QmRPMXh1WEc0Z0lGQnliMjFwYzJVdVlXeHNLSEJ5YjIxcGMyVnpLUzUwYUdWdUtHWjFibU4wYVc5dUtHRnljbUY1S1h0Y2JpQWdJQ0F2THlCVWFHVWdZWEp5WVhrZ2FHVnlaU0IzYjNWc1pDQmlaU0JiSURFc0lESXNJRE1nWFR0Y2JpQWdmU2s3WEc0Z0lHQmdZRnh1WEc0Z0lFbG1JR0Z1ZVNCdlppQjBhR1VnWUhCeWIyMXBjMlZ6WUNCbmFYWmxiaUIwYnlCZ1lXeHNZQ0JoY21VZ2NtVnFaV04wWldRc0lIUm9aU0JtYVhKemRDQndjbTl0YVhObFhHNGdJSFJvWVhRZ2FYTWdjbVZxWldOMFpXUWdkMmxzYkNCaVpTQm5hWFpsYmlCaGN5QmhiaUJoY21kMWJXVnVkQ0IwYnlCMGFHVWdjbVYwZFhKdVpXUWdjSEp2YldselpYTW5jMXh1SUNCeVpXcGxZM1JwYjI0Z2FHRnVaR3hsY2k0Z1JtOXlJR1Y0WVcxd2JHVTZYRzVjYmlBZ1JYaGhiWEJzWlRwY2JseHVJQ0JnWUdCcVlYWmhjMk55YVhCMFhHNGdJR3hsZENCd2NtOXRhWE5sTVNBOUlISmxjMjlzZG1Vb01TazdYRzRnSUd4bGRDQndjbTl0YVhObE1pQTlJSEpsYW1WamRDaHVaWGNnUlhKeWIzSW9YQ0l5WENJcEtUdGNiaUFnYkdWMElIQnliMjFwYzJVeklEMGdjbVZxWldOMEtHNWxkeUJGY25KdmNpaGNJak5jSWlrcE8xeHVJQ0JzWlhRZ2NISnZiV2x6WlhNZ1BTQmJJSEJ5YjIxcGMyVXhMQ0J3Y205dGFYTmxNaXdnY0hKdmJXbHpaVE1nWFR0Y2JseHVJQ0JRY205dGFYTmxMbUZzYkNod2NtOXRhWE5sY3lrdWRHaGxiaWhtZFc1amRHbHZiaWhoY25KaGVTbDdYRzRnSUNBZ0x5OGdRMjlrWlNCb1pYSmxJRzVsZG1WeUlISjFibk1nWW1WallYVnpaU0IwYUdWeVpTQmhjbVVnY21WcVpXTjBaV1FnY0hKdmJXbHpaWE1oWEc0Z0lIMHNJR1oxYm1OMGFXOXVLR1Z5Y205eUtTQjdYRzRnSUNBZ0x5OGdaWEp5YjNJdWJXVnpjMkZuWlNBOVBUMGdYQ0l5WENKY2JpQWdmU2s3WEc0Z0lHQmdZRnh1WEc0Z0lFQnRaWFJvYjJRZ1lXeHNYRzRnSUVCemRHRjBhV05jYmlBZ1FIQmhjbUZ0SUh0QmNuSmhlWDBnWlc1MGNtbGxjeUJoY25KaGVTQnZaaUJ3Y205dGFYTmxjMXh1SUNCQWNHRnlZVzBnZTFOMGNtbHVaMzBnYkdGaVpXd2diM0IwYVc5dVlXd2djM1J5YVc1bklHWnZjaUJzWVdKbGJHbHVaeUIwYUdVZ2NISnZiV2x6WlM1Y2JpQWdWWE5sWm5Wc0lHWnZjaUIwYjI5c2FXNW5MbHh1SUNCQWNtVjBkWEp1SUh0UWNtOXRhWE5sZlNCd2NtOXRhWE5sSUhSb1lYUWdhWE1nWm5Wc1ptbHNiR1ZrSUhkb1pXNGdZV3hzSUdCd2NtOXRhWE5sYzJBZ2FHRjJaU0JpWldWdVhHNGdJR1oxYkdacGJHeGxaQ3dnYjNJZ2NtVnFaV04wWldRZ2FXWWdZVzU1SUc5bUlIUm9aVzBnWW1WamIyMWxJSEpsYW1WamRHVmtMbHh1SUNCQWMzUmhkR2xqWEc0cUwxeHVablZ1WTNScGIyNGdZV3hzS0dWdWRISnBaWE1wSUh0Y2JpQWdjbVYwZFhKdUlHNWxkeUJGYm5WdFpYSmhkRzl5S0hSb2FYTXNJR1Z1ZEhKcFpYTXBMbkJ5YjIxcGMyVTdYRzU5WEc1Y2JpOHFLbHh1SUNCZ1VISnZiV2x6WlM1eVlXTmxZQ0J5WlhSMWNtNXpJR0VnYm1WM0lIQnliMjFwYzJVZ2QyaHBZMmdnYVhNZ2MyVjBkR3hsWkNCcGJpQjBhR1VnYzJGdFpTQjNZWGtnWVhNZ2RHaGxYRzRnSUdacGNuTjBJSEJoYzNObFpDQndjbTl0YVhObElIUnZJSE5sZEhSc1pTNWNibHh1SUNCRmVHRnRjR3hsT2x4dVhHNGdJR0JnWUdwaGRtRnpZM0pwY0hSY2JpQWdiR1YwSUhCeWIyMXBjMlV4SUQwZ2JtVjNJRkJ5YjIxcGMyVW9ablZ1WTNScGIyNG9jbVZ6YjJ4MlpTd2djbVZxWldOMEtYdGNiaUFnSUNCelpYUlVhVzFsYjNWMEtHWjFibU4wYVc5dUtDbDdYRzRnSUNBZ0lDQnlaWE52YkhabEtDZHdjbTl0YVhObElERW5LVHRjYmlBZ0lDQjlMQ0F5TURBcE8xeHVJQ0I5S1R0Y2JseHVJQ0JzWlhRZ2NISnZiV2x6WlRJZ1BTQnVaWGNnVUhKdmJXbHpaU2htZFc1amRHbHZiaWh5WlhOdmJIWmxMQ0J5WldwbFkzUXBlMXh1SUNBZ0lITmxkRlJwYldWdmRYUW9ablZ1WTNScGIyNG9LWHRjYmlBZ0lDQWdJSEpsYzI5c2RtVW9KM0J5YjIxcGMyVWdNaWNwTzF4dUlDQWdJSDBzSURFd01DazdYRzRnSUgwcE8xeHVYRzRnSUZCeWIyMXBjMlV1Y21GalpTaGJjSEp2YldselpURXNJSEJ5YjIxcGMyVXlYU2t1ZEdobGJpaG1kVzVqZEdsdmJpaHlaWE4xYkhRcGUxeHVJQ0FnSUM4dklISmxjM1ZzZENBOVBUMGdKM0J5YjIxcGMyVWdNaWNnWW1WallYVnpaU0JwZENCM1lYTWdjbVZ6YjJ4MlpXUWdZbVZtYjNKbElIQnliMjFwYzJVeFhHNGdJQ0FnTHk4Z2QyRnpJSEpsYzI5c2RtVmtMbHh1SUNCOUtUdGNiaUFnWUdCZ1hHNWNiaUFnWUZCeWIyMXBjMlV1Y21GalpXQWdhWE1nWkdWMFpYSnRhVzVwYzNScFl5QnBiaUIwYUdGMElHOXViSGtnZEdobElITjBZWFJsSUc5bUlIUm9aU0JtYVhKemRGeHVJQ0J6WlhSMGJHVmtJSEJ5YjIxcGMyVWdiV0YwZEdWeWN5NGdSbTl5SUdWNFlXMXdiR1VzSUdWMlpXNGdhV1lnYjNSb1pYSWdjSEp2YldselpYTWdaMmwyWlc0Z2RHOGdkR2hsWEc0Z0lHQndjbTl0YVhObGMyQWdZWEp5WVhrZ1lYSm5kVzFsYm5RZ1lYSmxJSEpsYzI5c2RtVmtMQ0JpZFhRZ2RHaGxJR1pwY25OMElITmxkSFJzWldRZ2NISnZiV2x6WlNCb1lYTmNiaUFnWW1WamIyMWxJSEpsYW1WamRHVmtJR0psWm05eVpTQjBhR1VnYjNSb1pYSWdjSEp2YldselpYTWdZbVZqWVcxbElHWjFiR1pwYkd4bFpDd2dkR2hsSUhKbGRIVnlibVZrWEc0Z0lIQnliMjFwYzJVZ2QybHNiQ0JpWldOdmJXVWdjbVZxWldOMFpXUTZYRzVjYmlBZ1lHQmdhbUYyWVhOamNtbHdkRnh1SUNCc1pYUWdjSEp2YldselpURWdQU0J1WlhjZ1VISnZiV2x6WlNobWRXNWpkR2x2YmloeVpYTnZiSFpsTENCeVpXcGxZM1FwZTF4dUlDQWdJSE5sZEZScGJXVnZkWFFvWm5WdVkzUnBiMjRvS1h0Y2JpQWdJQ0FnSUhKbGMyOXNkbVVvSjNCeWIyMXBjMlVnTVNjcE8xeHVJQ0FnSUgwc0lESXdNQ2s3WEc0Z0lIMHBPMXh1WEc0Z0lHeGxkQ0J3Y205dGFYTmxNaUE5SUc1bGR5QlFjbTl0YVhObEtHWjFibU4wYVc5dUtISmxjMjlzZG1Vc0lISmxhbVZqZENsN1hHNGdJQ0FnYzJWMFZHbHRaVzkxZENobWRXNWpkR2x2YmlncGUxeHVJQ0FnSUNBZ2NtVnFaV04wS0c1bGR5QkZjbkp2Y2lnbmNISnZiV2x6WlNBeUp5a3BPMXh1SUNBZ0lIMHNJREV3TUNrN1hHNGdJSDBwTzF4dVhHNGdJRkJ5YjIxcGMyVXVjbUZqWlNoYmNISnZiV2x6WlRFc0lIQnliMjFwYzJVeVhTa3VkR2hsYmlobWRXNWpkR2x2YmloeVpYTjFiSFFwZTF4dUlDQWdJQzh2SUVOdlpHVWdhR1Z5WlNCdVpYWmxjaUJ5ZFc1elhHNGdJSDBzSUdaMWJtTjBhVzl1S0hKbFlYTnZiaWw3WEc0Z0lDQWdMeThnY21WaGMyOXVMbTFsYzNOaFoyVWdQVDA5SUNkd2NtOXRhWE5sSURJbklHSmxZMkYxYzJVZ2NISnZiV2x6WlNBeUlHSmxZMkZ0WlNCeVpXcGxZM1JsWkNCaVpXWnZjbVZjYmlBZ0lDQXZMeUJ3Y205dGFYTmxJREVnWW1WallXMWxJR1oxYkdacGJHeGxaRnh1SUNCOUtUdGNiaUFnWUdCZ1hHNWNiaUFnUVc0Z1pYaGhiWEJzWlNCeVpXRnNMWGR2Y214a0lIVnpaU0JqWVhObElHbHpJR2x0Y0d4bGJXVnVkR2x1WnlCMGFXMWxiM1YwY3pwY2JseHVJQ0JnWUdCcVlYWmhjMk55YVhCMFhHNGdJRkJ5YjIxcGMyVXVjbUZqWlNoYllXcGhlQ2duWm05dkxtcHpiMjRuS1N3Z2RHbHRaVzkxZENnMU1EQXdLVjBwWEc0Z0lHQmdZRnh1WEc0Z0lFQnRaWFJvYjJRZ2NtRmpaVnh1SUNCQWMzUmhkR2xqWEc0Z0lFQndZWEpoYlNCN1FYSnlZWGw5SUhCeWIyMXBjMlZ6SUdGeWNtRjVJRzltSUhCeWIyMXBjMlZ6SUhSdklHOWljMlZ5ZG1WY2JpQWdWWE5sWm5Wc0lHWnZjaUIwYjI5c2FXNW5MbHh1SUNCQWNtVjBkWEp1SUh0UWNtOXRhWE5sZlNCaElIQnliMjFwYzJVZ2QyaHBZMmdnYzJWMGRHeGxjeUJwYmlCMGFHVWdjMkZ0WlNCM1lYa2dZWE1nZEdobElHWnBjbk4wSUhCaGMzTmxaRnh1SUNCd2NtOXRhWE5sSUhSdklITmxkSFJzWlM1Y2Jpb3ZYRzVtZFc1amRHbHZiaUJ5WVdObEtHVnVkSEpwWlhNcElIdGNiaUFnTHlwcWMyaHBiblFnZG1Gc2FXUjBhR2x6T25SeWRXVWdLaTljYmlBZ2RtRnlJRU52Ym5OMGNuVmpkRzl5SUQwZ2RHaHBjenRjYmx4dUlDQnBaaUFvSVdselFYSnlZWGtvWlc1MGNtbGxjeWtwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdibVYzSUVOdmJuTjBjblZqZEc5eUtHWjFibU4wYVc5dUlDaGZMQ0J5WldwbFkzUXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnlaV3BsWTNRb2JtVjNJRlI1Y0dWRmNuSnZjaWduV1c5MUlHMTFjM1FnY0dGemN5QmhiaUJoY25KaGVTQjBieUJ5WVdObExpY3BLVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0J5WlhSMWNtNGdibVYzSUVOdmJuTjBjblZqZEc5eUtHWjFibU4wYVc5dUlDaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNiaUFnSUNBZ0lIWmhjaUJzWlc1bmRHZ2dQU0JsYm5SeWFXVnpMbXhsYm1kMGFEdGNiaUFnSUNBZ0lHWnZjaUFvZG1GeUlHa2dQU0F3T3lCcElEd2diR1Z1WjNSb095QnBLeXNwSUh0Y2JpQWdJQ0FnSUNBZ1EyOXVjM1J5ZFdOMGIzSXVjbVZ6YjJ4MlpTaGxiblJ5YVdWelcybGRLUzUwYUdWdUtISmxjMjlzZG1Vc0lISmxhbVZqZENrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlNrN1hHNGdJSDFjYm4xY2JseHVMeW9xWEc0Z0lHQlFjbTl0YVhObExuSmxhbVZqZEdBZ2NtVjBkWEp1Y3lCaElIQnliMjFwYzJVZ2NtVnFaV04wWldRZ2QybDBhQ0IwYUdVZ2NHRnpjMlZrSUdCeVpXRnpiMjVnTGx4dUlDQkpkQ0JwY3lCemFHOXlkR2hoYm1RZ1ptOXlJSFJvWlNCbWIyeHNiM2RwYm1jNlhHNWNiaUFnWUdCZ2FtRjJZWE5qY21sd2RGeHVJQ0JzWlhRZ2NISnZiV2x6WlNBOUlHNWxkeUJRY205dGFYTmxLR1oxYm1OMGFXOXVLSEpsYzI5c2RtVXNJSEpsYW1WamRDbDdYRzRnSUNBZ2NtVnFaV04wS0c1bGR5QkZjbkp2Y2lnblYwaFBUMUJUSnlrcE8xeHVJQ0I5S1R0Y2JseHVJQ0J3Y205dGFYTmxMblJvWlc0b1puVnVZM1JwYjI0b2RtRnNkV1VwZTF4dUlDQWdJQzh2SUVOdlpHVWdhR1Z5WlNCa2IyVnpiaWQwSUhKMWJpQmlaV05oZFhObElIUm9aU0J3Y205dGFYTmxJR2x6SUhKbGFtVmpkR1ZrSVZ4dUlDQjlMQ0JtZFc1amRHbHZiaWh5WldGemIyNHBlMXh1SUNBZ0lDOHZJSEpsWVhOdmJpNXRaWE56WVdkbElEMDlQU0FuVjBoUFQxQlRKMXh1SUNCOUtUdGNiaUFnWUdCZ1hHNWNiaUFnU1c1emRHVmhaQ0J2WmlCM2NtbDBhVzVuSUhSb1pTQmhZbTkyWlN3Z2VXOTFjaUJqYjJSbElHNXZkeUJ6YVcxd2JIa2dZbVZqYjIxbGN5QjBhR1VnWm05c2JHOTNhVzVuT2x4dVhHNGdJR0JnWUdwaGRtRnpZM0pwY0hSY2JpQWdiR1YwSUhCeWIyMXBjMlVnUFNCUWNtOXRhWE5sTG5KbGFtVmpkQ2h1WlhjZ1JYSnliM0lvSjFkSVQwOVFVeWNwS1R0Y2JseHVJQ0J3Y205dGFYTmxMblJvWlc0b1puVnVZM1JwYjI0b2RtRnNkV1VwZTF4dUlDQWdJQzh2SUVOdlpHVWdhR1Z5WlNCa2IyVnpiaWQwSUhKMWJpQmlaV05oZFhObElIUm9aU0J3Y205dGFYTmxJR2x6SUhKbGFtVmpkR1ZrSVZ4dUlDQjlMQ0JtZFc1amRHbHZiaWh5WldGemIyNHBlMXh1SUNBZ0lDOHZJSEpsWVhOdmJpNXRaWE56WVdkbElEMDlQU0FuVjBoUFQxQlRKMXh1SUNCOUtUdGNiaUFnWUdCZ1hHNWNiaUFnUUcxbGRHaHZaQ0J5WldwbFkzUmNiaUFnUUhOMFlYUnBZMXh1SUNCQWNHRnlZVzBnZTBGdWVYMGdjbVZoYzI5dUlIWmhiSFZsSUhSb1lYUWdkR2hsSUhKbGRIVnlibVZrSUhCeWIyMXBjMlVnZDJsc2JDQmlaU0J5WldwbFkzUmxaQ0IzYVhSb0xseHVJQ0JWYzJWbWRXd2dabTl5SUhSdmIyeHBibWN1WEc0Z0lFQnlaWFIxY200Z2UxQnliMjFwYzJWOUlHRWdjSEp2YldselpTQnlaV3BsWTNSbFpDQjNhWFJvSUhSb1pTQm5hWFpsYmlCZ2NtVmhjMjl1WUM1Y2Jpb3ZYRzVtZFc1amRHbHZiaUJ5WldwbFkzUW9jbVZoYzI5dUtTQjdYRzRnSUM4cWFuTm9hVzUwSUhaaGJHbGtkR2hwY3pwMGNuVmxJQ292WEc0Z0lIWmhjaUJEYjI1emRISjFZM1J2Y2lBOUlIUm9hWE03WEc0Z0lIWmhjaUJ3Y205dGFYTmxJRDBnYm1WM0lFTnZibk4wY25WamRHOXlLRzV2YjNBcE8xeHVJQ0JmY21WcVpXTjBLSEJ5YjIxcGMyVXNJSEpsWVhOdmJpazdYRzRnSUhKbGRIVnliaUJ3Y205dGFYTmxPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQnVaV1ZrYzFKbGMyOXNkbVZ5S0NrZ2UxeHVJQ0IwYUhKdmR5QnVaWGNnVkhsd1pVVnljbTl5S0NkWmIzVWdiWFZ6ZENCd1lYTnpJR0VnY21WemIyeDJaWElnWm5WdVkzUnBiMjRnWVhNZ2RHaGxJR1pwY25OMElHRnlaM1Z0Wlc1MElIUnZJSFJvWlNCd2NtOXRhWE5sSUdOdmJuTjBjblZqZEc5eUp5azdYRzU5WEc1Y2JtWjFibU4wYVc5dUlHNWxaV1J6VG1WM0tDa2dlMXh1SUNCMGFISnZkeUJ1WlhjZ1ZIbHdaVVZ5Y205eUtGd2lSbUZwYkdWa0lIUnZJR052Ym5OMGNuVmpkQ0FuVUhKdmJXbHpaU2M2SUZCc1pXRnpaU0IxYzJVZ2RHaGxJQ2R1WlhjbklHOXdaWEpoZEc5eUxDQjBhR2x6SUc5aWFtVmpkQ0JqYjI1emRISjFZM1J2Y2lCallXNXViM1FnWW1VZ1kyRnNiR1ZrSUdGeklHRWdablZ1WTNScGIyNHVYQ0lwTzF4dWZWeHVYRzR2S2lwY2JpQWdVSEp2YldselpTQnZZbXBsWTNSeklISmxjSEpsYzJWdWRDQjBhR1VnWlhabGJuUjFZV3dnY21WemRXeDBJRzltSUdGdUlHRnplVzVqYUhKdmJtOTFjeUJ2Y0dWeVlYUnBiMjR1SUZSb1pWeHVJQ0J3Y21sdFlYSjVJSGRoZVNCdlppQnBiblJsY21GamRHbHVaeUIzYVhSb0lHRWdjSEp2YldselpTQnBjeUIwYUhKdmRXZG9JR2wwY3lCZ2RHaGxibUFnYldWMGFHOWtMQ0IzYUdsamFGeHVJQ0J5WldkcGMzUmxjbk1nWTJGc2JHSmhZMnR6SUhSdklISmxZMlZwZG1VZ1pXbDBhR1Z5SUdFZ2NISnZiV2x6WlNkeklHVjJaVzUwZFdGc0lIWmhiSFZsSUc5eUlIUm9aU0J5WldGemIyNWNiaUFnZDJoNUlIUm9aU0J3Y205dGFYTmxJR05oYm01dmRDQmlaU0JtZFd4bWFXeHNaV1F1WEc1Y2JpQWdWR1Z5YldsdWIyeHZaM2xjYmlBZ0xTMHRMUzB0TFMwdExTMWNibHh1SUNBdElHQndjbTl0YVhObFlDQnBjeUJoYmlCdlltcGxZM1FnYjNJZ1puVnVZM1JwYjI0Z2QybDBhQ0JoSUdCMGFHVnVZQ0J0WlhSb2IyUWdkMmh2YzJVZ1ltVm9ZWFpwYjNJZ1kyOXVabTl5YlhNZ2RHOGdkR2hwY3lCemNHVmphV1pwWTJGMGFXOXVMbHh1SUNBdElHQjBhR1Z1WVdKc1pXQWdhWE1nWVc0Z2IySnFaV04wSUc5eUlHWjFibU4wYVc5dUlIUm9ZWFFnWkdWbWFXNWxjeUJoSUdCMGFHVnVZQ0J0WlhSb2IyUXVYRzRnSUMwZ1lIWmhiSFZsWUNCcGN5QmhibmtnYkdWbllXd2dTbUYyWVZOamNtbHdkQ0IyWVd4MVpTQW9hVzVqYkhWa2FXNW5JSFZ1WkdWbWFXNWxaQ3dnWVNCMGFHVnVZV0pzWlN3Z2IzSWdZU0J3Y205dGFYTmxLUzVjYmlBZ0xTQmdaWGhqWlhCMGFXOXVZQ0JwY3lCaElIWmhiSFZsSUhSb1lYUWdhWE1nZEdoeWIzZHVJSFZ6YVc1bklIUm9aU0IwYUhKdmR5QnpkR0YwWlcxbGJuUXVYRzRnSUMwZ1lISmxZWE52Ym1BZ2FYTWdZU0IyWVd4MVpTQjBhR0YwSUdsdVpHbGpZWFJsY3lCM2FIa2dZU0J3Y205dGFYTmxJSGRoY3lCeVpXcGxZM1JsWkM1Y2JpQWdMU0JnYzJWMGRHeGxaR0FnZEdobElHWnBibUZzSUhKbGMzUnBibWNnYzNSaGRHVWdiMllnWVNCd2NtOXRhWE5sTENCbWRXeG1hV3hzWldRZ2IzSWdjbVZxWldOMFpXUXVYRzVjYmlBZ1FTQndjbTl0YVhObElHTmhiaUJpWlNCcGJpQnZibVVnYjJZZ2RHaHlaV1VnYzNSaGRHVnpPaUJ3Wlc1a2FXNW5MQ0JtZFd4bWFXeHNaV1FzSUc5eUlISmxhbVZqZEdWa0xseHVYRzRnSUZCeWIyMXBjMlZ6SUhSb1lYUWdZWEpsSUdaMWJHWnBiR3hsWkNCb1lYWmxJR0VnWm5Wc1ptbHNiRzFsYm5RZ2RtRnNkV1VnWVc1a0lHRnlaU0JwYmlCMGFHVWdablZzWm1sc2JHVmtYRzRnSUhOMFlYUmxMaUFnVUhKdmJXbHpaWE1nZEdoaGRDQmhjbVVnY21WcVpXTjBaV1FnYUdGMlpTQmhJSEpsYW1WamRHbHZiaUJ5WldGemIyNGdZVzVrSUdGeVpTQnBiaUIwYUdWY2JpQWdjbVZxWldOMFpXUWdjM1JoZEdVdUlDQkJJR1oxYkdacGJHeHRaVzUwSUhaaGJIVmxJR2x6SUc1bGRtVnlJR0VnZEdobGJtRmliR1V1WEc1Y2JpQWdVSEp2YldselpYTWdZMkZ1SUdGc2MyOGdZbVVnYzJGcFpDQjBieUFxY21WemIyeDJaU29nWVNCMllXeDFaUzRnSUVsbUlIUm9hWE1nZG1Gc2RXVWdhWE1nWVd4emJ5QmhYRzRnSUhCeWIyMXBjMlVzSUhSb1pXNGdkR2hsSUc5eWFXZHBibUZzSUhCeWIyMXBjMlVuY3lCelpYUjBiR1ZrSUhOMFlYUmxJSGRwYkd3Z2JXRjBZMmdnZEdobElIWmhiSFZsSjNOY2JpQWdjMlYwZEd4bFpDQnpkR0YwWlM0Z0lGTnZJR0VnY0hKdmJXbHpaU0IwYUdGMElDcHlaWE52YkhabGN5b2dZU0J3Y205dGFYTmxJSFJvWVhRZ2NtVnFaV04wY3lCM2FXeHNYRzRnSUdsMGMyVnNaaUJ5WldwbFkzUXNJR0Z1WkNCaElIQnliMjFwYzJVZ2RHaGhkQ0FxY21WemIyeDJaWE1xSUdFZ2NISnZiV2x6WlNCMGFHRjBJR1oxYkdacGJHeHpJSGRwYkd4Y2JpQWdhWFJ6Wld4bUlHWjFiR1pwYkd3dVhHNWNibHh1SUNCQ1lYTnBZeUJWYzJGblpUcGNiaUFnTFMwdExTMHRMUzB0TFMwdFhHNWNiaUFnWUdCZ2FuTmNiaUFnYkdWMElIQnliMjFwYzJVZ1BTQnVaWGNnVUhKdmJXbHpaU2htZFc1amRHbHZiaWh5WlhOdmJIWmxMQ0J5WldwbFkzUXBJSHRjYmlBZ0lDQXZMeUJ2YmlCemRXTmpaWE56WEc0Z0lDQWdjbVZ6YjJ4MlpTaDJZV3gxWlNrN1hHNWNiaUFnSUNBdkx5QnZiaUJtWVdsc2RYSmxYRzRnSUNBZ2NtVnFaV04wS0hKbFlYTnZiaWs3WEc0Z0lIMHBPMXh1WEc0Z0lIQnliMjFwYzJVdWRHaGxiaWhtZFc1amRHbHZiaWgyWVd4MVpTa2dlMXh1SUNBZ0lDOHZJRzl1SUdaMWJHWnBiR3h0Wlc1MFhHNGdJSDBzSUdaMWJtTjBhVzl1S0hKbFlYTnZiaWtnZTF4dUlDQWdJQzh2SUc5dUlISmxhbVZqZEdsdmJseHVJQ0I5S1R0Y2JpQWdZR0JnWEc1Y2JpQWdRV1IyWVc1alpXUWdWWE5oWjJVNlhHNGdJQzB0TFMwdExTMHRMUzB0TFMwdExWeHVYRzRnSUZCeWIyMXBjMlZ6SUhOb2FXNWxJSGRvWlc0Z1lXSnpkSEpoWTNScGJtY2dZWGRoZVNCaGMzbHVZMmh5YjI1dmRYTWdhVzUwWlhKaFkzUnBiMjV6SUhOMVkyZ2dZWE5jYmlBZ1lGaE5URWgwZEhCU1pYRjFaWE4wWUhNdVhHNWNiaUFnWUdCZ2FuTmNiaUFnWm5WdVkzUnBiMjRnWjJWMFNsTlBUaWgxY213cElIdGNiaUFnSUNCeVpYUjFjbTRnYm1WM0lGQnliMjFwYzJVb1puVnVZM1JwYjI0b2NtVnpiMngyWlN3Z2NtVnFaV04wS1h0Y2JpQWdJQ0FnSUd4bGRDQjRhSElnUFNCdVpYY2dXRTFNU0hSMGNGSmxjWFZsYzNRb0tUdGNibHh1SUNBZ0lDQWdlR2h5TG05d1pXNG9KMGRGVkNjc0lIVnliQ2s3WEc0Z0lDQWdJQ0I0YUhJdWIyNXlaV0ZrZVhOMFlYUmxZMmhoYm1kbElEMGdhR0Z1Wkd4bGNqdGNiaUFnSUNBZ0lIaG9jaTV5WlhOd2IyNXpaVlI1Y0dVZ1BTQW5hbk52YmljN1hHNGdJQ0FnSUNCNGFISXVjMlYwVW1WeGRXVnpkRWhsWVdSbGNpZ25RV05qWlhCMEp5d2dKMkZ3Y0d4cFkyRjBhVzl1TDJwemIyNG5LVHRjYmlBZ0lDQWdJSGhvY2k1elpXNWtLQ2s3WEc1Y2JpQWdJQ0FnSUdaMWJtTjBhVzl1SUdoaGJtUnNaWElvS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxuSmxZV1I1VTNSaGRHVWdQVDA5SUhSb2FYTXVSRTlPUlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbk4wWVhSMWN5QTlQVDBnTWpBd0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYTnZiSFpsS0hSb2FYTXVjbVZ6Y0c5dWMyVXBPMXh1SUNBZ0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaV3BsWTNRb2JtVjNJRVZ5Y205eUtDZG5aWFJLVTA5T09pQmdKeUFySUhWeWJDQXJJQ2RnSUdaaGFXeGxaQ0IzYVhSb0lITjBZWFIxY3pvZ1d5Y2dLeUIwYUdsekxuTjBZWFIxY3lBcklDZGRKeWtwTzF4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVYRzRnSUdkbGRFcFRUMDRvSnk5d2IzTjBjeTVxYzI5dUp5a3VkR2hsYmlobWRXNWpkR2x2YmlocWMyOXVLU0I3WEc0Z0lDQWdMeThnYjI0Z1puVnNabWxzYkcxbGJuUmNiaUFnZlN3Z1puVnVZM1JwYjI0b2NtVmhjMjl1S1NCN1hHNGdJQ0FnTHk4Z2IyNGdjbVZxWldOMGFXOXVYRzRnSUgwcE8xeHVJQ0JnWUdCY2JseHVJQ0JWYm14cGEyVWdZMkZzYkdKaFkydHpMQ0J3Y205dGFYTmxjeUJoY21VZ1ozSmxZWFFnWTI5dGNHOXpZV0pzWlNCd2NtbHRhWFJwZG1WekxseHVYRzRnSUdCZ1lHcHpYRzRnSUZCeWIyMXBjMlV1WVd4c0tGdGNiaUFnSUNCblpYUktVMDlPS0NjdmNHOXpkSE1uS1N4Y2JpQWdJQ0JuWlhSS1UwOU9LQ2N2WTI5dGJXVnVkSE1uS1Z4dUlDQmRLUzUwYUdWdUtHWjFibU4wYVc5dUtIWmhiSFZsY3lsN1hHNGdJQ0FnZG1Gc2RXVnpXekJkSUM4dklEMCtJSEJ2YzNSelNsTlBUbHh1SUNBZ0lIWmhiSFZsYzFzeFhTQXZMeUE5UGlCamIyMXRaVzUwYzBwVFQwNWNibHh1SUNBZ0lISmxkSFZ5YmlCMllXeDFaWE03WEc0Z0lIMHBPMXh1SUNCZ1lHQmNibHh1SUNCQVkyeGhjM01nVUhKdmJXbHpaVnh1SUNCQWNHRnlZVzBnZTJaMWJtTjBhVzl1ZlNCeVpYTnZiSFpsY2x4dUlDQlZjMlZtZFd3Z1ptOXlJSFJ2YjJ4cGJtY3VYRzRnSUVCamIyNXpkSEoxWTNSdmNseHVLaTljYm1aMWJtTjBhVzl1SUZCeWIyMXBjMlVvY21WemIyeDJaWElwSUh0Y2JpQWdkR2hwYzF0UVVrOU5TVk5GWDBsRVhTQTlJRzVsZUhSSlpDZ3BPMXh1SUNCMGFHbHpMbDl5WlhOMWJIUWdQU0IwYUdsekxsOXpkR0YwWlNBOUlIVnVaR1ZtYVc1bFpEdGNiaUFnZEdocGN5NWZjM1ZpYzJOeWFXSmxjbk1nUFNCYlhUdGNibHh1SUNCcFppQW9ibTl2Y0NBaFBUMGdjbVZ6YjJ4MlpYSXBJSHRjYmlBZ0lDQjBlWEJsYjJZZ2NtVnpiMngyWlhJZ0lUMDlJQ2RtZFc1amRHbHZiaWNnSmlZZ2JtVmxaSE5TWlhOdmJIWmxjaWdwTzF4dUlDQWdJSFJvYVhNZ2FXNXpkR0Z1WTJWdlppQlFjbTl0YVhObElEOGdhVzVwZEdsaGJHbDZaVkJ5YjIxcGMyVW9kR2hwY3l3Z2NtVnpiMngyWlhJcElEb2dibVZsWkhOT1pYY29LVHRjYmlBZ2ZWeHVmVnh1WEc1UWNtOXRhWE5sTG1Gc2JDQTlJR0ZzYkR0Y2JsQnliMjFwYzJVdWNtRmpaU0E5SUhKaFkyVTdYRzVRY205dGFYTmxMbkpsYzI5c2RtVWdQU0J5WlhOdmJIWmxPMXh1VUhKdmJXbHpaUzV5WldwbFkzUWdQU0J5WldwbFkzUTdYRzVRY205dGFYTmxMbDl6WlhSVFkyaGxaSFZzWlhJZ1BTQnpaWFJUWTJobFpIVnNaWEk3WEc1UWNtOXRhWE5sTGw5elpYUkJjMkZ3SUQwZ2MyVjBRWE5oY0R0Y2JsQnliMjFwYzJVdVgyRnpZWEFnUFNCaGMyRndPMXh1WEc1UWNtOXRhWE5sTG5CeWIzUnZkSGx3WlNBOUlIdGNiaUFnWTI5dWMzUnlkV04wYjNJNklGQnliMjFwYzJVc1hHNWNiaUFnTHlvcVhHNGdJQ0FnVkdobElIQnlhVzFoY25rZ2QyRjVJRzltSUdsdWRHVnlZV04wYVc1bklIZHBkR2dnWVNCd2NtOXRhWE5sSUdseklIUm9jbTkxWjJnZ2FYUnpJR0IwYUdWdVlDQnRaWFJvYjJRc1hHNGdJQ0FnZDJocFkyZ2djbVZuYVhOMFpYSnpJR05oYkd4aVlXTnJjeUIwYnlCeVpXTmxhWFpsSUdWcGRHaGxjaUJoSUhCeWIyMXBjMlVuY3lCbGRtVnVkSFZoYkNCMllXeDFaU0J2Y2lCMGFHVmNiaUFnSUNCeVpXRnpiMjRnZDJoNUlIUm9aU0J3Y205dGFYTmxJR05oYm01dmRDQmlaU0JtZFd4bWFXeHNaV1F1WEc0Z0lGeHVJQ0FnSUdCZ1lHcHpYRzRnSUNBZ1ptbHVaRlZ6WlhJb0tTNTBhR1Z1S0daMWJtTjBhVzl1S0hWelpYSXBlMXh1SUNBZ0lDQWdMeThnZFhObGNpQnBjeUJoZG1GcGJHRmliR1ZjYmlBZ0lDQjlMQ0JtZFc1amRHbHZiaWh5WldGemIyNHBlMXh1SUNBZ0lDQWdMeThnZFhObGNpQnBjeUIxYm1GMllXbHNZV0pzWlN3Z1lXNWtJSGx2ZFNCaGNtVWdaMmwyWlc0Z2RHaGxJSEpsWVhOdmJpQjNhSGxjYmlBZ0lDQjlLVHRjYmlBZ0lDQmdZR0JjYmlBZ1hHNGdJQ0FnUTJoaGFXNXBibWRjYmlBZ0lDQXRMUzB0TFMwdExWeHVJQ0JjYmlBZ0lDQlVhR1VnY21WMGRYSnVJSFpoYkhWbElHOW1JR0IwYUdWdVlDQnBjeUJwZEhObGJHWWdZU0J3Y205dGFYTmxMaUFnVkdocGN5QnpaV052Ym1Rc0lDZGtiM2R1YzNSeVpXRnRKMXh1SUNBZ0lIQnliMjFwYzJVZ2FYTWdjbVZ6YjJ4MlpXUWdkMmwwYUNCMGFHVWdjbVYwZFhKdUlIWmhiSFZsSUc5bUlIUm9aU0JtYVhKemRDQndjbTl0YVhObEozTWdablZzWm1sc2JHMWxiblJjYmlBZ0lDQnZjaUJ5WldwbFkzUnBiMjRnYUdGdVpHeGxjaXdnYjNJZ2NtVnFaV04wWldRZ2FXWWdkR2hsSUdoaGJtUnNaWElnZEdoeWIzZHpJR0Z1SUdWNFkyVndkR2x2Ymk1Y2JpQWdYRzRnSUNBZ1lHQmdhbk5jYmlBZ0lDQm1hVzVrVlhObGNpZ3BMblJvWlc0b1puVnVZM1JwYjI0Z0tIVnpaWElwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIxYzJWeUxtNWhiV1U3WEc0Z0lDQWdmU3dnWm5WdVkzUnBiMjRnS0hKbFlYTnZiaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJQ2RrWldaaGRXeDBJRzVoYldVbk8xeHVJQ0FnSUgwcExuUm9aVzRvWm5WdVkzUnBiMjRnS0hWelpYSk9ZVzFsS1NCN1hHNGdJQ0FnSUNBdkx5QkpaaUJnWm1sdVpGVnpaWEpnSUdaMWJHWnBiR3hsWkN3Z1lIVnpaWEpPWVcxbFlDQjNhV3hzSUdKbElIUm9aU0IxYzJWeUozTWdibUZ0WlN3Z2IzUm9aWEozYVhObElHbDBYRzRnSUNBZ0lDQXZMeUIzYVd4c0lHSmxJR0FuWkdWbVlYVnNkQ0J1WVcxbEoyQmNiaUFnSUNCOUtUdGNiaUFnWEc0Z0lDQWdabWx1WkZWelpYSW9LUzUwYUdWdUtHWjFibU4wYVc5dUlDaDFjMlZ5S1NCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjBadmRXNWtJSFZ6WlhJc0lHSjFkQ0J6ZEdsc2JDQjFibWhoY0hCNUp5azdYRzRnSUNBZ2ZTd2dablZ1WTNScGIyNGdLSEpsWVhOdmJpa2dlMXh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZGdabWx1WkZWelpYSmdJSEpsYW1WamRHVmtJR0Z1WkNCM1pTZHlaU0IxYm1oaGNIQjVKeWs3WEc0Z0lDQWdmU2t1ZEdobGJpaG1kVzVqZEdsdmJpQW9kbUZzZFdVcElIdGNiaUFnSUNBZ0lDOHZJRzVsZG1WeUlISmxZV05vWldSY2JpQWdJQ0I5TENCbWRXNWpkR2x2YmlBb2NtVmhjMjl1S1NCN1hHNGdJQ0FnSUNBdkx5QnBaaUJnWm1sdVpGVnpaWEpnSUdaMWJHWnBiR3hsWkN3Z1lISmxZWE52Ym1BZ2QybHNiQ0JpWlNBblJtOTFibVFnZFhObGNpd2dZblYwSUhOMGFXeHNJSFZ1YUdGd2NIa25MbHh1SUNBZ0lDQWdMeThnU1dZZ1lHWnBibVJWYzJWeVlDQnlaV3BsWTNSbFpDd2dZSEpsWVhOdmJtQWdkMmxzYkNCaVpTQW5ZR1pwYm1SVmMyVnlZQ0J5WldwbFkzUmxaQ0JoYm1RZ2QyVW5jbVVnZFc1b1lYQndlU2N1WEc0Z0lDQWdmU2s3WEc0Z0lDQWdZR0JnWEc0Z0lDQWdTV1lnZEdobElHUnZkMjV6ZEhKbFlXMGdjSEp2YldselpTQmtiMlZ6SUc1dmRDQnpjR1ZqYVdaNUlHRWdjbVZxWldOMGFXOXVJR2hoYm1Sc1pYSXNJSEpsYW1WamRHbHZiaUJ5WldGemIyNXpJSGRwYkd3Z1ltVWdjSEp2Y0dGbllYUmxaQ0JtZFhKMGFHVnlJR1J2ZDI1emRISmxZVzB1WEc0Z0lGeHVJQ0FnSUdCZ1lHcHpYRzRnSUNBZ1ptbHVaRlZ6WlhJb0tTNTBhR1Z1S0daMWJtTjBhVzl1SUNoMWMyVnlLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnVUdWa1lXZHZaMmxqWVd4RmVHTmxjSFJwYjI0b0oxVndjM1J5WldGdElHVnljbTl5SnlrN1hHNGdJQ0FnZlNrdWRHaGxiaWhtZFc1amRHbHZiaUFvZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJQzh2SUc1bGRtVnlJSEpsWVdOb1pXUmNiaUFnSUNCOUtTNTBhR1Z1S0daMWJtTjBhVzl1SUNoMllXeDFaU2tnZTF4dUlDQWdJQ0FnTHk4Z2JtVjJaWElnY21WaFkyaGxaRnh1SUNBZ0lIMHNJR1oxYm1OMGFXOXVJQ2h5WldGemIyNHBJSHRjYmlBZ0lDQWdJQzh2SUZSb1pTQmdVR1ZrWjJGbmIyTnBZV3hGZUdObGNIUnBiMjVnSUdseklIQnliM0JoWjJGMFpXUWdZV3hzSUhSb1pTQjNZWGtnWkc5M2JpQjBieUJvWlhKbFhHNGdJQ0FnZlNrN1hHNGdJQ0FnWUdCZ1hHNGdJRnh1SUNBZ0lFRnpjMmx0YVd4aGRHbHZibHh1SUNBZ0lDMHRMUzB0TFMwdExTMHRMVnh1SUNCY2JpQWdJQ0JUYjIxbGRHbHRaWE1nZEdobElIWmhiSFZsSUhsdmRTQjNZVzUwSUhSdklIQnliM0JoWjJGMFpTQjBieUJoSUdSdmQyNXpkSEpsWVcwZ2NISnZiV2x6WlNCallXNGdiMjVzZVNCaVpWeHVJQ0FnSUhKbGRISnBaWFpsWkNCaGMzbHVZMmh5YjI1dmRYTnNlUzRnVkdocGN5QmpZVzRnWW1VZ1lXTm9hV1YyWldRZ1lua2djbVYwZFhKdWFXNW5JR0VnY0hKdmJXbHpaU0JwYmlCMGFHVmNiaUFnSUNCbWRXeG1hV3hzYldWdWRDQnZjaUJ5WldwbFkzUnBiMjRnYUdGdVpHeGxjaTRnVkdobElHUnZkMjV6ZEhKbFlXMGdjSEp2YldselpTQjNhV3hzSUhSb1pXNGdZbVVnY0dWdVpHbHVaMXh1SUNBZ0lIVnVkR2xzSUhSb1pTQnlaWFIxY201bFpDQndjbTl0YVhObElHbHpJSE5sZEhSc1pXUXVJRlJvYVhNZ2FYTWdZMkZzYkdWa0lDcGhjM05wYldsc1lYUnBiMjRxTGx4dUlDQmNiaUFnSUNCZ1lHQnFjMXh1SUNBZ0lHWnBibVJWYzJWeUtDa3VkR2hsYmlobWRXNWpkR2x2YmlBb2RYTmxjaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1pwYm1SRGIyMXRaVzUwYzBKNVFYVjBhRzl5S0hWelpYSXBPMXh1SUNBZ0lIMHBMblJvWlc0b1puVnVZM1JwYjI0Z0tHTnZiVzFsYm5SektTQjdYRzRnSUNBZ0lDQXZMeUJVYUdVZ2RYTmxjaWR6SUdOdmJXMWxiblJ6SUdGeVpTQnViM2NnWVhaaGFXeGhZbXhsWEc0Z0lDQWdmU2s3WEc0Z0lDQWdZR0JnWEc0Z0lGeHVJQ0FnSUVsbUlIUm9aU0JoYzNOcGJXeHBZWFJsWkNCd2NtOXRhWE5sSUhKbGFtVmpkSE1zSUhSb1pXNGdkR2hsSUdSdmQyNXpkSEpsWVcwZ2NISnZiV2x6WlNCM2FXeHNJR0ZzYzI4Z2NtVnFaV04wTGx4dUlDQmNiaUFnSUNCZ1lHQnFjMXh1SUNBZ0lHWnBibVJWYzJWeUtDa3VkR2hsYmlobWRXNWpkR2x2YmlBb2RYTmxjaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1pwYm1SRGIyMXRaVzUwYzBKNVFYVjBhRzl5S0hWelpYSXBPMXh1SUNBZ0lIMHBMblJvWlc0b1puVnVZM1JwYjI0Z0tHTnZiVzFsYm5SektTQjdYRzRnSUNBZ0lDQXZMeUJKWmlCZ1ptbHVaRU52YlcxbGJuUnpRbmxCZFhSb2IzSmdJR1oxYkdacGJHeHpMQ0IzWlNkc2JDQm9ZWFpsSUhSb1pTQjJZV3gxWlNCb1pYSmxYRzRnSUNBZ2ZTd2dablZ1WTNScGIyNGdLSEpsWVhOdmJpa2dlMXh1SUNBZ0lDQWdMeThnU1dZZ1lHWnBibVJEYjIxdFpXNTBjMEo1UVhWMGFHOXlZQ0J5WldwbFkzUnpMQ0IzWlNkc2JDQm9ZWFpsSUhSb1pTQnlaV0Z6YjI0Z2FHVnlaVnh1SUNBZ0lIMHBPMXh1SUNBZ0lHQmdZRnh1SUNCY2JpQWdJQ0JUYVcxd2JHVWdSWGhoYlhCc1pWeHVJQ0FnSUMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUZ4dUlDQWdJRk41Ym1Ob2NtOXViM1Z6SUVWNFlXMXdiR1ZjYmlBZ1hHNGdJQ0FnWUdCZ2FtRjJZWE5qY21sd2RGeHVJQ0FnSUd4bGRDQnlaWE4xYkhRN1hHNGdJRnh1SUNBZ0lIUnllU0I3WEc0Z0lDQWdJQ0J5WlhOMWJIUWdQU0JtYVc1a1VtVnpkV3gwS0NrN1hHNGdJQ0FnSUNBdkx5QnpkV05qWlhOelhHNGdJQ0FnZlNCallYUmphQ2h5WldGemIyNHBJSHRjYmlBZ0lDQWdJQzh2SUdaaGFXeDFjbVZjYmlBZ0lDQjlYRzRnSUNBZ1lHQmdYRzRnSUZ4dUlDQWdJRVZ5Y21KaFkyc2dSWGhoYlhCc1pWeHVJQ0JjYmlBZ0lDQmdZR0JxYzF4dUlDQWdJR1pwYm1SU1pYTjFiSFFvWm5WdVkzUnBiMjRvY21WemRXeDBMQ0JsY25JcGUxeHVJQ0FnSUNBZ2FXWWdLR1Z5Y2lrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJtWVdsc2RYSmxYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJ6ZFdOalpYTnpYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTazdYRzRnSUNBZ1lHQmdYRzRnSUZ4dUlDQWdJRkJ5YjIxcGMyVWdSWGhoYlhCc1pUdGNiaUFnWEc0Z0lDQWdZR0JnYW1GMllYTmpjbWx3ZEZ4dUlDQWdJR1pwYm1SU1pYTjFiSFFvS1M1MGFHVnVLR1oxYm1OMGFXOXVLSEpsYzNWc2RDbDdYRzRnSUNBZ0lDQXZMeUJ6ZFdOalpYTnpYRzRnSUNBZ2ZTd2dablZ1WTNScGIyNG9jbVZoYzI5dUtYdGNiaUFnSUNBZ0lDOHZJR1poYVd4MWNtVmNiaUFnSUNCOUtUdGNiaUFnSUNCZ1lHQmNiaUFnWEc0Z0lDQWdRV1IyWVc1alpXUWdSWGhoYlhCc1pWeHVJQ0FnSUMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUZ4dUlDQWdJRk41Ym1Ob2NtOXViM1Z6SUVWNFlXMXdiR1ZjYmlBZ1hHNGdJQ0FnWUdCZ2FtRjJZWE5qY21sd2RGeHVJQ0FnSUd4bGRDQmhkWFJvYjNJc0lHSnZiMnR6TzF4dUlDQmNiaUFnSUNCMGNua2dlMXh1SUNBZ0lDQWdZWFYwYUc5eUlEMGdabWx1WkVGMWRHaHZjaWdwTzF4dUlDQWdJQ0FnWW05dmEzTWdJRDBnWm1sdVpFSnZiMnR6UW5sQmRYUm9iM0lvWVhWMGFHOXlLVHRjYmlBZ0lDQWdJQzh2SUhOMVkyTmxjM05jYmlBZ0lDQjlJR05oZEdOb0tISmxZWE52YmlrZ2UxeHVJQ0FnSUNBZ0x5OGdabUZwYkhWeVpWeHVJQ0FnSUgxY2JpQWdJQ0JnWUdCY2JpQWdYRzRnSUNBZ1JYSnlZbUZqYXlCRmVHRnRjR3hsWEc0Z0lGeHVJQ0FnSUdCZ1lHcHpYRzRnSUZ4dUlDQWdJR1oxYm1OMGFXOXVJR1p2ZFc1a1FtOXZhM01vWW05dmEzTXBJSHRjYmlBZ1hHNGdJQ0FnZlZ4dUlDQmNiaUFnSUNCbWRXNWpkR2x2YmlCbVlXbHNkWEpsS0hKbFlYTnZiaWtnZTF4dUlDQmNiaUFnSUNCOVhHNGdJRnh1SUNBZ0lHWnBibVJCZFhSb2IzSW9ablZ1WTNScGIyNG9ZWFYwYUc5eUxDQmxjbklwZTF4dUlDQWdJQ0FnYVdZZ0tHVnljaWtnZTF4dUlDQWdJQ0FnSUNCbVlXbHNkWEpsS0dWeWNpazdYRzRnSUNBZ0lDQWdJQzh2SUdaaGFXeDFjbVZjYmlBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJSFJ5ZVNCN1hHNGdJQ0FnSUNBZ0lDQWdabWx1WkVKdmIyOXJjMEo1UVhWMGFHOXlLR0YxZEdodmNpd2dablZ1WTNScGIyNG9ZbTl2YTNNc0lHVnljaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dWeWNpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQm1ZV2xzZFhKbEtHVnljaWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGNua2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1p2ZFc1a1FtOXZhM01vWW05dmEzTXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjlJR05oZEdOb0tISmxZWE52YmlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHWmhhV3gxY21Vb2NtVmhjMjl1S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQjlJR05oZEdOb0tHVnljbTl5S1NCN1hHNGdJQ0FnSUNBZ0lDQWdabUZwYkhWeVpTaGxjbklwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDOHZJSE4xWTJObGMzTmNiaUFnSUNBZ0lIMWNiaUFnSUNCOUtUdGNiaUFnSUNCZ1lHQmNiaUFnWEc0Z0lDQWdVSEp2YldselpTQkZlR0Z0Y0d4bE8xeHVJQ0JjYmlBZ0lDQmdZR0JxWVhaaGMyTnlhWEIwWEc0Z0lDQWdabWx1WkVGMWRHaHZjaWdwTGx4dUlDQWdJQ0FnZEdobGJpaG1hVzVrUW05dmEzTkNlVUYxZEdodmNpa3VYRzRnSUNBZ0lDQjBhR1Z1S0daMWJtTjBhVzl1S0dKdmIydHpLWHRjYmlBZ0lDQWdJQ0FnTHk4Z1ptOTFibVFnWW05dmEzTmNiaUFnSUNCOUtTNWpZWFJqYUNobWRXNWpkR2x2YmloeVpXRnpiMjRwZTF4dUlDQWdJQ0FnTHk4Z2MyOXRaWFJvYVc1bklIZGxiblFnZDNKdmJtZGNiaUFnSUNCOUtUdGNiaUFnSUNCZ1lHQmNiaUFnWEc0Z0lDQWdRRzFsZEdodlpDQjBhR1Z1WEc0Z0lDQWdRSEJoY21GdElIdEdkVzVqZEdsdmJuMGdiMjVHZFd4bWFXeHNaV1JjYmlBZ0lDQkFjR0Z5WVcwZ2UwWjFibU4wYVc5dWZTQnZibEpsYW1WamRHVmtYRzRnSUNBZ1ZYTmxablZzSUdadmNpQjBiMjlzYVc1bkxseHVJQ0FnSUVCeVpYUjFjbTRnZTFCeWIyMXBjMlY5WEc0Z0lDb3ZYRzRnSUhSb1pXNDZJSFJvWlc0c1hHNWNiaUFnTHlvcVhHNGdJQ0FnWUdOaGRHTm9ZQ0JwY3lCemFXMXdiSGtnYzNWbllYSWdabTl5SUdCMGFHVnVLSFZ1WkdWbWFXNWxaQ3dnYjI1U1pXcGxZM1JwYjI0cFlDQjNhR2xqYUNCdFlXdGxjeUJwZENCMGFHVWdjMkZ0WlZ4dUlDQWdJR0Z6SUhSb1pTQmpZWFJqYUNCaWJHOWpheUJ2WmlCaElIUnllUzlqWVhSamFDQnpkR0YwWlcxbGJuUXVYRzRnSUZ4dUlDQWdJR0JnWUdwelhHNGdJQ0FnWm5WdVkzUnBiMjRnWm1sdVpFRjFkR2h2Y2lncGUxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkamIzVnNaRzRuZENCbWFXNWtJSFJvWVhRZ1lYVjBhRzl5SnlrN1hHNGdJQ0FnZlZ4dUlDQmNiaUFnSUNBdkx5QnplVzVqYUhKdmJtOTFjMXh1SUNBZ0lIUnllU0I3WEc0Z0lDQWdJQ0JtYVc1a1FYVjBhRzl5S0NrN1hHNGdJQ0FnZlNCallYUmphQ2h5WldGemIyNHBJSHRjYmlBZ0lDQWdJQzh2SUhOdmJXVjBhR2x1WnlCM1pXNTBJSGR5YjI1blhHNGdJQ0FnZlZ4dUlDQmNiaUFnSUNBdkx5QmhjM2x1WXlCM2FYUm9JSEJ5YjIxcGMyVnpYRzRnSUNBZ1ptbHVaRUYxZEdodmNpZ3BMbU5oZEdOb0tHWjFibU4wYVc5dUtISmxZWE52YmlsN1hHNGdJQ0FnSUNBdkx5QnpiMjFsZEdocGJtY2dkMlZ1ZENCM2NtOXVaMXh1SUNBZ0lIMHBPMXh1SUNBZ0lHQmdZRnh1SUNCY2JpQWdJQ0JBYldWMGFHOWtJR05oZEdOb1hHNGdJQ0FnUUhCaGNtRnRJSHRHZFc1amRHbHZibjBnYjI1U1pXcGxZM1JwYjI1Y2JpQWdJQ0JWYzJWbWRXd2dabTl5SUhSdmIyeHBibWN1WEc0Z0lDQWdRSEpsZEhWeWJpQjdVSEp2YldselpYMWNiaUFnS2k5Y2JpQWdKMk5oZEdOb0p6b2dablZ1WTNScGIyNGdYMk5oZEdOb0tHOXVVbVZxWldOMGFXOXVLU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11ZEdobGJpaHVkV3hzTENCdmJsSmxhbVZqZEdsdmJpazdYRzRnSUgxY2JuMDdYRzVjYm1aMWJtTjBhVzl1SUhCdmJIbG1hV3hzS0NrZ2UxeHVJQ0FnSUhaaGNpQnNiMk5oYkNBOUlIVnVaR1ZtYVc1bFpEdGNibHh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdaMnh2WW1Gc0lDRTlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUNBZ0lDQnNiMk5oYkNBOUlHZHNiMkpoYkR0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0hSNWNHVnZaaUJ6Wld4bUlDRTlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUNBZ0lDQnNiMk5oYkNBOUlITmxiR1k3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdkSEo1SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR3h2WTJGc0lEMGdSblZ1WTNScGIyNG9KM0psZEhWeWJpQjBhR2x6Snlrb0tUdGNiaUFnSUNBZ0lDQWdmU0JqWVhSamFDQW9aU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZHdiMng1Wm1sc2JDQm1ZV2xzWldRZ1ltVmpZWFZ6WlNCbmJHOWlZV3dnYjJKcVpXTjBJR2x6SUhWdVlYWmhhV3hoWW14bElHbHVJSFJvYVhNZ1pXNTJhWEp2Ym0xbGJuUW5LVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJSFpoY2lCUUlEMGdiRzlqWVd3dVVISnZiV2x6WlR0Y2JseHVJQ0FnSUdsbUlDaFFLU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQndjbTl0YVhObFZHOVRkSEpwYm1jZ1BTQnVkV3hzTzF4dUlDQWdJQ0FnSUNCMGNua2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NISnZiV2x6WlZSdlUzUnlhVzVuSUQwZ1QySnFaV04wTG5CeWIzUnZkSGx3WlM1MGIxTjBjbWx1Wnk1allXeHNLRkF1Y21WemIyeDJaU2dwS1R0Y2JpQWdJQ0FnSUNBZ2ZTQmpZWFJqYUNBb1pTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdjMmxzWlc1MGJIa2dhV2R1YjNKbFpGeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tIQnliMjFwYzJWVWIxTjBjbWx1WnlBOVBUMGdKMXR2WW1wbFkzUWdVSEp2YldselpWMG5JQ1ltSUNGUUxtTmhjM1FwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJqdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHeHZZMkZzTGxCeWIyMXBjMlVnUFNCUWNtOXRhWE5sTzF4dWZWeHVYRzR2THlCVGRISmhibWRsSUdOdmJYQmhkQzR1WEc1UWNtOXRhWE5sTG5CdmJIbG1hV3hzSUQwZ2NHOXNlV1pwYkd3N1hHNVFjbTl0YVhObExsQnliMjFwYzJVZ1BTQlFjbTl0YVhObE8xeHVYRzV5WlhSMWNtNGdVSEp2YldselpUdGNibHh1ZlNrcEtUdGNiaTh2SXlCemIzVnlZMlZOWVhCd2FXNW5WVkpNUFdWek5pMXdjbTl0YVhObExtMWhjQ0pkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlcGxhY2UgPSBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2U7XG52YXIgcGVyY2VudFR3ZW50aWVzID0gLyUyMC9nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAnZGVmYXVsdCc6ICdSRkMzOTg2JyxcbiAgICBmb3JtYXR0ZXJzOiB7XG4gICAgICAgIFJGQzE3Mzg6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2UuY2FsbCh2YWx1ZSwgcGVyY2VudFR3ZW50aWVzLCAnKycpO1xuICAgICAgICB9LFxuICAgICAgICBSRkMzOTg2OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgUkZDMTczODogJ1JGQzE3MzgnLFxuICAgIFJGQzM5ODY6ICdSRkMzOTg2J1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vc3RyaW5naWZ5Jyk7XG52YXIgcGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlJyk7XG52YXIgZm9ybWF0cyA9IHJlcXVpcmUoJy4vZm9ybWF0cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBmb3JtYXRzOiBmb3JtYXRzLFxuICAgIHBhcnNlOiBwYXJzZSxcbiAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxudmFyIGRlZmF1bHRzID0ge1xuICAgIGFsbG93RG90czogZmFsc2UsXG4gICAgYWxsb3dQcm90b3R5cGVzOiBmYWxzZSxcbiAgICBhcnJheUxpbWl0OiAyMCxcbiAgICBkZWNvZGVyOiB1dGlscy5kZWNvZGUsXG4gICAgZGVsaW1pdGVyOiAnJicsXG4gICAgZGVwdGg6IDUsXG4gICAgcGFyYW1ldGVyTGltaXQ6IDEwMDAsXG4gICAgcGxhaW5PYmplY3RzOiBmYWxzZSxcbiAgICBzdHJpY3ROdWxsSGFuZGxpbmc6IGZhbHNlXG59O1xuXG52YXIgcGFyc2VWYWx1ZXMgPSBmdW5jdGlvbiBwYXJzZVZhbHVlcyhzdHIsIG9wdGlvbnMpIHtcbiAgICB2YXIgb2JqID0ge307XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KG9wdGlvbnMuZGVsaW1pdGVyLCBvcHRpb25zLnBhcmFtZXRlckxpbWl0ID09PSBJbmZpbml0eSA/IHVuZGVmaW5lZCA6IG9wdGlvbnMucGFyYW1ldGVyTGltaXQpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgcGFydCA9IHBhcnRzW2ldO1xuICAgICAgICB2YXIgcG9zID0gcGFydC5pbmRleE9mKCddPScpID09PSAtMSA/IHBhcnQuaW5kZXhPZignPScpIDogcGFydC5pbmRleE9mKCddPScpICsgMTtcblxuICAgICAgICB2YXIga2V5LCB2YWw7XG4gICAgICAgIGlmIChwb3MgPT09IC0xKSB7XG4gICAgICAgICAgICBrZXkgPSBvcHRpb25zLmRlY29kZXIocGFydCk7XG4gICAgICAgICAgICB2YWwgPSBvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyA/IG51bGwgOiAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleSA9IG9wdGlvbnMuZGVjb2RlcihwYXJ0LnNsaWNlKDAsIHBvcykpO1xuICAgICAgICAgICAgdmFsID0gb3B0aW9ucy5kZWNvZGVyKHBhcnQuc2xpY2UocG9zICsgMSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXMuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgICAgIG9ialtrZXldID0gW10uY29uY2F0KG9ialtrZXldKS5jb25jYXQodmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9ialtrZXldID0gdmFsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBwYXJzZU9iamVjdCA9IGZ1bmN0aW9uIHBhcnNlT2JqZWN0KGNoYWluLCB2YWwsIG9wdGlvbnMpIHtcbiAgICBpZiAoIWNoYWluLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cblxuICAgIHZhciByb290ID0gY2hhaW4uc2hpZnQoKTtcblxuICAgIHZhciBvYmo7XG4gICAgaWYgKHJvb3QgPT09ICdbXScpIHtcbiAgICAgICAgb2JqID0gW107XG4gICAgICAgIG9iaiA9IG9iai5jb25jYXQocGFyc2VPYmplY3QoY2hhaW4sIHZhbCwgb3B0aW9ucykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9iaiA9IG9wdGlvbnMucGxhaW5PYmplY3RzID8gT2JqZWN0LmNyZWF0ZShudWxsKSA6IHt9O1xuICAgICAgICB2YXIgY2xlYW5Sb290ID0gcm9vdFswXSA9PT0gJ1snICYmIHJvb3Rbcm9vdC5sZW5ndGggLSAxXSA9PT0gJ10nID8gcm9vdC5zbGljZSgxLCByb290Lmxlbmd0aCAtIDEpIDogcm9vdDtcbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoY2xlYW5Sb290LCAxMCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICFpc05hTihpbmRleCkgJiZcbiAgICAgICAgICAgIHJvb3QgIT09IGNsZWFuUm9vdCAmJlxuICAgICAgICAgICAgU3RyaW5nKGluZGV4KSA9PT0gY2xlYW5Sb290ICYmXG4gICAgICAgICAgICBpbmRleCA+PSAwICYmXG4gICAgICAgICAgICAob3B0aW9ucy5wYXJzZUFycmF5cyAmJiBpbmRleCA8PSBvcHRpb25zLmFycmF5TGltaXQpXG4gICAgICAgICkge1xuICAgICAgICAgICAgb2JqID0gW107XG4gICAgICAgICAgICBvYmpbaW5kZXhdID0gcGFyc2VPYmplY3QoY2hhaW4sIHZhbCwgb3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmpbY2xlYW5Sb290XSA9IHBhcnNlT2JqZWN0KGNoYWluLCB2YWwsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBwYXJzZUtleXMgPSBmdW5jdGlvbiBwYXJzZUtleXMoZ2l2ZW5LZXksIHZhbCwgb3B0aW9ucykge1xuICAgIGlmICghZ2l2ZW5LZXkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRyYW5zZm9ybSBkb3Qgbm90YXRpb24gdG8gYnJhY2tldCBub3RhdGlvblxuICAgIHZhciBrZXkgPSBvcHRpb25zLmFsbG93RG90cyA/IGdpdmVuS2V5LnJlcGxhY2UoL1xcLihbXlxcLlxcW10rKS9nLCAnWyQxXScpIDogZ2l2ZW5LZXk7XG5cbiAgICAvLyBUaGUgcmVnZXggY2h1bmtzXG5cbiAgICB2YXIgcGFyZW50ID0gL14oW15cXFtcXF1dKikvO1xuICAgIHZhciBjaGlsZCA9IC8oXFxbW15cXFtcXF1dKlxcXSkvZztcblxuICAgIC8vIEdldCB0aGUgcGFyZW50XG5cbiAgICB2YXIgc2VnbWVudCA9IHBhcmVudC5leGVjKGtleSk7XG5cbiAgICAvLyBTdGFzaCB0aGUgcGFyZW50IGlmIGl0IGV4aXN0c1xuXG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBpZiAoc2VnbWVudFsxXSkge1xuICAgICAgICAvLyBJZiB3ZSBhcmVuJ3QgdXNpbmcgcGxhaW4gb2JqZWN0cywgb3B0aW9uYWxseSBwcmVmaXgga2V5c1xuICAgICAgICAvLyB0aGF0IHdvdWxkIG92ZXJ3cml0ZSBvYmplY3QgcHJvdG90eXBlIHByb3BlcnRpZXNcbiAgICAgICAgaWYgKCFvcHRpb25zLnBsYWluT2JqZWN0cyAmJiBoYXMuY2FsbChPYmplY3QucHJvdG90eXBlLCBzZWdtZW50WzFdKSkge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93UHJvdG90eXBlcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGtleXMucHVzaChzZWdtZW50WzFdKTtcbiAgICB9XG5cbiAgICAvLyBMb29wIHRocm91Z2ggY2hpbGRyZW4gYXBwZW5kaW5nIHRvIHRoZSBhcnJheSB1bnRpbCB3ZSBoaXQgZGVwdGhcblxuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoKHNlZ21lbnQgPSBjaGlsZC5leGVjKGtleSkpICE9PSBudWxsICYmIGkgPCBvcHRpb25zLmRlcHRoKSB7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgICAgaWYgKCFvcHRpb25zLnBsYWluT2JqZWN0cyAmJiBoYXMuY2FsbChPYmplY3QucHJvdG90eXBlLCBzZWdtZW50WzFdLnJlcGxhY2UoL1xcW3xcXF0vZywgJycpKSkge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93UHJvdG90eXBlcykge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGtleXMucHVzaChzZWdtZW50WzFdKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSdzIGEgcmVtYWluZGVyLCBqdXN0IGFkZCB3aGF0ZXZlciBpcyBsZWZ0XG5cbiAgICBpZiAoc2VnbWVudCkge1xuICAgICAgICBrZXlzLnB1c2goJ1snICsga2V5LnNsaWNlKHNlZ21lbnQuaW5kZXgpICsgJ10nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VPYmplY3Qoa2V5cywgdmFsLCBvcHRpb25zKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0ciwgb3B0cykge1xuICAgIHZhciBvcHRpb25zID0gb3B0cyB8fCB7fTtcblxuICAgIGlmIChvcHRpb25zLmRlY29kZXIgIT09IG51bGwgJiYgb3B0aW9ucy5kZWNvZGVyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMuZGVjb2RlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdEZWNvZGVyIGhhcyB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIG9wdGlvbnMuZGVsaW1pdGVyID0gdHlwZW9mIG9wdGlvbnMuZGVsaW1pdGVyID09PSAnc3RyaW5nJyB8fCB1dGlscy5pc1JlZ0V4cChvcHRpb25zLmRlbGltaXRlcikgPyBvcHRpb25zLmRlbGltaXRlciA6IGRlZmF1bHRzLmRlbGltaXRlcjtcbiAgICBvcHRpb25zLmRlcHRoID0gdHlwZW9mIG9wdGlvbnMuZGVwdGggPT09ICdudW1iZXInID8gb3B0aW9ucy5kZXB0aCA6IGRlZmF1bHRzLmRlcHRoO1xuICAgIG9wdGlvbnMuYXJyYXlMaW1pdCA9IHR5cGVvZiBvcHRpb25zLmFycmF5TGltaXQgPT09ICdudW1iZXInID8gb3B0aW9ucy5hcnJheUxpbWl0IDogZGVmYXVsdHMuYXJyYXlMaW1pdDtcbiAgICBvcHRpb25zLnBhcnNlQXJyYXlzID0gb3B0aW9ucy5wYXJzZUFycmF5cyAhPT0gZmFsc2U7XG4gICAgb3B0aW9ucy5kZWNvZGVyID0gdHlwZW9mIG9wdGlvbnMuZGVjb2RlciA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuZGVjb2RlciA6IGRlZmF1bHRzLmRlY29kZXI7XG4gICAgb3B0aW9ucy5hbGxvd0RvdHMgPSB0eXBlb2Ygb3B0aW9ucy5hbGxvd0RvdHMgPT09ICdib29sZWFuJyA/IG9wdGlvbnMuYWxsb3dEb3RzIDogZGVmYXVsdHMuYWxsb3dEb3RzO1xuICAgIG9wdGlvbnMucGxhaW5PYmplY3RzID0gdHlwZW9mIG9wdGlvbnMucGxhaW5PYmplY3RzID09PSAnYm9vbGVhbicgPyBvcHRpb25zLnBsYWluT2JqZWN0cyA6IGRlZmF1bHRzLnBsYWluT2JqZWN0cztcbiAgICBvcHRpb25zLmFsbG93UHJvdG90eXBlcyA9IHR5cGVvZiBvcHRpb25zLmFsbG93UHJvdG90eXBlcyA9PT0gJ2Jvb2xlYW4nID8gb3B0aW9ucy5hbGxvd1Byb3RvdHlwZXMgOiBkZWZhdWx0cy5hbGxvd1Byb3RvdHlwZXM7XG4gICAgb3B0aW9ucy5wYXJhbWV0ZXJMaW1pdCA9IHR5cGVvZiBvcHRpb25zLnBhcmFtZXRlckxpbWl0ID09PSAnbnVtYmVyJyA/IG9wdGlvbnMucGFyYW1ldGVyTGltaXQgOiBkZWZhdWx0cy5wYXJhbWV0ZXJMaW1pdDtcbiAgICBvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyA9IHR5cGVvZiBvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyA9PT0gJ2Jvb2xlYW4nID8gb3B0aW9ucy5zdHJpY3ROdWxsSGFuZGxpbmcgOiBkZWZhdWx0cy5zdHJpY3ROdWxsSGFuZGxpbmc7XG5cbiAgICBpZiAoc3RyID09PSAnJyB8fCBzdHIgPT09IG51bGwgfHwgdHlwZW9mIHN0ciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMucGxhaW5PYmplY3RzID8gT2JqZWN0LmNyZWF0ZShudWxsKSA6IHt9O1xuICAgIH1cblxuICAgIHZhciB0ZW1wT2JqID0gdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgPyBwYXJzZVZhbHVlcyhzdHIsIG9wdGlvbnMpIDogc3RyO1xuICAgIHZhciBvYmogPSBvcHRpb25zLnBsYWluT2JqZWN0cyA/IE9iamVjdC5jcmVhdGUobnVsbCkgOiB7fTtcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUga2V5cyBhbmQgc2V0dXAgdGhlIG5ldyBvYmplY3RcblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGVtcE9iaik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICB2YXIgbmV3T2JqID0gcGFyc2VLZXlzKGtleSwgdGVtcE9ialtrZXldLCBvcHRpb25zKTtcbiAgICAgICAgb2JqID0gdXRpbHMubWVyZ2Uob2JqLCBuZXdPYmosIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB1dGlscy5jb21wYWN0KG9iaik7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgZm9ybWF0cyA9IHJlcXVpcmUoJy4vZm9ybWF0cycpO1xuXG52YXIgYXJyYXlQcmVmaXhHZW5lcmF0b3JzID0ge1xuICAgIGJyYWNrZXRzOiBmdW5jdGlvbiBicmFja2V0cyhwcmVmaXgpIHtcbiAgICAgICAgcmV0dXJuIHByZWZpeCArICdbXSc7XG4gICAgfSxcbiAgICBpbmRpY2VzOiBmdW5jdGlvbiBpbmRpY2VzKHByZWZpeCwga2V5KSB7XG4gICAgICAgIHJldHVybiBwcmVmaXggKyAnWycgKyBrZXkgKyAnXSc7XG4gICAgfSxcbiAgICByZXBlYXQ6IGZ1bmN0aW9uIHJlcGVhdChwcmVmaXgpIHtcbiAgICAgICAgcmV0dXJuIHByZWZpeDtcbiAgICB9XG59O1xuXG52YXIgdG9JU08gPSBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZztcblxudmFyIGRlZmF1bHRzID0ge1xuICAgIGRlbGltaXRlcjogJyYnLFxuICAgIGVuY29kZTogdHJ1ZSxcbiAgICBlbmNvZGVyOiB1dGlscy5lbmNvZGUsXG4gICAgc2VyaWFsaXplRGF0ZTogZnVuY3Rpb24gc2VyaWFsaXplRGF0ZShkYXRlKSB7XG4gICAgICAgIHJldHVybiB0b0lTTy5jYWxsKGRhdGUpO1xuICAgIH0sXG4gICAgc2tpcE51bGxzOiBmYWxzZSxcbiAgICBzdHJpY3ROdWxsSGFuZGxpbmc6IGZhbHNlXG59O1xuXG52YXIgc3RyaW5naWZ5ID0gZnVuY3Rpb24gc3RyaW5naWZ5KG9iamVjdCwgcHJlZml4LCBnZW5lcmF0ZUFycmF5UHJlZml4LCBzdHJpY3ROdWxsSGFuZGxpbmcsIHNraXBOdWxscywgZW5jb2RlciwgZmlsdGVyLCBzb3J0LCBhbGxvd0RvdHMsIHNlcmlhbGl6ZURhdGUsIGZvcm1hdHRlcikge1xuICAgIHZhciBvYmogPSBvYmplY3Q7XG4gICAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb2JqID0gZmlsdGVyKHByZWZpeCwgb2JqKTtcbiAgICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgb2JqID0gc2VyaWFsaXplRGF0ZShvYmopO1xuICAgIH0gZWxzZSBpZiAob2JqID09PSBudWxsKSB7XG4gICAgICAgIGlmIChzdHJpY3ROdWxsSGFuZGxpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBlbmNvZGVyID8gZW5jb2RlcihwcmVmaXgpIDogcHJlZml4O1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqID0gJyc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBvYmogPT09ICdudW1iZXInIHx8IHR5cGVvZiBvYmogPT09ICdib29sZWFuJyB8fCB1dGlscy5pc0J1ZmZlcihvYmopKSB7XG4gICAgICAgIGlmIChlbmNvZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gW2Zvcm1hdHRlcihlbmNvZGVyKHByZWZpeCkpICsgJz0nICsgZm9ybWF0dGVyKGVuY29kZXIob2JqKSldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbZm9ybWF0dGVyKHByZWZpeCkgKyAnPScgKyBmb3JtYXR0ZXIoU3RyaW5nKG9iaikpXTtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG5cbiAgICB2YXIgb2JqS2V5cztcbiAgICBpZiAoQXJyYXkuaXNBcnJheShmaWx0ZXIpKSB7XG4gICAgICAgIG9iaktleXMgPSBmaWx0ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgICBvYmpLZXlzID0gc29ydCA/IGtleXMuc29ydChzb3J0KSA6IGtleXM7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpLZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBvYmpLZXlzW2ldO1xuXG4gICAgICAgIGlmIChza2lwTnVsbHMgJiYgb2JqW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzLmNvbmNhdChzdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgb2JqW2tleV0sXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeChwcmVmaXgsIGtleSksXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeCxcbiAgICAgICAgICAgICAgICBzdHJpY3ROdWxsSGFuZGxpbmcsXG4gICAgICAgICAgICAgICAgc2tpcE51bGxzLFxuICAgICAgICAgICAgICAgIGVuY29kZXIsXG4gICAgICAgICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgICAgICAgIHNvcnQsXG4gICAgICAgICAgICAgICAgYWxsb3dEb3RzLFxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZURhdGUsXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlcyA9IHZhbHVlcy5jb25jYXQoc3RyaW5naWZ5KFxuICAgICAgICAgICAgICAgIG9ialtrZXldLFxuICAgICAgICAgICAgICAgIHByZWZpeCArIChhbGxvd0RvdHMgPyAnLicgKyBrZXkgOiAnWycgKyBrZXkgKyAnXScpLFxuICAgICAgICAgICAgICAgIGdlbmVyYXRlQXJyYXlQcmVmaXgsXG4gICAgICAgICAgICAgICAgc3RyaWN0TnVsbEhhbmRsaW5nLFxuICAgICAgICAgICAgICAgIHNraXBOdWxscyxcbiAgICAgICAgICAgICAgICBlbmNvZGVyLFxuICAgICAgICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICAgICAgICBzb3J0LFxuICAgICAgICAgICAgICAgIGFsbG93RG90cyxcbiAgICAgICAgICAgICAgICBzZXJpYWxpemVEYXRlLFxuICAgICAgICAgICAgICAgIGZvcm1hdHRlclxuICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBvcHRzKSB7XG4gICAgdmFyIG9iaiA9IG9iamVjdDtcbiAgICB2YXIgb3B0aW9ucyA9IG9wdHMgfHwge307XG4gICAgdmFyIGRlbGltaXRlciA9IHR5cGVvZiBvcHRpb25zLmRlbGltaXRlciA9PT0gJ3VuZGVmaW5lZCcgPyBkZWZhdWx0cy5kZWxpbWl0ZXIgOiBvcHRpb25zLmRlbGltaXRlcjtcbiAgICB2YXIgc3RyaWN0TnVsbEhhbmRsaW5nID0gdHlwZW9mIG9wdGlvbnMuc3RyaWN0TnVsbEhhbmRsaW5nID09PSAnYm9vbGVhbicgPyBvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyA6IGRlZmF1bHRzLnN0cmljdE51bGxIYW5kbGluZztcbiAgICB2YXIgc2tpcE51bGxzID0gdHlwZW9mIG9wdGlvbnMuc2tpcE51bGxzID09PSAnYm9vbGVhbicgPyBvcHRpb25zLnNraXBOdWxscyA6IGRlZmF1bHRzLnNraXBOdWxscztcbiAgICB2YXIgZW5jb2RlID0gdHlwZW9mIG9wdGlvbnMuZW5jb2RlID09PSAnYm9vbGVhbicgPyBvcHRpb25zLmVuY29kZSA6IGRlZmF1bHRzLmVuY29kZTtcbiAgICB2YXIgZW5jb2RlciA9IGVuY29kZSA/ICh0eXBlb2Ygb3B0aW9ucy5lbmNvZGVyID09PSAnZnVuY3Rpb24nID8gb3B0aW9ucy5lbmNvZGVyIDogZGVmYXVsdHMuZW5jb2RlcikgOiBudWxsO1xuICAgIHZhciBzb3J0ID0gdHlwZW9mIG9wdGlvbnMuc29ydCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuc29ydCA6IG51bGw7XG4gICAgdmFyIGFsbG93RG90cyA9IHR5cGVvZiBvcHRpb25zLmFsbG93RG90cyA9PT0gJ3VuZGVmaW5lZCcgPyBmYWxzZSA6IG9wdGlvbnMuYWxsb3dEb3RzO1xuICAgIHZhciBzZXJpYWxpemVEYXRlID0gdHlwZW9mIG9wdGlvbnMuc2VyaWFsaXplRGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuc2VyaWFsaXplRGF0ZSA6IGRlZmF1bHRzLnNlcmlhbGl6ZURhdGU7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmZvcm1hdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgb3B0aW9ucy5mb3JtYXQgPSBmb3JtYXRzLmRlZmF1bHQ7XG4gICAgfSBlbHNlIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGZvcm1hdHMuZm9ybWF0dGVycywgb3B0aW9ucy5mb3JtYXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZm9ybWF0IG9wdGlvbiBwcm92aWRlZC4nKTtcbiAgICB9XG4gICAgdmFyIGZvcm1hdHRlciA9IGZvcm1hdHMuZm9ybWF0dGVyc1tvcHRpb25zLmZvcm1hdF07XG4gICAgdmFyIG9iaktleXM7XG4gICAgdmFyIGZpbHRlcjtcblxuICAgIGlmIChvcHRpb25zLmVuY29kZXIgIT09IG51bGwgJiYgb3B0aW9ucy5lbmNvZGVyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMuZW5jb2RlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFbmNvZGVyIGhhcyB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5maWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZmlsdGVyID0gb3B0aW9ucy5maWx0ZXI7XG4gICAgICAgIG9iaiA9IGZpbHRlcignJywgb2JqKTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5maWx0ZXIpKSB7XG4gICAgICAgIGZpbHRlciA9IG9wdGlvbnMuZmlsdGVyO1xuICAgICAgICBvYmpLZXlzID0gZmlsdGVyO1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gW107XG5cbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICB2YXIgYXJyYXlGb3JtYXQ7XG4gICAgaWYgKG9wdGlvbnMuYXJyYXlGb3JtYXQgaW4gYXJyYXlQcmVmaXhHZW5lcmF0b3JzKSB7XG4gICAgICAgIGFycmF5Rm9ybWF0ID0gb3B0aW9ucy5hcnJheUZvcm1hdDtcbiAgICB9IGVsc2UgaWYgKCdpbmRpY2VzJyBpbiBvcHRpb25zKSB7XG4gICAgICAgIGFycmF5Rm9ybWF0ID0gb3B0aW9ucy5pbmRpY2VzID8gJ2luZGljZXMnIDogJ3JlcGVhdCc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXlGb3JtYXQgPSAnaW5kaWNlcyc7XG4gICAgfVxuXG4gICAgdmFyIGdlbmVyYXRlQXJyYXlQcmVmaXggPSBhcnJheVByZWZpeEdlbmVyYXRvcnNbYXJyYXlGb3JtYXRdO1xuXG4gICAgaWYgKCFvYmpLZXlzKSB7XG4gICAgICAgIG9iaktleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIH1cblxuICAgIGlmIChzb3J0KSB7XG4gICAgICAgIG9iaktleXMuc29ydChzb3J0KTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iaktleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IG9iaktleXNbaV07XG5cbiAgICAgICAgaWYgKHNraXBOdWxscyAmJiBvYmpba2V5XSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBrZXlzID0ga2V5cy5jb25jYXQoc3RyaW5naWZ5KFxuICAgICAgICAgICAgb2JqW2tleV0sXG4gICAgICAgICAgICBrZXksXG4gICAgICAgICAgICBnZW5lcmF0ZUFycmF5UHJlZml4LFxuICAgICAgICAgICAgc3RyaWN0TnVsbEhhbmRsaW5nLFxuICAgICAgICAgICAgc2tpcE51bGxzLFxuICAgICAgICAgICAgZW5jb2RlcixcbiAgICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICAgIHNvcnQsXG4gICAgICAgICAgICBhbGxvd0RvdHMsXG4gICAgICAgICAgICBzZXJpYWxpemVEYXRlLFxuICAgICAgICAgICAgZm9ybWF0dGVyXG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIHJldHVybiBrZXlzLmpvaW4oZGVsaW1pdGVyKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgaGV4VGFibGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcnJheSA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgICAgICAgYXJyYXkucHVzaCgnJScgKyAoKGkgPCAxNiA/ICcwJyA6ICcnKSArIGkudG9TdHJpbmcoMTYpKS50b1VwcGVyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG59KCkpO1xuXG5leHBvcnRzLmFycmF5VG9PYmplY3QgPSBmdW5jdGlvbiAoc291cmNlLCBvcHRpb25zKSB7XG4gICAgdmFyIG9iaiA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wbGFpbk9iamVjdHMgPyBPYmplY3QuY3JlYXRlKG51bGwpIDoge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2VbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvYmpbaV0gPSBzb3VyY2VbaV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuICAgIGlmICghc291cmNlKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzb3VyY2UgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgICAgIHRhcmdldC5wdXNoKHNvdXJjZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRhcmdldFtzb3VyY2VdID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbdGFyZ2V0LCBzb3VyY2VdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIFt0YXJnZXRdLmNvbmNhdChzb3VyY2UpO1xuICAgIH1cblxuICAgIHZhciBtZXJnZVRhcmdldCA9IHRhcmdldDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpICYmICFBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgICAgbWVyZ2VUYXJnZXQgPSBleHBvcnRzLmFycmF5VG9PYmplY3QodGFyZ2V0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpICYmIEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICBzb3VyY2UuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgaWYgKGhhcy5jYWxsKHRhcmdldCwgaSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0W2ldICYmIHR5cGVvZiB0YXJnZXRbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFtpXSA9IGV4cG9ydHMubWVyZ2UodGFyZ2V0W2ldLCBpdGVtLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFtpXSA9IGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3Qua2V5cyhzb3VyY2UpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gc291cmNlW2tleV07XG5cbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhY2MsIGtleSkpIHtcbiAgICAgICAgICAgIGFjY1trZXldID0gZXhwb3J0cy5tZXJnZShhY2Nba2V5XSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWNjW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIG1lcmdlVGFyZ2V0KTtcbn07XG5cbmV4cG9ydHMuZGVjb2RlID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxufTtcblxuZXhwb3J0cy5lbmNvZGUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgLy8gVGhpcyBjb2RlIHdhcyBvcmlnaW5hbGx5IHdyaXR0ZW4gYnkgQnJpYW4gV2hpdGUgKG1zY2RleCkgZm9yIHRoZSBpby5qcyBjb3JlIHF1ZXJ5c3RyaW5nIGxpYnJhcnkuXG4gICAgLy8gSXQgaGFzIGJlZW4gYWRhcHRlZCBoZXJlIGZvciBzdHJpY3RlciBhZGhlcmVuY2UgdG8gUkZDIDM5ODZcbiAgICBpZiAoc3RyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIHZhciBzdHJpbmcgPSB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyA/IHN0ciA6IFN0cmluZyhzdHIpO1xuXG4gICAgdmFyIG91dCA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBjID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgYyA9PT0gMHgyRCB8fCAvLyAtXG4gICAgICAgICAgICBjID09PSAweDJFIHx8IC8vIC5cbiAgICAgICAgICAgIGMgPT09IDB4NUYgfHwgLy8gX1xuICAgICAgICAgICAgYyA9PT0gMHg3RSB8fCAvLyB+XG4gICAgICAgICAgICAoYyA+PSAweDMwICYmIGMgPD0gMHgzOSkgfHwgLy8gMC05XG4gICAgICAgICAgICAoYyA+PSAweDQxICYmIGMgPD0gMHg1QSkgfHwgLy8gYS16XG4gICAgICAgICAgICAoYyA+PSAweDYxICYmIGMgPD0gMHg3QSkgLy8gQS1aXG4gICAgICAgICkge1xuICAgICAgICAgICAgb3V0ICs9IHN0cmluZy5jaGFyQXQoaSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjIDwgMHg4MCkge1xuICAgICAgICAgICAgb3V0ID0gb3V0ICsgaGV4VGFibGVbY107XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjIDwgMHg4MDApIHtcbiAgICAgICAgICAgIG91dCA9IG91dCArIChoZXhUYWJsZVsweEMwIHwgKGMgPj4gNildICsgaGV4VGFibGVbMHg4MCB8IChjICYgMHgzRildKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGMgPCAweEQ4MDAgfHwgYyA+PSAweEUwMDApIHtcbiAgICAgICAgICAgIG91dCA9IG91dCArIChoZXhUYWJsZVsweEUwIHwgKGMgPj4gMTIpXSArIGhleFRhYmxlWzB4ODAgfCAoKGMgPj4gNikgJiAweDNGKV0gKyBoZXhUYWJsZVsweDgwIHwgKGMgJiAweDNGKV0pO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpICs9IDE7XG4gICAgICAgIGMgPSAweDEwMDAwICsgKCgoYyAmIDB4M0ZGKSA8PCAxMCkgfCAoc3RyaW5nLmNoYXJDb2RlQXQoaSkgJiAweDNGRikpO1xuICAgICAgICBvdXQgKz0gaGV4VGFibGVbMHhGMCB8IChjID4+IDE4KV0gKyBoZXhUYWJsZVsweDgwIHwgKChjID4+IDEyKSAmIDB4M0YpXSArIGhleFRhYmxlWzB4ODAgfCAoKGMgPj4gNikgJiAweDNGKV0gKyBoZXhUYWJsZVsweDgwIHwgKGMgJiAweDNGKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbmV4cG9ydHMuY29tcGFjdCA9IGZ1bmN0aW9uIChvYmosIHJlZmVyZW5jZXMpIHtcbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgdmFyIHJlZnMgPSByZWZlcmVuY2VzIHx8IFtdO1xuICAgIHZhciBsb29rdXAgPSByZWZzLmluZGV4T2Yob2JqKTtcbiAgICBpZiAobG9va3VwICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gcmVmc1tsb29rdXBdO1xuICAgIH1cblxuICAgIHJlZnMucHVzaChvYmopO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICB2YXIgY29tcGFjdGVkID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChvYmpbaV0gJiYgdHlwZW9mIG9ialtpXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBjb21wYWN0ZWQucHVzaChleHBvcnRzLmNvbXBhY3Qob2JqW2ldLCByZWZzKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgY29tcGFjdGVkLnB1c2gob2JqW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb21wYWN0ZWQ7XG4gICAgfVxuXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIG9ialtrZXldID0gZXhwb3J0cy5jb21wYWN0KG9ialtrZXldLCByZWZzKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnRzLmlzUmVnRXhwID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59O1xuXG5leHBvcnRzLmlzQnVmZmVyID0gZnVuY3Rpb24gKG9iaikge1xuICAgIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAhIShvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopKTtcbn07XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsKXtcbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJyksdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTkxZEdsc0wzVjBhV3d1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWp0QlFVRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFaUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaTh2SUVOdmNIbHlhV2RvZENCS2IzbGxiblFzSUVsdVl5NGdZVzVrSUc5MGFHVnlJRTV2WkdVZ1kyOXVkSEpwWW5WMGIzSnpMbHh1THk5Y2JpOHZJRkJsY20xcGMzTnBiMjRnYVhNZ2FHVnlaV0o1SUdkeVlXNTBaV1FzSUdaeVpXVWdiMllnWTJoaGNtZGxMQ0IwYnlCaGJua2djR1Z5YzI5dUlHOWlkR0ZwYm1sdVp5QmhYRzR2THlCamIzQjVJRzltSUhSb2FYTWdjMjltZEhkaGNtVWdZVzVrSUdGemMyOWphV0YwWldRZ1pHOWpkVzFsYm5SaGRHbHZiaUJtYVd4bGN5QW9kR2hsWEc0dkx5QmNJbE52Wm5SM1lYSmxYQ0lwTENCMGJ5QmtaV0ZzSUdsdUlIUm9aU0JUYjJaMGQyRnlaU0IzYVhSb2IzVjBJSEpsYzNSeWFXTjBhVzl1TENCcGJtTnNkV1JwYm1kY2JpOHZJSGRwZEdodmRYUWdiR2x0YVhSaGRHbHZiaUIwYUdVZ2NtbG5hSFJ6SUhSdklIVnpaU3dnWTI5d2VTd2diVzlrYVdaNUxDQnRaWEpuWlN3Z2NIVmliR2x6YUN4Y2JpOHZJR1JwYzNSeWFXSjFkR1VzSUhOMVlteHBZMlZ1YzJVc0lHRnVaQzl2Y2lCelpXeHNJR052Y0dsbGN5QnZaaUIwYUdVZ1UyOW1kSGRoY21Vc0lHRnVaQ0IwYnlCd1pYSnRhWFJjYmk4dklIQmxjbk52Ym5NZ2RHOGdkMmh2YlNCMGFHVWdVMjltZEhkaGNtVWdhWE1nWm5WeWJtbHphR1ZrSUhSdklHUnZJSE52TENCemRXSnFaV04wSUhSdklIUm9aVnh1THk4Z1ptOXNiRzkzYVc1bklHTnZibVJwZEdsdmJuTTZYRzR2TDF4dUx5OGdWR2hsSUdGaWIzWmxJR052Y0hseWFXZG9kQ0J1YjNScFkyVWdZVzVrSUhSb2FYTWdjR1Z5YldsemMybHZiaUJ1YjNScFkyVWdjMmhoYkd3Z1ltVWdhVzVqYkhWa1pXUmNiaTh2SUdsdUlHRnNiQ0JqYjNCcFpYTWdiM0lnYzNWaWMzUmhiblJwWVd3Z2NHOXlkR2x2Ym5NZ2IyWWdkR2hsSUZOdlpuUjNZWEpsTGx4dUx5OWNiaTh2SUZSSVJTQlRUMFpVVjBGU1JTQkpVeUJRVWs5V1NVUkZSQ0JjSWtGVElFbFRYQ0lzSUZkSlZFaFBWVlFnVjBGU1VrRk9WRmtnVDBZZ1FVNVpJRXRKVGtRc0lFVllVRkpGVTFOY2JpOHZJRTlTSUVsTlVFeEpSVVFzSUVsT1EweFZSRWxPUnlCQ1ZWUWdUazlVSUV4SlRVbFVSVVFnVkU4Z1ZFaEZJRmRCVWxKQlRsUkpSVk1nVDBaY2JpOHZJRTFGVWtOSVFVNVVRVUpKVEVsVVdTd2dSa2xVVGtWVFV5QkdUMUlnUVNCUVFWSlVTVU5WVEVGU0lGQlZVbEJQVTBVZ1FVNUVJRTVQVGtsT1JsSkpUa2RGVFVWT1ZDNGdTVTVjYmk4dklFNVBJRVZXUlU1VUlGTklRVXhNSUZSSVJTQkJWVlJJVDFKVElFOVNJRU5QVUZsU1NVZElWQ0JJVDB4RVJWSlRJRUpGSUV4SlFVSk1SU0JHVDFJZ1FVNVpJRU5NUVVsTkxGeHVMeThnUkVGTlFVZEZVeUJQVWlCUFZFaEZVaUJNU1VGQ1NVeEpWRmtzSUZkSVJWUklSVklnU1U0Z1FVNGdRVU5VU1U5T0lFOUdJRU5QVGxSU1FVTlVMQ0JVVDFKVUlFOVNYRzR2THlCUFZFaEZVbGRKVTBVc0lFRlNTVk5KVGtjZ1JsSlBUU3dnVDFWVUlFOUdJRTlTSUVsT0lFTlBUazVGUTFSSlQwNGdWMGxVU0NCVVNFVWdVMDlHVkZkQlVrVWdUMUlnVkVoRlhHNHZMeUJWVTBVZ1QxSWdUMVJJUlZJZ1JFVkJURWxPUjFNZ1NVNGdWRWhGSUZOUFJsUlhRVkpGTGx4dVhHNTJZWElnWm05eWJXRjBVbVZuUlhod0lEMGdMeVZiYzJScUpWMHZaenRjYm1WNGNHOXlkSE11Wm05eWJXRjBJRDBnWm5WdVkzUnBiMjRvWmlrZ2UxeHVJQ0JwWmlBb0lXbHpVM1J5YVc1bktHWXBLU0I3WEc0Z0lDQWdkbUZ5SUc5aWFtVmpkSE1nUFNCYlhUdGNiaUFnSUNCbWIzSWdLSFpoY2lCcElEMGdNRHNnYVNBOElHRnlaM1Z0Wlc1MGN5NXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJQ0FnYjJKcVpXTjBjeTV3ZFhOb0tHbHVjM0JsWTNRb1lYSm5kVzFsYm5SelcybGRLU2s3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCdlltcGxZM1J6TG1wdmFXNG9KeUFuS1R0Y2JpQWdmVnh1WEc0Z0lIWmhjaUJwSUQwZ01UdGNiaUFnZG1GeUlHRnlaM01nUFNCaGNtZDFiV1Z1ZEhNN1hHNGdJSFpoY2lCc1pXNGdQU0JoY21kekxteGxibWQwYUR0Y2JpQWdkbUZ5SUhOMGNpQTlJRk4wY21sdVp5aG1LUzV5WlhCc1lXTmxLR1p2Y20xaGRGSmxaMFY0Y0N3Z1puVnVZM1JwYjI0b2VDa2dlMXh1SUNBZ0lHbG1JQ2g0SUQwOVBTQW5KU1VuS1NCeVpYUjFjbTRnSnlVbk8xeHVJQ0FnSUdsbUlDaHBJRDQ5SUd4bGJpa2djbVYwZFhKdUlIZzdYRzRnSUNBZ2MzZHBkR05vSUNoNEtTQjdYRzRnSUNBZ0lDQmpZWE5sSUNjbGN5YzZJSEpsZEhWeWJpQlRkSEpwYm1jb1lYSm5jMXRwS3l0ZEtUdGNiaUFnSUNBZ0lHTmhjMlVnSnlWa0p6b2djbVYwZFhKdUlFNTFiV0psY2loaGNtZHpXMmtySzEwcE8xeHVJQ0FnSUNBZ1kyRnpaU0FuSldvbk9seHVJQ0FnSUNBZ0lDQjBjbmtnZTF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCS1UwOU9Mbk4wY21sdVoybG1lU2hoY21kelcya3JLMTBwTzF4dUlDQWdJQ0FnSUNCOUlHTmhkR05vSUNoZktTQjdYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQ2RiUTJseVkzVnNZWEpkSnp0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ1pHVm1ZWFZzZERwY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhnN1hHNGdJQ0FnZlZ4dUlDQjlLVHRjYmlBZ1ptOXlJQ2gyWVhJZ2VDQTlJR0Z5WjNOYmFWMDdJR2tnUENCc1pXNDdJSGdnUFNCaGNtZHpXeXNyYVYwcElIdGNiaUFnSUNCcFppQW9hWE5PZFd4c0tIZ3BJSHg4SUNGcGMwOWlhbVZqZENoNEtTa2dlMXh1SUNBZ0lDQWdjM1J5SUNzOUlDY2dKeUFySUhnN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSE4wY2lBclBTQW5JQ2NnS3lCcGJuTndaV04wS0hncE8xeHVJQ0FnSUgxY2JpQWdmVnh1SUNCeVpYUjFjbTRnYzNSeU8xeHVmVHRjYmx4dVhHNHZMeUJOWVhKcklIUm9ZWFFnWVNCdFpYUm9iMlFnYzJodmRXeGtJRzV2ZENCaVpTQjFjMlZrTGx4dUx5OGdVbVYwZFhKdWN5QmhJRzF2WkdsbWFXVmtJR1oxYm1OMGFXOXVJSGRvYVdOb0lIZGhjbTV6SUc5dVkyVWdZbmtnWkdWbVlYVnNkQzVjYmk4dklFbG1JQzB0Ym04dFpHVndjbVZqWVhScGIyNGdhWE1nYzJWMExDQjBhR1Z1SUdsMElHbHpJR0VnYm04dGIzQXVYRzVsZUhCdmNuUnpMbVJsY0hKbFkyRjBaU0E5SUdaMWJtTjBhVzl1S0dadUxDQnRjMmNwSUh0Y2JpQWdMeThnUVd4c2IzY2dabTl5SUdSbGNISmxZMkYwYVc1bklIUm9hVzVuY3lCcGJpQjBhR1VnY0hKdlkyVnpjeUJ2WmlCemRHRnlkR2x1WnlCMWNDNWNiaUFnYVdZZ0tHbHpWVzVrWldacGJtVmtLR2RzYjJKaGJDNXdjbTlqWlhOektTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCbGVIQnZjblJ6TG1SbGNISmxZMkYwWlNobWJpd2diWE5uS1M1aGNIQnNlU2gwYUdsekxDQmhjbWQxYldWdWRITXBPMXh1SUNBZ0lIMDdYRzRnSUgxY2JseHVJQ0JwWmlBb2NISnZZMlZ6Y3k1dWIwUmxjSEpsWTJGMGFXOXVJRDA5UFNCMGNuVmxLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHWnVPMXh1SUNCOVhHNWNiaUFnZG1GeUlIZGhjbTVsWkNBOUlHWmhiSE5sTzF4dUlDQm1kVzVqZEdsdmJpQmtaWEJ5WldOaGRHVmtLQ2tnZTF4dUlDQWdJR2xtSUNnaGQyRnlibVZrS1NCN1hHNGdJQ0FnSUNCcFppQW9jSEp2WTJWemN5NTBhSEp2ZDBSbGNISmxZMkYwYVc5dUtTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaHRjMmNwTzF4dUlDQWdJQ0FnZlNCbGJITmxJR2xtSUNod2NtOWpaWE56TG5SeVlXTmxSR1Z3Y21WallYUnBiMjRwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1MGNtRmpaU2h0YzJjcE8xeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1bGNuSnZjaWh0YzJjcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2QyRnlibVZrSUQwZ2RISjFaVHRjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUdadUxtRndjR3g1S0hSb2FYTXNJR0Z5WjNWdFpXNTBjeWs3WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnWkdWd2NtVmpZWFJsWkR0Y2JuMDdYRzVjYmx4dWRtRnlJR1JsWW5WbmN5QTlJSHQ5TzF4dWRtRnlJR1JsWW5WblJXNTJhWEp2Ymp0Y2JtVjRjRzl5ZEhNdVpHVmlkV2RzYjJjZ1BTQm1kVzVqZEdsdmJpaHpaWFFwSUh0Y2JpQWdhV1lnS0dselZXNWtaV1pwYm1Wa0tHUmxZblZuUlc1MmFYSnZiaWtwWEc0Z0lDQWdaR1ZpZFdkRmJuWnBjbTl1SUQwZ2NISnZZMlZ6Y3k1bGJuWXVUazlFUlY5RVJVSlZSeUI4ZkNBbkp6dGNiaUFnYzJWMElEMGdjMlYwTG5SdlZYQndaWEpEWVhObEtDazdYRzRnSUdsbUlDZ2haR1ZpZFdkelczTmxkRjBwSUh0Y2JpQWdJQ0JwWmlBb2JtVjNJRkpsWjBWNGNDZ25YRnhjWEdJbklDc2djMlYwSUNzZ0oxeGNYRnhpSnl3Z0oya25LUzUwWlhOMEtHUmxZblZuUlc1MmFYSnZiaWtwSUh0Y2JpQWdJQ0FnSUhaaGNpQndhV1FnUFNCd2NtOWpaWE56TG5CcFpEdGNiaUFnSUNBZ0lHUmxZblZuYzF0elpYUmRJRDBnWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnSUNBZ0lIWmhjaUJ0YzJjZ1BTQmxlSEJ2Y25SekxtWnZjbTFoZEM1aGNIQnNlU2hsZUhCdmNuUnpMQ0JoY21kMWJXVnVkSE1wTzF4dUlDQWdJQ0FnSUNCamIyNXpiMnhsTG1WeWNtOXlLQ2NsY3lBbFpEb2dKWE1uTENCelpYUXNJSEJwWkN3Z2JYTm5LVHRjYmlBZ0lDQWdJSDA3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lHUmxZblZuYzF0elpYUmRJRDBnWm5WdVkzUnBiMjRvS1NCN2ZUdGNiaUFnSUNCOVhHNGdJSDFjYmlBZ2NtVjBkWEp1SUdSbFluVm5jMXR6WlhSZE8xeHVmVHRjYmx4dVhHNHZLaXBjYmlBcUlFVmphRzl6SUhSb1pTQjJZV3gxWlNCdlppQmhJSFpoYkhWbExpQlVjbmx6SUhSdklIQnlhVzUwSUhSb1pTQjJZV3gxWlNCdmRYUmNiaUFxSUdsdUlIUm9aU0JpWlhOMElIZGhlU0J3YjNOemFXSnNaU0JuYVhabGJpQjBhR1VnWkdsbVptVnlaVzUwSUhSNWNHVnpMbHh1SUNwY2JpQXFJRUJ3WVhKaGJTQjdUMkpxWldOMGZTQnZZbW9nVkdobElHOWlhbVZqZENCMGJ5QndjbWx1ZENCdmRYUXVYRzRnS2lCQWNHRnlZVzBnZTA5aWFtVmpkSDBnYjNCMGN5QlBjSFJwYjI1aGJDQnZjSFJwYjI1eklHOWlhbVZqZENCMGFHRjBJR0ZzZEdWeWN5QjBhR1VnYjNWMGNIVjBMbHh1SUNvdlhHNHZLaUJzWldkaFkzazZJRzlpYWl3Z2MyaHZkMGhwWkdSbGJpd2daR1Z3ZEdnc0lHTnZiRzl5Y3lvdlhHNW1kVzVqZEdsdmJpQnBibk53WldOMEtHOWlhaXdnYjNCMGN5a2dlMXh1SUNBdkx5QmtaV1poZFd4MElHOXdkR2x2Ym5OY2JpQWdkbUZ5SUdOMGVDQTlJSHRjYmlBZ0lDQnpaV1Z1T2lCYlhTeGNiaUFnSUNCemRIbHNhWHBsT2lCemRIbHNhWHBsVG05RGIyeHZjbHh1SUNCOU8xeHVJQ0F2THlCc1pXZGhZM2t1TGk1Y2JpQWdhV1lnS0dGeVozVnRaVzUwY3k1c1pXNW5kR2dnUGowZ015a2dZM1I0TG1SbGNIUm9JRDBnWVhKbmRXMWxiblJ6V3pKZE8xeHVJQ0JwWmlBb1lYSm5kVzFsYm5SekxteGxibWQwYUNBK1BTQTBLU0JqZEhndVkyOXNiM0p6SUQwZ1lYSm5kVzFsYm5Seld6TmRPMXh1SUNCcFppQW9hWE5DYjI5c1pXRnVLRzl3ZEhNcEtTQjdYRzRnSUNBZ0x5OGdiR1ZuWVdONUxpNHVYRzRnSUNBZ1kzUjRMbk5vYjNkSWFXUmtaVzRnUFNCdmNIUnpPMXh1SUNCOUlHVnNjMlVnYVdZZ0tHOXdkSE1wSUh0Y2JpQWdJQ0F2THlCbmIzUWdZVzRnWENKdmNIUnBiMjV6WENJZ2IySnFaV04wWEc0Z0lDQWdaWGh3YjNKMGN5NWZaWGgwWlc1a0tHTjBlQ3dnYjNCMGN5azdYRzRnSUgxY2JpQWdMeThnYzJWMElHUmxabUYxYkhRZ2IzQjBhVzl1YzF4dUlDQnBaaUFvYVhOVmJtUmxabWx1WldRb1kzUjRMbk5vYjNkSWFXUmtaVzRwS1NCamRIZ3VjMmh2ZDBocFpHUmxiaUE5SUdaaGJITmxPMXh1SUNCcFppQW9hWE5WYm1SbFptbHVaV1FvWTNSNExtUmxjSFJvS1NrZ1kzUjRMbVJsY0hSb0lEMGdNanRjYmlBZ2FXWWdLR2x6Vlc1a1pXWnBibVZrS0dOMGVDNWpiMnh2Y25NcEtTQmpkSGd1WTI5c2IzSnpJRDBnWm1Gc2MyVTdYRzRnSUdsbUlDaHBjMVZ1WkdWbWFXNWxaQ2hqZEhndVkzVnpkRzl0U1c1emNHVmpkQ2twSUdOMGVDNWpkWE4wYjIxSmJuTndaV04wSUQwZ2RISjFaVHRjYmlBZ2FXWWdLR04wZUM1amIyeHZjbk1wSUdOMGVDNXpkSGxzYVhwbElEMGdjM1I1YkdsNlpWZHBkR2hEYjJ4dmNqdGNiaUFnY21WMGRYSnVJR1p2Y20xaGRGWmhiSFZsS0dOMGVDd2diMkpxTENCamRIZ3VaR1Z3ZEdncE8xeHVmVnh1Wlhod2IzSjBjeTVwYm5Od1pXTjBJRDBnYVc1emNHVmpkRHRjYmx4dVhHNHZMeUJvZEhSd09pOHZaVzR1ZDJscmFYQmxaR2xoTG05eVp5OTNhV3RwTDBGT1UwbGZaWE5qWVhCbFgyTnZaR1VqWjNKaGNHaHBZM05jYm1sdWMzQmxZM1F1WTI5c2IzSnpJRDBnZTF4dUlDQW5ZbTlzWkNjZ09pQmJNU3dnTWpKZExGeHVJQ0FuYVhSaGJHbGpKeUE2SUZzekxDQXlNMTBzWEc0Z0lDZDFibVJsY214cGJtVW5JRG9nV3pRc0lESTBYU3hjYmlBZ0oybHVkbVZ5YzJVbklEb2dXemNzSURJM1hTeGNiaUFnSjNkb2FYUmxKeUE2SUZzek55d2dNemxkTEZ4dUlDQW5aM0psZVNjZ09pQmJPVEFzSURNNVhTeGNiaUFnSjJKc1lXTnJKeUE2SUZzek1Dd2dNemxkTEZ4dUlDQW5ZbXgxWlNjZ09pQmJNelFzSURNNVhTeGNiaUFnSjJONVlXNG5JRG9nV3pNMkxDQXpPVjBzWEc0Z0lDZG5jbVZsYmljZ09pQmJNeklzSURNNVhTeGNiaUFnSjIxaFoyVnVkR0VuSURvZ1d6TTFMQ0F6T1Ywc1hHNGdJQ2R5WldRbklEb2dXek14TENBek9WMHNYRzRnSUNkNVpXeHNiM2NuSURvZ1d6TXpMQ0F6T1YxY2JuMDdYRzVjYmk4dklFUnZiaWQwSUhWelpTQW5ZbXgxWlNjZ2JtOTBJSFpwYzJsaWJHVWdiMjRnWTIxa0xtVjRaVnh1YVc1emNHVmpkQzV6ZEhsc1pYTWdQU0I3WEc0Z0lDZHpjR1ZqYVdGc0p6b2dKMk41WVc0bkxGeHVJQ0FuYm5WdFltVnlKem9nSjNsbGJHeHZkeWNzWEc0Z0lDZGliMjlzWldGdUp6b2dKM2xsYkd4dmR5Y3NYRzRnSUNkMWJtUmxabWx1WldRbk9pQW5aM0psZVNjc1hHNGdJQ2R1ZFd4c0p6b2dKMkp2YkdRbkxGeHVJQ0FuYzNSeWFXNW5Kem9nSjJkeVpXVnVKeXhjYmlBZ0oyUmhkR1VuT2lBbmJXRm5aVzUwWVNjc1hHNGdJQzh2SUZ3aWJtRnRaVndpT2lCcGJuUmxiblJwYjI1aGJHeDVJRzV2ZENCemRIbHNhVzVuWEc0Z0lDZHlaV2RsZUhBbk9pQW5jbVZrSjF4dWZUdGNibHh1WEc1bWRXNWpkR2x2YmlCemRIbHNhWHBsVjJsMGFFTnZiRzl5S0hOMGNpd2djM1I1YkdWVWVYQmxLU0I3WEc0Z0lIWmhjaUJ6ZEhsc1pTQTlJR2x1YzNCbFkzUXVjM1I1YkdWelczTjBlV3hsVkhsd1pWMDdYRzVjYmlBZ2FXWWdLSE4wZVd4bEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUNkY1hIVXdNREZpV3ljZ0t5QnBibk53WldOMExtTnZiRzl5YzF0emRIbHNaVjFiTUYwZ0t5QW5iU2NnS3lCemRISWdLMXh1SUNBZ0lDQWdJQ0FnSUNBblhGeDFNREF4WWxzbklDc2dhVzV6Y0dWamRDNWpiMnh2Y25OYmMzUjViR1ZkV3pGZElDc2dKMjBuTzF4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUhKbGRIVnliaUJ6ZEhJN1hHNGdJSDFjYm4xY2JseHVYRzVtZFc1amRHbHZiaUJ6ZEhsc2FYcGxUbTlEYjJ4dmNpaHpkSElzSUhOMGVXeGxWSGx3WlNrZ2UxeHVJQ0J5WlhSMWNtNGdjM1J5TzF4dWZWeHVYRzVjYm1aMWJtTjBhVzl1SUdGeWNtRjVWRzlJWVhOb0tHRnljbUY1S1NCN1hHNGdJSFpoY2lCb1lYTm9JRDBnZTMwN1hHNWNiaUFnWVhKeVlYa3VabTl5UldGamFDaG1kVzVqZEdsdmJpaDJZV3dzSUdsa2VDa2dlMXh1SUNBZ0lHaGhjMmhiZG1Gc1hTQTlJSFJ5ZFdVN1hHNGdJSDBwTzF4dVhHNGdJSEpsZEhWeWJpQm9ZWE5vTzF4dWZWeHVYRzVjYm1aMWJtTjBhVzl1SUdadmNtMWhkRlpoYkhWbEtHTjBlQ3dnZG1Gc2RXVXNJSEpsWTNWeWMyVlVhVzFsY3lrZ2UxeHVJQ0F2THlCUWNtOTJhV1JsSUdFZ2FHOXZheUJtYjNJZ2RYTmxjaTF6Y0dWamFXWnBaV1FnYVc1emNHVmpkQ0JtZFc1amRHbHZibk11WEc0Z0lDOHZJRU5vWldOcklIUm9ZWFFnZG1Gc2RXVWdhWE1nWVc0Z2IySnFaV04wSUhkcGRHZ2dZVzRnYVc1emNHVmpkQ0JtZFc1amRHbHZiaUJ2YmlCcGRGeHVJQ0JwWmlBb1kzUjRMbU4xYzNSdmJVbHVjM0JsWTNRZ0ppWmNiaUFnSUNBZ0lIWmhiSFZsSUNZbVhHNGdJQ0FnSUNCcGMwWjFibU4wYVc5dUtIWmhiSFZsTG1sdWMzQmxZM1FwSUNZbVhHNGdJQ0FnSUNBdkx5QkdhV3gwWlhJZ2IzVjBJSFJvWlNCMWRHbHNJRzF2WkhWc1pTd2dhWFFuY3lCcGJuTndaV04wSUdaMWJtTjBhVzl1SUdseklITndaV05wWVd4Y2JpQWdJQ0FnSUhaaGJIVmxMbWx1YzNCbFkzUWdJVDA5SUdWNGNHOXlkSE11YVc1emNHVmpkQ0FtSmx4dUlDQWdJQ0FnTHk4Z1FXeHpieUJtYVd4MFpYSWdiM1YwSUdGdWVTQndjbTkwYjNSNWNHVWdiMkpxWldOMGN5QjFjMmx1WnlCMGFHVWdZMmx5WTNWc1lYSWdZMmhsWTJzdVhHNGdJQ0FnSUNBaEtIWmhiSFZsTG1OdmJuTjBjblZqZEc5eUlDWW1JSFpoYkhWbExtTnZibk4wY25WamRHOXlMbkJ5YjNSdmRIbHdaU0E5UFQwZ2RtRnNkV1VwS1NCN1hHNGdJQ0FnZG1GeUlISmxkQ0E5SUhaaGJIVmxMbWx1YzNCbFkzUW9jbVZqZFhKelpWUnBiV1Z6TENCamRIZ3BPMXh1SUNBZ0lHbG1JQ2doYVhOVGRISnBibWNvY21WMEtTa2dlMXh1SUNBZ0lDQWdjbVYwSUQwZ1ptOXliV0YwVm1Gc2RXVW9ZM1I0TENCeVpYUXNJSEpsWTNWeWMyVlVhVzFsY3lrN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQnlaWFE3WEc0Z0lIMWNibHh1SUNBdkx5QlFjbWx0YVhScGRtVWdkSGx3WlhNZ1kyRnVibTkwSUdoaGRtVWdjSEp2Y0dWeWRHbGxjMXh1SUNCMllYSWdjSEpwYldsMGFYWmxJRDBnWm05eWJXRjBVSEpwYldsMGFYWmxLR04wZUN3Z2RtRnNkV1VwTzF4dUlDQnBaaUFvY0hKcGJXbDBhWFpsS1NCN1hHNGdJQ0FnY21WMGRYSnVJSEJ5YVcxcGRHbDJaVHRjYmlBZ2ZWeHVYRzRnSUM4dklFeHZiMnNnZFhBZ2RHaGxJR3RsZVhNZ2IyWWdkR2hsSUc5aWFtVmpkQzVjYmlBZ2RtRnlJR3RsZVhNZ1BTQlBZbXBsWTNRdWEyVjVjeWgyWVd4MVpTazdYRzRnSUhaaGNpQjJhWE5wWW14bFMyVjVjeUE5SUdGeWNtRjVWRzlJWVhOb0tHdGxlWE1wTzF4dVhHNGdJR2xtSUNoamRIZ3VjMmh2ZDBocFpHUmxiaWtnZTF4dUlDQWdJR3RsZVhNZ1BTQlBZbXBsWTNRdVoyVjBUM2R1VUhKdmNHVnlkSGxPWVcxbGN5aDJZV3gxWlNrN1hHNGdJSDFjYmx4dUlDQXZMeUJKUlNCa2IyVnpiaWQwSUcxaGEyVWdaWEp5YjNJZ1ptbGxiR1J6SUc1dmJpMWxiblZ0WlhKaFlteGxYRzRnSUM4dklHaDBkSEE2THk5dGMyUnVMbTFwWTNKdmMyOW1kQzVqYjIwdlpXNHRkWE12YkdsaWNtRnllUzlwWlM5a2QzYzFNbk5pZENoMlBYWnpMamswS1M1aGMzQjRYRzRnSUdsbUlDaHBjMFZ5Y205eUtIWmhiSFZsS1Z4dUlDQWdJQ0FnSmlZZ0tHdGxlWE11YVc1a1pYaFBaaWduYldWemMyRm5aU2NwSUQ0OUlEQWdmSHdnYTJWNWN5NXBibVJsZUU5bUtDZGtaWE5qY21sd2RHbHZiaWNwSUQ0OUlEQXBLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHWnZjbTFoZEVWeWNtOXlLSFpoYkhWbEtUdGNiaUFnZlZ4dVhHNGdJQzh2SUZOdmJXVWdkSGx3WlNCdlppQnZZbXBsWTNRZ2QybDBhRzkxZENCd2NtOXdaWEowYVdWeklHTmhiaUJpWlNCemFHOXlkR04xZEhSbFpDNWNiaUFnYVdZZ0tHdGxlWE11YkdWdVozUm9JRDA5UFNBd0tTQjdYRzRnSUNBZ2FXWWdLR2x6Um5WdVkzUnBiMjRvZG1Gc2RXVXBLU0I3WEc0Z0lDQWdJQ0IyWVhJZ2JtRnRaU0E5SUhaaGJIVmxMbTVoYldVZ1B5QW5PaUFuSUNzZ2RtRnNkV1V1Ym1GdFpTQTZJQ2NuTzF4dUlDQWdJQ0FnY21WMGRYSnVJR04wZUM1emRIbHNhWHBsS0NkYlJuVnVZM1JwYjI0bklDc2dibUZ0WlNBcklDZGRKeXdnSjNOd1pXTnBZV3duS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdhV1lnS0dselVtVm5SWGh3S0haaGJIVmxLU2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR04wZUM1emRIbHNhWHBsS0ZKbFowVjRjQzV3Y205MGIzUjVjR1V1ZEc5VGRISnBibWN1WTJGc2JDaDJZV3gxWlNrc0lDZHlaV2RsZUhBbktUdGNiaUFnSUNCOVhHNGdJQ0FnYVdZZ0tHbHpSR0YwWlNoMllXeDFaU2twSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJqZEhndWMzUjViR2w2WlNoRVlYUmxMbkJ5YjNSdmRIbHdaUzUwYjFOMGNtbHVaeTVqWVd4c0tIWmhiSFZsS1N3Z0oyUmhkR1VuS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdhV1lnS0dselJYSnliM0lvZG1Gc2RXVXBLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdabTl5YldGMFJYSnliM0lvZG1Gc2RXVXBPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSFpoY2lCaVlYTmxJRDBnSnljc0lHRnljbUY1SUQwZ1ptRnNjMlVzSUdKeVlXTmxjeUE5SUZzbmV5Y3NJQ2Q5SjEwN1hHNWNiaUFnTHk4Z1RXRnJaU0JCY25KaGVTQnpZWGtnZEdoaGRDQjBhR1Y1SUdGeVpTQkJjbkpoZVZ4dUlDQnBaaUFvYVhOQmNuSmhlU2gyWVd4MVpTa3BJSHRjYmlBZ0lDQmhjbkpoZVNBOUlIUnlkV1U3WEc0Z0lDQWdZbkpoWTJWeklEMGdXeWRiSnl3Z0oxMG5YVHRjYmlBZ2ZWeHVYRzRnSUM4dklFMWhhMlVnWm5WdVkzUnBiMjV6SUhOaGVTQjBhR0YwSUhSb1pYa2dZWEpsSUdaMWJtTjBhVzl1YzF4dUlDQnBaaUFvYVhOR2RXNWpkR2x2YmloMllXeDFaU2twSUh0Y2JpQWdJQ0IyWVhJZ2JpQTlJSFpoYkhWbExtNWhiV1VnUHlBbk9pQW5JQ3NnZG1Gc2RXVXVibUZ0WlNBNklDY25PMXh1SUNBZ0lHSmhjMlVnUFNBbklGdEdkVzVqZEdsdmJpY2dLeUJ1SUNzZ0oxMG5PMXh1SUNCOVhHNWNiaUFnTHk4Z1RXRnJaU0JTWldkRmVIQnpJSE5oZVNCMGFHRjBJSFJvWlhrZ1lYSmxJRkpsWjBWNGNITmNiaUFnYVdZZ0tHbHpVbVZuUlhod0tIWmhiSFZsS1NrZ2UxeHVJQ0FnSUdKaGMyVWdQU0FuSUNjZ0t5QlNaV2RGZUhBdWNISnZkRzkwZVhCbExuUnZVM1J5YVc1bkxtTmhiR3dvZG1Gc2RXVXBPMXh1SUNCOVhHNWNiaUFnTHk4Z1RXRnJaU0JrWVhSbGN5QjNhWFJvSUhCeWIzQmxjblJwWlhNZ1ptbHljM1FnYzJGNUlIUm9aU0JrWVhSbFhHNGdJR2xtSUNocGMwUmhkR1VvZG1Gc2RXVXBLU0I3WEc0Z0lDQWdZbUZ6WlNBOUlDY2dKeUFySUVSaGRHVXVjSEp2ZEc5MGVYQmxMblJ2VlZSRFUzUnlhVzVuTG1OaGJHd29kbUZzZFdVcE8xeHVJQ0I5WEc1Y2JpQWdMeThnVFdGclpTQmxjbkp2Y2lCM2FYUm9JRzFsYzNOaFoyVWdabWx5YzNRZ2MyRjVJSFJvWlNCbGNuSnZjbHh1SUNCcFppQW9hWE5GY25KdmNpaDJZV3gxWlNrcElIdGNiaUFnSUNCaVlYTmxJRDBnSnlBbklDc2dabTl5YldGMFJYSnliM0lvZG1Gc2RXVXBPMXh1SUNCOVhHNWNiaUFnYVdZZ0tHdGxlWE11YkdWdVozUm9JRDA5UFNBd0lDWW1JQ2doWVhKeVlYa2dmSHdnZG1Gc2RXVXViR1Z1WjNSb0lEMDlJREFwS1NCN1hHNGdJQ0FnY21WMGRYSnVJR0p5WVdObGMxc3dYU0FySUdKaGMyVWdLeUJpY21GalpYTmJNVjA3WEc0Z0lIMWNibHh1SUNCcFppQW9jbVZqZFhKelpWUnBiV1Z6SUR3Z01Da2dlMXh1SUNBZ0lHbG1JQ2hwYzFKbFowVjRjQ2gyWVd4MVpTa3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmpkSGd1YzNSNWJHbDZaU2hTWldkRmVIQXVjSEp2ZEc5MGVYQmxMblJ2VTNSeWFXNW5MbU5oYkd3b2RtRnNkV1VwTENBbmNtVm5aWGh3SnlrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmpkSGd1YzNSNWJHbDZaU2duVzA5aWFtVmpkRjBuTENBbmMzQmxZMmxoYkNjcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lHTjBlQzV6WldWdUxuQjFjMmdvZG1Gc2RXVXBPMXh1WEc0Z0lIWmhjaUJ2ZFhSd2RYUTdYRzRnSUdsbUlDaGhjbkpoZVNrZ2UxeHVJQ0FnSUc5MWRIQjFkQ0E5SUdadmNtMWhkRUZ5Y21GNUtHTjBlQ3dnZG1Gc2RXVXNJSEpsWTNWeWMyVlVhVzFsY3l3Z2RtbHphV0pzWlV0bGVYTXNJR3RsZVhNcE8xeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lHOTFkSEIxZENBOUlHdGxlWE11YldGd0tHWjFibU4wYVc5dUtHdGxlU2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1p2Y20xaGRGQnliM0JsY25SNUtHTjBlQ3dnZG1Gc2RXVXNJSEpsWTNWeWMyVlVhVzFsY3l3Z2RtbHphV0pzWlV0bGVYTXNJR3RsZVN3Z1lYSnlZWGtwTzF4dUlDQWdJSDBwTzF4dUlDQjlYRzVjYmlBZ1kzUjRMbk5sWlc0dWNHOXdLQ2s3WEc1Y2JpQWdjbVYwZFhKdUlISmxaSFZqWlZSdlUybHVaMnhsVTNSeWFXNW5LRzkxZEhCMWRDd2dZbUZ6WlN3Z1luSmhZMlZ6S1R0Y2JuMWNibHh1WEc1bWRXNWpkR2x2YmlCbWIzSnRZWFJRY21sdGFYUnBkbVVvWTNSNExDQjJZV3gxWlNrZ2UxeHVJQ0JwWmlBb2FYTlZibVJsWm1sdVpXUW9kbUZzZFdVcEtWeHVJQ0FnSUhKbGRIVnliaUJqZEhndWMzUjViR2w2WlNnbmRXNWtaV1pwYm1Wa0p5d2dKM1Z1WkdWbWFXNWxaQ2NwTzF4dUlDQnBaaUFvYVhOVGRISnBibWNvZG1Gc2RXVXBLU0I3WEc0Z0lDQWdkbUZ5SUhOcGJYQnNaU0E5SUNkY1hDY25JQ3NnU2xOUFRpNXpkSEpwYm1kcFpua29kbUZzZFdVcExuSmxjR3hoWTJVb0wxNWNJbnhjSWlRdlp5d2dKeWNwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdWNtVndiR0ZqWlNndkp5OW5MQ0JjSWx4Y1hGd25YQ0lwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdWNtVndiR0ZqWlNndlhGeGNYRndpTDJjc0lDZGNJaWNwSUNzZ0oxeGNKeWM3WEc0Z0lDQWdjbVYwZFhKdUlHTjBlQzV6ZEhsc2FYcGxLSE5wYlhCc1pTd2dKM04wY21sdVp5Y3BPMXh1SUNCOVhHNGdJR2xtSUNocGMwNTFiV0psY2loMllXeDFaU2twWEc0Z0lDQWdjbVYwZFhKdUlHTjBlQzV6ZEhsc2FYcGxLQ2NuSUNzZ2RtRnNkV1VzSUNkdWRXMWlaWEluS1R0Y2JpQWdhV1lnS0dselFtOXZiR1ZoYmloMllXeDFaU2twWEc0Z0lDQWdjbVYwZFhKdUlHTjBlQzV6ZEhsc2FYcGxLQ2NuSUNzZ2RtRnNkV1VzSUNkaWIyOXNaV0Z1SnlrN1hHNGdJQzh2SUVadmNpQnpiMjFsSUhKbFlYTnZiaUIwZVhCbGIyWWdiblZzYkNCcGN5QmNJbTlpYW1WamRGd2lMQ0J6YnlCemNHVmphV0ZzSUdOaGMyVWdhR1Z5WlM1Y2JpQWdhV1lnS0dselRuVnNiQ2gyWVd4MVpTa3BYRzRnSUNBZ2NtVjBkWEp1SUdOMGVDNXpkSGxzYVhwbEtDZHVkV3hzSnl3Z0oyNTFiR3duS1R0Y2JuMWNibHh1WEc1bWRXNWpkR2x2YmlCbWIzSnRZWFJGY25KdmNpaDJZV3gxWlNrZ2UxeHVJQ0J5WlhSMWNtNGdKMXNuSUNzZ1JYSnliM0l1Y0hKdmRHOTBlWEJsTG5SdlUzUnlhVzVuTG1OaGJHd29kbUZzZFdVcElDc2dKMTBuTzF4dWZWeHVYRzVjYm1aMWJtTjBhVzl1SUdadmNtMWhkRUZ5Y21GNUtHTjBlQ3dnZG1Gc2RXVXNJSEpsWTNWeWMyVlVhVzFsY3l3Z2RtbHphV0pzWlV0bGVYTXNJR3RsZVhNcElIdGNiaUFnZG1GeUlHOTFkSEIxZENBOUlGdGRPMXh1SUNCbWIzSWdLSFpoY2lCcElEMGdNQ3dnYkNBOUlIWmhiSFZsTG14bGJtZDBhRHNnYVNBOElHdzdJQ3NyYVNrZ2UxeHVJQ0FnSUdsbUlDaG9ZWE5QZDI1UWNtOXdaWEowZVNoMllXeDFaU3dnVTNSeWFXNW5LR2twS1NrZ2UxeHVJQ0FnSUNBZ2IzVjBjSFYwTG5CMWMyZ29abTl5YldGMFVISnZjR1Z5ZEhrb1kzUjRMQ0IyWVd4MVpTd2djbVZqZFhKelpWUnBiV1Z6TENCMmFYTnBZbXhsUzJWNWN5eGNiaUFnSUNBZ0lDQWdJQ0JUZEhKcGJtY29hU2tzSUhSeWRXVXBLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2IzVjBjSFYwTG5CMWMyZ29KeWNwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVJQ0JyWlhsekxtWnZja1ZoWTJnb1puVnVZM1JwYjI0b2EyVjVLU0I3WEc0Z0lDQWdhV1lnS0NGclpYa3ViV0YwWTJnb0wxNWNYR1FySkM4cEtTQjdYRzRnSUNBZ0lDQnZkWFJ3ZFhRdWNIVnphQ2htYjNKdFlYUlFjbTl3WlhKMGVTaGpkSGdzSUhaaGJIVmxMQ0J5WldOMWNuTmxWR2x0WlhNc0lIWnBjMmxpYkdWTFpYbHpMRnh1SUNBZ0lDQWdJQ0FnSUd0bGVTd2dkSEoxWlNrcE8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc0Z0lISmxkSFZ5YmlCdmRYUndkWFE3WEc1OVhHNWNibHh1Wm5WdVkzUnBiMjRnWm05eWJXRjBVSEp2Y0dWeWRIa29ZM1I0TENCMllXeDFaU3dnY21WamRYSnpaVlJwYldWekxDQjJhWE5wWW14bFMyVjVjeXdnYTJWNUxDQmhjbkpoZVNrZ2UxeHVJQ0IyWVhJZ2JtRnRaU3dnYzNSeUxDQmtaWE5qTzF4dUlDQmtaWE5qSUQwZ1QySnFaV04wTG1kbGRFOTNibEJ5YjNCbGNuUjVSR1Z6WTNKcGNIUnZjaWgyWVd4MVpTd2dhMlY1S1NCOGZDQjdJSFpoYkhWbE9pQjJZV3gxWlZ0clpYbGRJSDA3WEc0Z0lHbG1JQ2hrWlhOakxtZGxkQ2tnZTF4dUlDQWdJR2xtSUNoa1pYTmpMbk5sZENrZ2UxeHVJQ0FnSUNBZ2MzUnlJRDBnWTNSNExuTjBlV3hwZW1Vb0oxdEhaWFIwWlhJdlUyVjBkR1Z5WFNjc0lDZHpjR1ZqYVdGc0p5azdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhOMGNpQTlJR04wZUM1emRIbHNhWHBsS0NkYlIyVjBkR1Z5WFNjc0lDZHpjR1ZqYVdGc0p5azdYRzRnSUNBZ2ZWeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lHbG1JQ2hrWlhOakxuTmxkQ2tnZTF4dUlDQWdJQ0FnYzNSeUlEMGdZM1I0TG5OMGVXeHBlbVVvSjF0VFpYUjBaWEpkSnl3Z0ozTndaV05wWVd3bktUdGNiaUFnSUNCOVhHNGdJSDFjYmlBZ2FXWWdLQ0ZvWVhOUGQyNVFjbTl3WlhKMGVTaDJhWE5wWW14bFMyVjVjeXdnYTJWNUtTa2dlMXh1SUNBZ0lHNWhiV1VnUFNBbld5Y2dLeUJyWlhrZ0t5QW5YU2M3WEc0Z0lIMWNiaUFnYVdZZ0tDRnpkSElwSUh0Y2JpQWdJQ0JwWmlBb1kzUjRMbk5sWlc0dWFXNWtaWGhQWmloa1pYTmpMblpoYkhWbEtTQThJREFwSUh0Y2JpQWdJQ0FnSUdsbUlDaHBjMDUxYkd3b2NtVmpkWEp6WlZScGJXVnpLU2tnZTF4dUlDQWdJQ0FnSUNCemRISWdQU0JtYjNKdFlYUldZV3gxWlNoamRIZ3NJR1JsYzJNdWRtRnNkV1VzSUc1MWJHd3BPMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdjM1J5SUQwZ1ptOXliV0YwVm1Gc2RXVW9ZM1I0TENCa1pYTmpMblpoYkhWbExDQnlaV04xY25ObFZHbHRaWE1nTFNBeEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHbG1JQ2h6ZEhJdWFXNWtaWGhQWmlnblhGeHVKeWtnUGlBdE1Ta2dlMXh1SUNBZ0lDQWdJQ0JwWmlBb1lYSnlZWGtwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnpkSElnUFNCemRISXVjM0JzYVhRb0oxeGNiaWNwTG0xaGNDaG1kVzVqZEdsdmJpaHNhVzVsS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdKeUFnSnlBcklHeHBibVU3WEc0Z0lDQWdJQ0FnSUNBZ2ZTa3VhbTlwYmlnblhGeHVKeWt1YzNWaWMzUnlLRElwTzF4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lITjBjaUE5SUNkY1hHNG5JQ3NnYzNSeUxuTndiR2wwS0NkY1hHNG5LUzV0WVhBb1puVnVZM1JwYjI0b2JHbHVaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlDY2dJQ0FuSUNzZ2JHbHVaVHRjYmlBZ0lDQWdJQ0FnSUNCOUtTNXFiMmx1S0NkY1hHNG5LVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQnpkSElnUFNCamRIZ3VjM1I1YkdsNlpTZ25XME5wY21OMWJHRnlYU2NzSUNkemNHVmphV0ZzSnlrN1hHNGdJQ0FnZlZ4dUlDQjlYRzRnSUdsbUlDaHBjMVZ1WkdWbWFXNWxaQ2h1WVcxbEtTa2dlMXh1SUNBZ0lHbG1JQ2hoY25KaGVTQW1KaUJyWlhrdWJXRjBZMmdvTDE1Y1hHUXJKQzhwS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYzNSeU8xeHVJQ0FnSUgxY2JpQWdJQ0J1WVcxbElEMGdTbE5QVGk1emRISnBibWRwWm5rb0p5Y2dLeUJyWlhrcE8xeHVJQ0FnSUdsbUlDaHVZVzFsTG0xaGRHTm9LQzllWENJb1cyRXRla0V0V2w5ZFcyRXRla0V0V2w4d0xUbGRLaWxjSWlRdktTa2dlMXh1SUNBZ0lDQWdibUZ0WlNBOUlHNWhiV1V1YzNWaWMzUnlLREVzSUc1aGJXVXViR1Z1WjNSb0lDMGdNaWs3WEc0Z0lDQWdJQ0J1WVcxbElEMGdZM1I0TG5OMGVXeHBlbVVvYm1GdFpTd2dKMjVoYldVbktUdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnYm1GdFpTQTlJRzVoYldVdWNtVndiR0ZqWlNndkp5OW5MQ0JjSWx4Y1hGd25YQ0lwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM1eVpYQnNZV05sS0M5Y1hGeGNYQ0l2Wnl3Z0oxd2lKeWxjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTG5KbGNHeGhZMlVvTHloZVhDSjhYQ0lrS1M5bkxDQmNJaWRjSWlrN1hHNGdJQ0FnSUNCdVlXMWxJRDBnWTNSNExuTjBlV3hwZW1Vb2JtRnRaU3dnSjNOMGNtbHVaeWNwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJ1WVcxbElDc2dKem9nSnlBcklITjBjanRjYm4xY2JseHVYRzVtZFc1amRHbHZiaUJ5WldSMVkyVlViMU5wYm1kc1pWTjBjbWx1WnlodmRYUndkWFFzSUdKaGMyVXNJR0p5WVdObGN5a2dlMXh1SUNCMllYSWdiblZ0VEdsdVpYTkZjM1FnUFNBd08xeHVJQ0IyWVhJZ2JHVnVaM1JvSUQwZ2IzVjBjSFYwTG5KbFpIVmpaU2htZFc1amRHbHZiaWh3Y21WMkxDQmpkWElwSUh0Y2JpQWdJQ0J1ZFcxTWFXNWxjMFZ6ZENzck8xeHVJQ0FnSUdsbUlDaGpkWEl1YVc1a1pYaFBaaWduWEZ4dUp5a2dQajBnTUNrZ2JuVnRUR2x1WlhORmMzUXJLenRjYmlBZ0lDQnlaWFIxY200Z2NISmxkaUFySUdOMWNpNXlaWEJzWVdObEtDOWNYSFV3TURGaVhGeGJYRnhrWEZ4a1AyMHZaeXdnSnljcExteGxibWQwYUNBcklERTdYRzRnSUgwc0lEQXBPMXh1WEc0Z0lHbG1JQ2hzWlc1bmRHZ2dQaUEyTUNrZ2UxeHVJQ0FnSUhKbGRIVnliaUJpY21GalpYTmJNRjBnSzF4dUlDQWdJQ0FnSUNBZ0lDQW9ZbUZ6WlNBOVBUMGdKeWNnUHlBbkp5QTZJR0poYzJVZ0t5QW5YRnh1SUNjcElDdGNiaUFnSUNBZ0lDQWdJQ0FnSnlBbklDdGNiaUFnSUNBZ0lDQWdJQ0FnYjNWMGNIVjBMbXB2YVc0b0p5eGNYRzRnSUNjcElDdGNiaUFnSUNBZ0lDQWdJQ0FnSnlBbklDdGNiaUFnSUNBZ0lDQWdJQ0FnWW5KaFkyVnpXekZkTzF4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUdKeVlXTmxjMXN3WFNBcklHSmhjMlVnS3lBbklDY2dLeUJ2ZFhSd2RYUXVhbTlwYmlnbkxDQW5LU0FySUNjZ0p5QXJJR0p5WVdObGMxc3hYVHRjYm4xY2JseHVYRzR2THlCT1QxUkZPaUJVYUdWelpTQjBlWEJsSUdOb1pXTnJhVzVuSUdaMWJtTjBhVzl1Y3lCcGJuUmxiblJwYjI1aGJHeDVJR1J2YmlkMElIVnpaU0JnYVc1emRHRnVZMlZ2Wm1CY2JpOHZJR0psWTJGMWMyVWdhWFFnYVhNZ1puSmhaMmxzWlNCaGJtUWdZMkZ1SUdKbElHVmhjMmxzZVNCbVlXdGxaQ0IzYVhSb0lHQlBZbXBsWTNRdVkzSmxZWFJsS0NsZ0xseHVablZ1WTNScGIyNGdhWE5CY25KaGVTaGhjaWtnZTF4dUlDQnlaWFIxY200Z1FYSnlZWGt1YVhOQmNuSmhlU2hoY2lrN1hHNTlYRzVsZUhCdmNuUnpMbWx6UVhKeVlYa2dQU0JwYzBGeWNtRjVPMXh1WEc1bWRXNWpkR2x2YmlCcGMwSnZiMnhsWVc0b1lYSm5LU0I3WEc0Z0lISmxkSFZ5YmlCMGVYQmxiMllnWVhKbklEMDlQU0FuWW05dmJHVmhiaWM3WEc1OVhHNWxlSEJ2Y25SekxtbHpRbTl2YkdWaGJpQTlJR2x6UW05dmJHVmhianRjYmx4dVpuVnVZM1JwYjI0Z2FYTk9kV3hzS0dGeVp5a2dlMXh1SUNCeVpYUjFjbTRnWVhKbklEMDlQU0J1ZFd4c08xeHVmVnh1Wlhod2IzSjBjeTVwYzA1MWJHd2dQU0JwYzA1MWJHdzdYRzVjYm1aMWJtTjBhVzl1SUdselRuVnNiRTl5Vlc1a1pXWnBibVZrS0dGeVp5a2dlMXh1SUNCeVpYUjFjbTRnWVhKbklEMDlJRzUxYkd3N1hHNTlYRzVsZUhCdmNuUnpMbWx6VG5Wc2JFOXlWVzVrWldacGJtVmtJRDBnYVhOT2RXeHNUM0pWYm1SbFptbHVaV1E3WEc1Y2JtWjFibU4wYVc5dUlHbHpUblZ0WW1WeUtHRnlaeWtnZTF4dUlDQnlaWFIxY200Z2RIbHdaVzltSUdGeVp5QTlQVDBnSjI1MWJXSmxjaWM3WEc1OVhHNWxlSEJ2Y25SekxtbHpUblZ0WW1WeUlEMGdhWE5PZFcxaVpYSTdYRzVjYm1aMWJtTjBhVzl1SUdselUzUnlhVzVuS0dGeVp5a2dlMXh1SUNCeVpYUjFjbTRnZEhsd1pXOW1JR0Z5WnlBOVBUMGdKM04wY21sdVp5YzdYRzU5WEc1bGVIQnZjblJ6TG1selUzUnlhVzVuSUQwZ2FYTlRkSEpwYm1jN1hHNWNibVoxYm1OMGFXOXVJR2x6VTNsdFltOXNLR0Z5WnlrZ2UxeHVJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlHRnlaeUE5UFQwZ0ozTjViV0p2YkNjN1hHNTlYRzVsZUhCdmNuUnpMbWx6VTNsdFltOXNJRDBnYVhOVGVXMWliMnc3WEc1Y2JtWjFibU4wYVc5dUlHbHpWVzVrWldacGJtVmtLR0Z5WnlrZ2UxeHVJQ0J5WlhSMWNtNGdZWEpuSUQwOVBTQjJiMmxrSURBN1hHNTlYRzVsZUhCdmNuUnpMbWx6Vlc1a1pXWnBibVZrSUQwZ2FYTlZibVJsWm1sdVpXUTdYRzVjYm1aMWJtTjBhVzl1SUdselVtVm5SWGh3S0hKbEtTQjdYRzRnSUhKbGRIVnliaUJwYzA5aWFtVmpkQ2h5WlNrZ0ppWWdiMkpxWldOMFZHOVRkSEpwYm1jb2NtVXBJRDA5UFNBblcyOWlhbVZqZENCU1pXZEZlSEJkSnp0Y2JuMWNibVY0Y0c5eWRITXVhWE5TWldkRmVIQWdQU0JwYzFKbFowVjRjRHRjYmx4dVpuVnVZM1JwYjI0Z2FYTlBZbXBsWTNRb1lYSm5LU0I3WEc0Z0lISmxkSFZ5YmlCMGVYQmxiMllnWVhKbklEMDlQU0FuYjJKcVpXTjBKeUFtSmlCaGNtY2dJVDA5SUc1MWJHdzdYRzU5WEc1bGVIQnZjblJ6TG1selQySnFaV04wSUQwZ2FYTlBZbXBsWTNRN1hHNWNibVoxYm1OMGFXOXVJR2x6UkdGMFpTaGtLU0I3WEc0Z0lISmxkSFZ5YmlCcGMwOWlhbVZqZENoa0tTQW1KaUJ2WW1wbFkzUlViMU4wY21sdVp5aGtLU0E5UFQwZ0oxdHZZbXBsWTNRZ1JHRjBaVjBuTzF4dWZWeHVaWGh3YjNKMGN5NXBjMFJoZEdVZ1BTQnBjMFJoZEdVN1hHNWNibVoxYm1OMGFXOXVJR2x6UlhKeWIzSW9aU2tnZTF4dUlDQnlaWFIxY200Z2FYTlBZbXBsWTNRb1pTa2dKaVpjYmlBZ0lDQWdJQ2h2WW1wbFkzUlViMU4wY21sdVp5aGxLU0E5UFQwZ0oxdHZZbXBsWTNRZ1JYSnliM0pkSnlCOGZDQmxJR2x1YzNSaGJtTmxiMllnUlhKeWIzSXBPMXh1ZlZ4dVpYaHdiM0owY3k1cGMwVnljbTl5SUQwZ2FYTkZjbkp2Y2p0Y2JseHVablZ1WTNScGIyNGdhWE5HZFc1amRHbHZiaWhoY21jcElIdGNiaUFnY21WMGRYSnVJSFI1Y0dWdlppQmhjbWNnUFQwOUlDZG1kVzVqZEdsdmJpYzdYRzU5WEc1bGVIQnZjblJ6TG1selJuVnVZM1JwYjI0Z1BTQnBjMFoxYm1OMGFXOXVPMXh1WEc1bWRXNWpkR2x2YmlCcGMxQnlhVzFwZEdsMlpTaGhjbWNwSUh0Y2JpQWdjbVYwZFhKdUlHRnlaeUE5UFQwZ2JuVnNiQ0I4ZkZ4dUlDQWdJQ0FnSUNBZ2RIbHdaVzltSUdGeVp5QTlQVDBnSjJKdmIyeGxZVzRuSUh4OFhHNGdJQ0FnSUNBZ0lDQjBlWEJsYjJZZ1lYSm5JRDA5UFNBbmJuVnRZbVZ5SnlCOGZGeHVJQ0FnSUNBZ0lDQWdkSGx3Wlc5bUlHRnlaeUE5UFQwZ0ozTjBjbWx1WnljZ2ZIeGNiaUFnSUNBZ0lDQWdJSFI1Y0dWdlppQmhjbWNnUFQwOUlDZHplVzFpYjJ3bklIeDhJQ0F2THlCRlV6WWdjM2x0WW05c1hHNGdJQ0FnSUNBZ0lDQjBlWEJsYjJZZ1lYSm5JRDA5UFNBbmRXNWtaV1pwYm1Wa0p6dGNibjFjYm1WNGNHOXlkSE11YVhOUWNtbHRhWFJwZG1VZ1BTQnBjMUJ5YVcxcGRHbDJaVHRjYmx4dVpYaHdiM0owY3k1cGMwSjFabVpsY2lBOUlISmxjWFZwY21Vb0p5NHZjM1Z3Y0c5eWRDOXBjMEoxWm1abGNpY3BPMXh1WEc1bWRXNWpkR2x2YmlCdlltcGxZM1JVYjFOMGNtbHVaeWh2S1NCN1hHNGdJSEpsZEhWeWJpQlBZbXBsWTNRdWNISnZkRzkwZVhCbExuUnZVM1J5YVc1bkxtTmhiR3dvYnlrN1hHNTlYRzVjYmx4dVpuVnVZM1JwYjI0Z2NHRmtLRzRwSUh0Y2JpQWdjbVYwZFhKdUlHNGdQQ0F4TUNBL0lDY3dKeUFySUc0dWRHOVRkSEpwYm1jb01UQXBJRG9nYmk1MGIxTjBjbWx1WnlneE1DazdYRzU5WEc1Y2JseHVkbUZ5SUcxdmJuUm9jeUE5SUZzblNtRnVKeXdnSjBabFlpY3NJQ2ROWVhJbkxDQW5RWEJ5Snl3Z0owMWhlU2NzSUNkS2RXNG5MQ0FuU25Wc0p5d2dKMEYxWnljc0lDZFRaWEFuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FuVDJOMEp5d2dKMDV2ZGljc0lDZEVaV01uWFR0Y2JseHVMeThnTWpZZ1JtVmlJREUyT2pFNU9qTTBYRzVtZFc1amRHbHZiaUIwYVcxbGMzUmhiWEFvS1NCN1hHNGdJSFpoY2lCa0lEMGdibVYzSUVSaGRHVW9LVHRjYmlBZ2RtRnlJSFJwYldVZ1BTQmJjR0ZrS0dRdVoyVjBTRzkxY25Nb0tTa3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIQmhaQ2hrTG1kbGRFMXBiblYwWlhNb0tTa3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIQmhaQ2hrTG1kbGRGTmxZMjl1WkhNb0tTbGRMbXB2YVc0b0p6b25LVHRjYmlBZ2NtVjBkWEp1SUZ0a0xtZGxkRVJoZEdVb0tTd2diVzl1ZEdoelcyUXVaMlYwVFc5dWRHZ29LVjBzSUhScGJXVmRMbXB2YVc0b0p5QW5LVHRjYm4xY2JseHVYRzR2THlCc2IyY2dhWE1nYW5WemRDQmhJSFJvYVc0Z2QzSmhjSEJsY2lCMGJ5QmpiMjV6YjJ4bExteHZaeUIwYUdGMElIQnlaWEJsYm1SeklHRWdkR2x0WlhOMFlXMXdYRzVsZUhCdmNuUnpMbXh2WnlBOUlHWjFibU4wYVc5dUtDa2dlMXh1SUNCamIyNXpiMnhsTG14dlp5Z25KWE1nTFNBbGN5Y3NJSFJwYldWemRHRnRjQ2dwTENCbGVIQnZjblJ6TG1admNtMWhkQzVoY0hCc2VTaGxlSEJ2Y25SekxDQmhjbWQxYldWdWRITXBLVHRjYm4wN1hHNWNibHh1THlvcVhHNGdLaUJKYm1obGNtbDBJSFJvWlNCd2NtOTBiM1I1Y0dVZ2JXVjBhRzlrY3lCbWNtOXRJRzl1WlNCamIyNXpkSEoxWTNSdmNpQnBiblJ2SUdGdWIzUm9aWEl1WEc0Z0tseHVJQ29nVkdobElFWjFibU4wYVc5dUxuQnliM1J2ZEhsd1pTNXBibWhsY21sMGN5Qm1jbTl0SUd4aGJtY3Vhbk1nY21WM2NtbDBkR1Z1SUdGeklHRWdjM1JoYm1SaGJHOXVaVnh1SUNvZ1puVnVZM1JwYjI0Z0tHNXZkQ0J2YmlCR2RXNWpkR2x2Ymk1d2NtOTBiM1I1Y0dVcExpQk9UMVJGT2lCSlppQjBhR2x6SUdacGJHVWdhWE1nZEc4Z1ltVWdiRzloWkdWa1hHNGdLaUJrZFhKcGJtY2dZbTl2ZEhOMGNtRndjR2x1WnlCMGFHbHpJR1oxYm1OMGFXOXVJRzVsWldSeklIUnZJR0psSUhKbGQzSnBkSFJsYmlCMWMybHVaeUJ6YjIxbElHNWhkR2wyWlZ4dUlDb2dablZ1WTNScGIyNXpJR0Z6SUhCeWIzUnZkSGx3WlNCelpYUjFjQ0IxYzJsdVp5QnViM0p0WVd3Z1NtRjJZVk5qY21sd2RDQmtiMlZ6SUc1dmRDQjNiM0pySUdGelhHNGdLaUJsZUhCbFkzUmxaQ0JrZFhKcGJtY2dZbTl2ZEhOMGNtRndjR2x1WnlBb2MyVmxJRzFwY25KdmNpNXFjeUJwYmlCeU1URTBPVEF6S1M1Y2JpQXFYRzRnS2lCQWNHRnlZVzBnZTJaMWJtTjBhVzl1ZlNCamRHOXlJRU52Ym5OMGNuVmpkRzl5SUdaMWJtTjBhVzl1SUhkb2FXTm9JRzVsWldSeklIUnZJR2x1YUdWeWFYUWdkR2hsWEc0Z0tpQWdJQ0FnY0hKdmRHOTBlWEJsTGx4dUlDb2dRSEJoY21GdElIdG1kVzVqZEdsdmJuMGdjM1Z3WlhKRGRHOXlJRU52Ym5OMGNuVmpkRzl5SUdaMWJtTjBhVzl1SUhSdklHbHVhR1Z5YVhRZ2NISnZkRzkwZVhCbElHWnliMjB1WEc0Z0tpOWNibVY0Y0c5eWRITXVhVzVvWlhKcGRITWdQU0J5WlhGMWFYSmxLQ2RwYm1obGNtbDBjeWNwTzF4dVhHNWxlSEJ2Y25SekxsOWxlSFJsYm1RZ1BTQm1kVzVqZEdsdmJpaHZjbWxuYVc0c0lHRmtaQ2tnZTF4dUlDQXZMeUJFYjI0bmRDQmtieUJoYm5sMGFHbHVaeUJwWmlCaFpHUWdhWE51SjNRZ1lXNGdiMkpxWldOMFhHNGdJR2xtSUNnaFlXUmtJSHg4SUNGcGMwOWlhbVZqZENoaFpHUXBLU0J5WlhSMWNtNGdiM0pwWjJsdU8xeHVYRzRnSUhaaGNpQnJaWGx6SUQwZ1QySnFaV04wTG10bGVYTW9ZV1JrS1R0Y2JpQWdkbUZ5SUdrZ1BTQnJaWGx6TG14bGJtZDBhRHRjYmlBZ2QyaHBiR1VnS0drdExTa2dlMXh1SUNBZ0lHOXlhV2RwYmx0clpYbHpXMmxkWFNBOUlHRmtaRnRyWlhselcybGRYVHRjYmlBZ2ZWeHVJQ0J5WlhSMWNtNGdiM0pwWjJsdU8xeHVmVHRjYmx4dVpuVnVZM1JwYjI0Z2FHRnpUM2R1VUhKdmNHVnlkSGtvYjJKcUxDQndjbTl3S1NCN1hHNGdJSEpsZEhWeWJpQlBZbXBsWTNRdWNISnZkRzkwZVhCbExtaGhjMDkzYmxCeWIzQmxjblI1TG1OaGJHd29iMkpxTENCd2NtOXdLVHRjYm4xY2JpSmRmUT09IiwiKGZ1bmN0aW9uKHNlbGYpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGlmIChzZWxmLmZldGNoKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgc3VwcG9ydCA9IHtcbiAgICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gICAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gICAgYmxvYjogJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiYgJ0Jsb2InIGluIHNlbGYgJiYgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gICAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXG4gIH1cblxuICBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICAgIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICAgIF1cblxuICAgIHZhciBpc0RhdGFWaWV3ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbiAgICB9XG5cbiAgICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPSBBcnJheUJ1ZmZlci5pc1ZpZXcgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gICAgfVxuICAgIGlmICgvW15hLXowLTlcXC0jJCUmJyorLlxcXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICAgIH1cbiAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICAvLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxuICBmdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICAgIHZhciBpdGVyYXRvciA9IHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvclxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpdGVyYXRvclxuICB9XG5cbiAgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgdGhpcy5tYXAgPSB7fVxuXG4gICAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgICB9LCB0aGlzKVxuXG4gICAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gICAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUrJywnK3ZhbHVlIDogdmFsdWVcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2gobmFtZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkgeyBpdGVtcy5wdXNoKHZhbHVlKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xuICB9XG5cbiAgZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICAgIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gICAgfVxuICAgIGJvZHkuYm9keVVzZWQgPSB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgICB9XG4gICAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gICAgfVxuICAgIHJldHVybiBjaGFycy5qb2luKCcnKVxuICB9XG5cbiAgZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gICAgaWYgKGJ1Zi5zbGljZSkge1xuICAgICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEJvZHkoKSB7XG4gICAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgICAgaWYgKCFib2R5KSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKVxuICAgICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgQm9keUluaXQgdHlwZScpXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxuICB2YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgcmV0dXJuIChtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSkgPyB1cGNhc2VkIDogbWV0aG9kXG4gIH1cblxuICBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuXG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgICB9XG4gICAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgICAgfVxuICAgICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgICB9XG5cbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdvbWl0J1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcbiAgICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gICAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICAgIH1cbiAgICB0aGlzLl9pbml0Qm9keShib2R5KVxuICB9XG5cbiAgUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywgeyBib2R5OiB0aGlzLl9ib2R5SW5pdCB9KVxuICB9XG5cbiAgZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgYm9keS50cmltKCkuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAgIHJhd0hlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgICAgdmFyIGtleSA9IHBhcnRzLnNoaWZ0KCkudHJpbSgpXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBoZWFkZXJzXG4gIH1cblxuICBCb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbiAgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fVxuICAgIH1cblxuICAgIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICAgIHRoaXMuc3RhdHVzID0gJ3N0YXR1cycgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzIDogMjAwXG4gICAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICAgIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJ1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gICAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG4gIH1cblxuICBCb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG4gIFJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgICAgdXJsOiB0aGlzLnVybFxuICAgIH0pXG4gIH1cblxuICBSZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gICAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIHZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG4gIFJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG4gIH1cblxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG5cbiAgc2VsZi5mZXRjaCA9IGZ1bmN0aW9uKGlucHV0LCBpbml0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKVxuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJylcbiAgICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICAgIH1cblxuICAgICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgICB9KVxuXG4gICAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICAgIH0pXG4gIH1cbiAgc2VsZi5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzKTtcbiIsIm1vZHVsZS5leHBvcnRzLlByb2R1Y3Rpb24gPSByZXF1aXJlKCcuL3Byb2R1Y3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzLlNhbmRib3ggPSByZXF1aXJlKCcuL3NhbmRib3gnKTtcbiIsIi8qKlxuICogQGNsYXNzIFByb2R1Y3Rpb24gQVBJXG4gKi9cbmNsYXNzIFByb2R1Y3Rpb25BUEkge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBQcm9kdWN0aW9uQVBJXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW5kcG9pbnQgLSBUaGUgaG9zdCBlbmRwb2ludFxuICAgKiBAcGFyYW0ge09iamVjdH0gZmV0Y2hGbiAtIFRoZSBmdW5jdGlvbiB0byB1c2UgZm9yIGZldGNoaW5nIHRoZSBkYXRhIC0gRGVmYXVsdHMgdG8gd2luZG93LmZldGNoXG4gICAqIEByZXR1cm4ge1Byb2R1Y3Rpb25BUEl9XG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbmRwb2ludCwgZmV0Y2hGbiA9ICguLi5hcmdzKSA9PiB3aW5kb3cuZmV0Y2goLi4uYXJncykpIHtcbiAgICB0aGlzLl9lbmRwb2ludCA9IGVuZHBvaW50O1xuICAgIHRoaXMuX2ZldGNoRm4gPSBmZXRjaEZuO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIFByb3BhZ2F0ZXMgaW52b2tlIGNhbGwgdG8gX2ZldGNoRm5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlc291cmNlIC0gVGhlIHJlc291cmNlIHRvIGZldGNoIGZyb21cbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWQgLSBUaGUgcGF5bG9hZCB0byBwYXNzXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBpbnZva2UocmVzb3VyY2UsIHBheWxvYWQpIHtcbiAgICBsZXQgc3RhdHVzID0gMDtcbiAgICByZXR1cm4gdGhpcy5fZmV0Y2hGbihgJHt0aGlzLl9lbmRwb2ludH0vJHtyZXNvdXJjZX1gLCBwYXlsb2FkKS50aGVuKChyZXMpID0+IHtcbiAgICAgIHN0YXR1cyA9IHJlcy5zdGF0dXM7XG4gICAgICBpZiAoc3RhdHVzICE9PSAyMDQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICB9KS50aGVuKGJvZHkgPT4gKHsgYm9keSwgc3RhdHVzIH0pKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2R1Y3Rpb25BUEk7XG4iLCJjb25zdCBVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5jb25zdCBxcyA9IHJlcXVpcmUoJ3FzJyk7XG5cbmNvbnN0IHN0cmlwQmVhcmVyID0gVXRpbHMuc3RyaXBCZWFyZXI7XG5cbi8qKlxuICogR2VuZXJhdGVzIGFuIEhUVFAgcmVzcG9uc2Ugb2JqZWN0XG4gKlxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqXG4gKi9cbmNvbnN0IHJlc3BvbnNlID0gKHN0YXR1cyA9IDIwMCwgYm9keSA9IHt9KSA9PiAoUHJvbWlzZS5yZXNvbHZlKHtcbiAgc3RhdHVzLFxuICBib2R5LFxufSkpO1xuXG4vKipcbiAqIEBjbGFzcyBTYW5kYm94IEFQSVxuICovXG5jbGFzcyBTYW5kYm94QVBJIHtcblxuICAvKipcbiAgICogTWFwcyBBUEkgcmVzb3VyY2VzIHRvIHJlc3BvbnNlIG9iamVjdHNcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICovXG4gIHN0YXRpYyBnZXQgcmVzb3VyY2VzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIE1hcHMgYC91c2Vyc2AgcmVzb3VyY2VcbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICpcbiAgICAgICAqL1xuICAgICAgdXNlcnM6IHtcbiAgICAgICAgR0VUOiAoZGF0YWJhc2UsIGlkLCBib2R5LCBoZWFkZXJzKSA9PiB7XG4gICAgICAgICAgY29uc3QgdG9rZW4gPSBzdHJpcEJlYXJlcihoZWFkZXJzLkF1dGhvcml6YXRpb24pO1xuICAgICAgICAgIGlmICghZGF0YWJhc2UuaGFzVXNlcldpdGhUb2tlbih0b2tlbikpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZSg0MDQsIHsgZXJyb3I6ICdub3RfZm91bmQnIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoMjAwLCBkYXRhYmFzZS5nZXRVc2VyV2l0aFRva2VuKHRva2VuKSk7XG4gICAgICAgIH0sXG4gICAgICAgIFBPU1Q6IChkYXRhYmFzZSwgaWQsIGJvZHkpID0+IHtcbiAgICAgICAgICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCwgZmlyc3RfbmFtZSwgbGFzdF9uYW1lIH0gPSBKU09OLnBhcnNlKGJvZHkpO1xuICAgICAgICAgIGlmIChkYXRhYmFzZS5oYXNVc2VyV2l0aERhdGEoZW1haWwsIHBhc3N3b3JkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDQwMCwgeyBlcnJvcjogJ3ZhbGlkYXRpb25fZmFpbGVkJyB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbmV3VXNlciA9IGRhdGFiYXNlLmFkZFVzZXIoZW1haWwsIHBhc3N3b3JkLCBmaXJzdF9uYW1lLCBsYXN0X25hbWUpO1xuICAgICAgICAgIHJldHVybiByZXNwb25zZSgyMDEsIG5ld1VzZXIpO1xuICAgICAgICB9LFxuICAgICAgICBQQVRDSDogKGRhdGFiYXNlLCBpZCwgYm9keSwgaGVhZGVycykgPT4ge1xuICAgICAgICAgIGNvbnN0IHRva2VuID0gc3RyaXBCZWFyZXIoaGVhZGVycy5BdXRob3JpemF0aW9uKTtcbiAgICAgICAgICBjb25zdCB7IGZpcnN0X25hbWUsIGxhc3RfbmFtZSB9ID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICBpZiAoZGF0YWJhc2UuZ2V0VXNlcldpdGhUb2tlbih0b2tlbikgIT09IGRhdGFiYXNlLmdldFVzZXJXaXRoSWQoaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoNDAwLCB7IGVycm9yOiAnaW52YWxpZF9ncmFudCcgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHBhdGNoZWRVc2VyID0gZGF0YWJhc2UudXBkYXRlVXNlcihpZCwgZmlyc3RfbmFtZSwgbGFzdF9uYW1lKTtcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoMjAwLCBwYXRjaGVkVXNlcik7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLyoqXG4gICAgICAgKiBNYXBzIGAvdG9rZW5gIHJlc291cmNlXG4gICAgICAgKlxuICAgICAgICogQHNlZSBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNjc0OVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqXG4gICAgICAgKi9cbiAgICAgIHRva2VuOiB7XG4gICAgICAgIFBPU1Q6IChkYXRhYmFzZSwgaWQsIGJvZHkpID0+IHtcbiAgICAgICAgICBjb25zdCBkZWNvZGVkQm9keSA9IHFzLnBhcnNlKGJvZHkpO1xuICAgICAgICAgIGNvbnN0IHsgZ3JhbnRfdHlwZSwgdXNlcm5hbWUsIHBhc3N3b3JkLCByZWZyZXNoX3Rva2VuIH0gPSBkZWNvZGVkQm9keTtcbiAgICAgICAgICBpZiAoZ3JhbnRfdHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAgICAgaWYgKCFkYXRhYmFzZS5oYXNVc2VyV2l0aERhdGEodXNlcm5hbWUsIHBhc3N3b3JkKSkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoNDA0LCB7IGVycm9yOiAnbm90X2ZvdW5kJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBkYXRhYmFzZS5nZXRVc2VyV2l0aERhdGEodXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZSgyMDAsIGRhdGFiYXNlLmdldFRva2VuRm9yKHVzZXIuaWQpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgaWYgKGdyYW50X3R5cGUgPT09ICdyZWZyZXNoX3Rva2VuJykge1xuICAgICAgICAgICAgaWYgKCFkYXRhYmFzZS5oYXNUb2tlbldpdGhSZWZyZXNoKHJlZnJlc2hfdG9rZW4pKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXNwb25zZSg0MDAsIHsgZXJyb3I6ICdpbnZhbGlkX3Rva2VuJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlZnJlc2hlZFRva2VuID0gZGF0YWJhc2UudXBkYXRlVG9rZW4ocmVmcmVzaF90b2tlbik7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoMjAwLCByZWZyZXNoZWRUb2tlbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXNwb25zZSg0MDQsIHsgZXJyb3I6ICd1bmV4cGVjdGVkX2Vycm9yJyB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIE1hcHMgYC9wYXNzd29yZHNgIHJlc291cmNlXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqXG4gICAgICAgKi9cbiAgICAgIHBhc3N3b3Jkczoge1xuICAgICAgICBQT1NUOiAoZGF0YWJhc2UsIGlkLCBib2R5KSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBlbWFpbCB9ID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICBpZiAoIWRhdGFiYXNlLmhhc1VzZXJXaXRoRW1haWwoZW1haWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoNDA0LCB7IGVycm9yOiAnbm90X2ZvdW5kJyB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIFBVVDogKGRhdGFiYXNlLCBpZCkgPT4ge1xuICAgICAgICAgIGlmICghZGF0YWJhc2UuaGFzUGFzc3dvcmRSZXNldFRva2VuKGlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDQwNCwgeyBlcnJvcjogJ25vdF9mb3VuZCcgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXNwb25zZSgpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIFNhbmRib3hBUElcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7U2FuZGJveERhdGFiYXNlfSBkYXRhYmFzZSAtIFRoZSBkYXRhYmFzZSB0byB1c2UgZm9yIHN0b3Jpbmcgc2Vzc3Npb24gY2hhbmdlc1xuICAgKiBAcmV0dXJuIHtTYW5kYm94QVBJfVxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YWJhc2UpIHtcbiAgICB0aGlzLl9kYXRhYmFzZSA9IGRhdGFiYXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0dWJzIEFQSSBjYWxsc1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVzb3VyY2UgLSBUaGUgcmVzb3VyY2UgdG8gZmV0Y2ggZnJvbVxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIFRoZSBwYXlsb2QgdG8gcHJvcGFnYXRlXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBpbnZva2UocmVzb3VyY2UsIHBheWxvYWQpIHtcbiAgICBjb25zdCBbcm91dGUsIGlkXSA9IHJlc291cmNlLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgeyBtZXRob2QsIGJvZHksIGhlYWRlcnMgfSA9IHBheWxvYWQ7XG4gICAgcmV0dXJuIFNhbmRib3hBUEkucmVzb3VyY2VzW3JvdXRlXVttZXRob2RdKHRoaXMuX2RhdGFiYXNlLCBpZCwgYm9keSwgaGVhZGVycyk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNhbmRib3hBUEk7XG4iLCJjb25zdCBVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmNvbnN0IGdlbmVyYXRlUmFuZG9tU3RyaW5nID0gVXRpbHMuZ2VuZXJhdGVSYW5kb21TdHJpbmc7XG5jb25zdCBnZW5lcmF0ZVJhbmRvbVVVSUQgPSBVdGlscy5nZW5lcmF0ZVJhbmRvbVVVSUQ7XG5cbi8qKlxuICogQGNsYXNzIFNhbmRib3hEYXRhYmFzZVxuICovXG5jbGFzcyBTYW5kYm94RGF0YWJhc2Uge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBTYW5kYm94QVBJXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0pTT059IHVzZXJzIC0gVGhlIGluaXRpYWwgdXNlciBmaXh0dXJlc1xuICAgKiBAcGFyYW0ge0pTT059IHRva2VucyAtIFRoZSBpbml0aWFsIHRva2VuIGZpeHR1cmVzXG4gICAqIEBwYXJhbSB7SlNPTn0gcGFzc3dvcmRzIC0gVGhlIGluaXRpYWwgcGFzc3dvcmRzIGZpeHR1cmVzXG4gICAqIEByZXR1cm4gU2FuZGJveERhdGFiYXNlXG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih1c2VycywgdG9rZW5zLCBwYXNzd29yZHMpIHtcbiAgICB0aGlzLl91c2VycyA9IFsuLi51c2Vyc107XG4gICAgdGhpcy5fdG9rZW5zID0gWy4uLnRva2Vuc107XG4gICAgdGhpcy5fcGFzc3dvcmRzID0gWy4uLnBhc3N3b3Jkc107XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB1c2Vyc1xuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICpcbiAgICovXG4gIGdldCB1c2VycygpIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlcnM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0b2tlbnNcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqXG4gICAqL1xuICBnZXQgdG9rZW5zKCkge1xuICAgIHJldHVybiB0aGlzLl90b2tlbnM7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdHMgYHB1YmxpY2AgdXNlciBkYXRhXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICpcbiAgKi9cbiAgX2V4dHJhY3RVc2VyKGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGRhdGEuaWQsXG4gICAgICBwdWJsaXNoZXJfaWQ6IGRhdGEucHVibGlzaGVyX2lkLFxuICAgICAgZmlyc3RfbmFtZTogZGF0YS5maXJzdF9uYW1lLFxuICAgICAgbGFzdF9uYW1lOiBkYXRhLmxhc3RfbmFtZSxcbiAgICAgIGVtYWlsOiBkYXRhLmVtYWlsLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdHMgYHB1YmxpY2AgdG9rZW4gZGF0YVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqXG4gICovXG4gIF9leHRyYWN0VG9rZW4oZGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICBhY2Nlc3NfdG9rZW46IGRhdGEuYWNjZXNzX3Rva2VuLFxuICAgICAgcmVmcmVzaF90b2tlbjogZGF0YS5yZWZyZXNoX3Rva2VuLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBkYXRhYmFzZSBoYXMgYSBzcGVjaWZpYyB0b2tlbiBiYXNlZCBvbiByZWZyZXNoX3Rva2VuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZWZyZXNoVG9rZW4gLSBUaGUgcmVmcmVzaCB0b2tlbiB0byBsb29rdXBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICpcbiAgICovXG4gIGhhc1Rva2VuV2l0aFJlZnJlc2gocmVmcmVzaFRva2VuKSB7XG4gICAgcmV0dXJuICEhfnRoaXMuX3Rva2Vucy5maW5kSW5kZXgodG9rZW4gPT4gdG9rZW4ucmVmcmVzaF90b2tlbiA9PT0gcmVmcmVzaFRva2VuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIGRhdGFiYXNlIGhhcyBhIHNwZWNpZmljIHVzZXIgYmFzZWQgb24gZGF0YVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwgdG8gbG9va3VwXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSBwYXNzd29yZCB0byBsb29rdXBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICpcbiAgICovXG4gIGhhc1VzZXJXaXRoRGF0YShlbWFpbCwgcGFzc3dvcmQpIHtcbiAgICByZXR1cm4gISF+dGhpcy5fdXNlcnMuZmluZEluZGV4KHVzZXIgPT4gdXNlci5lbWFpbCA9PT0gZW1haWwgJiYgdXNlci5wYXNzd29yZCA9PT0gcGFzc3dvcmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgZGF0YWJhc2UgaGFzIGEgc3BlY2lmaWMgdXNlciBiYXNlZCBvbiB0b2tlblxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWNjZXNzVG9rZW4gLSBUaGUgdG9rZW4gdG8gbG9va3VwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqXG4gICAqL1xuICBoYXNVc2VyV2l0aFRva2VuKGFjY2Vzc1Rva2VuKSB7XG4gICAgcmV0dXJuICEhfnRoaXMuX3Rva2Vucy5maW5kSW5kZXgodG9rZW4gPT4gdG9rZW4uYWNjZXNzX3Rva2VuID09PSBhY2Nlc3NUb2tlbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0b2tlbiBmb3IgYSB1c2VyXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgLSBUaGUgdXNlciBpZCB0byBsb29rdXBcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKlxuICAgKi9cbiAgZ2V0VG9rZW5Gb3IodXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rva2Vucy5maW5kKHRva2VuID0+IHRva2VuLnVzZXJfaWQgPT09IHVzZXJJZCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBkYXRhYmFzZSBoYXMgYSBzcGVjaWZpYyB1c2VyIGJhc2VkIG9uIGVtYWlsXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCB0byBsb29rdXBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICpcbiAgICovXG4gIGhhc1VzZXJXaXRoRW1haWwoZW1haWwpIHtcbiAgICByZXR1cm4gISF+dGhpcy5fdXNlcnMuZmluZEluZGV4KHVzZXIgPT4gdXNlci5lbWFpbCA9PT0gZW1haWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgZGF0YWJhc2UgaGFzIGEgc3BlY2lmaWMgcGFzc3dvcmQgcmVzZXQgdG9rZW5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIC0gVGhlIHRva2VuIHRvIGxvb2t1cFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKlxuICAgKi9cbiAgaGFzUGFzc3dvcmRSZXNldFRva2VuKHRva2VuKSB7XG4gICAgcmV0dXJuICEhfnRoaXMuX3Bhc3N3b3Jkcy5maW5kSW5kZXgocmVjb3JkID0+IHJlY29yZC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdXNlciBmcm9tIGZpeHR1cmVzIGJhc2VkIG9uIGRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsIC0gVGhlIHRhcmdldCB1c2VyIGVtYWlsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSB0YXJnZXQgdXNlciBwYXNzd29yZFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKlxuICAgKi9cbiAgZ2V0VXNlcldpdGhEYXRhKGVtYWlsLCBwYXNzd29yZCkge1xuICAgIHJldHVybiB0aGlzLl9leHRyYWN0VXNlcih0aGlzLl91c2Vycy5maW5kKHVzZXIgPT4gKHVzZXIuZW1haWwgPT09IGVtYWlsICYmIHVzZXIucGFzc3dvcmQgPT09IHBhc3N3b3JkKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIFJldHVybnMgdXNlciBmcm9tIGZpeHR1cmVzIGJhc2VkIG9uIGBpZGBcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIHVzZXIgaWQgdG8gbG9va3VwXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGZvdW5kIHVzZXIgZGF0YVxuICAgKlxuICAgKi9cbiAgZ2V0VXNlcldpdGhJZChpZCkge1xuICAgIHJldHVybiB0aGlzLl9leHRyYWN0VXNlcih0aGlzLl91c2Vycy5maW5kKHVzZXIgPT4gdXNlci5pZCA9PT0gaWQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHVzZXIgZnJvbSBmaXh0dXJlcyBiYXNlZCBvbiB0b2tlblxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWNjZXNzVG9rZW4gLSBUaGUgdG9rZW4gdG8gbG9va3VwXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGZvdW5kIGBhY2Nlc3NfdG9rZW5gIGFuZCBgcmVmcmVzaF90b2tlbmBcbiAgICpcbiAgICovXG4gIGdldFVzZXJXaXRoVG9rZW4oYWNjZXNzVG9rZW4pIHtcbiAgICBjb25zdCB1c2VySWQgPSB0aGlzLl90b2tlbnMuZmluZCh0b2tlbiA9PiB0b2tlbi5hY2Nlc3NfdG9rZW4gPT09IGFjY2Vzc1Rva2VuKS51c2VyX2lkO1xuICAgIHJldHVybiB0aGlzLmdldFVzZXJXaXRoSWQodXNlcklkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHVzZXIgdG8gZml4dHVyZXNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsIHRvIHNldFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgcGFzc3dvcmQgdG8gc2V0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmaXJzdE5hbWUgLSBUaGUgZmlyc3ROYW1lIHRvIHNldCAtIE9wdGlvbmFsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYXN0TmFtZSAtIFRoZSBsYXN0TmFtZSB0byBzZXQgLSBPcHRpb25hbFxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB1c2VyIGRhdGEgbWVyZ2VkIGludG8gYW4gb2JqZWN0XG4gICAqXG4gICAqL1xuICBhZGRVc2VyKGVtYWlsLCBwYXNzd29yZCwgZmlyc3ROYW1lLCBsYXN0TmFtZSkge1xuICAgIGNvbnN0IHVzZXJJZCA9IGdlbmVyYXRlUmFuZG9tVVVJRCgpO1xuICAgIGNvbnN0IHB1Ymxpc2hlcklkID0gZ2VuZXJhdGVSYW5kb21VVUlEKCk7XG4gICAgY29uc3QgYWNjZXNzVG9rZW4gPSBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICAgIGNvbnN0IHJlZnJlc2hUb2tlbiA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gICAgY29uc3QgbmV3VG9rZW4gPSB7XG4gICAgICB1c2VyX2lkOiB1c2VySWQsXG4gICAgICBhY2Nlc3NfdG9rZW46IGFjY2Vzc1Rva2VuLFxuICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuICAgIH07XG4gICAgY29uc3QgbmV3VXNlciA9IHtcbiAgICAgIGlkOiB1c2VySWQsXG4gICAgICBwdWJsaXNoZXJfaWQ6IHB1Ymxpc2hlcklkLFxuICAgICAgZW1haWwsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIGZpcnN0X25hbWU6IGZpcnN0TmFtZSxcbiAgICAgIGxhc3RfbmFtZTogbGFzdE5hbWUsXG4gICAgfTtcbiAgICAvLyBTdG9yZSBuZXcgcmVjb3Jkc1xuICAgIHRoaXMuX3Rva2Vucy5wdXNoKG5ld1Rva2VuKTtcbiAgICB0aGlzLl91c2Vycy5wdXNoKG5ld1VzZXIpO1xuICAgIC8vIFJldHVybiBwdWJsaWMgdXNlciBkYXRhXG4gICAgcmV0dXJuIHRoaXMuX2V4dHJhY3RVc2VyKG5ld1VzZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdXNlclxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgdXNlciBpZCB0byBsb29rdXBcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpcnN0TmFtZSAtIFRoZSBmaXJzdE5hbWUgdG8gdXBkYXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYXN0TmFtZSAtIFRoZSBsYXN0TmFtZSB0byB1cGRhdGVcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdXNlciBkYXRhIG1lcmdlZCBpbnRvIGFuIG9iamVjdFxuICAgKlxuICAgKi9cbiAgdXBkYXRlVXNlcihpZCwgZmlyc3ROYW1lLCBsYXN0TmFtZSkge1xuICAgIGNvbnN0IHVzZXIgPSB0aGlzLl91c2Vycy5maW5kKHJlY29yZCA9PiByZWNvcmQuaWQgPT09IGlkKTtcbiAgICBpZiAodHlwZW9mIGZpcnN0TmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHVzZXIuZmlyc3RfbmFtZSA9IGZpcnN0TmFtZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsYXN0TmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHVzZXIubGFzdF9uYW1lID0gbGFzdE5hbWU7XG4gICAgfVxuICAgIC8vIFJldHVybiBwdWJsaWMgdXNlciBkYXRhXG4gICAgcmV0dXJuIHRoaXMuX2V4dHJhY3RVc2VyKHVzZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdG9rZW5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlZnJlc2hUb2tlbiAtIFRoZSByZWZyZXNoVG9rZW4gdG8gdXNlXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGZvdW5kIGBhY2Nlc3NfdG9rZW5gIGFuZCBgcmVmcmVzaF90b2tlbmBcbiAgICpcbiAgICovXG4gIHVwZGF0ZVRva2VuKHJlZnJlc2hUb2tlbikge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5fdG9rZW5zLmZpbmQocmVjb3JkID0+IHJlY29yZC5yZWZyZXNoX3Rva2VuID09PSByZWZyZXNoVG9rZW4pO1xuICAgIHRva2VuLmFjY2Vzc190b2tlbiA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gICAgdG9rZW4ucmVmcmVzaF90b2tlbiA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gICAgLy8gUmV0dXJuIHB1YmxpYyB1c2VyIGRhdGFcbiAgICByZXR1cm4gdGhpcy5fZXh0cmFjdFRva2VuKHRva2VuKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FuZGJveERhdGFiYXNlO1xuIiwiY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5jb25zdCBDb25zdW1lciA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2NvbnN1bWVyJyk7XG5jb25zdCB2YWxpZGF0ZVBhc3N3b3JkID0gcmVxdWlyZSgnLi4vdXRpbHMnKS52YWxpZGF0ZVBhc3N3b3JkO1xuXG4vKipcbiAqIEBjbGFzcyBBdXRoZW50aWNhdG9yXG4gKi9cbmNsYXNzIEF1dGhlbnRpY2F0b3Ige1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBBdXRoZW50aWNhdG9yXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZSB0byB1c2VcbiAgICogQHJldHVybiB7QXV0aGVudGljYXRvcn1cbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbnN1bWVyKSB7XG4gICAgYXNzZXJ0KGNvbnN1bWVyIGluc3RhbmNlb2YgQ29uc3VtZXIsICdgY29uc3VtZXJgIHNob3VsZCBiZSBpbnN0YW5jZSBvZiBDb25zdW1lcicpO1xuICAgIHRoaXMuX2NvbnN1bWVyID0gY29uc3VtZXI7XG4gIH1cblxuICAvKipcbiAgICogQXNrcyBmb3IgYSBwYXNzd29yZCByZXNldFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwgdG8gcmVzZXQgdGhlIHBhc3N3b3JkIGZvclxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmVxdWVzdFBhc3N3b3JkUmVzZXQoZW1haWwpIHtcbiAgICBhc3NlcnQoZW1haWwsICdNaXNzaW5nIGBlbWFpbGAnKTtcbiAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIucmVxdWVzdFBhc3N3b3JkUmVzZXQoZW1haWwpLnRoZW4oKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgbWVzc2FnZTogJ0EgcmVzZXQgbGluayBoYXMgYmVlbiBzZW50IHRvIHlvdXIgZW1haWwnIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgbmV3IHBhc3N3b3JkXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiAtIFRoZSByZXNldCB0b2tlbiBwcm92aWRlZCB2aWEgZW1haWxcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIG5ldyBwYXNzd29yZFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmVzZXRQYXNzd29yZCh0b2tlbiwgcGFzc3dvcmQpIHtcbiAgICBhc3NlcnQodG9rZW4sICdNaXNzaW5nIGB0b2tlbmAnKTtcbiAgICBhc3NlcnQocGFzc3dvcmQsICdNaXNzaW5nIGBwYXNzd29yZGAnKTtcbiAgICBjb25zdCB7IGlzVmFsaWQsIG1lc3NhZ2UgfSA9IHZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpO1xuICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihtZXNzYWdlKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb25zdW1lci5yZXNldFBhc3N3b3JkKHRva2VuLCBwYXNzd29yZCkudGhlbigoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBtZXNzYWdlOiAnWW91ciBwYXNzd29yZCBoYXMgYmVlbiByZXNldCcgfSkpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoZW50aWNhdG9yO1xuIiwiY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbi8qKlxuICogQGNsYXNzIENsaWVudFxuICovXG5jbGFzcyBDbGllbnQge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBDbGllbnRcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBDbGllbnQgaWRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlY3JldCAtIFRoZSBDbGllbnQgc2VjcmV0XG4gICAqIEByZXR1cm4ge0NsaWVudH1cbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKGlkLCBzZWNyZXQpIHtcbiAgICBhc3NlcnQoaWQsICdNaXNzaW5nIGBpZGAnKTtcbiAgICBhc3NlcnQoc2VjcmV0LCAnTWlzc2luZyBgc2VjcmV0YCcpO1xuICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgdGhpcy5fc2VjcmV0ID0gc2VjcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgQ2xpZW50IGlkXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICpcbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBDbGllbnQgc2VjcmV0XG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICpcbiAgICovXG4gIGdldCBzZWNyZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlY3JldDtcbiAgfVxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IENsaWVudDtcbiIsImNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJyk7XG5jb25zdCByZXRyaWV2ZVVSTCA9IHJlcXVpcmUoJy4uL3V0aWxzJykucmV0cmlldmVVUkw7XG5jb25zdCByZWRpcmVjdFRvVVJMID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5yZWRpcmVjdFRvVVJMO1xuXG4vKipcbiAqIEBjbGFzcyBTZXNzaW9uXG4gKi9cbmNsYXNzIFNlc3Npb24ge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBVc2VyXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1VzZXJ9IGNvbnN1bWVyIC0gVGhlIFVzZXIgaW5zdGFuY2UgdG8gdXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsb2dpbkhvc3QgLSBUaGUgbG9naW4gYXBwIGhvc3RcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlZGlyZWN0Rm4gLSBUaGUgZnVuY3Rpb24gdGhlIGZvcmNlcyBVUkwgcmVkaXJlY3Rpb24gLSBEZWZhdWx0cyB0byBgd2luZG93LmxvY2F0aW9uLnJlcGxhY2VgXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYWdlVVJMIC0gVGhlIGN1cnJlbnQgcGFnZSBVUkwgLSBEZWZhdWx0cyB0byBgd2luZG93LmhyZWZgXG4gICAqIEByZXR1cm4ge1VzZXJ9XG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih1c2VyLCBsb2dpbkhvc3QsIHJlZGlyZWN0Rm4gPSByZWRpcmVjdFRvVVJMLCBwYWdlVVJMID0gcmV0cmlldmVVUkwpIHtcbiAgICBhc3NlcnQodXNlciBpbnN0YW5jZW9mIFVzZXIsICdgdXNlcmAgc2hvdWxkIGJlIGluc3RhbmNlIG9mIFVzZXInKTtcbiAgICBhc3NlcnQobG9naW5Ib3N0LCAnYGxvZ2luSG9zdGAgaXMgbm90IGRlZmluZWQnKTtcbiAgICB0aGlzLl91c2VyID0gdXNlcjtcbiAgICB0aGlzLl9sb2dpbkhvc3QgPSBsb2dpbkhvc3Q7XG4gICAgdGhpcy5fcmVkaXJlY3RGbiA9IHJlZGlyZWN0Rm47XG4gICAgdGhpcy5fcGFnZVVSTCA9IHBhZ2VVUkw7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBzZXNzaW9uIGlzIHZhbGlkIChVc2VyIGlzIGF1dGhlbnRpY2F0ZWQpXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqXG4gICAqL1xuICBnZXQgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuX3VzZXIuYmVhcmVyICE9PSAndW5kZWZpbmVkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBzZXNzaW9uIGZvciB1c2VyIChpZiBkZWZpbmVkKSBpbiBTdG9yZVxuICAgKiBOb3RlOiBUaGlzIHNob3VsZCBiZSB0aGUgRklSU1QgY2FsbCBiZWZvcmUgYXR0ZW1wdGluZyBhbnkgb3RoZXIgc2Vzc2lvbiBvcGVyYXRpb25zXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHJldHVybiB0aGlzLl91c2VyLnN5bmNXaXRoU3RvcmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnZhbGlkYXRlcyBTZXNzaW9uXG4gICAqXG4gICAqIEByZXR1cm4ge1ZvaWR9XG4gICAqXG4gICAqL1xuICBpbnZhbGlkYXRlKCkge1xuICAgIC8vIFJlZGlyZWN0IHRvIGxvZ2luIGhvc3Qgd2l0aCBhIHJldHVybiBVUkxcbiAgICByZXR1cm4gdGhpcy5fcmVkaXJlY3RGbihgJHt0aGlzLl9sb2dpbkhvc3R9L2xvZ291dGApO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyBTZXNzaW9uXG4gICAqIC0gRXh0cmFjdHMgY3VycmVudCBVUkwgZnJvbSB3aW5kb3cubG9jYXRpb25cbiAgICogLSBSZWRpcmVjdHMgdG8gYGxvZ2luSG9zdGAgd2l0aCBlbmNvZGVkIFVSTFxuICAgKlxuICAgKiBAcmV0dXJuIHtWb2lkfVxuICAgKlxuICAgKi9cbiAgdmFsaWRhdGUoKSB7XG4gICAgY29uc3QgcmVkaXJlY3RVcmwgPSBlbmNvZGVVUklDb21wb25lbnQodGhpcy5fcGFnZVVSTCgpKTtcbiAgICByZXR1cm4gdGhpcy5fcmVkaXJlY3RGbihgJHt0aGlzLl9sb2dpbkhvc3R9L2xvZ2luP3JlZGlyZWN0VXJsPSR7cmVkaXJlY3RVcmx9YCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXNzaW9uO1xuIiwiY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5jb25zdCBDb25zdW1lciA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2NvbnN1bWVyJyk7XG5jb25zdCBTdG9yZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL3N0b3JlJyk7XG5jb25zdCB2YWxpZGF0ZVBhc3N3b3JkID0gcmVxdWlyZSgnLi4vdXRpbHMnKS52YWxpZGF0ZVBhc3N3b3JkO1xuXG4vKipcbiAqIEBjbGFzcyBVc2VyXG4gKi9cbmNsYXNzIFVzZXIge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBVc2VyXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZSB0byB1c2VcbiAgICogQHBhcmFtIHtDb25zdW1lcn0gY29uc3VtZXIgLSBUaGUgQ29uc3VtZXIgaW5zdGFuY2UgdG8gdXNlXG4gICAqIEByZXR1cm4ge1VzZXJ9XG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzdG9yZSwgY29uc3VtZXIpIHtcbiAgICBhc3NlcnQoc3RvcmUgaW5zdGFuY2VvZiBTdG9yZSwgJ2BzdG9yZWAgc2hvdWxkIGJlIGluc3RhbmNlIG9mIFN0b3JlJyk7XG4gICAgYXNzZXJ0KGNvbnN1bWVyIGluc3RhbmNlb2YgQ29uc3VtZXIsICdgY29uc3VtZXJgIHNob3VsZCBiZSBpbnN0YW5jZSBvZiBDb25zdW1lcicpO1xuICAgIHRoaXMuX3N0b3JlID0gc3RvcmU7XG4gICAgdGhpcy5fY29uc3VtZXIgPSBjb25zdW1lcjtcbiAgICB0aGlzLl9iZWFyZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5faWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcHVibGlzaGVySWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZmlyc3ROYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2xhc3ROYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2VtYWlsID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2lzRGlydHkgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIFVzZXIgaWRcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfSBbcmVhZC1vbmx5XSBpZFxuICAgKlxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLl9pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIFVzZXIgcHVibGlzaGVySWRcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfSBbcmVhZC1vbmx5XSBwdWJsaXNoZXJJZFxuICAgKlxuICAgKi9cbiAgZ2V0IHB1Ymxpc2hlcklkKCkge1xuICAgIHJldHVybiB0aGlzLl9wdWJsaXNoZXJJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIFVzZXIgZW1haWxcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfSBbcmVhZC1vbmx5XSBlbWFpbFxuICAgKlxuICAgKi9cbiAgZ2V0IGVtYWlsKCkge1xuICAgIHJldHVybiB0aGlzLl9lbWFpbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIFVzZXIgYmVhcmVyIHRva2VuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ30gW3JlYWQtd3JpdGVdIGJlYXJlciB0b2tlblxuICAgKlxuICAgKi9cbiAgZ2V0IGJlYXJlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fYmVhcmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgVXNlciBmaXJzdCBOYW1lXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ30gW3JlYWQtd3JpdGVdIGZpcnN0IE5hbWVcbiAgICpcbiAgICovXG4gIGdldCBmaXJzdE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpcnN0TmFtZTtcbiAgfVxuICBzZXQgZmlyc3ROYW1lKG5ld0ZpcnN0TmFtZSkge1xuICAgIGlmIChuZXdGaXJzdE5hbWUpIHtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSB0cnVlO1xuICAgICAgdGhpcy5fZmlyc3ROYW1lID0gbmV3Rmlyc3ROYW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIFVzZXIgbGFzdCBuYW1lXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ30gW3JlYWQtd3JpdGVdIGxhc3QgbmFtZVxuICAgKlxuICAgKi9cbiAgZ2V0IGxhc3ROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9sYXN0TmFtZTtcbiAgfVxuICBzZXQgbGFzdE5hbWUobmV3TGFzdE5hbWUpIHtcbiAgICBpZiAobmV3TGFzdE5hbWUpIHtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSB0cnVlO1xuICAgICAgdGhpcy5fbGFzdE5hbWUgPSBuZXdMYXN0TmFtZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3luY3MgVXNlciBkYXRhIGZyb20gU3RvcmVcbiAgICogLSBDdXJyZW50bHkgb24gYmVhcmVyIGlzIHN5bmNlZCB0byBTdG9yZVxuICAgKiAtIFN0b3JlIHByaW9yaXR5IHByb2NlZWRzIGRpcnR5IGRhdGFcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIHN5bmNXaXRoU3RvcmUoKSB7XG4gICAgbGV0IGJlYXJlcjtcbiAgICByZXR1cm4gdGhpcy5fc3RvcmUucmV0cml2ZVRva2VuKCkudGhlbigoYWNjZXNzVG9rZW4pID0+IHtcbiAgICAgIC8vIENhY2hlIGJlYXJlclxuICAgICAgYmVhcmVyID0gYWNjZXNzVG9rZW47XG4gICAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIucmV0cmlldmVVc2VyKGFjY2Vzc1Rva2VuKTtcbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICB0aGlzLl9pZCA9IGRhdGEuaWQ7XG4gICAgICB0aGlzLl9wdWJsaXNoZXJJZCA9IGRhdGEucHVibGlzaGVyX2lkO1xuICAgICAgdGhpcy5fZW1haWwgPSBkYXRhLmVtYWlsO1xuICAgICAgdGhpcy5fZmlyc3ROYW1lID0gZGF0YS5maXJzdF9uYW1lO1xuICAgICAgdGhpcy5fbGFzdE5hbWUgPSBkYXRhLmxhc3RfbmFtZTtcbiAgICAgIHRoaXMuX2JlYXJlciA9IGJlYXJlcjtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSBmYWxzZTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBtZXNzYWdlOiAnU3luY2VkIFVzZXIgbW9kZWwgd2l0aCBTdG9yZScsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIFVzZXIgZGF0YVxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgc2F2ZSgpIHtcbiAgICBpZiAoIXRoaXMuX2lkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdDYW5ub3Qgc2F2ZSBhIG5vbi1leGlzdGVudCBVc2VyJykpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2lzRGlydHkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBtZXNzYWdlOiAnTm8gVXNlciBtb2RlbCBjaGFuZ2VzIHRvIHN5bmMnLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb25zdW1lci51cGRhdGVVc2VyKHRoaXMuX2lkLCB0aGlzLl9iZWFyZXIsIHtcbiAgICAgIGZpcnN0TmFtZTogdGhpcy5fZmlyc3ROYW1lLFxuICAgICAgbGFzdE5hbWU6IHRoaXMuX2xhc3ROYW1lLFxuICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5faXNEaXJ0eSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIG1lc3NhZ2U6ICdVcGRhdGVkIFVzZXIgbW9kZWwnLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBVc2VyXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIHBhc3N3b3JkIHRvIHNldFxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlyc3ROYW1lIC0gVGhlIGZpcnN0IG5hbWUgdG8gc2V0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYXN0TmFtZSAtIFRoZSBsYXN0IG5hbWUgdG8gc2V0XG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBjcmVhdGUoZW1haWwsIHBhc3N3b3JkLCBmaXJzdE5hbWUsIGxhc3ROYW1lKSB7XG4gICAgYXNzZXJ0KGVtYWlsLCAnTWlzc2luZyBgZW1haWxgJyk7XG4gICAgYXNzZXJ0KHBhc3N3b3JkLCAnTWlzc2luZyBgcGFzc3dvcmRgJyk7XG4gICAgY29uc3QgeyBpc1ZhbGlkLCBtZXNzYWdlIH0gPSB2YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKTtcbiAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IobWVzc2FnZSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIuY3JlYXRlVXNlcihlbWFpbCwgcGFzc3dvcmQsIGZpcnN0TmFtZSwgbGFzdE5hbWUpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIHRoaXMuX2lkID0gZGF0YS5pZDtcbiAgICAgIHRoaXMuX3B1Ymxpc2hlcklkID0gZGF0YS5wdWJsaXNoZXJfaWQ7XG4gICAgICB0aGlzLl9maXJzdE5hbWUgPSBkYXRhLmZpcnN0X25hbWU7XG4gICAgICB0aGlzLl9sYXN0TmFtZSA9IGRhdGEubGFzdF9uYW1lO1xuICAgICAgdGhpcy5fZW1haWwgPSBkYXRhLmVtYWlsO1xuICAgICAgdGhpcy5faXNEaXJ0eSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIG1lc3NhZ2U6ICdDcmVhdGVkIFVzZXInLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGF1dGhlbnRpY2F0aW9uIHRva2VucyBmb3IgYSB1c2VybmFtZS1wYXNzd29yZCBjb21iaW5hdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlcm5hbWUgLSBUaGUgdXNlcm5hbWUgdG8gdXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSBwYXNzd29yZCB0byB1c2VcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIGF1dGhlbnRpY2F0ZSh1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICBhc3NlcnQodXNlcm5hbWUsICdNaXNzaW5nIGB1c2VybmFtZWAnKTtcbiAgICBhc3NlcnQocGFzc3dvcmQsICdNaXNzaW5nIGBwYXNzd29yZGAnKTtcbiAgICBsZXQgYmVhcmVyO1xuICAgIHJldHVybiB0aGlzLl9jb25zdW1lci5yZXRyaWV2ZVRva2VuKHVzZXJuYW1lLCBwYXNzd29yZCkudGhlbigocmVzKSA9PiB7XG4gICAgICBjb25zdCB7IGFjY2Vzc190b2tlbiwgcmVmcmVzaF90b2tlbiB9ID0gcmVzO1xuICAgICAgLy8gQ2FjaGUgYmVhcmVyXG4gICAgICBiZWFyZXIgPSBhY2Nlc3NfdG9rZW47XG4gICAgICAvLyBTdG9yZSB0b2tlbnNcbiAgICAgIHJldHVybiB0aGlzLl9zdG9yZS5zZXQoJ2FjY2Vzc190b2tlbicsIGFjY2Vzc190b2tlbilcbiAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5fc3RvcmUuc2V0KCdyZWZyZXNoX3Rva2VuJywgcmVmcmVzaF90b2tlbikpXG4gICAgICAgIC50aGVuKCgpID0+IHRoaXMuX2NvbnN1bWVyLnJldHJpZXZlVXNlcihhY2Nlc3NfdG9rZW4pKTtcbiAgICAgIC8vIFJldHJpZXZlIHVzZXIgZGF0YVxuICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIHRoaXMuX2JlYXJlciA9IGJlYXJlcjtcbiAgICAgIHRoaXMuX2lkID0gZGF0YS5pZDtcbiAgICAgIHRoaXMuX3B1Ymxpc2hlcklkID0gZGF0YS5wdWJsaXNoZXJfaWQ7XG4gICAgICB0aGlzLl9lbWFpbCA9IGRhdGEuZW1haWw7XG4gICAgICB0aGlzLl9maXJzdE5hbWUgPSBkYXRhLmZpcnN0X25hbWU7XG4gICAgICB0aGlzLl9sYXN0TmFtZSA9IGRhdGEubGFzdF9uYW1lO1xuICAgICAgdGhpcy5faXNEaXJ0eSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIG1lc3NhZ2U6ICdBdXRoZW50aWNhdGVkIFVzZXInLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHVzZXIgZm9yIGFuIGFjY2VzcyB0b2tlbi5cbiAgICogRmFsbGJhY2tzIHRvIHRva2VuIHJlZnJlc2ggaWYgcmVmcmVzaFRva2VuIGlzIGRlZmluZWRcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGFjY2Vzc1Rva2VuIC0gVGhlIGFjY2VzcyB0b2tlbiB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlZnJlc2hUb2tlbiAtIFRoZSByZWZyZXNoIHRva2VuIHRvIHVzZSAoT3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBhdXRoZW50aWNhdGVXaXRoVG9rZW4oYWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbikge1xuICAgIGFzc2VydChhY2Nlc3NUb2tlbiwgJ01pc3NpbmcgYGFjY2Vzc1Rva2VuYCcpO1xuICAgIC8vIFN0b3JlIGFjY2VzcyB0b2tlblxuICAgIHRoaXMuX3N0b3JlLnNldCgnYWNjZXNzX3Rva2VuJywgYWNjZXNzVG9rZW4pO1xuICAgIC8vIFN0b3JlIHJlZnJlc2ggdG9rZW4gKG9yIGNsZWFyIGlmIHVuZGVmaW5lZClcbiAgICBpZiAocmVmcmVzaFRva2VuKSB7XG4gICAgICB0aGlzLl9zdG9yZS5zZXQoJ3JlZnJlc2hfdG9rZW4nLCByZWZyZXNoVG9rZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zdG9yZS5yZW1vdmUoJ3JlZnJlc2hfdG9rZW4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NvbnN1bWVyLnJldHJpZXZlVXNlcihhY2Nlc3NUb2tlbikuY2F0Y2goKGVycikgPT4ge1xuICAgICAgaWYgKCFyZWZyZXNoVG9rZW4gfHwgZXJyLm5hbWUgIT09ICdpbnZhbGlkX3Rva2VuJykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICAgIC8vIFRyeSB0byByZWZyZXNoIHRoZSB0b2tlbnMgaWYgdGhlIGVycm9yIGlzIG9mIGBpbnZhbGlkX3Rva2VuYFxuICAgICAgcmV0dXJuIHRoaXMuX2NvbnN1bWVyLnJlZnJlc2hUb2tlbihyZWZyZXNoVG9rZW4pLnRoZW4oKG5ld1Rva2VucykgPT4ge1xuICAgICAgICAvLyBTdG9yZSBuZXcgdG9rZW5zXG4gICAgICAgIHRoaXMuX3N0b3JlLnNldCgnYWNjZXNzX3Rva2VuJywgbmV3VG9rZW5zLmFjY2Vzc190b2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JlLnNldCgncmVmcmVzaF90b2tlbicsIG5ld1Rva2Vucy5yZWZyZXNoX3Rva2VuKTtcbiAgICAgICAgLy8gUmV0cmlldmUgdXNlciB3aXRoIG5ldyB0b2tlblxuICAgICAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIucmV0cmlldmVVc2VyKG5ld1Rva2Vucy5hY2Nlc3NfdG9rZW4pO1xuICAgICAgfSk7XG4gICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5fYmVhcmVyID0gYWNjZXNzVG9rZW47XG4gICAgICB0aGlzLl9pZCA9IGRhdGEuaWQ7XG4gICAgICB0aGlzLl9wdWJsaXNoZXJJZCA9IGRhdGEucHVibGlzaGVyX2lkO1xuICAgICAgdGhpcy5fZW1haWwgPSBkYXRhLmVtYWlsO1xuICAgICAgdGhpcy5fZmlyc3ROYW1lID0gZGF0YS5maXJzdF9uYW1lO1xuICAgICAgdGhpcy5fbGFzdE5hbWUgPSBkYXRhLmxhc3RfbmFtZTtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSBmYWxzZTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBtZXNzYWdlOiAnQXV0aGVudGljYXRlZCBVc2VyJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsdXNoZXMgc3RvcmVkIHRva2VucyBmb3IgVXNlciAobG9nb3V0KVxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgZmx1c2goKSB7XG4gICAgdGhpcy5fYmVhcmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2lkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3B1Ymxpc2hlcklkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2ZpcnN0TmFtZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9sYXN0TmFtZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9lbWFpbCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9pc0RpcnR5ID0gZmFsc2U7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3JlLnJlbW92ZSgnYWNjZXNzX3Rva2VuJywgJ3JlZnJlc2hfdG9rZW4nKS50aGVuKCgpID0+IFByb21pc2UucmVzb2x2ZSh7XG4gICAgICBtZXNzYWdlOiAnRmx1c2hlZCBVc2VyIGRhdGEnLFxuICAgIH0pKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlcjtcbiIsImNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuY29uc3QgcXMgPSByZXF1aXJlKCdxcycpO1xuY29uc3QgQ2xpZW50ID0gcmVxdWlyZSgnLi4vbW9kZWxzL2NsaWVudCcpO1xuY29uc3QgUHJvZHVjdGlvbkFQSSA9IHJlcXVpcmUoJy4uL2FwaScpLlByb2R1Y3Rpb247XG5jb25zdCBTYW5kYm94QVBJID0gcmVxdWlyZSgnLi4vYXBpJykuU2FuZGJveDtcbmNvbnN0IGV4dHJhY3RFcnJvck1lc3NhZ2UgPSByZXF1aXJlKCcuLi91dGlscycpLmV4dHJhY3RFcnJvck1lc3NhZ2U7XG5cbi8qKlxuICogQGNsYXNzIENvbnN1bWVyXG4gKi9cbmNsYXNzIENvbnN1bWVyIHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgQ29uc3VtZXJcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgQ2xpZW50IGluc3RhbmNlIHRvIHVzZVxuICAgKiBAcGFyYW0ge0FQSS5Qcm9kdWN0aW9ufEFQSS5TYW5kYm94fSBhcGkgLSBUaGUgYXBpIHRvIHVzZSBmb3IgZmV0Y2hpbmcgZGF0YVxuICAgKiBAcmV0dXJuIHtDb25zdW1lcn1cbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNsaWVudCwgYXBpKSB7XG4gICAgYXNzZXJ0KGNsaWVudCBpbnN0YW5jZW9mIENsaWVudCwgJ2BjbGllbnRgIHNob3VsZCBiZSBpbnN0YW5jZSBvZiBDbGllbnQnKTtcbiAgICBhc3NlcnQoYXBpIGluc3RhbmNlb2YgUHJvZHVjdGlvbkFQSSB8fCBhcGkgaW5zdGFuY2VvZiBTYW5kYm94QVBJLCAnYGFwaWAgc2hvdWxkIGJlIGluc3RhbmNlIG9mIEFQSS5Qcm9kdWN0aW9uIG9yIEFQSS5TYW5kYm94Jyk7XG4gICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuX2FwaSA9IGFwaTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGRhdGEgZnJvbSBBUElcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlc291cmNlIC0gVGhlIHJlc291cmNlIHRvIGZldGNoIGZyb21cbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWQgLSBUaGUgcGF5bG9hZCB0byBwYXNzXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBfcmVxdWVzdChyZXNvdXJjZSwgcGF5bG9hZCkge1xuICAgIHJldHVybiB0aGlzLl9hcGkuaW52b2tlKHJlc291cmNlLCBwYXlsb2FkKS50aGVuKChyZXMpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhdHVzLCBib2R5IH0gPSByZXM7XG4gICAgICBpZiAocGFyc2VJbnQoc3RhdHVzLCAxMCkgPj0gNDAwKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGV4dHJhY3RFcnJvck1lc3NhZ2UoYm9keSkpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShib2R5KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdG9rZW4gZnJvbSBhIHVzZXJuYW1lLXBhc3N3b3JkIGNvbWJpbmF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VybmFtZSAtIFRoZSB1c2VybmFtZSB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIHBhc3N3b3JkIHRvIHVzZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmV0cmlldmVUb2tlbih1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICBjb25zdCBncmFudF90eXBlID0gJ3Bhc3N3b3JkJztcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgndG9rZW4nLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IHRoaXMuX2Zvcm1FbmNvZGUoe1xuICAgICAgICB1c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIGdyYW50X3R5cGUsXG4gICAgICAgIGNsaWVudF9pZDogdGhpcy5fY2xpZW50LmlkLFxuICAgICAgICBjbGllbnRfc2VjcmV0OiB0aGlzLl9jbGllbnQuc2VjcmV0LFxuICAgICAgfSksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHJlbmV3ZWQgdG9rZW5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlZnJlc2hUb2tlbiAtIFRoZSByZWZyZXNoIHRva2VuIHRvIHVzZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmVmcmVzaFRva2VuKHJlZnJlc2hUb2tlbikge1xuICAgIGNvbnN0IGdyYW50X3R5cGUgPSAncmVmcmVzaF90b2tlbic7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3Rva2VuJywge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiB0aGlzLl9mb3JtRW5jb2RlKHtcbiAgICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgICBncmFudF90eXBlLFxuICAgICAgICBjbGllbnRfaWQ6IHRoaXMuX2NsaWVudC5pZCxcbiAgICAgICAgY2xpZW50X3NlY3JldDogdGhpcy5fY2xpZW50LnNlY3JldCxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSB1cmwgZW5jb2RlZCBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iaiAtIE9iamVjdCB0byBzdHJpbmdpZnlcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKlxuICAgKi9cbiAgX2Zvcm1FbmNvZGUob2JqKSB7XG4gICAgcmV0dXJuIHFzLnN0cmluZ2lmeShvYmopO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBqc29uIGVuY29kZWQgc3RyaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogLSBPYmplY3QgdG8gc3RyaW5naWZ5XG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICpcbiAgICovXG4gIF9qc29uRW5jb2RlKG9iaikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVXNlclxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwgdG8gdXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSBwYXNzd29yZCB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpcnN0TmFtZSAtIFRoZSBmaXJzdCBuYW1lIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFzdE5hbWUgLSBUaGUgbGFzdCBuYW1lIHRvIHVzZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgY3JlYXRlVXNlcihlbWFpbCwgcGFzc3dvcmQsIGZpcnN0TmFtZSwgbGFzdE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgndXNlcnMnLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiB0aGlzLl9qc29uRW5jb2RlKHtcbiAgICAgICAgZW1haWwsXG4gICAgICAgIHBhc3N3b3JkLFxuICAgICAgICBmaXJzdF9uYW1lOiBmaXJzdE5hbWUsXG4gICAgICAgIGxhc3RfbmFtZTogbGFzdE5hbWUsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaXZlcyBhIFVzZXJcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIC0gVGhlIGBCZWFyZXJgIHRva2VuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICByZXRyaWV2ZVVzZXIodG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgndXNlcnMvbWUnLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gLFxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgfSxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhIFVzZXJcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJJZCAtIFRoZSBVc2VyIGlkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiAtIFRoZSBgQmVhcmVyYCB0b2tlblxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5maXJzdE5hbWUgLSBUaGUgZmlyc3QgYW1lIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5sYXN0TmFtZSAtIFRoZSBsYXN0IG5hbWUgdG8gdXNlXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICB1cGRhdGVVc2VyKHVzZXJJZCwgdG9rZW4sIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdChgdXNlcnMvJHt1c2VySWR9YCwge1xuICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiB0aGlzLl9qc29uRW5jb2RlKHtcbiAgICAgICAgZmlyc3RfbmFtZTogb3B0aW9ucy5maXJzdE5hbWUsXG4gICAgICAgIGxhc3RfbmFtZTogb3B0aW9ucy5sYXN0TmFtZSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3RzIGZvciBhIHBhc3N3b3JkIHJlc2V0XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCB0byBmb3J3YXJkIHRoZSByZXNldCB0b2tlbiB0b1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmVxdWVzdFBhc3N3b3JkUmVzZXQoZW1haWwpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgncGFzc3dvcmRzJywge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICB9LFxuICAgICAgYm9keTogdGhpcy5fanNvbkVuY29kZSh7XG4gICAgICAgIGVtYWlsLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHBhc3N3b3JkXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiAtIFRoZSByZXNldCB0b2tlbiB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIG5ldyBwYXNzd29yZFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmVzZXRQYXNzd29yZCh0b2tlbiwgcGFzc3dvcmQpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdChgcGFzc3dvcmRzLyR7dG9rZW59YCwge1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiB0aGlzLl9qc29uRW5jb2RlKHtcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uc3VtZXI7XG4iLCJjb25zdCBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcbmNvbnN0IENyb3NzU3RvcmFnZUNsaWVudCA9IHJlcXVpcmUoJ2Nyb3NzLXN0b3JhZ2UnKS5Dcm9zc1N0b3JhZ2VDbGllbnQ7XG5cbi8qKlxuICogV3JhcHBlciBhcm91bmQgYENyb3NzU3RvcmFnZUNsaWVudGBcbiAqXG4gKiBAY2xhc3MgSHViU3RvcmFnZUNsaWVudFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vemVuZGVzay9jcm9zcy1zdG9yYWdlXG4gKlxuICovXG5jbGFzcyBIdWJTdG9yYWdlQ2xpZW50IHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgSHViU3RvcmFnZUNsaWVudFxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiAtIFRoZSBkb21haW4gdW5kZXIgd2hpY2ggYWxsIHZhbHVlcyB3aWxsIGJlIGF0dGFjaGVkXG4gICAqIEBwYXJhbSB7Q2xhc3N9IENyb3NzU3RvcmFnZUNsaWVudENsYXNzIC0gVGhlIENyb3NzU3RvcmFnZUNsaWVudCBjbGFzcyB0byBiZSBpbnN0YW50aWF0ZWQgKERlZmF1bHRzIHRvIENyb3NzU3RvcmFnZUNsaWVudClcbiAgICogQHJldHVybiB7SHViU3RvcmFnZUNsaWVudH1cbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKGlmcmFtZUh1YiwgQ3Jvc3NTdG9yYWdlQ2xpZW50Q2xhc3MgPSBDcm9zc1N0b3JhZ2VDbGllbnQpIHtcbiAgICBhc3NlcnQoaWZyYW1lSHViLCAnTWlzc2luZyBgaWZyYW1lSHViYCcpO1xuICAgIHRoaXMuX2lmcmFtZUh1YiA9IGlmcmFtZUh1YjtcbiAgICB0aGlzLl9Dcm9zc1N0b3JhZ2VDbGllbnRDbGFzcyA9IENyb3NzU3RvcmFnZUNsaWVudENsYXNzO1xuICAgIHRoaXMuX2luc3RhbmNlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgb2YgQ3Jvc3NTdG9yYWdlQ2xpZW50Lm9uQ29ubmVjdCgpO1xuICAgKiBDcm9zc1N0b3JhZ2VDbGllbnQgaW5qZWN0cyBhbiBpZnJhbWUgaW4gdGhlIERPTSwgc28gd2UgbmVlZFxuICAgKiB0byBlbnN1cmUgdGhhdCB0aGUgaW5zZXJ0aW9uIGhhcHBlbnMgT05MWSB3aGVuIGFuIGV2ZW50IGlzIHRyaWdnZXJlZFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgb25Db25uZWN0KCkge1xuICAgIGlmICghdGhpcy5faW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IHRoaXMuX0Nyb3NzU3RvcmFnZUNsaWVudENsYXNzKHRoaXMuX2lmcmFtZUh1Yik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZS5vbkNvbm5lY3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIG9mIENyb3NzU3RvcmFnZUNsaWVudC5nZXQoKTtcbiAgICpcbiAgICogQHBhcmFtIHtBcmd1bWVudHN9IHJlc3RcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGdldCguLi5yZXN0KSB7XG4gICAgcmV0dXJuIHRoaXMub25Db25uZWN0KCkudGhlbigoKSA9PiB0aGlzLl9pbnN0YW5jZS5nZXQoLi4ucmVzdCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgb2YgQ3Jvc3NTdG9yYWdlQ2xpZW50LnNldCgpO1xuICAgKlxuICAgKiBAcGFyYW0ge0FyZ3VtZW50c30gcmVzdFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgc2V0KC4uLnJlc3QpIHtcbiAgICByZXR1cm4gdGhpcy5vbkNvbm5lY3QoKS50aGVuKCgpID0+IHRoaXMuX2luc3RhbmNlLnNldCguLi5yZXN0KSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBvZiBDcm9zc1N0b3JhZ2VDbGllbnQuZGVsKCk7XG4gICAqXG4gICAqIEBwYXJhbSB7QXJndW1lbnRzfSByZXN0XG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBkZWwoLi4ucmVzdCkge1xuICAgIHJldHVybiB0aGlzLm9uQ29ubmVjdCgpLnRoZW4oKCkgPT4gdGhpcy5faW5zdGFuY2UuZGVsKC4uLnJlc3QpKTtcbiAgfVxuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIdWJTdG9yYWdlQ2xpZW50O1xuIiwiY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5jb25zdCBVc2VyID0gcmVxdWlyZSgnLi4vbW9kZWxzL3VzZXInKTtcbmNvbnN0IFN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZScpO1xuY29uc3QgcmVkaXJlY3RUb1VSTCA9IHJlcXVpcmUoJy4uL3V0aWxzJykucmVkaXJlY3RUb1VSTDtcbmNvbnN0IGV4dHJhY3RMb2dpblRva2VuRnJvbVVSTCA9IHJlcXVpcmUoJy4uL3V0aWxzJykuZXh0cmFjdExvZ2luVG9rZW5Gcm9tVVJMO1xuY29uc3QgcmV0cmlldmVVUkwgPSByZXF1aXJlKCcuLi91dGlscycpLnJldHJpZXZlVVJMO1xuXG4vKipcbiAqIEBjbGFzcyBSZWRpcmVjdG9yXG4gKi9cbmNsYXNzIFJlZGlyZWN0b3Ige1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBSZWRpcmVjdG9yXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZSB0byB1c2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVkaXJlY3RGbiAtIFRoZSByZWRpcmVjdCBmdW5jdGlvbiB0byB1c2UuIERlZmF1bHRzIHRvIGBVdGlscy5yZWRpcmVjdFRvVVJMYFxuICAgKiBAcmV0dXJuIHtSZWRpcmVjdG9yfVxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3Ioc3RvcmUsIHVzZXIsIHJlZGlyZWN0Rm4gPSByZWRpcmVjdFRvVVJMLCByZXRyaWV2ZVVSTEZuID0gcmV0cmlldmVVUkwpIHtcbiAgICBhc3NlcnQoc3RvcmUgaW5zdGFuY2VvZiBTdG9yZSwgJ2BzdG9yZWAgc2hvdWxkIGJlIGluc3RhbmNlIG9mIFN0b3JlJyk7XG4gICAgYXNzZXJ0KHVzZXIgaW5zdGFuY2VvZiBVc2VyLCAnYHN0b3JlYCBzaG91bGQgYmUgaW5zdGFuY2Ugb2YgU3RvcmUnKTtcbiAgICB0aGlzLl9zdG9yZSA9IHN0b3JlO1xuICAgIHRoaXMuX3VzZXIgPSB1c2VyO1xuICAgIHRoaXMuX3JlZGlyZWN0Rm4gPSByZWRpcmVjdEZuO1xuICAgIHRoaXMuX3JldHJpZXZlVVJMRm4gPSByZXRyaWV2ZVVSTEZuO1xuICB9XG5cbiAgLyoqXG4gICAgICogUmVkaXJlY3RzIHRvICBmb3IgYSBwYXNzd29yZCByZXNldFxuICAgICAqICAtIEFkZHMgbG9naW5Ub2tlbiBwYXJhbSB0byBxdWVyeSBpZiBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgY3Jvc3Mgc3RvcmFnZSBzdXBwb3J0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0VXJsIC0gVGhlIFVSTCB0byByZWRpcmVjdCB0b1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBsb2dpblRva2VuIC0gVGhlIGxvZ2luIHRva2VuIHRvIHVzZSAob3B0aW9uYWwpXG4gICAgICpcbiAgICAgKi9cbiAgYXV0aGVudGljYXRlZFJlZGlyZWN0KHRhcmdldFVybCwgbG9naW5Ub2tlbikge1xuICAgIGlmICh0aGlzLl9zdG9yZS5zdXBwb3J0c0Nyb3NzU3RvcmFnZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVkaXJlY3RGbih0YXJnZXRVcmwpO1xuICAgIH1cbiAgICBjb25zdCBwb3N0Zml4ID0gKH50YXJnZXRVcmwuaW5kZXhPZignPycpKVxuICAgICAgPyAnJidcbiAgICAgIDogJz8nO1xuICAgIGNvbnN0IHRva2VuID0gbG9naW5Ub2tlbiB8fCBleHRyYWN0TG9naW5Ub2tlbkZyb21VUkwodGhpcy5fcmV0cmlldmVVUkxGbigpKSB8fCB0aGlzLl91c2VyLmJlYXJlcjtcbiAgICByZXR1cm4gdGhpcy5fcmVkaXJlY3RGbihgJHt0YXJnZXRVcmx9JHtwb3N0Zml4fWxvZ2luVG9rZW49JHt0b2tlbn1gKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVkaXJlY3RvcjtcbiIsImNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuY29uc3QgSHViU3RvcmFnZUNsaWVudCA9IHJlcXVpcmUoJy4vaHViLXN0b3JhZ2UtY2xpZW50Jyk7XG5jb25zdCByZXRyaWV2ZUJyb3dzZXJOYW1lID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5yZXRyaWV2ZUJyb3dzZXJOYW1lO1xuY29uc3QgZXh0cmFjdExvZ2luVG9rZW5Gcm9tVVJMID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5leHRyYWN0TG9naW5Ub2tlbkZyb21VUkw7XG5jb25zdCByZXRyaWV2ZVVSTCA9IHJlcXVpcmUoJy4uL3V0aWxzJykucmV0cmlldmVVUkw7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBicm93c2VyIHN1cHBvcnRzIGNyb3NzIHN0b3JhZ2VcbiAqIEBpZ25vcmVcbiAqL1xuY29uc3Qgc3VwcG9ydHNDcm9zc1N0b3JhZ2UgPSAocmV0cmlldmVCcm93c2VyTmFtZSgpICE9PSAnU2FmYXJpJyk7XG5cbi8qKlxuICogQGNsYXNzIFN0b3JlXG4gKi9cbmNsYXNzIFN0b3JlIHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgU3RvcmVcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gLSBUaGUgZG9tYWluIHVuZGVyIHdoaWNoIGFsbCB2YWx1ZXMgd2lsbCBiZSBhdHRhY2hlZFxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWZyYW1lSHViIC0gVGhlIGlmcmFtZSBVUkwgd2hlcmUgYWxsIHRoZSB2YWx1ZXMgd2lsbCBiZSBhdHRhY2hlZFxuICAgKiBAcGFyYW0ge09iamVjdH0gaWZyYW1lSHViIC0gVGhlIGlmcmFtZSBVUkwgd2hlcmUgYWxsIHRoZSB2YWx1ZXMgd2lsbCBiZSBhdHRhY2hlZFxuICAgKiBAcGFyYW0ge0NsYXNzfSBTdG9yYWdlQ2xpZW50Q2xhc3MgLSBUaGUgQ3Jvc3NTdG9yYWdlQ2xpZW50IENsYXNzIHRvIGJlIGluc3RhbnRpYXRlZFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzQ3Jvc3NTdG9yYWdlQXZhaWxhYmxlIC0gRmxhZiB0aGF0IGRldGVybWluZXMgaWYgY3Jvc3Mgc3RvcmFnZSBjYW5iIGJlIHVzZWQgb3Igbm90XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHJldHJpZXZlVVJMRm4gLSBUaGUgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjdXJyZW50IFVSTFxuICAgKiBAcmV0dXJuIHtTdG9yZX1cbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKGRvbWFpbiwgaWZyYW1lSHViLCBIdWJTdG9yYWdlQ2xpZW50Q2xhc3MgPSBIdWJTdG9yYWdlQ2xpZW50LCBpc0Nyb3NzU3RvcmFnZUF2YWlsYWJsZSA9IHN1cHBvcnRzQ3Jvc3NTdG9yYWdlLCByZXRyaWV2ZVVSTEZuID0gcmV0cmlldmVVUkwpIHtcbiAgICBhc3NlcnQoZG9tYWluLCAnTWlzc2luZyBgZG9tYWluYCcpO1xuICAgIGFzc2VydChpZnJhbWVIdWIsICdNaXNzaW5nIGBpZnJhbWVIdWJgJyk7XG4gICAgdGhpcy5fZG9tYWluID0gZG9tYWluO1xuICAgIHRoaXMuX2lmcmFtZUh1YiA9IGlmcmFtZUh1YjtcbiAgICB0aGlzLl9odWJTdG9yYWdlID0gbmV3IEh1YlN0b3JhZ2VDbGllbnRDbGFzcyhpZnJhbWVIdWIpO1xuICAgIHRoaXMuX2lzQ3Jvc3NTdG9yYWdlQXZhaWxhYmxlID0gaXNDcm9zc1N0b3JhZ2VBdmFpbGFibGU7XG4gICAgdGhpcy5fcmV0cmlldmVVUkxGbiA9IHJldHJpZXZlVVJMRm47XG4gIH1cblxuICAvKipcbiAgICogTm9ybWFsaXplcyBrZXkgYmFzZWQgb24gZG9tYWluXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLSBUaGUga2V5IHRvIHVzZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBub3JtYWxpemVkIGtleVxuICAgKlxuICAgKi9cbiAgX25vcm1hbGl6ZUtleShrZXkpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5fZG9tYWlufV8ke2tleX1gO1xuICB9XG5cbiAgLyoqXG4gICAqIERldHJtaW5lcyBpZiBTdG9yZSBzdXBwb3J0cyBjcm9zcyBzdG9yYWdlXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IHZhbHVlXG4gICAqXG4gICAqL1xuICBzdXBwb3J0c0Nyb3NzU3RvcmFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNDcm9zc1N0b3JhZ2VBdmFpbGFibGU7XG4gIH1cblxuICAvKipcbiAgICogUmV0aWV2ZXMgdG9rZW5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIHJldHJpdmVUb2tlbigpIHtcbiAgICBpZiAodGhpcy5faXNDcm9zc1N0b3JhZ2VBdmFpbGFibGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldCgnYWNjZXNzX3Rva2VuJyk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZXh0cmFjdExvZ2luVG9rZW5Gcm9tVVJMKHRoaXMuX3JldHJpZXZlVVJMRm4oKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdmFsdWUgZm9yIGEga2V5XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLSBUaGUga2V5IHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgLSBUaGUgdmFsdWUgdG8gc2V0XG4gICAqXG4gICAqL1xuICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9odWJTdG9yYWdlLnNldCh0aGlzLl9ub3JtYWxpemVLZXkoa2V5KSwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdmFsdWUgZm9yIGEgc3RvcmVkIGtleVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gVGhlIGtleSB0byB1c2VcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKlxuICAgKi9cbiAgZ2V0KGtleSkge1xuICAgIHJldHVybiB0aGlzLl9odWJTdG9yYWdlLmdldCh0aGlzLl9ub3JtYWxpemVLZXkoa2V5KSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBvbmUgb3IgbXVsdGlwbGUgdmFsdWUgcGFpciBpZiB0aGV5IGV4aXN0c1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0ga2V5cyAtIFRoZSBrZXkocykgdG8gdXNlXG4gICAqXG4gICAqL1xuICByZW1vdmUoLi4ua2V5cykge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRLZXlzID0ga2V5cy5tYXAoa2V5ID0+IHRoaXMuX25vcm1hbGl6ZUtleShrZXkpKTtcbiAgICByZXR1cm4gdGhpcy5faHViU3RvcmFnZS5kZWwoLi4ubm9ybWFsaXplZEtleXMpO1xuICB9XG5cbn1cbm1vZHVsZS5leHBvcnRzID0gU3RvcmU7XG4iLCJjb25zdCBib3dzZXIgPSByZXF1aXJlKCdib3dzZXInKTtcblxuLyoqXG4gKiBAbmFtZXNwYWNlIFV0aWxzXG4gKi9cbi8qKlxuICogR2VuZXJhdGVzIGEgcmFuZG9tIHN0cmluZ1xuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl4IC0gVGhlIHJhZGl4IHRvIHVzZS4gRGVmYXVsdHMgdG8gYDE4YFxuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDE4KS5zbGljZSgyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMuZ2VuZXJhdGVSYW5kb21TdHJpbmcgPSBnZW5lcmF0ZVJhbmRvbVN0cmluZztcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSByYW5kb20gVVVJRFxuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21VVUlEKCkge1xuICBjb25zdCBiYXNlID0gYCR7Z2VuZXJhdGVSYW5kb21TdHJpbmcoKX0ke2dlbmVyYXRlUmFuZG9tU3RyaW5nKCl9YDtcbiAgcmV0dXJuIGAke2Jhc2Uuc3Vic3RyaW5nKDAsIDgpfS0ke2Jhc2Uuc3Vic3RyaW5nKDksIDEzKX0tJHtiYXNlLnN1YnN0cmluZygxNCwgMTgpfS0ke2Jhc2Uuc3Vic3RyaW5nKDE5LCAyMyl9LSR7YmFzZS5zdWJzdHJpbmcoMjQsIDM2KX1gO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5nZW5lcmF0ZVJhbmRvbVVVSUQgPSBnZW5lcmF0ZVJhbmRvbVVVSUQ7XG5cbi8qKlxuICogU3RyaXBzIEJlYXJlciBmcm9tIEF1dGhvcml6YXRpb24gaGVhZGVyXG4gKlxuICogQG1lbWJlcm9mIFV0aWxzXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVyIC0gVGhlIEF1dGhvcml6YXRpb24gaGVhZGVyIHRvIHN0cmlwXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKlxuICovXG5mdW5jdGlvbiBzdHJpcEJlYXJlcihoZWFkZXIpIHtcbiAgcmV0dXJuIGAke2hlYWRlcn1gLnJlcGxhY2UoJ0JlYXJlcicsICcnKS50cmltKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzLnN0cmlwQmVhcmVyID0gc3RyaXBCZWFyZXI7XG5cbi8qKlxuICogUmV0dXJucyBlcnJvciBtZXNzYWdlIGZvciBgZXJyb3JDb2RlYFxuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHBhcmFtIHtTdHJpbmd9IGJvZHkgLSBUaGUgYGJvZHlgIHJlc3BvbnNlIHRvIHBhcnNlXG4gKiBAcGFyYW0ge1N0cmluZ30gYm9keS5lcnJvciAtIFRoZSBlcnJvciBjb2RlIHRvIHVzZSBmb3IgbWFwcGluZ1xuICogQHBhcmFtIHtTdHJpbmd9IGJvZHkuZXJyb3JfZGVzY3JpcHRpb24gLSBUaGUgb3B0aW9uYWwgZXJyb3IgZGVzY3JpcHRpb24gdG8gc2hvd1xuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xuXG5jb25zdCBleHRyYWN0RXJyb3JNZXNzYWdlID0gKGJvZHkpID0+IHtcbiAgc3dpdGNoIChib2R5LmVycm9yKSB7XG4gICAgY2FzZSAndmFsaWRhdGlvbl9mYWlsZWQnOlxuICAgICAgcmV0dXJuIGBWYWxpZGF0aW9uIGZhaWxlZDogJHtib2R5LmVycm9yX2Rlc2NyaXB0aW9ufWA7XG4gICAgY2FzZSAnbm90X2ZvdW5kJzpcbiAgICAgIHJldHVybiAnTm90IGZvdW5kJztcbiAgICBjYXNlICdmb3JiaWRkZW5fcmVzb3VyY2UnOlxuICAgICAgcmV0dXJuICdGb3JiaWRkZW4gcmVzb3VyY2UnO1xuICAgIGNhc2UgJ2FjY2Vzc19kZW5pZWQnOlxuICAgICAgcmV0dXJuICdUaGUgcmVzb3VyY2Ugb3duZXIgb3IgYXV0aG9yaXphdGlvbiBzZXJ2ZXIgZGVuaWVkIHRoZSByZXF1ZXN0JztcbiAgICBjYXNlICd1bnN1cHBvcnRlZF9ncmFudF90eXBlJzpcbiAgICAgIHJldHVybiAnVGhlIGF1dGhvcml6YXRpb24gZ3JhbnQgdHlwZSBpcyBub3Qgc3VwcG9ydGVkJztcbiAgICBjYXNlICdpbnZhbGlkX2dyYW50JzpcbiAgICAgIHJldHVybiAnSW52YWxpZCBjcmVkZW50aWFscyc7XG4gICAgY2FzZSAndW5hdXRob3JpemVkX3JlcXVlc3QnOlxuICAgICAgcmV0dXJuICdVbmF1dGhvcml6ZWQgcmVxdWVzdCc7XG4gICAgY2FzZSAndW5hdXRob3JpemVkX2NsaWVudCc6XG4gICAgICByZXR1cm4gJ1RoZSBhdXRoZW50aWNhdGVkIGNsaWVudCBpcyBub3QgYXV0aG9yaXplZCc7XG4gICAgY2FzZSAnaW52YWxpZF90b2tlbic6XG4gICAgICByZXR1cm4gJ1RoZSBhY2Nlc3MgdG9rZW4gcHJvdmlkZWQgaXMgZXhwaXJlZCwgcmV2b2tlZCwgbWFsZm9ybWVkLCBvciBpbnZhbGlkJztcbiAgICBjYXNlICdpbnZhbGlkX3Njb3BlJzpcbiAgICAgIHJldHVybiAnVGhlIHJlcXVlc3RlZCBzY29wZSBpcyBpbnZhbGlkLCB1bmtub3duLCBvciBtYWxmb3JtZWQnO1xuICAgIGNhc2UgJ2ludmFsaWRfY2xpZW50JzpcbiAgICAgIHJldHVybiAnQ2xpZW50IGF1dGhlbnRpY2F0aW9uIGZhaWxlZCc7XG4gICAgY2FzZSAnaW52YWxpZF9yZXF1ZXN0JzpcbiAgICAgIHJldHVybiAnVGhlIHJlcXVlc3QgaXMgbWlzc2luZyBhIHJlcXVpcmVkIHBhcmFtZXRlcic7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnVW5leHBlY3RlZCBlcnJvcic7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmV4dHJhY3RFcnJvck1lc3NhZ2UgPSBleHRyYWN0RXJyb3JNZXNzYWdlO1xuXG4vKipcbiAqIFZhbGlkYXRlcyBhIHBhc3N3b3JkIHBhaXIgYWdhaW5zIHRoZSBmb2xsb3dpbmcgcnVsZXM6XG4gKiAtIFBhc3N3b3JkIGNhbm5vdCBjb250YWluIHNwYWNlc1xuICogLSBQYXNzd29yZCBtdXN0IGNvbnRhaW4gYm90aCBudW1iZXJzIGFuZCBjaGFyYWN0ZXJzXG4gKiAtIFBhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgOCBjaGFyYWN0ZXJzIGxvbmdcbiAqXG4gKiBAbWVtYmVyb2YgVXRpbHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSBgcGFzc3dvcmRgIHRvIHZhbGlkYXRlXG4gKiBAcmV0dXJuIHtPYmplY3R9IENvbnRhaW5zIGBpc1ZhbGlkIHtCb29sZWFufWAgYW5kIGBtZXNzYWdlIHtTdHJpbmd9YFxuICpcbiAqL1xuY29uc3QgdmFsaWRhdGVQYXNzd29yZCA9IChwYXNzd29yZCkgPT4ge1xuICBjb25zdCBjb250YWluc1NwYWNlcyA9IC9cXHMvaS50ZXN0KHBhc3N3b3JkKTtcbiAgY29uc3QgY29udGFpbnNOdW1iZXIgPSAvXFxkL2kudGVzdChwYXNzd29yZCk7XG4gIGNvbnN0IGNvbnRhaW5zQ2hhcmFjdGVycyA9IC9bYS16XS9pLnRlc3QocGFzc3dvcmQpO1xuICBpZiAoY29udGFpbnNTcGFjZXMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogJ1Bhc3N3b3JkIGNhbm5vdCBjb250YWluIHNwYWNlcycsXG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICB9O1xuICB9XG4gIGlmICghY29udGFpbnNOdW1iZXIgfHwgIWNvbnRhaW5zQ2hhcmFjdGVycykge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiAnUGFzc3dvcmQgbXVzdCBjb250YWluIGJvdGggbnVtYmVycyBhbmQgY2hhcmFjdGVycycsXG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICB9O1xuICB9XG4gIGlmIChwYXNzd29yZC5sZW5ndGggPCA4KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6ICdQYXNzd29yZCBtdXN0IGJlIGF0IGxlYXN0IDggY2hhcmFjdGVycyBsb25nJyxcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBpc1ZhbGlkOiB0cnVlLFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMudmFsaWRhdGVQYXNzd29yZCA9IHZhbGlkYXRlUGFzc3dvcmQ7XG5cbi8qKlxuICogRXh0cmFjdHMgbG9naW5Ub2tlbiBmcm9tIFVSTFxuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHJldHVybiB7U3RyaW5nfSB1cmwgLSBUaGUgVVJMIHRvXG4gKlxuICovXG5jb25zdCBleHRyYWN0TG9naW5Ub2tlbkZyb21VUkwgPSAodXJsKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyYW1zID0gZGVjb2RlVVJJQ29tcG9uZW50KHVybCkuc3BsaXQoJz8nKVsxXS5zcGxpdCgnJicpO1xuICAgIHJldHVybiBwYXJhbXMuZmluZChwYXJhbSA9PiBTdHJpbmcocGFyYW0pLmluY2x1ZGVzKCdsb2dpblRva2VuJykpLnJlcGxhY2UoJ2xvZ2luVG9rZW49JywgJycpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmV4dHJhY3RMb2dpblRva2VuRnJvbVVSTCA9IGV4dHJhY3RMb2dpblRva2VuRnJvbVVSTDtcblxuLyoqXG4gKiBSZXR1cm5zIGJyb3dzZXIgbmFtZVxuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHJldHVybiB7U3RyaW5nfSBuYW1lIC0gVGhlIGJyb3dzZXIgbmFtZVxuICpcbiAqL1xuY29uc3QgcmV0cmlldmVCcm93c2VyTmFtZSA9ICgobG9va3VwTWFwID0gYm93c2VyKSA9PiBsb29rdXBNYXAubmFtZSk7XG5cbm1vZHVsZS5leHBvcnRzLnJldHJpZXZlQnJvd3Nlck5hbWUgPSByZXRyaWV2ZUJyb3dzZXJOYW1lO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXG4vKipcbiAqIFdyYXBwZXIgYXJvdW5kIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKClcbiAqXG4gKiBAbWVtYmVyb2YgVXRpbHNcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIHJlZGlyZWN0IHRvXG4gKiBAcmV0dXJuIHtWb2lkfVxuICpcbiAqL1xuY29uc3QgcmVkaXJlY3RUb1VSTCA9ICh1cmwpID0+IHtcbiAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UodXJsKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnJlZGlyZWN0VG9VUkwgPSByZWRpcmVjdFRvVVJMO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXG4vKipcbiAqIFdyYXBwZXIgYXJvdW5kIHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gKlxuICogQG1lbWJlcm9mIFV0aWxzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKlxuICovXG5jb25zdCByZXRyaWV2ZVVSTCA9ICgpID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXG5tb2R1bGUuZXhwb3J0cy5yZXRyaWV2ZVVSTCA9IHJldHJpZXZlVVJMO1xuIl19
