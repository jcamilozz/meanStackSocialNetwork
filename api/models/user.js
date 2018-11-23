'use strict'
var mongoose   = require('mongoose');
var schema     = mongoose.Schema;

var userSchema = schema({
   name:     String,
   surname:  String,
   nick:     String,
   email:    String,  
   password: String,
   rol:      String,
   image:    String
});

module.exports = mongoose.model('User', userSchema);