const jwt = require('express-jwt');
const mongoose = require('mongoose');
const Users = mongoose.model('Users');

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;
  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

var secretCheck = function(requiredType){
  //Selon express-jwt, le token est déjà décodé dans payload!
  return function(req, payload, done) {
    Users.findOne({ "_id":payload.id }).then((finalUser) => {
      if(!finalUser) {
        done(new Error('wrong-id'));
      }
      else if (finalUser.type === requiredType) {
        done(null, finalUser.getSecret());
      }
      else {
        done(new Error('wrong-permissions'));
      }
    });
  }
}

const guard = {
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
  required: jwt({
    secret: secretCheck("USER"),
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  user: jwt({
    secret: secretCheck("USER"),
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  manager: jwt({
    secret: secretCheck("MANAGER"),
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  admin: jwt({
    secret: secretCheck("ADMIN"),
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
};

module.exports = guard;