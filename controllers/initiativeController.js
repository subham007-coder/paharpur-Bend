const Initiative = require("../models/Initiative");
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// Fetch all initiatives
const getAllInitiatives = async (req, res) => {
  try {
    const initiatives = await Initiative.find();
    res.status(200).json(initiatives);
  } catch (error) {
    res.status(500).json({ message: "Error fetching initiatives", error: error.message });
  }
};

// Fetch a single initiative by ID
const getInitiativeById = async (req, res) => {
  try {
    const initiative = await Initiative.findById(req.params.id);
    if (!initiative) {
      return res.status(404).json({ message: "Initiative not found" });
    }
    res.status(200).json(initiative);
  } catch (error) {
    res.status(500).json({ message: "Error fetching initiative", error: error.message });
  }
};

// Create a new initiative
const createInitiative = async (req, res) => {
  try {
    const initiativeData = { ...req.body };
    
    // Handle image upload if present
    if (initiativeData.imageUrl && initiativeData.imageUrl.startsWith('data:image')) {
      initiativeData.imageUrl = await uploadToCloudinary(
        initiativeData.imageUrl, 
        'initiatives'
      );
    }

    const initiative = new Initiative(initiativeData);
    await initiative.save();
    res.status(201).json({ message: "Initiative created successfully", initiative });
  } catch (error) {
    res.status(500).json({ message: "Error creating initiative", error: error.message });
  }
};

// Update an initiative
const updateInitiative = async (req, res) => {
  try {
    const initiativeData = { ...req.body };
    
    // Find existing initiative
    const existingInitiative = await Initiative.findById(req.params.id);
    if (!existingInitiative) {
      return res.status(404).json({ message: "Initiative not found" });
    }

    // Handle image upload if present
    if (initiativeData.imageUrl && initiativeData.imageUrl.startsWith('data:image')) {
      // Upload new image
      initiativeData.imageUrl = await uploadToCloudinary(
        initiativeData.imageUrl, 
        'initiatives'
      );
      
      // Delete old image if it exists
      if (existingInitiative.imageUrl) {
        await deleteFromCloudinary(existingInitiative.imageUrl);
      }
    }

    const initiative = await Initiative.findByIdAndUpdate(
      req.params.id, 
      initiativeData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Initiative updated successfully", initiative });
  } catch (error) {
    res.status(500).json({ message: "Error updating initiative", error: error.message });
  }
};

// Delete an initiative
const deleteInitiative = async (req, res) => {
  try {
    const initiative = await Initiative.findById(req.params.id);
    if (!initiative) {
      return res.status(404).json({ message: "Initiative not found" });
    }

    // Delete image from Cloudinary if it exists
    if (initiative.imageUrl) {
      await deleteFromCloudinary(initiative.imageUrl);
    }

    await Initiative.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Initiative deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting initiative", error: error.message });
  }
};

module.exports = {
  getAllInitiatives,
  getInitiativeById,
  createInitiative,
  updateInitiative,
  deleteInitiative,
};
