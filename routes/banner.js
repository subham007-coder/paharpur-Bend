const express = require("express");
const router = express.Router();
const { getBanner, updateBanner, createBanner } = require("../controllers/bannerController");

// Route to get banner data
router.get("/", getBanner);

// Route to update banner data
router.put("/", updateBanner);

// Route to create a new banner
router.post("/create", createBanner);

module.exports = router; 