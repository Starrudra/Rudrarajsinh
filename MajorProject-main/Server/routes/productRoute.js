const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProductController,
  getProductContorller,
  getSingleProductController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  searchProductController,
  relatedProductController,
  categoryWiseController,
  getAllProductsOfSingleCategoryController,
  braintreeTokenCOntroller,
  braintreePaymentsController,
  getAllOrderOfASingleUserController,
  getAllOrderController,
  updateOrderStatus,
} = require("../controllers/productController");
const formidable = require("express-formidable");

const router = express.Router();

//routers
//create product

router.post("/create-product", createProductController);

//get products

router.get("/get-products", getProductContorller);

//get single product

router.get("/get-product/:slug", getSingleProductController);

//delete product

router.delete(
  "/delete-product/:id",

  deleteProductController
);

//update product

router.put(
  "/update-product/:id",

  updateProductController
);

//Filter Product

router.post("/product-filters", productFiltersController);

//search product

router.get("/search-products/:keyword", searchProductController);

//similar product

router.get("/related-products/:pid/:cid", relatedProductController);

//get product category wise

router.get("/getbycategory/:cid", categoryWiseController);

//get all products of single category

router.get("/getProduct/:slug", getAllProductsOfSingleCategoryController);

//payments route
//token

router.get("/braintree-token", braintreeTokenCOntroller);

router.post("/braintree-payment", requireSignIn, braintreePaymentsController);

//get all orderes of a single user

router.get(
  "/getallorderuser",
  requireSignIn,
  getAllOrderOfASingleUserController
);

//fetch all orders

router.get("/getallorder", getAllOrderController);

//change order status
router.put("/:orderId/update-status", updateOrderStatus);

module.exports = router;
