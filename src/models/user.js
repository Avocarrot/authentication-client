const assert = require('assert');
const Consumer = require('../services/consumer');
const Store = require('../services/store');
const validatePassword = require('../utils').validatePassword;

/**
 * @class User
 */
class User {

  /**
   * Initializes User
   *
   * @constructor
   * @param {Store} store - The Store instance to use
   * @param {Consumer} consumer - The Consumer instance to use
   * @return {User}
   *
   */
  constructor(store, consumer) {
    assert(store instanceof Store, '`store` should be instance of Store');
    assert(consumer instanceof Consumer, '`consumer` should be instance of Consumer');
    this._store = store;
    this._consumer = consumer;
    this._bearer = undefined;
    this._id = undefined;
    this._publisherId = undefined;
    this._firstName = undefined;
    this._lastName = undefined;
    this._email = undefined;
    this._isDirty = false;
  }

  /**
   * Returns User id
   *
   * @return {String} [read-only] id
   *
   */
  get id() {
    return this._id;
  }

  /**
   * Returns User publisherId
   *
   * @return {String} [read-only] publisherId
   *
   */
  get publisherId() {
    return this._publisherId;
  }

  /**
   * Returns User email
   *
   * @return {String} [read-only] email
   *
   */
  get email() {
    return this._email;
  }

  /**
   * Returns User bearer token
   *
   * @return {String} [read-write] bearer token
   *
   */
  get bearer() {
    return this._bearer;
  }

  /**
   * Returns User first Name
   *
   * @return {String} [read-write] first Name
   *
   */
  get firstName() {
    return this._firstName;
  }
  set firstName(newFirstName) {
    if (newFirstName) {
      this._isDirty = true;
      this._firstName = newFirstName;
    }
  }

  /**
   * Returns User last name
   *
   * @return {String} [read-write] last name
   *
   */
  get lastName() {
    return this._lastName;
  }
  set lastName(newLastName) {
    if (newLastName) {
      this._isDirty = true;
      this._lastName = newLastName;
    }
  }

  /**
   * Syncr User data from Store
   * - Currently on bearer is synced to Store
   * - Store priority proceeds dirty data
   *
   * @return {Promise}
   *
   */
  syncWithStore() {
    let bearer;
    return this._store.get('access_token').then((accessToken) => {
      // Cache bearer
      bearer = accessToken;
      return this._consumer.retrieveUser(accessToken);
    }).then((data) => {
      this._id = data.id;
      this._publisherId = data.publisher_id;
      this._email = data.email;
      this._firstName = data.first_name;
      this._lastName = data.last_name;
      this._bearer = bearer;
      this._isDirty = false;
      return Promise.resolve({
        data,
        message: 'Synced User model with Store',
      });
    });
  }

  /**
   * Updates User data
   *
   * @return {Promise}
   *
   */
  save() {
    if (!this._id) {
      return Promise.reject(new Error('Cannot save a non-existent User'));
    }
    if (!this._isDirty) {
      return Promise.resolve({
        message: 'No User model changes to sync',
      });
    }
    return this._consumer.updateUser(this._id, this._bearer, {
      firstName: this._firstName,
      lastName: this._lastName,
    }).then(() => {
      this._isDirty = false;
      return Promise.resolve({
        message: 'Updated User model',
      });
    });
  }

  /**
   * Creates a new User
   *
   * @param {String} email - The email to set
   * @param {String} password - The password to set
   * @param {String} firstName - The first name to set
   * @param {String} lastName - The last name to set
   * @return {Promise}
   *
   */
  create(email, password, firstName, lastName) {
    assert(email, 'Missing `email`');
    assert(password, 'Missing `password`');
    const { isValid, message } = validatePassword(password);
    if (!isValid) {
      return Promise.reject(new Error(message));
    }
    return this._consumer.createUser(email, password, firstName, lastName).then((data) => {
      this._id = data.id;
      this._publisherId = data.publisher_id;
      this._firstName = data.first_name;
      this._lastName = data.last_name;
      this._email = data.email;
      this._isDirty = false;
      return Promise.resolve({
        data,
        message: 'Created User',
      });
    });
  }

  /**
   * Retrieves authentication tokens for a username-password combination
   *
   * @param {String} username - The username to use
   * @param {String} password - The password to use
   * @return {Promise}
   *
   */
  authenticate(username, password) {
    assert(username, 'Missing `username`');
    assert(password, 'Missing `password`');
    let bearer;
    return this._consumer.retrieveToken(username, password).then((res) => {
      const { access_token, refresh_token } = res;
      // Cache bearer
      bearer = access_token;
      // Store tokens
      return this._store.set('access_token', access_token)
        .then(() => this._store.set('refresh_token', refresh_token))
        .then(() => this._consumer.retrieveUser(access_token));
      // Retrieve user data
    }).then((data) => {
      this._bearer = bearer;
      this._id = data.id;
      this._publisherId = data.publisher_id;
      this._email = data.email;
      this._firstName = data.first_name;
      this._lastName = data.last_name;
      this._isDirty = false;
      return Promise.resolve({
        data,
        message: 'Authenticated User',
      });
    });
  }

  /**
   * Retrieves user for an access token.
   * Fallbacks to token refresh if refreshToken is defined
   *
   * @param {String} accessToken - The access token to use
   * @param {String} refreshToken - The refresh token to use (Optional)
   * @return {Promise}
   *
   */
  authenticateWithToken(accessToken, refreshToken) {
    assert(accessToken, 'Missing `accessToken`');
    // Store access token
    this._store.set('access_token', accessToken);
    // Store refresh token (or clear if undefined)
    if (refreshToken) {
      this._store.set('refresh_token', refreshToken);
    } else {
      this._store.remove('refresh_token');
    }
    return this._consumer.retrieveUser(accessToken).catch((err) => {
      if (!refreshToken || err.name !== 'invalid_token') {
        return Promise.reject(err);
      }
      // Try to refresh the tokens if the error is of `invalid_token`
      return this._consumer.refreshToken(refreshToken).then((newTokens) => {
        // Store new tokens
        this._store.set('access_token', newTokens.access_token);
        this._store.set('refresh_token', newTokens.refresh_token);
        // Retrieve user with new token
        return this._consumer.retrieveUser(newTokens.access_token);
      });
    }).then((data) => {
      this._bearer = accessToken;
      this._id = data.id;
      this._publisherId = data.publisher_id;
      this._email = data.email;
      this._firstName = data.first_name;
      this._lastName = data.last_name;
      this._isDirty = false;
      return Promise.resolve({
        data,
        message: 'Authenticated User',
      });
    });
  }

  /**
   * Flushes stored tokens for User (logout)
   *
   * @return {Promise}
   *
   */
  flush() {
    this._bearer = undefined;
    this._id = undefined;
    this._publisherId = undefined;
    this._firstName = undefined;
    this._lastName = undefined;
    this._email = undefined;
    this._isDirty = false;
    return this._store.remove('access_token', 'refresh_token').then(() => Promise.resolve({
      message: 'Flushed User data',
    }));
  }

}

module.exports = User;
