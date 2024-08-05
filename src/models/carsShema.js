const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const carsShema = new Schema({
    name_companies: {
        type: String,  
        required: false,
    },
    username: {
        type: String,
        required: true,
    },
    photo: {
        type: String, 
        required: true,
    },
    car_model: {
        type: String,
        required: true,
    },
    nombre_seats:{
        type: Number,
        required: true,
    },
    prix: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["diesel", "gasoil"],  
        required: true,
    },
    Lieu_de_ramassage: {
        type: String,
        required: true,
    },
    Date_de_ramassage: {
        type: String,
        required: true,
    },
    Temps: {
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

module.exports = mongoose.model("car", carsShema);
