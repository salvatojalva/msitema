(function() {
	/*
		Proveedor
	*/
	'use strict';

	angular
		.module('authApp')
		.controller('DenunciaController', DenunciaController)
		.controller('DenunciaListController', DenunciaListController)
		.controller('DenunciaCreateController', DenunciaCreateController)
		.controller('DenunciaMcController', DenunciaMcController)
		
		.controller('DenunciaVerController', DenunciaVerController);
		
	function DenunciaController($scope, $state, $location) {
		
		$scope.isActive = function (viewLocation1) {
		    var active = (viewLocation1 === $location.path());
		    return active;
		}
		
	}

	function DenunciaMcController($scope, $state, $location, $rootScope ,  $http) {
		$scope.user_id = $rootScope.currentUser.id;
		$scope.listar = function(){
			$http({
				'method': "GET",
				'url': 'api/miscasos/' + $scope.user_id
			}).success(function(response){
				$scope.casos = response;
			}).error(function(data){
			});
		}

		$scope.listar();
		
	}

	function DenunciaListController($scope, $http, $auth, $window) {
		$scope.listar = function(){
			$http({
				'method': "GET",
				'url': 'api/casos'
			}).success(function(response){
				$scope.casos = response;
			}).error(function(data){
			});
		}

		$scope.listar();
		
	}

	function DenunciaCreateController($scope, $http, $auth, $window, $state, $rootScope) {
		$scope.usuario = $rootScope.currentUser;
		$scope.mostrar = {
			primero : true,
			segundo : false,
			tercero	: false
		}
		$scope.Caso = {}

		$scope.Datos = {};
		$scope.listar = function(){
			$http({
				'method': "GET",
				'url': 'api/etnia'
			}).success(function(response){
				$scope.etnias = response;
			}).error(function(data){
			});

			$http({
				'method': "GET",
				'url': 'api/lugar'
			}).success(function(response){
				$scope.lugares = response;
			}).error(function(data){
			});

			$http({
				'method': "GET",
				'url': 'api/tipocaso'
			}).success(function(response){
				$scope.tipocasos = response;
			}).error(function(data){
			});

			$http({
				'method': "GET",
				'url': 'api/usuario'
			}).success(function(response){
				$scope.usuarios = response;
			}).error(function(data){
			});

			$scope.Caso.user_id = $scope.usuario.id;
		}

		$scope.listar();
		$scope.sh_primero = function(){
			if($scope.mostrar.primero){
				$scope.mostrar = {
					primero : false,
					segundo : true,
					tercero	: false
				}				
			}else{
				$scope.mostrar = {
					primero : true,
					segundo : false,
					tercero	: false
				}
			}
		}

		$scope.sh_segundo = function(){
			if($scope.mostrar.segundo){
				$scope.mostrar = {
					primero : false,
					segundo : false,
					tercero	: true
				}				
			}else{
				$scope.mostrar = {
					primero : false,
					segundo : true,
					tercero	: false
				}
			}
		}

		$scope.agregar = function(){
			$scope.Datos = {
				caso 		: $scope.Caso,
				Demandante 	: $scope.Demandante,
				Demandado	: $scope.Demandado,
				Cita		: $scope.Cita
			};

			$http({
				'method': "POST",
				'url': 'api/denuncia',
				'data': $scope.Datos
			}).success(function(response){
				$state.go('denuncia.list');
			}).error(function(data){
			});	
		}


	}

	function DenunciaVerController($scope, $http, $auth, $window, $state) {
		$scope.casoID = $state.params.casoID;
		$scope.nuevacita = false;
		$scope.listar = function(){
			$http({
				'method': "GET",
				'url': 'api/casos/' + $scope.casoID
			}).success(function(response){
				$scope.Caso = response;

				$scope.Cita = angular.copy($scope.Caso.citas[ $scope.Caso.citas.length - 1] );

			}).error(function(data){
			});
		}

		$scope.resuelto = function(){
			$http({
				'method': "PUT",
				'url': 'api/cita/' + $scope.Cita.id,
				'data': $scope.Cita
			}).success(function(response){
				var Caso = {
					id 			: $scope.Caso.id,
					resuelto	: 1,
					user_id		: $scope.Caso.user_id
				}
				$http({
					'method': "PUT",
					'url': 'api/casos/' + Caso.id,
					'data': Caso
				}).success(function(response){

					
					$state.go('denuncia.list');
				}).error(function(data){
				});	

			}).error(function(data){
			});	
		}

		$scope.crearCita = function(){
			$scope.CitaNueva.user_id = $scope.Cita.user_id;
			$scope.CitaNueva.caso_id = $scope.Caso.id;

			$http({
				'method': "PUT",
				'url': 'api/cita/' + $scope.Cita.id,
				'data': $scope.Cita
			}).success(function(response){
				
				$http({
					'method': "POST",
					'url': 'api/cita',
					'data': $scope.CitaNueva
				}).success(function(response){
					$state.go('denuncia.list');
				}).error(function(data){
				});	

			}).error(function(data){
			});	
		}

		$scope.listar();
	}
})();