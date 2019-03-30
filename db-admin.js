conn = new Mongo();
db = conn.getDB("polyforms");
// "_id": "5c8177712e64ab2736875bc7",
var admin = {
  "firstName": "Admin",
  "lastName": "Admin",
  "email": "admin@admin.com",
  "type": "ADMIN",
  "createdAt": {
    "$date": "2019-03-15T14:23:30.806Z"
  },
  "updatedAt": {
    "$date": "2019-03-22T13:01:15.397Z"
  },
  "linkExpiration": null,
  "hash": "$2b$08$lEykYbdAQ1aOLCPaxhkeTOpDwoLYIh0EkCZAjPenc9aYXpxuX41yu"
}

db.createCollection("users", function (err, res) {
  if(err) throw err;
  db.collection("users").insertOne(admin, function(err, res){
    if (err) throw err;
  })
});


