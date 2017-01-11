'use strict';
const assert = require('assert');
const NodeFetch = require('node-fetch');
const Client = require('./client');
const Promise = require('es6-promise').Promise;

/**
 * @class Consumer
 */
class Consumer {

  /**
   * Initializes Consumer
   * @constructor
   * @param {Client} client - The Client instance to use
   * @param {String} endpoint - The host endpoint
   * @param {String} login_url - The login page URL
   * @param {String} api - The api to use for fetching data - Defaults to `NodeFetch`
   */
  constructor(client, endpoint, login_url, api) {
    assert(client instanceof Client, 'Missing `client`');
    assert(endpoint, 'Missing `endpoint`');
    assert(login_url, 'Missing `login_url`');
    this._client = client;
    this._endpoint = endpoint;
    this._login_url = login_url;
    this._api = api || NodeFetch;
  }

  /**
   * Returns data from API
   * @private
   * @param {String} resource - The resource to fetch from
   * @param {Object} options - The options to pass
   * @returns {Promise}
   */
  _request(resource, options){
    options = options || {};
    return this._api(this._endpoint + '/'  + resource, {
      method: options.method,
      headers: options.headers,
      body: Object.assign(options.body || {}, {
        client_id: this._client.id,
        client_secret: this._client.secret
      })
    }).catch(err => Promise.reject(new Error(err && err.hasOwnProperty('error')? err.error: 'Unexpected error')));
  }

  /**
   * Returns endpoint
   * @returns {String}
   */
  get endpoint() {
    return this._endpoint;
  }

  /**
   * Returns the login_url
   * @returns {String}
   */
  get login_url() {
    return this._login_url;
  }

  /**
   * Retrieves token from a username-password combination
   * @param {String} username - The username to use
   * @param {String} password - The password to use
   * @returns {Promise}
   */
  retrieveToken(username, password) {
    return this._request('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: {
        grant_type: 'password',
        username,
        password
      }
    });
  }

  /**
   * Returns a renewed token
   * @param {String} refresh_token - The refresh token to use
   * @returns {Promise}
   */
  refreshToken(refresh_token) {
    return this._request('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: {
        grant_type: 'refresh_token',
        refresh_token
      }
    });
  }

  /**
   * Creates a new User
   * @param {String} email - The email to use
   * @param {String} first_name - The first_name to use
   * @param {String} last_name - The last_name to use
   * @param {String} password - The password to use
   * @returns {Promise}
   */
  createUser(email, first_name, last_name, password) {
    return this._request('users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        email,
        first_name,
        last_name,
        password
      }
    });
  }


}

module.exports = Consumer;
