const mongoose = require("mongoose");

const HomePageBoxSchema = new mongoose.Schema(
  {
    boxes: [
      {
        title: {
          type: String,
          required: true,
        },
        subtitles: [
          {
            subtitle: { type: String, required: true },
            products: [
              { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            ],
          },
        ],
        showMore: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const HomePageBox = mongoose.model("HomePageBox", HomePageBoxSchema);

module.exports = HomePageBox;
