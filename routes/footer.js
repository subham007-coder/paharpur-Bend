const express = require("express");
const {
  addFooterSubitem,
  updateFooterSubitem,
  deleteFooterSubitem,
  createFooterSection,
  getFooterSections, // Route for getting footer sections
} = require("../controllers/footerController");

const mongoose = require("mongoose");

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const { id, subitemId } = req.params;

  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid footer section ID" });
  }
  if (subitemId && !mongoose.Types.ObjectId.isValid(subitemId)) {
    return res.status(400).json({ message: "Invalid subitem ID" });
  }
  next();
};

const router = express.Router();

// Get all footer sections
router.get("/", getFooterSections); // Fetch all footer sections

// Add a subitem to a footer section
router.post("/:id/subitem", validateObjectId, addFooterSubitem);

// Update a subitem in a footer section
router.put("/:id/subitem/:subitemId", validateObjectId, updateFooterSubitem);

// Delete a subitem from a footer section
router.delete("/:id/subitem/:subitemId", validateObjectId, deleteFooterSubitem);

// Create a footer section
router.post("/", createFooterSection);

module.exports = router;
