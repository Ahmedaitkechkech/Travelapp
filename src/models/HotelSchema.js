const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const HotelSchema = new Schema({
         Nom_Hotel:{
            type:String,
            required:true,
            unique:true
         },
         Adresse_Hotel:{
            type:String,
            require:true,
            unique:true
            },
        Username_Responsable:{
            type:String,
            required:true,
            unique:true
        },
        Description:{
            type:String,
        }
})

module.exports = mongoose.model('HotelSchema',HotelSchema);