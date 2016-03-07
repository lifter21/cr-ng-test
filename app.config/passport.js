'use strict';

module.exports = function (app, passport) {
  var faker = require('faker');
  var Users = app.container.get('Users');
  var Config = app.config;
  var Host = Config.get('host:url');

  var LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    Users.findById(id, '-local.passwordHash -local.passwordSalt -facebook -google', function (err, user) {
      done(err, user);
    });
  });

  // LOCAL STRATEGY

  passport.use(new LocalStrategy(function (username, password, done) {
    var query = {
      $or: [{
        'email': username
      }, {
        'username': username
      }]
    };

    Users.findOne(query, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user || !user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect login data.'
        });
      }
      return done(null, user);
    })
  }));

//  TODO: refactor it
//  FACEBOOK STRATEGY

  passport.use(new FacebookStrategy({
      clientID: Config.get('facebookAuth:clientID'),
      clientSecret: Config.get('facebookAuth:clientSecret'),
      callbackURL: Host + Config.get('facebookAuth:callbackURL'),
      profileFields: ['id', 'displayName', 'emails'],
      passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
      if (!req.user) {
        console.log(profile);
        var query = {
          $or: [
            {'facebook.id': profile.id},
            {'facebook.email': profile.emails[0].value},
            {email: profile.emails[0].value}
          ]
        };

        Users.findOne(query, function (err, user) {
          if (err) {
            return done(err);
          }

          if (!user) {
            var newUser = new Users({
              'facebook.id': profile.id,
              'facebook.token': accessToken,
              'facebook.email': profile.emails[0].value,
              'firstname': profile.displayName.split(' ')[0],
              'lastname': profile.displayName.split(' ')[1],
              'username': faker.internet.userName(),
              'local.password': faker.internet.password(),
              email: profile.emails[0].value
            });

            newUser.save(function (err, _user) {
              if (err) {
                return done(err);
              }

              return done(null, _user)
            });
          }

          if (user && !user.facebook.id) {
            user.facebook.id = profile.id;
            user.facebook.email = profile.emails[0].value;
            user.facebook.token = accessToken;
            user.save(function (err, _user) {
              if (err) {
                return done(err);
              }

              return done(null, _user);
            })
          } else {
            return done(null, user);
          }
        })

      } else {
        req.user.facebook.id = profile.id;
        req.user.facebook.token = accessToken;
        req.user.facebook.email = profile.emails[0].value;
        req.user.firstname = req.user.firstname || profile.displayName.split(' ')[0];
        req.user.lastname = req.user.lastname || profile.displayName.split(' ')[1];
        req.user.email = req.user.emai || profile.emails[0].value;

        req.user.save(function (err) {
          if (err) {
            return done(err);
          }

          return done(null, req.user);
        })
      }
    }
  ));

//  GOOGLE STRATEGY

  passport.use(new GoogleStrategy({
      clientID: Config.get('googleAuth:clientID'),
      clientSecret: Config.get('googleAuth:clientSecret'),
      callbackURL: Host + Config.get('googleAuth:callbackURL'),
      passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
      if (!req.user) {
        var query = {
          $or: [
            {'google.id': profile.id},
            {'google.email': profile.emails[0].value},
            {'email': profile.emails[0].value}
          ]
        };

        Users.findOne(query, function (err, user) {
          if (err) {
            return done(err);
          }

          if (!user) {

            var newUser = new Users();
            newUser.google.id = profile.id;
            newUser.google.token = accessToken;
            newUser.google.email = profile.emails[0].value;
            newUser.email = profile.emails[0].value;
            newUser.firstname = profile.displayName.split(' ')[0];
            newUser.lastname = profile.displayName.split(' ')[1];
            newUser.username = faker.internet.userName();
            newUser.local.password = faker.internet.password();

            newUser.save(function (err, _user) {
              if (err) {
                return done(err);
              }

              return done(err, _user);
            });
          }

          if (user && !user.google.id) {
            user.google.id = profile.id;
            user.google.email = profile.emails[0].value;
            user.google.token = accessToken;
            user.save(function (err, _user) {
              if (err) {
                return done(err);
              }

              return done(null, _user);
            })
          } else {
            return done(null, user);
          }
        });
      } else {

        req.user.google.id = profile.id;
        req.user.google.token = accessToken;
        req.user.google.email = profile.emails[0].value;
        req.user.email = req.user.email || profile.emails[0].value;
        req.user.firstname = req.user.firstname || profile.displayName.split(' ')[0];
        req.user.lastname = req.user.lastname || profile.displayName.split(' ')[1];

        req.user.save(function (err) {
          if (err) {
            return done(err);
          }

          return done(err, req.user);
        });
      }

    }
  ));
};
