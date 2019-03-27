const {MongoClient} = require('mongodb');
let connection;
let db;
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
        "data": { /* Contenu du formulaire */ }
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
it('should aggregate docs from collection', async () => {
    const files = db.collection('users');
    await files.insertMany([
        {type: 'Document'},
        {type: 'Video'},
        {type: 'Image'},
        {type: 'Document'},
        {type: 'Image'},
        {type: 'Document'},
    ]);
    const topFiles = await files
        .aggregate([
            {$group: {_id: '$type', count: {$sum: 1}}},
            {$sort: {count: -1}},
        ])
        .toArray();
    expect(topFiles).toEqual([
        {_id: 'Document', count: 3},
        {_id: 'Image', count: 2},
        {_id: 'Video', count: 1},
    ]);
});
