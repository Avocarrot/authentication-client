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
  * User id (read-only)
   * @returns {String}
   */
  get id() {
    return this._id;
  }

  /**
   * User publisherId (read-only)
   * @returns {String}
   */
  get publisherId() {
    return this._publisherId;
  }

  /**
   * User email (read/write)
   * @returns {String}
   */
  get email() {
    return this._email;
  }
  set email(newEmail) {
    if (newEmail){
      this._email = newEmail;
    }
  }

  /**
   * User first name (read/write)
   * @returns {String}
   */
  get firstName() {
    return this._firstName;
  }
  set firstName(newFirstName) {
    if (newFirstName){
      this._firstName = newFirstName;
    }
  }

  /**
   * User last name (read/write)
   * @returns {String}
   */
  get lastName() {
    return this._lastName;
  }
  set lastName(newLastName) {
    if (newLastName){
      this._lastName = newLastName;
    }
  }

  /**
   * Bearer token (read/write)
   * @returns {String}
   */
  get bearer() {
    return this._store.get('access_token')
  }
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
      firstName: this._firstName,
      lastName: this._lastName
    });
  }

  /**
   * Creates a new User
   * @param {String} email - The email to set
   * @param {String} firstName - The first name to set
   * @param {String} lastName - The last name to set
   * @param {String} password - The password to set
   * @returns {Promise}
   */
  create(email, password, firstName, lastName) {
    assert(email, 'Missing `email`');
    assert(password, 'Missing `password`');
    return this._consumer.createUser({
      email,
      password,
      firstName,
      lastName
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
   * @returns {Promise}
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
