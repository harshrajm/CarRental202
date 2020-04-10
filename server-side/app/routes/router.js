var express = require('express');
var router = express.Router();

var passport = require('../config/passport').passport;
var UserDetails = require('../config/passport').UserDetails;
var User = require('../config/passport').User;
var vehicle = require('../config/passport').vehicle;
var vehicleDetails = require('../config/passport').VehicleDetails;

const jwt = require('jsonwebtoken');
const keys = 'secret';



router.post('/register', (req, res) => {
    //TODO check if all params are received
    UserDetails.findOne({email: req.body.email}).then((user) => {
      if (user) {
        res.status(400).send("Error - email already used", user, req.body.email);
      } else {
        const user = new UserDetails({
          username: req.body.username,
          name: req.body.name,
          email: req.body.email,
          role: "Customer",
          address: req.body.address,
          creditCard: req.body.creditCard,
          licenseState: req.body.licenseState,
          licenseNumber: req.body.licenseNumber
        });
        UserDetails.register(user, req.body.password, (result)=> res.send("User registered"));
      }
    })
  });    
  
  /* ROUTES 
  
  CUSTOMER ENDPOINTS
  ------------------
  1. /login - POST - To login users. Expected parameters in request body : username, password.
                     On succesful login, redirects to /
                     On failure, simply reloads /login GET
  2. /register - POST - To register new users. Expected parameters in JSON request body :
                        username, name, email, address, creditCard, licenseState, licenseNumber
                        email is used to find if user already exists.
                        Need to also add check for username.
                        If register succesfully, 200 response with message "User registered"
                        On failure, 400 response with message
  3. /admin_dashboard - GET - Only users with admin role can access this.
  4. /user - GET - returns the currently logged in users object
  5. /logout - GET - clears the current session and redirects to login.
  6. /user - DELETE - delete current user - for customer roles only
  */
  
  
  router.post('/login', (req, res) => {
    passport.authenticate(
      'local',
      { session: false },
      (error, user) => {
  
        if (error || !user) {
          console.log(error, user);
          res.status(400).json({ error });
        } else {
          /** This is what ends up in our JWT */
        const payload = {
          username: user.username,
          expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS),
        };
  
        /** assigns payload to req.user */
        req.login(payload, {session: false}, (error) => {
          if (error) {
            console.log("Some error ", error);
            res.status(400).send({ error });
          }
          else {
            /** generate a signed json web token and return it in the response */
            const token = jwt.sign(JSON.stringify(payload), 'secret');
  
            /** return the token and username **/
            const resp = { "token": token, "username": user.username }
            console.log(resp);
            res.send(resp);
          }
        });
        }
      },
    )(req, res);
  });
  
  router.get('/login',
    (req, res) => { res.status(401).send("{ not authorized }");}
  );
  
  router.get('/',
    passport.authenticate('jwt', {session: false}),
    (req, res) => { res.status(200).send("OK");}
  );
  
  router.get('/admin_dashboard',
  passport.authenticate('jwt', {session: false}),User.checkIsInRole(User.Roles.Admin),
    (req, res) => { { res.status(200).send("{ OK }");}}
  );
  
  router.get('/user',
   passport.authenticate('jwt', {session: false}),
    (req, res) => res.send({user: req.user})
  );
  
  router.all("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
  });
  
  
  //delete user endpoint
  //this endpoint is for customer only
  //to terminate his account
  router.delete('/user', passport.authenticate('jwt', {session: false}),User.checkIsInRole(User.Roles.Customer),
  (req, res) => {
        //delete the user
        UserDetails.findOne({email: req.user.email}).then((user) => {
          if (user){
            UserDetails.deleteOne({email: req.body.email}).then((obj)=> {
              if (obj.ok != 1){
                console.log("Object delete error");
                console.log(err);
                res.status(500).send('User delete failed');
              } else {
                res.send('User deleted');
                //user should be redirected by UI
              }
            }
            );
          } else {
            res.status(404).send('User not found');
          }
        })
  });


/* ADMIN ENDPOINTS 
   ---------------

1. /admin/user - DELETE - delete other users - admin only
2. /vehicle - POST - add a vehicle to db - admin only
3. /vehicle/{vehicleId} - GET - get a vehicle from db - customer/admin
4. /vehicle/{vehicleId} - DELETE - delete a vehicle db - admin only
5. /vehicle/{vehicleId} - PUT - update a vehicle in db - admin only
6. /location - GET - get all location names? - admin/customer - ?? IS THIS NEEDED for finding close locations?
7. /location/{name} - GET get all vehicles at a given location - admin/customer
8. 
*/

  //delete user endpoint
  //this endpoint is for admin only
  router.delete('/admin/user', passport.authenticate('jwt', {session: false}),User.checkIsInRole(User.Roles.Admin),
  (req, res) => {
    console.log('Deleting user', req.body.email);
      if (req.body.email){
        UserDetails.findOne({email: req.body.email}).then((user) => {
          if (user){
            UserDetails.deleteOne({email: req.body.email}).then((obj)=> {
              if (obj.ok != 1){
                console.log("Object delete error");
                console.log(err);
                res.status(500).send('User delete failed');
              } else {
                res.send('User deleted');
              }
            }
            );
          } else {
            res.status(404).send('User not found');
          }
        })
      } else {
        res.status(400).send('User email required');
      }
  });

  router.get('/vehicle', passport.authenticate('jwt', {session: false}),(req, res) => {
    if (!req.query.vehicleId){
      return res.status(400).send("vehicleId missing");
    }
    vehicleDetails.findOne({vehicleId: req.query.vehicleId}).then((obj)=>{
      if (!obj){
        return res.status(404).send("vehicle not found"); 
      } else {
         return res.send(obj);
      }
    })
  });

  router.post('/vehicle', passport.authenticate('jwt', {session: false}),User.checkIsInRole(User.Roles.Admin),
  (req, res) => {
    if (!req.body.vehicleId){
      return res.status(400).send("vehicleId missing");
    }
    vehicleDetails.findOne({vehicleId: req.body.vehicleId}).then((obj)=>{
      if (!obj){
        const v = new vehicleDetails({
          type: req.body.type,
          location: req.body.location,
          name: req.body.name,
          vehicleId: req.body.vehicleId
        });
        vehicleDetails.create(v);
        return res.send(v);
      } else {
        return res.status(400).send("vehicle with same id exists"); 
      }
    })
  });

  router.delete('/vehicle', passport.authenticate('jwt', {session: false}),User.checkIsInRole(User.Roles.Admin),
  (req, res) => {
    if (!req.body.vehicleId){
      return res.status(400).send("vehicleId missing");
    }
    vehicleDetails.findOne({vehicleId: req.body.vehicleId}).then((obj)=>{
      if (!obj){
        vehicleDetails.deleteOne({vehicleId: req.body.id});
        return res.send("vehicle deleted");
      } else {
        return res.status(404).send("vehicle not found"); 
      }
    })
  });

  //can only change name location and type
  //to add a booking use a different endpoint
  router.put('/vehicle', passport.authenticate('jwt', {session: false}),User.checkIsInRole(User.Roles.Admin),
  (req, res) => {
    if (!req.body.vehicleId){
      return res.status(400).send("vehicleId missing");
    }
    vehicleDetails.findOne({vehicleId: req.body.vehicleId}).then((obj)=>{
      if (!obj){
        return res.status(404).send("vehicle not found"); 
      } else {
        obj.type = req.body.type;
        obj.location = req.body.location;
        obj.name = req.body.name;
        obj.save();
        return res.send(obj);
      }
    })
  });

  router.get('/locations', passport.authenticate('jwt', {session: false}), (req, res) => {
    vehicleDetails.find(vehicleDetails.distinct('location'), {location:1, _id:0}).then((obj) => {
      return res.send(obj);
    });
  });

  router.get('/location', passport.authenticate('jwt', {session: false}), (req,res) => {
    if (!req.query.name) {
      return res.status(400).send('Missing name field');
    } else {
      vehicleDetails.find({ location: req.query.name} ).then((obj)=>{
        if (!obj){
          return res.status(404).send("No cars");
        } else {
          return res.send(obj);
        }
      });
    }
  });

module.exports = router;