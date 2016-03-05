module.exports = function (app, passport) {
  'use strict';
//  include routes here
  require('./auth')(app, passport);
  require('./users')();
  require('./items');
};