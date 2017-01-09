"use strict";
/**
 * @module Authenticator
 */
class Authenticator {
  /**
   * Initializes Authenticator state
   * @constructor
   * @param {string} host - The authentication api host
   */
  constructor(host) {
    this.host = host;
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
