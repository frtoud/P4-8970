const {MongoClient} = require('mongodb');
let connection;
let db;
let newInstanceIVentilationAF = [
    {
        "id": number;
        "ubr": string;
        "compte": string;
        "unite": string;
        "percent": number;
        "montant": number;
    },
    {
        "id": number;
        "ubr": string;
        "compte": string;
        "unite": string;
        "percent": number;
        "montant": number;
    }
                                ]

let newInstanceISignatures = [
    {
       "id": string;
        "name": string;
        "assigneA": string;
        "value": string;
        "date": Date;
    },
    {
        "id": string;
        "name": string;
        "assigneA": string;
        "value": string;
        "date": Date;
    }
                             ]

let newInstanceData = {
    "demandeur": {
        "id": string;
        "assigneA": string;
        "nom": string;
        "telephone": string;
        "centre": string;
        "admin": string;
    }

    "beneficiaire": {
        "id": string;
        "assigneA": string;
        "nom" : string;
        "prenom" : string;
        "mat_etudiant" : string;
        "mat_enseignant" : string;
    }
    "cycle": {
        "id": string;
        "assigneA": string;
        "bac": boolean;
        "bacec": boolean;
        "mai": boolean;
        "maiec": boolean;
        "doc": boolean;
        "docec": boolean;
    }
    "details": {
        "id": string;
        "assigneA": string;
        "date_debut": Date;
        "date_fin": Date;
        "statutVersement": string;
        "num_ref": string;
        "montant": number;
        "subventionnaire": string;
    }
    "ventilation": {
        "id": string;
        "assigneA": string;
        "tableau": IVentilationAF[];
    }
    signatures: newInstanceISignatures;
}

let newInstance =   {
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

beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__);
    db = await connection.db(global.__MONGO_DB_NAME__);
});

afterAll(async () => {
    await connection.close();
    await db.close();
});

it('should be ok', async () => {
    const forms = db.collection('forms');
    await files.insertMany([
       newInstance
    ]);
    const topFiles = await forms
        .aggregate([
            {$group: {_id: '$type', count: {$sum: 1}}},
            {$sort: {count: -1}},
        ])
        .toArray();
    expect(topFiles).toEqual([
        // {_id: 'Document', count: 3},
        // {_id: 'Image', count: 2},
        // {_id: 'Video', count: 1},
    ]);
});
