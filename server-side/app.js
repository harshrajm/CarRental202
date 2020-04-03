
http = require('http'); 
  
const hostname = 'localhost'; 
const port = process.env.PORT || 8080; 
  
const db_user = process.env.DB_USER || '';
const db_password = process.env.DB_PASSWORD || '';
const db_connect_string = process.env.DB_CONNECT || 'localhost:27017/cmpe202';

const User = require('./app/models/user');


/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

app.use(express.static(__dirname));

const bodyParser = require('body-parser');
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

/*  PASSPORT SETUP  */
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
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

/* PASSPORT SIGNUP STRATEGY */
var LocalStrategy   = require('passport-local').Strategy;

app.post('/register', (req, res) => {
  //TODO check if all params are received
  UserDetails.findOne({email: req.body.email}).then((user) => {
    if (user) {
      console.log("---ERROR---");
      console.log(user);
      console.log(req.body.email);
      console.log("---ERROR---");
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

*/

const connectEnsureLogin = require('connect-ensure-login');

app.post('/login', (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/login?info=' + info);
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      return res.redirect('/');
    });

  })(req, res, next);
});

app.get('/login',
  (req, res) => res.sendFile('./app/views/login.html',
  { root: __dirname })
);

app.get('/',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.sendFile('./app/views/index.html', {root: __dirname})
);

app.get('/admin_dashboard',
  connectEnsureLogin.ensureLoggedIn(),User.checkIsInRole(User.Roles.Admin),
  (req, res) => res.sendFile('./app/views/private.html', {root: __dirname})
);

app.get('/user',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.send({user: req.user})
);

app.all("/logout", function(req, res) {
  req.logout();
  res.redirect("/login");
});

/* REGISTER SOME USERS */

UserDetails.register({username:'admin', active: false, role:'Admin'}, 'admin');

