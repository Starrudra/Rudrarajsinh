const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No token provided" });
    }

    try {
        const token = authHeader.split(" ")[1];
        console.log("Extracted Token:", token);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Verified User:", verified);

        req.user = verified;
        req.user._id = verified._id; // Ensure _id is set correctly

        console.log("User after Middleware:", req.user);

        next(); 
    } catch (error) {
        console.log("Token Verification Error:", error.message);
        res.status(400).json({ message: "Invalid Token" });
    }
};








// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//     const authHeader = req.header("Authorization"); // Get Authorization header
//     console.log("Auth Header:", authHeader); // Debugging: Print header

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Access Denied. No token provided" });
//     }

//     try {
//         const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
//         console.log("Extracted Token:", token); // Debugging: Print extracted token

//         const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify token
//         console.log("Verified User:", verified); // Debugging: Print decoded token

//         req.user = verified; // Attach user data to request
//         next(); // Proceed to next middleware
//     } catch (error) {
//         console.log("Token Verification Error:", error.message); // Debugging: Print error details
//         res.status(400).json({ message: "Invalid Token" });
//     }
// };
// // export const updateContact = async (id, contactData) => {
// //     console.log("Updating Contact:", id, contactData); // Debugging
// //     return await axios.put(`${API_URL}/${id}`, contactData, getAuthHeaders());
// // };


// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//     const authHeader = req.header("Authorization");
//     console.log("Auth Header:", authHeader); // Debugging: Print header

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Access Denied. No token provided" });
//     }

//     try {
//         const token = authHeader.split(" ")[1];
//         console.log("Extracted Token:", token); // Debugging: Print extracted token

//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("Verified User:", verified); // Debugging: Print decoded token

//         // Ensure req.user._id is set correctly
//         req.user = verified;
//         req.user._id = verified.id || verified._id; 

//         console.log("User after Middleware:", req.user); // Debugging

//         next(); 
//     } catch (error) {
//         console.log("Token Verification Error:", error.message); // Debugging
//         res.status(400).json({ message: "Invalid Token" });
//     }
// };
