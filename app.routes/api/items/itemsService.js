module.exports = function (app) {
  var Items = app.container.get('Items'),
    Users = app.container.get('Users');

  function itemsService() {
  };

  itemsService.prototype.getItemsCountByQuery = function (query, cb) {
    Items.count(query).exec(cb);
  };

  itemsService.prototype.getItemsById = function (id, cb) {
    Items.findById(id)
      .populate('creator', 'username')
      .exec(cb);
  };

  itemsService.prototype.getItemsByQuery = function (query, limit, page, sortString, cb) {
    var limit = limit || 0;
    var page = page || 0;
    var sortString = sortString || 'createdAt 1';
    Items.find(query)
      .populate('creator', 'username')
      .sort(sortString)
      .skip(page * limit)
      .limit(limit)
      .exec(cb);
  };

  return new itemsService();
};

