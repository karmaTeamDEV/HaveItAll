app.controller('PopupCont', function ($scope,$http, $window,$uibModalInstance,commonpostService,$localStorage) {

	   $scope.close = function () {
            $scope.text = '';
            $localStorage.prouser_id = '';
            $localStorage.post_id = '';
            $uibModalInstance.dismiss('cancel');
       };	
       $scope.publishlist = {};	
       $scope.today = function () {
       	  $scope.publishlist.jobpost_id = $localStorage.publish_jobid;
          $scope.publishlist.startdate = new Date();
         // $scope.publishlist.enddate = new Date().setDate($scope.publishlist.startdate.getDate()+30);
          $scope.publishlist.enddate = get30days();   
          //alert($scope.publishlist.enddate);       
      };

      function get30days(){
        var now = new Date();
        now.setDate(now.getDate() + 30);
        now = new Date(now);
        var yyyy = now.getFullYear().toString();
        var mm = (now.getMonth()+1).toString();
        var dd  = now.getDate().toString();
        return  next30daysDate = yyyy+"-"+mm+"-"+dd;
      }


      $scope.mindate = new Date();
      $scope.dateformat="MM/dd/yyyy";
      $scope.today();
      $scope.showcalendar = function ($event) {
          $scope.showdp = true; 
      };
      $scope.showdp = false;

      $scope.showcalendar1 = function ($event) {
          $scope.showdp1 = true; 
      };
      $scope.showdp1 = false;
 

     var errorDetails = function (serviceResp) {
		  $scope.Error = "Something went wrong ??";
	   };


     var update_publish_status = function(data){
     	$uibModalInstance.dismiss('cancel');       
     	$window.location.reload(); 
   	 } 

      $scope.publish = function(){  
      $scope.publishlist.status = '3';
      //alert(JSON.stringify( $scope.publishlist));       
      var url = serviceurl + "API/updatepublish/";      
      commonpostService.cmnpost(url,$scope.publishlist).then(update_publish_status, errorDetails);       
      
    } 
    $scope.allnote = [];
     var get_all_notes = function(data){
      $scope.allnote = data;
      //alert(JSON.stringify($scope.allnote));    
    }

      var url = serviceurl + "API/getAllnotes/";  
      var obj = {note_to:$localStorage.prouser_id,note_by:$localStorage.ses_userdata.users_id};     
      commonpostService.cmnpost(url,obj).then(get_all_notes, errorDetails);

    var insertnotes = function(data){
      //alert(JSON.stringify(data)); 
      var url = serviceurl + "API/getAllnotes/";  
      var obj = {note_to:$localStorage.prouser_id,note_by:$localStorage.ses_userdata.users_id};     
      commonpostService.cmnpost(url,obj).then(get_all_notes, errorDetails);
      $scope.text = '';   
    }

    $scope.text = '';
    $scope.notePublish = function(text){
      if(text){
         var url = serviceurl + "API/insertnotes/";  
         var obj = {note_to:$localStorage.prouser_id,note_by:$localStorage.ses_userdata.users_id,note_text:text};
         //alert(JSON.stringify(obj));    
         commonpostService.cmnpost(url,obj).then(insertnotes, errorDetails);
      }else{
           bootbox.alert('Enter note');
      }       
    }

    $scope.culturefit = [];
    var getculturefitdata = function(data){
        //alert(JSON.stringify(data)); 
        $scope.culturefit = data[0];
        //alert(JSON.stringify($scope.culturefit));      
    }

    var url = serviceurl + "API/getculturefitdata/";  
    var obj = {cutype_id:$localStorage.cutype_id,users_id:$localStorage.ses_userdata.users_id};          
    commonpostService.cmnpost(url,obj).then(getculturefitdata, errorDetails);  

    var get_record = function(data){
         $uibModalInstance.dismiss('cancel');
    } 

     $scope.update = function(id){
        //alert(JSON.stringify($scope.culturefit));
        var url = serviceurl + "API/update_culturefit/";
        commonpostService.cmnpost(url,$scope.culturefit).then(get_record, errorDetails);   
     }
    
    
    $scope.postdata = {};
    var geteditpost = function(data){
         $scope.postdata = data;
         //alert(JSON.stringify($scope.postdata));
    }
 
if($localStorage.post_id != undefined){
    var url = serviceurl + "API/geteditpost/";  
    var obj = {post_id:$localStorage.post_id,users_id:$localStorage.ses_userdata.users_id};          
    commonpostService.cmnpost(url,obj).then(geteditpost, errorDetails); 
}
   $scope.remove_img = function(){      
     // alert(JSON.stringify($scope.postdata));    
      $scope.postdata.post_filename = '';
      // alert(JSON.stringify($scope.postdata));    
      $('#img').hide();
      $('#cross').hide();
     }

     

      $scope.savePost = function(){ 

        alert(JSON.stringify($scope.postdata));    
        var x = document.getElementById("mydiv");        
        x.style.display = "block";   
        $scope.form = [];
        $scope.files = [];
        var element = document.getElementById('imageFileEdit');
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
          url     : serviceurl+'API/editPost',
          processData: false,
          transformRequest: function (data) {
              var formData = new FormData();
              formData.append("image", $scope.form.image);  
              formData.append("user_id", $localStorage.ses_userdata.users_id);
              formData.append("post_content", $scope.postdata.post_content);  
              formData.append("post_id", $scope.postdata.post_id); 
              return formData;  
          },  
          data : $scope.form,
          headers: {
                 'Content-Type': undefined
          }
         }).then(function(response){                 
                $uibModalInstance.dismiss('cancel');
                $window.location.reload(); 
         });  

       }else{
        
        bootbox.alert("Photo only allows file types of GIF, PNG, JPG, JPEG.");

     }  

     }else{
       //alert(JSON.stringify($scope.postdata));    
          var editPosttxt = function(data){
            $uibModalInstance.dismiss('cancel');
            $window.location.reload(); 
           }
           
          var url = serviceurl + "API/editPosttxt/";
          $scope.postdata.user_id = $localStorage.ses_userdata.users_id;          
          commonpostService.cmnpost(url,$scope.postdata).then(editPosttxt, errorDetails);   
     }         
          
     }

     
      

});
 
