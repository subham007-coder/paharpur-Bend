const mongoose = require("mongoose");

const initiativeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  location: {
    type: String,
  },
  tagline: {
    type: String,
  },
  description: {
    type: String,
  },
  mainImage: {
    type: String,
  },
  gallery: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Initiative", initiativeSchema);
