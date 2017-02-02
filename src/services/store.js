const assert = require('assert');

/**
 * Wrapper around `cross-storage`
 * @see https://github.com/zendesk/cross-storage
 */
const CrossStorageClient = require('cross-storage').CrossStorageClient;
const CrossStorageHub = require('cross-storage').CrossStorageHub;

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
   * @param {String} domain - The domain under which all values will be attached
   * @param {String} iframeHub - The iframe URL where all the values will be attached
   * @param {Object} iframeHub - The iframe URL where all the values will be attached
   * @param {Object} StorageHub - The CrossStorageHub used for cross domain storage
   * @param {Object} StorageClient - The CrossStorageClient used for cross domain storage
   * @return {Store}
   *
   */
  constructor(domain, iframeHub, StorageHub = CrossStorageHub, StorageClient = CrossStorageClient) {
    assert(domain, 'Missing `domain`');
    assert(iframeHub, 'Missing `iframeHub`');
    this._domain = domain;
    /**
     * Register Hub
     * - Read access for all subdomains
     * - Read/Write access for login subdomain
     * @see https://github.com/zendesk/cross-storage#crossstoragehubinitpermissions
     */
    StorageHub.init([
      {
        origin: new RegExp(`.${domain}.com`, 'g'),
        allow: ['get'],
      },
      {
        origin: new RegExp(`://(login.)?${domain}.com`, 'g'),
        allow: ['get', 'set', 'del'],
      },
    ]);
    /**
     * Register client
     * @see https://github.com/zendesk/cross-storage#new-crossstorageclienturl-opts
     */
    this._storage = new StorageClient(iframeHub);
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
