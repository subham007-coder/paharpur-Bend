const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Example: "PRODUCTS"
  },
  links: [
    {
      name: { type: String, required: true }, // Example: "Wet cooling"
      url: { type: String }, // Optional: URL for the link (if applicable)
    },
  ],
});

module.exports = mongoose.model("Footer", footerSchema);
