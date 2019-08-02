var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./lib/db");

const indexRouter = require("./routes/index");
const adsRouter = require("./routes/apiv1/advertisements");
// var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").__express);
app.set("view engine", "html");

// I enable Access-Control-Allow-Origin: * in header
app.use(cors());
// support parsing of application/json type post data
app.use(bodyParser.json());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * Create mongodb conection
 */
app.use(function(req, res, next) {
  if (db.connection.readyState !== 1)
    throw createError(1100, "No database connection");
  next();
});

db.connect();
// db.disconnect();

/**
 * Rutas de mi API
 */
app.use("/", indexRouter);
app.use("/apiv1/anuncios", adsRouter);

// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // comprobar error de validación
  if (err.array) {
    // error de validación
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req)
      ? { message: "Nor valid", errors: err.mapped() }
      : `Not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  res.status(err.status || 500);

  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.render("error");
});

function isAPI(req) {
  return req.originalUrl.indexOf("/apiv") === 0;
}

module.exports = app;
