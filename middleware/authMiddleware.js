const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        console.log('Received token from cookie:', token); // Debug log

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Authentication required' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(401).json({ 
            success: false,
            message: 'Invalid token' 
        });
    }
};

module.exports = { requireAuth };
