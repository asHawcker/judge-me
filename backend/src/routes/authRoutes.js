import express from "express";
import passport from "passport";
import { githubCallback } from "../controllers/authController.js";

const router = express.Router();

router.get("/github", passport.authenticate("github", { session: false }));
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  githubCallback
);

export default router;
