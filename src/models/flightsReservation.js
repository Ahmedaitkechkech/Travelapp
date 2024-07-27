const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const flightsReservation = new Schema({
    name_compagnies: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket_flight', 
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
    lieu_depart: {
        type: String,
        required: true,
    },
    heure_depart: {
        type: String,
        required: true,
    },
    lieu_arrivee: {
        type: String,
        required: true,
    },
    
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("flightReservation", flightsReservation);
