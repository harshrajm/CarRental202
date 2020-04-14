var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    type: String,
    location: String,
    name: String,
    manufacturer: String,
    registrationTag: String,
    mileage: Number,
    modelYear: Date,
    lastService: Date,
    condition: String,
    baseRate: Number,
    hourlyRate: { type: Array, "default": []},
    vehicleImageURL: String, 
    bookings:  { type: Array, "default": [] }
});

module.exports = vehicleSchema;