const Header = require("../models/Header");

// Get header data from the database
const getHeader = async (req, res) => {
  try {
    const header = await Header.findOne();
    if (!header) {
      return res.status(404).json({ message: "Header data not found" });
    }
    res.json(header);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update header data
const updateHeader = async (req, res) => {
  try {
    const { logoUrl, contact, navigationLinks } = req.body;

    // Find and update the header data in the database
    const updatedHeader = await Header.findOneAndUpdate(
      {},
      { logoUrl, contact, navigationLinks },
      { new: true, upsert: true }
    );

    res.json(updatedHeader);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getHeader, updateHeader };
