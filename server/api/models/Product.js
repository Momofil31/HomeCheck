const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  group: { type: String, required: true },
});

module.exports = mongoose.model('Product', productSchema);