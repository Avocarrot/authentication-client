'use strict';
const assert = require('assert');
const User = require('./models/user');
const Consumer = require('./services/consumer');

/**
 * @class Authenticator
 */
class Authenticator {

  /**
   * Initializes Authenticator
   * @constructor
   * @param {Store} store - The Store instance to use
   * @param {User} user - The User instance to use
   */
  constructor(user, consumer) {
    assert(user instanceof User, 'Missing `user` configuration for Authenticator');
    assert(consumer instanceof Consumer, 'Missing `consumer` configuration for Authenticator');
    this._consumer = consumer;
    this._user = user;
  }

  /**
   * Asks for a password reset
   * @param {String} email - The email to reset the password for
   * @returns {Promise}
   */
  requestPasswordReset(email) {
    assert(email, 'Missing `email`');
    return this._consumer.requestPasswordReset(email);
  }

  /**
   * Asks for a password reset
   * @param {String} token - The reset token provided via email
   * @param {String} password - The new password
   * @returns {Promise}
   */
  resetPassword(token, password) {
    assert(token, 'Missing `token`');
    assert(password, 'Missing `password`');
    return this._consumer.resetPassword(token, password);
  }

  /**
   * Registers User instance
   * @returns {User}
   */
  get user() {
    return this._user;
  }

}

module.exports = Authenticator;
