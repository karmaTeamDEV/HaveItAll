(function () {
    'use strict';  
    var serviceId = 'customSpinner';
    angular.module('app').factory(serviceId, ['$rootScope', customSpinner]);
    function customSpinner($rootScope) {
        var service = {          
            showCustomSpinner: function () {
                $rootScope.isSpinner = true;
            },
            hideCustomSpinner: function () {
                $rootScope.isSpinner = false;
            }
        };
        return service;
    };


})();













