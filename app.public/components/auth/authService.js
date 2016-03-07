app
  .factory('Login', function ($resource) {
    return $resource('/api/login');
  })
  .factory('Logout', function ($resource) {
    return $resource('/api/logout');
  })
  .factory('Me', function ($resource) {
    return $resource('/api/users/me');
  })
  .factory('AuthService', function (Login, Logout, Me) {
    var self = {
      user: null,
      login: function (user) {
        return Login.save({
          username: user.username,
          password: user.password,
          remember: user.remember
        }, function (user) {
          self.user = user;
          console.log(user, ' logged in');
          return user;
        }, function (err) {
          console.log('Login Error: ', err.data);
        }).$promise;
      },
      logout: function () {
        return Logout.save(function (success) {
          console.log('Logged out: ', success);
          self.user = null;
          return success;
        }, function (err) {
          console.log('Logout Error: ', err.data);
        }).$promise
      },
      isUser: function () {
        return !!self.user;
      },
      me: function () {
        return Me.get(function (user) {
          if (user.hasOwnProperty('local')) {
            self.user = user;
          }
        }, function (err) {
          console.log('Me get Error', err.data);
        })
      }
    };
    return self;
  })
;