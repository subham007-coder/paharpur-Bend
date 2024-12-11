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
    
    // Find existing header to get old logo URL
    const existingHeader = await Header.findOne();
    
    // If there's a new logo, upload it to Cloudinary
    let newLogoUrl = logoUrl;
    if (logoUrl && logoUrl.startsWith('data:image')) {
      // Upload new logo
      newLogoUrl = await uploadToCloudinary(logoUrl, 'headers');
      
      // Delete old logo if it exists
      if (existingHeader && existingHeader.logoUrl) {
        await deleteFromCloudinary(existingHeader.logoUrl);
      }
    }

    // Update header with new logo URL
    const updatedHeader = await Header.findOneAndUpdate(
      {},
      { logoUrl: newLogoUrl, contact, navigationLinks },
      { new: true, upsert: true }
    );

    res.json(updatedHeader);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getHeader, updateHeader };
