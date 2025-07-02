const express = require("express");
const router = express.Router();
const {
  uploadSliderImages,
  updateSliderImages,
  getSliderImages,
} = require("../controllers/sliderImageController");

// Route to upload new slider images
router.post("/upload-images", uploadSliderImages);

// Route to update existing slider images
router.put("/update-images", updateSliderImages);

// Route to fetch all slider images
router.get("/get-images", getSliderImages);

module.exports = router;
