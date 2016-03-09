
module.exports = function (container) {
  container.register('Users', function(){
    return require('../../app.models/users');
  });
  container.register('Items', function () {
    return require('../../app.models/items');
  });
};
