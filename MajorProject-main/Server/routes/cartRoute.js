const express = require("express");
const {
  makeCartController,
  addProductIntoCartController,
  getCartProductsController,
  removeProductFromCartController,
  clearCartOnPlacedOrderController,
  getCartItemsController,
} = require("../controllers/cartController");
const { requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();

module.exports = router;

router.post("/makeCart", makeCartController);

router.post("/addToCart", requireSignIn, addProductIntoCartController);

router.get("/fetchCart", requireSignIn, getCartProductsController);

router.delete(
  "/remove/:productId",
  requireSignIn,
  removeProductFromCartController
);

router.post("/clear", requireSignIn, clearCartOnPlacedOrderController);

router.get("/getItems", getCartItemsController);
