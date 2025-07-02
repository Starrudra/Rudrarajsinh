const categoryModel = require("../models/categoryModel.js");
const Product = require("../models/productModel.js");
const slugify = require("slugify");
const braintree = require("braintree");
const orderModel = require("../models/orderModel.js");

//payment Gateway

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//create-product controller

exports.createProductController = async (req, res) => {
  try {
    //destructuring
    const { name, description, price, quantity, category, shipping, photo } =
      req.body;

    const existingProduct = await Product.findOne({ photo });
    if (existingProduct) {
      return res
        .status(206)
        .json({ success: false, message: "Product already exists" });
    } else {
      //validation
      const product = await new Product({
        name,
        slug: slugify(name),
        description,
        price,
        category,
        quantity,
        photo,
        shipping,
      });
      await product.save();
    }
    res.status(201).json({
      success: true,
      message: "Product created sucessfully",
      Product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      sucess: false,
      message: "Internal server error in product creation",
      error,
    });
  }
};

// get products controller

exports.getProductContorller = async (req, res) => {
  try {
    const products = await Product.find({})
      // .limit(12)
      .sort({ createdAt: -1 })
      .populate("category");
    res.status(200).json({
      success: true,
      message: "All products Fetched...",
      countTotal: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in fetching products",
    });
  }
};

//get single product

exports.getSingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug }).populate("category");
    if (!product) {
      return res.status(206).json({
        success: true,
        message: "No product Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product Found",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching product",
    });
  }
};

//delete product

exports.deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in deleting product",
      error: error.message,
    });
  }
};

//update product controller

exports.updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, photo, quantity } = req.body;
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
        description,
        price,
        quantity,
        photo,
        category,
      },
      { new: true }
    );

    await updatedProduct.save();
    res.status(200).json({
      success: true,
      message: "Product upadated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating product",
    });
  }
};

//product filter controller

exports.productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      message: "Error in filter product",
    });
  }
};

//search products controller

exports.searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;

    const results = await Product.find({
      $or: [{ name: { $regex: keyword, $options: "i" } }],
    });
    res.status(200).json({ success: true, results });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in searching product" });
  }
};

//related products controller

exports.relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Product.find({
      category: cid,
      _id: { $ne: pid },
    })
      .limit(6)
      .populate("category");
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in fetching similar products",
    });
  }
};

//get 5 products category wise controller

exports.categoryWiseController = async (req, res) => {
  try {
    const { cid } = req.params;
    const products = await Product.find({ category: cid })
      .limit(5)
      .sort({ createdAt: -1 });
    res.status(200).json({
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in fetching products",
    });
  }
};

//get all products of a single category

exports.getAllProductsOfSingleCategoryController = async (req, res) => {
  try {
    // const slug = req.params;
    const cat = await categoryModel.findOne({ slug: req.params.slug });
    const cid = cat._id;

    const products = await Product.find({ category: cid }).sort({
      createdAt: -1,
    });

    const total = products.length;
    res.status(200).json({
      success: true,
      cat,
      total_products: total,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error in fetching products",
    });
  }
};

//payment
//token controller

exports.braintreeTokenCOntroller = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).json({
          success: false,
          err,
        });
      } else {
        res.status(200).json({
          success: true,
          response,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Srever error in generating token",
    });
  }
};

//payments controller

exports.braintreePaymentsController = async (req, res) => {
  try {
    const { cart, nonce, total } = req.body;

    // cart.map((i) => {
    //   total = i.price * i.quantity;
    // });
    console.log(total);

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result.success,
            price: total,
            buyer: req?.user?._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).json({ error });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Srever error in processing payment",
    });
  }
};

//get all orders of a single user controller

exports.getAllOrderOfASingleUserController = async (req, res) => {
  try {
    const user = req.user._id;
    const orders = await orderModel
      .find({ buyer: user })
      .sort({ createdAt: -1 })
      .populate("products");
    // Assuming 'products' is the field in the order model that stores product IDs

    // Extracting required product details
    const ordersWithProductDetails = orders.map((order) => ({
      _id: order._id,
      status: order.status,
      payment: order.payment,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      products: order.products.map((product) => ({
        _id: product._id,
        name: product.name,
        image: product.photo,
        price: product.price,
        // Add more fields as needed
      })),
    }));

    res.status(200).json({
      success: true,
      message: "Orders Fetched Successfully",
      orders: ordersWithProductDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error in fetching orders",
    });
  }
};

// get all order controller

exports.getAllOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("products")
      .sort({ createdAt: -1 });
    // Extracting required product details
    const ordersWithProductDetails =
      orders &&
      orders.map((order) => ({
        _id: order._id,
        status: order.status,
        payment: order.payment,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        price: order.price,
        products: order.products.map((product) => ({
          _id: product._id,
          name: product.name,
          image: product.photo,
          price: product.price,
        })),
      }));
    res.status(200).json({
      success: true,
      message: "Orders Fetched SUccessfully",
      orders: ordersWithProductDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Intrenal Server Error in Fetching Orders",
    });
  }
};

//change order status controller

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const newStatus = req.body.status;

    // Update order status
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
