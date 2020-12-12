const User = require('../../../models/User');
const Category = require('../../../models/Category');
const Group = require('../../../models/Group');
const Product = require('../../../models/Product');
const Sharing = require('../../../models/Sharing');

const basePath = '/v2/users';

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

async function confirmUser(user) {
  await User.findByIdAndUpdate(user.body.data.user.id, { token: '', blocked: false }).exec();
}

exports.getTestUserAuthToken = async (supertestServer) => {
  await clearUserTable();
  const response = await registerUser(supertestServer);
  await confirmUser(response);
  return loginUser(supertestServer);
};

exports.registerUser = async (supertestServer) => registerUser(supertestServer);

exports.confirmUser = async (user) => confirmUser(user);

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

exports.clearSharingTable = async () => {
  await Sharing.deleteMany({}, () => {
  });
};

exports.clearUserTable = async () => {
  await clearUserTable();
};
