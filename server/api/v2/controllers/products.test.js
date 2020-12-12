const supertest = require('supertest');
const mongoose = require('mongoose');
const util = require('./testUtil');
const app = require('../../../app');
const Category = require('../../../models/Category');
const Group = require('../../../models/Group');

const server = supertest(app);

const basePath = '/v2/products';
let testUser = '';
let category = {};
let group = {};

describe('Test product controller', () => {
  beforeAll(async () => {
    testUser = await util.getTestUserAuthToken(server);

    await util.clearCategoryTable();
    await util.clearGroupTable();
  });

  beforeEach(async () => {
    await util.clearProductTable();
  });

  afterAll(async (done) => {
    await mongoose.disconnect();
    done();
  });

  test('POST create a product ', async () => {
    category = new Category({
      _id: mongoose.Types.ObjectId(),
      name: 'Test1',
      icon: 'Test1.png',
      user: testUser.user.id,
      default: false,
    });

    await category.save();

    group = new Group({
      _id: mongoose.Types.ObjectId(),
      name: 'Test',
    });

    await group.save();

    const response = await server
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        name: 'Product',
        quantity: '4',
        expiryDate: '2020-12-25',
        category: category._id,
        group: group._id,
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      data: {
        message: expect.stringMatching(/.*/),
        product: {
          name: 'Product',
          quantity: '4',
          expiryDate: '2020-12-25',
          category: {},
          group: {},
        },
      },
    });
  });
});
