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
		category.previousCategory = angular.copy(category);
		$scope.currentCategory = category;
	};

	$scope.back = function () {
		$scope.currentCategory = null;
	};

	$scope.addCategory = function () {
		var category = {
			id: null,
			name: '',
		};
		$scope.currentCategory = category;
		$scope.categories.push(category);
	};

	$scope.deleteCategory = function (category) {
		Restangular.restangularizeElement(null, category, 'category');
		category.remove().then(function(){
			for (var i = $scope.categories.length - 1; i >= 0; i--) {
				if ($scope.categories[i].id === category.id) {
					$scope.categories.splice(i, 1);
				}
			}
		});
		$scope.back();
	};

	$scope.saveCategory = function (category) {
		var previousCategory = category.previousCategory;	
		
		Restangular.restangularizeElement(null, previousCategory, 'category');
		if (previousCategory.id) {
			previousCategory.fromServer = true;
		}
		previousCategory.save().then(function (data) {
			previousCategory.id   = data.id;
			for(var name in previousCategory) {
			  if (previousCategory.hasOwnProperty(name)) {
			  	category[name] = previousCategory[name];
			  }
			}
			$scope.back();
		});
	};
};
angular.module('andrey').controller('categoriesCtrl',categoriesCtrl);