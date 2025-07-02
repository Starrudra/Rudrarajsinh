const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const token = user.generateAuthToken();
		const payload = {user : {id: user.id, name: user.name}};
		res.status(200).send({ user, data: token, message: "logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;


// const router = require("express").Router();
// const { User } = require("../models/user");
// const bcrypt = require("bcrypt");
// const Joi = require("joi");
// const jwt = require("jsonwebtoken"); // Import JWT

// router.post("/", async (req, res) => {
// 	try {
// 		// Validate input data
// 		const { error } = validate(req.body);
// 		if (error)
// 			return res.status(400).json({ message: error.details[0].message });

// 		// Check if user exists
// 		const user = await User.findOne({ email: req.body.email });
// 		if (!user)
// 			return res.status(401).json({ message: "Invalid Email or Password" });

// 		// Validate password
// 		const validPassword = await bcrypt.compare(req.body.password, user.password);
// 		if (!validPassword)
// 			return res.status(401).json({ message: "Invalid Email or Password" });

// 		// Generate JWT token
// 		const token = jwt.sign(
// 			{ _id: user._id, email: user.email }, // Payload
// 			process.env.JWT_SECRET, // Secret key from .env
// 			{ expiresIn: "20d" } // Expiry time
// 		);

// 		// Send token in response
// 		res.status(200).json({ token, message: "Logged in successfully" });
// 	} catch (error) {
// 		console.error("Auth Error:", error.message);
// 		res.status(500).json({ message: "Internal Server Error" });
// 	}
// });

// // Joi validation function
// const validate = (data) => {
// 	const schema = Joi.object({
// 		email: Joi.string().email().required().label("Email"),
// 		password: Joi.string().required().label("Password"),
// 	});
// 	return schema.validate(data);
// };

// module.exports = router;
