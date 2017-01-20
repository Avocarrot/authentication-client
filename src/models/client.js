const assert = require('assert');

/**
 * @class Client
 */
class Client {

  /**
   * Initializes Client
   *
   * @constructor
   * @param {String} id - The Client id
   * @param {String} secret - The Client secret
   * @return {Client}
   *
   */
  constructor(id, secret) {
    assert(id, 'Missing `id`');
    assert(secret, 'Missing `secret`');
    this._id = id;
    this._secret = secret;
  }

  /**
   * Returns Client id
   *
   * @return {String}
   *
   */
  get id() {
    return this._id;
  }

  /**
   * Returns Client secret
   *
   * @return {String}
   *
   */
  get secret() {
    return this._secret;
  }

}
module.exports = Client;
