<img width="300" src="https://cloud.githubusercontent.com/assets/1907604/7618436/f8c371de-f9a9-11e4-8846-772f67f53513.jpg"/>

# authentication-client

[![CircleCI](https://circleci.com/gh/Avocarrot/authentication-client.svg?style=shield&circle-token=a289026f1ac89645d7996913c153d00d3a63edb7)](https://circleci.com/gh/Avocarrot/authentication-client)
[<img src="https://s3.amazonaws.com/avocarrot_various/git-shields/coverage-99%2B.svg"/>](https://circleci.com/api/v1/project/Avocarrot/authentication-client/latest/artifacts/0//home/ubuntu/authentication-client/coverage/lcov-report/index.html)

A thin <a href="https://gitlab.glispa.com/avocarrot/authentication-api" target="_blank"> Authentication API</a> consumer (43KB) powered by [Browserify](https://github.com/substack/node-browserify)

<a href="https://github.com/gulpjs/gulp" target="_blank"><img src="https://cloud.githubusercontent.com/assets/1907604/15748124/467bdc4c-28e6-11e6-87a1-13683a6e8a1e.png" width ="80"/></a> <a href="https://github.com/substack/node-browserify" target="_blank"><img src="https://cloud.githubusercontent.com/assets/1907604/15990702/b75d94b2-30a4-11e6-97d1-4f4b623f27ec.jpg" width ="100"/></a> <a href="http://es6-features.org" target="_blank"><img src="https://cloud.githubusercontent.com/assets/1907604/21814827/47164abc-d763-11e6-929b-078a374a2abc.jpg" width ="100"/></a>

---

## Development

Please see the **[CONTRIBUTING instructions](https://github.com/Avocarrot/authentication-client/blob/master/CONTRIBUTING.md)** before contributing to this repository

---

## Getting Started

Install the required dependencies
```
make yarn
make npm
```

To build the library for **Production** use

```
npm run build:production
```

To run a live-reload build task for **Development** run

```
npm start
```


---

## Tests

To run the tests use

```
npm test
```
To produce a test coverage report use

```
npm run cov
```
You can access the report by running `open coverage/lcov-report/index.html`.

:arrow_forward: [Code coverage results for the latest build](
https://circleci.com/api/v1/project/Avocarrot/authentication-client/latest/artifacts/0//home/ubuntu/authentication-client/coverage/lcov-report/index.html)

---

## API Reference

To generate the [JSDoc](http://usejsdoc.org/) API Reference run
```
npm run docs
```
You can access the generated docs by running `open docs/index.html`

:arrow_forward: [API Reference for the latest build](
https://circleci.com/api/v1/project/Avocarrot/authentication-client/latest/artifacts/0//home/ubuntu/authentication-client/docs/index.html)

---

## Usage

- [Installation](https://github.com/Avocarrot/authentication-client/blob/master/README.md#installation)
- [Setup](https://github.com/Avocarrot/authentication-client/blob/master/README.md#setup)
- [Environments](https://github.com/Avocarrot/authentication-client/blob/master/README.md#environments)
- [Session operations](https://github.com/Avocarrot/authentication-client/blob/master/README.md#session-operations)
- [User operations](https://github.com/Avocarrot/authentication-client/blob/master/README.md#user-operations)
- [Password operations](https://github.com/Avocarrot/authentication-client/blob/master/README.md#password-operations)

### Installation
Add the following line in your `package.json` file and replace the `<TAG>` with your target version, ie `v1.1.0`
```
"dependencies": {
  "authentication-client": "git@github.com:Avocarrot/authentication-client.git#v1.1.0"
}
```

### Setup

The library can be instantiated with the following arguments

| Argument      | Description                        | Default                                     |
| ------------- |:-----------------------------------|:-------------------------------------------:|
| `clientId`    | The app's registered client id     | N/A                                         |
| `clientSecret`| The app's registered client secret | N/A                                         |
| `loginHost`   | The login app host                 | "http://login.avocarrot.com"                |
| `apiHost`     | The authentication-api host        | "http://auth.avocarrot.com"                 |
| `domain`      | The Store domain prefix            | "avocarrot"                                 |
| `environment` | The environment to use             | AuthenticationClient.Environment.Production |

### Environments

You can setup the library to run in two Environments:
- Production
- Sandbox

#### Production
All API calls are forwarded to the production Authentication API using the configuration file at [`config/default.js`](https://github.com/Avocarrot/authentication-client/blob/master/config/default.js).


```javascript
import AuthenticationClient from 'authentication-client';

var authenticationClient = AuthenticationClient.getInstanceFor({
  clientId: '1234',
  clientSecret: '5678'
})

```
#### Sandbox
All calls to Authentication API are mocked and a temporary session is provided.

```javascript
import AuthenticationClient from 'authentication-client';

var authClient = AuthenticationClient.getInstanceFor({
  clientId: '1234',
  clientSecret: '5678',
  loginHost: 'http://localhost:9000',
  environment: AuthenticationClient.Environment.Sandbox
})
```

### Session operations

```javascript
/**
 * Determines if session is valid (user is authenticated)
 *
 * @return {Boolean}
 *
 */
authClient.session.isValid;

/**
 * Validates session
 * - redirects to `loginHost`
 *
 * @return {Void}
 *
 */
authClient.session.validate();

/**
 * Invalidates session
 * - flushes stored tokens
 * - redirects to `loginHost`
 *
 * @return {Void}
 *
 */
authClient.session.invalidate();
```

### User operations

While in Sandbox mode you can authenticate using the default Sandbox User found in [`/fixtures/users.json`](https://github.com/Avocarrot/authentication-client/blob/master/fixtures/users.json)

**Default Sandbox User**

| Property      | Value               |                                 
|:--------------|:-------------------:|
| `email`       | john.doe@mail.com   |
| `password`    | qwerty123           |


```javascript

/**
 * Authenticate a User (login)
 *
 * @param {String} email - The user's email
 * @param {String} password - The user's password
 * @return {Promise} - res.message, err.message
 *
 */
authClient.user.authenticate(email, password)
  .then((res)  => {/* ... */})
  .catch((err) => {/* ... */});

/**
 * Create a User (register)
 *
 * @param {String} email - The user's email
 * @param {String} password - The user's password
 * @param {String} firstName - The user's first name
 * @param {String} lastName - The user's last name
 * @return {Promise} - res.message, err.message
 *
 */
authClient.user.create(email, password, firstName, lastName)
  .then((res)  => {/* ... */})
  .catch((err) => {/* ... */});

/**
 * Update User
 *
 * @return {Promise} - res.message, err.message
 *
 */
authClient.user.firstName = "John";
authClient.user.lastName = "Doe";
authClient.user.email = "mock@email.com";
authClient.user.save()
  .then((res)  => {/* ... */})
  .catch((err) => {/* ... */});

/**
 * Authenticate user using a login token (Staff login)
 *
 * @return {Promise} - res.message, err.message
 *
 */
authClient.user.authenticateWithToken(accessToken)
  .then((res)  => {/* ... */})
  .catch((err) => {/* ... */});

```

### Password operations

The following rules apply for password acceptance
- Password must be at least 8 characters long
- Password must contain both numbers and characters
- Password cannot contain spaces

```javascript

/**
 * Request a password reset for an email
 *
 * @param {String} email - The email where the reset link will be sent
 * @return {Promise} - res.message, err.message
 *
 */
authClient.authenticator.requestPasswordReset(email)
  .then((res)  => {/* ... */})
  .catch((err) => {/* ... */});

/**
 * Reset password
 *
 * @param {String} token - The password reset token (provided via the reset link)
 * @param {String} password - The password to set
 * @return {Promise} - res.message, err.message
 *
 */
authClient.authenticator.resetPassword(token, password)
  .then((res)  => {/* ... */})
  .catch((err) => {/* ... */});
```
---

## :warning: Bower Setup
 Currently the `dist` directory is commited and exposes through the Bower config, to support [Avocarrot dashboard integration](https://github.com/avocarrot/avocarrot-dashboard).
Once the dashboard is deprecated the `dist` directory can be added to the `.gitignore` list and the `bower.json` config can be removed.


---

## Built With

* [Gulp](http://gulpjs.com/)
* [Browserify](https://github.com/substack/node-browserify)
* [JSDoc](http://usejsdoc.org/)


---

## Versioning

For the versions available, see the [releases for this repository](https://github.com/Avocarrot/authentication-client/tags).
