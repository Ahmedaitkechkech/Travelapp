const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require:true,
        },
    password:{
        type: String,
        require:true,
        unique:true
    },
    reservations: [{
        type: Schema.Types.ObjectId,
        ref: 'HotelReservSchema'
    }],
})

ClientSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
module.exports = mongoose.model('ClientSchema',ClientSchema);