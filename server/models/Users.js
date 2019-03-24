const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  hash: String,
  type: String,
  linkExpiration: Date,
  createdAt: Date,
  updatedAt: Date,
});


UsersSchema.methods.setPassword = function(password, saltRounds) {
  return bcrypt.hash(password, saltRounds).then(
    (hash) => {
      this.hash = hash;
      this.linkExpiration = null;
      this.setUpdatedAt();
    });
}

UsersSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.hash).then((res) => res);
};

UsersSchema.methods.setLinkExpiration = function() {
  this.hash = null; //Supprimer l'ancien mot de passe, s'il y a lieu
  const today = new Date();
  const expirationDate = new Date(today);
  this.linkExpiration = (expirationDate.setDate(today.getDate() + 60));
  return this;
}

UsersSchema.methods.setCreatedAt = function() {
  this.createdAt = new Date();
  return this;
}

UsersSchema.methods.setUpdatedAt = function() {
  this.updatedAt = new Date();
  return this;
}

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
  }, this.getSecret());
}

UsersSchema.methods.getSecret = function() {
  //Idéalement: utiliser un secret généré
  return this.updatedAt.toString();
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    type: this.type,
    token: this.generateJWT(),
  };
};

UsersSchema.methods.toObj = function() {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    type: this.type,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

mongoose.model('Users', UsersSchema);
