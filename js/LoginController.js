/* ==========================================================================
Author: BAMADEB UPADHYAYA
Create date:  05/10/2017
Description:  Login js page
=============================================================================  */


(function () {
	'use strict';
	app.controller('LoginController', function ($scope,loginService,$localStorage,$location,$document,$state,$stateParams,fetchuserPasswordService) { 
		 // if(!$localStorage.ses_userdata){
	  	 // 	$state.go("login"); 
		 //    }else{
		 //        $state.go("user.appHome"); 
		 //    }

		$scope.userInfo = {};
		$scope.userInfo.username = $localStorage.email;

		var linkedUserEmail = $stateParams.param1;
		$scope.linkedinAuthCredentials = {
		         client_id:'812sbcn1c6vorz',	        
		         redirect_uri:serviceurl+'LinkedinCallback/fetchlinkedinprofile',
		         csrf_token:'8453878227',
		         scopes:'r_basicprofile%20r_emailaddress'
		};

		var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		};

		var fetchLogin = function (data) {
	   //alert(data.error);
	   if(data.error!=1){
	   	$localStorage.ses_userdata = data[0];
	   		//alert(JSON.stringify($localStorage.ses_userdata));
	   		//alert( parseInt($localStorage.ses_userdata.users_type) ) ;

		   	if(parseInt($localStorage.ses_userdata.users_type) == 3){		  	
		   		$state.go("control.admin");  
		   	}else if(parseInt($localStorage.ses_userdata.users_type) == 2){
		   		$state.go("user.companyHome"); 
			  	// $state.go("user.appHome", {}, { reload: true }); 
			  }else{
		   		$state.go("user.appHome"); 
			  	// $state.go("user.appHome", {}, { reload: true }); 
			  }
		}else{
			$scope.userInfo.username = '';		  
			$scope.userInfo.usrpasswrd = '';
			$scope.loginForm.$setPristine();
			bootbox.alert(data.message);

		}

	};

	var fetchUserCredentials = function(data){
          $scope.userInfo.username = data.user_email;
          $scope.userInfo.usrpasswrd = data.users_password;
	  loginService.authenticateUser($scope.userInfo).then(fetchLogin, errorDetails);

	};
	
	if(linkedUserEmail !== undefined){
	   var user = {user_email: linkedUserEmail}; 	
       fetchuserPasswordService.fetchPassword(user).then(fetchUserCredentials,errorDetails);
	}
	
	$scope.login = function(loginForm){
		$('#mydiv').show();
		loginService.authenticateUser($scope.userInfo).then(fetchLogin, errorDetails);
	};
	
})
})();
