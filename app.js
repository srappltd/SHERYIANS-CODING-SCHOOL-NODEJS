require("dotenv").config()
const createError = require('http-errors');
const express = require('express');
const bodyParser = require("body-parser")
const clientSession = require("express-session")
const adminSession = require("express-session")
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const adminRouter = require('./routes/admin');
const clientRouter = require('./routes/client');
const {Mongoose} = require('./routes/config');
Mongoose(process.env.DATABASE_URL)

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(clientSession({name:'clientSession',secret:process.env.CLIENT_SESSION,resave:false,saveUninitialized:false,cookie:{maxAge:1000*60*60*24}}))
app.use(clientSession({name:'adminSession',secret:process.env.ADMIN_SESSION,resave:false,saveUninitialized:false,cookie:{maxAge:1000*60*60*24}}))

app.use('/', clientRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // process.exit(1)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
  // next()
});

module.exports = app;
