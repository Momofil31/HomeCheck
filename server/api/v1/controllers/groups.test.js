const supertest = require('supertest');
const mongoose = require('mongoose');
const util = require('./testUtil');
const app = require('../../../app');
const Group = require('../models/Group');

const request = supertest(app);

const basePath = '/v1/groups';
let token = '';

describe('Test group controller', () => {
  beforeAll(async () => {
    const testUser = await util.getTestUserAuthToken(request);
    token = testUser.token;
  });

  beforeEach(async () => {
    // clear table
    Group.deleteMany({}, (err) => {
      if (err) {
        console.log('GROUP collection not removed');
      } else {
        console.log('GROUP collection removed');
      }
    });
  });

  afterAll((done) => {
    mongoose.connection.close();
    done();
  });

  test('GetList should return list of groups', async () => {
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

  test('GetOne should return one group', async () => {
    const groupId = mongoose.Types.ObjectId();

    const groupModel = new Group({
      _id: groupId,
      name: 'Test',
    });

    await groupModel.save();

    const response = await request
      .get(`${basePath}/${groupId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  test("GetOne should fail because requested group doesn't exist", async () => {
    const groupId = mongoose.Types.ObjectId();

    const groupModel = new Group({
      _id: groupId,
      name: 'Test',
    });

    await groupModel.save();

    const response = await request
      .get(`${basePath}/${mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
  test('GetOne should fail because groupId is not valid', async () => {
    const groupId = mongoose.Types.ObjectId();

    const groupModel = new Group({
      _id: groupId,
      name: 'Test',
    });

    await groupModel.save();

    const response = await request
      .get(`${basePath}/${'jkhgfgdfsaetyr6u7565wrsdgf'}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
