const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const passport = require("./config/passport");
const routes = require('./routes/review');
const reviewHistory = require("./routes/reviewHistory");
const register = require("./routes/authRoutes");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"]
}));

app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use('/api/input', routes);
app.use("/api/review", reviewHistory);
app.use("/api/auth", register);

module.exports = app;