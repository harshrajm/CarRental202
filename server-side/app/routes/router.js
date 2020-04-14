var express = require('express');
var router = express.Router();

var passport = require('../config/passport').passport;
var UserDetails = require('../config/passport').UserDetails;
var User = require('../config/passport').User;
var vehicle = require('../config/passport').vehicle;
var vehicleDetails = require('../config/passport').VehicleDetails;
var bookingDetails = require('../config/passport').BookingDetails;
var locationDetails = require('../config/passport').LocationDetails;
var booking = require('../config/passport').booking;
var location = require('../config/passport').location;

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
          profilePictureURL: req.body.profilePictureURL,
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
          var admin = false;
          if (user.role.localeCompare(User.Roles.Admin) == 0){
            admin = true;
          }
        const payload = {
          username: user.username,
          isAdmin: admin,
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

  router.post('/user/membership', passport.authenticate('jwt', {session: false}),
  (req, res) => {
    UserDetails.findOne({email: req.user.email}).then((user) => {
      if (user){
        var d = Date(user.membershipEndDate);
        d.setMonth(d.getMonth() + 6);
        UserDetails.updateOne({email: req.body.email}, {membershipEndDate: d }).then((obj)=> {
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
  }
  )

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
3. /vehicle/{registrationTag} - GET - get a vehicle from db - customer/admin
4. /vehicle/{registrationTag} - DELETE - delete a vehicle db - admin only
5. /vehicle/{registrationTag} - PUT - update a vehicle in db - admin only
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
    //check if the location exists and has the capacity
    locationDetails.findOne({name: req.body.location}).then((loc)=>{
      if (loc){
        if (loc.vehicleCapacity > loc.currentVehicles){
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
                vehicleImageURL: req.body.vehicleImageURL,
                condition: req.body.condition,
                baseRate: req.body.baseRate,
                hourlyRate: req.body.hourlyRate
              });
      
              vehicleDetails.create(v);
              //update the number then save
              loc.currentVehicles+=1;
              loc.save();
              return res.send(v);
            } else {
              return res.status(400).send("vehicle with same id exists"); 
            }
          })

        } else {
          return res.status(400).send("This location is full");
        }
      } else {
        return res.status(400).send("Location does not exist");
      }
    });
    
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
        //Chek if location change
        var old_location = obj.location;
        if (req.body.location.localeCompare(obj.location) != 0){
          //check new location capacity
          locationDetails.findOne({name: req.body.location}).then((loc)=>{
            if (loc){
              if (loc.vehicleCapacity > loc.currentVehicles){
                obj.type = req.body.type;
                obj.location = req.body.location;
                obj.name = req.body.name;
                obj.manufacturer = req.body.manufacturer;
                obj.mileage = req.body.mileage;
                obj.modelYear = req.body.modelYear;
                obj.lastService = req.body.lastService;
                obj.vehicleImageURL = req.body.vehicleImageURL;
                obj.condition = req.body.condition; 
                obj.baseRate = req.body.baseRate;
                obj.hourlyRate = req.body.hourlyRate;
                obj.save();
                loc.currentVehicles+=1;
                loc.save();
                //remove one vehicle from old location
                locationDetails.findOne({name: old_location}).then((old_loc)=> {
                  if (old_loc){
                    old_loc.currentVehicles-=1;
                    old_loc.save();
                    return res.send(obj);
                  } else {
                    return res.status(500).send("Server error -> Cant find old location");
                  }
                })
              } else {
                return res.status(400).send("This location is full");
              }
            } else {
              return res.status(400).send("Location does not exist");
            }
          })
        } else {
          obj.type = req.body.type;
          obj.location = req.body.location;
          obj.name = req.body.name;
          obj.manufacturer = req.body.manufacturer;
          obj.mileage = req.body.mileage;
          obj.modelYear = req.body.modelYear;
          obj.lastService = req.body.lastService;
          obj.vehicleImageURL = req.body.vehicleImageURL;
          obj.condition = req.body.condition; 
          obj.baseRate = req.body.baseRate;
          obj.hourlyRate = req.body.hourlyRate;
          obj.save();
          return res.send(obj);
        }
      }
    })
  });

  router.get('/locations', passport.authenticate('jwt', {session: false}), (req, res) => {
    locationDetails.find({}).then((obj) => {
      if (obj){
        return res.send(obj);
      } else {
        return res.status(404).send("No locations exist");
      }
    });
  });

  //get cars in a location
  router.get('/location', passport.authenticate('jwt', {session: false}), (req,res) => {
    if (!req.query.name) {
      return res.status(400).send('Missing name field');
    } else {
      vehicleDetails.find({ location: req.query.name} ).then((obj)=>{
        if (Array.isArray(obj) && obj.length){
          return res.send(obj);
        } else {
          return res.status(404).send("No cars");
        }
      });
    }
  });

  //create a new location
  router.post('/location', passport.authenticate('jwt', {session: false}), User.checkIsInRole(User.Roles.Admin),
  (req,res) => {
    //check if already exists
    //ISSUE
    //Sanjose can have multiple locaitons with different addesses
    //How do you take care of such cases
    locationDetails.findOne({ name: req.body.name}).then((obj)=> {
      if (obj){
        return res.status(400).send("This location name already exists "+obj);
      } else {
        l = new locationDetails({name: req.body.name, adress: req.body.adress, vehicleCapacity: req.body.vehicleCapacity})
        l.save();
        return res.send("Location saved");
      }
    })
  })

  //delete a location
  router.delete('/location',passport.authenticate('jwt', {session: false}), User.checkIsInRole(User.Roles.Admin),
  (req,res) => {
    locationDetails.findOne({ name: req.body.name}).then((l)=> {
      if (l){
        locationDetails.deleteOne(l).then((result)=> {
          if (result.ok == 1){
            //Remove all the cars assigned to this location
            //TODO
            vehicleDetails.updateMany({location: req.body.name}, {location: "UNASSIGNED"}).then(
              (obj)=> {
                if (obj.Matched ){
                  if (obj.Modified){
                    return res.send("Location deleted");
                  } else {
                    //TODO should I rollback the location delete??
                    return res.status(500).send("Delete failed. Server error");
                  }
                } else {
                  return res.send("Location deleted");
                }
              });
          } else {
            return res.status(500).send("Delete failed");
          }
        })
      } else {
        return res.status(404).send("location not found");
      }
     })
   })



  //return the bookings of current user
  router.get('/bookings', passport.authenticate('jwt', {session: false}), (req, res) => {
    bookingDetails.find({email: req.user.email}).then((b) => {
      return res.send(b);
    })
  });

//find one booking of this user
router.get('/booking', passport.authenticate('jwt', {session: false}), (req, res) => {
  if (!req.query.bookingId){
    return res.status(400).send('Missing bookingId parameter');
  } else {
    bookingDetails.findOne({email: req.user.email, "_id": req.query.bookingId }).then((b) => {
      if (!b){
        return res.status(404).send('No such booking found');
      } else {
        return res.send(b);
      }
    })
  }
});

//create one booking for this user
//check if this car is available at that time
router.post('/booking', passport.authenticate('jwt', {session: false}), (req, res) => {
  
  //check if vehicle exists
  vehicleDetails.findOne({registrationTag: req.body.registrationTag}).then((v)=>{
    if (v){
        //check if there is already a booking
        isCarAvailable(req.body.registrationTag, req.body.checkOut, req.body.expectedCheckin ).then((available)=> {
        if (available.localeCompare("200") == 0){
          //generate an id
          //cost should be retrieved from vehicle
          var b = new bookingDetails({
            isActive: true,
            registrationTag: req.body.registrationTag,
            email: req.user.email, 
            checkOut: req.body.checkOut,
            expectedCheckin: req.body.expectedCheckin,
            registrationTag: req.body.registrationTag
          });
          b.save();
          UserDetails.updateOne({ email: req.user.email}, { $push: { bookings: b._id } }).then((obj)=>{
            if(obj.ok){
              //Modify vehicle details also
              vehicleDetails.updateOne({registrationTag: req.body.registrationTag}, { $push: { bookings: b._id } }).then((v)=>{
                if (v.ok){
                  return res.send('Created booking');
                } else {
                  //Rollback booking
                  //not safety checking
                  UserDetails.update({email: req.user.email}, { $pop: {bookings: b._id}}).then(()=>{
                    return res.status(500).send("Booking failed");
                  });
                }
              })
      } else {
        return res.status(500).send('Server error');
      }
    });
  } else {
    //This is when you need to suggest other cars
    //That can be a different call from the client side
    return res.status(400).send("vehicle not available at this time");
  }
  });
    } else {
      console.log()
      return res.status(400).send("This vehicle does not exist");
    }
  })
});

//update one booking
router.put('/booking', passport.authenticate('jwt', {session: false}), (req, res) => {
  
  //need id
  if (!req.query.bookingId){
    return res.status(400).send('bookingId parameter missing');
  } else {
   //cost should be retrieved from vehicle
    bookingDetails.findOne({ email: req.user.email, "_id": req.query.bookingId }).then((b) => {
      b.isActive = req.body.isActive;
      b.checkOut = b.checkOut;
      b.expectedCheckin = req.body.expectedCheckin;
      b.actualCheckin = req.body.actualCheckin;
      //for now cost is not updated
      //base rate remains same but final cost is applied on return
      //user.bookings.cost = req.body.cost;
      b.feedback = req.body.feedback;
      b.complaints = req.body.complaints;
      b.paid = req.body.paid;
      b.save();
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
    bookingDetails.findOne({ email: req.user.email, "_id": req.query.bookingId}).then((b) => {
      if (b){
        if (b.isActive){
          const today = Date();
          const diffTime = b.checkout - today;
          if (diffTime > 0){
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60 )); 
            if (diffHours > 1){
              //donot delete, just change isActive to false for now
              b.isActive = false;
              b.save();
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
    bookingDetails.findOne({email: req.user.email, _id: req.query.bookingId }).then((b) => {
      if (b){
        if (b.isActive){
          //is this return valid?
          const today = Date();
          const diffTime = b.checkout - today;
          if (diffTime < 0){
              const diffHours = Math.ceil(diffTime / (1000 * 60 * 60 )); 
              b.isActive = false;
              //charge fees based on rate
              vehicleDetails.findOne({ registrationTag: b.registrationTag}).then((v)=>{
                if (v){
                  //TODO fix formula
                  b.cost = b.cost + (diffHours * v.hourlyRate);
                } else {
                  return res.status(500).send("This vehicle does not exist in inventory");
                }
              })
              b.save();
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


//NON Router methods
function isCarAvailable(vid, date_a, date_b){
  //check if vehicle exists
  var date1 = new Date(date_a);
  var date2 = new Date(date_b);
  return new Promise(resolve => {
    vehicleDetails.findOne({registrationTag: vid}).then((obj)=> {
      if (obj){
        //find bookings with the given date range
        bookingDetails.findOne({registrationTag: vid, isActive: true, checkOut: {$lte: date2, $gte: date1}, expectedCheckin: {$lte: date2, $gte: date1}}).then((v)=> {
          if (v){
            //there are active bookings in the given range
            console.log("Booking conflict");
            resolve("400");
          } else {
            resolve("200");
          }
        })
  
      } else {
        resolve("404");
      }
  
    })
   })
}


module.exports = router;