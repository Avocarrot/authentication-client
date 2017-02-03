const assert = require('assert');

/**
 * Wrapper around `CrossStorageClient`
 *
 * @class Store
 * @see https://github.com/zendesk/cross-storage
 *
 */

class StorageClient {

  /**
   * Initializes StorageClient
   *
   * @constructor
   * @param {String} domain - The domain under which all values will be attached
   * @param {Class} CrossStorageClient - The CrossStorageClient class to be instantiated
   * @return {Store}
   *
   */
  constructor(iframeHub, CrossStorageClientClass) {
    assert(iframeHub, 'Missing `iframeHub`');
    this._iframeHub = iframeHub;
    this._CrossStorageClientClass = CrossStorageClientClass;
    this._instance = undefined;
  }

  /**
   * Connects with Storage iframe
   * CrossStorageClient injects an iframe in the DOM, so we need
   * to ensure that the insertion happens ONLY when an event is triggered
   *
   * @return {Promise}
   */
  onConnect() {
    if (!this._instance) {
      this._instance = new this._CrossStorageClientClass(this._iframeHub);
    }
    return this._instance.onConnect();
  }
}

module.exports = StorageClient;
