'use strict';

module.exports = function (app, passport) {
  require('./auth')(app, passport);
};