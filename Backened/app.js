const express = require('express');
const cors = require('cors');

const routes = require('./routes/review');
const reviewHistory = require("./routes/reviewHistory");
const register = require("./routes/authRoutes");

const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/input',routes);
app.use("/api/review", reviewHistory);
app.use("/api/auth",register);

module.exports = app;