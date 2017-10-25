(function () {
	'use strict';
	app.controller('testController', function ($scope,$state,$localStorage,commonpostService,fetchrecordsCMSService,getfitService) {   

		var errorDetails = function (serviceResp) {		 
			$scope.Error = "Something went wrong ??";
		};			 
		function resetForm(){		  
			$scope.educationinfo = {};
			$scope.educationinfo.action = 'insert';
		}		
		$scope.educationinfo = {};
		$scope.educationinfo.action='insert';
		$scope.educationinfo.users_id=$localStorage.ses_userdata.users_id;

		$scope.options= [{
				        "id": "1",
				        "name": "France",
				        "capital": "Paris"
					    },
					    {
					        "id": "2",
					        "name": "United Kingdom",
					        "capital": "London"
					    },
					    {
					        "id": "3",
					        "name": "Germany",
					        "capital": "Berlin"
					    },
					    {
					        "id": "4",
					        "name": "Poland",
					        "capital": "Berlin"
					    }];
		 $scope.selection = [
			    // {
			    //     "id": "2",
			    //     "name": "United Kingdom",
			    //     "capital": "London"
			    // },
			    // {
			    //     "id": "3",
			    //     "name": "Germany",
			    //     "capital": "Berlin"
			    // }
		 ];	
		//$scope.educationinfo = [];
		var fetch_edulist = function (data) {		 
			 //alert(JSON.stringify(data));
			 $scope.educationdatalist=data;
		};

		fetchrecordsCMSService.fetchrecordsCMS('','getlistEducation',$localStorage.ses_userdata.users_id).then(fetch_edulist, errorDetails); 

		var addCategory = function (data) {		 
			if(data.status == 1){		 
				resetForm();
				$scope.educationForm.$setPristine();				 
				fetchrecordsCMSService.fetchrecordsCMS('','getlistEducation',$localStorage.ses_userdata.users_id).then(fetch_edulist, errorDetails);
			}
		}; 	 

	$scope.addEducation = function(){
    	//alert(JSON.stringify($scope.educationinfo));   
    	$scope.educationinfo.users_id = $localStorage.ses_userdata.users_id; 	 
    	var urlpath = serviceurl + "API/addEducation/";
    	commonpostService.cmnpost(urlpath,$scope.educationinfo).then(addCategory, errorDetails); 
    };

    
    $scope.educationdata =[];
    var fetch_educatelist = function (data) {    	 
    	$scope.educationdata = data;  
		//alert(JSON.stringify($scope.educationdata));	
	};
	fetchrecordsCMSService.fetchrecordsCMS('','geteducatetype','education').then(fetch_educatelist, errorDetails);
	$scope.subeducationlist =[];
	var fetch_subeducation = function (data) { 
    	$scope.subeducationlist = data;  
		//alert(JSON.stringify($scope.subeducationlist));	
	};
	$scope.getsubeducation = function(){
		//alert(JSON.stringify($scope.educationinfo.education_id));	
		fetchrecordsCMSService.fetchrecordsCMS('','getsubeducation',$scope.educationinfo.education_id).then(fetch_subeducation, errorDetails); 
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
		$scope.educationinfo.action='update';
		fetchrecordsCMSService.fetchrecordsCMS('','getsubeducation',$scope.educationinfo.education_id).then(fetch_subeducation, errorDetails); 
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
	alert(id);   	 
		var urlpath = serviceurl + "API/deleteeducate";	 
		var info = {id:id};
		commonpostService.cmnpost(urlpath,info).then(educate_remove, errorDetails);
	};

})
})();
