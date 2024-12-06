const Banner = require("../models/Banner");

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

    // Find and update the banner data in the database
    const updatedBanner = await Banner.findOneAndUpdate(
      {},
      { imageUrl, overlayText },
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