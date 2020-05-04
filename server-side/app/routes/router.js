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
var membershipDetails = require('../config/passport').MiscDetails;
const jwt = require('jsonwebtoken');
const keys = 'secret';
const moment = require('moment-timezone');
const TIMEZONE = 'America/Los_Angeles';



router.post('/register', (req, res) => {
    //TODO check if all params are received
    UserDetails.findOne({ $or : [{username: req.body.username}, {email: req.body.email}]}).then((user) => {
      if (user) {
        if (user.email.localeCompare(req.body.email) == 0){
          res.status(400).send("Error - email already used ");
        } else {
          res.status(400).send("Error - username already used ");
        }        
      } else {
        //console.log(req.body);
        var d = new Date();
        //membership end date is 6 months from now
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
          membershipActive: true,
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
  7. /user/membership - POST
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
    (req, res) =>{
      console.log(req.user);
      u = convertUserDate(req.user);
      res.send(req.user);
    }
  );
  
  router.all("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
  });
  
  
  /*
  endpoint : /user
  request type : DELETE
  query parameters : none
  body : email
  return : 200 user deleted
           status 500 user delete failed
           status 404 user not found 
  */
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

  /*
  endpoint : /user/membership
  request type : POST
  query parameters : none
  body :   none
  return : 200 membership extended
           500 user update failed
           404 user not found
  */
  router.post('/user/membership', passport.authenticate('jwt', {session: false}),
  (req, res) => {
    UserDetails.findOne({email: req.user.email}).then((user) => {
      if (user){
        var d = new Date(user.membershipEndDate); 
        if (user.membershipActive){
          d.setMonth(d.getMonth() + 6);
        } else {
          d = Date();
          d.setMonth(d.getMonth() + 6);
        }
        UserDetails.updateOne({email: req.user.email}, {membershipEndDate: d, membershipActive: true }).then((obj)=> {
          if (obj.ok != 1){
            console.log("Object update error");
            console.log(err);
            res.status(500).send('User update failed');
          } else {
            res.send('Membership extended');
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
  /*
  endpoint : /admin/user
  request type : DELETE
  query parameters : none
  body : email
  return : 200 user deleted
           500 user delete failed
           404 user not found
            
  */
  
  router.route('/admin/manageUsers').get((req, res) => {
   UserDetails.find({role: "Customer"})
     .then((userInfo) => { res.json(userInfo) })
    .catch(err => res.status(400).json('Error: ' + err));
});
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

  /*
  endpoint : /vehicle
  request type : GET
  query parameters : registrationTag
  return : Returns a single vehicle object
           status 400 if query param missing
           status 404 if vehcile not found 
  */
  router.get('/vehicle', passport.authenticate('jwt', {session: false}),(req, res) => {
    if (!req.query.registrationTag){
      return res.status(400).send("registrationTag missing");
    }
    vehicleDetails.findOne({registrationTag: req.query.registrationTag}).then((obj)=>{
      if (!obj){
        return res.status(404).send("vehicle not found"); 
      } else {
         return res.send(convertVehicle(obj));
      }
    })
  });

  /*
  endpoint : /vehicle
  request type : POST
  query parameters : none
  reqeuest body json : registrationTag, location, type, name, manufacturer, mileage, modelYear
              lastService, vehicleImageURL, condition, baseRate, hourlyRate ([array]), lateFees
  return : Returns the vehicle object saved
           status 400 if
           1. location doesn't exist
           2. location is in full capacity
           3. location does not exist
           Check the body of the return to identify the reason
  */
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
                hourlyRate: req.body.hourlyRate,
                lateFees: req.body.lateFees
              });
      
              vehicleDetails.create(v);
              //update the number then save
              loc.currentVehicles+=1;
              loc.save();
              return res.send(convertVehicle(v));
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

  /*
  endpoint : /vehicle
  request type : DELETE
  query parameters : registrationTag
  request body json : none
  return :  200 vehicle deleted 
            400 if registrationTag is missing
            404 if vehcile not found
  */
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

  /*
  endpoint : /vehicle
  request type : PUT
  query parameters : registrationTag 
  request body json : location, type, name, manufacturer, mileage, modelYear
              lastService, vehicleImageURL, condition, baseRate, hourlyRate ([array]), lateFees
  return :  200 and returns the updated object
            400 if
            1. registrationTag is missing
            2. The new location is full
            3. New location does not exist
            500 server error if old locaiton is not found(Won't possibly happen)
                
  */
 //TODO update only the parameters sent??
  router.put('/vehicle', passport.authenticate('jwt', {session: false}),User.checkIsInRole(User.Roles.Admin),
  (req, res) => {
    if (!req.query.registrationTag){
      return res.status(400).send("registrationTag missing");
    }
    vehicleDetails.findOne({registrationTag: req.query.registrationTag}).then((obj)=>{
      if (!obj){
        return res.status(404).send("vehicle not found"); 
      } else {
        //Check if location change
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
                obj.lateFees = req.body.lateFees;
                obj.save();
                loc.currentVehicles+=1;
                loc.save();
                //remove one vehicle from old location
                locationDetails.findOne({name: old_location}).then((old_loc)=> {
                  if (old_loc){
                    old_loc.currentVehicles-=1;
                    old_loc.save();
                    return res.send(convertVehicle(obj));
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
          obj.lateFees = req.body.lateFees;
          obj.save();
          return res.send(convertVehicle(obj));
        }
      }
    })
  });

  /*
  endpoint : /locations
  request type : GET
  query parameters : none
  request body json : none
  return :  Returns all the locations objects in db
            404 if no locaiton exists
  */
  router.get('/locations', (req, res) => {
    locationDetails.find({}).then((obj) => {
      if (obj){
        
        return res.send(obj);
      } else {
        return res.status(404).send("No locations exist");
      }
    });
  });

  /*
  endpoint : /location
  request type : GET
  query parameters : name 
  request body json : none
  return :  Returns vehicles in a location
            400 if missing name field
            404 if no cars exist
  */
  //get cars in a location
  router.get('/location', passport.authenticate('jwt', {session: false}), (req,res) => {
    if (!req.query.name) {
      return res.status(400).send('Missing name field');
    } else {
      vehicleDetails.find({ location: req.query.name} ).then((obj)=>{
        updated_vehicles = []
        if (Array.isArray(obj) && obj.length){
          for(var v of obj){
            updated_vehicles.push(convertVehicle(v));
          }
          return res.send(updated_vehicles);
        } else {
          return res.status(404).send("No cars");
        }
      });
    }
  });


  /*
  endpoint : /location
  request type : POST
  query parameters : none
  request body json : name, address, vehicleCapacity
  return :  200 and Location saved
            400 If location name already exists
  */
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
        l = new locationDetails({name: req.body.name, adress: req.body.address, vehicleCapacity: req.body.vehicleCapacity})
        l.save();
        return res.send("Location saved");
      }
    })
  })

   /*
  endpoint : /location
  request type : PUT
  query parameters : name
  request body json : address, vehicleCapacity
  return :  200 and updated Location saved
            404 location does not exist
            400 If vehicleCapacity is less than the number of vehicles already there
  */
  //create a new location
  router.put('/location', passport.authenticate('jwt', {session: false}), User.checkIsInRole(User.Roles.Admin),
  (req,res) => {
    //check if already exists
    //ISSUE
    //Sanjose can have multiple locaitons with different addesses
    //How do you take care of such cases
    locationDetails.findOne({ name: req.query.name}).then((loc)=> {
      if (loc){
        //check number of vehicles cuurently
        vehicleDetails.find({location: loc.name}).then((vehicles) => {
          if (vehicles.length <= req.body.vehicleCapacity) {
            loc.address = req.body.address;
            loc.vehicleCapacity = req.body.vehicleCapacity;
            loc.save();
            return res.send(loc);
          } else {
            return res.status(400).send("This location already has more vehicles than "+ req.body.vehicleCapacity);
          }
        })
      } else {
        return res.status(400).send("This location name already exists "+obj);
      }
    })
  })

  /*
  endpoint : /location
  request type : DELETE
  query parameters : name
  request body json : none
  return : 200 location deleted
           404 location not found
           400 name missing
           500 delte failed
  NOTE : delete currently does not cascadingly delete the cars in the location.
         We just set the cars to un assigned
         We also do not take care of the bookings in the current location. What should be done??
  */
  //delete a location
  router.delete('/location',passport.authenticate('jwt', {session: false}), User.checkIsInRole(User.Roles.Admin),
  (req,res) => {
    if (req.query.name){
      locationDetails.findOne({ name: req.query.name}).then((l)=> {
        if (l){
          locationDetails.deleteOne(l).then((result)=> {
            if (result.ok == 1){
              //Remove all the cars assigned to this location
              //TODO
              vehicleDetails.updateMany({location: req.query.name}, {location: "UNASSIGNED"}).then(
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
    } else {
      return res.status(400).send("name missing");
    }
   })



  /*
  endpoint : /bookings
  request type : GET
  query parameters : none
  request body json : none
  return :  200 returns the current users bookings which would be json array
  */
  //return the bookings of current user
  router.get('/bookings', passport.authenticate('jwt', {session: false}), (req, res) => {
    bookingDetails.find({ $query: {email: req.user.email}, $orderby: { isActive: 1 }}).then((bookings) => {
      var updated_bookings = []
      for (var booking of bookings){
        updated_bookings.push(convertBookingDate(booking));
      }
      return res.send(updated_bookings);
    })
  });

/*
  endpoint : /booking
  request type : GET
  query parameters : bookingId 
  request body json : none
  return : 200 booking object
           404 no such booking
  */
//find one booking of this user
router.get('/booking', passport.authenticate('jwt', {session: false}), (req, res) => {
  if (!req.query.bookingId){
    return res.status(400).send('Missing bookingId parameter');
  } else {
    bookingDetails.findOne({email: req.user.email, "_id": req.query.bookingId }).then((b) => {
      if (!b){
        return res.status(404).send('No such booking found');
      } else {
        //convert date objects to local time
        b = convertBookingDate(b);
        return res.send(b);
      }
    })
  }
});

/*
  endpoint : /booking
  request type : POST
  query parameters : registrationTag, checkOut, expectedCheckin
  request body json : none
  return : 200 bookingId
           400 vehicle not available at this time
           404 vehicle does not exist
           500 server error
           403 please renew your membership
  NOTE : currently this involves 3 independent mongo queries
         TODO need to change that to single atomic opertaion using Mongo Transactions !!
  */
//create one booking for this user
//check if this car is available at that time
//TODO change this to transaction
router.post('/booking', passport.authenticate('jwt', {session: false}), (req, res) => {
  
  //if user account is not active don't allow booking
  UserDetails.findOne({ email: req.user.email}).then((user)=> {
    if (user.membershipActive){
      //check if vehicle exists
      vehicleDetails.findOne({registrationTag: req.query.registrationTag}).then((v)=>{
        if (v){
            //check if there is already a booking
            isCarAvailable(req.query.registrationTag, req.query.checkOut, req.query.expectedCheckin ).then((available)=> {
            if (available.localeCompare("200") == 0){
              //generate an id
              //cost should be retrieved from vehicle
              var expectedCheckinDate = new Date(req.query.expectedCheckin);
              var checkOutDate = new Date(req.query.checkOut);
              var b = new bookingDetails({
                isActive: true,
                registrationTag: req.query.registrationTag,
                email: req.user.email, 
                checkOut: checkOutDate,
                vehicleObject: {name: v.name, manufacturer: v.manufacturer, registrationTag: v.registrationTag,
                  vehicleImageURL: v.vehicleImageURL, type: v.type, location: v.location },
                cost: 0,
                expectedCheckin: expectedCheckinDate
              });
              UserDetails.updateOne({ email: req.query.email}, { $push: { bookings: b._id } }).then((obj)=>{
                if(obj.ok){
                  //Modify vehicle details also

                  vehicleDetails.updateOne({registrationTag: req.query.registrationTag}, { $push: { bookings: b._id } }).then((k)=>{
                    if (k.ok){
                      b.cost = v.baseRate;
                      b.save();
                      return res.send(b._id);
                    } else {
                      //Rollback booking
                      //not safety checking
                      UserDetails.update({email: req.user.email}, { $pop: {bookings: b._id}}).then(()=>{
                        bookingDetails.deleteOne(b).then(()=> {
                          return res.status(500).send("Booking failed");
                        })
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
          return res.status(404).send("This vehicle does not exist");
        }
      })
    } else {
      res.status(403).send("Please renew your membership before booking");
    }
  })
});

/*
  endpoint : /booking
  request type : PUT
  query parameters : bookingId 
  request body json : isActive, checkOut, expectedCheckin, actualCheckin, feedback, complaints, paid
  return : 200 updated booking object
           400 missing bookingId parameter
           404 booking not found
  NOTE: We are not updating the cost factor - base rate remains the same but on return the price rate may increase??
  */
//update one booking -- Kind of like returning the car
router.put('/booking', passport.authenticate('jwt', {session: false}), (req, res) => {
  
  //need id
  if (!req.query.bookingId){
    return res.status(400).send('bookingId parameter missing');
  } else {
   //cost should be retrieved from vehicle
    bookingDetails.findOne({ email: req.user.email, "_id": req.query.bookingId }).then((b) => {
      if (b){
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
        return res.send(b);
      } else {
        return res.status(404).send("Booking not found");
      }
    });
  }
});

/*
  endpoint : /booking
  request type : DELETE
  query parameters : bookingId
  request body json : none
  return : We check if the time is 1 hour within the booking start time.
           If yes we return 405 status with "Booking must be cancelled atleast one hour before"
           Otherwise
           200 booking cancelled
           405 booking already started if booking already started
           405 booking is not active
           404 booking not found 
  */
//cancel a booking
router.delete('/booking', passport.authenticate('jwt', {session: false}), (req, res) => {
  //need id
  if (!req.query.bookingId){
    return res.status(400).send('bookingId parameter missing');
  } else {
    //before deletion check if its less than an hour before checkout
    //check if the booking is active also
    bookingDetails.findOne({ email: req.user.email, _id : req.query.bookingId}).then((b) => {
      if (b){
        if (b.isActive){
          const today = new Date();
          const checkOut = new Date(b.checkOut);
          const diffTime = checkOut.getTime() - today.getTime();
          if (diffTime > 0){
            //console.log(today.getTime(), diffTime, checkOut.getTime());
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60 )); 
            if (diffHours > 1){
              //donot delete, just change isActive to false for now
              b.isActive = false;
              //set cost to zero
              b.cost = 0
              b.save();
              return res.send("Booking cancelled");
            } else {
              //find rate for 1 hour
              vehicleDetails.findOne({ registrationTag: b.registrationTag }).then((v)=> {
                b.cost = b.cost + v.hourlyRate[0];
                b.isActive = false;
                b.save();
                return res.send("Charged for 1 hour");
              })
            } 
          } else {
            //console.log("Time difference");
            //console.log(diffTime)
            //console.log(today.getTime(), checkOut.getTime());
            return res.status(405).send("This booking has already started");
          }
        } else {
          return res.status(405).send("This booking is not active");
        }
      } else{
        return res.status(404).send("Booking not found");
      }
      }
      );
  }
});

/*
  endpoint : /return
  request type : POST
  query parameters : bookingId
  request body json : feedback, condition, rating
  return : 200 booking object
           400 bookingId parameter missing
           500 vehicle does not exist
           405 booking has not started
           405 booking is not active
           404 booking not found
  */
router.post('/return', passport.authenticate('jwt', {session: false}), (req, res) => {
  //need id
  if (!req.query.bookingId){
    return res.status(400).send('bookingId parameter missing');
  } else {
    //check if this booking is valid
    //check if the booking is active also
    bookingDetails.findOne({email: req.user.email, _id: req.query.bookingId }).then((b) => {
      if (b){
        //console.log("Inside query ",b);
        if (b.isActive){
          //console.log("Here in active ", b);
          //is this return valid?
          const today = new Date();
          const checkOut = new Date(b.checkOut);
          const expectedCheckin = new Date(b.expectedCheckin);
          const expectedDiffTime = expectedCheckin.getTime() - checkOut.getTime();
          const actualDiffTime = today.getTime() - checkOut.getTime();
          if (actualDiffTime > 0){
              const actualDiffHours = Math.ceil(actualDiffTime / (1000 * 60 * 60 )); 
              const expectedDiffHours = Math.ceil(expectedDiffTime / (1000 * 60 * 60 ));
              b.isActive = false;
              //charge fees based on rate
              vehicleDetails.findOne({ registrationTag: b.registrationTag}).then((v)=>{
                if (v){
                  b.cost = b.cost + (expectedDiffHours * v.hourlyRate[Math.floor(expectedDiffHours/5)%14]);
                  //late fees
                  if (actualDiffHours > expectedDiffHours){
                    //TODO NaN
                    b.lateFees = ((actualDiffHours) - (expectedDiffHours)) * v.lateFees;
                  }
                  b.isActive = false;
                  b.paid = true;
                  b.rating = req.body.rating;
                  b.feedback = req.body.feedback;
                  v.condition = req.body.condition;
                  v.save();
                  b.save();
                } else {
                  return res.status(500).send("This vehicle does not exist in inventory");
                }
              //console.log(b);
              return res.send(b);
              })
            } else {
              return res.status(405).send("Booking must start before return");
            } 
          } else {
            return res.status(405).send("This booking is not active");
          }
        } else{
        return res.status(404).send("Booking not found");
      }
    })
  }
})

/*
  endpoint : /vehicles
  request type : GET
  query parameters : All are optional 
                     location, type, manufacturer, condition, checkOut, expectedCheckin 
  request body json : none 
  return :  Array of vehicle objects available
  NOTE : For the vehicles matching the filters, We check for bookings in the given tie window; 
         If there are no bookings in the time window, then we add a field isAvailable with true value to the document.
         Otherise we set isAvailable to false in the document.
         If checkOut and expectedCheckin is not given, then it simply checks for active bookings for the given vehicle
  */
//get vehicles 
//Updated the search so that all the vehicles mathcing the criteria are returned with a boolean
//isAvailable set to true or false
//that way only will we be able to suggest find similar cars
//can be done by anyone
router.get('/vehicles', async (req,res) => {
  console.log("Searching for vehicle");
  var hrstart = process.hrtime();
  var query = {};
  var booking_query = {};
  var numberOfHours = 0;
  if (req.query.location){
      query.location = req.query.location;
  }
  if (req.query.type){
      query.type = req.query.type;
  }
  if (req.query.manufacturer){
      query.manufacturer = req.query.manufacturer;
  }
  if (req.query.condition){
      query.condition = req.query.condition;
  }
  if (req.query.checkOut){

    booking_query.$or = [{checkOut: {$lte: new Date(req.query.expectedCheckin), $gte: new Date(req.query.checkOut)}}]
  }
  if (req.query.expectedCheckin){
    booking_query.$or.push({expectedCheckin: {$lte: new Date(req.query.expectedCheckin), $gte: new Date(req.query.checkOut)}})
    numberOfHours = (new Date(req.query.expectedCheckin)).getTime() - (new Date(req.query.checkOut)).getTime();
    numberOfHours = Math.ceil(numberOfHours / (1000 * 60 * 60 )); 
  }
  booking_query.isActive = true;

  //Now query and return the vehicle objects
  console.log("Query is ", query);
  console.log("Booking query", booking_query);

  var available_cars = [];

  async function find_bookings(v, booking_query){
    booking_query.registrationTag = v.registrationTag;
    var b = await bookingDetails.find(booking_query)
    if (Array.isArray(b)&& (b.length == 0)){
      //console.log("Car is free ",booking_query, b);
      //if search issue delete following
      convertVehicle(v);
      var finalRate = {finalRate: v.baseRate + numberOfHours * v.hourlyRate[Math.floor(numberOfHours/5)%14]};
      var isAvailable = {isAvailable: true};
      //super sketchy
      v._doc = {...v._doc, ...finalRate, ...isAvailable}
      return v;
    } else {
      //if search issue delete following
      convertVehicle(v);
      //console.log("This car is not free");
      var isAvailable = {isAvailable: false};
      v._doc = {...v._doc, ...isAvailable};
      //returning so UI can take care of it
      return v;
    }
  }

  async function asyncForEach(obj, booking_query){
    for(let index=0; index < obj.length; index++){
      booking_query.registrationTag = booking_query.registrationTag;
      //available_cars.push()
      var b = await find_bookings(obj[index], booking_query)
      if (b){
        available_cars.push(b);
      }
    }
  }


  async function find_cars(query, booking_query){
    var obj = await vehicleDetails.find(query);
    //console.log("obj is ",obj);
  //check if this vehicle is free
  if (obj){
      //console.log(obj);
      await asyncForEach(obj, booking_query);
      //console.log("Looped ", available_cars);
      return available_cars;
    } else {
      //console.log("Didn't even loop")
      return available_cars;
    }
  }

  var available_cars = await find_cars(query, booking_query);
  //console.log("Returning ", available_cars);
  hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  return res.send(available_cars);
    
})

/*
  endpoint : /suggest/vehicles
  request type : GET
  query parameters : location is needed. others are optional 
                     type, manufacturer, condition, checkOut, expectedCheckin 
  request body json : none 
  return :  Array of vehicle objects available at locations other than this location
  NOTE : we return only the vehicles that match the query and are in other locations
  We dont return suggestions
  */

router.get('/suggest/vehicles', async (req,res) => {
  console.log("Searching for vehicle in other places");
  var hrstart = process.hrtime();
  var query = {};
  var booking_query = {};
  var numberOfHours = 0;
  if (req.query.location){
      query.location = { $ne: req.query.location };
  }
  if (req.query.type){
      query.type = req.query.type;
  }
  if (req.query.manufacturer){
      query.manufacturer = req.query.manufacturer;
  }
  if (req.query.condition){
      query.condition = req.query.condition;
  }
  if (req.query.checkOut){

    booking_query.$or = [{checkOut: {$lte: new Date(req.query.expectedCheckin), $gte: new Date(req.query.checkOut)}}]
  }
  if (req.query.expectedCheckin){
    booking_query.$or.push({expectedCheckin: {$lte: new Date(req.query.expectedCheckin), $gte: new Date(req.query.checkOut)}})
    numberOfHours = (new Date(req.query.expectedCheckin)).getTime() - (new Date(req.query.checkOut)).getTime();
    numberOfHours = Math.ceil(numberOfHours / (1000 * 60 * 60 )); 
  }
  booking_query.isActive = true;

  //Now query and return the vehicle objects
  console.log("Query is ", query);
  console.log("Booking query", booking_query);

  var available_cars = [];

  async function find_bookings(v, booking_query){
    booking_query.registrationTag = v.registrationTag;
    var b = await bookingDetails.find(booking_query)
    if (Array.isArray(b)&& (b.length == 0)){
      //console.log("Car is free ",booking_query, b);
      //if search issue delete following
      convertVehicle(v);
      var finalRate = {finalRate: v.baseRate + numberOfHours * v.hourlyRate[Math.floor(numberOfHours/5)%14]};
      var isAvailable = {isAvailable: true};
      //super sketchy
      v._doc = {...v._doc, ...finalRate, ...isAvailable}
      return v;
    } else {
      //dont return anything
    }
  }

  async function asyncForEach(obj, booking_query){
    for(let index=0; index < obj.length; index++){
      booking_query.registrationTag = booking_query.registrationTag;
      //available_cars.push()
      var b = await find_bookings(obj[index], booking_query)
      if (b){
        available_cars.push(b);
      }
    }
  }


  async function find_cars(query, booking_query){
    var obj = await vehicleDetails.find(query);
    //console.log("obj is ",obj);
  //check if this vehicle is free
  if (obj){
      //console.log(obj);
      await asyncForEach(obj, booking_query);
      //console.log("Looped ", available_cars);
      return available_cars;
    } else {
      //console.log("Didn't even loop")
      return available_cars;
    }
  }

  var available_cars = await find_cars(query, booking_query);
  //console.log("Returning ", available_cars);
  hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  return res.send(available_cars);
    
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
        bookingDetails.findOne({registrationTag: vid, isActive: true, $or: [{checkOut: {$lte: date2, $gte: date1}}, {expectedCheckin: {$lte: date2, $gte: date1}}] }).then((v)=> {
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

function convertBookingDate(b){
  var checkOut_tz = { checkOut: moment(b.checkOut).format()};
  var expectedCheckin_tz = { expectedCheckin: moment(b.expectedCheckin).format()};
  if (b.actualCheckin){
    var actualCheckin_tz = { actualCheckin: moment(b.actualCheckin).format() };
  } else {
    var actualCheckin_tz = { actualCheckin: null };
  }
  
  b._doc = {...b._doc, ...checkOut_tz, ...expectedCheckin_tz, ...actualCheckin_tz};
  return b;
}

function convertUserDate(u){
  creditCardExpiry = { creditCardExpiry: moment(u.creditCardExpiry).format()};
  membershipEndDate = { membershipEndDate: moment(u.membershipEndDate).format()};
  u._doc = {...u._doc, ...creditCardExpiry, ...membershipEndDate};
  return u;
}

function convertVehicle(v){
  lastService = { lastService: moment(v.lastService).format()};
  v._doc = {...v._doc, ...lastService}
  return v;
}

router.get('/membershipFee', passport.authenticate('jwt', {session: false}), (req, res) => {
  membershipDetails.find({}).then((obj) => {
    if (obj){
      
      return res.send(obj);
    } else {
      return res.status(404).send("No Membership Fee");
    }
  });
});


module.exports = router;