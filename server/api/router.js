const v1productRoutes = require('./v1/routes/products');
const v1categoryRoutes = require('./v1/routes/categories');
const v1groupRoutes = require('./v1/routes/groups');
const v1userRoutes = require('./v1/routes/users');

const v2productRoutes = require('./v2/routes/products');
const v2categoryRoutes = require('./v2/routes/categories');
const v2groupRoutes = require('./v2/routes/groups');
const v2userRoutes = require('./v2/routes/users');

module.exports = (app) => {
  app.use('/v1/products', v1productRoutes);
  app.use('/v1/categories', v1categoryRoutes);
  app.use('/v1/groups', v1groupRoutes);
  app.use('/v1/users', v1userRoutes);

  app.use('/v2/products', v2productRoutes);
  app.use('/v2/categories', v2categoryRoutes);
  app.use('/v2/groups', v2groupRoutes);
  app.use('/v2/users', v2userRoutes);
};
