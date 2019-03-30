conn = new Mongo();
db = conn.getDB("polyforms");
// "_id": "5c8177712e64ab2736875bc7",
var admin = {
  "firstName": "admin",
  "lastName": "",
  "email": "",
  "type": "ADMIN",
  "createdAt": "",
  "updatedAt": ""
};
db.createCollection("users", function (err, res) {
  if(err) throw err;
  db.collection("users").insertOne(admin, function(err, res){
    if (err) throw err;
  })
});


