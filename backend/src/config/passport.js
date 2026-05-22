import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
     
      try {

        // CHECK USER

        let user = await User.findOne({
          email: profile.emails[0].value
        });

        // USER NOT FOUND

        if (!user) {

          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          });

        }

        // USER EXISTS
        
        done(null, user);

      } catch (error) {

        done(error, null);
      }
    }
    
  )
);