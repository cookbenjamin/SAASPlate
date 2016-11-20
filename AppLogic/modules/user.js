var dotenv = require('dotenv').config(),
    messenger = require('./messenger'),
    // pg = require('pg'),
    // config = {
    //     user     : process.env.DB_USERNAME,
    //     password : process.env.DB_PASSWORD,
    //     database : process.env.DB_DATABASE_NAME
    // },
    // pool = new pg.Pool(config),
    bcrypt = require('bcrypt-nodejs'),
    stripe = require("stripe")(process.env.STRIPE_ID),
    gravatar = require('nodejs-gravatar');

/**
 * Logs user in if user exists, otherwise creates new user and logs them in
 *
 * @constructor
 */
function User() {

}

User.login = function(email, password, callback) {
    // search for email
    User.find(email, function(err, user) {
        // if any errors, return them in the callback
        if (err) {
            return callback(err, null);
        } else if (User.validPassword(password, user.password)) {
            return callback(null, user)
        }
    });


};

User.signup = function(req, email, password, callback) {
    User.find(email, function(err, user) {
        if (user) {
            return callback("User already exists", null)
        } else {
            User.create(req, email, password, function(err, newUser) {
                if (err) {
                    return callback(err, null);
                } else {
                    User.insert(newUser, function (err) {
                        if (err) {
                            return callback(err, null);
                        } else {
                            return callback(null, newUser)
                        }
                    });
                }
            });
        }
    });
};

User.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.validPassword = function(given_password, existing_password) {
    return bcrypt.compareSync(given_password, existing_password);
};

User.find = function(email, callback) {
    messenger.request("get_data", {
        "table": "users",
        "columns": ["*"],
        "where": {
            "email": email
        }
    }, function(response) {
        return callback(null, response[0]);
    });
    // var sql = "SELECT id, name, email, password, stripe_id, image FROM users WHERE email = '" + email+"'";
    // pool.connect(function(err, client, done) {
    //     if (err) {
    //         return console.error('error fetching client from pool', err);
    //     }
    //     client.query(sql, function (err, result) {
    //         //call `done()` to release the client back to the pool
    //         // if cannot find email, user doesnt exist, return err
    //         done();
    //         if (result.rows) {
    //             return callback(null, result.rows[0]);
    //         } else {
    //             callback("No user found", null);
    //         }
    //     });
    // });
};

User.insert = function(user, callback) {
    messenger.request("post_data", {
        table: "users",
        data: user
    }, function(response) {
        return callback(null, response[0]);
    });
};

User.create = function(req, email, password, callback) {
    var newUser = {
        name: req.body.name,
        email: email,
        password: this.generateHash(password),
        image: gravatar.imageUrl(email)
    };
    stripe.customers.create({
        email: email
    }, function(err, customer) {
        // asynchronously called
        if (err) {
            callback(err, null);
        } else {
            newUser.stripe_id = customer.id;
            callback(null, newUser);
        }
    });
};

User.edit = function(user_id, data) {
    var string = "";
    // create string from key value pairs
    for (var key in data) {
        string += "`"+key+"`='"+data[key]+"', "
    }
    // remove final comma
    string = string.substring(0, str.length - 2);
    var sql = "UPDATE `users` SET "+string+" WHERE `id`="+user_id
};

module.exports = User;
