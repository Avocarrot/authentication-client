"use strict";
const assert = require('assert');

/**
 * @module Host
 */

class Host {

  /**
   * Initializes Client
   * @constructor
   * @param {String} endpoint - The Host endpoint
   * @param {String} login_url - The login page URL
   */
  constructor(endpoint, login_url) {
    assert(endpoint, 'Missing `endpoint`');
    assert(login_url, 'Missing `login_url`');
    this._endpoint = endpoint;
    this._login_url = login_url;
  }

  /**
   * Returns Client id
   * @returns {String} id
   */
  get endpoint() {
    return this._endpoint;
  }

  /**
   * Returns Client id
   * @returns {String} id
   */
  get login_url() {
    return this._login_url;
  }

}
module.exports = Host;
