'use strict';

var _ = require('lodash');
var async = require('async');
var form = require('express-form'),
  field = form.field;

module.exports = function (app) {
  var Users = app.container.get('Users');
  var FormService = app.container.get('FormService');
  var AuthService = app.container.get('AuthService');

  function checkExistance(username, payload, next) {
    var query = {
      $or: [{
        email: username
      }, {
        username: username
      }]
    };

    Users.findOne(query, function (err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        return next(new Error('Such %s is already used...'));
      }

      next(null);
    });
  };

  // req.form variables
  var passwordRegExp = '[a-zA-Z0-9]';
  var phoneRegExp = /^\+(380)(\d{9})/;

  var UserRegistrationForm = form(
    field('firstname').trim().maxLength(255),
    field('lastname').trim().maxLength(255),
    field('username').trim().required().custom(checkExistance, 'Such login is already used...'),
    field('email').trim().isEmail().required().custom(checkExistance),
    field('phone').trim().minLength(13).maxLength(13).is(phoneRegExp),
    field('password').trim().required().minLength(6).maxLength(16).is(passwordRegExp),
    field('passConfirmation').trim().equals('field::password', "Password confirmation doesn't equal to password! ")
  );

  var EditProfileForm = form(
    field('username').trim().required(),
    field('firstname').trim().maxLength(255),
    field('lastname').trim().maxLength(255),
    field('email').trim().isEmail().required(),
    field('phone').trim().minLength(13).maxLength(13).is(phoneRegExp)
  );

  var EditPasswordForm = form(
    field('password').trim().minLength(6).required().maxLength(16).is(passwordRegExp),
    field('passConfirmation').trim().equals('field::password', "Password confirmation doesn't equal to password! ")
  );

  app.post('/api/register', UserRegistrationForm, FormService.isValidForm, function (req, res, next) {
    var user = new Users({
      firstname: req.form.firstname,
      lastname: req.form.lastname,
      email: req.form.email,
      username: req.form.username,
      'local.password': req.form.password
    });

    user.save(function (err, _user) {
      if (err) {
        return next(err);
      }

      user.local.passwordSalt = undefined;
      user.local.passwordHash = undefined;

      return res.json(_user);
    })
  });

  // TODO add routes for email and username check

  // let user get and edit data only if user Authenticated
  app.use('/api/users/me', AuthService.isAuthenticated);

  // Authenticated user data
  app.get('/api/users/me', function (req, res) {
    res.json(req.user)
  });

  // change user password
  app.put('/api/users/me/change-password', EditPasswordForm, FormService.isValidForm, function (req, res, next) {
    req.user.local.password = req.form.password;

    req.user.save(function (err) {
      if (err) {
        return next(err);
      }

      res.json(req.user);
    });
  });

  // TODO: try to refactor it/move to users service
  // change user profile info
  app.put('/api/users/me/edit-profile', EditProfileForm, FormService.isValidForm, function (req, res, next) {

    function basicProfileEdit(cb) {
      var profileEditErrors = {};
      req.user.firstname = req.form.firstname;
      req.user.lastname = req.form.lastname;
      req.user.phone = req.form.phone;
      return cb(null, profileEditErrors, req.user);
    };

    function checkUserEmail(profileEditErrors, reqUser, cb) {
      Users.findOne({email: req.form.email}, function (err, user) {
        if (err) {
          return next(err);
        }

        if (user && user.email !== reqUser.email) {
          profileEditErrors.email = ['Such email is already used...']
        }

        reqUser.email = req.form.email;

        return cb(null, profileEditErrors, reqUser);
      })
    };

    function checkUserUsername(profileEditErrors, reqUser, cb) {
      Users.findOne({username: req.form.username}, function (err, user) {
        if (err) {
          return cb(err);
        }

        if (user && user.username !== reqUser.username) {
          profileEditErrors.username = ['Such username is already used...'];
        }

        reqUser.username = req.form.username;

        return cb(null, profileEditErrors, reqUser);
      });
    };

    if (req.user.email !== req.form.email || req.user.username !== req.form.username) {
      async.waterfall([
          basicProfileEdit,
          checkUserEmail,
          checkUserUsername
        ], function (err, profileEditErrors, reqUser) {
          if (err) {
            return next(err);
          }

          if (_.isEmpty(profileEditErrors)) {
            reqUser.save(function (err) {
              if (err) {
                return next(err);
              }

              return res.json(reqUser);
            });
          } else {
            return res.status(400).json(profileEditErrors)
          }
        }
      );
    } else {
      req.user.save(function (err) {
        if (err) {
          return next(err);
        }

        return res.json(req.user);
      })
    }
  });

  // OTHER unused now stuff. It will be used in admin and other user management parts

  //function isOwner(req, res, next) {
  //  if (req.user._id !== req.ReqUser._id || !req.user.isAdmin()) {
  //    return res.status(403).json({
  //      error: 'Permissions denied'
  //    });
  //  }
  //
  //  next();
  //}

  //app.param('userId', function (req, res, next, userId) {
  //  Users.findById(userId).exec(function (err, user) {
  //    if (err) {
  //      return next(err);
  //    }
  //
  //    if (!user) {
  //      return res.status('200').json({error: 'User is not found'});
  //    }
  //
  //    delete user.local.passwordHash;
  //    delete user.local.passwordSalt;
  //    delete user.facebook;
  //    delete user.google;
  //    req.ReqUser = user;
  //
  //    next();
  //  })
  //});

  //app.post('/api/users', isOwner, function (req, res, next) {
  //  res.json('some response');
  //});

  //app.put('/api/users/:userId', simpleUserForm, FormService.isValidForm, function (req, res, next) {
  //  if (req.form.password) {
  //    req.ReqUser.local.password = req.form.password;
  //  }
  //  res.json('');
  //  //req.ReqUser.
  //});
  //
  //app.get('/api/users/:userId', isOwner, function (req, res, next) {
  //  res.json(req.ReqUser);
  //});

};