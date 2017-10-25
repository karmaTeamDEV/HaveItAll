(function () {
  'use strict';
  app.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });
  app.controller('usersAppliedJobController', function ($scope,$window,$sce,$state,commonpostService,fetchrecordsCMSService,getfitService,$localStorage,$location,$document,$filter,$timeout, $stateParams) { 

  		var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		 };

		 //alert('message?: DOMString')

		 $scope.sess_users_id = $localStorage.ses_userdata.users_id ;
		 $scope.sess_company_id = $localStorage.ses_userdata.users_companyid ;

		 $scope.posted_job_id = $stateParams.job_post_id;

		// alert( $stateParams.job_post_id );


		 /* Job DETAILS FOR A JOB*/

		 var set_job_details = function (data) {
		 	//alert(2);
			$scope.job_details = data;

			//console.log($scope.job_details);	
		};
		
		 function fetch_job_details( job_post_id ) {

			var url_path = serviceurl + "API_job/job_details/" ;
			var parameter = { job_id: job_post_id };

			commonpostService.cmnpost( url_path, parameter ).then(set_job_details, errorDetails);
		 }
		 fetch_job_details( $scope.posted_job_id );
		// $timeout(function() { fetch_all_users_applied_for_job( $scope.posted_job_id );  },  500);
		 

		 /* APPLIED USERS FOR A JOB*/

		 var set_all_applied_users_list = function (data) {
		 	//alert(2);
			$scope.all_applied_users_list = data;

			//console.log($scope.all_applied_users_list);	
		};
		
		 function fetch_all_users_applied_for_job( job_post_id ) {

			var url_path = serviceurl + "API_job/applied_users_for_job/" ;
			var parameter = { job_id: job_post_id };

			commonpostService.cmnpost( url_path, parameter ).then(set_all_applied_users_list, errorDetails);
		 }
		 fetch_all_users_applied_for_job( $scope.posted_job_id );
		// $timeout(function() { fetch_all_users_applied_for_job( $scope.posted_job_id );  },  500);
		 

		 $scope.view_user_profile_details = function ( users_id, job_id ) {

		 	$localStorage.to_view_user_id = users_id; 
		 	$localStorage.to_view_job_id = job_id; 

		 	 $state.go("user.profile", {}, {reload: true});  
			
		};





})
})();
