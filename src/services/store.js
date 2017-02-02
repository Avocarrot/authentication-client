const assert = require('assert');

/**
 * Wrapper around `js-cookie`
 * @see https://github.com/js-cookie/js-cookie
 */
const Cookie = require('js-cookie');

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
    Cookie.set(this._normalizeKey(key), value, { domain: `${this._domain}.com` });
  }

  /**
   * Returns value for a stored key
   *
   * @param {String} key - The key to use
   * @return {String}
   *
   */
  get(key) {
    return Cookie.get(this._normalizeKey(key));
  }

  /**
   * Removes key value pair
   *
   * @param {String} key - The key to use
   *
   */
  remove(key) {
    Cookie.remove(this._normalizeKey(key));
  }

}
module.exports = Store;
