const express = require("express");
const router = express.Router();
const { getHeader, updateHeader } = require("../controllers/headerController");
const { requireAuth } = require("../middleware/authMiddleware");

// Public route to get header data
router.get("/", getHeader);

// Protected route to update header data
router.post("/update", requireAuth, updateHeader);

module.exports = router;
