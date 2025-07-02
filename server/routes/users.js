




const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


router.get("/", async (req, res) => {
	try {
	  const users = await User.find().select("-password"); // Exclude passwords
	  res.status(200).send(users);
	} catch (error) {
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });

  
  router.delete("/:id", async (req, res) => {
	try {
	  const user = await User.findById(req.params.id);
	  if (!user) return res.status(404).send({ message: "User not found" });
  
	  await user.deleteOne();
	  res.status(200).send({ message: "User deleted successfully" });
	} catch (error) {
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });
  
  router.get("/count", async (req, res) => {
	try {
	  const totalUsers = await User.countDocuments();
	  res.json({ totalUsers });
	} catch (error) {
	  console.error("Error fetching user count:", error);
	  res.status(500).json({ message: "Internal Server Error" });
	}
  });
  
module.exports = router;








// const router = require("express").Router();
// const { User } = require("../models/user");
// const bcrypt = require("bcrypt");
// const Joi = require("joi");
// const jwt = require("jsonwebtoken");

// router.post("/", async (req, res) => {
// 	try {
// 		// Validate user input
// 		const { error } = validate(req.body);
// 		if (error) return res.status(400).send({ message: error.details[0].message });

// 		// Check if user exists
// 		const user = await User.findOne({ email: req.body.email });
// 		if (!user) return res.status(401).send({ message: "Invalid Email or Password" });

// 		// Validate password
// 		const validPassword = await bcrypt.compare(req.body.password, user.password);
// 		if (!validPassword) return res.status(401).send({ message: "Invalid Email or Password" });

// 		// Generate JWT token
// 		const token = jwt.sign(
// 			{ _id: user._id, email: user.email }, // Payload
// 			process.env.JWT_SECRET, // Secret key from .env file
// 			{ expiresIn: "20d"} // Token expires in 1 hour
// 		);

// 		res.status(200).send({ token, message: "Logged in successfully" });
// 	} catch (error) {
// 		res.status(500).send({ message: "Internal Server Error" });
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
