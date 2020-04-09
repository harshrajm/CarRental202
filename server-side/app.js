
http = require('http'); 
  
const hostname = 'localhost'; 
const port = process.env.PORT || 8080; 
  
const db_user = process.env.DB_USER || '';
const db_password = process.env.DB_PASSWORD || '';
const db_connect_string = process.env.DB_CONNECT || 'localhost:27017/cmpe202';

const User = require('./app/models/user');

const secret = require('./app/config/jwtConfig');


/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

app.use(express.static(__dirname));

const bodyParser = require('body-parser');
//const expressSession = require('express-session')({
//  secret: 'secret',
//  resave: false,
//  saveUninitialized: false
//});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(expressSession);

/*  PASSPORT SETUP  */
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');
const keys = 'secret';
app.use(passport.initialize());
app.listen(port);
console.log(`Server running at http://${hostname}:${port}/`); 

/* MONGOOSE SETUP */
var mongoose   = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
//'+db_user+':'+db_password+'@'
mongoose.connect('mongodb://'+db_connect_string, { useNewUrlParser: true, useUnifiedTopology: true });

//console.log(User);
User.UserSchema.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', User.UserSchema, 'userInfo');

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

/* PASSPORT SIGNUP STRATEGY */
var LocalStrategy   = require('passport-local').Strategy;

app.post('/register', (req, res) => {
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

ENDPOINTS
---------
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
7. /admin/user - DELETE - delete other users -> for admin only

*/


app.post('/login', (req, res) => {
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

app.get('/login',
  (req, res) => res.sendFile('./app/views/login.html',
  { root: __dirname })
);

app.get('/',
  passport.authenticate('jwt', {session: false}),
  (req, res) => res.sendFile('./app/views/index.html', {root: __dirname})
);

app.get('/admin_dashboard',
passport.authenticate('jwt', {session: false}),User.checkIsInRole(User.Roles.Admin),
  (req, res) => res.sendFile('./app/views/private.html', {root: __dirname})
);

app.get('/user',
 passport.authenticate('jwt', {session: false}),
  (req, res) => res.send({user: req.user})
);

app.all("/logout", function(req, res) {
  req.logout();
  res.redirect("/login");
});

//delete user endpoint
//this endpoint is for admin only
app.delete('/admin/user', passport.authenticate('jwt', {session: false}),User.checkIsInRole(User.Roles.Admin),
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

//delete user endpoint
//this endpoint is for customer only
//to terminate his account
app.delete('/user', passport.authenticate('jwt', {session: false}),User.checkIsInRole(User.Roles.Customer),
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


/* REGISTER ADMIN USERS */

UserDetails.register({username:'admin', active: false, role:'Admin'}, 'admin');

