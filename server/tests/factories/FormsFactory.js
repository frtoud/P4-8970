const FormsSchema = require('../../models/Forms');
const mongoose = require('mongoose');

class FormsFactory{
    constructor(){}
    makeForms(n){
        var db = mongoose.connection;
        var formsArray = [];
        var form = null;
        for(var i = 0; i < n; i++){
            form = new FormsSchema();
            form.idForm = "DA";
            form.auteur =  {
                "idAuteur": "5c8dbd4800de679f160dd618",
                "nom": "John Smith",
                "typeAuteur": "MANAGER"
            };
            form.nomFormulaire = "Avance de voyage" ;
            form.collaborateurs=
                [
                    { "idCollaborateur": "5c81f580d56259370d9e049a", "nom": "Jane Doe", "email": "jane.doe@email.com", "acces": "EDITION"},
                    { "idCollaborateur": "5c8dbcb700de679f160dd617", "nom": "John Smith", "email": "john.smith@email.com", "acces": "WAITING"}
                ];
            form.statut="IN_PROGRESS";
            form.data= newInstanceData;
            form.creeLe= new Date();
            form.modifierLe = new Date();
            formsArray.push(form);
        }
    }
}
