"use strict";

const express = require("express");
const { google } = require("googleapis");
const { getOAuth2Client, OAUTH_SCOPES } = require("../config/google");
const GoogleAccount = require("../models/GoogleAccount");
const { getEnv } = require("../config/env");
const router = express.Router();

router.get("/google", (_req, res) => {
  const oauth2Client = getOAuth2Client();
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: OAUTH_SCOPES,
  });
  return res.redirect(authUrl);
});

router.get("/google/callback", async (req, res, next) => {
  try {
    const code = req.query.code;
    if (!code) {
      const err = new Error("Missing code");
      err.status = 400;
      throw err;
    }
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.refresh_token) {
      // If no refresh token, ask for consent again
      return res.redirect("/auth/google");
    }
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: me } = await oauth2.userinfo.get();

    const googleUserId = me.id; // Google's unique subject
    const email = me.email;
    const displayName = me.name || me.given_name || "";

    await GoogleAccount.findOneAndUpdate(
      { googleUserId },
      {
        googleUserId,
        email,
        displayName,
        refreshToken: tokens.refresh_token,
        tokenScope: Array.isArray(tokens.scope)
          ? tokens.scope.join(" ")
          : tokens.scope,
        lastLoginAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    req.session.userId = googleUserId;

    // Redirect to client app or a simple success page
    const { CLIENT_ORIGIN } = getEnv();
    return res.redirect(CLIENT_ORIGIN);
  } catch (err) {
    return next(err);
  }
});

router.get("/success", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("Not authenticated");
  }
  const { CLIENT_ORIGIN } = getEnv();
  return res.redirect(CLIENT_ORIGIN);
  // return res.send("Authentication successful. You may close this window.");
});

router.get("/me", (req, res) => {
  if (!req.session.userId) {
    return res.json({ authenticated: false });
  }
  return res.json({ authenticated: true, userId: req.session.userId });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    return res.json({ ok: true });
  });
});

module.exports = router;
