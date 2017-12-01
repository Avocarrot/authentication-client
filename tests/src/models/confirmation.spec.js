const test = require('tape');
const API = require('../../../src/api').Sandbox;
const Client = require('../../../src/models/client');
const Consumer = require('../../../src/services/consumer');
const Confirmation = require('../../../src/models/confirmation');

const { stub } = require('sinon');

function getInstance() {
  const api = new API();
  const client = new Client('id', 'secret');
  const consumer = new Consumer(client, api);
  const confirmation = new Confirmation(consumer);
  return { consumer, confirmation };
}

test('Confirmation.constructor(options) should throw an error for', (t) => {
  t.test('missing `consumer` configuration', (assert) => {
    assert.plan(1);
    try {
      new Confirmation();
    } catch (err) {
      assert.equals(err.message, '`consumer` should be instance of Consumer');
    }
  });
});

test('Confirmation.get(token)', (t) => {
  t.test('should throw error for empty token', (assert) => {
    assert.plan(1);
    const { confirmation } = getInstance();
    try {
      confirmation.get();
    } catch (err) {
      assert.equals(err.message, 'Missing `token`');
    }
  });

  t.test('should request token from api', (assert) => {
    assert.plan(1);
    const { consumer, confirmation } = getInstance();

    stub(consumer, 'getConfirmationToken').resolves({ message: 'Success' });
    confirmation.get('653a6d48-c38c-4414-8cd4-acea0a3d7804').then((res) => {
      assert.deepEquals(res.message, 'Success');
      consumer.getConfirmationToken.restore();
    });
  });
});

test('Confirmation.update(token)', (t) => {
  t.test('should throw error if token is missing', (assert) => {
    assert.plan(1);
    const { confirmation } = getInstance();
    try {
      confirmation.confirm();
    } catch (err) {
      assert.equals(err.message, 'Missing `token`');
    }
  });

  t.test('should send confirmation request to api', (assert) => {
    assert.plan(1);
    const { consumer, confirmation } = getInstance();

    stub(consumer, 'updateConfirmation').resolves({ message: 'Success' });
    confirmation.confirm('653a6d48-c38c-4414-8cd4-acea0a3d7804').then((res) => {
      assert.equals(res.message, 'Success');
      consumer.updateConfirmation.restore();
    });
  });
});

test('Confirmation.resend(email)', (t) => {
  t.test('should fail if no email supplied', (assert) => {
    assert.plan(1);
    const { confirmation } = getInstance();
    try {
      confirmation.resend();
    } catch (err) {
      assert.equals(err.message, 'Missing `email`');
    }
  });

  t.test('should make a request to the api', (assert) => {
    assert.plan(1);
    const { consumer, confirmation } = getInstance();
    stub(consumer, 'createConfirmation').resolves({ message: 'Created' });
    confirmation.resend('foo@bar.com').then((res) => {
      assert.equals(res.message, 'Created');
      consumer.createConfirmation.restore();
    });
  });
});
