app
  .factory('UserRegistrationResource', function ($resource) {
    return $resource('/api/register', {},
      {
        updatePassword: {method: 'PUT', url: '/api/users/me/change-password'},
        updateProfile: {method: 'PUT', url: '/api/users/me/edit-profile'},
        checkUsername: {method: 'GET', url: '/api/check-username'},
        checkEmail: {method: 'GET', url: '/api/users/check-email'}
      }
    );
  })

  .directive('userForm', function () {
    return {
      restrict: 'AE',
      scope: {
        user: '=?'
      },
      templateUrl: '/components/userRegistration/userForm.html',
      controller: function ($scope, $state, UserRegistrationResource, $filter, $timeout) {
        if (!$scope.user) {
          $scope.user = new UserRegistrationResource();
        }

        $scope.userPassword = new UserRegistrationResource();
        $scope.showPasswordForm = false;

        $scope.updatePassword = function () {
          $scope.userPassword.$updatePassword().then(function (resp) {
            console.log(resp);
            $scope.passErrors = null;
            $scope.showUpdateMessage = true;
            $scope.showPasswordForm = !$scope.showPasswordForm;
            $timeout(function () {
              $scope.showUpdateMessage = false;
            }, 3000);
          }).catch(function (err) {
            $scope.passErrors = err.data;
            console.log(err);
          })
        };

        $scope.save = function () {
          $scope.user.username = $filter('lowercase')($scope.user.username);
          $scope.user.email = $filter('lowercase')($scope.user.email);
          if ($scope.user._id) {
            $scope.profile = new UserRegistrationResource($scope.user);

            $scope.profile.$updateProfile()
              .then(function (user) {
                console.log(user, ' Successfully updated');
                $scope.formErrors = null;
                $state.go('app.me')
              })
              .catch(function (err) {
                console.log('Registration Error: ', err.data);
                $scope.formErrors = err.data;
              });
          } else {
            $scope.user.$save()
              .then(function (user) {
                console.log(user, 'Successfully registered');
                $scope.formErrors = null;
                $state.go('app.login')
              })
              .catch(function (err) {
                console.log('Registration Error: ', err.data);
                $scope.formErrors = err.data;
              });
          }
        };

        $scope.checkUsername = function () {
        };

        $scope.checkEmail = function () {
        };

        $scope.$on('$destroy', function () {
          $scope.user = undefined;
        })
      }
    };
  })
;