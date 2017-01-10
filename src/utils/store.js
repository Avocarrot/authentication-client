'use strict';
const assert = require('assert');
const StoreJS = require('store');

/**
 * Wrapper arround StoreJS
 * @module Store
 * @see https://github.com/marcuswestin/store.js/
 */

class Store {

  /**
   * Initializes Store
   * @constructor
   * @param {String} prefix - The prefix to use for all operations
   */
  constructor(prefix) {
    assert(prefix, 'Missing `prefix`');
    this._prefix = prefix;
  }

  /**
   * Normalizes key based on prefix
   * @param {String} key - The key to use
   * @returns {String} normalizedKey
   */
  _normalizeKey(key){
    return this._prefix + '_' + key;
  }

  /**
   * Set a key value pair
   * @param {String} key - The key to use
   * @param {String} value - The value to set
   */
  set(key, value) {
    StoreJS.set(this._normalizeKey(key), value)
  }

  /**
   * Returns value for a stored key
   * @param {String} key - The key to use
   * @returns {String} value
   */
  get(key) {
    return StoreJS.get(this._normalizeKey(key))
  }

  /**
   * Removes key value pair for a key
   * @param {String} key - The key to use
   */
  remove(key) {
    StoreJS.remove(this._normalizeKey(key))
  }

}
module.exports = Store;
