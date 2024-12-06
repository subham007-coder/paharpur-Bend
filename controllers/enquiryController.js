const Enquiry = require('../models/Enquiry');

// Create new enquiry
const createEnquiry = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const newEnquiry = new Enquiry({
            name,
            email,
            phone,
            subject,
            message
        });

        await newEnquiry.save();

        res.status(201).json({
            success: true,
            message: 'Enquiry submitted successfully',
            enquiry: newEnquiry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit enquiry',
            error: error.message
        });
    }
};

// Get all enquiries (for admin panel)
const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find()
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json({
            success: true,
            enquiries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enquiries',
            error: error.message
        });
    }
};

// Update enquiry status
const updateEnquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const enquiry = await Enquiry.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: 'Enquiry not found'
            });
        }

        res.json({
            success: true,
            message: 'Enquiry status updated successfully',
            enquiry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update enquiry status',
            error: error.message
        });
    }
};

// Delete enquiry
const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        
        const enquiry = await Enquiry.findByIdAndDelete(id);
        
        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: 'Enquiry not found'
            });
        }

        res.json({
            success: true,
            message: 'Enquiry deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete enquiry',
            error: error.message
        });
    }
};

module.exports = {
    createEnquiry,
    getAllEnquiries,
    updateEnquiryStatus,
    deleteEnquiry
}; 