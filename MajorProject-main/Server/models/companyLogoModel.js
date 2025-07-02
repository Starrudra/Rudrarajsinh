const mongoose = require("mongoose");

const companyLogoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  LogoLink: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CompanyLogo", companyLogoSchema);
