const assert = require('assert');
const CrossStorageClient = require('cross-storage').CrossStorageClient;


/**
 * @class Store
 */
class Store {

  /**
   * Initializes Store
   *
   * @constructor
   * @param {String} domain - The domain under which all values will be attached
   * @param {String} iframeHub - The iframe URL where all the values will be attached
   * @param {Object} iframeHub - The iframe URL where all the values will be attached
   * @param {Class} CrossStorageClientClass - The CrossStorageClient Class to be instantiated
   * @return {Store}
   *
   */
  constructor(domain, iframeHub, CrossStorageClientClass = CrossStorageClient) {
    assert(domain, 'Missing `domain`');
    assert(iframeHub, 'Missing `iframeHub`');
    this._domain = domain;
    this._iframeHub = iframeHub;
    this._storage = new CrossStorageClientClass(iframeHub);
  }

  /**
   * Normalizes key based on domain
   *
   * @private
   * @param {String} key - The key to use
   * @return {String} The normalized key
   *
   */
  _normalizeKey(key) {
    return `${this._domain}_${key}`;
  }

  /**
   * Sets value for a key
   *
   * @param {String} key - The key to use
   * @param {String} value - The value to set
   *
   */
  set(key, value) {
    return this._storage.onConnect().then(() => this._storage.set(this._normalizeKey(key), value));
  }

  /**
   * Returns value for a stored key
   *
   * @param {String} key - The key to use
   * @return {String}
   *
   */
  get(key) {
    return this._storage.onConnect().then(() => this._storage.get(this._normalizeKey(key)));
  }

  /**
   * Removes key value pair if it exists
   *
   * @param {String} key - The key to use
   *
   */
  remove(key) {
    return this._storage.onConnect().then(() => this._storage.del(this._normalizeKey(key)));
  }

}
module.exports = Store;
