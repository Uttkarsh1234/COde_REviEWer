const express = require('express');
const cors = require('cors');

const routes = require('./routes/review');
const reviewHistory = require("./routes/reviewHistory");

const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/input',routes);
app.use("/api/reviews", reviewHistory);

module.exports = app;