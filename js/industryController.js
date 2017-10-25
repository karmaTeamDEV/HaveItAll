(function () {
	'use strict';
	app.controller('industryController', function ($window,$scope,$state,$localStorage,commonpostService,fetchrecordsCMSService,getfitService) {   

		var errorDetails = function (serviceResp) {		 
			$scope.Error = "Something went wrong ??";
		};	
		$scope.levelarray = [];
		
		function resetForm(){		 
		
		$scope.industryinfo = {};
		//$scope.industryinfo.area = {};
		$scope.industryinfo.action = 'insert';     

		}
		
		$scope.industryinfo = {};
		$scope.selection = [];
		$scope.selectionLevel = [];
		$scope.industryinfo.action='insert';
		$scope.industryinfo.users_id=$localStorage.ses_userdata.users_id;
		//$scope.levelList = [{"level_id":"1","level_name":"Junior"},{"level_id":"2","level_name":"Midlevel"},{"level_id":"3","level_name":"Senior"},{"level_id":"4","level_name":"Executive"}];
		

		$scope.levelList=[];	
		var fetch_seniority = function (data) {
			$scope.levelList = data;
			//alert(JSON.stringify($scope.levelList));
		};	
		fetchrecordsCMSService.fetchrecordsCMS('','getseniorityList','').then(fetch_seniority, errorDetails);

		$scope.industrylist=[];	
		var fetch_industry = function (data) {
			$scope.industrylist = data;
			//alert(JSON.stringify($scope.industrylist));
		};	
		fetchrecordsCMSService.fetchrecordsCMS('','getIndustrydata',$localStorage.ses_userdata.users_id).then(fetch_industry, errorDetails); 

		var addCategory = function (data) {	
			$scope.searchCountries = '';	 
			if(data.status == 1){
				if($scope.industryinfo.action == 'insert'){
					bootbox.alert('Industry inserted successfully !');	
				}else{
					bootbox.alert('Industry updated successfully !');	
				}		 
				resetForm();
				$scope.selection = [];
				$scope.selectionLevel = [];
				$scope.areaList = [];
				$scope.industryForm.$setPristine();				 
				fetchrecordsCMSService.fetchrecordsCMS('','getlistIndustry',$localStorage.ses_userdata.users_id).then(fetch_industrylist, errorDetails);
				fetchrecordsCMSService.fetchrecordsCMS('','getIndustrydata',$localStorage.ses_userdata.users_id).then(fetch_industry, errorDetails); 
			}

		}; 	 

		$scope.addIndustry = function(){
    	//alert(JSON.stringify($scope.selection));
    	if($scope.selection == ''){
    		bootbox.alert('Relevant Titles is required!');
    		return false;
    	}
    	// if($scope.selectionLevel == ''){
    	// 	bootbox.alert('Seniority is required!');
    	// 	return false;
    	// }
    	$scope.industryinfo.area = $scope.selection;
    	$scope.industryinfo.level = $scope.selectionLevel; 
    	$scope.industryinfo.users_id = $localStorage.ses_userdata.users_id; 
    	//alert(JSON.stringify($scope.industryinfo));	 
    	var urlpath = serviceurl + "API/addIndustry/";
    	commonpostService.cmnpost(urlpath,$scope.industryinfo).then(addCategory, errorDetails); 
    };

     var fetch_area = function (data) {		 
    	$scope.areaList =  data;    	 
    	//alert(JSON.stringify($scope.areaList));     	 	 
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

    $scope.toggleSelectionLevel = function toggleSelectionLevel(id) {
      var idx = $scope.selectionLevel.indexOf(id);
      
      // is currently selected
      if (idx > -1) {
        $scope.selectionLevel.splice(idx, 1);
      }      
      // is newly selected
      else {
        $scope.selectionLevel.push(id);
      }
      //alert(JSON.stringify($scope.selectionLevel));     	
    };   

    $scope.getArea =  function(id) {    	 
    	 fetchrecordsCMSService.fetchrecordsCMS('','getAreaList',id).then(fetch_area, errorDetails); 
    };

         
    var fetch_industrylist = function (data) {    	 
    	$scope.industrydata = data;     
		//alert(JSON.stringify($scope.industrydata));	
	};		

	fetchrecordsCMSService.fetchrecordsCMS('','getlistIndustry',$localStorage.ses_userdata.users_id).then(fetch_industrylist, errorDetails);
	$scope.level = {};
	$scope.industrydatalist = [];
	var get_industry = function (data) {    	 
    	$scope.industrydatalist = data;     
		//alert(JSON.stringify($scope.industrydata));	
	};

	var fetch_industryinfo = function (data) {   	 	  	
		 $scope.industryinfo  = data[0];
		 fetchrecordsCMSService.fetchrecordsCMS('','getAreaList',$scope.industryinfo.industry_id).then(fetch_area, errorDetails); 	
		 //alert(JSON.stringify($scope.industryinfo));	
		 fetchrecordsCMSService.fetchrecordsCMS('','getIndustryList',$localStorage.ses_userdata.users_id).then(get_industry, errorDetails); 
		 $scope.level = [];
		 angular.forEach($scope.industryinfo.level, function(value, key) {
		 	if(value != ''){
		 	    $scope.level = $scope.level.concat(value.seniority_id);		 		 
		 	}
		 });
		 $scope.selectionLevel = $scope.level;	 	  
		 
		 $scope.area = [];
		 angular.forEach($scope.industryinfo.area, function(value, key) {
		 	if(value != ''){
		 	    $scope.area = $scope.area.concat(value.area_id);		 		 
		 	}
		 });
		 $scope.selection = $scope.area;
 		 //alert(JSON.stringify($scope.industryinfo));		 
		 $scope.industryinfo.action='update';
		    	 
	};		

	$scope.editIndustry = function(id){		 
		fetchrecordsCMSService.fetchrecordsCMS('','getindustryinfoData',id).then(fetch_industryinfo, errorDetails);
	}; 

	var industry_remove = function (data) {    	 
		if(data.status=='1'){
			resetForm();			 
			fetchrecordsCMSService.fetchrecordsCMS('','getlistIndustry',$localStorage.ses_userdata.users_id).then(fetch_industrylist, errorDetails);
			fetchrecordsCMSService.fetchrecordsCMS('','getIndustrydata',$localStorage.ses_userdata.users_id).then(fetch_industry, errorDetails); 
		}else{
			bootbox.alert('Error in delete.');
		}
	};


	$scope.removeindustry = function(id){ 	 
		var urlpath = serviceurl + "API/deleteindustry";	 
		var info = {id:id};
		//alert(info);
		commonpostService.cmnpost(urlpath,info).then(industry_remove, errorDetails);
	};

})
})();
