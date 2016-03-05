app
	.factory('UserRegistration', function($resource) {
		return $resource('/api/users/register');
	})
	.controller('UserRegistrationController', function($scope, $state, UserRegistration,$filter) {
		$scope.user = new UserRegistration();
		$scope.register = function() {
			$scope.user.username = $filter('lowercase')($scope.user.username);
			$scope.user.email = $filter('lowercase')($scope.user.email);

			$scope.user.$save().then(function(user) {
				console.log(user, ' Successfully registered');
				$state.go('app.login')
			}, function(err) {
				console.log('Registration Error: ', err.data);
				$scope.formErrors = err.data;
			})
		}
	})
;