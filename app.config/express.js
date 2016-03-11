'use strict';

var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var mongoSessionStore = require('connect-mongo')(session);

module.exports = function (app) {
  app.application = require('./application');
  var config = app.config = app.application.config;
  var container = app.container = app.application.container;
  var mongoose = container.get('Mongoose');

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

  // passport strategies
  require('./passport')(app, passport);
};

