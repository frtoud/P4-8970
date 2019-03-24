"use strict";

const mongoose = require("mongoose");

//Configure mongoose's promise to global promise
mongoose.Promise = global.Promise;

//Configure Mongoose
mongoose.connect('mongodb://test:test123@ds147344.mlab.com:47344/projet4-test');
//Francois' MongoDB Atlas cluster
//mongoose.connect('mongodb+srv://test-user:25565@projet4-cluster-tgaf8.mongodb.net/test?retryWrites=true');
mongoose.set('debug', true);