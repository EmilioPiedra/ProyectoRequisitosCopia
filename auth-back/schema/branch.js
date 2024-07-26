const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    bicycles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bicycle'
    }]
});

module.exports = mongoose.model("Branch", branchSchema);