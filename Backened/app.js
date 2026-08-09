const express = require('express');
const cors = require('cors');

const routes = require('./routes/review');
const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/review',routes);

module.exports = app;