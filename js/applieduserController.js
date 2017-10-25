(function () {  
    'use strict';
 
    app.controller('applieduserController', function ($scope,$state,$localStorage, $timeout,commonpostService) { 
  		 
		 var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		 };		 

		// alert(JSON.stringify($localStorage.ses_userdata.users_companyid));

		var fetch_user_applied_for_company = function (data) {
			$scope.suggeted_user_for_company_list = data;
			//alert(JSON.stringify($scope.suggeted_user_for_company_list));	
		}; 

		var url_path = serviceurl + "API_following/applied_users_for_company/" ;
		var parameter = {user_id:$localStorage.ses_userdata.users_id, company_id: $localStorage.ses_userdata.users_companyid ,status:'3'};
		commonpostService.cmnpost( url_path, parameter).then(fetch_user_applied_for_company, errorDetails);
		$localStorage.tab_to_view= '' ;	
		$scope.view_a_user_for_company = function(user_id,type){
			//alert(user_id);
			//alert(type);	
			$localStorage.tab_to_view= type ;		 
			$state.go("user.profile", {user_id:user_id, usertype:''}, {reload: true});
		}
		 
		 

		 
})
})();
