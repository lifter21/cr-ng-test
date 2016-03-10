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
    if (!$scope.product._id) {
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

    $scope.save = function () {
      if ($scope.product._id) {
        $scope.product.$update()
          .then(function (product) {
            $scope.formErrors = null;
            checkCB();
          })
          .catch(function (err) {
            console.log(err);
            $scope.formErrors = err.data;
          })
      } else {
        $scope.product.$save()
          .then(function (product) {
            $scope.formErrors = null;
            checkCB();
          })
          .catch(function (err) {
            console.log(err);
            $scope.formErrors = err.data
          })
      }
    };

  })
;