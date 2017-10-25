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

	function regEmployer_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo '<pre>';print_r($post_data);exit;
		$username = preg_replace('/\s+/', '', $post_data->username);
		$password = preg_replace('/\s+/', '', $post_data->usrpasswrd);
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
				'users_profilepic' =>$post_data->profile_image,	
				'users_type' =>'2'
			);
			$user_id = $this->API_model->insert_cmn_tbl('users',$user_data);
			
			if($user_id)
			{			
				//$success = array('status' => '1','message' => 'Sign up successful, please, log in.','useremail'=>$username);
				$user = $this->API_model->validateUserLogin($username, $password);					
				$success = array('status' => '1','list' => $user);						
				$this->response($success, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Username already exists.' );
				$this->response($Error, 200);
			}

		}
		else
		{
			$Error = array('status' => '0','message' => 'Error in create company.' );
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

	function image_upload_post(){		
		$file_content = $_POST['file'];			
		$date =date('ymdmis');
		$image_name = $date.'.png';			
		$up = $this->API_model->base64_to_jpeg($file_content,image_upload_path.$image_name);
		
		if($up){
			$success = array('status' => '1','message' => $image_name);					
			$this->response($success, 200); // 200 being the HTTP response code
		}else{
			$success = array('status' => '0','message' => 'error');					
			$this->response($success, 200); // 200 being the HTTP response code
		}
	}

	function file_upload_post(){
		
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
		//echo "<pre>";print_r($user_data);	exit;
		$user_id = $this->API_model->insert_cmn_tbl('users',$user_data);
		
		if($user_id)
		{
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

		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = '1';
			$this->response($Error, 200);
		}
	}
	function update_profile_post()
	{
		$post_data = json_decode(file_get_contents("php://input"));		

		if($post_data->users_companyid){
			$company_data = array(			
			'company_name' =>$post_data->company_name			
			);
			$location = '';
			if(isset($post_data->locations)){
				foreach ($post_data->locations as $key => $value) {
					$location = $location.','.$value->name;
				}
				$location = substr($location, 1);
				$company_data['company_branch'] = $location;
			}
			//echo '<pre>';print_r($company_data);exit;

			$this->API_model->update_cmn_tbl('company','company_id',$post_data->users_companyid,$company_data);			
		}
		
		$user_data = array(			
			'users_firstname' =>$post_data->users_firstname,
			'users_lastname' =>$post_data->users_lastname,
			'users_bio' =>$post_data->users_bio,
			'users_current_employer' =>$post_data->users_current_employer,			
			'users_current_title' =>$post_data->users_current_title,
			'users_linkedin_link' =>$post_data->users_linkedin_link,
			'users_twitter_link' =>$post_data->users_twitter_link,
			'users_facebook_link' =>$post_data->users_facebook_link,
			'users_istagram_link' =>$post_data->users_istagram_link
		);

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
//echo $user_id;exit;

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
			//echo '<pre>';print_r($myrow);
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

		$typecategoryName = trim($post_data->name);
		$typecategory = trim($post_data->typecategory);
		$duplicateTypeCategories = $this->API_model->check_duplicateTypeCategories($typecategoryName,$typecategory,$post_data->status);
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
		//echo '<pre>';print_r($post_data);
		if(!empty($post_data->jobpost_area)){
			$jobpost_area = '';
			foreach ($post_data->jobpost_area as $key => $value) {
				$jobpost_area = $jobpost_area.$value->id.'|';
			}
			
		}
		$data = array(	
			'jobpost_companyid' =>$post_data->users_companyid,		
			'jobpost_title' =>$post_data->jobpost_title,			
			'jobpost_description' =>$post_data->jobpost_description,
			'jobpost_exp_minimum' =>$post_data->jobpost_exp_minimum,
			'jobpost_exp_maximum' =>$post_data->jobpost_exp_maximum,			
			'jobpost_jobtype' =>$post_data->jobpost_jobtype,
			'jobpost_industry' =>$post_data->jobpost_industry,
			'jobpost_area' =>$jobpost_area,
			'jobpost_url' =>$post_data->jobpost_url,

		);
		//echo '<pre>';print_r($data);
		$id = $this->API_model->insert_cmn_tbl('jobpost',$data);
		//echo $id;exit;
		if($id)
		{
			foreach ($post_data->jobpost_locations as $key => $value) {
					$locations_data = array(	
						'relation_user_id' =>$post_data->users_companyid,		
						'relation_locations_id' =>$value->id
					);
		
			$this->API_model->insert_cmn_tbl('users_locations_relation',$locations_data);
			}
			foreach ($post_data->jobpost_skills as $key => $value) {
					$skills_data = array(	
						'relation_user_id' =>$post_data->users_companyid,		
						'relation_skills_id' =>$value->id
					);
		
			$this->API_model->insert_cmn_tbl('users_skills_relation',$skills_data);
			}			
			$success = array('status' => '1','message' => 'Job posted successfully.');					
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
				$companydata = array(	
					'company_name' =>$post_data->othercompany					 
				);
				$c_id = $this->API_model->insert_cmn_tbl('company_master',$companydata);
				$company_id = $c_id;
			}else{
				$company_id = $post_data->company_id;
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
					'other_title_text' =>$other_title_text
			);
 
			//echo $post_data->action ;
			
			if($post_data->action== "insert"){					
					
					$title_id = $this->API_model->insert_cmn_tbl('title_user_relation',$data);
					//echo '<pre>';print_r($post_data->titles);exit;
					if(isset($post_data->titles) && $other_title_text == null){
						foreach ($post_data->titles as  $title_assign) {					 
							$titledata = array(	
								'company_id' =>$company_id,
								'relation_id' =>$title_id,
								'userid' =>$post_data->users_id,		
								'title_id' =>$title_assign->type_id				 
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
								'title_id' =>$title_assign->type_id				 
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
		foreach ($post_data->level as $key => $level) {
			$level_name = $level_name.$level->level_name.' | ';
		}
		
		 
		if(isset($post_data))
		{			
			$data = array(	
					'category_type' =>'industry',		
					'users_id' =>$post_data->users_id,			
					'industry_id' =>$post_data->industry_id,						 	
					'level' =>$level_name
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
							'area_id' =>$area->area_id				 
						);						 
					$type_id = $this->API_model->insert_cmn_tbl('assign_industry',$industrydata);
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
								'area_id' =>$area->area_id				 
							);	
							//echo '<pre>';print_r($industrydata); exit;						 
						$type_id = $this->API_model->insert_cmn_tbl('assign_industry',$industrydata);
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
	function getlistIndustry_get($id){
		//echo $id;exit;
		$mydata =array();
		$myrow = $this->API_model->get_industry_user_relation($id);
		foreach ($myrow as $key => $value) {
			$row = $this->API_model->get_assign_industry($value['id']);
			
			 $value['area'] =$row;
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
			
			 $value['area'] =$row;
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
		if($post_data->othereducate){
			$educate = array(	
					'type_name' =>$post_data->othereducate,
					'type_category' =>'education'
			);
			$education_id = $this->API_model->insert_cmn_tbl('type',$educate);
			$area = array(	
					'type_name' =>$post_data->otherarea,
					'type_category' =>'education',
					'type_parent_id' =>$education_id
			);
			$subeducation_id = $this->API_model->insert_cmn_tbl('type',$area);
		}else{
			$education_id = $post_data->education_id;
			$subeducation_id = $post_data->subeducation_id;
		}

		if($post_data->otherinstitute){
			$institutedata = array(	
					'institute_name' =>$post_data->otherinstitute
			);
			$institute_id = $this->API_model->insert_cmn_tbl('institute',$institutedata);
		}else{
			$institute_id = $post_data->institute_id;
		}

		if(isset($post_data))
		{			
			$data = array(	
					'category_type' =>'educations',		
					'users_id' =>$post_data->users_id,			
					'education_id' =>$education_id,						 	
					'subeducation_id' =>$subeducation_id,
					'institute_id' =>$institute_id
			);		 
			
			if($post_data->action== "insert"){				
				$id = $this->API_model->insert_cmn_tbl('education_user_relation',$data);
				 			 
			}else if($post_data->action == 'update'){				  
				 $this->API_model->update_cmn_tbl('education_user_relation','id',$post_data->id,$data);
				 $id = 1;
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

		}
		else
		{
			$Error = array('status' => '0','message' => 'Error' );
			$this->response($Error, 200);
		}
	}
	function getlistEducation_get($id){
		 
			$myrow = $this->API_model->get_education_user_relation($id);
		 
			if($myrow)
			{			
				//$success = array('status' => '1','message' => 'succes');				 				
				$this->response($myrow, 200); // 200 being the HTTP response code
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

	function geteducationinfoData_get($id){
		 
		$myrow = $this->API_model->get_master_record('education_user_relation','id',$id,'id');
		 
			if($myrow)
			{			
				//$success = array('status' => '1','message' => 'succes');				 				
				$this->response($myrow, 200); // 200 being the HTTP response code
			}
			else
			{
				$Error = array('status' => '0','message' => 'Error' );
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

	
	// End  26/7/2017 =======================================
		
  }
