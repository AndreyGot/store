productsCtrl = function ($scope,$http,Restangular)
{
	$scope.products  = [];
	function uploadProducts () {
		var service = Restangular.service('product');
		service.getList().then(function (response) {
			$scope.products = response;
		});
	}
	uploadProducts();

	$scope.categories = [];
	function uploadCaregories () {
		var service = Restangular.service('category');
		service.getList().then(function (response) {
			$scope.categories = response;
		});
	}
	uploadCaregories();

	$scope.currentProduct = null;
	$scope.editAndShowProduct = function (product) {
		$scope.currentProduct = product;
	};

	$scope.back = function () {
		$scope.currentProduct = null;
	};

	$scope.showProduct = function (product) {
		product.show = true;
		$scope.product = product;
	};

	$scope.editProduct = function (product) {
		product.edit = true;
	};

	$scope.addProduct = function () {
		var product = {
			id: null,
			name: '',
			edit: true
		};
		$scope.products.push(product);
	};

	$scope.deleteProduct = function (product) {
		Restangular.restangularizeElement(null, product, 'product');
		product.remove().then(function(){
			for (var i = $scope.products.length - 1; i >= 0; i--) {
				if ($scope.products[i].id === product.id) {
					$scope.products.splice(i, 1);
				}
			}
		});
		$scope.back();
	};

	$scope.saveProduct = function (product) {
		Restangular.restangularizeElement(null, product, 'product');
		if (product.id) {
			product.fromServer = true;
		}
		product.save().then(function (data) {
			product.edit         = false;
			product.id           = data.id;
			product.categoryName = data.categoryName;
			$scope.back();
		}, function (data) {
			console.log(data);
		});
	};
};
angular.module('andrey').controller('productsCtrl',productsCtrl);