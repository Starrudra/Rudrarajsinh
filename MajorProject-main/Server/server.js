const express = require("express");
const dotenv = require("dotenv").config({ path: "./my.env" });
const connectDB = require("./config/db.js");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoute.js");
const categoryRoute = require("./routes/categoryRoute.js");
const productRoute = require("./routes/productRoute.js");
const cartRoute = require("./routes/cartRoute.js");
const homePageRoute = require("./routes/HomePageSettingsRoute.js");
const sliderImageRoutes = require("./routes/sliderImageRoutes.js");
const homePageBoxRoutes = require("./routes/HomePageBoxRoute.js");

//database config
connectDB();

//cloudinary connection

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/hpsettings", homePageRoute);
app.use("/api/v1/slider-images", sliderImageRoutes);
app.use("/api/v1/homePageBox", homePageBoxRoutes);

//rest api
app.get("/", (req, res) => {
  res.json({
    message: "welcome",
  });
});

app.listen(process.env.PORT, () => {
  console.log(
    `server running on ${process.env.DEV_MODE} mode on port ${process.env.PORT}`
  );
});
