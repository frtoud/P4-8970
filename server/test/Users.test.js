var expect = require('chai').expect;
var mongoose = require('mongoose'); 
var User = require('../models/Users');
var userSchema = new mongoose.Schema({
    name: { type: String, required: true }
}); 
describe('users', function() {
    it('should be invalid if name is empty', function(done) {
        var u = new User();
        m.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});
