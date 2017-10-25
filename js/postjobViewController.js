(function () {
    'use strict';
    app.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });

 
    app.controller('postjobViewController', function ($filter,$timeout,$uibModal,$stateParams,$mdDialog,$window,$scope,checkjobService ,getMatercmsService,$state,getfitService,$localStorage,commonpostService,fetchrecordsCMSService) { 
     $scope.panelnav = true;
     $scope.posted_name = '';
     $scope.panelnav1 = false;
     $scope.listTab = true; 
     $scope.viewjobTab = false; 
     $scope.editjobTab = false; 
     $scope.industryinfo= {action:'insert'};
     $scope.editpostjob ={jobpost_employer:[],jobpost_jobfit:[],jobpost_seniority:[]};
     $scope.desclimit = 100;
     $scope.jobtitle = 'Manage Jobs';
     $scope.param_job_id = $stateParams.job_id;


      if($scope.param_job_id){
          $scope.come_from_tab = $localStorage.come_from_tab;
          $scope.jobpost_status = $localStorage.jobpost_status;
          $scope.listTab = false; 
          $scope.viewjobTab = true; 
          $scope.jobtitle = 'Job Details';

          $scope.viewpostjob = [];
          var get_jobdetails = function (data) { 
            //alert(JSON.stringify(data[0]));
            $scope.viewpostjob = data[0];    
          }; 
          //alert(jobid);
          var url = serviceurl + "API/getjobpost/"; 
          var object = {id:$scope.param_job_id}
          commonpostService.cmnpost(url,object).then(get_jobdetails, errorDetails);
      }

       $scope.onSwipeLeft = function(ev) {

        // var x = document.getElementById("mydiv");        
        // x.style.display = "block";
        $scope.go_to_next_user($scope.param_job_id,$scope.come_from_tab,$scope.jobpost_status,'next');          
      };

      $scope.onSwipeRight = function(ev) {
           // var x = document.getElementById("mydiv");        
           // x.style.display = "block";         
          $scope.go_to_next_user($scope.param_job_id,$scope.come_from_tab,$scope.jobpost_status,'prev');       
      };

      /* GOTO NEXT USER */
       $scope.go_to_next_user = function (job_id, show_tab,status, short_type) {
         // alert(job_id);
         // alert(show_tab);
         // alert(short_type);
          var x = document.getElementById("mydiv");        
          x.style.display = "block";
          var url_path = serviceurl + "API/getpostjobList/" ;
          var parameter = {id:$localStorage.ses_userdata.users_companyid,status:status,current_job_id: job_id,  short_type:short_type};
          commonpostService.cmnpost( url_path, parameter).then(after_next_user, errorDetails);
        // //console.log($scope.companyList); 
      };

      var after_next_user = function (data) {
        //console.log(data[0]);         
       $window.location.href = "#!/user/postjobview/"+data[0].jobpost_id; 

      };

       

     //alert($scope.param_job_id);

     $scope.open = function (jpbpostID) {
          $localStorage.publish_jobid = jpbpostID;      
          var modalInstance = $uibModal.open({
              controller: 'PopupCont',
              templateUrl: 'templates/popup.html',
          });
      } 

     $scope.today = function () {
          $scope.editpostjob.jobpost_tilldata = new Date();
      };
      $scope.mindate = new Date();
      $scope.dateformat="MM/dd/yyyy";
      $scope.today();
      $scope.showcalendar = function ($event) {
          $scope.showdp = true;
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
     // $scope.yearlistFrom = ['25','24','23','22','21','20','19','18','17','16','15','14','13','12','11','10','9','8','7','6','5','4','3','2','1','0']; 
     // var toYearsList = ['25','24','23','22','21','20','19','18','17','16','15','14','13','12','11','10','9','8','7','6','5','4','3','2','1','0'];   
     // $scope.yearlistTo = [];
     //alert(JSON.stringify($localStorage.ses_userdata.name));   
    if($localStorage.ses_userdata.name != " "){
      $scope.posted_name = $localStorage.ses_userdata.name;
    }else{
      $scope.posted_name = $localStorage.ses_userdata.company_name;
    }

    // function htmlToPlaintext(text) {
    //   return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    // } 
     
    // alert($scope.posted_name);
     //alert(JSON.stringify($localStorage.ses_userdata));    
    // $scope.resetToYears = function(selectedFromYear){
    //     $scope.yearlistTo = toYearsList;
    //     $scope.yearlistTo = $scope.yearlistTo.slice(0,toYearsList.indexOf(selectedFromYear));
    //   } 
    $scope.reset_url = function(){      
      $window.location.reload();
    }

    $scope.reset_url = function(){      
      $window.location.reload();
    }


    $scope.levelList=[];  
    var fetch_seniority = function (data) {
      $scope.levelList = data;
      //alert(JSON.stringify($scope.levelList));
    };  
    fetchrecordsCMSService.fetchrecordsCMS('','getseniorityList','').then(fetch_seniority, errorDetails);
     $scope.activeList = function(tab){
      if(tab == 1){
        $scope.panelnav = false;
        $scope.panelnav1 = false;
        $scope.panelnav2 = true;
        $scope.panelnav3 = false;
      }
      if(tab == 2){
        $scope.panelnav = true;
        $scope.panelnav1 = false;
        $scope.panelnav2 = false;
        $scope.panelnav3 = false;
      }
      if(tab == 3){
        $scope.panelnav = false;
        $scope.panelnav1 = false;
        $scope.panelnav2 = false;
        $scope.panelnav3 = true;
      }
      if(tab == 4){
        $scope.panelnav = false;
        $scope.panelnav1 = true;
        $scope.panelnav2 = false;
        $scope.panelnav3 = false;
      }
     	 
     };

     var errorDetails = function (serviceResp) {
		  $scope.Error = "Something went wrong ??";
	   };
	 	 $scope.jobpostlist = [];	
     var fetch_arraylist = function(data){     	
     	$scope.jobpostlist = data;
     	//console.log(JSON.stringify(data));
     }

      var x = document.getElementById("mydiv");        
      x.style.display = "block";
   
     var url = serviceurl + "API/getpostjobList/";
     var obj = {id:$localStorage.ses_userdata.users_companyid,status:'1'}
     commonpostService.cmnpost(url,obj).then(fetch_arraylist, errorDetails);

     $scope.jobpostincompletelist = []; 
     var fetch_incompletejoblist = function(data){      
      $scope.jobpostincompletelist = data;
      //console.log(JSON.stringify(data));
     }
   
     var url = serviceurl + "API/getpostjobList/";
     var obj = {id:$localStorage.ses_userdata.users_companyid,status:'0'}
     commonpostService.cmnpost(url,obj).then(fetch_incompletejoblist, errorDetails);

     var fetch_arraylistinactive = function(data){     	
     	$scope.jobpostlistinactive = data;
     	//alert(JSON.stringify(data));
     }

     var url = serviceurl + "API/getpostjobList/";
     var obj = {id:$localStorage.ses_userdata.users_companyid,status:'2'}
     commonpostService.cmnpost(url,obj).then(fetch_arraylistinactive, errorDetails);  

     $scope.jobpostlistpublish = [];
     var fetch_arraylistpublish = function(data){ 
      var x = document.getElementById("mydiv");        
      x.style.display = "none";     
      $scope.jobpostlistpublish = data;
      //alert(JSON.stringify(data));
     }

     var url = serviceurl + "API/getpostjobList/";
     var obj = {id:$localStorage.ses_userdata.users_companyid,status:'3'}
     commonpostService.cmnpost(url,obj).then(fetch_arraylistpublish, errorDetails);    
 	 
 	  
 	 var get_joblist = function(data){  	 	  	
 	 	  //alert(JSON.stringify(data));
     	var url = serviceurl + "API/getpostjobList/";
      var obj = {id:$localStorage.ses_userdata.users_companyid,status:'0'}
      commonpostService.cmnpost(url,obj).then(fetch_incompletejoblist, errorDetails);
     	var obj = {id:$localStorage.ses_userdata.users_companyid,status:'1'}
     	commonpostService.cmnpost(url,obj).then(fetch_arraylist, errorDetails);
	    var obj = {id:$localStorage.ses_userdata.users_companyid,status:'2'}
	    commonpostService.cmnpost(url,obj).then(fetch_arraylistinactive, errorDetails); 
      var obj = {id:$localStorage.ses_userdata.users_companyid,status:'3'}
      commonpostService.cmnpost(url,obj).then(fetch_arraylistpublish, errorDetails);
     }

 	 $scope.inactivePostjob = function(jobid){ 
      //alert(jobid);
      var url = serviceurl + "API/inactivePostjob/";
      var obj = {jobid:jobid,status:'2'}
      commonpostService.cmnpost(url,obj).then(get_joblist, errorDetails);

 	 	// fetchrecordsCMSService.fetchrecordsCMS('','inactivePostjob',jobid).then(get_joblist, errorDetails);  	 	  
 	 }
       
      
      $scope.reset = function(jid){
          $scope.listTab = true; 
          $scope.editjobTab = false; 
      } 

      

      var fetch_jobFit = function (data) {     
        $scope.jobFits = data;
      };
      getfitService.fetchfit('job_fit').then(fetch_jobFit, errorDetails);



      // var fetch_employerFit = function (data) {     
      //   $scope.employerFits = data;
      // };
      // getfitService.fetchfit('employer_fit').then(fetch_employerFit, errorDetails);

      $scope.all_master_title_data = [];
      var get_type = function (data) {
        //$scope.all_master_title_data = data; 
         angular.forEach(data, function(value, key) {     
          $scope.all_master_title_data.push(value.type_name);
        });         
      };      
      getfitService.fetchfit('titles').then(get_type, errorDetails);

      $scope.industryList = [];
       var check_industry = function (data) {       
       $scope.industryList = data;          
          //alert(JSON.stringify($scope.industryList));   
       };     
     fetchrecordsCMSService.fetchrecordsCMS('','getlistIndustry',$localStorage.ses_userdata.users_id).then(check_industry, errorDetails);



      $scope.indastry_data = {};
      var fetch_list = function (data) {     
        $scope.indastry_data = data;
          //alert(JSON.stringify($scope.indastry_data));
     };
     fetchrecordsCMSService.fetchrecordsCMS('','getIndustryList','').then(fetch_list, errorDetails);

     $scope.jobpostindustrylist = [];
      var get_jobpostindustrylist = function (data) {       
         $scope.jobpostindustrylist = data;
         $scope.areaList = [];         
      };

     
     
     // var fetch_locationlist = function (data) {   
     //      $scope.location_data = data;
     //    //alert(JSON.stringify($scope.location_data));
     // };
     // fetchrecordsCMSService.fetchrecordsCMS('','getlocationsList','').then(fetch_locationlist, errorDetails);



     // var fetch_skilllist = function (data) { 
     //    $scope.skill_data = data;                 
     // }; 
     // fetchrecordsCMSService.fetchrecordsCMS('','getskillsList','').then(fetch_skilllist, errorDetails);


    $scope.areaList = [];
    var fetch_area = function (data) {    
      $scope.areaList =  data;             
    };
    $scope.getArea =  function(id) {       
      fetchrecordsCMSService.fetchrecordsCMS('','getAreaList',id).then(fetch_area, errorDetails); 
    };

    // var getlocationlist = function (data) {   
    //       $scope.editpostjob.locations = data;
    //     //alert(JSON.stringify($scope.location_data));
    //  };

    var fetch_arrayjoblist = function(data){   
          //fetchrecordsCMSService.fetchrecordsCMS('','getlocationsList','').then(getlocationlist, errorDetails);
          $scope.editpostjob = data[0]; 
          //alert(JSON.stringify($scope.editpostjob));     
          fetchrecordsCMSService.fetchrecordsCMS('','getjobpostindustryList',$scope.editpostjob.jobpost_id).then(get_jobpostindustrylist, errorDetails);   
          //fetchrecordsCMSService.fetchrecordsCMS('','getAreaList',$scope.editpostjob.jobpost_industry).then(fetch_area, errorDetails);
          $scope.selectionLevel =[];
          angular.forEach($scope.editpostjob.seniority, function(value, key) {
               $scope.selectionLevel.push(value.seniority_id);
          });

          $scope.selectionJob =[];
          angular.forEach($scope.editpostjob.jobfit, function(value, key) {
               $scope.selectionJob.push(value.type_id);
          });

          $scope.selectionEmployer =[];
          angular.forEach($scope.editpostjob.employerfit, function(value, key) {
               $scope.selectionEmployer.push(value.type_id);
          });

          //alert(JSON.stringify($scope.selectionLevel));   
          $scope.editpostjob.locations = [];
          angular.forEach($scope.editpostjob.location, function(value, key) {
               $scope.editpostjob.locations.push(value.locations_id);
          }); 
           
          // $scope.editpostjob.jobpost_industry = [];
          // angular.forEach($scope.editpostjob.arealist, function(value1, key1) {
          //      $scope.editpostjob.jobpost_industry.push(value1.industry_id);
          // });

          // $scope.editpostjob.jobpost_skills = [];
          // angular.forEach($scope.editpostjob.skill, function(value2, key2) {
          //      $scope.editpostjob.jobpost_skills.push(value2.skills_id);
          // });
          // $scope.editpostjob.jobpost_jobfit = [];          
          // angular.forEach($scope.editpostjob.jobfit, function(value3, key3) {
          //      $scope.editpostjob.jobpost_jobfit.push(value3.type_id);
          // });
          // $scope.editpostjob.jobpost_employer = [];
          // angular.forEach($scope.editpostjob.employerfit, function(value4, key4) {
          //      $scope.editpostjob.jobpost_employer.push(value4.type_id);
          // });           
          // $scope.editpostjob.jobpost_seniority = [];
          // angular.forEach($scope.editpostjob.seniority, function(value5, key5) {
          //      $scope.editpostjob.jobpost_seniority.push(value5.seniority_id);
          // });
          getMatercmsService.getListinfo('state',$scope.editpostjob.jobpost_countryid).then(get_statelist, errorDetails);
          getMatercmsService.getListinfo('city',$scope.editpostjob.jobpost_stateid).then(get_citylist, errorDetails);

          $scope.editpostjob.country_id =$scope.editpostjob.jobpost_countryid;
          $scope.editpostjob.state_id = $scope.editpostjob.jobpost_stateid;
          $scope.editpostjob.city_id= $scope.editpostjob.jobpost_cityid;
          $scope.editpostjob.jobpost_title= $scope.editpostjob.title_name;
          $scope.editpostjob.jobpost_status = $localStorage.jstatus;
         // alert(JSON.stringify($scope.editpostjob.jobpost_cityid));           
      }  
      
      $scope.updatejob = function(jid,status=''){
           $localStorage.jstatus = status;
           $scope.jobtitle = 'Edit A Job';
          //alert(status);
          //$scope.editpostjob.jobpost_id = jid;
          //$scope.editpostjob.users_companyid = $localStorage.ses_userdata.users_companyid;
          //$scope.editpostjob.users_id = $localStorage.ses_userdata.users_id;
          //alert(JSON.stringify($scope.editpostjob)); 
          fetchrecordsCMSService.fetchrecordsCMS('','getalljobdata',jid).then(get_datalist, errorDetails);
          $scope.listTab = false; 
          $scope.editjobTab = true; 
          var url = serviceurl + "API/getjobpost/";
          var object = {id:jid}
          commonpostService.cmnpost(url,object).then(fetch_arrayjoblist, errorDetails);   
           //var toYearsList = ['25','24','23','22','21','20','19','18','17','16','15','14','13','12','11','10','9','8','7','6','5','4','3','2','1','0'];   
           // $scope.yearlistTo = toYearsList;
           //$scope.yearlistTo = $scope.yearlistTo.slice(0,toYearsList.indexOf(selectedFromYear));
      }	
      var get_success = function(data){ 
          //$scope.listTab = true; 
          //$scope.editjobTab = false;
          var url = serviceurl + "API/getpostjobList/";
          var obj = {id:$localStorage.ses_userdata.users_companyid,status:'0'}
          commonpostService.cmnpost(url,obj).then(fetch_incompletejoblist, errorDetails);
          var obj = {id:$localStorage.ses_userdata.users_companyid,status:'1'}
          commonpostService.cmnpost(url,obj).then(fetch_arraylist, errorDetails);
          var obj = {id:$localStorage.ses_userdata.users_companyid,status:'2'}
          commonpostService.cmnpost(url,obj).then(fetch_arraylistinactive, errorDetails);
          var obj = {id:$localStorage.ses_userdata.users_companyid,status:'3'}
          commonpostService.cmnpost(url,obj).then(fetch_arraylistpublish, errorDetails); 
          $('#mydiv').hide();   
          $window.location.reload();       
      }

      $scope.updatepostjobFrm = function(frm){        
          //$('#mydiv').show(); 
           var date = new Date();  
           var cur_data = $filter('date')(new Date(date),'yyyy-MM-dd');
          // if($scope.editpostjob.jobpost_tilldata < cur_data) {           
          //    bootbox.alert('Apply date should not be less than current date !');
          //    return false;
          // }          
          $scope.editpostjob.jobpost_employer = $scope.selectionEmployer;
          $scope.editpostjob.jobpost_jobfit = $scope.selectionJob;
          $scope.editpostjob.jobpost_seniority = $scope.selectionLevel;
          $scope.editpostjob.users_id = $scope.editpostjob.jobpost_userid;  
          $scope.editpostjob.users_companyid = $scope.editpostjob.jobpost_companyid;       
          $scope.editpostjob.action = 'edit';
          //alert(JSON.stringify($scope.editpostjob));        
          var url = serviceurl + "API/addpostJob/";
          commonpostService.cmnpost(url,$scope.editpostjob).then(get_success, errorDetails); 
      }

      $scope.employerFits = [];
      var check_employerFit = function (data) {      
          $scope.employerFits = data;
          //alert(JSON.stringify($scope.employerFits));       
      };

     var list = {user_id:$localStorage.ses_userdata.users_id,type:'employer_fit'};
     checkjobService.checkedjobfit(list).then(check_employerFit, errorDetails);

      // City list 
      $scope.cities =[];
      var get_citylist = function (data) {      
        $scope.cities =data;      
      };
      $scope.getStateCities = function(){         
        getMatercmsService.getListinfo('city',$scope.editpostjob.state_id).then(get_citylist, errorDetails);    
      }   

      //State List
      $scope.states =[];
      var get_statelist = function (data) {       
        $scope.states =data;
        $scope.cities =[];
      };

      $scope.getCountryStates = function(){            
        getMatercmsService.getListinfo('state',$scope.editpostjob.country_id).then(get_statelist, errorDetails);    
       }     

      // Country List
      $scope.countries=[];
      var get_countrylist = function (data) { 
        $scope.countries =data;       
      };
      getMatercmsService.getListinfo('country','').then(get_countrylist, errorDetails); 

      $scope.selectionLevel =[];
      $scope.toggleSelectionLevel = function toggleSelectionLevel(id) {
        var idx = $scope.selectionLevel.indexOf(id);        
        // is currently selected
        if (idx > -1) {
          $scope.selectionLevel.splice(idx, 1);
        }      
        // is newly selected
        else {
          $scope.selectionLevel.push(id);
        }
        //alert(JSON.stringify($scope.selectionLevel));       
      };
      $scope.selectionJob =[];
      $scope.toggleSelectionJob = function toggleSelectionJob(id) {
        var idx = $scope.selectionJob.indexOf(id);        
        // is currently selected
        if (idx > -1) {
          $scope.selectionJob.splice(idx, 1);
        }      
        // is newly selected
        else {
          $scope.selectionJob.push(id);
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

      $scope.dataList = [];
      var get_datalist = function (data) {
        $scope.dataList = data;   
        //alert(JSON.stringify($scope.dataList));    
      };  
     // fetchrecordsCMSService.fetchrecordsCMS('','getalljobdata',$scope.editpostjob.jobpost_id).then(get_datalist, errorDetails);  
      var list_industry = function(data){
         if(data.status == 2){
          bootbox.confirm("Are you sure you want to update this industry!", function(result){
            if(result == true){
               //alert(JSON.stringify($scope.editpostjob)); 
               var urlpath = serviceurl + "API/deletejobpostArea/";                   
               commonpostService.cmnpost(urlpath,$scope.editpostjob).then(deleteRecord, errorDetails);           
            }              
          });
        }else{
          fetchrecordsCMSService.fetchrecordsCMS('','getalljobdata',$scope.editpostjob.jobpost_id).then(get_datalist, errorDetails);  
          $scope.editpostjob.relation_id = data.relation_id;
        }
        
      }

      // var fetch_area = function (data) {    
      //   $scope.areaList =  data;
      //   //alert(JSON.stringify($scope.areaList));      
      // }; 

      $scope.toggleSelectionIndastry = function(id,status) {
        // alert(id);alert(status);
        fetchrecordsCMSService.fetchrecordsCMS('','getAreaList',id).then(fetch_area, errorDetails); 
        $scope.editpostjob.users_id = $scope.editpostjob.jobpost_userid;  
        $scope.editpostjob.users_companyid = $scope.editpostjob.jobpost_companyid; 
        $scope.editpostjob.jobpost_industry = id;
        $scope.editpostjob.industry_status = status;
        //alert(JSON.stringify($scope.editpostjob));
        var urlpath = serviceurl + "API/add_industry/";
        commonpostService.cmnpost(urlpath,$scope.editpostjob).then(list_industry, errorDetails); 
        //alert(JSON.stringify($scope.selectionLevel));       
      };
      var list_area = function(data){
         fetchrecordsCMSService.fetchrecordsCMS('','getalljobdata',$scope.editpostjob.jobpost_id).then(get_datalist, errorDetails);  
        
      }

      $scope.toggleSelectionArea = function(id,status) {
        $scope.editpostjob.jobpost_area = id;
        $scope.editpostjob.area_status = status;
        //alert(JSON.stringify($scope.editpostjob)); 
        var urlpath = serviceurl + "API/add_functionality_area/";
        commonpostService.cmnpost(urlpath,$scope.editpostjob).then(list_area, errorDetails);       
      };

    var deleteRecord = function (data) {       
      fetchrecordsCMSService.fetchrecordsCMS('','getalljobdata',$scope.editpostjob.jobpost_id).then(get_datalist, errorDetails);  
      fetchrecordsCMSService.fetchrecordsCMS('','getjobpostindustryList',$scope.editpostjob.jobpost_id).then(get_jobpostindustrylist, errorDetails);
    };
    $scope.removeRecord =  function(jobpost_id,industry_id) {       
     // alert(jobpost_id);
     var urlpath = serviceurl + "API/deletejobpostIndustry/";
        $scope.editpostjob.jobpost_id = jobpost_id;
        $scope.editpostjob.industry_id = industry_id;        
        commonpostService.cmnpost(urlpath,$scope.editpostjob).then(deleteRecord, errorDetails);
    };

    var update_publish_status = function(data){       
      //alert(JSON.stringify(data));       
      var url = serviceurl + "API/getpostjobList/";
      var obj = {id:$localStorage.ses_userdata.users_companyid,status:'0'}
      commonpostService.cmnpost(url,obj).then(fetch_incompletejoblist, errorDetails);
      var obj = {id:$localStorage.ses_userdata.users_companyid,status:'1'}
      commonpostService.cmnpost(url,obj).then(fetch_arraylist, errorDetails);
      var obj = {id:$localStorage.ses_userdata.users_companyid,status:'2'}
      commonpostService.cmnpost(url,obj).then(fetch_arraylistinactive, errorDetails); 
      var obj = {id:$localStorage.ses_userdata.users_companyid,status:'3'}
      commonpostService.cmnpost(url,obj).then(fetch_arraylistpublish, errorDetails);
    }

    $scope.publish = function(jobpost_id){
      //alert(jobpost_id); 
      var url = serviceurl + "API/updatepublish/";
      var obj = {jobpost_id:jobpost_id,status:'3'}
      commonpostService.cmnpost(url,obj).then(update_publish_status, errorDetails);       
      
    }

    $scope.searchFromMaster = function(typedthings){
      //alert(typedthings);     
      $scope.searchResult = $filter('filter')($scope.all_master_title_data, typedthings);          
        if(typedthings.length === 0){
          $scope.showLoader = false;          
        }     
    }

    var manage_industry = function (data) { 

        $scope.selection = [];
        $scope.industryinfo.action='insert';
        fetchrecordsCMSService.fetchrecordsCMS('','getalljobdata',$scope.editpostjob.jobpost_id).then(get_datalist, errorDetails);        
        fetchrecordsCMSService.fetchrecordsCMS('','getjobpostindustryList',$scope.editpostjob.jobpost_id).then(get_jobpostindustrylist, errorDetails);
        //alert(JSON.stringify($scope.postjobinfo.industry_id));

      };

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

      $scope.manageindustry = function(){
      //alert(JSON.stringify($scope.selection));
      if($scope.industryinfo.industry_id == undefined){
         bootbox.alert('Industry is required !');
         return false;
      }

      if($scope.selection == ''){
        bootbox.alert('Relevant Titles is required!');
        return false;
      }
     // $scope.industryinfo.industry_id = $scope.postjobinfo.industry_id;
      $scope.industryinfo.jobpost_id = $scope.editpostjob.jobpost_id;
      $scope.industryinfo.area = $scope.selection;      
      $scope.industryinfo.users_id = $localStorage.ses_userdata.users_id; 
      $scope.industryinfo.users_companyid = $localStorage.ses_userdata.users_companyid;
      //console.log(JSON.stringify($scope.industryinfo));  
      var urlpath = serviceurl + "API/manageindustry/";
      commonpostService.cmnpost(urlpath,$scope.industryinfo).then(manage_industry, errorDetails); 
    };

    var fetch_industryinfo = function (data) { 
       //alert(JSON.stringify(data[0]));          
       $scope.industryinfo  = data[0];
       $scope.industryinfo.industry_id = $scope.industryinfo.type_id;
       fetchrecordsCMSService.fetchrecordsCMS('','getAreaList',$scope.industryinfo.type_id).then(fetch_area, errorDetails);   
       //alert(JSON.stringify($scope.industryinfo));  
       fetchrecordsCMSService.fetchrecordsCMS('','getIndustryList','').then(fetch_list, errorDetails);  
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
      //alert(id);      
      fetchrecordsCMSService.fetchrecordsCMS('','getdatapostjob',id).then(fetch_industryinfo, errorDetails);
    };

   
    //$localStorage.come_from_tab = '';
    //alert($localStorage.come_from_tab);
    $scope.view_job = function(jobid,tab_type,jobpost_status){  
        //alert(tab_type);     
        $localStorage.come_from_tab = tab_type;
        $localStorage.jobpost_status = jobpost_status;
        //alert($localStorage.come_from_tab);
        $window.location.href = "#!/user/postjobview/"+jobid;     
    };


    
    $scope.back_postjobview =  function(currentTab){        
        $scope.jobtitle = 'Manage Jobs';
        $scope.viewjobTab = false;
        $scope.listTab = true;  
        $window.location.href = "#!/user/postjobview/";       
    };

    // $scope.click_on_tab = function (tab_id, divid) {      
    //      alert(tab_id);
    //      alert(divid);
    //     $timeout(function() { $( "#"+tab_id ).addClass('active'); $( "#"+divid ).addClass('in active');  },  500);
    //   };

    var updatejobStatus = function (data) {
      //alert(JSON.stringify(data)); 
      var url = serviceurl + "API/getpostjobList/";
      var obj = {id:$localStorage.ses_userdata.users_companyid,status:'0'}
      commonpostService.cmnpost(url,obj).then(fetch_incompletejoblist, errorDetails);
      var obj = {id:$localStorage.ses_userdata.users_companyid,status:'1'}
      commonpostService.cmnpost(url,obj).then(fetch_arraylist, errorDetails);
      var obj = {id:$localStorage.ses_userdata.users_companyid,status:'2'}
      commonpostService.cmnpost(url,obj).then(fetch_arraylistinactive, errorDetails);
      var obj = {id:$localStorage.ses_userdata.users_companyid,status:'3'}
      commonpostService.cmnpost(url,obj).then(fetch_arraylistpublish, errorDetails);   
    }; 

     $scope.remove =  function(id){
          //alert(id);
          var url = serviceurl + "API/updatejobStatus/";
          var obj = {jobid:id,status:'4'}
          commonpostService.cmnpost(url,obj).then(updatejobStatus, errorDetails);         
          //fetchrecordsCMSService.fetchrecordsCMS('','updatejobStatus',id).then(updatejobStatus, errorDetails);     
    };
	
	$scope.applyed_users =  function(jobid){
          //alert(jobid); 
          $state.go("user.applieduser");            
    };
  
     $scope.viewed_users =  function(jobid){
          //alert(jobid); 
          $state.go("user.vieweduser");            
    };

       
      
})
})();
