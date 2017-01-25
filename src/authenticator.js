const assert = require('assert');
const User = require('./models/user');
const Consumer = require('./services/consumer');
const validatePassword = require('./utils').validatePassword;
const URLRedirect = require('./utils').URLRedirect;

/**
 * @class Authenticator
 */
class Authenticator {

  /**
   * Initializes Authenticator
   *
   * @constructor
   * @param {String} loginHost - The login host URL
   * @param {Store} store - The Store instance to use
   * @param {User} user - The User instance to use
   * @param {function} redirectFn - The function to use upon redirects
   * @return {Authenticator}
   *
   */
  constructor(user, consumer, loginHost, redirectFn = URLRedirect) {
    assert(user instanceof User, '`user` should be instance of User');
    assert(consumer instanceof Consumer, '`consumer` should be instance of Consumer');
    assert(loginHost, '`loginHost` not defined');
    this._loginHost = loginHost;
    this._consumer = consumer;
    this._user = user;
    this._redirectFn = redirectFn;
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
    return this._consumer.requestPasswordReset(email);
  }

  /**
   * Asks for a password reset
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
    return this._consumer.resetPassword(token, password);
  }


  /**
   * Redirects to a resource of the configured HOST
   *
   * @param {String} resouce - The resource to visit
   * @param {String} successUrl - The URL to follow on success
   * @return {Void}
   *
   */
  redirect(resource, successUrl) {
    assert(resource, 'Missing `resouce`');
    assert(successUrl, 'Missing `successUrl`');
    this._redirectFn(`${this._loginHost}/${resource}?redirectUrl=${encodeURIComponent(successUrl)}`);
  }

  /**
   * Registers User instance
   *
   * @return {User} The User for the current sessoin
   *
   */
  get user() {
    return this._user;
  }

}

module.exports = Authenticator;
