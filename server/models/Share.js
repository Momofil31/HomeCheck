const mongoose = require('mongoose');

const shareSchema = mongoose.Schema({
  // use _id as token value
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Share', shareSchema);
