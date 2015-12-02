productFormCtrl = function ($scope,$http) {
	$http.get('/app_dev.php/category').then(function (response) {
		console.log(response.data);
	});
}
angular.module('andrey').controller('productFormCtrl',productFormCtrl);