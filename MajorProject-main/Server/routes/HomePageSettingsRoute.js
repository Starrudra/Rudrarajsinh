const express = require("express");
const {
  getCompanyLogo,
  updateCompanyLogo,
  uploadCompanyLogo,
} = require("../controllers/homePageSettingsController");

const router = express.Router();

// POST - Upload a new logo
router.post("/upload-logo", uploadCompanyLogo);

// PUT - Update an existing logo
router.put("/update-logo", updateCompanyLogo);

// GET - Get the current company logo
router.get("/get-logo", getCompanyLogo);

module.exports = router;
