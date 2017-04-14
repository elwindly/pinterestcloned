require('./../config/config');
var express = require('express');
var router = express.Router();
const {ObjectID} = require("mongodb");
const fetch = require('fetch').fetchUrl;
const _ = require('lodash');
const {Image} = require('./../models/images');
const {User} = require('./..//models/members');
const passportTwitter = require('./../auth/twitter');
const {authenticate} = require('./../middleware/authenticate');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

/* GET home page. */

router.get('/auth/twitter', passportTwitter.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    req.session.xAuth = req.user.twitter.username;
    req.session.profileLink = req.user.twitter.profilePic;

   // res.status(200).send();
    res.redirect('/');
  });

router.get('/logout', function(req, res) {
  req.session.xAuth = null;
  req.session.profileLink = null;
    req.logout();
    res.redirect('/');
});

router.get('/', (req,res)=> {
  let isLoggedIn = req.session.xAuth ? true : false;
  Image.find().then((images)=>{
    let imageList = images.map((image)=>{
      let voted = "shouldLogIn";
      if (isLoggedIn) { voted = image.voters.indexOf(req.session.xAuth) !== -1 ? "yes" : "no" };
      let own = req.session.xAuth === image.owner;
      return {id :image._id, link: image.link, title: image.title, owner: image.owner, profileLink: image.profileLink, likes:image.likes, own:own ,voted:voted }
    });    
    res.render('index', { 
      title: 'Pinterest Cloned' ,
      isLoggedIn:isLoggedIn,
      imageList:imageList
    });
  }).catch((e)=>{
    res.status(400).send();
  });
});

router.get('/userLogged',isLoggedIn, (req,res)=> {
  let name = req.session.xAuth;
  Image.find({owner: name}).then((images)=>{
    let imageList = images.map((image)=>{
      let voted = image.voters.indexOf(name) !== -1 ? "yes" : "no";
      return {id :image._id, link: image.link, title: image.title, owner: image.owner, profileLink: image.profileLink, likes:image.likes, own:true ,voted:voted };
    });
    res.render('index', { 
      title: 'Pinterest Cloned' ,
      isLoggedIn:true,
      imageList:imageList
    });
  }).catch((e)=>{
    res.status(400).send();
  });
}); 

router.get('/:userName', (req,res)=> {
  let name = req.params.userName;
  let isLoggedIn = req.session.xAuth ? true : false;
  Image.find({owner: name}).then((images)=>{
    let imageList = images.map((image)=>{
      let voted = "shouldLogIn";
      if (isLoggedIn) { voted = image.voters.indexOf(req.session.xAuth) !== -1 ? "yes" : "no" };
      let own = req.session.xAuth === image.owner;
      return {id :image._id, link: image.link, title: image.title, owner: image.owner, profileLink: image.profileLink, likes:image.likes, own:own ,voted:voted }
    });        
    res.render('index', { 
      title: 'Pinterest Cloned' ,
      isLoggedIn:isLoggedIn,
      imageList:imageList
    });
  }).catch((e)=>{
    res.status(400).send();
  });
}); 

router.post('/userLogged/newImage',isLoggedIn, (req,res)=> {
  let title = req.body.title;
  let link = req.body.link;

  let image = new Image({
      title: title,
      link: link,
      owner:req.session.xAuth,
      profileLink: req.session.profileLink
  });

  image.save().then((image)=>{
      return res.status(200).send(image);
  }).catch((e)=>{
    return res.status(400).send();
  });

});

router.delete('/userLogged/deleteImage',isLoggedIn, (req,res)=> {
  let imageId = req.body.id;
  //console.log(imageId);
  if(!ObjectID.isValid(imageId)){
    return res.status(404).send(e);
  }
    Image.findOneAndRemove({
        _id:imageId,
        owner:req.session.xAuth
    }).then((image)=>{
        if(!image){
            return res.status(404).send();
        }
        res.status(200).send({image});
    }).catch((e)=> res.status(404).send(e));
});

router.patch('/userLogged/like',isLoggedIn, (req,res)=> {
  let imageId = req.body.id;
  let voted = req.body.voted;
  if(!ObjectID.isValid(imageId)){
    return res.status(404).send(e);
  }

  if (voted === "yes") {
      Image.findOneAndUpdate( {
          _id: imageId
      }, {
          $inc: {"likes":-1}, 
          $pull: {voters:req.session.xAuth},
      }, function(err, raw) {
          if (err) res.status(400).send();
          res.status(200).send(raw);
      });
  } else {
      Image.findOneAndUpdate( {
        _id: imageId
    }, {
        $inc: {"likes":1}, 
        $push: {voters:req.session.xAuth},
    }, function(err, raw) {
        if (err) res.status(400).send();
        res.status(200).send(raw);
    });
  }
});

module.exports = router;
