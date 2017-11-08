<?php
error_reporting(0);
set_time_limit(300);
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php'; 


class API extends REST_Controller {
	
	public function __construct() {
		parent::__construct();       
		$this->load->helper('url');		
		$this->config->item('base_url');		
		//$this->load->library('email');
		$this->load->database();
		//$this->load->dbforge();			
		$this->load->model('API_model');
	}

 //    function index_get()
	// {
	// 	// $password = '4891566';
	// 	// $to = 'bamadebupadhya@gmail.com';
	// 	// $message = "Hello User, <br><br>Your password is $password.<br><br><br>Thanks<br>Admin";
	// 	// $subject = "Forgot Password";
	// 	// $headers = "MIME-Version: 1.0" . "\r\n";
	// 	// $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
	// 	// $headers .= 'From: <admin@haveitall.com>$to' . "\r\n";
	// 	// //$headers .= 'Cc: sangram@primacpl.com' . "\r\n";
	// 	// $mail = mail($to,$subject,$message,$headers);
	// 	// //echo $mail.'=sending';exit;		 
			
	// }

	function regEmployer_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;
		$username = preg_replace('/\s+/', '', $post_data->username);
		$password = preg_replace('/\s+/', '', $post_data->usrpasswrd);

		$company_check = $this->API_model->get_row_record('company','company_name',$post_data->name);

		if(count($company_check) == 0){
			$user_check = $this->API_model->get_row_record('users','users_username',$username);

			if(count($user_check) == 0){
				$emp_data = array(	
					'company_name' =>$post_data->name			
				);
				$companyid = $this->API_model->insert_cmn_tbl('company',$emp_data);

				if($companyid)
				{
					$user_data = array(	
						'users_companyid' =>$companyid,		
						'users_username' =>$username,			
						'users_password' =>$password,
						//'users_profilepic' =>$post_data->profile_image,	
						'users_type' =>'2'
					);
					$user_id = $this->API_model->insert_cmn_tbl('users',$user_data);
					
					if($user_id)
					{				
						$user = $this->API_model->validateUserLogin($username, $password);					
						$success = array('status' => '1','list' => $user);						
						$this->response($success, 200); // 200 being the HTTP response code
					}
					else
					{
						$Error = array('status' => '0','message' => 'Error in username insert.' );
						$this->response($Error, 200);
					}

				}
				else
				{
					$Error = array('status' => '0','message' => 'Error in company insert.' );
					$this->response($Error, 200);
				}



			}else{
				$Error = array('status' => '0','message' => 'Username already exists.' );
				$this->response($Error, 200);
			}
			 
		}else{
			$Error = array('status' => '0','message' => 'Company already exists.' );
			$this->response($Error, 200);
		}	



		
		 
	}

	function removeProfileImage_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));
		//echo '<pre>';print_r($post_data);exit;

		$data = array(			
					'users_profilepic' =>''
				);

		$del_id = $this->API_model->update_cmn_tbl('users','users_id',$post_data->user_id,$data);
		
		if(unlink('../upload/'.$post_data->image))
		{
			$this->response($del_id, 200); // 200 being the HTTP response code
		}
		else
		{
			$Error = 'error';
			$this->response($Error, 200);
		} 	
	}

	// function image_upload_post(){

	// 	$file_content = $_POST['file'];			
	// 	$date =date('ymdmis');
	// 	$image_name = $date.'.png';			
	// 	$up = $this->API_model->base64_to_jpeg($file_content,image_upload_path.$image_name);
		
	// 	if($up){
	// 		$success = array('status' => '1','message' => $image_name);					
	// 		$this->response($success, 200); // 200 being the HTTP response code
	// 	}else{
	// 		$success = array('status' => '0','message' => 'error');					
	// 		$this->response($success, 200); // 200 being the HTTP response code
	// 	}
	// }

	function file_upload_post(){
		//echo "<pre>";print_r($_POST);exit;
		$user_id = $_POST['user_id'];
		
		if(!empty($_FILES['image'])){
			$ext = pathinfo($_FILES['image']['name'],PATHINFO_EXTENSION);
			$image = time().'.'.$ext;
			$up =  move_uploaded_file($_FILES["image"]["tmp_name"], image_upload_path.$image);
			if($up){

				$thumb_image = $this->make_thumb(image_upload_path.$image, image_upload_path.'thumb/'.$image, '80');
				
				$info = $this->API_model->get_profile_info($user_id);
				if($info[0]['users_profilepic']){
					unlink('../upload/'.$info[0]['users_profilepic']);
					unlink('../upload/thumb/'.$info[0]['users_profilepic']);
				}
				$user_data = array(				
					'users_profilepic' => $image
				);
		
				$this->API_model->update_profile_tbl($user_data, $user_id);			

				$success = array('status' => '1','message' => $image);					
				$this->response($success, 200);
			}else{
				$success = array('status' => '0','message' => 'error');					
				$this->response($success, 200); // 200 being the HTTP response code
			}
		
		
		}else{
			$success = array('status' => '0','message' => 'error');					
			$this->response($success, 200); // 200 being the HTTP response code
		}
	}

	function make_thumb($src, $dest, $desired_width) {

		/* read the source image */
		$source_image = imagecreatefromjpeg($src);
		$width = imagesx($source_image);
		$height = imagesy($source_image);
		
		/* find the "desired height" of this thumbnail, relative to the desired width  */
		$desired_height = floor($height * ($desired_width / $width));
		
		/* create a new, "virtual" image */
		$virtual_image = imagecreatetruecolor($desired_width, $desired_height);
		
		/* copy source image at a resized size */
		imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);
		
		/* create the physical thumbnail image to its destination */
		imagejpeg($virtual_image, $dest);
	}

	function getCategoryList_get()
	{
			
		$myrow = $this->API_model->get_master_record('category','category_status','0','category_name');		
		
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
	function getCompanyList_get()
	{
			
		$myrow = $this->API_model->get_master_record('company_master','company_status','0','company_name');		
		
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
	
	function getCompanyuser_get($company_id)
	{
			
		$myrow = $this->API_model->get_company_user($company_id);	
		
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
	function getCompanyprofilepic_get($company_id)
	{
			
		$myrow = $this->API_model->get_company_profileinfo($company_id);	
		
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

	function authenticate_post()
	{
		$data = json_decode(file_get_contents("php://input"));	
		
		$username = preg_replace('/\s+/', '', $data->username);
		$password = preg_replace('/\s+/', '', $data->usrpasswrd);

		$record = $this->API_model->get_single_record('users','users_username',$username);

		if(count($record) != 0){

			$row = $this->API_model->user_status_check($username);
			
			if(count($row) != 0){
				$Error = array('error' => '1','message' => 'User is inactive please contact the administrator.' );
				$this->response($Error, 200);

			}else{

				$user = $this->API_model->validateUserLogin($username, $password);		
				if($user)
				{
					$this->response($user, 200); // 200 being the HTTP response code
				}
				else
				{
					$Error = array('error' => '1','message' => 'Incorrect password.' );
					$this->response($Error, 200);
				}
			}

		}else{
			$Error = array('error' => '1','message' => 'Login Failed.' );
			$this->response($Error, 200);
		}
	}

	function registration_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));
		//echo "<pre>";print_r($post_data);exit;
		$username = preg_replace('/\s+/', '', $post_data->username);
		$password = preg_replace('/\s+/', '', $post_data->password);		
		$company_name = $post_data->company_name;
		$user_data = array(			
			'users_firstname'=>$post_data->first_name,
			'users_lastname' =>$post_data->last_name,
			'users_username' =>$username,			
			'users_password' =>$password,	
			'users_type' =>'1'
			);
		if(isset($post_data->users_companyid)){
			$user_data['users_companyid'] = $post_data->users_companyid;				
		}

		if(isset($post_data->company_type)){
			$user_data['company_type'] = $post_data->company_type;				
		}

		if($post_data->addUser == '1'){
			$user_data['mail_send'] = '1';				
		}
		//echo "<pre>";print_r($user_data);	exit;
		$user_id = $this->API_model->insert_cmn_tbl('users',$user_data);
		
		if($user_id)
		{
			if($post_data->addUser == '1'){
				$to = $username;
				//$to = 'bamadebupadhya@gmail.com';
				$first_name = $post_data->first_name;
				$last_name = $post_data->last_name;
			    $message = "Hello $first_name $last_name, <br><br>
			    You have been invited by $first_name $last_name, to join the ".$company_name." HaveItAll Hiring team. Please <a href=".$post_data->regular_url.$user_id.">click here</a> to create your account password. <br><br>Thank you,<br>The HaveItAll Admin Team.<br>www.haveitall.ca<br><br><br>If you have received this email in error, please <a href='mailto:report@haveitall.ca'>click here</a> to report of unsubscribe.";
			     
			    $subject = 'Set your password';
			    $headers = "MIME-Version: 1.0" . "\r\n";
			    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
			    $headers .= 'From: <admin@haveitall.com>Set Password(-HaveItAll-)'. "\r\n";
			    //$headers .= 'Cc: sangram@primacpl.com' . "\r\n";
			    $mail = mail($to,$subject,$message,$headers);
			}

			if(isset($post_data->ses_employerfit)){

				$employerfit = explode(',',$post_data->ses_employerfit);
				foreach($employerfit as $fit) {

					$fit_id = trim($fit);
					$data = array(
						'type_rel_userid'  => $user_id,
						'type_id'   =>  $fit_id,
						'type_rel_category' => 'employer_fit'
						);

					$this->db->insert('type_user_rel', $data);
				}
			}
			if(isset($post_data->ses_jobfit)){

				$jobfit = explode(',',$post_data->ses_jobfit);
				foreach($jobfit as $jfit) {

					$jfit_id = trim($jfit);
					$jdata = array(
						'type_rel_userid'  => $user_id,
						'type_id'   =>  $jfit_id,
						'type_rel_category' => 'job_fit'
						);

					$this->db->insert('type_user_rel', $jdata);
				}
			}
			if(isset($post_data->ses_industrylist)){
				foreach($post_data->ses_industrylist as $industrylist) { 
					$industrydata = array(
						'category_type'  => 'industry',
						'industry_id'   =>  $industrylist->industry_id,
						'users_id' => $user_id
						);
					$industryid = $this->API_model->insert_cmn_tbl('industry_user_relation',$industrydata);
								 
					if(isset($post_data->ses_seniorityList)){
						foreach($post_data->ses_seniorityList as $seniorityList) { 
							if($industrylist->industry_id == $seniorityList->industry_id){
								$senioritydata = array(
								'rel_industry_id'  => $industryid,
								'level_id'   =>  $seniorityList->level_id,
								'user_id' => $user_id
								);
							$this->db->insert('industry_user_level_relation', $senioritydata);
							}
							
						}
					}

				}
			}
			
			
			$user = $this->API_model->validateUserLogin($username, $password);
			//$success = array('success' => '1','message' => 'Sign up successful, please, log in.' );		
			$success = array('success' => '1','list' => $user);		
			$this->response($success, 200); // 200 being the HTTP response code
		}
		else
		{
			$Error = array('error' => 'Username already exists.' );
			$this->response($Error, 200);
		}
	}

	function jobfit_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));
		//echo "<pre>";print_r($post_data);exit;
		
		if(isset($post_data->jobfit)){

			if($post_data->status == '1'){
				$jdata = array(
					'type_rel_userid'  => $post_data->user_id,
					'type_id'   =>  $post_data->jobfit,
					'type_rel_category' => $post_data->type
					);

				$user_id = $this->API_model->insert_cmn_tbl('type_user_rel', $jdata);

				
			}else{
				$this->API_model->delete_post($post_data->user_id,$post_data->type,$post_data->jobfit);
				$user_id = '';
			}					

		}
		
		if($user_id)
		{	
			$success = array('status' => 'true' );		
			$this->response($success, 200); // 200 being the HTTP response code
		}
		else
		{
			
			$Error = array('status' => 'false');
			$this->response($Error, 200);
		}
	}

	
	
	function getAlltype_get($type)
	{
		//echo 'type='.$type;exit;
		if(isset($type)){
			$myrow = $this->API_model->get_all_type($type);
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



	function checkedJobfit_post()
	{
		$data = json_decode(file_get_contents("php://input"));		
		$user_id = $data->user_id;
		$type = $data->type;
		
		$myrow = $this->API_model->get_checked_type($user_id,$type);	
		//echo '<pre>';print_r(count($myrow));exit;
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			
		}
		else
		{
			$Error = array();
			$this->response($Error, 200);
		}
	}
	function update_profile_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));		
		 //echo '<pre>';print_r($post_data);exit;
		if($post_data->users_companyid != '' && $post_data->users_companyid != 0){
			$company_data = array(			
			'company_name' =>$post_data->company_name			
			); 
			if($post_data->company_url){
				$company_data['company_url'] = $post_data->company_url;
			}
			$this->API_model->update_cmn_tbl('company','company_id',$post_data->users_companyid,$company_data);			
		}

		// if(!empty($post_data->locations)){
		// 		$row = $this->API_model->get_master_record('users_locations_relation','relation_user_id',$post_data->user_id,'');
		// 		if(count($row) > 0){
		// 			$this->API_model->commonDelete('users_locations_relation','relation_user_id',$post_data->user_id);
		// 		}
		// 		foreach ($post_data->locations as $key => $value) {
		// 			$reldata = array(			
		// 				'relation_user_id' =>$post_data->user_id,
		// 				'relation_locations_id' =>$value->code			
		// 			);
		// 			$this->API_model->insert_cmn_tbl('users_locations_relation', $reldata);
		// 		}				 
		// }

		if(!empty($post_data->users_skills)){
			//echo "<pre>";print_r($post_data->users_skills);exit;
				$row = $this->API_model->get_master_record('users_skills_relation','relation_user_id',$post_data->user_id,'');
				if(count($row) > 0){
					$this->API_model->commonDelete('users_skills_relation','relation_user_id',$post_data->user_id);
				}
				foreach ($post_data->users_skills as $key => $value) {
					$skilldata = array(			
						'relation_user_id' =>$post_data->user_id,
						'relation_skills_id' =>$value->code			
					);
					$this->API_model->insert_cmn_tbl('users_skills_relation', $skilldata);
				}				 
		}
		
		// $user_data = array(			
		// 	'users_firstname' =>$post_data->users_firstname,
		// 	'users_lastname' =>$post_data->users_lastname,
		// 	'users_bio' =>$post_data->users_bio,
		// 	'users_current_employer' =>$post_data->users_current_employer,			
		// 	'users_current_title' =>$post_data->users_current_title,
		// 	'users_linkedin_link' =>$post_data->users_linkedin_link,
		// 	'users_twitter_link' =>$post_data->users_twitter_link,
		// 	'users_facebook_link' =>$post_data->users_facebook_link,
		// 	'users_istagram_link' =>$post_data->users_istagram_link
		// );

			if($post_data->users_firstname){
				$user_data['users_firstname'] = $post_data->users_firstname;
			}
			if($post_data->users_lastname){
				$user_data['users_lastname'] = $post_data->users_lastname;
			}
			if($post_data->users_bio){
				$user_data['users_bio'] = $post_data->users_bio;				 
				//$user_data['users_bio_text'] =  strip_tags($post_data->users_bio);
			}
			if($post_data->users_current_employer){
				$user_data['users_current_employer'] = $post_data->users_current_employer;
			}
			if($post_data->users_current_title){
				$user_data['users_current_title'] = $post_data->users_current_title;
			}
			if($post_data->users_linkedin_link){
				$user_data['users_linkedin_link'] = $post_data->users_linkedin_link;
			}
			if($post_data->users_twitter_link){
				$user_data['users_twitter_link'] = $post_data->users_twitter_link;
			}
			if($post_data->users_facebook_link){
				$user_data['users_facebook_link'] = $post_data->users_facebook_link;
			}
			if($post_data->users_istagram_link){
				$user_data['users_istagram_link'] = $post_data->users_istagram_link;
			}
			if($post_data->users_country){
				$user_data['users_country'] = $post_data->users_country;
			}
			if($post_data->users_state){
				$user_data['users_state'] = $post_data->users_state;
			}
			if($post_data->users_city){
				$user_data['users_city'] = $post_data->users_city;
			}

		//echo '<pre>';print_r($user_data);exit;
		$user_id = $this->API_model->update_profile_tbl($user_data,$post_data->user_id);
		if($user_id > '-1')
		{
			$this->response($user_id, 200); // 200 being the HTTP response code
			
		}
		else
		{
			$Error = 'error';
			$this->response($Error, 200);
		}
	}
	function getProfileinfo_get($id)
	{
		
		if(isset($id)){
			$myrow = $this->API_model->get_profile_info($id);
			//echo $this->db->last_query();
			 
		}
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = 'error';
			$this->response($Error, 404);
		}
	}

	function getStatelist_get($type,$id='')
	{
		//echo $type.'---'.$id;exit;
		if(isset($id)){
			if($type == 'state'){
				$myrow = $this->API_model->get_master_record('states','country_id',$id,'name');
			}else if($type == 'city'){
				$myrow = $this->API_model->get_master_record('cities','state_id',$id,'name');
			}else if($type == 'country'){
				$myrow = $this->API_model->get_master_record('countries',null,null,'name');
			}
			
			//echo '<pre>';print_r($myrow);
		}
		
		//if(count($myrow)>0)
		//{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		// }
		// else
		// {
		// 	$Error = 'error';
		// 	$this->response($Error, 200);
		// }
	}

	function singlerecord_post()
	{

		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;
		$myrow = $this->API_model->get_single_record('users','users_username',$post_data->username);
		
		if(count($myrow)>0)
		{
			$row = $this->API_model->user_status_check($post_data->username);
			
			if(count($row)> 0){
				$Error = array('error' => '1','message' => 'User is inactive please contact the administrator.' );
				$this->response($Error, 200);

			}else{

				$password = str_shuffle('a5b2c#!3');
				//echo '<pre>';print_r($password);exit;
				$email = $this->API_model->sendmail($post_data->username,$password);

				$data = array(			
					'users_password' =>$password
					);
				$affected_id = $this->API_model->update_cmn_tbl('users','users_username',$post_data->username,$data);

				$this->response($myrow, 200); // 200 being the HTTP response code
			}
			
		}
		else
		{
			$Error = array('error' => '1','message' => 'Invalid username.' );
			$this->response($Error, 200);
		}
	}

	

	

	/* ----------------------------parsu start-----------------------*/

	function gettypecategories_get()
	{
		// 	//echo '<pre>';print_r($myrow);
		$myrow = $this->API_model->gettypecategories();
		
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

	function gettypecategory_get($typeCategoryID)
	{
		//echo 'type='.$type;
		if(isset($typeCategoryID)){
			$myrow = $this->API_model->get_single_typecategory($typeCategoryID);
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


	function addEdit_typecategory_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));
		//echo "<pre>";print_r($post_data);exit;	
		$typecategory_data = array(
			'type_name' =>$post_data->name,
			'type_category' =>$post_data->typecategory,
			'type_status' =>$post_data->status
			);
		if($post_data->description){
			$typecategory_data['description'] = $post_data->description;
			if($post_data->cmsAction == "Edit"){
				$data['description'] = $post_data->description;
				$this->API_model->edit_typecategory($post_data->id,$data);
		    }
		}

		$typecategoryName = trim($post_data->name);
		$typecategory = trim($post_data->typecategory);
		$duplicateTypeCategories = $this->API_model->check_duplicateTypeCategories($typecategoryName,$typecategory,$post_data->status);
		//echo count($duplicateTypeCategories);exit;
		if(count($duplicateTypeCategories) > 0){
             //echo "Dupicate typecategory"; exit;
			$Error = array('message' => 'Type category already exists!' );
             $this->response($Error, 200); // 200 being the HTTP response code
         } else {

         	if($post_data->cmsAction == "Insert"){
         		$inactiveUsers = $this->API_model->fetch_inactiveTypeCategories($typecategoryName,$typecategory); 
         		if(count($inactiveUsers) > 0){
         			$Error = array('message' => 'Inactive type category cannot be inserted!' );
                    $this->response($Error, 200); // 200 being the HTTP response code 
                } else {
                	$typecategory_id = $this->API_model->add_typecategory($typecategory_data);

                	if($typecategory_id)
                	{
						$this->response($typecategory_id, 200); // 200 being the HTTP response code
					}
					else
					{
						$Error = array('message' => 'Type Category Insert Failure' );
						$this->response($Error, 404);
					}
				}
			} else if($post_data->cmsAction == "Edit"){
				$typeID = $post_data->id;
				$updatetypecategory_id = $this->API_model->edit_typecategory($typeID,$typecategory_data);

				if($updatetypecategory_id)
				{
					$this->response($updatetypecategory_id, 200); // 200 being the HTTP response code
				}
				else
				{
					$Error = array('message' => 'Type Category Update Failure' );
					$this->response($Error, 404);
				}
			}
		}
	}

	function getallusers_get()
	{
		// 	//echo '<pre>';print_r($myrow);
		$myrow = $this->API_model->getallusers();
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array('message' => 'No records found.' );
			$this->response($Error, 404);
		}
	}

	function updateuserstatus_post(){
		$post_data = json_decode(file_get_contents("php://input"));
		//echo "<pre>";print_r($post_data);exit;
		$updateuser_id = -1;
		$userId = $post_data->userId;
		$userStatus = $post_data->userStatus;
		$updateuser_id = $this->API_model->edit_userstatus($userId,$userStatus);	
		
		if($updateuser_id)
		{
				$this->response($updateuser_id, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('message' => 'User Status Update Failure' );
				$this->response($Error, 404);
			}  

		}
		
		function fetchEducations_get(){
    	$educations = $this->API_model->getalleducations();

		if(count($educations)>0)
		{
			$this->response($educations, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array('message' => 'No records found.' );
			$this->response($Error, 404);
		}
    }
    
     function education_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));
		
		if(isset($post_data->education)){
			if($post_data->status == '0'){
				$this->API_model->delete_post($post_data->user_id,$post_data->type,$post_data->education);
				$user_id = '';
			}else{
				$jdata = array(
					'type_rel_userid'  => $post_data->user_id,
					'type_id'   =>  $post_data->education,
					'type_rel_category' => $post_data->type
					);

				$user_id = $this->API_model->insert_cmn_tbl('type_user_rel', $jdata);

			}					

		}
		
		if($user_id)
		{	
			$success = array('status' => 'true' );		
			$this->response($success, 200); // 200 being the HTTP response code
		}
		else
		{
			
			$Error = array('status' => 'false');
			$this->response($Error, 200);
		}
	}



  function delparntchildcatgry_post(){
		$post_data = json_decode(file_get_contents("php://input"));
		//echo "<pre>";print_r($post_data);exit;
		$category_data = array(
			'type_parent_id'=> $post_data->type_parent_id,
			'type_rel_userid'=> $post_data->type_userID
			);
		$subcategorydeleteRes = $this->API_model->deletesubcategories($category_data);
		$categoryydeleteRes = $this->API_model->deletecategory($post_data->type_userID,$post_data->type_parent_id,'education');	
		
		if(($subcategorydeleteRes > 0 && $categoryydeleteRes > 0) || $categoryydeleteRes > 0)
		{
				$this->response("Deleting this Degree will remove any

correlating field of study selections that you have made.", 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('message' => 'Degree and Field of study deletion failed.' );
				$this->response($Error, 404);
			}  

		}

		function delchildcatgry_post(){
			$post_data = json_decode(file_get_contents("php://input"));
		//echo "<pre>";print_r($post_data);exit;
			$subcategorydeleteRes = $this->API_model->deletecategory($post_data->type_userID,$post_data->type_child_id,'education');

			if($subcategorydeleteRes > 0)
			{
				$this->response("Field of study deleted successfully.", 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('message' => 'Degree and Field of study deletion failed.' );
				$this->response($Error, 404);
			}  

		}
		/*----------------------------------parsu end-----------------------*/
	function getIndustryList_get()
	{
			
		$myrow = $this->API_model->get_master_record('industry','industry_status','0','industry_id');		
		//echo "<pre>";print_r($myrow)
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array();
			$this->response($Error, 200);
		}
	}
	function getIndustrydata_get($user_id)
	{			
		$myarray = array();
		$myrow = $this->API_model->get_master_record('industry','industry_status','0','industry_id');	
		//echo '<pre>';print_r($myrow);exit;
		$row = $this->API_model->get_industry_user_relation($user_id);
		foreach ($row as $key1 => $value1) {
			$myarray[] = $value1['industry_id'];
		}

		foreach ($myrow as $key => $value) {			
			if (!in_array($value['industry_id'], $myarray))
			  {
			  	$mydata[] = $value;
			  }			 
		}
		//echo '<pre>';print_r($mydata);exit;
		 
		if(count($mydata)>0)
		{
			$this->response($mydata, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array();
			$this->response($Error, 200);
		}
	}
	function getjobpostindustryList_get($jobpost_id)
	{
		 
		$myarray = array();
		$myrow = $this->API_model->get_master_record('industry','industry_status','0','industry_id');		
		$row=$this->API_model->get_jobs_industry($jobpost_id);
		//echo '<pre>';print_r($row);exit;
		foreach ($row as $key1 => $value1) {
			$myarray[] = $value1['type_id'];
		}

		foreach ($myrow as $key => $value) {			
			if (!in_array($value['industry_id'], $myarray))
			  {
			  	$mydata[] = $value;
			  }			 
		}
		//echo '<pre>';print_r($mydata);exit;
		 
		if(count($mydata)>0)
		{
			$this->response($mydata, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array();
			$this->response($Error, 200);
		}
	}
	function getseniorityList_get()
	{
			
		$myrow = $this->API_model->get_master_record('seniorities','seniority_status','0','seniority_id');		
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array();
			$this->response($Error, 200);
		}
	}
	function getAreaList_get($id)
	{			
		//$myrow = $this->API_model->get_master_record('functional_area','area_status','0','area_name');
		$myrow = $this->API_model->get_master_record('functional_area','industry_id',$id,'area_id');	
		
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
	function getlocationsList_get()
	{			
		$myrow = $this->API_model->get_master_record('locations','locations_status','0','locations_name');		
		
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

	function getlocationdata_get($id)
	{			
		$mydata = array();
		$myrow=$this->API_model->get_users_county_state($id);
		foreach ($myrow as $key => $value) {
			$row=$this->API_model->get_users_state_city($value['users_locations_relation_id']);
			 
			$mydata[] = $value;
			$mydata[$key]['state'] = $row;
			foreach ($row as $k => $value1) {
				 $citylist=$this->API_model->location_city_relation($value1['id']);				 
				 $mydata[$key]['state'][$k]['city'] = $citylist;
			}
			
		}	
		//echo '<pre>';print_r($mydata);exit; 	
		if(count($mydata)>0)
		{
			$this->response($mydata, 200);  
			 
		}
		else
		{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}
	}
	function getalljobdata_get($id)
	{			
		$mydata = array();
		$myrow=$this->API_model->get_jobs_industry($id);
		foreach ($myrow as $key => $value) {
			$row=$this->API_model->get_jobs_industry_area($value['jobpost_id'],$value['type_id']);			 
			$mydata[] = $value;
			$mydata[$key]['area'] = $row;		 
			
		}	
		//echo '<pre>';print_r($mydata);exit; 	
		if(count($mydata)>-1)
		{
			$this->response($mydata, 200);  
			 
		}
		else
		{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}
	}
	function getdatapostjob_get($id)
	{			
		$mydata = array();
		$myrow=$this->API_model->get_jobs_industry_unique($id);
		foreach ($myrow as $key => $value) {
			$row=$this->API_model->get_jobs_industry_area($value['jobpost_id'],$value['type_id']);			 
			$mydata[] = $value;
			$mydata[$key]['area'] = $row;		 
			
		}	
		//echo '<pre>';print_r($mydata);exit; 	
		if(count($mydata)>-1)
		{
			$this->response($mydata, 200);  
			 
		}
		else
		{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}
	}
	function getlocationEditdata_get($id)
	{				 
		 $mydata=$this->API_model->get_users_country_state_city($id);	
		 $row=$this->API_model->location_city_relation($id);
		 $mydata[0]['city'] = 	 $row;
		//echo '<pre>';print_r($mydata);exit;
		if(count($mydata)>0)
		{
			$this->response($mydata, 200);  
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}
	}
	function getskillsList_get()
	{			
		$myrow = $this->API_model->get_master_record('skills_master','skills_status','0','skills_name');		
		
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

	function addpostJob_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;
		if(isset($post_data->jobpost_title)){

			$titlelist = $this->API_model->get_title_master(trim($post_data->jobpost_title));
			if(!empty($titlelist)){
				$jobpost_title = $titlelist[0]['type_id'];
			}else{
				$typedata = array(	
					'type_name' =>$post_data->jobpost_title,
					'type_category' =>'titles'					 
				);
				$jobpost_title = $this->API_model->insert_cmn_tbl('type', $typedata);
			}			 
		} 
		 
		if($post_data->action == 'insert'){
			$data = array(	
				'jobpost_companyid' =>$post_data->users_companyid,
				'jobpost_userid' =>$post_data->users_id				 
			);
			$id = $this->API_model->insert_cmn_tbl('jobpost',$data);

			if(!empty($post_data->profile_industry)){				 
				foreach ($post_data->profile_industry as $key => $industry) {
						$industry_data = array(	
							'jobpost_id' =>$id,		
							'company_id' =>$post_data->users_companyid,
							'user_id' =>$post_data->users_id,
							'type_id' =>$industry->industry_id,
							'type' =>'area'
						);		
					$this->API_model->insert_cmn_tbl('jobpost_company_relation',$industry_data);
					//echo '<pre>';print_r($industry->area);
					if(!empty($industry->area)){				 
						foreach ($industry->area as $key1 => $area) {
								$area_data = array(	
									'jobpost_id' =>$id,		
									'company_id' =>$post_data->users_companyid,
									'user_id' =>$post_data->users_id,
									'industry_id' =>$industry->industry_id,
									'area_id' =>$area->area_id
								);	
						//echo '<pre>';print_r($area_data);exit;	
						$this->API_model->insert_cmn_tbl('jobpost_company_industry_area',$area_data);
						}
					}
				}
			}

		}else{
			 
			$data = array(	
				'jobpost_companyid' =>$post_data->users_companyid,
				'jobpost_userid' =>$post_data->users_id,		
				'jobpost_title' =>$jobpost_title,			
				'jobpost_description' =>$post_data->jobpost_description,
				//'jobpost_exp_minimum' =>$post_data->jobpost_exp_minimum,
				//'jobpost_exp_maximum' =>$post_data->jobpost_exp_maximum,			
				//'jobpost_jobtype' =>$post_data->jobpost_jobtype,
				'jobpost_countryid' =>$post_data->country_id,
				'jobpost_stateid' =>$post_data->state_id,
				'jobpost_cityid' =>$post_data->city_id,
				//'jobpost_status' =>$post_data->jobpost_status,
				'jobpost_tilldata' =>$post_data->jobpost_tilldata,
				'jobpost_url' =>$post_data->jobpost_url
			);
			if($post_data->jobpost_status){
				$data['jobpost_status'] = $post_data->jobpost_status;
			}

			$this->API_model->update_cmn_tbl('jobpost','jobpost_id',$post_data->jobpost_id,$data);
			$id = $post_data->jobpost_id;
		}
			 
		if($id)
		{
			
			// if(!empty($post_data->locations)){
			// 	$this->API_model->commonrelationDel('jobpost_company_relation',$id,'location');
			// 	foreach ($post_data->locations as $key => $value) {
			// 			$locations_data = array(	
			// 				'jobpost_id' =>$id,		
			// 				'company_id' =>$post_data->users_companyid,
			// 				'user_id' =>$post_data->users_id,
			// 				'type_id' =>$value->id,
			// 				'type' =>'location'
			// 			);		
			// 	$this->API_model->insert_cmn_tbl('jobpost_company_relation',$locations_data);
			// 	}
			// }
			// if(!empty($post_data->jobpost_skills)){
			// 	$this->API_model->commonrelationDel('jobpost_company_relation',$id,'skill');
			// 	foreach ($post_data->jobpost_skills as $key => $value) {
			// 			$skills_data = array(	
			// 					'jobpost_id' =>$id,		
			// 					'company_id' =>$post_data->users_companyid,
			// 					'user_id' =>$post_data->users_id,
			// 					'type_id' =>$value,
			// 					'type' =>'skill'
			// 				);		
			// 	$this->API_model->insert_cmn_tbl('jobpost_company_relation',$skills_data);
			// 	}
			// }
			// if(!empty($post_data->jobpost_area)){
			// 	$this->API_model->commonrelationDel('jobpost_company_relation',$id,'area');
			// 	foreach ($post_data->jobpost_area as $key => $value) {
			// 			$area_data = array(	
			// 					'jobpost_id' =>$id,		
			// 					'company_id' =>$post_data->users_companyid,
			// 					'user_id' =>$post_data->users_id,
			// 					'type_id' =>$value,
			// 					'type' =>'area'
			// 				);		
			// 	$this->API_model->insert_cmn_tbl('jobpost_company_relation',$area_data);
			// 	}
			// }
			// if(!empty($post_data->jobpost_industry)){
			// 	$this->API_model->commonrelationDel('jobpost_company_relation',$id,'area');
			// 	foreach ($post_data->jobpost_industry as $key => $value) {
			// 			$area_data = array(	
			// 					'jobpost_id' =>$id,		
			// 					'company_id' =>$post_data->users_companyid,
			// 					'user_id' =>$post_data->users_id,
			// 					'type_id' =>$value,
			// 					'type' =>'area'
			// 				);		
			// 	$this->API_model->insert_cmn_tbl('jobpost_company_relation',$area_data);
			// 	}
			// }
			if(!empty($post_data->jobpost_jobfit)){
				$this->API_model->commonrelationDel('jobpost_company_relation',$id,'jobfit');
				foreach ($post_data->jobpost_jobfit as $key => $value) {
						$jobfit_data = array(	
								'jobpost_id' =>$id,		
								'company_id' =>$post_data->users_companyid,
								'user_id' =>$post_data->users_id,
								'type_id' =>$value,
								'type' =>'jobfit'
							);		
				$this->API_model->insert_cmn_tbl('jobpost_company_relation',$jobfit_data);
				}
			}
			// if(!empty($post_data->jobpost_employer)){
			// 	$this->API_model->commonrelationDel('jobpost_company_relation',$id,'employerfit');
			// 	foreach ($post_data->jobpost_employer as $key => $value) {
			// 			$empfit_data = array(	
			// 					'jobpost_id' =>$id,		
			// 					'company_id' =>$post_data->users_companyid,
			// 					'user_id' =>$post_data->users_id,
			// 					'type_id' =>$value,
			// 					'type' =>'employerfit'
			// 				);		
			// 	$this->API_model->insert_cmn_tbl('jobpost_company_relation',$empfit_data);
			// 	}
			// }			
			if(!empty($post_data->jobpost_seniority)){
				$this->API_model->commonrelationDel('jobpost_company_relation',$id,'seniority');
				foreach ($post_data->jobpost_seniority as $key => $value) {
						$seniority_data = array(	
								'jobpost_id' =>$id,		
								'company_id' =>$post_data->users_companyid,
								'user_id' =>$post_data->users_id,
								'type_id' =>$value,
								'type' =>'seniority'
							);		
				$this->API_model->insert_cmn_tbl('jobpost_company_relation',$seniority_data);
				}
			}
			$success = array('status' => $id,'message' => 'Job posted successfully.');					
			$this->response($success, 200); // 200 being the HTTP response code
		}
		else
		{
			$Error = array('status' => '0','message' => 'error in insert record.' );
			$this->response($Error, 200);
		}		
	}

	function addTitles_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);   
		if(isset($post_data))
		{			
			if($post_data->othercompany){
				// $companydata = array(	
				// 	'company_name' =>$post_data->othercompany					 
				// );
				// $c_id = $this->API_model->insert_cmn_tbl('company_master',$companydata);
				// $company_id = $c_id;
				$other_company = $post_data->othercompany;
				$company_id = '0';
			}else{
				//$company_id = $post_data->company_id;
				$company = $this->API_model->get_company_master($post_data->company_id);			 
				$company_id = $company[0]['company_id'];
				$other_company = '';
			}

			if($post_data->other_title_text){
				$this->API_model->commonDelete('assign_titles','relation_id',$post_data->id);
				$other_title_text = $post_data->other_title_text;
			}else{
				$other_title_text = null;
			}
			
			$data = array(	
					'category_type' =>'titles',		
					'users_id' =>$post_data->users_id,			
					'company_id' =>$company_id,						 	
					'start_year' =>$post_data->start_year,
					'end_year' =>$post_data->end_year,
					'other_title_text' =>$other_title_text,
					'other_company' =>$other_company
			);
 
			//echo '<pre>';print_r($data);   exit;
			
			if($post_data->action== "insert"){					
					
					$title_id = $this->API_model->insert_cmn_tbl('title_user_relation',$data);
					//echo '<pre>';print_r($post_data->titles);exit;
					if(isset($post_data->titles) && $other_title_text == null){
						foreach ($post_data->titles as  $title_assign) {					 
							$titledata = array(	
								'company_id' =>$company_id,
								'relation_id' =>$title_id,
								'userid' =>$post_data->users_id,		
								'title_id' =>$title_assign->id				 
							);						 
						$type_id = $this->API_model->insert_cmn_tbl('assign_titles',$titledata);
						} 
					}
				 
			}else if($post_data->action == 'update'){
				 //echo '<pre>';print_r($post_data);
				$this->API_model->update_cmn_tbl('title_user_relation','id',$post_data->id,$data);
				$title_id = 1;
				 if(isset($post_data->titles) && $other_title_text == null){					 
					// echo '<pre>';print_r($post_data->titles); exit;
					$this->API_model->commonDelete('assign_titles','relation_id',$post_data->id);
					 foreach ($post_data->titles as  $title_assign) {					 
							$titledata = array(	
								'company_id' =>$company_id,
								'relation_id' =>$post_data->id,
								'userid' =>$post_data->users_id,		
								'title_id' =>$title_assign->id				 
							);						 
						   $type_id = $this->API_model->insert_cmn_tbl('assign_titles',$titledata);
					}
				} 
			}	 
			
			if(($title_id != '') || ($type_id != ''))
			{			
				$success = array('status' => '1','message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Error' );
				$this->response($Error, 200);
			}

		}
		else
		{
			$Error = array('status' => '0','message' => 'Error' );
			$this->response($Error, 200);
		}
	}
	function gettitleData_get($id){
		//echo $id;exit;
		$mydata =array();
		$myrow = $this->API_model->get_title_user_relation($id);
		foreach ($myrow as $key => $value) {
			$row = $this->API_model->get_assign_titles($value['id']);
			
			 $value['titles'] =$row;
			 $mydata[] = $value;
		}
			if($mydata)
			{			
				//$success = array('status' => '1','message' => 'succes');				 				
				$this->response($mydata, 200); // 200 being the HTTP response code
			}
			else
			{
				$success = array();
				$this->response($success, 200);
			}
	}
	function getsingletitleData_get($id){
		//echo $id;exit;
		$mydata =array();
		$myrow = $this->API_model->get_title_single_user_relation($id);
		foreach ($myrow as $key => $value) {
			$row = $this->API_model->get_assign_titles($value['id']);
			
			 $value['titles'] =$row;
			 $mydata[] = $value;
		}
			if($mydata)
			{			
				//$success = array('status' => '1','message' => 'succes');				 				
				$this->response($mydata, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Error' );
				$this->response($Error, 200);
			}
	}
	function deletetitle_post(){
			$post_data = json_decode(file_get_contents("php://input"));	
			$id = $post_data->id; 
			$del_id = $this->API_model->commonDelete('title_user_relation','id',$id);
			//echo $del_id;exit;		 
			if($del_id != 0)
			{	
				$this->API_model->commonDelete('assign_titles','relation_id',$post_data->id);
				$success = array('status' => '1','message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array();
				$this->response($Error, 200);
			}
	}

	// start  26/7/2017 =====================================

	function addIndustry_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;		 
		if(isset($post_data))
		{			
			$data = array(	
					'category_type' =>'industry',		
					'users_id' =>$post_data->users_id,			
					'industry_id' =>$post_data->industry_id,						 	
					//'level' =>$level_name
			);		 
			
			if($post_data->action== "insert"){				
					
				$rel_id = $this->API_model->insert_cmn_tbl('industry_user_relation',$data);
				//echo '<pre>';print_r($post_data->titles);exit;
				if(isset($post_data->area)){
					foreach ($post_data->area as  $area) {					 
						$industrydata = array(	
							'industry_id' =>$post_data->industry_id,
							'relation_id' =>$rel_id,
							'userid' =>$post_data->users_id,		
							'area_id' =>$area				 
						);						 
					$type_id = $this->API_model->insert_cmn_tbl('assign_industry',$industrydata);
					} 
				}
				
			if(isset($post_data->level)){
					$row = $this->API_model->get_master_record('industry_user_level_relation','rel_industry_id',$rel_id,'rel_industry_id');
					if(count($row) > 0){
						$this->API_model->commonDelete('industry_user_level_relation','rel_industry_id',$rel_id);
					}				
					foreach ($post_data->level as  $level) {					 
						$level_data = array(	
							'rel_industry_id' =>$rel_id,							 
							'user_id' =>$post_data->users_id,		
							'level_id' =>$level				 
						);					 						 
						$this->API_model->insert_cmn_tbl('industry_user_level_relation',$level_data);
					} 
				}
				 
			}else if($post_data->action == 'update'){
				 //echo '<pre>';print_r($post_data);
			$rel_id=$this->API_model->update_cmn_tbl('industry_user_relation','id',$post_data->id,$data);
			
				 if(isset($post_data->area)){

					$this->API_model->commonDelete('assign_industry','relation_id',$post_data->id);
					foreach ($post_data->area as  $area) {					 
							$industrydata = array(	
								'industry_id' =>$post_data->industry_id,
								'relation_id' =>$post_data->id,
								'userid' =>$post_data->users_id,		
								'area_id' =>$area				 
							);	
							//echo '<pre>';print_r($industrydata); exit;						 
						$type_id = $this->API_model->insert_cmn_tbl('assign_industry',$industrydata);
					}
				 } 
			if(isset($post_data->level)){
					$row = $this->API_model->get_master_record('industry_user_level_relation','rel_industry_id',$post_data->id,'rel_industry_id');
					if(count($row) > 0){
						$this->API_model->commonDelete('industry_user_level_relation','rel_industry_id',$post_data->id);
					}				
					foreach ($post_data->level as  $level) {					 
						$level_data = array(	
							'rel_industry_id' =>$post_data->id,							 
							'user_id' =>$post_data->users_id,		
							'level_id' =>$level				 
						);					 						 
						$this->API_model->insert_cmn_tbl('industry_user_level_relation',$level_data);
					} 
				}
			}	 
			
			if(($rel_id != '') || ($type_id != ''))
			{			
				$success = array('status' => '1','message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Error' );
				$this->response($Error, 200);
			}

		}
		else
		{
			$Error = array('status' => '0','message' => 'Error' );
			$this->response($Error, 200);
		}
	}
	function manageindustry_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;		 
		if(isset($post_data))
		{			
			$data = array(	
					'jobpost_id' =>$post_data->jobpost_id,		
					'company_id' =>$post_data->users_companyid,			
					'user_id' =>$post_data->users_id,
					'type_id' =>$post_data->industry_id,						 	
					'type' =>'area'
			);		 
			
			if($post_data->action== "insert"){				
					
				$rel_id = $this->API_model->insert_cmn_tbl('jobpost_company_relation',$data);				 
				// $pro_data = array(	
				// 	'category_type' =>'industry',		
				// 	'industry_id' =>$post_data->industry_id,			
				// 	'users_id' =>$post_data->users_id
				// );
				// $relation_id = $this->API_model->insert_cmn_tbl('industry_user_relation',$pro_data);
				 
				
				//echo '<pre>';print_r($post_data->titles);exit;
				if(isset($post_data->area)){
					foreach ($post_data->area as  $area) {					 
						$industrydata = array(	
							'industry_id' =>$post_data->industry_id,
							'jobpost_id' =>$post_data->jobpost_id,
							'company_id' =>$post_data->users_companyid,	
							'user_id' =>$post_data->users_id,	
							'area_id' =>$area				 
						);						 
					$type_id = $this->API_model->insert_cmn_tbl('jobpost_company_industry_area',$industrydata);
					// 	$inddata = array(	
					// 		'industry_id' =>$post_data->industry_id,
					// 		'relation_id' =>$relation_id,
					// 		'userid' =>$post_data->users_id,		
					// 		'area_id' =>$area				 
					// 	);						 
					// $this->API_model->insert_cmn_tbl('assign_industry',$inddata);

					} 
				}
			 
				 
			}else if($post_data->action == 'update'){
				 //echo '<pre>';print_r($post_data);
			$rel_id=$this->API_model->update_cmn_tbl('jobpost_company_relation','relation_id',$post_data->relation_id,$data);
			
				 if(isset($post_data->area)){

					$this->API_model->delete_arealist($post_data->jobpost_id,$post_data->industry_id);
					foreach ($post_data->area as  $area) {					 
							$industrydata = array(	
								'industry_id' =>$post_data->industry_id,
								'jobpost_id' =>$post_data->jobpost_id,
								'company_id' =>$post_data->users_companyid,	
								'user_id' =>$post_data->users_id,	
								'area_id' =>$area				 
							);	
							//echo '<pre>';print_r($industrydata); exit;						 
						$type_id = $this->API_model->insert_cmn_tbl('jobpost_company_industry_area',$industrydata);
					}
				 } 
			
			}	 
			
			if(($rel_id != '') || ($type_id != ''))
			{			
				$success = array('status' => '1','message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Error' );
				$this->response($Error, 200);
			}

		}
		else
		{
			$Error = array('status' => '0','message' => 'Error' );
			$this->response($Error, 200);
		}
	}
	function addLocation_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;
		if(isset($post_data))
		{
			if($post_data->country_checked == '1'){
				$data = array(	
				'relation_user_id' =>$post_data->users_id,				 
				'rel_country_id' =>$post_data->country_id								 
				);
				//echo '<pre>';print_r($data);exit;
				$checked = $this->API_model->get_checked_country_exist($post_data->users_id,$post_data->country_id);
				//echo '<pre>';print_r($checked[0]['users_locations_relation_id']);exit;
				if(empty($checked)){
					//echo '<pre>';print_r($data);exit;
					$rel_id = $this->API_model->insert_cmn_tbl('users_locations_relation',$data);
				}else{
					$Error = array('status' => '2','rel_id' => $checked[0]['users_locations_relation_id'],'message' => 'Error' );
					$this->response($Error, 200);
				}
				
			}else{
				//echo '<pre>';print_r($post_data);exit;
				$rel_id = $this->API_model->delete_location($post_data->users_id,$post_data->country_id);
			}
				
			
			if($rel_id)
			{			
				$success = array('rel_id' => $rel_id,'message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Error' );
				$this->response($Error, 200);
			}

		}
		else
		{
			$Error = array('status' => '0','message' => 'Error' );
			$this->response($Error, 200);
		}
	}
	function add_industry_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;
		if(isset($post_data))
		{
			if($post_data->industry_status == '1'){
				$data = array(	
				'jobpost_id' =>$post_data->jobpost_id,				 
				'company_id' =>$post_data->users_companyid,
				'user_id' =>$post_data->users_id,
				'type_id' =>$post_data->jobpost_industry,	
				'type' =>'area'								 
				);
				 
				//$rel_id = $this->API_model->insert_cmn_tbl('jobpost_company_relation',$data);	
				$checked = $this->API_model->get_checked_industry_exist($post_data->jobpost_id,$post_data->jobpost_industry);
				//echo '<pre>';print_r($checked[0]['users_locations_relation_id']);exit;
				if(empty($checked)){
					 $rel_id = $this->API_model->insert_cmn_tbl('jobpost_company_relation',$data);	
				}else{
					$Error = array('status' => '2','rel_id' => $checked[0]['type_id'],'message' => 'Error' );
					$this->response($Error, 200);
				}

			}else{
				//echo '<pre>';print_r($post_data);exit;
				$rel_id = $this->API_model->delete_industry($post_data->jobpost_id,$post_data->jobpost_industry);
			}
				
			
			if($rel_id)
			{			
				$success = array('relation_id' => $rel_id,'message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Error' );
				$this->response($Error, 200);
			}

		}
		else
		{
			$Error = array('status' => '0','message' => 'Error' );
			$this->response($Error, 200);
		}
	}
	function add_functionality_area_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;
		if(isset($post_data))
		{
			if($post_data->area_status == '1'){
				$data = array(	
				'jobpost_id' =>$post_data->jobpost_id,
				'industry_id' =>$post_data->jobpost_industry,				 
				'company_id' =>$post_data->users_companyid,
				'user_id' =>$post_data->users_id,
				'area_id' =>$post_data->jobpost_area				 							 
				);			 
				 
			    $rel_id = $this->API_model->insert_cmn_tbl('jobpost_company_industry_area',$data);
			}else{	
				//echo '<pre>';print_r($post_data);exit;			 
				$rel_id = $this->API_model->delete_area($post_data->jobpost_id,$post_data->jobpost_area);
			}
				
			
			if($rel_id)
			{			
				$success = array('area_relation_id' => $rel_id,'message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Error' );
				$this->response($Error, 200);
			}

		}
		else
		{
			$Error = array('status' => '0','message' => 'Error' );
			$this->response($Error, 200);
		}
	}
	function addlocationState_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;
		if(isset($post_data))
		{
			if($post_data->state_checked == '1'){
				$statedata = array(	
				'relation_id' =>$post_data->relation_id,				 
				'country_id' =>$post_data->country_id,
				'user_id' =>$post_data->users_id,
				'state_id' =>$post_data->state_id								 
				);
				//echo '<pre>';print_r($statedata);exit;
				$rel_id = $this->API_model->insert_cmn_tbl('users_locations_relation_state',$statedata);
				//echo '<pre>';print_r($rel_id);exit;
			}else{				 
				$rel_id = $this->API_model->delete_location_state($post_data->users_id,$post_data->state_id);
			}
				
			
			if($rel_id != '')
			{			
				$success = array('state_relation_id' => $rel_id,'message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Error' );
				$this->response($Error, 200);
			}

		}
		else
		{
			$Error = array('status' => '0','message' => 'Error' );
			$this->response($Error, 200);
		}
	}
	function addlocationCity_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;
		if(isset($post_data))
		{
			if($post_data->city_checked == '1'){
				$datacity = array(	
				'relation_id' =>$post_data->state_relation_id,
				'user_id' =>$post_data->users_id,				 
				'country_id' =>$post_data->country_id,				
				'state_id' =>$post_data->state_id,
				'city_id' =>$post_data->city_id								 
				);
				//echo '<pre>';print_r($datacity);exit;
				$rel_id = $this->API_model->insert_cmn_tbl('users_locations_relation_city',$datacity);
				 
			}else{				 
				$rel_id = $this->API_model->delete_location_city($post_data->users_id,$post_data->city_id);
			}				
			
			if($rel_id)
			{			
				$success = array('status' => $rel_id,'message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Error123' );
				$this->response($Error, 200);
			}

		}
		else
		{
			$Error = array('status' => '0','message' => 'Error' );
			$this->response($Error, 200);
		}
	}
	function getlistIndustry_get($id){
		//echo $id;exit;
		$mydata =array();
		$myrow = $this->API_model->get_industry_user_relation($id);
		foreach ($myrow as $key => $value) {
			$row = $this->API_model->get_assign_industry($value['id']);
			$row1 = $this->API_model->get_seniority_level($value['id']);
			
			 $value['area'] =$row;
			 $value['level'] =$row1;
			 $mydata[] = $value;
		}
			if($mydata)
			{			
				//$success = array('status' => '1','message' => 'succes');				 				
				$this->response($mydata, 200); // 200 being the HTTP response code
			}
			else
			{
				$success = array();
				$this->response($success, 200);
			}
	}

	function getindustryinfoData_get($id){
		//echo $id;exit;
		$mydata =array();
		$myrow = $this->API_model->get_master_record('industry_user_relation','id',$id,'id');
		foreach ($myrow as $key => $value) {
			$row = $this->API_model->get_assign_industry($value['id']);
		        $row1 = $this->API_model->get_seniority_level($value['id']);
			 $value['area'] =$row;
			 $value['level'] =$row1;
			 $mydata[] = $value;
		}
			if($mydata)
			{			
				//$success = array('status' => '1','message' => 'succes');				 				
				$this->response($mydata, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Error' );
				$this->response($Error, 200);
			}
	}

	function deleteindustry_post(){
			$post_data = json_decode(file_get_contents("php://input"));	
			$id = $post_data->id; 
			$del_id = $this->API_model->commonDelete('industry_user_relation','id',$id);
			//echo $del_id;exit;		 
			if($del_id != 0)
			{	
				$this->API_model->commonDelete('assign_industry','relation_id',$id);
				$success = array('status' => '1','message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array();
				$this->response($Error, 200);
			}
	}
	function deleteCountry_post(){
			$post_data = json_decode(file_get_contents("php://input"));	
			//echo '<pre>';print_r($post_data);exit;		 
			$del_id = $this->API_model->delete_location($post_data->users_id,$post_data->country_id);	

			if($del_id != 0)
			{				 
				$success = array('status' => '1','message' => 'success');				 				
				$this->response($success, 200);  
			}
			else
			{
				$Error = array();
				$this->response($Error, 200);
			}
	}
	function deletejobpostIndustry_post(){
			$post_data = json_decode(file_get_contents("php://input"));	
			//echo '<pre>';print_r($post_data);exit;		 
			$del_id = $this->API_model->delete_industry($post_data->jobpost_id,$post_data->industry_id);	

			if($del_id != 0)
			{	
				$this->API_model->delete_arealist($post_data->jobpost_id,$post_data->industry_id);			 
				$success = array('status' => '1','message' => 'success');				 				
				$this->response($success, 200);  
			}
			else
			{
				$Error = array();
				$this->response($Error, 200);
			}
	}
	function deletejobpostArea_post(){
			$post_data = json_decode(file_get_contents("php://input"));	
			//echo '<pre>';print_r($post_data);exit;		 
			$del_id = $this->API_model->delete_arealist($post_data->jobpost_id,$post_data->jobpost_industry);			

			if($del_id != 0)
			{					 
				$success = array('status' => '1','message' => 'success');				 				
				$this->response($success, 200);  
			}
			else
			{
				$Error = array();
				$this->response($Error, 200);
			}
	}
	function geteducatetype_get($type)
	{
		//echo 'type='.$type;exit;
		if(isset($type)){
			$myrow = $this->API_model->get_education_type($type);
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
	function getsubeducation_get($id)
	{
		//echo 'type='.$type;exit;
		if(isset($id)){
			$myrow = $this->API_model->geteducationdegrees($id,'education');
			//echo '<pre>';print_r($myrow);
		}
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array();
			$this->response($Error, 200);
		}
	}
	function getpostjobList_post()
	{		 
		$post_data = json_decode(file_get_contents("php://input"));
		$id = $post_data->id;
		$status = $post_data->status;
		$current_job_id = $post_data->current_job_id;
		$short_type = $post_data->short_type;
		
		if(isset($id)){
			$myrow = $this->API_model->get_list_job($id,$status,$current_job_id,$short_type);
			//echo $this->db->last_query();					 
			//echo '<pre>';print_r($myrow);exit;
			foreach ($myrow as $key => $value) {
				$row = $this->API_model->get_master_record('jobpost_company_relation','jobpost_id',$value['jobpost_id'],'relation_id');
				 $locationlist  = '';
				foreach ($row as $key1 => $value1) {	
					// if($value1['type'] == 'location'){				  
				 // 		$location = $this->API_model->getpostjobList($value1['jobpost_id'],$value1['type']);		 
				 // 	}
				 // 	if($value1['type'] == 'skill'){				  
				 // 		$skill = $this->API_model->getpostjobList($value1['jobpost_id'],$value1['type']);	
				 		 
				 // 	}
				 	if($value1['type'] == 'area'){				  
				 		$arealist = $this->API_model->getpostjobList($value1['jobpost_id'],$value1['type']);
				 		// if($arealist){
				 		// 	foreach ($arealist as $k => $value2) {
				 		// 		$list = $this->API_model->get_jobs_industry_area($value1['jobpost_id'],$value2['industry_id']);
				 		// 		//echo "<pre>";print_r($list);
				 		// 		 $arealist[$key]['list'] = $list;
				 		// 	}
				 		// }	
				 		 
				 	}				 	 
				 	if($value1['type'] == 'jobfit'){				  
				 		$jobfit = $this->API_model->getpostjobList($value1['jobpost_id'],$value1['type']);	
				 		 
				 	}
				 	if($value1['type'] == 'employerfit'){				  
				 		$employerfit = $this->API_model->getpostjobList($value1['jobpost_id'],$value1['type']);	
				 		 
				 	}		
					if($value1['type'] == 'seniority'){				  
				 		$seniority = $this->API_model->getpostjobList($value1['jobpost_id'],$value1['type']);	
				 		 
				 	}
				}
				 
				//$myrow[$key]['location'] = $location;				 	 
				//$myrow[$key]['skill'] = $skill;	
				$myrow[$key]['arealist'] = $arealist;	
				$myrow[$key]['jobfit'] = $jobfit;	
				$myrow[$key]['employerfit'] = $employerfit;		
				$myrow[$key]['seniority'] = $seniority;	
				 
			}
			//echo '<pre>';print_r($myrow);exit;
				 
		}
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200);			 
		}
		else
		{
			$Error = array();
			$this->response($Error, 200);
		}
	} 

	function getjobpost_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));
		$id = $post_data->id;
 		if(isset($id)){
			 
			$myrow = $this->API_model->get_jobitem($id);
	 		//$myrow[0]['location'] = $this->API_model->getpostjobList($myrow[0]['jobpost_id'],'location');  		  
	 		//$myrow[0]['skill'] = $this->API_model->getpostjobList($myrow[0]['jobpost_id'],'skill');  	  
	 		$myrow[0]['arealist'] = $this->API_model->getpostjobList($myrow[0]['jobpost_id'],'area');  	  
	 		$myrow[0]['jobfit'] = $this->API_model->getpostjobList($myrow[0]['jobpost_id'],'jobfit');	 	 		  
	 		$myrow[0]['employerfit'] = $this->API_model->getpostjobList($myrow[0]['jobpost_id'],'employerfit');	
			$myrow[0]['seniority'] = $this->API_model->getpostjobList($myrow[0]['jobpost_id'],'seniority');
			 			 
			//echo '<pre>';print_r($myrow);exit;				 
		}
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200);	
			//return $myrow;		 
		}
		else
		{
			$Error = array();
			$this->response($Error, 200);
		}
	}
	function getInstituteList_get()
	{
		$myrow = $this->API_model->get_master_record('institute','status','0','institute_name');
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array();
			$this->response($Error, 200);
		}
	}
	function addEducation_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit; 
		if(isset($post_data))
		{
					$data = array(	
						'category_type' =>'educations',		
						'users_id' =>$post_data->users_id						 						 		 
					); 
					 if($post_data->otherarea){
					 	$data['otherarea'] = $post_data->otherarea;					 	
					 }

					 if($post_data->othereducate){
					 	$data['othereducate'] = $post_data->othereducate;
					 	$data['education_id'] = "0";
					 }
					 if($post_data->education_id){
					 	$data['education_id'] = $post_data->education_id;
					 	$data['othereducate'] = "";
					 }
					 if($post_data->institute_id){
					 	$data['institute_id'] = $post_data->institute_id;
					 	$data['otherinstitute'] = "";
					 }
					 if($post_data->otherinstitute){
					 	$data['otherinstitute'] = $post_data->otherinstitute;
					 	$data['institute_id'] = "0";
					 }
			//echo '<pre>';print_r($data);exit; 
			if($post_data->action == 'insert'){				

				$id = $this->API_model->insert_cmn_tbl('education_user_relation',$data); 
			  
				if(!empty($post_data->subeducation_id)){					 
						foreach ($post_data->subeducation_id as $key => $value) {
							$data = array(	
								'relation_id' =>$id,		
								'education_id' =>$post_data->education_id,			
								'userid' =>$post_data->users_id,						 	
								'subeducation_id' =>$value							 
							); 							 
						$this->API_model->insert_cmn_tbl('assign_education',$data);				 
						}
				} 
				 
			}else{
				$id = $post_data->id;
				//echo '<pre>';print_r($id);exit; 
				$this->API_model->update_cmn_tbl('education_user_relation','id',$id,$data);
				
				if(!empty($post_data->subeducation_id)){
						$this->API_model->commonDelete('assign_education','relation_id',$id);					 
						foreach ($post_data->subeducation_id as $key => $value) {
							$data = array(	
								'relation_id' =>$id,		
								'education_id' =>$post_data->education_id,			
								'userid' =>$post_data->users_id,						 	
								'subeducation_id' =>$value							 
							); 							 
						$this->API_model->insert_cmn_tbl('assign_education',$data);				 
						}
				} 
			}
			 
			
			if($id != '')
			{			
				$success = array('status' => '1','message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Error' );
				$this->response($Error, 200);
			}
				 

		}else{
			$Error = array('status' => '0','message' => 'Error' );
			$this->response($Error, 200);
		}
	}
	function inactivePostjob_post(){
			$post_data = json_decode(file_get_contents("php://input"));	
			
			if($post_data){
			$curdate = date('Y-m-d m:i:s');
			$data = array(	
			     'jobpost_status' =>$post_data->status,
			     'jobpost_inactived_date' =>$curdate					 
			);
			$updateid = $this->API_model->update_cmn_tbl('jobpost','jobpost_id',$post_data->jobid,$data);
			//echo $updateid.'dfdsfdsfds';exit;	
			if($updateid)
			{			
				return $success = array('status' => '1','message' => 'success');				 				
				//$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				return $success = array('status' => '0','message' => 'Fail');			
			}

		}else{
			return $success = array('status' => '0','message' => 'Fail');			
		}

	}
	function updatejobStatus_post(){
			$post_data = json_decode(file_get_contents("php://input"));	

			if($post_data){
			$curdate = date('Y-m-d m:i:s');
			$data = array(	
			     'jobpost_status' =>$post_data->status,
			     'jobpost_inactived_date' =>$curdate					 
			);
			$updateid = $this->API_model->update_cmn_tbl('jobpost','jobpost_id',$post_data->jobid,$data);
			//echo $updateid.'dfdsfdsfds';exit;	
			if($updateid)
			{			
				return $success = array('status' => '1','message' => 'success');				 				
				//$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				return $success = array('status' => '0','message' => 'Fail');			
			}

		}else{
			return $success = array('status' => '0','message' => 'Fail');			
		}

	}
	function getlistEducation_get($id){
		 
			$myrow = $this->API_model->get_education_user_relation($id);
			foreach ($myrow as $key => $value) {
			$row = $this->API_model->get_assign_education($value['id']);			 
			
			 $value['subEducation'] =$row;			 
			 $mydata[] = $value;

			}
		 //echo '<pre>';print_r($mydata);exit; 
			if($mydata)
			{			
				//$success = array('status' => '1','message' => 'succes');				 				
				$this->response($mydata, 200); // 200 being the HTTP response code
			}
			else
			{
				$success = array();
				$this->response($success, 200);
			}
	}

	function deleteeducate_post(){
			$post_data = json_decode(file_get_contents("php://input"));	
			$id = $post_data->id; 
			$del_id = $this->API_model->commonDelete('education_user_relation','id',$id);
			$this->API_model->commonDelete('assign_education','relation_id',$id);
			//echo $del_id;exit;		 
			if($del_id != 0)
			{	
				 
				$success = array('status' => '1','message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array();
				$this->response($Error, 200);
			}
	}

	function deletelocation_post(){
			$post_data = json_decode(file_get_contents("php://input"));	
			//echo '<pre>';print_r($post_data);exit;
			$id = $post_data->id; 
			$mydata=$this->API_model->get_users_country_state_city($id);
			//echo '<pre>';print_r($mydata);exit;
			$del_id = $this->API_model->commonDelete('users_locations_relation','users_locations_relation_id',$mydata[0]['relation_id']);
			$this->API_model->commonDelete('location_city_relation','rel_id',$id);
			$this->API_model->commonDelete('locations_state_relation','id',$id);
			//echo $del_id;exit;		 
			if($del_id != 0)
			{	
				 
				$success = array('status' => '1','message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '1','message' => 'succes');
				$this->response($Error, 200);
			}
	}

	function geteducationinfoData_get($id){
		 
		$myrow = $this->API_model->get_master_record('education_user_relation','id',$id,'id');

		foreach ($myrow as $key => $value) {
			$row = $this->API_model->get_assign_education($value['id']);			 
			
			 $value['subEducation'] =$row;			 
			 $mydata[] = $value;

			}
		 
			if($mydata)
			{			
				//$success = array('status' => '1','message' => 'succes');				 				
				$this->response($mydata, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array();
				$this->response($Error, 200);
			}
	}
	
function  getgalleryList_get($id){
		$myrow = $this->API_model->get_master_record('gallery','gallery_userid',$id,'gallery_id');
		 
			if($myrow)
			{			
				//$success = array('status' => '1','message' => 'succes');				 				
				$this->response($myrow, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array();
				$this->response($Error, 200);
			}
	}
	function gallery_upload_post(){
		//echo '<pre>';print_r($_POST);
		//echo '<pre>';print_r($_FILES);
		//exit;

		$user_id = $_POST['user_id'];
		
		if(!empty($_FILES['image'])){
			$ext = pathinfo($_FILES['image']['name'],PATHINFO_EXTENSION);
			$image = time().'.'.$ext;
			if (!file_exists(gallery_image_upload_path.$user_id)) {
			    mkdir(gallery_image_upload_path.$user_id, 0777, true);
			}

			$up = move_uploaded_file($_FILES["image"]["tmp_name"], gallery_image_upload_path.$user_id.'/'.$image);
			if($up){				 
				 
				$gallary_data = array(				
					'gallery_image' => $image,
					'gallery_userid' => $user_id
				);
				$this->API_model->insert_cmn_tbl('gallery',$gallary_data);
				//$this->API_model->update_profile_tbl($user_data, $user_id);			

				$success = array('status' => '1','message' => $image);					
				$this->response($success, 200);
			}else{
				$success = array('status' => '0','message' => 'error');					
				$this->response($success, 200); // 200 being the HTTP response code
			}
		
		
		}else{
			$success = array('status' => '0','message' => 'error');					
			$this->response($success, 200); // 200 being the HTTP response code
		}
	}
	function deleteGallery_get($id){
			$data = $this->API_model->get_master_record('gallery','gallery_id',$id,'gallery_id');
			//echo '<pre>';print_r($data);exit;
			$del_id = $this->API_model->commonDelete('gallery','gallery_id',$id);
			 	 
			if($del_id != 0)
			{	
				if($data[0]['gallery_image']){
					unlink('../upload/gallery/'.$data[0]['gallery_userid'].'/'.$data[0]['gallery_image']);
				} 

				$success = array('status' => '1','message' => 'succes');				 				
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array();
				$this->response($Error, 200);
			}

	}
	function getgalleryData_get($id)
	{
			
		$myrow = $this->API_model->get_master_record('gallery','gallery_userid',$id,'gallery_id');		
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array();
			$this->response($Error, 200);
		}
	}

	function changepsw_post(){
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;
		if($post_data){
		 $myrow = $this->API_model->get_checked_record($post_data->users_id,$post_data->oldpassword);
			//echo '<pre>';print_r($myrow);exit;
			if(count($myrow) > 0){				 
				 
				$user_data = array(				
					'users_password' => $post_data->newpassword
				);
				 
				$this->API_model->update_profile_tbl($user_data,$post_data->users_id);	
				$success = array('status' => '1','message' => 'Your password changed successfully.');	
				$this->response($success, 200);
			}else{
				$error = array('status' => '0','message' => 'error');					
				$this->response($success, 200); // 200 being the HTTP response code
			}
		
		
		}else{
			$error = array('status' => '0','message' => 'error');					
			$this->response($error, 200); // 200 being the HTTP response code
		}
	}

	function resetpsw_post(){
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;
		if($post_data){
		 
				$user_data = array(				
					'users_password' => $post_data->newpassword,
					'mail_send' => '0'
				);
				 
				$this->API_model->update_profile_tbl($user_data,$post_data->users_id);	
				$success = array('status' => '1','message' => 'Your password changed successfully.');	
				$this->response($success, 200);
			 
		}else{
			$error = array('status' => '0','message' => 'error');					
			$this->response($error, 200); // 200 being the HTTP response code
		}
	}


	function getLocation_get($id)
	{
			
		$myrow = $this->API_model->get_location_details($id);		
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array();
			$this->response($Error, 200);
		}
	}

	function getKeyskill_get($id)
	{
			
		$myrow = $this->API_model->get_skill_details($id);		
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array();
			$this->response($Error, 200);
		}
	}

	function getUserdetails_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data); 
		$mydata = $this->API_model->get_user_data('users','users_id',$post_data->id);	

		//echo '<pre>';print_r($mydata);exit;	
		if($mydata[0]['mail_send'] == '1')
		{
			$success = array('status'=> '1','message' => 'success' );
			$this->response($success, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);exit;
			 
		}
		else
		{
			$Error = array('status'=> '0','message' => 'error' );
			$this->response($Error, 200);
			 
		}
	}

	function getAlllocations_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);
		$arrayName = array(); 
		$mydata = $this->API_model->get_all_state_city_location($post_data->country_id,$post_data->user_id);
		foreach ($mydata as $key => $value) {
			 $data = $this->API_model->get_all_citylist($value['state_id'],$value['user_id']);
			
			 $arrayName[] = $value;
			 $arrayName[$key]['city'] = $data;
		}	
		//echo '<pre>';print_r($arrayName);
		//exit;	
		if(count($arrayName) > 0)
		{
			//$success = array('status'=> '1','message' => 'success' );
			$this->response($arrayName, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);exit;
			 
		}
		else
		{
			$Error = array('status'=> '0','message' => 'error' );
			$this->response($Error, 200);
			 
		}
	}
	
	// End  26/7/2017 =======================================

	function addcompanyinfo_post(){
		$post_data = json_decode(file_get_contents("php://input"));
 		$user_id = $post_data->users_id;

 		if(isset($post_data->company_bio)){
 			$udata = array(
				'users_bio'  => $post_data->company_bio
			);
 			$this->API_model->update_cmn_tbl('users','users_id',$user_id,$udata);
 		}

		if(isset($post_data->employerfitlist)){				 
				foreach($post_data->employerfitlist as $fit) {					 
					$data = array(
						'type_rel_userid'  => $user_id,
						'type_id'   =>  $fit,
						'type_rel_category' => 'employer_fit'
						);
					if(isset($post_data->benefitslist)){
						foreach($post_data->benefitslist as $benefitslist) {
							if($fit == $benefitslist->id){
								$data['user_description'] = $benefitslist->desc;
							}	

						}

					}

					$this->db->insert('type_user_rel', $data);
				}
			}
			if(isset($post_data->jobfitlist)){				 
				foreach($post_data->jobfitlist as $jfit) {					 
					$jdata = array(
						'type_rel_userid'  => $user_id,
						'type_id'   =>  $jfit,
						'type_rel_category' => 'job_fit'
						);

					$this->db->insert('type_user_rel', $jdata);
				}
			}
			if(isset($post_data->industrylist)){
				
				foreach($post_data->industrylist as $industrylist) { 
					$industrydata = array(
						'category_type'  => 'industry',
						'industry_id'   =>  $industrylist,
						'users_id' => $user_id
						);
					 
					$industryid = $this->API_model->insert_cmn_tbl('industry_user_relation',$industrydata);
						 		 
					if(isset($post_data->senioritylist)){						
						foreach($post_data->senioritylist as $seniorityList) { 
							if($industrylist == $seniorityList->industry_id){
								$senioritydata = array(
								'rel_industry_id'  => $industryid,
								'level_id'   =>  $seniorityList->industry_id,
								'user_id' => $user_id
								);
							$this->db->insert('industry_user_level_relation', $senioritydata);
							}
							
						}
					}

				}
			}



		if($user_id > 0)
		{
			$success = array('status'=> '1','message' => 'success' );
			$this->response($success, 200); // 200 being the HTTP response code			 
			 
		}
		else
		{
			$Error = array('status'=> '0','message' => 'error' );
			$this->response($Error, 200);
			 
		}		
  	}

  	function updatepublish_post(){  		
  		$post_data = json_decode(file_get_contents("php://input"));
  	 
  		if(isset($post_data)){
  			//$curdate = date('Y-m-d');
  			//$lastdate = date('Y-m-d',strtotime('+1 month',strtotime($curdate)));
  			//echo $lastdate;exit;
  			$data = array(
  				'jobpost_status' =>$post_data->status,
  				'publish_startdate' => $post_data->startdate,
  				'publish_enddate' => $post_data->enddate
  				);
  			$id = $this->API_model->update_cmn_tbl('jobpost','jobpost_id',$post_data->jobpost_id,$data);

  			if($id){
  				$success = array('status'=> '1','message' => 'success' );
				$this->response($success, 200);
  			}else{
  				$Error = array('status'=> '0','message' => 'error' );
				$this->response($Error, 200);
  			}

  		}else{
  			$Error = array('status'=> '0','message' => 'error' );
			$this->response($Error, 200);
  		}
  	}

  	function deletejobpost_get($jobid){		
			 	 
			if($jobid)
			{	
				$del_id = $this->API_model->commonDelete('jobpost','jobpost_id',$jobid);
				if($del_id){
					$success = array('status' => '1','message' => 'succes');				 				
					$this->response($success, 200); // 200 being the HTTP response code
				}else{
					$Error = array('status' => '0','message' => 'error');		
					$this->response($Error, 200);
				}
				
			}
			else
			{
				$Error = array('status' => '0','message' => 'error');		
				$this->response($Error, 200);
			}

	}

	function insertnotes_post(){  		
  		$post_data = json_decode(file_get_contents("php://input"));
  	 
  		if(isset($post_data)){
  			 
  			$data = array(
  				'note_by' =>$post_data->note_by,
  				'note_to' => $post_data->note_to,
  				'note_text' => $post_data->note_text
  				);
  			$id = $this->API_model->insert_cmn_tbl('notes',$data);

  			if($id){
  				$success = array('status'=> $id,'message' => 'success' );
				$this->response($success, 200);
  			}else{
  				$Error = array('status'=> '0','message' => 'error' );
				$this->response($Error, 200);
  			}

  		}else{
  			$Error = array('status'=> '0','message' => 'error' );
			$this->response($Error, 200);
  		}
  	}

  	function getAllnotes_post(){  		
  		$post_data = json_decode(file_get_contents("php://input"));  	 
  		if(isset($post_data)){
  			$mydata = $this->API_model->get_all_notes($post_data->note_by,$post_data->note_to);
  			foreach ($mydata as $key => $value) {
  				 $value['datetime'] = date('jS M, h:m A', strtotime($value['note_datetime']));  				  
  				 $myarray[] = $value;
  			}
  			//echo '<pre>';print_r($myarray);exit;
  			if($myarray){
  				//$success = array('status'=> $id,'message' => 'success' );
				$this->response($myarray, 200);
  			}else{
  				$Error = array();
				$this->response($Error, 200);
  			}

  		}else{
  			$Error = array();
			$this->response($Error, 200);
  		}
  	}

  	function getculturefitdata_post(){  		
  		$post_data = json_decode(file_get_contents("php://input"));
  	 
  		if(isset($post_data)){
  			$mydata = $this->API_model->getculturefitdata($post_data->cutype_id,$post_data->users_id);  			 
  			//echo '<pre>';print_r($myarray);exit;
  			if($mydata){
  				//$success = array('status'=> $id,'message' => 'success' );
				$this->response($mydata, 200);
  			}else{
  				$Error = array();
				$this->response($Error, 200);
  			}

  		}else{
  			$Error = array();
			$this->response($Error, 200);
  		}
  	}

  	function update_culturefit_post(){  		
  		$post_data = json_decode(file_get_contents("php://input"));
  	 
  		if(isset($post_data)){
  			 
  			$data = array(
  				'user_description' =>$post_data->user_description 
  				);
  			$id = $this->API_model->update_cmn_tbl('type_user_rel','type_rel_id',$post_data->type_rel_id,$data);

  			if($id){
  				$success = array('status'=> $id,'message' => 'success' );
				$this->response($success, 200);
  			}else{
  				$Error = array('status'=> '0','message' => 'error' );
				$this->response($Error, 200);
  			}

  		}else{
  			$Error = array('status'=> '0','message' => 'error' );
			$this->response($Error, 200);
  		}
  	}

  	function addPostsTxt_post(){  		
  		$post_data = json_decode(file_get_contents("php://input"));
  	 
  		if(isset($post_data)){
  			 
  			$data = array(
	  				'post_userid' =>$post_data->user_id,
	  				'post_content' =>$post_data->text 
	  				);
  			$id = $this->API_model->insert_cmn_tbl('posts',$data); 

  			if($id){
  				$success = array('status'=> $id,'message' => 'success' );
				$this->response($success, 200);
  			}else{
  				$Error = array('status'=> '0','message' => 'error' );
				$this->response($Error, 200);
  			}

  		}else{
  			$Error = array('status'=> '0','message' => 'error' );
			$this->response($Error, 200);
  		}
  	}
  	function editPosttxt_post(){  		
  		$post_data = json_decode(file_get_contents("php://input"));
  	 
  		if(isset($post_data)){
  			 
  			$data = array(	  				 
				'post_content' =>$post_data->post_content 
			);

  			if($post_data->post_filename == ''){
  				$data['post_filename'] = '';
  			}
  			$id = $this->API_model->update_cmn_tbl('posts','post_id',$post_data->post_id,$data);

  			if($id){
  				$success = array('status'=> $id,'message' => 'success' );
				$this->response($success, 200);
  			}else{
  				$Error = array('status'=> '0','message' => 'error' );
				$this->response($Error, 200);
  			}

  		}else{
  			$Error = array('status'=> '0','message' => 'error' );
			$this->response($Error, 200);
  		}
  	}
  	function addPosts_post(){  
  		 
  		$user_id = $_POST['user_id'];
  	 
  		if(isset($user_id)){
  			 
  			$data = array(
	  				'post_userid' =>$user_id,
	  				'post_content' =>$_POST['text'] 
	  				);

	  		if(!empty($_FILES['image'])){
				$ext = pathinfo($_FILES['image']['name'],PATHINFO_EXTENSION);
				$image = time().'.'.$ext;
				$up =  move_uploaded_file($_FILES["image"]["tmp_name"], image_upload_path.'posts/'.$image);
	  			if($up){
	  				$data['post_type'] = 'image';
	  				$data['post_filename'] = $image;
	  			}
	  		}

  			$id = $this->API_model->insert_cmn_tbl('posts',$data); 

  			if($id){
  				$success = array('status'=> $id,'message' => 'success' );
				$this->response($success, 200);
  			}else{
  				$Error = array('status'=> '0','message' => 'error' );
				$this->response($Error, 200);
  			}

  		}else{
  			$Error = array('status'=> '0','message' => 'error' );
			$this->response($Error, 200);
  		}
  	}
  	function editPost_post(){  
  		 
  		$post_id = $_POST['post_id'];
  	 
  		if(isset($post_id)){
  			 
			$data = array(	  				 
			'post_content' =>$_POST['post_content'] 
			);

	  		if(!empty($_FILES['image'])){
				$ext = pathinfo($_FILES['image']['name'],PATHINFO_EXTENSION);
				$image = time().'.'.$ext;
				$up =  move_uploaded_file($_FILES["image"]["tmp_name"], image_upload_path.'posts/'.$image);
	  			if($up){
	  				$data['post_type'] = 'image';
	  				$data['post_filename'] = $image;
	  			}
	  		} 
  			 //echo "<pre>";print_r($data);exit;
  			$id = $this->API_model->update_cmn_tbl('posts','post_id',$post_id,$data);
  			if($id){
  				$success = array('status'=> $id,'message' => 'success' );
				$this->response($success, 200);
  			}else{
  				$Error = array('status'=> '0','message' => 'error' );
				$this->response($Error, 200);
  			}

  		}else{
  			$Error = array('status'=> '0','message' => 'error' );
			$this->response($Error, 200);
  		}
  	}
  	function getPostlist_get($postid){		
			 	 
			if($postid)
			{	
				$mydata = $this->API_model->get_all_feeds($postid);	
				//echo '<pre>';print_r($mydata); 
				foreach ($mydata as $key => $value) {					 
					 $value['lastactivity']= $this->timeAgo($value['post_date']);
					 $myarray[] = $value;
				}
				//echo '<pre>';print_r($myarray);exit;
				if($myarray){
					//$success = array('status' => '1','message' => 'succes');				 				
					$this->response($myarray, 200); // 200 being the HTTP response code
				}else{
					$Error = array('status' => '0','message' => 'error');		
					$this->response($Error, 200);
				}
				
			}
			else
			{
				$Error = array('status' => '0','message' => 'error');		
				$this->response($Error, 200);
			}

	}

	function timeAgo($timestamp){
		//date_default_timezone_set('Asia/Calcutta'); 
		//date_default_timezone_set('America/Chicago');		 
	    $datetime1=new DateTime('now');
	    $datetime2=date_create($timestamp);
	    $diff=date_diff($datetime1, $datetime2);
	    $timemsg='';
	    if($diff->y > 0){
	        $timemsg = $diff->y .' year'. ($diff->y > 1?"'s":'');

	    }
	    else if($diff->m > 0){
	     $timemsg = $diff->m . ' month'. ($diff->m > 1?"'s":'');
	    }
	    else if($diff->d > 0){
	     $timemsg = $diff->d .' day'. ($diff->d > 1?"'s":'');
	    }
	    else if($diff->h > 0){
	     $timemsg = $diff->h .' hour'.($diff->h > 1 ? "'s":'');
	    }
	    else if($diff->i > 0){
	     $timemsg = $diff->i .' minute'. ($diff->i > 1?"'s":'');
	    }
	    else if($diff->s > 0){
	     $timemsg = $diff->s .' second'. ($diff->s > 1?"'s":'');
	    }

	$timemsg = $timemsg.' ago';
	return $timemsg;
	}

	function deletePost_post(){  		
  		$post_data = json_decode(file_get_contents("php://input"));
  	 
  		if(isset($post_data)){  			 
  			$myrow = $this->API_model->get_row_record('posts', 'post_id', $post_data->post_id);
  			if(!empty($myrow)){
  				//echo '<pre>';print_r($myrow);exit;
  				unlink('../upload/posts/'.$myrow['post_filename']);
  				$id = $this->API_model->commonDelete('posts','post_id',$post_data->post_id);
  			}  			

  			if($id){
  				$success = array('status'=> $id,'message' => 'success' );
				$this->response($success, 200);
  			}else{
  				$Error = array('status'=> '0','message' => 'error' );
				$this->response($Error, 200);
  			}

  		}else{
  			$Error = array('status'=> '0','message' => 'error' );
			$this->response($Error, 200);
  		}
  	}
  	function geteditpost_post(){  		
  		$post_data = json_decode(file_get_contents("php://input"));
  	 
  		if(isset($post_data)){
  			 
  			 $myrow = $this->API_model->get_row_record('posts', 'post_id', $post_data->post_id);
  			 //echo "<pre>";print_r($myrow);exit;
  			if(!empty($myrow)){
  				//$success = array('status'=> $id,'message' => 'success' );
				$this->response($myrow, 200);
  			}else{
  				$Error = array('status'=> '0','message' => 'error' );
				$this->response($Error, 200);
  			}

  		}else{
  			$Error = array('status'=> '0','message' => 'error' );
			$this->response($Error, 200);
  		}
  	}

  	function time_since($since) {
	    $chunks = array(
	        array(60 * 60 * 24 * 365 , 'year'),
	        array(60 * 60 * 24 * 30 , 'month'),
	        array(60 * 60 * 24 * 7, 'week'),
	        array(60 * 60 * 24 , 'day'),
	        array(60 * 60 , 'hour'),
	        array(60 , 'minute'),
	        array(1 , 'second')
	    );

	    for ($i = 0, $j = count($chunks); $i < $j; $i++) {
	        $seconds = $chunks[$i][0];
	        $name = $chunks[$i][1];
	        if (($count = floor($since / $seconds)) != 0) {
	            break;
	        }
	    }

	    $print = ($count == 1) ? '1 '.$name : "$count {$name}s";
	    return $print;
	}

	

}
