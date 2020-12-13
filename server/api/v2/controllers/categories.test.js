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

  test('GET one category 403 unathorized user', async () => {
    const categoryId = mongoose.Types.ObjectId();

    const category = new Category({
      _id: categoryId,
      name: 'Test1',
      icon: 'Test1.png',
      user: testUser.user.id,
      default: false,
    });

    await Category.create(category);

    const differentTestUser = await util.getTestUserAuthToken(server);

    const response = await server
      .get(`${basePath}/${categoryId}`)
      .set('Authorization', `Bearer ${differentTestUser.token}`)
      .send();

    expect(response.status).toBe(403);
  });

  test('POST create a category should succeed because category already exists but belongs to a different user', async () => {
    const newUser = await util.getTestUserAuthToken(server);

    const category = new Category({
      _id: mongoose.Types.ObjectId(),
      name: 'Category',
      icon: 'category.png',
      user: newUser.user.id,
      default: false,
    });

    await Category.create(category);
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

  test('PUT update a category should fail because name and icon are not filled in', async () => {
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
      .put(`${basePath}/${categoryId.toString()}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        name: '',
        icon: '',
        default: false,
      });

    const desiredResponse = {
      error: {
        message: 'Update failed.',
        description: 'Name or icon are not filled in with the corresponding data.',
      },
    };
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test("PUT update category should fail because category doesn't exists", async () => {
    const categoryId = mongoose.Types.ObjectId();
    const category = new Category({
      _id: categoryId,
      name: 'Test1',
      icon: 'Test1.png',
      user: testUser.user.id,
      default: false,
    });

    await Category.create(category);

    const notExistingCategoryId = mongoose.Types.ObjectId();
    const response = await server
      .put(`${basePath}/${notExistingCategoryId.toString()}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        name: 'Test1',
        icon: 'Test1.png',
        default: false,
      });
    const desiredResponse = {
      error: {
        message: 'Update failed',
        description: 'Category not found',
      },
    };
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(desiredResponse);
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

  test("DELETE category should fail because category doesn't exist", async () => {
    const categoryId = mongoose.Types.ObjectId();
    const category = new Category({
      _id: categoryId,
      name: 'Test1',
      icon: 'Test1.png',
      user: testUser.user.id,
      default: false,
    });

    await Category.create(category);

    const notExistingCategoryId = mongoose.Types.ObjectId();

    const response = await server
      .delete(`${basePath}/${notExistingCategoryId}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    const desiredResponse = {
      error: {
        message: 'Deletion failed',
        description: 'Category not found',
      },
    };

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test('DELETE category should fail because user is not authorized to delete', async () => {
    const categoryId = mongoose.Types.ObjectId();
    const category = new Category({
      _id: categoryId,
      name: 'Test1',
      icon: 'Test1.png',
      user: testUser.user.id,
      default: false,
    });

    await Category.create(category);

    const newUser = await util.getTestUserAuthToken(server);

    const response = await server
      .delete(`${basePath}/${categoryId}`)
      .set('Authorization', `Bearer ${newUser.token}`)
      .send();

    const desiredResponse = {
      error: {
        message: 'Deletion failed.',
        description: `User not authorized to delete category ${category.name}.`,
      },
    };

    expect(response.status).toBe(403);
    expect(response.body).toMatchObject(desiredResponse);
  });

  test('DELETE category should succeed', async () => {
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
