var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Booking = new Schema({
    isActive: Boolean,
    startTime: Date,
    checkOut: Date,
    expectedCheckin: Date,
    actualCheckin: {type: Date, default: null},
    cost: Number,
    vehicleId: Number,
    feedback: String,
    complaints: String,
    paid: { type: Boolean, default: false }
})

module.exports = Booking;