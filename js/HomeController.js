(function () {
	'use strict';
	app.controller('HomeController', function ($scope,$state,fetchrecordsCMSService,getemployerfitService,$localStorage,$location,$document) { 
		$scope.employerFits = [];
		$scope.selection=[];
		$scope.selectionfit=[];
		$scope.jobFits=[];
		$scope.selectionIndustry=[];
		$scope.industrylist=[];	
		$scope.isEmplyrfitSelected = true;
		$scope.showjobfits = false;
		$scope.isJobfitSelected = true;
		$scope.showIndustry = false;
		$scope.isIndustrySelected = true;
		$scope.showSeniority = false;
		$scope.isSenioritySelected = true;	 
		$localStorage.email ='';

	//$('#mydiv').show();
	// var someElement = angular.element(document.getElementById('fit'));
	// $document.scrollToElementAnimated(someElement);

	$scope.showJobFitList = function(){
		var someElement = angular.element(document.getElementById('jobfit'));
		$document.scrollToElementAnimated(someElement);
	};

	var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	};
	var fetch_employerFit = function (data) {
		// alert(JSON.stringify(data));
		var fetch_employerFitList = data;
		angular.forEach(fetch_employerFitList, function(value, key) {
			$scope.employerFits.push({typeId: value.type_id, typeName: value.type_name});
		});
	};   

	getemployerfitService.fetchemployerfit('employer_fit').then(fetch_employerFit, errorDetails);


	var fetch_jobFit = function (data) {
		// alert(JSON.stringify(data));
		var fetch_jobFitList = data;
		angular.forEach(fetch_jobFitList, function(value, key) {
			$scope.jobFits.push({typeId: value.type_id, typeName: value.type_name});
		});
	};

  	// toggle selection for a given employer_fit by name
  	$scope.toggleSelection = function toggleSelection(employerFitTypeId) {	
  	var idx = $scope.selection.indexOf(employerFitTypeId);	
		 //Enabling/Disabling the NEXT button based on checkbox selection.	
		 if(idx == -1){
		 	$scope.isJobfitSelected = false;
		  	$scope.showIndustry = true;

		 	
		 } else if(idx == 0){
		 	$scope.isJobfitSelected = true;
		  	$scope.showIndustry = false;
		 }
		 // is currently selected		
		 if (idx > -1) {
		 	$scope.selection.splice(idx, 1);
		 } else {  // is newly selected
		 	$scope.selection.push(employerFitTypeId);
		 } 
		 $localStorage.ses_employerfit = $scope.selection.join(",");
		};

		getemployerfitService.fetchemployerfit('job_fit').then(fetch_jobFit, errorDetails);

		$scope.toggleJobfit = function toggleJobfit(jobFitTypeId) {		  
			var idx = $scope.selectionfit.indexOf(jobFitTypeId);
		  //Enabling/Disabling the EMPLOYER NEAR YOU button based on checkbox selection.	
		  if(idx == -1){
		  	$scope.isEmplyrfitSelected = false;
		 	$scope.showjobfits = true;	
		  } else if(idx == 0){
		  	$scope.isEmplyrfitSelected = true;
		 	$scope.showjobfits = false;		  	
		  }		
		 // is currently selected		
		 if (idx > -1) {
		 	$scope.selectionfit.splice(idx, 1);
		 } else {  // is newly selected
		 	$scope.selectionfit.push(jobFitTypeId);
		 }
		 //alert($scope.selection.join(","));
		 $localStorage.ses_jobfit = $scope.selectionfit.join(",");
		 //alert($localStorage.ses_jobfit);
		};
		$scope.selectionIndustryname = [];
		$scope.toggleIndustry = function toggleIndustry(industry_Id,industry_name) {		  
			var idx = $scope.selectionIndustry.indexOf(industry_Id);
			var name = $scope.selectionIndustryname.indexOf(industry_name);
		  //Enabling/Disabling the EMPLOYER NEAR YOU button based on checkbox selection.	
		  if(idx == -1){
		  	$scope.isIndustrySelected = false;
		  	$scope.showSeniority = true;
		  } else if(idx == 0){
		  	$scope.isIndustrySelected = true;
		  	$scope.showSeniority = false;
		  }		
		 // is currently selected		
		 if (idx > -1) {
		 	$scope.selectionIndustry.splice(idx, 1);
		 	$scope.selectionIndustryname.splice(name, 1);
		 } else {  // is newly selected
		 	$scope.selectionIndustry.push(industry_Id);
		 	$scope.selectionIndustryname.push({name:industry_name,industry_id:industry_Id});
		 }
		 
		 $localStorage.ses_Industry = $scope.selectionIndustry.join(",");
		 $localStorage.ses_industrylist = $scope.selectionIndustryname;	
		  //alert(JSON.stringify($localStorage.ses_industrylist));	
		};
		$scope.selectionSeniority = [];
		$scope.selectionSeniorityList = [];
		$scope.toggleSeniority = function toggleSeniority(industry_id,id) {
			$scope.selectionSeniorityList.push({industry_id:industry_id,level_id:id});	
		    $localStorage.ses_seniorityList = $scope.selectionSeniorityList;	
		 //  var idx = $scope.selectionSeniority.indexOf(id);			 	
		 //  if(idx == -1){
		   	$scope.isSenioritySelected = false;
		  	 
		 //  } else if(idx == 0){
		   //	$scope.isSenioritySelected = true;		  	 
		 //  }		
		 // // is currently selected		
		 // if (idx > -1) {
		 // 	$scope.selectionSeniority.splice(idx, 1);
		 // 	$scope.selectionSeniorityList.splice(industry_id, 1); 
		 // } else {  // is newly selected
		 // 	//$scope.selectionSeniority.push(id);
		 // 	$scope.selectionSeniorityList.push({industry_id:industry_id,level_id:id});		 	 
		 // }
		 //alert(JSON.stringify($localStorage.ses_seniorityList));	
		 //$localStorage.ses_Industry = $scope.selectionIndustry.join(",");		  
		};


		$scope.navIndustry=function(){		 
			var someElement = angular.element(document.getElementById('industry'));			 
			$document.scrollToElementAnimated(someElement);
		};
		$scope.navSeniority=function(){		 
			var someElement = angular.element(document.getElementById('seniority'));			 
			$document.scrollToElementAnimated(someElement);
		};  

		$scope.navRegister=function(){	
			$state.go("register");
		};		
		var fetch_industry = function (data) {
			$scope.industrylist = data;
			//alert(JSON.stringify($scope.industrylist));
		};	
		fetchrecordsCMSService.fetchrecordsCMS('','getIndustryList','').then(fetch_industry, errorDetails);

		$scope.levelList=[];	
		var fetch_seniority = function (data) {
			$scope.levelList = data;
			//alert(JSON.stringify($scope.levelList));
		};	
		fetchrecordsCMSService.fetchrecordsCMS('','getseniorityList','').then(fetch_seniority, errorDetails);   
	})
})();
