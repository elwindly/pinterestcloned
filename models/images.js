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

ImageSchema.statics.listOfImages = function(name, isLoggedIn, userPage) {
  const image = this;
  let filterBy = {};
  if (userPage) { filterBy.owner = userPage}; 

  return image.find(filterBy).then((images)=>{
    return images.map((image)=>{
      let voted = "shouldLogIn";
      if (isLoggedIn) { voted = image.voters.indexOf(name) !== -1 ? "yes" : "no" };
      let own =  name === image.owner;
      return {id :image._id, link: image.link, title: image.title, owner: image.owner, profileLink: image.profileLink, likes:image.likes, own:own ,voted:voted };
      });   
  });
};

var Image = mongoose.model('Image', ImageSchema);

module.exports = {Image};