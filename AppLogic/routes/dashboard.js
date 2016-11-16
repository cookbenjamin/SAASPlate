var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    messenger = require('../modules/messenger.js');


router.get('/dashboard', protect, function(req, res) {
    res.render('dashboard/pages/dashboard', {user: req.user});
});

router.get('/settings', protect, function(req, res) {
    res.render('dashboard/pages/settings', {user: req.user});
});

// supBar
router.get('/suppBar/resetPassword', function(req, res) {
    var data = {};
    if (req.user) {
        data.user = req.user;
    }
    if (req.url.query = "async=true") {
        data.async = true;
    }
    res.render('dashboard/suppBar/resetPassword', data);
});

router.get('/suppBar/newPayment', protect, function(req, res) {
    res.render('dashboard/suppBar/newPayment', {user: req.user});
});

// modals
router.get('/modal/deleteAccount', protect, function(req, res) {
    res.render('dashboard/modal/deleteAccount', {user: req.user});
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