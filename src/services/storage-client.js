const assert = require('assert');
const CrossStorageClient = require('cross-storage').CrossStorageClient;

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
   * @param {Class} CrossStorageClientClass - The CrossStorageClient class to be instantiated (Defaults to CrossStorageClient)
   * @return {Store}
   *
   */
  constructor(iframeHub, CrossStorageClientClass = CrossStorageClient) {
    assert(iframeHub, 'Missing `iframeHub`');
    this._iframeHub = iframeHub;
    this._CrossStorageClientClass = CrossStorageClientClass;
    this._instance = new CrossStorageClient(this._iframeHub);
    console.log('StorageClient: CrossStorageClientClass', CrossStorageClientClass);
    console.log('StorageClient: this._instance', this._instance);
  }

  /**
   * Wrapper of CrossStorageClient.onConnect();
   * CrossStorageClient injects an iframe in the DOM, so we need
   * to ensure that the insertion happens ONLY when an event is triggered
   *
   * @private
   * @return {Promise}
   */
  onConnect() {
    console.log('onConnect 1');
    if (!this._instance) {
      this._instance = new this._CrossStorageClientClass(this._iframeHub);
      console.log('onConnect 2');
      console.log(this._instance);
    }
    console.log('onConnect 3');
    return this._instance.onConnect();
  }

  /**
   * Wrapper of CrossStorageClient.get();
   *
   * @param {Arguments} rest
   * @return {Promise}
   */
  get(...rest) {
    return this.onConnect().then(() => this._instance.get(...rest));
  }

  /**
   * Wrapper of CrossStorageClient.set();
   *
   * @param {Arguments} rest
   * @return {Promise}
   */
  set(...rest) {
    return this.onConnect().then(() => this._instance.set(...rest));
  }

  /**
   * Wrapper of CrossStorageClient.del();
   *
   * @param {Arguments} rest
   * @return {Promise}
   */
  del(...rest) {
    return this.onConnect().then(() => this._instance.del(...rest));
  }


}

module.exports = StorageClient;
