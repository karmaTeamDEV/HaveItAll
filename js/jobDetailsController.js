(function () {
  'use strict';
  app.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });
  app.controller('jobDetailsController', function ($scope, $mdDialog, $window,$sce,$state,checkjobService, commonpostService,fetchrecordsCMSService,getfitService, getMatercmsService,$localStorage,$location,$document,$filter,$timeout, $stateParams) { 

  		var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		 };

		 //alert('message?: DOMString')
     $scope.job_tab = $localStorage.tab_to_view;
		 $scope.posted_job_id = $stateParams.job_id;

		//alert( $scope.posted_job_id );
    $scope.onSwipeLeft = function(ev) {
        // var x = document.getElementById("mydiv");        
        // x.style.display = "block";       
        $scope.fetch_next_job_user($scope.posted_job_id,$scope.job_tab,'next');          
    };

    $scope.onSwipeRight = function(ev) {
        // var x = document.getElementById("mydiv");        
        // x.style.display = "block";        
        $scope.fetch_next_job_user($scope.posted_job_id,$scope.job_tab,'prev');       
    };


    $scope.viewpostjob = [];
    var get_jobdetails = function (data) { 
      //console.log(JSON.stringify(data[0]));
     
      $scope.viewpostjob = data[0];   
      // console.log($scope.viewpostjob);
    }; 

    function view_job(jobid){
        $scope.listTab = false; 
        $scope.viewjobTab = true; 
        //alert(jobid);
        var url = serviceurl + "API/getjobpost/";
        var object = {id:jobid}
        commonpostService.cmnpost(url,object).then(get_jobdetails, errorDetails);
    }

    view_job($scope.posted_job_id) ;




			/* GOTO NEXT JOB */
			 $scope.fetch_next_job_user = function (job_id,job_tab,level) {
				// alert(job_id);
        // alert(job_tab);
        var x = document.getElementById("mydiv");        
        x.style.display = "block";   
        if(job_tab == 'myjobs'){
          var url_path = serviceurl + "API_job/match_jobs_for_user/" ;
          var parameter = { current_job_id: job_id, user_id: $localStorage.ses_userdata.users_id, following_type:'YES',level:level };
        }
        if(job_tab == 'saved'){
          var url_path = serviceurl + "API_job/user_saved_jobs/" ;
          var parameter = { current_job_id: job_id, user_id: $localStorage.ses_userdata.users_id, saving_type: 'user',level:level };
        }
        if(job_tab == 'applied'){
          var url_path = serviceurl + "API_job/user_applied_jobs/" ;
          var parameter = { current_job_id: job_id, user_id: $localStorage.ses_userdata.users_id, applied_type:'user',level:level};
        }
				
				commonpostService.cmnpost( url_path, parameter).then(after_fetch_next_job_user, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_fetch_next_job_user = function (data) {
				//alert(data[0].jobpost_id);
				$state.go("user.jobDetails", {job_id:data[0].jobpost_id}, {reload: true});  	


			};

    /* CHECK FOR APLIED JOB FUNCTION*/
      var set_job_applied_details = function(data){         
        
        $scope.job_applied_details = data;
      }   

     function fetch_user_applied_job_details(job_id, user_id) {

          var url = serviceurl + "API_job/job_applied_details_by_user/";
          var object = {job_id:job_id, user_id:user_id}
          commonpostService.cmnpost(url,object).then(set_job_applied_details, errorDetails);   

      } 

      fetch_user_applied_job_details($scope.posted_job_id, $localStorage.ses_userdata.users_id);


			/* APPLY FOR A JOB FUNCTION*/
			 $scope.apply_for_job_user = function (job_id) {

				//alert(job_id);

				var url_path = serviceurl + "API_job/apply_job_by_user/" ;
				var parameter = { job_id: job_id, user_id: $localStorage.ses_userdata.users_id, applied_type: 'user' };
				commonpostService.cmnpost( url_path, parameter).then(after_apply_for_job_user, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_apply_for_job_user = function (data) {
				//console.log(data.del_id);	
				$("#job_apply_button").remove();



			};

			/* SAVE A JOB FUNCTION */
			 $scope.save_a_job_for_user = function (job_id) {

				//alert(job_id);

				var url_path = serviceurl + "API_job/insert_save_job_by_user/" ;
				var parameter = { job_id: job_id, user_id: $localStorage.ses_userdata.users_id, saving_type: 'user' };
				commonpostService.cmnpost( url_path, parameter).then(after_save_a_job_for_user, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_save_a_job_for_user = function (data) {
				//console.log(data.del_id);	
				$("#job_save_button").remove();
				//$("#saved"+data.job_id).remove();



			};



		/* CHECK COMPANY FOLLOW OR NOT */

      var set_company_details = function(data){         
        $scope.company_details = data;
        console.log(data);
      }   

     function fetch_company_details_from_job_post_id(job_id, user_id) {
          var url = serviceurl + "API_job/company_details_from_job/";
          var object = {job_id:job_id, user_id:user_id}
          commonpostService.cmnpost(url,object).then(set_company_details, errorDetails);   

      }	

      fetch_company_details_from_job_post_id($scope.posted_job_id, $localStorage.ses_userdata.users_id);
      
      var set_match_criteria = function(data){         
       	//console.log(data);
        $scope.criteria_match_list = data;
      }   

     function fetch_user_match_criteria_with_job(job_id, user_id) {

          var url = serviceurl + "API_job/job_proretty_match_user/";
          var object = {job_id:job_id, user_id:user_id}
          commonpostService.cmnpost(url,object).then(set_match_criteria, errorDetails);   

      }	

      fetch_user_match_criteria_with_job($scope.posted_job_id, $localStorage.ses_userdata.users_id);

      	/* FOLLOW A COMPANY */
      			var after_follow_company_for_user = function (data) {
				//console.log(data.del_id);	
				
				//fetch_user_matching_job();


			};


			 $scope.follow_a_company_for_user = function (company_id) {

			//	alert(company_id);

				var url_path = serviceurl + "API_following/follow_company_by_user/" ;
				var parameter = { company_id: company_id, user_id: $localStorage.ses_userdata.users_id, following_type: 'user' };
				commonpostService.cmnpost( url_path, parameter).then(after_follow_company_for_user, errorDetails);
				//console.log($scope.companyList);	
			};


})
})();
