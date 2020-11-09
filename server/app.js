const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

const app = express();

app.use(morgan('dev')); // Logs HTTP requests in node shell

// Handling CORS errors with cors package
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

// Error 404 specific handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Generic error handling
app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
