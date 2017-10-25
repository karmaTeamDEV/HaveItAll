(function () {
    'use strict';
    app.controller('EditProfileController', function ($http,$scope,$state,$localStorage,$location,getMatercmsService,removeImageService,updateProfileService,getProfileService,fetchrecordsCMSService) { 
   
	  
	$('#mydiv').show();
	// State  list
	$scope.states =[];
	var get_statelist = function (data) {     	
     	$scope.states =data;
     	$scope.cities =[];
     };   
    
     $scope.getCountryStates = function(){  
     	$('#mydiv').show();     	
     	getMatercmsService.getListinfo('state',$scope.Editprofile.users_country).then(get_statelist, errorDetails);	   
     }

    // City list 
    $scope.cities =[];
	var get_citylist = function (data) {     	
     	$scope.cities =data;     	
     };

     $scope.getStateCities = function(){
     	$('#mydiv').show();     	
     	getMatercmsService.getListinfo('city',$scope.Editprofile.users_state).then(get_citylist, errorDetails);	   
     }
     $scope.getCities = function(){     	
     	//$localStorage.users_city =$scope.Editprofile.users_city;     	   
     }

    // Country List
    $scope.countries=[];
	var get_countrylist = function (data) {     	
     	//alert(JSON.stringify(data));
     	$scope.countries =data;     	
     };

    getMatercmsService.getListinfo('country','').then(get_countrylist, errorDetails);	



     $scope.Editprofile = {};
     // $scope.Editprofile = {users_firstname:'',users_lastname:'',
     // users_facebook_link:'',users_twitter_link:'',users_linkedin_link:'',users_istagram_link:'',
     // users_bio:'', users_current_employer:'', users_current_title:'', users_country:'', users_state:'', users_city:''};
    
	 $scope.selectFile = function() {
	 	 $("#msds").click();
	 };

     $scope.updateProfilePhoto = function(element) {
		$scope.form = [];
		$scope.files = [];

    	$('#mydiv').show();

    	var fuData = document.getElementById('msds');
        var FileUploadPath = fuData.value;
        var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
	if (Extension == "gif" || Extension == "png" || Extension == "bmp" || Extension == "jpeg" || Extension == "jpg" || Extension == "JPG" || Extension == "JPEG" || Extension == "BMP" || Extension == "PNG" || Extension == "GIF") {

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
		  	//console.log( $scope.files[0]);
		  
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
		       // console.log(response.data.message);
				$scope.Editprofile.users_profilepic = response.data.message;	
				$('#mydiv').hide();
		   });	
		    
   }else{
   		$('#mydiv').hide();
   		bootbox.alert("Photo only allows file types of GIF, PNG, JPG, JPEG.");

   }
    //$('#mydiv').hide();  
}


	var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	};

	var update_profile = function (data) {	     	
		if(data != 'error'){
			$state.go("user.profile"); 
		}else{			
			$state.go("user.editprofile");
		}
	};

	$scope.editProfile = function(){
		//alert(JSON.stringify($scope.Editprofile));
		$scope.Editprofile.user_id = $localStorage.ses_userdata.users_id;		
		updateProfileService.updateProfile($scope.Editprofile).then(update_profile, errorDetails);

	};

	var remove_image = function (data) {
		if(data != 'error'){
			//bootbox.alert('Profile Image remove successfully.');
 	  		$scope.Editprofile.users_profilepic='';	
		}else{
			bootbox.alert('Error in remove image.');
		}     	  	
     };


	$scope.imageList = {};
	 $scope.remove = function(image){
	 	bootbox.confirm("Are you sure want to remove image ?", function(result){	 		
	 		if(result == true){	 			
				$scope.imageList.image = image;
				$scope.imageList.user_id = $localStorage.ses_userdata.users_id;			
				//alert(JSON.stringify($scope.imageList));
				removeImageService.deleteimage($scope.imageList).then(remove_image, errorDetails);
	 		}
	 	})	
	 };
	
	var fetch_profile = function (data) {		 	  
		$scope.Editprofile = data[0];	
		//alert(JSON.stringify($scope.Editprofile));
		var country_id = $scope.Editprofile.users_country;
		var state_id = $scope.Editprofile.users_state;
		
		if(country_id!==''){
			//alert(country_id);
			getMatercmsService.getListinfo('state',country_id).then(get_statelist, errorDetails);	
		}
		if(state_id!==''){
			//alert(state_id);
			getMatercmsService.getListinfo('city',state_id).then(get_citylist, errorDetails);	
		}    	    
	};
	$scope.CategoryList = {};	
	var fetch_category = function (data) {
		$scope.CategoryList = data;
		//alert(JSON.stringify($scope.CategoryList));	
	};
	
	fetchrecordsCMSService.fetchrecordsCMS('','getCategoryList','').then(fetch_category, errorDetails); 
	$('#mydiv').show();
	getProfileService.getProfileinfo($localStorage.ses_userdata.users_id).then(fetch_profile, errorDetails);
})
})();
