import jwtSecret from './jwtConfig';


/*  PASSPORT SETUP  */
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
app.listen(port);

/* PASSPORT LOCAL AUTHENTICATION */

passport.use(UserDetails.createStrategy());

passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());

/* PASSPORT SIGNUP STRATEGY */
var LocalStrategy   = require('passport-local').Strategy;