var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    type: String,
    location: String,
    name: String,
    vehicleId: Number, 
    bookings:  { type: Array, "default": [] }
});

module.exports = vehicleSchema;