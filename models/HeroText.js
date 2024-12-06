const mongoose = require("mongoose");

const HeroTextSchema = new mongoose.Schema({
  heroText: { type: String, required: true },
  heroDescription: { type: String, required: true },
});

module.exports = mongoose.model("HeroText", HeroTextSchema);
