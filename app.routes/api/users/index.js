'use strict';

module.exports = function (app) {
  require('./usersService')(app);
  require('./users')(app);
};