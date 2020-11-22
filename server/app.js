const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

if (process.env.JEST_WORKER_ID) {
  // test
  mongoose.connect(
    process.env.DATABASE_TEST,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) console.log(err);
      else console.log('Database connection successful');
    },
  );
} else {
  // production
  mongoose.connect(
    process.env.DATABASE,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) console.log(err);
      else console.log('Database connection successful');
    },
  );
}

app.use(morgan('dev')); // Logs HTTP requests in node shell
app.use(express.urlencoded({ extended: false })); // Parses URLs
app.use(express.json()); // Parses JSON

// Handling CORS errors with cors package
app.use(cors());

// versioning routes
require('./api/v1/router')(app, express); // v1 API

// Error 404 specific handling
app.use((req, res, next) => {
  const error = new Error('404 Not Found!');
  error.status = 404;
  next(error);
});

// Generic error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      description: error.status === 404 ? 'Cannot find the resource you are looking for.' : '',
    },
  });
});

module.exports = app;
