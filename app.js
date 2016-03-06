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

app.use(function (req, res, next) {
  console.log(req.url);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  if ('OPTIONS' === req.method) {
    res.status(200).end();
  } else {
    next();
  }
});

// send SPA (html5mode: on) index.html on every request
//app.use('/', function (req, res, next) {
//  res.sendFile(__dirname + '/app.public/index.html');
//});

// handle errors
app.use(function (err, req, res, next) {
  console.error('Error on ', err.stack, ' URL: ', err);
  next(err)
});

//app.use('*', function(req, res, next) {
//  res.status(404).send('Sorry cant find that!');
//});
// hanlde unknown routes and XHR
app.use(function (req, res) {
  if (req.xhr) {
    return res.sendStatus(404);
  }

  return res.sendStatus(404);
});

app.listen(port, function () {
  console.log('Now server is running on %s port.', port);
});
