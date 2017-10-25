  
	app.controller('categoryController', function ($scope,$state,$localStorage,commonpostService,fetchrecordsCMSService,getfitService) {   

	var errorDetails = function (serviceResp) {		 
		$scope.Error = "Something went wrong ??";
	};	
			
	function resetForm(){		 

		$scope.singletitle = {};
		$scope.singletitle.titles = {};
		$scope.singletitle.action = 'insert';             
	}	 

	$scope.companylist=[];	
	$scope.singletitle = {};
	$scope.singletitle.action='insert';
	$scope.singletitle.users_id=$localStorage.ses_userdata.users_id;
	$scope.yearlistFrom = [2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005];	 
	var toYearsList = ['Present',2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005];
	$scope.singletitle.titles = [];	 
	$scope.yearlistTo = [];

	var fetch_company = function (data) {
		//$scope.companylist = data;	
		//alert(JSON.stringify($scope.companylist));
		angular.forEach(data, function(value, key) {			
          $scope.companylist.push(value.company_name);
        });	
	};

	fetchrecordsCMSService.fetchrecordsCMS('','getCompanyList','').then(fetch_company, errorDetails);

	$scope.resetToYears = function(selectedFromYear){
		$scope.yearlistTo = toYearsList;
		$scope.yearlistTo = $scope.yearlistTo.slice(0,toYearsList.indexOf(selectedFromYear));
	} 
	
	var addCategory = function (data) {	
		 
		if(data.status == 1){
			if($scope.singletitle.action == 'insert'){
				bootbox.alert('Employment history inserted successfully !');	
			}else{
				bootbox.alert('Employment history updated successfully !');	
			}
		
		//$state.go("user.profile");
		resetForm();
		$scope.titleForm.$setPristine();
		fetchrecordsCMSService.fetchrecordsCMS('','getCompanyList','').then(fetch_company, errorDetails);
		fetchrecordsCMSService.fetchrecordsCMS('','gettitleData',$localStorage.ses_userdata.users_id).then(fetch_title, errorDetails);	
		}else{
			bootbox.alert('Error!');
		}
	}; 	 

	$scope.addDesignation = function(){	       

    	if($scope.singletitle.titles.length > 0){
    		//alert(JSON.stringify($scope.singletitle));     		 
    		$scope.singletitle.users_id = $localStorage.ses_userdata.users_id; 	 
    		var urlpath = serviceurl + "API/addTitles/";
    		commonpostService.cmnpost(urlpath,$scope.singletitle).then(addCategory, errorDetails);
    	}else if($scope.singletitle.other_title_text){
    		//alert(JSON.stringify($scope.singletitle.other_title_text));  
    		$scope.singletitle.users_id = $localStorage.ses_userdata.users_id; 	 
    		var urlpath = serviceurl + "API/addTitles/";
    		commonpostService.cmnpost(urlpath,$scope.singletitle).then(addCategory, errorDetails);
    	}else{
    		bootbox.alert('Titles is required!');
    	}

    	 
    };

    //$localStorage.optionlist = [];
    var check_Titles = function (data) {		 
    	//$scope.titlesList =  data;	
     	
    	$localStorage.optionlist = data.map(function(item){			
          return {
            text: item.type_name,            
            id: item.type_id
          };
        });
    	//alert(JSON.stringify($localStorage.optionlist)); 	 
    };	
    getfitService.fetchfit('titles').then(check_Titles, errorDetails); 

    $scope.titlelist  = [];    
    var fetch_title = function (data) {   
    	//alert(1); 	 
    	$scope.titleData = data;  
		//alert(JSON.stringify($scope.titleData));	
	};		

	fetchrecordsCMSService.fetchrecordsCMS('','gettitleData',$localStorage.ses_userdata.users_id).then(fetch_title, errorDetails);

	var fetch_singleTitle = function (data) {    	
		$scope.singletitle  = data[0];
		//alert(JSON.stringify($scope.singletitle));  
		$scope.singletitle.action='update';
		if($scope.singletitle.end_year != 'Present'){
			$scope.singletitle.end_year = parseInt($scope.singletitle.end_year);
		}
		if($scope.singletitle.start_year){
			$scope.singletitle.start_year = parseInt($scope.singletitle.start_year);			 
		}
		$scope.titles = [];
		 angular.forEach($scope.singletitle.titles, function(value, key) {		 	 	 
		 		$scope.titles.push({id:parseInt(value.type_id),text:value.type_name});		  
		 });
		 $scope.singletitle.titles = $scope.titles;	
		 $scope.singletitle.company_id = data[0].company_name;	

		$scope.yearlistTo = ['Present',2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005]; 
		   
		//alert(JSON.stringify($scope.singletitle.titles));  
		// angular.forEach($scope.singletitle.titles, function(value, key) {		 	
		// 	angular.forEach($scope.titlesList, function(value1, key1) {				  
		// 		if (value1.type_id === value.type_id) {		               
		// 			value1.ticked = true;
		// 		}
		// 	});
		// });	

    	//alert(JSON.stringify($scope.singletitle));
    };		

    $scope.editTitle = function(id){

    	fetchrecordsCMSService.fetchrecordsCMS('','getsingletitleData',id).then(fetch_singleTitle, errorDetails);
    }; 

    var title_remove = function (data) {    	 
    	if(data.status=='1'){
    		fetchrecordsCMSService.fetchrecordsCMS('','gettitleData',$localStorage.ses_userdata.users_id).then(fetch_title, errorDetails);
    	}else{
    		bootbox.alert('Error in delete.');
    	}
    };
    
    
    $scope.removetitle = function(id){    	 
    	var urlpath = serviceurl + "API/deletetitle";	 
    	var info = {id:id};
    	//alert(JSON.stringify(info));
    	commonpostService.cmnpost(urlpath,info).then(title_remove, errorDetails);
    };

    //$scope.singletitle.titles = [{"id": 106,"text":'ABC'},{"id": 107,"text":'ABC1'}];

   $scope.searchFromMaster = function(typedthings){
      //alert(typedthings);     
      $scope.searchResult = $filter('filter')($scope.companylist, typedthings);          
        if(typedthings.length === 0){
          $scope.showLoader = false;          
        }     
      } 		 

})

