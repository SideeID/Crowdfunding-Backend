const passport = require('passport');
const OAuth2Strategy = require('passport-google-oauth2').Strategy;
const jwt = require('jsonwebtoken');
const Userdb = require('../model/userSchema');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const { JWT_SECRET } = process.env;

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientId,
      clientSecret,
      callbackURL:
        'https://crowdfunding-backend-drab.vercel.app/auth/google/callback',
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
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
          expiresIn: '1h',
        });
        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((data, done) => done(null, { id: data.user.id, token: data.token }));
passport.deserializeUser(async (data, done) => {
  try {
    const user = await Userdb.findById(data.id);
    return done(null, { user, token: data.token });
  } catch (error) {
    return done(error, null);
  }
});
