const assert = require('assert');
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
  constructor(store, redirectFn = redirectToURL) {
    assert(store instanceof Store, '`store` should be instance of Store');
    this._store = store;
    this._redirectFn = redirectFn;
  }

  /**
     * Redirects to  for a password reset
     *  - Adds loginToken param to query if browser does not support cross storage support
     *
     * @param {String} url - The URL to redirect to
     * @param {String} loginToken - The login token to use (optional)
     *
     */
  authenticatedRedirect(url, loginToken = extractLoginTokenFromURL(retrieveURL())) {
    if (this._store.supportsCrossStorage()) {
      return this._redirectFn(url);
    }
    const postfix = (~url.indexOf('?'))
      ? '&'
      : '?';
    return this._redirectFn(`${url}${postfix}loginToken=${loginToken}`);
  }

}

module.exports = Redirector;
