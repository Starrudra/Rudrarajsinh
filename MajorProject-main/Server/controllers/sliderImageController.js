const SliderImage = require("../models/sliderImagesModel");

exports.uploadSliderImages = async (req, res) => {
  try {
    const { images } = req.body;

    // Ensure images is an array of strings
    if (
      !Array.isArray(images) ||
      !images.every((img) => typeof img === "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array of strings",
      });
    }

    // Delete existing slider images
    await SliderImage.deleteMany({});

    // Save new slider images
    const newSliderImages = new SliderImage({ images });
    await newSliderImages.save();

    return res.status(200).json({
      success: true,
      message: "Slider images uploaded successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update existing slider images
exports.updateSliderImages = async (req, res) => {
  try {
    const { images } = req.body;

    // Ensure images is an array of strings
    if (
      !Array.isArray(images) ||
      !images.every((img) => typeof img === "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array of strings",
      });
    }

    // Update the first document in the SliderImage collection
    const updatedImages = await SliderImage.updateOne({}, { images });

    if (updatedImages.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No images found to update",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Slider images updated successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Fetch all slider images
exports.getSliderImages = async (req, res) => {
  try {
    // Find the first document in the collection
    const sliderImages = await SliderImage.findOne();

    if (!sliderImages) {
      return res.status(404).json({
        success: false,
        message: "No slider images found",
      });
    }

    return res.status(200).json({
      success: true,
      images: sliderImages.images,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
