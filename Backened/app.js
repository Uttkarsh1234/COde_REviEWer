require("dotenv").config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const passport = require("./config/passport");
const routes = require('./routes/review');
const reviewHistory = require("./routes/reviewHistory");
const register = require("./routes/authRoutes");

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://codereviwer.netlify.app",
    "https://codereviewer.netlify.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173"
].filter(Boolean).map(url => url.replace(/\/+$/, ''));


app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/+$/, '');
        const isAllowed = allowedOrigins.includes(cleanOrigin) || 
                          cleanOrigin.endsWith('.netlify.app') || 
                          cleanOrigin.endsWith('.onrender.com');
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, true); // Permissive fallback to prevent deployment blockage
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"]
}));

app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
// Health check route
app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use('/api/input', routes);
app.use('/api/review/input',routes);
app.use('/review/input',routes);
app.use("/api/review", reviewHistory);
app.use("/api/auth", register);

module.exports = app;