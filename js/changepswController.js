(function () {
	'use strict';
	app.controller('changepswController', function ($scope,$state,$localStorage,commonpostService) {

		var errorDetails = function (serviceResp) {		 
			$scope.Error = "Something went wrong ??";
		};
		var fetch_myrecord = function (data) {

			if(data.status == 1){
				bootbox.alert('Password changed successfully.');
				$state.go("user.profile"); 
			}else{			
				bootbox.alert('Password could not changed.');
			}
		};

		$scope.datainfo = {};
		$scope.changepsw = function(form){

			if($scope.datainfo.newpassword != $scope.datainfo.confirmpassword){			 
				bootbox.alert('Password mis-matched.');
			}else{
				$scope.datainfo.users_id = $localStorage.ses_userdata.users_id;
				var url = serviceurl + "API/changepsw/";
        		commonpostService.cmnpost(url,$scope.datainfo).then(fetch_myrecord, errorDetails); 
			}

			//alert(JSON.stringfy($scope.datainfo));
		}

})
})();
