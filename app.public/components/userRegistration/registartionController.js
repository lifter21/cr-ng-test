app
  .factory('UserRegistrationResource', function ($resource) {
    return $resource('/api/register');
  })
  .factory('UserResource', function ($resource) {
    return $resource('/api/users/:userId', {'userId': '@_id'}, {update: {method: 'PUT'}});
  })
  .controller('UserRegistrationController', function ($scope, UserRegistrationResource) {
    $scope.user = new UserRegistrationResource();
    //$scope.register = function() {
    //	$scope.user.username = $filter('lowercase')($scope.user.username);
    //	$scope.user.email = $filter('lowercase')($scope.user.email);
    //
    //	$scope.user.$save().then(function(user) {
    //		console.log(user, ' Successfully registered');
    //		$state.go('app.login')
    //	}, function(err) {
    //		console.log('Registration Error: ', err.data);
    //		$scope.formErrors = err.data;
    //	})
    //}
  })
  .directive('userForm', function () {
    return {
      restrict: 'AE',
      scope: {
        user: '='
      },
      templateUrl: '/components/userRegistration/userForm.html',
      controller: function ($scope, $state, UserRegistrationResource, UserResource, $filter) {

        $scope.save = function (){

          $scope.user.username = $filter('lowercase')($scope.user.username);
          $scope.user.email = $filter('lowercase')($scope.user.email);
          if ($scope.user._id) {
            $scope.user = new UserResource($scope.user);

            $scope.user.$update().then(function (user) {
              console.log(user, ' Successfully updated');
              $state.go('app.profile')
            }, function (err) {
              console.log('Registration Error: ', err.data);
              $scope.formErrors = err.data;
            })
          } else {
            $scope.user.$save().then(function (user) {
              console.log(user, 'Successfully registered');
              $state.go('app.login')
            }, function (err) {
              console.log('Registration Error: ', err.data);
              $scope.formErrors = err.data;
            })
          }
        };

        $scope.$on('$destroy', function () {
          $scope.user = undefined;
        })
      }
    };
  })
;