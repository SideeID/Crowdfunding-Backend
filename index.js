require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-google-oauth2').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Userdb = require('./src/model/userSchema');
require('./src/db/mongo');

const app = express();
const PORT = process.env.PORT || 6005;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const { JWT_SECRET } = process.env;

const MAX_LOGIN_ATTEMPTS = 5;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(express.json());

app.use(
  session({ secret: 'secret234563', resave: false, saveUninitialized: true }),
);
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(
  new OAuth2Strategy(
    {
      clientID: clientId,
      clientSecret,
      callbackURL:
        'https://crowdfunding-backend-delta.vercel.app/auth/google/callback',
      scope: ['email', 'profile'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Userdb.findOne({ googleId: profile.id });
        if (!user) {
          user = new Userdb({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Userdb.findById(id);
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('API Documentation');
});

app.post('/register', async (req, res) => {
  const { displayName, email, password } = req.body;
  if (!displayName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Please fill all the fields!' });
  }

  try {
    let user = await Userdb.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered!',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new Userdb({ displayName, email, password: hashedPassword });
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: 'Registration successful', user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Please fill all the fields!' });
  }

  try {
    const user = await Userdb.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Email not found!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.loginAttempts = req.session.loginAttempts
        ? req.session.loginAttempts + 1
        : 1;
      if (req.session.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        return res.status(401).json({
          success: false,
          attempts: req.session.loginAttempts,
          message: 'Too many login attempts, try again later!',
        });
      }
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect password' });
    }

    delete req.session.loginAttempts;
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    return res
      .status(200)
      .json({
        success: true, message: 'Login successful', token, user,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'https://your-frontend-domain.vercel.app/dashboard',
    failureRedirect: 'https://your-frontend-domain.vercel.app/login',
  }),
);

app.get('/login/success', (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: 'Authenticated',
      user: req.user,
    });
  }
  return res.status(401).json({ success: false, message: 'Not authenticated' });
});

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect('https://your-frontend-domain.vercel.app');
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
