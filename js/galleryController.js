(function () {
'use strict';
app.controller('galleryController', function ($scope,$http,$state,$localStorage,fetchrecordsCMSService) {   
 
$scope.ses_usersid = $localStorage.ses_userdata.users_id;

 var errorDetails = function (serviceResp) {
	$scope.Error = "Something went wrong ??";
 };
 var fetchGallery = function (data) {		 	
 	
 	if(data.length > 0){
 		$scope.inputs = data; 
 	} 	 
 	//alert($scope.inputs.length); 	 
 };

fetchrecordsCMSService.fetchrecordsCMS('','getgalleryList',$localStorage.ses_userdata.users_id).then(fetchGallery, errorDetails);


var delGallery = function (data) { 	  
 	fetchrecordsCMSService.fetchrecordsCMS('','getgalleryList',$localStorage.ses_userdata.users_id).then(fetchGallery, errorDetails);
 };

$scope.removeInput = function (index,gallery_id) {
	fetchrecordsCMSService.fetchrecordsCMS('','deleteGallery',gallery_id).then(delGallery, errorDetails);
    $scope.inputs.splice(index, 1);
}; 

$scope.uploadImage = function(element) {
		//alert(JSON.stringify(element));
		$scope.form = [];
		$scope.files = [];

    	//$('#mydiv').show();

    	var fuData = document.getElementById('galleryimage');
        var FileUploadPath = fuData.value;
        var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
         
	if (Extension == "gif" || Extension == "png" || Extension == "bmp" || Extension == "jpeg" || Extension == "jpg") {
		 
		$scope.currentFile = element.files[0];
		$scope.files = element.files;
		    var reader = new FileReader();
			//console.log( $scope.files );
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
			  url     : serviceurl+'API/gallery_upload',
			  processData: false,
			  transformRequest: function (data) {
			      var formData = new FormData();
			      formData.append("image", $scope.form.image);			      			      
			      formData.append("user_id", $localStorage.ses_userdata.users_id);  
			      return formData;  
			  },  
			  data : $scope.form,
			  headers: {
			         'Content-Type': undefined
			  }
		   }).then(function(response){
		   	 	bootbox.alert('Image uploaded successfully.');
		       // console.log(response.data.message);
				//$scope.inputs.imagename = response.data.message;	
				//$('#mydiv').hide();
			fetchrecordsCMSService.fetchrecordsCMS('','getgalleryList',$localStorage.ses_userdata.users_id).then(fetchGallery, errorDetails);
				
		   });	
		    
	   }else{
	   		$('#mydiv').hide();
	   		bootbox.alert("Photo only allows file types of GIF, PNG, JPG, JPEG.");

	   }
	    //$('#mydiv').hide();  
	}


	

})
})();
