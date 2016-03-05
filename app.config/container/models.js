function usersFactory() {
  return require('../../app.models/users');
}

module.exports = function (container) {
  container.register('Users', usersFactory());
};
