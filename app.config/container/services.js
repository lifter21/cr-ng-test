module.exports = function (container) {
  container.register('Mongoose', require('../db'), ['config/mongo']);
};