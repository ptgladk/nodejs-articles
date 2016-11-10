var User = require('../models/user');

var Security = {
    isAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error','You are not logged in');
            res.redirect('/login');
        }
    },

    alreadyAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error','You are already logged in');
            res.redirect('/');
        }
    },

    checkToken: function(req, res, next) {
        var token = req.get('authorization');
        User.findOne({ token: token }, function(err, user) {
            if (err) {
                res.statusCode = 500;
                return res.send({ error: 'Internal error' });
                
            }
            if (!user) {
                res.statusCode = 401;
                return res.send({ error: 'Unauthorized' });
            }

            req.user = user;
            next();
        });
    }
};

module.exports = Security;
