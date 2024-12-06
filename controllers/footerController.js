const Footer = require("../models/footer");

// Add a subitem to a footer section
const addFooterSubitem = async (req, res) => {
  try {
    const { id } = req.params; // Footer section ID
    const { name, url } = req.body; // Subitem data

    const footer = await Footer.findById(id);
    if (!footer) {
      return res.status(404).json({ message: "Footer section not found" });
    }

    // Add the new subitem
    footer.links.push({ name, url });
    await footer.save();

    // Return success response
    res.status(200).json({ message: "Subitem added successfully", footer });
  } catch (error) {
    console.error("Error adding subitem:", error); // Log detailed error
    res.status(500).json({ message: "Error adding subitem", error: error.message });
  }
};

// Update a subitem in a footer section
const updateFooterSubitem = async (req, res) => {
  try {
    const { id, subitemId } = req.params; // Footer section and subitem IDs
    const { name, url } = req.body; // New values for name and url

    // Find the footer section by ID
    const footer = await Footer.findById(id);
    if (!footer) {
      return res.status(404).json({ message: "Footer section not found" });
    }

    // Find the subitem by subitem ID
    const subitem = footer.links.id(subitemId);
    if (!subitem) {
      return res.status(404).json({ message: "Subitem not found" });
    }

    // Update the subitem's properties
    subitem.name = name || subitem.name;
    subitem.url = url || subitem.url;

    // Save the updated footer
    await footer.save();

    // Return success response
    res.status(200).json({ message: "Subitem updated successfully", footer });
  } catch (error) {
    console.error("Error updating subitem:", error); // Log detailed error
    res.status(500).json({ message: "Error updating subitem", error: error.message });
  }
};

// Delete a subitem from a footer section
const deleteFooterSubitem = async (req, res) => {
    try {
      const { id, subitemId } = req.params; // Footer section and subitem IDs
  
      // Find the footer section by ID
      const footer = await Footer.findById(id);
      if (!footer) {
        console.error("Footer section not found");
        return res.status(404).json({ message: "Footer section not found" });
      }
  
      // Check if the subitem exists
      const subitem = footer.links.id(subitemId);
      if (!subitem) {
        console.error("Subitem not found");
        return res.status(404).json({ message: "Subitem not found" });
      }
  
      // Log subitem details for verification
      console.log("Subitem to be deleted:", subitem);
  
      // Remove the subitem from the links array using pull
      footer.links.pull({ _id: subitemId });  // Use pull to remove the subitem from the links array
  
      // Save the updated footer
      const updatedFooter = await footer.save();
      console.log("Footer updated after subitem removal", updatedFooter);
  
      // Return success response
      res.status(200).json({ message: "Subitem deleted successfully", footer: updatedFooter });
    } catch (error) {
      console.error("Error deleting subitem:", error); // Log detailed error
      res.status(500).json({ message: "Error deleting subitem", error: error.message });
    }
  };

// Create a new footer section
const createFooterSection = async (req, res) => {
  try {
    const { title } = req.body; // Expecting a title in the request body

    // Create a new footer section with an empty links array
    const newFooter = new Footer({
      title,
      links: [], // Initialize with an empty links array
    });

    // Save the new footer section to the database
    const savedFooter = await newFooter.save();

    // Return the newly created footer section
    res.status(201).json(savedFooter);
  } catch (error) {
    console.error("Error creating footer section:", error); // Log detailed error
    res.status(500).json({ message: "Error creating footer section", error: error.message });
  }
};

// Get all footer sections
const getFooterSections = async (req, res) => {
  try {
    // Fetch all footer sections from the database
    const footers = await Footer.find(); // This will return all documents in the Footer collection

    // If no footers are found, return a message
    if (!footers.length) {
      return res.status(404).json({ message: "No footer sections found" });
    }

    // Return the footer sections as a response
    res.status(200).json(footers); // Sends the array of footer sections as JSON
  } catch (error) {
    console.error("Error fetching footer sections:", error); // Log detailed error
    res.status(500).json({ message: "Error fetching footer sections", error: error.message });
  }
};

module.exports = {
  getFooterSections,
  createFooterSection,
  addFooterSubitem,
  updateFooterSubitem,
  deleteFooterSubitem,
};
