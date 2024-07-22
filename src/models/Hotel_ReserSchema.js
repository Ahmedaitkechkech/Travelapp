const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelReservSchema = new Schema({
    Nom_Hotel: { 
        type: Schema.Types.ObjectId,
        ref: 'HotelSchema',
        required: true
    },
    Photo: {
        type: String,
        required: true
    },
    Date_Aller: {
        type: String,
        required: true
    },
    Date_Retour: {
        type: String,
        required: true
    },
    Nombre_Personne: {
        type: Number,
    },
    Nombre_Chambre: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('HotelReservSchema', HotelReservSchema);
