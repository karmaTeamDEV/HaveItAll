

app.controller('postsDetailsController', function ($scope,$stateParams,$state,$http,fetchrecordsCMSService,$localStorage,commonpostService,$location,$document,getProfileService) { 
     
      $scope.post_id = $stateParams.id;
//alert( $scope.post_id);
      var errorDetails = function (serviceResp) {
      $scope.Error = "Something went wrong ??";
    };

     var fetch_profile = function (data) {
      $scope.ProfileInfo = data[0];        
      //alert(JSON.stringify($scope.ProfileInfo));  
     };
      getProfileService.getProfileinfo($scope.post_id).then(fetch_profile, errorDetails); 
      

     $scope.postdatalist = [];
     var get_list = function (data) { 

     $scope.postdatalist =data;     
     //alert(JSON.stringify($scope.postdatalist));
       
     };

     fetchrecordsCMSService.fetchrecordsCMS('','getPostlist', $scope.post_id).then(get_list,errorDetails); 
     
   
     
});



