import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";

dotenv.config();

const githubCallbackURL = `${process.env.SERVER_URL}/auth/github/callback`;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: githubCallbackURL,
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
