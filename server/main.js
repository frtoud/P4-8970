const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require('cors');
require("./lib/db");
require("./models/Users");
require("./models/Forms")

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}

// App config
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize the session
app.use(session({
  secret: 'POLYFORMS',
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    maxAge: 1000 * 60 * 24, // 24 hours
    secure: false
  }
}));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use(require("./routes"));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(8000, () => console.log('Server running on http://localhost:8000/'));