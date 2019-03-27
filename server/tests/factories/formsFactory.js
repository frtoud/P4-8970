const Forms = require('../../models/Forms');
const mongoose = require('mongoose');

class FormsFactory{
    constructor(){}

    makeForms(n){
        var formsArray = [];
        var form = null;
        for(var i = 0; i < n; i++){
            var newInstanceIVentilationAF = [
                {
                    "id": 0,
                    "ubr": "ubr",
                    "compte": "compte",
                    "unite": "unite",
                    "percent": 1,
                    "montant": 2,
                },
                {
                    "id": 3,
                    "ubr": "ubr",
                    "compte": "compte",
                    "unite": "unite",
                    "percent": 4,
                    "montant": 5,
                }
            ]
            var date_1 = new Date();
            var date_2 = new Date();
            var newInstanceISignatures = [
                {
                    "id": "id",
                    "name": "name",
                    "assigneA": "assigneA",
                    "value": "value",
                    "date": date_1,
                },
                {
                    "id": "id",
                    "name": "name",
                    "assigneA": "assigneA",
                    "value": "value",
                    "date": date_2,
                }
            ]
            var dateDebut = new Date();
            var dateFin = new Date();
            var newInstanceData = {
                "demandeur": {
                    "id": "id",
                    "assigneA": "assigneA",
                    "nom": "nom",
                    "telephone": "telephone",
                    "centre": "centre",
                    "admin": "admin",
                },

                "beneficiaire": {
                    "id": "id",
                    "assigneA": "assigneA",
                    "nom" : "nom",
                    "prenom" : "prenom",
                    "mat_etudiant" : "mat_etudiant",
                    "mat_enseignant" : "mat_enseignant",
                },
                "cycle": {
                    "id": "id",
                    "assigneA": "assigneA",
                    "bac": true,
                    "bacec": true,
                    "mai": true,
                    "maiec": true,
                    "doc": true,
                    "docec": true
                },
                "details": {
                    "id": "id",
                    "assigneA": "assigneA",
                    "date_debut": dateDebut,
                    "date_fin": dateFin,
                    "statutVersement": "statutVersement",
                    "num_ref": "num_ref",
                    "montant": 6,
                    "subventionnaire": "subventionnaire"
                },
                "ventilation": {
                    "id": "id",
                    "assigneA": "assigneA",
                    "tableau": newInstanceIVentilationAF
                },
                "signatures": newInstanceISignatures
            }
            var newInstance =   {
                "form": {
                    "idForm": "DA",
                    "auteur": {
                        "idAuteur": "5c8dbd4800de679f160dd618",
                        "nom": "John Smith",
                        "typeAuteur": "MANAGER"
                    },
                    "nomFormulaire": "Avance de voyage",
                    "collaborateurs": [
                        { "idCollaborateur": "5c81f580d56259370d9e049a", "nom": "Jane Doe", "email": "jane.doe@email.com", "acces": "EDITION"},
                        { "idCollaborateur": "5c8dbcb700de679f160dd617", "nom": "John Smith", "email": "john.smith@email.com", "acces": "WAITING"}],
                    "data": newInstanceData
                }
            }
            mongoose.

        }
    }
}
