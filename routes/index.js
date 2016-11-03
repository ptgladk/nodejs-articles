var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Nodejs articles' });
});

// Registration form
router.get('/registration', function(req, res) {
    res.render('registration', { title: 'Registration' });
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
        });

        req.flash('success', 'You are successfully registered');
        res.redirect('/login');
    }
});

// Login form
router.get('/login', function(req, res) {
    res.render('login', { title: 'Login' });
});

// Local strategy
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            if (!user.checkPassword(password)) {
                return done(null, false, { message: 'Incorrect password' });
            }
                return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// Login
router.post(
    '/login',
    passport.authenticate('local', {
            successRedirect: '/',
            successFlash: 'You are successfully logged in',
            failureRedirect: '/login',
            failureFlash: true
        }
    ),
    function(req, res) {
        res.redirect('/');
    }
);

// Logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
});

module.exports = router;
