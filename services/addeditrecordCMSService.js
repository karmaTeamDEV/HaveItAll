(function () {
    'use strict';
    var addeditrecordCMSService = function ($http) {
    var addeditrecordCMSResult = function (dataObj,insertEditURL) {
           return $http({
                method: "post",
                url: serviceurl+insertEditURL,
				data: dataObj,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successResponse(response) {
				//alert("===="+response.data);
                return response.data;
            }, function errorResponse(response) {
                //console.log("============RESPONSE FAILURE=======cccccccccc=======" + response);
            });
        };
        return {
            addeditrecordCMS : addeditrecordCMSResult
        };
    };
    angular.module("app.services").factory("addeditrecordCMSService", ["$http", addeditrecordCMSService]);
})();