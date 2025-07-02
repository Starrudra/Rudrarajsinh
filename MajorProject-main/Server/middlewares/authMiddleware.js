const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel.js");
// PROTECTED ROUTE TOKEN BASED

exports.requireSignIn = async (req, res, next) => {
  try {
    const decode = await JWT.verify(
      req.headers.authtoken,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    res.status(401).json({ success: false, messgae: "Access denied" });
  }
};

// ADMIN ACCESS

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res
        .status(200)
        .json({ success: false, message: "Admin Access denied" });
    } else {
      // res.status(200).json({ success: true, message: "Admin access granted" });
      next();
    }
  } catch (error) {
    console.log(error);
  }
};
