var expect = require('chai').expect;
var mongoose = require('mongoose');
var User = require('../models/Users');
var userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
lastName: { type: String, required: true },
email: { type: String, required: true },
hash: { type: String, required: true },
type: { type: String, required: true },
linkExpiration: { type: Date, required: true },
createdAt: {type: Date, required: true},
updatedAt: {type: Date, required: true{}
);

describe('users', function() {
    it('should be invalid if name is empty', function(done) {
        var u = new User();
        m.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});

