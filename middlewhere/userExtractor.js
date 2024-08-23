const jwt = require('jsonwebtoken');

const userExtractor = (req, res, next) => {
    try {
        const decodetoken = jwt.verify(req.token, process.env.SECRET);
        req.user = decodetoken;
    } catch (e) {
        next(e);
    }
    next();
}

module.exports = userExtractor;