const mongoose = require('mongoose');

const { Schema } = mongoose;

const collaborateurSchema = new Schema({
    idCollaborateur: String,
    nom: String,
    email: String,
    //Not mandatory, we can use array index
    ordre: Number,
    acces: String
});

const FormsSchema = new Schema({
  idForm: String,
  auteur: {
      idAuteur: String,
      nom: String,
      typeAuteur: String
  },
  nomFormulaire: String,
  collaborateurs: [collaborateurSchema],
  statut: String,
  data: Schema.Types.Mixed,
  creeLe: Date,
  modifieLe: Date
});

FormsSchema.methods.setCreatedAt = function() {
    this.creeLe = new Date();
    return this;
}

FormsSchema.methods.setUpdatedAt = function() {
    this.modifieLe = new Date();
    return this;
}

FormsSchema.methods.setStatus = function(status) {
    this.statut = status;
    return this;
}

FormsSchema.methods.setIdForm = function() {
    this.idForm = this.idForm + "-" + this._id;
    return this;
}

FormsSchema.methods.updateForm = function(data) {
    Object.assign(this.data, data);
    return this;
}

FormsSchema.methods.toObj = function() {
    return {
        _id: this._id,
        idForm: this.idForm,
        auteur: this.auteur,
        nomFormulaire: this.nomFormulaire,
        collaborateurs: this.collaborateurs,
        statut: this.statut,
        creeLe: this.creeLe,
        modifieLe: this.modifieLe
    };
};

mongoose.model('Forms', FormsSchema);