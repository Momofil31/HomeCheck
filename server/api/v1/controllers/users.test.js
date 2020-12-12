const supertest = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../../../app');
const util = require('./testUtil');
const User = require('../../../models/User');

const basePath = '/v1/users';

const request = supertest(app);

const registerUser = async () => {
  const user = await request.post(`${basePath}/register`).send({
    email: 'Test@email.it',
    password: 'Password!234',
    firstname: 'A',
    lastname: 'B',
  });
  if (!user) return {};

  return user;
};

describe('Test users controller', () => {
  beforeEach(async () => {
    await util.clearUserTable();
  });

  afterAll(async (done) => {
    await mongoose.disconnect();
    done();
  });

  test('Creation should fail because no email was provided', async () => {
    const response = await request.post(`${basePath}/register`).send({
      password: 'Password!234',
      firstname: 'A',
      lastname: 'B',
    });

    expect(response.status).toBe(400);
  });

  test('Creation should fail because no password was provided', async () => {
    const response = await request.post(`${basePath}/register`).send({
      email: 'Test@email.it',
      firstname: 'A',
      lastname: 'B',
    });

    expect(response.status).toBe(400);
  });

  test('Creation should fail because no firstname was provided', async () => {
    const response = await request.post(`${basePath}/register`).send({
      email: 'Test@email.it',
      password: 'Password!234',
      lastname: 'B',
    });

    expect(response.status).toBe(400);
  });

  test('Creation should fail because no lastname was provided', async () => {
    const response = await request.post(`${basePath}/register`).send({
      email: 'Test@email.it',
      password: 'Password!234',
      firstname: 'A',
    });

    expect(response.status).toBe(400);
  });

  test('Creation should fail because email is not a valid email (missing "@")', async () => {
    const response = await request.post(`${basePath}/register`).send({
      email: 'Testemail.it',
      password: 'Password!234',
      firstname: 'A',
      lastname: 'B',
    });

    expect(response.status).toBe(400);
  });

  test('Creation should fail because password is not valid', async () => {
    const response = await request.post(`${basePath}/register`).send({
      email: 'Test@email.it',
      password: 'Password234',
      firstname: 'A',
      lastname: 'B',
    });

    expect(response.status).toBe(400);
  });

  test('Creation of a new user should succeed', async () => {
    const response = await request.post(`${basePath}/register`).send({
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

  test('Creation should fail because email is already taken', async () => {
    await registerUser();

    const response = await request.post(`${basePath}/register`).send({
      email: 'Test@email.it',
      password: 'Password!234',
      firstname: 'A',
      lastname: 'B',
    });

    expect(response.status).toBe(409);
  });

  test("Login should fail because email doesn't exist", async () => {
    const response = await request.post(`${basePath}/login`).send({
      email: 'Tes@email.it',
      password: 'Password!234',
    });

    expect(response.status).toBe(401);
  });

  test('Login should fail because password is wrong', async () => {
    await registerUser();

    const response = await request.post(`${basePath}/login`).send({
      email: 'Test@email.it',
      password: 'Password',
    });

    expect(response.status).toBe(401);
  });

  test('Login should succeed', async () => {
    await registerUser();

    const response = await request.post(`${basePath}/login`).send({
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
});
