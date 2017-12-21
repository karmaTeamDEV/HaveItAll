﻿(function () {  
    'use strict';
 //    app.filter('reverse', function() {
	//   return function(items) {
	//     return items.slice().reverse();
	//   };
	// });
    app.controller('FollowuserController', function ($scope,$http,$window,$localStorage,$location, $timeout, fetchrecordsCMSService,updateProfileService,removeImageService,getMatercmsService,getProfileService,commonpostService) { 
  		
    

		 var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		 };

		 

		 	$scope.companyList = {};
		 	//$scope.show_tab = 'suggest';
		 	$scope.show_tab = $localStorage.tab_to_view;
		 	//alert($scope.show_tab);

			 $scope.click_on_tab = function (tab_id, divid) {

				$timeout(function() { $( "#"+tab_id ).addClass('active'); $( "#"+divid ).addClass('in active');  },  500);

			};

			 $scope.delete_following_company_for_user = function (del_id) {

				//alert(del_id);

				var url_path = serviceurl + "API_following/delete_user_following_company/" ;
				var parameter = {del_id: del_id};
				commonpostService.cmnpost( url_path, parameter).then(after_delete_follow_company_of_user, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_delete_follow_company_of_user = function (data) {
				//console.log(data.del_id);	
				$("#following_company_id"+data.del_id).remove();
				fetch_user_suggested_company();
				fetch_user_not_viewed_company();
				fetch_user_viewed_by_company();

			};

			 $scope.view_a_user_for_company = function (user_id, from_tab) {

				// alert(user_id);
				 $localStorage.tab_to_view = from_tab;
				// alert($localStorage.tab_to_view);


				var url_path = serviceurl + "API_following/view_a_company_by_user/" ;
				var parameter = { company_id:  $localStorage.ses_userdata.users_companyid, user_id:user_id, viewing_type: 'company' };
				commonpostService.cmnpost( url_path, parameter).then(after_view_a_user_for_company, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_view_a_user_for_company = function (data) {
					
				$("#notviewed"+data.user_id).remove();
				// alert(2);
				fetch_user_viewed_by_company();
				//alert(data.user_id);
				$window.location.href = '#!/user/profile/'+data.user_id+'/'; 
				//$state.go("user.profile/"+data.user_id+"/");

			};


			 $scope.follow_a_user_for_company = function (user_id) {

				//alert(user_id);

				var url_path = serviceurl + "API_following/follow_company_by_user/" ;
				var parameter = { company_id: $localStorage.ses_userdata.users_companyid, user_id: user_id, following_type: 'company' };
				commonpostService.cmnpost( url_path, parameter).then(after_follow_user_for_company, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_follow_user_for_company = function (data) {
				//console.log(data.del_id);	
				$("#suggested"+data.user_id).remove();
				$("#notviewed"+data.user_id).remove();
				$("#viewed"+data.user_id).remove();

				fetch_user_following_by_company();


			};

		function doesFileExist(urlToFile) {
		    var xhr = new XMLHttpRequest();
		    xhr.open('HEAD', urlToFile, false);
		    xhr.send();
		     
		    if (xhr.status == "404") {
		        return false;
		    } else {
		        return true;
		    }
		}

			var fetch_user_follow_company = function (data) {
				$scope.user_following_company_list = data;
				angular.forEach($scope.user_following_company_list, function(value, key) {
				 	 	var get_datal1ist = function (data) {
				 	 	    var result = doesFileExist(image_url+$scope.user_following_company_list[key].users_profilepic); 
							if (result == true) {
							    //alert('exists');
							    $scope.user_following_company_list[key].profileImage = 'upload/'+$scope.user_following_company_list[key].users_profilepic;
							} else {
							   //alert('Not exists');
							   $scope.user_following_company_list[key].profileImage = 'public/images/no-image.png';
							}				 	 		 
				    		$scope.user_following_company_list[key].localationlist = data;				    	 	
				    	};				 	  
				 fetchrecordsCMSService.fetchrecordsCMS('','getlocationdata',value.user_id).then(get_datal1ist, errorDetails); 
				 	   
				 });
				//console.log($scope.user_following_company_list);	
			};

			var fetch_company_follow_user = function (data) {
				$scope.company_following_user_list = data;
				angular.forEach($scope.company_following_user_list, function(value, key) {
				 	 	var get_datal1ist = function (data) {	
				 	 	var result = doesFileExist(image_url+$scope.company_following_user_list[key].users_profilepic); 
							if (result == true) {
							    //alert('exists');
							    $scope.company_following_user_list[key].profileImage = 'upload/'+$scope.company_following_user_list[key].users_profilepic;
							} else {
							   //alert('Not exists');
							   $scope.company_following_user_list[key].profileImage = 'public/images/no-image.png';
							}

				    		$scope.company_following_user_list[key].localationlist = data;				    	 	
				    	};				 	  
				 fetchrecordsCMSService.fetchrecordsCMS('','getlocationdata',value.user_id).then(get_datal1ist, errorDetails); 
				 	   
				 });
				//console.log(JSON.stringify($scope.company_following_user_list));	
			};

			//$scope.suggeted_user_for_company_list.localationlist = [];
		   

			var fetch_user_suggested_for_company = function (data) {
				$scope.suggeted_user_for_company_list = data;
				
				 angular.forEach($scope.suggeted_user_for_company_list, function(value, key) {
				 	 	var get_datal1ist = function (data) {				 	 		 
				    		$scope.suggeted_user_for_company_list[key].localationlist = data;				    	 	
				    	};				 	  
				 fetchrecordsCMSService.fetchrecordsCMS('','getlocationdata',value.users_id).then(get_datal1ist, errorDetails); 
				 	   
				 });
				 //console.log($scope.suggeted_user_for_company_list);	
			};

			var fetch_not_viewed_company_for_user = function (data) {
				$scope.not_viewed_company_for_user_list = data;
				//console.log($scope.companyList);	

			};

			var fetch_viewed_user_for_company = function (data) {
				$scope.viewed_user_for_company_list = data;
				//alert(JSON.stringify($scope.viewed_user_for_company_list));	
			};


		function fetch_user_following_by_company() {
			//alert($localStorage.ses_userdata.users_id);
			var url_path = serviceurl + "API_following/users_following_by_company/" ;
			var parameter = {company_id: $localStorage.ses_userdata.users_companyid, following_type:'company'};
			commonpostService.cmnpost( url_path, parameter).then(fetch_user_follow_company, errorDetails);
		}

		fetch_user_following_by_company();

			var url_path = serviceurl + "API_following/users_following_by_company/" ;
			var parameter = {company_id: $localStorage.ses_userdata.users_companyid, following_type:'user'};
		 	commonpostService.cmnpost( url_path, parameter).then(fetch_company_follow_user, errorDetails);

		 function fetch_user_suggested_company() {
			var url_path = serviceurl + "API_following/suggeted_users_for_company/" ;
			var parameter = {user_id:$localStorage.ses_userdata.users_id, company_id: $localStorage.ses_userdata.users_companyid };
			commonpostService.cmnpost( url_path, parameter).then(fetch_user_suggested_for_company, errorDetails);
		 }
		 fetch_user_suggested_company();

		 function fetch_user_not_viewed_company() {
			var url_path = serviceurl + "API_following/suggeted_users_for_company/" ;
			var parameter = {user_id: $localStorage.ses_userdata.users_id, view_status: 'NO', company_id: $localStorage.ses_userdata.users_companyid };
			commonpostService.cmnpost( url_path, parameter).then(fetch_not_viewed_company_for_user, errorDetails);
		 }
		 fetch_user_not_viewed_company();

		 function fetch_user_viewed_by_company() {
			var url_path = serviceurl + "API_following/user_viewing_by_company/" ;
			var parameter = { company_id: $localStorage.ses_userdata.users_companyid, viewing_type:'company'};
			commonpostService.cmnpost( url_path, parameter).then(fetch_viewed_user_for_company, errorDetails);
		 }
		 fetch_user_viewed_by_company();




})
})();
