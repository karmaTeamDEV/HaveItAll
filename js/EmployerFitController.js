(function () {
    'use strict';
    app.controller('EmployerFitController', function ($scope,$localStorage,$location,getfitService,jobService,checkjobService,$timeout) { 

   
	$scope.userInfo = {};	
	
	$scope.selectionfit=[];
	$scope.jobFits=[];
	$scope.checkedjobs=[];	
	$scope.displaySuccessMsg = false; 
	$scope.displayFailsMsg = false;

	var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	};

	var fetch_jobFit = function (data) {
		 //alert(JSON.stringify(data));
		 var fetch_jobFitList = data;
		 angular.forEach(fetch_jobFitList, function(value, key) {
		 	$scope.jobFits.push({typeId: value.type_id, typeName: value.type_name});
		 });
		};
		getfitService.fetchfit('employer_fit').then(fetch_jobFit, errorDetails);

		var update_jobFit = function (data) {
		 	//alert(data.status);
		 	
		 	if(data.status == 'true'){	
		 		$scope.displaySuccessMsg = true;			
		 		$scope.successmsg = "Employer Fit updated successfully!";
		 	}else{
		 		$scope.displayFailsMsg = true;				
		 		$scope.failuresmsg = "Employer Fit updated successfully!";
		 	}


		 	$timeout(function () {
		 		$scope.displaySuccessMsg = false;
		 		$scope.displayFailsMsg = false;

		 	}, 2000);   

		 };


		 $scope.toggleJobfit = function toggleJobfit(jobFitTypeId,checkStatus) {

		 	var datalist = {user_id:$localStorage.ses_userdata.users_id,status:checkStatus,type:'employer_fit',jobfit:jobFitTypeId};
		 	jobService.jobfit(datalist).then(update_jobFit, errorDetails);	  

		 };




		 $scope.jobinfo = [];
		 var check_jobFit = function (data) {
		 	var info  = data;
		 	angular.forEach(info, function(value, key) {	     		
		 		$scope.jobinfo.push(value.type_id);
		 	});
		 	//alert(JSON.stringify($scope.jobinfo));

		 };
		 var list = {user_id:$localStorage.ses_userdata.users_id,type:'employer_fit'};
		 checkjobService.checkedjobfit(list).then(check_jobFit, errorDetails);   

})
})();
