conn = new Mongo();
db = conn.getDB("polyforms");
var admin = {
  "firstName": "admin",
  "lastName": "",
  "email": "",
  "type": "ADMIN",
  "createdAt": "",
  "updatedAt": ""
};

db.collectionNames("users", function(err, names) {
  if(!(names.length > 0)){
    db.createCollection("users", function (err, res) {
      if(err) throw err;
      db.collection("users").insertOne(admin, function(err, res){
        if (err) throw err;
      })
    });
  }
});

