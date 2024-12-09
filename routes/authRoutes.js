const express = require('express');
const { register, login, logout, checkAuth, getAllAdmins, getCurrentUser } = require('../controllers/authController');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');

// Register User
router.post('/register', register);

// Login User
router.post('/login', login); // Directly use the login function from authController

// Logout User
router.post('/logout', logout);

// Check Authentication
// router.get('/check-auth', checkAuth);

// Get All Admins
router.get('/admins', requireAuth, getAllAdmins);

// Get Current User
router.get('/current-user', getCurrentUser);

module.exports = router;
