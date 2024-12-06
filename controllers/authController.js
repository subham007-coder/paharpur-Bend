const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '7d';

if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in .env");
    process.exit(1);
}

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

        // Validate role (only allow admin or superadmin if the user is an admin)
        if (role && !['admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid role specified' 
            });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password,
            role: role || 'user' // Default to 'user' if no role is provided
        });

        await newUser.save();

        // Create token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure based on environment
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

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
            error: 'Internal server error' // Avoid exposing error details
        });
    }
};

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
                message: 'Invalid email or password' 
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY } // Use consistent expiry
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure based on environment
            sameSite: 'none',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            },
            token // Optionally send token in response
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false,
            message: 'Login failed',
            error: 'Internal server error' // Avoid exposing error details
        });
    }
};

const logout = async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure based on environment
            sameSite: 'none',
            path: '/',
            expires: new Date(0)
        });

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: 'Internal server error' // Avoid exposing error details
        });
    }
};

const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                authenticated: false 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                authenticated: false 
            });
        }

        res.json({
            success: true,
            authenticated: true,
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(401).json({ 
            success: false,
            authenticated: false,
            message: 'Invalid token'
        });
    }
};

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
            error: 'Internal server error' // Avoid exposing error details
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password -__v'); // Exclude password and version key

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
        console.error('Error in getCurrentUser:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: 'Internal server error' // Avoid exposing error details
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    checkAuth,
    getAllAdmins,
    getCurrentUser
};
