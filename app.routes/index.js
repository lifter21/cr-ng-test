'use strict';

module.exports = function (app) {
//  include routes here
  require('./api/auth')(app);
  require('./api/users')(app);
  require('./api/items')(app);
};