contactCtrl = function ($scope,$http,Restangular)
{
	$scope.contacts = [];
	function uploadContacts () {
		var service = Restangular.service('contact');
		service.getList().then(function (response) {
			$scope.contacts = response;
		});
	}
	uploadContacts();
};
angular.module('andrey').controller('contactCtrl',contactCtrl);