const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcyript = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  twitter: {
    id: String,
    displayName: String,
    username: String,
    token:String,
    profilePic: String
  }
});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['twitter']);
};


var User = mongoose.model('User',UserSchema);

module.exports = {User} 