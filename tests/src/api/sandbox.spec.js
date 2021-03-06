const test = require('tape');
const SandboxAPI = require('../../../src/api').Sandbox;
const SandboxDatabase = require('../../../src/databases/sandbox');
const sinon = require('sinon');
const qs = require('qs');

const sandbox = sinon.sandbox.create();

/**
 * Mocks
 */
const TokenMocks = require('../../mocks/token');
const UserMocks = require('../../mocks/user');

/**
 * Instances
 */
function getSandboxInstances() {
  const UserFixtures = [{
    id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
    publisher_id: '55f5c8e0-762b-4fa5-8571-197c8183130a',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@mail.com',
    password: '123456789',
  }];
  const TokenFixtures = [{
    user_id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
    refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    access_token: 'rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7',
  }];
  const PasswordFixtures = [{
    user_id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
    token: 'yJhbGcieOiJIUzI1NiIsIJ9nR5cCI6IkpXVC',
  }];
  const ConfirmationFixtures = [{
    uuid: '653a6d48-c38c-4414-8cd4-acea0a3d7804',
    user_id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
  }];
  const sandboxDatabase = new SandboxDatabase(UserFixtures, TokenFixtures, PasswordFixtures, ConfirmationFixtures);
  const sandboxAPI = new SandboxAPI(sandboxDatabase);
  return {
    database: sandboxDatabase,
    API: sandboxAPI,
  };
}

/**
 * APISandbox
 */

/**
 * APISandbox - GET /users
 */

test('APISandbox.invoke() should mock /users GET', (t) => {
  t.test('on success', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    sandbox.stub(instances.database, 'hasUserWithToken').returns(true);
    sandbox.stub(instances.database, 'getUserWithToken').returns(Object.assign(UserMocks.User, {}));
    instances.API.invoke('users/me', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer d4149324285e46bfb8065b6c816a12b2',
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((res) => {
      assert.deepEquals(res.body, Object.assign(UserMocks.User, {}));
      assert.equals(res.status, 200);
    });
    sandbox.restore();
  });
  t.test('on failure', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    sandbox.stub(instances.database, 'hasUserWithToken').returns(false);
    instances.API.invoke('users/me', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer d4149324285e46bfb8065b6c816a12b2',
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((res) => {
      assert.deepEquals(res.body, {
        error: 'not_found',
      });
      assert.equals(res.status, 404);
    });
    sandbox.restore();
  });
});

/**
 * APISandbox - POST /users
 */

test('APISandbox.invoke() should mock /users POST', (t) => {
  t.test('on success', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    const newUser = {
      email: 'foo.bar@mail.com',
      password: '123456789',
      first_name: 'Foo',
      last_name: 'Bar',
    };
    sandbox.stub(instances.database, 'hasUserWithData').returns(false);
    sandbox.stub(instances.database, 'addUser').returns(newUser);
    instances.API.invoke('users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        email: 'foo.bar@mail.com',
        password: '123456789',
        first_name: 'Foo',
        last_name: 'Bar',
      }),
    }).then((res) => {
      assert.deepEquals(res.body, newUser);
      assert.equals(res.status, 201);
    });
  });

  t.test('on failure', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    sandbox.stub(instances.database, 'hasUserWithData').returns(true);
    instances.API.invoke('users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        email: 'foo.bar@mail.com',
        password: '123456789',
        first_name: 'Foo',
        last_name: 'Bar',
      }),
    }).then((res) => {
      assert.deepEquals(res.body, {
        error: 'validation_failed',
      });
      assert.equals(res.status, 400);
    });
  });
});

/**
 * APISandbox - PATCH /users
 */

test('APISandbox.invoke() should mock /users PATCH', (t) => {
  t.test('on success', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    const updatedUser = Object.assign(UserMocks.User, {
      first_name: 'Foo',
      last_name: 'Bar',
    });
    sandbox.stub(instances.database, 'getUserWithToken').returns(Object.assign(UserMocks.User, {}));
    sandbox.stub(instances.database, 'getUserWithId').returns(Object.assign(UserMocks.User, {}));
    sandbox.stub(instances.database, 'updateUser').returns(updatedUser);
    instances.API.invoke('users/44d2c8e0-762b-4fa5-8571-097c81c3130d', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer d4149324285e46bfb8065b6c816a12b2',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        first_name: 'Foo',
        last_name: 'Bar',
      }),
    }).then((res) => {
      assert.deepEquals(res.body, updatedUser);
      assert.equals(res.status, 200);
    });
  });

  t.test('on failure', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    sandbox.stub(instances.database, 'getUserWithToken').returns(Object.assign(UserMocks.User, {}));
    sandbox.stub(instances.database, 'getUserWithId');
    instances.API.invoke('users/44d2c8e0-762b-4fa5-8571-097c81c3130d', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer d4149324285e46bfb8065b6c816a12b2',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        first_name: 'Foo',
        last_name: 'Bar',
      }),
    }).then((res) => {
      assert.deepEquals(res.body, {
        error: 'invalid_grant',
      });
      assert.equals(res.status, 400);
    });
  });
});

/**
 * APISandbox - POST /token - retrieve
 */

test('APISandbox.invoke() should mock /token POST retrieval', (t) => {
  t.test('on success', (assert) => {
    assert.plan(3);
    const instances = getSandboxInstances();
    sandbox.stub(instances.database, 'hasUserWithData').returns(true);
    sandbox.stub(instances.database, 'getUserWithData').returns(Object.assign(UserMocks.User, {}));
    sandbox.stub(instances.database, 'getTokenFor').returns(Object.assign(TokenMocks.PaswordGrant, {}));
    instances.API.invoke('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: qs.stringify({
        username: 'john.doe@mail.com',
        password: '123456789',
        grant_type: 'password',
        client_id: 'client_id',
        client_secret: 'client_secret',
      }),
    }).then((res) => {
      assert.ok(res.body.access_token);
      assert.ok(res.body.refresh_token);
      assert.equals(res.status, 200);
    });
    sandbox.restore();
  });

  t.test('on failure', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    sandbox.stub(instances.database, 'hasUserWithData').returns(false);
    instances.API.invoke('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: qs.stringify({
        username: 'john.doe@mail.com',
        password: '123456789',
        grant_type: 'password',
        client_id: 'client_id',
        client_secret: 'client_secret',
      }),
    }).then((res) => {
      assert.deepEquals(res.body, {
        error: 'not_found',
      });
      assert.equals(res.status, 404);
    });
    sandbox.restore();
  });
});

/**
 * APISandbox - POST /token - refresh
 */

test('APISandbox.invoke() should mock /token POST refreshement', (t) => {
  t.test('on success', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    const mockToken = {
      access_token: 'IUzI1NieyJhbGciOiJIsInR5cCI6IkpXVCJ9',
      refresh_token: 'eyJhbGciOiJIsIIUzI1NipXVCJnR5cCI6Ik9',
    };
    sandbox.stub(instances.database, 'hasTokenWithRefresh').returns(true);
    sandbox.stub(instances.database, 'updateToken').returns(mockToken);
    instances.API.invoke('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: qs.stringify({
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        grant_type: 'refresh_token',
        client_id: 'client_id',
        client_secret: 'client_secret',
      }),
    }).then((res) => {
      assert.deepEquals(res.body, mockToken);
      assert.equals(res.status, 200);
    });
    sandbox.restore();
  });

  t.test('on failure', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    sandbox.stub(instances.database, 'hasTokenWithRefresh').returns(false);
    instances.API.invoke('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: qs.stringify({
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        grant_type: 'refresh_token',
        client_id: 'client_id',
        client_secret: 'client_secret',
      }),
    }).then((res) => {
      assert.deepEquals(res.body, {
        error: 'invalid_token',
      });
      assert.equals(res.status, 400);
    });
    sandbox.restore();
  });

  t.test('on wrong resource', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    instances.API.invoke('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: qs.stringify({
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        client_id: 'client_id',
        client_secret: 'client_secret',
      }),
    }).then((res) => {
      assert.equals(res.status, 404);
      assert.deepEquals(res.body, {
        error: 'unexpected_error',
      });
    });
    sandbox.restore();
  });
});

/**
 * APISandbox - POST /password
 */

test('APISandbox.invoke() should mock /passwords POST', (t) => {
  t.test('on success', (assert) => {
    assert.plan(2);
    getSandboxInstances().API.invoke('passwords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        email: 'john.doe@mail.com',
      }),
    }).then((res) => {
      assert.deepEquals(res.body, {});
      assert.equals(res.status, 200);
    });
    sandbox.restore();
  });
  t.test('on failure', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    sandbox.stub(instances.database, 'hasUserWithEmail').returns(false);
    instances.API.invoke('passwords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        email: 'john.doe@mail.com',
      }),
    }).then((res) => {
      assert.deepEquals(res.body, { error: 'not_found' });
      assert.equals(res.status, 404);
    });
    sandbox.restore();
  });
});

/**
 * APISandbox - PUT /password
 */

test('APISandbox.invoke() should mock /passwords PUT', (t) => {
  t.test('on success', (assert) => {
    assert.plan(2);
    getSandboxInstances().API.invoke('passwords/yJhbGcieOiJIUzI1NiIsIJ9nR5cCI6IkpXVC', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        password: '123456789',
      },
    }).then((res) => {
      assert.deepEquals(res.body, {});
      assert.equals(res.status, 200);
    });
    sandbox.restore();
  });
  t.test('on failure', (assert) => {
    assert.plan(2);
    getSandboxInstances().API.invoke('passwords/123456', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        password: '123456789',
      },
    }).then((res) => {
      assert.deepEquals(res.body, { error: 'not_found' });
      assert.equals(res.status, 404);
    });
    sandbox.restore();
  });
});

/**
 * APISandbox - GET /confirmations
 */
test('APISandbox.invoke() should mock /confirmations GET', (t) => {
  t.test('on success', (assert) => {
    assert.plan(2);
    getSandboxInstances().API.invoke('confirmations/653a6d48-c38c-4414-8cd4-acea0a3d7804', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((res) => {
      assert.deepEquals(res.body, {
        uuid: '653a6d48-c38c-4414-8cd4-acea0a3d7804',
        user_id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
      });
      assert.equals(res.status, 200);
    });
  });
  t.test('on error', (assert) => {
    assert.plan(2);
    getSandboxInstances().API.invoke('confirmations/gibberish', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((res) => {
      assert.deepEquals(res.body, { error: 'not_found' });
      assert.equals(res.status, 404);
    });
  });
});

/**
 * APISandbox - PUT /confirmations
 */
test('APISandbox.invoke() should mock /confirmations PUT', (t) => {
  t.test('on success', (assert) => {
    assert.plan(2);
    getSandboxInstances().API.invoke('confirmations/653a6d48-c38c-4414-8cd4-acea0a3d7804', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((res) => {
      assert.deepEquals(res.body, {});
      assert.equals(res.status, 204);
    });
  });
  t.test('on error', (assert) => {
    assert.plan(2);
    getSandboxInstances().API.invoke('confirmations/gibberish', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((res) => {
      assert.deepEquals(res.body, { error: 'not_found' });
      assert.equals(res.status, 404);
    });
  });
});

/**
 * APISandbox - POST /confirmations
 */
test('APISandbox.invoke() should mock /confimations POST', (t) => {
  t.test('on success', (assert) => {
    assert.plan(2);
    getSandboxInstances().API.invoke('confirmations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        email: 'john.doe@mail.com',
      }),
    }).then((res) => {
      assert.deepEquals(res.body, {});
      assert.equals(res.status, 201);
    });
  });
  t.test('on error', (assert) => {
    assert.plan(2);
    getSandboxInstances().API.invoke('confirmations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        email: 'foo@bar.com',
      }),
    }).then((res) => {
      assert.deepEquals(res.body, { error: 'not_found' });
      assert.equals(res.status, 404);
    });
  });
});
