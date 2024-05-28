const express = require('express');
const passport = require('passport');
const { loginSuccess, logout } = require('../controllers/authController');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
  }),
  (req, res) => {
    const { token } = req.user;
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  },
);

router.get('/login/success', loginSuccess);
router.get('/logout', logout);

module.exports = router;
