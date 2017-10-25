(function () {
    'use strict';
    var getProfileService = function ($http) {
    var getProfileResult = function (id) {
           return $http({
                method: "get",
                url: serviceurl+'api/getProfileinfo/'+id,               
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successResponse(response) {
				//alert(JSON.stringify(response.data));
                return response.data;
            }, function errorResponse(response) {
                 return response.data;
                //alert('Fail'+JSON.stringify(response.data));
                //console.log("============RESPONSE FAILURE=======cccccccccc=======" + response);
            });
        };
        return {
            getProfileinfo: getProfileResult
        };
    };
    angular.module("app.services").factory("getProfileService", ["$http", getProfileService]);
})();