(function () {
		'use strict';
		app.controller('TitleHeleController', function ($scope,$localStorage,$location,fetchrecordsCMSService,fetchTitleUserService,$filter,$timeout) { 
		
		$scope.category_type = 'titles';
		$scope.titlesheld =[];
		
		var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		};
		
		var fetch_added_title_user = function (data) { 			
			$scope.titlesheld = data;
			//alert(JSON.stringify($scope.titlesheld));
		};		
		
		/* SERCH FROM ARRAY WNEN TYPE*/		
		$scope.searchFromMaster = function(typedthings){
			//alert(typedthings);			
			$scope.searchResult = $filter('filter')($scope.all_master_title_data, typedthings);					 
			  if(typedthings.length === 0){
				  $scope.showLoader = false;				  
			  } 		
		 }		   
		   
		$scope.doFocus = function(){			
			setTimeout(function(){
				document.querySelector('#autoCompleteId').focus();
			},0);			  
		}
		   
		   
		/* FETCH MASTER DATAS AND SET IN ARRAY */
		var fetch_title_master = function (data) {
					$scope.all_master_title_data = [];					
					angular.forEach(data, function(value, key) {						
						$scope.all_master_title_data.push(value.type_name);
					});
					 
		};		
		
		$('#mydiv').show();	  
		fetchTitleUserService.fetchAllMasterUser({catagory_type_id:$scope.category_type}).then(fetch_title_master, errorDetails);	
		/* END END ---- FETCH MASTER DATAS AND SET IN ARRAY */		   
		
		/* FETCH TITLE WORK FOR USER*/		
		function fetch_users_title_work(){
			fetchTitleUserService.fetchTitleWorkUser({user_id:$localStorage.ses_userdata.users_id, catagory_type_id:$scope.category_type, random_t:new Date().getTime()}).then(fetch_added_title_user, errorDetails);
		}		
		fetch_users_title_work();		
		/* DELETE TITLE WORK FOR USER*/
		
		$scope.delete_title_user = function delete_title_user(id,checkStatus) {		
			bootbox.confirm("Are you sure to delete this?", function(result){
				if(result){				
					$('#mydiv').show();
					fetchTitleUserService.deleteTitleUser({user_title_id:id}).then(
						$timeout(function() { fetch_users_title_work();}, 500),						
						errorDetails
					);	  
				}
			})
		};	
		
		/* INSERT TITLE WORK FOR USER*/		
		var check_duplicate_insert = function (data) {     	
			if(data.status == "Duplicate")
			{				
				bootbox.alert("Duplicate entry. Already Added");				
			}
		};		
		
		$scope.insertDataUser = function(){			
			$('#mydiv').show();
			console.log($scope.result_wirtten);
			  $scope.showLoader = true;
			  if($scope.result_wirtten !== undefined && $scope.result_wirtten !== "" ){
				fetchTitleUserService.addOneTitleUser( {title:$scope.result_wirtten, user_id:$localStorage.ses_userdata.users_id, catagory_type_id:$scope.category_type, random_t:new Date().getTime() } ).then(
				check_duplicate_insert, 
				$timeout(function() { fetch_users_title_work();}, 500),				
				errorDetails);
			  }
			  else{ 
			  bootbox.alert("Blank entry. Can not Added");
			  $('#mydiv').hide();
			   }
			$scope.result_wirtten = "";			
		}

	$scope.companyList = {};	
	var fetch_company = function (data) {
		$scope.companyList = data;
		//alert(JSON.stringify($scope.companyList));	
	};
	
	fetchrecordsCMSService.fetchrecordsCMS('','getCompanyList','').then(fetch_company, errorDetails);	

})
})();
