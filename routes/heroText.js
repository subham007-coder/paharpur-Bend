const express = require("express");
const { getHeroText, updateHeroText } = require("../controllers/heroTextController");

const router = express.Router();

// Get Hero Text
router.get("/", getHeroText);

// Update Hero Text
router.put("/", updateHeroText);

module.exports = router;
