const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwt_secret_key';

const authenticateTokenCheck = (req, res, next) => {
    // Get token from headers
    const token = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token required' });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        // Attach user information to request
        req.user = user;
        next();
    });
};

module.exports = { authenticateTokenCheck };