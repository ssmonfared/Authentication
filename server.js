
'use strict';

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  
  User = require('./api/models/userModel'),
  bodyParser = require('body-parser'),
  jsonwebtoken = require("jsonwebtoken");

  app.use(express.json())

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.get('/auth/sign_in', (req, res) => {
  res.render('login.ejs')
})

app.get('/auth/register', async (req, res) => {
  res.render('register.ejs', {name: 'Sahand'})
})

app.get('/profile', async (req, res) => {
  res.render('profile.ejs', {name: 'Sahand'})
})


const mongoose = require('mongoose');
const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000
};

  mongoose.connect('mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb', {useMongoClient:true})


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
   
    req.user = undefined;
    next();
  }
});

var routes = require('./api/routes/userRoutes');
routes(app);

app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});


app.listen(3000);

console.log(' RESTful API server started on: ' + port);

module.exports = app;