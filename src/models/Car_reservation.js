const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Car_reservation = new Schema({
    name_companies: {
        type: Schema.Types.ObjectId,
        ref: 'car', 
        required: true,
    },
    nombre_jour: {
        type: Number,
        required: true,
    },
    prix_total: {
        type: Number,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        enum: ["femme", "homme"],
        required: true,
    },
    tele: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Car_reservation", Car_reservation);
