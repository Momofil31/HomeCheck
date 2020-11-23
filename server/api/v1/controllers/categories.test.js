const supertest = require('supertest');
const mongoose = require('mongoose');
const util = require('./testUtil');
const app = require('../../../app');
const Category = require('../models/Category');

const server = supertest(app);

const basePath = '/v1/categories';
let token = '';

describe('Test category controller', () => {
  beforeAll(async () => {
    token = await util.getTestUserAuthToken(server);
  });

  beforeEach(async () => {
    // clear table
    Category.deleteMany({}, (err) => {
      if (err) {
        console.log('collection not removed');
      } else {
        console.log('collection removed');
      }
    });
  });

  afterAll((done) => {
    mongoose.connection.close();
    done();
  });

  test('POST create a category ', async () => {
    const response = await server
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Category',
        icon: 'category.png',
        default: false,
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      data: {
        message: expect.stringMatching(/.*/),
        category: {
          id: expect.stringMatching(/.*/),
          name: 'Category',
          icon: 'category.png',
          default: false,
        },
      },
    });
  });
});
