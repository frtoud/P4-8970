'use strict';

const Q = require("q");
const mongoose = require('mongoose');
const Form = mongoose.model('Forms');
const Users = mongoose.model('Users');
const Mailer = require("../mailer/mailer");
const CONFIG = require("../lib/keys");

class FormsManager {

    constructor() {
        this.userAccess = ["WAITING", "EDITION", "COMPLETED", "PREVIEW"];
        this.formStatus = ["IN_PROGRESS", "COMPLETED", "ARCHIVED"];
        this.mailer = new Mailer('smtp.polymtl.ca', 587, false);
    }

    createForm(form) {
        const deferred = Q.defer();
        let formToCreate = new Form(form);

        this.canCreateForm(formToCreate.auteur.idAuteur, formToCreate.collaborateurs)
        .then(() => {
            formToCreate.setStatus("IN_PROGRESS").setCreatedAt().setUpdatedAt()
            .save().then(result => {
                //Get first collaborator
                let collaborator = result.collaborateurs[0].email;
                //notify by email the first collaborator
                this.mailer.sendMail(CONFIG.mailer.from,
                    collaborator,
                    'Invitation pour remplir/signer un formulaire',
                    'text',
                    '<p>' + result.auteur.nom + ' vous invite à remplir/signer le formulaire ' +
                    result.nomFormulaire + '</p><br>' + 
                    '<button type="button">Accéder au formulaire!</button></p>')
                    .then(()=> deferred.resolve(result))
                    .catch(error => deferred.reject({ err: true, status: 400, message: error }));
            });
        })
        .catch(err => deferred.reject({ err: true, status: 400, message: err }));

        return deferred.promise;
    }

    canCreateForm(accountId, collaborators) {
        return Users.findOne({ "_id": accountId }).then(user => {
            if (user.type === "ADMIN" || user.type === "MANAGER") {
                return this.validateCollaborators(collaborators);
            }
            else {
                return Promise.reject("Opération non permise.");
            }
        });
    }

    validateCollaborators(collaborators) {
        if(collaborators.length != 0) {
            return Promise.all(collaborators.map(c => Users.findOne({ "_id": c.idCollaborateur })
            .then(user => user ? Promise.resolve(true) : Promise.reject())))
            .then(() => Promise.resolve())
            .catch(() => Promise.reject("La liste des collaborateurs contient un ou plusierus utilisateurs invalides."));
        }
        else {
            return Promise.reject("La liste des collaborateurs ne peut pas être vide.")
        }
    }

    editForm(formId, userId) {
        //collaborator access <- "COMPLETED"
        //call notifyNextCollaborator()
    }

    notifyNextCollaborator(formId, collaborator) {
        //notify by email
    }

    getFormById(id) {
        const deferred = Q.defer();
        Form.findOne({ "_id": id }).then(form => {
            if (!form) {
                deferred.reject({ err: true, status: 404, message: "Le formulaire demandé n'existe pas."});
            }
            else {
                deferred.resolve({ err: false, data: form });
            }
        });
        return deferred.promise;
    }

    getFormsByUser(userId) {
        const deferred = Q.defer();
        Form.find({$or:[
            { "auteur.idAuteur": userId},
            {"collaborateurs": {$elemMatch: { "idCollaborateur" : userId }}}
        ]}).then(forms => {
            if (!forms) {
                deferred.resolve({ err: false, data: []});
            }
            else {
                deferred.resolve({ 
                    err: false, 
                    data: forms.map(form => form.toObj()) 
                });
            }
        });
        return deferred.promise;
    }

    getAllForms() {
        const deferred = Q.defer();
        Form.find().then(forms => {
            if (!forms) {
                deferred.resolve({ err: false, data: []});
            }
            else {
                deferred.resolve({ 
                    err: false, 
                    data: forms.map(form => form.toObj()) 
                });
            }
        });
        return deferred.promise;
    }

    userCanAccessForm(userId, formId) {
        //if user is author or of type admin
        //grant "EDITION" access 
        //else if user is in collaborateurs
        //check collaborator access field and return 
        //{ canAccess: boolean, accessMode: "" }
    }

}

module.exports = FormsManager;