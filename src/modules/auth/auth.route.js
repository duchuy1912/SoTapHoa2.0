const express = require("express");
const router = express.Router();
const passport = require("passport");
const controller = require("./auth.controller");

// Local routes
router.get("/login", controller.showLogin);
router.post("/login", passport.authenticate("local", { 
  failureRedirect: "/auth/login",
  failureMessage: true 
}), controller.login);

router.get("/register", controller.showRegister);
router.post("/register", controller.register);

router.get("/logout", controller.logout);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  controller.googleCallback
);

module.exports = router;