const assert = require('assert');

/**
 * Wrapper around `js-cookie`
 * @see https://github.com/js-cookie/js-cookie
 */
const Cookies = require('js-cookie');

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
   * @param {String} namespace - The namespace where all values will be attached
   * @return {Store}
   *
   */
  constructor(namespace) {
    assert(namespace, 'Missing `namespace`');
    this._namespace = namespace;
  }

  /**
   * Normalizes key based on namespace
   *
   * @private
   * @param {String} key - The key to use
   * @return {String} The normalized key
   *
   */
  _normalizeKey(key) {
    return `${this._namespace}_${key}`;
  }

  /**
   * Sets value for a key
   *
   * @param {String} key - The key to use
   * @param {String} value - The value to set
   *
   */
  set(key, value) {
    Cookies.set(this._normalizeKey(key), value, { domain: `.${this._namespace}.com` });
  }

  /**
   * Returns value for a stored key
   *
   * @param {String} key - The key to use
   * @return {String}
   *
   */
  get(key) {
    return Cookies.get(this._normalizeKey(key));
  }

  /**
   * Removes key value pair
   *
   * @param {String} key - The key to use
   *
   */
  remove(key) {
    Cookies.remove(this._normalizeKey(key));
  }

}
module.exports = Store;
