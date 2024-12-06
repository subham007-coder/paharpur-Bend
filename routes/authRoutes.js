const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    logout, 
    checkAuth,
    getAllAdmins 
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check-auth', checkAuth);
router.get('/admins', getAllAdmins);

module.exports = router;
