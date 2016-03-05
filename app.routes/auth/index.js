module.exports = function (app, passport) {
  // var _ = require('lodash');
  var Users = app.container.get('Users');
  // var Users = require('../models/user');

  var form = require('express-form');
  var field = form.field;

  function checkExistance(field, next) {
    var query = {
      $or: [{
        email: field
      }, {
        'local.name': field
      }]
    };

    Users.findOne(query, function (err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        return next(new Error('%s already used...'));
      }

      next(null);
    })
  }

  var UserForm = form(
    field('firstname').trim(),
    field('lastname').trim(),
    field('username').trim().required().custom(function (username, payload, next) {
      checkExistance(username, next);
    }, 'such login is already used...'),
    field('email').trim().isEmail().required().custom(function (email, payload, next) {
      checkExistance(email, next);
    }),
    field('password').trim().required().minLength(3),
    field('passConfirmation').trim().equals('field::password', "Password confirmation doesn't equal to password! ")
  );


  // TODO: move (req.form.isValid) to formService
  app.post('/api/users/register', UserForm, function (req, res, next) {
    if (req.form.isValid) {
      var user = new Users({
        firstname: req.form.firstname,
        lastname: req.form.lastname,
        email: req.form.email,
        'local.name': req.form.username,
        'local.password': req.form.password
      });
      user.save(function (err, user) {
        if (err) {
          return next(err);
        }

        user.local.passwordSalt = undefined;
        user.local.passwordHash = undefined;

        res.json(user);
      })
    } else {
      res.status(400).json(req.form.getErrors())
    }
  });

  app.post('/api/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(403).send({login: 'Invalid login data'});
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/api/users/me');
      });
    })(req, res, next);
  });

  app.post('/api/logout', function (req, res) {
    req.logout();
    res.status(200).send();
  });


    // TODO: move to authUtil
  app.use('/api', function (req, res, next) {
    if (!req.user) {
      return res.status(401).send();
    }
    next();
  });

  app.get('/api/users/me', function (req, res) {
    res.json(req.user)
  });

};