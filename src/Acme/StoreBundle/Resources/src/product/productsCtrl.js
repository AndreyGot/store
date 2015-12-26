productsCtrl = function ($scope,$http)
{
	$http.get('/app_dev.php/product').then(function (response) 
	{
		$scope.products = response.data;
	});
};
angular.module('andrey').controller('productsCtrl',productsCtrl);