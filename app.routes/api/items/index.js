module.exports = function (app) {
  var _ = require('lodash');
  var form = require('express-form'),
    field = form.field;

  var Users = app.container.get('Users');
  var Items = app.container.get('Items');
  var FormService = app.container.get('FormService');
  var AuthService = app.container.get('AuthService');

  var ItemForm = form(
    field('title').trim().required().maxLength(255),
    field('price').trim().required().is("/^\d{1,4}.\d{2}/"),
    field('description').trim().required().maxLength(1000)
  );

  app.use('/api/items', AuthService.isAuthenticated);

  app.param('itemId', function (itemId, req, res, next) {
    Items.findById(itemId)
      .populate('creator', 'username')
      .exec(function (err, item) {
        if (err) {
          return next(err);
        }

        if (!item) {
          return res.status(404).send({error: 'Item is not found'});
        }

        req.Item = item;
        next();
      })
  });

  // TODO: continue here
  app.get('/api/items', function (req, res, next) {
    var query = {
      page: req.query.page || 0,
      limit: req.query.limit || 20,
    };

    Items.find(query)
      .populate('creator', 'username')
      .group('title', 1)
      .limit(query.limit)
      .skip(query.page * query.limit)
      .exec(function (err, items) {
        if (err) {
          return next(err);
        }

        res.json(items)
      })
    ;

    res.sendStatus(200);
    //Items.find()
  });

  app.post('/api/items', ItemForm, FormService.isValidForm, function (req, res, next) {
    var newItem = new Items();
    _.asign(newItem, req.form);
    newItem.creator = req.user;

    newItem.save(function (err, item) {
      if (err) {
        return next(err);
      }

      res.json(item);
    })
  });

  app.get('/api/items/:itemId', function (req, res, next) {
    res.json(req.Item);
  });

  app.put('/api/items/:itemId', ItemForm, FormService.isValidForm, function (req, res, next) {
    _.asign(req.Item, req.form);

    req.Item.save(function (err, item) {
      if (err) {
        return next(err);
      }

      res.json(item);
    })
  });

  app.delete('/api/items', function (req, res, next) {
    var query = {
      '_id.$in[]': req.query.items
    };

    Items.remove(query, function (err, status) {
      if (err) {
        return next(err);
      }

      console.log(status);
      res.status(200).send('Item were successfully deleted')
    })
  });

  app.delete('/api/items/:itemId', function (req, res, next) {
    req.Item.remove(function (err, status) {
      if (err) {
        return next(err);
      }

      console.log(status);
      res.status(200).send('Item was successfully deleted')
    })
  });
};