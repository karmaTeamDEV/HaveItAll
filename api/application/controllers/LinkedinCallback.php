<?php
/* ==========================================================================
Author: PARSURAM SAMAL
Create date:  05/29/2017
Description:  LinkedIn api controller
============================================================================= */

defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class LinkedinCallback extends REST_Controller {

	public function __construct() {
        parent::__construct();       
		$this->load->helper('url');		
		$this->config->item('base_url');		
		//$this->load->library('email');
		$this->load->database();
		//$this->load->dbforge();			
                $this->load->model('API_model');
    }

	function curl($url, $parameters)
	{
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $parameters);
		curl_setopt($ch, CURLOPT_POST, 1);
		$headers = [];
		$headers[] = "Content-Type: application/x-www-form-urlencoded";
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		$result = curl_exec($ch);
		return $result;
	} 
/* ==========================================================================
Author: PARSURAM SAMAL
Create date:  08/05/2017
Description:  fetch linkedin profile
============================================================================= */

	public function fetchlinkedinprofile_get()
	{
	       
		//echo $redirect_uri = "http://".base_url()."LinkedinCallback/fetchlinkedinprofile";exit;
		$client_id = "812sbcn1c6vorz";
		$client_secret = "XsBxnXiKMzyZCHnp";
		//$redirect_uri = "http://primacpl.com/haveitall_new/api/index.php/LinkedinCallback/fetchlinkedinprofile";
		$redirect_uri = "http://".base_url()."LinkedinCallback/fetchlinkedinprofile";
		$csrf_token = rand(11111111,9999999);
		$scopes = "r_basicprofile%20r_emailaddress";
		//echo "===redirect uri======".$redirect_uri; exit;
		$localRedirectURI = str_replace("api/index.php/LinkedinCallback/fetchlinkedinprofile","",$redirect_uri);


		if (isset($_REQUEST['code'])) {
			$code = $_REQUEST['code'];
			$url = "https://www.linkedin.com/oauth/v2/accessToken";
			$params = [
			'client_id' => $client_id,
			'client_secret' => $client_secret,
			'redirect_uri' => $redirect_uri,
			'code' => $code,
			'grant_type' => 'authorization_code',
			];
			$accessToken = $this->curl($url,http_build_query($params));
			$accessToken = json_decode($accessToken)->access_token;

			$url = "https://api.linkedin.com/v1/people/~:(id,firstName,lastName,picture-url,headline,publicProfileUrl,location,industry,positions,email-address,summary)?format=json&oauth2_access_token=" . $accessToken;
			$linkedinuserProfile = file_get_contents($url, false);
			$linkedinuserProfile = json_decode($linkedinuserProfile);
            $responseMsg = $this->insertlinkedinuserInfo($linkedinuserProfile);
           // echo $responseMsg; exit;
            
			//redirect('http://localhost/haveitall/#!/login/'.$responseMsg, 'refresh');
			redirect($localRedirectURI.'#!/login/'.$responseMsg, 'refresh');


		}
	}
/* ==========================================================================
Author: PARSURAM SAMAL
Create date:  08/07/2017
Description:  insert linkedin user profile
============================================================================= */
	function insertlinkedinuserInfo($linkedinuserProfile){
		//echo "aaaaa44555<pre>";print_r($linkedinuserProfile);exit;
		$responseMsg = "";
		$location_details =  explode(",",$linkedinuserProfile->location->name);
		$user_location = trim($location_details[0]);
		$country = trim($location_details[1]);
				
		$existingCountry = $this->API_model->fetch_countryID($country);
		
		if(count($existingCountry) > 0){
		    $country = $existingCountry["id"];
		}
		
		if(!isset($linkedinuserProfile->positions->values[0]->summary)){
                  $summary = '';
		} else {
		  $summary = $linkedinuserProfile->positions->values[0]->summary;	
		}
		
		if(!isset($linkedinuserProfile->pictureUrl)){
                  $pictureURL = '';
		} else {
		  $pictureURL = $linkedinuserProfile->pictureUrl;
          $image_name = $linkedinuserProfile->id.'.png';	
		  $img = '../upload/'.$image_name;
		  file_put_contents($img, file_get_contents($pictureURL));		  
		}
		
		if(!isset($linkedinuserProfile->positions->values)){
                  $positionValues = [];
                  $companyName = '';
                  $jobTitle = '';
		} else {
		  $positionValues = $linkedinuserProfile->positions->values;
		  $companyName = $linkedinuserProfile->positions->values[0]->company->name;
                  $jobTitle = $linkedinuserProfile->positions->values[0]->title;	
		}


		$linkedinuserprofile_data = array(
			'linkedinID' =>$linkedinuserProfile->id,
			'users_firstname' =>$linkedinuserProfile->firstName,
			'users_lastname' =>$linkedinuserProfile->lastName,
			'users_linkedin_link'=>$linkedinuserProfile->publicProfileUrl,
			'users_bio'=>$summary,
			'users_country'=>$country,
			'user_location'=>$user_location,
			'users_username'=>$linkedinuserProfile->emailAddress,
			'users_password'=>'123456',
			'users_current_employer'=>$companyName,
			'users_current_title'=>$jobTitle,
			'users_profilepic'=>$image_name,
			'user_note'=>$linkedinuserProfile->headline,
			'users_type'=> '1',
			'users_status'=> '0'
		);
		$existingUser = $this->API_model->check_existingemail($linkedinuserProfile->emailAddress);

		if(count($existingUser) > 0){
		  if($existingUser) {
		  	$responseMsg = $existingUser["users_username"];
		  	$responseMsg = trim($responseMsg);
		  }
		} else {	
			$insertedUser_ID = $this->API_model->add_linkedinuserinfo($linkedinuserprofile_data);
			if($insertedUser_ID)
			{
			   $userInfo = $this->API_model->check_existingemail($linkedinuserProfile->emailAddress);
			   $responseMsg = $userInfo["users_username"];
			   $responseMsg = trim($responseMsg);
			}
			else
			{
				$responseMsg = "User ProfileInfo Insert Failure";
			}
		} 

		return $responseMsg;

	}

/* ==========================================================================
Author: PARSURAM SAMAL
Create date:  08/10/2017
Description:  fetch password
============================================================================= */

	public function fetchpassword_post(){
	  $post_data = json_decode(file_get_contents("php://input"));		
	  $userInfo = $this->API_model->check_existingemail($post_data->user_email);
			
		if(count($userInfo)>0)
		{
            $userid = $userInfo['users_username'];
			$password = $userInfo['users_password'];
			$userCredentials = array(
				                     'user_email' =>$userid,
			                         'users_password' =>$password
			                         );
			$this->response($userCredentials, 200); // 200 being the HTTP response code
		}
		else
		{
			$Error = 'error';
			$this->response($Error, 404);
		}
	}
}

	
