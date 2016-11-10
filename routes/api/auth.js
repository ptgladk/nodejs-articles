var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../../models/user');

// Authorization by email and password
router.post('/', function(req, res) {
    User.findOne({ email: req.param('email') }, function(err, user) {
        if (err) {
            res.statusCode = 500;
            return res.send({ error: 'Internal error' });
        }
        if (!user) {
            res.statusCode = 400;
            return res.send({ error: 'Incorrect email' });
        }
        var password = req.param('password');
        if (typeof password != 'string' || !user.checkPassword(password)) {
            res.statusCode = 400;
            return res.send({ error: 'Incorrect password' });
        }

        user.token = crypto.randomBytes(128).toString('hex');
        user.tokenCreated = Date.now();
        user.save(function(err, user) {
            if (err) {
                res.statusCode = 500;
                return res.send({ error: 'Internal error' });
            } else {
                return res.send({ 
                    email: user.email,
                    token: user.token,
                    tokenCreated: user.tokenCreated
                });
            }
        });
    });
});

module.exports = router;
