# authentication-client

[![build status](https://gitlab.glispa.com/avocarrot/authentication-client/badges/master/build.svg)](https://gitlab.glispa.com/avocarrot/authentication-client/commits/master)

---

A thin <a href="https://gitlab.glispa.com/avocarrot/authentication-api" target="_blank"> Authentication API</a> consumer powered by [Browserify](https://github.com/substack/node-browserify)

- For code coverage results check the  [`test_coverage` build artifact](
https://gitlab.glispa.com/avocarrot/authentication-client/pipelines)

- For an API Reference check the  [`api_reference` build artifact](
https://gitlab.glispa.com/avocarrot/authentication-client/pipelines)

---

<a href="https://github.com/gulpjs/gulp" target="_blank"><img src="https://cloud.githubusercontent.com/assets/1907604/15748124/467bdc4c-28e6-11e6-87a1-13683a6e8a1e.png" width ="80"/></a> <a href="https://github.com/substack/node-browserify" target="_blank"><img src="https://cloud.githubusercontent.com/assets/1907604/15990702/b75d94b2-30a4-11e6-97d1-4f4b623f27ec.jpg" width ="100"/></a> <a href="http://es6-features.org" target="_blank"><img src="https://cloud.githubusercontent.com/assets/1907604/21814827/47164abc-d763-11e6-929b-078a374a2abc.jpg" width ="100"/></a>

---


## Getting Started


[Git Commit Guidelines](https://github.com/DurandalProject/about/blob/master/CONTRIBUTING.md#commit)


Install the required dependencies
```
make yarn
make npm
```

You can run the project with livereload on your machine using

```
npm run server
```

To build the library use

```
npm run build
```
## API Reference

To generate the [JSDoc](http://usejsdoc.org/) API Reference run
```
npm run docs
```
You can access the generated docs from `docs/index.html`

> The API reference is published as within the `api_reference` artifact on pipeline builds

## Tests

To run the tests use

```
npm test
```
To produce a test coverage report use

```
npm run cov
```
You can access the report from `coverage/lcov/index.html`.

> The test coverage results are published within the `test_coverage` artifact on pipeline builds


## Usage

### Setup
```javascript
/**
 * Create an AuthenticationClient instnace
 */
 var authenticationClient = AuthenticationClient.getInstanceFor('<client_id>', '<client_secret>');
```

### User operations

```javascript
/**
  * Authenticate a User (login)
  */
  authenticationClient.user.authenticate('<username>', '<password>').then(() => {}).catch(err => {})

 /**
  * Create a new User (register)
  */
  authenticationClient.user.create('<email>', '<password>', 'firstName', 'lastName').then(() => {}).catch(err => {})

 /**
  * Retrieve User details
  */
  authenticationClient.user.firstName;
  authenticationClient.user.lastName;
  authenticationClient.user.email;

 /**
  * Update User details
  */
  authenticationClient.user.firstName = "John";
  authenticationClient.user.lastName = "Doe";
  authenticationClient.user.email = "mock@email.com";
  authenticationClient.user.save().then(() => {}).catch(err => { })
```

### Password operations

```javascript
 /**
  * Request a password reset for an email
  */
  authenticationClient.requestPasswordReset('<email>').then(() => {}).catch(err => { })

 /**
  * Reset password
  */
  authenticationClient.resetPassword('<token>', '<password>').then(() => {}).catch(err => { })

```

## Development

Make sure that you develop using the [JSDoc guidlines](http://usejsdoc.org/) to ensure that documentation stays up to date


## Built With

* [Gulp](http://gulpjs.com/)
* [Browserify](https://github.com/substack/node-browserify)
* [JSDoc](http://usejsdoc.org/)

## Versioning

For the versions available, see the [releases for this repository](https://gitlab.glispa.com/avocarrot/authentication-client/tags).
