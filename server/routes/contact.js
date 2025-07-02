
const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require("mongoose");

const router = express.Router();
console.log("hello");




// router.get('/all', authMiddleware, async (req, res) => {
//     try {
//         console.log("User from Middleware:", req.user);

//         // Fetch all contacts from the database
//         const contacts = await Contact.find({},'name');

//         console.log("Fetched Contacts:", contacts);
//         res.json(contacts);
//     } catch (error) {
//         console.error("Error fetching contacts:", error.message);
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// });

router.get('/all', authMiddleware, async (req, res) => {
    try {
        console.log("Fetching contacts with user details...");

        // Populate the 'user' field with firstName and lastName
        const contacts = await Contact.find().populate('user', 'firstName lastName');

        console.log("Fetched Contacts:", contacts); // Debugging
        res.json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});




router.get('/fetch', authMiddleware, async (req, res) => {
    try {
        console.log("User from Middleware:", req.user); // Debugging

        if (!req.user || !req.user._id) {
            return res.status(400).json({ message: "User ID is missing" });
        }

        const contacts = await Contact.find({ user: req.user._id }); 
        console.log("Fetched Contacts:", contacts); // Debugging

        res.json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post(
    '/create', 
    authMiddleware,
    [
        body('name', 'Name is required').notEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('phone', 'Phone number is required').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone } = req.body;

        try {
            const newContact = await Contact.create({
                user: req.user._id,  // Attach user ID
                name,
                email,
                phone
            });

            res.status(201).json(newContact);
        } catch (error) {
            console.error('Error while creating contact:', error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.get("/count", authMiddleware, async (req, res) => {
    try {
        console.log("Fetching total contact count...");

        // Check if DB connection is established
        if (mongoose.connection.readyState !== 1) {
            console.error("Database not connected!");
            return res.status(500).json({ message: "Database connection error" });
        }

        const totalContacts = await Contact.countDocuments();
        console.log("Total Contacts:", totalContacts); // Debugging

        res.json({ totalContacts });
    } catch (error) {
        console.error("Error fetching contact count:", error.stack);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// ROUTE 3: Get a specific contact by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact || contact.user.toString() !== req.user.id) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});



router.put(
    "/update/:id",
    authMiddleware,
    [
        body("name").optional().notEmpty(),
        body("email").optional().isEmail(),
        body("phone").optional().notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid contact ID" });
        }

        const { name, email, phone } = req.body;

        try {
            let contact = await Contact.findById(req.params.id);

            if (!contact ) {
                return res.status(404).json({ error: "Contact not found" });
            }

            const updatedFields = {};
            if (name) updatedFields.name = name;
            if (email) updatedFields.email = email;
            if (phone) updatedFields.phone = phone;

            contact = await Contact.findByIdAndUpdate(
                req.params.id,
                { $set: updatedFields },
                { new: true }
            );

            res.json(contact);
        } catch (error) {
            console.error("Error updating contact:", error);
            res.status(500).send("Internal Server Error");
        }
    }
);


// ROUTE 5: Delete a contact by ID
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact ) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        await contact.deleteOne();

        res.json({ message: 'Contact removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;

