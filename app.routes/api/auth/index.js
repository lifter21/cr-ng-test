'use strict';

module.exports = function (app) {
  var passport = require('passport');
  require('./auth')(app, passport);
};