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
            formToCreate.setStatus("IN_PROGRESS").setCreatedAt().setUpdatedAt().setIdForm()
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
                    '<a href="' + CONFIG.host + '/edit/' + result._id + 
                    '"><button type="button">Accéder au formulaire!</button></a></p>')
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

    editForm(formId, userId, data) {
        const deferred = Q.defer();
        this.canEditForm(formId, userId).then(() => {
            Form.findOne({ "_id": formId }).then(form => {
                if (form) {
                    form.updateForm(data).setUpdatedAt();
                    const collabIndex = form.collaborateurs.findIndex(c => c.idCollaborateur === userId);
                    console.log(collabIndex);
                    if (collabIndex === form.collaborateurs.length - 1) {
                        console.log("DERNIER COLLABORATEUR");
                        form.setStatus("COMPLETED");
                        //Notify author by email
                        form.save().then(updatedForm => 
                            deferred.resolve({ err: false, data: updatedForm })
                        )
                        .catch(err => deferred.reject({ err: true, status: 400, message: err}));
                    }
                    else if (collabIndex != -1 && collabIndex < form.collaborateurs.length - 1){
                        console.log("COLLABORATEUR");
                        form.collaborateurs[collabIndex].acces = "COMPLETED";
                        const nextCollaborator = form.collaborateurs[collabIndex + 1];
                        form.collaborateurs[collabIndex + 1].acces = "EDITION";
                        form.save().then(updatedForm => {
                            deferred.resolve({ err: false, data: updatedForm });
                            this.notifyCollaborator(updatedForm, nextCollaborator.email);
                        })
                        .catch(err => deferred.reject({ err: true, status: 400, message: err}));
                    }
                    else if (collabIndex === -1) {
                        console.log("AUTEUR");
                        form.save().then(updatedForm => 
                            deferred.resolve({ err: false, data: updatedForm })
                        )
                        .catch(err => deferred.reject({ err: true, status: 400, message: err}));
                    }
                    else {
                        deferred.reject({ err: true, status: 400, message: "Erreur."})
                    }
                }
            })
            .catch(err => deferred.reject({ err: true, status: 400, message: err}));
        })
        .catch(err => deferred.reject({ err: true, status: 403, message: err}));
        return deferred.promise;
    }

    canEditForm(formId, userId) {
        return Form.findOne({ "_id": formId }).then(form => {
            if (form && 
                (form.collaborateurs.find(c => c.idCollaborateur === userId) || userId === form.auteur.idAuteur)) {
                return Promise.resolve();
            }
            else {
                return Promise.reject("Opération non permise.");
            }
        })
        .catch(err => Promise.reject(err));
    }

    notifyCollaborator(form, email) {
        console.log("NOTIFY COLLABORATOR");
        return this.mailer.sendMail(CONFIG.mailer.from,
            email,
            'Invitation pour remplir/signer un formulaire',
            'text',
            '<p>' + form.auteur.nom + ' vous invite à remplir/signer le formulaire ' +
            form.nomFormulaire + '</p><br>' + 
            '<a href="' + CONFIG.host + '/edit/' + form._id + 
            '"><button type="button">Accéder au formulaire!</button></a></p>')
            .then(()=> Promise.resolve(form))
            .catch(error => Promise.reject({ status: 400, message: error }));
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

    archiveForm(formId) {
        const deferred = Q.defer();
        Form.findOne({ "_id": formId }).then(form => {
            if (!form) {
                deferred.reject({ err: true, status: 404, message: "Le formulaire demandé n'existe pas."});
            }
            else {
                if (form.statut === "IN_PROGRESS") {
                    deferred.resolve({ err: true, status: 400, message: "[Formulaire en cours] Opération non permise!" });
                }
                else {
                    form.collaborateurs.map(collaborateur => collaborateur.acces = "PREVIEW");
                    form.setStatus("ARCHIVED").setUpdatedAt().save()
                    .then(archivedForm => 
                        deferred.resolve({ err: false, data: archivedForm }))
                    .catch(err => deferred.resolve({ err: true, status: 400, message: err }));
                }
            }
        });
        return deferred.promise;
    }

}

module.exports = FormsManager;