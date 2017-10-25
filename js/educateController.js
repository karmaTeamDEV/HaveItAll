(function () {
	'use strict';
	app.controller('educateController', function ($scope,$state,$localStorage,$window,commonpostService,fetchrecordsCMSService,getfitService) {   
 
		var errorDetails = function (serviceResp) {		 
			$scope.Error = "Something went wrong ??";
		};			 
		function resetForm(){		  
			$scope.educationinfo = {otherarea:''};
			$scope.educationinfo.action = 'insert';
		}		
		$scope.educationinfo = {otherarea:''};
		$scope.selection = [];
		$scope.educationinfo.action='insert';
		//$scope.industryinfo.subeducation_id ='';
		$scope.educationinfo.users_id=$localStorage.ses_userdata.users_id;
 	
		//$scope.educationinfo = [];
		var fetch_edulist = function (data) {		 
			 //alert(JSON.stringify(data));
			 $scope.educationdatalist=data;
			 //alert(JSON.stringify($scope.educationdatalist));
		};

		fetchrecordsCMSService.fetchrecordsCMS('','getlistEducation',$localStorage.ses_userdata.users_id).then(fetch_edulist, errorDetails); 

		var addEducate = function (data) {		 
			if(data.status == 1){	
				if($scope.educationinfo.action == 'insert'){
					bootbox.alert('Degree/ Certification inserted successfully !');	
				}else{
					bootbox.alert('Degree/ Certification updated successfully !');	
				}	 
				resetForm();
				$scope.subeducationlist = []; 
				$scope.selection = [];
				$scope.educationForm.$setPristine();				 
				fetchrecordsCMSService.fetchrecordsCMS('','getlistEducation',$localStorage.ses_userdata.users_id).then(fetch_edulist, errorDetails);
			}
		}; 	 

	$scope.addEducation = function(){
		//alert($scope.educationinfo.otherarea.length);
		//alert(JSON.stringify($scope.selection.length));
		if(($scope.selection.length == '0') && ($scope.educationinfo.otherarea.length == '0')){
    		bootbox.alert('Area of Study is required!');
    		return false;
    	}
    	//alert(JSON.stringify($scope.educationinfo));
    	$scope.educationinfo.subeducation_id = $scope.selection;   
    	$scope.educationinfo.users_id = $localStorage.ses_userdata.users_id; 	 
    	var urlpath = serviceurl + "API/addEducation/";
    	commonpostService.cmnpost(urlpath,$scope.educationinfo).then(addEducate, errorDetails); 
    };

    $scope.toggleSelection = function toggleSelection(id) {
      var idx = $scope.selection.indexOf(id);
      
      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }      
      // is newly selected
      else {
        $scope.selection.push(id);
      }
      //alert(JSON.stringify($scope.selection));     	
    };

    
    $scope.educationdata =[];
    var fetch_educatelist = function (data) {    	 
    	$scope.educationdata = data; 
    	 
		//alert(JSON.stringify($scope.educationdata));	
	};
	fetchrecordsCMSService.fetchrecordsCMS('','geteducatetype','education').then(fetch_educatelist, errorDetails);
	$scope.subeducationlist =[];
	var fetch_subeducation = function (data) { 
		//alert(JSON.stringify(data));
		$scope.subeducationlist = data;    	 
	 	
	};
	$scope.getsubeducation = function(){		
		//alert($scope.educationinfo.education_id);	
		if($scope.educationinfo.education_id){
			fetchrecordsCMSService.fetchrecordsCMS('','getsubeducation',$scope.educationinfo.education_id).then(fetch_subeducation, errorDetails); 
		}else{
			$scope.subeducationlist =[];
		}		 	
		
	};
	$scope.instituteList = [];
    var fetch_institute = function (data) {		 
    	$scope.instituteList =  data;
    	//alert(JSON.stringify($scope.instituteList));		 	 
    };    
    fetchrecordsCMSService.fetchrecordsCMS('','getInstituteList','').then(fetch_institute, errorDetails); 


	var fetch_educationinfo = function (data) {  	 	  	
		$scope.educationinfo  = data[0]; 
		//alert(JSON.stringify($scope.educationinfo));
		$scope.sub_id =[];
		 angular.forEach($scope.educationinfo.subEducation, function(value11, key) {
		 	    $scope.sub_id = $scope.sub_id.concat(value11.type_id);			 	 
		 });
		 $scope.selection = $scope.sub_id;
		 $scope.educationinfo.action='update';

		fetchrecordsCMSService.fetchrecordsCMS('','geteducatetype','education').then(fetch_educatelist, errorDetails);
		if($scope.educationinfo.education_id != '0'){
			//alert($scope.educationinfo.education_id);
			fetchrecordsCMSService.fetchrecordsCMS('','getsubeducation',$scope.educationinfo.education_id).then(fetch_subeducation, errorDetails); 
		}else{
			$scope.subeducationlist =[];
		}
		
		//fetchrecordsCMSService.fetchrecordsCMS('','getInstituteList',$scope.educationinfo.subeducation_id).then(fetch_institute, errorDetails);
		fetchrecordsCMSService.fetchrecordsCMS('','getlistEducation',$localStorage.ses_userdata.users_id).then(fetch_edulist, errorDetails); 		   	 
	};		

	$scope.editEducate = function(id){
		//alert(id);		 
		fetchrecordsCMSService.fetchrecordsCMS('','geteducationinfoData',id).then(fetch_educationinfo, errorDetails);
	}; 

	var educate_remove = function (data) {    	 
		if(data.status=='1'){
			fetchrecordsCMSService.fetchrecordsCMS('','getlistEducation',$localStorage.ses_userdata.users_id).then(fetch_edulist, errorDetails); 
		}else{
			bootbox.alert('Error in delete.');
		}
	};


	$scope.removeducate = function(id){ 
		//alert(id);   	 
		var urlpath = serviceurl + "API/deleteeducate";	 
		var info = {id:id};
		commonpostService.cmnpost(urlpath,info).then(educate_remove, errorDetails);
	};

})
})();
