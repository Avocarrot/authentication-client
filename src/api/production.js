'use strict';

/**
 * @class Production API
 */
class ProductionAPI {

  /**
   * Initializes ProductionAPI
   * @constructor
   * @param {String} endpoint - The host endpoint
   * @param {Object} fetcher - The function to use for fetching the data
   */
  constructor(endpoint, fetcher) {
    this._endpoint = endpoint;
    this._fetcher = fetcher;
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
