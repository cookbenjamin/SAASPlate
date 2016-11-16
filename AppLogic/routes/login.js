var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    messenger = require('../modules/messenger.js');

router.get('/login', function(req, res, next) {
    res.render('login/login');
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/models', // redirect to the secure profile section
    failureRedirect: '/login' // redirect back to the sign up page if there is an error
    // failureFlash: true // allow flash messages
}));

router.get('/signup', function(req, res, next) {
    res.render('login/signup');
});

router.post('/signup', passport.authenticate('local-signup', {
    // todo change this to onboarding start workflow
    successRedirect: 'dashboard.example.com:3000/models', // redirect to the secure profile section
    failureRedirect: '/signup' // redirect back to the sign up page if there is an error
    // failureFlash: true // allow flash messages
}));

router.get('/logout', protect, function(req, res) {
    req.logout();
    res.redirect('/');
});

// A function to check whether the user is logged in
function isLoggedIn(req) {
    return req.isAuthenticated();
}

// route middleware to make sure a user is logged in
function protect(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
        // if they aren't redirect them to the hype page
    } else {
        res.redirect('/login');
    }
}

module.exports = router;