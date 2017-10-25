(function () {
	'use strict';
	app.controller('ForgotpswController', function ($scope,$state,$localStorage,$location,ForgotpswService) { 

		$scope.userInfo ={};
		var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		};	 


		var fetch_profile = function (data) {     	
     		//alert(data);
     		if(data.error!=1){
     			//alert('Go to your email for your password.');
     			bootbox.alert('Go to your email for your password.');
     			$state.go("login"); 
     		}else{
     			$scope.userInfo.username = '';
     			$scope.forgot.$setPristine();
     			bootbox.alert(data.message);	
     			
     		}


     	};
     	$localStorage.email ='';
     	$scope.forgotPsw = function(){ 
     		$localStorage.email = $scope.userInfo.username;  		
     		ForgotpswService.forgotPassword($scope.userInfo).then(fetch_profile,errorDetails);
     	};

     })
})();
