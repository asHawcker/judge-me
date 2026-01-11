import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
      scope: ["user:read", "repo"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        username: profile.username,
        displayname: profile.displayname,
        photos: profile.photos,
        githubToken: accessToken,
      };
      return done(null, user);
    }
  )
);

export default passport;
