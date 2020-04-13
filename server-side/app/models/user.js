var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Booking = require('./booking');

const UserSchema = new Schema({
    username: String,
    name: String,
    password: String,
    role: String,
    email: String,
    address: String,
    creditCard: String,
    licenseState: String,
    licenseNumber: String,
    membershipEndDate: Date,
    bookings:  { type: Array, "default": [] }
});

const Roles = {
    Admin: 'Admin',
    Customer: 'Customer'
}

const checkIsInRole = (...roles) => (req, res, next) => {
    if (!req.user) {
    return res.redirect('/login')
    }
    const hasRole = roles.find(role => req.user.role === role)
    if (!hasRole) {
        return res.redirect('/login')
    }
    return next()
}
    
module.exports = {UserSchema, Roles, checkIsInRole};