(function () {  
    'use strict';
 //    app.filter('reverse', function() {
	//   return function(items) {
	//     return items.slice().reverse();
	//   };
	// });
    app.controller('userJobMatchController', function ($scope,$window,$http,$localStorage,$location, $timeout, $state, fetchrecordsCMSService,updateProfileService,removeImageService,getMatercmsService,getProfileService,commonpostService) { 
  		
    

		 var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		 };

		 

		 	$scope.companyList = {};
		 	$scope.show_tab =$localStorage.tab_to_view;
		 	//alert($scope.show_tab);

			 $scope.click_on_tab = function (tab_id, divid) {
				//$timeout( alert(1) ,);

				$timeout(function() { $( "#"+tab_id ).addClass('active'); $( "#"+divid ).addClass('in active');  },  1000);

			};

			 $scope.delete_following_company_for_user = function (del_id) {

				//alert(del_id);

				var url_path = serviceurl + "API_job/delete_user_following_company/" ;
				var parameter = {del_id: del_id};
				commonpostService.cmnpost( url_path, parameter).then(after_delete_follow_company_of_user, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_delete_follow_company_of_user = function (data) {
				//console.log(data.del_id);	
				$("#following_company_id"+data.del_id).remove();
				fetch_user_suggested_company();
				fetch_user_not_viewed_company();
				fetch_user_viewed_company();

			};

			 $scope.view_a_job_for_user = function (job_id,tab) {

				// alert(job_id);
				// alert(tab);
				$localStorage.tab_to_view = tab;
				var url_path = serviceurl + "API_job/insert_view_job_by_user/" ;
				var parameter = { job_id: job_id, user_id: $localStorage.ses_userdata.users_id, viewing_type: 'user' };
				commonpostService.cmnpost( url_path, parameter).then(after_fetch_user_viewed_jobs, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_fetch_user_viewed_jobs = function (data) {
				//console.log(data.del_id);	
				$("#notviewed"+data.job_id).remove();
				fetch_user_viewed_jobs();

				$state.go("user.jobDetails", {job_id:data.job_id}, {reload: true});  


			};

			/* APPLY FOR A JOB FUNCTION*/
			 $scope.apply_for_job_user = function (job_id,job_url) {

				//alert(job_id);

				var url_path = serviceurl + "API_job/apply_job_by_user/" ;
				var parameter = { job_id: job_id, user_id: $localStorage.ses_userdata.users_id, applied_type: 'user',url : job_url};
				commonpostService.cmnpost( url_path, parameter).then(after_apply_for_job_user, errorDetails);
				//console.log($scope.companyList);	
			};   

			var after_apply_for_job_user = function (data) {
				 
				//alert(data.url);
				//console.log(data.del_id);	
				$("#matching"+data.job_id).remove();
				$("#suggested"+data.job_id).remove();
				$("#saved"+data.job_id).remove();
				$("#viewed"+data.job_id).remove();

				fetch_user_applied_jobs();
				if(data.url != ''){
					//$window.open(data.url, '_blank');
				}else{
					//$window.open('#!/user/user-job', '_blank');
				}
				


			};

			/* SAVE A JOB FUNCTION */
			 $scope.save_a_job_for_user = function (job_id) {

				alert(job_id);

				var url_path = serviceurl + "API_job/insert_save_job_by_user/" ;
				var parameter = { job_id: job_id, user_id: $localStorage.ses_userdata.users_id, saving_type: 'user' };
				commonpostService.cmnpost( url_path, parameter).then(after_save_a_job_for_user, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_save_a_job_for_user = function (data) {
				//console.log(data.del_id);	
				$("#matching"+data.job_id).remove();
				//$("#saved"+data.job_id).remove();
				$("#viewed"+data.job_id).remove();

				fetch_user_saved_job();


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


			/* ON PAGE LOAD CALLBACK FUNCTIONS*/	

			var set_user_applied_jobs = function (data) {
				$scope.user_applied_jobs_list = data;
				//console.log($scope.companyList);	

				angular.forEach($scope.user_applied_jobs_list, function(value, key) {
				  // alert(image_url+$scope.matching_jobs_for_user_list[key].company_logo);	 	 
		 	 	   var result = doesFileExist(image_url+$scope.user_applied_jobs_list[key].company_logo); 
					if (result == true) {
					    //alert('exists');
					    $scope.user_applied_jobs_list[key].picture = $scope.user_applied_jobs_list[key].company_logo;
					} else {
					   //alert('Not exists');
					   $scope.user_applied_jobs_list[key].picture = 'no_company_logo.png';
					}				 	 		 
				    		 				    	 	
				});
			};


			var fetch_matching_jobs_for_user = function (data) {
				$scope.matching_jobs_for_user_list = data;			 
				//console.log(JSON.stringify($scope.matching_jobs_for_user_list));

				angular.forEach($scope.matching_jobs_for_user_list, function(value, key) {
				  // alert(image_url+$scope.matching_jobs_for_user_list[key].company_logo);	 	 
		 	 	   var result = doesFileExist(image_url+$scope.matching_jobs_for_user_list[key].company_logo); 
					if (result == true) {
					    //alert('exists');
					    $scope.matching_jobs_for_user_list[key].picture = $scope.matching_jobs_for_user_list[key].company_logo;
					} else {
					   //alert('Not exists');
					   $scope.matching_jobs_for_user_list[key].picture = 'no_company_logo.png';
					}				 	 		 
				    		 				    	 	
				});


			};

			var fetch_matching_jobs_for_user_unfollow = function (data) {
				$scope.matching_jobs_for_user_unfollow_list = data;
				//console.log($scope.matching_jobs_for_user_unfollow_list);	

				angular.forEach($scope.matching_jobs_for_user_unfollow_list, function(value, key) {
				  // alert(image_url+$scope.matching_jobs_for_user_list[key].company_logo);	 	 
		 	 	   var result = doesFileExist(image_url+$scope.matching_jobs_for_user_unfollow_list[key].company_logo); 
					if (result == true) {
					    //alert('exists');
					    $scope.matching_jobs_for_user_unfollow_list[key].picture = $scope.matching_jobs_for_user_unfollow_list[key].company_logo;
					} else {
					   //alert('Not exists');
					   $scope.matching_jobs_for_user_unfollow_list[key].picture = 'no_company_logo.png';
					}				 	 		 
				    		 				    	 	
				});

			};

			var set_user_saved_job = function (data) {
				$scope.saved_job_for_user_list = data;
				//console.log($scope.saved_job_for_user_list);	

				angular.forEach($scope.saved_job_for_user_list, function(value, key) {
				  // alert(image_url+$scope.matching_jobs_for_user_list[key].company_logo);	 	 
		 	 	   var result = doesFileExist(image_url+$scope.saved_job_for_user_list[key].company_logo); 
					if (result == true) {
					    //alert('exists');
					    $scope.saved_job_for_user_list[key].picture = $scope.saved_job_for_user_list[key].company_logo;
					} else {
					   //alert('Not exists');
					   $scope.saved_job_for_user_list[key].picture = 'no_company_logo.png';
					}				 	 		 
				    		 				    	 	
				});

			};

			var set_viewed_jobs_for_user = function (data) {
				$scope.viewed_jobs_for_user_list = data;
				//console.log($scope.companyList);	
			};

		/* ON PAGE LOAD FUNCTIONS*/	
		function fetch_user_applied_jobs() {
			//alert($localStorage.ses_userdata.users_id);
			var url_path = serviceurl + "API_job/user_applied_jobs/" ;
			var parameter = {user_id:$localStorage.ses_userdata.users_id, applied_type:'user'};
			commonpostService.cmnpost( url_path, parameter).then(set_user_applied_jobs, errorDetails);
		}

		fetch_user_applied_jobs();




		 function fetch_user_matching_job() {
			var url_path = serviceurl + "API_job/match_jobs_for_user/" ;
			var parameter = {user_id:$localStorage.ses_userdata.users_id, following_type:'YES'};
			commonpostService.cmnpost( url_path, parameter).then(fetch_matching_jobs_for_user, errorDetails);
		 }

		 fetch_user_matching_job();

		 function fetch_user_matching_job_unfollow() {
			var url_path = serviceurl + "API_job/match_jobs_for_user/" ;
			var parameter = {user_id:$localStorage.ses_userdata.users_id, following_type:'NO'};
			commonpostService.cmnpost( url_path, parameter).then(fetch_matching_jobs_for_user_unfollow, errorDetails);
		 }

		 fetch_user_matching_job_unfollow();


		 function fetch_user_saved_job() {
			var url_path = serviceurl + "API_job/user_saved_jobs/" ;
			var parameter = {user_id: $localStorage.ses_userdata.users_id, saving_type: 'user'};
			commonpostService.cmnpost( url_path, parameter).then(set_user_saved_job, errorDetails);
		 }
		 fetch_user_saved_job();


		 function fetch_user_viewed_jobs() {
			var url_path = serviceurl + "API_job/user_viewed_jobs/" ;
			var parameter = {user_id:$localStorage.ses_userdata.users_id, viewing_type:'user'};
			commonpostService.cmnpost( url_path, parameter).then(set_viewed_jobs_for_user, errorDetails);
		 }
		 fetch_user_viewed_jobs();



			var after_follow_company_for_user = function (data) {
				//console.log(data.del_id);	
				
				//fetch_user_matching_job();


			};


			 $scope.follow_a_company_for_user = function (company_id) {

				//alert(company_id);

				var url_path = serviceurl + "API_following/follow_company_by_user/" ;
				var parameter = { company_id: company_id, user_id: $localStorage.ses_userdata.users_id, following_type: 'user' };
				commonpostService.cmnpost( url_path, parameter).then(after_follow_company_for_user, errorDetails);
				//console.log($scope.companyList);	
			};

			 
		 

})
})();
