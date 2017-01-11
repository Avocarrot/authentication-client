'use strict';
const assert = require('assert');

/**
 * @class User
 */
class User {

  /**
   * Initializes User
   * @constructor
   * @param {String} options.id - The User id
   * @param {String} options.publisher_id - The id linking the User to a Publisher
   * @param {String} options.first_name - The User first name
   * @param {String} options.last_name - The User last name
   * @param {String} options.email - The User email
   */
  constructor(options) {
    options = options || {};
    assert(options.id, 'Missing `id`');
    assert(options.publisher_id, 'Missing `publisher_id`');
    this._id = options.id;
    this._publisher_id = options.publisher_id;
    this._first_name = options.first_name;
    this._last_name = options.last_name;
    this._email = options.email;
  }

  /**
   * Returns User id
   * @returns {String}
   */
  get id() {
    return this._id;
  }

  /**
   * Returns User publisher_id
   * @returns {String}
   */
  get publisher_id() {
    return this._publisher_id;
  }

  /**
   * Returns User email
   * @returns {String}
   */
  get email() {
    return this._email;
  }

  /**
   * Returns User first_name
   * @returns {String}
   */
  get first_name() {
    return this._first_name;
  }

  /**
   * Returns User last_name
   * @returns {String}
   */
  get last_name() {
    return this._last_name;
  }

  /**
   * Sets User email
   * @param {String} newEmail - The new email
   */
  set email(newEmail) {
    if (!newEmail){
      this._email = newEmail;
    }
  }

  /**
   * Sets User email
   * @param {String} firstName - The new first name
   */
  set firstName(newFirstName) {
    if (!newFirstName){
      this._first_name = newFirstName;
    }
  }

  /**
   * Sets User last_name
   * @param {String} newLastName - The new last name
   */
  set last_name(newLastName) {
    if (!newLastName){
      this._last_name = newLastName;
    }
  }


  /**
   * Synchronizes User model with API
   * @returns {Promise}
   */
   save() {

   }


}
module.exports = User;
