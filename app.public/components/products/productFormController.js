'use strict';

app
  .directive('productForm', function () {
    return {
      templateUrl: '/components/products/productForm.html',
      restrict: 'AE',
      transclude: true,
      scope: {
        product: '=?',
        options: '=options'
      },
      controller: 'ProductFormController'
    };
  })
  .controller('ProductFormController', function ($scope, $state, ProductsResource) {
    $scope.formTitle = 'Edit: ' + $scope.product.title;

    if (!$scope.product._id) {
      $scope.formTitle = 'New item';
      $scope.product = new ProductsResource()
    }

    function checkCB() {
      if (_.isFunction($scope.options.callback)) {
        $scope.options.callback();
      }
    }

    $scope.cancel = function () {
      if ($scope.options.cancel && _.isFunction($scope.options.cancel)) {
        $scope.options.cancel();
      } else {
        $state.go('app.products')
      }
    };

    $scope.save = function ($event, isValid) {
      if (($event.ctrlKey && $event.keyCode == 10) || ($event.type === 'submit')) {
        if (isValid) {
          if ($scope.product._id) {
            $scope.product.$update()
              .then(function () {
                $scope.formErrors = null;
                checkCB();
              })
              .catch(function (err) {
                console.log(err);
                $scope.formErrors = err.data;
              })
          } else {
            $scope.product.$save()
              .then(function () {
                $scope.formErrors = null;
                checkCB();
              })
              .catch(function (err) {
                console.log(err);
                $scope.formErrors = err.data
              })
          }
        }
      }
    };
  })
;