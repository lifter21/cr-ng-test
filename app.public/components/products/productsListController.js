app
  .factory('ProductsResource', function ($resource) {
    return $resource('/api/items/:itemId', {'itemId': '@_id'}, {
      update: {method: 'PUT'},
      getCount: {method: 'GET', url: '/api/items/count'}
    });
  })
  .controller('ProductsListController', function ($scope, ProductsResource, $uibModal) {
    $scope.productsShowLimits = [1, 10, 20, 50];

    $scope.query = {
      page: 0,
      limit: 10
    };

    $scope.page = 1;

    $scope.changePage = function () {
      $scope.query.page = $scope.page - 1;
    };

    // Products on page limit
    $scope.setLimit = function (limit) {
      $scope.query.limit = limit;
      $scope.query.page = 0;
      $scope.page = 1;
    };

    $scope.$watch('query', function () {
      $scope.init()
    }, true);

    // load products
    // add new resource to get count
    $scope.init = function () {
      ProductsResource.query($scope.query, function (data) {
        $scope.products = data;
        ProductsResource.getCount({}, function (data) {
          $scope.count = data.count;
          $scope.pagesCount = _.ceil($scope.count / $scope.query.limit, 0);
        }, function (err) {
          console.log(err);
        });
      }, function (err) {
        console.log(err);
      });
    };

    $scope.init();

    $scope.remove = function (product) {
      product.$delete()
        .then(function (resp) {
          $scope.init();
        })
        .catch(function (err) {
          console.log(err);
        })
    };

    // show product details in modal
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

    // add/edit product in modal
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
    };


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

  });

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