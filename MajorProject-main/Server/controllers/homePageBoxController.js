const HomePageBox = require("../models/homePageBoxModel");

// Controller to set homepage boxes
exports.setHomePageBoxes = async (req, res) => {
  try {
    const { boxes } = req.body;

    // Find the document (assuming a single document is maintained)
    let homePage = await HomePageBox.findOne();

    if (!homePage) {
      // Create a new document if none exists
      homePage = new HomePageBox({ boxes });
    } else {
      // Update the existing document
      homePage.boxes = boxes;
    }

    await homePage.save();

    res.status(200).json({
      success: true,
      message: "Home page boxes updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the homepage boxes",
    });
  }
};

// Get all homepage boxes
exports.getHomePageBoxes = async (req, res) => {
  try {
    const homePageBoxes = await HomePageBox.find({});
    res.status(200).json({
      success: true,
      message: "Fetched all homepage boxes successfully",
      data: homePageBoxes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching homepage boxes",
      error,
    });
  }
};

// Update a specific homepage box
exports.updateHomePageBox = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitles, showMore } = req.body;

    // Find box by ID and update
    const updatedBox = await HomePageBox.findByIdAndUpdate(
      id,
      { title, subtitles, showMore },
      { new: true }
    );

    if (!updatedBox) {
      return res.status(404).json({
        success: false,
        message: "Homepage box not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Homepage box updated successfully",
      data: updatedBox,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating homepage box",
      error,
    });
  }
};
