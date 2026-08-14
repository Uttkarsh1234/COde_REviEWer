const jwt = require('jsonwebtoken');

const middle = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization) {
            if (req.headers.authorization.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            } else {
                token = req.headers.authorization;
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        const decodetoken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            userId: decodetoken.userId,
            id: decodetoken.userId
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed or token expired"
        });
    }
};

module.exports = middle;