const db_user = process.env.DB_USER || '';
const db_password = process.env.DB_PASSWORD || '';
const db_connect_string = process.env.DB_CONNECT || 'localhost:27017/cmpe202';


/*  PASSPORT SETUP  */
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('../models/user');
const vehicle = require('../models/vehicle');
var booking = require('../models/booking');
var location = require('../models/location');

passport.initialize();

/* MONGOOSE SETUP */
var mongoose   = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
//'+db_user+':'+db_password+'@'
mongoose.connect('mongodb://'+db_connect_string, { useNewUrlParser: true, useUnifiedTopology: true });

//console.log(User);
User.UserSchema.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', User.UserSchema, 'userInfo');
const VehicleDetails = mongoose.model('vehicleInfo', vehicle, 'vehicleInfo');
const BookingDetails = mongoose.model('bookingInfo', booking, 'bookingInfo');
const LocationDetails = mongoose.model('locationInfo', location, 'locationInfo');

/* PASSPORT LOCAL AUTHENTICATION */

passport.use(UserDetails.createStrategy());

passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey   : 'secret'
},
function (jwtPayload, cb) {

  //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.  
  return UserDetails.findOne({username: jwtPayload.username})
      .then(user => {
          return cb(null, user);
      })
      .catch(err => {
          return cb(err);
      });
}
));

/* REGISTER ADMIN USERS, Regular USER and some cars */
/* admin username password admin/admin */
/* Customer username password joeexotic/123456 */

UserDetails.register({username:'admin', active: false, role:'Admin'}, 'admin');
UserDetails.register({
	"username": "joeexotic",
    "name": "Joe Exotic",
    "email": "joeexotic@bing.com",
    "role": "Customer",
    "address": "JW Zoo, Oklhaoma, USA",
    "creditCard": "45776692102989",
    "creditCardIssuer": "VISA",
    "creditCardExpiry": "2021-04-01",
    "creditCardNameonCard": "John Doe",
    "creditCardCVV": "518",
    "licenseState": "Oklahoma",
    "membershipActive": true,
    "membershipEndDate": "2020-09-19",
    "profilePictureURL": "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F20%2F2020%2F04%2F03%2Fzoom-1.jpg",
    "licenseNumber": "7755AXD"
}, '123456');

var v = new VehicleDetails({
  "hourlyRate": [
    50,
    45,
    43,
    38,
    32,
    28,
    26,
    24,
    22,
    20,
    18,
    16,
    14,
    12,
    10
  ],
  "type": "Sedan",
  "location": "San Jose",
  "name": "Chaser",
  "registrationTag": "XYZ255711",
  "manufacturer": "Toyota",
  "mileage": 30,
  "modelYear": "2019-01-01T00:00:00.000Z",
  "lastService": "2020-04-12T08:00:00.000Z",
  "vehicleImageURL": "https://i.ebayimg.com/images/g/l-UAAOSwlwldSQab/s-l1600.jpg",
  "condition": "mint",
  "baseRate": 120});

  var v2 = new VehicleDetails({
    "hourlyRate": [
      45,
      38,
      36,
      34,
      32,
      30,
      28,
      26,
      24,
      22,
      20,
      18,
      16,
      14,
      12
    ],
    "type": "SUV",
    "location": "San Jose",
    "name": "Land Cruiser",
    "registrationTag": "XYZ255712",
    "manufacturer": "Toyota",
    "mileage": 20,
    "modelYear": "2019-01-01T00:00:00.000Z",
    "lastService": "2020-04-12T08:00:00.000Z",
    "vehicleImageURL": "http://hmg-prod.s3.amazonaws.com/images/tmna-2191021-land-cruiser-200-heritage-0001-1572378175.jpg",
    "condition": "mint",
    "baseRate": 250});

    var l2 = new LocationDetails({
      "name": "Santa Clara",
      "address": "Vista Montana",
      "vehicleCapacity": 5
      });
    
      var v3 = new VehicleDetails({
        "hourlyRate": [
            38,
            36,
            34,
            32,
            30,
            28,
            26,
            24,
            22,
            20,
            18,
            16,
            14,
            12,
            10
        ],
        "type": "SUV",
        "location": "Santa Clara",
        "name": "Land Cruiser",
        "registrationTag": "XYZ255714",
        "manufacturer": "Toyota",
        "mileage": 20,
        "modelYear": "2019-01-01T00:00:00.000Z",
        "lastService": "2020-04-12T08:00:00.000Z",
        "vehicleImageURL": "http://hmg-prod.s3.amazonaws.com/images/tmna-2191021-land-cruiser-200-heritage-0001-1572378175.jpg",
        "condition": "mint",
        "baseRate": 250});


var l = new LocationDetails({
  "name": "San Jose",
  "address": "101 E San Fernando Street",
  "vehicleCapacity": 10,
  });
  l.save().then(()=> {
    v.save().then(()=> {
      l.currentVehicles+=1;
      l.vehicles.push(v._id)
      l.save().then(()=> {
        v2.save().then(()=> {
          l.currentVehicles+=1;
          l.vehicles.push(v2._id)
          l.save().then(()=> {
            l2.save().then(()=> {
              v3.save().then(()=> {
                l2.currentVehicles+=1 ;
                l2.vehicles.push(v3._id)
                l2.save()
              }
              )
            })
          })
        })
      })
    })
  });

module.exports = { passport, UserDetails, User, VehicleDetails, vehicle, BookingDetails, booking, LocationDetails, location};

