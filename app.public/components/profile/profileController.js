app.controller('ProfileController', function ($scope, AuthService) {
  $scope.initUser = function () {
    $scope.user = AuthService.user ? AuthService.user : AuthService.me();
  };

  $scope.initUser();
  
  $scope.updateUser = function () {
    $scope.user.$save()
      .then(function (res) {
        console.log('User Updated')
      })
      .catch(function (err) {
        console.log('error while user updating', err);
      });
  };
})
;