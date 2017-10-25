(function () {
	'use strict';
	app.controller('locationController', function ($mdDialog,$window,$scope,$state,$localStorage,commonpostService,fetchrecordsCMSService,getfitService,getMatercmsService) {   

		var errorDetails = function (serviceResp) {		 
			$scope.Error = "Something went wrong ??";
		};		 
		
		$scope.locationInfo = {};
		$scope.locationInfo.country_id ='';
		$scope.locationInfo.state_id = '';
		$scope.locationInfo.city_id	= '';
		$scope.cityinfo = 0;	 
		$scope.locationInfo.users_id=$localStorage.ses_userdata.users_id;		 

		// Country list 
	  	$scope.countries=[];
		var get_countrylist = function (data) { 	     	 
	     	$scope.countries =data;     	
	     };
	    getMatercmsService.getListinfo('country','').then(get_countrylist, errorDetails);

	    // State list 
	    $scope.states =[];
		var get_statelist = function (data) { 		     	
	     	$scope.states =data;
	     	//alert(JSON.stringify($scope.states));	     	 
	     	$scope.cities =[];
	    };

	    $scope.statelistlebel = function(id){
	    	getMatercmsService.getListinfo('state',id).then(get_statelist, errorDetails); 
	    };

	    $scope.citylistlebel = function(id){
	    	getMatercmsService.getListinfo('city',id).then(get_citylist, errorDetails); 
	    };

	     var location_add = function (data) {
	     	//alert(data.rel_id);
    		$scope.locationInfo.relation_id = data.rel_id;
    		getMatercmsService.getListinfo('state',$scope.locationInfo.country_id).then(get_statelist, errorDetails); 
	    	fetchrecordsCMSService.fetchrecordsCMS('','getlocationdata',$scope.locationInfo.users_id).then(get_datalist, errorDetails); 
	     };

	     var delete_record = function (data) {
	     	//alert(JSON.stringify($scope.locationInfo));	
	     	var urlpath = serviceurl + "API/addLocation/";
	    	commonpostService.cmnpost(urlpath,$scope.locationInfo).then(location_add, errorDetails); 
	     };

	    var addLocation = function (data) {
	    	//alert(JSON.stringify(data));	 
	    	if(data.status == 2){
	    		bootbox.confirm("Are you sure you want to update this country!", function(result){
	    			if(result == true){
	    				//alert(JSON.stringify($scope.locationInfo));	
	    				var urlpath = serviceurl + "API/deleteCountry/";
	    				commonpostService.cmnpost(urlpath,$scope.locationInfo).then(delete_record, errorDetails);	    				
	    			} 		    		 
		    	});
	    	}else{
	    		if($scope.locationInfo.country_checked == true){
	    			//alert(data.rel_id);
	    		$scope.locationInfo.relation_id = data.rel_id;
    			getMatercmsService.getListinfo('state',$scope.locationInfo.country_id).then(get_statelist, errorDetails); 	    	 
	    		}else{
		    		$scope.states =[];
		    	} 
	    	} 
	    	  	 		     	 
	     	fetchrecordsCMSService.fetchrecordsCMS('','getlocationdata',$scope.locationInfo.users_id).then(get_datalist, errorDetails);      
	     };

	    $scope.getCountryStates = function(id,status){	    	    	
	    	$scope.locationInfo.country_id = id;
		    $scope.locationInfo.country_checked = status;	    
		    var urlpath = serviceurl + "API/addLocation/";
	    	commonpostService.cmnpost(urlpath,$scope.locationInfo).then(addLocation, errorDetails);     	   
	    }	

	    // City list 
	    $scope.cities =[];
		var get_citylist = function (data) {     	
	     	$scope.cities =data;     	
	    };

	    var fetch_city = function (data) { 
	    	 if($scope.locationInfo.state_checked == true){ 
	    	 	$scope.locationInfo.state_relation_id = data.state_relation_id; 
	    	 	//alert(JSON.stringify($scope.locationInfo));	  	
	     	 	getMatercmsService.getListinfo('city',$scope.locationInfo.state_id).then(get_citylist, errorDetails);
	     	 }else{
	    		$scope.cities =[];
	    	 }	
	    	 fetchrecordsCMSService.fetchrecordsCMS('','getlocationdata',$scope.locationInfo.users_id).then(get_datalist, errorDetails); 
	    };

	    $scope.getStateCities = function(id,status){
	    	if($scope.locationInfo.country_id != ''){
		    	$scope.locationInfo.state_id = id;
			    $scope.locationInfo.state_checked = status;	
			    //alert(JSON.stringify($scope.locationInfo));		 
		    	var urlpath = serviceurl + "API/addlocationState/";
	    		commonpostService.cmnpost(urlpath,$scope.locationInfo).then(fetch_city, errorDetails);
		    }else{
		    	 bootbox.alert('You have to choose country!');					           
		    }
		          	   
	    }

	    var fetch_list = function (data) { 
	    	 	fetchrecordsCMSService.fetchrecordsCMS('','getlocationdata',$scope.locationInfo.users_id).then(get_datalist, errorDetails); 
	    };

	     $scope.getCities = function(id,status){
	     	if($scope.locationInfo.country_id != '' && $scope.locationInfo.state_id != ''){
		     		$scope.locationInfo.city_id = id;
				    $scope.locationInfo.city_checked = status;	
				    //alert(JSON.stringify($scope.locationInfo));
				    var urlpath = serviceurl + "API/addlocationCity/";
	    		 	commonpostService.cmnpost(urlpath,$scope.locationInfo).then(fetch_list, errorDetails);
	     	}else{
	     			bootbox.alert('You have to choose country and state!');	     		  
	     	}  
	     	$scope.searchState = '';   
	     	$scope.searchcity = '';   
	    }
	    
	    $scope.dataList = [];
	    var get_datalist = function (data) {
	    	$scope.dataList = data;
	    	//alert(JSON.stringify($scope.dataList));	
	    	//getMatercmsService.getListinfo('state',$scope.locationInfo[0].rel_country_id).then(get_statelist, errorDetails); 
	    	//getMatercmsService.getListinfo('city',$scope.locationInfo[0].state[0].state_id).then(get_citylist, errorDetails);
	    };
	    fetchrecordsCMSService.fetchrecordsCMS('','getlocationdata',$scope.locationInfo.users_id).then(get_datalist, errorDetails); 
	     var deleteRecord = function (data) {
	     	fetchrecordsCMSService.fetchrecordsCMS('','getlocationdata',$scope.locationInfo.users_id).then(get_datalist, errorDetails); 
	     };

	     $scope.removeRecord = function(id){
	     	var urlpath = serviceurl + "API/deleteCountry/";
	     	$scope.locationInfo.country_id = id;
	     	//alert(JSON.stringify($scope.locationInfo));
	        commonpostService.cmnpost(urlpath,$scope.locationInfo).then(deleteRecord, errorDetails);

	     };

	    
})
})();
