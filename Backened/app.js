const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const routes = require('./routes/review');
const reviewHistory = require("./routes/reviewHistory");
const register = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api/input',routes);
app.use("/api/review", reviewHistory);
app.use("/api/auth",register);

module.exports = app;