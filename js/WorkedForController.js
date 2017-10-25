(function () {
		'use strict';
		app.controller('WorkedForController', function ($scope,$localStorage,$location,fetchTitleUserService,$filter,$timeout) { 
		
		$scope.category_type = 'worked_for';
		$scope.titlesheld =[];
		
		var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		};
		
		var fetch_added_title_user = function (data) {     	
			//alert(data);
			//console.log(data);
			$scope.titlesheld = data;
			//alert(JSON.stringify($scope.titlesheld));
		};
		
		
		/* SERCH FROM ARRAY WNEN TYPE*/
		
		$scope.searchFromMaster = function(typedthings){
			//alert(typedthings);
			
			$scope.searchResult = $filter('filter')($scope.all_master_title_data, typedthings);
			//console.log($scope.searchResult);
			 
			  if(typedthings.length === 0){
				  $scope.showLoader = false;
				  //resetForm();
			  } 
		
		 }
		   
		   
		$scope.doFocus = function(){
			//alert('ELSECOMPANY'+ $scope.result.length);
			//  $scope.showLoader = true;
				setTimeout(function(){
					document.querySelector('#autoCompleteId').focus();
				},0);
			  
		}
		   
		   
		/* FETCH MASTER DATAS AND SET IN ARRAY */
		var fetch_title_master = function (data) {
					$scope.all_master_title_data = [];
					//$scope.titlesheld = data;
					angular.forEach(data, function(value, key) {
						//console.log(value);
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
		//alert(id);
			bootbox.confirm("Are you sure to delete this?", function(result){
				if(result){  
				//alert(result);
					$('#mydiv').show();
					fetchTitleUserService.deleteTitleUser({user_title_id:id}).then(
						$timeout(function() { fetch_users_title_work();}, 500),
						//fetch_users_title_work(),
						errorDetails
					);	  
				}
			})
		};	
		
		/* INSERT TITLE WORK FOR USER*/
		
		var check_duplicate_insert = function (data) {     	
			if(data.status == "Duplicate")
			{
				//alert("Duplicate entry. Already Added");
				bootbox.alert("Duplicate entry. Already Added");
/*				$ngBootbox.alert('Duplicate entry. Already Added')
				.then(function() {
					$scope.result_wirtten = "";
				});
*/				
			}
		};
		
		
		
		
		$scope.insertDataUser = function(){
			//alert('ELSECOMPANY  --  '+ $scope.result_wirtten.length);
			$('#mydiv').show();
			console.log($scope.result_wirtten);
			  $scope.showLoader = true;
			  if($scope.result_wirtten !== undefined && $scope.result_wirtten !== "" ){
				fetchTitleUserService.addOneTitleUser( {title:$scope.result_wirtten, user_id:$localStorage.ses_userdata.users_id, catagory_type_id:$scope.category_type, random_t:new Date().getTime() } ).then(
				check_duplicate_insert, 
				$timeout(function() { fetch_users_title_work();}, 500),
				//fetch_users_title_work(), 
				errorDetails);
			  }
			  else{ 
			  bootbox.alert("Blank entry. Can not Added");
/*			  $ngBootbox.alert('Blank entry. Can not Added')
				.then(function() {
					$scope.result_wirtten = "";
				});
*/			  $('#mydiv').hide();
			   }
			$scope.result_wirtten = "";
			
		}
		
		

})
})();
