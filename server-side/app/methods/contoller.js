
require('../models/user')
const createUser = function(req,res) {
    const user = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        address: req.body.address,
        creditCard: req.body.creditCard,
        licenseState: req.body.licenseState,
        licenseNumber: req.body.licenseNumber
    }
};