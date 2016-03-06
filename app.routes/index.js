module.exports = function (app, passport) {
  'use strict';
//  include routes here
  require('./api/auth')(app, passport);
  require('./api/users')();
  require('./api/items');
};