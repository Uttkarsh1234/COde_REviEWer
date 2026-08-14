const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const routes = require('./routes/review');
const reviewHistory = require("./routes/reviewHistory");
const register = require("./routes/authRoutes");

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"]
}));

app.use(cookieParser());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use('/api/input', routes);
app.use("/api/review", reviewHistory);
app.use("/api/auth", register);

module.exports = app;