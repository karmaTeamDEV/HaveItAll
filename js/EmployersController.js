(function () {
    'use strict';
    app.controller('EmployersController', function ($scope,$http,$state,employerService,$localStorage,$location,$document) { 
    $scope.employerInfo = {};
    
    var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	}; 

	var employer_register = function (data) { 
		if(data.status == 1){
			$localStorage.ses_userdata = data.list[0];	
		 	$state.go("user.dashboard");		    
     	}else{
     		bootbox.alert(data.message);
     	}
	};

    var regEmployer = function (data) {
     	//alert(JSON.stringify(data.list[0]));
     	if(data.status == 1){
     		$localStorage.ses_userdata = data.list[0];	
     		$scope.form = [];
			$scope.files = [];
     		var element = document.getElementById('profile_image');
			$scope.currentFile = element.files[0];	
			//alert($scope.currentFile);	
		 //if($scope.currentFile != undefined){		 	 
        	//var FileUploadPath = element.value;
        	//var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
   		// if (Extension == "gif" || Extension == "png" || Extension == "bmp" || Extension == "jpeg" || Extension == "jpg") {    

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
				  url     : serviceurl+'API/file_upload',
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
			   		//alert(JSON.stringify(response.data.message));
			   		$localStorage.ses_userdata.users_profilepic = response.data.message;
					$scope.ProfileInfo.users_profilepic = response.data.message;			 
					$('#mydiv').hide();					
			   }); 

			// }else{
			// 	bootbox.alert("Photo only allows file types of GIF, PNG, JPG, JPEG.");
			// 	return false;
			// }
		  //}
		   $state.go("user.dashboard");
		   //$state.go("user.appHome");
     	}else{
     		bootbox.alert(data.message);
     	}
    }; 

    $scope.selectFile = function() {	    	    	 
	 	 $("#profile_image").click();
	};
	

	 $scope.employerReg = function(ele){   

	 	var element = document.getElementById('profile_image');	 
	 	//alert(JSON.stringify(element));	 
		$scope.currentFile = element.files[0];
		var FileUploadPath = element.value;
        var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
        //alert(Extension);
        if(Extension != ''){        	 
        	if (Extension == "gif" || Extension == "png" || Extension == "bmp" || Extension == "jpeg" || Extension == "jpg") {    
				employerService.regEmployer($scope.employerInfo).then(regEmployer, errorDetails); 
			}else{
				bootbox.alert("Photo only allows file types of GIF, PNG, JPG, JPEG.");
				return false;
			}
        }else{
        	 	employerService.regEmployer($scope.employerInfo).then(employer_register, errorDetails); 
        } 
    	
	};
	 
	
  
})
})();
