(function () {
  'use strict';
  app.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });
  app.controller('companyMessageController', function ($scope,$window,$sce,$state,commonpostService,fetchrecordsCMSService,getfitService,$localStorage,$location,$document,$filter,$timeout) { 

  		var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		 };

		 $scope.sess_users_id = $localStorage.ses_userdata.users_id ;
		 $scope.sess_company_id = $localStorage.ses_userdata.users_companyid ;


			 $scope.click_on_company_for_messages = function (company_id, user_id) {

			 	$scope.clicked_users_id = user_id ;
			 	//alert(company_id)
			 	//alert(user_id)
				fetch_all_chart_for_user_by_company( company_id, user_id );
				//console.log($scope.companyList);	

				
			};




			 $scope.block_this_user = function ( msg_company_id, msg_end_user_id) {

			 	 //alert(msg_company_id);
			 	// alert(msg_end_user_id);

				//console.log($scope.companyList);	
				var url_path = serviceurl + "API_message/block_a_user_for_company/" ;
				var parameter = { msg_company_id:msg_company_id, msg_end_user_id:msg_end_user_id };

				commonpostService.cmnpost( url_path, parameter ).then( '', errorDetails);

				
			};

			 $scope.send_message = function (msg_txt, msg_company_id, msg_company_user_id, msg_end_user_id, msg_sending_from) {

			 	// alert(msg_txt);
			 	// alert(msg_company_id);
			 	// alert(msg_company_user_id);
			 	// alert(msg_end_user_id);
			 	// alert(msg_sending_from);

				//console.log($scope.companyList);	
				var url_path = serviceurl + "API_message/insert_a_message/" ;
				var parameter = { msg_txt: msg_txt, msg_company_id:msg_company_id,  msg_company_user_id:msg_company_user_id, msg_end_user_id:msg_end_user_id, msg_sending_from:msg_sending_from };

				commonpostService.cmnpost( url_path, parameter ).then( after_insert_message, errorDetails);

				
			};

		 
		var after_insert_message = function (data) {
			$scope.inserted_msg = data;
			//console.log($scope.companyList);
			 fetch_all_chart_for_user_by_company(data.company_id, data.end_user_id);
			 $("#msg_text1").val('');	
		};


		 
		var set_all_users_for_chart_of_company = function (data) {
			$scope.chart_user_list = data;
			$scope.first_user_id = data[0].users_id;

			$scope.clicked_users_id = data[0].users_id;

			$timeout(function() { fetch_all_chart_for_user_by_company( $localStorage.ses_userdata.users_companyid, $scope.first_user_id );  },  500);

			//console.log( $scope.first_user_id );	
		};


		 function fetch_all_users_of_company_for_chart() {

			var url_path = serviceurl + "API_message/all_users_applied_jobs_for_company_for_chart/" ;
			var parameter = { company_id: $localStorage.ses_userdata.users_companyid };

			commonpostService.cmnpost( url_path, parameter ).then(set_all_users_for_chart_of_company, errorDetails);
		 }
		 fetch_all_users_of_company_for_chart();


		var set_all_chart_for_user = function (data) {
			$scope.chart_msg_list = data;

			//console.log($scope.companyList);	
		};

		 function fetch_all_chart_for_user_by_company(company_id, user_id) {

		 	//alert(company_id) ;
		 	//alert(user_id) ;

			var url_path = serviceurl + "API_message/all_charts_of_a_company_for_user/" ;
			var parameter = { company_id: company_id, user_id: user_id  };
			commonpostService.cmnpost( url_path, parameter).then(set_all_chart_for_user, errorDetails);

			$timeout(function() { fetch_latest_msg_for_user_by_company(company_id, user_id) ;  },  500);

			$timeout(function() { make_read_msg_for_user_by_company(company_id, user_id) ;  },  500);


			
		 }
		 //fetch_all_chart_for_user_by_company( $localStorage.ses_userdata.users_companyid, $scope.first_user_id );


		var set_latest_msg_details_for_user = function (data) {
			$scope.latest_msg_details = data;
			//alert( data.company_block_status )
			//if ( data.company_block_status == 1 ) { $("#message_write_div").remove(); }

		};

		function fetch_latest_msg_for_user_by_company(company_id, user_id) {


			var url_path = serviceurl + "API_message/latest_msg_of_a_company_for_user/" ;
			var parameter = { company_id: company_id, user_id: user_id  };
			commonpostService.cmnpost( url_path, parameter).then(set_latest_msg_details_for_user, errorDetails);
		 }


		var set_read_msg_details_for_user = function (data) {
			$scope.read_msg_details = data;

		};

		function make_read_msg_for_user_by_company(company_id, user_id) {

			var url_path = serviceurl + "API_message/update_read_msg_of_a_company_for_user/" ;
			var parameter = { company_id: company_id, user_id: user_id, user_type: 'user'  };
			commonpostService.cmnpost( url_path, parameter).then(set_read_msg_details_for_user, errorDetails);

			$timeout(function() { $("#no_of_msg_"+user_id).html('');  },  500);
		 }



})
})();
