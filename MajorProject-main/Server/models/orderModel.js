const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Product",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "user",
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Not-Processed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
