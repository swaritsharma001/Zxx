import express from "express";
const router = express.Router();
import User from "../models/user.js";
import passport from "../passport.js";
import {verifyToken, verifyAdmin} from "../jwt/jwt.js";

router.get("/google/login", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// Google callback
router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "https://techinword.tech"
}), (req, res) => {
  // Assuming req.user.token exists after successful login
  res.cookie("token", req.user.token, {
    maxAge:  2 * 60 * 60 * 60 * 1000,
  });
  res.redirect("https://techinword.tech");
});

// Logout
router.get("/logout", verifyToken, (req, res) => {
  res.clearCookie("token");
  res.redirect("https://techinword.tech");
});

// Get user data
router.get("/user", verifyToken, (req, res) => {
  
  res.json(req.user);
});

router.get("/admin", verifyAdmin, (req, res) => {
  res.json(req.user)
})

router.get("/admin/users", verifyAdmin, async(req, res) => {
  const allUsers = await User.find()
  res.status(200).json(allUsers)
})

export default router;