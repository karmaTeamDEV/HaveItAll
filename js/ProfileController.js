// Code goes here
app.directive('selectMultiple', function() { 
    return {
        restrict: 'E',
        require: ['ngModel'],
        replace: true,
        scope: true,
        template: '<input type="hidden" ui-select2="select2Options" class="form-element" style="width: 200px" />',
        controller: ['$scope', '$attrs','$localStorage',
            function($scope, $attrs,$localStorage) {
                // var options = [{
                //     text: 'Apple',
                //     id: 1
                // }, {
                //     text: 'Apricot',
                //     id: 2
                // }, {
                //     text: 'Avocado',
                //     id: 3
                // }, ];
                // var options =  $scope.location;
                var options = $localStorage.optionlist;
                //alert(JSON.stringify(options));
                 
                $scope.enums = {};
                angular.forEach(options, function(option, key){
                     $scope.enums[option.id] = option.text;
                });

                $scope.select2Options = {
                    data: options,
                    multiple: true,
                    minimumInputLength: 1,
                    formatResult: function(item) {
                        
                        return item.text;
                    },
                    formatSelection: function(item) {
                        return item.text;
                    },
                };
                
                $scope.transformToModel = $scope.$eval($attrs.transformToModel);
                $scope.transformToView = $scope.$eval($attrs.transformToView);
            }
        ],
        link: function(scope, element, attrs, ctrl) {

            ctrl[0].$formatters.push(function(modelValue){
                console.log('modelValue',modelValue);
                if(modelValue){
                    var viewValue = [];
                    angular.forEach(modelValue, function(value, key){
                        var viewItemValue = value;
                        if(scope.transformToView){
                            viewItemValue = scope.transformToView(value, scope.enums);
                        }
                        if(viewItemValue){
                            viewValue.push(viewItemValue);    
                        }
                    });
                    return viewValue;
                }
                return [];
            });
            ctrl[0].$parsers.push(function(viewValue) {
                //console.log('viewValue', viewValue);
                if (viewValue) {
                    var modelValue = [];
                    angular.forEach(viewValue, function(value, key) {
                        var modelItemValue = value;
                        if(scope.transformToModel){
                            modelItemValue = scope.transformToModel(value);
                        }
                        console.log('modelItemValue',modelItemValue);
                        if(modelItemValue){
                            modelValue.push(modelItemValue);    
                        }
                    });
                    return modelValue;
                }
                return [];
            });
        }
    }
})

app.directive('httpPrefix', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, controller) {
            function ensureHttpPrefix(value) {
                // Need to add prefix if we don't have http:// prefix already AND we don't have part of it
                if(value && !/^(https?):\/\//i.test(value)
                   && 'http://'.indexOf(value) === -1) {
                    controller.$setViewValue('http://' + value);
                    controller.$render();
                    return 'http://' + value;
                }
                else
                    return value;
            }
            controller.$formatters.push(ensureHttpPrefix);
            controller.$parsers.splice(0, 0, ensureHttpPrefix);
        }
    };
});
 
app.controller('ProfileController', function ($scope,$uibModal,$window,$mdDialog,commonpostService,$state,$timeout,$http,getfitService,$localStorage,$location,fetchrecordsCMSService,updateProfileService,removeImageService,getMatercmsService,getProfileService,checkjobService, $stateParams) { 
  	 
			 
		$scope.to_view_user_id = $stateParams.user_id;
		$scope.to_view_user_type = $stateParams.usertype;
		$scope.come_from_tab = $localStorage.tab_to_view ;
		$scope.c_type = $localStorage.tab_to_view;

		// alert($localStorage.tab_to_view);
		// alert($scope.to_view_user_id);
		 $scope.following = '';
		var fetch_user_follow_company_record = function(data){         
	        
	        //console.log(data);
	        if(data.id){
	        	$scope.following = data.id;
	        }
	        
     	 } 
 
	    var url_path = serviceurl + "API_following/following_user/" ;
		var parameter = {company_id:$scope.to_view_user_id,user_id:$localStorage.ses_userdata.users_id, following_type:'user'};
		commonpostService.cmnpost( url_path, parameter).then(fetch_user_follow_company_record, errorDetails);
		

		if ($stateParams.user_id) {

			$scope.to_view_user_id = $stateParams.user_id;
			$scope.to_view_userInfo_type = 1;
			if ($scope.to_view_user_type == 'company') {$scope.to_view_userInfo_type = 2;} else {$scope.to_view_userInfo_type = 1;}
			$scope.to_view_type = 'view';

		} 
		else {
			$scope.to_view_user_id = $localStorage.ses_userdata.users_id;
			$scope.to_view_userInfo_type = $localStorage.ses_userdata.users_type;
			$scope.to_view_type = 'user';
		}

		// $scope.openTab = function(url){
		// 	alert(url);
		// 	if(url){
		// 		$window.open(url, '_blank');
		// 	}else{
		// 		$window.open('#!/user/profile//', '_blank');
		// 	}
			
		// }

		$scope.onSwipeLeft = function(ev) {	
		  if($scope.userInfo_type== '2'){
		  	// var x = document.getElementById("mydiv");        
     //    	x.style.display = "block";
		  	$scope.go_to_next_user($scope.to_view_user_id,$scope.come_from_tab,'next');		
		  }	

		  if($scope.userInfo_type== '1'){
		  	// var x = document.getElementById("mydiv");        
     //    	x.style.display = "block";
		  	$scope.go_to_next_company($scope.to_view_user_id,$scope.c_type,'next');		
		  }			 
		    
		};

		$scope.onSwipeRight = function(ev) {
		   if($scope.userInfo_type== '2'){
		    // var x = document.getElementById("mydiv");        
      //   	x.style.display = "block";		  
		  	$scope.go_to_next_user($scope.to_view_user_id,$scope.come_from_tab,'prev'); 
		   }
		   if($scope.userInfo_type== '1'){
		   	// var x = document.getElementById("mydiv");        
      //   	x.style.display = "block";
		  	$scope.go_to_next_company($scope.to_view_user_id,$scope.c_type,'prev');		
		  }
		};

		var set_company_details = function(data){         
	        $scope.company_details = data[0];
	        //alert(JSON.stringfy(data[0]));
     	 }  


     $localStorage.prouser_id = '';
     $scope.open_notes = function (user_id) {
         $localStorage.prouser_id = user_id;
          //alert( $scope.prouser_id);
          var modalInstance = $uibModal.open({
              controller: 'PopupCont',
              templateUrl: 'templates/popupnote.html',
          });
      } 

     function fetch_company_details_from_job_post_id(user_id, company_id, follow_type) {
     		//alert(user_id);
          var url = serviceurl + "API_following/user_following_company/";
          var object = { user_id:user_id, company_id:company_id, following_type:follow_type }
          commonpostService.cmnpost(url,object).then(set_company_details, errorDetails);   

      }	

		var set_company_user_matching_criteria = function(data){         
	        $scope.company_user_matching_criteria = data;
	       // console.log(data) ;

     	 }   

     function fetch_company_user_matching_criteria(user_id, company_id) {
     		//alert(user_id);
          var url = serviceurl + "API_following/user_company_matching_criteria/";
          var object = { user_id:user_id, company_id:company_id }
          commonpostService.cmnpost(url,object).then(set_company_user_matching_criteria, errorDetails);   

      }	

	 $scope.follow_a_company_for_user = function (company_id) {

		//alert(company_id);
		//alert($scope.to_view_user_id);
		var url_path = serviceurl + "API_following/follow_company_by_user/" ;
		if($scope.userInfo_type == '2'){
			//alert('hi');
			var parameter = { company_id: company_id, user_id: $scope.to_view_user_id, following_type: 'company' };
		}else{
			var parameter = { company_id: company_id, user_id: $localStorage.ses_userdata.users_id, following_type: 'user' };
		}
		
		commonpostService.cmnpost( url_path, parameter).then(after_follow_company_for_user, errorDetails);
		//console.log($scope.companyList);	
	};

			var after_follow_company_for_user = function (data) {
				//console.log(data.del_id);	
				//$("#follow_unfollow_image").html('<img src="public/images/tick1.png" width="32">');

				$window.location.reload();
			};


			/* GOTO NEXT COMPANY */
			 $scope.go_to_next_company = function (company_id,c_type,lebel) {

				// alert(company_id);
				// alert(c_type);
				// alert(lebel);
				var x = document.getElementById("mydiv");        
        		x.style.display = "block";
				if(c_type == 'following'){
					var url_path = serviceurl + "API_following/user_following_company/";
					var parameter = { company_id: company_id, user_id: $localStorage.ses_userdata.users_id, following_type:'user',lebel:lebel};
				}

				if(c_type == 'following_me'){
					var url_path = serviceurl + "API_following/user_following_company/";
					var parameter = { company_id: company_id, user_id: $localStorage.ses_userdata.users_id,following_type:'company',lebel:lebel};
				}
				if(c_type == 'notviewed'){
					var url_path = serviceurl + "API_following/suggeted_company_for_user/";
					var parameter = { current_company_id: company_id, user_id: $localStorage.ses_userdata.users_id, view_status: 'NO',lebel:lebel};
				}
				if(c_type == 'viewed'){
					var url_path = serviceurl + "API_following/user_viewing_company/";
					var parameter = { company_id: company_id, user_id: $localStorage.ses_userdata.users_id, viewing_type:'user',lebel:lebel};
				}				
				
				commonpostService.cmnpost(url_path, parameter).then(after_next_company, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_next_company = function (data) {
				//alert(data[0].company_id);
				var x = document.getElementById("mydiv");        
        		x.style.display = "none";
				$state.go("user.profile", {user_id:data[0].company_user_id, usertype:'company'}, {reload: true});  	


			};


			/* GOTO NEXT USER */
			 $scope.go_to_next_user = function (user_id, show_tab, short_type) {

				 // alert(user_id);
				 // alert(show_tab);
				 // alert(short_type);
				var x = document.getElementById("mydiv");        
        		x.style.display = "block";
				 if (show_tab == 'applied_view') {

					var url_path = serviceurl + "API_following/applied_users_for_company/" ;
					var parameter = {company_id: $localStorage.ses_userdata.users_companyid ,status:'3',current_user_id: user_id,  short_type:short_type};

				}

				if (show_tab == 'vieweduser') {

					var url_path = serviceurl + "API_following/viewed_users_for_company/" ;
					var parameter = {company_id: $localStorage.ses_userdata.users_companyid ,status:'3',current_user_id: user_id,  short_type:short_type};

				} 


				if (show_tab == 'following') {

					var url_path = serviceurl + "API_following/users_following_by_company/" ;
					var parameter = {company_id: $localStorage.ses_userdata.users_companyid, following_type:'company', current_user_id: user_id, short_type:short_type};

				} 

				if (show_tab == 'following_me') {

					var url_path = serviceurl + "API_following/users_following_by_company/" ;
					var parameter = {company_id: $localStorage.ses_userdata.users_companyid, following_type:'user', current_user_id: user_id, short_type:short_type};

				} 

				if (show_tab == 'viewed') {

					var url_path = serviceurl + "API_following/user_viewing_by_company/" ;
					var parameter = { company_id: $localStorage.ses_userdata.users_companyid, viewing_type:'company', current_user_id: user_id, short_type:short_type };

				} 

				if (show_tab == 'not_viewed') {

					var url_path = serviceurl + "API_following/suggeted_users_for_company/" ;
					var parameter = {user_id: $localStorage.ses_userdata.users_id, view_status: 'NO', company_id: $localStorage.ses_userdata.users_companyid,  current_user_id: user_id, short_type:short_type };

				} 

				if (show_tab == 'suggested') {

					var url_path = serviceurl + "API_following/suggeted_users_for_company/" ;
					var parameter = {user_id:$localStorage.ses_userdata.users_id, company_id: $localStorage.ses_userdata.users_companyid, current_user_id: user_id, short_type:short_type };

				} 

				 commonpostService.cmnpost( url_path, parameter).then(after_next_user, errorDetails);
				// //console.log($scope.companyList);	
			};

			var after_next_user = function (data) {
				//alert(12);
				//console.log(data[0]);
				var x = document.getElementById("mydiv");        
        		x.style.display = "none";
				$state.go("user.profile", {user_id:data[0].next_user_id, usertype:'user'}, {reload: true});  	


			};


		//alert($scope.to_view_user_type)

		 $scope.ProfileInfo = [];
		 $scope.skilldata = [];
		 $scope.display_tab = true;
		 $scope.display_tab1 = false;
		 $scope.display_bio = true;
		 $scope.display_editBio = false;
		 $scope.editTab = true;
		 $scope.updatebio = true;

		 $scope.showAlert = function(ev,lebel,text) {     
		    $mdDialog.show(
		      $mdDialog.alert()
		       // .parent(angular.element(document.querySelector('#popupContainer')))
		        .clickOutsideToClose(true)
		        .title(lebel)
		        .textContent(text)
		        //.ariaLabel('Alert Dialog Demo')
		        .ok('close')
		        .targetEvent(ev)
		    );
		  };
		 $scope.statename = [];
		 
		 var fetch_locationrecord = function (data) {
			 //alert(JSON.stringify(data));
			 var statelist ='';
			 angular.forEach(data, function(value, key) {		 		 
		 	 	statelist =statelist+"<b class='blue'>"+value.name+":</b>  ";		 	 	 
		 	 	 angular.forEach(value.city, function(value1, key1) {
		 	 	 	statelist =statelist+value1.cityname+", ";
		 	 	 });
		 	 	 statelist =statelist+"<br>";		 		 
		 	 });
		 	 //alert(statelist);
		 	  bootbox.alert({
		 	  	    title: $scope.countryname,
				    message: statelist			    
			  });

		 };

		  $scope.countryname = '';
		  $scope.showAlertAll = function(ev,id,countryname) {		 	 
		 	$scope.countryname = countryname;
			var url = serviceurl + "API/getAlllocations/";
			var info = {country_id:id,user_id:$scope.to_view_user_id};
	        commonpostService.cmnpost(url,info).then(fetch_locationrecord, errorDetails);		    
		  }; 

		 var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		 };

		 $scope.states =[];
		var get_statelist = function (data) {     	
	     	$scope.states =data;
	     	$scope.cities =[];
	     };
	     var check_Titles = function (data) {     	
	    	$localStorage.optionlist = data.map(function(item){			
	          return {
	            text: item.type_name,            
	            id: item.type_id
	          };
	        }); 
	         //alert(JSON.stringify($localStorage.optionlist));
	      	$state.go("user.category", {}, {reload: true});     	 
    	 };	

	       
	      $scope.manage_title = function(){	      	
	      	 $localStorage.optionlist = [];
	      	 getfitService.fetchfit('titles').then(check_Titles, errorDetails); 	      	
	      } 
	    
	     $scope.getCountryStates = function(){  
	     	$('#mydiv').show();     	
	     	getMatercmsService.getListinfo('state',$scope.ProfileInfo.users_country).then(get_statelist, errorDetails);	   
	     }
	   //$localStorage.optionlist = [];
	 //   var fetch_locationlist = function (data) {
		//     $localStorage.optionlist = [];
		// 	$localStorage.optionlist = data.map(function(item){			
	 //          return {
	 //            text: item.locations_name,            
	 //            id: item.locations_id
	 //          };
	 //        }); 
		// };
	//fetchrecordsCMSService.fetchrecordsCMS('','getlocationsList','').then(fetch_locationlist, errorDetails);


	var get_skill = function (data) {	
        //$scope.skilldata = data;	
        $localStorage.optionlist = [];
		$localStorage.optionlist = data.map(function(item){			
          return {
            text: item.skills_name,            
            id: item.skills_id
          };
        });
        //alert(JSON.stringify($scope.skilldata));
    }; 
    fetchrecordsCMSService.fetchrecordsCMS('','getskillsList','').then(get_skill, errorDetails);
	

	    // City list 
	    $scope.cities =[];
		var get_citylist = function (data) {     	
	     	$scope.cities =data;     	
	     };
	     $scope.getStateCities = function(){
	     	$('#mydiv').show();     	
	     	getMatercmsService.getListinfo('city',$scope.ProfileInfo.users_state).then(get_citylist, errorDetails);	   
	     }
	     // $scope.getCities = function(){     	
	     // 	//$localStorage.users_city =$scope.Editprofile.users_city;     	   
	     // }

	    // Country List
	    $scope.countries=[];
		var get_countrylist = function (data) { 
	     	$scope.countries =data;     	
	     };
	    getMatercmsService.getListinfo('country','').then(get_countrylist, errorDetails);	

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
		  	//console.log( $scope.files[0]);
		  
			$scope.form.image = $scope.files[0];

	      	$http({
			  method  : 'POST',
			  url     : serviceurl+'API/file_upload',
			  processData: false,
			  transformRequest: function (data) {
			      var formData = new FormData();
			      formData.append("image", $scope.form.image);  
			      formData.append("user_id", $scope.to_view_user_id);  
			      return formData;  
			  },  
			  data : $scope.form,
			  headers: {
			         'Content-Type': undefined
			  }
		   }).then(function(response){
		       // console.log(response.data.message);
				$scope.ProfileInfo.users_profilepic = response.data.message;	
				$('#mydiv').hide();
		   });	
		    
	   }else{
	   		$('#mydiv').hide();
	   		bootbox.alert("Photo only allows file types of GIF, PNG, JPG, JPEG.");

	   }
	    //$('#mydiv').hide();  
	}
		
		$scope.profileView = function(type) {	 	 
		 	$scope.display_tab = false;
		 	$scope.display_tab1 = true;
		 	$scope.editTab = false;
		 	$scope.ProfileInfo.users_type = type;
	 	};

	 	$scope.bioView = function() {	 	 
		 	$scope.updatebio = false;
		 	$scope.display_bio = false;
		 	$scope.display_editBio = true;		 	
	 	};	 	

	 	var update_profile = function (data) {	  
	 	 //alert(JSON.stringify(data));  
		if(data != 'error'){
			//$state.go("user.profile"); 
			//bootbox.alert('profile updated successfully.');			 
			getProfileService.getProfileinfo($scope.to_view_user_id).then(fetch_profile, errorDetails);
			$scope.display_tab = true;
		 	$scope.display_tab1 = false;
		 	
		}else{			
			//bootbox.alert('error in update profile.');
		}
	};

	$scope.errordiv = false;
	$scope.isValidUrl = function (url){
	 var myVariable = url;	  
	    if(/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(myVariable)) {	     
	     $scope.errordiv = false;
	    } else {	     
	     $scope.errordiv = true;
	    }   
	}

	$scope.editProfile = function(){
		//console.log(JSON.stringify($scope.ProfileInfo));
		 
		$scope.ProfileInfo.user_id = $scope.to_view_user_id;		
		updateProfileService.updateProfile($scope.ProfileInfo).then(update_profile, errorDetails);
		$scope.display_tab = true;
		$scope.display_tab1 = false;
		$scope.display_bio = true;
		$scope.display_editBio = false;
		$scope.updatebio = true;
		$scope.editTab = true;
	};

	var fetch_location = function (data) {	
		 $scope.ctylist = data;		 	 
	 	 $scope.ProfileInfo.locations = [];
		 angular.forEach(data, function(value, key) {		 	 	 
		 		$scope.ProfileInfo.locations.push({code:parseInt(value.locations_id)});		  
		 });  
		  
		 
	};
	 $scope.skilldatalist  = [];
	var fetch_skilldatalist = function (data) {
	 	  $scope.skilldatalist = data;		
		 $scope.ProfileInfo.users_skills = [];
		 angular.forEach(data, function(value, key) {		 	 	 
		 		$scope.ProfileInfo.users_skills.push({code:parseInt(value.skills_id)});		  
		 });
       //alert(JSON.stringify(data));
	};


		 var fetch_profile = function (data) {	

		 	$scope.ProfileInfo = data[0]; 
		 	//console.log($scope.ProfileInfo);
		 	//alert(JSON.stringify($scope.ProfileInfo));	 
		 	var country_id = $scope.ProfileInfo.users_country;
			var state_id = $scope.ProfileInfo.users_state;
			
			if(country_id != ''){
				//alert(country_id);
				getMatercmsService.getListinfo('state',country_id).then(get_statelist, errorDetails);	
			}
			if(state_id != ''){
				//alert(state_id);
				getMatercmsService.getListinfo('city',state_id).then(get_citylist, errorDetails);	
			}

			fetchrecordsCMSService.fetchrecordsCMS('','getKeyskill',$scope.to_view_user_id).then(fetch_skilldatalist, errorDetails); 

 			fetchrecordsCMSService.fetchrecordsCMS('','getLocation',$scope.to_view_user_id).then(fetch_location, errorDetails);
		    fetchrecordsCMSService.fetchrecordsCMS('','getskillsList','').then(get_skill, errorDetails);
			//fetchrecordsCMSService.fetchrecordsCMS('','getlocationsList','').then(fetch_locationlist, errorDetails);
		 	//alert(JSON.stringify($scope.ProfileInfo.location)); 
		 	//alert(data[0].users_companyid); 

				if($scope.userInfo_type == '2'){
					//alert($localStorage.ses_userdata.users_companyid);
					$timeout(function() { fetch_company_details_from_job_post_id($scope.to_view_user_id, $localStorage.ses_userdata.users_companyid, 'company');  },  500);
				}else{
					$timeout(function() { fetch_company_details_from_job_post_id($localStorage.ses_userdata.users_id, data[0].users_companyid, 'user');  },  500);
				}


			

			$timeout(function() { fetch_company_user_matching_criteria($localStorage.ses_userdata.users_id, data[0].users_companyid);  },  500);
			//fetch_company_details_from_job_post_id($localStorage.ses_userdata.users_id, data[0].users_companyid, 'user');
		 	


		 };

		 getProfileService.getProfileinfo($scope.to_view_user_id).then(fetch_profile, errorDetails);
		
		 var remove_image = function (data) {
				if(data != 'error'){
					//bootbox.alert('Profile Image remove successfully.');
		 	  		$scope.ProfileInfo.users_profilepic='';	
				}else{
					bootbox.alert('Error in remove image.');
				}     	  	
		 };


			$scope.imageList = {};
			 $scope.remove = function(image){
			 	bootbox.confirm("Are you sure want to remove image ?", function(result){	 		
			 		if(result == true){	 			
						$scope.imageList.image = image;
						$scope.imageList.user_id = $scope.to_view_user_id;			
						//alert(JSON.stringify($scope.imageList));
						removeImageService.deleteimage($scope.imageList).then(remove_image, errorDetails);
			 		}
			 	})	
			 };

		
		 $scope.jobFitslist = [];
		 var check_jobFit = function (data) {
		 	$scope.jobFitslist = data;
		 	$scope.jobCnt = $scope.jobFitslist.length; 		
		 	//alert(JSON.stringify($scope.jobFitslist.length));	 	
		 };
		
		 //alert($scope.fitCount);
		 var list = {user_id:$scope.to_view_user_id,type:'job_fit'};
		 checkjobService.checkedjobfit(list).then(check_jobFit, errorDetails); 
		 $scope.employerfitslist = [];
		 var check_employerFit = function (data) {		 	
		 	$scope.employerfitslist = data;
		 	//alert(JSON.stringify($scope.employerfitslist));	 
		 	$scope.employerCnt = $scope.employerfitslist.length;		 			 
		 };

		 var list = {user_id:$scope.to_view_user_id,type:'employer_fit'};
		 checkjobService.checkedjobfit(list).then(check_employerFit, errorDetails); 

		 $scope.titlesList = [];
		 var check_titles = function (data) {		 	
		 	$scope.titlesList = data;	
		 	$scope.titleCnt = $scope.titlesList.length-1;
		 	//alert($scope.titlesList.length);	 	
		 	//alert(JSON.stringify($scope.titlesList));		 
		 };
		//var list = {user_id:$scope.to_view_user_id,type:'titles'};
		 fetchrecordsCMSService.fetchrecordsCMS('','gettitleData',$scope.to_view_user_id).then(check_titles, errorDetails);
		 //checkjobService.checkedjobfit(list).then(check_titles, errorDetails);


		 $scope.titlesLimit = 2;
		 $scope.subtitlesLimit = 2;
		 $scope.industryLimit = 2;
		 $scope.subindustryLimit = 3;
		 $scope.educationLimit = 2;
		 $scope.subeducationLimit = 3;
		 $scope.fitLimit = 3;
		 $scope.jobfitLimit = 3;
		 $scope.titlelebel= 'See More';
		 $scope.industrylebel= 'See More';
		 $scope.educationlebel= 'See More';
		 $scope.fitlebel= 'See More';
		 $scope.jobfitlebel= 'See More';	
		 var returnFun ='';
		 $scope.moreTitle = function(count,lebel,type){
		 	 
		 	if(lebel == 'Less'){
		 	
		 		 if(type=='titles'){
		 		 	$scope.titlesLimit = 2;
		 		 	$scope.subtitlesLimit = 2;
		 		 	$scope.titlelebel= 'See More';
		 		 	var returnFun = 'check_titles';
		 		 }else if(type=='Industry'){
		 		 	$scope.industryLimit = 2;
		 		 	$scope.subindustryLimit = 3;
		 		 	$scope.industrylebel= 'See More';
		 		 	var returnFun = 'check_industry';
		 		 }else if(type=='education'){
		 		 	$scope.educationLimit = 2;
		 		 	$scope.subeducationLimit = 3;
		 		 	$scope.educationlebel= 'See More';
		 		 	var returnFun = 'check_education';
		 		 }else if(type=='job_fit'){
		 		 	$scope.jobfitLimit = 3;
		 		 	$scope.jobfitlebel= 'See More';	
		 		 	var returnFun = 'job_fit';	 		 	
		 		 }else if(type=='employer_fit'){
		 		 	$scope.fitLimit = 3;
		 		 	$scope.fitlebel= 'See More';	
		 		 	var returnFun = 'employer_fit';	 		 	
		 		 }
		 		 
		 	}else{		 		
		 		
		 		if(type=='titles'){
		 		 	$scope.titlesLimit = count;
		 		 	$scope.subtitlesLimit = 10;
		 		 	$scope.titlelebel= 'Less';
		 		 	var returnFun = 'check_titles';
		 		 }else if(type=='Industry'){
		 		 	$scope.industryLimit = count;
		 		 	$scope.subindustryLimit = 100;
		 		 	$scope.industrylebel= 'Less';
		 		 	var returnFun = 'check_industry';
		 		 }else if(type=='education'){
		 		 	$scope.educationLimit = count;
		 		 	$scope.subeducationLimit = 100;
		 		 	$scope.educationlebel= 'Less';
		 		 	var returnFun = 'check_education';
		 		 }else if(type=='job_fit'){
		 		 	$scope.jobfitLimit = count;	
		 		 	$scope.jobfitlebel= 'Less';
		 		 	var returnFun = 'job_fit';		 		 	
		 		 }else if(type=='employer_fit'){
		 		 	$scope.fitLimit = count;	
		 		 	$scope.fitlebel= 'Less';
		 		 	var returnFun = 'employer_fit';		 		 	
		 		 }
		 		//$scope.lebel= 'Less';
		 	}
		 	var list = {user_id:$scope.to_view_user_id,type:type};		 		 		
		 	checkjobService.checkedjobfit(list).then(returnFun, errorDetails);		 	
		 }

		 $scope.educationList = [];
		 var check_education = function (data) {		 		
		 	$scope.educationList = data;
		 	//$scope.educationCnt = $scope.educationList.length;
		 	//alert(JSON.stringify($scope.educationList));	 	
		 };
		 
		 //var list = {user_id:$scope.to_view_user_id,type:'education'};
		 //checkjobService.checkedjobfit(list).then(check_education, errorDetails);
		 fetchrecordsCMSService.fetchrecordsCMS('','getlistEducation',$scope.to_view_user_id).then(check_education, errorDetails);

		  $scope.industryList = [];
		 var check_industry = function (data) {	

		 	$scope.industryList = data;
		 	//$scope.industryCnt = $scope.industryList.length;		 	
		 	//alert(JSON.stringify($scope.industryList));	 	
		 };
		 
		 //var list = {user_id:$scope.to_view_user_id,type:'Industry'};
		 fetchrecordsCMSService.fetchrecordsCMS('','getlistIndustry',$scope.to_view_user_id).then(check_industry, errorDetails);
		 //checkjobService.checkedjobfit(list).then(check_industry, errorDetails); 
		 // $scope.gallerylistitem = [];
		 // var fetch_gallerylist = function (data) {		 	
		 // 	$scope.gallerylistitem = data;		 	  	 	
		 // 	//alert(JSON.stringify($scope.gallerylistitem));		 
		 // };
		 
		 // fetchrecordsCMSService.fetchrecordsCMS('','getgalleryData',$scope.to_view_user_id).then(fetch_gallerylist, errorDetails);
		  
		   
		   $scope.transformToModel = function(viewItem){
		       if(viewItem && viewItem.id){
		           //console.log('viewItem',viewItem);
		           return { code: viewItem.id };    
		       }
		       return undefined;
		   };
		   
		   $scope.transformToView = function(modelItem, enums){
		       //console.log('modelItem',modelItem);
		       if(modelItem){
		           return { id: modelItem.code, text: enums[modelItem.code] }  
		       }
		       return undefined;
		   };

		   
		    $scope.showtab = 'textless';
		    $scope.showbtn= true;
		    $scope.hidebtn= false;
		    $scope.show = function(){
		    	$scope.showtab = 'textview';
		    	$scope.hidebtn= true;
		    	$scope.showbtn= false;	    	 
		    };
		    $scope.hide = function(){
		    	$scope.showtab = 'textless';
		    	$scope.showbtn= true;
		    	$scope.hidebtn= false;	  		    	 
		    };
		    $scope.localationlist = [];
		    var get_datalist = function (data) {
	    	$scope.localationlist = data;
	    	//alert("===="+JSON.stringify($scope.localationlist));	
	    	};
	    	//alert($scope.to_view_user_id);
	    fetchrecordsCMSService.fetchrecordsCMS('','getlocationdata',$scope.to_view_user_id).then(get_datalist, errorDetails); 
 
		 
});
 
