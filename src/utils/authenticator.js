"use strict";

/**
 * @module Authenticator
 */
class Authenticator {
  /**
   * Initializes Authenticator state
   * @constructor
   * @param {object} options.store - The Store.js instance to use
   * @param {string} options.host - The authentication API host
   * @param {string} options.login_page_endpoint - The login page endpoint
   */
  constructor(options) {
    options = options || {};
    if (typeof options.store === 'undefined') {
      throw new Error('Missing store configuration for Authenticator')
    }
    if (typeof options.host === 'undefined') {
      throw new Error('Missing host configuration for Authenticator')
    }
    if (typeof options.login_page_endpoint === 'undefined') {
      throw new Error('Missing login page endpoint configuration for Authenticator')
    }
    this.store = options.store;
    this.host = options.host;
    this.login_page_endpoint = options.login_page_endpoint;
  }

  /**
   * Returns true if session is authenticated, false otherwise
   * @returns {boolean} isAuthenticated
   */
  get isAuthenticated() {
    return false;
  }

  /**
   * Returns user data (id, name email, pusblisher_id) for authenticated user
   * @returns {object} user - user data for current seesion
   */
  get user() {
    return null;
  }

  /**
   * Returns JWT bearer for authenticated session, if any
   * @returns {string} bearer - JWT token
   */
  get bearer() {
    return null;
  }

  /**
   * Invalidates all stored authentication token(s)
   */
  invalidate() {}

  /**
   * Retrieves an authentication token for a an email-password combination
   * @param {string} email - email value
   * @param {string} password - password value
   */
  authenticate(email, password) {

  }
}
module.exports = Authenticator;
