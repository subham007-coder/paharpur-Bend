const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in .env");
    process.exit(1);
}

// Middleware to verify if the user is an admin
exports.verifyAdmin = (req, res, next) => {
    const token = req.header('x-auth-token'); // Retrieve token from header
    if (!token) {
        return res.status(401).json({ message: 'No token provided' }); // No token
    }

    try {
        // Verify token using JWT_SECRET
        const verified = jwt.verify(token, JWT_SECRET);
        // Check if the role is admin
        if (verified.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Not an admin' }); // Access denied if not admin
        }

        req.user = verified; // Attach verified user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' }); // Invalid token
    }
};
