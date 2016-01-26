categoriesCtrl = function ($scope,$http,Restangular)
{
	$scope.categories = [];
	function uploadCaregories () {
		var service = Restangular.service('category');
		service.getList().then(function (response) {
			$scope.categories = response;
		});
	}
	uploadCaregories();

	$scope.currentCategory = null;
	$scope.editAndShowCategory = function (category) {
		$scope.currentCategory = category;
	};

	$scope.back = function () {
		$scope.currentCategory = null;
	};

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
		$scope.currentCategory = category;
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
};
angular.module('andrey').controller('categoriesCtrl',categoriesCtrl);