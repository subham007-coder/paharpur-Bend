const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '7d'; // Fallback to 7d if not defined in .env

if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in .env. Authentication will not work.");
    process.exit(1);
}

// Helper function to generate token and set cookie
const generateTokenAndSetCookie = (user, res, expiresIn = TOKEN_EXPIRY) => {
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction, // Only secure cookies in production
        sameSite: 'none',
        maxAge: expiresIn === '24h' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // Adjust maxAge based on expiry
        path: '/',
    });

    return token;
};

// Register User
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: existingUser.email === email ? 
                    'Email already in use' : 
                    'Username already taken' 
            });
        }

        // Validate role
        if (!['admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid role. Please specify either admin or superadmin.' 
            });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        // Generate token and set cookie
        const token = generateTokenAndSetCookie(newUser, res);

        res.status(201).json({ 
            success: true,
            message: 'User registered successfully',
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            isAuthenticated: true
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: 'Registration failed',
            error: err.message 
        });
    }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide both email and password' 
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' // Don't specify whether email or password is wrong
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' // Same as above, don't specify password
            });
        }

        // Generate token and set cookie
        const token = generateTokenAndSetCookie(user, res, '24h');

        // Set session data
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        // Ensure cookie is set before sending response
        await new Promise(resolve => setTimeout(resolve, 100));

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false,
            message: 'Login failed',
            error: err.message 
        });
    }
};

// Logout User
const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            path: '/',
            expires: new Date(0)
        });

        // Destroy session
        req.session.destroy((err) => {
            if (err) {
                throw new Error('Error destroying session');
            }
        });

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (err) {
        // Handle any errors
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: err.message
        });
    }
};

// Export the logout function if needed
module.exports = { logout };

// Check Authentication
// const checkAuth = async (req, res) => {
//     try {
//         // Retrieve token from cookies
//         const token = req.cookies?.token;

//         // If no token is present, return an unauthenticated response
//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 authenticated: false,
//                 message: 'Authentication token is missing'
//             });
//         }

//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is properly configured in your environment variables

//         // Fetch user details from the database using the decoded token's user ID
//         const user = await User.findById(decoded.id).select('-password'); // Exclude password for security reasons

//         // If no user is found, return an unauthenticated response
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 authenticated: false,
//                 message: 'User not found'
//             });
//         }

//         // Authentication successful, return user details
//         res.status(200).json({
//             success: true,
//             authenticated: true,
//             user: {
//                 username: user.username,
//                 email: user.email,
//                 role: user.role
//             }
//         });
//     } catch (err) {
//         console.error('Authentication error:', err.message);
        
//         // Handle specific errors
//         if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
//             return res.status(401).json({
//                 success: false,
//                 authenticated: false,
//                 message: 'Invalid or expired token'
//             });
//         }

//         // Default error response
//         res.status(500).json({
//             success: false,
//             authenticated: false,
//             message: 'An error occurred while verifying authentication'
//         });
//     }
// };


// Get All Admin Accounts
const getAllAdmins = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, JWT_SECRET);
        const currentUserId = decoded.id;

        const admins = await User.find({ 
            role: { $in: ['admin', 'superadmin'] } 
        }).select('_id username email role');

        const formattedAdmins = admins.map(admin => {
            const adminObj = {
                _id: admin._id,
                username: admin.username,
                role: admin.role
            };

            if (admin._id.toString() === currentUserId) {
                adminObj.email = admin.email;
            }

            return adminObj;
        });

        res.json({
            success: true,
            admins: formattedAdmins
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch admin accounts',
            error: err.message 
        });
    }
};

// Get Current User
const getCurrentUser = async (req, res) => {
    try {
        // Directly use req.user if it's populated by middleware (i.e., requireAuth)
        const user = await User.findById(req.user._id).select('-password -__v');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    // checkAuth,
    getAllAdmins,
    getCurrentUser
};
