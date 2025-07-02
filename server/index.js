require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact"); // Import contact routes

// database connection
connection();

// middlewares
app.use(express.json());
// app.use(cors());
app.use(cors({
    origin: ["http://localhost:3000", "http://172.20.10.8:3000"],
    credentials: true
}));



// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes); // Register contact routes

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Listening on port ${port}...`));