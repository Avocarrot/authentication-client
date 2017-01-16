'use strict';
const assert = require('assert');
const Client = require('../models/client');
const Promise = require('es6-promise').Promise;
const ProductionAPI = require('../api').Production;
const SandboxAPI = require('../api').Sandbox;

/**
 * @class Consumer
 */
class Consumer {

  /**
   * Initializes Consumer
   * @constructor
   * @param {Client} client - The Client instance to use
   * @param {API.Production|API.Sandbox} api - The api to use for fetching data
   */
  constructor(client, api) {
    assert(client instanceof Client, 'Missing `client`');
    assert(api instanceof ProductionAPI || api instanceof SandboxAPI, 'Missing `api`');
    this._client = client;
    this._api = api;
  }

  /**
   * Returns data from API
   * @private
   * @param {String} resource - The resource to fetch from
   * @param {Object} payload - The payload to pass
   * @returns {Promise}
   */
  _request(resource, payload){
    return this._api.invoke(resource, payload).catch(err => {
      return Promise.reject(new Error(err && err.hasOwnProperty('error')? err.error: 'Unexpected error'))
    });
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
        username,
        password,
        grant_type: 'password',
        client_id: this._client.id,
        client_secret: this._client.secret
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
        refresh_token,
        grant_type: 'refresh_token',
        client_id: this._client.id,
        client_secret: this._client.secret
      }
    });
  }

  /**
   * Creates a new User
   * @param {String} email - The email to use
   * @param {String} firstName - The first name to use
   * @param {String} lastName - The last name to use
   * @param {String} password - The password to use
   * @returns {Promise}
   */
  createUser(email, firstName, lastName, password) {
    return this._request('users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }
    });
  }

  /**
   * Retrives a User
   * @param {String} token - The `Bearer` token
   * @returns {Promise}
   */
  retrieveUser(token) {
    return this._request('users/me', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }

  /**
   * Updates a User
   * @param {String} userId - The User id
   * @param {String} bearer - The `Bearer` token
   * @param {String} options.email - The email to use
   * @param {String} options.firstName - The first ame to use
   * @param {String} options.lastName - The last name to use
   * @returns {Promise}
   */
  updateUser(userId, bearer, options) {
    return this._request('users/' + userId, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + bearer,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        email: options.email,
        first_name: options.firstName,
        last_name: options.lastName
      }
    });
  }

  /**
   * Requests for a password reset
   * @param {String} email - The email to forward the reset token to
   * @returns {Promise}
   */
  requestPasswordReset(email) {
    return this._request('passwords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        email
      }
    });
  }

  /**
   * Resets password
   * @param {String} token - The reset token to use
   * @param {String} password - The new password
   * @returns {Promise}
   */
  resetPassword(token, password) {
    return this._request('passwords/' + token, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        password
      }
    });
  }

}

module.exports = Consumer;
