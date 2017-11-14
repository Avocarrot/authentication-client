const assert = require('assert');
const qs = require('qs');
const Client = require('../models/client');
const ProductionAPI = require('../api').Production;
const SandboxAPI = require('../api').Sandbox;

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
  _request(resource, payload) {
    return this._api.invoke(resource, payload).then((res) => {
      const { status, body } = res;
      if (parseInt(status, 10) >= 400) {
        return Promise.reject(body);
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
    const grant_type = 'password';
    return this._request('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this._formEncode({
        username,
        password,
        grant_type,
        client_id: this._client.id,
        client_secret: this._client.secret,
      }),
    });
  }

  /**
   * Returns a renewed token
   *
   * @param {String} refreshToken - The refresh token to use
   * @return {Promise}
   *
   */
  refreshToken(refreshToken) {
    const grant_type = 'refresh_token';
    return this._request('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this._formEncode({
        refresh_token: refreshToken,
        grant_type,
        client_id: this._client.id,
        client_secret: this._client.secret,
      }),
    });
  }

  /**
   * Returns a url encoded string
   *
   * @param {Object} obj - Object to stringify
   * @return {String}
   *
   */
  _formEncode(obj) {
    return qs.stringify(obj);
  }

  /**
   * Returns a json encoded string
   *
   * @param {Object} obj - Object to stringify
   * @return {String}
   *
   */
  _jsonEncode(obj) {
    return JSON.stringify(obj);
  }

  /**
   * Creates a new User
   *
   * @param {String} email - The email to use
   * @param {String} password - The password to use
   * @param {String} firstName - The first name to use
   * @param {String} lastName - The last name to use
   * @return {Promise}
   *
   */
  createUser(email, password, firstName, lastName) {
    return this._request('users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: this._jsonEncode({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
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
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
  }

  /**
   * Updates a User
   *
   * @param {String} userId - The User id
   * @param {String} token - The `Bearer` token
   * @param {String} options.firstName - The first ame to use
   * @param {String} options.lastName - The last name to use
   * @return {Promise}
   *
   */
  updateUser(userId, token, options) {
    return this._request(`users/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: this._jsonEncode({
        first_name: options.firstName,
        last_name: options.lastName,
      }),
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
        'Content-Type': 'application/json',
      },
      body: this._jsonEncode({
        email,
      }),
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
    return this._request(`passwords/${token}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: this._jsonEncode({
        password,
      }),
    });
  }

}

module.exports = Consumer;
