"use strict";

const mongoose = require("mongoose");

//Configure mongoose's promise to global promise
mongoose.Promise = global.Promise;

//Configure Mongoose
mongoose.connect('mongodb://localhost:27017/polyforms');
mongoose.set('debug', true);