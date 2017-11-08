 
app.controller('postsDetailsController', function ($scope,$stateParams,$state,$http,fetchrecordsCMSService,$localStorage,commonpostService,$location,$document,getProfileService) { 
     
      
      $scope.props = {
          target: '_blank' 
      };

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
       

      // angular.forEach($scope.postdatalist, function(value, key) {
      //        $scope.postdatalist[key].lastactivity = $scope.timeSince(new Date(value.post_date));                    
      //        $scope.postdatalist[key].txtContent = $scope.postdatalist[key].post_content;
              
      //     });
        
     };

     fetchrecordsCMSService.fetchrecordsCMS('','getPostlist', $scope.post_id).then(get_list,errorDetails);     
   
  //   $scope.timeSince = function(date) {
  //     var seconds = Math.floor((new Date() - date) / 1000);
  //     var interval = Math.floor(seconds / 31536000);

  //     if (interval > 1) {
  //       return interval + " years ago";
  //     }
  //     interval = Math.floor(seconds / 2592000);
  //     if (interval > 1) {
  //       return interval + " months ago";
  //     }
  //     interval = Math.floor(seconds / 86400);
  //     if (interval > 1) {
  //       return interval + " days ago";
  //     }
  //     interval = Math.floor(seconds / 3600);
  //     if (interval > 1) {
  //       return interval + " hours ago";
  //     }
  //     interval = Math.floor(seconds / 60);
  //     if (interval > 1) {
  //       return interval + " minutes ago";
  //     }
  //     return Math.floor(seconds) + " seconds ago";
  // } 
});



