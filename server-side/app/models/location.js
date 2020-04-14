var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    name: String,
    address: String,
    vehicleCapacity: Number,
    currentVehicles:{ type: Number, default : 0 },
    vehicles: { type: Array, "default": [] }
});

module.exports = LocationSchema