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

describe('Test product controller', () => {
  beforeAll(async () => {
    testUser = await util.getTestUserAuthToken(server);

    await util.clearCategoryTable();
    await util.clearGroupTable();

    category = await util.createTestCategory(testUser.user.id);
    group = await util.createTestGroup();
  });

  beforeEach(async () => {
    await util.clearProductTable();
  });

  afterAll(async (done) => {
    await mongoose.disconnect();
    done();
  });

  test('POST create product 409 - product already exists', async () => {
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

    const product = new Product({
      name: 'Product1',
      quantity: '4',
      expiryDate: '2020-12-25',
      user: testUser.user.id,
      category: category._id,
      group: group._id,
    });

    await product.save();

    const response = await server
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        name: 'Product1',
        quantity: '4',
        expiryDate: '2020-12-25',
        category: category._id,
        group: group._id,
      });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      error: {
        message: 'Product already exists.',
      },
    });
  });

  test('POST create product 200 - product already exists but belongs to a different user', async () => {
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

    const product = new Product({
      name: 'Product1',
      quantity: '4',
      expiryDate: '2020-12-25',
      user: testUser.user.id,
      category: category._id,
      group: group._id,
    });

    await product.save();

    const differentTestUser = await util.getTestUserAuthToken(server);

    const response = await server
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${differentTestUser.token}`)
      .send({
        name: 'Product1',
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
          name: 'Product1',
          quantity: '4',
          expiryDate: '2020-12-25',
          category: {},
          group: {},
        },
      },
    });
  });

  test('POST create product 200', async () => {
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

  test('GET get list of products by group 200', async () => {
    await util.createTestProducts(category, group, testUser.user.id);

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

  test('GET get list of products by category 200', async () => {
    await util.createTestProducts(category, group, testUser.user.id);

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

  test('GET get list of products 200', async () => {
    await util.createTestProducts(category, group, testUser.user.id);

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

  test("GET get list of products 404 - product doesn't exist", async () => {
    await util.createTestProducts(category, group, testUser.user.id);

    const notExistingProductId = mongoose.Types.ObjectId();

    const response = await server
      .get(`${basePath}/${notExistingProductId}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    const desiredResponse = {
      error: {
        message: 'Product not found',
      },
    };

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test('GET get one product 200', async () => {
    await util.createTestProducts(category, group, testUser.user.id);
    const productToFind = await Product.find()
      .exec()
      .then((products) => products[0]);

    const response = await server
      .get(`${basePath}/${productToFind._id.toString()}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    const desiredResponse = {
      data: {
        message: 'Get product successful',
        product: {
          name: 'Product1',
          quantity: 4,
          expiryDate: '2020-12-25T00:00:00.000Z',
          category: { id: category._id.toString(), name: category.name, icon: category.icon },
          group: { id: group._id.toString(), name: group.name },
        },
      },
    };

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test("PUT update product 404 - product doesn't exist", async () => {
    await util.createTestProducts(category, group, testUser.user.id);
    const notExistingProductId = mongoose.Types.ObjectId();

    const response = await server
      .put(`${basePath}/${notExistingProductId}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        name: 'ProductUpdated',
        quantity: '5',
        expiryDate: '2020-12-26',
        category: category._id,
        group: group._id,
      });

    const desiredResponse = {
      error: {
        message: 'Product not found',
      },
    };

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test('PUT update product 200', async () => {
    await util.createTestProducts(category, group, testUser.user.id);
    const productToUpdate = await Product.find()
      .exec()
      .then((products) => products[0]);

    const response = await server
      .put(`${basePath}/${productToUpdate._id.toString()}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        name: 'ProductUpdated',
        quantity: '5',
        expiryDate: '2020-12-26',
        category: category._id,
        group: group._id,
      });

    const desiredResponse = {
      data: {
        message: 'Update product successful',
        product: {
          name: 'ProductUpdated',
          quantity: 5,
          expiryDate: '2020-12-26T00:00:00.000Z',
          category: { id: category._id.toString() },
          group: { id: group._id.toString() },
        },
      },
    };

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test("DELETE delete product 404 - product doesn't exist", async () => {
    await util.createTestProducts(category, group, testUser.user.id);
    const notExistingProductId = mongoose.Types.ObjectId();

    const response = await server
      .delete(`${basePath}/${notExistingProductId}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: {
        message: 'Product not found',
      },
    });
  });

  test('DELETE delete product 200', async () => {
    await util.createTestProducts(category, group, testUser.user.id);
    const productToDelete = await Product.find()
      .exec()
      .then((products) => products[0]);

    const response = await server
      .delete(`${basePath}/${productToDelete._id.toString()}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      data: {
        message: 'Delete product successful',
        product: {
          name: 'Product1',
          quantity: 4,
          expiryDate: '2020-12-25T00:00:00.000Z',
          category: { id: category._id.toString() },
          group: { id: group._id.toString() },
        },
      },
    });
  });
});
