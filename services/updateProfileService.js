(function () {
    'use strict';
    var updateProfileService = function ($http,$localStorage) {
    var updateuserResult = function (UserInfo) {
		
           return $http({
                method: "post",
                url: serviceurl+'api/update_profile/',
				data: UserInfo,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successResponse(response) {
				//alert("==success=="+response);
                return response.data;
            }, function errorResponse(response) {
                 return response.data;
				//alert("Fail");
                //console.log("============RESPONSE FAILURE=======cccccccccc=======" + response);
            });
        };
        return {
            updateProfile : updateuserResult
        };
    };
    angular.module("app.services").factory("updateProfileService", ["$http", updateProfileService]);
})();