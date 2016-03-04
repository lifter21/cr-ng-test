var app = angular.module('TrainIt', ['ui.router', 'ngResource', 'ngSanitize'])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
        $.material.init();

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $httpProvider.interceptors.push('HttpInterceptor');

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('app', {
                url: '',
                abstract: true,
                views: {
                    'auth-panel': {
                        controller: 'AuthPanelController',
                        templateUrl: '/train-it/auth/authPanel.html'
                    }
                }
            })
            .state('app.home', {
                url: '/',
                views: {
                    '@': {
                        templateUrl: '/train-it/home/home.html'
                    }
                }
            })
            .state('app.registration', {
                url: '/registration',
                views: {
                    '@': {
                        controller: 'UserRegistrationController',
                        templateUrl: '/train-it/userRegistration/registrationChoise.html'
                    }
                }
            })
            .state('app.registration.trainee', {
                url: '/trainee',
                views: {
                    '@': {
                        controller: 'UserRegistrationController',
                        templateUrl: '/train-it/userRegistration/registrationForm.html'
                    }
                }
            })
            .state('app.registration.coach', {
                url: '/coach',
                views: {
                    '@': {
                        controller: 'UserRegistrationController',
                        templateUrl: '/train-it/userRegistration/registrationForm.html'
                    }
                }
            })
            .state('app.login', {
                url: '/login',
                views: {
                    '@': {
                        controller: 'LoginController',
                        templateUrl: '/train-it/auth/loginForm.html'
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
        var pub_states = ['/', 'login', 'registration'];
        return {
            'responseError': function (rejection) {
                // do something on error
                var $state = $injector.get('$state');
                if (rejection.status == 401) {

                    return $state.go('app.login');
                }
                return $q.reject(rejection);
            }
        };
    });