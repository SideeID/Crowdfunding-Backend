const passport = require('passport');
// eslint-disable-next-line import/no-extraneous-dependencies
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const Userdb = require('../model/userSchema');

const googleClientId = process.env.CLIENT_ID;
const googleClientSecret = process.env.CLIENT_SECRET;
const { JWT_SECRET } = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: 'https://crowdfunding-backend-drab.vercel.app/auth/google/callback',
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

        user.token = token;

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Userdb.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
