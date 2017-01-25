/**
 * @namespace Utils
 */
/**
 * Generates a random string
 *
 * @memberof Utils
 * @param {Number} radix - The radix to use. Defaults to `18`
 * @return {String}
 *
 */
function generateRandomString() {
  return Math.random().toString(18).slice(2);
}

module.exports.generateRandomString = generateRandomString;

/**
 * Generates a random UUID
 *
 * @memberof Utils
 * @return {String}
 *
 */
function generateRandomUUID() {
  const base = `${generateRandomString()}${generateRandomString()}`;
  return `${base.substring(0, 8)}-${base.substring(9, 13)}-${base.substring(14, 18)}-${base.substring(19, 23)}-${base.substring(24, 36)}`;
}

module.exports.generateRandomUUID = generateRandomUUID;

/**
 * Strips Bearer from Authorization header
 *
 * @memberof Utils
 * @param {String} header - The Authorization header to strip
 * @return {String}
 *
 */
function stripBearer(header) {
  return `${header}`.replace('Bearer', '').trim();
}

module.exports.stripBearer = stripBearer;

/**
 * Returns error message for `errorCode`
 *
 * @memberof Utils
 * @param {String} errorCode - The `errorCode` to map
 * @return {String}
 *
 */
const extractErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'user_exists':
      return 'User already exists';
    case 'user_not_found':
      return 'User not found';
    case 'invalid_email':
      return 'Could not find an account for this email';
    case 'invalid_credentials':
      return 'Invalid email or password';
    case 'invalid_password':
      return 'You have entered an invalid password';
    case 'invalid_client':
      return 'Client authentication failed';
    case 'invalid_grant':
      return 'The provided authorization token is invalid';
    case 'invalid_request':
      return 'The request is missing a required parameter';
    default:
      return 'Unexpected error';
  }
};

module.exports.extractErrorMessage = extractErrorMessage;

/**
 * Validates a password pair agains the following rules:
 * - Password cannot contain spaces
 * - Password must contain both numbers and characters
 * - Password must be at least 8 characters long
 *
 * @memberof Utils
 * @param {String} password - The `password` to validate
 * @return {Object} Contains `isValid {Boolean}` and `message {String}`
 *
 */
const validatePassword = (password) => {
  const containsSpaces = /\s/i.test(password);
  const containsNumber = /\d/i.test(password);
  const containsCharacters = /[a-z]/i.test(password);
  if (containsSpaces) {
    return {
      message: 'Password cannot contain spaces',
      isValid: false,
    };
  }
  if (!containsNumber || !containsCharacters) {
    return {
      message: 'Password must contain both numbers and characters',
      isValid: false,
    };
  }
  if (password.length < 8) {
    return {
      message: 'Password must be at least 8 characters long',
      isValid: false,
    };
  }
  return { isValid: true };
};

module.exports.validatePassword = validatePassword;

/* istanbul ignore next */

/**
 * Wrapper around window.replace()
 *
 * @memberof Utils
 * @param {String} url - The url to redirect to
 * @return {Void}
 *
 */
const URLRedirect = (url) => {
  window.location.replace(url);
};

module.exports.URLRedirect = URLRedirect;
