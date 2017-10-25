(function () {
    'use strict';
    var registeruserService = function ($http,$localStorage) {
    var registeruserResult = function (registerUserInfo) {
		
           return $http({
                method: "post",
                url: serviceurl+'api/registration/',
				data: registerUserInfo,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successResponse(response) {
				//alert("==success=="+response);
                return response.data;
            }, function errorResponse(response) {
				alert("Username already exist!");
                //console.log("============RESPONSE FAILURE=======cccccccccc=======" + response);
            });
        };
        return {
            registerCompanyUser : registeruserResult
        };
    };
    angular.module("app.services").factory("registeruserService", ["$http", registeruserService]);
})();