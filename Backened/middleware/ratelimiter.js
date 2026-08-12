const ratelimit = require('express-rate-limit');

const ratelimiter = ratelimit({
    windowMs : 15*60*1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many review requests. Please try again later."
    }
});

module.exports = ratelimiter;