'use strict';

app.controller('ProfileController', function ($scope, AuthService) {
  $scope.initUser = function () {
    $scope.user = AuthService.me();
  };

  $scope.initUser();
})
;