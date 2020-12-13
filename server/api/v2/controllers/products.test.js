const supertest = require('supertest');
const mongoose = require('mongoose');
const util = require('./testUtil');
const app = require('../../../app');
const Category = require('../../../models/Category');
const Group = require('../../../models/Group');
const Product = require('../../../models/Product');

const server = supertest(app);

const basePath = '/v2/products';
let testUser = '';
let category = {};
let group = {};

const createCategory = async () => {
  category = new Category({
    _id: mongoose.Types.ObjectId(),
    name: 'Test1',
    icon: 'Test1.png',
    user: testUser.user.id,
    default: false,
  });

  await category.save();
};
const createGroup = async () => {
  group = new Group({
    _id: mongoose.Types.ObjectId(),
    name: 'Test',
  });

  await group.save();
};

const createProducts = async () => {
  createCategory();
  createGroup();

  const products = [
    new Product({
      name: 'Product1',
      quantity: '4',
      expiryDate: '2020-12-25',
      user: testUser.user.id,
      category: category._id,
      group: group._id,
    }),
    new Product({
      name: 'Product2',
      quantity: '4',
      expiryDate: '2020-12-25',
      user: testUser.user.id,
      category: category._id,
      group: group._id,
    }),
    new Product({
      name: 'Product3',
      quantity: '4',
      expiryDate: '2020-12-25',
      user: testUser.user.id,
      category: category._id,
      group: group._id,
    }),
  ];

  await Product.insertMany(products);
};

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

  test('GET GetList by group should succeed', async () => {
    await createProducts();

    const response = await server
      .get(`${basePath}?group=${group.id}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    const desiredResponse = {
      data: {
        message: 'Get products successful.',
        products: [
          {
            name: 'Product1',
            quantity: 4,
            expiryDate: '2020-12-25T00:00:00.000Z',
            category: { id: category._id.toString(), name: category.name, icon: category.icon },
            group: { id: group._id.toString(), name: group.name },
          },
          {
            name: 'Product2',
            quantity: 4,
            expiryDate: '2020-12-25T00:00:00.000Z',
            category: { id: category._id.toString(), name: category.name, icon: category.icon },
            group: { id: group._id.toString(), name: group.name },
          },
          {
            name: 'Product3',
            quantity: 4,
            expiryDate: '2020-12-25T00:00:00.000Z',
            category: { id: category._id.toString(), name: category.name, icon: category.icon },
            group: { id: group._id.toString(), name: group.name },
          },
        ],
      },
    };

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test('GET GetList by category should succeed', async () => {
    await createProducts();

    const response = await server
      .get(`${basePath}?category=${category.id}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    const desiredResponse = {
      data: {
        message: 'Get products successful.',
        products: [
          {
            name: 'Product1',
            quantity: 4,
            expiryDate: '2020-12-25T00:00:00.000Z',
            category: { id: category._id.toString(), name: category.name, icon: category.icon },
            group: { id: group._id.toString(), name: group.name },
          },
          {
            name: 'Product2',
            quantity: 4,
            expiryDate: '2020-12-25T00:00:00.000Z',
            category: { id: category._id.toString(), name: category.name, icon: category.icon },
            group: { id: group._id.toString(), name: group.name },
          },
          {
            name: 'Product3',
            quantity: 4,
            expiryDate: '2020-12-25T00:00:00.000Z',
            category: { id: category._id.toString(), name: category.name, icon: category.icon },
            group: { id: group._id.toString(), name: group.name },
          },
        ],
      },
    };

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(desiredResponse);
  });
  test('GET GetList should succeed', async () => {
    await createProducts();

    const response = await server
      .get(`${basePath}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    const desiredResponse = {
      data: {
        message: 'Get products successful.',
        products: [
          {
            name: 'Product1',
            quantity: 4,
            expiryDate: '2020-12-25T00:00:00.000Z',
            category: { id: category._id.toString(), name: category.name, icon: category.icon },
            group: { id: group._id.toString(), name: group.name },
          },
          {
            name: 'Product2',
            quantity: 4,
            expiryDate: '2020-12-25T00:00:00.000Z',
            category: { id: category._id.toString(), name: category.name, icon: category.icon },
            group: { id: group._id.toString(), name: group.name },
          },
          {
            name: 'Product3',
            quantity: 4,
            expiryDate: '2020-12-25T00:00:00.000Z',
            category: { id: category._id.toString(), name: category.name, icon: category.icon },
            group: { id: group._id.toString(), name: group.name },
          },
        ],
      },
    };

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(desiredResponse);
  });
});
