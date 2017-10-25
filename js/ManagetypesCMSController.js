(function () {
    'use strict';
    app.controller('ManagetypesCMSController', function ($scope,$state,$localStorage,$location,$filter,$document,fetchrecordsCMSService,fetchCMSService,fetchsingleCMSService,addeditCMSService) { 
   
    $scope.userInfo = {};  
 
    if(parseInt($localStorage.ses_userdata.users_type) != 3){     
      $state.go("404");   
    }
    $scope.typecategory = {};
    $scope.sortingOrder = 'type_id';
    $scope.reverse = true;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.typecategoriesList = [];
	$scope.typecategories = [];

	var typeCategory = {id:'', name:'', typecategory: '',description:'', status: '', cmsAction: 'Insert'};

	var fetch_category = function (data) {
		$scope.typecategories = data;
		//alert(JSON.stringify($scope.typecategories));	
	};
	
    fetchrecordsCMSService.fetchrecordsCMS('','getCategoryList','').then(fetch_category, errorDetails); 

    var errorDetails = function (serviceResp) {
	     $scope.Error = "Something went wrong ??";
    };
  
    var fetchTypeCategories = function (data) {
    	$scope.typecategoriesList = data;
        	
    };   
    
   	fetchCMSService.fetchrecordsCMS().then(fetchTypeCategories,errorDetails);

   	var fetchTypeCategory = function (data) {
   		
   		typeCategory.id = data[0].type_id;
   		$scope.typecategory.name = data[0].type_name;
        $scope.typecategory.description = data[0].description;
		$scope.typecategory.selectedtypecategory = data[0].type_category;
		$scope.typecategory.selectedstatus = data[0].type_status;
		$('#mydiv').hide(); 
    }; 

   	$scope.editTypeCategory = function(typeID){
   		$('#mydiv').show(); 
         typeCategory.cmsAction = "Edit";
         
         fetchsingleCMSService.fetchsinglerecordCMS(typeID).then(fetchTypeCategory,errorDetails);
         var someElement = angular.element(document.getElementById('typectgryfrmid'));
         $document.scrollToElementAnimated(someElement);
   	};

    var userUpdateSuccess = function (data) {
	    	//var str = data.replace(/"/g,"");
    	  if(data.message == undefined && data > 0){
    	  	
		   	   if(typeCategory.cmsAction === "Insert"){
		   	   	bootbox.alert("Type Category inserted successfully!");
		   	   	 
		   	   } else if(typeCategory.cmsAction == "Edit"){
		   	   
		   	   	bootbox.alert("Type Category updated successfully!");
                 
		   	   }
			    $scope.typecategory.name = '';
				$scope.typecategory.selectedtypecategory = '';
				$scope.typecategory.selectedstatus = '';
                $scope.typecategory.description = '';
				typeCategory.id = '';
				typeCategory.name = '';
                typeCategory.description = '';
				typeCategory.typecategory = '';
				typeCategory.status = '';
				typeCategory.cmsAction = 'Insert';
				$scope.typecategorycmsForm.$setPristine();
			   	fetchCMSService.fetchrecordsCMS().then(fetchTypeCategories,errorDetails);
	       } else {
	       	bootbox.alert(data.message);
		       //alert(data.message);
		   }		   
	};


    $scope.submitForm = function(typecategoryFrm){
    	
    	typecategoryFrm.$invalid = "true";
    	var cmsURL = "";
    	typeCategory.name = $scope.typecategory.name;
        typeCategory.description = $scope.typecategory.description;
    	typeCategory.typecategory = $scope.typecategory.selectedtypecategory;
    	if($scope.typecategory.selectedstatus !== undefined && $scope.typecategory.selectedstatus.length > 0){
    		typeCategory.status = $scope.typecategory.selectedstatus;
    	} else {
    		typeCategory.status = '0';
    	}
		
    	if(typeCategory.cmsAction === "Insert" || typeCategory.cmsAction === "Edit"){  //Insert
    	  if(typeCategory.cmsAction === "Insert" && typeCategory.status === '1'){
    	  	//alert("Inactive type category cannot be inserted!");
    	  	bootbox.alert("Inactive type category cannot be inserted!");
    	  }	else {
    		addeditCMSService.addeditrecordCMS(typeCategory).then(userUpdateSuccess, errorDetails);
    	  }
    	} 
    	
    };

  
})
})();
