const mongoose = require('mongoose');

const sharingSchema = mongoose.Schema({
  // use _id as token value
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Sharing', sharingSchema);
