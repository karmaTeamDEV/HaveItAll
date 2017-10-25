(function () {
    'use strict';
    var getemployerfitService = function ($http) {
    var getemployerfitResult = function (employeefit) {
           return $http({
                method: "get",
                url: serviceurl+'api/getAlltype/'+employeefit,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successResponse(response) {
				//alert(JSON.stringify(response.data));
                return response.data;
            }, function errorResponse(response) {
                //console.log("============RESPONSE FAILURE=======cccccccccc=======" + response);
            });
        };
        return {
            fetchemployerfit: getemployerfitResult
        };
    };
    angular.module("app.services",['ngStorage']).factory("getemployerfitService", ["$http", getemployerfitService]);
})();