const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    displayName: String,
    email: String,
    image: String,
    password: String,
  },
  { timestamps: true }
);

const userdb = mongoose.model('users', userSchema);

module.exports = userdb;