const supertest = require('supertest');
const mongoose = require('mongoose');
const util = require('./testUtil');
const app = require('../../../app');
const Sharing = require('../../../models/Sharing');
const Products = require('../../../models/Product');

const server = supertest(app);

const basePath = '/v2/sharing';
let testUser;

describe('Test sharing controller', () => {
  beforeAll(async () => {
    testUser = await util.getTestUserAuthToken(server);
    await util.clearGroupTable();
    await util.clearCategoryTable();
    await util.clearProductTable();
    const category = await util.createTestCategory(testUser.user.id);
    const group = await util.createTestGroup();
    await util.createTestProducts(category, group, testUser.user.id);
  });

  beforeEach(async () => {
    await util.clearSharingTable();
  });

  afterAll(async (done) => {
    await mongoose.disconnect();
    done();
  });

  test('GET sharing token', async () => {
    const sharing = {
      _id: mongoose.Types.ObjectId(),
      user: testUser.user.id,
    };

    await Sharing.create(sharing);

    const response = await server
      .get(`${basePath}/token`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.data.sharing.token).toBe(sharing._id.toString());
  });

  test('GET sharing token 404', async () => {
    const response = await server
      .get(`${basePath}/token`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(404);
  });

  test('POST generate sharing token', async () => {
    const response = await server
      .post(`${basePath}/token`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      data: {
        message: expect.stringMatching(/.*/),
        sharing: {
          token: expect.stringMatching(/.*/),
          request: expect.anything(),
        },
      },
    });

    const sharing = await Sharing.findOne({ user: testUser.user.id })
      .exec()
      .then((token) => token)
      .catch(() => null);

    expect(response.body.data.sharing.token).toBe(sharing._id.toString());
  });

  test('POST sharing token already present', async () => {
    const sharing = {
      _id: mongoose.Types.ObjectId(),
      user: testUser.user.id,
    };

    await Sharing.create(sharing);

    const response = await server
      .post(`${basePath}/token`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(409);
  });

  test('DELETE sharing token', async () => {
    const sharing = {
      _id: mongoose.Types.ObjectId(),
      user: testUser.user.id,
    };

    await Sharing.create(sharing);

    const response = await server
      .delete(`${basePath}/token`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.data.sharing.token).toBe(sharing._id.toString());

    const sharingToken = await Sharing.findOne({ user: testUser.user.id })
      .exec()
      .then((token) => token)
      .catch(() => null);

    // no token in db
    expect(sharingToken).toBe(null);
  });

  test('DELETE sharing token not present', async () => {
    const response = await server
      .delete(`${basePath}/token`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response.status).toBe(404);

    const sharingToken = await Sharing.findOne({ user: testUser.user.id })
      .exec()
      .then((token) => token)
      .catch(() => null);

    // no token in db
    expect(sharingToken).toBe(null);
  });

  test('GET GetList shared products should succeed', async () => {
    const sharing = {
      _id: mongoose.Types.ObjectId(),
      user: testUser.user.id,
    };
    await Sharing.create(sharing);

    const response = await server
      .get(`${basePath}/${sharing._id}/products`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.data.products.length).toBe(3);
  });

  test('GET GetList shared products should failed when token is deleted', async () => {
    const sharing = {
      _id: mongoose.Types.ObjectId(),
      user: testUser.user.id,
    };
    await Sharing.create(sharing);

    // product shared correctly
    const response = await server
      .get(`${basePath}/${sharing._id}/products`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.data.products.length).toBe(3);

    // delete token
    const response2 = await server
      .delete(`${basePath}/token`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send();

    expect(response2.status).toBe(200);

    // error when access to products
    const response3 = await server
      .get(`${basePath}/${sharing._id}/products`)
      .send();

    expect(response3.status).toBe(403);
  });

  test('GET GetOne shared product should succeed', async () => {
    const sharing = {
      _id: mongoose.Types.ObjectId(),
      user: testUser.user.id,
    };
    await Sharing.create(sharing);

    const productToFind = await Products.find()
      .exec()
      .then((products) => products[0]);

    const response = await server
      .get(`${basePath}/${sharing._id}/products/${productToFind._id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.data.product.id).toBe(productToFind._id.toString());
  });
});
