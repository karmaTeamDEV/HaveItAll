(function () { 
    'use strict';
    app.controller('cultureFitController', function ($scope,$modal,$localStorage,$location,getfitService,jobService,checkjobService,$timeout) { 
    
    $scope.tab = 1;
    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };	
	
	$scope.jobFits=[];	
	$scope.displaySuccessMsg = false; 
	$scope.displayFailsMsg = false;	

	$localStorage.cutype_id = '';
     $scope.oper_desc = function (type_id) {
         $localStorage.cutype_id = type_id;
          //alert(type_id);
          var modalInstance = $modal.open({
              controller: 'PopupCont',
              templateUrl: 'templates/culturefitnote.html',
          });
      } 

	var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	};

	var fetch_jobFit = function (data) {		 
		 angular.forEach(data, function(value, key) {
		 	$scope.jobFits.push({typeId: value.type_id, typeName: value.type_name});
		 });
	};
	getfitService.fetchfit('job_fit').then(fetch_jobFit, errorDetails);

	var update_jobFit = function (data) {		 	
	 	if(data.status == 'true'){	
	 		$scope.displaySuccessMsg = true;			
	 		$scope.successmsg = "Jobfit updated successfully!";
	 	}else{
	 		$scope.displayFailsMsg = true;				
	 		$scope.failuresmsg = "Jobfit updated successfully!";
	 	}
	 	$timeout(function () {
	 		$scope.displaySuccessMsg = false;
	 		$scope.displayFailsMsg = false;
	 	}, 2000);
	};


	$scope.toggleJobfit = function toggleJobfit(jobFitTypeId,checkStatus) {
	 	var datalist = {user_id:$localStorage.ses_userdata.users_id,status:checkStatus,type:'job_fit',jobfit:jobFitTypeId};
	 	jobService.jobfit(datalist).then(update_jobFit, errorDetails);
	};

	$scope.jobinfo = [];
	var check_jobFit = function (data) {
	 	angular.forEach(data, function(value, key) {	     		
	 		$scope.jobinfo.push(value.type_id);
	 	});
	};
	var list = {user_id:$localStorage.ses_userdata.users_id,type:'job_fit'};
	checkjobService.checkedjobfit(list).then(check_jobFit, errorDetails); 

	// Employer Fit Start //////////////////////
	$scope.employerFits=[];	
	$scope.displayempSuccessMsg = false; 
	$scope.displayempFailsMsg = false;

	var fetch_empFit = function (data) {		 
		 var fetch_empFitList = data;
		 angular.forEach(fetch_empFitList, function(value, key) {
		 	$scope.employerFits.push({typeId: value.type_id, typeName: value.type_name});
		 });
	};
	getfitService.fetchfit('employer_fit').then(fetch_empFit, errorDetails);

	var update_empFit = function (data) { 	
	 	if(data.status == 'true'){	
	 		$scope.displayempSuccessMsg = true;			
	 		$scope.successempmsg = "Employer Fit updated successfully!";
	 	}else{
	 		$scope.displayempFailsMsg = true;				
	 		$scope.failuresempmsg = "Employer Fit updated successfully!";
	 	}
	 	$timeout(function () {
	 		$scope.displayempSuccessMsg = false; 
			$scope.displayempFailsMsg = false;
	 	}, 2000);  

	 	getfitService.fetchfit('employer_fit').then(fetch_empFit, errorDetails);
	 	var list = {user_id:$localStorage.ses_userdata.users_id,type:'employer_fit'};
		checkjobService.checkedjobfit(list).then(check_empFit, errorDetails);   

	 };
	$scope.toggleEmpfit = function toggleEmpfit(jobFitTypeId,empcheckStatus) {
	 	var datalist = {user_id:$localStorage.ses_userdata.users_id,status:empcheckStatus,type:'employer_fit',jobfit:jobFitTypeId};
	 	jobService.jobfit(datalist).then(update_empFit, errorDetails);
	};

	$scope.empinfo = [];
	var check_empFit = function (data) {
	 	var info  = data;
	 	angular.forEach(info, function(value, key) {	     		
	 		$scope.empinfo.push(value.type_id);
	 	});
	};
	var list = {user_id:$localStorage.ses_userdata.users_id,type:'employer_fit'};
	checkjobService.checkedjobfit(list).then(check_empFit, errorDetails);   

})
})();
