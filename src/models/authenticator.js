const assert = require('assert');
const Consumer = require('../services/consumer');
const validatePassword = require('../utils').validatePassword;

/**
 * @class Authenticator
 */
class Authenticator {

  /**
   * Initializes Authenticator
   *
   * @constructor
   * @param {Store} store - The Store instance to use
   * @return {Authenticator}
   *
   */
  constructor(consumer) {
    assert(consumer instanceof Consumer, '`consumer` should be instance of Consumer');
    this._consumer = consumer;
  }

  /**
   * Asks for a password reset
   *
   * @param {String} email - The email to reset the password for
   * @return {Promise}
   *
   */
  requestPasswordReset(email) {
    assert(email, 'Missing `email`');
    return this._consumer.requestPasswordReset(email).then(() => Promise.resolve({ message: 'A reset link has been sent to your email' }));
  }

  /**
   * Sets a new password
   *
   * @param {String} token - The reset token provided via email
   * @param {String} password - The new password
   * @return {Promise}
   *
   */
  resetPassword(token, password) {
    assert(token, 'Missing `token`');
    assert(password, 'Missing `password`');
    const { isValid, message } = validatePassword(password);
    if (!isValid) {
      return Promise.reject(new Error(message));
    }
    return this._consumer.resetPassword(token, password).then(() => Promise.resolve({ message: 'Your password has been reset' }));
  }

}

module.exports = Authenticator;
