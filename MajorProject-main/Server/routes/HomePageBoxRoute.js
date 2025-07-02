const express = require("express");
const {
  setHomePageBoxes,
  getHomePageBoxes,
  updateHomePageBox,
} = require("../controllers/homePageBoxController");

const router = express.Router();

// Set or update the home page box
router.post("/setHomePageBoxes", setHomePageBoxes);

// Fetch all homepage boxes
router.get("/getHomePageBoxes", getHomePageBoxes);

// Update an existing homepage box
router.put("/updateHomePageBox/:id", updateHomePageBox);
module.exports = router;
