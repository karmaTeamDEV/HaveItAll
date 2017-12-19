/* ==========================================================================
Author: BAMADEB UPADHYAYA
Create date:  05/10/2017
Description:  Header common js page
=============================================================================  */

app.controller('UserCtrl', function ($scope,$window,$state,$localStorage,commonpostService,fetchrecordsCMSService) {
    if(!$localStorage.ses_userdata){
        $state.go("login"); 
    }
    
    $scope.logout = function(){
        $localStorage.$reset();            
        $state.go("login", {}, { reload: true });
    };

    $scope.historyBack = function(){
        $window.history.back();
    }
    
        $scope.userInfo_email = {};
        
        $scope.userInfo_type = {};
    if ($localStorage.ses_userdata !== '') {
        //alert($localStorage.ses_userdata.users_profilepic);
        $scope.userInfo_email = $localStorage.ses_userdata.users_username;
        $scope.userInfo_type = $localStorage.ses_userdata.users_type;
        $scope.userInfo_companytype = $localStorage.ses_userdata.company_type;
        $scope.userInfo_usersid = $localStorage.ses_userdata.users_id;

        var errorDetails = function (serviceResp) {
            $scope.Error = "Something went wrong ??";
        };
        //alert(JSON.stringify($localStorage.ses_userdata.users_companyid));   
        $scope.companyInfo ={};
        var fetch_company = function (data) {            
            $scope.companyInfo = data[0]; 
            
            if($scope.companyInfo.users_profilepic != '' && $scope.companyInfo.users_companyid != '0'){
               //$scope.companyInfo.users_profilepic = 'upload/thumb/'+$scope.companyInfo.users_profilepic;
               $scope.companyInfo.users_profilepic = 'upload/'+$scope.companyInfo.users_profilepic;
            }else if($scope.companyInfo.users_profilepic == '' && $scope.companyInfo.users_companyid != '0'){
                $scope.companyInfo.users_profilepic = 'public/images/header-no-image.jpg';
            } 
            //alert(JSON.stringify($scope.companyInfo.users_profilepic));                                 
        };         

        fetchrecordsCMSService.fetchrecordsCMS('','getCompanyprofilepic',$localStorage.ses_userdata.users_companyid).then(fetch_company,errorDetails);
    }

        var fetch_locationlist = function (data) {        
            $localStorage.optionlist = data.map(function(item){         
              return {
                text: item.locations_name,            
                id: item.locations_id
              };
            }); 
             //alert(JSON.stringify($localStorage.optionlist));
            $state.go("user.postJob", {}, {reload: true});          
         }; 

           
        $scope.manage_location = function(){         
           $localStorage.optionlist = [];
           fetchrecordsCMSService.fetchrecordsCMS('','getlocationsList','').then(fetch_locationlist, errorDetails);           
        }
        var result_set = function (data) {        
            //alert(JSON.stringify(data)); 
            $localStorage.jobinfo = [];
            $localStorage.jobinfo.level = [];
            $localStorage.jobinfo.jobfit = [];
            $localStorage.flag = '';
            $window.location.href = $scope.postjobinfo.path;        
        }; 

        $scope.postjobinfo = {};
        $localStorage.jobinfo = [];
        $localStorage.jobinfo.level = [];
        $localStorage.jobinfo.jobfit = [];
        $localStorage.flag = '';
        $scope.check_jobinfo = function(path){
          
              if(path == '#!/user/user-job' || path == '#!/user/postjobview/'){
                  $localStorage.tab_to_view = 'myjobs';
              }
               if(path == '#!/user/followingcompany' || path == '#!/user/followuser'){
                  $localStorage.tab_to_view = 'following';
              }
              //alert( $localStorage.tab_to_view);

              // alert(JSON.stringify($localStorage.jobinfo.length));
              // alert(JSON.stringify($localStorage.jobinfo.level.length)); 
              // alert(JSON.stringify($localStorage.jobinfo.jobfit.length));
              // alert(JSON.stringify($localStorage.flag.length)); 
              //alert(path);
              if(($localStorage.jobinfo.length != 0) || ($localStorage.jobinfo.level.length != 0) || ($localStorage.jobinfo.jobfit.length != 0) || ($localStorage.flag.length != 0)){
                bootbox.confirm("Do you want to save this job ?", function(result){      
                  if(result == true){       
                      //$localStorage.jobinfo = [];                       
                      $scope.postjobinfo.jobpost_jobfit = $localStorage.jobinfo.jobfit;
                      $scope.postjobinfo.jobpost_seniority = $localStorage.jobinfo.level;
                      if($localStorage.jobinfo.length != 0){
                        $scope.postjobinfo.country_id = $localStorage.jobinfo[0].country;
                        $scope.postjobinfo.state_id = $localStorage.jobinfo[0].state;
                        $scope.postjobinfo.city_id = $localStorage.jobinfo[0].city;
                        $scope.postjobinfo.jobpost_url = $localStorage.jobinfo[0].joburl;
                        $scope.postjobinfo.jobpost_tilldata = $localStorage.jobinfo[0].tilldata;                     
                        $scope.postjobinfo.jobpost_title = $localStorage.jobinfo[0].title;
                      }

                      $scope.postjobinfo.jobpost_id = $localStorage.jobpost_id;
                      $scope.postjobinfo.users_id = $localStorage.ses_userdata.users_id;
                      $scope.postjobinfo.users_companyid = $localStorage.ses_userdata.users_companyid; 
                      $scope.postjobinfo.jobpost_status = '0'; 
                      $scope.postjobinfo.action = 'edit';
                      $scope.postjobinfo.path = path;               
                      //alert(JSON.stringify($scope.postjobinfo));
                      var url = serviceurl + "API/addpostJob/";
                      commonpostService.cmnpost(url,$scope.postjobinfo).then(result_set, errorDetails); 
                  }else{
                    fetchrecordsCMSService.fetchrecordsCMS('','deletejobpost',$localStorage.jobpost_id).then(delete_jobrecord, errorDetails);
                    $localStorage.jobinfo = [];
                    $localStorage.jobinfo.level = [];
                    $localStorage.jobinfo.jobfit = [];
                    $localStorage.flag = '';
                    $window.location.href = path;                    
                  }
                });

              }else{
                 
                var delete_jobrecord = function (data) {
                   
                     // alert(JSON.stringify(data));        
                      $localStorage.jobinfo = [];
                      $localStorage.jobinfo.level = [];
                      $localStorage.jobinfo.jobfit = [];
                      $localStorage.flag = '';
                      $localStorage.jobpost_id = '';
                      $window.location.href = path;     
                }; 
                //alert($localStorage.jobpost_id);
                fetchrecordsCMSService.fetchrecordsCMS('','deletejobpost',$localStorage.jobpost_id).then(delete_jobrecord, errorDetails);
                $localStorage.jobinfo = [];
                $localStorage.jobinfo.level = [];
                $localStorage.jobinfo.jobfit = [];
                $localStorage.flag = '';
                $localStorage.jobpost_id = '';
                $window.location.href = path; 
              }

                
        } 
 


});