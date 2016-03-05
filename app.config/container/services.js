module.exports = function (container) {
  container.register('Mongoose', require('../db'), ['config/mongo']);
  container.register('AuthService', require('../../app.routes/authUtil'));
  container.register('FormService', require('../../app.routes/formService'));
};