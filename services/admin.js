(function () {
    'use strict';
    
    app.factory('addeditrecordCMSService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/updateuserstatus/";        
        return {
            addeditrecordCMS: function (UserInfo) {                
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
    app.factory('getCMSService', function ($resource, $q, $http) {       

        return {
            fetchrecordsCMS: function (id) {
                var q = $q.defer();
                var url = $resource(serviceurl+'API/:action'+'/'+id,
                    { action: "getallusers"},
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
    app.factory('fetchCMSService', function ($resource, $q, $http) {       

        return {
            fetchrecordsCMS: function (id) {
                var q = $q.defer();
                var url = $resource(serviceurl+'API/:action'+'/'+id,
                    { action: "gettypecategories"},
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
    app.factory('fetchsingleCMSService', function ($resource, $q, $http) {       

        return {
            fetchsinglerecordCMS: function (id) {
                var q = $q.defer();
                var url = $resource(serviceurl+'API/:action'+'/'+id,
                    { action: "gettypecategory"},
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
    app.factory('addeditCMSService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/addEdit_typecategory/";        
        return {
            addeditrecordCMS: function (UserInfo) {                
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
    app.factory('fetchIndustryiesService', function ($resource, $q, $http) {       

        return {
            fetchIndustries: function (id) {
                if(id === undefined){
                    id = '';
                }
                var q = $q.defer();
                var url = $resource(serviceurl+'IndustryAPI/:action'+'/'+id,
                    { action: "getindustries"},
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
    app.factory('fetchSingleRecordService', function ($resource, $q, $http) {       

        return {
            fetchsinglerecordCMS: function (id,apiAction) {
                var q = $q.defer();
                var url = $resource(serviceurl+'IndustryAPI/:action'+'/'+id,
                    { action: apiAction},
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
    app.factory('addeditIndustryService', function ($resource, $q, $http) {
                
        return {
            addeditrecordCMS: function (dataObj,urlpath) {                
                var q = $q.defer();
                $http({
                    method: "POST",
                    url: urlpath,
                    data: dataObj,                    
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
    app.factory('fetchCompaniesService', function ($resource, $q, $http) {       

        return {
            fetchCompanies: function (id) {
                if(id === undefined){
                    id = '';
                }
                var q = $q.defer();
                var url = $resource(serviceurl+'IndustryAPI/:action'+'/'+id,
                    { action: "getcompanies"},
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
})();