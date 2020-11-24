const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const groupRoutes = require('./routes/groups');
const userRoutes = require('./routes/users');

module.exports = (app) => {
  app.use('/v1/products', productRoutes);
  app.use('/v1/categories', categoryRoutes);
  app.use('/v1/groups', groupRoutes);
  app.use('/v1/users', userRoutes);
};
