const Banner = require("../models/Banner");
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// Get banner data from the database
const getBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne();
    if (!banner) {
      return res.status(200).json({ imageUrl: "", overlayText: "" });
    }
    res.json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update banner data
const updateBanner = async (req, res) => {
  try {
    const { imageUrl, overlayText } = req.body;
    
    // Find existing banner to get old image URL
    const existingBanner = await Banner.findOne();
    
    // If there's a new image, upload it to Cloudinary
    let newImageUrl = imageUrl;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      // Upload new image
      newImageUrl = await uploadToCloudinary(imageUrl, 'banners');
      
      // Delete old image if it exists
      if (existingBanner && existingBanner.imageUrl) {
        await deleteFromCloudinary(existingBanner.imageUrl);
      }
    }

    // Update banner with new image URL
    const updatedBanner = await Banner.findOneAndUpdate(
      {},
      { imageUrl: newImageUrl, overlayText },
      { new: true, upsert: true }
    );

    res.json(updatedBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new banner
const createBanner = async (req, res) => {
  try {
    const { imageUrl, overlayText } = req.body;

    // Create a new banner instance
    const newBanner = new Banner({ imageUrl, overlayText });

    // Save the new banner to the database
    await newBanner.save();

    res.status(201).json(newBanner); // Respond with the created banner
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getBanner, updateBanner, createBanner }; 