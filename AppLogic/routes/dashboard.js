var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    messenger = require('../modules/messenger.js');

router.get('/models', protect, function(req, res) {
    var data = {
        user_id: req.user.id
    };
    console.log("DAAAAAAAAAAAAAAAAATTTTTTTTTTTTTTAAAAAAAAAAAAAAAAAA", data);
    var models = messenger.request('get_user_models', data, function(response) {
        console.log(response.data);
        res.render('dashboard/pages/models', {user: req.user, models: response.data});
    });

});

router.get('/newModel', protect, function(req, res) {
    res.render('dashboard/pages/newModel', {user: req.user});
});

router.post('/newModel', protect, function(req, res) {
    // pass the data sent through ajax so we can insert id
    var data = JSON.parse(req.body.data);
    console.log(data);
    // insert id into the object
    data.user_id = req.user.id;

    // send it off to model.create, send response on success
    model.create(data, function(response) {
        console.log("success");
        if (response.success) {
            res.send("success")
        }
    });
});

router.get('/data', protect, function(req, res) {
    var data = {
        user_id: req.user.id
    };
    messenger.request("get_user_data", data, function(response) {
        res.render('dashboard/pages/data', {user: req.user, data: response.data});
    });

});

router.get('/viewData/:id', protect, function(req, res) {
    var user = req.user;
    var data = {
        id: req.params.id
    };
    console.log("about to request");
    messenger.request("get_data", data, function(response) {
        res.render('dashboard/pages/viewData', {user: user, data: response});
    });
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

router.get('/suppBar/newLayer', protect, function(req, res) {
    res.render('dashboard/suppBar/newLayer', {user: req.user});
});

router.get('/suppBar/newPayment', protect, function(req, res) {
    res.render('dashboard/suppBar/newPayment', {user: req.user});
});

// modals
router.get('/modal/deleteAccount', protect, function(req, res) {
    res.render('dashboard/modal/deleteAccount', {user: req.user});
});

// modals
router.get('/modal/train/:id', protect, function(req, res) {
    messenger.request("get_user_data", {user_id: req.user.id}, function(data) {
        messenger.request("get_model", {id: req.params.id, user_id: req.user.id}, function(model) {
            console.log(model);
            res.render('dashboard/modal/train', {user: req.user, model: model.model, data: data.data});
        });
    });
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