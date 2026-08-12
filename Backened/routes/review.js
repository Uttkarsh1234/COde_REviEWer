const express = require('express');
const authmiddleware = require("../middleware/authMiddleware");
const route = express.Router();

const controller = require('../controllers/reviewController');

route.post('/', authmiddleware ,controller.reviewCode);

module.exports = route;