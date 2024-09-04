{/* Authentication middleware */}

const jwt = require('jsonwebtoken')
const HttpError = require('../models/errorModel')

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('Token verification error:', err);
                return next(new HttpError("Unauthorized. Invalid Token", 403));
            }
            req.user = decoded;

            next();
        });
    } else {
        return next(new HttpError("Unauthorized. No token", 402));
    }
};



module.exports = authMiddleware