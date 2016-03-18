'use strict';

app
  .factory('ProductsResource', function ($resource) {
    return $resource('/api/items/:itemId', {'itemId': '@_id'}, {
      update: {method: 'PUT'},
      getCount: {method: 'GET', url: '/api/items/count'},
      deleteMulti: {method: 'DELETE', url: '/api/items'}
    });
  })
;