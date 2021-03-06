'use strict';

app
  .controller('ProductsListController', function ($scope, ProductsResource, $uibModal) {
    // load products

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

    // Limits products on page

    $scope.productsShowLimits = [1, 10, 20, 50];

    $scope.query = {
      page: 0,
      limit: 10
    };

    $scope.page = 1;

    $scope.changePage = function () {
      $scope.query.page = $scope.page - 1;
    };

    $scope.setLimit = function (limit) {
      $scope.query.limit = limit;
      $scope.query.page = 0;
      $scope.page = 1;
    };

    $scope.$watch('query', function () {
      $scope.init()
    }, true);

    // ------------------------

    // remove multiple products

    $scope.productsToRemove = [];

    $scope.toggleRemove = function (productId) {
      if ($scope.isMarkedForRemove(productId)) {
        _.remove($scope.productsToRemove, function (product) {
          return product === productId
        })
      } else {
        $scope.productsToRemove.push(productId)
      }
    };

    $scope.isMarkedForRemove = function (id) {
      return _.includes($scope.productsToRemove, id)
    };

    $scope.$watch('productsToRemove', function () {
      $scope.removeMultipleQuery = {
        items: $scope.productsToRemove
      };
      $scope.countToDelete = $scope.productsToRemove.length
    }, true);

    $scope.removeSelected = function () {
      if (confirm("Now you are going to delete " + $scope.countToDelete + ' items.\n Are you shure?')) {
        ProductsResource.deleteMulti($scope.removeMultipleQuery, function (resp) {
          $scope.clearSelection();
          $scope.init();
          console.log(resp);
        }, function (err) {
          console.log(err);
        })
      }
    };

    $scope.clearSelection = function () {
      $scope.productsToRemove = [];
    };

    $scope.selectAll = function () {
      $scope.productsToRemove = _.map($scope.products, function (product) {
        return product._id
      })
    };

    // ----------------------

    // remove single product

    $scope.remove = function (product) {
      if (confirm('Now you are going to delete ' + product.title.toUpperCase() + ' item!\nAre you sure?')) {
        product.$delete()
          .then(function () {
            $scope.init();
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    };

    // ------------------------

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

      //  // nothing to do...
      //modalInstance.result.then(function () {
      //  //$scope.init();
      //  //$scope.selected = selectedItem;
      //}, function () {
      //  console.log('Modal dismissed at: ' + new Date());
      //});
    };

    // ----------------------

    // create/edit product in modal

    $scope.showProductForm = function (product) {
      product = product || {};

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
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    // ------------------------
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
  data = data || undefined;
  return function () {
    $uibModalInstance.close(data);
  }
}

function modalCancel($uibModalInstance) {
  return function () {
    $uibModalInstance.dismiss('cancel');
  }
}
