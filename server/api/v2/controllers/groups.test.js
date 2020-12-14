const supertest = require('supertest');
const mongoose = require('mongoose');
const util = require('./testUtil');
const app = require('../../../app');
const Group = require('../../../models/Group');

const request = supertest(app);

const basePath = '/v2/groups';
let token = '';

describe('Test group controller', () => {
  beforeAll(async () => {
    const testUser = await util.getTestUserAuthToken(request);
    token = testUser.token;
  });

  beforeEach(async () => {
    await util.clearGroupTable();
  });

  afterAll(async (done) => {
    await mongoose.disconnect();
    done();
  });

  test('GET list of groups 200', async () => {
    const groups = [
      new Group({
        name: 'Test1',
      }),
      new Group({
        name: 'Test2',
      }),
      new Group({
        name: 'Test3',
      }),
    ];

    await Group.insertMany(groups);

    const response = await request
      .get(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    console.log(response.body);
    expect(response.status).toBe(200);
  });

  test('GET one group 200', async () => {
    const groupId = mongoose.Types.ObjectId();

    const groupModel = new Group({
      _id: groupId,
      name: 'Test',
    });

    await Group.create(groupModel);

    const response = await request
      .get(`${basePath}/${groupId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  test("GET one group 400 - doesn't exist", async () => {
    const groupId = mongoose.Types.ObjectId();

    const groupModel = new Group({
      _id: groupId,
      name: 'Test',
    });

    await Group.create(groupModel);

    const response = await request
      .get(`${basePath}/${mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('GET one group 400 - groupId is invalid', async () => {
    const groupId = mongoose.Types.ObjectId();

    const groupModel = new Group({
      _id: groupId,
      name: 'Test',
    });

    await Group.create(groupModel);

    const response = await request
      .get(`${basePath}/${'jkhgfgdfsaetyr6u7565wrsdgf'}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
