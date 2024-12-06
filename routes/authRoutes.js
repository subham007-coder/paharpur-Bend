const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    logout, 
    checkAuth,
    getAllAdmins,
    getCurrentUser
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check-auth', checkAuth);
router.get('/admins', requireAuth, getAllAdmins);
router.get('/current-user', requireAuth, getCurrentUser);

// Example route for checking authentication
router.get('/check-auth', (req, res) => {
    // Logic to check if the user is authenticated
    if (req.isAuthenticated()) {
        return res.status(200).json({ message: 'Authenticated' });
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router;
