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
    (req, res, next) => {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            return res.status(503).json({ success: false, message: "Google OAuth is not configured on the server" });
        }
        passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
    }
);

router.get(
    "/google/callback",
    (req, res, next) => {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/?auth_error=google_not_configured`);
        }
        passport.authenticate("google", {
            session: false,
            failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/?auth_error=google_failed`
        })(req, res, next);
    },
    googleAuthCallback
);

module.exports = router;