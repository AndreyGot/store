angular.module('andrey',['ui.router','ui.bootstrap','restangular','ngSanitize','ui.select'])
  .config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }])
  .config(function (RestangularProvider) {
  	var pathname = document.location.pathname.replace(/\/$/,'');
  	RestangularProvider.setBaseUrl(pathname);
    RestangularProvider.setResponseExtractor(function extractResponse(serverResponse) {
      return serverResponse.data;
    });
  })
  .run(function () {});
  