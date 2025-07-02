// const mongoose = require('mongoose');

// const contactSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     phone: {
//         type: String
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('Contact', contactSchema);
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    user: {  // Add user reference
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to the User model
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
