'use strict';
const assert = require('assert');

/**
 * @class Client
 */
class Client {

  /**
   * Initializes Client
   * @constructor
   * @param {String} id - The Client id
   * @param {String} secret - The Client secret
   */
  constructor(id, secret) {
    assert(id, 'Missing `id`');
    assert(secret, 'Missing `secret`');
    this._id = id;
    this._secret = secret;
  }

  /**
   * Returns Client id
   * @returns {String} id
   */
  get id() {
    return this._id;
  }

  /**
   * Returns Client secret
   * @returns {String} secret
   */
  get secret() {
    return this._secret;
  }

}
module.exports = Client;
