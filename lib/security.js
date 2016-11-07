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
    }
};

module.exports = Security;
