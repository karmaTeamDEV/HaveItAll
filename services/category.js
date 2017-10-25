(function () {
    'use strict';
    
    app.factory('checkjobService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/checkedJobfit/";        
        return {
            checkedjobfit: function (UserInfo) {                
                var q = $q.defer();
                $http({
                    method: "POST",
                    url: urlpath,
                    data: UserInfo,                    
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }).then(function successResponse(response) {
                   $('#mydiv').hide();
                   q.resolve(response.data);
               }, function errorResponse(response) {
                   $('#mydiv').hide();
                   q.reject(response);
               });
                return q.promise;;
            }
        }
    }) 
    app.factory('jobService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/jobfit/";        
        return {
            jobfit: function (UserInfo) {                
                var q = $q.defer();
                $http({
                    method: "POST",
                    url: urlpath,
                    data: UserInfo,                    
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }).then(function successResponse(response) {
                   $('#mydiv').hide();
                   q.resolve(response.data);
               }, function errorResponse(response) {
                   $('#mydiv').hide();
                   q.reject(response);
               });
                return q.promise;;
            }
        }
    })
    app.factory('getfitService', function ($resource, $q, $http) {
        // if your service is sending an object instead of an array add isArray:false to its declaration

        return {
            fetchfit: function (id) {
                var q = $q.defer();
                var url = $resource(serviceurl+'API/:action'+'/'+id,
                    { action: "getAlltype"},
                    { 'get': { method: 'GET', isArray: false } });
                url.query(function (resp) {
                    $('#mydiv').hide();
                    q.resolve(resp);
                }, function (err) {
                    $('#mydiv').hide();
                    q.reject(err);
                })

                return q.promise;
            }
        }
    })
    app.factory('educationService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/education/";        
        return {
            addEducation: function (eduInfo) {                
                var q = $q.defer();
                $http({
                    method: "POST",
                    url: urlpath,
                    data: eduInfo,                    
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }).then(function successResponse(response) {
                   $('#mydiv').hide();
                   q.resolve(response.data);
               }, function errorResponse(response) {
                   $('#mydiv').hide();
                   q.reject(response);
               });
                return q.promise;;
            }
        }
    })
})();