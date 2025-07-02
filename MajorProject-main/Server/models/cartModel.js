// cartModel.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);

exports.removeProductFromCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    // Find the cart of the user and update by pulling the product ID from the products array
    const cart = await cartModel
      .findOneAndUpdate(
        { userId },
        { $pull: { products: productId } },
        { new: true } // Return the updated cart
      )
      .populate("products"); // Populate the products to return updated details

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart: cart.products,
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
