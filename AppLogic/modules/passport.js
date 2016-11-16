// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var User = require('./user.js');


// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        console.log("Trying to serialize user");
        done(null, user);
    });
    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        console.log("Trying to deserialize user");
        User.find(user.email, function(err, user) {
            console.log("err: " + err);
            console.log("user: " + user);
            done(err, user);
        });
    });

    // SIGNUP
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            stateless: true,
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, callback) {
            process.nextTick(function() {
                // find a user whose email is the same as the forms email
                User.signup(req, email, password, callback);
            });
        }));

    // SIGNIN
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, callback) { // callback with email and password from our form
            User.login(email, password, callback);
        }));
};