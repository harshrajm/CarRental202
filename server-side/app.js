http = require("http");
cors = require("cors");
const hostname = "localhost";
const port = process.env.PORT || 8080;

/*  EXPRESS SETUP  */

const express = require("express");
const app = express();
<<<<<<< HEAD
//app.use(
//  cors({
//    origin: "http://localhost:3000",
//    credentials: true
//  })
//);

app.use(cors({}));

//app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
//  res.header(
//    "Access-Control-Allow-Headers",
//    "Origin, X-Requested-With, Content-Type, Accept"
//  );
//  next();
//});
=======
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true
//   })
// );

app.use(cors());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
>>>>>>> 356b084371e33bbcbff739f0ee779165c8c340a3

app.use(express.static(__dirname));

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = require("./app/routes/router");
app.use(router);
app.listen(port);
console.log(`Server running at http://${hostname}:${port}/`);

//cron jobs / tasks
var task = require('./app/tasks/tasks').job;
task.start();
