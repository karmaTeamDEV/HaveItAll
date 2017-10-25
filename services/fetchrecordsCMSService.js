(function () {
    'use strict';
    var fetchrecordsCMSService = function ($http) {
        
    var fetchrecordsCMSResult = function (partialURL) {
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

    var fetchrecordsALLTableResult = function (partialURL) {
       return $http({
            method: "get",
            url: serviceurl+partialURL,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function successResponse(response) {
            alert(JSON.stringify(response.data));
            return response.data;
        }, function errorResponse(response) {
            //console.log("============RESPONSE FAILURE=======cccccccccc=======" + response);
        });
    };
        return {
            fetchrecordsCMS: fetchrecordsCMSResult,
            fetchrecordsAllTable: fetchrecordsALLTableResult
        };
    };
    angular.module("app.services").factory("fetchrecordsCMSService", ["$http", fetchrecordsCMSService]);
})();