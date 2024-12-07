const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  overlayText: { type: String, required: true },
});

module.exports = mongoose.model("Banner", BannerSchema);
