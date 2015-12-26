mainCtrl = function ($scope,Restangular)
{
	$scope.type = '';
	$scope.typeChange = function (type) {
		$scope.type = type;
	};

	$scope.categories = [];
	function uploadCategorise () {
		var service = Restangular.service('category');
		service.getList().then(function (response) {
			$scope.categories = response;
		});
	}

	$scope.products = [];
	function uploadProducts () {
		var service = Restangular.service('product');
		service.getList().then(function (response) {
			$scope.products = response;
		});
	}

	$scope.contacts = [];
	function uploadContacts () {
		var service = Restangular.service('contact');
		service.getList().then(function (response) {
			$scope.contacts = response;
		});
	}


	$scope.$watch('type', function () {
		if ($scope.type === 'category') {
			uploadCategorise();
		} else if ($scope.type === 'product') {
			uploadProducts();
		} else if ($scope.type === 'contact') {
			uploadContacts();
		}
	});

	$scope.editCategory = function (category) {
		category.edit = true;
	};

	$scope.saveCategory = function (category) {
		Restangular.restangularizeElement(null, category, 'category');
		category.fromServer = true;
		category.save().then(function (data) {
			console.log(data);
		});
	};
};
angular.module('andrey').controller('mainCtrl',mainCtrl);