const assert = require('assert');
const HubStorageClient = require('./hub-storage-client');
const retrieveBrowserName = require('../utils').retrieveBrowserName;

/**
 * Determines if browser supports cross storage
 * @ignore
 */
const supportsCrossStorage = (retrieveBrowserName() !== 'Safari');

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
   * @param {Boolean} isCrossStorageAvailable - Flaf that determines if cross storage canb be used or not
   * @return {Store}
   *
   */
  constructor(domain, iframeHub, HubStorageClientClass = HubStorageClient, isCrossStorageAvailable = supportsCrossStorage) {
    assert(domain, 'Missing `domain`');
    assert(iframeHub, 'Missing `iframeHub`');
    this._domain = domain;
    this._iframeHub = iframeHub;
    this._hubStorage = new HubStorageClientClass(iframeHub);
    this._isCrossStorageAvailable = isCrossStorageAvailable;
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
   * Detrmines if Store supports cross storage
   *
   * @return {Boolean} value
   *
   */
  supportsCrossStorage() {
    return this._isCrossStorageAvailable;
  }

  /**
   * Sets value for a key
   *
   * @param {String} key - The key to use
   * @param {String} value - The value to set
   *
   */
  set(key, value) {
    return this._hubStorage.set(this._normalizeKey(key), value);
  }

  /**
   * Returns value for a stored key
   *
   * @param {String} key - The key to use
   * @return {String}
   *
   */
  get(key) {
    return this._hubStorage.get(this._normalizeKey(key));
  }

  /**
   * Removes one or multiple value pair if they exists
   *
   * @param {String|Array} keys - The key(s) to use
   *
   */
  remove(...keys) {
    const normalizedKeys = keys.map(key => this._normalizeKey(key));
    return this._hubStorage.del(...normalizedKeys);
  }

}
module.exports = Store;
