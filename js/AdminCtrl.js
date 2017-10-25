app.controller('AdminCtrl', function ($scope,  $state, $localStorage) {
   
    if(!$localStorage.ses_userdata){
        $state.go("login"); 
    }
    $scope.userInfo = {};
    $scope.logout = function(){
        $localStorage.$reset();
        // $localStorage.ses_jobfit ='';
        // $localStorage.ses_employerfit ='';
        // $localStorage.ses_userdata ='';
        // $localStorage.type ='';
        // $localStorage.email ='';       
        $state.go("login", {}, { reload: true });
    };

    $scope.userInfo_email = {};
    if ($localStorage.ses_userdata !== '') {
        $scope.userInfo_email = $localStorage.ses_userdata.users_username;
    }


});