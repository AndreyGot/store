angular.module('andrey',['ui.router','ui.bootstrap','restangular','ngSanitize','ui.select'])
  .config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }])
  .config(function (RestangularProvider) {
  	var pathname = document.location.pathname.replace(/\/$/,'');
  	RestangularProvider.setBaseUrl(pathname);
  })
  .run(function () {});
  