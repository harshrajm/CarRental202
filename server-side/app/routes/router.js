var express = require('express');
var router = express.Router();

var passport = require('../config/passport').passport;
var UserDetails = require('../config/passport').UserDetails;
var User = require('../config/passport').User;

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

module.exports = router;