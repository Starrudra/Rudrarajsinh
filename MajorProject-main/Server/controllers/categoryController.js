const Category = require("../models/categoryModel");
const slugify = require("slugify");

//create categroy controller

exports.createCategoryController = async (req, res) => {
  try {
    //validation

    const { name } = req.body;
    if (!name) {
      return res.status(500).json({
        message: "Name is required",
      });
    }

    //checking existing category
    console.log(name);
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(200)
        .json({ success: true, message: "Category already exists" });
    }

    //creating a category

    const category = await new Category({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Internal server error in creating category",
    });
  }
};

//update category controller

exports.updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      messgae: "Internal server error in updating category",
      error,
    });
  }
};

//fetch all Categories controller

exports.getCategoryController = async (req, res) => {
  try {
    const category = await Category.find({});
    res.status(200).json({
      success: true,
      message: "All categories Fetched...",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in fetching category",
      error,
    });
  }
};

//fetch single category controller

exports.getSingleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) {
      return res
        .status(200)
        .json({ success: true, message: "Category not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Category found", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching category",
    });
  }
};

//delete category controller

exports.deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting category",
    });
  }
};
