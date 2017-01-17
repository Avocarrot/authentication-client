'use strict';
/**
 * @namespace Utils
 */

/**
 * Strips Bearer from Authorization header
 * @memberof Utils
 * @param {String} header - The Authorization header to strip
 * @return {String}
 */
const stripBearer = (header) => {
  return header.replace('Bearer', '').trim();
}

module.exports.stripBearer = stripBearer;

/**
 * Generates a random string
 * @memberof Utils
 * @param {Number} radix - The radix to use. Defaults to `18`
 * @return {String}
 */
const generateRandomString = () => {
  return Math.random().toString(18).slice(2);
}

module.exports.generateRandomString = generateRandomString;

/**
 * Generates a random UUID
 * @memberof Utils
 * @return {String}
 */
const generateRandomUUID = () => {
  let base = `${generateRandomString()}${generateRandomString()}`;
  return `${base.substring(0,8)}-${base.substring(9,13)}-${base.substring(14,18)}-${base.substring(19,23)}-${base.substring(24,36)}`;
}

module.exports.generateRandomUUID = generateRandomUUID;
