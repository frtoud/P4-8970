var expect = require('chai').expect;
var mongoose = require('mongoose');
var Forms = require('../models/Forms');
var factories = require('./factories');
var formsManager = require('../managers/formsManager');

const collaborateurSchema = new Schema({
    firstName: { type: String, required: true },
    nom: { type: String, required: true },
    email: { type: String, required: true },
    ordre: { type: Number, required: true },
    access: { type: String, required: true }
});

var formsSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    idForm: { type: String, required: true },
    auteur: { type: Object, required: true },
    nomFormulaire: { type: String, required: true },
    collaborateurs: { type: [collaborateurSchema], required: true },
    statut: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    creeLe: { type: Date, required: true },
    modifieLe: { type: Date, required: true }
});

describe('forms', function() {
    beforeEach(function() {
        sinon.stub(formsManager, 'getFormById');
    });

    afterEach(function() {
        Forms.getFormById.restore();
    });
    it('getFormById should be called with valid params', function(done) {
        var f = factories.validForm();
        Forms.getFormById.yields(null, f);
        var req = { params: {}};
        var res = {
            send: sinon.stub()
        };
        sinon.assert.calledWith(res.send, f)
    });
});


// describe('forms.methos.setCreatedAt', function() {
//     it('should be invalid if name is empty', function(done) {
//         var f = new Forms();
//         f.setCreatedAt()(function(err) {
//                 expect(typeof(f.creeLe) === "Date");
//             });
//     });
// });



