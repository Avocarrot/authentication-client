const assert = require('assert');
const StorageClient = require('./storage-client');

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
   * @param {Class} StorageClientClass - The CrossStorageClient Class to be instantiated
   * @return {Store}
   *
   */
  constructor(domain, iframeHub, StorageClientClass = StorageClient) {
    assert(domain, 'Missing `domain`');
    assert(iframeHub, 'Missing `iframeHub`');
    this._domain = domain;
    this._iframeHub = iframeHub;
    this._storage = new StorageClientClass(iframeHub);
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
    return this._storage.set(this._normalizeKey(key), value);
  }

  /**
   * Returns value for a stored key
   *
   * @param {String} key - The key to use
   * @return {String}
   *
   */
  get(key) {
    return this._storage.get(this._normalizeKey(key));
  }

  /**
   * Removes one or multiple value pair if they exists
   *
   * @param {String|Array} keys - The key(s) to use
   *
   */
  remove(...keys) {
    const normalizedKeys = keys.map(key => this._normalizeKey(key));
    return this._storage.del(...normalizedKeys);
  }

}
module.exports = Store;
