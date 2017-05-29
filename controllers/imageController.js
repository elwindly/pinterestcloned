const express = require('express');
const {ObjectID} = require("mongodb");
const _ = require('lodash');

const {Image} = require('./../models/images');
const {User} = require('./..//models/members');
const {isAuthenticated} = require('./../middleware/authenticate');

function ImageController() {

    this.addImage = ((req, res) => {

        req.sanitize('title').escape();
        req.sanitize('title').trim();
        req.sanitize('link').escape();
        req.sanitize('link').trim();

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

    this.deleteImage = ((req, res) => {
        let imageId = req.body.id;

        if(!ObjectID.isValid(imageId)){
            return res.status(404).send();
        }
            Image.findOneAndRemove({
                _id:imageId,
                owner:req.session.xAuth
            }).then((image)=>{
                if(!image){
                    return res.status(404).send();
                }
                res.status(200).send({image});
        }).catch((e)=> res.status(404).send());
    });

    this.imageLike = ((req, res) => {
        let imageId = req.body.id;
        let voted = req.body.voted;
        if(!ObjectID.isValid(imageId)){
            return res.status(404).send();
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

}

module.exports = ImageController;