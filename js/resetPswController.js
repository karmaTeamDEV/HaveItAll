(function () {
	'use strict';
	app.controller('resetPswController', function ($scope,$stateParams,$state,$localStorage,commonpostService) {
	//alert($stateParams.param1);
	$scope.datainfo ={};
		var errorDetails = function (serviceResp) {		 
			$scope.Error = "Something went wrong ??";
		};

		var fetchusersdetails = function (data) {
			//alert(data.status);
			//if(data.status != 1){
				//$state.go("404"); 
			//}
		};
		var url = serviceurl + "API/getUserdetails/";
		var datalist = {id:$stateParams.param1};
   		commonpostService.cmnpost(url,datalist).then(fetchusersdetails, errorDetails); 
		
		var fetch_myrecord = function (data) {
			if(data.status == 1){
				bootbox.alert('Password changed successfully.');
				$state.go("login"); 
			}else{			
				bootbox.alert('Password could not changed.');
			}
		};

		 
		$scope.resetpsw = function(form){
			//alert($scope.datainfo.newpassword);
			if($scope.datainfo.newpassword != $scope.datainfo.confirmpassword){			 
				bootbox.alert('Password mis-matched.');
			}else{

				$scope.datainfo.users_id = $stateParams.param1;
				var url = serviceurl + "API/resetpsw/";
  		 		commonpostService.cmnpost(url,$scope.datainfo).then(fetch_myrecord, errorDetails); 
			}

			//alert(JSON.stringfy($scope.datainfo));
		}

})
})();
