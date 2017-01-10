'use strict';
const test = require('tape');
const Consumer = require('../../src/utils/consumer');
const Client = require('../../src/utils/client');

/**
 * Consumer.constructor(options)
 */

test('Consumer.constructor(options) should throw an error for', (t) => {

  var client = new Client('id', 'secret');

  t.test('missing `client` configuration', (assert) => {
    assert.plan(1);
    try {
      new Consumer(Object(), 'http://auth.com', 'http://login.com')
    } catch (err) {
      assert.equals(err.message, 'Missing `client`');
    }
  });

  t.test('missing `login_url` configuration', (assert) => {
    assert.plan(1);
    try {
      new Consumer(client, 'http://auth.com', null)
    } catch (err) {
      assert.equals(err.message, 'Missing `login_url`');
    }
  });

  t.test('missing `endpoint` configuration', (assert) => {
    assert.plan(1);
    try {
      new Consumer(client, null, 'http://login.com')
    } catch (err) {
      assert.equals(err.message, 'Missing `endpoint`');
    }
  });

});

/**
 * Consumer get()
 */

test('Client.id should return correct `endpoint` and `login_url` values', (assert) => {
  assert.plan(2);
  let client = new Client('id', 'secret');
  let consumer = new Consumer(client, 'http://auth.com', 'http://login.com');
  assert.equals(consumer.endpoint, 'http://auth.com');
  assert.equals(consumer.login_url, 'http://login.com');
});


/**
 * Consumer.retrieveToken(client_id, client_secret, username, password)
 */

test('Consumer.retrieveToken(client_id, client_secret, username, password) should', (t) => {

  t.test('return `access_token` and `refresh_token` on success', (assert) => {
    assert.plan(1);
    assert.equals(true, false);
  });

  t.test('reject with error on failure', (assert) => {
    assert.plan(1);
    assert.equals(true, false);
  });

});
