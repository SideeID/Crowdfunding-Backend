const mongoose = require('mongoose');

const mitraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  campaign: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fundraisers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fundraisers',
  }],
});

const mitradb = mongoose.model('mitra', mitraSchema);

module.exports = mitradb;
