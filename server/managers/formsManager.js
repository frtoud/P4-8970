'use strict';

const Q = require("q");
const mongoose = require('mongoose');
const Form = mongoose.model('Forms');
const Users = mongoose.model('Users');
const Mailer = require("../mailer/mailer");
const CONFIG = require("../lib/keys");
const T = require("../views/emails/text");

class FormsManager {

    constructor() {
        this.userAccess = ["WAITING", "EDITION", "COMPLETED", "PREVIEW"];
        this.formStatus = ["IN_PROGRESS", "COMPLETED", "ARCHIVED"];
        this.mailer = new Mailer('smtp.polymtl.ca', 587, false);
    }

    createForm(form, res) {
        const deferred = Q.defer();
        let formToCreate = new Form(form);
        this.canCreateForm(formToCreate.auteur.idAuteur, formToCreate.collaborateurs)
        .then(() => {
            formToCreate.setStatus("IN_PROGRESS").setCreatedAt().setUpdatedAt().setIdForm()
            .save().then(result => {
                //Get first collaborator
                let collaborator = result.collaborateurs[0].email;
                //notify by email the first collaborator
                this.notifyCollaborator(result, collaborator, res, deferred);
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

    editForm(formId, userId, data, attachments, res) {
        const deferred = Q.defer();
        this.canEditForm(formId, userId).then(() => {
            Form.findOne({ "_id": formId }).then(form => {
                if (form) {
                    form.data = data;
                    form.attachements = attachments;
                    form.setUpdatedAt();
                    const collabIndex = form.collaborateurs.findIndex(c => c.idCollaborateur === userId);
                    if (collabIndex === form.collaborateurs.length - 1) {
                        console.log("DERNIER COLLABORATEUR");
                        form.collaborateurs[collabIndex].acces = "COMPLETED";
                        form.setStatus("COMPLETED");
                        //Notify author by email
                        form.save().then(updatedForm => {
                            // res.render('emails/template', 
                            // { name : updatedForm.auteur.nom,
                            //   content: T.formCompletion.body + updatedForm.nomFormulaire,
                            //   title: T.formCompletion.button,
                            //   link: CONFIG.host + '/edit/' + updatedForm._id + '/valider'}, (err, html) => {
                            //     this.mailer.sendMail(CONFIG.mailer.from,
                            //         //email de l'auteur
                            //         "",
                            //         'Invitation pour valider un formulaire',
                            //         'Invitation pour valider un formulaire',
                            //         html)
                            //         .then(()=> deferred.resolve(updatedForm))
                            //         .catch(error => deferred.reject({ status: 400, message: error }));
                            // });
                            deferred.resolve(updatedForm);
                        })
                        .catch(err => deferred.reject({ err: true, status: 400, message: err}));
                    }
                    else if (collabIndex != -1 && collabIndex < form.collaborateurs.length - 1){
                        console.log("COLLABORATEUR");
                        form.collaborateurs[collabIndex].acces = "COMPLETED";
                        const nextCollaborator = form.collaborateurs[collabIndex + 1];
                        form.collaborateurs[collabIndex + 1].acces = "EDITION";
                        form.save().then(updatedForm => {
                            this.notifyCollaborator(updatedForm, nextCollaborator.email, res, deferred);
                        })
                        .catch(err => deferred.reject({ err: true, status: 400, message: err}));
                    }
                    else if (collabIndex === -1) {
                        console.log("AUTEUR");
                        form.save().then(updatedForm => 
                            deferred.resolve(updatedForm)
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

    notifyCollaborator(form, email, res, deferred) {
        console.log("NOTIFY COLLABORATOR");
        //TODO: FIX name (collab name)
        res.render('emails/template', 
                    { name : form.collaborateurs[0].nom,
                      content: form.auteur.nom + T.formEdition.body + form.nomFormulaire,
                      title: T.formEdition.button,
                      link: CONFIG.host + '/edit/' + form._id + '/modify'}, (err, html) => {
            return this.mailer.sendMail(CONFIG.mailer.from,
                email,
                'Invitation pour remplir/signer un formulaire',
                'Invitation pour remplir/signer un formulaire',
                html)
                .then(()=> deferred.resolve(form))
                .catch(error => deferred.reject({ status: 400, message: error }));
        });
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
            { "auteur.idAuteur": userId },
            { "collaborateurs": {$elemMatch: { "idCollaborateur" : userId }} }
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