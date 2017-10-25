<?php
error_reporting(0);
set_time_limit(300);
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';


class API_message extends REST_Controller {
	
	public function __construct() {
		parent::__construct();       
		$this->load->helper('url');		
		$this->config->item('base_url');		
		//$this->load->library('email');
		$this->load->database();
		//$this->load->dbforge();			
		$this->load->model('API_model');
		$this->load->model('API_following_company_model');
		$this->load->model('API_message_model');
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



	function all_company_of_chart_fro_user_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		$userid = $post_data->user_id; 
		//echo $table;	
		$record = $this->API_message_model->company_of_chart_for_user_query( $userid );	

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

	function all_charts_of_a_company_for_user_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		$userid = $post_data->user_id; 
		$companY_id = $post_data->company_id; 
		//echo $table;	
		$record = $this->API_message_model->all_charts_of_a_company_for_user_query( $userid, $companY_id );	

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

	function latest_msg_of_a_company_for_user_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		$userid = $post_data->user_id; 
		$companY_id = $post_data->company_id; 
		//echo $table;	
		$record = $this->API_message_model->latest_msg_of_a_company_for_user_query( $userid, $companY_id );	

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

	function update_read_msg_of_a_company_for_user_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	

		$userid = $post_data->user_id; 
		$companY_id = $post_data->company_id; 
		$sent_from = $post_data->user_type; 
		//echo $table;	

		$data = array('read_time' => date("Y-m-d H:i:s") );

		$this->db->update('company_user_messages', $data, array('company_id' => $companY_id, 'end_user_id' => $userid, 'sent_from' => $sent_from ) );


			$Error = array('message' => 'updated' );
			$this->response($Error, 200);

	}

	function insert_a_message_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	

		$company_id = $post_data->msg_company_id; 
		$company_user_id = $post_data->msg_company_user_id; 
		$end_user_id = $post_data->msg_end_user_id; 
		$sent_from = $post_data->msg_sending_from; 
		$message_sent = $post_data->msg_txt; 
		//echo $table;	

		$data = array('company_id' => $company_id, 'company_user_id' => $company_user_id,'end_user_id' => $end_user_id,'sent_from' => $sent_from,'message_sent' => $message_sent );


		$insert_id = $this->db->insert('company_user_messages', $data);


			
			$this->response($data, 200);

	}


	/* COMPANY */


	function all_users_applied_jobs_for_company_for_chart_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		$company_id = $post_data->company_id; 
		//echo $table;	
		$record = $this->API_message_model->users_list_for_company_chart_query( $company_id );	

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

	function block_a_user_for_company_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	

		$end_user_id = $post_data->msg_end_user_id; 
		$company_id = $post_data->msg_company_id; 
		//echo $table;	

		$data = array('company_block_status' => 1 );

		$this->db->update('company_user_messages', $data, array('company_id' => $company_id, 'end_user_id' => $end_user_id ) );


			$Error = array('message' => 'updated' );
			$this->response($Error, 200);

	}

  }
