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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9wbGF0b2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzVDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzFDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN0QyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMxQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM1QyxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN4RCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNoRCxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDdkQsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDdkQsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDekQsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQzs7Ozs7O0FBTS9ELElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxlQUFlLENBQUM7Ozs7O0FBS2pFLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7Ozs7QUFLbEMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOzs7OztBQU14QixJQUFNLG9CQUFvQixHQUFHLENBQUMsU0FBUyxTQUFTLEdBQUc7Ozs7Ozs7O0FBUWpE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QUFDN0IsYUFBTyxRQUFRLENBQUM7S0FDakI7Ozs7Ozs7OztBQVNELFNBQUssRUFBQSxpQkFBRztBQUNOLGVBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNuQixFQUVGLENBQUM7Q0FDSCxDQUFBLEVBQUcsQ0FBQzs7OztBQUlMLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUNqQixRQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixHQUFHLG9CQUFvQixDQUFDO0NBQzNEOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsb0JBQW9CLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZy9kZWZhdWx0Jyk7XG5jb25zdCBTdG9yZSA9IHJlcXVpcmUoJy4vc2VydmljZXMvc3RvcmUnKTtcbmNvbnN0IFVzZXIgPSByZXF1aXJlKCcuL21vZGVscy91c2VyJyk7XG5jb25zdCBDbGllbnQgPSByZXF1aXJlKCcuL21vZGVscy9jbGllbnQnKTtcbmNvbnN0IFNlc3Npb24gPSByZXF1aXJlKCcuL21vZGVscy9zZXNzaW9uJyk7XG5jb25zdCBBdXRoZW50aWNhdG9yID0gcmVxdWlyZSgnLi9tb2RlbHMvYXV0aGVudGljYXRvcicpO1xuY29uc3QgQ29uc3VtZXIgPSByZXF1aXJlKCcuL3NlcnZpY2VzL2NvbnN1bWVyJyk7XG5jb25zdCBBUEkgPSByZXF1aXJlKCcuL2FwaScpO1xuY29uc3QgU2FuZGJveERhdGFiYXNlID0gcmVxdWlyZSgnLi9kYXRhYmFzZXMvc2FuZGJveCcpO1xuY29uc3QgVXNlckZpeHR1cmVzID0gcmVxdWlyZSgnLi4vZml4dHVyZXMvdXNlcnMuanNvbicpO1xuY29uc3QgVG9rZW5GaXh0dXJlcyA9IHJlcXVpcmUoJy4uL2ZpeHR1cmVzL3Rva2Vucy5qc29uJyk7XG5jb25zdCBQYXNzd29yZEZpeHR1cmVzID0gcmVxdWlyZSgnLi4vZml4dHVyZXMvcGFzc3dvcmRzLmpzb24nKTtcblxuLyoqXG4gKiBDcm9zc1N0b3JhZ2VIdWJcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3plbmRlc2svY3Jvc3Mtc3RvcmFnZVxuICovXG5jb25zdCBDcm9zc1N0b3JhZ2VIdWIgPSByZXF1aXJlKCdjcm9zcy1zdG9yYWdlJykuQ3Jvc3NTdG9yYWdlSHViO1xuXG4vKipcbiAqIEdsb2JhbCBwb2x5ZmlsbCBmb3Ige1Byb21pc2V9XG4gKi9cbnJlcXVpcmUoJ2VzNi1wcm9taXNlJykucG9seWZpbGwoKTtcblxuLyoqXG4gKiBHbG9iYWwgcG9seWZpbGwgZm9yIHtmZXRjaH1cbiAqL1xucmVxdWlyZSgnd2hhdHdnLWZldGNoJyk7XG5cblxuLyoqXG4gKiBAbmFtZXNwYWNlIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gKi9cbmNvbnN0IEF1dGhlbnRpY2F0aW9uQ2xpZW50ID0gKGZ1bmN0aW9uIGltbWVkaWF0ZSgpIHtcbiAgLyoqXG4gICAqIEVudmlyb25tZW50IEVOVU1cbiAgICpcbiAgICogQGVudW1cbiAgICogcmV0dXJuIHtPYmplY3R9XG4gICAqXG4gICAqL1xuICBjb25zdCBFTlYgPSBPYmplY3QuZnJlZXplKHtcbiAgICBQcm9kdWN0aW9uOiBTeW1ib2woJ1Byb2R1Y3Rpb24nKSxcbiAgICBTYW5kYm94OiBTeW1ib2woJ1NhbmRib3gnKSxcbiAgfSk7XG5cbiAgLyoqXG4gICAqIENhY2hlZCBpbnN0YW5jZXNcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybiB7TWFwfVxuICAgKlxuICAgKi9cbiAgY29uc3QgaW5zdGFuY2VzID0gbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIEFQSSBpbnN0YWNlcyBmb3IgYW4gRU5WIHNldHVwXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0aHJvd3Mge0Vycm9yfVxuICAgKiBAcGFyYW0ge0VOVn0gZW52aXJvbm1lbnQgLSBUaGUgZW52aXJvbm1lbnQgdG8gc2V0IC0gRGVmYXVsdHMgdG8gYFByb2R1Y3Rpb25gXG4gICAqIEByZXR1cm4ge1NhbmRib3hBUEl8UHJvZHVjdGlvbkFQSX1cbiAgICpcbiAgICovXG4gIGZ1bmN0aW9uIGdldEFQSUZvcihlbnZpcm9ubWVudCwgaG9zdCA9IGNvbmZpZy5hcGkuaG9zdCkge1xuICAgIGlmIChlbnZpcm9ubWVudCA9PT0gRU5WLlByb2R1Y3Rpb24pIHtcbiAgICAgIHJldHVybiBuZXcgQVBJLlByb2R1Y3Rpb24oaG9zdCk7XG4gICAgfVxuICAgIGlmIChlbnZpcm9ubWVudCA9PT0gRU5WLlNhbmRib3gpIHtcbiAgICAgIHJldHVybiBuZXcgQVBJLlNhbmRib3gobmV3IFNhbmRib3hEYXRhYmFzZShVc2VyRml4dHVyZXMsIFRva2VuRml4dHVyZXMsIFBhc3N3b3JkRml4dHVyZXMpKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGBlbnZpcm9ubWVudGAgcGFzc2VkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGFuIEF1dGhlbnRpY2F0aW9uQ2xpZW50IGluc3RhbmNlXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRJZCAtIFRoZSBjbGllbnQgaWQgdG8gc2V0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRTZWNyZXQgLSBUaGUgY2xpZW50IHNlY3JldFxuICAgKiBAcGFyYW0ge0VOVn0gZW52aXJvbm1lbnQgLSBUaGUgZW52aXJvbm1lbnQgdG8gc2V0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsb2dpbkhvc3QgLSBUaGUgbG9naW4gaG9zdCBVUkxcbiAgICogQHBhcmFtIHtTdHJpbmd9IGFwaUhvc3QgLSBUaGUgQVBJIGhvc3RcbiAgICogQHBhcmFtIHtTdG9yZX0gc3RvcmUgLSBUaGUgU3RvcmUgaW5zdGFuY2VcbiAgICogQHJldHVybiB7QXV0aGVudGljYXRvcn1cbiAgICpcbiAgICovXG4gIGZ1bmN0aW9uIGdlbmVyYXRlSW5zdGFuY2UoY2xpZW50SWQsIGNsaWVudFNlY3JldCwgZW52aXJvbm1lbnQgPSBFTlYuUHJvZHVjdGlvbiwgbG9naW5Ib3N0ID0gY29uZmlnLmxvZ2luLmhvc3QsIGFwaUhvc3QsIHN0b3JlKSB7XG4gICAgY29uc3QgYXBpID0gZ2V0QVBJRm9yKGVudmlyb25tZW50LCBhcGlIb3N0KTtcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KGNsaWVudElkLCBjbGllbnRTZWNyZXQpO1xuICAgIGNvbnN0IGNvbnN1bWVyID0gbmV3IENvbnN1bWVyKGNsaWVudCwgYXBpKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIoc3RvcmUsIGNvbnN1bWVyKTtcbiAgICBjb25zdCBzZXNzaW9uID0gbmV3IFNlc3Npb24odXNlciwgbG9naW5Ib3N0KTtcbiAgICBjb25zdCBhdXRoZW50aWNhdG9yID0gbmV3IEF1dGhlbnRpY2F0b3IoY29uc3VtZXIpO1xuICAgIHJldHVybiB7XG4gICAgICB1c2VyLFxuICAgICAgc2Vzc2lvbixcbiAgICAgIGF1dGhlbnRpY2F0b3IsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG5cbiAgICAvKipcbiAgICAgKiBFbnZpcm9ubWVudCBlbnVtXG4gICAgICpcbiAgICAgKiBAZW51bVxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqXG4gICAgICovXG4gICAgRW52aXJvbm1lbnQ6IEVOVixcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIENyb3NzU3RvcmFnZUh1YlxuICAgICAqXG4gICAgICogQGVudW1cbiAgICAgKiBAbWVtYmVyb2YgQXV0aGVudGljYXRpb25DbGllbnRcbiAgICAgKlxuICAgICAqL1xuICAgIGluaXRTdG9yYWdlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBDcm9zc1N0b3JhZ2VIdWIuaW5pdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBBdXRoZW50aWNhdG9yIGluc3RhbmNlIGZvciBhIGNsaWVudElkLCBjbGllbnRTZWNyZXQgY29tYmluYXRpb25cbiAgICAgKlxuICAgICAqIEBmdW5jdGlvbiBnZXRJbnN0YW5jZUZvclxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmNsaWVudElkIC0gVGhlIENsaWVudCBpZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuY2xpZW50U2VjcmV0IC0gVGhlIENsaWVudCBzZWNyZXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmxvZ2luSG9zdCAtIFRoZSBsb2dpbiBob3N0IFVSTFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuYXBpSG9zdCAtIFRoZSBBUEkgaG9zdFxuICAgICAqIEBwYXJhbSB7U3RvcmV9IHBhcmFtcy5zdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7RU5WfSBwYXJhbXMuZW52aXJvbm1lbnQgLSBUaGUgZW52aXJvbm1lbnQgdG8gc2V0XG4gICAgICogQHJldHVybiB7QXV0aGVudGljYXRvcn1cbiAgICAgKlxuICAgICAqL1xuICAgIGdldEluc3RhbmNlRm9yKHsgY2xpZW50SWQsIGNsaWVudFNlY3JldCwgZW52aXJvbm1lbnQsIGxvZ2luSG9zdCwgYXBpSG9zdCwgc3RvcmUgPSBuZXcgU3RvcmUoY29uZmlnLnN0b3JlLmRvbWFpbiwgY29uZmlnLnN0b3JlLmlmcmFtZUh1YikgfSkge1xuICAgICAgY29uc3Qga2V5ID0gYCR7Y2xpZW50SWR9LSR7Y2xpZW50U2VjcmV0fWA7XG4gICAgICAvLyBSZXR1cm4gY2FjaGVkIGluc3RhbmNlXG4gICAgICBpZiAoaW5zdGFuY2VzLmhhcyhrZXkpKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZXMuZ2V0KGtleSk7XG4gICAgICB9XG4gICAgICAvLyBHZW5lcmF0ZSAmIGNhY2hlIG5ldyBpbnN0YW5jZVxuICAgICAgY29uc3QgaW5zdGFuY2UgPSBnZW5lcmF0ZUluc3RhbmNlKGNsaWVudElkLCBjbGllbnRTZWNyZXQsIGVudmlyb25tZW50LCBsb2dpbkhvc3QsIGFwaUhvc3QsIHN0b3JlKTtcbiAgICAgIGluc3RhbmNlcy5zZXQoa2V5LCBpbnN0YW5jZSk7XG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZsdXNoZXMgY2FjaGVkIGluc3RhbmNlc1xuICAgICAqXG4gICAgICogQGZ1bmN0aW9uIHJlc2V0XG4gICAgICogQG1lbWJlcm9mIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gICAgICpcbiAgICAgKi9cbiAgICByZXNldCgpIHtcbiAgICAgIGluc3RhbmNlcy5jbGVhcigpO1xuICAgIH0sXG5cbiAgfTtcbn0pKCk7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cbmlmIChnbG9iYWwud2luZG93KSB7XG4gIGdsb2JhbC53aW5kb3cuQXV0aGVudGljYXRpb25DbGllbnQgPSBBdXRoZW50aWNhdGlvbkNsaWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoZW50aWNhdGlvbkNsaWVudDtcbiJdfQ==
},{"../config/default":2,"../fixtures/passwords.json":3,"../fixtures/tokens.json":4,"../fixtures/users.json":5,"./api":16,"./databases/sandbox":19,"./models/authenticator":20,"./models/client":21,"./models/session":22,"./models/user":23,"./services/consumer":24,"./services/store":26,"cross-storage":10,"es6-promise":11,"whatwg-fetch":15}],2:[function(require,module,exports){
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

},{"util/":14}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
module.exports = {
  CrossStorageClient: require('./client.js'),
  CrossStorageHub:    require('./hub.js')
};

},{"./client.js":8,"./hub.js":9}],11:[function(require,module,exports){
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
},{"_process":7}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],14:[function(require,module,exports){
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
},{"./support/isBuffer":13,"_process":7,"inherits":12}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
"use strict";

module.exports.Production = require("./production");
module.exports.Sandbox = require("./sandbox");

},{"./production":17,"./sandbox":18}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"../utils":27}],19:[function(require,module,exports){
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

},{"../utils":27}],20:[function(require,module,exports){
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

},{"../services/consumer":24,"../utils":27,"assert":6}],21:[function(require,module,exports){
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

},{"assert":6}],22:[function(require,module,exports){
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

},{"../models/user":23,"../utils":27,"assert":6}],23:[function(require,module,exports){
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

},{"../services/consumer":24,"../services/store":26,"../utils":27,"assert":6}],24:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assert = require("assert");
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
        return this._request("token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded" },
          body: "username=" + username + "&password=" + password + "&grant_type=password&client_id=" + this._client.id + "&client_secret=" + this._client.secret });
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
        return this._request("token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded" },
          body: "refresh_token=" + refreshToken + "&grant_type=refresh_token&client_id=" + this._client.id + "&client_secret=" + this._client.secret });
      })
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
          body: JSON.stringify({
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
          body: JSON.stringify({
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
          body: JSON.stringify({
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
          body: JSON.stringify({
            password: password }) });
      }
    }
  });

  return Consumer;
})();

module.exports = Consumer;

},{"../api":16,"../models/client":21,"../utils":27,"assert":6}],25:[function(require,module,exports){
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

},{"assert":6,"cross-storage":10}],26:[function(require,module,exports){
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

},{"./storage-client":25,"assert":6}],27:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCIvVXNlcnMvcGxhdG9nZWUvRGVza3RvcC9kZXYvcmVwb3MvYXV0aGVudGljYXRpb24tY2xpZW50L2NvbmZpZy9kZWZhdWx0LmpzIiwiZml4dHVyZXMvcGFzc3dvcmRzLmpzb24iLCJmaXh0dXJlcy90b2tlbnMuanNvbiIsImZpeHR1cmVzL3VzZXJzLmpzb24iLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvY3Jvc3Mtc3RvcmFnZS9saWIvY2xpZW50LmpzIiwibm9kZV9tb2R1bGVzL2Nyb3NzLXN0b3JhZ2UvbGliL2h1Yi5qcyIsIm5vZGVfbW9kdWxlcy9jcm9zcy1zdG9yYWdlL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2VzNi1wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCJub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzIiwiL1VzZXJzL3BsYXRvZ2VlL0Rlc2t0b3AvZGV2L3JlcG9zL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvYXBpL2luZGV4LmpzIiwiL1VzZXJzL3BsYXRvZ2VlL0Rlc2t0b3AvZGV2L3JlcG9zL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvYXBpL3Byb2R1Y3Rpb24uanMiLCIvVXNlcnMvcGxhdG9nZWUvRGVza3RvcC9kZXYvcmVwb3MvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9hcGkvc2FuZGJveC5qcyIsIi9Vc2Vycy9wbGF0b2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL2RhdGFiYXNlcy9zYW5kYm94LmpzIiwiL1VzZXJzL3BsYXRvZ2VlL0Rlc2t0b3AvZGV2L3JlcG9zL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvbW9kZWxzL2F1dGhlbnRpY2F0b3IuanMiLCIvVXNlcnMvcGxhdG9nZWUvRGVza3RvcC9kZXYvcmVwb3MvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9tb2RlbHMvY2xpZW50LmpzIiwiL1VzZXJzL3BsYXRvZ2VlL0Rlc2t0b3AvZGV2L3JlcG9zL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvbW9kZWxzL3Nlc3Npb24uanMiLCIvVXNlcnMvcGxhdG9nZWUvRGVza3RvcC9kZXYvcmVwb3MvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9tb2RlbHMvdXNlci5qcyIsIi9Vc2Vycy9wbGF0b2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL3NlcnZpY2VzL2NvbnN1bWVyLmpzIiwiL1VzZXJzL3BsYXRvZ2VlL0Rlc2t0b3AvZGV2L3JlcG9zL2F1dGhlbnRpY2F0aW9uLWNsaWVudC9zcmMvc2VydmljZXMvc3RvcmFnZS1jbGllbnQuanMiLCIvVXNlcnMvcGxhdG9nZWUvRGVza3RvcC9kZXYvcmVwb3MvYXV0aGVudGljYXRpb24tY2xpZW50L3NyYy9zZXJ2aWNlcy9zdG9yZS5qcyIsIi9Vc2Vycy9wbGF0b2dlZS9EZXNrdG9wL2Rldi9yZXBvcy9hdXRoZW50aWNhdGlvbi1jbGllbnQvc3JjL3V0aWxzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3hMQSxNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YsS0FBRyxFQUFFO0FBQ0gsUUFBSSxFQUFFLHNCQUFzQixFQUM3QjtBQUNELE9BQUssRUFBRTtBQUNMLFFBQUksRUFBRSx1QkFBdUIsRUFDOUI7QUFDRCxPQUFLLEVBQUU7QUFDTCxVQUFNLEVBQUUsV0FBVztBQUNuQixhQUFTLEVBQUUsMkJBQTJCLEVBQ3ZDLEVBQ0YsQ0FBQzs7O0FDWEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdm9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUNmLENBQUM7R0FDSDtBQUNELFNBQU87QUFDTCxXQUFPLEVBQUUsSUFBSSxFQUNkLENBQUM7Q0FDSCxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7Ozs7Ozs7Ozs7OztBQVluRCxJQUFNLGFBQWEsR0FBRyxVQUFDLEdBQUcsRUFBSztBQUM3QixRQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUM5QixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQzs7Ozs7Ozs7Ozs7QUFXN0MsSUFBTSxXQUFXLEdBQUc7U0FBTSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUk7Q0FBQSxDQUFDOztBQUUvQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnL2RlZmF1bHRcIik7XG52YXIgU3RvcmUgPSByZXF1aXJlKFwiLi9zZXJ2aWNlcy9zdG9yZVwiKTtcbnZhciBVc2VyID0gcmVxdWlyZShcIi4vbW9kZWxzL3VzZXJcIik7XG52YXIgQ2xpZW50ID0gcmVxdWlyZShcIi4vbW9kZWxzL2NsaWVudFwiKTtcbnZhciBTZXNzaW9uID0gcmVxdWlyZShcIi4vbW9kZWxzL3Nlc3Npb25cIik7XG52YXIgQXV0aGVudGljYXRvciA9IHJlcXVpcmUoXCIuL21vZGVscy9hdXRoZW50aWNhdG9yXCIpO1xudmFyIENvbnN1bWVyID0gcmVxdWlyZShcIi4vc2VydmljZXMvY29uc3VtZXJcIik7XG52YXIgQVBJID0gcmVxdWlyZShcIi4vYXBpXCIpO1xudmFyIFNhbmRib3hEYXRhYmFzZSA9IHJlcXVpcmUoXCIuL2RhdGFiYXNlcy9zYW5kYm94XCIpO1xudmFyIFVzZXJGaXh0dXJlcyA9IHJlcXVpcmUoXCIuLi9maXh0dXJlcy91c2Vycy5qc29uXCIpO1xudmFyIFRva2VuRml4dHVyZXMgPSByZXF1aXJlKFwiLi4vZml4dHVyZXMvdG9rZW5zLmpzb25cIik7XG52YXIgUGFzc3dvcmRGaXh0dXJlcyA9IHJlcXVpcmUoXCIuLi9maXh0dXJlcy9wYXNzd29yZHMuanNvblwiKTtcblxuLyoqXG4gKiBDcm9zc1N0b3JhZ2VIdWJcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3plbmRlc2svY3Jvc3Mtc3RvcmFnZVxuICovXG52YXIgQ3Jvc3NTdG9yYWdlSHViID0gcmVxdWlyZShcImNyb3NzLXN0b3JhZ2VcIikuQ3Jvc3NTdG9yYWdlSHViO1xuXG4vKipcbiAqIEdsb2JhbCBwb2x5ZmlsbCBmb3Ige1Byb21pc2V9XG4gKi9cbnJlcXVpcmUoXCJlczYtcHJvbWlzZVwiKS5wb2x5ZmlsbCgpO1xuXG4vKipcbiAqIEdsb2JhbCBwb2x5ZmlsbCBmb3Ige2ZldGNofVxuICovXG5yZXF1aXJlKFwid2hhdHdnLWZldGNoXCIpO1xuXG4vKipcbiAqIEBuYW1lc3BhY2UgQXV0aGVudGljYXRpb25DbGllbnRcbiAqL1xudmFyIEF1dGhlbnRpY2F0aW9uQ2xpZW50ID0gKGZ1bmN0aW9uIGltbWVkaWF0ZSgpIHtcbiAgLyoqXG4gICAqIEVudmlyb25tZW50IEVOVU1cbiAgICpcbiAgICogQGVudW1cbiAgICogcmV0dXJuIHtPYmplY3R9XG4gICAqXG4gICAqL1xuICB2YXIgRU5WID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgUHJvZHVjdGlvbjogU3ltYm9sKFwiUHJvZHVjdGlvblwiKSxcbiAgICBTYW5kYm94OiBTeW1ib2woXCJTYW5kYm94XCIpIH0pO1xuXG4gIC8qKlxuICAgKiBDYWNoZWQgaW5zdGFuY2VzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge01hcH1cbiAgICpcbiAgICovXG4gIHZhciBpbnN0YW5jZXMgPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gQVBJIGluc3RhY2VzIGZvciBhbiBFTlYgc2V0dXBcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHRocm93cyB7RXJyb3J9XG4gICAqIEBwYXJhbSB7RU5WfSBlbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXQgLSBEZWZhdWx0cyB0byBgUHJvZHVjdGlvbmBcbiAgICogQHJldHVybiB7U2FuZGJveEFQSXxQcm9kdWN0aW9uQVBJfVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0QVBJRm9yKGVudmlyb25tZW50KSB7XG4gICAgdmFyIGhvc3QgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGNvbmZpZy5hcGkuaG9zdCA6IGFyZ3VtZW50c1sxXTtcblxuICAgIGlmIChlbnZpcm9ubWVudCA9PT0gRU5WLlByb2R1Y3Rpb24pIHtcbiAgICAgIHJldHVybiBuZXcgQVBJLlByb2R1Y3Rpb24oaG9zdCk7XG4gICAgfVxuICAgIGlmIChlbnZpcm9ubWVudCA9PT0gRU5WLlNhbmRib3gpIHtcbiAgICAgIHJldHVybiBuZXcgQVBJLlNhbmRib3gobmV3IFNhbmRib3hEYXRhYmFzZShVc2VyRml4dHVyZXMsIFRva2VuRml4dHVyZXMsIFBhc3N3b3JkRml4dHVyZXMpKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBgZW52aXJvbm1lbnRgIHBhc3NlZFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYW4gQXV0aGVudGljYXRpb25DbGllbnQgaW5zdGFuY2VcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudElkIC0gVGhlIGNsaWVudCBpZCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFNlY3JldCAtIFRoZSBjbGllbnQgc2VjcmV0XG4gICAqIEBwYXJhbSB7RU5WfSBlbnZpcm9ubWVudCAtIFRoZSBlbnZpcm9ubWVudCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGxvZ2luSG9zdCAtIFRoZSBsb2dpbiBob3N0IFVSTFxuICAgKiBAcGFyYW0ge1N0cmluZ30gYXBpSG9zdCAtIFRoZSBBUEkgaG9zdFxuICAgKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZVxuICAgKiBAcmV0dXJuIHtBdXRoZW50aWNhdG9yfVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gZ2VuZXJhdGVJbnN0YW5jZShjbGllbnRJZCwgY2xpZW50U2VjcmV0LCBfeCwgX3gyLCBhcGlIb3N0LCBzdG9yZSkge1xuICAgIHZhciBlbnZpcm9ubWVudCA9IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gRU5WLlByb2R1Y3Rpb24gOiBhcmd1bWVudHNbMl07XG4gICAgdmFyIGxvZ2luSG9zdCA9IGFyZ3VtZW50c1szXSA9PT0gdW5kZWZpbmVkID8gY29uZmlnLmxvZ2luLmhvc3QgOiBhcmd1bWVudHNbM107XG5cbiAgICB2YXIgYXBpID0gZ2V0QVBJRm9yKGVudmlyb25tZW50LCBhcGlIb3N0KTtcbiAgICB2YXIgY2xpZW50ID0gbmV3IENsaWVudChjbGllbnRJZCwgY2xpZW50U2VjcmV0KTtcbiAgICB2YXIgY29uc3VtZXIgPSBuZXcgQ29uc3VtZXIoY2xpZW50LCBhcGkpO1xuICAgIHZhciB1c2VyID0gbmV3IFVzZXIoc3RvcmUsIGNvbnN1bWVyKTtcbiAgICB2YXIgc2Vzc2lvbiA9IG5ldyBTZXNzaW9uKHVzZXIsIGxvZ2luSG9zdCk7XG4gICAgdmFyIGF1dGhlbnRpY2F0b3IgPSBuZXcgQXV0aGVudGljYXRvcihjb25zdW1lcik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVzZXI6IHVzZXIsXG4gICAgICBzZXNzaW9uOiBzZXNzaW9uLFxuICAgICAgYXV0aGVudGljYXRvcjogYXV0aGVudGljYXRvciB9O1xuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIC8qKlxuICAgICAqIEVudmlyb25tZW50IGVudW1cbiAgICAgKlxuICAgICAqIEBlbnVtXG4gICAgICogQG1lbWJlcm9mIEF1dGhlbnRpY2F0aW9uQ2xpZW50XG4gICAgICpcbiAgICAgKi9cbiAgICBFbnZpcm9ubWVudDogRU5WLFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgQ3Jvc3NTdG9yYWdlSHViXG4gICAgICpcbiAgICAgKiBAZW51bVxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqXG4gICAgICovXG4gICAgaW5pdFN0b3JhZ2U6IGZ1bmN0aW9uIGluaXRTdG9yYWdlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBDcm9zc1N0b3JhZ2VIdWIuaW5pdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBBdXRoZW50aWNhdG9yIGluc3RhbmNlIGZvciBhIGNsaWVudElkLCBjbGllbnRTZWNyZXQgY29tYmluYXRpb25cbiAgICAgKlxuICAgICAqIEBmdW5jdGlvbiBnZXRJbnN0YW5jZUZvclxuICAgICAqIEBtZW1iZXJvZiBBdXRoZW50aWNhdGlvbkNsaWVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmNsaWVudElkIC0gVGhlIENsaWVudCBpZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuY2xpZW50U2VjcmV0IC0gVGhlIENsaWVudCBzZWNyZXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmxvZ2luSG9zdCAtIFRoZSBsb2dpbiBob3N0IFVSTFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuYXBpSG9zdCAtIFRoZSBBUEkgaG9zdFxuICAgICAqIEBwYXJhbSB7U3RvcmV9IHBhcmFtcy5zdG9yZSAtIFRoZSBTdG9yZSBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7RU5WfSBwYXJhbXMuZW52aXJvbm1lbnQgLSBUaGUgZW52aXJvbm1lbnQgdG8gc2V0XG4gICAgICogQHJldHVybiB7QXV0aGVudGljYXRvcn1cbiAgICAgKlxuICAgICAqL1xuICAgIGdldEluc3RhbmNlRm9yOiBmdW5jdGlvbiBnZXRJbnN0YW5jZUZvcihfcmVmKSB7XG4gICAgICB2YXIgY2xpZW50SWQgPSBfcmVmLmNsaWVudElkO1xuICAgICAgdmFyIGNsaWVudFNlY3JldCA9IF9yZWYuY2xpZW50U2VjcmV0O1xuICAgICAgdmFyIGVudmlyb25tZW50ID0gX3JlZi5lbnZpcm9ubWVudDtcbiAgICAgIHZhciBsb2dpbkhvc3QgPSBfcmVmLmxvZ2luSG9zdDtcbiAgICAgIHZhciBhcGlIb3N0ID0gX3JlZi5hcGlIb3N0O1xuICAgICAgdmFyIF9yZWYkc3RvcmUgPSBfcmVmLnN0b3JlO1xuICAgICAgdmFyIHN0b3JlID0gX3JlZiRzdG9yZSA9PT0gdW5kZWZpbmVkID8gbmV3IFN0b3JlKGNvbmZpZy5zdG9yZS5kb21haW4sIGNvbmZpZy5zdG9yZS5pZnJhbWVIdWIpIDogX3JlZiRzdG9yZTtcblxuICAgICAgdmFyIGtleSA9IFwiXCIgKyBjbGllbnRJZCArIFwiLVwiICsgY2xpZW50U2VjcmV0O1xuICAgICAgLy8gUmV0dXJuIGNhY2hlZCBpbnN0YW5jZVxuICAgICAgaWYgKGluc3RhbmNlcy5oYXMoa2V5KSkge1xuICAgICAgICByZXR1cm4gaW5zdGFuY2VzLmdldChrZXkpO1xuICAgICAgfVxuICAgICAgLy8gR2VuZXJhdGUgJiBjYWNoZSBuZXcgaW5zdGFuY2VcbiAgICAgIHZhciBpbnN0YW5jZSA9IGdlbmVyYXRlSW5zdGFuY2UoY2xpZW50SWQsIGNsaWVudFNlY3JldCwgZW52aXJvbm1lbnQsIGxvZ2luSG9zdCwgYXBpSG9zdCwgc3RvcmUpO1xuICAgICAgaW5zdGFuY2VzLnNldChrZXksIGluc3RhbmNlKTtcbiAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmx1c2hlcyBjYWNoZWQgaW5zdGFuY2VzXG4gICAgICpcbiAgICAgKiBAZnVuY3Rpb24gcmVzZXRcbiAgICAgKiBAbWVtYmVyb2YgQXV0aGVudGljYXRpb25DbGllbnRcbiAgICAgKlxuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgIGluc3RhbmNlcy5jbGVhcigpO1xuICAgIH0gfTtcbn0pKCk7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cbmlmIChnbG9iYWwud2luZG93KSB7XG4gIGdsb2JhbC53aW5kb3cuQXV0aGVudGljYXRpb25DbGllbnQgPSBBdXRoZW50aWNhdGlvbkNsaWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoZW50aWNhdGlvbkNsaWVudDtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OXdiR0YwYjJkbFpTOUVaWE5yZEc5d0wyUmxkaTl5WlhCdmN5OWhkWFJvWlc1MGFXTmhkR2x2YmkxamJHbGxiblF2YzNKakwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096dEJRVUZCTEVsQlFVMHNUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4RFFVRkRPMEZCUXpWRExFbEJRVTBzUzBGQlN5eEhRVUZITEU5QlFVOHNRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZETzBGQlF6RkRMRWxCUVUwc1NVRkJTU3hIUVVGSExFOUJRVThzUTBGQlF5eGxRVUZsTEVOQlFVTXNRMEZCUXp0QlFVTjBReXhKUVVGTkxFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6dEJRVU14UXl4SlFVRk5MRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1zYTBKQlFXdENMRU5CUVVNc1EwRkJRenRCUVVNMVF5eEpRVUZOTEdGQlFXRXNSMEZCUnl4UFFVRlBMRU5CUVVNc2QwSkJRWGRDTEVOQlFVTXNRMEZCUXp0QlFVTjRSQ3hKUVVGTkxGRkJRVkVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUTBGQlF6dEJRVU5vUkN4SlFVRk5MRWRCUVVjc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZETjBJc1NVRkJUU3hsUVVGbExFZEJRVWNzVDBGQlR5eERRVUZETEhGQ1FVRnhRaXhEUVVGRExFTkJRVU03UVVGRGRrUXNTVUZCVFN4WlFVRlpMRWRCUVVjc1QwRkJUeXhEUVVGRExIZENRVUYzUWl4RFFVRkRMRU5CUVVNN1FVRkRka1FzU1VGQlRTeGhRVUZoTEVkQlFVY3NUMEZCVHl4RFFVRkRMSGxDUVVGNVFpeERRVUZETEVOQlFVTTdRVUZEZWtRc1NVRkJUU3huUWtGQlowSXNSMEZCUnl4UFFVRlBMRU5CUVVNc05FSkJRVFJDTEVOQlFVTXNRMEZCUXpzN096czdPMEZCVFM5RUxFbEJRVTBzWlVGQlpTeEhRVUZITEU5QlFVOHNRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJReXhsUVVGbExFTkJRVU03T3pzN08wRkJTMnBGTEU5QlFVOHNRMEZCUXl4aFFVRmhMRU5CUVVNc1EwRkJReXhSUVVGUkxFVkJRVVVzUTBGQlF6czdPenM3UVVGTGJFTXNUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE96czdPenRCUVUxNFFpeEpRVUZOTEc5Q1FVRnZRaXhIUVVGSExFTkJRVU1zVTBGQlV5eFRRVUZUTEVkQlFVYzdPenM3T3pzN08wRkJVV3BFTEUxQlFVMHNSMEZCUnl4SFFVRkhMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU03UVVGRGVFSXNZMEZCVlN4RlFVRkZMRTFCUVUwc1EwRkJReXhaUVVGWkxFTkJRVU03UVVGRGFFTXNWMEZCVHl4RlFVRkZMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zUlVGRE0wSXNRMEZCUXl4RFFVRkRPenM3T3pzN096czdRVUZUU0N4TlFVRk5MRk5CUVZNc1IwRkJSeXhKUVVGSkxFZEJRVWNzUlVGQlJTeERRVUZET3pzN096czdPenM3T3p0QlFWYzFRaXhYUVVGVExGTkJRVk1zUTBGQlF5eFhRVUZYTEVWQlFUQkNPMUZCUVhoQ0xFbEJRVWtzWjBOQlFVY3NUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSk96dEJRVU53UkN4UlFVRkpMRmRCUVZjc1MwRkJTeXhIUVVGSExFTkJRVU1zVlVGQlZTeEZRVUZGTzBGQlEyeERMR0ZCUVU4c1NVRkJTU3hIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMHRCUTJwRE8wRkJRMFFzVVVGQlNTeFhRVUZYTEV0QlFVc3NSMEZCUnl4RFFVRkRMRTlCUVU4c1JVRkJSVHRCUVVNdlFpeGhRVUZQTEVsQlFVa3NSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxHVkJRV1VzUTBGQlF5eFpRVUZaTEVWQlFVVXNZVUZCWVN4RlFVRkZMR2RDUVVGblFpeERRVUZETEVOQlFVTXNRMEZCUXp0TFFVTTFSanRCUVVORUxGVkJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTXNPRUpCUVRoQ0xFTkJRVU1zUTBGQlF6dEhRVU5xUkRzN096czdPenM3T3pzN096czdPMEZCWlVRc1YwRkJVeXhuUWtGQlowSXNRMEZCUXl4UlFVRlJMRVZCUVVVc1dVRkJXU3hYUVVFclJDeFBRVUZQTEVWQlFVVXNTMEZCU3l4RlFVRkZPMUZCUVRkRkxGZEJRVmNzWjBOQlFVY3NSMEZCUnl4RFFVRkRMRlZCUVZVN1VVRkJSU3hUUVVGVExHZERRVUZITEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTVHM3UVVGRE0wY3NVVUZCVFN4SFFVRkhMRWRCUVVjc1UwRkJVeXhEUVVGRExGZEJRVmNzUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhSUVVGTkxFMUJRVTBzUjBGQlJ5eEpRVUZKTEUxQlFVMHNRMEZCUXl4UlFVRlJMRVZCUVVVc1dVRkJXU3hEUVVGRExFTkJRVU03UVVGRGJFUXNVVUZCVFN4UlFVRlJMRWRCUVVjc1NVRkJTU3hSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUXpORExGRkJRVTBzU1VGQlNTeEhRVUZITEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU4yUXl4UlFVRk5MRTlCUVU4c1IwRkJSeXhKUVVGSkxFOUJRVThzUTBGQlF5eEpRVUZKTEVWQlFVVXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkROME1zVVVGQlRTeGhRVUZoTEVkQlFVY3NTVUZCU1N4aFFVRmhMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UVVGRGJFUXNWMEZCVHp0QlFVTk1MRlZCUVVrc1JVRkJTaXhKUVVGSk8wRkJRMG9zWVVGQlR5eEZRVUZRTEU5QlFVODdRVUZEVUN4dFFrRkJZU3hGUVVGaUxHRkJRV0VzUlVGRFpDeERRVUZETzBkQlEwZzdPMEZCUlVRc1UwRkJUenM3T3pzN096czdPMEZCVTB3c1pVRkJWeXhGUVVGRkxFZEJRVWM3T3pzN096czdPenRCUVZOb1FpeGxRVUZYTEVWQlFVRXNjVUpCUVVNc1QwRkJUeXhGUVVGRk8wRkJRMjVDTEdGQlFVOHNaVUZCWlN4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dExRVU4wUXpzN096czdPenM3T3pzN096czdPenM3UVVGcFFrUXNhMEpCUVdNc1JVRkJRU3c0UWtGQk9FZzdWVUZCTTBnc1VVRkJVU3hSUVVGU0xGRkJRVkU3VlVGQlJTeFpRVUZaTEZGQlFWb3NXVUZCV1R0VlFVRkZMRmRCUVZjc1VVRkJXQ3hYUVVGWE8xVkJRVVVzVTBGQlV5eFJRVUZVTEZOQlFWTTdWVUZCUlN4UFFVRlBMRkZCUVZBc1QwRkJUenMwUWtGQlJTeExRVUZMTzFWQlFVd3NTMEZCU3l3NFFrRkJSeXhKUVVGSkxFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1JVRkJSU3hOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXpzN1FVRkRkRWtzVlVGQlRTeEhRVUZITEZGQlFVMHNVVUZCVVN4VFFVRkpMRmxCUVZrc1FVRkJSU3hEUVVGRE96dEJRVVV4UXl4VlFVRkpMRk5CUVZNc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVTdRVUZEZEVJc1pVRkJUeXhUUVVGVExFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMDlCUXpOQ096dEJRVVZFTEZWQlFVMHNVVUZCVVN4SFFVRkhMR2RDUVVGblFpeERRVUZETEZGQlFWRXNSVUZCUlN4WlFVRlpMRVZCUVVVc1YwRkJWeXhGUVVGRkxGTkJRVk1zUlVGQlJTeFBRVUZQTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRiRWNzWlVGQlV5eERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03UVVGRE4wSXNZVUZCVHl4UlFVRlJMRU5CUVVNN1MwRkRha0k3T3pzN096czdPenRCUVZORUxGTkJRVXNzUlVGQlFTeHBRa0ZCUnp0QlFVTk9MR1ZCUVZNc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF6dExRVU51UWl4RlFVVkdMRU5CUVVNN1EwRkRTQ3hEUVVGQkxFVkJRVWNzUTBGQlF6czdPenRCUVVsTUxFbEJRVWtzVFVGQlRTeERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTnFRaXhSUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEc5Q1FVRnZRaXhIUVVGSExHOUNRVUZ2UWl4RFFVRkRPME5CUXpORU96dEJRVVZFTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc2IwSkJRVzlDTEVOQlFVTWlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1OdmJuTjBJR052Ym1acFp5QTlJSEpsY1hWcGNtVW9KeTR1TDJOdmJtWnBaeTlrWldaaGRXeDBKeWs3WEc1amIyNXpkQ0JUZEc5eVpTQTlJSEpsY1hWcGNtVW9KeTR2YzJWeWRtbGpaWE12YzNSdmNtVW5LVHRjYm1OdmJuTjBJRlZ6WlhJZ1BTQnlaWEYxYVhKbEtDY3VMMjF2WkdWc2N5OTFjMlZ5SnlrN1hHNWpiMjV6ZENCRGJHbGxiblFnUFNCeVpYRjFhWEpsS0NjdUwyMXZaR1ZzY3k5amJHbGxiblFuS1R0Y2JtTnZibk4wSUZObGMzTnBiMjRnUFNCeVpYRjFhWEpsS0NjdUwyMXZaR1ZzY3k5elpYTnphVzl1SnlrN1hHNWpiMjV6ZENCQmRYUm9aVzUwYVdOaGRHOXlJRDBnY21WeGRXbHlaU2duTGk5dGIyUmxiSE12WVhWMGFHVnVkR2xqWVhSdmNpY3BPMXh1WTI5dWMzUWdRMjl1YzNWdFpYSWdQU0J5WlhGMWFYSmxLQ2N1TDNObGNuWnBZMlZ6TDJOdmJuTjFiV1Z5SnlrN1hHNWpiMjV6ZENCQlVFa2dQU0J5WlhGMWFYSmxLQ2N1TDJGd2FTY3BPMXh1WTI5dWMzUWdVMkZ1WkdKdmVFUmhkR0ZpWVhObElEMGdjbVZ4ZFdseVpTZ25MaTlrWVhSaFltRnpaWE12YzJGdVpHSnZlQ2NwTzF4dVkyOXVjM1FnVlhObGNrWnBlSFIxY21WeklEMGdjbVZ4ZFdseVpTZ25MaTR2Wm1sNGRIVnlaWE12ZFhObGNuTXVhbk52YmljcE8xeHVZMjl1YzNRZ1ZHOXJaVzVHYVhoMGRYSmxjeUE5SUhKbGNYVnBjbVVvSnk0dUwyWnBlSFIxY21WekwzUnZhMlZ1Y3k1cWMyOXVKeWs3WEc1amIyNXpkQ0JRWVhOemQyOXlaRVpwZUhSMWNtVnpJRDBnY21WeGRXbHlaU2duTGk0dlptbDRkSFZ5WlhNdmNHRnpjM2R2Y21SekxtcHpiMjRuS1R0Y2JseHVMeW9xWEc0Z0tpQkRjbTl6YzFOMGIzSmhaMlZJZFdKY2JpQXFJRUJ6WldVZ2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzcGxibVJsYzJzdlkzSnZjM010YzNSdmNtRm5aVnh1SUNvdlhHNWpiMjV6ZENCRGNtOXpjMU4wYjNKaFoyVklkV0lnUFNCeVpYRjFhWEpsS0NkamNtOXpjeTF6ZEc5eVlXZGxKeWt1UTNKdmMzTlRkRzl5WVdkbFNIVmlPMXh1WEc0dktpcGNiaUFxSUVkc2IySmhiQ0J3YjJ4NVptbHNiQ0JtYjNJZ2UxQnliMjFwYzJWOVhHNGdLaTljYm5KbGNYVnBjbVVvSjJWek5pMXdjbTl0YVhObEp5a3VjRzlzZVdacGJHd29LVHRjYmx4dUx5b3FYRzRnS2lCSGJHOWlZV3dnY0c5c2VXWnBiR3dnWm05eUlIdG1aWFJqYUgxY2JpQXFMMXh1Y21WeGRXbHlaU2duZDJoaGRIZG5MV1psZEdOb0p5azdYRzVjYmx4dUx5b3FYRzRnS2lCQWJtRnRaWE53WVdObElFRjFkR2hsYm5ScFkyRjBhVzl1UTJ4cFpXNTBYRzRnS2k5Y2JtTnZibk4wSUVGMWRHaGxiblJwWTJGMGFXOXVRMnhwWlc1MElEMGdLR1oxYm1OMGFXOXVJR2x0YldWa2FXRjBaU2dwSUh0Y2JpQWdMeW9xWEc0Z0lDQXFJRVZ1ZG1seWIyNXRaVzUwSUVWT1ZVMWNiaUFnSUNwY2JpQWdJQ29nUUdWdWRXMWNiaUFnSUNvZ2NtVjBkWEp1SUh0UFltcGxZM1I5WEc0Z0lDQXFYRzRnSUNBcUwxeHVJQ0JqYjI1emRDQkZUbFlnUFNCUFltcGxZM1F1Wm5KbFpYcGxLSHRjYmlBZ0lDQlFjbTlrZFdOMGFXOXVPaUJUZVcxaWIyd29KMUJ5YjJSMVkzUnBiMjRuS1N4Y2JpQWdJQ0JUWVc1a1ltOTRPaUJUZVcxaWIyd29KMU5oYm1SaWIzZ25LU3hjYmlBZ2ZTazdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFTmhZMmhsWkNCcGJuTjBZVzVqWlhOY2JpQWdJQ3BjYmlBZ0lDb2dRSEJ5YVhaaGRHVmNiaUFnSUNvZ1FISmxkSFZ5YmlCN1RXRndmVnh1SUNBZ0tseHVJQ0FnS2k5Y2JpQWdZMjl1YzNRZ2FXNXpkR0Z1WTJWeklEMGdibVYzSUUxaGNDZ3BPMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlNaWFIxY201eklHRnVJRUZRU1NCcGJuTjBZV05sY3lCbWIzSWdZVzRnUlU1V0lITmxkSFZ3WEc0Z0lDQXFYRzRnSUNBcUlFQndjbWwyWVhSbFhHNGdJQ0FxSUVCMGFISnZkM01nZTBWeWNtOXlmVnh1SUNBZ0tpQkFjR0Z5WVcwZ2UwVk9WbjBnWlc1MmFYSnZibTFsYm5RZ0xTQlVhR1VnWlc1MmFYSnZibTFsYm5RZ2RHOGdjMlYwSUMwZ1JHVm1ZWFZzZEhNZ2RHOGdZRkJ5YjJSMVkzUnBiMjVnWEc0Z0lDQXFJRUJ5WlhSMWNtNGdlMU5oYm1SaWIzaEJVRWw4VUhKdlpIVmpkR2x2YmtGUVNYMWNiaUFnSUNwY2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlHZGxkRUZRU1VadmNpaGxiblpwY205dWJXVnVkQ3dnYUc5emRDQTlJR052Ym1acFp5NWhjR2t1YUc5emRDa2dlMXh1SUNBZ0lHbG1JQ2hsYm5acGNtOXViV1Z1ZENBOVBUMGdSVTVXTGxCeWIyUjFZM1JwYjI0cElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdVpYY2dRVkJKTGxCeWIyUjFZM1JwYjI0b2FHOXpkQ2s3WEc0Z0lDQWdmVnh1SUNBZ0lHbG1JQ2hsYm5acGNtOXViV1Z1ZENBOVBUMGdSVTVXTGxOaGJtUmliM2dwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ1WlhjZ1FWQkpMbE5oYm1SaWIzZ29ibVYzSUZOaGJtUmliM2hFWVhSaFltRnpaU2hWYzJWeVJtbDRkSFZ5WlhNc0lGUnZhMlZ1Um1sNGRIVnlaWE1zSUZCaGMzTjNiM0prUm1sNGRIVnlaWE1wS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZEpiblpoYkdsa0lHQmxiblpwY205dWJXVnVkR0FnY0dGemMyVmtKeWs3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1IyVnVaWEpoZEdWeklHRnVJRUYxZEdobGJuUnBZMkYwYVc5dVEyeHBaVzUwSUdsdWMzUmhibU5sWEc0Z0lDQXFYRzRnSUNBcUlFQndjbWwyWVhSbFhHNGdJQ0FxSUVCd1lYSmhiU0I3VTNSeWFXNW5mU0JqYkdsbGJuUkpaQ0F0SUZSb1pTQmpiR2xsYm5RZ2FXUWdkRzhnYzJWMFhHNGdJQ0FxSUVCd1lYSmhiU0I3VTNSeWFXNW5mU0JqYkdsbGJuUlRaV055WlhRZ0xTQlVhR1VnWTJ4cFpXNTBJSE5sWTNKbGRGeHVJQ0FnS2lCQWNHRnlZVzBnZTBWT1ZuMGdaVzUyYVhKdmJtMWxiblFnTFNCVWFHVWdaVzUyYVhKdmJtMWxiblFnZEc4Z2MyVjBYRzRnSUNBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNCc2IyZHBia2h2YzNRZ0xTQlVhR1VnYkc5bmFXNGdhRzl6ZENCVlVreGNiaUFnSUNvZ1FIQmhjbUZ0SUh0VGRISnBibWQ5SUdGd2FVaHZjM1FnTFNCVWFHVWdRVkJKSUdodmMzUmNiaUFnSUNvZ1FIQmhjbUZ0SUh0VGRHOXlaWDBnYzNSdmNtVWdMU0JVYUdVZ1UzUnZjbVVnYVc1emRHRnVZMlZjYmlBZ0lDb2dRSEpsZEhWeWJpQjdRWFYwYUdWdWRHbGpZWFJ2Y24xY2JpQWdJQ3BjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUdkbGJtVnlZWFJsU1c1emRHRnVZMlVvWTJ4cFpXNTBTV1FzSUdOc2FXVnVkRk5sWTNKbGRDd2daVzUyYVhKdmJtMWxiblFnUFNCRlRsWXVVSEp2WkhWamRHbHZiaXdnYkc5bmFXNUliM04wSUQwZ1kyOXVabWxuTG14dloybHVMbWh2YzNRc0lHRndhVWh2YzNRc0lITjBiM0psS1NCN1hHNGdJQ0FnWTI5dWMzUWdZWEJwSUQwZ1oyVjBRVkJKUm05eUtHVnVkbWx5YjI1dFpXNTBMQ0JoY0dsSWIzTjBLVHRjYmlBZ0lDQmpiMjV6ZENCamJHbGxiblFnUFNCdVpYY2dRMnhwWlc1MEtHTnNhV1Z1ZEVsa0xDQmpiR2xsYm5SVFpXTnlaWFFwTzF4dUlDQWdJR052Ym5OMElHTnZibk4xYldWeUlEMGdibVYzSUVOdmJuTjFiV1Z5S0dOc2FXVnVkQ3dnWVhCcEtUdGNiaUFnSUNCamIyNXpkQ0IxYzJWeUlEMGdibVYzSUZWelpYSW9jM1J2Y21Vc0lHTnZibk4xYldWeUtUdGNiaUFnSUNCamIyNXpkQ0J6WlhOemFXOXVJRDBnYm1WM0lGTmxjM05wYjI0b2RYTmxjaXdnYkc5bmFXNUliM04wS1R0Y2JpQWdJQ0JqYjI1emRDQmhkWFJvWlc1MGFXTmhkRzl5SUQwZ2JtVjNJRUYxZEdobGJuUnBZMkYwYjNJb1kyOXVjM1Z0WlhJcE8xeHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0IxYzJWeUxGeHVJQ0FnSUNBZ2MyVnpjMmx2Yml4Y2JpQWdJQ0FnSUdGMWRHaGxiblJwWTJGMGIzSXNYRzRnSUNBZ2ZUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQjdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJGYm5acGNtOXViV1Z1ZENCbGJuVnRYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFaVzUxYlZ4dUlDQWdJQ0FxSUVCdFpXMWlaWEp2WmlCQmRYUm9aVzUwYVdOaGRHbHZia05zYVdWdWRGeHVJQ0FnSUNBcVhHNGdJQ0FnSUNvdlhHNGdJQ0FnUlc1MmFYSnZibTFsYm5RNklFVk9WaXhjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUVsdWFYUnBZV3hwZW1WeklFTnliM056VTNSdmNtRm5aVWgxWWx4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUdWdWRXMWNiaUFnSUNBZ0tpQkFiV1Z0WW1WeWIyWWdRWFYwYUdWdWRHbGpZWFJwYjI1RGJHbGxiblJjYmlBZ0lDQWdLbHh1SUNBZ0lDQXFMMXh1SUNBZ0lHbHVhWFJUZEc5eVlXZGxLRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQkRjbTl6YzFOMGIzSmhaMlZJZFdJdWFXNXBkQ2h2Y0hScGIyNXpLVHRjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUTNKbFlYUmxjeUJoYmlCQmRYUm9aVzUwYVdOaGRHOXlJR2x1YzNSaGJtTmxJR1p2Y2lCaElHTnNhV1Z1ZEVsa0xDQmpiR2xsYm5SVFpXTnlaWFFnWTI5dFltbHVZWFJwYjI1Y2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCbWRXNWpkR2x2YmlCblpYUkpibk4wWVc1alpVWnZjbHh1SUNBZ0lDQXFJRUJ0WlcxaVpYSnZaaUJCZFhSb1pXNTBhV05oZEdsdmJrTnNhV1Z1ZEZ4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3VDJKcVpXTjBmU0J3WVhKaGJYTmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UxTjBjbWx1WjMwZ2NHRnlZVzF6TG1Oc2FXVnVkRWxrSUMwZ1ZHaGxJRU5zYVdWdWRDQnBaRnh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdVM1J5YVc1bmZTQndZWEpoYlhNdVkyeHBaVzUwVTJWamNtVjBJQzBnVkdobElFTnNhV1Z1ZENCelpXTnlaWFJjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMU4wY21sdVozMGdjR0Z5WVcxekxteHZaMmx1U0c5emRDQXRJRlJvWlNCc2IyZHBiaUJvYjNOMElGVlNURnh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdVM1J5YVc1bmZTQndZWEpoYlhNdVlYQnBTRzl6ZENBdElGUm9aU0JCVUVrZ2FHOXpkRnh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdVM1J2Y21WOUlIQmhjbUZ0Y3k1emRHOXlaU0F0SUZSb1pTQlRkRzl5WlNCcGJuTjBZVzVqWlZ4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3UlU1V2ZTQndZWEpoYlhNdVpXNTJhWEp2Ym0xbGJuUWdMU0JVYUdVZ1pXNTJhWEp2Ym0xbGJuUWdkRzhnYzJWMFhHNGdJQ0FnSUNvZ1FISmxkSFZ5YmlCN1FYVjBhR1Z1ZEdsallYUnZjbjFjYmlBZ0lDQWdLbHh1SUNBZ0lDQXFMMXh1SUNBZ0lHZGxkRWx1YzNSaGJtTmxSbTl5S0hzZ1kyeHBaVzUwU1dRc0lHTnNhV1Z1ZEZObFkzSmxkQ3dnWlc1MmFYSnZibTFsYm5Rc0lHeHZaMmx1U0c5emRDd2dZWEJwU0c5emRDd2djM1J2Y21VZ1BTQnVaWGNnVTNSdmNtVW9ZMjl1Wm1sbkxuTjBiM0psTG1SdmJXRnBiaXdnWTI5dVptbG5Mbk4wYjNKbExtbG1jbUZ0WlVoMVlpa2dmU2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdhMlY1SUQwZ1lDUjdZMnhwWlc1MFNXUjlMU1I3WTJ4cFpXNTBVMlZqY21WMGZXQTdYRzRnSUNBZ0lDQXZMeUJTWlhSMWNtNGdZMkZqYUdWa0lHbHVjM1JoYm1ObFhHNGdJQ0FnSUNCcFppQW9hVzV6ZEdGdVkyVnpMbWhoY3loclpYa3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJwYm5OMFlXNWpaWE11WjJWMEtHdGxlU2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0F2THlCSFpXNWxjbUYwWlNBbUlHTmhZMmhsSUc1bGR5QnBibk4wWVc1alpWeHVJQ0FnSUNBZ1kyOXVjM1FnYVc1emRHRnVZMlVnUFNCblpXNWxjbUYwWlVsdWMzUmhibU5sS0dOc2FXVnVkRWxrTENCamJHbGxiblJUWldOeVpYUXNJR1Z1ZG1seWIyNXRaVzUwTENCc2IyZHBia2h2YzNRc0lHRndhVWh2YzNRc0lITjBiM0psS1R0Y2JpQWdJQ0FnSUdsdWMzUmhibU5sY3k1elpYUW9hMlY1TENCcGJuTjBZVzVqWlNrN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYVc1emRHRnVZMlU3WEc0Z0lDQWdmU3hjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUVac2RYTm9aWE1nWTJGamFHVmtJR2x1YzNSaGJtTmxjMXh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRR1oxYm1OMGFXOXVJSEpsYzJWMFhHNGdJQ0FnSUNvZ1FHMWxiV0psY205bUlFRjFkR2hsYm5ScFkyRjBhVzl1UTJ4cFpXNTBYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpOWNiaUFnSUNCeVpYTmxkQ2dwSUh0Y2JpQWdJQ0FnSUdsdWMzUmhibU5sY3k1amJHVmhjaWdwTzF4dUlDQWdJSDBzWEc1Y2JpQWdmVHRjYm4wcEtDazdYRzVjYmk4cUlHbHpkR0Z1WW5Wc0lHbG5ibTl5WlNCdVpYaDBJQ292WEc1Y2JtbG1JQ2huYkc5aVlXd3VkMmx1Wkc5M0tTQjdYRzRnSUdkc2IySmhiQzUzYVc1a2IzY3VRWFYwYUdWdWRHbGpZWFJwYjI1RGJHbGxiblFnUFNCQmRYUm9aVzUwYVdOaGRHbHZia05zYVdWdWREdGNibjFjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCQmRYUm9aVzUwYVdOaGRHbHZia05zYVdWdWREdGNiaUpkZlE9PSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBhcGk6IHtcbiAgICBob3N0OiAnLy9hdXRoLmF2b2NhcnJvdC5jb20nLFxuICB9LFxuICBsb2dpbjoge1xuICAgIGhvc3Q6ICcvL2xvZ2luLmF2b2NhcnJvdC5jb20nLFxuICB9LFxuICBzdG9yZToge1xuICAgIGRvbWFpbjogJ2F2b2NhcnJvdCcsXG4gICAgaWZyYW1lSHViOiAnLy9sb2dpbi5hdm9jYXJyb3QuY29tL2h1YicsXG4gIH0sXG59O1xuIiwibW9kdWxlLmV4cG9ydHM9W1xuICB7XG4gICAgXCJ1c2VyX2lkXCI6IFwiNDRkMmM4ZTAtNzYyYi00ZmE1LTg1NzEtMDk3YzgxYzMxMzBkXCIsXG4gICAgXCJ0b2tlblwiOiBcInlKaGJHY2llT2lKSVV6STFOaUlzSUo5blI1Y0NJNklrcFhWQ1wiXG4gIH1cbl1cbiIsIm1vZHVsZS5leHBvcnRzPVtcbiAge1xuICAgIFwidXNlcl9pZFwiOiBcIjQ0ZDJjOGUwLTc2MmItNGZhNS04NTcxLTA5N2M4MWMzMTMwZFwiLFxuICAgIFwicmVmcmVzaF90b2tlblwiOiBcImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOVwiLFxuICAgIFwiYWNjZXNzX3Rva2VuXCI6IFwicmtka0pIVkJkQ2pMSUlqc0lLNE5hbGF1eFBQOHVvNWhZOHRUTjdcIlxuICB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHtcbiAgICBcImlkXCI6IFwiNDRkMmM4ZTAtNzYyYi00ZmE1LTg1NzEtMDk3YzgxYzMxMzBkXCIsXG4gICAgXCJwdWJsaXNoZXJfaWRcIjogXCI1NWY1YzhlMC03NjJiLTRmYTUtODU3MS0xOTdjODE4MzEzMGFcIixcbiAgICBcImZpcnN0X25hbWVcIjogXCJKb2huXCIsXG4gICAgXCJsYXN0X25hbWVcIjogXCJEb2VcIixcbiAgICBcImVtYWlsXCI6IFwiam9obi5kb2VAbWFpbC5jb21cIixcbiAgICBcInBhc3N3b3JkXCI6IFwicXdlcnR5MTIzXCJcbiAgfVxuXVxuIiwiLy8gaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvVW5pdF9UZXN0aW5nLzEuMFxuLy9cbi8vIFRISVMgSVMgTk9UIFRFU1RFRCBOT1IgTElLRUxZIFRPIFdPUksgT1VUU0lERSBWOCFcbi8vXG4vLyBPcmlnaW5hbGx5IGZyb20gbmFyd2hhbC5qcyAoaHR0cDovL25hcndoYWxqcy5vcmcpXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDkgVGhvbWFzIFJvYmluc29uIDwyODBub3J0aC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvXG4vLyBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZVxuLy8gcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yXG4vLyBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHdoZW4gdXNlZCBpbiBub2RlLCB0aGlzIHdpbGwgYWN0dWFsbHkgbG9hZCB0aGUgdXRpbCBtb2R1bGUgd2UgZGVwZW5kIG9uXG4vLyB2ZXJzdXMgbG9hZGluZyB0aGUgYnVpbHRpbiB1dGlsIG1vZHVsZSBhcyBoYXBwZW5zIG90aGVyd2lzZVxuLy8gdGhpcyBpcyBhIGJ1ZyBpbiBub2RlIG1vZHVsZSBsb2FkaW5nIGFzIGZhciBhcyBJIGFtIGNvbmNlcm5lZFxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsLycpO1xuXG52YXIgcFNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8vIDEuIFRoZSBhc3NlcnQgbW9kdWxlIHByb3ZpZGVzIGZ1bmN0aW9ucyB0aGF0IHRocm93XG4vLyBBc3NlcnRpb25FcnJvcidzIHdoZW4gcGFydGljdWxhciBjb25kaXRpb25zIGFyZSBub3QgbWV0LiBUaGVcbi8vIGFzc2VydCBtb2R1bGUgbXVzdCBjb25mb3JtIHRvIHRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlLlxuXG52YXIgYXNzZXJ0ID0gbW9kdWxlLmV4cG9ydHMgPSBvaztcblxuLy8gMi4gVGhlIEFzc2VydGlvbkVycm9yIGlzIGRlZmluZWQgaW4gYXNzZXJ0LlxuLy8gbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7IG1lc3NhZ2U6IG1lc3NhZ2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWwsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IGV4cGVjdGVkIH0pXG5cbmFzc2VydC5Bc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIEFzc2VydGlvbkVycm9yKG9wdGlvbnMpIHtcbiAgdGhpcy5uYW1lID0gJ0Fzc2VydGlvbkVycm9yJztcbiAgdGhpcy5hY3R1YWwgPSBvcHRpb25zLmFjdHVhbDtcbiAgdGhpcy5leHBlY3RlZCA9IG9wdGlvbnMuZXhwZWN0ZWQ7XG4gIHRoaXMub3BlcmF0b3IgPSBvcHRpb25zLm9wZXJhdG9yO1xuICBpZiAob3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubWVzc2FnZSA9IGdldE1lc3NhZ2UodGhpcyk7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gdHJ1ZTtcbiAgfVxuICB2YXIgc3RhY2tTdGFydEZ1bmN0aW9uID0gb3B0aW9ucy5zdGFja1N0YXJ0RnVuY3Rpb24gfHwgZmFpbDtcblxuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIG5vbiB2OCBicm93c2VycyBzbyB3ZSBjYW4gaGF2ZSBhIHN0YWNrdHJhY2VcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XG4gICAgaWYgKGVyci5zdGFjaykge1xuICAgICAgdmFyIG91dCA9IGVyci5zdGFjaztcblxuICAgICAgLy8gdHJ5IHRvIHN0cmlwIHVzZWxlc3MgZnJhbWVzXG4gICAgICB2YXIgZm5fbmFtZSA9IHN0YWNrU3RhcnRGdW5jdGlvbi5uYW1lO1xuICAgICAgdmFyIGlkeCA9IG91dC5pbmRleE9mKCdcXG4nICsgZm5fbmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgLy8gb25jZSB3ZSBoYXZlIGxvY2F0ZWQgdGhlIGZ1bmN0aW9uIGZyYW1lXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgYmVmb3JlIGl0IChhbmQgaXRzIGxpbmUpXG4gICAgICAgIHZhciBuZXh0X2xpbmUgPSBvdXQuaW5kZXhPZignXFxuJywgaWR4ICsgMSk7XG4gICAgICAgIG91dCA9IG91dC5zdWJzdHJpbmcobmV4dF9saW5lICsgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhY2sgPSBvdXQ7XG4gICAgfVxuICB9XG59O1xuXG4vLyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IgaW5zdGFuY2VvZiBFcnJvclxudXRpbC5pbmhlcml0cyhhc3NlcnQuQXNzZXJ0aW9uRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkge1xuICBpZiAodXRpbC5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gJycgKyB2YWx1ZTtcbiAgfVxuICBpZiAodXRpbC5pc051bWJlcih2YWx1ZSkgJiYgKGlzTmFOKHZhbHVlKSB8fCAhaXNGaW5pdGUodmFsdWUpKSkge1xuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICB9XG4gIGlmICh1dGlsLmlzRnVuY3Rpb24odmFsdWUpIHx8IHV0aWwuaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZShzLCBuKSB7XG4gIGlmICh1dGlsLmlzU3RyaW5nKHMpKSB7XG4gICAgcmV0dXJuIHMubGVuZ3RoIDwgbiA/IHMgOiBzLnNsaWNlKDAsIG4pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldE1lc3NhZ2Uoc2VsZikge1xuICByZXR1cm4gdHJ1bmNhdGUoSlNPTi5zdHJpbmdpZnkoc2VsZi5hY3R1YWwsIHJlcGxhY2VyKSwgMTI4KSArICcgJyArXG4gICAgICAgICBzZWxmLm9wZXJhdG9yICsgJyAnICtcbiAgICAgICAgIHRydW5jYXRlKEpTT04uc3RyaW5naWZ5KHNlbGYuZXhwZWN0ZWQsIHJlcGxhY2VyKSwgMTI4KTtcbn1cblxuLy8gQXQgcHJlc2VudCBvbmx5IHRoZSB0aHJlZSBrZXlzIG1lbnRpb25lZCBhYm92ZSBhcmUgdXNlZCBhbmRcbi8vIHVuZGVyc3Rvb2QgYnkgdGhlIHNwZWMuIEltcGxlbWVudGF0aW9ucyBvciBzdWIgbW9kdWxlcyBjYW4gcGFzc1xuLy8gb3RoZXIga2V5cyB0byB0aGUgQXNzZXJ0aW9uRXJyb3IncyBjb25zdHJ1Y3RvciAtIHRoZXkgd2lsbCBiZVxuLy8gaWdub3JlZC5cblxuLy8gMy4gQWxsIG9mIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG11c3QgdGhyb3cgYW4gQXNzZXJ0aW9uRXJyb3Jcbi8vIHdoZW4gYSBjb3JyZXNwb25kaW5nIGNvbmRpdGlvbiBpcyBub3QgbWV0LCB3aXRoIGEgbWVzc2FnZSB0aGF0XG4vLyBtYXkgYmUgdW5kZWZpbmVkIGlmIG5vdCBwcm92aWRlZC4gIEFsbCBhc3NlcnRpb24gbWV0aG9kcyBwcm92aWRlXG4vLyBib3RoIHRoZSBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcyB0byB0aGUgYXNzZXJ0aW9uIGVycm9yIGZvclxuLy8gZGlzcGxheSBwdXJwb3Nlcy5cblxuZnVuY3Rpb24gZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBvcGVyYXRvciwgc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gIHRocm93IG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3Ioe1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgYWN0dWFsOiBhY3R1YWwsXG4gICAgZXhwZWN0ZWQ6IGV4cGVjdGVkLFxuICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICBzdGFja1N0YXJ0RnVuY3Rpb246IHN0YWNrU3RhcnRGdW5jdGlvblxuICB9KTtcbn1cblxuLy8gRVhURU5TSU9OISBhbGxvd3MgZm9yIHdlbGwgYmVoYXZlZCBlcnJvcnMgZGVmaW5lZCBlbHNld2hlcmUuXG5hc3NlcnQuZmFpbCA9IGZhaWw7XG5cbi8vIDQuIFB1cmUgYXNzZXJ0aW9uIHRlc3RzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0cnV0aHksIGFzIGRldGVybWluZWRcbi8vIGJ5ICEhZ3VhcmQuXG4vLyBhc3NlcnQub2soZ3VhcmQsIG1lc3NhZ2Vfb3B0KTtcbi8vIFRoaXMgc3RhdGVtZW50IGlzIGVxdWl2YWxlbnQgdG8gYXNzZXJ0LmVxdWFsKHRydWUsICEhZ3VhcmQsXG4vLyBtZXNzYWdlX29wdCk7LiBUbyB0ZXN0IHN0cmljdGx5IGZvciB0aGUgdmFsdWUgdHJ1ZSwgdXNlXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwodHJ1ZSwgZ3VhcmQsIG1lc3NhZ2Vfb3B0KTsuXG5cbmZ1bmN0aW9uIG9rKHZhbHVlLCBtZXNzYWdlKSB7XG4gIGlmICghdmFsdWUpIGZhaWwodmFsdWUsIHRydWUsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5vayk7XG59XG5hc3NlcnQub2sgPSBvaztcblxuLy8gNS4gVGhlIGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzaGFsbG93LCBjb2VyY2l2ZSBlcXVhbGl0eSB3aXRoXG4vLyA9PS5cbi8vIGFzc2VydC5lcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPSBleHBlY3RlZCkgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQuZXF1YWwpO1xufTtcblxuLy8gNi4gVGhlIG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHdoZXRoZXIgdHdvIG9iamVjdHMgYXJlIG5vdCBlcXVhbFxuLy8gd2l0aCAhPSBhc3NlcnQubm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RXF1YWwgPSBmdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPScsIGFzc2VydC5ub3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDcuIFRoZSBlcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgYSBkZWVwIGVxdWFsaXR5IHJlbGF0aW9uLlxuLy8gYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5kZWVwRXF1YWwgPSBmdW5jdGlvbiBkZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwRXF1YWwnLCBhc3NlcnQuZGVlcEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0J1ZmZlcihhY3R1YWwpICYmIHV0aWwuaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgaWYgKGFjdHVhbC5sZW5ndGggIT0gZXhwZWN0ZWQubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdHVhbC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFjdHVhbFtpXSAhPT0gZXhwZWN0ZWRbaV0pIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxuICAvLyA3LjIuIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIERhdGUgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIERhdGUgb2JqZWN0IHRoYXQgcmVmZXJzIHRvIHRoZSBzYW1lIHRpbWUuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0RhdGUoYWN0dWFsKSAmJiB1dGlsLmlzRGF0ZShleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLmdldFRpbWUoKSA9PT0gZXhwZWN0ZWQuZ2V0VGltZSgpO1xuXG4gIC8vIDcuMyBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIFJlZ0V4cCBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzb3VyY2UgYW5kXG4gIC8vIHByb3BlcnRpZXMgKGBnbG9iYWxgLCBgbXVsdGlsaW5lYCwgYGxhc3RJbmRleGAsIGBpZ25vcmVDYXNlYCkuXG4gIH0gZWxzZSBpZiAodXRpbC5pc1JlZ0V4cChhY3R1YWwpICYmIHV0aWwuaXNSZWdFeHAoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5zb3VyY2UgPT09IGV4cGVjdGVkLnNvdXJjZSAmJlxuICAgICAgICAgICBhY3R1YWwuZ2xvYmFsID09PSBleHBlY3RlZC5nbG9iYWwgJiZcbiAgICAgICAgICAgYWN0dWFsLm11bHRpbGluZSA9PT0gZXhwZWN0ZWQubXVsdGlsaW5lICYmXG4gICAgICAgICAgIGFjdHVhbC5sYXN0SW5kZXggPT09IGV4cGVjdGVkLmxhc3RJbmRleCAmJlxuICAgICAgICAgICBhY3R1YWwuaWdub3JlQ2FzZSA9PT0gZXhwZWN0ZWQuaWdub3JlQ2FzZTtcblxuICAvLyA3LjQuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcsXG4gIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gIH0gZWxzZSBpZiAoIXV0aWwuaXNPYmplY3QoYWN0dWFsKSAmJiAhdXRpbC5pc09iamVjdChleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsID09IGV4cGVjdGVkO1xuXG4gIC8vIDcuNSBGb3IgYWxsIG90aGVyIE9iamVjdCBwYWlycywgaW5jbHVkaW5nIEFycmF5IG9iamVjdHMsIGVxdWl2YWxlbmNlIGlzXG4gIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAvLyB3aXRoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCksIHRoZSBzYW1lIHNldCBvZiBrZXlzXG4gIC8vIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLCBlcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnlcbiAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuIE5vdGU6IHRoaXNcbiAgLy8gYWNjb3VudHMgZm9yIGJvdGggbmFtZWQgYW5kIGluZGV4ZWQgcHJvcGVydGllcyBvbiBBcnJheXMuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9iakVxdWl2KGFjdHVhbCwgZXhwZWN0ZWQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbmZ1bmN0aW9uIG9iakVxdWl2KGEsIGIpIHtcbiAgaWYgKHV0aWwuaXNOdWxsT3JVbmRlZmluZWQoYSkgfHwgdXRpbC5pc051bGxPclVuZGVmaW5lZChiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS5cbiAgaWYgKGEucHJvdG90eXBlICE9PSBiLnByb3RvdHlwZSkgcmV0dXJuIGZhbHNlO1xuICAvL35+fkkndmUgbWFuYWdlZCB0byBicmVhayBPYmplY3Qua2V5cyB0aHJvdWdoIHNjcmV3eSBhcmd1bWVudHMgcGFzc2luZy5cbiAgLy8gICBDb252ZXJ0aW5nIHRvIGFycmF5IHNvbHZlcyB0aGUgcHJvYmxlbS5cbiAgaWYgKGlzQXJndW1lbnRzKGEpKSB7XG4gICAgaWYgKCFpc0FyZ3VtZW50cyhiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBfZGVlcEVxdWFsKGEsIGIpO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIGthID0gb2JqZWN0S2V5cyhhKSxcbiAgICAgICAga2IgPSBvYmplY3RLZXlzKGIpLFxuICAgICAgICBrZXksIGk7XG4gIH0gY2F0Y2ggKGUpIHsvL2hhcHBlbnMgd2hlbiBvbmUgaXMgYSBzdHJpbmcgbGl0ZXJhbCBhbmQgdGhlIG90aGVyIGlzbid0XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoa2V5cyBpbmNvcnBvcmF0ZXNcbiAgLy8gaGFzT3duUHJvcGVydHkpXG4gIGlmIChrYS5sZW5ndGggIT0ga2IubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy90aGUgc2FtZSBzZXQgb2Yga2V5cyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSxcbiAga2Euc29ydCgpO1xuICBrYi5zb3J0KCk7XG4gIC8vfn5+Y2hlYXAga2V5IHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoa2FbaV0gIT0ga2JbaV0pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy9lcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnkgY29ycmVzcG9uZGluZyBrZXksIGFuZFxuICAvL35+fnBvc3NpYmx5IGV4cGVuc2l2ZSBkZWVwIHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBrZXkgPSBrYVtpXTtcbiAgICBpZiAoIV9kZWVwRXF1YWwoYVtrZXldLCBiW2tleV0pKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIDguIFRoZSBub24tZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGZvciBhbnkgZGVlcCBpbmVxdWFsaXR5LlxuLy8gYXNzZXJ0Lm5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3REZWVwRXF1YWwgPSBmdW5jdGlvbiBub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBFcXVhbCcsIGFzc2VydC5ub3REZWVwRXF1YWwpO1xuICB9XG59O1xuXG4vLyA5LiBUaGUgc3RyaWN0IGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzdHJpY3QgZXF1YWxpdHksIGFzIGRldGVybWluZWQgYnkgPT09LlxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnN0cmljdEVxdWFsID0gZnVuY3Rpb24gc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09PScsIGFzc2VydC5zdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDEwLiBUaGUgc3RyaWN0IG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHN0cmljdCBpbmVxdWFsaXR5LCBhc1xuLy8gZGV0ZXJtaW5lZCBieSAhPT0uICBhc3NlcnQubm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90U3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT09JywgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkge1xuICBpZiAoIWFjdHVhbCB8fCAhZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4cGVjdGVkKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgIHJldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCk7XG4gIH0gZWxzZSBpZiAoYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChleHBlY3RlZC5jYWxsKHt9LCBhY3R1YWwpID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF90aHJvd3Moc2hvdWxkVGhyb3csIGJsb2NrLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICB2YXIgYWN0dWFsO1xuXG4gIGlmICh1dGlsLmlzU3RyaW5nKGV4cGVjdGVkKSkge1xuICAgIG1lc3NhZ2UgPSBleHBlY3RlZDtcbiAgICBleHBlY3RlZCA9IG51bGw7XG4gIH1cblxuICB0cnkge1xuICAgIGJsb2NrKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBhY3R1YWwgPSBlO1xuICB9XG5cbiAgbWVzc2FnZSA9IChleHBlY3RlZCAmJiBleHBlY3RlZC5uYW1lID8gJyAoJyArIGV4cGVjdGVkLm5hbWUgKyAnKS4nIDogJy4nKSArXG4gICAgICAgICAgICAobWVzc2FnZSA/ICcgJyArIG1lc3NhZ2UgOiAnLicpO1xuXG4gIGlmIChzaG91bGRUaHJvdyAmJiAhYWN0dWFsKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnTWlzc2luZyBleHBlY3RlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoIXNob3VsZFRocm93ICYmIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnR290IHVud2FudGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICgoc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmIGV4cGVjdGVkICYmXG4gICAgICAhZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8ICghc2hvdWxkVGhyb3cgJiYgYWN0dWFsKSkge1xuICAgIHRocm93IGFjdHVhbDtcbiAgfVxufVxuXG4vLyAxMS4gRXhwZWN0ZWQgdG8gdGhyb3cgYW4gZXJyb3I6XG4vLyBhc3NlcnQudGhyb3dzKGJsb2NrLCBFcnJvcl9vcHQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnRocm93cyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzLmFwcGx5KHRoaXMsIFt0cnVlXS5jb25jYXQocFNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xufTtcblxuLy8gRVhURU5TSU9OISBUaGlzIGlzIGFubm95aW5nIHRvIHdyaXRlIG91dHNpZGUgdGhpcyBtb2R1bGUuXG5hc3NlcnQuZG9lc05vdFRocm93ID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cy5hcHBseSh0aGlzLCBbZmFsc2VdLmNvbmNhdChwU2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG59O1xuXG5hc3NlcnQuaWZFcnJvciA9IGZ1bmN0aW9uKGVycikgeyBpZiAoZXJyKSB7dGhyb3cgZXJyO319O1xuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChoYXNPd24uY2FsbChvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiBrZXlzO1xufTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhbk11dGF0aW9uT2JzZXJ2ZXIgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIHZhciBxdWV1ZSA9IFtdO1xuXG4gICAgaWYgKGNhbk11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgICAgICAgdmFyIGhpZGRlbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBxdWV1ZUxpc3QgPSBxdWV1ZS5zbGljZSgpO1xuICAgICAgICAgICAgcXVldWUubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHF1ZXVlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShoaWRkZW5EaXYsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIGlmICghcXVldWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaGlkZGVuRGl2LnNldEF0dHJpYnV0ZSgneWVzJywgJ25vJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCI7KGZ1bmN0aW9uKHJvb3QpIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgY3Jvc3Mgc3RvcmFnZSBjbGllbnQgZ2l2ZW4gdGhlIHVybCB0byBhIGh1Yi4gQnkgZGVmYXVsdCxcbiAgICogYW4gaWZyYW1lIGlzIGNyZWF0ZWQgd2l0aGluIHRoZSBkb2N1bWVudCBib2R5IHRoYXQgcG9pbnRzIHRvIHRoZSB1cmwuIEl0XG4gICAqIGFsc28gYWNjZXB0cyBhbiBvcHRpb25zIG9iamVjdCwgd2hpY2ggbWF5IGluY2x1ZGUgYSB0aW1lb3V0LCBmcmFtZUlkLCBhbmRcbiAgICogcHJvbWlzZS4gVGhlIHRpbWVvdXQsIGluIG1pbGxpc2Vjb25kcywgaXMgYXBwbGllZCB0byBlYWNoIHJlcXVlc3QgYW5kXG4gICAqIGRlZmF1bHRzIHRvIDUwMDBtcy4gVGhlIG9wdGlvbnMgb2JqZWN0IG1heSBhbHNvIGluY2x1ZGUgYSBmcmFtZUlkLFxuICAgKiBpZGVudGlmeWluZyBhbiBleGlzdGluZyBmcmFtZSBvbiB3aGljaCB0byBpbnN0YWxsIGl0cyBsaXN0ZW5lcnMuIElmIHRoZVxuICAgKiBwcm9taXNlIGtleSBpcyBzdXBwbGllZCB0aGUgY29uc3RydWN0b3IgZm9yIGEgUHJvbWlzZSwgdGhhdCBQcm9taXNlIGxpYnJhcnlcbiAgICogd2lsbCBiZSB1c2VkIGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgd2luZG93LlByb21pc2UuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHZhciBzdG9yYWdlID0gbmV3IENyb3NzU3RvcmFnZUNsaWVudCgnaHR0cHM6Ly9zdG9yZS5leGFtcGxlLmNvbS9odWIuaHRtbCcpO1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgc3RvcmFnZSA9IG5ldyBDcm9zc1N0b3JhZ2VDbGllbnQoJ2h0dHBzOi8vc3RvcmUuZXhhbXBsZS5jb20vaHViLmh0bWwnLCB7XG4gICAqICAgdGltZW91dDogNTAwMCxcbiAgICogICBmcmFtZUlkOiAnc3RvcmFnZUZyYW1lJ1xuICAgKiB9KTtcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgICAgVGhlIHVybCB0byBhIGNyb3NzIHN0b3JhZ2UgaHViXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0c10gQW4gb3B0aW9uYWwgb2JqZWN0IGNvbnRhaW5pbmcgYWRkaXRpb25hbCBvcHRpb25zLFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGluZyB0aW1lb3V0LCBmcmFtZUlkLCBhbmQgcHJvbWlzZVxuICAgKlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gICBfaWQgICAgICAgIEEgVVVJRCB2NCBpZFxuICAgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBfcHJvbWlzZSAgIFRoZSBQcm9taXNlIG9iamVjdCB0byB1c2VcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9ICAgX2ZyYW1lSWQgICBUaGUgaWQgb2YgdGhlIGlGcmFtZSBwb2ludGluZyB0byB0aGUgaHViIHVybFxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gICBfb3JpZ2luICAgIFRoZSBodWIncyBvcmlnaW5cbiAgICogQHByb3BlcnR5IHtvYmplY3R9ICAgX3JlcXVlc3RzICBNYXBwaW5nIG9mIHJlcXVlc3QgaWRzIHRvIGNhbGxiYWNrc1xuICAgKiBAcHJvcGVydHkge2Jvb2x9ICAgICBfY29ubmVjdGVkIFdoZXRoZXIgb3Igbm90IGl0IGhhcyBjb25uZWN0ZWRcbiAgICogQHByb3BlcnR5IHtib29sfSAgICAgX2Nsb3NlZCAgICBXaGV0aGVyIG9yIG5vdCB0aGUgY2xpZW50IGhhcyBjbG9zZWRcbiAgICogQHByb3BlcnR5IHtpbnR9ICAgICAgX2NvdW50ICAgICBOdW1iZXIgb2YgcmVxdWVzdHMgc2VudFxuICAgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBfbGlzdGVuZXIgIFRoZSBsaXN0ZW5lciBhZGRlZCB0byB0aGUgd2luZG93XG4gICAqIEBwcm9wZXJ0eSB7V2luZG93fSAgIF9odWIgICAgICAgVGhlIGh1YiB3aW5kb3dcbiAgICovXG4gIGZ1bmN0aW9uIENyb3NzU3RvcmFnZUNsaWVudCh1cmwsIG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcblxuICAgIHRoaXMuX2lkICAgICAgICA9IENyb3NzU3RvcmFnZUNsaWVudC5fZ2VuZXJhdGVVVUlEKCk7XG4gICAgdGhpcy5fcHJvbWlzZSAgID0gb3B0cy5wcm9taXNlIHx8IFByb21pc2U7XG4gICAgdGhpcy5fZnJhbWVJZCAgID0gb3B0cy5mcmFtZUlkIHx8ICdDcm9zc1N0b3JhZ2VDbGllbnQtJyArIHRoaXMuX2lkO1xuICAgIHRoaXMuX29yaWdpbiAgICA9IENyb3NzU3RvcmFnZUNsaWVudC5fZ2V0T3JpZ2luKHVybCk7XG4gICAgdGhpcy5fcmVxdWVzdHMgID0ge307XG4gICAgdGhpcy5fY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5fY2xvc2VkICAgID0gZmFsc2U7XG4gICAgdGhpcy5fY291bnQgICAgID0gMDtcbiAgICB0aGlzLl90aW1lb3V0ICAgPSBvcHRzLnRpbWVvdXQgfHwgNTAwMDtcbiAgICB0aGlzLl9saXN0ZW5lciAgPSBudWxsO1xuXG4gICAgdGhpcy5faW5zdGFsbExpc3RlbmVyKCk7XG5cbiAgICB2YXIgZnJhbWU7XG4gICAgaWYgKG9wdHMuZnJhbWVJZCkge1xuICAgICAgZnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcHRzLmZyYW1lSWQpO1xuICAgIH1cblxuICAgIC8vIElmIHVzaW5nIGEgcGFzc2VkIGlmcmFtZSwgcG9sbCB0aGUgaHViIGZvciBhIHJlYWR5IG1lc3NhZ2VcbiAgICBpZiAoZnJhbWUpIHtcbiAgICAgIHRoaXMuX3BvbGwoKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIGZyYW1lIGlmIG5vdCBmb3VuZCBvciBzcGVjaWZpZWRcbiAgICBmcmFtZSA9IGZyYW1lIHx8IHRoaXMuX2NyZWF0ZUZyYW1lKHVybCk7XG4gICAgdGhpcy5faHViID0gZnJhbWUuY29udGVudFdpbmRvdztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc3R5bGVzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGdlbmVyYXRlZCBpRnJhbWUuIERlZmluZXMgYSBzZXQgb2YgcHJvcGVydGllc1xuICAgKiB0aGF0IGhpZGUgdGhlIGVsZW1lbnQgYnkgcG9zaXRpb25pbmcgaXQgb3V0c2lkZSBvZiB0aGUgdmlzaWJsZSBhcmVhLCBhbmRcbiAgICogYnkgbW9kaWZ5aW5nIGl0cyBkaXNwbGF5LlxuICAgKlxuICAgKiBAbWVtYmVyIHtPYmplY3R9XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQuZnJhbWVTdHlsZSA9IHtcbiAgICBkaXNwbGF5OiAgJ25vbmUnLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogICAgICAnLTk5OXB4JyxcbiAgICBsZWZ0OiAgICAgJy05OTlweCdcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgb3JpZ2luIG9mIGFuIHVybCwgd2l0aCBjcm9zcyBicm93c2VyIHN1cHBvcnQuIEFjY29tbW9kYXRlc1xuICAgKiB0aGUgbGFjayBvZiBsb2NhdGlvbi5vcmlnaW4gaW4gSUUsIGFzIHdlbGwgYXMgdGhlIGRpc2NyZXBhbmNpZXMgaW4gdGhlXG4gICAqIGluY2x1c2lvbiBvZiB0aGUgcG9ydCB3aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHBvcnQgZm9yIGEgcHJvdG9jb2wsIGUuZy5cbiAgICogNDQzIG92ZXIgaHR0cHMuIERlZmF1bHRzIHRvIHRoZSBvcmlnaW4gb2Ygd2luZG93LmxvY2F0aW9uIGlmIHBhc3NlZCBhXG4gICAqIHJlbGF0aXZlIHBhdGguXG4gICAqXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9IHVybCBUaGUgdXJsIHRvIGEgY3Jvc3Mgc3RvcmFnZSBodWJcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIG9yaWdpbiBvZiB0aGUgdXJsXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQuX2dldE9yaWdpbiA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciB1cmksIHByb3RvY29sLCBvcmlnaW47XG5cbiAgICB1cmkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgdXJpLmhyZWYgPSB1cmw7XG5cbiAgICBpZiAoIXVyaS5ob3N0KSB7XG4gICAgICB1cmkgPSB3aW5kb3cubG9jYXRpb247XG4gICAgfVxuXG4gICAgaWYgKCF1cmkucHJvdG9jb2wgfHwgdXJpLnByb3RvY29sID09PSAnOicpIHtcbiAgICAgIHByb3RvY29sID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm90b2NvbCA9IHVyaS5wcm90b2NvbDtcbiAgICB9XG5cbiAgICBvcmlnaW4gPSBwcm90b2NvbCArICcvLycgKyB1cmkuaG9zdDtcbiAgICBvcmlnaW4gPSBvcmlnaW4ucmVwbGFjZSgvOjgwJHw6NDQzJC8sICcnKTtcblxuICAgIHJldHVybiBvcmlnaW47XG4gIH07XG5cbiAgLyoqXG4gICAqIFVVSUQgdjQgZ2VuZXJhdGlvbiwgdGFrZW4gZnJvbTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy9cbiAgICogMTA1MDM0L2hvdy10by1jcmVhdGUtYS1ndWlkLXV1aWQtaW4tamF2YXNjcmlwdC8yMTE3NTIzIzIxMTc1MjNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gQSBVVUlEIHY0IHN0cmluZ1xuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50Ll9nZW5lcmF0ZVVVSUQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNnwwLCB2ID0gYyA9PSAneCcgPyByIDogKHImMHgzfDB4OCk7XG5cbiAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhIGNvbm5lY3Rpb24gaGFzIGJlZW4gZXN0YWJsaXNoZWRcbiAgICogd2l0aCB0aGUgY3Jvc3Mgc3RvcmFnZSBodWIuIEl0cyB1c2UgaXMgcmVxdWlyZWQgdG8gYXZvaWQgc2VuZGluZyBhbnlcbiAgICogcmVxdWVzdHMgcHJpb3IgdG8gaW5pdGlhbGl6YXRpb24gYmVpbmcgY29tcGxldGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCBvbiBjb25uZWN0XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLm9uQ29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjbGllbnQgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX2Nvbm5lY3RlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Byb21pc2UucmVzb2x2ZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fY2xvc2VkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdDcm9zc1N0b3JhZ2VDbGllbnQgaGFzIGNsb3NlZCcpKTtcbiAgICB9XG5cbiAgICAvLyBRdWV1ZSBjb25uZWN0IHJlcXVlc3RzIGZvciBjbGllbnQgcmUtdXNlXG4gICAgaWYgKCF0aGlzLl9yZXF1ZXN0cy5jb25uZWN0KSB7XG4gICAgICB0aGlzLl9yZXF1ZXN0cy5jb25uZWN0ID0gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyB0aGlzLl9wcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKCdDcm9zc1N0b3JhZ2VDbGllbnQgY291bGQgbm90IGNvbm5lY3QnKSk7XG4gICAgICB9LCBjbGllbnQuX3RpbWVvdXQpO1xuXG4gICAgICBjbGllbnQuX3JlcXVlc3RzLmNvbm5lY3QucHVzaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycik7XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgYSBrZXkgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZS4gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgb25cbiAgICogc3VjY2Vzcywgb3IgcmVqZWN0ZWQgaWYgYW55IGVycm9ycyBzZXR0aW5nIHRoZSBrZXkgb2NjdXJyZWQsIG9yIHRoZSByZXF1ZXN0XG4gICAqIHRpbWVkIG91dC5cbiAgICpcbiAgICogQHBhcmFtICAge3N0cmluZ30gIGtleSAgIFRoZSBrZXkgdG8gc2V0XG4gICAqIEBwYXJhbSAgIHsqfSAgICAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uIGh1YiByZXNwb25zZSBvciB0aW1lb3V0XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnc2V0Jywge1xuICAgICAga2V5OiAgIGtleSxcbiAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBY2NlcHRzIG9uZSBvciBtb3JlIGtleXMgZm9yIHdoaWNoIHRvIHJldHJpZXZlIHRoZWlyIHZhbHVlcy4gUmV0dXJucyBhXG4gICAqIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uIGh1YiByZXNwb25zZSBvciB0aW1lb3V0LiBPbiBzdWNjZXNzLCBpdCBpc1xuICAgKiBmdWxmaWxsZWQgd2l0aCB0aGUgdmFsdWUgb2YgdGhlIGtleSBpZiBvbmx5IHBhc3NlZCBhIHNpbmdsZSBhcmd1bWVudC5cbiAgICogT3RoZXJ3aXNlIGl0J3MgcmVzb2x2ZWQgd2l0aCBhbiBhcnJheSBvZiB2YWx1ZXMuIE9uIGZhaWx1cmUsIGl0IGlzIHJlamVjdGVkXG4gICAqIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgZXJyb3IgbWVzc2FnZS5cbiAgICpcbiAgICogQHBhcmFtICAgey4uLnN0cmluZ30ga2V5IFRoZSBrZXkgdG8gcmV0cmlldmVcbiAgICogQHJldHVybnMge1Byb21pc2V9ICAgQSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCBvbiBodWIgcmVzcG9uc2Ugb3IgdGltZW91dFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnZ2V0Jywge2tleXM6IGFyZ3N9KTtcbiAgfTtcblxuICAvKipcbiAgICogQWNjZXB0cyBvbmUgb3IgbW9yZSBrZXlzIGZvciBkZWxldGlvbi4gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uXG4gICAqIGh1YiByZXNwb25zZSBvciB0aW1lb3V0LlxuICAgKlxuICAgKiBAcGFyYW0gICB7Li4uc3RyaW5nfSBrZXkgVGhlIGtleSB0byBkZWxldGVcbiAgICogQHJldHVybnMge1Byb21pc2V9ICAgQSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCBvbiBodWIgcmVzcG9uc2Ugb3IgdGltZW91dFxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5kZWwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnZGVsJywge2tleXM6IGFyZ3N9KTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCwgd2hlbiByZXNvbHZlZCwgaW5kaWNhdGVzIHRoYXQgYWxsIGxvY2FsU3RvcmFnZVxuICAgKiBkYXRhIGhhcyBiZWVuIGNsZWFyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uIGh1YiByZXNwb25zZSBvciB0aW1lb3V0XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ2NsZWFyJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQsIHdoZW4gcmVzb2x2ZWQsIHBhc3NlcyBhbiBhcnJheSBvZiBhbGwga2V5c1xuICAgKiBjdXJyZW50bHkgaW4gc3RvcmFnZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgb24gaHViIHJlc3BvbnNlIG9yIHRpbWVvdXRcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuZ2V0S2V5cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdnZXRLZXlzJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgdGhlIGlmcmFtZSBhbmQgc2V0cyB0aGUgY29ubmVjdGVkIHN0YXRlIHRvIGZhbHNlLiBUaGUgY2xpZW50IGNhblxuICAgKiBubyBsb25nZXIgYmUgdXNlZCBhZnRlciBiZWluZyBpbnZva2VkLlxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuX2ZyYW1lSWQpO1xuICAgIGlmIChmcmFtZSkge1xuICAgICAgZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmcmFtZSk7XG4gICAgfVxuXG4gICAgLy8gU3VwcG9ydCBJRTggd2l0aCBkZXRhY2hFdmVudFxuICAgIGlmICh3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLl9saXN0ZW5lciwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuZGV0YWNoRXZlbnQoJ29ubWVzc2FnZScsIHRoaXMuX2xpc3RlbmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9jbG9zZWQgPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbnN0YWxscyB0aGUgbmVjZXNzYXJ5IGxpc3RlbmVyIGZvciB0aGUgd2luZG93IG1lc3NhZ2UgZXZlbnQuIFdoZW4gYSBtZXNzYWdlXG4gICAqIGlzIHJlY2VpdmVkLCB0aGUgY2xpZW50J3MgX2Nvbm5lY3RlZCBzdGF0dXMgaXMgY2hhbmdlZCB0byB0cnVlLCBhbmQgdGhlXG4gICAqIG9uQ29ubmVjdCBwcm9taXNlIGlzIGZ1bGZpbGxlZC4gR2l2ZW4gYSByZXNwb25zZSBtZXNzYWdlLCB0aGUgY2FsbGJhY2tcbiAgICogY29ycmVzcG9uZGluZyB0byBpdHMgcmVxdWVzdCBpcyBpbnZva2VkLiBJZiByZXNwb25zZS5lcnJvciBob2xkcyBhIHRydXRoeVxuICAgKiB2YWx1ZSwgdGhlIHByb21pc2UgYXNzb2NpYXRlZCB3aXRoIHRoZSBvcmlnaW5hbCByZXF1ZXN0IGlzIHJlamVjdGVkIHdpdGhcbiAgICogdGhlIGVycm9yLiBPdGhlcndpc2UgdGhlIHByb21pc2UgaXMgZnVsZmlsbGVkIGFuZCBwYXNzZWQgcmVzcG9uc2UucmVzdWx0LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlQ2xpZW50LnByb3RvdHlwZS5faW5zdGFsbExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNsaWVudCA9IHRoaXM7XG5cbiAgICB0aGlzLl9saXN0ZW5lciA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIHZhciBpLCBvcmlnaW4sIGVycm9yLCByZXNwb25zZTtcblxuICAgICAgLy8gSWdub3JlIGludmFsaWQgbWVzc2FnZXMgb3IgdGhvc2UgYWZ0ZXIgdGhlIGNsaWVudCBoYXMgY2xvc2VkXG4gICAgICBpZiAoY2xpZW50Ll9jbG9zZWQgfHwgIW1lc3NhZ2UuZGF0YSB8fCB0eXBlb2YgbWVzc2FnZS5kYXRhICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIHBvc3RNZXNzYWdlIHJldHVybnMgdGhlIHN0cmluZyBcIm51bGxcIiBhcyB0aGUgb3JpZ2luIGZvciBcImZpbGU6Ly9cIlxuICAgICAgb3JpZ2luID0gKG1lc3NhZ2Uub3JpZ2luID09PSAnbnVsbCcpID8gJ2ZpbGU6Ly8nIDogbWVzc2FnZS5vcmlnaW47XG5cbiAgICAgIC8vIElnbm9yZSBtZXNzYWdlcyBub3QgZnJvbSB0aGUgY29ycmVjdCBvcmlnaW5cbiAgICAgIGlmIChvcmlnaW4gIT09IGNsaWVudC5fb3JpZ2luKSByZXR1cm47XG5cbiAgICAgIC8vIExvY2FsU3RvcmFnZSBpc24ndCBhdmFpbGFibGUgaW4gdGhlIGh1YlxuICAgICAgaWYgKG1lc3NhZ2UuZGF0YSA9PT0gJ2Nyb3NzLXN0b3JhZ2U6dW5hdmFpbGFibGUnKSB7XG4gICAgICAgIGlmICghY2xpZW50Ll9jbG9zZWQpIGNsaWVudC5jbG9zZSgpO1xuICAgICAgICBpZiAoIWNsaWVudC5fcmVxdWVzdHMuY29ubmVjdCkgcmV0dXJuO1xuXG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdDbG9zaW5nIGNsaWVudC4gQ291bGQgbm90IGFjY2VzcyBsb2NhbFN0b3JhZ2UgaW4gaHViLicpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2xpZW50Ll9yZXF1ZXN0cy5jb25uZWN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY2xpZW50Ll9yZXF1ZXN0cy5jb25uZWN0W2ldKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIGluaXRpYWwgY29ubmVjdGlvblxuICAgICAgaWYgKG1lc3NhZ2UuZGF0YS5pbmRleE9mKCdjcm9zcy1zdG9yYWdlOicpICE9PSAtMSAmJiAhY2xpZW50Ll9jb25uZWN0ZWQpIHtcbiAgICAgICAgY2xpZW50Ll9jb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICBpZiAoIWNsaWVudC5fcmVxdWVzdHMuY29ubmVjdCkgcmV0dXJuO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjbGllbnQuX3JlcXVlc3RzLmNvbm5lY3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjbGllbnQuX3JlcXVlc3RzLmNvbm5lY3RbaV0oZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBjbGllbnQuX3JlcXVlc3RzLmNvbm5lY3Q7XG4gICAgICB9XG5cbiAgICAgIGlmIChtZXNzYWdlLmRhdGEgPT09ICdjcm9zcy1zdG9yYWdlOnJlYWR5JykgcmV0dXJuO1xuXG4gICAgICAvLyBBbGwgb3RoZXIgbWVzc2FnZXNcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXNwb25zZS5pZCkgcmV0dXJuO1xuXG4gICAgICBpZiAoY2xpZW50Ll9yZXF1ZXN0c1tyZXNwb25zZS5pZF0pIHtcbiAgICAgICAgY2xpZW50Ll9yZXF1ZXN0c1tyZXNwb25zZS5pZF0ocmVzcG9uc2UuZXJyb3IsIHJlc3BvbnNlLnJlc3VsdCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFN1cHBvcnQgSUU4IHdpdGggYXR0YWNoRXZlbnRcbiAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5fbGlzdGVuZXIsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmF0dGFjaEV2ZW50KCdvbm1lc3NhZ2UnLCB0aGlzLl9saXN0ZW5lcik7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoZW4gYSBmcmFtZSBpZCB3YXMgcGFzc2VkIHRvIHRoZSBjbGllbnQsIHJhdGhlciB0aGFuIGFsbG93aW5nXG4gICAqIHRoZSBjbGllbnQgdG8gY3JlYXRlIGl0cyBvd24gaWZyYW1lLiBQb2xscyB0aGUgaHViIGZvciBhIHJlYWR5IGV2ZW50IHRvXG4gICAqIGVzdGFibGlzaCBhIGNvbm5lY3RlZCBzdGF0ZS5cbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuX3BvbGwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2xpZW50LCBpbnRlcnZhbCwgdGFyZ2V0T3JpZ2luO1xuXG4gICAgY2xpZW50ID0gdGhpcztcblxuICAgIC8vIHBvc3RNZXNzYWdlIHJlcXVpcmVzIHRoYXQgdGhlIHRhcmdldCBvcmlnaW4gYmUgc2V0IHRvIFwiKlwiIGZvciBcImZpbGU6Ly9cIlxuICAgIHRhcmdldE9yaWdpbiA9IChjbGllbnQuX29yaWdpbiA9PT0gJ2ZpbGU6Ly8nKSA/ICcqJyA6IGNsaWVudC5fb3JpZ2luO1xuXG4gICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIGlmIChjbGllbnQuX2Nvbm5lY3RlZCkgcmV0dXJuIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgaWYgKCFjbGllbnQuX2h1YikgcmV0dXJuO1xuXG4gICAgICBjbGllbnQuX2h1Yi5wb3N0TWVzc2FnZSgnY3Jvc3Mtc3RvcmFnZTpwb2xsJywgdGFyZ2V0T3JpZ2luKTtcbiAgICB9LCAxMDAwKTtcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpRnJhbWUgY29udGFpbmluZyB0aGUgaHViLiBBcHBsaWVzIHRoZSBuZWNlc3Nhcnkgc3R5bGVzIHRvXG4gICAqIGhpZGUgdGhlIGVsZW1lbnQgZnJvbSB2aWV3LCBwcmlvciB0byBhZGRpbmcgaXQgdG8gdGhlIGRvY3VtZW50IGJvZHkuXG4gICAqIFJldHVybnMgdGhlIGNyZWF0ZWQgZWxlbWVudC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgIHVybCBUaGUgdXJsIHRvIHRoZSBodWJcbiAgICogcmV0dXJucyB7SFRNTElGcmFtZUVsZW1lbnR9IFRoZSBpRnJhbWUgZWxlbWVudCBpdHNlbGZcbiAgICovXG4gIENyb3NzU3RvcmFnZUNsaWVudC5wcm90b3R5cGUuX2NyZWF0ZUZyYW1lID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGZyYW1lLCBrZXk7XG5cbiAgICBmcmFtZSA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICBmcmFtZS5pZCA9IHRoaXMuX2ZyYW1lSWQ7XG5cbiAgICAvLyBTdHlsZSB0aGUgaWZyYW1lXG4gICAgZm9yIChrZXkgaW4gQ3Jvc3NTdG9yYWdlQ2xpZW50LmZyYW1lU3R5bGUpIHtcbiAgICAgIGlmIChDcm9zc1N0b3JhZ2VDbGllbnQuZnJhbWVTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGZyYW1lLnN0eWxlW2tleV0gPSBDcm9zc1N0b3JhZ2VDbGllbnQuZnJhbWVTdHlsZVtrZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZyYW1lKTtcbiAgICBmcmFtZS5zcmMgPSB1cmw7XG5cbiAgICByZXR1cm4gZnJhbWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSBjb250YWluaW5nIHRoZSBnaXZlbiBtZXRob2QgYW5kIHBhcmFtcyB0byB0aGUgaHViLiBTdG9yZXNcbiAgICogYSBjYWxsYmFjayBpbiB0aGUgX3JlcXVlc3RzIG9iamVjdCBmb3IgbGF0ZXIgaW52b2NhdGlvbiBvbiBtZXNzYWdlLCBvclxuICAgKiBkZWxldGlvbiBvbiB0aW1lb3V0LiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgaW4gZWl0aGVyIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0gICB7c3RyaW5nfSAgbWV0aG9kIFRoZSBtZXRob2QgdG8gaW52b2tlXG4gICAqIEBwYXJhbSAgIHsqfSAgICAgICBwYXJhbXMgVGhlIGFyZ3VtZW50cyB0byBwYXNzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIG9uIGh1YiByZXNwb25zZSBvciB0aW1lb3V0XG4gICAqL1xuICBDcm9zc1N0b3JhZ2VDbGllbnQucHJvdG90eXBlLl9yZXF1ZXN0ID0gZnVuY3Rpb24obWV0aG9kLCBwYXJhbXMpIHtcbiAgICB2YXIgcmVxLCBjbGllbnQ7XG5cbiAgICBpZiAodGhpcy5fY2xvc2VkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdDcm9zc1N0b3JhZ2VDbGllbnQgaGFzIGNsb3NlZCcpKTtcbiAgICB9XG5cbiAgICBjbGllbnQgPSB0aGlzO1xuICAgIGNsaWVudC5fY291bnQrKztcblxuICAgIHJlcSA9IHtcbiAgICAgIGlkOiAgICAgdGhpcy5faWQgKyAnOicgKyBjbGllbnQuX2NvdW50LFxuICAgICAgbWV0aG9kOiAnY3Jvc3Mtc3RvcmFnZTonICsgbWV0aG9kLFxuICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyB0aGlzLl9wcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHRpbWVvdXQsIG9yaWdpbmFsVG9KU09OLCB0YXJnZXRPcmlnaW47XG5cbiAgICAgIC8vIFRpbWVvdXQgaWYgYSByZXNwb25zZSBpc24ndCByZWNlaXZlZCBhZnRlciA0c1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghY2xpZW50Ll9yZXF1ZXN0c1tyZXEuaWRdKSByZXR1cm47XG5cbiAgICAgICAgZGVsZXRlIGNsaWVudC5fcmVxdWVzdHNbcmVxLmlkXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignVGltZW91dDogY291bGQgbm90IHBlcmZvcm0gJyArIHJlcS5tZXRob2QpKTtcbiAgICAgIH0sIGNsaWVudC5fdGltZW91dCk7XG5cbiAgICAgIC8vIEFkZCByZXF1ZXN0IGNhbGxiYWNrXG4gICAgICBjbGllbnQuX3JlcXVlc3RzW3JlcS5pZF0gPSBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIGRlbGV0ZSBjbGllbnQuX3JlcXVlc3RzW3JlcS5pZF07XG4gICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QobmV3IEVycm9yKGVycikpO1xuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBJbiBjYXNlIHdlIGhhdmUgYSBicm9rZW4gQXJyYXkucHJvdG90eXBlLnRvSlNPTiwgZS5nLiBiZWNhdXNlIG9mXG4gICAgICAvLyBvbGQgdmVyc2lvbnMgb2YgcHJvdG90eXBlXG4gICAgICBpZiAoQXJyYXkucHJvdG90eXBlLnRvSlNPTikge1xuICAgICAgICBvcmlnaW5hbFRvSlNPTiA9IEFycmF5LnByb3RvdHlwZS50b0pTT047XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS50b0pTT04gPSBudWxsO1xuICAgICAgfVxuXG4gICAgICAvLyBwb3N0TWVzc2FnZSByZXF1aXJlcyB0aGF0IHRoZSB0YXJnZXQgb3JpZ2luIGJlIHNldCB0byBcIipcIiBmb3IgXCJmaWxlOi8vXCJcbiAgICAgIHRhcmdldE9yaWdpbiA9IChjbGllbnQuX29yaWdpbiA9PT0gJ2ZpbGU6Ly8nKSA/ICcqJyA6IGNsaWVudC5fb3JpZ2luO1xuXG4gICAgICAvLyBTZW5kIHNlcmlhbGl6ZWQgbWVzc2FnZVxuICAgICAgY2xpZW50Ll9odWIucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkocmVxKSwgdGFyZ2V0T3JpZ2luKTtcblxuICAgICAgLy8gUmVzdG9yZSBvcmlnaW5hbCB0b0pTT05cbiAgICAgIGlmIChvcmlnaW5hbFRvSlNPTikge1xuICAgICAgICBBcnJheS5wcm90b3R5cGUudG9KU09OID0gb3JpZ2luYWxUb0pTT047XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEV4cG9ydCBmb3IgdmFyaW91cyBlbnZpcm9ubWVudHMuXG4gICAqL1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENyb3NzU3RvcmFnZUNsaWVudDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBleHBvcnRzLkNyb3NzU3RvcmFnZUNsaWVudCA9IENyb3NzU3RvcmFnZUNsaWVudDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIENyb3NzU3RvcmFnZUNsaWVudDtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByb290LkNyb3NzU3RvcmFnZUNsaWVudCA9IENyb3NzU3RvcmFnZUNsaWVudDtcbiAgfVxufSh0aGlzKSk7XG4iLCI7KGZ1bmN0aW9uKHJvb3QpIHtcbiAgdmFyIENyb3NzU3RvcmFnZUh1YiA9IHt9O1xuXG4gIC8qKlxuICAgKiBBY2NlcHRzIGFuIGFycmF5IG9mIG9iamVjdHMgd2l0aCB0d28ga2V5czogb3JpZ2luIGFuZCBhbGxvdy4gVGhlIHZhbHVlXG4gICAqIG9mIG9yaWdpbiBpcyBleHBlY3RlZCB0byBiZSBhIFJlZ0V4cCwgYW5kIGFsbG93LCBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICAgKiBUaGUgY3Jvc3Mgc3RvcmFnZSBodWIgaXMgdGhlbiBpbml0aWFsaXplZCB0byBhY2NlcHQgcmVxdWVzdHMgZnJvbSBhbnkgb2ZcbiAgICogdGhlIG1hdGNoaW5nIG9yaWdpbnMsIGFsbG93aW5nIGFjY2VzcyB0byB0aGUgYXNzb2NpYXRlZCBsaXN0cyBvZiBtZXRob2RzLlxuICAgKiBNZXRob2RzIG1heSBpbmNsdWRlIGFueSBvZjogZ2V0LCBzZXQsIGRlbCwgZ2V0S2V5cyBhbmQgY2xlYXIuIEEgJ3JlYWR5J1xuICAgKiBtZXNzYWdlIGlzIHNlbnQgdG8gdGhlIHBhcmVudCB3aW5kb3cgb25jZSBjb21wbGV0ZS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gU3ViZG9tYWluIGNhbiBnZXQsIGJ1dCBvbmx5IHJvb3QgZG9tYWluIGNhbiBzZXQgYW5kIGRlbFxuICAgKiBDcm9zc1N0b3JhZ2VIdWIuaW5pdChbXG4gICAqICAge29yaWdpbjogL1xcLmV4YW1wbGUuY29tJC8sICAgICAgICBhbGxvdzogWydnZXQnXX0sXG4gICAqICAge29yaWdpbjogLzood3d3XFwuKT9leGFtcGxlLmNvbSQvLCBhbGxvdzogWydnZXQnLCAnc2V0JywgJ2RlbCddfVxuICAgKiBdKTtcbiAgICpcbiAgICogQHBhcmFtIHthcnJheX0gcGVybWlzc2lvbnMgQW4gYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIG9yaWdpbiBhbmQgYWxsb3dcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5pbml0ID0gZnVuY3Rpb24ocGVybWlzc2lvbnMpIHtcbiAgICB2YXIgYXZhaWxhYmxlID0gdHJ1ZTtcblxuICAgIC8vIFJldHVybiBpZiBsb2NhbFN0b3JhZ2UgaXMgdW5hdmFpbGFibGUsIG9yIHRoaXJkIHBhcnR5XG4gICAgLy8gYWNjZXNzIGlzIGRpc2FibGVkXG4gICAgdHJ5IHtcbiAgICAgIGlmICghd2luZG93LmxvY2FsU3RvcmFnZSkgYXZhaWxhYmxlID0gZmFsc2U7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgYXZhaWxhYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFhdmFpbGFibGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKCdjcm9zcy1zdG9yYWdlOnVuYXZhaWxhYmxlJywgJyonKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIENyb3NzU3RvcmFnZUh1Yi5fcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucyB8fCBbXTtcbiAgICBDcm9zc1N0b3JhZ2VIdWIuX2luc3RhbGxMaXN0ZW5lcigpO1xuICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoJ2Nyb3NzLXN0b3JhZ2U6cmVhZHknLCAnKicpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbnN0YWxscyB0aGUgbmVjZXNzYXJ5IGxpc3RlbmVyIGZvciB0aGUgd2luZG93IG1lc3NhZ2UgZXZlbnQuIEFjY29tbW9kYXRlc1xuICAgKiBJRTggYW5kIHVwLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9pbnN0YWxsTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGlzdGVuZXIgPSBDcm9zc1N0b3JhZ2VIdWIuX2xpc3RlbmVyO1xuICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuYXR0YWNoRXZlbnQoJ29ubWVzc2FnZScsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoZSBtZXNzYWdlIGhhbmRsZXIgZm9yIGFsbCByZXF1ZXN0cyBwb3N0ZWQgdG8gdGhlIHdpbmRvdy4gSXQgaWdub3JlcyBhbnlcbiAgICogbWVzc2FnZXMgaGF2aW5nIGFuIG9yaWdpbiB0aGF0IGRvZXMgbm90IG1hdGNoIHRoZSBvcmlnaW5hbGx5IHN1cHBsaWVkXG4gICAqIHBhdHRlcm4uIEdpdmVuIGEgSlNPTiBvYmplY3Qgd2l0aCBvbmUgb2YgZ2V0LCBzZXQsIGRlbCBvciBnZXRLZXlzIGFzIHRoZVxuICAgKiBtZXRob2QsIHRoZSBmdW5jdGlvbiBwZXJmb3JtcyB0aGUgcmVxdWVzdGVkIGFjdGlvbiBhbmQgcmV0dXJucyBpdHMgcmVzdWx0LlxuICAgKlxuICAgKiBAcGFyYW0ge01lc3NhZ2VFdmVudH0gbWVzc2FnZSBBIG1lc3NhZ2UgdG8gYmUgcHJvY2Vzc2VkXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX2xpc3RlbmVyID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIHZhciBvcmlnaW4sIHRhcmdldE9yaWdpbiwgcmVxdWVzdCwgbWV0aG9kLCBlcnJvciwgcmVzdWx0LCByZXNwb25zZTtcblxuICAgIC8vIHBvc3RNZXNzYWdlIHJldHVybnMgdGhlIHN0cmluZyBcIm51bGxcIiBhcyB0aGUgb3JpZ2luIGZvciBcImZpbGU6Ly9cIlxuICAgIG9yaWdpbiA9IChtZXNzYWdlLm9yaWdpbiA9PT0gJ251bGwnKSA/ICdmaWxlOi8vJyA6IG1lc3NhZ2Uub3JpZ2luO1xuXG4gICAgLy8gSGFuZGxlIHBvbGxpbmcgZm9yIGEgcmVhZHkgbWVzc2FnZVxuICAgIGlmIChtZXNzYWdlLmRhdGEgPT09ICdjcm9zcy1zdG9yYWdlOnBvbGwnKSB7XG4gICAgICByZXR1cm4gd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSgnY3Jvc3Mtc3RvcmFnZTpyZWFkeScsIG1lc3NhZ2Uub3JpZ2luKTtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgdGhlIHJlYWR5IG1lc3NhZ2Ugd2hlbiB2aWV3aW5nIHRoZSBodWIgZGlyZWN0bHlcbiAgICBpZiAobWVzc2FnZS5kYXRhID09PSAnY3Jvc3Mtc3RvcmFnZTpyZWFkeScpIHJldHVybjtcblxuICAgIC8vIENoZWNrIHdoZXRoZXIgbWVzc2FnZS5kYXRhIGlzIGEgdmFsaWQganNvblxuICAgIHRyeSB7XG4gICAgICByZXF1ZXN0ID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIHdoZXRoZXIgcmVxdWVzdC5tZXRob2QgaXMgYSBzdHJpbmdcbiAgICBpZiAoIXJlcXVlc3QgfHwgdHlwZW9mIHJlcXVlc3QubWV0aG9kICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1ldGhvZCA9IHJlcXVlc3QubWV0aG9kLnNwbGl0KCdjcm9zcy1zdG9yYWdlOicpWzFdO1xuXG4gICAgaWYgKCFtZXRob2QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKCFDcm9zc1N0b3JhZ2VIdWIuX3Blcm1pdHRlZChvcmlnaW4sIG1ldGhvZCkpIHtcbiAgICAgIGVycm9yID0gJ0ludmFsaWQgcGVybWlzc2lvbnMgZm9yICcgKyBtZXRob2Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IENyb3NzU3RvcmFnZUh1YlsnXycgKyBtZXRob2RdKHJlcXVlc3QucGFyYW1zKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBlcnJvciA9IGVyci5tZXNzYWdlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3BvbnNlID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgaWQ6IHJlcXVlc3QuaWQsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgICByZXN1bHQ6IHJlc3VsdFxuICAgIH0pO1xuXG4gICAgLy8gcG9zdE1lc3NhZ2UgcmVxdWlyZXMgdGhhdCB0aGUgdGFyZ2V0IG9yaWdpbiBiZSBzZXQgdG8gXCIqXCIgZm9yIFwiZmlsZTovL1wiXG4gICAgdGFyZ2V0T3JpZ2luID0gKG9yaWdpbiA9PT0gJ2ZpbGU6Ly8nKSA/ICcqJyA6IG9yaWdpbjtcblxuICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UocmVzcG9uc2UsIHRhcmdldE9yaWdpbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciBvciBub3QgdGhlIHJlcXVlc3RlZCBtZXRob2QgaXNcbiAgICogcGVybWl0dGVkIGZvciB0aGUgZ2l2ZW4gb3JpZ2luLiBUaGUgYXJndW1lbnQgcGFzc2VkIHRvIG1ldGhvZCBpcyBleHBlY3RlZFxuICAgKiB0byBiZSBvbmUgb2YgJ2dldCcsICdzZXQnLCAnZGVsJyBvciAnZ2V0S2V5cycuXG4gICAqXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9IG9yaWdpbiBUaGUgb3JpZ2luIGZvciB3aGljaCB0byBkZXRlcm1pbmUgcGVybWlzc2lvbnNcbiAgICogQHBhcmFtICAge3N0cmluZ30gbWV0aG9kIFJlcXVlc3RlZCBhY3Rpb25cbiAgICogQHJldHVybnMge2Jvb2x9ICAgV2hldGhlciBvciBub3QgdGhlIHJlcXVlc3QgaXMgcGVybWl0dGVkXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX3Blcm1pdHRlZCA9IGZ1bmN0aW9uKG9yaWdpbiwgbWV0aG9kKSB7XG4gICAgdmFyIGF2YWlsYWJsZSwgaSwgZW50cnksIG1hdGNoO1xuXG4gICAgYXZhaWxhYmxlID0gWydnZXQnLCAnc2V0JywgJ2RlbCcsICdjbGVhcicsICdnZXRLZXlzJ107XG4gICAgaWYgKCFDcm9zc1N0b3JhZ2VIdWIuX2luQXJyYXkobWV0aG9kLCBhdmFpbGFibGUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IENyb3NzU3RvcmFnZUh1Yi5fcGVybWlzc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGVudHJ5ID0gQ3Jvc3NTdG9yYWdlSHViLl9wZXJtaXNzaW9uc1tpXTtcbiAgICAgIGlmICghKGVudHJ5Lm9yaWdpbiBpbnN0YW5jZW9mIFJlZ0V4cCkgfHwgIShlbnRyeS5hbGxvdyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbWF0Y2ggPSBlbnRyeS5vcmlnaW4udGVzdChvcmlnaW4pO1xuICAgICAgaWYgKG1hdGNoICYmIENyb3NzU3RvcmFnZUh1Yi5faW5BcnJheShtZXRob2QsIGVudHJ5LmFsbG93KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgYSBrZXkgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBBbiBvYmplY3Qgd2l0aCBrZXkgYW5kIHZhbHVlXG4gICAqL1xuICBDcm9zc1N0b3JhZ2VIdWIuX3NldCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShwYXJhbXMua2V5LCBwYXJhbXMudmFsdWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBY2NlcHRzIGFuIG9iamVjdCB3aXRoIGFuIGFycmF5IG9mIGtleXMgZm9yIHdoaWNoIHRvIHJldHJpZXZlIHRoZWlyIHZhbHVlcy5cbiAgICogUmV0dXJucyBhIHNpbmdsZSB2YWx1ZSBpZiBvbmx5IG9uZSBrZXkgd2FzIHN1cHBsaWVkLCBvdGhlcndpc2UgaXQgcmV0dXJuc1xuICAgKiBhbiBhcnJheS4gQW55IGtleXMgbm90IHNldCByZXN1bHQgaW4gYSBudWxsIGVsZW1lbnQgaW4gdGhlIHJlc3VsdGluZyBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtICAge29iamVjdH0gcGFyYW1zIEFuIG9iamVjdCB3aXRoIGFuIGFycmF5IG9mIGtleXNcbiAgICogQHJldHVybnMgeyp8KltdfSAgRWl0aGVyIGEgc2luZ2xlIHZhbHVlLCBvciBhbiBhcnJheVxuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9nZXQgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICB2YXIgc3RvcmFnZSwgcmVzdWx0LCBpLCB2YWx1ZTtcblxuICAgIHN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHBhcmFtcy5rZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IHN0b3JhZ2UuZ2V0SXRlbShwYXJhbXMua2V5c1tpXSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiAocmVzdWx0Lmxlbmd0aCA+IDEpID8gcmVzdWx0IDogcmVzdWx0WzBdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZWxldGVzIGFsbCBrZXlzIHNwZWNpZmllZCBpbiB0aGUgYXJyYXkgZm91bmQgYXQgcGFyYW1zLmtleXMuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgQW4gb2JqZWN0IHdpdGggYW4gYXJyYXkgb2Yga2V5c1xuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9kZWwgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtcy5rZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0ocGFyYW1zLmtleXNbaV0pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ2xlYXJzIGxvY2FsU3RvcmFnZS5cbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5fY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIGtleXMgc3RvcmVkIGluIGxvY2FsU3RvcmFnZS5cbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ1tdfSBUaGUgYXJyYXkgb2Yga2V5c1xuICAgKi9cbiAgQ3Jvc3NTdG9yYWdlSHViLl9nZXRLZXlzID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgdmFyIGksIGxlbmd0aCwga2V5cztcblxuICAgIGtleXMgPSBbXTtcbiAgICBsZW5ndGggPSB3aW5kb3cubG9jYWxTdG9yYWdlLmxlbmd0aDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5cy5wdXNoKHdpbmRvdy5sb2NhbFN0b3JhZ2Uua2V5KGkpKTtcbiAgICB9XG5cbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIHZhbHVlIGlzIHByZXNlbnQgaW4gdGhlIGFycmF5LiBDb25zaXN0cyBvZiBhblxuICAgKiBhbHRlcm5hdGl2ZSB0byBleHRlbmRpbmcgdGhlIGFycmF5IHByb3RvdHlwZSBmb3IgaW5kZXhPZiwgc2luY2UgaXQnc1xuICAgKiB1bmF2YWlsYWJsZSBmb3IgSUU4LlxuICAgKlxuICAgKiBAcGFyYW0gICB7Kn0gICAgdmFsdWUgVGhlIHZhbHVlIHRvIGZpbmRcbiAgICogQHBhcm1hICAge1tdKn0gIGFycmF5IFRoZSBhcnJheSBpbiB3aGljaCB0byBzZWFyY2hcbiAgICogQHJldHVybnMge2Jvb2x9IFdoZXRoZXIgb3Igbm90IHRoZSB2YWx1ZSB3YXMgZm91bmRcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5faW5BcnJheSA9IGZ1bmN0aW9uKHZhbHVlLCBhcnJheSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gYXJyYXlbaV0pIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvKipcbiAgICogQSBjcm9zcy1icm93c2VyIHZlcnNpb24gb2YgRGF0ZS5ub3cgY29tcGF0aWJsZSB3aXRoIElFOCB0aGF0IGF2b2lkc1xuICAgKiBtb2RpZnlpbmcgdGhlIERhdGUgb2JqZWN0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtpbnR9IFRoZSBjdXJyZW50IHRpbWVzdGFtcCBpbiBtaWxsaXNlY29uZHNcbiAgICovXG4gIENyb3NzU3RvcmFnZUh1Yi5fbm93ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZiBEYXRlLm5vdyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIERhdGUubm93KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBFeHBvcnQgZm9yIHZhcmlvdXMgZW52aXJvbm1lbnRzLlxuICAgKi9cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDcm9zc1N0b3JhZ2VIdWI7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZXhwb3J0cy5Dcm9zc1N0b3JhZ2VIdWIgPSBDcm9zc1N0b3JhZ2VIdWI7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBDcm9zc1N0b3JhZ2VIdWI7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5Dcm9zc1N0b3JhZ2VIdWIgPSBDcm9zc1N0b3JhZ2VIdWI7XG4gIH1cbn0odGhpcykpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIENyb3NzU3RvcmFnZUNsaWVudDogcmVxdWlyZSgnLi9jbGllbnQuanMnKSxcbiAgQ3Jvc3NTdG9yYWdlSHViOiAgICByZXF1aXJlKCcuL2h1Yi5qcycpXG59O1xuIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCl7XG4vKiFcbiAqIEBvdmVydmlldyBlczYtcHJvbWlzZSAtIGEgdGlueSBpbXBsZW1lbnRhdGlvbiBvZiBQcm9taXNlcy9BKy5cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE0IFllaHVkYSBLYXR6LCBUb20gRGFsZSwgU3RlZmFuIFBlbm5lciBhbmQgY29udHJpYnV0b3JzIChDb252ZXJzaW9uIHRvIEVTNiBBUEkgYnkgSmFrZSBBcmNoaWJhbGQpXG4gKiBAbGljZW5zZSAgIExpY2Vuc2VkIHVuZGVyIE1JVCBsaWNlbnNlXG4gKiAgICAgICAgICAgIFNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vc3RlZmFucGVubmVyL2VzNi1wcm9taXNlL21hc3Rlci9MSUNFTlNFXG4gKiBAdmVyc2lvbiAgIDQuMC41XG4gKi9cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgICAoZ2xvYmFsLkVTNlByb21pc2UgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG5cbnZhciBfaXNBcnJheSA9IHVuZGVmaW5lZDtcbmlmICghQXJyYXkuaXNBcnJheSkge1xuICBfaXNBcnJheSA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcbn0gZWxzZSB7XG4gIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbn1cblxudmFyIGlzQXJyYXkgPSBfaXNBcnJheTtcblxudmFyIGxlbiA9IDA7XG52YXIgdmVydHhOZXh0ID0gdW5kZWZpbmVkO1xudmFyIGN1c3RvbVNjaGVkdWxlckZuID0gdW5kZWZpbmVkO1xuXG52YXIgYXNhcCA9IGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICBxdWV1ZVtsZW5dID0gY2FsbGJhY2s7XG4gIHF1ZXVlW2xlbiArIDFdID0gYXJnO1xuICBsZW4gKz0gMjtcbiAgaWYgKGxlbiA9PT0gMikge1xuICAgIC8vIElmIGxlbiBpcyAyLCB0aGF0IG1lYW5zIHRoYXQgd2UgbmVlZCB0byBzY2hlZHVsZSBhbiBhc3luYyBmbHVzaC5cbiAgICAvLyBJZiBhZGRpdGlvbmFsIGNhbGxiYWNrcyBhcmUgcXVldWVkIGJlZm9yZSB0aGUgcXVldWUgaXMgZmx1c2hlZCwgdGhleVxuICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICBpZiAoY3VzdG9tU2NoZWR1bGVyRm4pIHtcbiAgICAgIGN1c3RvbVNjaGVkdWxlckZuKGZsdXNoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NoZWR1bGVGbHVzaCgpO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gc2V0U2NoZWR1bGVyKHNjaGVkdWxlRm4pIHtcbiAgY3VzdG9tU2NoZWR1bGVyRm4gPSBzY2hlZHVsZUZuO1xufVxuXG5mdW5jdGlvbiBzZXRBc2FwKGFzYXBGbikge1xuICBhc2FwID0gYXNhcEZuO1xufVxuXG52YXIgYnJvd3NlcldpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdW5kZWZpbmVkO1xudmFyIGJyb3dzZXJHbG9iYWwgPSBicm93c2VyV2luZG93IHx8IHt9O1xudmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBpc05vZGUgPSB0eXBlb2Ygc2VsZiA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICh7fSkudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xuXG4vLyB0ZXN0IGZvciB3ZWIgd29ya2VyIGJ1dCBub3QgaW4gSUUxMFxudmFyIGlzV29ya2VyID0gdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAndW5kZWZpbmVkJztcblxuLy8gbm9kZVxuZnVuY3Rpb24gdXNlTmV4dFRpY2soKSB7XG4gIC8vIG5vZGUgdmVyc2lvbiAwLjEwLnggZGlzcGxheXMgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdoZW4gbmV4dFRpY2sgaXMgdXNlZCByZWN1cnNpdmVseVxuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1am9qcy93aGVuL2lzc3Vlcy80MTAgZm9yIGRldGFpbHNcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gIH07XG59XG5cbi8vIHZlcnR4XG5mdW5jdGlvbiB1c2VWZXJ0eFRpbWVyKCkge1xuICBpZiAodHlwZW9mIHZlcnR4TmV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmVydHhOZXh0KGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbn1cblxuZnVuY3Rpb24gdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBub2RlLmRhdGEgPSBpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMjtcbiAgfTtcbn1cblxuLy8gd2ViIHdvcmtlclxuZnVuY3Rpb24gdXNlTWVzc2FnZUNoYW5uZWwoKSB7XG4gIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZmx1c2g7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gIC8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIGVzNi1wcm9taXNlIHdpbGwgYmUgdW5hZmZlY3RlZCBieVxuICAvLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbiAgdmFyIGdsb2JhbFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnbG9iYWxTZXRUaW1lb3V0KGZsdXNoLCAxKTtcbiAgfTtcbn1cblxudmFyIHF1ZXVlID0gbmV3IEFycmF5KDEwMDApO1xuZnVuY3Rpb24gZmx1c2goKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSBxdWV1ZVtpXTtcbiAgICB2YXIgYXJnID0gcXVldWVbaSArIDFdO1xuXG4gICAgY2FsbGJhY2soYXJnKTtcblxuICAgIHF1ZXVlW2ldID0gdW5kZWZpbmVkO1xuICAgIHF1ZXVlW2kgKyAxXSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxlbiA9IDA7XG59XG5cbmZ1bmN0aW9uIGF0dGVtcHRWZXJ0eCgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgciA9IHJlcXVpcmU7XG4gICAgdmFyIHZlcnR4ID0gcigndmVydHgnKTtcbiAgICB2ZXJ0eE5leHQgPSB2ZXJ0eC5ydW5Pbkxvb3AgfHwgdmVydHgucnVuT25Db250ZXh0O1xuICAgIHJldHVybiB1c2VWZXJ0eFRpbWVyKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdXNlU2V0VGltZW91dCgpO1xuICB9XG59XG5cbnZhciBzY2hlZHVsZUZsdXNoID0gdW5kZWZpbmVkO1xuLy8gRGVjaWRlIHdoYXQgYXN5bmMgbWV0aG9kIHRvIHVzZSB0byB0cmlnZ2VyaW5nIHByb2Nlc3Npbmcgb2YgcXVldWVkIGNhbGxiYWNrczpcbmlmIChpc05vZGUpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU5leHRUaWNrKCk7XG59IGVsc2UgaWYgKEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG59IGVsc2UgaWYgKGlzV29ya2VyKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VNZXNzYWdlQ2hhbm5lbCgpO1xufSBlbHNlIGlmIChicm93c2VyV2luZG93ID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IGF0dGVtcHRWZXJ0eCgpO1xufSBlbHNlIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZVNldFRpbWVvdXQoKTtcbn1cblxuZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICB2YXIgX2FyZ3VtZW50cyA9IGFyZ3VtZW50cztcblxuICB2YXIgcGFyZW50ID0gdGhpcztcblxuICB2YXIgY2hpbGQgPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcihub29wKTtcblxuICBpZiAoY2hpbGRbUFJPTUlTRV9JRF0gPT09IHVuZGVmaW5lZCkge1xuICAgIG1ha2VQcm9taXNlKGNoaWxkKTtcbiAgfVxuXG4gIHZhciBfc3RhdGUgPSBwYXJlbnQuX3N0YXRlO1xuXG4gIGlmIChfc3RhdGUpIHtcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNhbGxiYWNrID0gX2FyZ3VtZW50c1tfc3RhdGUgLSAxXTtcbiAgICAgIGFzYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gaW52b2tlQ2FsbGJhY2soX3N0YXRlLCBjaGlsZCwgY2FsbGJhY2ssIHBhcmVudC5fcmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pKCk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuLyoqXG4gIGBQcm9taXNlLnJlc29sdmVgIHJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgcmVzb2x2ZWQgd2l0aCB0aGVcbiAgcGFzc2VkIGB2YWx1ZWAuIEl0IGlzIHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZXNvbHZlKDEpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIHZhbHVlID09PSAxXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgxKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIHZhbHVlID09PSAxXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlc29sdmVcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FueX0gdmFsdWUgdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGhcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSBmdWxmaWxsZWQgd2l0aCB0aGUgZ2l2ZW5cbiAgYHZhbHVlYFxuKi9cbmZ1bmN0aW9uIHJlc29sdmUob2JqZWN0KSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QuY29uc3RydWN0b3IgPT09IENvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuICBfcmVzb2x2ZShwcm9taXNlLCBvYmplY3QpO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxudmFyIFBST01JU0VfSUQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMTYpO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxudmFyIFBFTkRJTkcgPSB2b2lkIDA7XG52YXIgRlVMRklMTEVEID0gMTtcbnZhciBSRUpFQ1RFRCA9IDI7XG5cbnZhciBHRVRfVEhFTl9FUlJPUiA9IG5ldyBFcnJvck9iamVjdCgpO1xuXG5mdW5jdGlvbiBzZWxmRnVsZmlsbG1lbnQoKSB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFwiWW91IGNhbm5vdCByZXNvbHZlIGEgcHJvbWlzZSB3aXRoIGl0c2VsZlwiKTtcbn1cblxuZnVuY3Rpb24gY2Fubm90UmV0dXJuT3duKCkge1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcignQSBwcm9taXNlcyBjYWxsYmFjayBjYW5ub3QgcmV0dXJuIHRoYXQgc2FtZSBwcm9taXNlLicpO1xufVxuXG5mdW5jdGlvbiBnZXRUaGVuKHByb21pc2UpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcHJvbWlzZS50aGVuO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIEdFVF9USEVOX0VSUk9SLmVycm9yID0gZXJyb3I7XG4gICAgcmV0dXJuIEdFVF9USEVOX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyeVRoZW4odGhlbiwgdmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcikge1xuICB0cnkge1xuICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSwgdGhlbikge1xuICBhc2FwKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgdmFyIHNlYWxlZCA9IGZhbHNlO1xuICAgIHZhciBlcnJvciA9IHRyeVRoZW4odGhlbiwgdGhlbmFibGUsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgaWYgKHRoZW5hYmxlICE9PSB2YWx1ZSkge1xuICAgICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICBpZiAoc2VhbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlYWxlZCA9IHRydWU7XG5cbiAgICAgIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xuXG4gICAgaWYgKCFzZWFsZWQgJiYgZXJyb3IpIHtcbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICB9XG4gIH0sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xuICBpZiAodGhlbmFibGUuX3N0YXRlID09PSBGVUxGSUxMRUQpIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICB9IGVsc2UgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICB9IGVsc2Uge1xuICAgIHN1YnNjcmliZSh0aGVuYWJsZSwgdW5kZWZpbmVkLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcmV0dXJuIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4kJCkge1xuICBpZiAobWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3RvciA9PT0gcHJvbWlzZS5jb25zdHJ1Y3RvciAmJiB0aGVuJCQgPT09IHRoZW4gJiYgbWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3Rvci5yZXNvbHZlID09PSByZXNvbHZlKSB7XG4gICAgaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoZW4kJCA9PT0gR0VUX1RIRU5fRVJST1IpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgR0VUX1RIRU5fRVJST1IuZXJyb3IpO1xuICAgIH0gZWxzZSBpZiAodGhlbiQkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoZW4kJCkpIHtcbiAgICAgIGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuJCQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIHNlbGZGdWxmaWxsbWVudCgpKTtcbiAgfSBlbHNlIGlmIChvYmplY3RPckZ1bmN0aW9uKHZhbHVlKSkge1xuICAgIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUsIGdldFRoZW4odmFsdWUpKTtcbiAgfSBlbHNlIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoUmVqZWN0aW9uKHByb21pc2UpIHtcbiAgaWYgKHByb21pc2UuX29uZXJyb3IpIHtcbiAgICBwcm9taXNlLl9vbmVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gIH1cblxuICBwdWJsaXNoKHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHByb21pc2UuX3Jlc3VsdCA9IHZhbHVlO1xuICBwcm9taXNlLl9zdGF0ZSA9IEZVTEZJTExFRDtcblxuICBpZiAocHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwcm9taXNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVqZWN0KHByb21pc2UsIHJlYXNvbikge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcHJvbWlzZS5fc3RhdGUgPSBSRUpFQ1RFRDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gcmVhc29uO1xuXG4gIGFzYXAocHVibGlzaFJlamVjdGlvbiwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICB2YXIgX3N1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgdmFyIGxlbmd0aCA9IF9zdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgcGFyZW50Ll9vbmVycm9yID0gbnVsbDtcblxuICBfc3Vic2NyaWJlcnNbbGVuZ3RoXSA9IGNoaWxkO1xuICBfc3Vic2NyaWJlcnNbbGVuZ3RoICsgRlVMRklMTEVEXSA9IG9uRnVsZmlsbG1lbnQ7XG4gIF9zdWJzY3JpYmVyc1tsZW5ndGggKyBSRUpFQ1RFRF0gPSBvblJlamVjdGlvbjtcblxuICBpZiAobGVuZ3RoID09PSAwICYmIHBhcmVudC5fc3RhdGUpIHtcbiAgICBhc2FwKHB1Ymxpc2gsIHBhcmVudCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVibGlzaChwcm9taXNlKSB7XG4gIHZhciBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzO1xuICB2YXIgc2V0dGxlZCA9IHByb21pc2UuX3N0YXRlO1xuXG4gIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgY2hpbGQgPSB1bmRlZmluZWQsXG4gICAgICBjYWxsYmFjayA9IHVuZGVmaW5lZCxcbiAgICAgIGRldGFpbCA9IHByb21pc2UuX3Jlc3VsdDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgY2hpbGQgPSBzdWJzY3JpYmVyc1tpXTtcbiAgICBjYWxsYmFjayA9IHN1YnNjcmliZXJzW2kgKyBzZXR0bGVkXTtcblxuICAgIGlmIChjaGlsZCkge1xuICAgICAgaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhkZXRhaWwpO1xuICAgIH1cbiAgfVxuXG4gIHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XG59XG5cbmZ1bmN0aW9uIEVycm9yT2JqZWN0KCkge1xuICB0aGlzLmVycm9yID0gbnVsbDtcbn1cblxudmFyIFRSWV9DQVRDSF9FUlJPUiA9IG5ldyBFcnJvck9iamVjdCgpO1xuXG5mdW5jdGlvbiB0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGRldGFpbCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xuICAgIHJldHVybiBUUllfQ0FUQ0hfRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgcHJvbWlzZSwgY2FsbGJhY2ssIGRldGFpbCkge1xuICB2YXIgaGFzQ2FsbGJhY2sgPSBpc0Z1bmN0aW9uKGNhbGxiYWNrKSxcbiAgICAgIHZhbHVlID0gdW5kZWZpbmVkLFxuICAgICAgZXJyb3IgPSB1bmRlZmluZWQsXG4gICAgICBzdWNjZWVkZWQgPSB1bmRlZmluZWQsXG4gICAgICBmYWlsZWQgPSB1bmRlZmluZWQ7XG5cbiAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgdmFsdWUgPSB0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gVFJZX0NBVENIX0VSUk9SKSB7XG4gICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgZXJyb3IgPSB2YWx1ZS5lcnJvcjtcbiAgICAgIHZhbHVlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgY2Fubm90UmV0dXJuT3duKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IGRldGFpbDtcbiAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgLy8gbm9vcFxuICB9IGVsc2UgaWYgKGhhc0NhbGxiYWNrICYmIHN1Y2NlZWRlZCkge1xuICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoZmFpbGVkKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IEZVTEZJTExFRCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBSRUpFQ1RFRCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplUHJvbWlzZShwcm9taXNlLCByZXNvbHZlcikge1xuICB0cnkge1xuICAgIHJlc29sdmVyKGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbHVlKSB7XG4gICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgZSk7XG4gIH1cbn1cblxudmFyIGlkID0gMDtcbmZ1bmN0aW9uIG5leHRJZCgpIHtcbiAgcmV0dXJuIGlkKys7XG59XG5cbmZ1bmN0aW9uIG1ha2VQcm9taXNlKHByb21pc2UpIHtcbiAgcHJvbWlzZVtQUk9NSVNFX0lEXSA9IGlkKys7XG4gIHByb21pc2UuX3N0YXRlID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9yZXN1bHQgPSB1bmRlZmluZWQ7XG4gIHByb21pc2UuX3N1YnNjcmliZXJzID0gW107XG59XG5cbmZ1bmN0aW9uIEVudW1lcmF0b3IoQ29uc3RydWN0b3IsIGlucHV0KSB7XG4gIHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgdGhpcy5wcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGlmICghdGhpcy5wcm9taXNlW1BST01JU0VfSURdKSB7XG4gICAgbWFrZVByb21pc2UodGhpcy5wcm9taXNlKTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5sZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgdGhpcy5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgdGhpcy5fcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcblxuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5sZW5ndGggfHwgMDtcbiAgICAgIHRoaXMuX2VudW1lcmF0ZSgpO1xuICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICBmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgX3JlamVjdCh0aGlzLnByb21pc2UsIHZhbGlkYXRpb25FcnJvcigpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0aW9uRXJyb3IoKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoJ0FycmF5IE1ldGhvZHMgbXVzdCBiZSBwcm92aWRlZCBhbiBBcnJheScpO1xufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICB2YXIgX2lucHV0ID0gdGhpcy5faW5wdXQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IHRoaXMuX3N0YXRlID09PSBQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHRoaXMuX2VhY2hFbnRyeShfaW5wdXRbaV0sIGkpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fZWFjaEVudHJ5ID0gZnVuY3Rpb24gKGVudHJ5LCBpKSB7XG4gIHZhciBjID0gdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvcjtcbiAgdmFyIHJlc29sdmUkJCA9IGMucmVzb2x2ZTtcblxuICBpZiAocmVzb2x2ZSQkID09PSByZXNvbHZlKSB7XG4gICAgdmFyIF90aGVuID0gZ2V0VGhlbihlbnRyeSk7XG5cbiAgICBpZiAoX3RoZW4gPT09IHRoZW4gJiYgZW50cnkuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgICB0aGlzLl9zZXR0bGVkQXQoZW50cnkuX3N0YXRlLCBpLCBlbnRyeS5fcmVzdWx0KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBfdGhlbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG4gICAgICB0aGlzLl9yZXN1bHRbaV0gPSBlbnRyeTtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFByb21pc2UpIHtcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IGMobm9vcCk7XG4gICAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIGVudHJ5LCBfdGhlbik7XG4gICAgICB0aGlzLl93aWxsU2V0dGxlQXQocHJvbWlzZSwgaSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChuZXcgYyhmdW5jdGlvbiAocmVzb2x2ZSQkKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlJCQoZW50cnkpO1xuICAgICAgfSksIGkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl93aWxsU2V0dGxlQXQocmVzb2x2ZSQkKGVudHJ5KSwgaSk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9zZXR0bGVkQXQgPSBmdW5jdGlvbiAoc3RhdGUsIGksIHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcy5wcm9taXNlO1xuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gUEVORElORykge1xuICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuXG4gICAgaWYgKHN0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl93aWxsU2V0dGxlQXQgPSBmdW5jdGlvbiAocHJvbWlzZSwgaSkge1xuICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgc3Vic2NyaWJlKHByb21pc2UsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIGVudW1lcmF0b3IuX3NldHRsZWRBdChGVUxGSUxMRUQsIGksIHZhbHVlKTtcbiAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoUkVKRUNURUQsIGksIHJlYXNvbik7XG4gIH0pO1xufTtcblxuLyoqXG4gIGBQcm9taXNlLmFsbGAgYWNjZXB0cyBhbiBhcnJheSBvZiBwcm9taXNlcywgYW5kIHJldHVybnMgYSBuZXcgcHJvbWlzZSB3aGljaFxuICBpcyBmdWxmaWxsZWQgd2l0aCBhbiBhcnJheSBvZiBmdWxmaWxsbWVudCB2YWx1ZXMgZm9yIHRoZSBwYXNzZWQgcHJvbWlzZXMsIG9yXG4gIHJlamVjdGVkIHdpdGggdGhlIHJlYXNvbiBvZiB0aGUgZmlyc3QgcGFzc2VkIHByb21pc2UgdG8gYmUgcmVqZWN0ZWQuIEl0IGNhc3RzIGFsbFxuICBlbGVtZW50cyBvZiB0aGUgcGFzc2VkIGl0ZXJhYmxlIHRvIHByb21pc2VzIGFzIGl0IHJ1bnMgdGhpcyBhbGdvcml0aG0uXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IHJlc29sdmUoMSk7XG4gIGxldCBwcm9taXNlMiA9IHJlc29sdmUoMik7XG4gIGxldCBwcm9taXNlMyA9IHJlc29sdmUoMyk7XG4gIGxldCBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBUaGUgYXJyYXkgaGVyZSB3b3VsZCBiZSBbIDEsIDIsIDMgXTtcbiAgfSk7XG4gIGBgYFxuXG4gIElmIGFueSBvZiB0aGUgYHByb21pc2VzYCBnaXZlbiB0byBgYWxsYCBhcmUgcmVqZWN0ZWQsIHRoZSBmaXJzdCBwcm9taXNlXG4gIHRoYXQgaXMgcmVqZWN0ZWQgd2lsbCBiZSBnaXZlbiBhcyBhbiBhcmd1bWVudCB0byB0aGUgcmV0dXJuZWQgcHJvbWlzZXMnc1xuICByZWplY3Rpb24gaGFuZGxlci4gRm9yIGV4YW1wbGU6XG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IHJlc29sdmUoMSk7XG4gIGxldCBwcm9taXNlMiA9IHJlamVjdChuZXcgRXJyb3IoXCIyXCIpKTtcbiAgbGV0IHByb21pc2UzID0gcmVqZWN0KG5ldyBFcnJvcihcIjNcIikpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnMgYmVjYXVzZSB0aGVyZSBhcmUgcmVqZWN0ZWQgcHJvbWlzZXMhXG4gIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgLy8gZXJyb3IubWVzc2FnZSA9PT0gXCIyXCJcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgYWxsXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBcnJheX0gZW50cmllcyBhcnJheSBvZiBwcm9taXNlc1xuICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYWxsIGBwcm9taXNlc2AgaGF2ZSBiZWVuXG4gIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQgaWYgYW55IG9mIHRoZW0gYmVjb21lIHJlamVjdGVkLlxuICBAc3RhdGljXG4qL1xuZnVuY3Rpb24gYWxsKGVudHJpZXMpIHtcbiAgcmV0dXJuIG5ldyBFbnVtZXJhdG9yKHRoaXMsIGVudHJpZXMpLnByb21pc2U7XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yYWNlYCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2ggaXMgc2V0dGxlZCBpbiB0aGUgc2FtZSB3YXkgYXMgdGhlXG4gIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIHNldHRsZS5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMicpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFByb21pc2UucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIHJlc3VsdCA9PT0gJ3Byb21pc2UgMicgYmVjYXVzZSBpdCB3YXMgcmVzb2x2ZWQgYmVmb3JlIHByb21pc2UxXG4gICAgLy8gd2FzIHJlc29sdmVkLlxuICB9KTtcbiAgYGBgXG5cbiAgYFByb21pc2UucmFjZWAgaXMgZGV0ZXJtaW5pc3RpYyBpbiB0aGF0IG9ubHkgdGhlIHN0YXRlIG9mIHRoZSBmaXJzdFxuICBzZXR0bGVkIHByb21pc2UgbWF0dGVycy4gRm9yIGV4YW1wbGUsIGV2ZW4gaWYgb3RoZXIgcHJvbWlzZXMgZ2l2ZW4gdG8gdGhlXG4gIGBwcm9taXNlc2AgYXJyYXkgYXJndW1lbnQgYXJlIHJlc29sdmVkLCBidXQgdGhlIGZpcnN0IHNldHRsZWQgcHJvbWlzZSBoYXNcbiAgYmVjb21lIHJlamVjdGVkIGJlZm9yZSB0aGUgb3RoZXIgcHJvbWlzZXMgYmVjYW1lIGZ1bGZpbGxlZCwgdGhlIHJldHVybmVkXG4gIHByb21pc2Ugd2lsbCBiZWNvbWUgcmVqZWN0ZWQ6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMScpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIGxldCBwcm9taXNlMiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcigncHJvbWlzZSAyJykpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFByb21pc2UucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgcHJvbWlzZSAyIGJlY2FtZSByZWplY3RlZCBiZWZvcmVcbiAgICAvLyBwcm9taXNlIDEgYmVjYW1lIGZ1bGZpbGxlZFxuICB9KTtcbiAgYGBgXG5cbiAgQW4gZXhhbXBsZSByZWFsLXdvcmxkIHVzZSBjYXNlIGlzIGltcGxlbWVudGluZyB0aW1lb3V0czpcblxuICBgYGBqYXZhc2NyaXB0XG4gIFByb21pc2UucmFjZShbYWpheCgnZm9vLmpzb24nKSwgdGltZW91dCg1MDAwKV0pXG4gIGBgYFxuXG4gIEBtZXRob2QgcmFjZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IHByb21pc2VzIGFycmF5IG9mIHByb21pc2VzIHRvIG9ic2VydmVcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2Ugd2hpY2ggc2V0dGxlcyBpbiB0aGUgc2FtZSB3YXkgYXMgdGhlIGZpcnN0IHBhc3NlZFxuICBwcm9taXNlIHRvIHNldHRsZS5cbiovXG5mdW5jdGlvbiByYWNlKGVudHJpZXMpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAoIWlzQXJyYXkoZW50cmllcykpIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIChfLCByZWplY3QpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byByYWNlLicpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgQ29uc3RydWN0b3IucmVzb2x2ZShlbnRyaWVzW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gIGBQcm9taXNlLnJlamVjdGAgcmV0dXJucyBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgcGFzc2VkIGByZWFzb25gLlxuICBJdCBpcyBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZWplY3RcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FueX0gcmVhc29uIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIHRoZSBnaXZlbiBgcmVhc29uYC5cbiovXG5mdW5jdGlvbiByZWplY3QocmVhc29uKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG4gIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5mdW5jdGlvbiBuZWVkc1Jlc29sdmVyKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGEgcmVzb2x2ZXIgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XG59XG5cbmZ1bmN0aW9uIG5lZWRzTmV3KCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnUHJvbWlzZSc6IFBsZWFzZSB1c2UgdGhlICduZXcnIG9wZXJhdG9yLCB0aGlzIG9iamVjdCBjb25zdHJ1Y3RvciBjYW5ub3QgYmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24uXCIpO1xufVxuXG4vKipcbiAgUHJvbWlzZSBvYmplY3RzIHJlcHJlc2VudCB0aGUgZXZlbnR1YWwgcmVzdWx0IG9mIGFuIGFzeW5jaHJvbm91cyBvcGVyYXRpb24uIFRoZVxuICBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLCB3aGljaFxuICByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZSByZWFzb25cbiAgd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG5cbiAgVGVybWlub2xvZ3lcbiAgLS0tLS0tLS0tLS1cblxuICAtIGBwcm9taXNlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gd2l0aCBhIGB0aGVuYCBtZXRob2Qgd2hvc2UgYmVoYXZpb3IgY29uZm9ybXMgdG8gdGhpcyBzcGVjaWZpY2F0aW9uLlxuICAtIGB0aGVuYWJsZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHRoYXQgZGVmaW5lcyBhIGB0aGVuYCBtZXRob2QuXG4gIC0gYHZhbHVlYCBpcyBhbnkgbGVnYWwgSmF2YVNjcmlwdCB2YWx1ZSAoaW5jbHVkaW5nIHVuZGVmaW5lZCwgYSB0aGVuYWJsZSwgb3IgYSBwcm9taXNlKS5cbiAgLSBgZXhjZXB0aW9uYCBpcyBhIHZhbHVlIHRoYXQgaXMgdGhyb3duIHVzaW5nIHRoZSB0aHJvdyBzdGF0ZW1lbnQuXG4gIC0gYHJlYXNvbmAgaXMgYSB2YWx1ZSB0aGF0IGluZGljYXRlcyB3aHkgYSBwcm9taXNlIHdhcyByZWplY3RlZC5cbiAgLSBgc2V0dGxlZGAgdGhlIGZpbmFsIHJlc3Rpbmcgc3RhdGUgb2YgYSBwcm9taXNlLCBmdWxmaWxsZWQgb3IgcmVqZWN0ZWQuXG5cbiAgQSBwcm9taXNlIGNhbiBiZSBpbiBvbmUgb2YgdGhyZWUgc3RhdGVzOiBwZW5kaW5nLCBmdWxmaWxsZWQsIG9yIHJlamVjdGVkLlxuXG4gIFByb21pc2VzIHRoYXQgYXJlIGZ1bGZpbGxlZCBoYXZlIGEgZnVsZmlsbG1lbnQgdmFsdWUgYW5kIGFyZSBpbiB0aGUgZnVsZmlsbGVkXG4gIHN0YXRlLiAgUHJvbWlzZXMgdGhhdCBhcmUgcmVqZWN0ZWQgaGF2ZSBhIHJlamVjdGlvbiByZWFzb24gYW5kIGFyZSBpbiB0aGVcbiAgcmVqZWN0ZWQgc3RhdGUuICBBIGZ1bGZpbGxtZW50IHZhbHVlIGlzIG5ldmVyIGEgdGhlbmFibGUuXG5cbiAgUHJvbWlzZXMgY2FuIGFsc28gYmUgc2FpZCB0byAqcmVzb2x2ZSogYSB2YWx1ZS4gIElmIHRoaXMgdmFsdWUgaXMgYWxzbyBhXG4gIHByb21pc2UsIHRoZW4gdGhlIG9yaWdpbmFsIHByb21pc2UncyBzZXR0bGVkIHN0YXRlIHdpbGwgbWF0Y2ggdGhlIHZhbHVlJ3NcbiAgc2V0dGxlZCBzdGF0ZS4gIFNvIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgcmVqZWN0cyB3aWxsXG4gIGl0c2VsZiByZWplY3QsIGFuZCBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdpbGxcbiAgaXRzZWxmIGZ1bGZpbGwuXG5cblxuICBCYXNpYyBVc2FnZTpcbiAgLS0tLS0tLS0tLS0tXG5cbiAgYGBganNcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAvLyBvbiBzdWNjZXNzXG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG5cbiAgICAvLyBvbiBmYWlsdXJlXG4gICAgcmVqZWN0KHJlYXNvbik7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIC8vIG9uIHJlamVjdGlvblxuICB9KTtcbiAgYGBgXG5cbiAgQWR2YW5jZWQgVXNhZ2U6XG4gIC0tLS0tLS0tLS0tLS0tLVxuXG4gIFByb21pc2VzIHNoaW5lIHdoZW4gYWJzdHJhY3RpbmcgYXdheSBhc3luY2hyb25vdXMgaW50ZXJhY3Rpb25zIHN1Y2ggYXNcbiAgYFhNTEh0dHBSZXF1ZXN0YHMuXG5cbiAgYGBganNcbiAgZnVuY3Rpb24gZ2V0SlNPTih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlcjtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHhoci5zZW5kKCk7XG5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IHRoaXMuRE9ORSkge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdnZXRKU09OOiBgJyArIHVybCArICdgIGZhaWxlZCB3aXRoIHN0YXR1czogWycgKyB0aGlzLnN0YXR1cyArICddJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEpTT04oJy9wb3N0cy5qc29uJykudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgLy8gb24gcmVqZWN0aW9uXG4gIH0pO1xuICBgYGBcblxuICBVbmxpa2UgY2FsbGJhY2tzLCBwcm9taXNlcyBhcmUgZ3JlYXQgY29tcG9zYWJsZSBwcmltaXRpdmVzLlxuXG4gIGBgYGpzXG4gIFByb21pc2UuYWxsKFtcbiAgICBnZXRKU09OKCcvcG9zdHMnKSxcbiAgICBnZXRKU09OKCcvY29tbWVudHMnKVxuICBdKS50aGVuKGZ1bmN0aW9uKHZhbHVlcyl7XG4gICAgdmFsdWVzWzBdIC8vID0+IHBvc3RzSlNPTlxuICAgIHZhbHVlc1sxXSAvLyA9PiBjb21tZW50c0pTT05cblxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0pO1xuICBgYGBcblxuICBAY2xhc3MgUHJvbWlzZVxuICBAcGFyYW0ge2Z1bmN0aW9ufSByZXNvbHZlclxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEBjb25zdHJ1Y3RvclxuKi9cbmZ1bmN0aW9uIFByb21pc2UocmVzb2x2ZXIpIHtcbiAgdGhpc1tQUk9NSVNFX0lEXSA9IG5leHRJZCgpO1xuICB0aGlzLl9yZXN1bHQgPSB0aGlzLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcblxuICBpZiAobm9vcCAhPT0gcmVzb2x2ZXIpIHtcbiAgICB0eXBlb2YgcmVzb2x2ZXIgIT09ICdmdW5jdGlvbicgJiYgbmVlZHNSZXNvbHZlcigpO1xuICAgIHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlID8gaW5pdGlhbGl6ZVByb21pc2UodGhpcywgcmVzb2x2ZXIpIDogbmVlZHNOZXcoKTtcbiAgfVxufVxuXG5Qcm9taXNlLmFsbCA9IGFsbDtcblByb21pc2UucmFjZSA9IHJhY2U7XG5Qcm9taXNlLnJlc29sdmUgPSByZXNvbHZlO1xuUHJvbWlzZS5yZWplY3QgPSByZWplY3Q7XG5Qcm9taXNlLl9zZXRTY2hlZHVsZXIgPSBzZXRTY2hlZHVsZXI7XG5Qcm9taXNlLl9zZXRBc2FwID0gc2V0QXNhcDtcblByb21pc2UuX2FzYXAgPSBhc2FwO1xuXG5Qcm9taXNlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFByb21pc2UsXG5cbiAgLyoqXG4gICAgVGhlIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsXG4gICAgd2hpY2ggcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGVcbiAgICByZWFzb24gd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgLy8gdXNlciBpcyBhdmFpbGFibGVcbiAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gdXNlciBpcyB1bmF2YWlsYWJsZSwgYW5kIHlvdSBhcmUgZ2l2ZW4gdGhlIHJlYXNvbiB3aHlcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQ2hhaW5pbmdcbiAgICAtLS0tLS0tLVxuICBcbiAgICBUaGUgcmV0dXJuIHZhbHVlIG9mIGB0aGVuYCBpcyBpdHNlbGYgYSBwcm9taXNlLiAgVGhpcyBzZWNvbmQsICdkb3duc3RyZWFtJ1xuICAgIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmaXJzdCBwcm9taXNlJ3MgZnVsZmlsbG1lbnRcbiAgICBvciByZWplY3Rpb24gaGFuZGxlciwgb3IgcmVqZWN0ZWQgaWYgdGhlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VyLm5hbWU7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcmV0dXJuICdkZWZhdWx0IG5hbWUnO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHVzZXJOYW1lKSB7XG4gICAgICAvLyBJZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHVzZXJOYW1lYCB3aWxsIGJlIHRoZSB1c2VyJ3MgbmFtZSwgb3RoZXJ3aXNlIGl0XG4gICAgICAvLyB3aWxsIGJlIGAnZGVmYXVsdCBuYW1lJ2BcbiAgICB9KTtcbiAgXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jyk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jyk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBpZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHJlYXNvbmAgd2lsbCBiZSAnRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknLlxuICAgICAgLy8gSWYgYGZpbmRVc2VyYCByZWplY3RlZCwgYHJlYXNvbmAgd2lsbCBiZSAnYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScuXG4gICAgfSk7XG4gICAgYGBgXG4gICAgSWYgdGhlIGRvd25zdHJlYW0gcHJvbWlzZSBkb2VzIG5vdCBzcGVjaWZ5IGEgcmVqZWN0aW9uIGhhbmRsZXIsIHJlamVjdGlvbiByZWFzb25zIHdpbGwgYmUgcHJvcGFnYXRlZCBmdXJ0aGVyIGRvd25zdHJlYW0uXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICB0aHJvdyBuZXcgUGVkYWdvZ2ljYWxFeGNlcHRpb24oJ1Vwc3RyZWFtIGVycm9yJyk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIFRoZSBgUGVkZ2Fnb2NpYWxFeGNlcHRpb25gIGlzIHByb3BhZ2F0ZWQgYWxsIHRoZSB3YXkgZG93biB0byBoZXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEFzc2ltaWxhdGlvblxuICAgIC0tLS0tLS0tLS0tLVxuICBcbiAgICBTb21ldGltZXMgdGhlIHZhbHVlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSB0byBhIGRvd25zdHJlYW0gcHJvbWlzZSBjYW4gb25seSBiZVxuICAgIHJldHJpZXZlZCBhc3luY2hyb25vdXNseS4gVGhpcyBjYW4gYmUgYWNoaWV2ZWQgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiB0aGVcbiAgICBmdWxmaWxsbWVudCBvciByZWplY3Rpb24gaGFuZGxlci4gVGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIHRoZW4gYmUgcGVuZGluZ1xuICAgIHVudGlsIHRoZSByZXR1cm5lZCBwcm9taXNlIGlzIHNldHRsZWQuIFRoaXMgaXMgY2FsbGVkICphc3NpbWlsYXRpb24qLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAvLyBUaGUgdXNlcidzIGNvbW1lbnRzIGFyZSBub3cgYXZhaWxhYmxlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIElmIHRoZSBhc3NpbWxpYXRlZCBwcm9taXNlIHJlamVjdHMsIHRoZW4gdGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIGFsc28gcmVqZWN0LlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIGZ1bGZpbGxzLCB3ZSdsbCBoYXZlIHRoZSB2YWx1ZSBoZXJlXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCByZWplY3RzLCB3ZSdsbCBoYXZlIHRoZSByZWFzb24gaGVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBTaW1wbGUgRXhhbXBsZVxuICAgIC0tLS0tLS0tLS0tLS0tXG4gIFxuICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGxldCByZXN1bHQ7XG4gIFxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBmaW5kUmVzdWx0KCk7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9XG4gICAgYGBgXG4gIFxuICAgIEVycmJhY2sgRXhhbXBsZVxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRSZXN1bHQoZnVuY3Rpb24ocmVzdWx0LCBlcnIpe1xuICAgICAgaWYgKGVycikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFByb21pc2UgRXhhbXBsZTtcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGZpbmRSZXN1bHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQWR2YW5jZWQgRXhhbXBsZVxuICAgIC0tLS0tLS0tLS0tLS0tXG4gIFxuICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGxldCBhdXRob3IsIGJvb2tzO1xuICBcbiAgICB0cnkge1xuICAgICAgYXV0aG9yID0gZmluZEF1dGhvcigpO1xuICAgICAgYm9va3MgID0gZmluZEJvb2tzQnlBdXRob3IoYXV0aG9yKTtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH1cbiAgICBgYGBcbiAgXG4gICAgRXJyYmFjayBFeGFtcGxlXG4gIFxuICAgIGBgYGpzXG4gIFxuICAgIGZ1bmN0aW9uIGZvdW5kQm9va3MoYm9va3MpIHtcbiAgXG4gICAgfVxuICBcbiAgICBmdW5jdGlvbiBmYWlsdXJlKHJlYXNvbikge1xuICBcbiAgICB9XG4gIFxuICAgIGZpbmRBdXRob3IoZnVuY3Rpb24oYXV0aG9yLCBlcnIpe1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmluZEJvb29rc0J5QXV0aG9yKGF1dGhvciwgZnVuY3Rpb24oYm9va3MsIGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvdW5kQm9va3MoYm9va3MpO1xuICAgICAgICAgICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAgICAgICAgIGZhaWx1cmUocmVhc29uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH1cbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgUHJvbWlzZSBFeGFtcGxlO1xuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgZmluZEF1dGhvcigpLlxuICAgICAgdGhlbihmaW5kQm9va3NCeUF1dGhvcikuXG4gICAgICB0aGVuKGZ1bmN0aW9uKGJvb2tzKXtcbiAgICAgICAgLy8gZm91bmQgYm9va3NcbiAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQG1ldGhvZCB0aGVuXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxmaWxsZWRcbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGVkXG4gICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG4gIHRoZW46IHRoZW4sXG5cbiAgLyoqXG4gICAgYGNhdGNoYCBpcyBzaW1wbHkgc3VnYXIgZm9yIGB0aGVuKHVuZGVmaW5lZCwgb25SZWplY3Rpb24pYCB3aGljaCBtYWtlcyBpdCB0aGUgc2FtZVxuICAgIGFzIHRoZSBjYXRjaCBibG9jayBvZiBhIHRyeS9jYXRjaCBzdGF0ZW1lbnQuXG4gIFxuICAgIGBgYGpzXG4gICAgZnVuY3Rpb24gZmluZEF1dGhvcigpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZG4ndCBmaW5kIHRoYXQgYXV0aG9yJyk7XG4gICAgfVxuICBcbiAgICAvLyBzeW5jaHJvbm91c1xuICAgIHRyeSB7XG4gICAgICBmaW5kQXV0aG9yKCk7XG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfVxuICBcbiAgICAvLyBhc3luYyB3aXRoIHByb21pc2VzXG4gICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBAbWV0aG9kIGNhdGNoXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cbiAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cbiAgJ2NhdGNoJzogZnVuY3Rpb24gX2NhdGNoKG9uUmVqZWN0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICAgIHZhciBsb2NhbCA9IHVuZGVmaW5lZDtcblxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsb2NhbCA9IGdsb2JhbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsb2NhbCA9IHNlbGY7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsID0gRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5ZmlsbCBmYWlsZWQgYmVjYXVzZSBnbG9iYWwgb2JqZWN0IGlzIHVuYXZhaWxhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBQID0gbG9jYWwuUHJvbWlzZTtcblxuICAgIGlmIChQKSB7XG4gICAgICAgIHZhciBwcm9taXNlVG9TdHJpbmcgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvbWlzZVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFAucmVzb2x2ZSgpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gc2lsZW50bHkgaWdub3JlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb21pc2VUb1N0cmluZyA9PT0gJ1tvYmplY3QgUHJvbWlzZV0nICYmICFQLmNhc3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvY2FsLlByb21pc2UgPSBQcm9taXNlO1xufVxuXG4vLyBTdHJhbmdlIGNvbXBhdC4uXG5Qcm9taXNlLnBvbHlmaWxsID0gcG9seWZpbGw7XG5Qcm9taXNlLlByb21pc2UgPSBQcm9taXNlO1xuXG5yZXR1cm4gUHJvbWlzZTtcblxufSkpKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJyksdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlsY3pZdGNISnZiV2x6WlM5a2FYTjBMMlZ6Tmkxd2NtOXRhWE5sTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaUZjYmlBcUlFQnZkbVZ5ZG1sbGR5Qmxjell0Y0hKdmJXbHpaU0F0SUdFZ2RHbHVlU0JwYlhCc1pXMWxiblJoZEdsdmJpQnZaaUJRY205dGFYTmxjeTlCS3k1Y2JpQXFJRUJqYjNCNWNtbG5hSFFnUTI5d2VYSnBaMmgwSUNoaktTQXlNREUwSUZsbGFIVmtZU0JMWVhSNkxDQlViMjBnUkdGc1pTd2dVM1JsWm1GdUlGQmxibTVsY2lCaGJtUWdZMjl1ZEhKcFluVjBiM0p6SUNoRGIyNTJaWEp6YVc5dUlIUnZJRVZUTmlCQlVFa2dZbmtnU21GclpTQkJjbU5vYVdKaGJHUXBYRzRnS2lCQWJHbGpaVzV6WlNBZ0lFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQnNhV05sYm5ObFhHNGdLaUFnSUNBZ0lDQWdJQ0FnSUZObFpTQm9kSFJ3Y3pvdkwzSmhkeTVuYVhSb2RXSjFjMlZ5WTI5dWRHVnVkQzVqYjIwdmMzUmxabUZ1Y0dWdWJtVnlMMlZ6Tmkxd2NtOXRhWE5sTDIxaGMzUmxjaTlNU1VORlRsTkZYRzRnS2lCQWRtVnljMmx2YmlBZ0lEUXVNQzQxWEc0Z0tpOWNibHh1S0daMWJtTjBhVzl1SUNobmJHOWlZV3dzSUdaaFkzUnZjbmtwSUh0Y2JpQWdJQ0IwZVhCbGIyWWdaWGh3YjNKMGN5QTlQVDBnSjI5aWFtVmpkQ2NnSmlZZ2RIbHdaVzltSUcxdlpIVnNaU0FoUFQwZ0ozVnVaR1ZtYVc1bFpDY2dQeUJ0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR1poWTNSdmNua29LU0E2WEc0Z0lDQWdkSGx3Wlc5bUlHUmxabWx1WlNBOVBUMGdKMloxYm1OMGFXOXVKeUFtSmlCa1pXWnBibVV1WVcxa0lEOGdaR1ZtYVc1bEtHWmhZM1J2Y25rcElEcGNiaUFnSUNBb1oyeHZZbUZzTGtWVE5sQnliMjFwYzJVZ1BTQm1ZV04wYjNKNUtDa3BPMXh1ZlNoMGFHbHpMQ0FvWm5WdVkzUnBiMjRnS0NrZ2V5QW5kWE5sSUhOMGNtbGpkQ2M3WEc1Y2JtWjFibU4wYVc5dUlHOWlhbVZqZEU5eVJuVnVZM1JwYjI0b2VDa2dlMXh1SUNCeVpYUjFjbTRnZEhsd1pXOW1JSGdnUFQwOUlDZG1kVzVqZEdsdmJpY2dmSHdnZEhsd1pXOW1JSGdnUFQwOUlDZHZZbXBsWTNRbklDWW1JSGdnSVQwOUlHNTFiR3c3WEc1OVhHNWNibVoxYm1OMGFXOXVJR2x6Um5WdVkzUnBiMjRvZUNrZ2UxeHVJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlIZ2dQVDA5SUNkbWRXNWpkR2x2YmljN1hHNTlYRzVjYm5aaGNpQmZhWE5CY25KaGVTQTlJSFZ1WkdWbWFXNWxaRHRjYm1sbUlDZ2hRWEp5WVhrdWFYTkJjbkpoZVNrZ2UxeHVJQ0JmYVhOQmNuSmhlU0E5SUdaMWJtTjBhVzl1SUNoNEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUU5aWFtVmpkQzV3Y205MGIzUjVjR1V1ZEc5VGRISnBibWN1WTJGc2JDaDRLU0E5UFQwZ0oxdHZZbXBsWTNRZ1FYSnlZWGxkSnp0Y2JpQWdmVHRjYm4wZ1pXeHpaU0I3WEc0Z0lGOXBjMEZ5Y21GNUlEMGdRWEp5WVhrdWFYTkJjbkpoZVR0Y2JuMWNibHh1ZG1GeUlHbHpRWEp5WVhrZ1BTQmZhWE5CY25KaGVUdGNibHh1ZG1GeUlHeGxiaUE5SURBN1hHNTJZWElnZG1WeWRIaE9aWGgwSUQwZ2RXNWtaV1pwYm1Wa08xeHVkbUZ5SUdOMWMzUnZiVk5qYUdWa2RXeGxja1p1SUQwZ2RXNWtaV1pwYm1Wa08xeHVYRzUyWVhJZ1lYTmhjQ0E5SUdaMWJtTjBhVzl1SUdGellYQW9ZMkZzYkdKaFkyc3NJR0Z5WnlrZ2UxeHVJQ0J4ZFdWMVpWdHNaVzVkSUQwZ1kyRnNiR0poWTJzN1hHNGdJSEYxWlhWbFcyeGxiaUFySURGZElEMGdZWEpuTzF4dUlDQnNaVzRnS3owZ01qdGNiaUFnYVdZZ0tHeGxiaUE5UFQwZ01pa2dlMXh1SUNBZ0lDOHZJRWxtSUd4bGJpQnBjeUF5TENCMGFHRjBJRzFsWVc1eklIUm9ZWFFnZDJVZ2JtVmxaQ0IwYnlCelkyaGxaSFZzWlNCaGJpQmhjM2x1WXlCbWJIVnphQzVjYmlBZ0lDQXZMeUJKWmlCaFpHUnBkR2x2Ym1Gc0lHTmhiR3hpWVdOcmN5QmhjbVVnY1hWbGRXVmtJR0psWm05eVpTQjBhR1VnY1hWbGRXVWdhWE1nWm14MWMyaGxaQ3dnZEdobGVWeHVJQ0FnSUM4dklIZHBiR3dnWW1VZ2NISnZZMlZ6YzJWa0lHSjVJSFJvYVhNZ1pteDFjMmdnZEdoaGRDQjNaU0JoY21VZ2MyTm9aV1IxYkdsdVp5NWNiaUFnSUNCcFppQW9ZM1Z6ZEc5dFUyTm9aV1IxYkdWeVJtNHBJSHRjYmlBZ0lDQWdJR04xYzNSdmJWTmphR1ZrZFd4bGNrWnVLR1pzZFhOb0tUdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnYzJOb1pXUjFiR1ZHYkhWemFDZ3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dWZUdGNibHh1Wm5WdVkzUnBiMjRnYzJWMFUyTm9aV1IxYkdWeUtITmphR1ZrZFd4bFJtNHBJSHRjYmlBZ1kzVnpkRzl0VTJOb1pXUjFiR1Z5Um00Z1BTQnpZMmhsWkhWc1pVWnVPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQnpaWFJCYzJGd0tHRnpZWEJHYmlrZ2UxeHVJQ0JoYzJGd0lEMGdZWE5oY0VadU8xeHVmVnh1WEc1MllYSWdZbkp2ZDNObGNsZHBibVJ2ZHlBOUlIUjVjR1Z2WmlCM2FXNWtiM2NnSVQwOUlDZDFibVJsWm1sdVpXUW5JRDhnZDJsdVpHOTNJRG9nZFc1a1pXWnBibVZrTzF4dWRtRnlJR0p5YjNkelpYSkhiRzlpWVd3Z1BTQmljbTkzYzJWeVYybHVaRzkzSUh4OElIdDlPMXh1ZG1GeUlFSnliM2R6WlhKTmRYUmhkR2x2Yms5aWMyVnlkbVZ5SUQwZ1luSnZkM05sY2tkc2IySmhiQzVOZFhSaGRHbHZiazlpYzJWeWRtVnlJSHg4SUdKeWIzZHpaWEpIYkc5aVlXd3VWMlZpUzJsMFRYVjBZWFJwYjI1UFluTmxjblpsY2p0Y2JuWmhjaUJwYzA1dlpHVWdQU0IwZVhCbGIyWWdjMlZzWmlBOVBUMGdKM1Z1WkdWbWFXNWxaQ2NnSmlZZ2RIbHdaVzltSUhCeWIyTmxjM01nSVQwOUlDZDFibVJsWm1sdVpXUW5JQ1ltSUNoN2ZTa3VkRzlUZEhKcGJtY3VZMkZzYkNod2NtOWpaWE56S1NBOVBUMGdKMXR2WW1wbFkzUWdjSEp2WTJWemMxMG5PMXh1WEc0dkx5QjBaWE4wSUdadmNpQjNaV0lnZDI5eWEyVnlJR0oxZENCdWIzUWdhVzRnU1VVeE1GeHVkbUZ5SUdselYyOXlhMlZ5SUQwZ2RIbHdaVzltSUZWcGJuUTRRMnhoYlhCbFpFRnljbUY1SUNFOVBTQW5kVzVrWldacGJtVmtKeUFtSmlCMGVYQmxiMllnYVcxd2IzSjBVMk55YVhCMGN5QWhQVDBnSjNWdVpHVm1hVzVsWkNjZ0ppWWdkSGx3Wlc5bUlFMWxjM05oWjJWRGFHRnVibVZzSUNFOVBTQW5kVzVrWldacGJtVmtKenRjYmx4dUx5OGdibTlrWlZ4dVpuVnVZM1JwYjI0Z2RYTmxUbVY0ZEZScFkyc29LU0I3WEc0Z0lDOHZJRzV2WkdVZ2RtVnljMmx2YmlBd0xqRXdMbmdnWkdsemNHeGhlWE1nWVNCa1pYQnlaV05oZEdsdmJpQjNZWEp1YVc1bklIZG9aVzRnYm1WNGRGUnBZMnNnYVhNZ2RYTmxaQ0J5WldOMWNuTnBkbVZzZVZ4dUlDQXZMeUJ6WldVZ2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwyTjFhbTlxY3k5M2FHVnVMMmx6YzNWbGN5ODBNVEFnWm05eUlHUmxkR0ZwYkhOY2JpQWdjbVYwZFhKdUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2NISnZZMlZ6Y3k1dVpYaDBWR2xqYXlobWJIVnphQ2s3WEc0Z0lIMDdYRzU5WEc1Y2JpOHZJSFpsY25SNFhHNW1kVzVqZEdsdmJpQjFjMlZXWlhKMGVGUnBiV1Z5S0NrZ2UxeHVJQ0JwWmlBb2RIbHdaVzltSUhabGNuUjRUbVY0ZENBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnZG1WeWRIaE9aWGgwS0dac2RYTm9LVHRjYmlBZ0lDQjlPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSFZ6WlZObGRGUnBiV1Z2ZFhRb0tUdGNibjFjYmx4dVpuVnVZM1JwYjI0Z2RYTmxUWFYwWVhScGIyNVBZbk5sY25abGNpZ3BJSHRjYmlBZ2RtRnlJR2wwWlhKaGRHbHZibk1nUFNBd08xeHVJQ0IyWVhJZ2IySnpaWEoyWlhJZ1BTQnVaWGNnUW5KdmQzTmxjazExZEdGMGFXOXVUMkp6WlhKMlpYSW9abXgxYzJncE8xeHVJQ0IyWVhJZ2JtOWtaU0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVlJsZUhST2IyUmxLQ2NuS1R0Y2JpQWdiMkp6WlhKMlpYSXViMkp6WlhKMlpTaHViMlJsTENCN0lHTm9ZWEpoWTNSbGNrUmhkR0U2SUhSeWRXVWdmU2s3WEc1Y2JpQWdjbVYwZFhKdUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnViMlJsTG1SaGRHRWdQU0JwZEdWeVlYUnBiMjV6SUQwZ0t5dHBkR1Z5WVhScGIyNXpJQ1VnTWp0Y2JpQWdmVHRjYm4xY2JseHVMeThnZDJWaUlIZHZjbXRsY2x4dVpuVnVZM1JwYjI0Z2RYTmxUV1Z6YzJGblpVTm9ZVzV1Wld3b0tTQjdYRzRnSUhaaGNpQmphR0Z1Ym1Wc0lEMGdibVYzSUUxbGMzTmhaMlZEYUdGdWJtVnNLQ2s3WEc0Z0lHTm9ZVzV1Wld3dWNHOXlkREV1YjI1dFpYTnpZV2RsSUQwZ1pteDFjMmc3WEc0Z0lISmxkSFZ5YmlCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUdOb1lXNXVaV3d1Y0c5eWRESXVjRzl6ZEUxbGMzTmhaMlVvTUNrN1hHNGdJSDA3WEc1OVhHNWNibVoxYm1OMGFXOXVJSFZ6WlZObGRGUnBiV1Z2ZFhRb0tTQjdYRzRnSUM4dklGTjBiM0psSUhObGRGUnBiV1Z2ZFhRZ2NtVm1aWEpsYm1ObElITnZJR1Z6Tmkxd2NtOXRhWE5sSUhkcGJHd2dZbVVnZFc1aFptWmxZM1JsWkNCaWVWeHVJQ0F2THlCdmRHaGxjaUJqYjJSbElHMXZaR2xtZVdsdVp5QnpaWFJVYVcxbGIzVjBJQ2hzYVd0bElITnBibTl1TG5WelpVWmhhMlZVYVcxbGNuTW9LU2xjYmlBZ2RtRnlJR2RzYjJKaGJGTmxkRlJwYldWdmRYUWdQU0J6WlhSVWFXMWxiM1YwTzF4dUlDQnlaWFIxY200Z1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCbmJHOWlZV3hUWlhSVWFXMWxiM1YwS0dac2RYTm9MQ0F4S1R0Y2JpQWdmVHRjYm4xY2JseHVkbUZ5SUhGMVpYVmxJRDBnYm1WM0lFRnljbUY1S0RFd01EQXBPMXh1Wm5WdVkzUnBiMjRnWm14MWMyZ29LU0I3WEc0Z0lHWnZjaUFvZG1GeUlHa2dQU0F3T3lCcElEd2diR1Z1T3lCcElDczlJRElwSUh0Y2JpQWdJQ0IyWVhJZ1kyRnNiR0poWTJzZ1BTQnhkV1YxWlZ0cFhUdGNiaUFnSUNCMllYSWdZWEpuSUQwZ2NYVmxkV1ZiYVNBcklERmRPMXh1WEc0Z0lDQWdZMkZzYkdKaFkyc29ZWEpuS1R0Y2JseHVJQ0FnSUhGMVpYVmxXMmxkSUQwZ2RXNWtaV1pwYm1Wa08xeHVJQ0FnSUhGMVpYVmxXMmtnS3lBeFhTQTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ2ZWeHVYRzRnSUd4bGJpQTlJREE3WEc1OVhHNWNibVoxYm1OMGFXOXVJR0YwZEdWdGNIUldaWEowZUNncElIdGNiaUFnZEhKNUlIdGNiaUFnSUNCMllYSWdjaUE5SUhKbGNYVnBjbVU3WEc0Z0lDQWdkbUZ5SUhabGNuUjRJRDBnY2lnbmRtVnlkSGduS1R0Y2JpQWdJQ0IyWlhKMGVFNWxlSFFnUFNCMlpYSjBlQzV5ZFc1UGJreHZiM0FnZkh3Z2RtVnlkSGd1Y25WdVQyNURiMjUwWlhoME8xeHVJQ0FnSUhKbGRIVnliaUIxYzJWV1pYSjBlRlJwYldWeUtDazdYRzRnSUgwZ1kyRjBZMmdnS0dVcElIdGNiaUFnSUNCeVpYUjFjbTRnZFhObFUyVjBWR2x0Wlc5MWRDZ3BPMXh1SUNCOVhHNTlYRzVjYm5aaGNpQnpZMmhsWkhWc1pVWnNkWE5vSUQwZ2RXNWtaV1pwYm1Wa08xeHVMeThnUkdWamFXUmxJSGRvWVhRZ1lYTjVibU1nYldWMGFHOWtJSFJ2SUhWelpTQjBieUIwY21sbloyVnlhVzVuSUhCeWIyTmxjM05wYm1jZ2IyWWdjWFZsZFdWa0lHTmhiR3hpWVdOcmN6cGNibWxtSUNocGMwNXZaR1VwSUh0Y2JpQWdjMk5vWldSMWJHVkdiSFZ6YUNBOUlIVnpaVTVsZUhSVWFXTnJLQ2s3WEc1OUlHVnNjMlVnYVdZZ0tFSnliM2R6WlhKTmRYUmhkR2x2Yms5aWMyVnlkbVZ5S1NCN1hHNGdJSE5qYUdWa2RXeGxSbXgxYzJnZ1BTQjFjMlZOZFhSaGRHbHZiazlpYzJWeWRtVnlLQ2s3WEc1OUlHVnNjMlVnYVdZZ0tHbHpWMjl5YTJWeUtTQjdYRzRnSUhOamFHVmtkV3hsUm14MWMyZ2dQU0IxYzJWTlpYTnpZV2RsUTJoaGJtNWxiQ2dwTzF4dWZTQmxiSE5sSUdsbUlDaGljbTkzYzJWeVYybHVaRzkzSUQwOVBTQjFibVJsWm1sdVpXUWdKaVlnZEhsd1pXOW1JSEpsY1hWcGNtVWdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnYzJOb1pXUjFiR1ZHYkhWemFDQTlJR0YwZEdWdGNIUldaWEowZUNncE8xeHVmU0JsYkhObElIdGNiaUFnYzJOb1pXUjFiR1ZHYkhWemFDQTlJSFZ6WlZObGRGUnBiV1Z2ZFhRb0tUdGNibjFjYmx4dVpuVnVZM1JwYjI0Z2RHaGxiaWh2YmtaMWJHWnBiR3h0Wlc1MExDQnZibEpsYW1WamRHbHZiaWtnZTF4dUlDQjJZWElnWDJGeVozVnRaVzUwY3lBOUlHRnlaM1Z0Wlc1MGN6dGNibHh1SUNCMllYSWdjR0Z5Wlc1MElEMGdkR2hwY3p0Y2JseHVJQ0IyWVhJZ1kyaHBiR1FnUFNCdVpYY2dkR2hwY3k1amIyNXpkSEoxWTNSdmNpaHViMjl3S1R0Y2JseHVJQ0JwWmlBb1kyaHBiR1JiVUZKUFRVbFRSVjlKUkYwZ1BUMDlJSFZ1WkdWbWFXNWxaQ2tnZTF4dUlDQWdJRzFoYTJWUWNtOXRhWE5sS0dOb2FXeGtLVHRjYmlBZ2ZWeHVYRzRnSUhaaGNpQmZjM1JoZEdVZ1BTQndZWEpsYm5RdVgzTjBZWFJsTzF4dVhHNGdJR2xtSUNoZmMzUmhkR1VwSUh0Y2JpQWdJQ0FvWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ2RtRnlJR05oYkd4aVlXTnJJRDBnWDJGeVozVnRaVzUwYzF0ZmMzUmhkR1VnTFNBeFhUdGNiaUFnSUNBZ0lHRnpZWEFvWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2FXNTJiMnRsUTJGc2JHSmhZMnNvWDNOMFlYUmxMQ0JqYUdsc1pDd2dZMkZzYkdKaFkyc3NJSEJoY21WdWRDNWZjbVZ6ZFd4MEtUdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMHBLQ2s3WEc0Z0lIMGdaV3h6WlNCN1hHNGdJQ0FnYzNWaWMyTnlhV0psS0hCaGNtVnVkQ3dnWTJocGJHUXNJRzl1Um5Wc1ptbHNiRzFsYm5Rc0lHOXVVbVZxWldOMGFXOXVLVHRjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJqYUdsc1pEdGNibjFjYmx4dUx5b3FYRzRnSUdCUWNtOXRhWE5sTG5KbGMyOXNkbVZnSUhKbGRIVnlibk1nWVNCd2NtOXRhWE5sSUhSb1lYUWdkMmxzYkNCaVpXTnZiV1VnY21WemIyeDJaV1FnZDJsMGFDQjBhR1ZjYmlBZ2NHRnpjMlZrSUdCMllXeDFaV0F1SUVsMElHbHpJSE5vYjNKMGFHRnVaQ0JtYjNJZ2RHaGxJR1p2Ykd4dmQybHVaenBjYmx4dUlDQmdZR0JxWVhaaGMyTnlhWEIwWEc0Z0lHeGxkQ0J3Y205dGFYTmxJRDBnYm1WM0lGQnliMjFwYzJVb1puVnVZM1JwYjI0b2NtVnpiMngyWlN3Z2NtVnFaV04wS1h0Y2JpQWdJQ0J5WlhOdmJIWmxLREVwTzF4dUlDQjlLVHRjYmx4dUlDQndjbTl0YVhObExuUm9aVzRvWm5WdVkzUnBiMjRvZG1Gc2RXVXBlMXh1SUNBZ0lDOHZJSFpoYkhWbElEMDlQU0F4WEc0Z0lIMHBPMXh1SUNCZ1lHQmNibHh1SUNCSmJuTjBaV0ZrSUc5bUlIZHlhWFJwYm1jZ2RHaGxJR0ZpYjNabExDQjViM1Z5SUdOdlpHVWdibTkzSUhOcGJYQnNlU0JpWldOdmJXVnpJSFJvWlNCbWIyeHNiM2RwYm1jNlhHNWNiaUFnWUdCZ2FtRjJZWE5qY21sd2RGeHVJQ0JzWlhRZ2NISnZiV2x6WlNBOUlGQnliMjFwYzJVdWNtVnpiMngyWlNneEtUdGNibHh1SUNCd2NtOXRhWE5sTG5Sb1pXNG9ablZ1WTNScGIyNG9kbUZzZFdVcGUxeHVJQ0FnSUM4dklIWmhiSFZsSUQwOVBTQXhYRzRnSUgwcE8xeHVJQ0JnWUdCY2JseHVJQ0JBYldWMGFHOWtJSEpsYzI5c2RtVmNiaUFnUUhOMFlYUnBZMXh1SUNCQWNHRnlZVzBnZTBGdWVYMGdkbUZzZFdVZ2RtRnNkV1VnZEdoaGRDQjBhR1VnY21WMGRYSnVaV1FnY0hKdmJXbHpaU0IzYVd4c0lHSmxJSEpsYzI5c2RtVmtJSGRwZEdoY2JpQWdWWE5sWm5Wc0lHWnZjaUIwYjI5c2FXNW5MbHh1SUNCQWNtVjBkWEp1SUh0UWNtOXRhWE5sZlNCaElIQnliMjFwYzJVZ2RHaGhkQ0IzYVd4c0lHSmxZMjl0WlNCbWRXeG1hV3hzWldRZ2QybDBhQ0IwYUdVZ1oybDJaVzVjYmlBZ1lIWmhiSFZsWUZ4dUtpOWNibVoxYm1OMGFXOXVJSEpsYzI5c2RtVW9iMkpxWldOMEtTQjdYRzRnSUM4cWFuTm9hVzUwSUhaaGJHbGtkR2hwY3pwMGNuVmxJQ292WEc0Z0lIWmhjaUJEYjI1emRISjFZM1J2Y2lBOUlIUm9hWE03WEc1Y2JpQWdhV1lnS0c5aWFtVmpkQ0FtSmlCMGVYQmxiMllnYjJKcVpXTjBJRDA5UFNBbmIySnFaV04wSnlBbUppQnZZbXBsWTNRdVkyOXVjM1J5ZFdOMGIzSWdQVDA5SUVOdmJuTjBjblZqZEc5eUtTQjdYRzRnSUNBZ2NtVjBkWEp1SUc5aWFtVmpkRHRjYmlBZ2ZWeHVYRzRnSUhaaGNpQndjbTl0YVhObElEMGdibVYzSUVOdmJuTjBjblZqZEc5eUtHNXZiM0FwTzF4dUlDQmZjbVZ6YjJ4MlpTaHdjbTl0YVhObExDQnZZbXBsWTNRcE8xeHVJQ0J5WlhSMWNtNGdjSEp2YldselpUdGNibjFjYmx4dWRtRnlJRkJTVDAxSlUwVmZTVVFnUFNCTllYUm9MbkpoYm1SdmJTZ3BMblJ2VTNSeWFXNW5LRE0yS1M1emRXSnpkSEpwYm1jb01UWXBPMXh1WEc1bWRXNWpkR2x2YmlCdWIyOXdLQ2tnZTMxY2JseHVkbUZ5SUZCRlRrUkpUa2NnUFNCMmIybGtJREE3WEc1MllYSWdSbFZNUmtsTVRFVkVJRDBnTVR0Y2JuWmhjaUJTUlVwRlExUkZSQ0E5SURJN1hHNWNiblpoY2lCSFJWUmZWRWhGVGw5RlVsSlBVaUE5SUc1bGR5QkZjbkp2Y2s5aWFtVmpkQ2dwTzF4dVhHNW1kVzVqZEdsdmJpQnpaV3htUm5Wc1ptbHNiRzFsYm5Rb0tTQjdYRzRnSUhKbGRIVnliaUJ1WlhjZ1ZIbHdaVVZ5Y205eUtGd2lXVzkxSUdOaGJtNXZkQ0J5WlhOdmJIWmxJR0VnY0hKdmJXbHpaU0IzYVhSb0lHbDBjMlZzWmx3aUtUdGNibjFjYmx4dVpuVnVZM1JwYjI0Z1kyRnVibTkwVW1WMGRYSnVUM2R1S0NrZ2UxeHVJQ0J5WlhSMWNtNGdibVYzSUZSNWNHVkZjbkp2Y2lnblFTQndjbTl0YVhObGN5QmpZV3hzWW1GamF5QmpZVzV1YjNRZ2NtVjBkWEp1SUhSb1lYUWdjMkZ0WlNCd2NtOXRhWE5sTGljcE8xeHVmVnh1WEc1bWRXNWpkR2x2YmlCblpYUlVhR1Z1S0hCeWIyMXBjMlVwSUh0Y2JpQWdkSEo1SUh0Y2JpQWdJQ0J5WlhSMWNtNGdjSEp2YldselpTNTBhR1Z1TzF4dUlDQjlJR05oZEdOb0lDaGxjbkp2Y2lrZ2UxeHVJQ0FnSUVkRlZGOVVTRVZPWDBWU1VrOVNMbVZ5Y205eUlEMGdaWEp5YjNJN1hHNGdJQ0FnY21WMGRYSnVJRWRGVkY5VVNFVk9YMFZTVWs5U08xeHVJQ0I5WEc1OVhHNWNibVoxYm1OMGFXOXVJSFJ5ZVZSb1pXNG9kR2hsYml3Z2RtRnNkV1VzSUdaMWJHWnBiR3h0Wlc1MFNHRnVaR3hsY2l3Z2NtVnFaV04wYVc5dVNHRnVaR3hsY2lrZ2UxeHVJQ0IwY25rZ2UxeHVJQ0FnSUhSb1pXNHVZMkZzYkNoMllXeDFaU3dnWm5Wc1ptbHNiRzFsYm5SSVlXNWtiR1Z5TENCeVpXcGxZM1JwYjI1SVlXNWtiR1Z5S1R0Y2JpQWdmU0JqWVhSamFDQW9aU2tnZTF4dUlDQWdJSEpsZEhWeWJpQmxPMXh1SUNCOVhHNTlYRzVjYm1aMWJtTjBhVzl1SUdoaGJtUnNaVVp2Y21WcFoyNVVhR1Z1WVdKc1pTaHdjbTl0YVhObExDQjBhR1Z1WVdKc1pTd2dkR2hsYmlrZ2UxeHVJQ0JoYzJGd0tHWjFibU4wYVc5dUlDaHdjbTl0YVhObEtTQjdYRzRnSUNBZ2RtRnlJSE5sWVd4bFpDQTlJR1poYkhObE8xeHVJQ0FnSUhaaGNpQmxjbkp2Y2lBOUlIUnllVlJvWlc0b2RHaGxiaXdnZEdobGJtRmliR1VzSUdaMWJtTjBhVzl1SUNoMllXeDFaU2tnZTF4dUlDQWdJQ0FnYVdZZ0tITmxZV3hsWkNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200N1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCelpXRnNaV1FnUFNCMGNuVmxPMXh1SUNBZ0lDQWdhV1lnS0hSb1pXNWhZbXhsSUNFOVBTQjJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ0lDQmZjbVZ6YjJ4MlpTaHdjbTl0YVhObExDQjJZV3gxWlNrN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCbWRXeG1hV3hzS0hCeWIyMXBjMlVzSUhaaGJIVmxLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlMQ0JtZFc1amRHbHZiaUFvY21WaGMyOXVLU0I3WEc0Z0lDQWdJQ0JwWmlBb2MyVmhiR1ZrS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUhObFlXeGxaQ0E5SUhSeWRXVTdYRzVjYmlBZ0lDQWdJRjl5WldwbFkzUW9jSEp2YldselpTd2djbVZoYzI5dUtUdGNiaUFnSUNCOUxDQW5VMlYwZEd4bE9pQW5JQ3NnS0hCeWIyMXBjMlV1WDJ4aFltVnNJSHg4SUNjZ2RXNXJibTkzYmlCd2NtOXRhWE5sSnlrcE8xeHVYRzRnSUNBZ2FXWWdLQ0Z6WldGc1pXUWdKaVlnWlhKeWIzSXBJSHRjYmlBZ0lDQWdJSE5sWVd4bFpDQTlJSFJ5ZFdVN1hHNGdJQ0FnSUNCZmNtVnFaV04wS0hCeWIyMXBjMlVzSUdWeWNtOXlLVHRjYmlBZ0lDQjlYRzRnSUgwc0lIQnliMjFwYzJVcE8xeHVmVnh1WEc1bWRXNWpkR2x2YmlCb1lXNWtiR1ZQZDI1VWFHVnVZV0pzWlNod2NtOXRhWE5sTENCMGFHVnVZV0pzWlNrZ2UxeHVJQ0JwWmlBb2RHaGxibUZpYkdVdVgzTjBZWFJsSUQwOVBTQkdWVXhHU1V4TVJVUXBJSHRjYmlBZ0lDQm1kV3htYVd4c0tIQnliMjFwYzJVc0lIUm9aVzVoWW14bExsOXlaWE4xYkhRcE8xeHVJQ0I5SUdWc2MyVWdhV1lnS0hSb1pXNWhZbXhsTGw5emRHRjBaU0E5UFQwZ1VrVktSVU5VUlVRcElIdGNiaUFnSUNCZmNtVnFaV04wS0hCeWIyMXBjMlVzSUhSb1pXNWhZbXhsTGw5eVpYTjFiSFFwTzF4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUhOMVluTmpjbWxpWlNoMGFHVnVZV0pzWlN3Z2RXNWtaV1pwYm1Wa0xDQm1kVzVqZEdsdmJpQW9kbUZzZFdVcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCZmNtVnpiMngyWlNod2NtOXRhWE5sTENCMllXeDFaU2s3WEc0Z0lDQWdmU3dnWm5WdVkzUnBiMjRnS0hKbFlYTnZiaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRjl5WldwbFkzUW9jSEp2YldselpTd2djbVZoYzI5dUtUdGNiaUFnSUNCOUtUdGNiaUFnZlZ4dWZWeHVYRzVtZFc1amRHbHZiaUJvWVc1a2JHVk5ZWGxpWlZSb1pXNWhZbXhsS0hCeWIyMXBjMlVzSUcxaGVXSmxWR2hsYm1GaWJHVXNJSFJvWlc0a0pDa2dlMXh1SUNCcFppQW9iV0Y1WW1WVWFHVnVZV0pzWlM1amIyNXpkSEoxWTNSdmNpQTlQVDBnY0hKdmJXbHpaUzVqYjI1emRISjFZM1J2Y2lBbUppQjBhR1Z1SkNRZ1BUMDlJSFJvWlc0Z0ppWWdiV0Y1WW1WVWFHVnVZV0pzWlM1amIyNXpkSEoxWTNSdmNpNXlaWE52YkhabElEMDlQU0J5WlhOdmJIWmxLU0I3WEc0Z0lDQWdhR0Z1Wkd4bFQzZHVWR2hsYm1GaWJHVW9jSEp2YldselpTd2diV0Y1WW1WVWFHVnVZV0pzWlNrN1hHNGdJSDBnWld4elpTQjdYRzRnSUNBZ2FXWWdLSFJvWlc0a0pDQTlQVDBnUjBWVVgxUklSVTVmUlZKU1QxSXBJSHRjYmlBZ0lDQWdJRjl5WldwbFkzUW9jSEp2YldselpTd2dSMFZVWDFSSVJVNWZSVkpTVDFJdVpYSnliM0lwTzF4dUlDQWdJSDBnWld4elpTQnBaaUFvZEdobGJpUWtJRDA5UFNCMWJtUmxabWx1WldRcElIdGNiaUFnSUNBZ0lHWjFiR1pwYkd3b2NISnZiV2x6WlN3Z2JXRjVZbVZVYUdWdVlXSnNaU2s3WEc0Z0lDQWdmU0JsYkhObElHbG1JQ2hwYzBaMWJtTjBhVzl1S0hSb1pXNGtKQ2twSUh0Y2JpQWdJQ0FnSUdoaGJtUnNaVVp2Y21WcFoyNVVhR1Z1WVdKc1pTaHdjbTl0YVhObExDQnRZWGxpWlZSb1pXNWhZbXhsTENCMGFHVnVKQ1FwTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQm1kV3htYVd4c0tIQnliMjFwYzJVc0lHMWhlV0psVkdobGJtRmliR1VwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVmVnh1WEc1bWRXNWpkR2x2YmlCZmNtVnpiMngyWlNod2NtOXRhWE5sTENCMllXeDFaU2tnZTF4dUlDQnBaaUFvY0hKdmJXbHpaU0E5UFQwZ2RtRnNkV1VwSUh0Y2JpQWdJQ0JmY21WcVpXTjBLSEJ5YjIxcGMyVXNJSE5sYkdaR2RXeG1hV3hzYldWdWRDZ3BLVHRjYmlBZ2ZTQmxiSE5sSUdsbUlDaHZZbXBsWTNSUGNrWjFibU4wYVc5dUtIWmhiSFZsS1NrZ2UxeHVJQ0FnSUdoaGJtUnNaVTFoZVdKbFZHaGxibUZpYkdVb2NISnZiV2x6WlN3Z2RtRnNkV1VzSUdkbGRGUm9aVzRvZG1Gc2RXVXBLVHRjYmlBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0JtZFd4bWFXeHNLSEJ5YjIxcGMyVXNJSFpoYkhWbEtUdGNiaUFnZlZ4dWZWeHVYRzVtZFc1amRHbHZiaUJ3ZFdKc2FYTm9VbVZxWldOMGFXOXVLSEJ5YjIxcGMyVXBJSHRjYmlBZ2FXWWdLSEJ5YjIxcGMyVXVYMjl1WlhKeWIzSXBJSHRjYmlBZ0lDQndjbTl0YVhObExsOXZibVZ5Y205eUtIQnliMjFwYzJVdVgzSmxjM1ZzZENrN1hHNGdJSDFjYmx4dUlDQndkV0pzYVhOb0tIQnliMjFwYzJVcE8xeHVmVnh1WEc1bWRXNWpkR2x2YmlCbWRXeG1hV3hzS0hCeWIyMXBjMlVzSUhaaGJIVmxLU0I3WEc0Z0lHbG1JQ2h3Y205dGFYTmxMbDl6ZEdGMFpTQWhQVDBnVUVWT1JFbE9SeWtnZTF4dUlDQWdJSEpsZEhWeWJqdGNiaUFnZlZ4dVhHNGdJSEJ5YjIxcGMyVXVYM0psYzNWc2RDQTlJSFpoYkhWbE8xeHVJQ0J3Y205dGFYTmxMbDl6ZEdGMFpTQTlJRVpWVEVaSlRFeEZSRHRjYmx4dUlDQnBaaUFvY0hKdmJXbHpaUzVmYzNWaWMyTnlhV0psY25NdWJHVnVaM1JvSUNFOVBTQXdLU0I3WEc0Z0lDQWdZWE5oY0Nod2RXSnNhWE5vTENCd2NtOXRhWE5sS1R0Y2JpQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQmZjbVZxWldOMEtIQnliMjFwYzJVc0lISmxZWE52YmlrZ2UxeHVJQ0JwWmlBb2NISnZiV2x6WlM1ZmMzUmhkR1VnSVQwOUlGQkZUa1JKVGtjcElIdGNiaUFnSUNCeVpYUjFjbTQ3WEc0Z0lIMWNiaUFnY0hKdmJXbHpaUzVmYzNSaGRHVWdQU0JTUlVwRlExUkZSRHRjYmlBZ2NISnZiV2x6WlM1ZmNtVnpkV3gwSUQwZ2NtVmhjMjl1TzF4dVhHNGdJR0Z6WVhBb2NIVmliR2x6YUZKbGFtVmpkR2x2Yml3Z2NISnZiV2x6WlNrN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUhOMVluTmpjbWxpWlNod1lYSmxiblFzSUdOb2FXeGtMQ0J2YmtaMWJHWnBiR3h0Wlc1MExDQnZibEpsYW1WamRHbHZiaWtnZTF4dUlDQjJZWElnWDNOMVluTmpjbWxpWlhKeklEMGdjR0Z5Wlc1MExsOXpkV0p6WTNKcFltVnljenRjYmlBZ2RtRnlJR3hsYm1kMGFDQTlJRjl6ZFdKelkzSnBZbVZ5Y3k1c1pXNW5kR2c3WEc1Y2JpQWdjR0Z5Wlc1MExsOXZibVZ5Y205eUlEMGdiblZzYkR0Y2JseHVJQ0JmYzNWaWMyTnlhV0psY25OYmJHVnVaM1JvWFNBOUlHTm9hV3hrTzF4dUlDQmZjM1ZpYzJOeWFXSmxjbk5iYkdWdVozUm9JQ3NnUmxWTVJrbE1URVZFWFNBOUlHOXVSblZzWm1sc2JHMWxiblE3WEc0Z0lGOXpkV0p6WTNKcFltVnljMXRzWlc1bmRHZ2dLeUJTUlVwRlExUkZSRjBnUFNCdmJsSmxhbVZqZEdsdmJqdGNibHh1SUNCcFppQW9iR1Z1WjNSb0lEMDlQU0F3SUNZbUlIQmhjbVZ1ZEM1ZmMzUmhkR1VwSUh0Y2JpQWdJQ0JoYzJGd0tIQjFZbXhwYzJnc0lIQmhjbVZ1ZENrN1hHNGdJSDFjYm4xY2JseHVablZ1WTNScGIyNGdjSFZpYkdsemFDaHdjbTl0YVhObEtTQjdYRzRnSUhaaGNpQnpkV0p6WTNKcFltVnljeUE5SUhCeWIyMXBjMlV1WDNOMVluTmpjbWxpWlhKek8xeHVJQ0IyWVhJZ2MyVjBkR3hsWkNBOUlIQnliMjFwYzJVdVgzTjBZWFJsTzF4dVhHNGdJR2xtSUNoemRXSnpZM0pwWW1WeWN5NXNaVzVuZEdnZ1BUMDlJREFwSUh0Y2JpQWdJQ0J5WlhSMWNtNDdYRzRnSUgxY2JseHVJQ0IyWVhJZ1kyaHBiR1FnUFNCMWJtUmxabWx1WldRc1hHNGdJQ0FnSUNCallXeHNZbUZqYXlBOUlIVnVaR1ZtYVc1bFpDeGNiaUFnSUNBZ0lHUmxkR0ZwYkNBOUlIQnliMjFwYzJVdVgzSmxjM1ZzZER0Y2JseHVJQ0JtYjNJZ0tIWmhjaUJwSUQwZ01Ec2dhU0E4SUhOMVluTmpjbWxpWlhKekxteGxibWQwYURzZ2FTQXJQU0F6S1NCN1hHNGdJQ0FnWTJocGJHUWdQU0J6ZFdKelkzSnBZbVZ5YzF0cFhUdGNiaUFnSUNCallXeHNZbUZqYXlBOUlITjFZbk5qY21saVpYSnpXMmtnS3lCelpYUjBiR1ZrWFR0Y2JseHVJQ0FnSUdsbUlDaGphR2xzWkNrZ2UxeHVJQ0FnSUNBZ2FXNTJiMnRsUTJGc2JHSmhZMnNvYzJWMGRHeGxaQ3dnWTJocGJHUXNJR05oYkd4aVlXTnJMQ0JrWlhSaGFXd3BPMXh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCallXeHNZbUZqYXloa1pYUmhhV3dwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhCeWIyMXBjMlV1WDNOMVluTmpjbWxpWlhKekxteGxibWQwYUNBOUlEQTdYRzU5WEc1Y2JtWjFibU4wYVc5dUlFVnljbTl5VDJKcVpXTjBLQ2tnZTF4dUlDQjBhR2x6TG1WeWNtOXlJRDBnYm5Wc2JEdGNibjFjYmx4dWRtRnlJRlJTV1Y5RFFWUkRTRjlGVWxKUFVpQTlJRzVsZHlCRmNuSnZjazlpYW1WamRDZ3BPMXh1WEc1bWRXNWpkR2x2YmlCMGNubERZWFJqYUNoallXeHNZbUZqYXl3Z1pHVjBZV2xzS1NCN1hHNGdJSFJ5ZVNCN1hHNGdJQ0FnY21WMGRYSnVJR05oYkd4aVlXTnJLR1JsZEdGcGJDazdYRzRnSUgwZ1kyRjBZMmdnS0dVcElIdGNiaUFnSUNCVVVsbGZRMEZVUTBoZlJWSlNUMUl1WlhKeWIzSWdQU0JsTzF4dUlDQWdJSEpsZEhWeWJpQlVVbGxmUTBGVVEwaGZSVkpTVDFJN1hHNGdJSDFjYm4xY2JseHVablZ1WTNScGIyNGdhVzUyYjJ0bFEyRnNiR0poWTJzb2MyVjBkR3hsWkN3Z2NISnZiV2x6WlN3Z1kyRnNiR0poWTJzc0lHUmxkR0ZwYkNrZ2UxeHVJQ0IyWVhJZ2FHRnpRMkZzYkdKaFkyc2dQU0JwYzBaMWJtTjBhVzl1S0dOaGJHeGlZV05yS1N4Y2JpQWdJQ0FnSUhaaGJIVmxJRDBnZFc1a1pXWnBibVZrTEZ4dUlDQWdJQ0FnWlhKeWIzSWdQU0IxYm1SbFptbHVaV1FzWEc0Z0lDQWdJQ0J6ZFdOalpXVmtaV1FnUFNCMWJtUmxabWx1WldRc1hHNGdJQ0FnSUNCbVlXbHNaV1FnUFNCMWJtUmxabWx1WldRN1hHNWNiaUFnYVdZZ0tHaGhjME5oYkd4aVlXTnJLU0I3WEc0Z0lDQWdkbUZzZFdVZ1BTQjBjbmxEWVhSamFDaGpZV3hzWW1GamF5d2daR1YwWVdsc0tUdGNibHh1SUNBZ0lHbG1JQ2gyWVd4MVpTQTlQVDBnVkZKWlgwTkJWRU5JWDBWU1VrOVNLU0I3WEc0Z0lDQWdJQ0JtWVdsc1pXUWdQU0IwY25WbE8xeHVJQ0FnSUNBZ1pYSnliM0lnUFNCMllXeDFaUzVsY25KdmNqdGNiaUFnSUNBZ0lIWmhiSFZsSUQwZ2JuVnNiRHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2MzVmpZMlZsWkdWa0lEMGdkSEoxWlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2NISnZiV2x6WlNBOVBUMGdkbUZzZFdVcElIdGNiaUFnSUNBZ0lGOXlaV3BsWTNRb2NISnZiV2x6WlN3Z1kyRnVibTkwVW1WMGRYSnVUM2R1S0NrcE8xeHVJQ0FnSUNBZ2NtVjBkWEp1TzF4dUlDQWdJSDFjYmlBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0IyWVd4MVpTQTlJR1JsZEdGcGJEdGNiaUFnSUNCemRXTmpaV1ZrWldRZ1BTQjBjblZsTzF4dUlDQjlYRzVjYmlBZ2FXWWdLSEJ5YjIxcGMyVXVYM04wWVhSbElDRTlQU0JRUlU1RVNVNUhLU0I3WEc0Z0lDQWdMeThnYm05dmNGeHVJQ0I5SUdWc2MyVWdhV1lnS0doaGMwTmhiR3hpWVdOcklDWW1JSE4xWTJObFpXUmxaQ2tnZTF4dUlDQWdJQ0FnWDNKbGMyOXNkbVVvY0hKdmJXbHpaU3dnZG1Gc2RXVXBPMXh1SUNBZ0lIMGdaV3h6WlNCcFppQW9abUZwYkdWa0tTQjdYRzRnSUNBZ0lDQmZjbVZxWldOMEtIQnliMjFwYzJVc0lHVnljbTl5S1R0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0hObGRIUnNaV1FnUFQwOUlFWlZURVpKVEV4RlJDa2dlMXh1SUNBZ0lDQWdablZzWm1sc2JDaHdjbTl0YVhObExDQjJZV3gxWlNrN1hHNGdJQ0FnZlNCbGJITmxJR2xtSUNoelpYUjBiR1ZrSUQwOVBTQlNSVXBGUTFSRlJDa2dlMXh1SUNBZ0lDQWdYM0psYW1WamRDaHdjbTl0YVhObExDQjJZV3gxWlNrN1hHNGdJQ0FnZlZ4dWZWeHVYRzVtZFc1amRHbHZiaUJwYm1sMGFXRnNhWHBsVUhKdmJXbHpaU2h3Y205dGFYTmxMQ0J5WlhOdmJIWmxjaWtnZTF4dUlDQjBjbmtnZTF4dUlDQWdJSEpsYzI5c2RtVnlLR1oxYm1OMGFXOXVJSEpsYzI5c2RtVlFjbTl0YVhObEtIWmhiSFZsS1NCN1hHNGdJQ0FnSUNCZmNtVnpiMngyWlNod2NtOXRhWE5sTENCMllXeDFaU2s3WEc0Z0lDQWdmU3dnWm5WdVkzUnBiMjRnY21WcVpXTjBVSEp2YldselpTaHlaV0Z6YjI0cElIdGNiaUFnSUNBZ0lGOXlaV3BsWTNRb2NISnZiV2x6WlN3Z2NtVmhjMjl1S1R0Y2JpQWdJQ0I5S1R0Y2JpQWdmU0JqWVhSamFDQW9aU2tnZTF4dUlDQWdJRjl5WldwbFkzUW9jSEp2YldselpTd2daU2s3WEc0Z0lIMWNibjFjYmx4dWRtRnlJR2xrSUQwZ01EdGNibVoxYm1OMGFXOXVJRzVsZUhSSlpDZ3BJSHRjYmlBZ2NtVjBkWEp1SUdsa0t5czdYRzU5WEc1Y2JtWjFibU4wYVc5dUlHMWhhMlZRY205dGFYTmxLSEJ5YjIxcGMyVXBJSHRjYmlBZ2NISnZiV2x6WlZ0UVVrOU5TVk5GWDBsRVhTQTlJR2xrS3lzN1hHNGdJSEJ5YjIxcGMyVXVYM04wWVhSbElEMGdkVzVrWldacGJtVmtPMXh1SUNCd2NtOXRhWE5sTGw5eVpYTjFiSFFnUFNCMWJtUmxabWx1WldRN1hHNGdJSEJ5YjIxcGMyVXVYM04xWW5OamNtbGlaWEp6SUQwZ1cxMDdYRzU5WEc1Y2JtWjFibU4wYVc5dUlFVnVkVzFsY21GMGIzSW9RMjl1YzNSeWRXTjBiM0lzSUdsdWNIVjBLU0I3WEc0Z0lIUm9hWE11WDJsdWMzUmhibU5sUTI5dWMzUnlkV04wYjNJZ1BTQkRiMjV6ZEhKMVkzUnZjanRjYmlBZ2RHaHBjeTV3Y205dGFYTmxJRDBnYm1WM0lFTnZibk4wY25WamRHOXlLRzV2YjNBcE8xeHVYRzRnSUdsbUlDZ2hkR2hwY3k1d2NtOXRhWE5sVzFCU1QwMUpVMFZmU1VSZEtTQjdYRzRnSUNBZ2JXRnJaVkJ5YjIxcGMyVW9kR2hwY3k1d2NtOXRhWE5sS1R0Y2JpQWdmVnh1WEc0Z0lHbG1JQ2hwYzBGeWNtRjVLR2x1Y0hWMEtTa2dlMXh1SUNBZ0lIUm9hWE11WDJsdWNIVjBJRDBnYVc1d2RYUTdYRzRnSUNBZ2RHaHBjeTVzWlc1bmRHZ2dQU0JwYm5CMWRDNXNaVzVuZEdnN1hHNGdJQ0FnZEdocGN5NWZjbVZ0WVdsdWFXNW5JRDBnYVc1d2RYUXViR1Z1WjNSb08xeHVYRzRnSUNBZ2RHaHBjeTVmY21WemRXeDBJRDBnYm1WM0lFRnljbUY1S0hSb2FYTXViR1Z1WjNSb0tUdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxteGxibWQwYUNBOVBUMGdNQ2tnZTF4dUlDQWdJQ0FnWm5Wc1ptbHNiQ2gwYUdsekxuQnliMjFwYzJVc0lIUm9hWE11WDNKbGMzVnNkQ2s3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lIUm9hWE11YkdWdVozUm9JRDBnZEdocGN5NXNaVzVuZEdnZ2ZId2dNRHRjYmlBZ0lDQWdJSFJvYVhNdVgyVnVkVzFsY21GMFpTZ3BPMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVYM0psYldGcGJtbHVaeUE5UFQwZ01Da2dlMXh1SUNBZ0lDQWdJQ0JtZFd4bWFXeHNLSFJvYVhNdWNISnZiV2x6WlN3Z2RHaHBjeTVmY21WemRXeDBLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdYM0psYW1WamRDaDBhR2x6TG5CeWIyMXBjMlVzSUhaaGJHbGtZWFJwYjI1RmNuSnZjaWdwS1R0Y2JpQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQjJZV3hwWkdGMGFXOXVSWEp5YjNJb0tTQjdYRzRnSUhKbGRIVnliaUJ1WlhjZ1JYSnliM0lvSjBGeWNtRjVJRTFsZEdodlpITWdiWFZ6ZENCaVpTQndjbTkyYVdSbFpDQmhiaUJCY25KaGVTY3BPMXh1ZlR0Y2JseHVSVzUxYldWeVlYUnZjaTV3Y205MGIzUjVjR1V1WDJWdWRXMWxjbUYwWlNBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ2RtRnlJR3hsYm1kMGFDQTlJSFJvYVhNdWJHVnVaM1JvTzF4dUlDQjJZWElnWDJsdWNIVjBJRDBnZEdocGN5NWZhVzV3ZFhRN1hHNWNiaUFnWm05eUlDaDJZWElnYVNBOUlEQTdJSFJvYVhNdVgzTjBZWFJsSUQwOVBTQlFSVTVFU1U1SElDWW1JR2tnUENCc1pXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lIUm9hWE11WDJWaFkyaEZiblJ5ZVNoZmFXNXdkWFJiYVYwc0lHa3BPMXh1SUNCOVhHNTlPMXh1WEc1RmJuVnRaWEpoZEc5eUxuQnliM1J2ZEhsd1pTNWZaV0ZqYUVWdWRISjVJRDBnWm5WdVkzUnBiMjRnS0dWdWRISjVMQ0JwS1NCN1hHNGdJSFpoY2lCaklEMGdkR2hwY3k1ZmFXNXpkR0Z1WTJWRGIyNXpkSEoxWTNSdmNqdGNiaUFnZG1GeUlISmxjMjlzZG1Va0pDQTlJR011Y21WemIyeDJaVHRjYmx4dUlDQnBaaUFvY21WemIyeDJaU1FrSUQwOVBTQnlaWE52YkhabEtTQjdYRzRnSUNBZ2RtRnlJRjkwYUdWdUlEMGdaMlYwVkdobGJpaGxiblJ5ZVNrN1hHNWNiaUFnSUNCcFppQW9YM1JvWlc0Z1BUMDlJSFJvWlc0Z0ppWWdaVzUwY25rdVgzTjBZWFJsSUNFOVBTQlFSVTVFU1U1SEtTQjdYRzRnSUNBZ0lDQjBhR2x6TGw5elpYUjBiR1ZrUVhRb1pXNTBjbmt1WDNOMFlYUmxMQ0JwTENCbGJuUnllUzVmY21WemRXeDBLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2FXWWdLSFI1Y0dWdlppQmZkR2hsYmlBaFBUMGdKMloxYm1OMGFXOXVKeWtnZTF4dUlDQWdJQ0FnZEdocGN5NWZjbVZ0WVdsdWFXNW5MUzA3WEc0Z0lDQWdJQ0IwYUdsekxsOXlaWE4xYkhSYmFWMGdQU0JsYm5SeWVUdGNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tHTWdQVDA5SUZCeWIyMXBjMlVwSUh0Y2JpQWdJQ0FnSUhaaGNpQndjbTl0YVhObElEMGdibVYzSUdNb2JtOXZjQ2s3WEc0Z0lDQWdJQ0JvWVc1a2JHVk5ZWGxpWlZSb1pXNWhZbXhsS0hCeWIyMXBjMlVzSUdWdWRISjVMQ0JmZEdobGJpazdYRzRnSUNBZ0lDQjBhR2x6TGw5M2FXeHNVMlYwZEd4bFFYUW9jSEp2YldselpTd2dhU2s3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lIUm9hWE11WDNkcGJHeFRaWFIwYkdWQmRDaHVaWGNnWXlobWRXNWpkR2x2YmlBb2NtVnpiMngyWlNRa0tTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnlaWE52YkhabEpDUW9aVzUwY25rcE8xeHVJQ0FnSUNBZ2ZTa3NJR2twTzF4dUlDQWdJSDFjYmlBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0IwYUdsekxsOTNhV3hzVTJWMGRHeGxRWFFvY21WemIyeDJaU1FrS0dWdWRISjVLU3dnYVNrN1hHNGdJSDFjYm4wN1hHNWNia1Z1ZFcxbGNtRjBiM0l1Y0hKdmRHOTBlWEJsTGw5elpYUjBiR1ZrUVhRZ1BTQm1kVzVqZEdsdmJpQW9jM1JoZEdVc0lHa3NJSFpoYkhWbEtTQjdYRzRnSUhaaGNpQndjbTl0YVhObElEMGdkR2hwY3k1d2NtOXRhWE5sTzF4dVhHNGdJR2xtSUNod2NtOXRhWE5sTGw5emRHRjBaU0E5UFQwZ1VFVk9SRWxPUnlrZ2UxeHVJQ0FnSUhSb2FYTXVYM0psYldGcGJtbHVaeTB0TzF4dVhHNGdJQ0FnYVdZZ0tITjBZWFJsSUQwOVBTQlNSVXBGUTFSRlJDa2dlMXh1SUNBZ0lDQWdYM0psYW1WamRDaHdjbTl0YVhObExDQjJZV3gxWlNrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSFJvYVhNdVgzSmxjM1ZzZEZ0cFhTQTlJSFpoYkhWbE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lHbG1JQ2gwYUdsekxsOXlaVzFoYVc1cGJtY2dQVDA5SURBcElIdGNiaUFnSUNCbWRXeG1hV3hzS0hCeWIyMXBjMlVzSUhSb2FYTXVYM0psYzNWc2RDazdYRzRnSUgxY2JuMDdYRzVjYmtWdWRXMWxjbUYwYjNJdWNISnZkRzkwZVhCbExsOTNhV3hzVTJWMGRHeGxRWFFnUFNCbWRXNWpkR2x2YmlBb2NISnZiV2x6WlN3Z2FTa2dlMXh1SUNCMllYSWdaVzUxYldWeVlYUnZjaUE5SUhSb2FYTTdYRzVjYmlBZ2MzVmljMk55YVdKbEtIQnliMjFwYzJVc0lIVnVaR1ZtYVc1bFpDd2dablZ1WTNScGIyNGdLSFpoYkhWbEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUdWdWRXMWxjbUYwYjNJdVgzTmxkSFJzWldSQmRDaEdWVXhHU1V4TVJVUXNJR2tzSUhaaGJIVmxLVHRjYmlBZ2ZTd2dablZ1WTNScGIyNGdLSEpsWVhOdmJpa2dlMXh1SUNBZ0lISmxkSFZ5YmlCbGJuVnRaWEpoZEc5eUxsOXpaWFIwYkdWa1FYUW9Va1ZLUlVOVVJVUXNJR2tzSUhKbFlYTnZiaWs3WEc0Z0lIMHBPMXh1ZlR0Y2JseHVMeW9xWEc0Z0lHQlFjbTl0YVhObExtRnNiR0FnWVdOalpYQjBjeUJoYmlCaGNuSmhlU0J2WmlCd2NtOXRhWE5sY3l3Z1lXNWtJSEpsZEhWeWJuTWdZU0J1WlhjZ2NISnZiV2x6WlNCM2FHbGphRnh1SUNCcGN5Qm1kV3htYVd4c1pXUWdkMmwwYUNCaGJpQmhjbkpoZVNCdlppQm1kV3htYVd4c2JXVnVkQ0IyWVd4MVpYTWdabTl5SUhSb1pTQndZWE56WldRZ2NISnZiV2x6WlhNc0lHOXlYRzRnSUhKbGFtVmpkR1ZrSUhkcGRHZ2dkR2hsSUhKbFlYTnZiaUJ2WmlCMGFHVWdabWx5YzNRZ2NHRnpjMlZrSUhCeWIyMXBjMlVnZEc4Z1ltVWdjbVZxWldOMFpXUXVJRWwwSUdOaGMzUnpJR0ZzYkZ4dUlDQmxiR1Z0Wlc1MGN5QnZaaUIwYUdVZ2NHRnpjMlZrSUdsMFpYSmhZbXhsSUhSdklIQnliMjFwYzJWeklHRnpJR2wwSUhKMWJuTWdkR2hwY3lCaGJHZHZjbWwwYUcwdVhHNWNiaUFnUlhoaGJYQnNaVHBjYmx4dUlDQmdZR0JxWVhaaGMyTnlhWEIwWEc0Z0lHeGxkQ0J3Y205dGFYTmxNU0E5SUhKbGMyOXNkbVVvTVNrN1hHNGdJR3hsZENCd2NtOXRhWE5sTWlBOUlISmxjMjlzZG1Vb01pazdYRzRnSUd4bGRDQndjbTl0YVhObE15QTlJSEpsYzI5c2RtVW9NeWs3WEc0Z0lHeGxkQ0J3Y205dGFYTmxjeUE5SUZzZ2NISnZiV2x6WlRFc0lIQnliMjFwYzJVeUxDQndjbTl0YVhObE15QmRPMXh1WEc0Z0lGQnliMjFwYzJVdVlXeHNLSEJ5YjIxcGMyVnpLUzUwYUdWdUtHWjFibU4wYVc5dUtHRnljbUY1S1h0Y2JpQWdJQ0F2THlCVWFHVWdZWEp5WVhrZ2FHVnlaU0IzYjNWc1pDQmlaU0JiSURFc0lESXNJRE1nWFR0Y2JpQWdmU2s3WEc0Z0lHQmdZRnh1WEc0Z0lFbG1JR0Z1ZVNCdlppQjBhR1VnWUhCeWIyMXBjMlZ6WUNCbmFYWmxiaUIwYnlCZ1lXeHNZQ0JoY21VZ2NtVnFaV04wWldRc0lIUm9aU0JtYVhKemRDQndjbTl0YVhObFhHNGdJSFJvWVhRZ2FYTWdjbVZxWldOMFpXUWdkMmxzYkNCaVpTQm5hWFpsYmlCaGN5QmhiaUJoY21kMWJXVnVkQ0IwYnlCMGFHVWdjbVYwZFhKdVpXUWdjSEp2YldselpYTW5jMXh1SUNCeVpXcGxZM1JwYjI0Z2FHRnVaR3hsY2k0Z1JtOXlJR1Y0WVcxd2JHVTZYRzVjYmlBZ1JYaGhiWEJzWlRwY2JseHVJQ0JnWUdCcVlYWmhjMk55YVhCMFhHNGdJR3hsZENCd2NtOXRhWE5sTVNBOUlISmxjMjlzZG1Vb01TazdYRzRnSUd4bGRDQndjbTl0YVhObE1pQTlJSEpsYW1WamRDaHVaWGNnUlhKeWIzSW9YQ0l5WENJcEtUdGNiaUFnYkdWMElIQnliMjFwYzJVeklEMGdjbVZxWldOMEtHNWxkeUJGY25KdmNpaGNJak5jSWlrcE8xeHVJQ0JzWlhRZ2NISnZiV2x6WlhNZ1BTQmJJSEJ5YjIxcGMyVXhMQ0J3Y205dGFYTmxNaXdnY0hKdmJXbHpaVE1nWFR0Y2JseHVJQ0JRY205dGFYTmxMbUZzYkNod2NtOXRhWE5sY3lrdWRHaGxiaWhtZFc1amRHbHZiaWhoY25KaGVTbDdYRzRnSUNBZ0x5OGdRMjlrWlNCb1pYSmxJRzVsZG1WeUlISjFibk1nWW1WallYVnpaU0IwYUdWeVpTQmhjbVVnY21WcVpXTjBaV1FnY0hKdmJXbHpaWE1oWEc0Z0lIMHNJR1oxYm1OMGFXOXVLR1Z5Y205eUtTQjdYRzRnSUNBZ0x5OGdaWEp5YjNJdWJXVnpjMkZuWlNBOVBUMGdYQ0l5WENKY2JpQWdmU2s3WEc0Z0lHQmdZRnh1WEc0Z0lFQnRaWFJvYjJRZ1lXeHNYRzRnSUVCemRHRjBhV05jYmlBZ1FIQmhjbUZ0SUh0QmNuSmhlWDBnWlc1MGNtbGxjeUJoY25KaGVTQnZaaUJ3Y205dGFYTmxjMXh1SUNCQWNHRnlZVzBnZTFOMGNtbHVaMzBnYkdGaVpXd2diM0IwYVc5dVlXd2djM1J5YVc1bklHWnZjaUJzWVdKbGJHbHVaeUIwYUdVZ2NISnZiV2x6WlM1Y2JpQWdWWE5sWm5Wc0lHWnZjaUIwYjI5c2FXNW5MbHh1SUNCQWNtVjBkWEp1SUh0UWNtOXRhWE5sZlNCd2NtOXRhWE5sSUhSb1lYUWdhWE1nWm5Wc1ptbHNiR1ZrSUhkb1pXNGdZV3hzSUdCd2NtOXRhWE5sYzJBZ2FHRjJaU0JpWldWdVhHNGdJR1oxYkdacGJHeGxaQ3dnYjNJZ2NtVnFaV04wWldRZ2FXWWdZVzU1SUc5bUlIUm9aVzBnWW1WamIyMWxJSEpsYW1WamRHVmtMbHh1SUNCQWMzUmhkR2xqWEc0cUwxeHVablZ1WTNScGIyNGdZV3hzS0dWdWRISnBaWE1wSUh0Y2JpQWdjbVYwZFhKdUlHNWxkeUJGYm5WdFpYSmhkRzl5S0hSb2FYTXNJR1Z1ZEhKcFpYTXBMbkJ5YjIxcGMyVTdYRzU5WEc1Y2JpOHFLbHh1SUNCZ1VISnZiV2x6WlM1eVlXTmxZQ0J5WlhSMWNtNXpJR0VnYm1WM0lIQnliMjFwYzJVZ2QyaHBZMmdnYVhNZ2MyVjBkR3hsWkNCcGJpQjBhR1VnYzJGdFpTQjNZWGtnWVhNZ2RHaGxYRzRnSUdacGNuTjBJSEJoYzNObFpDQndjbTl0YVhObElIUnZJSE5sZEhSc1pTNWNibHh1SUNCRmVHRnRjR3hsT2x4dVhHNGdJR0JnWUdwaGRtRnpZM0pwY0hSY2JpQWdiR1YwSUhCeWIyMXBjMlV4SUQwZ2JtVjNJRkJ5YjIxcGMyVW9ablZ1WTNScGIyNG9jbVZ6YjJ4MlpTd2djbVZxWldOMEtYdGNiaUFnSUNCelpYUlVhVzFsYjNWMEtHWjFibU4wYVc5dUtDbDdYRzRnSUNBZ0lDQnlaWE52YkhabEtDZHdjbTl0YVhObElERW5LVHRjYmlBZ0lDQjlMQ0F5TURBcE8xeHVJQ0I5S1R0Y2JseHVJQ0JzWlhRZ2NISnZiV2x6WlRJZ1BTQnVaWGNnVUhKdmJXbHpaU2htZFc1amRHbHZiaWh5WlhOdmJIWmxMQ0J5WldwbFkzUXBlMXh1SUNBZ0lITmxkRlJwYldWdmRYUW9ablZ1WTNScGIyNG9LWHRjYmlBZ0lDQWdJSEpsYzI5c2RtVW9KM0J5YjIxcGMyVWdNaWNwTzF4dUlDQWdJSDBzSURFd01DazdYRzRnSUgwcE8xeHVYRzRnSUZCeWIyMXBjMlV1Y21GalpTaGJjSEp2YldselpURXNJSEJ5YjIxcGMyVXlYU2t1ZEdobGJpaG1kVzVqZEdsdmJpaHlaWE4xYkhRcGUxeHVJQ0FnSUM4dklISmxjM1ZzZENBOVBUMGdKM0J5YjIxcGMyVWdNaWNnWW1WallYVnpaU0JwZENCM1lYTWdjbVZ6YjJ4MlpXUWdZbVZtYjNKbElIQnliMjFwYzJVeFhHNGdJQ0FnTHk4Z2QyRnpJSEpsYzI5c2RtVmtMbHh1SUNCOUtUdGNiaUFnWUdCZ1hHNWNiaUFnWUZCeWIyMXBjMlV1Y21GalpXQWdhWE1nWkdWMFpYSnRhVzVwYzNScFl5QnBiaUIwYUdGMElHOXViSGtnZEdobElITjBZWFJsSUc5bUlIUm9aU0JtYVhKemRGeHVJQ0J6WlhSMGJHVmtJSEJ5YjIxcGMyVWdiV0YwZEdWeWN5NGdSbTl5SUdWNFlXMXdiR1VzSUdWMlpXNGdhV1lnYjNSb1pYSWdjSEp2YldselpYTWdaMmwyWlc0Z2RHOGdkR2hsWEc0Z0lHQndjbTl0YVhObGMyQWdZWEp5WVhrZ1lYSm5kVzFsYm5RZ1lYSmxJSEpsYzI5c2RtVmtMQ0JpZFhRZ2RHaGxJR1pwY25OMElITmxkSFJzWldRZ2NISnZiV2x6WlNCb1lYTmNiaUFnWW1WamIyMWxJSEpsYW1WamRHVmtJR0psWm05eVpTQjBhR1VnYjNSb1pYSWdjSEp2YldselpYTWdZbVZqWVcxbElHWjFiR1pwYkd4bFpDd2dkR2hsSUhKbGRIVnlibVZrWEc0Z0lIQnliMjFwYzJVZ2QybHNiQ0JpWldOdmJXVWdjbVZxWldOMFpXUTZYRzVjYmlBZ1lHQmdhbUYyWVhOamNtbHdkRnh1SUNCc1pYUWdjSEp2YldselpURWdQU0J1WlhjZ1VISnZiV2x6WlNobWRXNWpkR2x2YmloeVpYTnZiSFpsTENCeVpXcGxZM1FwZTF4dUlDQWdJSE5sZEZScGJXVnZkWFFvWm5WdVkzUnBiMjRvS1h0Y2JpQWdJQ0FnSUhKbGMyOXNkbVVvSjNCeWIyMXBjMlVnTVNjcE8xeHVJQ0FnSUgwc0lESXdNQ2s3WEc0Z0lIMHBPMXh1WEc0Z0lHeGxkQ0J3Y205dGFYTmxNaUE5SUc1bGR5QlFjbTl0YVhObEtHWjFibU4wYVc5dUtISmxjMjlzZG1Vc0lISmxhbVZqZENsN1hHNGdJQ0FnYzJWMFZHbHRaVzkxZENobWRXNWpkR2x2YmlncGUxeHVJQ0FnSUNBZ2NtVnFaV04wS0c1bGR5QkZjbkp2Y2lnbmNISnZiV2x6WlNBeUp5a3BPMXh1SUNBZ0lIMHNJREV3TUNrN1hHNGdJSDBwTzF4dVhHNGdJRkJ5YjIxcGMyVXVjbUZqWlNoYmNISnZiV2x6WlRFc0lIQnliMjFwYzJVeVhTa3VkR2hsYmlobWRXNWpkR2x2YmloeVpYTjFiSFFwZTF4dUlDQWdJQzh2SUVOdlpHVWdhR1Z5WlNCdVpYWmxjaUJ5ZFc1elhHNGdJSDBzSUdaMWJtTjBhVzl1S0hKbFlYTnZiaWw3WEc0Z0lDQWdMeThnY21WaGMyOXVMbTFsYzNOaFoyVWdQVDA5SUNkd2NtOXRhWE5sSURJbklHSmxZMkYxYzJVZ2NISnZiV2x6WlNBeUlHSmxZMkZ0WlNCeVpXcGxZM1JsWkNCaVpXWnZjbVZjYmlBZ0lDQXZMeUJ3Y205dGFYTmxJREVnWW1WallXMWxJR1oxYkdacGJHeGxaRnh1SUNCOUtUdGNiaUFnWUdCZ1hHNWNiaUFnUVc0Z1pYaGhiWEJzWlNCeVpXRnNMWGR2Y214a0lIVnpaU0JqWVhObElHbHpJR2x0Y0d4bGJXVnVkR2x1WnlCMGFXMWxiM1YwY3pwY2JseHVJQ0JnWUdCcVlYWmhjMk55YVhCMFhHNGdJRkJ5YjIxcGMyVXVjbUZqWlNoYllXcGhlQ2duWm05dkxtcHpiMjRuS1N3Z2RHbHRaVzkxZENnMU1EQXdLVjBwWEc0Z0lHQmdZRnh1WEc0Z0lFQnRaWFJvYjJRZ2NtRmpaVnh1SUNCQWMzUmhkR2xqWEc0Z0lFQndZWEpoYlNCN1FYSnlZWGw5SUhCeWIyMXBjMlZ6SUdGeWNtRjVJRzltSUhCeWIyMXBjMlZ6SUhSdklHOWljMlZ5ZG1WY2JpQWdWWE5sWm5Wc0lHWnZjaUIwYjI5c2FXNW5MbHh1SUNCQWNtVjBkWEp1SUh0UWNtOXRhWE5sZlNCaElIQnliMjFwYzJVZ2QyaHBZMmdnYzJWMGRHeGxjeUJwYmlCMGFHVWdjMkZ0WlNCM1lYa2dZWE1nZEdobElHWnBjbk4wSUhCaGMzTmxaRnh1SUNCd2NtOXRhWE5sSUhSdklITmxkSFJzWlM1Y2Jpb3ZYRzVtZFc1amRHbHZiaUJ5WVdObEtHVnVkSEpwWlhNcElIdGNiaUFnTHlwcWMyaHBiblFnZG1Gc2FXUjBhR2x6T25SeWRXVWdLaTljYmlBZ2RtRnlJRU52Ym5OMGNuVmpkRzl5SUQwZ2RHaHBjenRjYmx4dUlDQnBaaUFvSVdselFYSnlZWGtvWlc1MGNtbGxjeWtwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdibVYzSUVOdmJuTjBjblZqZEc5eUtHWjFibU4wYVc5dUlDaGZMQ0J5WldwbFkzUXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnlaV3BsWTNRb2JtVjNJRlI1Y0dWRmNuSnZjaWduV1c5MUlHMTFjM1FnY0dGemN5QmhiaUJoY25KaGVTQjBieUJ5WVdObExpY3BLVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0J5WlhSMWNtNGdibVYzSUVOdmJuTjBjblZqZEc5eUtHWjFibU4wYVc5dUlDaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNiaUFnSUNBZ0lIWmhjaUJzWlc1bmRHZ2dQU0JsYm5SeWFXVnpMbXhsYm1kMGFEdGNiaUFnSUNBZ0lHWnZjaUFvZG1GeUlHa2dQU0F3T3lCcElEd2diR1Z1WjNSb095QnBLeXNwSUh0Y2JpQWdJQ0FnSUNBZ1EyOXVjM1J5ZFdOMGIzSXVjbVZ6YjJ4MlpTaGxiblJ5YVdWelcybGRLUzUwYUdWdUtISmxjMjlzZG1Vc0lISmxhbVZqZENrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlNrN1hHNGdJSDFjYm4xY2JseHVMeW9xWEc0Z0lHQlFjbTl0YVhObExuSmxhbVZqZEdBZ2NtVjBkWEp1Y3lCaElIQnliMjFwYzJVZ2NtVnFaV04wWldRZ2QybDBhQ0IwYUdVZ2NHRnpjMlZrSUdCeVpXRnpiMjVnTGx4dUlDQkpkQ0JwY3lCemFHOXlkR2hoYm1RZ1ptOXlJSFJvWlNCbWIyeHNiM2RwYm1jNlhHNWNiaUFnWUdCZ2FtRjJZWE5qY21sd2RGeHVJQ0JzWlhRZ2NISnZiV2x6WlNBOUlHNWxkeUJRY205dGFYTmxLR1oxYm1OMGFXOXVLSEpsYzI5c2RtVXNJSEpsYW1WamRDbDdYRzRnSUNBZ2NtVnFaV04wS0c1bGR5QkZjbkp2Y2lnblYwaFBUMUJUSnlrcE8xeHVJQ0I5S1R0Y2JseHVJQ0J3Y205dGFYTmxMblJvWlc0b1puVnVZM1JwYjI0b2RtRnNkV1VwZTF4dUlDQWdJQzh2SUVOdlpHVWdhR1Z5WlNCa2IyVnpiaWQwSUhKMWJpQmlaV05oZFhObElIUm9aU0J3Y205dGFYTmxJR2x6SUhKbGFtVmpkR1ZrSVZ4dUlDQjlMQ0JtZFc1amRHbHZiaWh5WldGemIyNHBlMXh1SUNBZ0lDOHZJSEpsWVhOdmJpNXRaWE56WVdkbElEMDlQU0FuVjBoUFQxQlRKMXh1SUNCOUtUdGNiaUFnWUdCZ1hHNWNiaUFnU1c1emRHVmhaQ0J2WmlCM2NtbDBhVzVuSUhSb1pTQmhZbTkyWlN3Z2VXOTFjaUJqYjJSbElHNXZkeUJ6YVcxd2JIa2dZbVZqYjIxbGN5QjBhR1VnWm05c2JHOTNhVzVuT2x4dVhHNGdJR0JnWUdwaGRtRnpZM0pwY0hSY2JpQWdiR1YwSUhCeWIyMXBjMlVnUFNCUWNtOXRhWE5sTG5KbGFtVmpkQ2h1WlhjZ1JYSnliM0lvSjFkSVQwOVFVeWNwS1R0Y2JseHVJQ0J3Y205dGFYTmxMblJvWlc0b1puVnVZM1JwYjI0b2RtRnNkV1VwZTF4dUlDQWdJQzh2SUVOdlpHVWdhR1Z5WlNCa2IyVnpiaWQwSUhKMWJpQmlaV05oZFhObElIUm9aU0J3Y205dGFYTmxJR2x6SUhKbGFtVmpkR1ZrSVZ4dUlDQjlMQ0JtZFc1amRHbHZiaWh5WldGemIyNHBlMXh1SUNBZ0lDOHZJSEpsWVhOdmJpNXRaWE56WVdkbElEMDlQU0FuVjBoUFQxQlRKMXh1SUNCOUtUdGNiaUFnWUdCZ1hHNWNiaUFnUUcxbGRHaHZaQ0J5WldwbFkzUmNiaUFnUUhOMFlYUnBZMXh1SUNCQWNHRnlZVzBnZTBGdWVYMGdjbVZoYzI5dUlIWmhiSFZsSUhSb1lYUWdkR2hsSUhKbGRIVnlibVZrSUhCeWIyMXBjMlVnZDJsc2JDQmlaU0J5WldwbFkzUmxaQ0IzYVhSb0xseHVJQ0JWYzJWbWRXd2dabTl5SUhSdmIyeHBibWN1WEc0Z0lFQnlaWFIxY200Z2UxQnliMjFwYzJWOUlHRWdjSEp2YldselpTQnlaV3BsWTNSbFpDQjNhWFJvSUhSb1pTQm5hWFpsYmlCZ2NtVmhjMjl1WUM1Y2Jpb3ZYRzVtZFc1amRHbHZiaUJ5WldwbFkzUW9jbVZoYzI5dUtTQjdYRzRnSUM4cWFuTm9hVzUwSUhaaGJHbGtkR2hwY3pwMGNuVmxJQ292WEc0Z0lIWmhjaUJEYjI1emRISjFZM1J2Y2lBOUlIUm9hWE03WEc0Z0lIWmhjaUJ3Y205dGFYTmxJRDBnYm1WM0lFTnZibk4wY25WamRHOXlLRzV2YjNBcE8xeHVJQ0JmY21WcVpXTjBLSEJ5YjIxcGMyVXNJSEpsWVhOdmJpazdYRzRnSUhKbGRIVnliaUJ3Y205dGFYTmxPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQnVaV1ZrYzFKbGMyOXNkbVZ5S0NrZ2UxeHVJQ0IwYUhKdmR5QnVaWGNnVkhsd1pVVnljbTl5S0NkWmIzVWdiWFZ6ZENCd1lYTnpJR0VnY21WemIyeDJaWElnWm5WdVkzUnBiMjRnWVhNZ2RHaGxJR1pwY25OMElHRnlaM1Z0Wlc1MElIUnZJSFJvWlNCd2NtOXRhWE5sSUdOdmJuTjBjblZqZEc5eUp5azdYRzU5WEc1Y2JtWjFibU4wYVc5dUlHNWxaV1J6VG1WM0tDa2dlMXh1SUNCMGFISnZkeUJ1WlhjZ1ZIbHdaVVZ5Y205eUtGd2lSbUZwYkdWa0lIUnZJR052Ym5OMGNuVmpkQ0FuVUhKdmJXbHpaU2M2SUZCc1pXRnpaU0IxYzJVZ2RHaGxJQ2R1WlhjbklHOXdaWEpoZEc5eUxDQjBhR2x6SUc5aWFtVmpkQ0JqYjI1emRISjFZM1J2Y2lCallXNXViM1FnWW1VZ1kyRnNiR1ZrSUdGeklHRWdablZ1WTNScGIyNHVYQ0lwTzF4dWZWeHVYRzR2S2lwY2JpQWdVSEp2YldselpTQnZZbXBsWTNSeklISmxjSEpsYzJWdWRDQjBhR1VnWlhabGJuUjFZV3dnY21WemRXeDBJRzltSUdGdUlHRnplVzVqYUhKdmJtOTFjeUJ2Y0dWeVlYUnBiMjR1SUZSb1pWeHVJQ0J3Y21sdFlYSjVJSGRoZVNCdlppQnBiblJsY21GamRHbHVaeUIzYVhSb0lHRWdjSEp2YldselpTQnBjeUIwYUhKdmRXZG9JR2wwY3lCZ2RHaGxibUFnYldWMGFHOWtMQ0IzYUdsamFGeHVJQ0J5WldkcGMzUmxjbk1nWTJGc2JHSmhZMnR6SUhSdklISmxZMlZwZG1VZ1pXbDBhR1Z5SUdFZ2NISnZiV2x6WlNkeklHVjJaVzUwZFdGc0lIWmhiSFZsSUc5eUlIUm9aU0J5WldGemIyNWNiaUFnZDJoNUlIUm9aU0J3Y205dGFYTmxJR05oYm01dmRDQmlaU0JtZFd4bWFXeHNaV1F1WEc1Y2JpQWdWR1Z5YldsdWIyeHZaM2xjYmlBZ0xTMHRMUzB0TFMwdExTMWNibHh1SUNBdElHQndjbTl0YVhObFlDQnBjeUJoYmlCdlltcGxZM1FnYjNJZ1puVnVZM1JwYjI0Z2QybDBhQ0JoSUdCMGFHVnVZQ0J0WlhSb2IyUWdkMmh2YzJVZ1ltVm9ZWFpwYjNJZ1kyOXVabTl5YlhNZ2RHOGdkR2hwY3lCemNHVmphV1pwWTJGMGFXOXVMbHh1SUNBdElHQjBhR1Z1WVdKc1pXQWdhWE1nWVc0Z2IySnFaV04wSUc5eUlHWjFibU4wYVc5dUlIUm9ZWFFnWkdWbWFXNWxjeUJoSUdCMGFHVnVZQ0J0WlhSb2IyUXVYRzRnSUMwZ1lIWmhiSFZsWUNCcGN5QmhibmtnYkdWbllXd2dTbUYyWVZOamNtbHdkQ0IyWVd4MVpTQW9hVzVqYkhWa2FXNW5JSFZ1WkdWbWFXNWxaQ3dnWVNCMGFHVnVZV0pzWlN3Z2IzSWdZU0J3Y205dGFYTmxLUzVjYmlBZ0xTQmdaWGhqWlhCMGFXOXVZQ0JwY3lCaElIWmhiSFZsSUhSb1lYUWdhWE1nZEdoeWIzZHVJSFZ6YVc1bklIUm9aU0IwYUhKdmR5QnpkR0YwWlcxbGJuUXVYRzRnSUMwZ1lISmxZWE52Ym1BZ2FYTWdZU0IyWVd4MVpTQjBhR0YwSUdsdVpHbGpZWFJsY3lCM2FIa2dZU0J3Y205dGFYTmxJSGRoY3lCeVpXcGxZM1JsWkM1Y2JpQWdMU0JnYzJWMGRHeGxaR0FnZEdobElHWnBibUZzSUhKbGMzUnBibWNnYzNSaGRHVWdiMllnWVNCd2NtOXRhWE5sTENCbWRXeG1hV3hzWldRZ2IzSWdjbVZxWldOMFpXUXVYRzVjYmlBZ1FTQndjbTl0YVhObElHTmhiaUJpWlNCcGJpQnZibVVnYjJZZ2RHaHlaV1VnYzNSaGRHVnpPaUJ3Wlc1a2FXNW5MQ0JtZFd4bWFXeHNaV1FzSUc5eUlISmxhbVZqZEdWa0xseHVYRzRnSUZCeWIyMXBjMlZ6SUhSb1lYUWdZWEpsSUdaMWJHWnBiR3hsWkNCb1lYWmxJR0VnWm5Wc1ptbHNiRzFsYm5RZ2RtRnNkV1VnWVc1a0lHRnlaU0JwYmlCMGFHVWdablZzWm1sc2JHVmtYRzRnSUhOMFlYUmxMaUFnVUhKdmJXbHpaWE1nZEdoaGRDQmhjbVVnY21WcVpXTjBaV1FnYUdGMlpTQmhJSEpsYW1WamRHbHZiaUJ5WldGemIyNGdZVzVrSUdGeVpTQnBiaUIwYUdWY2JpQWdjbVZxWldOMFpXUWdjM1JoZEdVdUlDQkJJR1oxYkdacGJHeHRaVzUwSUhaaGJIVmxJR2x6SUc1bGRtVnlJR0VnZEdobGJtRmliR1V1WEc1Y2JpQWdVSEp2YldselpYTWdZMkZ1SUdGc2MyOGdZbVVnYzJGcFpDQjBieUFxY21WemIyeDJaU29nWVNCMllXeDFaUzRnSUVsbUlIUm9hWE1nZG1Gc2RXVWdhWE1nWVd4emJ5QmhYRzRnSUhCeWIyMXBjMlVzSUhSb1pXNGdkR2hsSUc5eWFXZHBibUZzSUhCeWIyMXBjMlVuY3lCelpYUjBiR1ZrSUhOMFlYUmxJSGRwYkd3Z2JXRjBZMmdnZEdobElIWmhiSFZsSjNOY2JpQWdjMlYwZEd4bFpDQnpkR0YwWlM0Z0lGTnZJR0VnY0hKdmJXbHpaU0IwYUdGMElDcHlaWE52YkhabGN5b2dZU0J3Y205dGFYTmxJSFJvWVhRZ2NtVnFaV04wY3lCM2FXeHNYRzRnSUdsMGMyVnNaaUJ5WldwbFkzUXNJR0Z1WkNCaElIQnliMjFwYzJVZ2RHaGhkQ0FxY21WemIyeDJaWE1xSUdFZ2NISnZiV2x6WlNCMGFHRjBJR1oxYkdacGJHeHpJSGRwYkd4Y2JpQWdhWFJ6Wld4bUlHWjFiR1pwYkd3dVhHNWNibHh1SUNCQ1lYTnBZeUJWYzJGblpUcGNiaUFnTFMwdExTMHRMUzB0TFMwdFhHNWNiaUFnWUdCZ2FuTmNiaUFnYkdWMElIQnliMjFwYzJVZ1BTQnVaWGNnVUhKdmJXbHpaU2htZFc1amRHbHZiaWh5WlhOdmJIWmxMQ0J5WldwbFkzUXBJSHRjYmlBZ0lDQXZMeUJ2YmlCemRXTmpaWE56WEc0Z0lDQWdjbVZ6YjJ4MlpTaDJZV3gxWlNrN1hHNWNiaUFnSUNBdkx5QnZiaUJtWVdsc2RYSmxYRzRnSUNBZ2NtVnFaV04wS0hKbFlYTnZiaWs3WEc0Z0lIMHBPMXh1WEc0Z0lIQnliMjFwYzJVdWRHaGxiaWhtZFc1amRHbHZiaWgyWVd4MVpTa2dlMXh1SUNBZ0lDOHZJRzl1SUdaMWJHWnBiR3h0Wlc1MFhHNGdJSDBzSUdaMWJtTjBhVzl1S0hKbFlYTnZiaWtnZTF4dUlDQWdJQzh2SUc5dUlISmxhbVZqZEdsdmJseHVJQ0I5S1R0Y2JpQWdZR0JnWEc1Y2JpQWdRV1IyWVc1alpXUWdWWE5oWjJVNlhHNGdJQzB0TFMwdExTMHRMUzB0TFMwdExWeHVYRzRnSUZCeWIyMXBjMlZ6SUhOb2FXNWxJSGRvWlc0Z1lXSnpkSEpoWTNScGJtY2dZWGRoZVNCaGMzbHVZMmh5YjI1dmRYTWdhVzUwWlhKaFkzUnBiMjV6SUhOMVkyZ2dZWE5jYmlBZ1lGaE5URWgwZEhCU1pYRjFaWE4wWUhNdVhHNWNiaUFnWUdCZ2FuTmNiaUFnWm5WdVkzUnBiMjRnWjJWMFNsTlBUaWgxY213cElIdGNiaUFnSUNCeVpYUjFjbTRnYm1WM0lGQnliMjFwYzJVb1puVnVZM1JwYjI0b2NtVnpiMngyWlN3Z2NtVnFaV04wS1h0Y2JpQWdJQ0FnSUd4bGRDQjRhSElnUFNCdVpYY2dXRTFNU0hSMGNGSmxjWFZsYzNRb0tUdGNibHh1SUNBZ0lDQWdlR2h5TG05d1pXNG9KMGRGVkNjc0lIVnliQ2s3WEc0Z0lDQWdJQ0I0YUhJdWIyNXlaV0ZrZVhOMFlYUmxZMmhoYm1kbElEMGdhR0Z1Wkd4bGNqdGNiaUFnSUNBZ0lIaG9jaTV5WlhOd2IyNXpaVlI1Y0dVZ1BTQW5hbk52YmljN1hHNGdJQ0FnSUNCNGFISXVjMlYwVW1WeGRXVnpkRWhsWVdSbGNpZ25RV05qWlhCMEp5d2dKMkZ3Y0d4cFkyRjBhVzl1TDJwemIyNG5LVHRjYmlBZ0lDQWdJSGhvY2k1elpXNWtLQ2s3WEc1Y2JpQWdJQ0FnSUdaMWJtTjBhVzl1SUdoaGJtUnNaWElvS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxuSmxZV1I1VTNSaGRHVWdQVDA5SUhSb2FYTXVSRTlPUlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbk4wWVhSMWN5QTlQVDBnTWpBd0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYTnZiSFpsS0hSb2FYTXVjbVZ6Y0c5dWMyVXBPMXh1SUNBZ0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaV3BsWTNRb2JtVjNJRVZ5Y205eUtDZG5aWFJLVTA5T09pQmdKeUFySUhWeWJDQXJJQ2RnSUdaaGFXeGxaQ0IzYVhSb0lITjBZWFIxY3pvZ1d5Y2dLeUIwYUdsekxuTjBZWFIxY3lBcklDZGRKeWtwTzF4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVYRzRnSUdkbGRFcFRUMDRvSnk5d2IzTjBjeTVxYzI5dUp5a3VkR2hsYmlobWRXNWpkR2x2YmlocWMyOXVLU0I3WEc0Z0lDQWdMeThnYjI0Z1puVnNabWxzYkcxbGJuUmNiaUFnZlN3Z1puVnVZM1JwYjI0b2NtVmhjMjl1S1NCN1hHNGdJQ0FnTHk4Z2IyNGdjbVZxWldOMGFXOXVYRzRnSUgwcE8xeHVJQ0JnWUdCY2JseHVJQ0JWYm14cGEyVWdZMkZzYkdKaFkydHpMQ0J3Y205dGFYTmxjeUJoY21VZ1ozSmxZWFFnWTI5dGNHOXpZV0pzWlNCd2NtbHRhWFJwZG1WekxseHVYRzRnSUdCZ1lHcHpYRzRnSUZCeWIyMXBjMlV1WVd4c0tGdGNiaUFnSUNCblpYUktVMDlPS0NjdmNHOXpkSE1uS1N4Y2JpQWdJQ0JuWlhSS1UwOU9LQ2N2WTI5dGJXVnVkSE1uS1Z4dUlDQmRLUzUwYUdWdUtHWjFibU4wYVc5dUtIWmhiSFZsY3lsN1hHNGdJQ0FnZG1Gc2RXVnpXekJkSUM4dklEMCtJSEJ2YzNSelNsTlBUbHh1SUNBZ0lIWmhiSFZsYzFzeFhTQXZMeUE5UGlCamIyMXRaVzUwYzBwVFQwNWNibHh1SUNBZ0lISmxkSFZ5YmlCMllXeDFaWE03WEc0Z0lIMHBPMXh1SUNCZ1lHQmNibHh1SUNCQVkyeGhjM01nVUhKdmJXbHpaVnh1SUNCQWNHRnlZVzBnZTJaMWJtTjBhVzl1ZlNCeVpYTnZiSFpsY2x4dUlDQlZjMlZtZFd3Z1ptOXlJSFJ2YjJ4cGJtY3VYRzRnSUVCamIyNXpkSEoxWTNSdmNseHVLaTljYm1aMWJtTjBhVzl1SUZCeWIyMXBjMlVvY21WemIyeDJaWElwSUh0Y2JpQWdkR2hwYzF0UVVrOU5TVk5GWDBsRVhTQTlJRzVsZUhSSlpDZ3BPMXh1SUNCMGFHbHpMbDl5WlhOMWJIUWdQU0IwYUdsekxsOXpkR0YwWlNBOUlIVnVaR1ZtYVc1bFpEdGNiaUFnZEdocGN5NWZjM1ZpYzJOeWFXSmxjbk1nUFNCYlhUdGNibHh1SUNCcFppQW9ibTl2Y0NBaFBUMGdjbVZ6YjJ4MlpYSXBJSHRjYmlBZ0lDQjBlWEJsYjJZZ2NtVnpiMngyWlhJZ0lUMDlJQ2RtZFc1amRHbHZiaWNnSmlZZ2JtVmxaSE5TWlhOdmJIWmxjaWdwTzF4dUlDQWdJSFJvYVhNZ2FXNXpkR0Z1WTJWdlppQlFjbTl0YVhObElEOGdhVzVwZEdsaGJHbDZaVkJ5YjIxcGMyVW9kR2hwY3l3Z2NtVnpiMngyWlhJcElEb2dibVZsWkhOT1pYY29LVHRjYmlBZ2ZWeHVmVnh1WEc1UWNtOXRhWE5sTG1Gc2JDQTlJR0ZzYkR0Y2JsQnliMjFwYzJVdWNtRmpaU0E5SUhKaFkyVTdYRzVRY205dGFYTmxMbkpsYzI5c2RtVWdQU0J5WlhOdmJIWmxPMXh1VUhKdmJXbHpaUzV5WldwbFkzUWdQU0J5WldwbFkzUTdYRzVRY205dGFYTmxMbDl6WlhSVFkyaGxaSFZzWlhJZ1BTQnpaWFJUWTJobFpIVnNaWEk3WEc1UWNtOXRhWE5sTGw5elpYUkJjMkZ3SUQwZ2MyVjBRWE5oY0R0Y2JsQnliMjFwYzJVdVgyRnpZWEFnUFNCaGMyRndPMXh1WEc1UWNtOXRhWE5sTG5CeWIzUnZkSGx3WlNBOUlIdGNiaUFnWTI5dWMzUnlkV04wYjNJNklGQnliMjFwYzJVc1hHNWNiaUFnTHlvcVhHNGdJQ0FnVkdobElIQnlhVzFoY25rZ2QyRjVJRzltSUdsdWRHVnlZV04wYVc1bklIZHBkR2dnWVNCd2NtOXRhWE5sSUdseklIUm9jbTkxWjJnZ2FYUnpJR0IwYUdWdVlDQnRaWFJvYjJRc1hHNGdJQ0FnZDJocFkyZ2djbVZuYVhOMFpYSnpJR05oYkd4aVlXTnJjeUIwYnlCeVpXTmxhWFpsSUdWcGRHaGxjaUJoSUhCeWIyMXBjMlVuY3lCbGRtVnVkSFZoYkNCMllXeDFaU0J2Y2lCMGFHVmNiaUFnSUNCeVpXRnpiMjRnZDJoNUlIUm9aU0J3Y205dGFYTmxJR05oYm01dmRDQmlaU0JtZFd4bWFXeHNaV1F1WEc0Z0lGeHVJQ0FnSUdCZ1lHcHpYRzRnSUNBZ1ptbHVaRlZ6WlhJb0tTNTBhR1Z1S0daMWJtTjBhVzl1S0hWelpYSXBlMXh1SUNBZ0lDQWdMeThnZFhObGNpQnBjeUJoZG1GcGJHRmliR1ZjYmlBZ0lDQjlMQ0JtZFc1amRHbHZiaWh5WldGemIyNHBlMXh1SUNBZ0lDQWdMeThnZFhObGNpQnBjeUIxYm1GMllXbHNZV0pzWlN3Z1lXNWtJSGx2ZFNCaGNtVWdaMmwyWlc0Z2RHaGxJSEpsWVhOdmJpQjNhSGxjYmlBZ0lDQjlLVHRjYmlBZ0lDQmdZR0JjYmlBZ1hHNGdJQ0FnUTJoaGFXNXBibWRjYmlBZ0lDQXRMUzB0TFMwdExWeHVJQ0JjYmlBZ0lDQlVhR1VnY21WMGRYSnVJSFpoYkhWbElHOW1JR0IwYUdWdVlDQnBjeUJwZEhObGJHWWdZU0J3Y205dGFYTmxMaUFnVkdocGN5QnpaV052Ym1Rc0lDZGtiM2R1YzNSeVpXRnRKMXh1SUNBZ0lIQnliMjFwYzJVZ2FYTWdjbVZ6YjJ4MlpXUWdkMmwwYUNCMGFHVWdjbVYwZFhKdUlIWmhiSFZsSUc5bUlIUm9aU0JtYVhKemRDQndjbTl0YVhObEozTWdablZzWm1sc2JHMWxiblJjYmlBZ0lDQnZjaUJ5WldwbFkzUnBiMjRnYUdGdVpHeGxjaXdnYjNJZ2NtVnFaV04wWldRZ2FXWWdkR2hsSUdoaGJtUnNaWElnZEdoeWIzZHpJR0Z1SUdWNFkyVndkR2x2Ymk1Y2JpQWdYRzRnSUNBZ1lHQmdhbk5jYmlBZ0lDQm1hVzVrVlhObGNpZ3BMblJvWlc0b1puVnVZM1JwYjI0Z0tIVnpaWElwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIxYzJWeUxtNWhiV1U3WEc0Z0lDQWdmU3dnWm5WdVkzUnBiMjRnS0hKbFlYTnZiaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJQ2RrWldaaGRXeDBJRzVoYldVbk8xeHVJQ0FnSUgwcExuUm9aVzRvWm5WdVkzUnBiMjRnS0hWelpYSk9ZVzFsS1NCN1hHNGdJQ0FnSUNBdkx5QkpaaUJnWm1sdVpGVnpaWEpnSUdaMWJHWnBiR3hsWkN3Z1lIVnpaWEpPWVcxbFlDQjNhV3hzSUdKbElIUm9aU0IxYzJWeUozTWdibUZ0WlN3Z2IzUm9aWEozYVhObElHbDBYRzRnSUNBZ0lDQXZMeUIzYVd4c0lHSmxJR0FuWkdWbVlYVnNkQ0J1WVcxbEoyQmNiaUFnSUNCOUtUdGNiaUFnWEc0Z0lDQWdabWx1WkZWelpYSW9LUzUwYUdWdUtHWjFibU4wYVc5dUlDaDFjMlZ5S1NCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjBadmRXNWtJSFZ6WlhJc0lHSjFkQ0J6ZEdsc2JDQjFibWhoY0hCNUp5azdYRzRnSUNBZ2ZTd2dablZ1WTNScGIyNGdLSEpsWVhOdmJpa2dlMXh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZGdabWx1WkZWelpYSmdJSEpsYW1WamRHVmtJR0Z1WkNCM1pTZHlaU0IxYm1oaGNIQjVKeWs3WEc0Z0lDQWdmU2t1ZEdobGJpaG1kVzVqZEdsdmJpQW9kbUZzZFdVcElIdGNiaUFnSUNBZ0lDOHZJRzVsZG1WeUlISmxZV05vWldSY2JpQWdJQ0I5TENCbWRXNWpkR2x2YmlBb2NtVmhjMjl1S1NCN1hHNGdJQ0FnSUNBdkx5QnBaaUJnWm1sdVpGVnpaWEpnSUdaMWJHWnBiR3hsWkN3Z1lISmxZWE52Ym1BZ2QybHNiQ0JpWlNBblJtOTFibVFnZFhObGNpd2dZblYwSUhOMGFXeHNJSFZ1YUdGd2NIa25MbHh1SUNBZ0lDQWdMeThnU1dZZ1lHWnBibVJWYzJWeVlDQnlaV3BsWTNSbFpDd2dZSEpsWVhOdmJtQWdkMmxzYkNCaVpTQW5ZR1pwYm1SVmMyVnlZQ0J5WldwbFkzUmxaQ0JoYm1RZ2QyVW5jbVVnZFc1b1lYQndlU2N1WEc0Z0lDQWdmU2s3WEc0Z0lDQWdZR0JnWEc0Z0lDQWdTV1lnZEdobElHUnZkMjV6ZEhKbFlXMGdjSEp2YldselpTQmtiMlZ6SUc1dmRDQnpjR1ZqYVdaNUlHRWdjbVZxWldOMGFXOXVJR2hoYm1Sc1pYSXNJSEpsYW1WamRHbHZiaUJ5WldGemIyNXpJSGRwYkd3Z1ltVWdjSEp2Y0dGbllYUmxaQ0JtZFhKMGFHVnlJR1J2ZDI1emRISmxZVzB1WEc0Z0lGeHVJQ0FnSUdCZ1lHcHpYRzRnSUNBZ1ptbHVaRlZ6WlhJb0tTNTBhR1Z1S0daMWJtTjBhVzl1SUNoMWMyVnlLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnVUdWa1lXZHZaMmxqWVd4RmVHTmxjSFJwYjI0b0oxVndjM1J5WldGdElHVnljbTl5SnlrN1hHNGdJQ0FnZlNrdWRHaGxiaWhtZFc1amRHbHZiaUFvZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJQzh2SUc1bGRtVnlJSEpsWVdOb1pXUmNiaUFnSUNCOUtTNTBhR1Z1S0daMWJtTjBhVzl1SUNoMllXeDFaU2tnZTF4dUlDQWdJQ0FnTHk4Z2JtVjJaWElnY21WaFkyaGxaRnh1SUNBZ0lIMHNJR1oxYm1OMGFXOXVJQ2h5WldGemIyNHBJSHRjYmlBZ0lDQWdJQzh2SUZSb1pTQmdVR1ZrWjJGbmIyTnBZV3hGZUdObGNIUnBiMjVnSUdseklIQnliM0JoWjJGMFpXUWdZV3hzSUhSb1pTQjNZWGtnWkc5M2JpQjBieUJvWlhKbFhHNGdJQ0FnZlNrN1hHNGdJQ0FnWUdCZ1hHNGdJRnh1SUNBZ0lFRnpjMmx0YVd4aGRHbHZibHh1SUNBZ0lDMHRMUzB0TFMwdExTMHRMVnh1SUNCY2JpQWdJQ0JUYjIxbGRHbHRaWE1nZEdobElIWmhiSFZsSUhsdmRTQjNZVzUwSUhSdklIQnliM0JoWjJGMFpTQjBieUJoSUdSdmQyNXpkSEpsWVcwZ2NISnZiV2x6WlNCallXNGdiMjVzZVNCaVpWeHVJQ0FnSUhKbGRISnBaWFpsWkNCaGMzbHVZMmh5YjI1dmRYTnNlUzRnVkdocGN5QmpZVzRnWW1VZ1lXTm9hV1YyWldRZ1lua2djbVYwZFhKdWFXNW5JR0VnY0hKdmJXbHpaU0JwYmlCMGFHVmNiaUFnSUNCbWRXeG1hV3hzYldWdWRDQnZjaUJ5WldwbFkzUnBiMjRnYUdGdVpHeGxjaTRnVkdobElHUnZkMjV6ZEhKbFlXMGdjSEp2YldselpTQjNhV3hzSUhSb1pXNGdZbVVnY0dWdVpHbHVaMXh1SUNBZ0lIVnVkR2xzSUhSb1pTQnlaWFIxY201bFpDQndjbTl0YVhObElHbHpJSE5sZEhSc1pXUXVJRlJvYVhNZ2FYTWdZMkZzYkdWa0lDcGhjM05wYldsc1lYUnBiMjRxTGx4dUlDQmNiaUFnSUNCZ1lHQnFjMXh1SUNBZ0lHWnBibVJWYzJWeUtDa3VkR2hsYmlobWRXNWpkR2x2YmlBb2RYTmxjaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1pwYm1SRGIyMXRaVzUwYzBKNVFYVjBhRzl5S0hWelpYSXBPMXh1SUNBZ0lIMHBMblJvWlc0b1puVnVZM1JwYjI0Z0tHTnZiVzFsYm5SektTQjdYRzRnSUNBZ0lDQXZMeUJVYUdVZ2RYTmxjaWR6SUdOdmJXMWxiblJ6SUdGeVpTQnViM2NnWVhaaGFXeGhZbXhsWEc0Z0lDQWdmU2s3WEc0Z0lDQWdZR0JnWEc0Z0lGeHVJQ0FnSUVsbUlIUm9aU0JoYzNOcGJXeHBZWFJsWkNCd2NtOXRhWE5sSUhKbGFtVmpkSE1zSUhSb1pXNGdkR2hsSUdSdmQyNXpkSEpsWVcwZ2NISnZiV2x6WlNCM2FXeHNJR0ZzYzI4Z2NtVnFaV04wTGx4dUlDQmNiaUFnSUNCZ1lHQnFjMXh1SUNBZ0lHWnBibVJWYzJWeUtDa3VkR2hsYmlobWRXNWpkR2x2YmlBb2RYTmxjaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1pwYm1SRGIyMXRaVzUwYzBKNVFYVjBhRzl5S0hWelpYSXBPMXh1SUNBZ0lIMHBMblJvWlc0b1puVnVZM1JwYjI0Z0tHTnZiVzFsYm5SektTQjdYRzRnSUNBZ0lDQXZMeUJKWmlCZ1ptbHVaRU52YlcxbGJuUnpRbmxCZFhSb2IzSmdJR1oxYkdacGJHeHpMQ0IzWlNkc2JDQm9ZWFpsSUhSb1pTQjJZV3gxWlNCb1pYSmxYRzRnSUNBZ2ZTd2dablZ1WTNScGIyNGdLSEpsWVhOdmJpa2dlMXh1SUNBZ0lDQWdMeThnU1dZZ1lHWnBibVJEYjIxdFpXNTBjMEo1UVhWMGFHOXlZQ0J5WldwbFkzUnpMQ0IzWlNkc2JDQm9ZWFpsSUhSb1pTQnlaV0Z6YjI0Z2FHVnlaVnh1SUNBZ0lIMHBPMXh1SUNBZ0lHQmdZRnh1SUNCY2JpQWdJQ0JUYVcxd2JHVWdSWGhoYlhCc1pWeHVJQ0FnSUMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUZ4dUlDQWdJRk41Ym1Ob2NtOXViM1Z6SUVWNFlXMXdiR1ZjYmlBZ1hHNGdJQ0FnWUdCZ2FtRjJZWE5qY21sd2RGeHVJQ0FnSUd4bGRDQnlaWE4xYkhRN1hHNGdJRnh1SUNBZ0lIUnllU0I3WEc0Z0lDQWdJQ0J5WlhOMWJIUWdQU0JtYVc1a1VtVnpkV3gwS0NrN1hHNGdJQ0FnSUNBdkx5QnpkV05qWlhOelhHNGdJQ0FnZlNCallYUmphQ2h5WldGemIyNHBJSHRjYmlBZ0lDQWdJQzh2SUdaaGFXeDFjbVZjYmlBZ0lDQjlYRzRnSUNBZ1lHQmdYRzRnSUZ4dUlDQWdJRVZ5Y21KaFkyc2dSWGhoYlhCc1pWeHVJQ0JjYmlBZ0lDQmdZR0JxYzF4dUlDQWdJR1pwYm1SU1pYTjFiSFFvWm5WdVkzUnBiMjRvY21WemRXeDBMQ0JsY25JcGUxeHVJQ0FnSUNBZ2FXWWdLR1Z5Y2lrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJtWVdsc2RYSmxYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJ6ZFdOalpYTnpYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTazdYRzRnSUNBZ1lHQmdYRzRnSUZ4dUlDQWdJRkJ5YjIxcGMyVWdSWGhoYlhCc1pUdGNiaUFnWEc0Z0lDQWdZR0JnYW1GMllYTmpjbWx3ZEZ4dUlDQWdJR1pwYm1SU1pYTjFiSFFvS1M1MGFHVnVLR1oxYm1OMGFXOXVLSEpsYzNWc2RDbDdYRzRnSUNBZ0lDQXZMeUJ6ZFdOalpYTnpYRzRnSUNBZ2ZTd2dablZ1WTNScGIyNG9jbVZoYzI5dUtYdGNiaUFnSUNBZ0lDOHZJR1poYVd4MWNtVmNiaUFnSUNCOUtUdGNiaUFnSUNCZ1lHQmNiaUFnWEc0Z0lDQWdRV1IyWVc1alpXUWdSWGhoYlhCc1pWeHVJQ0FnSUMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUZ4dUlDQWdJRk41Ym1Ob2NtOXViM1Z6SUVWNFlXMXdiR1ZjYmlBZ1hHNGdJQ0FnWUdCZ2FtRjJZWE5qY21sd2RGeHVJQ0FnSUd4bGRDQmhkWFJvYjNJc0lHSnZiMnR6TzF4dUlDQmNiaUFnSUNCMGNua2dlMXh1SUNBZ0lDQWdZWFYwYUc5eUlEMGdabWx1WkVGMWRHaHZjaWdwTzF4dUlDQWdJQ0FnWW05dmEzTWdJRDBnWm1sdVpFSnZiMnR6UW5sQmRYUm9iM0lvWVhWMGFHOXlLVHRjYmlBZ0lDQWdJQzh2SUhOMVkyTmxjM05jYmlBZ0lDQjlJR05oZEdOb0tISmxZWE52YmlrZ2UxeHVJQ0FnSUNBZ0x5OGdabUZwYkhWeVpWeHVJQ0FnSUgxY2JpQWdJQ0JnWUdCY2JpQWdYRzRnSUNBZ1JYSnlZbUZqYXlCRmVHRnRjR3hsWEc0Z0lGeHVJQ0FnSUdCZ1lHcHpYRzRnSUZ4dUlDQWdJR1oxYm1OMGFXOXVJR1p2ZFc1a1FtOXZhM01vWW05dmEzTXBJSHRjYmlBZ1hHNGdJQ0FnZlZ4dUlDQmNiaUFnSUNCbWRXNWpkR2x2YmlCbVlXbHNkWEpsS0hKbFlYTnZiaWtnZTF4dUlDQmNiaUFnSUNCOVhHNGdJRnh1SUNBZ0lHWnBibVJCZFhSb2IzSW9ablZ1WTNScGIyNG9ZWFYwYUc5eUxDQmxjbklwZTF4dUlDQWdJQ0FnYVdZZ0tHVnljaWtnZTF4dUlDQWdJQ0FnSUNCbVlXbHNkWEpsS0dWeWNpazdYRzRnSUNBZ0lDQWdJQzh2SUdaaGFXeDFjbVZjYmlBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJSFJ5ZVNCN1hHNGdJQ0FnSUNBZ0lDQWdabWx1WkVKdmIyOXJjMEo1UVhWMGFHOXlLR0YxZEdodmNpd2dablZ1WTNScGIyNG9ZbTl2YTNNc0lHVnljaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dWeWNpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQm1ZV2xzZFhKbEtHVnljaWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGNua2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1p2ZFc1a1FtOXZhM01vWW05dmEzTXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjlJR05oZEdOb0tISmxZWE52YmlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHWmhhV3gxY21Vb2NtVmhjMjl1S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQjlJR05oZEdOb0tHVnljbTl5S1NCN1hHNGdJQ0FnSUNBZ0lDQWdabUZwYkhWeVpTaGxjbklwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDOHZJSE4xWTJObGMzTmNiaUFnSUNBZ0lIMWNiaUFnSUNCOUtUdGNiaUFnSUNCZ1lHQmNiaUFnWEc0Z0lDQWdVSEp2YldselpTQkZlR0Z0Y0d4bE8xeHVJQ0JjYmlBZ0lDQmdZR0JxWVhaaGMyTnlhWEIwWEc0Z0lDQWdabWx1WkVGMWRHaHZjaWdwTGx4dUlDQWdJQ0FnZEdobGJpaG1hVzVrUW05dmEzTkNlVUYxZEdodmNpa3VYRzRnSUNBZ0lDQjBhR1Z1S0daMWJtTjBhVzl1S0dKdmIydHpLWHRjYmlBZ0lDQWdJQ0FnTHk4Z1ptOTFibVFnWW05dmEzTmNiaUFnSUNCOUtTNWpZWFJqYUNobWRXNWpkR2x2YmloeVpXRnpiMjRwZTF4dUlDQWdJQ0FnTHk4Z2MyOXRaWFJvYVc1bklIZGxiblFnZDNKdmJtZGNiaUFnSUNCOUtUdGNiaUFnSUNCZ1lHQmNiaUFnWEc0Z0lDQWdRRzFsZEdodlpDQjBhR1Z1WEc0Z0lDQWdRSEJoY21GdElIdEdkVzVqZEdsdmJuMGdiMjVHZFd4bWFXeHNaV1JjYmlBZ0lDQkFjR0Z5WVcwZ2UwWjFibU4wYVc5dWZTQnZibEpsYW1WamRHVmtYRzRnSUNBZ1ZYTmxablZzSUdadmNpQjBiMjlzYVc1bkxseHVJQ0FnSUVCeVpYUjFjbTRnZTFCeWIyMXBjMlY5WEc0Z0lDb3ZYRzRnSUhSb1pXNDZJSFJvWlc0c1hHNWNiaUFnTHlvcVhHNGdJQ0FnWUdOaGRHTm9ZQ0JwY3lCemFXMXdiSGtnYzNWbllYSWdabTl5SUdCMGFHVnVLSFZ1WkdWbWFXNWxaQ3dnYjI1U1pXcGxZM1JwYjI0cFlDQjNhR2xqYUNCdFlXdGxjeUJwZENCMGFHVWdjMkZ0WlZ4dUlDQWdJR0Z6SUhSb1pTQmpZWFJqYUNCaWJHOWpheUJ2WmlCaElIUnllUzlqWVhSamFDQnpkR0YwWlcxbGJuUXVYRzRnSUZ4dUlDQWdJR0JnWUdwelhHNGdJQ0FnWm5WdVkzUnBiMjRnWm1sdVpFRjFkR2h2Y2lncGUxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkamIzVnNaRzRuZENCbWFXNWtJSFJvWVhRZ1lYVjBhRzl5SnlrN1hHNGdJQ0FnZlZ4dUlDQmNiaUFnSUNBdkx5QnplVzVqYUhKdmJtOTFjMXh1SUNBZ0lIUnllU0I3WEc0Z0lDQWdJQ0JtYVc1a1FYVjBhRzl5S0NrN1hHNGdJQ0FnZlNCallYUmphQ2h5WldGemIyNHBJSHRjYmlBZ0lDQWdJQzh2SUhOdmJXVjBhR2x1WnlCM1pXNTBJSGR5YjI1blhHNGdJQ0FnZlZ4dUlDQmNiaUFnSUNBdkx5QmhjM2x1WXlCM2FYUm9JSEJ5YjIxcGMyVnpYRzRnSUNBZ1ptbHVaRUYxZEdodmNpZ3BMbU5oZEdOb0tHWjFibU4wYVc5dUtISmxZWE52YmlsN1hHNGdJQ0FnSUNBdkx5QnpiMjFsZEdocGJtY2dkMlZ1ZENCM2NtOXVaMXh1SUNBZ0lIMHBPMXh1SUNBZ0lHQmdZRnh1SUNCY2JpQWdJQ0JBYldWMGFHOWtJR05oZEdOb1hHNGdJQ0FnUUhCaGNtRnRJSHRHZFc1amRHbHZibjBnYjI1U1pXcGxZM1JwYjI1Y2JpQWdJQ0JWYzJWbWRXd2dabTl5SUhSdmIyeHBibWN1WEc0Z0lDQWdRSEpsZEhWeWJpQjdVSEp2YldselpYMWNiaUFnS2k5Y2JpQWdKMk5oZEdOb0p6b2dablZ1WTNScGIyNGdYMk5oZEdOb0tHOXVVbVZxWldOMGFXOXVLU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11ZEdobGJpaHVkV3hzTENCdmJsSmxhbVZqZEdsdmJpazdYRzRnSUgxY2JuMDdYRzVjYm1aMWJtTjBhVzl1SUhCdmJIbG1hV3hzS0NrZ2UxeHVJQ0FnSUhaaGNpQnNiMk5oYkNBOUlIVnVaR1ZtYVc1bFpEdGNibHh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdaMnh2WW1Gc0lDRTlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUNBZ0lDQnNiMk5oYkNBOUlHZHNiMkpoYkR0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0hSNWNHVnZaaUJ6Wld4bUlDRTlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUNBZ0lDQnNiMk5oYkNBOUlITmxiR1k3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdkSEo1SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR3h2WTJGc0lEMGdSblZ1WTNScGIyNG9KM0psZEhWeWJpQjBhR2x6Snlrb0tUdGNiaUFnSUNBZ0lDQWdmU0JqWVhSamFDQW9aU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZHdiMng1Wm1sc2JDQm1ZV2xzWldRZ1ltVmpZWFZ6WlNCbmJHOWlZV3dnYjJKcVpXTjBJR2x6SUhWdVlYWmhhV3hoWW14bElHbHVJSFJvYVhNZ1pXNTJhWEp2Ym0xbGJuUW5LVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJSFpoY2lCUUlEMGdiRzlqWVd3dVVISnZiV2x6WlR0Y2JseHVJQ0FnSUdsbUlDaFFLU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQndjbTl0YVhObFZHOVRkSEpwYm1jZ1BTQnVkV3hzTzF4dUlDQWdJQ0FnSUNCMGNua2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NISnZiV2x6WlZSdlUzUnlhVzVuSUQwZ1QySnFaV04wTG5CeWIzUnZkSGx3WlM1MGIxTjBjbWx1Wnk1allXeHNLRkF1Y21WemIyeDJaU2dwS1R0Y2JpQWdJQ0FnSUNBZ2ZTQmpZWFJqYUNBb1pTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdjMmxzWlc1MGJIa2dhV2R1YjNKbFpGeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tIQnliMjFwYzJWVWIxTjBjbWx1WnlBOVBUMGdKMXR2WW1wbFkzUWdVSEp2YldselpWMG5JQ1ltSUNGUUxtTmhjM1FwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJqdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHeHZZMkZzTGxCeWIyMXBjMlVnUFNCUWNtOXRhWE5sTzF4dWZWeHVYRzR2THlCVGRISmhibWRsSUdOdmJYQmhkQzR1WEc1UWNtOXRhWE5sTG5CdmJIbG1hV3hzSUQwZ2NHOXNlV1pwYkd3N1hHNVFjbTl0YVhObExsQnliMjFwYzJVZ1BTQlFjbTl0YVhObE8xeHVYRzV5WlhSMWNtNGdVSEp2YldselpUdGNibHh1ZlNrcEtUdGNiaTh2SXlCemIzVnlZMlZOWVhCd2FXNW5WVkpNUFdWek5pMXdjbTl0YVhObExtMWhjQ0pkZlE9PSIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZSgnX3Byb2Nlc3MnKSx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW01dlpHVmZiVzlrZFd4bGN5OTFkR2xzTDNWMGFXd3Vhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJRU52Y0hseWFXZG9kQ0JLYjNsbGJuUXNJRWx1WXk0Z1lXNWtJRzkwYUdWeUlFNXZaR1VnWTI5dWRISnBZblYwYjNKekxseHVMeTljYmk4dklGQmxjbTFwYzNOcGIyNGdhWE1nYUdWeVpXSjVJR2R5WVc1MFpXUXNJR1p5WldVZ2IyWWdZMmhoY21kbExDQjBieUJoYm5rZ2NHVnljMjl1SUc5aWRHRnBibWx1WnlCaFhHNHZMeUJqYjNCNUlHOW1JSFJvYVhNZ2MyOW1kSGRoY21VZ1lXNWtJR0Z6YzI5amFXRjBaV1FnWkc5amRXMWxiblJoZEdsdmJpQm1hV3hsY3lBb2RHaGxYRzR2THlCY0lsTnZablIzWVhKbFhDSXBMQ0IwYnlCa1pXRnNJR2x1SUhSb1pTQlRiMlowZDJGeVpTQjNhWFJvYjNWMElISmxjM1J5YVdOMGFXOXVMQ0JwYm1Oc2RXUnBibWRjYmk4dklIZHBkR2h2ZFhRZ2JHbHRhWFJoZEdsdmJpQjBhR1VnY21sbmFIUnpJSFJ2SUhWelpTd2dZMjl3ZVN3Z2JXOWthV1o1TENCdFpYSm5aU3dnY0hWaWJHbHphQ3hjYmk4dklHUnBjM1J5YVdKMWRHVXNJSE4xWW14cFkyVnVjMlVzSUdGdVpDOXZjaUJ6Wld4c0lHTnZjR2xsY3lCdlppQjBhR1VnVTI5bWRIZGhjbVVzSUdGdVpDQjBieUJ3WlhKdGFYUmNiaTh2SUhCbGNuTnZibk1nZEc4Z2QyaHZiU0IwYUdVZ1UyOW1kSGRoY21VZ2FYTWdablZ5Ym1semFHVmtJSFJ2SUdSdklITnZMQ0J6ZFdKcVpXTjBJSFJ2SUhSb1pWeHVMeThnWm05c2JHOTNhVzVuSUdOdmJtUnBkR2x2Ym5NNlhHNHZMMXh1THk4Z1ZHaGxJR0ZpYjNabElHTnZjSGx5YVdkb2RDQnViM1JwWTJVZ1lXNWtJSFJvYVhNZ2NHVnliV2x6YzJsdmJpQnViM1JwWTJVZ2MyaGhiR3dnWW1VZ2FXNWpiSFZrWldSY2JpOHZJR2x1SUdGc2JDQmpiM0JwWlhNZ2IzSWdjM1ZpYzNSaGJuUnBZV3dnY0c5eWRHbHZibk1nYjJZZ2RHaGxJRk52Wm5SM1lYSmxMbHh1THk5Y2JpOHZJRlJJUlNCVFQwWlVWMEZTUlNCSlV5QlFVazlXU1VSRlJDQmNJa0ZUSUVsVFhDSXNJRmRKVkVoUFZWUWdWMEZTVWtGT1ZGa2dUMFlnUVU1WklFdEpUa1FzSUVWWVVGSkZVMU5jYmk4dklFOVNJRWxOVUV4SlJVUXNJRWxPUTB4VlJFbE9SeUJDVlZRZ1RrOVVJRXhKVFVsVVJVUWdWRThnVkVoRklGZEJVbEpCVGxSSlJWTWdUMFpjYmk4dklFMUZVa05JUVU1VVFVSkpURWxVV1N3Z1JrbFVUa1ZUVXlCR1QxSWdRU0JRUVZKVVNVTlZURUZTSUZCVlVsQlBVMFVnUVU1RUlFNVBUa2xPUmxKSlRrZEZUVVZPVkM0Z1NVNWNiaTh2SUU1UElFVldSVTVVSUZOSVFVeE1JRlJJUlNCQlZWUklUMUpUSUU5U0lFTlBVRmxTU1VkSVZDQklUMHhFUlZKVElFSkZJRXhKUVVKTVJTQkdUMUlnUVU1WklFTk1RVWxOTEZ4dUx5OGdSRUZOUVVkRlV5QlBVaUJQVkVoRlVpQk1TVUZDU1V4SlZGa3NJRmRJUlZSSVJWSWdTVTRnUVU0Z1FVTlVTVTlPSUU5R0lFTlBUbFJTUVVOVUxDQlVUMUpVSUU5U1hHNHZMeUJQVkVoRlVsZEpVMFVzSUVGU1NWTkpUa2NnUmxKUFRTd2dUMVZVSUU5R0lFOVNJRWxPSUVOUFRrNUZRMVJKVDA0Z1YwbFVTQ0JVU0VVZ1UwOUdWRmRCVWtVZ1QxSWdWRWhGWEc0dkx5QlZVMFVnVDFJZ1QxUklSVklnUkVWQlRFbE9SMU1nU1U0Z1ZFaEZJRk5QUmxSWFFWSkZMbHh1WEc1MllYSWdabTl5YldGMFVtVm5SWGh3SUQwZ0x5VmJjMlJxSlYwdlp6dGNibVY0Y0c5eWRITXVabTl5YldGMElEMGdablZ1WTNScGIyNG9aaWtnZTF4dUlDQnBaaUFvSVdselUzUnlhVzVuS0dZcEtTQjdYRzRnSUNBZ2RtRnlJRzlpYW1WamRITWdQU0JiWFR0Y2JpQWdJQ0JtYjNJZ0tIWmhjaUJwSUQwZ01Ec2dhU0E4SUdGeVozVnRaVzUwY3k1c1pXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lDQWdiMkpxWldOMGN5NXdkWE5vS0dsdWMzQmxZM1FvWVhKbmRXMWxiblJ6VzJsZEtTazdYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUJ2WW1wbFkzUnpMbXB2YVc0b0p5QW5LVHRjYmlBZ2ZWeHVYRzRnSUhaaGNpQnBJRDBnTVR0Y2JpQWdkbUZ5SUdGeVozTWdQU0JoY21kMWJXVnVkSE03WEc0Z0lIWmhjaUJzWlc0Z1BTQmhjbWR6TG14bGJtZDBhRHRjYmlBZ2RtRnlJSE4wY2lBOUlGTjBjbWx1WnlobUtTNXlaWEJzWVdObEtHWnZjbTFoZEZKbFowVjRjQ3dnWm5WdVkzUnBiMjRvZUNrZ2UxeHVJQ0FnSUdsbUlDaDRJRDA5UFNBbkpTVW5LU0J5WlhSMWNtNGdKeVVuTzF4dUlDQWdJR2xtSUNocElENDlJR3hsYmlrZ2NtVjBkWEp1SUhnN1hHNGdJQ0FnYzNkcGRHTm9JQ2g0S1NCN1hHNGdJQ0FnSUNCallYTmxJQ2NsY3ljNklISmxkSFZ5YmlCVGRISnBibWNvWVhKbmMxdHBLeXRkS1R0Y2JpQWdJQ0FnSUdOaGMyVWdKeVZrSnpvZ2NtVjBkWEp1SUU1MWJXSmxjaWhoY21kelcya3JLMTBwTzF4dUlDQWdJQ0FnWTJGelpTQW5KV29uT2x4dUlDQWdJQ0FnSUNCMGNua2dlMXh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJLVTA5T0xuTjBjbWx1WjJsbWVTaGhjbWR6VzJrcksxMHBPMXh1SUNBZ0lDQWdJQ0I5SUdOaGRHTm9JQ2hmS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlDZGJRMmx5WTNWc1lYSmRKenRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnWkdWbVlYVnNkRHBjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSGc3WEc0Z0lDQWdmVnh1SUNCOUtUdGNiaUFnWm05eUlDaDJZWElnZUNBOUlHRnlaM05iYVYwN0lHa2dQQ0JzWlc0N0lIZ2dQU0JoY21keld5c3JhVjBwSUh0Y2JpQWdJQ0JwWmlBb2FYTk9kV3hzS0hncElIeDhJQ0ZwYzA5aWFtVmpkQ2g0S1NrZ2UxeHVJQ0FnSUNBZ2MzUnlJQ3M5SUNjZ0p5QXJJSGc3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lITjBjaUFyUFNBbklDY2dLeUJwYm5Od1pXTjBLSGdwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVJQ0J5WlhSMWNtNGdjM1J5TzF4dWZUdGNibHh1WEc0dkx5Qk5ZWEpySUhSb1lYUWdZU0J0WlhSb2IyUWdjMmh2ZFd4a0lHNXZkQ0JpWlNCMWMyVmtMbHh1THk4Z1VtVjBkWEp1Y3lCaElHMXZaR2xtYVdWa0lHWjFibU4wYVc5dUlIZG9hV05vSUhkaGNtNXpJRzl1WTJVZ1lua2daR1ZtWVhWc2RDNWNiaTh2SUVsbUlDMHRibTh0WkdWd2NtVmpZWFJwYjI0Z2FYTWdjMlYwTENCMGFHVnVJR2wwSUdseklHRWdibTh0YjNBdVhHNWxlSEJ2Y25SekxtUmxjSEpsWTJGMFpTQTlJR1oxYm1OMGFXOXVLR1p1TENCdGMyY3BJSHRjYmlBZ0x5OGdRV3hzYjNjZ1ptOXlJR1JsY0hKbFkyRjBhVzVuSUhSb2FXNW5jeUJwYmlCMGFHVWdjSEp2WTJWemN5QnZaaUJ6ZEdGeWRHbHVaeUIxY0M1Y2JpQWdhV1lnS0dselZXNWtaV1pwYm1Wa0tHZHNiMkpoYkM1d2NtOWpaWE56S1NrZ2UxeHVJQ0FnSUhKbGRIVnliaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJsZUhCdmNuUnpMbVJsY0hKbFkyRjBaU2htYml3Z2JYTm5LUzVoY0hCc2VTaDBhR2x6TENCaGNtZDFiV1Z1ZEhNcE8xeHVJQ0FnSUgwN1hHNGdJSDFjYmx4dUlDQnBaaUFvY0hKdlkyVnpjeTV1YjBSbGNISmxZMkYwYVc5dUlEMDlQU0IwY25WbEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUdadU8xeHVJQ0I5WEc1Y2JpQWdkbUZ5SUhkaGNtNWxaQ0E5SUdaaGJITmxPMXh1SUNCbWRXNWpkR2x2YmlCa1pYQnlaV05oZEdWa0tDa2dlMXh1SUNBZ0lHbG1JQ2doZDJGeWJtVmtLU0I3WEc0Z0lDQWdJQ0JwWmlBb2NISnZZMlZ6Y3k1MGFISnZkMFJsY0hKbFkyRjBhVzl1S1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lodGMyY3BPMXh1SUNBZ0lDQWdmU0JsYkhObElHbG1JQ2h3Y205alpYTnpMblJ5WVdObFJHVndjbVZqWVhScGIyNHBJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMyOXNaUzUwY21GalpTaHRjMmNwTzF4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMyOXNaUzVsY25KdmNpaHRjMmNwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnZDJGeWJtVmtJRDBnZEhKMVpUdGNiaUFnSUNCOVhHNGdJQ0FnY21WMGRYSnVJR1p1TG1Gd2NHeDVLSFJvYVhNc0lHRnlaM1Z0Wlc1MGN5azdYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdaR1Z3Y21WallYUmxaRHRjYm4wN1hHNWNibHh1ZG1GeUlHUmxZblZuY3lBOUlIdDlPMXh1ZG1GeUlHUmxZblZuUlc1MmFYSnZianRjYm1WNGNHOXlkSE11WkdWaWRXZHNiMmNnUFNCbWRXNWpkR2x2YmloelpYUXBJSHRjYmlBZ2FXWWdLR2x6Vlc1a1pXWnBibVZrS0dSbFluVm5SVzUyYVhKdmJpa3BYRzRnSUNBZ1pHVmlkV2RGYm5acGNtOXVJRDBnY0hKdlkyVnpjeTVsYm5ZdVRrOUVSVjlFUlVKVlJ5QjhmQ0FuSnp0Y2JpQWdjMlYwSUQwZ2MyVjBMblJ2VlhCd1pYSkRZWE5sS0NrN1hHNGdJR2xtSUNnaFpHVmlkV2R6VzNObGRGMHBJSHRjYmlBZ0lDQnBaaUFvYm1WM0lGSmxaMFY0Y0NnblhGeGNYR0luSUNzZ2MyVjBJQ3NnSjF4Y1hGeGlKeXdnSjJrbktTNTBaWE4wS0dSbFluVm5SVzUyYVhKdmJpa3BJSHRjYmlBZ0lDQWdJSFpoY2lCd2FXUWdQU0J3Y205alpYTnpMbkJwWkR0Y2JpQWdJQ0FnSUdSbFluVm5jMXR6WlhSZElEMGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQnRjMmNnUFNCbGVIQnZjblJ6TG1admNtMWhkQzVoY0hCc2VTaGxlSEJ2Y25SekxDQmhjbWQxYldWdWRITXBPMXh1SUNBZ0lDQWdJQ0JqYjI1emIyeGxMbVZ5Y205eUtDY2xjeUFsWkRvZ0pYTW5MQ0J6WlhRc0lIQnBaQ3dnYlhObktUdGNiaUFnSUNBZ0lIMDdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUdSbFluVm5jMXR6WlhSZElEMGdablZ1WTNScGIyNG9LU0I3ZlR0Y2JpQWdJQ0I5WEc0Z0lIMWNiaUFnY21WMGRYSnVJR1JsWW5WbmMxdHpaWFJkTzF4dWZUdGNibHh1WEc0dktpcGNiaUFxSUVWamFHOXpJSFJvWlNCMllXeDFaU0J2WmlCaElIWmhiSFZsTGlCVWNubHpJSFJ2SUhCeWFXNTBJSFJvWlNCMllXeDFaU0J2ZFhSY2JpQXFJR2x1SUhSb1pTQmlaWE4wSUhkaGVTQndiM056YVdKc1pTQm5hWFpsYmlCMGFHVWdaR2xtWm1WeVpXNTBJSFI1Y0dWekxseHVJQ3BjYmlBcUlFQndZWEpoYlNCN1QySnFaV04wZlNCdlltb2dWR2hsSUc5aWFtVmpkQ0IwYnlCd2NtbHVkQ0J2ZFhRdVhHNGdLaUJBY0dGeVlXMGdlMDlpYW1WamRIMGdiM0IwY3lCUGNIUnBiMjVoYkNCdmNIUnBiMjV6SUc5aWFtVmpkQ0IwYUdGMElHRnNkR1Z5Y3lCMGFHVWdiM1YwY0hWMExseHVJQ292WEc0dktpQnNaV2RoWTNrNklHOWlhaXdnYzJodmQwaHBaR1JsYml3Z1pHVndkR2dzSUdOdmJHOXljeW92WEc1bWRXNWpkR2x2YmlCcGJuTndaV04wS0c5aWFpd2diM0IwY3lrZ2UxeHVJQ0F2THlCa1pXWmhkV3gwSUc5d2RHbHZibk5jYmlBZ2RtRnlJR04wZUNBOUlIdGNiaUFnSUNCelpXVnVPaUJiWFN4Y2JpQWdJQ0J6ZEhsc2FYcGxPaUJ6ZEhsc2FYcGxUbTlEYjJ4dmNseHVJQ0I5TzF4dUlDQXZMeUJzWldkaFkza3VMaTVjYmlBZ2FXWWdLR0Z5WjNWdFpXNTBjeTVzWlc1bmRHZ2dQajBnTXlrZ1kzUjRMbVJsY0hSb0lEMGdZWEpuZFcxbGJuUnpXekpkTzF4dUlDQnBaaUFvWVhKbmRXMWxiblJ6TG14bGJtZDBhQ0ErUFNBMEtTQmpkSGd1WTI5c2IzSnpJRDBnWVhKbmRXMWxiblJ6V3pOZE8xeHVJQ0JwWmlBb2FYTkNiMjlzWldGdUtHOXdkSE1wS1NCN1hHNGdJQ0FnTHk4Z2JHVm5ZV041TGk0dVhHNGdJQ0FnWTNSNExuTm9iM2RJYVdSa1pXNGdQU0J2Y0hSek8xeHVJQ0I5SUdWc2MyVWdhV1lnS0c5d2RITXBJSHRjYmlBZ0lDQXZMeUJuYjNRZ1lXNGdYQ0p2Y0hScGIyNXpYQ0lnYjJKcVpXTjBYRzRnSUNBZ1pYaHdiM0owY3k1ZlpYaDBaVzVrS0dOMGVDd2diM0IwY3lrN1hHNGdJSDFjYmlBZ0x5OGdjMlYwSUdSbFptRjFiSFFnYjNCMGFXOXVjMXh1SUNCcFppQW9hWE5WYm1SbFptbHVaV1FvWTNSNExuTm9iM2RJYVdSa1pXNHBLU0JqZEhndWMyaHZkMGhwWkdSbGJpQTlJR1poYkhObE8xeHVJQ0JwWmlBb2FYTlZibVJsWm1sdVpXUW9ZM1I0TG1SbGNIUm9LU2tnWTNSNExtUmxjSFJvSUQwZ01qdGNiaUFnYVdZZ0tHbHpWVzVrWldacGJtVmtLR04wZUM1amIyeHZjbk1wS1NCamRIZ3VZMjlzYjNKeklEMGdabUZzYzJVN1hHNGdJR2xtSUNocGMxVnVaR1ZtYVc1bFpDaGpkSGd1WTNWemRHOXRTVzV6Y0dWamRDa3BJR04wZUM1amRYTjBiMjFKYm5Od1pXTjBJRDBnZEhKMVpUdGNiaUFnYVdZZ0tHTjBlQzVqYjJ4dmNuTXBJR04wZUM1emRIbHNhWHBsSUQwZ2MzUjViR2w2WlZkcGRHaERiMnh2Y2p0Y2JpQWdjbVYwZFhKdUlHWnZjbTFoZEZaaGJIVmxLR04wZUN3Z2IySnFMQ0JqZEhndVpHVndkR2dwTzF4dWZWeHVaWGh3YjNKMGN5NXBibk53WldOMElEMGdhVzV6Y0dWamREdGNibHh1WEc0dkx5Qm9kSFJ3T2k4dlpXNHVkMmxyYVhCbFpHbGhMbTl5Wnk5M2FXdHBMMEZPVTBsZlpYTmpZWEJsWDJOdlpHVWpaM0poY0docFkzTmNibWx1YzNCbFkzUXVZMjlzYjNKeklEMGdlMXh1SUNBblltOXNaQ2NnT2lCYk1Td2dNakpkTEZ4dUlDQW5hWFJoYkdsakp5QTZJRnN6TENBeU0xMHNYRzRnSUNkMWJtUmxjbXhwYm1VbklEb2dXelFzSURJMFhTeGNiaUFnSjJsdWRtVnljMlVuSURvZ1d6Y3NJREkzWFN4Y2JpQWdKM2RvYVhSbEp5QTZJRnN6Tnl3Z016bGRMRnh1SUNBblozSmxlU2NnT2lCYk9UQXNJRE01WFN4Y2JpQWdKMkpzWVdOckp5QTZJRnN6TUN3Z016bGRMRnh1SUNBbllteDFaU2NnT2lCYk16UXNJRE01WFN4Y2JpQWdKMk41WVc0bklEb2dXek0yTENBek9WMHNYRzRnSUNkbmNtVmxiaWNnT2lCYk16SXNJRE01WFN4Y2JpQWdKMjFoWjJWdWRHRW5JRG9nV3pNMUxDQXpPVjBzWEc0Z0lDZHlaV1FuSURvZ1d6TXhMQ0F6T1Ywc1hHNGdJQ2Q1Wld4c2IzY25JRG9nV3pNekxDQXpPVjFjYm4wN1hHNWNiaTh2SUVSdmJpZDBJSFZ6WlNBbllteDFaU2NnYm05MElIWnBjMmxpYkdVZ2IyNGdZMjFrTG1WNFpWeHVhVzV6Y0dWamRDNXpkSGxzWlhNZ1BTQjdYRzRnSUNkemNHVmphV0ZzSnpvZ0oyTjVZVzRuTEZ4dUlDQW5iblZ0WW1WeUp6b2dKM2xsYkd4dmR5Y3NYRzRnSUNkaWIyOXNaV0Z1SnpvZ0ozbGxiR3h2ZHljc1hHNGdJQ2QxYm1SbFptbHVaV1FuT2lBblozSmxlU2NzWEc0Z0lDZHVkV3hzSnpvZ0oySnZiR1FuTEZ4dUlDQW5jM1J5YVc1bkp6b2dKMmR5WldWdUp5eGNiaUFnSjJSaGRHVW5PaUFuYldGblpXNTBZU2NzWEc0Z0lDOHZJRndpYm1GdFpWd2lPaUJwYm5SbGJuUnBiMjVoYkd4NUlHNXZkQ0J6ZEhsc2FXNW5YRzRnSUNkeVpXZGxlSEFuT2lBbmNtVmtKMXh1ZlR0Y2JseHVYRzVtZFc1amRHbHZiaUJ6ZEhsc2FYcGxWMmwwYUVOdmJHOXlLSE4wY2l3Z2MzUjViR1ZVZVhCbEtTQjdYRzRnSUhaaGNpQnpkSGxzWlNBOUlHbHVjM0JsWTNRdWMzUjViR1Z6VzNOMGVXeGxWSGx3WlYwN1hHNWNiaUFnYVdZZ0tITjBlV3hsS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2RjWEhVd01ERmlXeWNnS3lCcGJuTndaV04wTG1OdmJHOXljMXR6ZEhsc1pWMWJNRjBnS3lBbmJTY2dLeUJ6ZEhJZ0sxeHVJQ0FnSUNBZ0lDQWdJQ0FuWEZ4MU1EQXhZbHNuSUNzZ2FXNXpjR1ZqZEM1amIyeHZjbk5iYzNSNWJHVmRXekZkSUNzZ0oyMG5PMXh1SUNCOUlHVnNjMlVnZTF4dUlDQWdJSEpsZEhWeWJpQnpkSEk3WEc0Z0lIMWNibjFjYmx4dVhHNW1kVzVqZEdsdmJpQnpkSGxzYVhwbFRtOURiMnh2Y2loemRISXNJSE4wZVd4bFZIbHdaU2tnZTF4dUlDQnlaWFIxY200Z2MzUnlPMXh1ZlZ4dVhHNWNibVoxYm1OMGFXOXVJR0Z5Y21GNVZHOUlZWE5vS0dGeWNtRjVLU0I3WEc0Z0lIWmhjaUJvWVhOb0lEMGdlMzA3WEc1Y2JpQWdZWEp5WVhrdVptOXlSV0ZqYUNobWRXNWpkR2x2YmloMllXd3NJR2xrZUNrZ2UxeHVJQ0FnSUdoaGMyaGJkbUZzWFNBOUlIUnlkV1U3WEc0Z0lIMHBPMXh1WEc0Z0lISmxkSFZ5YmlCb1lYTm9PMXh1ZlZ4dVhHNWNibVoxYm1OMGFXOXVJR1p2Y20xaGRGWmhiSFZsS0dOMGVDd2dkbUZzZFdVc0lISmxZM1Z5YzJWVWFXMWxjeWtnZTF4dUlDQXZMeUJRY205MmFXUmxJR0VnYUc5dmF5Qm1iM0lnZFhObGNpMXpjR1ZqYVdacFpXUWdhVzV6Y0dWamRDQm1kVzVqZEdsdmJuTXVYRzRnSUM4dklFTm9aV05ySUhSb1lYUWdkbUZzZFdVZ2FYTWdZVzRnYjJKcVpXTjBJSGRwZEdnZ1lXNGdhVzV6Y0dWamRDQm1kVzVqZEdsdmJpQnZiaUJwZEZ4dUlDQnBaaUFvWTNSNExtTjFjM1J2YlVsdWMzQmxZM1FnSmlaY2JpQWdJQ0FnSUhaaGJIVmxJQ1ltWEc0Z0lDQWdJQ0JwYzBaMWJtTjBhVzl1S0haaGJIVmxMbWx1YzNCbFkzUXBJQ1ltWEc0Z0lDQWdJQ0F2THlCR2FXeDBaWElnYjNWMElIUm9aU0IxZEdsc0lHMXZaSFZzWlN3Z2FYUW5jeUJwYm5Od1pXTjBJR1oxYm1OMGFXOXVJR2x6SUhOd1pXTnBZV3hjYmlBZ0lDQWdJSFpoYkhWbExtbHVjM0JsWTNRZ0lUMDlJR1Y0Y0c5eWRITXVhVzV6Y0dWamRDQW1KbHh1SUNBZ0lDQWdMeThnUVd4emJ5Qm1hV3gwWlhJZ2IzVjBJR0Z1ZVNCd2NtOTBiM1I1Y0dVZ2IySnFaV04wY3lCMWMybHVaeUIwYUdVZ1kybHlZM1ZzWVhJZ1kyaGxZMnN1WEc0Z0lDQWdJQ0FoS0haaGJIVmxMbU52Ym5OMGNuVmpkRzl5SUNZbUlIWmhiSFZsTG1OdmJuTjBjblZqZEc5eUxuQnliM1J2ZEhsd1pTQTlQVDBnZG1Gc2RXVXBLU0I3WEc0Z0lDQWdkbUZ5SUhKbGRDQTlJSFpoYkhWbExtbHVjM0JsWTNRb2NtVmpkWEp6WlZScGJXVnpMQ0JqZEhncE8xeHVJQ0FnSUdsbUlDZ2hhWE5UZEhKcGJtY29jbVYwS1NrZ2UxeHVJQ0FnSUNBZ2NtVjBJRDBnWm05eWJXRjBWbUZzZFdVb1kzUjRMQ0J5WlhRc0lISmxZM1Z5YzJWVWFXMWxjeWs3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCeVpYUTdYRzRnSUgxY2JseHVJQ0F2THlCUWNtbHRhWFJwZG1VZ2RIbHdaWE1nWTJGdWJtOTBJR2hoZG1VZ2NISnZjR1Z5ZEdsbGMxeHVJQ0IyWVhJZ2NISnBiV2wwYVhabElEMGdabTl5YldGMFVISnBiV2wwYVhabEtHTjBlQ3dnZG1Gc2RXVXBPMXh1SUNCcFppQW9jSEpwYldsMGFYWmxLU0I3WEc0Z0lDQWdjbVYwZFhKdUlIQnlhVzFwZEdsMlpUdGNiaUFnZlZ4dVhHNGdJQzh2SUV4dmIyc2dkWEFnZEdobElHdGxlWE1nYjJZZ2RHaGxJRzlpYW1WamRDNWNiaUFnZG1GeUlHdGxlWE1nUFNCUFltcGxZM1F1YTJWNWN5aDJZV3gxWlNrN1hHNGdJSFpoY2lCMmFYTnBZbXhsUzJWNWN5QTlJR0Z5Y21GNVZHOUlZWE5vS0d0bGVYTXBPMXh1WEc0Z0lHbG1JQ2hqZEhndWMyaHZkMGhwWkdSbGJpa2dlMXh1SUNBZ0lHdGxlWE1nUFNCUFltcGxZM1F1WjJWMFQzZHVVSEp2Y0dWeWRIbE9ZVzFsY3loMllXeDFaU2s3WEc0Z0lIMWNibHh1SUNBdkx5QkpSU0JrYjJWemJpZDBJRzFoYTJVZ1pYSnliM0lnWm1sbGJHUnpJRzV2YmkxbGJuVnRaWEpoWW14bFhHNGdJQzh2SUdoMGRIQTZMeTl0YzJSdUxtMXBZM0p2YzI5bWRDNWpiMjB2Wlc0dGRYTXZiR2xpY21GeWVTOXBaUzlrZDNjMU1uTmlkQ2gyUFhaekxqazBLUzVoYzNCNFhHNGdJR2xtSUNocGMwVnljbTl5S0haaGJIVmxLVnh1SUNBZ0lDQWdKaVlnS0d0bGVYTXVhVzVrWlhoUFppZ25iV1Z6YzJGblpTY3BJRDQ5SURBZ2ZId2dhMlY1Y3k1cGJtUmxlRTltS0Nka1pYTmpjbWx3ZEdsdmJpY3BJRDQ5SURBcEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUdadmNtMWhkRVZ5Y205eUtIWmhiSFZsS1R0Y2JpQWdmVnh1WEc0Z0lDOHZJRk52YldVZ2RIbHdaU0J2WmlCdlltcGxZM1FnZDJsMGFHOTFkQ0J3Y205d1pYSjBhV1Z6SUdOaGJpQmlaU0J6YUc5eWRHTjFkSFJsWkM1Y2JpQWdhV1lnS0d0bGVYTXViR1Z1WjNSb0lEMDlQU0F3S1NCN1hHNGdJQ0FnYVdZZ0tHbHpSblZ1WTNScGIyNG9kbUZzZFdVcEtTQjdYRzRnSUNBZ0lDQjJZWElnYm1GdFpTQTlJSFpoYkhWbExtNWhiV1VnUHlBbk9pQW5JQ3NnZG1Gc2RXVXVibUZ0WlNBNklDY25PMXh1SUNBZ0lDQWdjbVYwZFhKdUlHTjBlQzV6ZEhsc2FYcGxLQ2RiUm5WdVkzUnBiMjRuSUNzZ2JtRnRaU0FySUNkZEp5d2dKM053WldOcFlXd25LVHRjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLR2x6VW1WblJYaHdLSFpoYkhWbEtTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHTjBlQzV6ZEhsc2FYcGxLRkpsWjBWNGNDNXdjbTkwYjNSNWNHVXVkRzlUZEhKcGJtY3VZMkZzYkNoMllXeDFaU2tzSUNkeVpXZGxlSEFuS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdhV1lnS0dselJHRjBaU2gyWVd4MVpTa3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmpkSGd1YzNSNWJHbDZaU2hFWVhSbExuQnliM1J2ZEhsd1pTNTBiMU4wY21sdVp5NWpZV3hzS0haaGJIVmxLU3dnSjJSaGRHVW5LVHRjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLR2x6UlhKeWIzSW9kbUZzZFdVcEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1ptOXliV0YwUlhKeWIzSW9kbUZzZFdVcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lIWmhjaUJpWVhObElEMGdKeWNzSUdGeWNtRjVJRDBnWm1Gc2MyVXNJR0p5WVdObGN5QTlJRnNuZXljc0lDZDlKMTA3WEc1Y2JpQWdMeThnVFdGclpTQkJjbkpoZVNCellYa2dkR2hoZENCMGFHVjVJR0Z5WlNCQmNuSmhlVnh1SUNCcFppQW9hWE5CY25KaGVTaDJZV3gxWlNrcElIdGNiaUFnSUNCaGNuSmhlU0E5SUhSeWRXVTdYRzRnSUNBZ1luSmhZMlZ6SUQwZ1d5ZGJKeXdnSjEwblhUdGNiaUFnZlZ4dVhHNGdJQzh2SUUxaGEyVWdablZ1WTNScGIyNXpJSE5oZVNCMGFHRjBJSFJvWlhrZ1lYSmxJR1oxYm1OMGFXOXVjMXh1SUNCcFppQW9hWE5HZFc1amRHbHZiaWgyWVd4MVpTa3BJSHRjYmlBZ0lDQjJZWElnYmlBOUlIWmhiSFZsTG01aGJXVWdQeUFuT2lBbklDc2dkbUZzZFdVdWJtRnRaU0E2SUNjbk8xeHVJQ0FnSUdKaGMyVWdQU0FuSUZ0R2RXNWpkR2x2YmljZ0t5QnVJQ3NnSjEwbk8xeHVJQ0I5WEc1Y2JpQWdMeThnVFdGclpTQlNaV2RGZUhCeklITmhlU0IwYUdGMElIUm9aWGtnWVhKbElGSmxaMFY0Y0hOY2JpQWdhV1lnS0dselVtVm5SWGh3S0haaGJIVmxLU2tnZTF4dUlDQWdJR0poYzJVZ1BTQW5JQ2NnS3lCU1pXZEZlSEF1Y0hKdmRHOTBlWEJsTG5SdlUzUnlhVzVuTG1OaGJHd29kbUZzZFdVcE8xeHVJQ0I5WEc1Y2JpQWdMeThnVFdGclpTQmtZWFJsY3lCM2FYUm9JSEJ5YjNCbGNuUnBaWE1nWm1seWMzUWdjMkY1SUhSb1pTQmtZWFJsWEc0Z0lHbG1JQ2hwYzBSaGRHVW9kbUZzZFdVcEtTQjdYRzRnSUNBZ1ltRnpaU0E5SUNjZ0p5QXJJRVJoZEdVdWNISnZkRzkwZVhCbExuUnZWVlJEVTNSeWFXNW5MbU5oYkd3b2RtRnNkV1VwTzF4dUlDQjlYRzVjYmlBZ0x5OGdUV0ZyWlNCbGNuSnZjaUIzYVhSb0lHMWxjM05oWjJVZ1ptbHljM1FnYzJGNUlIUm9aU0JsY25KdmNseHVJQ0JwWmlBb2FYTkZjbkp2Y2loMllXeDFaU2twSUh0Y2JpQWdJQ0JpWVhObElEMGdKeUFuSUNzZ1ptOXliV0YwUlhKeWIzSW9kbUZzZFdVcE8xeHVJQ0I5WEc1Y2JpQWdhV1lnS0d0bGVYTXViR1Z1WjNSb0lEMDlQU0F3SUNZbUlDZ2hZWEp5WVhrZ2ZId2dkbUZzZFdVdWJHVnVaM1JvSUQwOUlEQXBLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHSnlZV05sYzFzd1hTQXJJR0poYzJVZ0t5QmljbUZqWlhOYk1WMDdYRzRnSUgxY2JseHVJQ0JwWmlBb2NtVmpkWEp6WlZScGJXVnpJRHdnTUNrZ2UxeHVJQ0FnSUdsbUlDaHBjMUpsWjBWNGNDaDJZV3gxWlNrcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCamRIZ3VjM1I1YkdsNlpTaFNaV2RGZUhBdWNISnZkRzkwZVhCbExuUnZVM1J5YVc1bkxtTmhiR3dvZG1Gc2RXVXBMQ0FuY21WblpYaHdKeWs3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCamRIZ3VjM1I1YkdsNlpTZ25XMDlpYW1WamRGMG5MQ0FuYzNCbFkybGhiQ2NwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUdOMGVDNXpaV1Z1TG5CMWMyZ29kbUZzZFdVcE8xeHVYRzRnSUhaaGNpQnZkWFJ3ZFhRN1hHNGdJR2xtSUNoaGNuSmhlU2tnZTF4dUlDQWdJRzkxZEhCMWRDQTlJR1p2Y20xaGRFRnljbUY1S0dOMGVDd2dkbUZzZFdVc0lISmxZM1Z5YzJWVWFXMWxjeXdnZG1semFXSnNaVXRsZVhNc0lHdGxlWE1wTzF4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUc5MWRIQjFkQ0E5SUd0bGVYTXViV0Z3S0daMWJtTjBhVzl1S0d0bGVTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHWnZjbTFoZEZCeWIzQmxjblI1S0dOMGVDd2dkbUZzZFdVc0lISmxZM1Z5YzJWVWFXMWxjeXdnZG1semFXSnNaVXRsZVhNc0lHdGxlU3dnWVhKeVlYa3BPMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnWTNSNExuTmxaVzR1Y0c5d0tDazdYRzVjYmlBZ2NtVjBkWEp1SUhKbFpIVmpaVlJ2VTJsdVoyeGxVM1J5YVc1bktHOTFkSEIxZEN3Z1ltRnpaU3dnWW5KaFkyVnpLVHRjYm4xY2JseHVYRzVtZFc1amRHbHZiaUJtYjNKdFlYUlFjbWx0YVhScGRtVW9ZM1I0TENCMllXeDFaU2tnZTF4dUlDQnBaaUFvYVhOVmJtUmxabWx1WldRb2RtRnNkV1VwS1Z4dUlDQWdJSEpsZEhWeWJpQmpkSGd1YzNSNWJHbDZaU2duZFc1a1pXWnBibVZrSnl3Z0ozVnVaR1ZtYVc1bFpDY3BPMXh1SUNCcFppQW9hWE5UZEhKcGJtY29kbUZzZFdVcEtTQjdYRzRnSUNBZ2RtRnlJSE5wYlhCc1pTQTlJQ2RjWENjbklDc2dTbE5QVGk1emRISnBibWRwWm5rb2RtRnNkV1VwTG5KbGNHeGhZMlVvTDE1Y0lueGNJaVF2Wnl3Z0p5Y3BYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F1Y21Wd2JHRmpaU2d2Snk5bkxDQmNJbHhjWEZ3blhDSXBYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F1Y21Wd2JHRmpaU2d2WEZ4Y1hGd2lMMmNzSUNkY0lpY3BJQ3NnSjF4Y0p5YzdYRzRnSUNBZ2NtVjBkWEp1SUdOMGVDNXpkSGxzYVhwbEtITnBiWEJzWlN3Z0ozTjBjbWx1WnljcE8xeHVJQ0I5WEc0Z0lHbG1JQ2hwYzA1MWJXSmxjaWgyWVd4MVpTa3BYRzRnSUNBZ2NtVjBkWEp1SUdOMGVDNXpkSGxzYVhwbEtDY25JQ3NnZG1Gc2RXVXNJQ2R1ZFcxaVpYSW5LVHRjYmlBZ2FXWWdLR2x6UW05dmJHVmhiaWgyWVd4MVpTa3BYRzRnSUNBZ2NtVjBkWEp1SUdOMGVDNXpkSGxzYVhwbEtDY25JQ3NnZG1Gc2RXVXNJQ2RpYjI5c1pXRnVKeWs3WEc0Z0lDOHZJRVp2Y2lCemIyMWxJSEpsWVhOdmJpQjBlWEJsYjJZZ2JuVnNiQ0JwY3lCY0ltOWlhbVZqZEZ3aUxDQnpieUJ6Y0dWamFXRnNJR05oYzJVZ2FHVnlaUzVjYmlBZ2FXWWdLR2x6VG5Wc2JDaDJZV3gxWlNrcFhHNGdJQ0FnY21WMGRYSnVJR04wZUM1emRIbHNhWHBsS0NkdWRXeHNKeXdnSjI1MWJHd25LVHRjYm4xY2JseHVYRzVtZFc1amRHbHZiaUJtYjNKdFlYUkZjbkp2Y2loMllXeDFaU2tnZTF4dUlDQnlaWFIxY200Z0oxc25JQ3NnUlhKeWIzSXVjSEp2ZEc5MGVYQmxMblJ2VTNSeWFXNW5MbU5oYkd3b2RtRnNkV1VwSUNzZ0oxMG5PMXh1ZlZ4dVhHNWNibVoxYm1OMGFXOXVJR1p2Y20xaGRFRnljbUY1S0dOMGVDd2dkbUZzZFdVc0lISmxZM1Z5YzJWVWFXMWxjeXdnZG1semFXSnNaVXRsZVhNc0lHdGxlWE1wSUh0Y2JpQWdkbUZ5SUc5MWRIQjFkQ0E5SUZ0ZE8xeHVJQ0JtYjNJZ0tIWmhjaUJwSUQwZ01Dd2diQ0E5SUhaaGJIVmxMbXhsYm1kMGFEc2dhU0E4SUd3N0lDc3JhU2tnZTF4dUlDQWdJR2xtSUNob1lYTlBkMjVRY205d1pYSjBlU2gyWVd4MVpTd2dVM1J5YVc1bktHa3BLU2tnZTF4dUlDQWdJQ0FnYjNWMGNIVjBMbkIxYzJnb1ptOXliV0YwVUhKdmNHVnlkSGtvWTNSNExDQjJZV3gxWlN3Z2NtVmpkWEp6WlZScGJXVnpMQ0IyYVhOcFlteGxTMlY1Y3l4Y2JpQWdJQ0FnSUNBZ0lDQlRkSEpwYm1jb2FTa3NJSFJ5ZFdVcEtUdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnYjNWMGNIVjBMbkIxYzJnb0p5Y3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dUlDQnJaWGx6TG1admNrVmhZMmdvWm5WdVkzUnBiMjRvYTJWNUtTQjdYRzRnSUNBZ2FXWWdLQ0ZyWlhrdWJXRjBZMmdvTDE1Y1hHUXJKQzhwS1NCN1hHNGdJQ0FnSUNCdmRYUndkWFF1Y0hWemFDaG1iM0p0WVhSUWNtOXdaWEowZVNoamRIZ3NJSFpoYkhWbExDQnlaV04xY25ObFZHbHRaWE1zSUhacGMybGliR1ZMWlhsekxGeHVJQ0FnSUNBZ0lDQWdJR3RsZVN3Z2RISjFaU2twTzF4dUlDQWdJSDFjYmlBZ2ZTazdYRzRnSUhKbGRIVnliaUJ2ZFhSd2RYUTdYRzU5WEc1Y2JseHVablZ1WTNScGIyNGdabTl5YldGMFVISnZjR1Z5ZEhrb1kzUjRMQ0IyWVd4MVpTd2djbVZqZFhKelpWUnBiV1Z6TENCMmFYTnBZbXhsUzJWNWN5d2dhMlY1TENCaGNuSmhlU2tnZTF4dUlDQjJZWElnYm1GdFpTd2djM1J5TENCa1pYTmpPMXh1SUNCa1pYTmpJRDBnVDJKcVpXTjBMbWRsZEU5M2JsQnliM0JsY25SNVJHVnpZM0pwY0hSdmNpaDJZV3gxWlN3Z2EyVjVLU0I4ZkNCN0lIWmhiSFZsT2lCMllXeDFaVnRyWlhsZElIMDdYRzRnSUdsbUlDaGtaWE5qTG1kbGRDa2dlMXh1SUNBZ0lHbG1JQ2hrWlhOakxuTmxkQ2tnZTF4dUlDQWdJQ0FnYzNSeUlEMGdZM1I0TG5OMGVXeHBlbVVvSjF0SFpYUjBaWEl2VTJWMGRHVnlYU2NzSUNkemNHVmphV0ZzSnlrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSE4wY2lBOUlHTjBlQzV6ZEhsc2FYcGxLQ2RiUjJWMGRHVnlYU2NzSUNkemNHVmphV0ZzSnlrN1hHNGdJQ0FnZlZ4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUdsbUlDaGtaWE5qTG5ObGRDa2dlMXh1SUNBZ0lDQWdjM1J5SUQwZ1kzUjRMbk4wZVd4cGVtVW9KMXRUWlhSMFpYSmRKeXdnSjNOd1pXTnBZV3duS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNiaUFnYVdZZ0tDRm9ZWE5QZDI1UWNtOXdaWEowZVNoMmFYTnBZbXhsUzJWNWN5d2dhMlY1S1NrZ2UxeHVJQ0FnSUc1aGJXVWdQU0FuV3ljZ0t5QnJaWGtnS3lBblhTYzdYRzRnSUgxY2JpQWdhV1lnS0NGemRISXBJSHRjYmlBZ0lDQnBaaUFvWTNSNExuTmxaVzR1YVc1a1pYaFBaaWhrWlhOakxuWmhiSFZsS1NBOElEQXBJSHRjYmlBZ0lDQWdJR2xtSUNocGMwNTFiR3dvY21WamRYSnpaVlJwYldWektTa2dlMXh1SUNBZ0lDQWdJQ0J6ZEhJZ1BTQm1iM0p0WVhSV1lXeDFaU2hqZEhnc0lHUmxjMk11ZG1Gc2RXVXNJRzUxYkd3cE8xeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ2MzUnlJRDBnWm05eWJXRjBWbUZzZFdVb1kzUjRMQ0JrWlhOakxuWmhiSFZsTENCeVpXTjFjbk5sVkdsdFpYTWdMU0F4S1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUdsbUlDaHpkSEl1YVc1a1pYaFBaaWduWEZ4dUp5a2dQaUF0TVNrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvWVhKeVlYa3BJSHRjYmlBZ0lDQWdJQ0FnSUNCemRISWdQU0J6ZEhJdWMzQnNhWFFvSjF4Y2JpY3BMbTFoY0NobWRXNWpkR2x2Ymloc2FXNWxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z0p5QWdKeUFySUd4cGJtVTdYRzRnSUNBZ0lDQWdJQ0FnZlNrdWFtOXBiaWduWEZ4dUp5a3VjM1ZpYzNSeUtESXBPMXh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUhOMGNpQTlJQ2RjWEc0bklDc2djM1J5TG5Od2JHbDBLQ2RjWEc0bktTNXRZWEFvWm5WdVkzUnBiMjRvYkdsdVpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUNjZ0lDQW5JQ3NnYkdsdVpUdGNiaUFnSUNBZ0lDQWdJQ0I5S1M1cWIybHVLQ2RjWEc0bktUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCemRISWdQU0JqZEhndWMzUjViR2w2WlNnblcwTnBjbU4xYkdGeVhTY3NJQ2R6Y0dWamFXRnNKeWs3WEc0Z0lDQWdmVnh1SUNCOVhHNGdJR2xtSUNocGMxVnVaR1ZtYVc1bFpDaHVZVzFsS1NrZ2UxeHVJQ0FnSUdsbUlDaGhjbkpoZVNBbUppQnJaWGt1YldGMFkyZ29MMTVjWEdRckpDOHBLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjM1J5TzF4dUlDQWdJSDFjYmlBZ0lDQnVZVzFsSUQwZ1NsTlBUaTV6ZEhKcGJtZHBabmtvSnljZ0t5QnJaWGtwTzF4dUlDQWdJR2xtSUNodVlXMWxMbTFoZEdOb0tDOWVYQ0lvVzJFdGVrRXRXbDlkVzJFdGVrRXRXbDh3TFRsZEtpbGNJaVF2S1NrZ2UxeHVJQ0FnSUNBZ2JtRnRaU0E5SUc1aGJXVXVjM1ZpYzNSeUtERXNJRzVoYldVdWJHVnVaM1JvSUMwZ01pazdYRzRnSUNBZ0lDQnVZVzFsSUQwZ1kzUjRMbk4wZVd4cGVtVW9ibUZ0WlN3Z0oyNWhiV1VuS1R0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdibUZ0WlNBOUlHNWhiV1V1Y21Wd2JHRmpaU2d2Snk5bkxDQmNJbHhjWEZ3blhDSXBYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzV5WlhCc1lXTmxLQzljWEZ4Y1hDSXZaeXdnSjF3aUp5bGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMbkpsY0d4aFkyVW9MeWhlWENKOFhDSWtLUzluTENCY0lpZGNJaWs3WEc0Z0lDQWdJQ0J1WVcxbElEMGdZM1I0TG5OMGVXeHBlbVVvYm1GdFpTd2dKM04wY21sdVp5Y3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnVZVzFsSUNzZ0p6b2dKeUFySUhOMGNqdGNibjFjYmx4dVhHNW1kVzVqZEdsdmJpQnlaV1IxWTJWVWIxTnBibWRzWlZOMGNtbHVaeWh2ZFhSd2RYUXNJR0poYzJVc0lHSnlZV05sY3lrZ2UxeHVJQ0IyWVhJZ2JuVnRUR2x1WlhORmMzUWdQU0F3TzF4dUlDQjJZWElnYkdWdVozUm9JRDBnYjNWMGNIVjBMbkpsWkhWalpTaG1kVzVqZEdsdmJpaHdjbVYyTENCamRYSXBJSHRjYmlBZ0lDQnVkVzFNYVc1bGMwVnpkQ3NyTzF4dUlDQWdJR2xtSUNoamRYSXVhVzVrWlhoUFppZ25YRnh1SnlrZ1BqMGdNQ2tnYm5WdFRHbHVaWE5GYzNRckt6dGNiaUFnSUNCeVpYUjFjbTRnY0hKbGRpQXJJR04xY2k1eVpYQnNZV05sS0M5Y1hIVXdNREZpWEZ4YlhGeGtYRnhrUDIwdlp5d2dKeWNwTG14bGJtZDBhQ0FySURFN1hHNGdJSDBzSURBcE8xeHVYRzRnSUdsbUlDaHNaVzVuZEdnZ1BpQTJNQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQmljbUZqWlhOYk1GMGdLMXh1SUNBZ0lDQWdJQ0FnSUNBb1ltRnpaU0E5UFQwZ0p5Y2dQeUFuSnlBNklHSmhjMlVnS3lBblhGeHVJQ2NwSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdKeUFuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdiM1YwY0hWMExtcHZhVzRvSnl4Y1hHNGdJQ2NwSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdKeUFuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdZbkpoWTJWeld6RmRPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJR0p5WVdObGMxc3dYU0FySUdKaGMyVWdLeUFuSUNjZ0t5QnZkWFJ3ZFhRdWFtOXBiaWduTENBbktTQXJJQ2NnSnlBcklHSnlZV05sYzFzeFhUdGNibjFjYmx4dVhHNHZMeUJPVDFSRk9pQlVhR1Z6WlNCMGVYQmxJR05vWldOcmFXNW5JR1oxYm1OMGFXOXVjeUJwYm5SbGJuUnBiMjVoYkd4NUlHUnZiaWQwSUhWelpTQmdhVzV6ZEdGdVkyVnZabUJjYmk4dklHSmxZMkYxYzJVZ2FYUWdhWE1nWm5KaFoybHNaU0JoYm1RZ1kyRnVJR0psSUdWaGMybHNlU0JtWVd0bFpDQjNhWFJvSUdCUFltcGxZM1F1WTNKbFlYUmxLQ2xnTGx4dVpuVnVZM1JwYjI0Z2FYTkJjbkpoZVNoaGNpa2dlMXh1SUNCeVpYUjFjbTRnUVhKeVlYa3VhWE5CY25KaGVTaGhjaWs3WEc1OVhHNWxlSEJ2Y25SekxtbHpRWEp5WVhrZ1BTQnBjMEZ5Y21GNU8xeHVYRzVtZFc1amRHbHZiaUJwYzBKdmIyeGxZVzRvWVhKbktTQjdYRzRnSUhKbGRIVnliaUIwZVhCbGIyWWdZWEpuSUQwOVBTQW5ZbTl2YkdWaGJpYzdYRzU5WEc1bGVIQnZjblJ6TG1selFtOXZiR1ZoYmlBOUlHbHpRbTl2YkdWaGJqdGNibHh1Wm5WdVkzUnBiMjRnYVhOT2RXeHNLR0Z5WnlrZ2UxeHVJQ0J5WlhSMWNtNGdZWEpuSUQwOVBTQnVkV3hzTzF4dWZWeHVaWGh3YjNKMGN5NXBjMDUxYkd3Z1BTQnBjMDUxYkd3N1hHNWNibVoxYm1OMGFXOXVJR2x6VG5Wc2JFOXlWVzVrWldacGJtVmtLR0Z5WnlrZ2UxeHVJQ0J5WlhSMWNtNGdZWEpuSUQwOUlHNTFiR3c3WEc1OVhHNWxlSEJ2Y25SekxtbHpUblZzYkU5eVZXNWtaV1pwYm1Wa0lEMGdhWE5PZFd4c1QzSlZibVJsWm1sdVpXUTdYRzVjYm1aMWJtTjBhVzl1SUdselRuVnRZbVZ5S0dGeVp5a2dlMXh1SUNCeVpYUjFjbTRnZEhsd1pXOW1JR0Z5WnlBOVBUMGdKMjUxYldKbGNpYzdYRzU5WEc1bGVIQnZjblJ6TG1selRuVnRZbVZ5SUQwZ2FYTk9kVzFpWlhJN1hHNWNibVoxYm1OMGFXOXVJR2x6VTNSeWFXNW5LR0Z5WnlrZ2UxeHVJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlHRnlaeUE5UFQwZ0ozTjBjbWx1WnljN1hHNTlYRzVsZUhCdmNuUnpMbWx6VTNSeWFXNW5JRDBnYVhOVGRISnBibWM3WEc1Y2JtWjFibU4wYVc5dUlHbHpVM2x0WW05c0tHRnlaeWtnZTF4dUlDQnlaWFIxY200Z2RIbHdaVzltSUdGeVp5QTlQVDBnSjNONWJXSnZiQ2M3WEc1OVhHNWxlSEJ2Y25SekxtbHpVM2x0WW05c0lEMGdhWE5UZVcxaWIydzdYRzVjYm1aMWJtTjBhVzl1SUdselZXNWtaV1pwYm1Wa0tHRnlaeWtnZTF4dUlDQnlaWFIxY200Z1lYSm5JRDA5UFNCMmIybGtJREE3WEc1OVhHNWxlSEJ2Y25SekxtbHpWVzVrWldacGJtVmtJRDBnYVhOVmJtUmxabWx1WldRN1hHNWNibVoxYm1OMGFXOXVJR2x6VW1WblJYaHdLSEpsS1NCN1hHNGdJSEpsZEhWeWJpQnBjMDlpYW1WamRDaHlaU2tnSmlZZ2IySnFaV04wVkc5VGRISnBibWNvY21VcElEMDlQU0FuVzI5aWFtVmpkQ0JTWldkRmVIQmRKenRjYm4xY2JtVjRjRzl5ZEhNdWFYTlNaV2RGZUhBZ1BTQnBjMUpsWjBWNGNEdGNibHh1Wm5WdVkzUnBiMjRnYVhOUFltcGxZM1FvWVhKbktTQjdYRzRnSUhKbGRIVnliaUIwZVhCbGIyWWdZWEpuSUQwOVBTQW5iMkpxWldOMEp5QW1KaUJoY21jZ0lUMDlJRzUxYkd3N1hHNTlYRzVsZUhCdmNuUnpMbWx6VDJKcVpXTjBJRDBnYVhOUFltcGxZM1E3WEc1Y2JtWjFibU4wYVc5dUlHbHpSR0YwWlNoa0tTQjdYRzRnSUhKbGRIVnliaUJwYzA5aWFtVmpkQ2hrS1NBbUppQnZZbXBsWTNSVWIxTjBjbWx1Wnloa0tTQTlQVDBnSjF0dlltcGxZM1FnUkdGMFpWMG5PMXh1ZlZ4dVpYaHdiM0owY3k1cGMwUmhkR1VnUFNCcGMwUmhkR1U3WEc1Y2JtWjFibU4wYVc5dUlHbHpSWEp5YjNJb1pTa2dlMXh1SUNCeVpYUjFjbTRnYVhOUFltcGxZM1FvWlNrZ0ppWmNiaUFnSUNBZ0lDaHZZbXBsWTNSVWIxTjBjbWx1WnlobEtTQTlQVDBnSjF0dlltcGxZM1FnUlhKeWIzSmRKeUI4ZkNCbElHbHVjM1JoYm1ObGIyWWdSWEp5YjNJcE8xeHVmVnh1Wlhod2IzSjBjeTVwYzBWeWNtOXlJRDBnYVhORmNuSnZjanRjYmx4dVpuVnVZM1JwYjI0Z2FYTkdkVzVqZEdsdmJpaGhjbWNwSUh0Y2JpQWdjbVYwZFhKdUlIUjVjR1Z2WmlCaGNtY2dQVDA5SUNkbWRXNWpkR2x2YmljN1hHNTlYRzVsZUhCdmNuUnpMbWx6Um5WdVkzUnBiMjRnUFNCcGMwWjFibU4wYVc5dU8xeHVYRzVtZFc1amRHbHZiaUJwYzFCeWFXMXBkR2wyWlNoaGNtY3BJSHRjYmlBZ2NtVjBkWEp1SUdGeVp5QTlQVDBnYm5Wc2JDQjhmRnh1SUNBZ0lDQWdJQ0FnZEhsd1pXOW1JR0Z5WnlBOVBUMGdKMkp2YjJ4bFlXNG5JSHg4WEc0Z0lDQWdJQ0FnSUNCMGVYQmxiMllnWVhKbklEMDlQU0FuYm5WdFltVnlKeUI4ZkZ4dUlDQWdJQ0FnSUNBZ2RIbHdaVzltSUdGeVp5QTlQVDBnSjNOMGNtbHVaeWNnZkh4Y2JpQWdJQ0FnSUNBZ0lIUjVjR1Z2WmlCaGNtY2dQVDA5SUNkemVXMWliMnduSUh4OElDQXZMeUJGVXpZZ2MzbHRZbTlzWEc0Z0lDQWdJQ0FnSUNCMGVYQmxiMllnWVhKbklEMDlQU0FuZFc1a1pXWnBibVZrSnp0Y2JuMWNibVY0Y0c5eWRITXVhWE5RY21sdGFYUnBkbVVnUFNCcGMxQnlhVzFwZEdsMlpUdGNibHh1Wlhod2IzSjBjeTVwYzBKMVptWmxjaUE5SUhKbGNYVnBjbVVvSnk0dmMzVndjRzl5ZEM5cGMwSjFabVpsY2ljcE8xeHVYRzVtZFc1amRHbHZiaUJ2WW1wbFkzUlViMU4wY21sdVp5aHZLU0I3WEc0Z0lISmxkSFZ5YmlCUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG5SdlUzUnlhVzVuTG1OaGJHd29ieWs3WEc1OVhHNWNibHh1Wm5WdVkzUnBiMjRnY0dGa0tHNHBJSHRjYmlBZ2NtVjBkWEp1SUc0Z1BDQXhNQ0EvSUNjd0p5QXJJRzR1ZEc5VGRISnBibWNvTVRBcElEb2diaTUwYjFOMGNtbHVaeWd4TUNrN1hHNTlYRzVjYmx4dWRtRnlJRzF2Ym5Sb2N5QTlJRnNuU21GdUp5d2dKMFpsWWljc0lDZE5ZWEluTENBblFYQnlKeXdnSjAxaGVTY3NJQ2RLZFc0bkxDQW5TblZzSnl3Z0owRjFaeWNzSUNkVFpYQW5MRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQW5UMk4wSnl3Z0owNXZkaWNzSUNkRVpXTW5YVHRjYmx4dUx5OGdNallnUm1WaUlERTJPakU1T2pNMFhHNW1kVzVqZEdsdmJpQjBhVzFsYzNSaGJYQW9LU0I3WEc0Z0lIWmhjaUJrSUQwZ2JtVjNJRVJoZEdVb0tUdGNiaUFnZG1GeUlIUnBiV1VnUFNCYmNHRmtLR1F1WjJWMFNHOTFjbk1vS1Nrc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhCaFpDaGtMbWRsZEUxcGJuVjBaWE1vS1Nrc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhCaFpDaGtMbWRsZEZObFkyOXVaSE1vS1NsZExtcHZhVzRvSnpvbktUdGNiaUFnY21WMGRYSnVJRnRrTG1kbGRFUmhkR1VvS1N3Z2JXOXVkR2h6VzJRdVoyVjBUVzl1ZEdnb0tWMHNJSFJwYldWZExtcHZhVzRvSnlBbktUdGNibjFjYmx4dVhHNHZMeUJzYjJjZ2FYTWdhblZ6ZENCaElIUm9hVzRnZDNKaGNIQmxjaUIwYnlCamIyNXpiMnhsTG14dlp5QjBhR0YwSUhCeVpYQmxibVJ6SUdFZ2RHbHRaWE4wWVcxd1hHNWxlSEJ2Y25SekxteHZaeUE5SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0JqYjI1emIyeGxMbXh2WnlnbkpYTWdMU0FsY3ljc0lIUnBiV1Z6ZEdGdGNDZ3BMQ0JsZUhCdmNuUnpMbVp2Y20xaGRDNWhjSEJzZVNobGVIQnZjblJ6TENCaGNtZDFiV1Z1ZEhNcEtUdGNibjA3WEc1Y2JseHVMeW9xWEc0Z0tpQkpibWhsY21sMElIUm9aU0J3Y205MGIzUjVjR1VnYldWMGFHOWtjeUJtY205dElHOXVaU0JqYjI1emRISjFZM1J2Y2lCcGJuUnZJR0Z1YjNSb1pYSXVYRzRnS2x4dUlDb2dWR2hsSUVaMWJtTjBhVzl1TG5CeWIzUnZkSGx3WlM1cGJtaGxjbWwwY3lCbWNtOXRJR3hoYm1jdWFuTWdjbVYzY21sMGRHVnVJR0Z6SUdFZ2MzUmhibVJoYkc5dVpWeHVJQ29nWm5WdVkzUnBiMjRnS0c1dmRDQnZiaUJHZFc1amRHbHZiaTV3Y205MGIzUjVjR1VwTGlCT1QxUkZPaUJKWmlCMGFHbHpJR1pwYkdVZ2FYTWdkRzhnWW1VZ2JHOWhaR1ZrWEc0Z0tpQmtkWEpwYm1jZ1ltOXZkSE4wY21Gd2NHbHVaeUIwYUdseklHWjFibU4wYVc5dUlHNWxaV1J6SUhSdklHSmxJSEpsZDNKcGRIUmxiaUIxYzJsdVp5QnpiMjFsSUc1aGRHbDJaVnh1SUNvZ1puVnVZM1JwYjI1eklHRnpJSEJ5YjNSdmRIbHdaU0J6WlhSMWNDQjFjMmx1WnlCdWIzSnRZV3dnU21GMllWTmpjbWx3ZENCa2IyVnpJRzV2ZENCM2IzSnJJR0Z6WEc0Z0tpQmxlSEJsWTNSbFpDQmtkWEpwYm1jZ1ltOXZkSE4wY21Gd2NHbHVaeUFvYzJWbElHMXBjbkp2Y2k1cWN5QnBiaUJ5TVRFME9UQXpLUzVjYmlBcVhHNGdLaUJBY0dGeVlXMGdlMloxYm1OMGFXOXVmU0JqZEc5eUlFTnZibk4wY25WamRHOXlJR1oxYm1OMGFXOXVJSGRvYVdOb0lHNWxaV1J6SUhSdklHbHVhR1Z5YVhRZ2RHaGxYRzRnS2lBZ0lDQWdjSEp2ZEc5MGVYQmxMbHh1SUNvZ1FIQmhjbUZ0SUh0bWRXNWpkR2x2Ym4wZ2MzVndaWEpEZEc5eUlFTnZibk4wY25WamRHOXlJR1oxYm1OMGFXOXVJSFJ2SUdsdWFHVnlhWFFnY0hKdmRHOTBlWEJsSUdaeWIyMHVYRzRnS2k5Y2JtVjRjRzl5ZEhNdWFXNW9aWEpwZEhNZ1BTQnlaWEYxYVhKbEtDZHBibWhsY21sMGN5Y3BPMXh1WEc1bGVIQnZjblJ6TGw5bGVIUmxibVFnUFNCbWRXNWpkR2x2YmlodmNtbG5hVzRzSUdGa1pDa2dlMXh1SUNBdkx5QkViMjRuZENCa2J5QmhibmwwYUdsdVp5QnBaaUJoWkdRZ2FYTnVKM1FnWVc0Z2IySnFaV04wWEc0Z0lHbG1JQ2doWVdSa0lIeDhJQ0ZwYzA5aWFtVmpkQ2hoWkdRcEtTQnlaWFIxY200Z2IzSnBaMmx1TzF4dVhHNGdJSFpoY2lCclpYbHpJRDBnVDJKcVpXTjBMbXRsZVhNb1lXUmtLVHRjYmlBZ2RtRnlJR2tnUFNCclpYbHpMbXhsYm1kMGFEdGNiaUFnZDJocGJHVWdLR2t0TFNrZ2UxeHVJQ0FnSUc5eWFXZHBibHRyWlhselcybGRYU0E5SUdGa1pGdHJaWGx6VzJsZFhUdGNiaUFnZlZ4dUlDQnlaWFIxY200Z2IzSnBaMmx1TzF4dWZUdGNibHh1Wm5WdVkzUnBiMjRnYUdGelQzZHVVSEp2Y0dWeWRIa29iMkpxTENCd2NtOXdLU0I3WEc0Z0lISmxkSFZ5YmlCUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG1oaGMwOTNibEJ5YjNCbGNuUjVMbU5oYkd3b2IySnFMQ0J3Y205d0tUdGNibjFjYmlKZGZRPT0iLCIoZnVuY3Rpb24oc2VsZikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgaWYgKHNlbGYuZmV0Y2gpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBzdXBwb3J0ID0ge1xuICAgIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgICBibG9iOiAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJiAnQmxvYicgaW4gc2VsZiAmJiAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICAgIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbiAgfVxuXG4gIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gICAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gICAgXVxuXG4gICAgdmFyIGlzRGF0YVZpZXcgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxuICAgIH1cblxuICAgIHZhciBpc0FycmF5QnVmZmVyVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldyB8fCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgICB9XG4gICAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXFxeX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gICAgfVxuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXJhdG9yXG4gIH1cblxuICBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLm1hcCA9IHt9XG5cbiAgICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICAgIH0sIHRoaXMpXG5cbiAgICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXVxuICAgIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSsnLCcrdmFsdWUgOiB2YWx1ZVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChuYW1lKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7IGl0ZW1zLnB1c2godmFsdWUpIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG4gIH1cblxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgICB9XG4gICAgYm9keS5ib2R5VXNlZCA9IHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICAgIH1cbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGFyc1tpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodmlld1tpXSlcbiAgICB9XG4gICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG4gIH1cblxuICBmdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgICByZXR1cm4gYnVmLnNsaWNlKDApXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKVxuICAgICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gQm9keSgpIHtcbiAgICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICAgIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSAnJ1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgc3VwcG9ydC5ibG9iICYmIGlzRGF0YVZpZXcoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnN1cHBvcnRlZCBCb2R5SW5pdCB0eXBlJylcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICAgIHRoaXMuZm9ybURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG4gIHZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICAgIHZhciB1cGNhc2VkID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgICByZXR1cm4gKG1ldGhvZHMuaW5kZXhPZih1cGNhc2VkKSA+IC0xKSA/IHVwY2FzZWQgOiBtZXRob2RcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICAgIH1cbiAgICAgIHRoaXMudXJsID0gaW5wdXQudXJsXG4gICAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpXG4gICAgICB9XG4gICAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZVxuICAgICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICAgIH1cblxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ29taXQnXG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICAgIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gICAgfVxuICAgIHRoaXMuX2luaXRCb2R5KGJvZHkpXG4gIH1cblxuICBSZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7IGJvZHk6IHRoaXMuX2JvZHlJbml0IH0pXG4gIH1cblxuICBmdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgICBib2R5LnRyaW0oKS5zcGxpdCgnJicpLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGZvcm1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gICAgcmF3SGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGhlYWRlcnNcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuICBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gICAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gICAgdGhpcy5zdGF0dXMgPSAnc3RhdHVzJyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXMgOiAyMDBcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cbiAgUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgICB1cmw6IHRoaXMudXJsXG4gICAgfSlcbiAgfVxuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICAgIHJldHVybiByZXNwb25zZVxuICB9XG5cbiAgdmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cbiAgUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICAgIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbiAgfVxuXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2VcblxuICBzZWxmLmZldGNoID0gZnVuY3Rpb24oaW5wdXQsIGluaXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICAgIH1cblxuICAgICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgICAgfVxuXG4gICAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICAgIH0pXG5cbiAgICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gICAgfSlcbiAgfVxuICBzZWxmLmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMpO1xuIiwibW9kdWxlLmV4cG9ydHMuUHJvZHVjdGlvbiA9IHJlcXVpcmUoJy4vcHJvZHVjdGlvbicpO1xubW9kdWxlLmV4cG9ydHMuU2FuZGJveCA9IHJlcXVpcmUoJy4vc2FuZGJveCcpO1xuIiwiLyoqXG4gKiBAY2xhc3MgUHJvZHVjdGlvbiBBUElcbiAqL1xuY2xhc3MgUHJvZHVjdGlvbkFQSSB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIFByb2R1Y3Rpb25BUElcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbmRwb2ludCAtIFRoZSBob3N0IGVuZHBvaW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmZXRjaEZuIC0gVGhlIGZ1bmN0aW9uIHRvIHVzZSBmb3IgZmV0Y2hpbmcgdGhlIGRhdGEgLSBEZWZhdWx0cyB0byB3aW5kb3cuZmV0Y2hcbiAgICogQHJldHVybiB7UHJvZHVjdGlvbkFQSX1cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVuZHBvaW50LCBmZXRjaEZuID0gKC4uLmFyZ3MpID0+IHdpbmRvdy5mZXRjaCguLi5hcmdzKSkge1xuICAgIHRoaXMuX2VuZHBvaW50ID0gZW5kcG9pbnQ7XG4gICAgdGhpcy5fZmV0Y2hGbiA9IGZldGNoRm47XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogUHJvcGFnYXRlcyBpbnZva2UgY2FsbCB0byBfZmV0Y2hGblxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVzb3VyY2UgLSBUaGUgcmVzb3VyY2UgdG8gZmV0Y2ggZnJvbVxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIFRoZSBwYXlsb2FkIHRvIHBhc3NcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIGludm9rZShyZXNvdXJjZSwgcGF5bG9hZCkge1xuICAgIGxldCBzdGF0dXMgPSAwO1xuICAgIHJldHVybiB0aGlzLl9mZXRjaEZuKGAke3RoaXMuX2VuZHBvaW50fS8ke3Jlc291cmNlfWAsIHBheWxvYWQpLnRoZW4oKHJlcykgPT4ge1xuICAgICAgc3RhdHVzID0gcmVzLnN0YXR1cztcbiAgICAgIGlmIChzdGF0dXMgIT09IDIwNCkge1xuICAgICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgIH0pLnRoZW4oYm9keSA9PiAoeyBib2R5LCBzdGF0dXMgfSkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvZHVjdGlvbkFQSTtcbiIsImNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuY29uc3Qgc3RyaXBCZWFyZXIgPSBVdGlscy5zdHJpcEJlYXJlcjtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYW4gSFRUUCByZXNwb25zZSBvYmplY3RcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7T2JqZWN0fVxuICpcbiAqL1xuY29uc3QgcmVzcG9uc2UgPSAoc3RhdHVzID0gMjAwLCBib2R5ID0ge30pID0+IChQcm9taXNlLnJlc29sdmUoe1xuICBzdGF0dXMsXG4gIGJvZHksXG59KSk7XG5cbi8qKlxuICogQGNsYXNzIFNhbmRib3ggQVBJXG4gKi9cbmNsYXNzIFNhbmRib3hBUEkge1xuXG4gIC8qKlxuICAgKiBNYXBzIEFQSSByZXNvdXJjZXMgdG8gcmVzcG9uc2Ugb2JqZWN0c1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKi9cbiAgc3RhdGljIGdldCByZXNvdXJjZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogTWFwcyBgL3VzZXJzYCByZXNvdXJjZVxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKlxuICAgICAgICovXG4gICAgICB1c2Vyczoge1xuICAgICAgICBHRVQ6IChkYXRhYmFzZSwgaWQsIGJvZHksIGhlYWRlcnMpID0+IHtcbiAgICAgICAgICBjb25zdCB0b2tlbiA9IHN0cmlwQmVhcmVyKGhlYWRlcnMuQXV0aG9yaXphdGlvbik7XG4gICAgICAgICAgaWYgKCFkYXRhYmFzZS5oYXNVc2VyV2l0aFRva2VuKHRva2VuKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDQwNCwgeyBlcnJvcjogJ25vdF9mb3VuZCcgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXNwb25zZSgyMDAsIGRhdGFiYXNlLmdldFVzZXJXaXRoVG9rZW4odG9rZW4pKTtcbiAgICAgICAgfSxcbiAgICAgICAgUE9TVDogKGRhdGFiYXNlLCBpZCwgYm9keSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkLCBmaXJzdF9uYW1lLCBsYXN0X25hbWUgfSA9IGJvZHk7XG4gICAgICAgICAgaWYgKGRhdGFiYXNlLmhhc1VzZXJXaXRoRGF0YShlbWFpbCwgcGFzc3dvcmQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoNDAwLCB7IGVycm9yOiAndmFsaWRhdGlvbl9mYWlsZWQnIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBuZXdVc2VyID0gZGF0YWJhc2UuYWRkVXNlcihlbWFpbCwgcGFzc3dvcmQsIGZpcnN0X25hbWUsIGxhc3RfbmFtZSk7XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDIwMSwgbmV3VXNlcik7XG4gICAgICAgIH0sXG4gICAgICAgIFBBVENIOiAoZGF0YWJhc2UsIGlkLCBib2R5LCBoZWFkZXJzKSA9PiB7XG4gICAgICAgICAgY29uc3QgdG9rZW4gPSBzdHJpcEJlYXJlcihoZWFkZXJzLkF1dGhvcml6YXRpb24pO1xuICAgICAgICAgIGNvbnN0IHsgZmlyc3RfbmFtZSwgbGFzdF9uYW1lIH0gPSBib2R5O1xuICAgICAgICAgIGlmIChkYXRhYmFzZS5nZXRVc2VyV2l0aFRva2VuKHRva2VuKSAhPT0gZGF0YWJhc2UuZ2V0VXNlcldpdGhJZChpZCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZSg0MDAsIHsgZXJyb3I6ICdpbnZhbGlkX2dyYW50JyB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcGF0Y2hlZFVzZXIgPSBkYXRhYmFzZS51cGRhdGVVc2VyKGlkLCBmaXJzdF9uYW1lLCBsYXN0X25hbWUpO1xuICAgICAgICAgIHJldHVybiByZXNwb25zZSgyMDAsIHBhdGNoZWRVc2VyKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIE1hcHMgYC90b2tlbmAgcmVzb3VyY2VcbiAgICAgICAqXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM2NzQ5XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICpcbiAgICAgICAqL1xuICAgICAgdG9rZW46IHtcbiAgICAgICAgUE9TVDogKGRhdGFiYXNlLCBpZCwgYm9keSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgZ3JhbnRfdHlwZSwgdXNlcm5hbWUsIHBhc3N3b3JkLCByZWZyZXNoX3Rva2VuIH0gPSBib2R5O1xuICAgICAgICAgIGlmIChncmFudF90eXBlID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICAgICBpZiAoIWRhdGFiYXNlLmhhc1VzZXJXaXRoRGF0YSh1c2VybmFtZSwgcGFzc3dvcmQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXNwb25zZSg0MDQsIHsgZXJyb3I6ICdub3RfZm91bmQnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdXNlciA9IGRhdGFiYXNlLmdldFVzZXJXaXRoRGF0YSh1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDIwMCwgZGF0YWJhc2UuZ2V0VG9rZW5Gb3IodXNlci5pZCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICBpZiAoZ3JhbnRfdHlwZSA9PT0gJ3JlZnJlc2hfdG9rZW4nKSB7XG4gICAgICAgICAgICBpZiAoIWRhdGFiYXNlLmhhc1Rva2VuV2l0aFJlZnJlc2gocmVmcmVzaF90b2tlbikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDQwMCwgeyBlcnJvcjogJ2ludmFsaWRfdG9rZW4nIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVmcmVzaGVkVG9rZW4gPSBkYXRhYmFzZS51cGRhdGVUb2tlbihyZWZyZXNoX3Rva2VuKTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZSgyMDAsIHJlZnJlc2hlZFRva2VuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKDQwNCwgeyBlcnJvcjogJ3VuZXhwZWN0ZWRfZXJyb3InIH0pO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIC8qKlxuICAgICAgICogTWFwcyBgL3Bhc3N3b3Jkc2AgcmVzb3VyY2VcbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICpcbiAgICAgICAqL1xuICAgICAgcGFzc3dvcmRzOiB7XG4gICAgICAgIFBPU1Q6IChkYXRhYmFzZSwgaWQsIGJvZHkpID0+IHtcbiAgICAgICAgICBjb25zdCB7IGVtYWlsIH0gPSBib2R5O1xuICAgICAgICAgIGlmICghZGF0YWJhc2UuaGFzVXNlcldpdGhFbWFpbChlbWFpbCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZSg0MDQsIHsgZXJyb3I6ICdub3RfZm91bmQnIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgUFVUOiAoZGF0YWJhc2UsIGlkKSA9PiB7XG4gICAgICAgICAgaWYgKCFkYXRhYmFzZS5oYXNQYXNzd29yZFJlc2V0VG9rZW4oaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UoNDA0LCB7IGVycm9yOiAnbm90X2ZvdW5kJyB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlKCk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgU2FuZGJveEFQSVxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTYW5kYm94RGF0YWJhc2V9IGRhdGFiYXNlIC0gVGhlIGRhdGFiYXNlIHRvIHVzZSBmb3Igc3RvcmluZyBzZXNzc2lvbiBjaGFuZ2VzXG4gICAqIEByZXR1cm4ge1NhbmRib3hBUEl9XG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhYmFzZSkge1xuICAgIHRoaXMuX2RhdGFiYXNlID0gZGF0YWJhc2U7XG4gIH1cblxuICAvKipcbiAgICogU3R1YnMgQVBJIGNhbGxzXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZXNvdXJjZSAtIFRoZSByZXNvdXJjZSB0byBmZXRjaCBmcm9tXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkIC0gVGhlIHBheWxvZCB0byBwcm9wYWdhdGVcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGludm9rZShyZXNvdXJjZSwgcGF5bG9hZCkge1xuICAgIGNvbnN0IFtyb3V0ZSwgaWRdID0gcmVzb3VyY2Uuc3BsaXQoJy8nKTtcbiAgICBjb25zdCB7IG1ldGhvZCwgYm9keSwgaGVhZGVycyB9ID0gcGF5bG9hZDtcbiAgICByZXR1cm4gU2FuZGJveEFQSS5yZXNvdXJjZXNbcm91dGVdW21ldGhvZF0odGhpcy5fZGF0YWJhc2UsIGlkLCBib2R5LCBoZWFkZXJzKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FuZGJveEFQSTtcbiIsImNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuY29uc3QgZ2VuZXJhdGVSYW5kb21TdHJpbmcgPSBVdGlscy5nZW5lcmF0ZVJhbmRvbVN0cmluZztcbmNvbnN0IGdlbmVyYXRlUmFuZG9tVVVJRCA9IFV0aWxzLmdlbmVyYXRlUmFuZG9tVVVJRDtcblxuLyoqXG4gKiBAY2xhc3MgU2FuZGJveERhdGFiYXNlXG4gKi9cbmNsYXNzIFNhbmRib3hEYXRhYmFzZSB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIFNhbmRib3hBUElcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7SlNPTn0gdXNlcnMgLSBUaGUgaW5pdGlhbCB1c2VyIGZpeHR1cmVzXG4gICAqIEBwYXJhbSB7SlNPTn0gdG9rZW5zIC0gVGhlIGluaXRpYWwgdG9rZW4gZml4dHVyZXNcbiAgICogQHBhcmFtIHtKU09OfSBwYXNzd29yZHMgLSBUaGUgaW5pdGlhbCBwYXNzd29yZHMgZml4dHVyZXNcbiAgICogQHJldHVybiBTYW5kYm94RGF0YWJhc2VcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKHVzZXJzLCB0b2tlbnMsIHBhc3N3b3Jkcykge1xuICAgIHRoaXMuX3VzZXJzID0gWy4uLnVzZXJzXTtcbiAgICB0aGlzLl90b2tlbnMgPSBbLi4udG9rZW5zXTtcbiAgICB0aGlzLl9wYXNzd29yZHMgPSBbLi4ucGFzc3dvcmRzXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHVzZXJzXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKlxuICAgKi9cbiAgZ2V0IHVzZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl91c2VycztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRva2Vuc1xuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICpcbiAgICovXG4gIGdldCB0b2tlbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rva2VucztcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0cyBgcHVibGljYCB1c2VyIGRhdGFcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKlxuICAqL1xuICBfZXh0cmFjdFVzZXIoZGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogZGF0YS5pZCxcbiAgICAgIHB1Ymxpc2hlcl9pZDogZGF0YS5wdWJsaXNoZXJfaWQsXG4gICAgICBmaXJzdF9uYW1lOiBkYXRhLmZpcnN0X25hbWUsXG4gICAgICBsYXN0X25hbWU6IGRhdGEubGFzdF9uYW1lLFxuICAgICAgZW1haWw6IGRhdGEuZW1haWwsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0cyBgcHVibGljYCB0b2tlbiBkYXRhXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICpcbiAgKi9cbiAgX2V4dHJhY3RUb2tlbihkYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjY2Vzc190b2tlbjogZGF0YS5hY2Nlc3NfdG9rZW4sXG4gICAgICByZWZyZXNoX3Rva2VuOiBkYXRhLnJlZnJlc2hfdG9rZW4sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIGRhdGFiYXNlIGhhcyBhIHNwZWNpZmljIHRva2VuIGJhc2VkIG9uIHJlZnJlc2hfdG9rZW5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlZnJlc2hUb2tlbiAtIFRoZSByZWZyZXNoIHRva2VuIHRvIGxvb2t1cFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKlxuICAgKi9cbiAgaGFzVG9rZW5XaXRoUmVmcmVzaChyZWZyZXNoVG9rZW4pIHtcbiAgICByZXR1cm4gISF+dGhpcy5fdG9rZW5zLmZpbmRJbmRleCh0b2tlbiA9PiB0b2tlbi5yZWZyZXNoX3Rva2VuID09PSByZWZyZXNoVG9rZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgZGF0YWJhc2UgaGFzIGEgc3BlY2lmaWMgdXNlciBiYXNlZCBvbiBkYXRhXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCB0byBsb29rdXBcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIHBhc3N3b3JkIHRvIGxvb2t1cFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKlxuICAgKi9cbiAgaGFzVXNlcldpdGhEYXRhKGVtYWlsLCBwYXNzd29yZCkge1xuICAgIHJldHVybiAhIX50aGlzLl91c2Vycy5maW5kSW5kZXgodXNlciA9PiB1c2VyLmVtYWlsID09PSBlbWFpbCAmJiB1c2VyLnBhc3N3b3JkID09PSBwYXNzd29yZCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBkYXRhYmFzZSBoYXMgYSBzcGVjaWZpYyB1c2VyIGJhc2VkIG9uIHRva2VuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhY2Nlc3NUb2tlbiAtIFRoZSB0b2tlbiB0byBsb29rdXBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICpcbiAgICovXG4gIGhhc1VzZXJXaXRoVG9rZW4oYWNjZXNzVG9rZW4pIHtcbiAgICByZXR1cm4gISF+dGhpcy5fdG9rZW5zLmZpbmRJbmRleCh0b2tlbiA9PiB0b2tlbi5hY2Nlc3NfdG9rZW4gPT09IGFjY2Vzc1Rva2VuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRva2VuIGZvciBhIHVzZXJcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJJZCAtIFRoZSB1c2VyIGlkIHRvIGxvb2t1cFxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqXG4gICAqL1xuICBnZXRUb2tlbkZvcih1c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5fdG9rZW5zLmZpbmQodG9rZW4gPT4gdG9rZW4udXNlcl9pZCA9PT0gdXNlcklkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIGRhdGFiYXNlIGhhcyBhIHNwZWNpZmljIHVzZXIgYmFzZWQgb24gZW1haWxcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsIHRvIGxvb2t1cFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKlxuICAgKi9cbiAgaGFzVXNlcldpdGhFbWFpbChlbWFpbCkge1xuICAgIHJldHVybiAhIX50aGlzLl91c2Vycy5maW5kSW5kZXgodXNlciA9PiB1c2VyLmVtYWlsID09PSBlbWFpbCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBkYXRhYmFzZSBoYXMgYSBzcGVjaWZpYyBwYXNzd29yZCByZXNldCB0b2tlblxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gLSBUaGUgdG9rZW4gdG8gbG9va3VwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqXG4gICAqL1xuICBoYXNQYXNzd29yZFJlc2V0VG9rZW4odG9rZW4pIHtcbiAgICByZXR1cm4gISF+dGhpcy5fcGFzc3dvcmRzLmZpbmRJbmRleChyZWNvcmQgPT4gcmVjb3JkLnRva2VuID09PSB0b2tlbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB1c2VyIGZyb20gZml4dHVyZXMgYmFzZWQgb24gZGF0YVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgLSBUaGUgdGFyZ2V0IHVzZXIgZW1haWxcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIHRhcmdldCB1c2VyIHBhc3N3b3JkXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqXG4gICAqL1xuICBnZXRVc2VyV2l0aERhdGEoZW1haWwsIHBhc3N3b3JkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2V4dHJhY3RVc2VyKHRoaXMuX3VzZXJzLmZpbmQodXNlciA9PiAodXNlci5lbWFpbCA9PT0gZW1haWwgJiYgdXNlci5wYXNzd29yZCA9PT0gcGFzc3dvcmQpKSk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogUmV0dXJucyB1c2VyIGZyb20gZml4dHVyZXMgYmFzZWQgb24gYGlkYFxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgdXNlciBpZCB0byBsb29rdXBcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgZm91bmQgdXNlciBkYXRhXG4gICAqXG4gICAqL1xuICBnZXRVc2VyV2l0aElkKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2V4dHJhY3RVc2VyKHRoaXMuX3VzZXJzLmZpbmQodXNlciA9PiB1c2VyLmlkID09PSBpZCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdXNlciBmcm9tIGZpeHR1cmVzIGJhc2VkIG9uIHRva2VuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhY2Nlc3NUb2tlbiAtIFRoZSB0b2tlbiB0byBsb29rdXBcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgZm91bmQgYGFjY2Vzc190b2tlbmAgYW5kIGByZWZyZXNoX3Rva2VuYFxuICAgKlxuICAgKi9cbiAgZ2V0VXNlcldpdGhUb2tlbihhY2Nlc3NUb2tlbikge1xuICAgIGNvbnN0IHVzZXJJZCA9IHRoaXMuX3Rva2Vucy5maW5kKHRva2VuID0+IHRva2VuLmFjY2Vzc190b2tlbiA9PT0gYWNjZXNzVG9rZW4pLnVzZXJfaWQ7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VXNlcldpdGhJZCh1c2VySWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdXNlciB0byBmaXh0dXJlc1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwgdG8gc2V0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSBwYXNzd29yZCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpcnN0TmFtZSAtIFRoZSBmaXJzdE5hbWUgdG8gc2V0IC0gT3B0aW9uYWxcbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhc3ROYW1lIC0gVGhlIGxhc3ROYW1lIHRvIHNldCAtIE9wdGlvbmFsXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHVzZXIgZGF0YSBtZXJnZWQgaW50byBhbiBvYmplY3RcbiAgICpcbiAgICovXG4gIGFkZFVzZXIoZW1haWwsIHBhc3N3b3JkLCBmaXJzdE5hbWUsIGxhc3ROYW1lKSB7XG4gICAgY29uc3QgdXNlcklkID0gZ2VuZXJhdGVSYW5kb21VVUlEKCk7XG4gICAgY29uc3QgcHVibGlzaGVySWQgPSBnZW5lcmF0ZVJhbmRvbVVVSUQoKTtcbiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gICAgY29uc3QgcmVmcmVzaFRva2VuID0gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKTtcbiAgICBjb25zdCBuZXdUb2tlbiA9IHtcbiAgICAgIHVzZXJfaWQ6IHVzZXJJZCxcbiAgICAgIGFjY2Vzc190b2tlbjogYWNjZXNzVG9rZW4sXG4gICAgICByZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4sXG4gICAgfTtcbiAgICBjb25zdCBuZXdVc2VyID0ge1xuICAgICAgaWQ6IHVzZXJJZCxcbiAgICAgIHB1Ymxpc2hlcl9pZDogcHVibGlzaGVySWQsXG4gICAgICBlbWFpbCxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgZmlyc3RfbmFtZTogZmlyc3ROYW1lLFxuICAgICAgbGFzdF9uYW1lOiBsYXN0TmFtZSxcbiAgICB9O1xuICAgIC8vIFN0b3JlIG5ldyByZWNvcmRzXG4gICAgdGhpcy5fdG9rZW5zLnB1c2gobmV3VG9rZW4pO1xuICAgIHRoaXMuX3VzZXJzLnB1c2gobmV3VXNlcik7XG4gICAgLy8gUmV0dXJuIHB1YmxpYyB1c2VyIGRhdGFcbiAgICByZXR1cm4gdGhpcy5fZXh0cmFjdFVzZXIobmV3VXNlcik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB1c2VyXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSB1c2VyIGlkIHRvIGxvb2t1cFxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlyc3ROYW1lIC0gVGhlIGZpcnN0TmFtZSB0byB1cGRhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhc3ROYW1lIC0gVGhlIGxhc3ROYW1lIHRvIHVwZGF0ZVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB1c2VyIGRhdGEgbWVyZ2VkIGludG8gYW4gb2JqZWN0XG4gICAqXG4gICAqL1xuICB1cGRhdGVVc2VyKGlkLCBmaXJzdE5hbWUsIGxhc3ROYW1lKSB7XG4gICAgY29uc3QgdXNlciA9IHRoaXMuX3VzZXJzLmZpbmQocmVjb3JkID0+IHJlY29yZC5pZCA9PT0gaWQpO1xuICAgIGlmICh0eXBlb2YgZmlyc3ROYW1lICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdXNlci5maXJzdF9uYW1lID0gZmlyc3ROYW1lO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGxhc3ROYW1lICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdXNlci5sYXN0X25hbWUgPSBsYXN0TmFtZTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHB1YmxpYyB1c2VyIGRhdGFcbiAgICByZXR1cm4gdGhpcy5fZXh0cmFjdFVzZXIodXNlcik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0b2tlblxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVmcmVzaFRva2VuIC0gVGhlIHJlZnJlc2hUb2tlbiB0byB1c2VcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgZm91bmQgYGFjY2Vzc190b2tlbmAgYW5kIGByZWZyZXNoX3Rva2VuYFxuICAgKlxuICAgKi9cbiAgdXBkYXRlVG9rZW4ocmVmcmVzaFRva2VuKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLl90b2tlbnMuZmluZChyZWNvcmQgPT4gcmVjb3JkLnJlZnJlc2hfdG9rZW4gPT09IHJlZnJlc2hUb2tlbik7XG4gICAgdG9rZW4uYWNjZXNzX3Rva2VuID0gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKTtcbiAgICB0b2tlbi5yZWZyZXNoX3Rva2VuID0gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKTtcbiAgICAvLyBSZXR1cm4gcHVibGljIHVzZXIgZGF0YVxuICAgIHJldHVybiB0aGlzLl9leHRyYWN0VG9rZW4odG9rZW4pO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTYW5kYm94RGF0YWJhc2U7XG4iLCJjb25zdCBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcbmNvbnN0IENvbnN1bWVyID0gcmVxdWlyZSgnLi4vc2VydmljZXMvY29uc3VtZXInKTtcbmNvbnN0IHZhbGlkYXRlUGFzc3dvcmQgPSByZXF1aXJlKCcuLi91dGlscycpLnZhbGlkYXRlUGFzc3dvcmQ7XG5cbi8qKlxuICogQGNsYXNzIEF1dGhlbnRpY2F0b3JcbiAqL1xuY2xhc3MgQXV0aGVudGljYXRvciB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIEF1dGhlbnRpY2F0b3JcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7U3RvcmV9IHN0b3JlIC0gVGhlIFN0b3JlIGluc3RhbmNlIHRvIHVzZVxuICAgKiBAcmV0dXJuIHtBdXRoZW50aWNhdG9yfVxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoY29uc3VtZXIpIHtcbiAgICBhc3NlcnQoY29uc3VtZXIgaW5zdGFuY2VvZiBDb25zdW1lciwgJ2Bjb25zdW1lcmAgc2hvdWxkIGJlIGluc3RhbmNlIG9mIENvbnN1bWVyJyk7XG4gICAgdGhpcy5fY29uc3VtZXIgPSBjb25zdW1lcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc2tzIGZvciBhIHBhc3N3b3JkIHJlc2V0XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCB0byByZXNldCB0aGUgcGFzc3dvcmQgZm9yXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICByZXF1ZXN0UGFzc3dvcmRSZXNldChlbWFpbCkge1xuICAgIGFzc2VydChlbWFpbCwgJ01pc3NpbmcgYGVtYWlsYCcpO1xuICAgIHJldHVybiB0aGlzLl9jb25zdW1lci5yZXF1ZXN0UGFzc3dvcmRSZXNldChlbWFpbCkudGhlbigoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBtZXNzYWdlOiAnQSByZXNldCBsaW5rIGhhcyBiZWVuIHNlbnQgdG8geW91ciBlbWFpbCcgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBuZXcgcGFzc3dvcmRcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIC0gVGhlIHJlc2V0IHRva2VuIHByb3ZpZGVkIHZpYSBlbWFpbFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgbmV3IHBhc3N3b3JkXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICByZXNldFBhc3N3b3JkKHRva2VuLCBwYXNzd29yZCkge1xuICAgIGFzc2VydCh0b2tlbiwgJ01pc3NpbmcgYHRva2VuYCcpO1xuICAgIGFzc2VydChwYXNzd29yZCwgJ01pc3NpbmcgYHBhc3N3b3JkYCcpO1xuICAgIGNvbnN0IHsgaXNWYWxpZCwgbWVzc2FnZSB9ID0gdmFsaWRhdGVQYXNzd29yZChwYXNzd29yZCk7XG4gICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKG1lc3NhZ2UpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NvbnN1bWVyLnJlc2V0UGFzc3dvcmQodG9rZW4sIHBhc3N3b3JkKS50aGVuKCgpID0+IFByb21pc2UucmVzb2x2ZSh7IG1lc3NhZ2U6ICdZb3VyIHBhc3N3b3JkIGhhcyBiZWVuIHJlc2V0JyB9KSk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGhlbnRpY2F0b3I7XG4iLCJjb25zdCBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuLyoqXG4gKiBAY2xhc3MgQ2xpZW50XG4gKi9cbmNsYXNzIENsaWVudCB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIENsaWVudFxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIENsaWVudCBpZFxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VjcmV0IC0gVGhlIENsaWVudCBzZWNyZXRcbiAgICogQHJldHVybiB7Q2xpZW50fVxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQsIHNlY3JldCkge1xuICAgIGFzc2VydChpZCwgJ01pc3NpbmcgYGlkYCcpO1xuICAgIGFzc2VydChzZWNyZXQsICdNaXNzaW5nIGBzZWNyZXRgJyk7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgICB0aGlzLl9zZWNyZXQgPSBzZWNyZXQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBDbGllbnQgaWRcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKlxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLl9pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIENsaWVudCBzZWNyZXRcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKlxuICAgKi9cbiAgZ2V0IHNlY3JldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VjcmV0O1xuICB9XG5cbn1cbm1vZHVsZS5leHBvcnRzID0gQ2xpZW50O1xuIiwiY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5jb25zdCBVc2VyID0gcmVxdWlyZSgnLi4vbW9kZWxzL3VzZXInKTtcbmNvbnN0IHJldHJpZXZlVVJMID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5yZXRyaWV2ZVVSTDtcbmNvbnN0IHJlZGlyZWN0VG9VUkwgPSByZXF1aXJlKCcuLi91dGlscycpLnJlZGlyZWN0VG9VUkw7XG5cbi8qKlxuICogQGNsYXNzIFNlc3Npb25cbiAqL1xuY2xhc3MgU2Vzc2lvbiB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIFVzZXJcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7VXNlcn0gY29uc3VtZXIgLSBUaGUgVXNlciBpbnN0YW5jZSB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IGxvZ2luSG9zdCAtIFRoZSBsb2dpbiBhcHAgaG9zdFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVkaXJlY3RGbiAtIFRoZSBmdW5jdGlvbiB0aGUgZm9yY2VzIFVSTCByZWRpcmVjdGlvbiAtIERlZmF1bHRzIHRvIGB3aW5kb3cubG9jYXRpb24ucmVwbGFjZWBcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhZ2VVUkwgLSBUaGUgY3VycmVudCBwYWdlIFVSTCAtIERlZmF1bHRzIHRvIGB3aW5kb3cuaHJlZmBcbiAgICogQHJldHVybiB7VXNlcn1cbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKHVzZXIsIGxvZ2luSG9zdCwgcmVkaXJlY3RGbiA9IHJlZGlyZWN0VG9VUkwsIHBhZ2VVUkwgPSByZXRyaWV2ZVVSTCkge1xuICAgIGFzc2VydCh1c2VyIGluc3RhbmNlb2YgVXNlciwgJ2B1c2VyYCBzaG91bGQgYmUgaW5zdGFuY2Ugb2YgVXNlcicpO1xuICAgIGFzc2VydChsb2dpbkhvc3QsICdgbG9naW5Ib3N0YCBpcyBub3QgZGVmaW5lZCcpO1xuICAgIHRoaXMuX3VzZXIgPSB1c2VyO1xuICAgIHRoaXMuX2xvZ2luSG9zdCA9IGxvZ2luSG9zdDtcbiAgICB0aGlzLl9yZWRpcmVjdEZuID0gcmVkaXJlY3RGbjtcbiAgICB0aGlzLl9wYWdlVVJMID0gcGFnZVVSTDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIHNlc3Npb24gaXMgdmFsaWQgKFVzZXIgaXMgYXV0aGVudGljYXRlZClcbiAgICpcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICpcbiAgICovXG4gIGdldCBpc1ZhbGlkKCkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5fdXNlci5iZWFyZXIgIT09ICd1bmRlZmluZWQnO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHNlc3Npb24gZm9yIHVzZXIgKGlmIGRlZmluZWQpIGluIFN0b3JlXG4gICAqIE5vdGU6IFRoaXMgc2hvdWxkIGJlIHRoZSBGSVJTVCBjYWxsIGJlZm9yZSBhdHRlbXB0aW5nIGFueSBvdGhlciBzZXNzaW9uIG9wZXJhdGlvbnNcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZXIuc3luY1dpdGhTdG9yZSgpO1xuICB9XG5cblxuICAvKipcbiAgICogSW52YWxpZGF0ZXMgU2Vzc2lvblxuICAgKlxuICAgKiBAcmV0dXJuIHtWb2lkfVxuICAgKlxuICAgKi9cbiAgaW52YWxpZGF0ZSgpIHtcbiAgICAvLyBSZWRpcmVjdCB0byBsb2dpbiBob3N0IHdpdGggYSByZXR1cm4gVVJMXG4gICAgcmV0dXJuIHRoaXMuX3JlZGlyZWN0Rm4oYCR7dGhpcy5fbG9naW5Ib3N0fS9sb2dvdXRgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgU2Vzc2lvblxuICAgKiAtIEV4dHJhY3RzIGN1cnJlbnQgVVJMIGZyb20gd2luZG93LmxvY2F0aW9uXG4gICAqIC0gUmVkaXJlY3RzIHRvIGBsb2dpbkhvc3RgIHdpdGggZW5jb2RlZCBVUkxcbiAgICpcbiAgICogQHJldHVybiB7Vm9pZH1cbiAgICpcbiAgICovXG4gIHZhbGlkYXRlKCkge1xuICAgIGNvbnN0IHJlZGlyZWN0VXJsID0gZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuX3BhZ2VVUkwoKSk7XG4gICAgcmV0dXJuIHRoaXMuX3JlZGlyZWN0Rm4oYCR7dGhpcy5fbG9naW5Ib3N0fS9sb2dpbj9yZWRpcmVjdFVybD0ke3JlZGlyZWN0VXJsfWApO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2Vzc2lvbjtcbiIsImNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuY29uc3QgQ29uc3VtZXIgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9jb25zdW1lcicpO1xuY29uc3QgU3RvcmUgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9zdG9yZScpO1xuY29uc3QgdmFsaWRhdGVQYXNzd29yZCA9IHJlcXVpcmUoJy4uL3V0aWxzJykudmFsaWRhdGVQYXNzd29yZDtcblxuLyoqXG4gKiBAY2xhc3MgVXNlclxuICovXG5jbGFzcyBVc2VyIHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgVXNlclxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdG9yZX0gc3RvcmUgLSBUaGUgU3RvcmUgaW5zdGFuY2UgdG8gdXNlXG4gICAqIEBwYXJhbSB7Q29uc3VtZXJ9IGNvbnN1bWVyIC0gVGhlIENvbnN1bWVyIGluc3RhbmNlIHRvIHVzZVxuICAgKiBAcmV0dXJuIHtVc2VyfVxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3Ioc3RvcmUsIGNvbnN1bWVyKSB7XG4gICAgYXNzZXJ0KHN0b3JlIGluc3RhbmNlb2YgU3RvcmUsICdgc3RvcmVgIHNob3VsZCBiZSBpbnN0YW5jZSBvZiBTdG9yZScpO1xuICAgIGFzc2VydChjb25zdW1lciBpbnN0YW5jZW9mIENvbnN1bWVyLCAnYGNvbnN1bWVyYCBzaG91bGQgYmUgaW5zdGFuY2Ugb2YgQ29uc3VtZXInKTtcbiAgICB0aGlzLl9zdG9yZSA9IHN0b3JlO1xuICAgIHRoaXMuX2NvbnN1bWVyID0gY29uc3VtZXI7XG4gICAgdGhpcy5fYmVhcmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2lkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3B1Ymxpc2hlcklkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2ZpcnN0TmFtZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9sYXN0TmFtZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9lbWFpbCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9pc0RpcnR5ID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBVc2VyIGlkXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ30gW3JlYWQtb25seV0gaWRcbiAgICpcbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBVc2VyIHB1Ymxpc2hlcklkXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ30gW3JlYWQtb25seV0gcHVibGlzaGVySWRcbiAgICpcbiAgICovXG4gIGdldCBwdWJsaXNoZXJJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcHVibGlzaGVySWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBVc2VyIGVtYWlsXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ30gW3JlYWQtb25seV0gZW1haWxcbiAgICpcbiAgICovXG4gIGdldCBlbWFpbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW1haWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBVc2VyIGJlYXJlciB0b2tlblxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFtyZWFkLXdyaXRlXSBiZWFyZXIgdG9rZW5cbiAgICpcbiAgICovXG4gIGdldCBiZWFyZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JlYXJlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIFVzZXIgZmlyc3QgTmFtZVxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFtyZWFkLXdyaXRlXSBmaXJzdCBOYW1lXG4gICAqXG4gICAqL1xuICBnZXQgZmlyc3ROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9maXJzdE5hbWU7XG4gIH1cbiAgc2V0IGZpcnN0TmFtZShuZXdGaXJzdE5hbWUpIHtcbiAgICBpZiAobmV3Rmlyc3ROYW1lKSB7XG4gICAgICB0aGlzLl9pc0RpcnR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2ZpcnN0TmFtZSA9IG5ld0ZpcnN0TmFtZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBVc2VyIGxhc3QgbmFtZVxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFtyZWFkLXdyaXRlXSBsYXN0IG5hbWVcbiAgICpcbiAgICovXG4gIGdldCBsYXN0TmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFzdE5hbWU7XG4gIH1cbiAgc2V0IGxhc3ROYW1lKG5ld0xhc3ROYW1lKSB7XG4gICAgaWYgKG5ld0xhc3ROYW1lKSB7XG4gICAgICB0aGlzLl9pc0RpcnR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2xhc3ROYW1lID0gbmV3TGFzdE5hbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN5bmNyIFVzZXIgZGF0YSBmcm9tIFN0b3JlXG4gICAqIC0gQ3VycmVudGx5IG9uIGJlYXJlciBpcyBzeW5jZWQgdG8gU3RvcmVcbiAgICogLSBTdG9yZSBwcmlvcml0eSBwcm9jZWVkcyBkaXJ0eSBkYXRhXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBzeW5jV2l0aFN0b3JlKCkge1xuICAgIGxldCBiZWFyZXI7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3JlLmdldCgnYWNjZXNzX3Rva2VuJykudGhlbigoYWNjZXNzVG9rZW4pID0+IHtcbiAgICAgIC8vIENhY2hlIGJlYXJlclxuICAgICAgYmVhcmVyID0gYWNjZXNzVG9rZW47XG4gICAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIucmV0cmlldmVVc2VyKGFjY2Vzc1Rva2VuKTtcbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICB0aGlzLl9pZCA9IGRhdGEuaWQ7XG4gICAgICB0aGlzLl9wdWJsaXNoZXJJZCA9IGRhdGEucHVibGlzaGVyX2lkO1xuICAgICAgdGhpcy5fZW1haWwgPSBkYXRhLmVtYWlsO1xuICAgICAgdGhpcy5fZmlyc3ROYW1lID0gZGF0YS5maXJzdF9uYW1lO1xuICAgICAgdGhpcy5fbGFzdE5hbWUgPSBkYXRhLmxhc3RfbmFtZTtcbiAgICAgIHRoaXMuX2JlYXJlciA9IGJlYXJlcjtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSBmYWxzZTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBtZXNzYWdlOiAnU3luY2VkIFVzZXIgbW9kZWwgd2l0aCBTdG9yZScsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIFVzZXIgZGF0YVxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgc2F2ZSgpIHtcbiAgICBpZiAoIXRoaXMuX2lkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdDYW5ub3Qgc2F2ZSBhIG5vbi1leGlzdGVudCBVc2VyJykpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2lzRGlydHkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBtZXNzYWdlOiAnTm8gVXNlciBtb2RlbCBjaGFuZ2VzIHRvIHN5bmMnLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb25zdW1lci51cGRhdGVVc2VyKHRoaXMuX2lkLCB0aGlzLl9iZWFyZXIsIHtcbiAgICAgIGZpcnN0TmFtZTogdGhpcy5fZmlyc3ROYW1lLFxuICAgICAgbGFzdE5hbWU6IHRoaXMuX2xhc3ROYW1lLFxuICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5faXNEaXJ0eSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIG1lc3NhZ2U6ICdVcGRhdGVkIFVzZXIgbW9kZWwnLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBVc2VyXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCB0byBzZXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIHBhc3N3b3JkIHRvIHNldFxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlyc3ROYW1lIC0gVGhlIGZpcnN0IG5hbWUgdG8gc2V0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYXN0TmFtZSAtIFRoZSBsYXN0IG5hbWUgdG8gc2V0XG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBjcmVhdGUoZW1haWwsIHBhc3N3b3JkLCBmaXJzdE5hbWUsIGxhc3ROYW1lKSB7XG4gICAgYXNzZXJ0KGVtYWlsLCAnTWlzc2luZyBgZW1haWxgJyk7XG4gICAgYXNzZXJ0KHBhc3N3b3JkLCAnTWlzc2luZyBgcGFzc3dvcmRgJyk7XG4gICAgY29uc3QgeyBpc1ZhbGlkLCBtZXNzYWdlIH0gPSB2YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKTtcbiAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IobWVzc2FnZSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIuY3JlYXRlVXNlcihlbWFpbCwgcGFzc3dvcmQsIGZpcnN0TmFtZSwgbGFzdE5hbWUpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIHRoaXMuX2lkID0gZGF0YS5pZDtcbiAgICAgIHRoaXMuX3B1Ymxpc2hlcklkID0gZGF0YS5wdWJsaXNoZXJfaWQ7XG4gICAgICB0aGlzLl9maXJzdE5hbWUgPSBkYXRhLmZpcnN0X25hbWU7XG4gICAgICB0aGlzLl9sYXN0TmFtZSA9IGRhdGEubGFzdF9uYW1lO1xuICAgICAgdGhpcy5fZW1haWwgPSBkYXRhLmVtYWlsO1xuICAgICAgdGhpcy5faXNEaXJ0eSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIG1lc3NhZ2U6ICdDcmVhdGVkIFVzZXInLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGF1dGhlbnRpY2F0aW9uIHRva2VucyBmb3IgYSB1c2VybmFtZS1wYXNzd29yZCBjb21iaW5hdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlcm5hbWUgLSBUaGUgdXNlcm5hbWUgdG8gdXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSBwYXNzd29yZCB0byB1c2VcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIGF1dGhlbnRpY2F0ZSh1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICBhc3NlcnQodXNlcm5hbWUsICdNaXNzaW5nIGB1c2VybmFtZWAnKTtcbiAgICBhc3NlcnQocGFzc3dvcmQsICdNaXNzaW5nIGBwYXNzd29yZGAnKTtcbiAgICBsZXQgYmVhcmVyO1xuICAgIHJldHVybiB0aGlzLl9jb25zdW1lci5yZXRyaWV2ZVRva2VuKHVzZXJuYW1lLCBwYXNzd29yZCkudGhlbigocmVzKSA9PiB7XG4gICAgICBjb25zdCB7IGFjY2Vzc190b2tlbiwgcmVmcmVzaF90b2tlbiB9ID0gcmVzO1xuICAgICAgLy8gQ2FjaGUgYmVhcmVyXG4gICAgICBiZWFyZXIgPSBhY2Nlc3NfdG9rZW47XG4gICAgICAvLyBTdG9yZSB0b2tlbnNcbiAgICAgIHJldHVybiB0aGlzLl9zdG9yZS5zZXQoJ2FjY2Vzc190b2tlbicsIGFjY2Vzc190b2tlbilcbiAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5fc3RvcmUuc2V0KCdyZWZyZXNoX3Rva2VuJywgcmVmcmVzaF90b2tlbikpXG4gICAgICAgIC50aGVuKCgpID0+IHRoaXMuX2NvbnN1bWVyLnJldHJpZXZlVXNlcihhY2Nlc3NfdG9rZW4pKTtcbiAgICAgIC8vIFJldHJpZXZlIHVzZXIgZGF0YVxuICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIHRoaXMuX2JlYXJlciA9IGJlYXJlcjtcbiAgICAgIHRoaXMuX2lkID0gZGF0YS5pZDtcbiAgICAgIHRoaXMuX3B1Ymxpc2hlcklkID0gZGF0YS5wdWJsaXNoZXJfaWQ7XG4gICAgICB0aGlzLl9lbWFpbCA9IGRhdGEuZW1haWw7XG4gICAgICB0aGlzLl9maXJzdE5hbWUgPSBkYXRhLmZpcnN0X25hbWU7XG4gICAgICB0aGlzLl9sYXN0TmFtZSA9IGRhdGEubGFzdF9uYW1lO1xuICAgICAgdGhpcy5faXNEaXJ0eSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIG1lc3NhZ2U6ICdBdXRoZW50aWNhdGVkIFVzZXInLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHVzZXIgZm9yIGFuIGFjY2VzcyB0b2tlbi5cbiAgICogRmFsbGJhY2tzIHRvIHRva2VuIHJlZnJlc2ggaWYgcmVmcmVzaFRva2VuIGlzIGRlZmluZWRcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGFjY2Vzc1Rva2VuIC0gVGhlIGFjY2VzcyB0b2tlbiB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlZnJlc2hUb2tlbiAtIFRoZSByZWZyZXNoIHRva2VuIHRvIHVzZSAoT3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBhdXRoZW50aWNhdGVXaXRoVG9rZW4oYWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbikge1xuICAgIGFzc2VydChhY2Nlc3NUb2tlbiwgJ01pc3NpbmcgYGFjY2Vzc1Rva2VuYCcpO1xuICAgIC8vIFN0b3JlIGFjY2VzcyB0b2tlblxuICAgIHRoaXMuX3N0b3JlLnNldCgnYWNjZXNzX3Rva2VuJywgYWNjZXNzVG9rZW4pO1xuICAgIC8vIFN0b3JlIHJlZnJlc2ggdG9rZW4gKG9yIGNsZWFyIGlmIHVuZGVmaW5lZClcbiAgICBpZiAocmVmcmVzaFRva2VuKSB7XG4gICAgICB0aGlzLl9zdG9yZS5zZXQoJ3JlZnJlc2hfdG9rZW4nLCByZWZyZXNoVG9rZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zdG9yZS5yZW1vdmUoJ3JlZnJlc2hfdG9rZW4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NvbnN1bWVyLnJldHJpZXZlVXNlcihhY2Nlc3NUb2tlbikuY2F0Y2goKGVycikgPT4ge1xuICAgICAgaWYgKCFyZWZyZXNoVG9rZW4gfHwgZXJyLm5hbWUgIT09ICdpbnZhbGlkX3Rva2VuJykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICAgIC8vIFRyeSB0byByZWZyZXNoIHRoZSB0b2tlbnMgaWYgdGhlIGVycm9yIGlzIG9mIGBpbnZhbGlkX3Rva2VuYFxuICAgICAgcmV0dXJuIHRoaXMuX2NvbnN1bWVyLnJlZnJlc2hUb2tlbihyZWZyZXNoVG9rZW4pLnRoZW4oKG5ld1Rva2VucykgPT4ge1xuICAgICAgICAvLyBTdG9yZSBuZXcgdG9rZW5zXG4gICAgICAgIHRoaXMuX3N0b3JlLnNldCgnYWNjZXNzX3Rva2VuJywgbmV3VG9rZW5zLmFjY2Vzc190b2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JlLnNldCgncmVmcmVzaF90b2tlbicsIG5ld1Rva2Vucy5yZWZyZXNoX3Rva2VuKTtcbiAgICAgICAgLy8gUmV0cmlldmUgdXNlciB3aXRoIG5ldyB0b2tlblxuICAgICAgICByZXR1cm4gdGhpcy5fY29uc3VtZXIucmV0cmlldmVVc2VyKG5ld1Rva2Vucy5hY2Nlc3NfdG9rZW4pO1xuICAgICAgfSk7XG4gICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5fYmVhcmVyID0gYWNjZXNzVG9rZW47XG4gICAgICB0aGlzLl9pZCA9IGRhdGEuaWQ7XG4gICAgICB0aGlzLl9wdWJsaXNoZXJJZCA9IGRhdGEucHVibGlzaGVyX2lkO1xuICAgICAgdGhpcy5fZW1haWwgPSBkYXRhLmVtYWlsO1xuICAgICAgdGhpcy5fZmlyc3ROYW1lID0gZGF0YS5maXJzdF9uYW1lO1xuICAgICAgdGhpcy5fbGFzdE5hbWUgPSBkYXRhLmxhc3RfbmFtZTtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSBmYWxzZTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBtZXNzYWdlOiAnQXV0aGVudGljYXRlZCBVc2VyJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsdXNoZXMgc3RvcmVkIHRva2VucyBmb3IgVXNlciAobG9nb3V0KVxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgZmx1c2goKSB7XG4gICAgdGhpcy5fYmVhcmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2lkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3B1Ymxpc2hlcklkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2ZpcnN0TmFtZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9sYXN0TmFtZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9lbWFpbCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9pc0RpcnR5ID0gZmFsc2U7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3JlLnJlbW92ZSgnYWNjZXNzX3Rva2VuJywgJ3JlZnJlc2hfdG9rZW4nKS50aGVuKCgpID0+IFByb21pc2UucmVzb2x2ZSh7XG4gICAgICBtZXNzYWdlOiAnRmx1c2hlZCBVc2VyIGRhdGEnLFxuICAgIH0pKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlcjtcbiIsImNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuY29uc3QgQ2xpZW50ID0gcmVxdWlyZSgnLi4vbW9kZWxzL2NsaWVudCcpO1xuY29uc3QgUHJvZHVjdGlvbkFQSSA9IHJlcXVpcmUoJy4uL2FwaScpLlByb2R1Y3Rpb247XG5jb25zdCBTYW5kYm94QVBJID0gcmVxdWlyZSgnLi4vYXBpJykuU2FuZGJveDtcbmNvbnN0IGV4dHJhY3RFcnJvck1lc3NhZ2UgPSByZXF1aXJlKCcuLi91dGlscycpLmV4dHJhY3RFcnJvck1lc3NhZ2U7XG5cbi8qKlxuICogQGNsYXNzIENvbnN1bWVyXG4gKi9cbmNsYXNzIENvbnN1bWVyIHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgQ29uc3VtZXJcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgQ2xpZW50IGluc3RhbmNlIHRvIHVzZVxuICAgKiBAcGFyYW0ge0FQSS5Qcm9kdWN0aW9ufEFQSS5TYW5kYm94fSBhcGkgLSBUaGUgYXBpIHRvIHVzZSBmb3IgZmV0Y2hpbmcgZGF0YVxuICAgKiBAcmV0dXJuIHtDb25zdW1lcn1cbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNsaWVudCwgYXBpKSB7XG4gICAgYXNzZXJ0KGNsaWVudCBpbnN0YW5jZW9mIENsaWVudCwgJ2BjbGllbnRgIHNob3VsZCBiZSBpbnN0YW5jZSBvZiBDbGllbnQnKTtcbiAgICBhc3NlcnQoYXBpIGluc3RhbmNlb2YgUHJvZHVjdGlvbkFQSSB8fCBhcGkgaW5zdGFuY2VvZiBTYW5kYm94QVBJLCAnYGFwaWAgc2hvdWxkIGJlIGluc3RhbmNlIG9mIEFQSS5Qcm9kdWN0aW9uIG9yIEFQSS5TYW5kYm94Jyk7XG4gICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuX2FwaSA9IGFwaTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGRhdGEgZnJvbSBBUElcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlc291cmNlIC0gVGhlIHJlc291cmNlIHRvIGZldGNoIGZyb21cbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWQgLSBUaGUgcGF5bG9hZCB0byBwYXNzXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBfcmVxdWVzdChyZXNvdXJjZSwgcGF5bG9hZCkge1xuICAgIHJldHVybiB0aGlzLl9hcGkuaW52b2tlKHJlc291cmNlLCBwYXlsb2FkKS50aGVuKChyZXMpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhdHVzLCBib2R5IH0gPSByZXM7XG4gICAgICBpZiAocGFyc2VJbnQoc3RhdHVzLCAxMCkgPj0gNDAwKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGV4dHJhY3RFcnJvck1lc3NhZ2UoYm9keS5lcnJvcikpO1xuICAgICAgICBlcnJvci5uYW1lID0gYm9keS5lcnJvcjtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYm9keSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRva2VuIGZyb20gYSB1c2VybmFtZS1wYXNzd29yZCBjb21iaW5hdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlcm5hbWUgLSBUaGUgdXNlcm5hbWUgdG8gdXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSBwYXNzd29yZCB0byB1c2VcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIHJldHJpZXZlVG9rZW4odXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3Rva2VuJywge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiBgdXNlcm5hbWU9JHt1c2VybmFtZX0mcGFzc3dvcmQ9JHtwYXNzd29yZH0mZ3JhbnRfdHlwZT1wYXNzd29yZCZjbGllbnRfaWQ9JHt0aGlzLl9jbGllbnQuaWR9JmNsaWVudF9zZWNyZXQ9JHt0aGlzLl9jbGllbnQuc2VjcmV0fWAsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHJlbmV3ZWQgdG9rZW5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlZnJlc2hUb2tlbiAtIFRoZSByZWZyZXNoIHRva2VuIHRvIHVzZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKi9cbiAgcmVmcmVzaFRva2VuKHJlZnJlc2hUb2tlbikge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCd0b2tlbicsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICB9LFxuICAgICAgYm9keTogYHJlZnJlc2hfdG9rZW49JHtyZWZyZXNoVG9rZW59JmdyYW50X3R5cGU9cmVmcmVzaF90b2tlbiZjbGllbnRfaWQ9JHt0aGlzLl9jbGllbnQuaWR9JmNsaWVudF9zZWNyZXQ9JHt0aGlzLl9jbGllbnQuc2VjcmV0fWAsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBVc2VyXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIHBhc3N3b3JkIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlyc3ROYW1lIC0gVGhlIGZpcnN0IG5hbWUgdG8gdXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYXN0TmFtZSAtIFRoZSBsYXN0IG5hbWUgdG8gdXNlXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICBjcmVhdGVVc2VyKGVtYWlsLCBwYXNzd29yZCwgZmlyc3ROYW1lLCBsYXN0TmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCd1c2VycycsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgZW1haWwsXG4gICAgICAgIHBhc3N3b3JkLFxuICAgICAgICBmaXJzdF9uYW1lOiBmaXJzdE5hbWUsXG4gICAgICAgIGxhc3RfbmFtZTogbGFzdE5hbWUsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaXZlcyBhIFVzZXJcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIC0gVGhlIGBCZWFyZXJgIHRva2VuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICByZXRyaWV2ZVVzZXIodG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgndXNlcnMvbWUnLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gLFxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgfSxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhIFVzZXJcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJJZCAtIFRoZSBVc2VyIGlkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiAtIFRoZSBgQmVhcmVyYCB0b2tlblxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5maXJzdE5hbWUgLSBUaGUgZmlyc3QgYW1lIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5sYXN0TmFtZSAtIFRoZSBsYXN0IG5hbWUgdG8gdXNlXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICB1cGRhdGVVc2VyKHVzZXJJZCwgdG9rZW4sIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdChgdXNlcnMvJHt1c2VySWR9YCwge1xuICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGZpcnN0X25hbWU6IG9wdGlvbnMuZmlyc3ROYW1lLFxuICAgICAgICBsYXN0X25hbWU6IG9wdGlvbnMubGFzdE5hbWUsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0cyBmb3IgYSBwYXNzd29yZCByZXNldFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwgdG8gZm9yd2FyZCB0aGUgcmVzZXQgdG9rZW4gdG9cbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICovXG4gIHJlcXVlc3RQYXNzd29yZFJlc2V0KGVtYWlsKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3Bhc3N3b3JkcycsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgZW1haWwsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgcGFzc3dvcmRcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIC0gVGhlIHJlc2V0IHRva2VuIHRvIHVzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgbmV3IHBhc3N3b3JkXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqL1xuICByZXNldFBhc3N3b3JkKHRva2VuLCBwYXNzd29yZCkge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KGBwYXNzd29yZHMvJHt0b2tlbn1gLCB7XG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uc3VtZXI7XG4iLCJjb25zdCBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcbmNvbnN0IENyb3NzU3RvcmFnZUNsaWVudCA9IHJlcXVpcmUoJ2Nyb3NzLXN0b3JhZ2UnKS5Dcm9zc1N0b3JhZ2VDbGllbnQ7XG5cbi8qKlxuICogV3JhcHBlciBhcm91bmQgYENyb3NzU3RvcmFnZUNsaWVudGBcbiAqXG4gKiBAY2xhc3MgU3RvcmVcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3plbmRlc2svY3Jvc3Mtc3RvcmFnZVxuICpcbiAqL1xuXG5jbGFzcyBTdG9yYWdlQ2xpZW50IHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgU3RvcmFnZUNsaWVudFxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiAtIFRoZSBkb21haW4gdW5kZXIgd2hpY2ggYWxsIHZhbHVlcyB3aWxsIGJlIGF0dGFjaGVkXG4gICAqIEBwYXJhbSB7Q2xhc3N9IENyb3NzU3RvcmFnZUNsaWVudENsYXNzIC0gVGhlIENyb3NzU3RvcmFnZUNsaWVudCBjbGFzcyB0byBiZSBpbnN0YW50aWF0ZWQgKERlZmF1bHRzIHRvIENyb3NzU3RvcmFnZUNsaWVudClcbiAgICogQHJldHVybiB7U3RvcmV9XG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZnJhbWVIdWIsIENyb3NzU3RvcmFnZUNsaWVudENsYXNzID0gQ3Jvc3NTdG9yYWdlQ2xpZW50KSB7XG4gICAgYXNzZXJ0KGlmcmFtZUh1YiwgJ01pc3NpbmcgYGlmcmFtZUh1YmAnKTtcbiAgICB0aGlzLl9pZnJhbWVIdWIgPSBpZnJhbWVIdWI7XG4gICAgdGhpcy5fQ3Jvc3NTdG9yYWdlQ2xpZW50Q2xhc3MgPSBDcm9zc1N0b3JhZ2VDbGllbnRDbGFzcztcbiAgICB0aGlzLl9pbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIG9mIENyb3NzU3RvcmFnZUNsaWVudC5vbkNvbm5lY3QoKTtcbiAgICogQ3Jvc3NTdG9yYWdlQ2xpZW50IGluamVjdHMgYW4gaWZyYW1lIGluIHRoZSBET00sIHNvIHdlIG5lZWRcbiAgICogdG8gZW5zdXJlIHRoYXQgdGhlIGluc2VydGlvbiBoYXBwZW5zIE9OTFkgd2hlbiBhbiBldmVudCBpcyB0cmlnZ2VyZWRcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIG9uQ29ubmVjdCgpIHtcbiAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XG4gICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyB0aGlzLl9Dcm9zc1N0b3JhZ2VDbGllbnRDbGFzcyh0aGlzLl9pZnJhbWVIdWIpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5faW5zdGFuY2Uub25Db25uZWN0KCk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBvZiBDcm9zc1N0b3JhZ2VDbGllbnQuZ2V0KCk7XG4gICAqXG4gICAqIEBwYXJhbSB7QXJndW1lbnRzfSByZXN0XG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBnZXQoLi4ucmVzdCkge1xuICAgIHJldHVybiB0aGlzLm9uQ29ubmVjdCgpLnRoZW4oKCkgPT4gdGhpcy5faW5zdGFuY2UuZ2V0KC4uLnJlc3QpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIG9mIENyb3NzU3RvcmFnZUNsaWVudC5zZXQoKTtcbiAgICpcbiAgICogQHBhcmFtIHtBcmd1bWVudHN9IHJlc3RcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIHNldCguLi5yZXN0KSB7XG4gICAgcmV0dXJuIHRoaXMub25Db25uZWN0KCkudGhlbigoKSA9PiB0aGlzLl9pbnN0YW5jZS5zZXQoLi4ucmVzdCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgb2YgQ3Jvc3NTdG9yYWdlQ2xpZW50LmRlbCgpO1xuICAgKlxuICAgKiBAcGFyYW0ge0FyZ3VtZW50c30gcmVzdFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgZGVsKC4uLnJlc3QpIHtcbiAgICByZXR1cm4gdGhpcy5vbkNvbm5lY3QoKS50aGVuKCgpID0+IHRoaXMuX2luc3RhbmNlLmRlbCguLi5yZXN0KSk7XG4gIH1cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmFnZUNsaWVudDtcbiIsImNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuY29uc3QgU3RvcmFnZUNsaWVudCA9IHJlcXVpcmUoJy4vc3RvcmFnZS1jbGllbnQnKTtcblxuLyoqXG4gKiBAY2xhc3MgU3RvcmVcbiAqL1xuY2xhc3MgU3RvcmUge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBTdG9yZVxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiAtIFRoZSBkb21haW4gdW5kZXIgd2hpY2ggYWxsIHZhbHVlcyB3aWxsIGJlIGF0dGFjaGVkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZnJhbWVIdWIgLSBUaGUgaWZyYW1lIFVSTCB3aGVyZSBhbGwgdGhlIHZhbHVlcyB3aWxsIGJlIGF0dGFjaGVkXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBpZnJhbWVIdWIgLSBUaGUgaWZyYW1lIFVSTCB3aGVyZSBhbGwgdGhlIHZhbHVlcyB3aWxsIGJlIGF0dGFjaGVkXG4gICAqIEBwYXJhbSB7Q2xhc3N9IFN0b3JhZ2VDbGllbnRDbGFzcyAtIFRoZSBDcm9zc1N0b3JhZ2VDbGllbnQgQ2xhc3MgdG8gYmUgaW5zdGFudGlhdGVkXG4gICAqIEByZXR1cm4ge1N0b3JlfVxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoZG9tYWluLCBpZnJhbWVIdWIsIFN0b3JhZ2VDbGllbnRDbGFzcyA9IFN0b3JhZ2VDbGllbnQpIHtcbiAgICBhc3NlcnQoZG9tYWluLCAnTWlzc2luZyBgZG9tYWluYCcpO1xuICAgIGFzc2VydChpZnJhbWVIdWIsICdNaXNzaW5nIGBpZnJhbWVIdWJgJyk7XG4gICAgdGhpcy5fZG9tYWluID0gZG9tYWluO1xuICAgIHRoaXMuX2lmcmFtZUh1YiA9IGlmcmFtZUh1YjtcbiAgICB0aGlzLl9zdG9yYWdlID0gbmV3IFN0b3JhZ2VDbGllbnRDbGFzcyhpZnJhbWVIdWIpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZXMga2V5IGJhc2VkIG9uIGRvbWFpblxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gVGhlIGtleSB0byB1c2VcbiAgICogQHJldHVybiB7U3RyaW5nfSBUaGUgbm9ybWFsaXplZCBrZXlcbiAgICpcbiAgICovXG4gIF9ub3JtYWxpemVLZXkoa2V5KSB7XG4gICAgcmV0dXJuIGAke3RoaXMuX2RvbWFpbn1fJHtrZXl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHZhbHVlIGZvciBhIGtleVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gVGhlIGtleSB0byB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIC0gVGhlIHZhbHVlIHRvIHNldFxuICAgKlxuICAgKi9cbiAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5zZXQodGhpcy5fbm9ybWFsaXplS2V5KGtleSksIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHZhbHVlIGZvciBhIHN0b3JlZCBrZXlcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAtIFRoZSBrZXkgdG8gdXNlXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICpcbiAgICovXG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5nZXQodGhpcy5fbm9ybWFsaXplS2V5KGtleSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgb25lIG9yIG11bHRpcGxlIHZhbHVlIHBhaXIgaWYgdGhleSBleGlzdHNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGtleXMgLSBUaGUga2V5KHMpIHRvIHVzZVxuICAgKlxuICAgKi9cbiAgcmVtb3ZlKC4uLmtleXMpIHtcbiAgICBjb25zdCBub3JtYWxpemVkS2V5cyA9IGtleXMubWFwKGtleSA9PiB0aGlzLl9ub3JtYWxpemVLZXkoa2V5KSk7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3JhZ2UuZGVsKC4uLm5vcm1hbGl6ZWRLZXlzKTtcbiAgfVxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlO1xuIiwiLyoqXG4gKiBAbmFtZXNwYWNlIFV0aWxzXG4gKi9cbi8qKlxuICogR2VuZXJhdGVzIGEgcmFuZG9tIHN0cmluZ1xuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl4IC0gVGhlIHJhZGl4IHRvIHVzZS4gRGVmYXVsdHMgdG8gYDE4YFxuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDE4KS5zbGljZSgyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMuZ2VuZXJhdGVSYW5kb21TdHJpbmcgPSBnZW5lcmF0ZVJhbmRvbVN0cmluZztcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSByYW5kb20gVVVJRFxuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21VVUlEKCkge1xuICBjb25zdCBiYXNlID0gYCR7Z2VuZXJhdGVSYW5kb21TdHJpbmcoKX0ke2dlbmVyYXRlUmFuZG9tU3RyaW5nKCl9YDtcbiAgcmV0dXJuIGAke2Jhc2Uuc3Vic3RyaW5nKDAsIDgpfS0ke2Jhc2Uuc3Vic3RyaW5nKDksIDEzKX0tJHtiYXNlLnN1YnN0cmluZygxNCwgMTgpfS0ke2Jhc2Uuc3Vic3RyaW5nKDE5LCAyMyl9LSR7YmFzZS5zdWJzdHJpbmcoMjQsIDM2KX1gO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5nZW5lcmF0ZVJhbmRvbVVVSUQgPSBnZW5lcmF0ZVJhbmRvbVVVSUQ7XG5cbi8qKlxuICogU3RyaXBzIEJlYXJlciBmcm9tIEF1dGhvcml6YXRpb24gaGVhZGVyXG4gKlxuICogQG1lbWJlcm9mIFV0aWxzXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVyIC0gVGhlIEF1dGhvcml6YXRpb24gaGVhZGVyIHRvIHN0cmlwXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKlxuICovXG5mdW5jdGlvbiBzdHJpcEJlYXJlcihoZWFkZXIpIHtcbiAgcmV0dXJuIGAke2hlYWRlcn1gLnJlcGxhY2UoJ0JlYXJlcicsICcnKS50cmltKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzLnN0cmlwQmVhcmVyID0gc3RyaXBCZWFyZXI7XG5cbi8qKlxuICogUmV0dXJucyBlcnJvciBtZXNzYWdlIGZvciBgZXJyb3JDb2RlYFxuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHBhcmFtIHtTdHJpbmd9IGVycm9yQ29kZSAtIFRoZSBgZXJyb3JDb2RlYCB0byBtYXBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqXG4gKi9cblxuY29uc3QgZXh0cmFjdEVycm9yTWVzc2FnZSA9IChlcnJvckNvZGUpID0+IHtcbiAgc3dpdGNoIChlcnJvckNvZGUpIHtcbiAgICBjYXNlICd2YWxpZGF0aW9uX2ZhaWxlZCc6XG4gICAgICByZXR1cm4gJ1ZhbGlkYXRpb24gZmFpbGVkJztcbiAgICBjYXNlICdub3RfZm91bmQnOlxuICAgICAgcmV0dXJuICdOb3QgZm91bmQnO1xuICAgIGNhc2UgJ2ZvcmJpZGRlbl9yZXNvdXJjZSc6XG4gICAgICByZXR1cm4gJ0ZvcmJpZGRlbiByZXNvdXJjZSc7XG4gICAgY2FzZSAnYWNjZXNzX2RlbmllZCc6XG4gICAgICByZXR1cm4gJ1RoZSByZXNvdXJjZSBvd25lciBvciBhdXRob3JpemF0aW9uIHNlcnZlciBkZW5pZWQgdGhlIHJlcXVlc3QnO1xuICAgIGNhc2UgJ3Vuc3VwcG9ydGVkX2dyYW50X3R5cGUnOlxuICAgICAgcmV0dXJuICdUaGUgYXV0aG9yaXphdGlvbiBncmFudCB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQnO1xuICAgIGNhc2UgJ2ludmFsaWRfZ3JhbnQnOlxuICAgICAgcmV0dXJuICdJbnZhbGlkIGNyZWRlbnRpYWxzJztcbiAgICBjYXNlICd1bmF1dGhvcml6ZWRfcmVxdWVzdCc6XG4gICAgICByZXR1cm4gJ1VuYXV0aG9yaXplZCByZXF1ZXN0JztcbiAgICBjYXNlICd1bmF1dGhvcml6ZWRfY2xpZW50JzpcbiAgICAgIHJldHVybiAnVGhlIGF1dGhlbnRpY2F0ZWQgY2xpZW50IGlzIG5vdCBhdXRob3JpemVkJztcbiAgICBjYXNlICdpbnZhbGlkX3Rva2VuJzpcbiAgICAgIHJldHVybiAnVGhlIGFjY2VzcyB0b2tlbiBwcm92aWRlZCBpcyBleHBpcmVkLCByZXZva2VkLCBtYWxmb3JtZWQsIG9yIGludmFsaWQnO1xuICAgIGNhc2UgJ2ludmFsaWRfc2NvcGUnOlxuICAgICAgcmV0dXJuICdUaGUgcmVxdWVzdGVkIHNjb3BlIGlzIGludmFsaWQsIHVua25vd24sIG9yIG1hbGZvcm1lZCc7XG4gICAgY2FzZSAnaW52YWxpZF9jbGllbnQnOlxuICAgICAgcmV0dXJuICdDbGllbnQgYXV0aGVudGljYXRpb24gZmFpbGVkJztcbiAgICBjYXNlICdpbnZhbGlkX3JlcXVlc3QnOlxuICAgICAgcmV0dXJuICdUaGUgcmVxdWVzdCBpcyBtaXNzaW5nIGEgcmVxdWlyZWQgcGFyYW1ldGVyJztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICdVbmV4cGVjdGVkIGVycm9yJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZXh0cmFjdEVycm9yTWVzc2FnZSA9IGV4dHJhY3RFcnJvck1lc3NhZ2U7XG5cbi8qKlxuICogVmFsaWRhdGVzIGEgcGFzc3dvcmQgcGFpciBhZ2FpbnMgdGhlIGZvbGxvd2luZyBydWxlczpcbiAqIC0gUGFzc3dvcmQgY2Fubm90IGNvbnRhaW4gc3BhY2VzXG4gKiAtIFBhc3N3b3JkIG11c3QgY29udGFpbiBib3RoIG51bWJlcnMgYW5kIGNoYXJhY3RlcnNcbiAqIC0gUGFzc3dvcmQgbXVzdCBiZSBhdCBsZWFzdCA4IGNoYXJhY3RlcnMgbG9uZ1xuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gVGhlIGBwYXNzd29yZGAgdG8gdmFsaWRhdGVcbiAqIEByZXR1cm4ge09iamVjdH0gQ29udGFpbnMgYGlzVmFsaWQge0Jvb2xlYW59YCBhbmQgYG1lc3NhZ2Uge1N0cmluZ31gXG4gKlxuICovXG5jb25zdCB2YWxpZGF0ZVBhc3N3b3JkID0gKHBhc3N3b3JkKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5zU3BhY2VzID0gL1xccy9pLnRlc3QocGFzc3dvcmQpO1xuICBjb25zdCBjb250YWluc051bWJlciA9IC9cXGQvaS50ZXN0KHBhc3N3b3JkKTtcbiAgY29uc3QgY29udGFpbnNDaGFyYWN0ZXJzID0gL1thLXpdL2kudGVzdChwYXNzd29yZCk7XG4gIGlmIChjb250YWluc1NwYWNlcykge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiAnUGFzc3dvcmQgY2Fubm90IGNvbnRhaW4gc3BhY2VzJyxcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgIH07XG4gIH1cbiAgaWYgKCFjb250YWluc051bWJlciB8fCAhY29udGFpbnNDaGFyYWN0ZXJzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6ICdQYXNzd29yZCBtdXN0IGNvbnRhaW4gYm90aCBudW1iZXJzIGFuZCBjaGFyYWN0ZXJzJyxcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgIH07XG4gIH1cbiAgaWYgKHBhc3N3b3JkLmxlbmd0aCA8IDgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogJ1Bhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgOCBjaGFyYWN0ZXJzIGxvbmcnLFxuICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgfTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGlzVmFsaWQ6IHRydWUsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cy52YWxpZGF0ZVBhc3N3b3JkID0gdmFsaWRhdGVQYXNzd29yZDtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblxuLyoqXG4gKiBXcmFwcGVyIGFyb3VuZCB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgpXG4gKlxuICogQG1lbWJlcm9mIFV0aWxzXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gVGhlIHVybCB0byByZWRpcmVjdCB0b1xuICogQHJldHVybiB7Vm9pZH1cbiAqXG4gKi9cbmNvbnN0IHJlZGlyZWN0VG9VUkwgPSAodXJsKSA9PiB7XG4gIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHVybCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5yZWRpcmVjdFRvVVJMID0gcmVkaXJlY3RUb1VSTDtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblxuLyoqXG4gKiBXcmFwcGVyIGFyb3VuZCB3aW5kb3cubG9jYXRpb24uaHJlZlxuICpcbiAqIEBtZW1iZXJvZiBVdGlsc1xuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xuY29uc3QgcmV0cmlldmVVUkwgPSAoKSA9PiB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxubW9kdWxlLmV4cG9ydHMucmV0cmlldmVVUkwgPSByZXRyaWV2ZVVSTDtcbiJdfQ==
