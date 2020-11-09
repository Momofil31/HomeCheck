const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(`mongodb+srv://filippo:${process.env.MONGO_ATLAS_PW}@api.iknun.mongodb.net/API?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) console.log(err);
  else console.log('Database connection successful');
});

app.use(morgan('dev')); // Logs HTTP requests in node shell
app.use(express.urlencoded({ extended: false })); // Parses URLs
app.use(express.json()); // Parses JSON

// Handling CORS errors with cors package
app.use(cors());

app.get('/', (req, res) => {
  if (mongoose.con) res.status(200).json({ message: 'ok' });
});

// Error 404 specific handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Generic error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
