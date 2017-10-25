<?php

defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';


class IndustryAPI extends REST_Controller {
	
	public function __construct() {
		parent::__construct();       
		$this->load->helper('url');		
		$this->config->item('base_url');		
		$this->load->database();
		$this->load->model('IndustryAPI_model');
	}

	function getindustries_get()
	{
		// 	//echo '<pre>';print_r($myrow);
		$myrow = $this->IndustryAPI_model->getindustries();

		foreach ($myrow as $key => $value) {
			 $row = $this->IndustryAPI_model->getarealist($value['industry_id']);
			 $myrow[$key]['functional_area']=$row;
		}

		//echo '<pre>';print_r($myrow);exit;
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array('message' => 'No record found.' );
			$this->response($Error, 404);
		}
	}

	function getIndustry_get($industryID)
	{
		//echo 'type='.$type;
		if(isset($industryID)){
			$myrow = $this->IndustryAPI_model->get_single_industry($industryID);
			//echo '<pre>';print_r($myrow);
		}
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array('message' => 'No record found.' );
			$this->response($Error, 404);
		}
	}
	function getfunctionalarea_get($id)
	{
		//echo 'type='.$type;
		if(isset($id)){
			$myrow = $this->IndustryAPI_model->get_single_functionalarea($id);
			//echo '<pre>';print_r($myrow);
		}
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array('message' => 'No record found.' );
			$this->response($Error, 404);
		}
	}


    function addEdit_industry_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));
		//echo "<pre>";print_r($post_data);exit;


		if(isset($post_data->industry_id)){
			$data = array(
					'industry_id' =>$post_data->industry_id,
					'area_name' =>$post_data->name,
					'area_status' =>$post_data->status
			);
			
		}else{
			$industry_data = array(
			'industry_name' =>$post_data->name,
			'industry_status' =>$post_data->status
			);
		}

		

		$industryName = trim($post_data->name);
		$duplicateIndustries = $this->IndustryAPI_model->check_duplicateIndustry($industryName,$post_data->status);
		if(count($duplicateIndustries) > 0){
			 $Error = array('message' => 'Industry already exists!' );
             $this->response($Error, 200); // 200 being the HTTP response code
         } else {

         	if($post_data->cmsAction == "Insert"){
         		

         		$inactiveIndustries = $this->IndustryAPI_model->fetch_inactiveIndustries($industryName); 
         		if(count($inactiveIndustries) > 0){
         			$Error = array('message' => 'Inactive industry cannot be inserted!' );
                    $this->response($Error, 200); // 200 being the HTTP response code 
                } else {
                	if(isset($post_data->industry_id)){
                		$industry_id = $this->IndustryAPI_model->insert_cmn_tbl('functional_area', $data);
	                }else{
	                	$industry_id = $this->IndustryAPI_model->add_industry($industry_data);
	                }

                	

                	if($industry_id)
                	{
						$this->response($industry_id, 200); // 200 being the HTTP response code
					}
					else
					{
						$Error = array('message' => 'Industry Insert Failure' );
						$this->response($Error, 404);
					}
				}
			} else if($post_data->cmsAction == "Edit"){
				//echo "<pre>";print_r($post_data);
				$industryID = $post_data->id;
				if(isset($post_data->industry_id)){
					//echo "<pre>";print_r($post_data);exit;
				$updateindustry_id = $this->IndustryAPI_model->edit_area($industryID,$data);
				}else{
				$updateindustry_id = $this->IndustryAPI_model->edit_industry($industryID,$industry_data);
				}

				if($updateindustry_id)
				{
					$this->response($updateindustry_id, 200); // 200 being the HTTP response code
				}
				else
				{
					$Error = array('message' => 'Industry Update Failure' );
					$this->response($Error, 404);
				}
			}
		}
	} 

    function getcompanies_get()
	{
		// 	//echo '<pre>';print_r($myrow);
		$myrow = $this->IndustryAPI_model->getcompanies();
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array('message' => 'No record found.' );
			$this->response($Error, 404);
		}
	}

	function getCompany_get($companyID)
	{
		//echo 'type='.$type;
		if(isset($companyID)){
			$myrow = $this->IndustryAPI_model->get_single_company($companyID);
			//echo '<pre>';print_r($myrow);
		}
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array('message' => 'No record found.' );
			$this->response($Error, 404);
		}
	}


    function addEdit_company_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));
		//echo "<pre>";print_r($post_data);exit;	
		$company_data = array(
			'company_name' =>$post_data->name,
			'company_status' =>$post_data->status
			);

		$companyName = trim($post_data->name);
		$duplicateCompanies = $this->IndustryAPI_model->check_duplicateCompany($companyName,$post_data->status);
		if(count($duplicateCompanies) > 0){
			 $Error = array('message' => 'Company already exists!' );
             $this->response($Error, 200); // 200 being the HTTP response code
         } else {

         	if($post_data->cmsAction == "Insert"){
         		$inactiveCompanies = $this->IndustryAPI_model->fetch_inactiveCompanies($companyName); 
         		if(count($inactiveCompanies) > 0){
         			$Error = array('message' => 'Inactive company cannot be inserted!' );
                    $this->response($Error, 200); // 200 being the HTTP response code 
                } else {
                	$company_id = $this->IndustryAPI_model->add_company($company_data);

                	if($company_id)
                	{
						$this->response($company_id, 200); // 200 being the HTTP response code
					}
					else
					{
						$Error = array('message' => 'Company Insert Failure' );
						$this->response($Error, 404);
					}
				}
			} else if($post_data->cmsAction == "Edit"){
				$companyID = $post_data->id;
				$updatecompany_id = $this->IndustryAPI_model->edit_company($companyID,$company_data);

				if($updatecompany_id)
				{
					$this->response($updatecompany_id, 200); // 200 being the HTTP response code
				}
				else
				{
					$Error = array('message' => 'Company Update Failure' );
					$this->response($Error, 404);
				}
			}
		}
	} 

		
}
