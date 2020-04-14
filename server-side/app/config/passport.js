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

/* REGISTER ADMIN USERS */

UserDetails.register({username:'admin', active: false, role:'Admin'}, 'admin');

module.exports = { passport, UserDetails, User, VehicleDetails, vehicle, BookingDetails, booking, LocationDetails, location};

