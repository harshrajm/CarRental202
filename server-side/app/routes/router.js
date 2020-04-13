var express = require('express');
var router = express.Router();

var passport = require('../config/passport').passport;
var UserDetails = require('../config/passport').UserDetails;
var User = require('../config/passport').User;
var vehicle = require('../config/passport').vehicle;
var vehicleDetails = require('../config/passport').VehicleDetails;
var BookingDetails = require('../config/passport').BookingDetails;
var booking = require('../config/passport').booking;

const jwt = require('jsonwebtoken');
const keys = 'secret';



router.post('/register', (req, res) => {
    //TODO check if all params are received
    UserDetails.findOne({email: req.body.email}).then((user) => {
      if (user) {
        res.status(400).send("Error - email already used", user, req.body.email);
      } else {
        //console.log(req.body);
        var d = new Date();
        //membership end date is 6 months from now
        //TODO why is creditcard info not being saved?
        d.setMonth(d.getMonth() + 6);
        const user = new UserDetails({
          username: req.body.username,
          name: req.body.name,
          email: req.body.email,
          role: "Customer",
          address: req.body.address,
          creditCard: req.body.creditCard,
          creditCardExpiry: req.body.creditCardExpiry,
          creditCardNameonCard: req.body.creditCardNameonCard,
          creditCardCVV: req.body.creditCardCVV,
          creditCardIssuer: req.body.creditCardIssuer,
          licenseState: req.body.licenseState,
          licenseNumber: req.body.licenseNumber,
          membershipEndDate: d,
        });
        console.log(user);
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
        //TODO cancel his reservations also
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

TODO
-----
   The administrator should be able to enter rental locations into the
system. Each rental location should have a name, address, and a vehicle
capacity (the maximum number of vehicles it can hold). A number of
vehicles (see below) are assigned to each rental location.

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
    if (!req.query.registrationTag){
      return res.status(400).send("registrationTag missing");
    }
    vehicleDetails.findOne({registrationTag: req.query.registrationTag}).then((obj)=>{
      if (!obj){
        return res.status(404).send("vehicle not found"); 
      } else {
         return res.send(obj);
      }
    })
  });

  router.post('/vehicle', passport.authenticate('jwt', {session: false}),User.checkIsInRole(User.Roles.Admin),
  (req, res) => {
    if (!req.body.registrationTag){
      return res.status(400).send("registrationTag missing");
    }
    vehicleDetails.findOne({registrationTag: req.body.registrationTag}).then((obj)=>{
      if (!obj){
        const v = new vehicleDetails({
          type: req.body.type,
          location: req.body.location,
          name: req.body.name,
          registrationTag: req.body.registrationTag,
          manufacturer: req.body.manufacturer,
          mileage: req.body.mileage,
          modelYear: req.body.modelYear,
          lastService: req.body.lastService,
          condition: req.body.condition
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
    if (!req.body.registrationTag){
      return res.status(400).send("registrationTag missing");
    }
    vehicleDetails.findOne({registrationTag: req.body.registrationTag}).then((obj)=>{
      if (!obj){
        vehicleDetails.deleteOne({registrationTag: req.body.registrationTag});
        return res.send("vehicle deleted");
      } else {
        return res.status(404).send("vehicle not found"); 
      }
    })
  });

  //to add a booking use a different endpoint
  //TODO only update the params send
  router.put('/vehicle', passport.authenticate('jwt', {session: false}),User.checkIsInRole(User.Roles.Admin),
  (req, res) => {
    if (!req.body.registrationTag){
      return res.status(400).send("registrationTag missing");
    }
    vehicleDetails.findOne({registrationTag: req.body.registrationTag}).then((obj)=>{
      if (!obj){
        return res.status(404).send("vehicle not found"); 
      } else {
        obj.type = req.body.type;
        obj.location = req.body.location;
        obj.name = req.body.name;
        obj.manufacturer = req.body.manufacturer;
        obj.mileage = req.body.mileage;
        obj.modelYear = req.body.modelYear;
        obj.lastService = req.body.lastService;
        obj.condition = req.body.condition; 
        obj.save();
        return res.send(obj);
      }
    })
  });

  router.get('/locations', passport.authenticate('jwt', {session: false}), (req, res) => {
    console.log("Returning locations ");
    vehicleDetails.distinct("location").then((obj) => {
      if (obj){
        return res.send(obj);
      } else {
        return res.status(500).send("Server error");
      }
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

  //return the bookings of current user
  router.get('/bookings', passport.authenticate('jwt', {session: false}), (req, res) => {
    UserDetails.findOne({email: req.user.email}).then((user) => {
      return res.send(user.bookings);
    })
  });

//find one booking of this user
router.get('/booking', passport.authenticate('jwt', {session: false}), (req, res) => {
  if (!req.query.bookingId){
    return res.status(400).send('Missing bookingId parameter');
  } else {
    UserDetails.findOne({ $and: [ {email: req.user.email}, {bookings: req.query.bookingId }] }).then((user) => {
      if (!user){
        return res.status(404).send('No such booking found');
      } else {
        return res.send(user);
      }
    })
  }
});

//create one booking for this user
router.post('/booking', passport.authenticate('jwt', {session: false}), (req, res) => {
  
  //check if vehicle exists
  vehicleDetails.findOne({vehicleId: req.body.vehicleId}).then((v)=>{
    if (!v){
      return res.status(400).send("This vehicle does not exist");
    }
  })
  //generate an id
  //cost should be retrieved from vehicle
  var b = new BookingDetails({
    isActive: true,
    startTime: req.body.startTime,
    checkout: req.body.checkout,
    expectedCheckin: req.body.expectedCheckin,
    vehicleId: req.body.vehicleId
  });
  UserDetails.update({ email: req.user.email}, { $push: { bookings: b } }).then((obj)=>{
    if(obj.Modified){
      //Modify vehicle details also
      vehicleDetails.update({vehicleId: req.body.vehicleId}, { $push: { bookings: b } }).then((v)=>{
        if (!v.Modified){
          //Rollback booking
          //not safety checking
          UserDetails.update({email: req.user.email}, { $pop: {bookings: b}});
          res.status(500).send("Booking failed");
        }
      })
      
      return res.send('Created booking');
    } else {
      return res.status(500).send('Server error');
    }
  });
});

//update one booking
router.put('/booking', passport.authenticate('jwt', {session: false}), (req, res) => {
  
  //need id
  if (!req.query.bookingId){
    return res.status(400).send('bookingId parameter missing');
  } else {
   //cost should be retrieved from vehicle
    UserDetails.findOne({ $and: [ {email: req.user.email}, {bookings: req.query.bookingId }] }).then((user) => {
      user.bookings.isActive = req.body.isActive;
      user.bookings.actualCheckin = req.body.actualCheckin;
      //for now cost is not updated
      //base rate remains same but final cost is applied on return
      //user.bookings.cost = req.body.cost;
      user.bookings.feedback = req.body.feedback;
      user.bookings.complaints = req.body.complaints;
      user.bookings.paid = req.body.paid;
      user.save();
      return res.send("Booking updated");
    });
  }
});

//cancel a booking
router.delete('/booking', passport.authenticate('jwt', {session: false}), (req, res) => {
  
  //need id
  if (!req.query.bookingId){
    return res.status(400).send('bookingId parameter missing');
  } else {
    //before deletion check if its less than an hour before checkout
    //check if the booking is active also
    UserDetails.findOne({ $and: [ {email: req.user.email}, {bookings: req.query.bookingId }] }).then((user) => {
      if (user){
        if (user.bookings.isActive){
          const today = Date();
          const diffTime = user.bookings.checkout - today;
          if (diffTime > 0){
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60 )); 
            if (diffHours > 1){
              //donot delete, just change isActive to false for now
              user.bookings.isActive = false;
              user.save();
              return res.send("Booking cancelled");
            } else {
              return res.status(405).send("Booking must be cancelled atleast one hour before");
            } 
          } else {
            return res.status(405).send("This booking has already started");
          }
        } else {
          return res.status(405).send("This booking is not actives");
        }
      } else{
        return res.status(404).send("Booking not found");
      }
      }
      );
  }
});

router.post('/return', passport.authenticate('jwt', {session: false}), (req, res) => {
  //need id
  if (!req.query.bookingId){
    return res.status(400).send('bookingId parameter missing');
  } else {
    //check if this booking is valid
    //check if the booking is active also
    UserDetails.findOne({ $and: [ {email: req.user.email}, {bookings: req.query.bookingId }] }).then((user) => {
      if (user){
        if (user.bookings.isActive){
          //is this return valid?
          const today = Date();
          const diffTime = user.bookings.checkout - today;
          if (diffTime < 0){
              const diffHours = Math.ceil(diffTime / (1000 * 60 * 60 )); 
              user.bookings.isActive = false;
              //charge fees based on rate
              vehicleDetails.findOne({ vehicleId: user.bookings.vehicleId}).then((v)=>{
                if (v){
                  user.bookings.cost = user.bookings.cost + (diffHours * v.hourlyRate);
                } else {
                  return res.status(500).send("This vehicle does not exist in inventory");
                }
              })
              user.save();
              return res.send("Return succesful");
            } else {
              return res.status(405).send("Booking must be cancelled atleast one hour before");
            } 
          } else {
            return res.status(405).send("This booking has not started yet");
          }
        } else{
        return res.status(404).send("Booking not found");
      }
    })
  }
})



module.exports = router;