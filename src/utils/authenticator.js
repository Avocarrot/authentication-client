'use strict';
const assert = require('assert');
const Consumer = require('./consumer');
const Store = require('./store');

/**
 * @module Authenticator
 */

class Authenticator {

  /**
   * Initializes Authenticator state
   * @constructor
   * @param {Store} store - The Store.js instance to use
   * @param {Consumer} consumer - The API consumer
   */
  constructor(store, consumer) {
    assert(store instanceof Store, 'Missing `store` configuration for Authenticator');
    assert(consumer instanceof Consumer, 'Missing `consumer` configuration for Authenticator');
    this.store = store;
    this.consumer = consumer;
  }
  /**
   * Retrieves an authentication token for a an username-password combination
   * @param {String} username - username value
   * @param {String} password - password value
   */
  authenticate(username, password) {
    assert(username, 'Missing `username`');
    assert(password, 'Missing `password`');
    return this.consumer.retrieveToken(username, password).then(res => {
      this.store.set('access_token', res.access_token);
      this.store.set('refresh_token', res.refresh_token);
    })
  }
}

module.exports = Authenticator;
