var express = require('express');
var router = express.Router();
var Article = require('../models/article');

var Security = require('../lib/security');

// Article list
router.get('/', Security.isAuthenticated, function(req, res, next) {
    Article.find({userId: req.user._id }, function(err, articles) {
        res.render('article/index', { title: 'Articles', articles: articles });
    });
});

// Show article
router.get('/show/:id', Security.isAuthenticated, function(req, res, next) {
    Article.findOne({ _id: req.param('id'), userId: req.user._id }, function(err, article) {
        if (err) {
            throw err;
        }
        if (article) {
            res.render('article/show', { title: article.title, article: article });
        } else {
            next();
        }
    });
});

// New article form
router.get('/new', Security.isAuthenticated, function(req, res, next) {
    res.render('article/new', { title: 'Add new article' });
});

// Add article
router.post('/new', Security.isAuthenticated, function(req, res, next) {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('content', 'Content is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('article/new', {
            errors: errors
        });
    } else {
        var newArticle = new Article({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            userId: req.user._id
        });
        newArticle.save(function(err, user) {
            if (err) {
                throw err;
            }
        });

        req.flash('success', 'Article was successfully added');
        res.redirect('/article');
    }
});

// Edit article form
router.get('/edit/:id', Security.isAuthenticated, function(req, res, next) {
    Article.findOne({ _id: req.param('id'), userId: req.user._id }, function(err, article) {
        if (err) {
            throw err;
        }
        if (article) {
            res.render('article/edit', { title: 'Edit article', article: article });
        } else {
            next();
        }
    });
});

// Edit article
router.post('/edit/:id', Security.isAuthenticated, function(req, res, next) {
    var id = req.param('id');
    Article.findOne({ _id: id, userId: req.user._id }, function(err, article) {
        if (err) {
            throw err;
        }
        if (article) {
            req.checkBody('title', 'Title is required').notEmpty();
            req.checkBody('description', 'Description is required').notEmpty();
            req.checkBody('content', 'Content is required').notEmpty();

            var errors = req.validationErrors();

            if (errors) {
                res.render('article/edit', {
                    article: article,
                    errors: errors
                });
            } else {
                article.title = req.body.title;
                article.description = req.body.description;
                article.content = req.body.content;
                article.save(function(err, user) {
                    if (err) {
                        throw err;
                    }
                });

                req.flash('success', 'Article was successfully updated');
                res.redirect('/article');
            }

        } else {
            next();
        }
    });
});

// Delete article
router.post('/delete', Security.isAuthenticated, function(req, res, next) {
    Article.remove({ _id: req.body.id, userId: req.user._id }, function (err) {
        if (err) {
            throw err;
        }
        req.flash('success', 'Article was successfully deleted');
        res.redirect('/article');
    });
});

module.exports = router;
