var url = "mongodb://localhost:27017/polyforms";
var MongoClient = require('mongodb').MongoClient;
var Users = require('./server/models/Users');
var admin = new Users({
  "_id": "5c8177712e64ab2736875bc7",
  "firstName": "admin",
  "lastName": "",
  "email": "",
  "type": "ADMIN",
  "createdAt": "",
  "updatedAt": ""
});

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
    db.createCollection("users", function (err, res) {
    admin.save().then(() => console.log('Un compte administrateur a été ajouté.'))
  });
  db.close();
}
