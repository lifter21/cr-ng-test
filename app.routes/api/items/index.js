'use strict';

module.exports = function (app) {
  require('./itemsService')(app);
  require('./items')(app);
};