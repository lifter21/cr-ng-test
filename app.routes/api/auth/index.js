module.exports = function (app, passport) {

  //------------------------------------------LOCAL------------------------------------------

  app.post('/api/login',
    function (req, res, next) {
      var remember = req.body.remember || false;
      // use unlimited session time if user wants it
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

  app.post('/api/logout', function (req, res) {
    req.logout();
    res.status(200).send();
  });

  // unauthorized redirect route
  app.get('/api/unauthorized', function (req, res, next) {
    res.status(401).json({'loginError': 'invalid login data'});
  });

};