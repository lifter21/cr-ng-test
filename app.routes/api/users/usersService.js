'use strict';

module.exports = function (app) {
  function UserService() {
  };

  var Service = new UserService();
  app.set('UsersService', Service);

  return Service;
};
