 app.directive('ngFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].files, function (item) {
                    var value = {
                       // File Name 
                        name: item.name,
                        //File Size 
                        size: item.size,
                        //File URL to view 
                        url: URL.createObjectURL(item),
                        // File Input Value 
                        _file: item
                    };
                    values.push(value);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
}]);

app.directive('parseUrl', function () {
    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
    return {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        scope: {
            props: '=parseUrl',
            ngModel: '=ngModel'
        },
        link: function compile(scope, element, attrs, controller) {
            scope.$watch('ngModel', function (value) {
                var html = value.replace(urlPattern, '<a target="' + scope.props.target + '" href="$&">$&</a>');
                element.html(html);
            });
        }
    };
});

 

app.controller('postsController', function ($scope,$state,$uibModal,$http,fetchrecordsCMSService,$localStorage,commonpostService,$location,$document,getProfileService) { 
    
    
    $scope.props = {
        target: '_blank' 
    }; 

    $scope.files = [];
    var errorDetails = function (serviceResp) {
      $scope.Error = "Something went wrong ??";
    };

     var fetch_profile = function (data) {
      $scope.ProfileInfo = data[0];        
      //alert(JSON.stringify($scope.ProfileInfo));  
     };
      getProfileService.getProfileinfo($localStorage.ses_userdata.users_id).then(fetch_profile, errorDetails);
      
     

      $scope.postdatainfo = {};
      $scope.uploadFiles = function(){
      var x = document.getElementById("mydiv");        
      x.style.display = "block";   
      $scope.form = [];
      $scope.files = [];
      var element = document.getElementById('imageFile');
      var FileUploadPath = element.value;
      var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
if(Extension){

  if (Extension == "gif" || Extension == "png" || Extension == "bmp" || Extension == "jpeg" || Extension == "jpg") {

      $scope.currentFile = element.files[0];  
    
        $scope.files = element.files;
        var reader = new FileReader();
        
          reader.onload = function(event) {
            $scope.image_source = event.target.result
            $scope.$apply(function($scope) {          
              $scope.files = element.files;
            });
          }
           reader.readAsDataURL(element.files[0]);    
         $scope.form.image = $scope.files[0];
          
         $http({
          method  : 'POST',
          url     : serviceurl+'API/addPosts',
          processData: false,
          transformRequest: function (data) {
              var formData = new FormData();
              formData.append("image", $scope.form.image);  
              formData.append("user_id", $localStorage.ses_userdata.users_id);
              formData.append("text", $scope.postdatainfo.post_content);  
              return formData;  
          },  
          data : $scope.form,
          headers: {
                 'Content-Type': undefined
          }
         }).then(function(response){          
                $scope.files = [];
                $scope.postdatainfo.post_content = '';  
                fetchrecordsCMSService.fetchrecordsCMS('','getPostlist',$localStorage.ses_userdata.users_id).then(get_list,errorDetails);      
         });  

       }else{
        
        bootbox.alert("Photo only allows file types of GIF, PNG, JPG, JPEG.");

     }  

     }else{
      //alert($scope.postdatainfo.post_content);
          var url = serviceurl + "API/addPostsTxt/";
          var object = { user_id:$localStorage.ses_userdata.users_id, text:$scope.postdatainfo.post_content};
          commonpostService.cmnpost(url,object).then(addPosts, errorDetails);  
     }  
    

  }

 //  function get_time_difference_php($created_time)
 // {
       
 //     date_default_timezone_set('America/Los_Angeles');
 //   // (UTC-08:00) Pacific Time (US/Canada)
 //        $str = strtotime($created_time);
 //        $today = strtotime(date('Y-m-d H:i:s'));
 //        // It returns the time difference in Seconds...
 //        $time_differnce = $today-$str;

 //        // To Calculate the time difference in Years...
 //        $years = 60*60*24*365;

 //        // To Calculate the time difference in Months...
 //        $months = 60*60*24*30;

 //        // To Calculate the time difference in Days...
 //        $days = 60*60*24;
  
 //        // To Calculate the time difference in Hours...
 //        $hours = 60*60;

 //        // To Calculate the time difference in Minutes...
 //        $minutes = 60;

 //        if(intval($time_differnce/$years) > 1)
 //        {
 //  //echo"i am in year";
 //  echo date("jS F, Y", strtotime($created_time)); 
 //           // echo intval($time_differnce/$years)." years ago";
 //        }
 //  else if(intval($time_differnce/$years) > 0)
 //        {
 //   //echo"i am in year1";
 //            //echo intval($time_differnce/$years)." year ago";
 //   echo date("jS F, Y", strtotime($created_time)); 
 //        }
 //  else if(intval($time_differnce/$months) > 1)
 //        {
 //   //echo"i am in month";
 //           // echo intval($time_differnce/$months)." months ago";
 //     echo date("jS F, Y", strtotime($created_time)); 
 //        }
 //  else if(intval(($time_differnce/$months)) > 0)
 //        {
 //  //echo"i am in month1";
 //  echo date("jS F, Y", strtotime($created_time)); 
 //           // echo intval(($time_differnce/$months))." month ago";
 //        }
 //  else if(intval(($time_differnce/$days)) > 1)
 //        {
     
 //  echo date("jS F, Y", strtotime($created_time)); 
 //        //   echo intval(($time_differnce/$days))." days ago";
 //        }
 //  else if (intval(($time_differnce/$days)) > 0) 
 //        {
  
 //  echo date("jS F, Y", strtotime($created_time)); 
             
 //         //  echo intval(($time_differnce/$days))." day ago";
 //        }
 //  else if (intval(($time_differnce/$hours)) > 1) 
 //        {
 //  //echo"i am in hour";
 //            echo intval(($time_differnce/$hours))." hours ago";
        
 //  }else if (intval(($time_differnce/$hours)) > 0) 
 //        {
 //  //echo"i am in hour1";
  
 //            echo intval(($time_differnce/$hours))." hour ago";
 //        }
 //  else if (intval(($time_differnce/$minutes)) > 1) 
 //        {
 //     echo intval(($time_differnce/$minutes))." minutes ago";
          
 //        }
 //  else if (intval(($time_differnce/$minutes)) > 0) 
 //        {
 //  //echo"i am in minutes1";
 //      echo intval(($time_differnce/$minutes))." minute ago";
           
 //        }
 //  else if (intval(($time_differnce)) > 1) 
 //        {
 //  echo intval(($time_differnce))." seconds ago";
          
 //        }
 //  else
 //        {
 //  //echo "else";
  
 //          echo  "few seconds ago";
 //        }
 //  }

  $scope.timeSince = function(date) {  
      date_default_timezone_set('America/Los_Angeles');
      var seconds = Math.floor((new Date() - date) / 1000);
      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
        return interval + " years ago";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return interval + " months ago";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return interval + " days ago";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return interval + " hours ago";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return interval + " minutes ago";
      }
      return Math.floor(seconds) + " seconds ago";
  }
 
    var addPosts = function (data) {
          
          //alert(JSON.stringify(data));
          $scope.files = [];
          $scope.postdatainfo.post_content = '';  
          if(data.status != '0'){
             fetchrecordsCMSService.fetchrecordsCMS('','getPostlist',$localStorage.ses_userdata.users_id).then(get_list,errorDetails); 
          }else{
            bootbox.alert('Error in posting feeds.');
          }
      };
      

     $scope.postdatalist = [];
   
     var get_list = function (data) {
         $scope.postdatalist =data;     
          //alert(JSON.stringify($scope.postdatalist));
          angular.forEach($scope.postdatalist, function(value, key) {
             $scope.postdatalist[key].lastactivity = $scope.timeSince(new Date(value.post_date)); 
            // $scope.postdatalist[key].txtContent = $scope.postdatalist[key].post_content;                    
          });
          // console.log(JSON.stringify($scope.postdatalist));     
       
     };

     fetchrecordsCMSService.fetchrecordsCMS('','getPostlist',$localStorage.ses_userdata.users_id).then(get_list,errorDetails); 
     
   
     $scope.selImage = function(){       
      $('#imageFile').click();
     }
     var deletePost = function (data) {
      fetchrecordsCMSService.fetchrecordsCMS('','getPostlist',$localStorage.ses_userdata.users_id).then(get_list,errorDetails); 
     };

     $scope.deletePost = function(id){
         //alert(id);
         bootbox.confirm("Do you want to delete this post ?", function(result){
            if(result ==  true){
                 var x = document.getElementById("mydiv");        
                 x.style.display = "block";   
                var url = serviceurl + "API/deletePost/";
                var object = { user_id:$localStorage.ses_userdata.users_id, post_id:id};
                commonpostService.cmnpost(url,object).then(deletePost, errorDetails);  
            }

         });
     }

      $scope.open_notes = function (post_id) {
         $localStorage.post_id = post_id;        
          var modalInstance = $uibModal.open({
              controller: 'PopupCont',
              templateUrl: 'templates/editpost.html',
          });
      } 

    

});



