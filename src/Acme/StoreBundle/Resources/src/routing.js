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
    .state('main.category', {
      url: '/category',
      templateUrl: '/category/index.html',
      controller: categoriesCtrl
    })
    .state('main.product', {
      url: '/product',
      templateUrl: '/product/index.html',
      controller: productsCtrl
    })
    .state('main.contact', {
      url: '/contact',
      templateUrl: '/contact/index.html',
      controller: contactCtrl
    });
});