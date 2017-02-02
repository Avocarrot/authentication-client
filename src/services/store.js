const assert = require('assert');

/**
 * Wrapper around `store`
 * @see https://github.com/marcuswestin/store.js
 */
const LocalStorage = require('store');

/**
 * Wrapper arround LocalStorage
 *
 * @class Store
 */
class Store {

  /**
   * Initializes Store
   *
   * @constructor
   * @param {String} domain - The domain where all values will be attached
   * @return {Store}
   *
   */
  constructor(domain) {
    assert(domain, 'Missing `domain`');
    this._domain = domain;
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
    LocalStorage.set(this._normalizeKey(key), value);
  }

  /**
   * Returns value for a stored key
   *
   * @param {String} key - The key to use
   * @return {String}
   *
   */
  get(key) {
    return LocalStorage.get(this._normalizeKey(key));
  }

  /**
   * Removes key value pair
   *
   * @param {String} key - The key to use
   *
   */
  remove(key) {
    LocalStorage.remove(this._normalizeKey(key));
  }

}
module.exports = Store;
