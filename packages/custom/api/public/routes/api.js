'use strict';

angular.module('mean.api').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('api example page', {
      url: '/api/example',
      templateUrl: 'api/views/index.html'
    });
  }
]);
