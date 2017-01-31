const test = require('tape');
const SandboxAPI = require('../../../src/api').Sandbox;
const SandboxDatabase = require('../../../src/databases/sandbox');
const sinon = require('sinon');

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
  const sandboxDatabase = new SandboxDatabase(UserFixtures, TokenFixtures, PasswordFixtures);
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
    sandbox.stub(instances.database, 'hasUserWithToken', () => true);
    sandbox.stub(instances.database, 'getUserWithToken', () => Object.assign(UserMocks.User, {}));
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
    sandbox.stub(instances.database, 'hasUserWithToken', () => false);
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
    sandbox.stub(instances.database, 'hasUserWithData', () => (false));
    sandbox.stub(instances.database, 'addUser', () => (newUser));
    instances.API.invoke('users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        email: 'foo.bar@mail.com',
        password: '123456789',
        first_name: 'Foo',
        last_name: 'Bar',
      },
    }).then((res) => {
      assert.deepEquals(res.body, newUser);
      assert.equals(res.status, 201);
    });
  });

  t.test('on failure', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    sandbox.stub(instances.database, 'hasUserWithData', () => (true));
    instances.API.invoke('users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        email: 'foo.bar@mail.com',
        password: '123456789',
        first_name: 'Foo',
        last_name: 'Bar',
      },
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
    sandbox.stub(instances.database, 'getUserWithToken', () => Object.assign(UserMocks.User, {}));
    sandbox.stub(instances.database, 'getUserWithId', () => Object.assign(UserMocks.User, {}));
    sandbox.stub(instances.database, 'updateUser', () => updatedUser);
    instances.API.invoke('users/44d2c8e0-762b-4fa5-8571-097c81c3130d', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer d4149324285e46bfb8065b6c816a12b2',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        first_name: 'Foo',
        last_name: 'Bar',
      },
    }).then((res) => {
      assert.deepEquals(res.body, updatedUser);
      assert.equals(res.status, 200);
    });
  });

  t.test('on failure', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    sandbox.stub(instances.database, 'getUserWithToken', () => Object.assign(UserMocks.User, {}));
    sandbox.stub(instances.database, 'getUserWithId', () => {});
    instances.API.invoke('users/44d2c8e0-762b-4fa5-8571-097c81c3130d', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer d4149324285e46bfb8065b6c816a12b2',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        first_name: 'Foo',
        last_name: 'Bar',
      },
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
    sandbox.stub(instances.database, 'hasUserWithData', () => true);
    sandbox.stub(instances.database, 'getUserWithData', () => Object.assign(UserMocks.User, {}));
    sandbox.stub(instances.database, 'getTokenFor', () => Object.assign(TokenMocks.PaswordGrant, {}));
    instances.API.invoke('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: {
        username: 'john.doe@mail.com',
        password: '123456789',
        grant_type: 'password',
        client_id: 'client_id',
        client_secret: 'client_secret',
      },
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
    sandbox.stub(instances.database, 'hasUserWithData', () => false);
    instances.API.invoke('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: {
        username: 'john.doe@mail.com',
        password: '123456789',
        grant_type: 'password',
        client_id: 'client_id',
        client_secret: 'client_secret',
      },
    }).then((res) => {
      assert.deepEquals(res.body, {
        error: 'not_found',
      });
      assert.equals(res.status, 400);
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
    sandbox.stub(instances.database, 'hasTokenWithRefresh', () => true);
    sandbox.stub(instances.database, 'updateToken', () => mockToken);
    instances.API.invoke('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: {
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        grant_type: 'refresh_token',
        client_id: 'client_id',
        client_secret: 'client_secret',
      },
    }).then((res) => {
      assert.deepEquals(res.body, mockToken);
      assert.equals(res.status, 200);
    });
    sandbox.restore();
  });

  t.test('on failure', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    sandbox.stub(instances.database, 'hasTokenWithRefresh', () => false);
    instances.API.invoke('token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: {
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        grant_type: 'refresh_token',
        client_id: 'client_id',
        client_secret: 'client_secret',
      },
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
      body: {
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        client_id: 'client_id',
        client_secret: 'client_secret',
      },
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
      body: {
        email: 'john.doe@mail.com',
      },
    }).then((res) => {
      assert.deepEquals(res.body, {});
      assert.equals(res.status, 200);
    });
    sandbox.restore();
  });
  t.test('on failure', (assert) => {
    assert.plan(2);
    const instances = getSandboxInstances();
    sandbox.stub(instances.database, 'hasUserWithEmail', () => false);
    instances.API.invoke('passwords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        email: 'john.doe@mail.com',
      },
    }).then((res) => {
      assert.deepEquals(res.body, { error: 'not_found' });
      assert.equals(res.status, 400);
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
      assert.equals(res.status, 400);
    });
    sandbox.restore();
  });
});
