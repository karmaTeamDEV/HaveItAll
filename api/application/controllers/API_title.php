<?php
error_reporting(0);
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';


class API_title extends REST_Controller {
	
	public function __construct() {
        parent::__construct();       
		$this->load->helper('url');		
		$this->config->item('base_url');		
		//$this->load->library('email');
		$this->load->database();
		//$this->load->dbforge();			
        $this->load->model('API_title_work_freetext_model');
    }


	function all_title_work_for_user_post()
	{
		$data = json_decode(file_get_contents("php://input"));	
		
		$user_id = $data->user_id;
		$catagory_type_id = $data->catagory_type_id;
		//$user_id = 1;

		$record = $this->API_title_work_freetext_model->title_work_for_user_query($user_id, $catagory_type_id);
		//echo "QU".$this->db->last_query();
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$this->response($record, 400);
		}
		
		
	}
	
	function delete_one_title_for_user_post()
	{
		$data = json_decode(file_get_contents("php://input"));	
		
		$user_title_id = $data->user_title_id;
		//$user_id = 1;

		$record = $this->API_title_work_freetext_model->delete_title_for_user_query($user_title_id);
		//print_r($record);
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response(array("return"=>$record), 200);
		}
		else{
			$this->response($record, 200);
		}
		
		
	}
	
	

	function fetch_all_master_for_user_post()
	{
		$data = json_decode(file_get_contents("php://input"));	
		
		$type_category = $data->catagory_type_id;
		$record = $this->API_title_work_freetext_model->all_masterData_for_user_query($type_category);
		
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$this->response($record, 400);
		}
		
		
	}
	
	

	function insert_one_title_for_user_post()
	{
		$data = json_decode(file_get_contents("php://input"));	
		
		$title_name = $data->title;
		$user_id = $data->user_id;
		$catagory_type_id = $data->catagory_type_id;
		
		//$user_id = 1;
		//echo $user_id ;
		$title_row = $this->API_title_work_freetext_model->check_master_data_query( $title_name, $catagory_type_id );
		//echo  $this->db->last_query();
		
		if(count($title_row) > 0)
		{
			$title_id = $title_row[0]['type_id'];
			
			$check_for_user = $this->API_title_work_freetext_model->get_a_title_for_user_query($user_id, $title_id, $catagory_type_id) ;
			if($check_for_user <= 0)
			{
				$data = array("user_id"=>$user_id, "category_type_id"=>$catagory_type_id, "title_held_master_id"=>$title_id, "add_ip"=>$_SERVER['REMOTE_ADDR'] );
				$title_add_id = $this->API_title_work_freetext_model->insert_cmn_tbl('hia_title_worked_freetext_for_user', $data) ;
				$return = array("status"=>"Added", "afect_id"=>$title_add_id);
			}
			else{
				$return = array("status"=>"Duplicate");
			}
			
		}
		else{
				$check_for_user = $this->API_title_work_freetext_model->get_a_title_for_user_titlename_query($user_id, $title_name, $catagory_type_id) ;
				//echo "QU".$this->db->last_query();
				if($check_for_user <= 0)
				{
					$data = array("user_id"=>$user_id, "category_type_id"=>$catagory_type_id, "other_title_text"=>$title_name, "add_ip"=>$_SERVER['REMOTE_ADDR'] );
					$title_add_id = $this->API_title_work_freetext_model->insert_cmn_tbl('hia_title_worked_freetext_for_user', $data) ;
					$return = array("status"=>"Added", "afect_id"=>$title_add_id);
					
				}
				else{
					$return = array("status"=>"Duplicate");
				}
			}
		
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($return, 200);
		}
		else{
			$this->response($return, 400);
		}
		
		
	}
	
	



	
		
}
