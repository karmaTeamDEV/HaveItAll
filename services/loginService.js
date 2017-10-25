(function () {
    'use strict';
    var loginService = function ($http) {
    var loginResult = function (loginUser) {
		//alert(loginUser);
           return $http({
                method: "post",
                url: serviceurl+'api/authenticate/',
				data: loginUser,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successResponse(response) {
				//alert("===="+response.data);
                return response.data;
            }, function errorResponse(response) {
                //console.log("============RESPONSE FAILURE=======cccccccccc=======" + response);
            });
        };
        return {
            authenticateUser : loginResult
        };
    };
    angular.module("app.services").factory("loginService", ["$http", loginService]);
})();