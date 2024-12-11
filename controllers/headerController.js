const Header = require("../models/Header");
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// Get header data from the database
const getHeader = async (req, res) => {
  try {
    const header = await Header.findOne();
    if (!header) {
      return res.status(404).json({ message: "Header data not found" });
    }
    res.json(header);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update header data
const updateHeader = async (req, res) => {
  try {
    const { logoUrl, contact, navigationLinks } = req.body;
    
    // Find existing header
    const existingHeader = await Header.findOne();
    
    // Handle logo upload
    let newLogoUrl = logoUrl;
    if (logoUrl && logoUrl.startsWith('data:image')) {
      // Upload new logo to Cloudinary
      newLogoUrl = await uploadToCloudinary(logoUrl, 'headers');
      
      // Delete old logo if it exists
      if (existingHeader && existingHeader.logoUrl) {
        await deleteFromCloudinary(existingHeader.logoUrl);
      }
    }

    // Prepare the update data
    const updateData = {
      logoUrl: newLogoUrl,
      contact,
      navigationLinks
    };

    // Update or create header
    const updatedHeader = await Header.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    res.json(updatedHeader);
  } catch (error) {
    console.error('Header update error:', error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

module.exports = { getHeader, updateHeader };
