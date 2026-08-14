const express = require('express');
const passport = require('../config/passport');

const { registerUser, loginUser, getMe, logoutUser, googleAuthCallback } = require("../controllers/authController");
const authmiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authmiddleware, getMe);
router.post("/logout", logoutUser);

// Google OAuth routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/?auth_error=google_failed`
    }),
    googleAuthCallback
);

module.exports = router;