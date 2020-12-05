const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true,
  },
  group: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Product', productSchema);
