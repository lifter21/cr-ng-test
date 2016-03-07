module.exports = function (app) {
  var Users = app.container.get('Users');
  var formService = app.container.get('FormService');
  var AuthService = app.container.get('AuthService');

  var form = require('express-form');
  var field = form.field;

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
        return next(new Error('Such %s already used...'));
      }

      next(null);
    });
  };

  // TODO: add phone number
  var UserForm = form(
    field('firstname').trim().maxLength(255),
    field('lastname').trim().maxLength(255),
    field('username').trim().required().custom(checkExistance, 'Such login is already used...'),
    field('email').trim().isEmail().required().custom(checkExistance),
    field('phone').trim().minLength(13).maxLength(13).is(/^\+(380)(\d{9})/),
    field('password').trim().required().minLength(6).maxLength(16).is("[a-zA-Z0-9]"),
    field('passConfirmation').trim().equals('field::password', "Password confirmation doesn't equal to password! ")
  );

  app.post('/api/register', UserForm, formService.isValidForm, function (req, res, next) {
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

  app.param('userId', function (req, res, next, userId) {
    Users.findById(id).exec(function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status('200').json({error: 'User is not found'});
      }

      delete user.local.passwordHash;
      delete user.local.passwordSalt;
      delete user.facebook;
      delete user.google;
      req.ReqUser = user;

      next();
    })
  });

  function isOwner(req, res, next) {
    if (req.user._id !== req.ReqUser._id || !req.user.isAdmin()) {
      return res.status(403).json({
        error: 'Permissions denied'
      });
    }

    next();
  }

  app.use('/api/users', AuthService.isAuthenticated);

  app.get('/api/users/me', function (req, res) {
    res.json(req.user)
  });

  app.post('/api/users', function (req, res, next) {

  });

  app.put('/api/users/:userId', function (req, res, next) {
    
  });

  app.get('/api/users/:userId', isOwner, function (req, res, next) {
    res.json(req.ReqUser);
  });

};