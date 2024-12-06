const express = require("express");
const router = express.Router();
const { getHeader, updateHeader } = require("../controllers/headerController");

// Route to get header data
router.get("/", getHeader);

// Route to update header data
router.post("/update", updateHeader);

module.exports = router;
