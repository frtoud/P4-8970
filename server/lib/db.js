"use strict";

const mongoose = require("mongoose");

//Configure mongoose's promise to global promise
mongoose.Promise = global.Promise;

//Configure Mongoose
mongoose.connect('mongodb://localhost:27017');
//Francois' MongoDB Atlas cluster
//mongoose.connect('mongodb+srv://test-user:25565@projet4-cluster-tgaf8.mongodb.net/test?retryWrites=true');
mongoose.set('debug', true);
