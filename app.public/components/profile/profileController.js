app.controller('ProfileController', function ($scope, AuthService) {
  $scope.initUser = function () {
    $scope.user = AuthService.user ? AuthService.user : AuthService.me();
  };

  $scope.initUser();
})
;