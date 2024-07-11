const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminTravelSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    tele: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model("AdminTravelSchema", AdminTravelSchema);
