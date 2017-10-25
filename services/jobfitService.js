(function () {
    'use strict';
    var jobService = function ($http) {
    var jobResult = function (Info) {
		//alert(JSON.stringify(Info));
           return $http({
                method: "post",
                url: serviceurl+'api/jobfit/',
				data: Info,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successResponse(response) {
				//alert("==success=="+response);
                return response.data;
            }, function errorResponse(response) {
				//alert("FAILURE"+response.data);
                //console.log("============RESPONSE FAILURE=======cccccccccc=======" + response);
            });
        };
        return {
            jobfit : jobResult
        };
    };
    angular.module("app.services").factory("jobService", ["$http", jobService]);
})();