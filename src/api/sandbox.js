'use strict';
const Utils = require('../utils');
const stripBearer = Utils.stripBearer;

/**
 * Generates an HTTP response object
 * @private
 * @return {Object}
 */
const response = (status = 200, body = {}) => {
  return Promise.resolve({
    status,
    body
  });
}

/**
 * @class Sandbox API
 */
class SandboxAPI {

  /**
   * Maps API resources to response objects
   * @private
   */
  static get resources() {
    return {
      /**
       * Maps `/users` resource
       */
      users: {
        GET: (database, id, body, headers) => {
          const token = stripBearer(headers.Authorization);
          if (!database.hasUserWithToken(token)){
            return response(404, {'error': 'user_not_found'});
          }
          return response(200, database.getUserWithToken(token));
        },
        POST: (database, id, body) => {
          const { email, password, first_name, last_name } = body;
          if (database.hasUserWithData(email, password)){
            return response(400, {'error': 'user_exists'});
          }
          const newUser = database.addUser(email, password, first_name, last_name);
          return response(201, newUser);
        },
        PATCH: (database, id, body, headers) => {
          const token = stripBearer(headers.Authorization);
          const { first_name, last_name } = body;
          if (database.getUserWithToken(token) !== database.getUserWithId(id)) {
            return response(400, {'error': 'invalid_grant'});
          }
          const patchedUser = database.updateUser(id, first_name, last_name);
          return response(200, patchedUser);
        }
      },
      /**
       * Maps `/token` resource
       * @see https://tools.ietf.org/html/rfc6749
       */
      token: {
        POST: (database, id, body) => {
          const { grant_type, username, password, refresh_token } = body;
          // Token retrieval
          if (grant_type === 'password') {
            if (!database.hasUserWithData(username, password)){
              return response(400, {'error': 'invalid_credentials'});
            }
            return response(200, database.getUserWithData(username, password));
          }
          // Token renewal
          if (grant_type === 'refresh_token') {
            if (!database.hasTokenWithRefresh(refresh_token)){
              return response(400, {'error': 'invalid_token'});
            }
            const refreshedToken = database.updateToken(refresh_token);
            return response(200, refreshedToken)
          }
        }
      },
      /**
       * Maps `/passwords` resource
       */
      passwords: {
        POST: (database, id, body) => {
          const { email } = body;
          if (!database.hasUserWithEmail(email)) {
            return response(400, {'error': 'invalid_email'});
          }
          return response();
        },
        PUT: () => {
          return response();
        }
      }
    }
  }

  /**
   * Initializes SandboxAPI
   * @constructor
   * @param {JSON} fixtures - The initial fixtures to register
   */
  constructor (database) {
    this._database = database;
  }

  /**
   * Stubs API calls
   * @param {String} resource - The resource to fetch from
   * @param {Object} payload - The body to pass
   * @returns {Promise}
   */
  invoke(resource, payload) {
    const [ route, id ] = resource.split('/');
    const { method, body, headers } = payload;
    return SandboxAPI.resources[route][method](this._database, id, body, headers);
  }

}

module.exports = SandboxAPI;
