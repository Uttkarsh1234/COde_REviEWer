const express = require('express');
const authmiddleware = require("../middleware/authMiddleware");
const route = express.Router();

const controller = require('../controllers/reviewController');
const ratelimiter = require('../middleware/ratelimiter');

route.post('/', authmiddleware ,ratelimiter,controller.reviewCode);

module.exports = route;