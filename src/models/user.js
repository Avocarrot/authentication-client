'use strict';
const assert = require('assert');
const Consumer = require('../services/consumer');
const Store = require('../services/store');
const Promise = require('es6-promise').Promise;

/**
 * @class User
 */
class User {

  /**
   * Initializes User
   * @constructor
   * @param {Store} store - The Store instance to use
   * @param {Consumer} consumer - The Consumer instance to use
   */
  constructor(store, consumer) {
    assert(store instanceof Store, 'Missing `store`');
    assert(consumer instanceof Consumer, 'Missing `consumer`');
    this._store = store;
    this._consumer = consumer;
  }

  /**
   * Returns User id
   * @returns {String}
   */
  get id() {
    return this._id;
  }

  /**
   * Returns User publisherId
   * @returns {String}
   */
  get publisherId() {
    return this._publisherId;
  }

  /**
   * Returns User email
   * @returns {String}
   */
  get email() {
    return this._email;
  }

  /**
   * Returns User firstName
   * @returns {String}
   */
  get firstName() {
    return this._firstName;
  }

  /**
   * Returns User lastName
   * @returns {String}
   */
  get lastName() {
    return this._lastName;
  }

  /**
   * Returns User id
   * @returns {Object}
   */
  get bearer() {
    return this._store.get('access_token')
  }

  /**
   * Sets User email
   * @returns {String}
   */
  set email(newEmail) {
    if (newEmail){
      this._email = newEmail;
    }
  }

  /**
   * Sets User firstName
   * @returns {String}
   */
  set firstName(newFirstName) {
    if (newFirstName){
      this._firstName = newFirstName;
    }
  }

  /**
   * Sets User lastName
   * @returns {String}
   */
  set lastName(newLastName) {
    if (newLastName){
      this._lastName = newLastName;
    }
  }

  /**
   * Sets bearer
   * @param {String} options.accessToken - The authentication access token
   * @returns {String}
   */
  set bearer(accessToken) {
    if (accessToken) {
      this._store.set('access_token', accessToken);
    }
  }

  /**
   * Updates User details
   * @returns {Promise}
   */

  save() {
    if (!this.id){
      return Promise.reject(new Error('Cannot save a non-existent User'));
    }
    return this._consumer.updateUser(this.id, this.bearer, {
      email: this._email,
      first_name: this._firstName,
      last_name: this._lastName
    });
  }

  /**
   * Creates a new User
   * @param {String} email - The email to set
   * @param {String} first_name - The first_name to set
   * @param {String} last_name - The last_name to set
   * @param {String} password - The password to set
   * @returns {Promise}
   */
  create(email, password, firstName, lastName) {
    assert(email, 'Missing `email`');
    assert(password, 'Missing `password`');
    return this._consumer.createUser({
      email,
      password,
      first_name: firstName,
      last_name: lastName
    }).then(data => {
      this._id = data.id;
      this._publisherId = data.publisher_id;
      this._firstName = data.first_name;
      this._lastName = data.last_name;
      this._email = data.email;
    });
  }

  /**
   * Retrieves authentication tokens for a username-password combination
   * @param {String} username - The username to use
   * @param {String} password - The password to use
   */
  authenticate(username, password) {
    assert(username, 'Missing `username`');
    assert(password, 'Missing `password`');
    return this._consumer.retrieveToken(username, password).then(res => {
      this._store.set('access_token', res.access_token);
    })
  }
}
module.exports = User;
