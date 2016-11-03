var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// Registration form
router.get('/registration', function(req, res) {
    res.render('registration');
});

// Registration
router.post('/registration', function(req, res) {
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password_confirm', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('registration', {
            errors: errors
        });
        console.log(errors);
    } else {
        var newUser = new User({
            username: req.body.username,
            email: req.body.email,
            plainPassword: req.body.password
        });
        newUser.save(function(err, user) {
            if (err) {
                throw err;
            }
            console.log(user);
        });

        req.flash('success', 'You are successfully registered');
        res.redirect('/login');
    }
});

// Login
router.get('/login', function(req, res) {
    res.render('login');
});

module.exports = router;
