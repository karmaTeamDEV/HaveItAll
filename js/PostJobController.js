(function () {
  'use strict';
  app.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });

  app.controller('PostJobController', function ($scope,$window,$sce,$state,getProfileService,commonpostService,getMatercmsService,fetchrecordsCMSService,getfitService,checkjobService,$localStorage,$location,$document,$filter,$timeout) { 
      $scope.postjobinfo = {};
      $scope.today = function () {
          $scope.postjobinfo.jobpost_tilldata = new Date();
      }; 

      $scope.mindate = new Date();
      $scope.dateformat="MM/dd/yyyy";
      $scope.today();
      $scope.showcalendar = function ($event) {
          $localStorage.flag = '1';
          $scope.showdp = true;
          $localStorage.jobinfo.push({tilldata:$scope.postjobinfo.jobpost_tilldata});
      };     
     $scope.showdp = false;
      var now = new Date();
      now.setDate(now.getDate() + 30);
      now = new Date(now);
      var yyyy = now.getFullYear().toString();
      var mm = (now.getMonth()+1).toString();
      var dd  = now.getDate().toString();
      var  next30daysDate = yyyy+"-"+mm+"-"+dd;
      $scope.maxdate = next30daysDate;

     $localStorage.jobinfo = [];
     $scope.selectionJob =[];           
     $scope.industryinfo = {};
     $scope.industryinfo.action='insert';
     $scope.btndisble =  true; 
     $scope.btndisble1 =  false; 
      var errorDetails = function (serviceResp) {
        $scope.Error = "Something went wrong ??";
      };
      


      $scope.dataList = [];
      var get_datalist = function (data) {
        $scope.dataList = data;
       // console.log(JSON.stringify($scope.dataList));  
      }; 

      $scope.jobpostindustrylist = [];
      var get_jobpostindustrylist = function (data) {       
         $scope.jobpostindustrylist = data;
         $scope.areaList = [];
         
      };

      var get_resultdata = function(data){       
        $scope.postjobinfo.jobpost_id = data.status;
        $localStorage.jobpost_id = $scope.postjobinfo.jobpost_id;
        $scope.postjobinfo.action = 'update';
        fetchrecordsCMSService.fetchrecordsCMS('','getalljobdata',$scope.postjobinfo.jobpost_id).then(get_datalist, errorDetails);        
        fetchrecordsCMSService.fetchrecordsCMS('','getjobpostindustryList',$scope.postjobinfo.jobpost_id).then(get_jobpostindustrylist, errorDetails);
   
      }
      
      var check_industry = function (data) {
         //alert(JSON.stringify(data));       
        // $scope.postjobinfo.profile_industry = data; 
         //alert(JSON.stringify($scope.industryList));
           
         $scope.postjobinfo.users_id = $localStorage.ses_userdata.users_id;
         $scope.postjobinfo.users_companyid = $localStorage.ses_userdata.users_companyid;  
         $scope.postjobinfo.action = 'insert';
         var addurl = serviceurl + "API/addpostJob/";
         commonpostService.cmnpost(addurl,$scope.postjobinfo).then(get_resultdata, errorDetails);        
      };     
      fetchrecordsCMSService.fetchrecordsCMS('','getlistIndustry',$localStorage.ses_userdata.users_id).then(check_industry, errorDetails);
 
    $scope.next = function() {        
      if($scope.postjobinfo.jobpost_title == undefined){
         bootbox.alert('Job Title is required !');
         return false;
      }
      if($scope.selectionLevel.length == 0){
         bootbox.alert('Seniority / Level is required !');
         return false;
      }
      //console.log(JSON.stringify($scope.postjobinfo));       
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 3) ;
    };

    $scope.next1 = function() {      
     if($scope.postjobinfo.jobpost_title == undefined){
         bootbox.alert('Job Title is required !');
         return false;
      }
      if($scope.selectionLevel.length == 0){
         bootbox.alert('Seniority / Level is required !');
         return false;
      }     
       
      if($scope.postjobinfo.country_id == undefined){
         bootbox.alert('Country is required !');
         return false;
      }
      if($scope.postjobinfo.state_id == undefined){
         bootbox.alert('Prov/State is required !');
         return false;
      } 
      if($scope.postjobinfo.city_id == undefined){
         bootbox.alert('City is required !');
         return false;
      }
      // if($scope.postjobinfo.jobpost_jobtype == undefined){
      //    bootbox.alert('Job Type is required !');
      //    return false;
      // }
      // if($scope.postjobinfo.jobpost_url == undefined){
      //    bootbox.alert('Job Url is required !');
      //    return false;
      // }       
      //console.log(JSON.stringify($scope.postjobinfo));           
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 3) ;
    };

    $scope.next2 = function() {        
        var date = new Date();  
        var cur_data = $filter('date')(new Date(date),'yyyy-MM-dd');         
        //alert(cur_data);  

     if($scope.postjobinfo.jobpost_title == undefined){
         bootbox.alert('Job Title is required !');
         return false;
      }
      if($scope.selectionLevel.length == 0){
         bootbox.alert('Seniority / Level is required !');
         return false;
      }     
       
      if($scope.postjobinfo.country_id == undefined){
         bootbox.alert('Country is required !');
         return false;
      }
      if($scope.postjobinfo.state_id == undefined){
         bootbox.alert('Prov/State is required !');
         return false;
      } 
      if($scope.postjobinfo.city_id == undefined){
         bootbox.alert('City is required !');
         return false;
      }
      // if($scope.postjobinfo.jobpost_jobtype == undefined){
      //    bootbox.alert('Job Type is required !');
      //    return false;
      // }
      // if($scope.postjobinfo.jobpost_url == undefined){
      //    bootbox.alert('Job Url is required !');
      //    return false;
      // } 
      if($scope.postjobinfo.jobpost_tilldata == undefined){
           bootbox.alert('Job apply date is required !');
           return false;
      }
      if($scope.postjobinfo.jobpost_tilldata < cur_data) {           
           bootbox.alert('Error! The date that you selected has already passed.');
           return false;
        }       
      //console.log(JSON.stringify($scope.postjobinfo));           
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 3) ;
    };
    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

    // $scope.yearlistFrom = [25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0]; 
    // var toYearsList = [25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0];   
    // $scope.yearlistTo = [];
            
    // $scope.resetToYears = function(selectedFromYear){
    //     $scope.yearlistTo = toYearsList;
    //     $scope.yearlistTo = $scope.yearlistTo.slice(0,toYearsList.indexOf(selectedFromYear));
    //   } 

    $scope.levelList=[];  
    var fetch_seniority = function (data) {
      $scope.levelList = data;
      //alert(JSON.stringify($scope.levelList));
    };  
    fetchrecordsCMSService.fetchrecordsCMS('','getseniorityList','').then(fetch_seniority, errorDetails);

    var deleteRecord = function (data) { 
      $scope.industryinfo.action='insert';          
      fetchrecordsCMSService.fetchrecordsCMS('','getalljobdata',$scope.postjobinfo.jobpost_id).then(get_datalist, errorDetails);  
      fetchrecordsCMSService.fetchrecordsCMS('','getjobpostindustryList',$scope.postjobinfo.jobpost_id).then(get_jobpostindustrylist, errorDetails);
    };

    $scope.jobinfo = {};
    $scope.removeRecord =  function(jobpost_id,industry_id) { 
        $scope.btndisble =  true; 
        $scope.btndisble1 =  false;      
        var urlpath = serviceurl + "API/deletejobpostIndustry/";
        $scope.jobinfo.jobpost_id = jobpost_id;
        $scope.jobinfo.industry_id = industry_id;        
        commonpostService.cmnpost(urlpath,$scope.jobinfo).then(deleteRecord, errorDetails);
    };

    $scope.industrydatalist = [];
    var get_industry = function (data) {       
        $scope.industrydatalist = data;     
      //alert(JSON.stringify($scope.industrydata)); 
    };

    var fetch_industryinfo = function (data) { 
       //alert(JSON.stringify(data[0]));          
       $scope.industryinfo  = data[0];
       $scope.industryinfo.industry_id = $scope.industryinfo.type_id;
       fetchrecordsCMSService.fetchrecordsCMS('','getAreaList',$scope.industryinfo.type_id).then(fetch_area, errorDetails);   
       //alert(JSON.stringify($scope.industryinfo));  
       fetchrecordsCMSService.fetchrecordsCMS('','getIndustryList','').then(get_industry, errorDetails);  
       $scope.area = [];
       angular.forEach($scope.industryinfo.area, function(value, key) {
        if(value != ''){
            $scope.area = $scope.area.concat(value.area_id);         
        }
       });
       $scope.selection = $scope.area;            
       $scope.industryinfo.action='update';  
                 
    }; 

    $scope.editIndustry = function(id){ 
      $scope.btndisble =  true; 
      $scope.btndisble1 =  false;    
      fetchrecordsCMSService.fetchrecordsCMS('','getdatapostjob',id).then(fetch_industryinfo, errorDetails);
    }; 

    var fetch_area = function (data) {    
      $scope.areaList =  data;
      //alert(JSON.stringify($scope.areaList));      
    };  

    $scope.getArea =  function(id) { 
     // $localStorage.jobinfo[0].country;
      $scope.btndisble =  true; 
      $scope.btndisble1 =  false;       
      fetchrecordsCMSService.fetchrecordsCMS('','getAreaList',id).then(fetch_area, errorDetails); 
    };

    $scope.postjob = function(){       
      if($scope.postjobinfo.jobpost_title == undefined){
         bootbox.alert('Job Title is required !');
         return false;
      }
      if($scope.selectionLevel.length == 0){
         bootbox.alert('Seniority / Level is required !');
         return false;
      }       
      if($scope.postjobinfo.country_id == undefined){
         bootbox.alert('Country is required !');
         return false;
      }
      if($scope.postjobinfo.state_id == undefined){
         bootbox.alert('Prov/State is required !');
         return false;
      } 
      if($scope.postjobinfo.city_id == undefined){
         bootbox.alert('City is required !');
         return false;
      }
      // if($scope.postjobinfo.jobpost_jobtype == undefined){
      //    bootbox.alert('Job Type is required !');
      //    return false;
      // }
      // if($scope.postjobinfo.jobpost_url == undefined){
      //    bootbox.alert('Job Url is required !');
      //    return false;
      // } 
      if($scope.postjobinfo.jobpost_tilldata == undefined){
           bootbox.alert('Job apply date is required !');
           return false;
      } 
       
        // alert(JSON.stringify($scope.postjobinfo));
        $scope.postjobinfo.jobpost_employer = $scope.selectionEmployer;
        $scope.postjobinfo.jobpost_jobfit = $scope.selectionJob;
        $scope.postjobinfo.jobpost_seniority = $scope.selectionLevel;
        $scope.postjobinfo.users_id = $localStorage.ses_userdata.users_id;
        $scope.postjobinfo.users_companyid = $localStorage.ses_userdata.users_companyid; 
        $scope.postjobinfo.jobpost_status = '1'; 
        $scope.postjobinfo.action = 'edit';              
        //alert(JSON.stringify($scope.postjobinfo));
        var url = serviceurl + "API/addpostJob/";
        commonpostService.cmnpost(url,$scope.postjobinfo).then(postjob_record, errorDetails);    

      };

      var postjob_record = function(data){ 
        //alert('hi');
        //$scope.jobpostForm.$setPristine();  
            $localStorage.jobinfo = [];
            $localStorage.jobinfo.level = [];
            $localStorage.jobinfo.jobfit = [];
            $localStorage.flag = '';     
         $window.location.href = '#!/user/postjobview/';
      } 
    
      $scope.jobFitslist = [];
      var fetch_jobFit = function (data) {     
        $scope.jobFitslist = data;
        //alert(JSON.stringify($scope.jobFitslist));
      };
      getfitService.fetchfit('job_fit').then(fetch_jobFit, errorDetails);

      // var fetch_employerFit = function (data) {     
      //   $scope.employerFits = data;
      // };
      // getfitService.fetchfit('employer_fit').then(fetch_employerFit, errorDetails);

      $scope.all_master_title_data = [];
      var get_type = function (data) {        
        angular.forEach(data, function(value, key) {			
          $scope.all_master_title_data.push(value.type_name);
        });	
        //alert(JSON.stringify($scope.all_master_title_data));
      };      
      getfitService.fetchfit('titles').then(get_type, errorDetails);

      

     //  $scope.indastry_data = [];
     //  var fetch_list = function (data) { 	
     //    $scope.indastry_data = data;
    	// 	//alert(JSON.stringify($scope.indastry_data));
    	// };
    	// fetchrecordsCMSService.fetchrecordsCMS('','getIndustryList','').then(fetch_list, errorDetails);
     
    	
    	// var fetch_locationlist = function (data) { 	
    	// 	$scope.location_data = data;
      //    //alert(JSON.stringify($scope.location_data));
    	// };
    	// fetchrecordsCMSService.fetchrecordsCMS('','getlocationsList','').then(fetch_locationlist, errorDetails);


    	// var fetch_skilllist = function (data) {	
     //    $scope.skill_data = data;			 	
    	// }; 
     //  fetchrecordsCMSService.fetchrecordsCMS('','getskillsList','').then(fetch_skilllist, errorDetails);

      
       // $scope.industryList = [];
       // var check_industry = function (data) {       
       //    $scope.industryList = data; 
       //   //console.log(JSON.stringify($scope.industryList));        
       // };     
       // fetchrecordsCMSService.fetchrecordsCMS('','getlistIndustry',$localStorage.ses_userdata.users_id).then(check_industry, errorDetails);

     $scope.listjob = [];
     var check_jobFit = function (data) {        
       angular.forEach(data, function(value, key) {
          $scope.listjob.push(value.type_id);
          $scope.selectionJob.push(value.type_id);
       }); 
       //alert(JSON.stringify($scope.listjob));   
     };      
     var list_job_fit = {user_id:$localStorage.ses_userdata.users_id,type:'job_fit'};
     checkjobService.checkedjobfit(list_job_fit).then(check_jobFit, errorDetails);

     // $scope.employerFits = [];
     // var check_employerFit = function (data) {      
     //    $scope.employerFits = data;
     //    //alert(JSON.stringify($scope.employerFits));       
     // };
     // var list = {user_id:$localStorage.ses_userdata.users_id,type:'employer_fit'};
     // checkjobService.checkedjobfit(list).then(check_employerFit, errorDetails);

      // City list 
      $scope.cities =[];
      var get_citylist = function (data) {      
        $scope.cities =data;      
      };
      $scope.getStateCities = function(){ 
        $localStorage.flag = '1';
        $localStorage.jobinfo.push({state:$scope.postjobinfo.state_id});        
        getMatercmsService.getListinfo('city',$scope.postjobinfo.state_id).then(get_citylist, errorDetails);    
      }   

      //State List
      $scope.states =[];
      var get_statelist = function (data) {       
        $scope.states =data;
        $scope.cities =[];
      };

      $scope.getCountryStates = function(){ 
        $localStorage.flag = '1';
        $localStorage.jobinfo.push({country:$scope.postjobinfo.country_id});       
        //alert(JSON.stringify($localStorage.jobinfo));       
        getMatercmsService.getListinfo('state',$scope.postjobinfo.country_id).then(get_statelist, errorDetails);    
       }

       $scope.getcity = function(){  
        $localStorage.flag = '1';
        $localStorage.jobinfo.push({city:$scope.postjobinfo.city_id});           
            
       }
       $scope.getlink = function(){ 
        $localStorage.flag = '1'; 
        $localStorage.jobinfo.push({joburl:$scope.postjobinfo.jobpost_url});           
            
       }     

      // Country List
      $scope.countries=[];
      var get_countrylist = function (data) { 
        $scope.countries =data;       
      };
      getMatercmsService.getListinfo('country','').then(get_countrylist, errorDetails); 

      var fetch_profile = function (data) {
         $scope.postjobinfo.jobpost_description = data[0].users_bio;      
      };
      getProfileService.getProfileinfo($localStorage.ses_userdata.users_id).then(fetch_profile, errorDetails);

      $scope.selection = [];
      $scope.toggleSelection = function toggleSelection(id) {
      var idx = $scope.selection.indexOf(id);
      
      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }      
      // is newly selected
      else {
        $scope.selection.push(id);
      }
      //alert(JSON.stringify($scope.selection));      
    };

      $scope.selectionLevel =[];
      $localStorage.jobinfo.level = [];
      $scope.toggleSelectionLevel = function toggleSelectionLevel(id) {
        $localStorage.flag = '1';
        var idx = $scope.selectionLevel.indexOf(id);        
        // is currently selected
        if (idx > -1) {
          $scope.selectionLevel.splice(idx, 1);
          $localStorage.jobinfo.level.splice(idx, 1); 
        }      
        // is newly selected
        else {
          $scope.selectionLevel.push(id);
          $localStorage.jobinfo.level.push(id);
        }
        //alert(JSON.stringify($localStorage.jobinfo));       
      };      

      $localStorage.jobinfo.jobfit = [];
      $scope.toggleSelectionJob = function toggleSelectionJob(id) {
        $localStorage.flag = '1';
        var idx = $scope.selectionJob.indexOf(id);        
        // is currently selected
        if (idx > -1) {
          $scope.selectionJob.splice(idx, 1);
          $localStorage.jobinfo.jobfit.splice(idx, 1);
        }      
        // is newly selected
        else {
          $scope.selectionJob.push(id);
          $localStorage.jobinfo.jobfit.push(id);
        }
        //alert(JSON.stringify($scope.selectionLevel));       
      };

      $scope.selectionEmployer =[];
      $scope.toggleSelectionEmployer = function toggleSelectionEmployer(id) {
        var idx = $scope.selectionEmployer.indexOf(id);        
        // is currently selected
        if (idx > -1) {
          $scope.selectionEmployer.splice(idx, 1);
        }      
        // is newly selected
        else {
          $scope.selectionEmployer.push(id);
        }
        //alert(JSON.stringify($scope.selectionLevel));       
      };
      // $scope.indastryStatus = function(id){
      //   fetchrecordsCMSService.fetchrecordsCMS('','getAreaList',id).then(fetch_area, errorDetails);
      // }

      // var list_industry = function(data){
      //   //alert(JSON.stringify(data));
      //    fetchrecordsCMSService.fetchrecordsCMS('','getalljobdata',$scope.postjobinfo.jobpost_id).then(get_datalist, errorDetails);  
      //   $scope.postjobinfo.relation_id = data.relation_id;
      // }  
      // $scope.toggleSelectionIndastry = function(id,status) {
      //   // alert(id);alert(status);
      //   $scope.postjobinfo.jobpost_industry = id;
      //   $scope.postjobinfo.industry_status = status;
      //   //alert(JSON.stringify($scope.postjobinfo)); 
      //   var urlpath = serviceurl + "API/add_industry/";
      //   commonpostService.cmnpost(urlpath,$scope.postjobinfo).then(list_industry, errorDetails); 
      //   //alert(JSON.stringify($scope.selectionLevel));       
      // };
      // var list_area = function(data){
      //    fetchrecordsCMSService.fetchrecordsCMS('','getalljobdata',$scope.postjobinfo.jobpost_id).then(get_datalist, errorDetails);  
      //  // alert(JSON.stringify(data));
      //  // $scope.postjobinfo.relation_id = data.relation_id;
      //  $scope.postjobinfo.area_relation_id = data.area_relation_id;
      // }
       
      // $scope.toggleSelectionArea = function(id,status) {
      //   $scope.postjobinfo.jobpost_area = id;
      //   $scope.postjobinfo.area_status = status;
      //   //alert(JSON.stringify($scope.postjobinfo)); 
      //   var urlpath = serviceurl + "API/add_functionality_area/";
      //   commonpostService.cmnpost(urlpath,$scope.postjobinfo).then(list_area, errorDetails);       
      // }; 
      
      $scope.searchFromMaster = function(typedthings){
        $localStorage.flag = '1';
        $scope.searchResult = $filter('filter')($scope.all_master_title_data, typedthings);          
        if(typedthings.length === 0){
          $localStorage.jobinfo.splice({title:$scope.postjobinfo.jobpost_title});
          $scope.showLoader = false;          
        }else{
          $localStorage.jobinfo.splice({title:$scope.postjobinfo.jobpost_title});
          $localStorage.jobinfo.push({title:$scope.postjobinfo.jobpost_title});
        }
        //console.log(JSON.stringify($localStorage.jobinfo));
      }

      var manage_industry = function (data) {
        $scope.industryForm.$setPristine();
        $scope.btndisble1 =  true; 
        $scope.btndisble =  false; 
        $scope.selection = [];
        $scope.industryinfo.action='insert';
        fetchrecordsCMSService.fetchrecordsCMS('','getalljobdata',$scope.postjobinfo.jobpost_id).then(get_datalist, errorDetails);        
        fetchrecordsCMSService.fetchrecordsCMS('','getjobpostindustryList',$scope.postjobinfo.jobpost_id).then(get_jobpostindustrylist, errorDetails);
        //alert(JSON.stringify($scope.postjobinfo.industry_id));

      };

      $scope.manageindustry = function(){
      //alert(JSON.stringify($scope.selection));
      if($scope.selection == ''){
        bootbox.alert('Relevant Titles is required!');
        return false;
      }
     // $scope.industryinfo.industry_id = $scope.postjobinfo.industry_id;
      $scope.industryinfo.jobpost_id = $scope.postjobinfo.jobpost_id;
      $scope.industryinfo.area = $scope.selection;      
      $scope.industryinfo.users_id = $localStorage.ses_userdata.users_id; 
      $scope.industryinfo.users_companyid = $localStorage.ses_userdata.users_companyid;
      //console.log(JSON.stringify($scope.industryinfo));  
      var urlpath = serviceurl + "API/manageindustry/";
      commonpostService.cmnpost(urlpath,$scope.industryinfo).then(manage_industry, errorDetails); 
    };

    $scope.reset_jobfit = function(){
          $scope.listjob = [];
          $scope.selectionJob = [];
    };

   
    

})
})();
