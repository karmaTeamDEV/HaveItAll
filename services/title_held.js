(function () {
    'use strict';
    app.factory('fetchTitleUserService', function ($resource, $q, $http) {
        
        return {
			
            fetchTitleWorkUser: function (parameters) {
               // alert(username + ' ' + password);
               var q = $q.defer();
               $http({
                method: "POST",
                url:  serviceurl + "API_title/all_title_work_for_user/",
                data: parameters,                    
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }).then(function successResponse(response) {
                  // console.log(response.data);
				  $('#mydiv').hide();
				  q.resolve(response.data);
               }, function errorResponse(response) {
                   $('#mydiv').hide();
                   q.reject(response);
               });
                return q.promise;;
            },
			
			deleteTitleUser: function (title_user_id) {
               // alert(username + ' ' + password);
               var q = $q.defer();
               $http({
                method: "POST",
                url: serviceurl + "API_title/delete_one_title_for_user/",
                data: title_user_id,                    
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }).then(function successResponse(response) {
                   // alert(response);
				   	$('#mydiv').hide();
					 q.resolve(response.data);
               }, function errorResponse(response) {
                   $('#mydiv').hide();
                   q.reject(response);
               });
                return q.promise;;
            },
			
			fetchAllMasterUser: function (parameters) {
               // alert(username + ' ' + password);
               var q = $q.defer();
               $http({
                method: "POST",
                url: serviceurl + "API_title/fetch_all_master_for_user/",
                data: parameters,                    
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }).then(function successResponse(response) {
                   // alert(response);
				   $('#mydiv').hide();
					 q.resolve(response.data);
               }, function errorResponse(response) {
                   $('#mydiv').hide();
                   q.reject(response);
               });
                return q.promise;;
            },
			
			addOneTitleUser: function (parameters) {
               // alert(username + ' ' + password);
               var q = $q.defer();
               $http({
                method: "POST",
                url: serviceurl + "API_title/insert_one_title_for_user/",
                data: parameters,                    
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }).then(function successResponse(response) {
					$('#mydiv').hide();
					//console.log(response);
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