var {User} = require('./../models/members');

let isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};



module.exports = {isAuthenticated};