/**
 * Mocks for /users resource
 * @private UserMocks
 */
const UserMocks = {
  User: {
    id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
    publisher_id: '55f5c8e0-762b-4fa5-8571-197c8183130a',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@mail.com',
    _links: {
      self: {
        href: 'http://auth.mock.com/users/44d2c8e0-762b-4fa5-8571-097c81c3130d',
        type: 'application/json',
      },
      publisher: {
        href: 'https://platform.mock.com/publishers/55f5c8e0-762b-4fa5-8571-197c8183130a',
        type: 'application/vnd.api+json',
      },
    },
  },

  UserWithDetails: options => ({
    id: '44d2c8e0-762b-4fa5-8571-097c81c3130d',
    publisher_id: '55f5c8e0-762b-4fa5-8571-197c8183130a',
    first_name: options.first_name,
    last_name: options.last_name,
    email: options.email,
    _links: {
      self: {
        href: 'http://auth.mock.com/users/44d2c8e0-762b-4fa5-8571-097c81c3130d',
        type: 'application/json',
      },
      publisher: {
        href: 'https://platform.mock.com/publishers/55f5c8e0-762b-4fa5-8571-197c8183130a',
        type: 'application/vnd.api+json',
      },
    },
  }),
};

module.exports = UserMocks;
