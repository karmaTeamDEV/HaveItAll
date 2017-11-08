 
app.controller('feeduserDetailsController', function ($scope,$stateParams,$state,$http,fetchrecordsCMSService,$localStorage,commonpostService,$location,$document,getProfileService) { 
     
      
      $scope.props = {
          target: '_blank' 
      };

      //$scope.post_id = $stateParams.id;
      //alert(JSON.stringify($localStorage.ses_userdata.users_companyid));
      var errorDetails = function (serviceResp) {
        $scope.Error = "Something went wrong ??";
      };

      

     $scope.postdatalist = [];
     var get_list = function (data) { 
        $scope.postdatalist =data;       
       // alert(JSON.stringify($scope.postdatalist));  
     };

     fetchrecordsCMSService.fetchrecordsCMS('','user_following_feeds', $localStorage.ses_userdata.users_companyid).then(get_list,errorDetails);     
   
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



