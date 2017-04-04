const test = require('tape');
const Utils = require('../../../src/utils');

const generateRandomString = Utils.generateRandomString;
const generateRandomUUID = Utils.generateRandomUUID;
const stripBearer = Utils.stripBearer;
const extractErrorMessage = Utils.extractErrorMessage;
const validatePassword = Utils.validatePassword;
const getBrowserName = Utils.getBrowserName;

/**
 * generateRandomString(radix)
 */

test('generateRandomString(radix) should generate distinct strings', (assert) => {
  assert.plan(1);
  assert.notEquals(generateRandomString(), generateRandomString());
});

/**
 * generateRandomUUID()
 */

test('generateRandomUUID() should generate', (t) => {
  t.test('a UUID with hyphens in the correct positions', (assert) => {
    assert.plan(5);
    const uuid = generateRandomUUID();
    assert.equals(uuid.length, 36);
    assert.equals(uuid.charAt(8), '-');
    assert.equals(uuid.charAt(13), '-');
    assert.equals(uuid.charAt(18), '-');
    assert.equals(uuid.charAt(23), '-');
  });
  t.test('distict UUIDs', (assert) => {
    assert.plan(1);
    assert.notEquals(generateRandomUUID(), generateRandomUUID());
  });
});

/**
 * stripBearer(header)
 */

test('stripBearer(header) should strip Bearer token from Authorization header', (assert) => {
  assert.plan(1);
  assert.equals(stripBearer('Bearer d4149324285e46bfb8065b6c816a12b2'), 'd4149324285e46bfb8065b6c816a12b2');
});

/**
 * extractErrorMessage(errorCode)
 */

test('extractErrorMessage(errorCode) should extract the correct messages', (assert) => {
  assert.plan(13);
  assert.equals(extractErrorMessage({
    error: 'validation_failed',
    error_description: 'custom message',
  }), 'Validation failed: custom message');
  assert.equals(extractErrorMessage({
    error: 'not_found',
  }), 'Not found');
  assert.equals(extractErrorMessage({
    error: 'forbidden_resource',
  }), 'Forbidden resource');
  assert.equals(extractErrorMessage({
    error: 'access_denied',
  }), 'The resource owner or authorization server denied the request');
  assert.equals(extractErrorMessage({
    error: 'unsupported_grant_type',
  }), 'The authorization grant type is not supported');
  assert.equals(extractErrorMessage({
    error: 'invalid_grant',
  }), 'Invalid credentials');
  assert.equals(extractErrorMessage({
    error: 'unauthorized_request',
  }), 'Unauthorized request');
  assert.equals(extractErrorMessage({
    error: 'unauthorized_client',
  }), 'The authenticated client is not authorized');
  assert.equals(extractErrorMessage({
    error: 'invalid_token',
  }), 'The access token provided is expired, revoked, malformed, or invalid');
  assert.equals(extractErrorMessage({
    error: 'invalid_scope',
  }), 'The requested scope is invalid, unknown, or malformed');
  assert.equals(extractErrorMessage({
    error: 'invalid_client',
  }), 'Client authentication failed');
  assert.equals(extractErrorMessage({
    error: 'invalid_request',
  }), 'The request is missing a required parameter');
  assert.equals(extractErrorMessage({
    error: 'error',
  }), 'Unexpected error');
});

/**
 * validatePassword(password, repeatPassword)
 */

test('validatePassword(password, repeatPassword) should', (t) => {
  t.test('accept valid passwords', (assert) => {
    assert.plan(2);
    assert.deepEquals(validatePassword('abcde123456', 'abcde123456'), { isValid: true });
    assert.deepEquals(validatePassword('ABCDE123456', 'ABCDE123456'), { isValid: true });
  });

  t.test('reject invalid passwords', (assert) => {
    assert.plan(4);
    assert.deepEquals(validatePassword('abc123', 'abc123'), {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    });
    assert.deepEquals(validatePassword('abcde 12345', 'abcde 12345'), {
      isValid: false,
      message: 'Password cannot contain spaces',
    });
    assert.deepEquals(validatePassword('abcdefghij', 'abcdefghij'), {
      isValid: false,
      message: 'Password must contain both numbers and characters',
    });
    assert.deepEquals(validatePassword('12345678', '12345678'), {
      isValid: false,
      message: 'Password must contain both numbers and characters',
    });
  });
});

/**
 * getBrowserName(lookupMap)
 */
test('getBrowserName(lookupMap) returns correct browser name', (assert) => {
  assert.plan(1);
  assert.equals(getBrowserName({
    name: 'Chrome',
  }), 'Chrome');
});
