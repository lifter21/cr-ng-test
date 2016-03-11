app
  .controller('ProductController', function ($scope, $stateParams, ProductsResource) {
    $scope.show = true;

    $scope.init = function () {
      ProductsResource.get({itemId: $stateParams.productId}, function (product) {
        $scope.product = product;
      }, function (err) {
        console.log(err);
      })
    };

    $scope.init();
  })
;