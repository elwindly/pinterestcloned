const express = require('express');
const {Image} = require('./../models/images');
const {User} = require('./..//models/members');

function ShowController() {

    this.renderPage = ((res, list, isLoggedIn) => {
        res.render('index', { 
            title: 'Pinterest Cloned' ,
            isLoggedIn:isLoggedIn,
            imageList:list
        });          
    });

    this.allImages = ((req, res) => {
        let isLoggedIn = req.session.xAuth ? true : false;
        Image.listOfImages(req.session.xAuth, isLoggedIn)
            .then((list) => {
                this.renderPage(res, list, isLoggedIn);
            })
            .catch((e) => res.status(400).send()); 
    });

    this.oneUserImages = ((req, res) => {    
        req.sanitize('userName').escape();
        req.sanitize('userName').trim();
        let name = req.params.userName;
        let isLoggedIn = req.session.xAuth ? true : false;
        Image.listOfImages(req.session.xAuth, isLoggedIn, name)
            .then((list) => {
                this.renderPage(res, list, isLoggedIn);
            })
            .catch((e) => res.render('error', {message: "User does not exist!"})); 
    });

    this.ownPage = ((req, res) => {    
        Image.listOfImages(req.session.xAuth, true, req.session.xAuth)
            .then((list) => {
                this.renderPage(res, list, isLoggedIn);
            })
            .catch((e) => res.render('error', {message: "User does not exist!"})); 
    }); 
}

module.exports = ShowController;