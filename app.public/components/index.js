var app = angular.module('ngTest', ['ui.router', 'ngResource'])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
        $.material.init();

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $httpProvider.interceptors.push('HttpInterceptor');

        $urlRouterProvider.otherwise('/homes');

        $stateProvider
            .state('app', {
                url: '',
                abstract: true,
                views: {
                    'auth-panel': {
                        controller: 'AuthPanelController',
                        templateUrl: '/components/auth/authPanel.html'
                    }
                }
            })
            .state('app.home', {
                url: '/home',
                views: {
                    '@': {
                        templateUrl: '/components/home/home.html'
                    }
                }
            })
            .state('app.registration', {
                url: '/registration',
                views: {
                    '@': {
                        controller: 'UserRegistrationController',
                        templateUrl: '/components/userRegistration/registrationForm.html'
                    }
                }
            })
            .state('app.login', {
                url: '/login',
                views: {
                    '@': {
                        controller: 'LoginController',
                        templateUrl: '/components/auth/loginForm.html'
                    }
                }
            })
            .state('app.logout', {
                url: '/logout',
                views: {
                    '@': {
                        controller: 'LogoutController'
                    }
                }
            })
    })
    // .run(function($rootScope, AuthService) {
    // 	$rootScope.AuthService = AuthService;
    // 	$rootScope.AuthService.me();
    // })
    .factory('HttpInterceptor', function ($q, $injector) {
        var pub_states = ['/home', '/login', '/registration'];
        return {
            'responseError': function (rejection) {
                // do something on error
                var $state = $injector.get('$state');
                console.log('$state.current.url'. $state.current.url);
                var isPubState = _.include(pub_states, $state.current.url);
                if (rejection.status == 401|| !isPubState) {
                    return $state.go('app.login');
                }
                return $q.reject(rejection);
            }
        };
    });
