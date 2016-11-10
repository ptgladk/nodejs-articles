var express = require('express');
var router = express.Router();
var Article = require('../../models/article');
var Security = require('../../lib/security');

router.get('/', Security.checkToken, function(req, res) {
    return Article.find({userId: req.user._id}, function (err, articles) {
        if (!err) {
            return res.send(articles);
        } else {
            res.statusCode = 500;
            return res.send({ error: 'Internal error' });
        }
    });
});

router.get('/:id', Security.checkToken, function(req, res) {
    return Article.findOne({_id: req.param('id'), userId: req.user._id},
        function (err, article) {
            if (err) {
                res.statusCode = 500;
                return res.send({ error: 'Internal error' });
            }
            if (!article) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }
            return res.send(article);
        }
    );
});

router.post('/', Security.checkToken, function(req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('content', 'Content is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.statusCode = 400;
        return res.send({ errors: errors });
    } else {
        var newArticle = new Article({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            userId: req.user._id
        });
        newArticle.save(function(err, user) {
            if (err) {
                res.statusCode = 500;
                return res.send({ error: 'Internal error' });
            }
            return res.send({ status: 'success' });
        });
    }
});

router.put('/:id', Security.checkToken, function (req, res) {
    Article.findOne({ _id: req.param('id'), userId: req.user._id }, 
        function(err, article) {
            if (err) {
                res.statusCode = 500;
                return res.send({ error: 'Internal error' });
            }
            if (!article) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }
 
            req.checkBody('title', 'Title is required').notEmpty();
            req.checkBody('description', 'Description is required').notEmpty();
            req.checkBody('content', 'Content is required').notEmpty();

            var errors = req.validationErrors();

            if (errors) {
                res.statusCode = 400;
                return res.send({ errors: errors });
            } else {
                article.title = req.body.title;
                article.description = req.body.description;
                article.content = req.body.content;
                article.save(function(err, user) {
                    if (err) {
                        res.statusCode = 500;
                        return res.send({ error: 'Internal error' });
                    }
                    return res.send({ status: 'success' });
                });
            }
        }
    );
});

router.delete('/:id', Security.checkToken, function (req, res) {
    Article.findOne({ _id: req.param('id'), userId: req.user._id }, 
        function(err, article) {
            if (err) {
                res.statusCode = 500;
                return res.send({ error: 'Internal error' });
            }
            if (!article) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }
 
            article.remove(function(err) {
                if (err) {
                    res.statusCode = 500;
                    return res.send({ error: 'Internal error' });
                }

                return res.send({ status: 'success' });
            });
        }
    );
});

module.exports = router;
