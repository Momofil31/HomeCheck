const supertest = require('supertest');
const mongoose = require('mongoose');
const util = require('./testUtil');
const app = require('../../../app');
const Category = require('../../../models/Category');

const server = supertest(app);

const basePath = '/v2/categories';
let testUser;

describe('Test category controller', () => {
  beforeAll(async () => {
    testUser = await util.getTestUserAuthToken(server);
  });

  beforeEach(async () => {
    // clear table
    await util.clearCategoryTable();
  });

  afterAll(async (done) => {
    await mongoose.disconnect();
    done();
  });

  test('GET list of categories', async () => {
    const categories = [
      new Category({
        name: 'Test1',
        icon: 'Test1.png',
        user: testUser.user.id,
        default: false,
      }),
      new Category({
        name: 'Test2',
        icon: 'Test1.png',
        user: testUser.user.id,
        default: false,
      }),
    ];

    await Category.insertMany(categories);

    const response = await server
      .get(`${basePath}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.data.categories).toHaveLength(2);
  });

  test('GET one category', async () => {
    const categoryId = mongoose.Types.ObjectId();

    const category = new Category({
      _id: categoryId,
      name: 'Test1',
      icon: 'Test1.png',
      user: testUser.user.id,
      default: false,
    });

    await Category.create(category);

    const response = await server
      .get(`${basePath}/${categoryId}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.data.category).toMatchObject({
      id: categoryId.toString(),
      name: category.name,
      icon: category.icon,
      default: false,
    });
  });

  test('GET one category 404', async () => {
    const categoryId = mongoose.Types.ObjectId();

    const category = new Category({
      _id: categoryId,
      name: 'Test1',
      icon: 'Test1.png',
      user: testUser.user.id,
      default: false,
    });

    await Category.create(category);

    const response = await server
      .get(`${basePath}/${mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(404);
  });

  test('GET one category 400 invalid id', async () => {
    const categoryId = mongoose.Types.ObjectId();

    const category = new Category({
      _id: categoryId,
      name: 'Test1',
      icon: 'Test1.png',
      user: testUser.user.id,
      default: false,
    });

    await Category.create(category);

    const response = await server
      .get(`${basePath}/${categoryId}test`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(400);
  });

  test('POST create a category ', async () => {
    const response = await server
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${testUser.token}`)
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

  test('POST create a category already present', async () => {
    const category = new Category({
      _id: mongoose.Types.ObjectId(),
      name: 'Test1',
      icon: 'Test1.png',
      user: testUser.user.id,
      default: false,
    });

    await Category.create(category);

    const response = await server
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        name: 'Test1',
        icon: 'Test1.png',
        default: false,
      });

    expect(response.status).toBe(409);
  });

  test('PUT update a category', async () => {
    const categoryId = mongoose.Types.ObjectId();
    const category = new Category({
      _id: categoryId,
      name: 'Test1',
      icon: 'Test1.png',
      user: testUser.user.id,
      default: false,
    });

    await Category.create(category);

    const response = await server
      .put(`${basePath}/${categoryId}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        name: 'Test2',
        icon: 'Test2.png',
        default: false,
      });

    expect(response.status).toBe(200);

    const updatedCategory = await Category.findById(categoryId)
      .exec()
      .then((c) => c)
      .catch(() => null);

    expect(updatedCategory._id.toString()).toBe(categoryId.toString());
    expect(updatedCategory.name).toBe('Test2');
    expect(updatedCategory.icon).toBe('Test2.png');
    expect(updatedCategory.user.toString()).toBe(testUser.user.id);
    expect(updatedCategory.default).toBe(false);
  });

  test('DELETE a category', async () => {
    const categoryId = mongoose.Types.ObjectId();
    const category = new Category({
      _id: categoryId,
      name: 'Test1',
      icon: 'Test1.png',
      user: testUser.user.id,
      default: false,
    });

    await Category.create(category);

    const response = await server
      .delete(`${basePath}/${categoryId}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(200);

    const deletedCategory = await Category.findById(categoryId)
      .exec()
      .then((c) => c)
      .catch(() => null);
    expect(deletedCategory).toBe(null);
  });
});
