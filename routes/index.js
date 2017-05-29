require('./../config/config');
const express = require('express');
const router = express.Router();
const {ObjectID} = require("mongodb");
const _ = require('lodash');
const {Image} = require('./../models/images');
const {User} = require('./..//models/members');
const passportTwitter = require('./../auth/twitter');
const {isAuthenticated} = require('./../middleware/authenticate');

const ImageController = require('./../controllers/imageController');
const ShowController = require('./../controllers/showController');
const UserAuthontroller = require('./../controllers/userAuthController');

const imageController = new ImageController();
const showController = new ShowController();
const userAuthController = new UserAuthontroller();

//homepage, ownPage and any user page
router.get('/', showController.allImages);
router.get('/userLogged',isAuthenticated, showController.ownPage); 
router.get('/:userName', showController.oneUserImages); 

router.post('/userLogged/newImage',isAuthenticated, imageController.addImage);

router.delete('/userLogged/deleteImage',isAuthenticated, imageController.deleteImage);

router.patch('/userLogged/like',isAuthenticated, imageController.imageLike);


//Passport oAuth
router.get('/auth/twitter', passportTwitter.authenticate('twitter'));
router.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/' }),
  userAuthController.logIn);
router.get('/logout', userAuthController.logOut);



module.exports = router;
