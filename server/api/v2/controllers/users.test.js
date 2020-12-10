const supertest = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../../../app');
const util = require('./testUtil');
const User = require('../../../models/User');

const basePath = '/v2/users';

const server = supertest(app);

// Utility functions

const clearUserTable = () => {
  User.deleteMany({}, (err) => {
    if (err) {
      // console.log('collection not removed');
    } else {
      // console.log('collection removed');
    }
  });
};

describe('Test users controller', () => {
  beforeEach(async () => {
    clearUserTable();
  });

  test('POST Creation should fail because no email was provided', async () => {
    const response = await server.post(`${basePath}/register`).send({
      password: 'Password!234',
      firstname: 'A',
      lastname: 'B',
    });

    expect(response.status).toBe(400);
  });

  test('POST Creation should fail because no password was provided', async () => {
    const response = await server.post(`${basePath}/register`).send({
      email: 'Test@email.it',
      firstname: 'A',
      lastname: 'B',
    });

    expect(response.status).toBe(400);
  });

  test('POST Creation should fail because no firstname was provided', async () => {
    const response = await server.post(`${basePath}/register`).send({
      email: 'Test@email.it',
      password: 'Password!234',
      lastname: 'B',
    });

    expect(response.status).toBe(400);
  });

  test('POST Creation should fail because no lastname was provided', async () => {
    const response = await server.post(`${basePath}/register`).send({
      email: 'Test@email.it',
      password: 'Password!234',
      firstname: 'A',
    });

    expect(response.status).toBe(400);
  });

  test('POST Creation should fail because email is not a valid email (missing "@")', async () => {
    const response = await server.post(`${basePath}/register`).send({
      email: 'Testemail.it',
      password: 'Password!234',
      firstname: 'A',
      lastname: 'B',
    });

    expect(response.status).toBe(400);
  });

  test('POST Creation should fail because password is not valid', async () => {
    const response = await server.post(`${basePath}/register`).send({
      email: 'Test@email.it',
      password: 'Password234',
      firstname: 'A',
      lastname: 'B',
    });

    expect(response.status).toBe(400);
  });

  test('POST Creation of a new user should succeed', async () => {
    const response = await server.post(`${basePath}/register`).send({
      email: 'Test@email.it',
      password: 'Password!234',
      firstname: 'A',
      lastname: 'B',
    });

    const desiredResponse = {
      data: {
        message: 'Registration successful.',
        user: {
          id: expect.stringMatching(/.*/),
          email: 'Test@email.it',
          firstname: 'A',
          lastname: 'B',
        },
      },
    };

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(desiredResponse);

    // Check if user was created
    const fetchedUser = await User.findById(response.body.data.user.id);
    expect(fetchedUser._id.toString()).toBe(response.body.data.user.id);
  });

  // TODO: Make it independent form order of execution
  test('POST Creation should fail because email is already taken', async () => {
    await util.registerUser(server);

    const response = await server.post(`${basePath}/register`).send({
      email: 'Test@email.it',
      password: 'Password!234',
      firstname: 'A',
      lastname: 'B',
    });

    expect(response.status).toBe(409);
  });

  test("POST Login should fail because email doesn't exist", async () => {
    const response = await server.post(`${basePath}/login`).send({
      email: 'Tes@email.it',
      password: 'Password!234',
    });

    expect(response.status).toBe(401);
  });

  test('POST Login should fail because password is wrong', async () => {
    await util.registerUser(server);

    const response = await server.post(`${basePath}/login`).send({
      email: 'Test@email.it',
      password: 'Password',
    });

    expect(response.status).toBe(401);
  });

  test('POST Login should succeed', async () => {
    const res = await util.registerUser(server);
    await util.confirmUser(res);

    const response = await server.post(`${basePath}/login`).send({
      email: 'Test@email.it',
      password: 'Password!234',
    });

    const desiredResponse = {
      data: {
        message: 'Authentication successful.',
        token: expect.stringMatching(/.*/),
        user: {
          id: expect.stringMatching(/.*/),
          email: 'Test@email.it',
          firstname: 'A',
          lastname: 'B',
        },
      },
    };

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(desiredResponse);

    // Check if user is really logged
    const { token } = response.body.data;
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const fetchedUsers = await User.find({ email: 'Test@email.it' });

    const userData = {
      email: fetchedUsers[0].email,
      userId: fetchedUsers[0]._id.toString(),
    };

    expect(decoded).toMatchObject(userData);
  });

  test('PUT Update password should fail because old password is wrong', async () => {
    const testUser = await util.getTestUserAuthToken(server);

    const response = await server
      .put(`${basePath}/password`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        oldPassword: 'Password!23',
        newPassword: 'Test123!',
        confirmPassword: 'Test123!',
      });

    const desiredResponse = {
      error: {
        message: 'Update password failed',
        description: 'Wrong password',
      },
    };
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test("PUT Update password should fail because newPassword and confirmPassword don't match", async () => {
    const testUser = await util.getTestUserAuthToken(server);

    const response = await server
      .put(`${basePath}/password`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        oldPassword: 'Password!234',
        newPassword: 'Test123',
        confirmPassword: 'Test123!',
      });

    const desiredResponse = {
      error: {
        message: 'Update password failed',
        description: "Passwords don't match",
      },
    };
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test('PUT Update password should fail because request body is invalid', async () => {
    const testUser = await util.getTestUserAuthToken(server);

    const response = await server
      .put(`${basePath}/password`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        newPassword: 'Test123',
        confirmPassword: 'Test123!',
      });

    const desiredResponse = {
      error: {
        message: 'Update password failed',
        description: 'Data not correctly provided',
      },
    };
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test('PUT Update password should succeed', async () => {
    const testUser = await util.getTestUserAuthToken(server);

    const response = await server
      .put(`${basePath}/password`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        oldPassword: 'Password!234',
        newPassword: 'Test123!',
        confirmPassword: 'Test123!',
      });

    const desiredResponse = {
      data: {
        message: 'Update password successful',
        user: {
          id: expect.stringMatching(/.*/),
          email: 'Test@email.it',
          firstname: 'A',
          lastname: 'B',
        },
      },
    };
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(desiredResponse);
  });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close();
    done();
  });

  test("POST Reset password should fail because email doens't exists", async () => {
    await util.registerUser(server);
    const response = await server.post(`${basePath}/passwordReset`).send({
      email: 'Tes@email.it',
    });

    const desiredResponse = {
      error: {
        message: 'Reset password failed.',
        description: 'Cannot find a user with the requested email.',
      },
    };
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test('POST Reset password should succeed', async () => {
    await util.registerUser(server);
    const response = await server.post(`${basePath}/passwordReset`).send({
      email: 'Test@email.it',
    });

    const desiredResponse = {
      data: {
        message: 'New password sent',
        user: {
          id: expect.stringMatching(/.*/),
          email: 'Test@email.it',
          firstname: 'A',
          lastname: 'B',
        },
      },
    };
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test("GET Confirm token should fail because token doesn't match", async () => {
    const regResponse = await util.registerUser(server);
    const token = 'token1234&';

    const response = await server.get(`${basePath}/confirm/${token}`);

    const desiredResponse = {
      error: {
        message: 'Confirmation failed.',
        description: 'Token not found.',
      },
    };

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test('GET Confirm token should succeed', async () => {
    const regResponse = await util.registerUser(server);
    const token = 'token1234&';

    // Dato che il token viene inviato per email lo cambio a mano nel database
    // per non dover fare acrobazie per recuperarlo.
    await User.findByIdAndUpdate(regResponse.body.data.user.id, {
      token,
    }).exec();

    const response = await server.get(`${basePath}/confirm/${token}`);

    const desiredResponse = {
      data: {
        message: 'Confirmation successful.',
        user: {
          id: expect.stringMatching(/.*/),
          email: 'Test@email.it',
          firstname: 'A',
          lastname: 'B',
        },
      },
    };

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(desiredResponse);
  });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close();
    done();
  });
});
