mainCtrl = function ($scope,Restangular)
{
	$scope.type = '';
	$scope.typeChange = function (type) {
		$scope.type = type;
	};

	$scope.products = [];
	function uploadProducts () {
		var service = Restangular.service('product');
		service.getList().then(function (response) {
			$scope.products = response;
		});
	}
	
	$scope.categories = [];
	function uploadCategories () {
		var service = Restangular.service('category');
		service.getList().then(function (response) {
			$scope.categories = response;
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
			uploadCategories();
		} else if ($scope.type === 'product') {
			uploadProducts();
		} else if ($scope.type === 'contact') {
			uploadContacts();
		}
	});

	$scope.currentCategory = null;
	$scope.editAndShowCategory = function (category) {
		$scope.currentCategory = category;
	};

	$scope.back = function () {
		$scope.currentCategory = null;
	}

	$scope.showCategory = function (category) {
		category.show = true;
		$scope.category = category;
	};

	$scope.editCategory = function (category) {
		category.edit = true;
	};

	$scope.addCategory = function () {
		var category = {
			id: null,
			name: '',
			edit: true
		};
		$scope.categories.push(category);
	};

	$scope.deleteCategory = function (category) {
		Restangular.restangularizeElement(null, category, 'category');
		category.remove().then(function(data){
			for (var i = $scope.categories.length - 1; i >= 0; i--) {
				if ($scope.categories[i].id === data.id) {
					$scope.categories.splice(i, 1);
				}
			}
		});
		$scope.back();
	};

	$scope.saveCategory = function (category) {
		Restangular.restangularizeElement(null, category, 'category');
		if (category.id) {
			category.fromServer = true;
		}
		category.save().then(function (data) {
			category.edit = false;
			category.id   = data.id;
			$scope.back();
		});
	};

	//path of Products	
		$scope.editProduct = function (product) {
		product.edit = true;
	};

	$scope.saveProduct = function (product) {
		Restangular.restangularizeElement(null, product, 'product');
		if (product.id) {
			product.fromServer = true;
		}
		product.save().then(function (data) {
			product.edit = false;
			product.id   = data.id;
		});
	};
};
angular.module('andrey').controller('mainCtrl',mainCtrl);