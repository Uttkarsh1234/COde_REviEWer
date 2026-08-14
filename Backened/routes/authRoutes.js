const express = require('express');

const { registerUser, loginUser, getMe, logoutUser } = require("../controllers/authController");
const authmiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authmiddleware, getMe);
router.post("/logout", logoutUser);

module.exports = router;