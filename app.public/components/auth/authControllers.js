app
  .controller('LoginController', function ($scope, $state, AuthService) {
    $scope.user = {};

    $scope.login = function () {
      AuthService.login($scope.user)
        .then(function (user) {
          $state.go('app.products');
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
;