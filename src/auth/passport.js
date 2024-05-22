const passport = require('passport');
const OAuth2Strategy = require('passport-google-oauth2').Strategy;
const Userdb = require('../model/userSchema');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

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
