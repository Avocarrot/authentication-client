const Utils = require('../utils');

const generateRandomString = Utils.generateRandomString;
const generateRandomUUID = Utils.generateRandomUUID;

/**
 * @class SandboxDatabase
 */
class SandboxDatabase {

  /**
   * Initializes SandboxAPI
   *
   * @constructor
   * @param {JSON} users - The initial user fixtures
   * @param {JSON} tokens - The initial token fixtures
   * @return SandboxDatabase
   *
   */
  constructor(users, tokens) {
    this._users = [...users];
    this._tokens = [...tokens];
  }

  /**
   * Returns users
   *
   * @return {Array}
   *
   */
  get users() {
    return this._users;
  }

  /**
   * Returns tokens
   *
   * @return {Array}
   *
   */
  get tokens() {
    return this._tokens;
  }

  /**
   * Extracts `public` user data
   *
   * @private
   * @return {Object}
   *
  */
  _extractUser(data) {
    return {
      id: data.id,
      publisher_id: data.publisher_id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
    };
  }

  /**
   * Extracts `public` token data
   *
   * @private
   * @return {Object}
   *
  */
  _extractToken(data) {
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  }

  /**
   * Determines if database has a specific token based on refresh_token
   *
   * @param {String} refreshToken - The refresh token to lookup
   * @return {Boolean}
   *
   */
  hasTokenWithRefresh(refreshToken) {
    return !!~this._tokens.findIndex(token => token.refresh_token === refreshToken);
  }

  /**
   * Determines if database has a specific user based on data
   *
   * @param {String} email - The email to lookup
   * @param {String} password - The password to lookup
   * @return {Boolean}
   *
   */
  hasUserWithData(email, password) {
    return !!~this._users.findIndex(user => user.email === email && user.password === password);
  }

  /**
   * Determines if database has a specific user based on token
   *
   * @param {String} accessToken - The token to lookup
   * @return {Boolean}
   *
   */
  hasUserWithToken(accessToken) {
    return !!~this._tokens.findIndex(token => token.access_token === accessToken);
  }

  /**
   * Returns token for a user
   *
   * @param {String} userId - The user id to lookup
   * @return {Object}
   *
   */
  getTokenFor(userId) {
    return this._tokens.find(token => token.user_id === userId);
  }

  /**
   * Determines if database has a specific user based on email
   *
   * @param {String} email - The email to lookup
   * @return {Boolean}
   *
   */
  hasUserWithEmail(email) {
    return !!~this._users.findIndex(user => user.email === email);
  }

  /**
   * Returns user from fixtures based on data
   *
   * @param {String} email - The target user email
   * @param {String} password - The target user password
   * @return {Boolean}
   *
   */
  getUserWithData(email, password) {
    return this._extractUser(this._users.find(user => (user.email === email && user.password === password)));
  }

  /**
   *
   * Returns user from fixtures based on `id`
   * @param {String} id - The user id to lookup
   * @return {Object} The found user data
   *
   */
  getUserWithId(id) {
    return this._extractUser(this._users.find(user => user.id === id));
  }

  /**
   * Returns user from fixtures based on token
   *
   * @param {String} accessToken - The token to lookup
   * @return {Object} The found `access_token` and `refresh_token`
   *
   */
  getUserWithToken(accessToken) {
    const userId = this._tokens.find(token => token.access_token === accessToken).user_id;
    return this.getUserWithId(userId);
  }

  /**
   * Adds user to fixtures
   *
   * @param {String} email - The email to set
   * @param {String} password - The password to set
   * @param {String} firstName - The firstName to set - Optional
   * @param {String} lastName - The lastName to set - Optional
   * @return {Object} The user data merged into an object
   *
   */
  addUser(email, password, firstName, lastName) {
    const userId = generateRandomUUID();
    const publisherId = generateRandomUUID();
    const accessToken = generateRandomString();
    const refreshToken = generateRandomString();
    const newToken = {
      user_id: userId,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    const newUser = {
      id: userId,
      publisher_id: publisherId,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    };
    // Store new records
    this._tokens.push(newToken);
    this._users.push(newUser);
    // Return public user data
    return this._extractUser(newUser);
  }

  /**
   * Updates user
   *
   * @param {String} id - The user id to lookup
   * @param {String} firstName - The firstName to update
   * @param {String} lastName - The lastName to update
   * @return {Object} The user data merged into an object
   *
   */
  updateUser(id, firstName, lastName) {
    const user = this._users.find(record => record.id === id);
    if (typeof firstName !== 'undefined') {
      user.first_name = firstName;
    }
    if (typeof lastName !== 'undefined') {
      user.last_name = lastName;
    }
    // Return public user data
    return this._extractUser(user);
  }

  /**
   * Updates token
   *
   * @param {String} refreshToken - The refreshToken to use
   * @return {Object} The found `access_token` and `refresh_token`
   *
   */
  updateToken(refreshToken) {
    const token = this._tokens.find(record => record.refresh_token === refreshToken);
    token.access_token = generateRandomString();
    token.refresh_token = generateRandomString();
    // Return public user data
    return this._extractToken(token);
  }

}

module.exports = SandboxDatabase;
