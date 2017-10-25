(function () {
    'use strict';
    app.controller('ManageUserCMSController', function ($scope,$state,$location, $localStorage,getCMSService, addeditrecordCMSService,$timeout) { 
      
         if(parseInt($localStorage.ses_userdata.users_type) != 3){    
          $state.go("404");   
        }

        $scope.displaySuccessMsg = false; 
    	$scope.updatestatusmsg = '';	
    	$scope.userInfo = {};	
		$scope.usersList = [];
		$scope.userscheckunchecklist = [];
		$scope.activeUsers=[];
		$scope.inactiveUsers=[];
		

		var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		};

		var fetchusers = function(data){
			$scope.usersList = data;
        //alert(JSON.stringify($scope.usersList));
    };

    getCMSService.fetchrecordsCMS().then(fetchusers,errorDetails);

    var userstatusUpdateSuccess = function (data) {
    	if(data.message === undefined && parseInt(data) > 0){
    		$scope.displaySuccessMsg = true;
    		$timeout(function () {
    			$scope.displaySuccessMsg = false;
    		}, 2000);
    		getCMSService.fetchrecordsCMS().then(fetchusers,errorDetails);
    	} else {
    		//alert(data.message);
    		bootbox.alert(data.message);
    	}           
    };   

    $scope.toggleUsersStatus = function toggleSelection(userID,userStatus,fname,lname) {  
    	var userstatusObj = {userId:'',userStatus:'',};
        if(userStatus == 0 || userStatus == 1){ //Active/InActive Users
        	userstatusObj.userId = userID;
        	if(userStatus == 0){
        		userstatusObj.userStatus = 1;
        		$scope.updatestatusmsg = fname+" "+lname+" inactivated successfully!";
        	} else if(userStatus == 1){
        		userstatusObj.userStatus = 0;
        		$scope.updatestatusmsg = fname+" "+lname+" activated successfully!";
        	}
        } 

        addeditrecordCMSService.addeditrecordCMS(userstatusObj).then(userstatusUpdateSuccess, errorDetails);

    };


})
})();
