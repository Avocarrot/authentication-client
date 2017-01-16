'use strict';
const NodeFetch = require('node-fetch');

/**
 * @class API.Production
 */
class ProductionAPI {

  /**
   * Initializes API.Production
   * @constructor
   * @param {String} endpoint - The host endpoint
   * @param {Client} _fetcher - The function to use for fetching the data - Defaults to `NodeFetch`
   */
  constructor(endpoint, _fetcher) {
    this._endpoint = endpoint;
    this._fetcher = _fetcher || NodeFetch;
  }

  /**
   * Propagates invoke call to API _fetcher
   * @param {String} resource - The resource to fetch from
   * @param {Object} payload - The payload to pass
   * @returns {Promise}
   */
  invoke(resource, payload) {
    return this._fetcher(`${this._endpoint}/${resource}`, payload);
  }
}

module.exports = ProductionAPI;
