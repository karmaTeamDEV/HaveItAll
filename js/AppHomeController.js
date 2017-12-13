/* ==========================================================================
Author: BAMADEB UPADHYAYA
Create date:  05/10/2017
Description:  home js page
============================================================================= */
(function () {
    'use strict';
    app.controller('AppHomeController', function ($scope,$window,$uibModal,$state,loginService,$localStorage,$location,$document, commonpostService) { 
   
    //alert($scope.userInfo);
    	var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		 };

		  // var modalInstance = $uibModal.open({
	      //           controller: 'PopupCont',
	      //           templateUrl: 'templates/profilemodal.html',
	      //       });
	      /* This JS is for demonstration purpose */
 


    	 $scope.percentage = '';
         var fetch_profile_percentage = function (data) {    
         	$scope.percentage = data.percentage;
         	//alert($scope.percentage);
          if(data.percentage != 100){
            bootbox.confirm({
                size: 'small',
              //  message: '<p class="text-center" style="color:blue;"><b>'+data.percentage+'%</b> completed, update your skills to get relevant job alerts.</p>',
                message: '<p class="text-center" style="color:blue;">Complete your profile.</p>',
                buttons: {
                    confirm: {
                        label: 'Skip',
                        className: "btn-primary pull-right"
                         
                    },
                    cancel: {
                        label: 'Yes',
                        className: "btn-danger pull-left"
                         
                    }
                }, 
                callback: function (result) {
                    //alert(result);
                    if(result == false){                        
                      $window.location.href = "#!/user/profile//";
                    }
                },
                closeButton: false
            });
          }  
         };

   var url = serviceurl + "API/get_profile_percentage/";
   var object = {user_id:$localStorage.ses_userdata.users_id}
   commonpostService.cmnpost(url,object).then(fetch_profile_percentage, errorDetails);   
     
     $scope.viewed_user_count = '';
     var get_viewed_user_count = function (data) {    
     	//alert(data);
     	$scope.viewed_by_recruiter_percentage = data.viewed_by_recruiter_percentage;
     	$scope.viewed_by_recruiter = data.viewed_by_recruiter;
     	//alert($scope.viewed_by_recruiter);
     	if($scope.viewed_by_recruiter ==null){
     		$scope.viewed_by_recruiter = '0';
     	}
     	$scope.total_matched = data.total_matched;
     	
     	$scope.USER_VIEW_CNT = data.USER_VIEW_CNT;
     	$scope.USER_SAVE_CNT = data.USER_SAVE_CNT;
     };
   var url = serviceurl + "API_following/viewed_usercount/";
   var object = {user_id:$localStorage.ses_userdata.users_id}
   commonpostService.cmnpost(url,object).then(get_viewed_user_count, errorDetails);

    
     var get_applied_user_count = function (data) {    
     	//alert(data.count);
     	//$scope.applied_percentage = data.count;
     	//$scope.total_jobs = data.totalJob;
     	$scope.applied_jobs = data.applied_jobs;
     };
   var url = serviceurl + "API_following/applied_usercount/";
   var object = {user_id:$localStorage.ses_userdata.users_id}
   commonpostService.cmnpost(url,object).then(get_applied_user_count, errorDetails);    


			 $scope.go_to_following = function (tab_to_view) {
 
			 	$localStorage.tab_to_view = tab_to_view;
			 	$state.go("user.followingcompany"); 

			};

			var fetch_not_viewed_company_for_user = function (data) {
				$scope.not_viewed_company_for_user_list = data;
				//console.log($scope.companyList);	

			};


		 function fetch_user_not_viewed_company() {
			var url_path = serviceurl + "API_following/suggeted_company_for_user/" ;
			var parameter = {user_id: $localStorage.ses_userdata.users_id, view_status: 'NO'};
			commonpostService.cmnpost( url_path, parameter).then(fetch_not_viewed_company_for_user, errorDetails);
		 }
		 fetch_user_not_viewed_company();




		 $scope.go_to_not_viewed_jobs = function (tab_to_view) {
		 	//alert(tab_to_view);
		 	$localStorage.tab_to_view = tab_to_view;
		 	$state.go("user.jobmatch"); 

		};


		var set_not_viewed_jobs_for_user = function (data) {
			$scope.not_viewed_jobs_for_user_list = data;
			//console.log($scope.companyList);	

		};


		 function fetch_user_not_viewed_jobs() {
			var url_path = serviceurl + "API_job/match_jobs_for_user/" ;
			var parameter = {user_id: $localStorage.ses_userdata.users_id, match_jobs_for_user: 'NO'};
			commonpostService.cmnpost( url_path, parameter).then(set_not_viewed_jobs_for_user, errorDetails);
		 }
		 fetch_user_not_viewed_jobs();


			var fetch_company_follow_user = function (data) {
				$scope.company_following_user_list = data;
				//console.log($scope.companyList);	
			};
			var url_path = serviceurl + "API_following/user_following_company/" ;
			var parameter = {user_id:$localStorage.ses_userdata.users_id, following_type:'company'};
		 	commonpostService.cmnpost( url_path, parameter).then(fetch_company_follow_user, errorDetails);



			var set_user_saved_job = function (data) {
				$scope.saved_job_for_user_list = data;
				//console.log($scope.companyList);	

			};
			 function fetch_user_saved_job() {
				var url_path = serviceurl + "API_job/user_saved_jobs/" ;
				var parameter = {user_id: $localStorage.ses_userdata.users_id, saving_type: 'user'};
				commonpostService.cmnpost( url_path, parameter).then(set_user_saved_job, errorDetails);
			 }
			 fetch_user_saved_job();

			$scope.applied_percentage = '';
			var fetch_matching_jobs_for_user = function (data) {
				$scope.matching_jobs_for_user_list = data;
				 
				$scope.totalrecommended_jobs = (parseInt($scope.matching_jobs_for_user_list.length)+parseInt($scope.USER_SAVE_CNT)+parseInt($scope.applied_jobs));
				$scope.applied_percentage = Math.round((parseInt($scope.applied_jobs)/$scope.totalrecommended_jobs)*100);
				 
				//alert(isNaN($scope.applied_percentage));
				 if(isNaN($scope.applied_percentage) ==true){
				 	$scope.applied_percentage ='0';
				 }
				
			};
			 function fetch_user_matching_job() {
				var url_path = serviceurl + "API_job/match_jobs_for_user/" ;
				var parameter = {user_id:$localStorage.ses_userdata.users_id, following_type:'YES'};
				commonpostService.cmnpost( url_path, parameter).then(fetch_matching_jobs_for_user, errorDetails);
			 }
			fetch_user_matching_job();

		
		var fetch_matching_jobs_for_user_unfollow = function (data) {
			$scope.matching_jobs_for_user_unfollow_list = data;
			//console.log($scope.companyList);	
		};
		 function fetch_user_matching_job_unfollow() {
			var url_path = serviceurl + "API_job/match_jobs_for_user/" ;
			var parameter = {user_id:$localStorage.ses_userdata.users_id, following_type:'NO'};
			commonpostService.cmnpost( url_path, parameter).then(fetch_matching_jobs_for_user_unfollow, errorDetails);
		 }

		 fetch_user_matching_job_unfollow();


})
})();
