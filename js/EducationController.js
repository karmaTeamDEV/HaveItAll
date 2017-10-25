(function () {
	'use strict';
	app.controller('EducationController', function ($scope,$localStorage,$location,$timeout,$window,educationService,checkjobService,fetchrecordsCMSService,parentchilddeleteService,delchildService) { 
		$('#mydiv').show();
		$scope.educations = [];
	    var category = "education";
	    $scope.checkedParents = [];
	    $scope.degrees = [];
	    var user_id = $localStorage.ses_userdata.users_id;

	    var errorDetails = function (serviceResp) {
		   $scope.Error = "Something went wrong ??";
	    };
  

    $scope.toggleEducation = function(index,parenttypeID){
	    $timeout(function () {
	      $scope.educations[index].selected = $scope.educations[index].selected ? false : true;
          if ($scope.educations[index].selected || ($scope.educations[index].selected && $scope.checkedParents.indexOf(parenttypeID) > -1)){
            var update_education = function (data) {
				 	//alert(data.status);
				 	if(data.status == 'true'){	
				 		$scope.displaySuccessMsg = true;			
				 		$scope.successmsg = "Education updated successfully!";
				 	}else{
				 		$scope.displayFailsMsg = true;				
				 		$scope.failuresmsg = "Education couldn't be updated successfully!";
				 	}

				 	$timeout(function () {
				 		$scope.displaySuccessMsg = false;
				 		$scope.displayFailsMsg = false;

				 	}, 2000);   
				 };
            
		      var datalist = {user_id:user_id,status:$scope.educations[index].selected,type:category,education:parenttypeID};
			  educationService.addEducation(datalist).then(update_education, errorDetails);
	     }  else {		     
           var confirmTxtMsg = "Education category has some subcategories. Deleting education category deletes it's subcategories. Are you sure you want to delete?";

            bootbox.confirm({
               message: confirmTxtMsg,
			   buttons: {
			        confirm: {
			            label: 'Yes',
			            className: 'btn-success'
			        },
			        cancel: {
			            label: 'No',
			            className: 'btn-danger'
			        }
			    },
			    callback: function (result) {
			        if(result){
			        	var educationObj = {
			            'type_parent_id': parenttypeID,
						'type_userID': user_id
			       	  }; 

			       	  var deleteSuccess = function(data){
			       	    bootbox.alert(data);
			       	    $window.location.reload();

			       	  };
			       	  parentchilddeleteService.deleteparentchild(educationObj).then(deleteSuccess,errorDetails);
			        }
			    }
			});

   		   		 
	    }
	  });  
    };

    
    var fetchEducations = function(data){    	
    	$scope.educations=data;

    };

  
    var check_educations = function (data) {
		angular.forEach(data, function(value, key) {	     		
		   $scope.checkedParents.push(value.type_id);
	    });
	    
	};
	
    var edulist = {user_id:$localStorage.ses_userdata.users_id,type:category};
	checkjobService.checkedjobfit(edulist).then(check_educations, errorDetails);  
    fetchrecordsCMSService.fetchrecordsCMS('fetchEducations','','').then(fetchEducations, errorDetails); 


     $scope.edu_degrees = [];
    	var check_degrees = function (data) {
		 	angular.forEach(data, function(value, key) {	     		
		 		$scope.edu_degrees.push(value.type_id);
		 	});
		 	$('#mydiv').hide();
		};
                 
            
     var degreelist = {user_id:user_id,type:category};
	 checkjobService.checkedjobfit(degreelist).then(check_degrees, errorDetails);   

     $scope.toggleDegree = function toggleDegree(degreeId,checkStatus,parentID) {	   
         var update_degree = function (data) {
 	 	 //alert(data.status);

		 	if(data.status == 'true'){	
		 		$scope.displaySuccessMsg = true;			
		 		$scope.successmsg = "Education Degree updated successfully!";
		   	}else{
		 		$scope.displayFailsMsg = true;				
		 		$scope.failuresmsg = "Education Degree updated successfully!";
		 	}
		 	$timeout(function () {
		 		$scope.displaySuccessMsg = false;
		 		$scope.displayFailsMsg = false;
		 	}, 2000);   
		 };

		 if(checkStatus){
             var datalist = {user_id:user_id,status:checkStatus,type:category,education:degreeId};
			 educationService.addEducation(datalist).then(update_degree, errorDetails);
 	     } else {
 	     	 var subeducationObj = {
			            'type_child_id': degreeId,
						'type_userID': user_id
			       	  }; 

			       	  var childdeleteSuccess = function(data){
			       	    //alert(data);
	       	       		bootbox.alert(data);

			 };
			 delchildService.deletechild(subeducationObj).then(childdeleteSuccess,errorDetails);

 	     }
	};
   });

})();
