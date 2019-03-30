'use strict';

const Q = require("q");
const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const Validator = require('validator');
const Mailer = require("../mailer/mailer");
const CONFIG = require("../lib/keys");
const T = require("../views/emails/text");

class UsersManager {
    constructor() {
        this.types = ['ADMIN', 'MANAGER', 'USER'];
        this.mailer = new Mailer('smtp.polymtl.ca', 587, false);
    }

    validate(user) {
        let errors = [];
        if (!user.firstName) {
            errors.push({
              "property": "firstName",
              "error": "First name must be defined"
            });
        }
        else if (user.firstName.length === 0) {
            errors.push({
              "property": "firstName",
              "error": "First name must not be an empty string"
            });
        }

        if (!user.lastName) {
            errors.push({
              "property": "lastName",
              "error": "Last name must be defined"
            });
        }
        else if (user.lastName.length === 0) {
            errors.push({
              "property": "lastName",
              "error": "Last name must not be an empty string"
            });
        }

        if (!user.email) {
            errors.push({
                "property": "email",
                "error": "Email must be defined"
            });
        } 
        else if (!Validator.isEmail(user.email)) {
            errors.push({
                "property": "email",
                "error": "Email must be valid"
            });
        }

        if(!user.type || user.type.length === 0) {
            errors.push({
                "property": "type",
                "error": "User type must be defined"
            });
        }
        else if (!this.types.includes(user.type)) {
            errors.push({
                "property": "type",
                "error": "User type must be in [ADMIN, MANAGER, USER]"
            });
        }
        return errors;
    }

    getUserById(id) {
        const deferred = Q.defer();
        Users.findOne({ "_id": id }).lean().exec((err, user) => {
            if (err || !user) {
                deferred.reject({ err: true, status: 404, message: "Utilisateur non trouvé." });
            }
            else {
                deferred.resolve({ err: false, data: user });
            }
        });
        return deferred.promise;
    }

    //Gets users of all types: ADMIN + MANAGER + USER
    getAllUsers() {
        const deferred = Q.defer();
        Users.find().lean().exec((err, users) => {
            if (err) {
                deferred.reject({ err: true, status: 400, message: "Erreur."});
            }
            else {
                deferred.resolve({ err: false, data: users });
            }
        });
        return deferred.promise;
    }

    getUsersByType(type) {
        const deferred = Q.defer();
        let filter = {};
        if (type && this.types.includes(type)) {
            filter = { "type": type };
        }
        Users.find(filter).lean().exec((err, users) => {
            if (err || !users) {
                deferred.reject({ err: true, status: 400, message: "Erreur." });
            }
            else {
                deferred.resolve({ err: false, data: users });
            }
        });
        return deferred.promise;
    }

    createUser(user, res) {
        const deferred = Q.defer();
        let finalUser = new Users(user);
        const errors = this.validate(finalUser);
        if (errors.length > 0) {
            deferred.reject({ err: true, status: 400, message: errors });
        }
        else {
            Users.findOne({ "email": finalUser.email }).lean().exec((err, result) => {
                if (err) {
                    deferred.reject({ err: true, status: 400, message: "Erreur." });
                }
                else if (!result) {
                    finalUser.setCreatedAt().setUpdatedAt().setLinkExpiration();
                    finalUser.save().then(user => {
                        res.render('emails/template', 
                        { name : user.firstName + ' ' + user.lastName,
                          content: T.accountActivation.body,
                          title: T.accountActivation.button,
                          link: CONFIG.host + '/password/' + user._id }, (err, html) => {
                            this.mailer.sendMail(CONFIG.mailer.from,
                                user.email, 
                                'Activation de compte - ' + user.firstName + ' ' + user.lastName,
                                'Activation de compte',
                                html)
                            .then(()=> deferred.resolve(user))
                            .catch(error => deferred.reject({ err: true, status: 400, message: error }));

                        });
                    });
                }
                else {
                    deferred.reject({ err: true, status: 400, message: "Adresse e-mail existante." });
                }
            });
        }
        return deferred.promise;
    }

    updateUserByID(id, user) {
        const deferred = Q.defer();
        const errors = this.validate(user);
        if (errors.length > 0) {
            deferred.reject({ err: true, status: 400, message: errors });
        }
        else {
            Users.findOne({ "_id": id }).then( res => {
                if (!res) {
                    deferred.reject({ err: true, status: 404, message: "Utilisateur non trouvé." });
                }
                else {
                    res.email = user.email;
                    res.type = user.type;
                    res.setUpdatedAt().save().then(result => deferred.resolve(result.toObj()));
                }
            });
        }
        return deferred.promise;
    }

    deleteUser(id) {
        const deferred = Q.defer();
        Users.find({"type": "ADMIN"}).then(results => {
            if(results.length > 1) {
              Users.findOneAndDelete({"_id": id}).lean().exec((err, user) => {
                if (err || !user) {
                    deferred.reject({ err: true, status: 404, message: "Utilisateur non trouvé." });
                } 
                else {
                    deferred.resolve({ err: false, data: user });
                }
              });
            }
            else {
              //Should not be able to remove the last user of type admin
              deferred.reject({ err: true, status: 403, message: "Opération non permise." });
            }
        });
        return deferred.promise;
    }

    resetPassword(id, res) {
        const deferred = Q.defer();
        Users.findOne({ "_id": id }).then(user => {
            if (!user) {
                deferred.reject({ err: true, status: 404, message: "Utilisateur non trouvé." });
            }
            else {
                user.setUpdatedAt().setLinkExpiration().save().then(user => {
                    res.render('emails/template', 
                    { name : user.firstName + ' ' + user.lastName,
                      content: T.passwordReset.body,
                      title: T.passwordReset.button,
                      link: CONFIG.host + '/password/' + user._id }, (err, html) => {
                        this.mailer.sendMail(CONFIG.mailer.from,
                            user.email, 
                            'Réinitialisation de mot de passe - ' + user.firstName + ' ' + user.lastName,
                            'Réinitialisation de mot de passe',
                            html)
                        .then(()=> deferred.resolve(user))
                        .catch(error => deferred.reject({ err: true, status: 400, message: error }));
                    });
                });
            }
        });
        return deferred.promise;
    }

    authenticateUser(user) {
        const deferred = Q.defer();
        Users.findOne({ "email" : user.email }).then((finalUser) => {
            if (!finalUser) {
                deferred.reject({ err: true, status: 404, message: "Utilisateur invalide." });
            }
            else {
                finalUser.validatePassword(user.password).then((result) => {
                    if (!result) {
                        deferred.reject({ err: true, status: 403, message: "Connexion refusée." });
                    }
                    else {
                        deferred.resolve({ err: false, data: finalUser.toAuthJSON() });
                    }
                });
            }
        });
        return deferred.promise;
    }

    setUserPassword(id, password) {
        const deferred = Q.defer();
        if (password && password.length >= 8 && !(/\s/.test(password)) 
        && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            Users.findOne({ "_id": id }).then(user => {
                if (!user) {
                    deferred.reject({ err: true, status: 404, message: "Utilisateur non trouvé." });
                }
                else {
                    user.setPassword(password, 8).then(() => 
                        user.setUpdatedAt().save().then(res => deferred.resolve(res))
                    );
                }
            });
        }
        else {
            deferred.reject({ 
                err: true, 
                status: 400, 
                message: "Mot de passe invalide." });
        }
        return deferred.promise;
    }
}

module.exports = UsersManager;
