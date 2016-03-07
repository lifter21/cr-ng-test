module.exports = function (app, passport) {
  var Users = app.container.get('Users');

  var form = require('express-form');
  var field = form.field;

  function checkExistance(username, payload, next) {
    var query = {
      $or: [{
        email: username
      }, {
        'local.name': username
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
    field('password').trim().required().minLength(6).maxLength(16).is("[a-zA-Z0-9]"),
    field('passConfirmation').trim().equals('field::password', "Password confirmation doesn't equal to password! ")
  );

  //------------------------------------------LOCAL------------------------------------------

  app.post('/api/login', function (req, res, next) {
    var remember = req.body.remember || false;
    if (remember) {
      req.session.cookie.expires = false;
    }

    next();
  }, passport.authenticate('local', {
    successRedirect: '/api/users/me',
    failureRedirect: '/api/unauthorized'
  }));

  //------------------------------------------FACEBOOK-----------------------------------------

  app.get('/auth/facebook',
    passport.authenticate('facebook', {scope: 'email'})
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/api/unauthorized'
    }));

  //------------------------------------------GOOGLE------------------------------------------

  app.get('/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email']})
  );

  app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/api/unauthorized'
    })
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
      user.save(function (err, _user) {
        if (err) {
          return next(err);
        }

        user.local.passwordSalt = undefined;
        user.local.passwordHash = undefined;

        return res.json(_user);
      })
    } else {
      res.status(400).json(req.form.getErrors())
    }
  });

  app.post('/api/logout', function (req, res) {
    req.logout();
    res.status(200).send();
  });

  // TODO: move to authUtil
  function isAuth(req, res, next) {
    //if (!req.user) {
    //  return res.status(401).send();
    //}
    //next();
    if (req.isAuthenticated()) {
      return next();
    }
    return res.sendStatus(401);
  };

  app.get('/api/users/me', function (req, res) {
    res.json(req.user)
  });

  // unauthorized redirect route
  app.get('/api/unauthorized', function (req, res, next) {
    res.status(401).json({'loginError': 'invalid login data'});
  });

};