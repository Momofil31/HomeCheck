const mongoose = require('mongoose');
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

async function createTestCategory(userId) {
  const category = new Category({
    _id: mongoose.Types.ObjectId(),
    name: 'Test1',
    icon: 'Test1.png',
    user: userId,
    default: false,
  });

  await Category.create(category);

  return category;
}

async function createTestGroup() {
  const group = new Group({
    _id: mongoose.Types.ObjectId(),
    name: 'Test',
  });

  await Group.create(group);

  return group;
}

async function createTestProducts(category, group, userId) {
  const products = [
    new Product({
      name: 'Product1',
      quantity: '4',
      expiryDate: '2020-12-25',
      user: userId,
      category: category._id,
      group: group._id,
    }),
    new Product({
      name: 'Product2',
      quantity: '4',
      expiryDate: '2020-12-25',
      user: userId,
      category: category._id,
      group: group._id,
    }),
    new Product({
      name: 'Product3',
      quantity: '4',
      expiryDate: '2020-12-25',
      user: userId,
      category: category._id,
      group: group._id,
    }),
  ];

  await Product.insertMany(products);
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

exports.createTestCategory = async (userId) => createTestCategory(userId);

exports.createTestGroup = async () => createTestGroup();

exports.createTestProducts = async (category, group, userId) => createTestProducts(category, group, userId);
