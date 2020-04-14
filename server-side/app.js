
http = require('http'); 
  
const hostname = 'localhost'; 
const port = process.env.PORT || 8080; 
  
/*  EXPRESS SETUP  */

const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors());

app.use(express.static(__dirname));

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var router = require('./app/routes/router');
app.use(router);
app.listen(port);
console.log(`Server running at http://${hostname}:${port}/`); 







