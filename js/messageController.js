(function () {
  'use strict';
  app.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });
  app.controller('messageController', function ($scope,$window,$sce,$state,commonpostService,fetchrecordsCMSService,getfitService,$localStorage,$location,$document,$filter,$timeout) { 

  		var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		 };

		 $scope.sess_user_id = $localStorage.ses_userdata.users_id ;


			 $scope.click_on_company_for_messages = function (company_id, user_id) {


				fetch_all_chart_for_user_by_company( company_id, user_id );
				//console.log($scope.companyList);	

				
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
				$("#msg_text1").val('');

				
			};

		 
		var after_insert_message = function (data) {
			$scope.inserted_msg = data;
			//console.log($scope.companyList);
			 fetch_all_chart_for_user_by_company(data.company_id, data.end_user_id);	
		};


		 
		var set_all_company_of_chart_for_user = function (data) {
			$scope.chart_company_list = data;

			$timeout(function() { fetch_all_chart_for_user_by_company(data[0].company_id, $localStorage.ses_userdata.users_id);  },  500);

			console.log(data);	
		};


		 function fetch_all_company_of_chart_for_user() {

		 	//alert(1);

			var url_path = serviceurl + "API_message/all_company_of_chart_fro_user/" ;
			var parameter = { user_id: $localStorage.ses_userdata.users_id };

			commonpostService.cmnpost( url_path, parameter ).then(set_all_company_of_chart_for_user, errorDetails);
		 }
		 fetch_all_company_of_chart_for_user();





		var set_all_chart_for_user = function (data) {
			$scope.chart_msg_list = data;

			//console.log($scope.companyList);	
		};

		 function fetch_all_chart_for_user_by_company(company_id, user_id) {
			var url_path = serviceurl + "API_message/all_charts_of_a_company_for_user/" ;
			var parameter = { company_id: company_id, user_id: user_id  };
			commonpostService.cmnpost( url_path, parameter).then(set_all_chart_for_user, errorDetails);

			$timeout(function() { fetch_latest_msg_for_user_by_company(company_id, user_id) ;  },  500);

			$timeout(function() { make_read_msg_for_user_by_company(company_id, user_id) ;  },  500);


			
		 }
		// fetch_all_chart_for_user_by_company(25, $localStorage.ses_userdata.users_id);


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
			var parameter = { company_id: company_id, user_id: user_id, user_type: 'company'   };
			commonpostService.cmnpost( url_path, parameter).then(set_read_msg_details_for_user, errorDetails);

			$timeout(function() { $("#no_of_msg_"+company_id).html('');  },  500);
		 }



})
})();
