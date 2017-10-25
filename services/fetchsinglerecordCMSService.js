(function () {
    'use strict';
    var fetchsinglerecordCMSService = function ($http) {
    var fetchsinglerecordCMSResult = function (partialURL) {
           return $http({
                method: "get",
                url: serviceurl+partialURL,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successResponse(response) {
				//alert(JSON.stringify(response.data));
                return response.data;
            }, function errorResponse(response) {
                //console.log("============RESPONSE FAILURE=======cccccccccc=======" + response);
            });
        };
        return {
            fetchsinglerecordCMS: fetchsinglerecordCMSResult
        };
    };
    angular.module("app.services").factory("fetchsinglerecordCMSService", ["$http", fetchsinglerecordCMSService]);
})();