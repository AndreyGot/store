productFormCtrl = function ($scope,$http)
{
	$http.get('/app_dev.php/category').then(function (response) 
	{
		$scope.categories = response.data;
	});
}
angular.module('andrey').controller('productFormCtrl',productFormCtrl);