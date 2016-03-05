app
	.controller('LoginController', function($scope, $state, AuthService) {
		$scope.user = {};
		$scope.login = function() {
			AuthService.login($scope.user.username , $scope.user.password)
				.then(function(user) {
					$state.go('app.home');
				}, function(err) {
					$scope.loginError = err.data.login;
				});
		};
	})
	.controller('LogoutController', function($scope, $state, AuthService) {
		AuthService.logout().then(function() {
			$state.go('app.login');
		});
	})
	.controller('AuthPanelController', function ($scope, AuthService) {
		$scope.AuthService = AuthService;
		$scope.AuthService.me();
	})
;