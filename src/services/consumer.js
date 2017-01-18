'use strict';
const assert = require('assert');
const Client = require('../models/client');
const Promise = require('es6-promise').Promise;
const ProductionAPI = require('../api').Production;
const SandboxAPI = require('../api').Sandbox;
const extractErrorMessage = require('../utils').extractErrorMessage;

/**
 * @class Consumer
 */
class Consumer {

  /**
   * Initializes Consumer
   *
   * @constructor
   * @param {Client} client - The Client instance to use
   * @param {API.Production|API.Sandbox} api - The api to use for fetching data
   * @return {Consumer}
   *
   */
  constructor(client, api) {
    assert(client instanceof Client, '`client` should be instance of Client');
    assert(api instanceof ProductionAPI || api instanceof SandboxAPI, '`api` should be instance of API.Production or API.Sandbox');
    this._client = client;
    this._api = api;
  }

  /**
   * Returns data from API
   *
   * @private
   * @param {String} resource - The resource to fetch from
   * @param {Object} payload - The payload to pass
   * @return {Promise}
   *
   */
  _request(resource, payload){
    return this._api.invoke(resource, payload).then(res => {
      const { status, body } = res;
      if (parseInt(status) >= 400) {
        return Promise.reject(new Error(extractErrorMessage(body.error)));
      }
      return Promise.resolve(body);
    });
  }

  /**
   * Retrieves token from a username-password combination
   *
   * @param {String} username - The username to use
   * @param {String} password - The password to use
   * @return {Promise}
   *
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
   *
   * @param {String} refresh_token - The refresh token to use
   * @return {Promise}
   *
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
   *
   * @param {String} email - The email to use
   * @param {String} firstName - The first name to use
   * @param {String} lastName - The last name to use
   * @param {String} password - The password to use
   * @return {Promise}
   *
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
   *
   * @param {String} token - The `Bearer` token
   * @return {Promise}
   *
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
   *
   * @param {String} userId - The User id
   * @param {String} bearer - The `Bearer` token
   * @param {String} options.email - The email to use
   * @param {String} options.firstName - The first ame to use
   * @param {String} options.lastName - The last name to use
   * @return {Promise}
   *
   */
  updateUser(userId, bearer, options) {
    return this._request('users/' + userId, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + bearer,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        first_name: options.firstName,
        last_name: options.lastName
      }
    });
  }

  /**
   * Requests for a password reset
   *
   * @param {String} email - The email to forward the reset token to
   * @return {Promise}
   *
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
   *
   * @param {String} token - The reset token to use
   * @param {String} password - The new password
   * @return {Promise}
   *
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
