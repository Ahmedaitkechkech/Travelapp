const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const HotelSchema = new Schema({
         Nom_Hotel:{
            type:String,
            required:true,
            unique:true
         },
         Photo: {
            type: String,
            required: true
        },
         Adresse_Hotel:{
            type:String,
            required:true,
            
            },
        Username_Responsable:{
            type:String,
            required:true,
            unique:true
        },
        Prix:{
            type:Number,
            required:true,
        },
        Description:{
            type:String,
        }
})

module.exports = mongoose.model('HotelSchema',HotelSchema);