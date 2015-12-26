mainCtrl = function ($scope,$http)
{
	$scope.type = 'product';
	$scope.typeChange = function (type) {
		$scope.type = type;
	};

	$scope.categories = [];
	function uploadCategorise () {
		$http.get('/app_dev.php/category').then(function (response) 
		{
			$scope.categories = response.data;
		});
	}

	$scope.products = [];
	function uploadProducts () {
		$http.get('/app_dev.php/product').then(function (response)
		{
			$scope.products = response.data;
		});
	}

	$scope.contacts = [];
	function uploadContacts () {
		$http.get('/app_dev.php/contact').then(function (response)
		{
			$scope.contacts = response.data;
		});
	}


	$scope.$watch('type', function () {
		if ($scope.type === 'category') {
			uploadCategorise();
		} else if ($scope.type === 'product') {
			uploadProducts();
		} else if ($scope.type === 'contact') {
			uploadContacts();
		} else {
			console.warn('error');
		}
	});
};
angular.module('andrey').controller('mainCtrl',mainCtrl);