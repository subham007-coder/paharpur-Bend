const mongoose = require("mongoose");

const headerSchema = new mongoose.Schema({
  logoUrl: { type: String, required: true },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  navigationLinks: { type: [String], required: true },
});

const Header = mongoose.model("Header", headerSchema);

module.exports = Header;
