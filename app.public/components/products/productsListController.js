app
  .factory('ProductsResource', function ($resource) {
    return $resource('/api/items/:itemId', {'itemId': '@_id'}, {update: {method: 'PUT'}});
  })
  .controller('ProductsListController', function ($scope, ProductsResource, $uibModal) {

    $scope.init = function () {
      ProductsResource.query(function (products) {
        $scope.products = products;
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