const supertest = require('supertest');
const mongoose = require('mongoose');
const util = require('./testUtil');
const app = require('../../../app');
const Category = require('../../../models/Category');

const server = supertest(app);

const basePath = '/v1/categories';
let testUser;

describe('Test category controller', () => {
  beforeAll(async () => {
    testUser = await util.getTestUserAuthToken(server);
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

    await category.save();

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

    await category.save();

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

    await category.save();

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
});
