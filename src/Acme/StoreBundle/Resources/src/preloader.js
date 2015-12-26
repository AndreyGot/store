angular.module('preloader',[]).run(function ($http) {
	$http.get('/html/composite.html').then(function (response) 
	{
		$('body').append(response.data);
		angular.element(document).ready(function() {
		    angular.bootstrap(document, ['andrey']);
		});
	});
}).run(function(){});