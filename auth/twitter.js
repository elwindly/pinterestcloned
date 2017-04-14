require('./../config/config');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const mongoose = require('mongoose');
const {User} = require('./..//models/members');
const init = require('./init');

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMERKEY,
    consumerSecret: process.env.TWITTER_CONSUMERSECRET,
    callbackURL: process.env.CALLBACKURL
  },
function(token, tokenSecret, profile, done) {

        // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {

            User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser = new User();

                    // set all of the user data that we need
                    newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;
                    newUser.twitter.profilePic  = profile.photos[0].value;

                    // save our user into the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
    });

    }));

// serialize user into the session
init();


module.exports = passport;