const mongoose = require('mongoose');

const fundraiserSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    goal: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  { timestamps: true },
);

// eslint-disable-next-line func-names
fundraiserSchema.virtual('remainingDays').get(function () {
  const now = new Date();
  const end = new Date(this.endDate);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
});

module.exports = mongoose.model('Fundraiser', fundraiserSchema);
