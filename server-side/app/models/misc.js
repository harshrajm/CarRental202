var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Miscschema = new Schema({
    id: {type: Number, unique: true },
    membershipFee: Number,
});

module.exports = Miscschema