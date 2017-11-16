/* ==========================================================================
Author: BAMADEB UPADHYAYA
Create date:  05/10/2017
Description:  dashboard js page
=============================================================================  */
(function () {
  'use strict';
  app.controller('dashboardController', function ($scope,$http,$window,$sce,$state,commonpostService,getemployerfitService,fetchrecordsCMSService,getfitService,checkjobService,$localStorage,$location,$document,$filter,$timeout) { 
    $scope.company_bio = '';
    $scope.family_friend = '';
    $scope.employerdata ={users_profilepic:''};
   // alert(JSON.stringify($localStorage.ses_userdata));
    if($localStorage.ses_userdata.users_profilepic != " "){      
      $scope.employerdata.users_profilepic = $localStorage.ses_userdata.users_profilepic;
    }
    $scope.next = function() {       
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 6) ;
    };
    
    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };
     $scope.skip = function() { 
     // alert($scope.company_bio); 
     // alert($scope.family_friend); 
     // alert(JSON.stringify($scope.selectionfit));  
     // alert(JSON.stringify($scope.selection));
     // alert(JSON.stringify($scope.selectionIndustry));
     // alert(JSON.stringify($scope.selectionSeniorityList));
     
     $scope.employerdata.users_id = $localStorage.ses_userdata.users_id;
     $scope.employerdata.company_bio = $scope.company_bio;
     $scope.employerdata.family_friend = $scope.family_friend;
     $scope.employerdata.jobfitlist = $scope.selectionfit;
     $scope.employerdata.employerfitlist = $scope.selection;
     $scope.employerdata.industrylist = $scope.selectionIndustry;
     $scope.employerdata.senioritylist = $scope.selectionSeniorityList;
     $scope.employerdata.benefitslist = $scope.benefitslist;
     var url = serviceurl + "API/addcompanyinfo/";    
     commonpostService.cmnpost(url,$scope.employerdata).then(fetch_record, errorDetails);
      
    }; 

    var fetch_record = function (data) {    
       //alert(JSON.stringify(data)); 
       $window.location.href = '#!/user/profile//'; 
    };  

    var fetch_employerFit = function (data) {    
       $scope.employerFits = data;     
    };
    getemployerfitService.fetchemployerfit('employer_fit').then(fetch_employerFit, errorDetails);
 
    var errorDetails = function (serviceResp) {
      $scope.Error = "Something went wrong ??";
    }; 
  
    var fetch_jobFit = function (data) {     
      $scope.jobFits = data;
      //alert(JSON.stringify($scope.jobFits));
    };
    getfitService.fetchfit('job_fit').then(fetch_jobFit, errorDetails);     
     
    var fetch_list = function (data) { 	
      $scope.industrydata = data;
  		//alert(JSON.stringify($scope.industrydata));
  	};
  	fetchrecordsCMSService.fetchrecordsCMS('','getIndustryList','').then(fetch_list, errorDetails);
    
    $scope.selectionfit = [];
    $scope.toggleJobfit = function toggleJobfit(jobFitTypeId) {     
      var idx = $scope.selectionfit.indexOf(jobFitTypeId);      
       // is currently selected   
       if (idx > -1) {
        $scope.selectionfit.splice(idx, 1);
       } else {  // is newly selected
        $scope.selectionfit.push(jobFitTypeId);
       }
       //alert(JSON.stringify($scope.selectionfit));    
    };

    $scope.selection = [];
    $scope.empnamelist =[];
    $scope.toggleSelection = function toggleSelection(employerFitTypeId,empname) {  
       var idx = $scope.selection.indexOf(employerFitTypeId);
       var name = $scope.empnamelist.indexOf(empname);

       if (idx > -1) {
        $scope.selection.splice(idx, 1);
         $scope.empnamelist.splice(empname, 1);
       } else {  // is newly selected
        $scope.selection.push(employerFitTypeId);
        $scope.empnamelist.push({name:empname,id:employerFitTypeId});
       } 
      // alert(JSON.stringify($scope.empnamelist));
    };
    $scope.selectionIndustryname =[];
    $scope.selectionIndustry = [];
    $scope.toggleIndustry = function toggleIndustry(industry_Id,industry_name) {      
      var idx = $scope.selectionIndustry.indexOf(industry_Id);
      var name = $scope.selectionIndustryname.indexOf(industry_name);
       
       if (idx > -1) {
        $scope.selectionIndustry.splice(idx, 1);
        $scope.selectionIndustryname.splice(name, 1);
       } else {  // is newly selected
        $scope.selectionIndustry.push(industry_Id);
        $scope.selectionIndustryname.push({name:industry_name,industry_id:industry_Id});
       }    
        //alert(JSON.stringify($scope.selectionIndustryname));  
    };
    $scope.levelList=[];  
    var fetch_seniority = function (data) {
      $scope.levelList = data;
      //alert(JSON.stringify($scope.levelList));
    };  
    fetchrecordsCMSService.fetchrecordsCMS('','getseniorityList','').then(fetch_seniority, errorDetails);

    
    $scope.selectionSeniorityList = [];
    $scope.toggleSeniority = function toggleSeniority(industry_id,id) {
      $scope.selectionSeniorityList.push({industry_id:industry_id,level_id:id});  
      //alert(JSON.stringify($scope.selectionSeniorityList)); 
    };
    	  
    $scope.select_file = function() {     
        $('#image_pro').click();
    }; 
    $scope.benefitslist = [];
    $scope.get_desc = function(id,text) {     
         $scope.benefitslist.push({id:id,desc:text});  
    };  

    $scope.updateProfilePhoto = function(element) {
      $scope.form = [];
      $scope.files = [];
      $('#mydiv').show();

        var fuData = document.getElementById('image_pro');
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
            formData.append("user_id", $localStorage.ses_userdata.users_id);  
            return formData;  
        },  
        data : $scope.form,
        headers: {
               'Content-Type': undefined
        }
       }).then(function(response){
            //alert(response.data.message);
        $scope.employerdata.users_profilepic = response.data.message;  
        $('#mydiv').hide();
       });  
        
     }else{
        $('#mydiv').hide();
        bootbox.alert("Photo only allows file types of GIF, PNG, JPG, JPEG.");

     }
      //$('#mydiv').hide();  
  } 
     
})
})();
