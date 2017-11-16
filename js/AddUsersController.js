/* ==========================================================================
Author: BAMADEB UPADHYAYA
Create date:  05/10/2017
Description:  Add user js page
=============================================================================  */

(function () {
    'use strict';
    app.controller('AddUsersController', function ($scope,$state,registeruserService,$localStorage,$location,getCMSService,$document,fetchrecordsCMSService,addeditrecordCMSService,$timeout) { 
    	 
    	$scope.displaySuccessMsg = false; 
		$scope.updatestatusmsg = '';
    	$scope.userregisterInfo = {};
    	$scope.userregisterInfo.addUser = '1';
    	$scope.userregisterInfo.company_type = '1';
    	$scope.userregisterInfo.regular_url = regular_url+'resetpsw/';
    	$scope.usersList=[];
    	$scope.userregisterInfo.users_companyid = $localStorage.ses_userdata.users_companyid;
    	//alert($scope.userregisterInfo.regular_url);
    	function resetForm(){
			$scope.userregisterInfo.first_name = '';
			$scope.userregisterInfo.last_name = '';
			$scope.userregisterInfo.username = '';
			$scope.userregisterInfo.password = '';
			$scope.userregisterForm.$setPristine();
		}
    	var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		};

		var fetchusers = function(data){
		$scope.usersList = data;
        //alert(JSON.stringify($scope.usersList));
    	};		 
    	fetchrecordsCMSService.fetchrecordsCMS('','getCompanyuser',$scope.userregisterInfo.users_companyid).then(fetchusers,errorDetails);
 
		var registeruserSuccess = function (data) {
			//alert(JSON.stringify(data));
			if(data.success == 1){
				bootbox.alert('User added successfully.');				 
				fetchrecordsCMSService.fetchrecordsCMS('','getCompanyuser',$scope.userregisterInfo.users_companyid).then(fetchusers,errorDetails); 
				resetForm();
			} else {
				bootbox.alert(data.error);				
			}				   
		};

		 var userstatusUpdateSuccess = function (data) {
	    	if(parseInt(data) > 0){
	    		$scope.displaySuccessMsg = true;
	    		$timeout(function () {
	    			$scope.displaySuccessMsg = false;
	    		}, 2000);
	    		
	    		fetchrecordsCMSService.fetchrecordsCMS('','getCompanyuser',$scope.userregisterInfo.users_companyid).then(fetchusers,errorDetails);
	    	} else {	    		 
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

    	$scope.registercompanyRuser = function(){	  
		  //alert(JSON.stringify($scope.userregisterInfo));
		  //alert(JSON.stringify($localStorage.ses_userdata));	
		  $scope.userregisterInfo.company_name = $localStorage.ses_userdata.company_name;	  
		  registeruserService.registerCompanyUser($scope.userregisterInfo).then(registeruserSuccess, errorDetails);
		};
})
})();
