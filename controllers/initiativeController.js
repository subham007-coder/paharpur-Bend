const Initiative = require("../models/Initiative");

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
    const initiative = new Initiative(req.body);
    await initiative.save();
    res.status(201).json({ message: "Initiative created successfully", initiative });
  } catch (error) {
    res.status(500).json({ message: "Error creating initiative", error: error.message });
  }
};

// Update an initiative
const updateInitiative = async (req, res) => {
  try {
    const initiative = await Initiative.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!initiative) {
      return res.status(404).json({ message: "Initiative not found" });
    }
    res.status(200).json({ message: "Initiative updated successfully", initiative });
  } catch (error) {
    res.status(500).json({ message: "Error updating initiative", error: error.message });
  }
};

// Delete an initiative
const deleteInitiative = async (req, res) => {
  try {
    const initiative = await Initiative.findByIdAndDelete(req.params.id);
    if (!initiative) {
      return res.status(404).json({ message: "Initiative not found" });
    }
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
