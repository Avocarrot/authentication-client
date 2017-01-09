"use strict";
const nconf = require('../../config');

/**
 * @module Authenticator
 */
class Authenticator {
  /**
   * Initializes Authenticator state
   * @constructor
   * @param {string} host - The authentication api host
   * @param {string} login_page_endpoint - The login page endpoint
   */
  constructor(host, login_page_endpoint) {
    this.host = host || nconf.get('host');
    this.login_page_endpoint = login_page_endpoint || nconf.get('login_page_endpoint');
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
