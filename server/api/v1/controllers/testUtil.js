const User = require('../../../models/User');
const Category = require('../../../models/Category');
const Group = require('../../../models/Group');
const Product = require('../../../models/Product');

const basePath = '/v1/users';

const userData = {
  email: 'Test@email.it',
  password: 'Password!234',
  firstname: 'A',
  lastname: 'B',
};

async function clearUserTable() {
  await User.deleteMany({}, () => {
  });
}

async function registerUser(supertestServer) {
  const response = await supertestServer.post(`${basePath}/register`).send(userData);
  if (!response) return {};

  return response;
}

async function loginUser(supertestServer) {
  const response = await supertestServer.post(`${basePath}/login`).send(userData);

  if (!response.body.data.token) return '';

  return response.body.data;
}

exports.getTestUserAuthToken = async (supertestServer) => {
  await clearUserTable();
  await registerUser(supertestServer);
  return loginUser(supertestServer);
};

exports.clearGroupTable = async () => {
  await Group.deleteMany({}, () => {
  });
};

exports.clearCategoryTable = async () => {
  await Category.deleteMany({}, () => {
  });
};

exports.clearProductTable = async () => {
  await Product.deleteMany({}, () => {
  });
};

exports.clearUserTable = async () => {
  await clearUserTable();
};
