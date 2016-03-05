
module.exports = function (container) {
  container.register('Users', function(){
    return require('../../app.models/users');
  });
};
