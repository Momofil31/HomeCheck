const User = require('../models/User');

const basePath = '/v1/users';

const userData = {
  email: 'Test@email.it',
  password: 'Password!234',
  firstname: 'A',
  lastname: 'B',
};

function clearUserTable() {
  User.deleteMany({}, (err) => {
    if (err) {
      console.log('collection not removed');
    } else {
      console.log('collection removed');
    }
  });
}

async function registerUser(supertestServer) {
  const user = await supertestServer.post(`${basePath}/register`).send(userData);
  if (!user) return {};

  return user;
}

async function loginUser(supertestServer) {
  const response = await supertestServer.post(`${basePath}/login`).send(userData);

  if (!response.body.data.token) return '';

  return response.body.data;
}

exports.getTestUserAuthToken = async (supertestServer) => {
  clearUserTable();
  await registerUser(supertestServer);
  return loginUser(supertestServer);
};
