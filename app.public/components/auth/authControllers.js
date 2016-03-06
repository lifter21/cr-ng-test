app
  .controller('LoginController', function ($scope, $state, AuthService) {
    $scope.user = {};

    $scope.connect = function () {
      facebook.get(function (resp) {
        console.log(resp);
      });
    };

    $scope.login = function () {
      AuthService.login($scope.user.username, $scope.user.password)
        .then(function (user) {
          $state.go('app.home');
        }, function (err) {
          $scope.loginError = err.data.loginError;
        });
    };
  })
  .controller('LogoutController', function ($scope, $state, AuthService) {
    AuthService.logout().then(function () {
      $state.go('app.login');
    });
  })
  .controller('AuthPanelController', function ($scope, AuthService) {
    $scope.AuthService = AuthService;
    $scope.AuthService.me();
  })
//  .factory('facebook', function ($resource) {
//    return $resource('/auth/facebook');
//  })
//;