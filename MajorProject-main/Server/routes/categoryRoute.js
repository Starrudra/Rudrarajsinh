const express = require("express");
const { isAdmin, requireSignIn } = require("../middlewares/authMiddleware");
const {
  createCategoryController,
  updateCategoryController,
  getCategoryController,
  getSingleCategoryController,
  deleteCategoryController,
} = require("../controllers/categoryController");

const router = express.Router();

//routes
//creating a category
router.post(
  "/create-category",

  createCategoryController
);

//updating a category

router.put(
  "/update-category/:id",

  updateCategoryController
);

//fetching all categories

router.get("/get-categories", getCategoryController);

//fetching single category

router.get("/get-category/:slug", getSingleCategoryController);

//delete category

router.delete(
  "/delete-category/:id",

  deleteCategoryController
);

module.exports = router;
