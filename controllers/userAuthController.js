const express = require('express');
const {ObjectID} = require("mongodb");
const _ = require('lodash');

const {Image} = require('./../models/images');
const {User} = require('./..//models/members');
const {isAuthenticated} = require('./../middleware/authenticate');

function UserAuthController() {

    this.logIn = ((req, res) => {
        // Successful authentication
        req.session.xAuth = req.user.twitter.username;
        req.session.profileLink = req.user.twitter.profilePic;

        // res.status(200).send();
        res.redirect('/');
    });

    this.logOut = ((req, res) => {
        req.session.xAuth = null;
        req.session.profileLink = null;
        req.logout();
        res.redirect('/');
    });
}

module.exports = UserAuthController;