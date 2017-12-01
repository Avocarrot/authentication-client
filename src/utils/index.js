const bowser = require('bowser');

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
 * @private
 * @memberof Utils
 * @param {String} body - The `body` response to parse
 * @param {String} body.error - The error code to use for mapping
 * @param {String} body.error_description - The optional error description to show
 * @return {String}
 *
 */
const extractErrorMessage = (body) => {
  switch (body.error) {
    case 'validation_failed':
      return `Validation failed: ${body.error_description}`;
    case 'not_found':
      return 'Not found';
    case 'forbidden_resource':
      return 'Forbidden resource';
    case 'access_denied':
      return 'The resource owner or authorization server denied the request';
    case 'unsupported_grant_type':
      return 'The authorization grant type is not supported';
    case 'invalid_grant':
      return 'Invalid credentials';
    case 'unauthorized_request':
      return 'Unauthorized request';
    case 'unauthorized_client':
      return 'The authenticated client is not authorized';
    case 'invalid_token':
      return 'The access token provided is expired, revoked, malformed, or invalid';
    case 'invalid_scope':
      return 'The requested scope is invalid, unknown, or malformed';
    case 'invalid_client':
      return 'Client authentication failed';
    case 'invalid_request':
      return 'The request is missing a required parameter';
    default:
      return 'Unexpected error';
  }
};

module.exports.extractErrorMessage = extractErrorMessage;

/**
 * Transforms errors to JSONAPI format
 * @memberof Utils
 * @param {String} body - The body of the response
 * @params {String} status - Response http status
 * @return {Object} JSONAPI formatted error object
 */
const transformError = (body, status = 500) => {
  if (body.meta) {
    return {
      meta: {
        httpStatus: parseInt(status, 10),
        logref: body.meta.logref || 'unknown_error',
        message: body.meta.message || 'Unexpected error',
      },
    };
  }
  return {
    meta: {
      httpStatus: parseInt(status, 10),
      logref: body.error || 'unknown_error',
      message: extractErrorMessage(body),
    },
  };
};

module.exports.transformError = transformError;

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
  return {
    isValid: true,
  };
};

module.exports.validatePassword = validatePassword;

/**
 * Extracts loginToken from URL
 *
 * @memberof Utils
 * @return {String} url - The URL to
 *
 */
const extractLoginTokenFromURL = (url) => {
  try {
    const params = decodeURIComponent(url).split('?')[1].split('&');
    return params.find(param => String(param).includes('loginToken')).replace('loginToken=', '');
  } catch (err) {
    return '';
  }
};

module.exports.extractLoginTokenFromURL = extractLoginTokenFromURL;

/**
 * Returns browser name
 *
 * @memberof Utils
 * @return {String} name - The browser name
 *
 */
const retrieveBrowserName = ((lookupMap = bowser) => lookupMap.name);

module.exports.retrieveBrowserName = retrieveBrowserName;

/* istanbul ignore next */

/**
 * Wrapper around window.location.assign()
 *
 * @memberof Utils
 * @param {String} url - The url to redirect to
 * @return {Void}
 *
 */
const redirectToURL = (url) => {
  window.location.assign(url);
};

module.exports.redirectToURL = redirectToURL;

/* istanbul ignore next */

/**
 * Wrapper around window.location.href
 *
 * @memberof Utils
 * @return {String}
 *
 */
const retrieveURL = () => window.location.href;

module.exports.retrieveURL = retrieveURL;
