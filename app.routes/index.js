module.exports = function (app, passport) {
  'use strict';
//  include routes here
  require('./api/auth')(app, passport);
  require('./api/users')(app);
  require('./api/items')(app);
};