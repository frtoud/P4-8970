var MongoClient = require('mongodb').MongoClient;
var admin = {
  "_id": "5c8177712e64ab2736875bc7",
  "firstName": "admin",
  "lastName": "",
  "email": "",
  "type": "ADMIN",
  "createdAt": "",
  "updatedAt": ""
};

MongoClient.connect("http://localhost:27017/polyforms", function(err, db) {
  if (err) throw err;
    db.createCollection("users", function (err, res) {
      if(err) throw err;
      db.collection("users").insertOne(admin, function(err, res){
        if (err) throw err;
      })
  });
    db.close();
});
