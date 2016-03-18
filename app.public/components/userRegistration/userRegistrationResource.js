'use strict';

app
  .factory('UserRegistrationResource', function ($resource) {
    return $resource('/api/register', {},
      {
        updatePassword: {method: 'PUT', url: '/api/users/me/change-password'},
        updateProfile: {method: 'PUT', url: '/api/users/me/edit-profile'},
        checkUsername: {method: 'GET', url: '/api/check-username'},
        checkEmail: {method: 'GET', url: '/api/check-email'}
      }
    );
  })
;