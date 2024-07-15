const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const Hotel_ReservSchema = Schema({
    Nom_Hotel: { 
        type: Schema.Types.ObjectId,
         ref: 'HotelSchema' 
        },
        Photo:{
            type:Object,
        },
        Date_Aller:{
            type:String,
            required:true,
        },
        Date_Retour:{
            type:String,
            required:true,
            },
        Nombre_Personne:{
                type:Number,
                require:true
            },
        Nombre_Chambre:{
                type:Number,
                require:true
            },
})

module.exports = mongoose.module('Hotel_ReservSchema',Hotel_ReservSchema);