'use strict';

var express = require('express'),
  app = express();

// @TODO: move to express config
app.application = require('./app.config/application');

var config = app.config = app.application.config;
var container = app.container = app.application.container;
var port = config.get('app:port');

var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var mongoose = container.get('Mongoose');
var mongoSessionStore = require('connect-mongo')(session);

//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// session config
app.use(session({
  secret: config.get('session:secret'),
  cookie: {maxAge: 4 * 7 * 24 * 60 * 60 * 1000},  // 4 weeks
  resave: true,
  saveUninitialized: true,
  store: new mongoSessionStore({
    mongooseConnection: mongoose.connection
  })
}));

// passport initalization
app.use(passport.initialize());
app.use(passport.session());

// send public scripts and assets
app.use(express.static(__dirname + '/app.public'));

// --->

// passport strategies
require('./app.config/passport')(app, passport);

// app routes
require('./app.routes')(app, passport);

// handle errors
app.use(function (err, req, res, next) {
  console.error('Error on ', req.url, ' URL: ', err);
  next(err)
});

//// hanlde unknown routes and XHR
//app.use(function (req, res) {
//  if (req.xhr) {
//    return res.sendStatus(404);
//  }
//
//  return res.sendStatus(404);
//});

// send SPA (html5mode: on) index.html on every rrequest
app.use('/', function (req, res) {
  res.sendFile(__dirname + '/app.public/index.html');
});

app.listen(port, function(){
  console.log('Now server is running on %s port.', port);
});
