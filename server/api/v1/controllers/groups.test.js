const supertest = require('supertest');
const mongoose = require('mongoose');
const util = require('./testUtil');
const app = require('../../../app');
const Group = require('../models/Group');

const request = supertest(app);

const basePath = '/v1/groups';
let token = '';

describe('Test category controller', () => {
  beforeAll(async () => {
    token = await util.getTestUserAuthToken(request);
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
    const response = await request
      .get(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
  });

  test('GetOne should return one group', async () => {
    const groupModel = new Group({
      name: 'Test',
    });
    let groupId = '';
    await groupModel.save((err, res) => {
      groupId = res.id;
    });
    const response = await request
      .get(`${basePath}?${groupId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
