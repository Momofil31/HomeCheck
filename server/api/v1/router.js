const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');

module.exports = function (app, express) {
  app.use('/v1/products', productRoutes);
  app.use('/v1/categories', categoryRoutes);
  app.use('/v1/users', userRoutes);
};
