import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./models/user.js";
import createToken from "./jwt/jwt.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.cliendId,
      clientSecret: process.env.clientSecret,
      callbackURL: `https://techinword.tech/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Find user by email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Generate token and attach to user object
          const token = await createToken(user);
          user.token = token;
          return done(null, user);
        }

        // Create a new user if not found
        const newUser = await User.create({
          id: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          role: "USER",
          avatar: profile.photos[0].value,
        });

        // Generate token for the new user
        const token = await createToken(newUser);
        newUser.token = token;
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});


export default passport