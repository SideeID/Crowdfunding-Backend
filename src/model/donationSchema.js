const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fundraiserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fundraiser',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Donation', donationSchema);
