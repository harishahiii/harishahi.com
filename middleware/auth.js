const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }
    } catch (err) {
        next(err);
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'User role is not authorized to access this route'
            });
        }
        next();
    };
};

// Rate limiting for specific routes
exports.rateLimit = (windowMs, max) => {
    const requests = new Map();
    
    return (req, res, next) => {
        const now = Date.now();
        const ip = req.ip;
        
        // Clean old entries
        for (let [key, value] of requests) {
            if (now - value.timestamp > windowMs) {
                requests.delete(key);
            }
        }
        
        // Check current IP
        if (!requests.has(ip)) {
            requests.set(ip, {
                count: 1,
                timestamp: now
            });
        } else {
            const current = requests.get(ip);
            if (current.count >= max) {
                return res.status(429).json({
                    success: false,
                    error: 'Too many requests, please try again later'
                });
            }
            current.count++;
        }
        
        next();
    };
}; 