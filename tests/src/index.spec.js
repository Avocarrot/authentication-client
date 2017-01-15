'use strict';
const test = require('tape');
const AuthenticationClient = require('../../src/index');

/**
 * AuthenticationClient.getInstanceFor(client_id, client_secret)
 */
test('AuthenticationClient.getInstanceFor(client_id, client_secret) should ', (t) => {

  t.test('return new instance for different pair of client_id and client_secret', (assert) => {
    assert.plan(1);
    let instance1 = AuthenticationClient.getInstanceFor('<id>', '<secret>');
    let instance2 = AuthenticationClient.getInstanceFor('<new_id>', '<new_secret>');
    assert.notSame(instance1, instance2);
  });

  t.test('return the cached instance for same pair of client_id and client_secret', (assert) => {
    assert.plan(1);
    let instance1 = AuthenticationClient.getInstanceFor('<id>', '<secret>');
    let instance2 = AuthenticationClient.getInstanceFor('<id>', '<secret>');
    assert.same(instance1, instance2);
  });

});
