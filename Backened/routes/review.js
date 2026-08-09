const express = require('express');
const route = express.Router();

const controller = require('../controllers/reviewController');

route.post('/',controller.reviewCode);

module.exports = route;