const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  name: { type: String, required: true },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Group', groupSchema);
