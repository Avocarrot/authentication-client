'use strict';
const assert = require('assert');
const Consumer = require('./consumer');
const Store = require('./store');

/**
 * @class Authenticator
 */
class Authenticator {

  /**
   * Initializes Authenticator
   * @constructor
   * @param {Store} store - The Store instance to use
   * @param {Consumer} consumer - The Consumer instance to use
   */
  constructor(store, consumer) {
    assert(store instanceof Store, 'Missing `store` configuration for Authenticator');
    assert(consumer instanceof Consumer, 'Missing `consumer` configuration for Authenticator');
    this.store = store;
    this.consumer = consumer;
  }
  /**
   * Retrieves authentication tokens for a username-password combination
   * @param {String} username - The username to use
   * @param {String} password - The password to use
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
