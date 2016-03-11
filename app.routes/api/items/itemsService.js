'use strict';

module.exports = function (app) {
  var Items = app.container.get('Items'),
    Users = app.container.get('Users');

  function ItemsService() {
  };

  ItemsService.prototype.getItemsCountByQuery = function (query, cb) {
    Items.count(query).exec(cb);
  };

  ItemsService.prototype.getItemById = function (id, cb) {
    Items.findById(id)
      .populate('creator', 'username')
      .exec(cb);
  };

  ItemsService.prototype.getItemsByQuery = function (query, limit, page, sortString, cb) {
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

  ItemsService.prototype.removeMultipleItemsByQuery = function (query, cb) {
    Items.remove(query).exec(cb)
  };

  var Service = new ItemsService();
  app.set('ItemsService', Service);

  return Service;
};
