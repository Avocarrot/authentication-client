const Utils = require('../utils');
const qs = require('qs');

const stripBearer = Utils.stripBearer;

/**
 * Generates an HTTP response object
 *
 * @private
 * @return {Object}
 *
 */
const response = (status = 200, body = {}) => (Promise.resolve({
  status,
  body,
}));

/**
 * @class Sandbox API
 */
class SandboxAPI {

  /**
   * Maps API resources to response objects
   *
   * @private
   *
   */
  static get resources() {
    return {
      /**
       * Maps `/users` resource
       *
       * @private
       *
       */
      users: {
        GET: (database, id, body, headers) => {
          const token = stripBearer(headers.Authorization);
          if (!database.hasUserWithToken(token)) {
            return response(404, { error: 'not_found' });
          }
          return response(200, database.getUserWithToken(token));
        },
        POST: (database, id, body) => {
          const { email, password, first_name, last_name } = JSON.parse(body);
          if (database.hasUserWithData(email, password)) {
            return response(400, { error: 'validation_failed' });
          }
          const newUser = database.addUser(email, password, first_name, last_name);
          return response(201, newUser);
        },
        PATCH: (database, id, body, headers) => {
          const token = stripBearer(headers.Authorization);
          const { first_name, last_name } = JSON.parse(body);
          if (database.getUserWithToken(token) !== database.getUserWithId(id)) {
            return response(400, { error: 'invalid_grant' });
          }
          const patchedUser = database.updateUser(id, first_name, last_name);
          return response(200, patchedUser);
        },
      },
      /**
       * Maps `/token` resource
       *
       * @see https://tools.ietf.org/html/rfc6749
       * @private
       *
       */
      token: {
        POST: (database, id, body) => {
          const decodedBody = qs.parse(body);
          const { grant_type, username, password, refresh_token } = decodedBody;
          if (grant_type === 'password') {
            if (!database.hasUserWithData(username, password)) {
              return response(404, { error: 'not_found' });
            }
            const user = database.getUserWithData(username, password);
            return response(200, database.getTokenFor(user.id));
          }
          /* istanbul ignore if */
          if (grant_type === 'refresh_token') {
            if (!database.hasTokenWithRefresh(refresh_token)) {
              return response(400, { error: 'invalid_token' });
            }
            const refreshedToken = database.updateToken(refresh_token);
            return response(200, refreshedToken);
          }
          return response(404, { error: 'unexpected_error' });
        },
      },
      /**
       * Maps `/passwords` resource
       *
       * @private
       *
       */
      passwords: {
        POST: (database, id, body) => {
          const { email } = JSON.parse(body);
          if (!database.hasUserWithEmail(email)) {
            return response(404, { error: 'not_found' });
          }
          return response();
        },
        PUT: (database, id) => {
          if (!database.hasPasswordResetToken(id)) {
            return response(404, { error: 'not_found' });
          }
          return response();
        },
      },
    };
  }

  /**
   * Initializes SandboxAPI
   *
   * @constructor
   * @param {SandboxDatabase} database - The database to use for storing sesssion changes
   * @return {SandboxAPI}
   *
   */
  constructor(database) {
    this._database = database;
  }

  /**
   * Stubs API calls
   *
   * @param {String} resource - The resource to fetch from
   * @param {Object} payload - The paylod to propagate
   *
   * @return {Promise}
   */
  invoke(resource, payload) {
    const [route, id] = resource.split('/');
    const { method, body, headers } = payload;
    return SandboxAPI.resources[route][method](this._database, id, body, headers);
  }

}

module.exports = SandboxAPI;
