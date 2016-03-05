'use strict';

module.exports = function (container) {
  require('./container/models')(container);
  require('./container/services')(container);
};