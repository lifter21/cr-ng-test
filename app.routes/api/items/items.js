'use strict';

var _ = require('lodash');
var form = require('express-form'),
  field = form.field;

module.exports = function (app) {
  var Users = app.container.get('Users');
  var Items = app.container.get('Items');
  var FormService = app.container.get('FormService');
  var AuthService = app.container.get('AuthService');
  var ItemsService = app.get('ItemsService');

  var ItemForm = form(
    field('title').trim().required().maxLength(255),
    field('price').trim().required().is(/^(\d{1,6})(\.){0,1}(\d{0,2})/),
    field('description').trim().required().maxLength(1000)
  );

  app.use('/api/items', AuthService.isAuthenticated);

  app.param('itemId', function (req, res, next, itemId) {
    ItemsService.getItemById(itemId, function (err, item) {
      if (err) {
        return next(err);
      }

      if (!item) {
        return res.status(404).send({error: 'Item is not found'});
      }

      req.Item = item;
      return next();
    })
  });

  app.get('/api/items', function (req, res, next) {
    var limit = +req.query.limit || 10;
    var page = +req.query.page || 0;
    var query = {};

    ItemsService.getItemsByQuery(query, limit, page, null, function (err, items) {
      if (err) {
        return next(err);
      }

      return res.json(items);
    });
  });

  app.get('/api/items/count', function (req, res, next) {
    var query = {};

    ItemsService.getItemsCountByQuery(query, function (err, count) {
      if (err) {
        return next(err);
      }

      return res.json({count: count});
    })
  });

  app.post('/api/items', ItemForm, FormService.isValidForm, function (req, res, next) {
    var newItem = new Items();
    _.assign(newItem, req.form);
    newItem.creator = req.user;

    newItem.save(function (err, item) {
      if (err) {
        return next(err);
      }

      return res.json(item);
    })
  });

  app.get('/api/items/:itemId', function (req, res, next) {
    res.json(req.Item);
  });

  app.put('/api/items/:itemId', ItemForm, FormService.isValidForm, function (req, res, next) {
    _.assign(req.Item, req.form);

    req.Item.save(function (err, item) {
      if (err) {
        return next(err);
      }

      return res.json(item);
    })
  });

  app.delete('/api/items', function (req, res, next) {
    var query = {
      _id: {
        '$in': _.concat([], req.query.items)
      }
    };

    ItemsService.removeMultipleItemsByQuery(query, function (err, status) {
      if (err) {
        return next(err);
      }

      return res.sendStatus(200);
    });
  });

  app.delete('/api/items/:itemId', function (req, res, next) {
    req.Item.remove(function (err, status) {
      if (err) {
        return next(err);
      }

      return res.status(200).send('Item was successfully deleted')
    })
  });
};