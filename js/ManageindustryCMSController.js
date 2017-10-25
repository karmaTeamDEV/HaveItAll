(function () {
  'use strict';
  app.controller('ManageindustryCMSController', function ($scope,$state,$localStorage,$location,$filter,$document,fetchrecordsCMSService,fetchIndustryiesService,fetchSingleRecordService,addeditIndustryService) { 

    if(parseInt($localStorage.ses_userdata.users_type) != 3){    
      $state.go("404");   
    }
    $scope.industry = {};  
    $scope.industriesList = [];

    var industryObj = {id:'', industry_id:'', name:'', status: '', cmsAction: 'Insert'};

    var errorDetails = function (serviceResp) {
      $scope.Error = "Something went wrong ??";
    };


    $scope.industrylist=[]; 
    var fetch_industry = function (data) {
      $scope.industrylist = data;
        //alert(JSON.stringify($scope.industrylist));
      };  
      fetchrecordsCMSService.fetchrecordsCMS('','getIndustryList','').then(fetch_industry, errorDetails); 

      
      var fetchIndustries = function (data) {
       $scope.industriesList = data;
       //alert(JSON.stringify($scope.industriesList));
     };   
     
     fetchIndustryiesService.fetchIndustries().then(fetchIndustries,errorDetails);

     var fetchIndustry = function (data) {
       industryObj.id = data[0].industry_id;
       $scope.industry.name = data[0].industry_name;
       $scope.industry.selectedstatus = data[0].industry_status;
       $('#mydiv').hide(); 
     }; 

     $scope.editIndustry = function(industryID){
       $('#mydiv').show(); 
       industryObj.cmsAction = "Edit";
      // $scope.industry.industry_id = {};

      fetchSingleRecordService.fetchsinglerecordCMS(industryID,'getIndustry').then(fetchIndustry,errorDetails);
      var someElement = angular.element(document.getElementById('industryfrmid'));
      $document.scrollToElementAnimated(someElement);
    };

    var fetchArea = function (data) {
     industryObj.id = data[0].area_id;
     $scope.industry.industry_id = data[0].industry_id;
     $scope.industry.name = data[0].area_name;
     $scope.industry.selectedstatus = data[0].area_status;
     $('#mydiv').hide(); 
   };

   $scope.editArea = function(id){
     $('#mydiv').show(); 
     industryObj.cmsAction = "Edit";

     fetchSingleRecordService.fetchsinglerecordCMS(id,'getfunctionalarea').then(fetchArea,errorDetails);
     var someElement = angular.element(document.getElementById('industryfrmid'));
     $document.scrollToElementAnimated(someElement);
   };

   var industryAddEditSuccess = function (data) {
	    	//var str = data.replace(/"/g,"");
        fetchIndustryiesService.fetchIndustries().then(fetchIndustries,errorDetails);
        fetchrecordsCMSService.fetchrecordsCMS('','getIndustryList','').then(fetch_industry, errorDetails); 
        if(data.message == undefined && data > 0){

         if(industryObj.cmsAction === "Insert"){
          bootbox.alert("Industry inserted successfully!");
          
        } else if(industryObj.cmsAction == "Edit"){
          bootbox.alert("Industry updated successfully!");
          
        }
        $scope.industry.name = '';
        //$scope.industry.industry_id = '';
        $scope.industry.selectedstatus = '';
        industryObj.id = '';
        industryObj.name = '';

        industryObj.status = '';
        industryObj.cmsAction = 'Insert';
        $scope.industrycmsForm.$setPristine();
        //fetchIndustryiesService.fetchIndustries().then(fetchIndustries,errorDetails);
      } else {
       bootbox.alert(data.message);
		       //alert(data.message);
         }		   
       };


       $scope.submitForm = function(industrycmsForm){
       //alert(JSON.stringify($scope.industry));

       industrycmsForm.$invalid = "true";
       industryObj.name = $scope.industry.name;
       industryObj.industry_id = $scope.industry.industry_id;
       if($scope.industry.selectedstatus !== undefined && $scope.industry.selectedstatus.length > 0){
        industryObj.status = $scope.industry.selectedstatus;
      } else {
        industryObj.status = '0';
      }
      
    	if(industryObj.cmsAction === "Insert" || industryObj.cmsAction === "Edit"){  //Insert
       if(industryObj.cmsAction === "Insert" && industryObj.status === '1'){
    	  	//alert("Inactive type category cannot be inserted!");
    	  	bootbox.alert("Inactive industry cannot be inserted!");
    	  }	else {
          var urlpath = serviceurl + "IndustryAPI/addEdit_industry/";
          //alert(JSON.stringify(industryObj));
          $scope.industrycmsForm.$setPristine();
          addeditIndustryService.addeditrecordCMS(industryObj,urlpath).then(industryAddEditSuccess, errorDetails);
        }
      } 
      
    };


  })
})();
