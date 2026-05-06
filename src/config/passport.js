const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../modules/auth/auth.model");

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = await User.findByEmail(email);
        if (!user) {
          return done(null, false, { message: "Email không tồn tại" });
        }

        const validPassword = await User.verifyPassword(password, user.password);
        if (!validPassword) {
          return done(null, false, { message: "Mật khẩu không đúng" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findByGoogleId(profile.id);

        if (!user) {
          const email = profile.emails[0].value;
          user = await User.findByEmail(email);

          if (user) {
            // Link Google ID to existing user
            await require("../config/db").query(
              "UPDATE users SET google_id = $1 WHERE id = $2",
              [profile.id, user.id]
            );
          } else {
            // Create new user from Google
            user = await User.createFromGoogle({
              googleId: profile.id,
              email: email,
              full_name: profile.displayName,
              avatar_url: profile.photos[0]?.value
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;