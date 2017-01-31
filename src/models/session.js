const assert = require('assert');
const User = require('../models/user');
const Store = require('../services/store');
const retrieveURL = require('../utils').retrieveURL;
const redirectToURL = require('../utils').redirectToURL;

/**
 * @class Session
 */
class Session {

  /**
   * Initializes User
   *
   * @constructor
   * @param {Store} store - The Store instance to use
   * @param {User} consumer - The User instance to use
   * @param {String} loginHost - The login app host
   * @param {String} redirectFn - The function the forces URL redirection - Defaults to `window.location.replace`
   * @param {String} pageURL - The current page URL - Defaults to `window.href`
   * @return {User}
   *
   */
  constructor(store, user, loginHost, redirectFn = redirectToURL, pageURL = retrieveURL) {
    assert(store instanceof Store, '`store` should be instance of Store');
    assert(user instanceof User, '`user` should be instance of User');
    assert(loginHost, '`loginHost` is not defined');
    this._store = store;
    this._user = user;
    this._loginHost = loginHost;
    this._redirectFn = redirectFn;
    this._pageURL = pageURL;
  }

  /**
   * Determines if session is valid (User is authenticated)
   *
   * @return {Boolean}
   *
   */
  get isValid() {
    return typeof this._user.bearer !== 'undefined';
  }

  /**
   * Invalidates Session
   *
   * @return {Void}
   *
   */
  invalidate() {
    // Flush stored data
    this._store.remove('access_token');
    this._store.remove('refresh_token');
    // Redirect to login host with a return URL
    return this._redirectFn(`${this._loginHost}/login`);
  }

  /**
   * Validates Session
   * - Extracts current URL from window.location
   * - Redirects to `loginHost` with encoded URL
   *
   * @return {Void}
   *
   */
  validate() {
    const redirectUrl = encodeURIComponent(this._pageURL());
    return this._redirectFn(`${this._loginHost}/login?redirectUrl=${redirectUrl}`);
  }
}

module.exports = Session;
