'use strict';

app
  .directive('userForm', function () {
    return {
      restrict: 'AE',
      scope: {
        user: '=?'
      },
      templateUrl: '/components/userRegistration/userForm.html',
      controller: 'UserRegistrationController'
    };
  })

  .controller('UserRegistrationController', function ($scope, $state, UserRegistrationResource, $filter, $timeout, AuthService) {
    if (!$scope.user) {
      $scope.user = new UserRegistrationResource();
    }

    // redirect to profile edit page if user is Authenticated
    if ($state.current.name === 'app.registration' && AuthService.isUser()) {
      $state.go('app.me.edit')
    }

    // edit password
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

    // Creae/Update user profile
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

    // Check username for availability
    $scope.freeUsername = true;
    $scope.freeEmail = true;

    $scope.isFreeUsername = function () {
      console.log($scope.user.username);
      UserRegistrationResource.checkUsername({username: $scope.user.username}, function (resp) {
        $scope.freeUsername = resp.ok;
      }, function (err) {
        console.log(err);
      });
    };

    // Check email for availability
    $scope.isFreeEmail = function (isValid) {
      if (isValid) {
        UserRegistrationResource.checkEmail({email: $scope.user.email}, function (resp) {
          $scope.freeEmail = resp.ok;
        }, function (err) {
          console.log(err);
        });
      }
    };

    $scope.$on('$destroy', function () {
      $scope.user = undefined;
    });
  })
;