(function () {
    'use strict';
    app.factory('getemployerfitService', function ($resource, $q, $http) {
        var cities = $resource(serviceurl+'API/:action',
            { action: "getAlltype"},
            { 'get': { method: 'GET', isArray: false } });
        // if your service is sending an object instead of an array add isArray:false to its declaration

        return {
            fetchemployerfit: function (employeefit) {
                var q = $q.defer();
                var cities = $resource(serviceurl+'API/:action'+'/'+employeefit,
                    { action: "getAlltype"},
                    { 'get': { method: 'GET', isArray: false } });
                cities.query(function (resp) {
                    //alert(JSON.stringify(resp));
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
    app.factory('loginService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/authenticate/";
        return {
            authenticateUser: function (loginUser) {
               // alert(username + ' ' + password);
               var q = $q.defer();
               $http({
                method: "POST",
                url: urlpath,
                data: loginUser,                    
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
    app.factory('getProfileService', function ($resource, $q, $http) {
        // if your service is sending an object instead of an array add isArray:false to its declaration

        return {
            getProfileinfo: function (id) {
                var q = $q.defer();
                var url = $resource(serviceurl+'API/:action'+'/'+id,
                    { action: "getProfileinfo"},
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
    app.factory('checkjobService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/checkedJobfit/";
        return {
            checkedjobfit: function (Info) {
                //alert(JSON.stringify(Info));
                var q = $q.defer();
                $http({
                    method: "POST",
                    url: urlpath,
                    data: Info,                  
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
    app.factory('updateProfileService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/update_profile/";
        return {
            updateProfile: function (UserInfo) {
               // alert(JSON.stringify(Info));
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
    app.factory('fetchrecordsCMSService', function ($resource, $q, $http) {
        // if your service is sending an object instead of an array add isArray:false to its declaration

        return {
            fetchrecordsCMS: function (url,action,id) {
                //alert(action+'---'+id)
                var q = $q.defer();
                var url = $resource(serviceurl+'API/'+url+'/:action'+'/'+id,
                    { action: action},
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
    app.factory('registeruserService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/registration/";
        //alert(urlpath);
        return {
            registerCompanyUser: function (UserInfo) {
                //alert(JSON.stringify(UserInfo));
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
    app.factory('employerService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/regEmployer/";
        //alert(urlpath);
        return {
            regEmployer: function (UserInfo) {
                //alert(JSON.stringify(UserInfo));
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
    app.factory('ForgotpswService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/singlerecord/";        
        return {
            forgotPassword: function (UserInfo) {                
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
    app.factory('getMatercmsService', function ($resource, $q, $http) {
        // if your service is sending an object instead of an array add isArray:false to its declaration

        return {
            getListinfo: function (type,id) {
                //alert(type);
                var q = $q.defer();
                var url = $resource(serviceurl+'API/:action'+'/'+type+'/'+id,
                    { action: "getStatelist"},
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
    app.factory('updateProfileService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/update_profile/";        
        return {
            updateProfile: function (UserInfo) {                
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
    app.factory('removeImageService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/removeProfileImage/";    

        return {
            deleteimage: function (UserInfo) {     
            //alert(JSON.stringify(UserInfo));           
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
    app.factory('fetchuserPasswordService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "LinkedinCallback/fetchpassword/";        
        return {
            fetchPassword: function (userInfo) {                
                var q = $q.defer();
                $http({
                    method: "POST",
                    url: urlpath,
                    data: userInfo,                    
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
    app.factory('parentchilddeleteService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/delparntchildcatgry/";
        return {
            deleteparentchild: function (eduInfo) {
               // alert(username + ' ' + password);
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
    app.factory('delchildService', function ($resource, $q, $http) {
        var urlpath = serviceurl + "API/delchildcatgry/";
        return {
            deletechild: function (eduInfo) {
               // alert(username + ' ' + password);
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
    app.factory('commonpostService', function ($resource, $q, $http) {
        
        return {
            cmnpost: function (urlpath,UserInfo) {
                //alert(JSON.stringify(UserInfo));
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
      
})();