'use strict';
const assert = require('assert');
const fetch = require('node-fetch');
const Client = require('./client');
const Promise = require('es6-promise').Promise;

/**
 * @module Consumer
 */

class Consumer {

  /**
   * Initializes Consumer
   * @constructor
   * @param {Client} client - The client to use
   * @param {String} endpoint - The Consumer endpoint
   * @param {String} login_url - The login page URL
   */
  constructor(client, endpoint, login_url) {
    assert(client instanceof Client, 'Missing `client`');
    assert(endpoint, 'Missing `endpoint`');
    assert(login_url, 'Missing `login_url`');
    this._client = client;
    this._endpoint = endpoint;
    this._login_url = login_url;
  }

  /**
   * Returns Client id
   * @returns {String} id
   */
  get endpoint() {
    return this._endpoint;
  }

  /**
   * Returns Client id
   * @returns {String} id
   */
  get login_url() {
    return this._login_url;
  }

  /**
   * Retrieves token from Consumer
   * @param {String} username - The username to use
   * @param {String} password - The password to use
   * @returns {Promise} promise
   */
  retrieveToken(username, password) {
    return new Promise((resolve, reject) => {
      fetch(this._endpoint + '/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body: {
          grant_type: 'password',
          client_id:  this._client.id,
          client_secret: this._client.secret,
          username: username,
          password: password
        }
      })
      .then(res => resolve({
        access_token: res.access_token,
        refresh_token: res.refresh_token,
      }))
      .catch(err => {
        let message = err && err.hasOwnProperty('error')? err.error: 'Unexpected error';
        reject(new Error(message));
      })
    });
  }

}
module.exports = Consumer;
