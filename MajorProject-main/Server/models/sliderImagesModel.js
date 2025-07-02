const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sliderImageSchema = new Schema({
  images: {
    type: [String], // Array of strings to store image URLs
    required: true, // Ensure that the images array is provided
  },
});

const SliderImage = mongoose.model("SliderImage", sliderImageSchema);

module.exports = SliderImage;
