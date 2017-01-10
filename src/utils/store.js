'use strict';
const assert = require('assert');

/**
 * Local Storage wrapper based on `Store.js`
 * @see https://github.com/marcuswestin/store.js/
 */
const LocalStorage = require('store');

/**
 * Wrapper arround LocalStorage
 * @class Store
 */
class Store {

  /**
   * Initializes Store
   * @constructor
   * @param {String} namespace - The namespace where all values will be attached
   */
  constructor(namespace) {
    assert(namespace, 'Missing `namespace`');
    this._namespace = namespace;
  }

  /**
   * Normalizes key based on namespace
   * @param {String} key - The key to use
   * @returns {String} normalizedKey
   */
  _normalizeKey(key){
    return this._namespace + '_' + key;
  }

  /**
   * Sets value for a key
   * @param {String} key - The key to use
   * @param {String} value - The value to set
   */
  set(key, value) {
    LocalStorage.set(this._normalizeKey(key), value)
  }

  /**
   * Returns value for a stored key
   * @param {String} key - The key to use
   * @returns {String} value
   */
  get(key) {
    return LocalStorage.get(this._normalizeKey(key))
  }

  /**
   * Removes key value pair
   * @param {String} key - The key to use
   */
  remove(key) {
    LocalStorage.remove(this._normalizeKey(key))
  }

}
module.exports = Store;
