'use strict';

/**
 * Mocks for /token resource
 * @private TokenMocks
 */
const TokenMocks = {
  PaswordGrant: {
    'refresh_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'access_token': 'rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7'
  },
  RefreshGrant: {
    'refresh_token': 'IUzI1NiIeyJhbGciOiJsInR5cCI6IkpXVCJ9',
    'access_token': 'jLIIjsIK4NalauxrkdkJHVBdCPP8uo5hY8tTN7'
  },
  ErrorResponse: {
    'error':'invalid_request'
  }
}

module.exports = TokenMocks;
