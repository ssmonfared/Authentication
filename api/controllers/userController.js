'use strict';

var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  User = mongoose.model('User');

exports.register = function(req, res) {

  if (req.body.isAdmin == true){

    if (req.body.adminPassword == "123"){
      var newUser = new User(req.body);
  
      newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
      newUser.save(function(err, user) {
        if (err) {
          return res.status(400).send({
            message: err
          });
        } else {
          user.hash_password = undefined;
          return res.json(user);
          //res.redirect('/auth/sign_in')
        }
      });
    }
    
  }
  else{
    var newUser = new User(req.body);
  
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      user.hash_password = undefined;
      return res.json(user);
      //res.redirect('/auth/sign_in')
    }
  });
  }
  


};


exports.sign_in = function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }  
    return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTFULAPIs') });
    
    res.header = { authorization: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTFULAPIs')};
    //res.redirect('/profile')
  });
};


exports.loginRequired = function(req, res, next) {

  if (req.user) {
    next();
  } else {

    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};
exports.profile = function(req, res, next) {
  if (req.user) {
    res.send(req.user);
    next();
  } 
  else {
   return res.status(401).json({ message: 'Invalid token' });
  }
};