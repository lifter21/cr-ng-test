var app = angular.module('ngTest', ['ui.router', 'ngResource'])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    $.material.init();

    //$locationProvider.html5Mode({
    //  enabled: true,
    //  requireBase: false
    //});

    $httpProvider.interceptors.push('HttpInterceptor');

    $urlRouterProvider.otherwise('/home');

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
      .state('app.404', {
        url: '/pageNotFound',
        views: {
          '@': {
            templateUrl: '/components/pages/pageNotFound.html'
          }
        }
      })
  })
  .factory('HttpInterceptor', function ($q, $injector) {
    var pub_states = ['/home', '/login', '/registration', 'pageNotFound'];
    return {
      'responseError': function (rejection) {
        // do something on error
        var $state = $injector.get('$state');
        var isPublicState = _.includes(pub_states, $state.current.url);
        
        if (rejection.status == 401 && !isPublicState) {
          return $state.go('app.login');
        }

        if (rejection.status === 404) {
          return $state.go('app.404');
        }
        
        return $q.reject(rejection);
      }
    };
  });
