const MongoClient = require('mongodb').MongoClient;
// "_id": "5c8177712e64ab2736875bc7",
var admin = {
  "firstName": "Admin",
  "lastName": "Admin",
  "email": "admin@admin.com",
  "type": "ADMIN",
  "createdAt": new Date(),
  "updatedAt": new Date(),
  "linkExpiration": null,
  "hash": "$2b$08$lEykYbdAQ1aOLCPaxhkeTOpDwoLYIh0EkCZAjPenc9aYXpxuX41yu"
}

MongoClient.connect('mongodb://localhost:27017/', (err, client)=>{
  if (err) throw err;
  let db = client.db('polyforms');
  db.listCollections({name:"users"}).next(function(err, collinfo){
    if(!collinfo){
      db.createCollection("users", function(err, res){
        if(err) throw err;
      });
    }
  });
  db.collection("users").insertOne(admin, function(err, res){
    if (err) throw err;
    console.log('admin created');
  });
});



