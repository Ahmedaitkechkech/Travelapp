const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelReservSchema = new Schema({
    Nom_Hotel: { 
        type: Schema.Types.ObjectId,
        ref: 'HotelSchema',
        required: true
    },
    Nom:{
        type: String,
        required: true
    },
    Prénom: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },

    Numéro_Téléphone:{
        type: String,
        required: true
    },
    Date_entre: {
        type: String,
        required: true
    },
    Date_sortie: {
        type: String,
        required: true
    },
    Nombre_Personne: {
        type: Number,
        required: true
    },
    Nombre_Chambre: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('HotelReservSchema', HotelReservSchema);
