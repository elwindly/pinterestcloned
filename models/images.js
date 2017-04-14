const mongoose = require('mongoose');

const commonRules = {
    type:String,
    required:true,
    trim:true,
    minlength:1
};

var ImageSchema = new mongoose.Schema({
    title:commonRules,
    link:commonRules,
    owner:commonRules,
    profileLink:commonRules,
    likes:{
        type:Number,
        default:0
    },
    voters:[String]
});

var Image = mongoose.model('Image', ImageSchema);

module.exports = {Image};