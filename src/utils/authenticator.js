"use strict";
const assert = require('assert');
const Host = require('./host');
const Client = require('./client');

/*eslint no-console: ["error", { allow: ["warn", "log", "error"] }] */


/**
 * @module Authenticator
 */

class Authenticator {

  /**
   * Initializes Authenticator state
   * @constructor
   * @param {Store} store - The Store.js instance to use
   * @param {Client} client - The authentication Client
   * @param {Host} host - The authentication Host
   */

  constructor(store, client, host) {
    assert(store instanceof Object, 'Missing `store` configuration for Authenticator');
    assert(client instanceof Client, 'Missing `client` configuration for Authenticator');
    assert(host instanceof Host, 'Missing `host` configuration for Authenticator');
    this.store = store;
    this.host = host;
    this.client = client;
  }

  /**
   * Returns true if session is authenticated, false otherwise
   * @returns {Boolean} isAuthenticated
   */
  get isAuthenticated() {
    return false;
  }

  /**
   * Returns user data (id, name email, pusblisher_id) for authenticated user
   * @returns {Object} user - user data for current seesion
   */
  get user() {
    return null;
  }

  /**
   * Returns JWT bearer for authenticated session, if any
   * @returns {String} bearer - JWT token
   */
  get bearer() {
    return null;
  }

  /**
   * Invalidates all stored authentication token(s)
   */
  invalidate() {
  }

  /**
   * Retrieves an authentication token for a an username-password combination
   * @param {String} username - username value
   * @param {String} password - password value
   */
  authenticate(username, password) {
    assert(username, 'Missing `username`');
    assert(password, 'Missing `password`');
  }
}

module.exports = Authenticator;
