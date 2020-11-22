const supertest = require('supertest');

const app = require('../../../app');
const User = require('../models/User');

const request = supertest(app);

describe('Test users controller', () => {
  beforeAll(async () => {
    // clear user table
    User.remove({}, (err) => {
      if (err) {
        console.log('collection not removed');
      } else {
        console.log('collection removed');
      }
    });
  });

  test('Should be able to create a user', async () => {
    const response = await request.post('/v1/users/register').send({
      email: 'Test@email.it',
      password: 'Password!234',
      firstname: 'A',
      lastname: 'B',
    });

    expect(response.status).toBe(201);
  });
});
