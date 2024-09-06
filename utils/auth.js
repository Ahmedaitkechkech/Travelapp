const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ClientSchema  = require("../src/models/ClientSchema");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:2002/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await ClientSchema.findOne({ googleId: profile.id });
      if (!user) {
        user = new ClientSchema({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName,
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      console.error('Error during authentication:', err);
      return done(err, false);
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await ClientSchema.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
