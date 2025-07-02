const companyLogoModel = require("../models/companyLogoModel");

exports.uploadCompanyLogo = async (req, res) => {
  try {
    const { name, LogoLink } = req.body;
    const logo = await new companyLogoModel({ name, LogoLink }).save();

    return res.status(200).json({
      success: true,
      message: "Logo Uploaded Successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.updateCompanyLogo = async (req, res) => {
  try {
    const { name, LogoLink } = req.body;

    // Update the name and LogoLink in the first document of the CompanyLogo collection
    const updatedLogo = await companyLogoModel.updateOne(
      {},
      { name, LogoLink }
    );

    if (updatedLogo.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No logo found to update",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logo Updated Successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getCompanyLogo = async (req, res) => {
  try {
    // Find the first document in the collection
    const logo = await companyLogoModel.findOne();

    // Check if a logo exists
    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "No logo found",
      });
    }

    // Return the logo details
    return res.status(200).json({
      success: true,
      logo: {
        name: logo.name,
        link: logo.LogoLink,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
