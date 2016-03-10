app
  .factory('ProductsResource', function ($resource) {
    return $resource('/api/items/:itemId', {'itemId': '@_id'}, {update: {method: 'PUT'}});
  })
  .controller('ProductsListController', function ($scope, ProductsResource, $uibModal) {

    $scope.query = {
      page: 0,
      limit: 10
    };

    $scope.setLimit = function (limit) {
      $scope.query.limit = limit;
      $scope.query.page = 0;
      $scope.init();
    };

    $scope.setPage = function (page) {
      $scope.query.page = page;
      $scope.init();
    };

    $scope.init = function () {
      ProductsResource.get($scope.query, function (data) {
        $scope.products = data.products;
        $scope.count = data.count;
        $scope.pagesCount = _.ceil($scope.count / $scope.query.limit, 0);
        console.log($scope.pagesCount);
        var pagesArray = [];
        for (var i = 0; i < $scope.pagesCount; i++) {
          pagesArray.push(i);
        }

        $scope.pages = pagesArray
      }, function (err) {
        console.log(err);
      });
    };

    $scope.init();

    $scope.remove = function (product) {
      product.$delete()
        .then(function (resp) {
          console.log(resp);
          $scope.init();
        })
        .catch(function (err) {
          console.log(err);
        })
    };

    $scope.showProductDetails = function (product) {
      var modalInstance = $uibModal.open({
        templateUrl: '/components/products/productInfoModal.html',
        animation: true,
        size: 'md',
        resolve: {
          product: function () {
            return product;
          }
        },
        controller: function ($scope, $uibModalInstance, product) {
          $scope.product = product;

          $scope.ok = modalOk($uibModalInstance);

          $scope.cancel = modalCancel($uibModalInstance);
        }
      });

      modalInstance.result.then(function () {
        //$scope.init();
        //$scope.selected = selectedItem;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.showProductForm = function (product) {
      var product = product || {};

      var modalInstance = $uibModal.open({
        templateUrl: '/components/products/productFormModal.html',
        animation: true,
        size: 'md',
        resolve: {
          product: function () {
            return product;
          }
        },
        controller: 'ProductFormModalController'
      });

      modalInstance.result.then(function () {
        $scope.init();
        //$scope.selected = selectedItem;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

  })

  .controller('ProductFormModalController', function ($scope, $uibModalInstance, product) {
    $scope.product = product;

    $scope.options = {
      callback: function () {
        $scope.ok();
      },
      cancel: function () {
        $scope.cancel();
      }
    };

    $scope.ok = modalOk($uibModalInstance);

    $scope.cancel = modalCancel($uibModalInstance);

  })

function modalOk($uibModalInstance, data) {
  var data = data || undefined
  return function () {
    $uibModalInstance.close(data);
  }
}

function modalCancel($uibModalInstance) {
  return function () {
    $uibModalInstance.dismiss('cancel');
  }
}
;