const supertest = require('supertest');
const mongoose = require('mongoose');
const util = require('./testUtil');
const app = require('../../../app');
const Sharing = require('../../../models/Sharing');

const server = supertest(app);

const basePath = '/v2/sharing';
let testUser;

describe('Test sharing controller', () => {
  beforeAll(async () => {
    testUser = await util.getTestUserAuthToken(server);
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
});
