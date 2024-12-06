const HeroText = require("../models/HeroText");

// Get Hero Text
exports.getHeroText = async (req, res) => {
  try {
    const heroText = await HeroText.findOne();
    if (!heroText) {
      return res.status(404).json({ message: "Hero text not found" });
    }
    res.json(heroText);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update Hero Text
exports.updateHeroText = async (req, res) => {
  const { heroText, heroDescription } = req.body;
  try {
    let heroData = await HeroText.findOne();
    if (!heroData) {
      // If no data exists, create a new entry
      heroData = new HeroText({ heroText, heroDescription });
    } else {
      // Update existing data
      heroData.heroText = heroText;
      heroData.heroDescription = heroDescription;
    }
    await heroData.save();
    res.json({ message: "Hero text updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
