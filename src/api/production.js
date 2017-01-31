/**
 * @class Production API
 */
class ProductionAPI {

  /**
   * Initializes ProductionAPI
   *
   * @constructor
   * @param {String} endpoint - The host endpoint
   * @param {Object} fetchFn - The function to use for fetching the data - Defaults to window.fetch
   * @return {ProductionAPI}
   */
  constructor(endpoint, fetchFn = (...args) => window.fetch(...args)) {
    this._endpoint = endpoint;
    this._fetchFn = fetchFn;
  }

  /**
   *
   * Propagates invoke call to _fetchFn
   * @param {String} resource - The resource to fetch from
   * @param {Object} payload - The payload to pass
   * @return {Promise}
   *
   */
  invoke(resource, payload) {
    let status = 0;
    return this._fetchFn(`${this._endpoint}/${resource}`, payload).then((res) => {
      status = res.status;
      if (status !== 204) {
        return res.json();
      }
      return Promise.resolve({});
    }).then(body => ({ body, status }));
  }
}

module.exports = ProductionAPI;
