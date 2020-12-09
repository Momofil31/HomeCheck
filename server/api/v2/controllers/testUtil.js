const User = require('../../../models/User');
const Category = require('../../../models/Category');
const Group = require('../../../models/Group');
const Product = require('../../../models/Product');

const basePath = '/v2/users';

const userData = {
  email: 'Test@email.it',
  password: 'Password!234',
  firstname: 'A',
  lastname: 'B',
};

function clearUserTable() {
  User.deleteMany({}, (err) => {
    if (err) {
      // console.log('collection not removed');
    } else {
      // console.log('collection removed');
    }
  });
}

async function registerUser(supertestServer) {
  const response = await supertestServer.post(`${basePath}/register`).send(userData);
  if (!response) return {};

  return response;
}
async function loginUser(supertestServer) {
  const response = await supertestServer.post(`${basePath}/login`).send(userData);

  console.log(response.body);

  if (!response.body.data.token) return '';

  return response.body.data;
}

async function confirmUser(user) {
  await User.findByIdAndUpdate(user.body.data.user.id, { token: '', blocked: false }).exec();
}

exports.getTestUserAuthToken = async (supertestServer) => {
  clearUserTable();
  const response = await registerUser(supertestServer);
  await confirmUser(response);
  return loginUser(supertestServer);
};

exports.registerUser = async (supertestServer) => registerUser(supertestServer);

exports.confirmUser = async (user) => confirmUser(user);
exports.clearGroupTable = () => {
  Group.deleteMany({}, (err) => {
    if (err) {
      // console.log('collection not removed');
    } else {
      // console.log('collection removed');
    }
  });
};

exports.clearCategoryTable = () => {
  Category.deleteMany({}, (err) => {
    if (err) {
      // console.log('collection not removed');
    } else {
      // console.log('collection removed');
    }
  });
};

exports.clearProductTable = () => {
  Product.deleteMany({}, (err) => {
    if (err) {
      // console.log('collection not removed');
    } else {
      // console.log('collection removed');
    }
  });
};
