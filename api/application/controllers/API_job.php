<?php
error_reporting(0);
set_time_limit(300);
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';


class API_job extends REST_Controller {
	
	public function __construct() {
		parent::__construct();       
		$this->load->helper('url');		
		$this->config->item('base_url');		
		//$this->load->library('email');
		$this->load->database();
		//$this->load->dbforge();			
		$this->load->model('API_model');
		$this->load->model('API_following_company_model');
		$this->load->model('API_job_model');
	}

   /* function index_get()
	{
		$password = '4891566';
		$to = 'bamadebupadhya@gmail.com';
		$message = "Hello User, <br><br>Your password is $password.<br><br><br>Thanks<br>Admin";
		$subject = "Forgot Password";
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
		$headers .= 'From: <admin@haveitall.com>$to' . "\r\n";
		//$headers .= 'Cc: sangram@primacpl.com' . "\r\n";
		$mail = mail($to,$subject,$message,$headers);
		//echo $mail.'=sending';exit;
			
	}*/



	function getAllDataofTable_get($table)
	{
		//echo $table;	
		$myrow = $this->API_model->get_master_record($table,"","", "", "ASC");		
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}
	}

	function user_viewed_jobs_post()
	{
		//echo $table;	
		$all_jobs = array();

		$post_data = json_decode(file_get_contents("php://input"));	

		$userid = $post_data->user_id; 
		$viewing_type = $post_data->viewing_type; 


		$record = $this->API_job_model->user_viewed_job_query( $userid, $viewing_type ) ;	
		
		if($record['code'] == "")
		{
			//print_r($record);
			foreach ($record as $jobs_matched) {
				
				$jobs_matched['location'] = $this->API_model->getpostjobList($jobs_matched['jobpost_id'],'location'); 

				array_push($all_jobs, $jobs_matched) ;	

			}

			$this->response($all_jobs, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}


	function user_saved_jobs_post()
	{
		//echo $table;	
		$all_jobs = array();
		
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo "<pre>";print_r($post_data);exit;
		$userid = $post_data->user_id; 
		$saving_type = $post_data->saving_type; 
		$current_job_id = $post_data->current_job_id;  
		$level = $post_data->level; 

		$record = $this->API_job_model->user_saved_job_query( $userid, $saving_type,'',$current_job_id,$level) ;	
		
		if($record['code'] == "")
		{
			//print_r($record);
			foreach ($record as $jobs_matched) {
				
				$jobs_matched['location'] = $this->API_model->getpostjobList($jobs_matched['jobpost_id'],'location'); 

				array_push($all_jobs, $jobs_matched) ;	

			}

			$this->response($all_jobs, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function user_applied_jobs_post()
	{
		//echo $table;
		$all_jobs = array();

		$post_data = json_decode(file_get_contents("php://input"));	
		//echo "<pre>";print_r($post_data);exit;
		$userid = $post_data->user_id; 
		$applied_type = $post_data->applied_type; 
		$current_job_id = $post_data->current_job_id;
		$level = $post_data->level; 
		$record = $this->API_job_model->user_applied_for_job_query( $userid, $applied_type,'',$current_job_id,$level ) ;	
		
		if($record['code'] == "")
		{
			//print_r($record);
			foreach ($record as $jobs_matched) {
				
				$jobs_matched['location'] = $this->API_model->getpostjobList($jobs_matched['jobpost_id'],'location'); 

				array_push($all_jobs, $jobs_matched) ;	

			}

			$this->response($all_jobs, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}


	function match_jobs_for_user_post()
	{
		//echo $table;	
		$all_jobs = array();

		$post_data = json_decode(file_get_contents("php://input"));	
		//echo "<pre>";print_r($post_data);exit;
		$userid = $post_data->user_id; 
		$view_status = $post_data->view_status; 
		$following_status = $post_data->following_type; 
		$current_job_id = $post_data->current_job_id; 
		$level = $post_data->level; 


		$record = $this->API_job_model->matched_job_for_user_query( $userid, $view_status, $following_status, $current_job_id ,$level) ;	
		
		if($record['code'] == "")
		{
			//print_r($record);
			
			foreach ($record as $jobs_matched) {
				
				$jobs_matched['location'] = $this->API_model->getpostjobList($jobs_matched['jobpost_id'],'location'); 

				array_push($all_jobs, $jobs_matched) ;	

			}

			$this->response($all_jobs, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}




	function apply_job_by_user_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$job_id = $post_data->job_id; 
		$user_id = $post_data->user_id; 
		$applied_type = $post_data->applied_type; 
		//echo "ABCD";

		$data = array('user_id' => $user_id, 'job_post_id' => $job_id, 'applied_type' => $applied_type, );
		$companyid = $this->API_model->insert_cmn_tbl('hia_user_applied_jobs', $data);

			$return = array('job_id' => $job_id, 'user_id' => $user_id );
			$this->response($return, 200);

	}

	function insert_save_job_by_user_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$job_id = $post_data->job_id; 
		$user_id = $post_data->user_id; 
		$saving_type = $post_data->saving_type; 
		//echo "ABCD";

		$data = array('user_id' => $user_id, 'job_post_id' => $job_id, 'saving_type' => $saving_type, );
		$companyid = $this->API_model->insert_cmn_tbl('hia_user_saved_jobs', $data);

			$return = array('job_id' => $job_id, 'user_id' => $user_id );
			$this->response($return, 200);

	}


	function insert_view_job_by_user_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$job_id = $post_data->job_id; 
		$user_id = $post_data->user_id; 
		$viewing_type = $post_data->viewing_type; 
		//echo "ABCD";

		$data = array('user_id' => $user_id, 'job_post_id' => $job_id, 'viewing_type' => $viewing_type );
		$companyid = $this->API_model->insert_cmn_tbl('hia_user_view_jobs', $data);


		//echo $this->db->last_query();
			$return = array('job_id' => $job_id, 'user_id' => $user_id );
			$this->response($return, 200);

	}


	function job_applied_details_by_user_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$job_id = $post_data->job_id; 
		$user_id = $post_data->user_id; 
		//echo "ABCD";

		$record = $this->API_job_model->job_applied_details_user_query( $job_id, $user_id ) ;	
		//echo $this->db->last_query();
		if($record['code'] == "")
		{

			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}






/************* COMPANY */ 


	function applied_users_for_job_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$job_id = $post_data->job_id; 

		//echo $job_id ;

		$record = $this->API_job_model->applied_users_query( $job_id ) ;	
		//echo $this->db->last_query();
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function job_details_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$job_id = $post_data->job_id; 

		//echo $job_id ;

		$record = $this->API_job_model->job_details_query( $job_id ) ;	
		//echo $this->db->last_query();
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function job_proretty_match_user_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$job_id = $post_data->job_id; 
		$user_id = $post_data->user_id; 

		//echo $job_id ;

		$record = $this->API_job_model->job_property_matching_with_user( $job_id, $user_id ) ;	
		//echo $this->db->last_query();
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function company_details_from_job_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$job_id = $post_data->job_id; 
		$user_id = $post_data->user_id; 

		//echo $job_id ;

		$record = $this->API_job_model->company_details_from_job_query( $job_id,  $user_id) ;	
		//echo $this->db->last_query();
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function before_resistration_matched_job_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$employerfit = $post_data->employerfit; 
		$jobfit = $post_data->jobfit; 
		$industry = $post_data->industry; 
		$seniority = $post_data->seniority; 

		//echo $job_id ;

		$record = $this->API_job_model->job_match_before_register_user( $employerfit, $jobfit, $industry, $seniority ) ;
		//echo $this->db->last_query();
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function before_resistration_matched_company_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$employerfit = $post_data->employerfit; 
		$jobfit = $post_data->jobfit; 
		$industry = $post_data->industry; 
		$seniority = $post_data->seniority; 

		//echo $job_id ;

		$record = $this->API_job_model->company_match_before_register_user( $employerfit, $jobfit, $industry, $seniority ) ;
		//echo $this->db->last_query();
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function get_no_of_active_jobs_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$company_id = $post_data->id; 

		//echo $job_id ;

		$record = $this->API_job_model->get_no_of_published_jobs_company( $company_id ) ;
		//echo $this->db->last_query();
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}


  }
