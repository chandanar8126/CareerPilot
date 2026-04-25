const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: "google-oauth-" + profile.id,
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || profile.username + '@github.com';

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: profile.displayName || profile.username,
        email,
        password: 'github-oauth-' + profile.id,
        avatar: profile.photos?.[0]?.value // 🔥 add this (upgrade)
      });
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:3000/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const user = JSON.stringify({ id: req.user._id, name: req.user.name, email: req.user.email });
    res.redirect(`http://localhost:3000/auth/success?token=${token}&user=${encodeURIComponent(user)}`);
  }
);

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const user = JSON.stringify({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    });

    res.redirect(`http://localhost:3000/auth/success?token=${token}&user=${encodeURIComponent(user)}`);
  }
);

module.exports = { router, passport };