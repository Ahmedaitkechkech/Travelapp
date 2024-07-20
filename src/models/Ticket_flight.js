const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Ticket_flightSchema = new Schema({
    name_compagnies: {
        type: String,
        required: true,
        ref: "flight" 
    },
    username :{
        type: String, 
        required: false,
    },
    photo: {
        type: String, 
        required: true,
    },
    prix: {
        type: Number,
        required: true,
    },
    lieu_depart: {
        type: String,
        required: true,
    },
    lieu_arrivee: {
        type: String,
        required: true,
    },
    heure_depart: {
        type: String,
        required: true,
    },
    heure_arrivee: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Ticket_flight", Ticket_flightSchema);
