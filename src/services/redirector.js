const assert = require('assert');
const User = require('../models/user');
const Store = require('./store');
const redirectToURL = require('../utils').redirectToURL;
const extractLoginTokenFromURL = require('../utils').extractLoginTokenFromURL;
const retrieveURL = require('../utils').retrieveURL;

/**
 * @class Redirector
 */
class Redirector {

  /**
   * Initializes Redirector
   *
   * @constructor
   * @param {Store} store - The Store instance to use
   * @param {Function} redirectFn - The redirect function to use. Defaults to `Utils.redirectToURL`
   * @return {Redirector}
   *
   */
  constructor(store, user, redirectFn = redirectToURL, retrieveURLFn = retrieveURL) {
    assert(store instanceof Store, '`store` should be instance of Store');
    assert(user instanceof User, '`store` should be instance of Store');
    this._store = store;
    this._user = user;
    this._redirectFn = redirectFn;
    this._retrieveURLFn = retrieveURLFn;
  }

  /**
     * Redirects to  for a password reset
     *  - Adds loginToken param to query if browser does not support cross storage support
     *
     * @param {String} targetUrl - The URL to redirect to
     * @param {String} loginToken - The login token to use (optional)
     *
     */
  authenticatedRedirect(targetUrl, loginToken) {
    if (this._store.supportsCrossStorage()) {
      return this._redirectFn(targetUrl);
    }
    const postfix = (~targetUrl.indexOf('?'))
      ? '&'
      : '?';
    const token = loginToken || extractLoginTokenFromURL(this._retrieveURLFn()) || this._user.bearer;
    return this._redirectFn(`${targetUrl}${postfix}loginToken=${token}`);
  }

}

module.exports = Redirector;
