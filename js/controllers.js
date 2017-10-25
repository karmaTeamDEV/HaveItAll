angular.module("app.controllers",['app.services','ngStorage','duScroll']).value('duScrollDuration', 2000)
.controller("LoginController", function($scope,loginService,$location,$localStorage){
	$scope.userInfo = {};
	
	var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	};
	
	var fetchLogin = function (data) {
	   //alert(data.error);
	   if(data.error!=1){
	   	$localStorage.ses_userdata = data;
		 // alert(JSON.stringify($localStorage.ses_userdata));
		  //alert(parseInt($localStorage.ses_userdata.users_type));

		  if(parseInt($localStorage.ses_userdata.users_type) == 3){
		  	$location.path('/admin');   
		  }else{
		  	$location.path('/appHome');   
		  }
		}else{
			$scope.userInfo.username = '';		  
			$scope.userInfo.usrpasswrd = '';
			$scope.loginForm.$setPristine();
			alert(data.message);
		  //$location.path('/login');   
		}

	};
	
	$scope.login = function(loginForm){
		loginService.authenticateUser($scope.userInfo).then(fetchLogin, errorDetails);
	};

	$scope.register = function(){
		$location.path('/register');
	};
})
.controller("RegisterController", function($scope,$location,$localStorage,registeruserService){

	$scope.userregisterInfo = {};
	
	
	function resetForm(){

		$scope.userregisterInfo.first_name = '';
		$scope.userregisterInfo.last_name = '';
		$scope.userregisterInfo.username = '';
		$scope.userregisterInfo.password = '';
	}
	
	var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	};
	
	var registeruserSuccess = function (data) {
		//alert(data);
		if(data.success == 1){
			resetForm();
			bootbox.alert(data.message);			
			//alert(data.message);
			$location.path('/login');
		} else {
			bootbox.alert(data.error);
			//alert(data.error);
		}		   
	};
	
	$scope.registercompanyRuser = function(){	      

		 //alert(JSON.stringify($scope.userregisterInfo));
		  //alert($localStorage.ses_jobfit);	  
		  $scope.userregisterInfo.ses_employerfit = $localStorage.ses_employerfit;
		  $scope.userregisterInfo.ses_jobfit = $localStorage.ses_jobfit;
		  registeruserService.registerCompanyUser($scope.userregisterInfo).then(registeruserSuccess, errorDetails);

		};


	})
.controller("AppHomeController", function($scope,$localStorage,$location){
	
	if(!$localStorage.ses_userdata){
		$location.path('/login');
	}
	$scope.userInfo = {};
	$scope.logout = function(){
		$localStorage.ses_jobfit ='';
		$localStorage.ses_employerfit ='';
		$localStorage.ses_userdata ='';
		$localStorage.type ='';
		//$localStorage.$reset();
		$location.path('/login');      
	};

	$scope.userInfo_email = {};
	$scope.userInfo_email = $localStorage.ses_userdata.users_username;
    //alert($scope.userInfo);

})
.controller("AdminController", function($scope,$localStorage,$location){
	$scope.userInfo_email = {};
	$scope.userInfo_email = $localStorage.ses_userdata.users_username;

	if(parseInt($localStorage.ses_userdata.users_type) == 3){		 	

		if(!$localStorage.ses_userdata){
			$location.path('/login');
		}
		$scope.userInfo = {};
		$scope.logout = function(){
			$localStorage.ses_jobfit ='';
			$localStorage.ses_employerfit ='';
			$localStorage.ses_userdata ='';
			$localStorage.type ='';
		//$localStorage.$reset();
		$location.path('/login');      
	};
}else{
	$location.path('/404');   
}
})
.controller("ErrorController", function($scope,$localStorage,$location){
	
})
.controller("TermController", function($scope,$localStorage,$location){
	
})
.controller("PrivacyController", function($scope,$localStorage,$location){
	//alert('hi');
})
.controller("ForgotpswController", function($scope,$localStorage,$location,addeditrecordCMSService){
	$scope.userInfo ={};
	var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	};	 
	

	var fetch_profile = function (data) {     	
     		//alert(data);
     		if(data.error!=1){
     			//alert('Go to your email for your password.');
     			bootbox.alert('Go to your email for your password.');
     			$location.path('/login'); 
     		}else{
     			$scope.userInfo.username = '';
     			$scope.forgot.$setPristine();
     			bootbox.alert(data.message);	
     			//alert(data.message);
     		}


     	};

     	$scope.forgotPsw = function(){
	// alert(JSON.stringify($scope.userInfo)); 
	var fetchURL = 'API/singlerecord/';  
	// alert(fetchURL);  
	addeditrecordCMSService.addeditrecordCMS($scope.userInfo,fetchURL).then(fetch_profile,errorDetails);

};

})
.controller("ProfileController", function($scope,$localStorage,$location,getProfileService,checkjobService){
	
	if(!$localStorage.ses_userdata){
		$location.path('/login');
	}
	$scope.userInfo_email = {};
	$scope.userInfo_email = $localStorage.ses_userdata.users_username;
	$scope.userInfo = {};
	$scope.logout = function(){
		$localStorage.ses_jobfit ='';
		$localStorage.ses_employerfit ='';
		$localStorage.ses_userdata ='';
		$localStorage.type ='';
		//$localStorage.$reset();
		$location.path('/login');      
	};

	$scope.ProfileInfo = [];
	var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	};

	var fetch_profile = function (data) {		 	  
		$scope.ProfileInfo = data; 
		 	//alert(JSON.stringify($scope.ProfileInfo));            
		 };

		 getProfileService.getProfileinfo($localStorage.ses_userdata.users_id).then(fetch_profile, errorDetails);
		 $scope.jobFits = [];
		 var check_jobFit = function (data) {
		 	//alert(JSON.stringify(data));
		 	$scope.jobFits = data; 			 
		 };
		 var list = {user_id:$localStorage.ses_userdata.users_id,type:'job_fit'};
		 checkjobService.checkedjobfit(list).then(check_jobFit, errorDetails); 
		 $scope.employerFits = [];
		 var check_employerFit = function (data) {
		 	//alert(JSON.stringify(data));	
		 	$scope.employerFits = data;		 
		 };
		 var list = {user_id:$localStorage.ses_userdata.users_id,type:'employer_fit'};
		 checkjobService.checkedjobfit(list).then(check_employerFit, errorDetails); 

		 $scope.titles = [];
		 var check_titles = function (data) {
		 	//alert(JSON.stringify(data));	
		 	$scope.titles = data;		 
		 };
		 var list = {user_id:$localStorage.ses_userdata.users_id,type:'titles'};
		 checkjobService.checkedjobfit(list).then(check_titles, errorDetails);    

		})
.controller("EditProfileController", function($scope,$localStorage,$location,updateProfileService,getProfileService,fetchrecordsCMSService){	
	if(!$localStorage.ses_userdata){
		$location.path('/login');
	}

	
	
	// State  list
	$scope.states =[];
	var get_statelist = function (data) {     	
     	$scope.states =data;
     	$scope.cities =[];
     };   
     //$localStorage.users_country ='';
     $scope.getCountryStates = function(){  
     	//alert($scope.Editprofile.users_country);
     	//$localStorage.users_country =$scope.Editprofile.users_country;
     	var staticUrl = 'API/getStatelist/state/'+$scope.Editprofile.users_country;
     	fetchrecordsCMSService.fetchrecordsCMS(staticUrl).then(get_statelist, errorDetails);	   
     }

    // City list 
    $scope.cities =[];
	var get_citylist = function (data) {     	
     	$scope.cities =data;     	
     };

     $scope.getStateCities = function(){
     	//alert($scope.Editprofile.users_state); 
     	//$localStorage.users_state =$scope.Editprofile.users_state;
     	var staticUrl = 'API/getStatelist/city/'+$scope.Editprofile.users_state;
     	fetchrecordsCMSService.fetchrecordsCMS(staticUrl).then(get_citylist, errorDetails);	   
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

    var staticUrl = 'API/getStatelist/country';
    fetchrecordsCMSService.fetchrecordsCMS(staticUrl).then(get_countrylist, errorDetails);	


     $scope.userInfo_email = {};
     $scope.userInfo_email = $localStorage.ses_userdata.users_username;	

     $scope.Editprofile = {};
     $scope.Editprofile = {users_firstname:'',users_lastname:'',
     users_facebook_link:'',users_twitter_link:'',users_linkedin_link:'',users_istagram_link:'',
     users_bio:'', users_current_employer:'', users_current_title:'', users_country:'', users_state:'', users_city:''};
     $scope.logout = function(){
     	$localStorage.ses_jobfit ='';
     	$localStorage.ses_employerfit ='';
     	$localStorage.ses_userdata ='';
     	$localStorage.type ='';
		//$localStorage.$reset(); 
		$location.path('/login');      
	};

	$scope.updateProfilePhoto = function(){     	
     	 alert('hi');
     	
    }


	var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	};

	var update_profile = function (data) {	     	
		if(data != 'error'){
			$location.path('/profile'); 
		}else{
			$location.path('/edit-profile');
		}
	};

	$scope.editProfile = function(){
		
		$scope.Editprofile.user_id = $localStorage.ses_userdata.users_id;
		/*$scope.Editprofile.users_country = $localStorage.users_country;
		$scope.Editprofile.users_state = $localStorage.users_state;
		$scope.Editprofile.users_city = $localStorage.users_city;*/

		//alert(JSON.stringify($scope.Editprofile)); 
		updateProfileService.updateProfile($scope.Editprofile).then(update_profile, errorDetails);

	};
	
	var fetch_profile = function (data) {		 	  
		$scope.Editprofile = data;		
		//alert(JSON.stringify(parseInt($scope.Editprofile.users_country)));  
		var country_id = JSON.stringify(parseInt($scope.Editprofile.users_country));
		var state_id = JSON.stringify(parseInt($scope.Editprofile.users_state));
		
		if(country_id){
			var staticUrl = 'API/getStatelist/state/'+country_id;
			fetchrecordsCMSService.fetchrecordsCMS(staticUrl).then(get_statelist, errorDetails);	
		}
		if(state_id){
			var staticUrl = 'API/getStatelist/city/'+state_id;
			fetchrecordsCMSService.fetchrecordsCMS(staticUrl).then(get_citylist, errorDetails);	
		}
		
     	    
	};

	getProfileService.getProfileinfo($localStorage.ses_userdata.users_id).then(fetch_profile, errorDetails);
})
.controller("JobfitController", function($scope,$localStorage,$location,getemployerfitService,jobService,checkjobService,$timeout){	
	if(!$localStorage.ses_userdata){
		$location.path('/login');
	}
	$scope.userInfo = {};
	$scope.logout = function(){
		$localStorage.ses_jobfit ='';
		$localStorage.ses_employerfit ='';
		$localStorage.ses_userdata ='';
		$localStorage.type ='';
		//$localStorage.$reset();
		$location.path('/login');      
	};
	
	$scope.selectionfit=[];
	$scope.jobFits=[];
	$scope.checkedjobs=[];	
	$scope.displaySuccessMsg = false; 
	$scope.displayFailsMsg = false;

	var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	};

	var fetch_jobFit = function (data) {
		 //alert(JSON.stringify(data));
		 var fetch_jobFitList = data;
		 angular.forEach(fetch_jobFitList, function(value, key) {
		 	$scope.jobFits.push({typeId: value.type_id, typeName: value.type_name});
		 });
		};
		getemployerfitService.fetchemployerfit('job_fit').then(fetch_jobFit, errorDetails);

		var update_jobFit = function (data) {
		 	//alert(data.status);
		 	
		 	if(data.status == 'true'){	
		 		$scope.displaySuccessMsg = true;			
		 		$scope.successmsg = "Jobfit updated successfully!";
		 	}else{
		 		$scope.displayFailsMsg = true;				
		 		$scope.failuresmsg = "Jobfit updated successfully!";
		 	}


		 	$timeout(function () {
		 		$scope.displaySuccessMsg = false;
		 		$scope.displayFailsMsg = false;

		 	}, 2000);   

		 };


		 $scope.toggleJobfit = function toggleJobfit(jobFitTypeId,checkStatus) {	    
		 	var datalist = {user_id:$localStorage.ses_userdata.users_id,status:checkStatus,type:'job_fit',jobfit:jobFitTypeId};
		 	jobService.jobfit(datalist).then(update_jobFit, errorDetails);	  

		 };




		 $scope.jobinfo = [];
		 var check_jobFit = function (data) {
		 	var info  = data;
		 	angular.forEach(info, function(value, key) {	     		
		 		$scope.jobinfo.push(value.type_id);
		 	});
		 	//alert(JSON.stringify($scope.jobinfo));

		 };
		 var list = {user_id:$localStorage.ses_userdata.users_id,type:'job_fit'};
		 checkjobService.checkedjobfit(list).then(check_jobFit, errorDetails);   


}).controller("ManagetypesCMSController", function($scope,$localStorage,$location,$filter,$document,fetchrecordsCMSService,fetchsinglerecordCMSService,addeditrecordCMSService){
  
	$scope.userInfo_email = {};
    $scope.userInfo_email = $localStorage.ses_userdata.users_username;
    

  if(!$localStorage.ses_userdata){
		$location.path('/login');
	}
    $scope.userInfo = {};
   $scope.logout = function(){
    	$localStorage.$reset();
		$location.path('/login');      
    };

  if(parseInt($localStorage.ses_userdata.users_type) == 3){
    $scope.typecategory = {};
    $scope.sortingOrder = 'type_id';
    $scope.reverse = true;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.typecategoriesList = [];
	$scope.typecategories = [{typeCategoryID:'employer_fit',typeCategoryName:'Employer Fit'},{typeCategoryID:'job_fit',typeCategoryName:'Job Fit'},{typeCategoryID:'titles',typeCategoryName:'Titles'}];
	var typeCategory = {id:'', name:'', typecategory: '', status: '', cmsAction: 'Insert'};
	var fetchTypeCategoriesURL = 'API/gettypecategories/';
	var addEditTypeCategoriesURL = 'API/addEdit_typecategory/';
	var fetchSingleTypeCategoryURL = 'API/gettypecategory/';
    
    var errorDetails = function (serviceResp) {
	     $scope.Error = "Something went wrong ??";
    };
  
    var fetchTypeCategories = function (data) {
    	$scope.typecategoriesList = data;
        	
    };   
    
   	fetchrecordsCMSService.fetchrecordsCMS(fetchTypeCategoriesURL).then(fetchTypeCategories,errorDetails);

   	var fetchTypeCategory = function (data) {
   		fetchSingleTypeCategoryURL = 'API/gettypecategory/';
   		typeCategory.id = data.type_id;
   		$scope.typecategory.name = data.type_name;
		$scope.typecategory.selectedtypecategory = data.type_category;
		$scope.typecategory.selectedstatus = data.type_status;
    }; 

   	$scope.editTypeCategory = function(typeID){
         typeCategory.cmsAction = "Edit";
         fetchSingleTypeCategoryURL = fetchSingleTypeCategoryURL+typeID;
         fetchsinglerecordCMSService.fetchsinglerecordCMS(fetchSingleTypeCategoryURL).then(fetchTypeCategory,errorDetails);
         var someElement = angular.element(document.getElementById('typectgryfrmid'));
         $document.scrollToElementAnimated(someElement);
   	};

    var userUpdateSuccess = function (data) {
    	  if(data.message === undefined && parseInt(data) > 0){
		   	   if(typeCategory.cmsAction === "Insert"){
		   	   	bootbox.alert("Type Category inserted successfully!");
		   	   	 //alert("Type Category inserted successfully!");
		   	   } else if(typeCategory.cmsAction === "Edit"){
		   	   	bootbox.alert("Type Category updated successfully!");
                 //alert("Type Category updated successfully!"); 
		   	   }
			    $scope.typecategory.name = '';
				$scope.typecategory.selectedtypecategory = '';
				$scope.typecategory.selectedstatus = '';
				typeCategory.id = '';
				typeCategory.name = '';
				typeCategory.typecategory = '';
				typeCategory.status = '';
				typeCategory.cmsAction = 'Insert';
				$scope.typecategorycmsForm.$setPristine();
			   	fetchrecordsCMSService.fetchrecordsCMS(fetchTypeCategoriesURL).then(fetchTypeCategories,errorDetails);
	       } else {
	       	bootbox.alert(data.message);
		       //alert(data.message);
		   }		   
	};


    $scope.submitForm = function(typecategoryFrm){
    	typecategoryFrm.$invalid = "true";
    	var cmsURL = "";
    	typeCategory.name = $scope.typecategory.name;
    	typeCategory.typecategory = $scope.typecategory.selectedtypecategory;
    	if($scope.typecategory.selectedstatus !== undefined && $scope.typecategory.selectedstatus.length > 0){
    		typeCategory.status = $scope.typecategory.selectedstatus;
    	} else {
    		typeCategory.status = '0';
    	}
		
    	if(typeCategory.cmsAction === "Insert" || typeCategory.cmsAction === "Edit"){  //Insert
    	  if(typeCategory.cmsAction === "Insert" && typeCategory.status === '1'){
    	  	//alert("Inactive type category cannot be inserted!");
    	  	bootbox.alert("Inactive type category cannot be inserted!");
    	  }	else {
    		addeditrecordCMSService.addeditrecordCMS(typeCategory,addEditTypeCategoriesURL).then(userUpdateSuccess, errorDetails);
    	  }
    	} 
    	
    };

   }else{
		 	$location.path('/404');   
   }
}).controller("ManageUserCMSController", function($scope,$location, $localStorage,fetchrecordsCMSService, addeditrecordCMSService,$timeout){
	if(!$localStorage.ses_userdata){
		$location.path('/login');
	}

	$scope.displaySuccessMsg = false; 
	$scope.updatestatusmsg = '';
	$scope.userInfo_email = {};
	$scope.userInfo_email = $localStorage.ses_userdata.users_username;


	$scope.userInfo = {};
	$scope.logout = function(){
		$localStorage.ses_jobfit ='';
		$localStorage.ses_employerfit ='';
		$localStorage.ses_userdata ='';
		$localStorage.type ='';
		//$localStorage.$reset();
		$location.path('/login');      
	};
	if(parseInt($localStorage.ses_userdata.users_type) == 3){
		$scope.usersList = [];
		$scope.userscheckunchecklist = [];
		$scope.activeUsers=[];
		$scope.inactiveUsers=[];
		var fetchusersURL = 'API/getallusers/';
		var updateusersstatusURL = 'API/updateuserstatus';

		var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		};

		var fetchusers = function(data){
			$scope.usersList = data;
        //alert(JSON.stringify($scope.usersList));
    };

    fetchrecordsCMSService.fetchrecordsCMS(fetchusersURL).then(fetchusers,errorDetails);

    var userstatusUpdateSuccess = function (data) {
    	if(data.message === undefined && parseInt(data) > 0){
    		$scope.displaySuccessMsg = true;
    		$timeout(function () {
    			$scope.displaySuccessMsg = false;
    		}, 2000);
    		fetchrecordsCMSService.fetchrecordsCMS(fetchusersURL).then(fetchusers,errorDetails);
    	} else {
    		//alert(data.message);
    		bootbox.alert(data.message);
    	}           
    };   

    $scope.toggleUsersStatus = function toggleSelection(userID,userStatus,fname,lname) {  
    	var userstatusObj = {userId:'',userStatus:'',};
        if(userStatus == 0 || userStatus == 1){ //Active/InActive Users
        	userstatusObj.userId = userID;
        	if(userStatus == 0){
        		userstatusObj.userStatus = 1;
        		$scope.updatestatusmsg = fname+" "+lname+" inactivated successfully!";
        	} else if(userStatus == 1){
        		userstatusObj.userStatus = 0;
        		$scope.updatestatusmsg = fname+" "+lname+" activated successfully!";
        	}
        } 

        addeditrecordCMSService.addeditrecordCMS(userstatusObj,updateusersstatusURL).then(userstatusUpdateSuccess, errorDetails);

    };


    
    // $scope.updateUserStatus = function(){
    //    var activeInactiveUsersList = {users:$scope.userscheckunchecklist};
    //    addeditrecordCMSService.addeditrecordCMS(activeInactiveUsersList,updateusersstatusURL).then(addeditcategorySuccess, errorDetails);
    // };

}else{

	$location.path('/404');   
}


}).controller("HomeController", function($scope,getemployerfitService,$localStorage,$location,$document){  
	$scope.employerFits = [];
	$scope.selection=[];
	$scope.selectionfit=[];
	$scope.jobFits=[];
	$scope.isEmplyrfitSelected = true;
	$scope.showjobfits = false;
	$scope.isJobfitSelected = true;	 


	var someElement = angular.element(document.getElementById('fit'));
	$document.scrollToElementAnimated(someElement);

	$scope.showJobFitList = function(){
		var someElement = angular.element(document.getElementById('jobfit'));
		$document.scrollToElementAnimated(someElement);
	};

	var errorDetails = function (serviceResp) {
		$scope.Error = "Something went wrong ??";
	};
	var fetch_employerFit = function (data) {
		// alert(JSON.stringify(data));
		var fetch_employerFitList = data;
		angular.forEach(fetch_employerFitList, function(value, key) {
			$scope.employerFits.push({typeId: value.type_id, typeName: value.type_name});
		});
	};   

	getemployerfitService.fetchemployerfit('employer_fit').then(fetch_employerFit, errorDetails);


	var fetch_jobFit = function (data) {
		// alert(JSON.stringify(data));
		var fetch_jobFitList = data;
		angular.forEach(fetch_jobFitList, function(value, key) {
			$scope.jobFits.push({typeId: value.type_id, typeName: value.type_name});
		});
	};

  // toggle selection for a given employer_fit by name
  $scope.toggleSelection = function toggleSelection(employerFitTypeId) {	
  	var idx = $scope.selection.indexOf(employerFitTypeId);	
		 //Enabling/Disabling the NEXT button based on checkbox selection.	
		 if(idx == -1){
		 	$scope.isEmplyrfitSelected = false;
		 	$scope.showjobfits = true;	
		 } else if(idx == 0){
		 	$scope.isEmplyrfitSelected = true;
		 	$scope.showjobfits = false;	
		 }
		 // is currently selected		
		 if (idx > -1) {
		 	$scope.selection.splice(idx, 1);
		 } else {  // is newly selected
		 	$scope.selection.push(employerFitTypeId);
		 } 
		 $localStorage.ses_employerfit = $scope.selection.join(",");
		};

		getemployerfitService.fetchemployerfit('job_fit').then(fetch_jobFit, errorDetails);

		$scope.toggleJobfit = function toggleJobfit(jobFitTypeId) {		  
			var idx = $scope.selectionfit.indexOf(jobFitTypeId);
		  //Enabling/Disabling the EMPLOYER NEAR YOU button based on checkbox selection.	
		  if(idx == -1){
		  	$scope.isJobfitSelected = false;
		  } else if(idx == 0){
		  	$scope.isJobfitSelected = true;
		  }		
		 // is currently selected		
		 if (idx > -1) {
		 	$scope.selectionfit.splice(idx, 1);
		 } else {  // is newly selected
		 	$scope.selectionfit.push(jobFitTypeId);
		 }
		 //alert($scope.selection.join(","));
		 $localStorage.ses_jobfit = $scope.selectionfit.join(",");
		 //alert($localStorage.ses_jobfit);
		};
		$scope.navRegister=function(){
			$location.path("/register"); 	
		};    

	});


