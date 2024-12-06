const express = require("express");
const router = express.Router();
const {
  getAllInitiatives,
  getInitiativeById,
  createInitiative,
  updateInitiative,
  deleteInitiative,
} = require("../controllers/initiativeController");

// Route to fetch all initiatives
router.get("/", getAllInitiatives);

// Route to fetch a specific initiative by ID
router.get("/:id", getInitiativeById);

// Route to create a new initiative
router.post("/", createInitiative);

// Route to update an initiative by ID
router.put("/:id", updateInitiative);

// Route to delete an initiative by ID
router.delete("/:id", deleteInitiative);

module.exports = router;
