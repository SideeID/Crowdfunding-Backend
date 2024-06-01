const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { loginSuccess, logout } = require('../controllers/authController');

const { JWT_SECRET } = process.env;
const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      JWT_SECRET,
      { expiresIn: '3h' },
    );
    res.redirect(`http://localhost:5173/auth/google/callback?token=${token}`);
  },
);

router.get('/login/success', loginSuccess);
router.get('/logout', logout);

module.exports = router;
