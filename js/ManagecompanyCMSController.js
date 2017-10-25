(function () {
  'use strict';
  app.controller('ManagecompanyCMSController', function ($scope,$state,$localStorage,$location,$filter,$document,fetchrecordsCMSService,fetchCompaniesService,fetchSingleRecordService,addeditIndustryService) { 
   
     if(parseInt($localStorage.ses_userdata.users_type) != 3){    
      $state.go("404");   
    }
      $scope.company = {};  
      $scope.companiesList = [];

      var companyObj = {id:'', name:'', status: '', cmsAction: 'Insert'};
      
      var errorDetails = function (serviceResp) {
        $scope.Error = "Something went wrong ??";
      };
      
      var fetchCompanies = function (data) {
       $scope.companiesList = data;
     };   
     
     fetchCompaniesService.fetchCompanies().then(fetchCompanies,errorDetails);

     var fetchCompany = function (data) {
       companyObj.id = data[0].company_id;
       $scope.company.name = data[0].company_name;
       $scope.company.selectedstatus = data[0].company_status;
       $('#mydiv').hide(); 
     }; 

     $scope.editCompany = function(companyID){
       $('#mydiv').show(); 
       companyObj.cmsAction = "Edit";
       
       fetchSingleRecordService.fetchsinglerecordCMS(companyID,'getCompany').then(fetchCompany,errorDetails);
       var someElement = angular.element(document.getElementById('companyfrmid'));
       $document.scrollToElementAnimated(someElement);
     };

     var companyAddEditSuccess = function (data) {
	    	//var str = data.replace(/"/g,"");
       if(data.message == undefined && data > 0){
        
         if(companyObj.cmsAction === "Insert"){
          bootbox.alert("Company inserted successfully!");
          
        } else if(companyObj.cmsAction == "Edit"){
          bootbox.alert("Company updated successfully!");
          
        }
        $scope.company.name = '';
        $scope.company.selectedstatus = '';
        companyObj.id = '';
        companyObj.name = '';
        companyObj.status = '';
        companyObj.cmsAction = 'Insert';
        $scope.companycmsForm.$setPristine();
        fetchCompaniesService.fetchCompanies().then(fetchCompanies,errorDetails);
      } else {
       bootbox.alert(data.message);
		       //alert(data.message);
        }		   
      };


      $scope.submitForm = function(industrycmsForm){
       
       industrycmsForm.$invalid = "true";
       companyObj.name = $scope.company.name;
       if($scope.company.selectedstatus !== undefined && $scope.company.selectedstatus.length > 0){
        companyObj.status = $scope.company.selectedstatus;
      } else {
        companyObj.status = '0';
      }
      
    	if(companyObj.cmsAction === "Insert" || companyObj.cmsAction === "Edit"){  //Insert
       if(companyObj.cmsAction === "Insert" && companyObj.status === '1'){
    	  	//alert("Inactive type category cannot be inserted!");
    	  	bootbox.alert("Inactive company cannot be inserted!");
    	  }	else {
          var urlpath = serviceurl + "IndustryAPI/addEdit_company/";
          addeditIndustryService.addeditrecordCMS(companyObj,urlpath).then(companyAddEditSuccess, errorDetails);
        }
      } 
      
    };

 
})
})();
