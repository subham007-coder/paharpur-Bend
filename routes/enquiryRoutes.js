const express = require('express');
const router = express.Router();
const { 
    createEnquiry, 
    getAllEnquiries, 
    updateEnquiryStatus, 
    deleteEnquiry 
} = require('../controllers/enquiryController');
const { requireAuth } = require('../middleware/authMiddleware');

// Public route for creating enquiries
router.post('/', createEnquiry);

// Protected routes for admin panel
router.get('/', requireAuth, getAllEnquiries);
router.put('/:id/status', requireAuth, updateEnquiryStatus);
router.delete('/:id', requireAuth, deleteEnquiry);

module.exports = router; 