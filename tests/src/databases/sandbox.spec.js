'use strict';
const test = require('tape');
const SandboxDatabase = require('../../../src/databases/sandbox');

/**
 * Instances
 */
function getSandboxDatabaseInstance(options = {}) {
  let users = options.users || [{
    'id': '44d2c8e0-762b-4fa5-8571-097c81c3130d',
    'publisher_id': '55f5c8e0-762b-4fa5-8571-197c8183130a',
    'first_name': 'John',
    'last_name': 'Doe',
    'email': 'john.doe@mail.com',
    'password': '123456789'
  }];
  let tokens = options.tokens || [{
    'user_id': '44d2c8e0-762b-4fa5-8571-097c81c3130d',
    'refresh_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'access_token': 'rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7'
  }];
  return new SandboxDatabase(users, tokens);
}

/**
 * SandboxDatabase
 */

/**
 * SandboxDatabase.hasTokenWithRefresh(refreshToken)
 */

test('SandboxDatabase.hasTokenWithRefresh(refreshToken) should return correct values', (assert) => {
  let sandboxDatabase = getSandboxDatabaseInstance();
  assert.plan(2);
  assert.equals(sandboxDatabase.hasTokenWithRefresh('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'), true);
  assert.equals(sandboxDatabase.hasTokenWithRefresh('I1NiIsInR5cCI6IkpXVCJ9eyJhbGciOiJIUz'), false);
});

/**
 * SandboxDatabase.hasUserWithData(email, password)
 */

test('SandboxDatabase.hasUserWithData(email, password) should return correct values', (assert) => {
  let sandboxDatabase = getSandboxDatabaseInstance();
  assert.plan(3);
  assert.equals(sandboxDatabase.hasUserWithData('john.doe@mail.com', '123456789'), true);
  assert.equals(sandboxDatabase.hasUserWithData('john.doe@mail.com', '123456'), false);
  assert.equals(sandboxDatabase.hasUserWithData('john@mail.com', '123456789'), false);
});

/**
 * SandboxDatabase.hasUserWithToken(accessToken)
 */

test('SandboxDatabase.hasUserWithToken(accessToken) should return correct values', (assert) => {
  let sandboxDatabase = getSandboxDatabaseInstance();
  assert.plan(2);
  assert.equals(sandboxDatabase.hasUserWithToken('rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7'), true);
  assert.equals(sandboxDatabase.hasUserWithToken('8tTN7rkdkJHVBIjsIdCjLIK4alauxPP8uo5hYN'), false);
});

/**
 * SandboxDatabase.hasUserWithId(id)
 */

test('SandboxDatabase.hasUserWithId(id) should return correct values', (assert) => {
  let sandboxDatabase = getSandboxDatabaseInstance();
  assert.plan(2);
  assert.equals(sandboxDatabase.hasUserWithId('44d2c8e0-762b-4fa5-8571-097c81c3130d'), true);
  assert.equals(sandboxDatabase.hasUserWithId('097c88e0-531b-66a5-c3132-8cce26c2571'), false);
});

/**
 * SandboxDatabase.hasUserWithEmail(email)
 */

test('SandboxDatabase.hasUserWithEmail(email) should return correct values', (assert) => {
  let sandboxDatabase = getSandboxDatabaseInstance();
  assert.plan(2);
  assert.equals(sandboxDatabase.hasUserWithEmail('john.doe@mail.com'), true);
  assert.equals(sandboxDatabase.hasUserWithEmail('john@mail.com'), false);
});

/**
 * SandboxDatabase.getUserWithData(email, password)
 */

test('SandboxDatabase.getUserWithData(email, password) should return correct user data', (assert) => {
  let sandboxDatabase = getSandboxDatabaseInstance();
  assert.plan(1);
  assert.deepEquals(sandboxDatabase.getUserWithData('john.doe@mail.com', '123456789'), {
    'id': '44d2c8e0-762b-4fa5-8571-097c81c3130d',
    'publisher_id': '55f5c8e0-762b-4fa5-8571-197c8183130a',
    'first_name': 'John',
    'last_name': 'Doe',
    'email': 'john.doe@mail.com'
  });
});

/**
 * SandboxDatabase.getUserWithId(id)
 */

test('SandboxDatabase.getUserWithId(id) should return correct user data', (assert) => {
  let sandboxDatabase = getSandboxDatabaseInstance();
  assert.plan(1);
  assert.deepEquals(sandboxDatabase.getUserWithId('44d2c8e0-762b-4fa5-8571-097c81c3130d'), {
    'id': '44d2c8e0-762b-4fa5-8571-097c81c3130d',
    'publisher_id': '55f5c8e0-762b-4fa5-8571-197c8183130a',
    'first_name': 'John',
    'last_name': 'Doe',
    'email': 'john.doe@mail.com'
  });
});

/**
 * SandboxDatabase.getUserWithToken(accessToken)
 */

test('SandboxDatabase.getUserWithToken(accessToken) should return correct user data', (assert) => {
  let sandboxDatabase = getSandboxDatabaseInstance();
  assert.plan(1);
  assert.deepEquals(sandboxDatabase.getUserWithToken('rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7'), {
    'id': '44d2c8e0-762b-4fa5-8571-097c81c3130d',
    'publisher_id': '55f5c8e0-762b-4fa5-8571-197c8183130a',
    'first_name': 'John',
    'last_name': 'Doe',
    'email': 'john.doe@mail.com'
  });
});

/**
 * SandboxDatabase.addUser(email, password, firstName, lastName)
 */

test('SandboxDatabase.addUser(email, password, firstName, lastName) should generate and store new user and token data', (assert) => {
  let sandboxDatabase = getSandboxDatabaseInstance();
  let newUser = sandboxDatabase.addUser('foo.bar@mail.com', '123456789', 'Foo', 'Bar')
  assert.plan(9);
  assert.equals(sandboxDatabase.users.length, 2);
  assert.equals(sandboxDatabase.tokens.length, 2);
  assert.equals(!!~sandboxDatabase.tokens.findIndex(token => token.user_id === newUser.id), true);
  assert.equals(newUser.id.length, 36);
  assert.equals(newUser.publisher_id.length, 36);
  assert.equals(newUser.email, 'foo.bar@mail.com');
  assert.equals(newUser.first_name, 'Foo');
  assert.equals(newUser.last_name, 'Bar');
  assert.equals(typeof newUser.password, 'undefined');
});

/**
 * SandboxDatabase.updateUser(id, firstName, lastName
 */

test('SandboxDatabase.updateUser(id, firstName, lastName should update user with', (t) => {

  t.test('`first name`', (assert) => {
    let sandboxDatabase = getSandboxDatabaseInstance();
    assert.plan(2);
    sandboxDatabase.updateUser('44d2c8e0-762b-4fa5-8571-097c81c3130d', 'Foo');
    assert.equals(sandboxDatabase.users[0].first_name, 'Foo');
    assert.equals(sandboxDatabase.users[0].last_name, 'Doe');
  });

  t.test('`last name`', (assert) => {
    let sandboxDatabase = getSandboxDatabaseInstance();
    assert.plan(2);
    sandboxDatabase.updateUser('44d2c8e0-762b-4fa5-8571-097c81c3130d', undefined, 'Bar');
    assert.equals(sandboxDatabase.users[0].first_name, 'John');
    assert.equals(sandboxDatabase.users[0].last_name, 'Bar');
  });

});

/**
 * SandboxDatabase.updateToken(refreshToken)
 */

test('SandboxDatabase.updateToken(refreshToken) should update token', (assert) => {
  let sandboxDatabase = getSandboxDatabaseInstance();
  assert.plan(2);
  const prevAccessToken = sandboxDatabase.tokens[0].access_token;
  const prevRefreshToken = sandboxDatabase.tokens[0].refresh_token;
  sandboxDatabase.updateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
  assert.notEquals(sandboxDatabase.tokens[0].access_token, prevAccessToken);
  assert.notEquals(sandboxDatabase.tokens[0].refresh_token, prevRefreshToken);
});
