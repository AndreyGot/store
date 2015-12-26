angular.module('andrey').config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/main');
  //
  // Now set up the states
  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: '/main.html',
      controller: mainCtrl
    })
    .state('category', {
      url: '/category',
      templateUrl: '/category/index.html',
      controller: categoriesCtrl
    })
    .state('product', {
      url: '/product',
      templateUrl: '/product/index.html',
      controller: productsCtrl
    });
});