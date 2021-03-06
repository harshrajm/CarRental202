var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Booking = new Schema({
    isActive: {type: Boolean, default: true},
    startTime: Date,
    checkOut: Date,
    expectedCheckin: Date,
    email: String,
    registrationTag: String,
    actualCheckin: {type: Date, default: null},
    cost: Number,
    vehicleObject: JSON,
    feedback: String,
    complaints: String,
    lateFees: {type: Number, default: 0},
    rating: {type: Number, default: null},
    paid: { type: Boolean, default: false }
})

module.exports = Booking;