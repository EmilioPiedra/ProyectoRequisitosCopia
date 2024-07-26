const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: 'user',
        required: true
    },
    pickUpLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    returnLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    pickUpDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    bicycle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bicycle',
        required: true
    },
});
module.exports = mongoose.model("Rental", rentalSchema);