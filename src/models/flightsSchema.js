const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const flightsSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    name_companies: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model("flight", flightsSchema);
