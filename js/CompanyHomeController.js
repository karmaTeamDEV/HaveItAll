(function () {
    'use strict';
    app.controller('CompanyHomeController', function ($scope, $state, $window, loginService,$localStorage,$location,$document, commonpostService) { 
   
    //alert($scope.userInfo);

		 /* ACTIVE JOBS FOR A COMPANY*/

    var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	};

	 $scope.go_to_active_jobs = function () {
	 	//alert(3);
	 	//$state.go("user.postjobview", true); 
	 	$window.location.href = "#!/user/postjobview/";
	 	//alert(4);

	};

	 $scope.go_to_new_folower = function (to_show_tab) {
        $localStorage.tab_to_view = to_show_tab ;
	 	//alert(3);
	 	//$state.go("user.postjobview", true); 
	 	$window.location.href = "#!/user/followuser";
	 	//alert(4);

	};


	$scope.jobpostlist = [];	
     var fetch_arraylist = function(data){     	
     	$scope.jobpostlist = data[0];
     	//console.log(JSON.stringify(data));
     }
   
     var url = serviceurl + "API_job/get_no_of_active_jobs/";
     var obj = {id:$localStorage.ses_userdata.users_companyid, status:'0'}
     commonpostService.cmnpost(url,obj).then(fetch_arraylist, errorDetails);


	$scope.no_of_new_followers = [];	
     var set_no_of_new_followers = function(data){     	
     	$scope.no_of_new_followers = data[0];
     	//alert(JSON.stringify($scope.no_of_new_followers)) ;
     	//console.log(JSON.stringify(data));
     }

     function get_no_of_new_followers()
     {
	     var url = serviceurl + "API_following/no_of_new_followers_of_company/";
	     var obj = { company_id:$localStorage.ses_userdata.users_companyid }
	     commonpostService.cmnpost(url,obj).then(set_no_of_new_followers, errorDetails);


     }
     get_no_of_new_followers();

	$scope.no_of_new_applicant = [];	
     var set_no_of_new_applicant = function(data){     	
     	$scope.no_of_new_applicant = data[0];
     	//alert(JSON.stringify($scope.no_of_new_followers)) ;
     	//console.log(JSON.stringify(data));
     }

     function get_no_of_new_applicants()
     {
	     var url = serviceurl + "API_following/no_of_new_applicants_of_company/";
	     var obj = { company_id:$localStorage.ses_userdata.users_companyid }
	     commonpostService.cmnpost(url,obj).then(set_no_of_new_applicant, errorDetails);


     }
     get_no_of_new_applicants();


        var fetch_user_suggested_for_company = function (data) {
            $scope.suggeted_user_for_company_list = data;
            console.log($scope.suggeted_user_for_company_list);  
        };

         function fetch_user_suggested_company() {
            var url_path = serviceurl + "API_following/suggeted_users_for_company/" ;
            var parameter = {user_id:$localStorage.ses_userdata.users_id, company_id: $localStorage.ses_userdata.users_companyid };
            commonpostService.cmnpost( url_path, parameter).then(fetch_user_suggested_for_company, errorDetails);
         }
         fetch_user_suggested_company();



            var fetch_company_follow_user = function (data) {
                $scope.company_following_user_list = data;
                //console.log($scope.companyList);  
            };
            var url_path = serviceurl + "API_following/users_following_by_company/" ;
            var parameter = {company_id: $localStorage.ses_userdata.users_companyid, following_type:'user'};
            commonpostService.cmnpost( url_path, parameter).then(fetch_company_follow_user, errorDetails);

})
})();
