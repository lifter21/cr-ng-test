var app = angular.module('ngTest', ['ui.router', 'ngResource', 'ui.bootstrap', 'ngAnimate', 'ngSanitize'])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

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
        },
        data: {
          pageTitleFirst: 'Angular Test - '
        }
      })
      .state('app.home', {
        url: '/home',
        views: {
          '@': {
            templateUrl: '/components/home/home.html'
          }
        },
        data: {
          pageTitle: 'Home'
        }
      })
      //.state('app.index', {
      //  url: '/index',
      //  views: {
      //    '@': {
      //      templateUrl: '/components/mainPage/mainPage.html',
      //      controller: 'MainPageController'
      //    },
      //    data: {
      //      pageTitle: 'Main'
      //    }
      //  }
      //})
      .state('app.registration', {
        url: '/registration',
        views: {
          '@': {
            //controller: 'UserRegistrationController',
            templateUrl: '/components/userRegistration/registrationForm.html'
          }
        },
        data: {
          pageTitle: 'Registration'
        }
      })
      .state('app.login', {
        url: '/login',
        views: {
          '@': {
            controller: 'LoginController',
            templateUrl: '/components/auth/loginForm.html'
          }
        },
        data: {
          pageTitle: 'Login'
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
      .state('app.me', {
        url: '/profile',
        views: {
          '@': {
            templateUrl: '/components/profile/profile.html',
            controller: 'ProfileController'
          }
        },
        data: {
          pageTitle: 'Profile'
        }
      })
      .state('app.me.edit', {
        url: '/edit',
        views: {
          '@': {
            templateUrl: '/components/profile/profileEdit.html',
            controller: 'ProfileController'
          }
        },
        data: {
          pageTitle: 'Edit profile'
        }
      })
      .state('app.products', {
        url: '/products',
        views: {
          '@': {
            templateUrl: '/components/products/productsList.html',
            controller: 'ProductsListController'
          }
        },
        data: {
          pageTitle: 'Products'
        }
      })
      .state('app.products.new', {
        url: '/new',
        views: {
          '@': {
            templateUrl: '/components/products/productForm.html',
            controller: 'ProductFormController'
          }
        },
        data: {
          pageTitle: 'Create product'
        }
      })
      .state('app.products.product', {
        url: '/:productId',
        views: {
          '@': {
            templateUrl: '/components/products/product.html',
            controller: 'ProductController'
          }
        },
        data: {
          pageTitle: 'Product details'
        }
      })
      .state('app.products.product.edit', {
        url: '/edit',
        views: {
          '@': {
            templateUrl: '/components/products/productForm.html',
            controller: 'ProductFormController'
          }
        },
        data: {
          pageTitle: 'Edit product'
        }
      })
      .state('app.404', {
        url: '/pageNotFound',
        views: {
          '@': {
            templateUrl: '/components/pages/pageNotFound.html'
          }
        },
        data: {
          pageTitle: 'Page Not Found'
        }
      })
  })
  .factory('HttpInterceptor', function ($q, $injector) {
    var pub_states = ['/home', '/login', '/registration', '/pageNotFound'];
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
