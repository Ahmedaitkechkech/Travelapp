const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Car_reservation = new Schema({
	name_companies: { 
        type: Schema.Types.ObjectId, 
        required: false,
        ref: 'car', 
    },
	date_sortie_car: {
		type: Date,
	},
	date_retourne: {
		type: Date,
	},
	Email: {
		type: String,
	},
	genre: {
		type: String,
		enum: ["femme", "homme"],
	},
	tele: {
		type: String,
	},
	Nom: {
		type: String,
	},
	Prenom: {
		type: String,
	},
	username: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Car_reservation", Car_reservation);
