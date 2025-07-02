

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

// Generate JWT Token Method
userSchema.methods.generateAuthToken = function () {
	return jwt.sign(
		{ _id: this._id, email: this.email, firstName: this.firstName, lastName: this.lastName },
		process.env.JWT_SECRET, // Ensure this key matches your .env file
		{ expiresIn: "20d" }
	);
};

// Static method to verify JWT Token
userSchema.statics.verifyToken = function (token) {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		return null; // Return null if token is invalid
	}
};

const User = mongoose.model("User", userSchema);

// Password Complexity Configuration
const complexityOptions = {
	min: 8,
	max: 30,
	lowerCase: 1,
	upperCase: 1,
	numeric: 1,
	symbol: 1,
	requirementCount: 4,
}; 

// Validate User Data
const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity(complexityOptions).required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
	