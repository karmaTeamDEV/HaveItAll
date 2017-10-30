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

app.controller('postsController', function ($scope,$state,$http,fetchrecordsCMSService,$localStorage,commonpostService,$location,$document,getProfileService) { 
     
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
       
     };

     fetchrecordsCMSService.fetchrecordsCMS('','getPostlist',$localStorage.ses_userdata.users_id).then(get_list,errorDetails); 
     
   
     $scope.selImage = function(){       
      $('#imageFile').click();
     }
     
});



