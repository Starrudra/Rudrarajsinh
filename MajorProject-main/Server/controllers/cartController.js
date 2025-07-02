const cartModel = require("../models/cartModel");
const mongoose = require("mongoose");

//initiates the cart when users signs in

exports.makeCartController = async (req, res) => {
  try {
    const { user } = req.body;
    const cart = await new cartModel({ userId: user }).save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

//add products to the cart of user

exports.addProductIntoCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or productId",
      });
    }

    // Find the user's cart
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Check if the product is already in the cart
    if (!cart.products.includes(productId)) {
      cart.products.push(productId);
      await cart.save();
    } else {
      return res.status(400).json({
        success: false,
        message: "Product already in cart",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//fetch products from cart of a user to display

exports.getCartProductsController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user's cart and populate the products field
    const cart = await cartModel.findOne({ userId }).populate("products");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    const length = cart.products.length;

    return res.status(200).json({
      success: true,
      products: cart.products,
      length: length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

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

// clears all the products from the cart once the order is placed

exports.clearCartOnPlacedOrderController = async (req, res) => {
  try {
    const user = req.user._id;

    // Find the user's cart
    const cart = await cartModel.findOne({ userId: user });

    if (!cart) {
      console.log(`Cart not found for user ${user}`);
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Debugging: Log the cart before clearing
    console.log("Cart before clearing:", cart);

    // Clear the cart items
    cart.products = [];

    // Save the updated cart
    const updatedCart = await cart.save();

    console.log("Cart after clearing:", updatedCart);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.log("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getCartItemsController = async (req, res) => {
  try {
    const user = req.user._id;

    const cart = await cartModel.findOne({ userId: user });

    const length = cart.products.length();

    res.status(200).json({
      success: true,
      Length: length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
