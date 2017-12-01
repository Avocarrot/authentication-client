const assert = require('assert');
const Consumer = require('../services/consumer');

class Confirmation {

  constructor(consumer) {
    assert(consumer instanceof Consumer, '`consumer` should be instance of Consumer');
    this._consumer = consumer;
  }

  get(token) {
    assert(token, 'Missing `token`');
    return this._consumer.getConfirmationToken(token);
  }

  confirm(token) {
    assert(token, 'Missing `token`');
    return this._consumer.updateConfirmation(token);
  }

  resend(email) {
    assert(email, 'Missing `email`');
    return this._consumer.createConfirmation(email);
  }

}

module.exports = Confirmation;
