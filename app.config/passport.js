'use strict';

module.exports = function (app, passport) {
  var Users = app.container.get('Users');
  var Config = app.config;
  var faker = require('faker');

  var LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    Users.findById(id, '-local.passwordHash -local.passwordSalt', function (err, user) {
      done(err, user);
    });
  });

  // LOCAL STRATEGY

  passport.use(new LocalStrategy(function (username, password, done) {
    var query = {
      $or: [{
        'email': username
      }, {
        'local.name': username
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

//  FACEBOOK STRATEGY
  passport.use(new FacebookStrategy({
      clientID: Config.get('facebookAuth:clientID'),
      clientSecret: Config.get('facebookAuth:clientSecret'),
      callbackURL: (Config.get('host:url') + Config.get('facebookAuth:callbackURL')),
      profileFields: ['id', 'displayName', 'emails'],
      passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
      if (!req.user) {

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
              firstname: profile.displayName.split(' ')[0],
              lastname: profile.displayName.split(' ')[1],
              'local.name': faker.internet.userName(),
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
              return done(null, _user)
            })
          } else {
            return done(null, user)
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


};
