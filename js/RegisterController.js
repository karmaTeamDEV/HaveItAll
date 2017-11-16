/* ==========================================================================
Author: BAMADEB UPADHYAYA
Create date:  05/10/2017
Description:  Register js page
=============================================================================  */

(function () {
	'use strict';
	app.controller('RegisterController', function ($scope,$state,$location,$localStorage,registeruserService, commonpostService) { 
		
		$scope.userregisterInfo = {};

		  $scope.userregisterInfo.ses_employerfit = $localStorage.ses_employerfit;
		  $scope.userregisterInfo.ses_jobfit = $localStorage.ses_jobfit;
		  $localStorage.email = $scope.userregisterInfo.username;
		  $scope.userregisterInfo.ses_industrylist = $localStorage.ses_industrylist;
		  $scope.userregisterInfo.ses_seniorityList = $localStorage.ses_seniorityList;

		 // alert($scope.userregisterInfo.ses_industrylist) ;
		 // console.log($scope.userregisterInfo.ses_industrylist);
		//  console.log($scope.userregisterInfo.ses_seniorityList);

		    $scope.linkedinAuthCredentials = {
			         client_id:'812sbcn1c6vorz',	        
			         redirect_uri:serviceurl+'LinkedinCallback/fetchlinkedinprofile',
			         csrf_token:'8453878227',
			         scopes:'r_basicprofile%20r_emailaddress'
			};

		   $scope.industry_list = [];
			$.each($scope.userregisterInfo.ses_industrylist, function (index, industry) {
		        $scope.industry_list.push(industry.industry_id); //push values here
		    });
		    //console.log($scope.industry_list.join(',')); 

		   $scope.seniorty_list = [];
			$.each($scope.userregisterInfo.ses_seniorityList, function (index, seniorty) {
		        $scope.seniorty_list.push(seniorty.level_id); //push values here
		    });
		   // console.log($scope.seniorty_list.join(',')); 

		var set_job_matched_before_reg = function(data){         
	       	
	        $scope.job_matched_before_reg = data;
	     }   

	     function fetch_job_match_before_reg(employerfit, jobfit, industry, seniorty) {

	          var url = serviceurl + "API_job/before_resistration_matched_job/";
	          var object = { employerfit:employerfit, jobfit:jobfit, industry:industry, seniority:seniorty }
	          commonpostService.cmnpost(url,object).then(set_job_matched_before_reg, errorDetails);   

	      }	
			//alert($scope.userregisterInfo.ses_employerfit) ;

	      fetch_job_match_before_reg( $scope.userregisterInfo.ses_employerfit, $scope.userregisterInfo.ses_jobfit,  $scope.industry_list.join(','), $scope.seniorty_list.join(',') );



		var set_company_matched_before_reg = function(data){         
	       	
	        $scope.company_matched_before_reg = data;
	     }   

	     function fetch_company_match_before_reg(employerfit, jobfit, industry, seniorty) {

	          var url = serviceurl + "API_job/before_resistration_matched_company/";
	          var object = { employerfit:employerfit, jobfit:jobfit, industry:industry, seniority:seniorty }
	          commonpostService.cmnpost(url,object).then(set_company_matched_before_reg, errorDetails);   

	      }	
			//alert($scope.userregisterInfo.ses_employerfit) ;

	      fetch_company_match_before_reg( $scope.userregisterInfo.ses_employerfit, $scope.userregisterInfo.ses_jobfit,  $scope.industry_list.join(','), $scope.seniorty_list.join(',') );



		
		function resetForm(){
			$scope.userregisterInfo.first_name = '';
			$scope.userregisterInfo.last_name = '';
			$scope.userregisterInfo.username = '';
			$scope.userregisterInfo.password = '';
		}
		//alert(JSON.stringify($localStorage.ses_employerfit));

		var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		};

		var registeruserSuccess = function (data) {
		//alert(data.success);
		if(data.success == 1){
			$localStorage.ses_userdata = data.list[0];	
			$state.go("user.appHome");	
		} else {
			bootbox.alert(data.error);
			//alert(data.error);
		}		   
	};
	// alert(JSON.stringify($localStorage.ses_industrylist));
	// alert(JSON.stringify($localStorage.ses_seniorityList));

	$localStorage.email = '';
	$scope.registercompanyRuser = function(){	  
		  //alert(JSON.stringify($scope.userregisterInfo));
		  //alert($localStorage.ses_jobfit);	  

		  registeruserService.registerCompanyUser($scope.userregisterInfo).then(registeruserSuccess, errorDetails);

		};
	})

})();
