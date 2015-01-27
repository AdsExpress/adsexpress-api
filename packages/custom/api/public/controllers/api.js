'use strict';

/* jshint -W098 */
angular.module('mean.api').controller('ApiController', ['$scope', 'Global', 'Api',
  function($scope, Global, Api) {
    $scope.global = Global;
    $scope.package = {
      name: 'api'
    };
  }
]);
