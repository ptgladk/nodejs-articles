var crypto = require('crypto');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.virtual('plainPassword')
    .set(function(plainPassword) {
        this.salt = crypto.randomBytes(32).toString('hex');
        this.password = this.encryptPassword(plainPassword);
    })
    .get(function() { return this.password; });

UserSchema.methods.encryptPassword = function(plainPassword) {
    return crypto.createHmac('sha1', this.salt).update(plainPassword).digest('hex');
};

UserSchema.methods.checkPassword = function(plainPassword) {
    return this.encryptPassword(plainPassword) === this.password;
};

module.exports = mongoose.model('User', UserSchema);
