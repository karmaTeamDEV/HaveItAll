<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class API_model extends CI_Model {

    protected $companyTable = 'company';
    protected $userTable = 'users';
    protected $typeTable = 'type';
    protected $type_user_relTable = 'type_user_rel';
    protected $countryTable = 'countries';
    protected $locationsrelationTable ='users_locations_relation';
    protected $locationsrelationStateTable ='users_locations_relation_state';
    protected $locationsrelationCityTable ='users_locations_relation_city';

    public function __construct() {
        parent::__construct();
    }

    // Common function list start ------------
    public function insert_cmn_tbl($table,$data){
        if($this->db->insert($table, $data)){
            //echo $this->db->last_query();exit;
            return $this->db->insert_id();
        }        
    }   
    public function get_single_record($table,$field,$id) {
        $this->db->select('users_username');
        if ($id) {
            $this->db->where($field, $id);            
        }        
        $result = $this->db->get($table); 
        //echo $this->db->last_query();            
        return $result->result_array();
    }
    public function get_master_record($table, $field, $id, $order) {
        $this->db->select('*');
        if ($id != null){
            $this->db->where($field, $id);            
        } 
        if($order != null){       
	       $this->db->order_by($order, 'ASC');  
        } 
        $result = $this->db->get($table);    
        //echo $this->db->last_query();       
        return $result->result_array();
    }
    public function get_row_record($table, $field, $id) {
        $this->db->select('*');
        $this->db->where($field, $id); 
        $result = $this->db->get($table);    
        //echo $this->db->last_query();       
        return $result->row_array();
    }
    public function get_title_master($title) {
        $this->db->select('type_id,type_name');
        $this->db->where(TRIM('type_name'), $title);            
        $this->db->where('type_category', 'titles');
        $this->db->where('type_status', '0');
        $result = $this->db->get('type');  
        //echo $this->db->last_query();exit;       
        return $result->result_array();
    }
    public function get_company_master($company_name) {
        $this->db->select('company_id,company_name');
        $this->db->where(TRIM('company_name'), $company_name);         
        $this->db->where('company_status', '0');
        $result = $this->db->get('company_master');  
        //echo $this->db->last_query();exit;       
        return $result->result_array();
    }

     public function get_title_user_relation($id) {
        $this->db->select("title_user_relation.*,company_master.company_name");
        $this->db->from('title_user_relation');
        $this->db->where('title_user_relation.users_id', $id);
        $this->db->join('company_master','company_master.company_id = title_user_relation.company_id','left');
        $this->db->order_by('id', 'desc');
        $result = $this->db->get();    
        //echo $this->db->last_query();       
        return $result->result_array();
    }
    //  public function get_list_job($id, $status,$short_type="",$user_id="") {
    //     $this->db->select("jobpost.*,type.type_name as title_name,countries.name as countryname,states.name as statename,cities.name as cityname, COUNT(DISTINCT(hia_user_applied_jobs.user_id)) AS applyed_users, COUNT(DISTINCT(hia_user_view_jobs.user_id)) AS viewed_user,users.users_username");
    //     $this->db->from('jobpost');
    //     $this->db->where('jobpost.jobpost_companyid', $id);
    //     $this->db->where('jobpost.jobpost_status', $status);
    //     $this->db->join('type','type.type_id = jobpost.jobpost_title','left');
        
    //     $this->db->join('user_applied_jobs', 'jobpost.jobpost_id = user_applied_jobs.job_post_id', 'left');
    //     $this->db->join('user_view_jobs', 'jobpost.jobpost_id = hia_user_view_jobs.job_post_id', 'left');
    //     $this->db->join('countries', 'jobpost.jobpost_countryid = countries.id', 'left');
    //     $this->db->join('states', 'jobpost.jobpost_stateid = states.id', 'left');
    //     $this->db->join('cities', 'jobpost.jobpost_cityid = cities.id', 'left');
    //     $this->db->join('users', 'jobpost.jobpost_userid = users.users_id', 'left');
    //     $this->db->group_by('jobpost.jobpost_id');
    //     $this->db->order_by('jobpost.jobpost_id', 'desc');
    //     $result = $this->db->get();   
          
    //     return $result->result_array();
    // }

    public function get_list_job($id, $status,$current_job_id="",$short_type="") {
        $sql ="SELECT `hia_jobpost`.*, `hia_type`.`type_name` as `title_name`, `hia_countries`.`name` as `countryname`, `hia_states`.`name` as `statename`, `hia_cities`.`name` as `cityname`, COUNT(DISTINCT(hia_user_applied_jobs.user_id)) AS applyed_users, COUNT(DISTINCT(hia_user_view_jobs.user_id)) AS viewed_user, `hia_users`.`users_username`
            FROM `hia_jobpost`
            LEFT JOIN `hia_type` ON `hia_type`.`type_id` = `hia_jobpost`.`jobpost_title`
            LEFT JOIN `hia_user_applied_jobs` ON `hia_jobpost`.`jobpost_id` = `hia_user_applied_jobs`.`job_post_id`
            LEFT JOIN `hia_user_view_jobs` ON `hia_jobpost`.`jobpost_id` = `hia_user_view_jobs`.`job_post_id`
            LEFT JOIN `hia_countries` ON `hia_jobpost`.`jobpost_countryid` = `hia_countries`.`id`
            LEFT JOIN `hia_states` ON `hia_jobpost`.`jobpost_stateid` = `hia_states`.`id`
            LEFT JOIN `hia_cities` ON `hia_jobpost`.`jobpost_cityid` = `hia_cities`.`id`
            LEFT JOIN `hia_users` ON `hia_jobpost`.`jobpost_userid` = `hia_users`.`users_id`
            WHERE `hia_jobpost`.`jobpost_companyid` = '$id'
            AND `hia_jobpost`.`jobpost_status` = '$status' ";

            if ($current_job_id != "") {
                if($short_type == 'next'){
                    $sql.= " AND `hia_jobpost`.`jobpost_id` > '$current_job_id'  ";
                }
                if($short_type == 'prev'){
                    $sql.= " AND `hia_jobpost`.`jobpost_id` < '$current_job_id' ";
                }           
            }

            if($short_type == 'prev'){
                $sql.= " GROUP BY `hia_jobpost`.`jobpost_id` order by `hia_jobpost`.`jobpost_id` DESC ";    
            }else{
                $sql.= " GROUP BY `hia_jobpost`.`jobpost_id` "; 
            }

           // echo $sql;exit;

            if (!$this->db->simple_query($sql))
            {
                $error = $this->db->error();                
                return $error;
            }
            else
            {
                $query = $this->db->query($sql);                
                return $query->result_array();
            }
    }

    public function get_jobitem($id) {
        $this->db->select("jobpost.*,type.type_name as title_name,countries.name as countryname,states.name as statename,cities.name as cityname,company.company_name");
        $this->db->from('jobpost');
        $this->db->where('jobpost.jobpost_id', $id);
        $this->db->join('type','type.type_id = jobpost.jobpost_title','left');
        $this->db->join('company','company.company_id = jobpost.jobpost_companyid','left');
        $this->db->join('countries', 'jobpost.jobpost_countryid = countries.id', 'left');
        $this->db->join('states', 'jobpost.jobpost_stateid = states.id', 'left');
        $this->db->join('cities', 'jobpost.jobpost_cityid = cities.id', 'left');
        $this->db->order_by('jobpost.jobpost_id', 'desc');
        $result = $this->db->get();    
        //echo $this->db->last_query();exit;      
        return $result->result_array();
    }
    public function get_users_county_state($id) {
        $this->db->select("users_locations_relation.users_locations_relation_id,users_locations_relation.relation_user_id,users_locations_relation.rel_country_id,users_locations_relation.relation_status,countries.name as countryname");
        $this->db->from('users_locations_relation');
        $this->db->where('users_locations_relation.relation_user_id', $id);
        $this->db->where('users_locations_relation.relation_status', '0');
        //$this->db->join('users_locations_relation_state','users_locations_relation_state.relation_id = users_locations_relation.users_locations_relation_id','left');
        $this->db->join('countries','countries.id = users_locations_relation.rel_country_id','left');
        //$this->db->join('states','states.id = users_locations_relation_state.state_id','left');   
        $result = $this->db->get();    
        //echo $this->db->last_query();exit;      
        return $result->result_array();
    }
    public function get_jobs_industry($id) {
        $this->db->select("jobpost_company_relation.*,industry.industry_name");
        $this->db->from('jobpost_company_relation');
        $this->db->where('jobpost_company_relation.jobpost_id', $id);
        $this->db->where('jobpost_company_relation.type', 'area'); 
        $this->db->join('industry','industry.industry_id = jobpost_company_relation.type_id','left');        
        $result = $this->db->get();    
        //echo $this->db->last_query();    
        return $result->result_array();
    }
    public function get_jobs_industry_unique($id) {
        $this->db->select("jobpost_company_relation.*,industry.industry_name");
        $this->db->from('jobpost_company_relation');
        $this->db->where('jobpost_company_relation.relation_id', $id);
        $this->db->where('jobpost_company_relation.type', 'area'); 
        $this->db->join('industry','industry.industry_id = jobpost_company_relation.type_id','left');        
        $result = $this->db->get();    
        //echo $this->db->last_query();    
        return $result->result_array();
    }
    public function get_jobs_industry_area($jobpost_id,$industry_id) {
        $this->db->select("functional_area.area_name,functional_area.area_id");
        $this->db->from('jobpost_company_industry_area');
        $this->db->where('jobpost_company_industry_area.jobpost_id', $jobpost_id);
        $this->db->where('jobpost_company_industry_area.industry_id', $industry_id);         
        $this->db->join('functional_area','functional_area.area_id = jobpost_company_industry_area.area_id','left');   
        $result = $this->db->get();    
        //echo $this->db->last_query();exit;      
        return $result->result_array();
    }
    public function get_users_state_city($id) {
        $this->db->select("users_locations_relation_state.state_id,states.name as statename,users_locations_relation_state.id");
        $this->db->from('users_locations_relation_state');
        $this->db->where('users_locations_relation_state.relation_id', $id);
        $this->db->join('states','states.id = users_locations_relation_state.state_id','left'); 
        //$this->db->join('users_locations_relation_city','users_locations_relation_city.relation_id = users_locations_relation_state.id');        
       // $this->db->join('cities','cities.id = users_locations_relation_city.city_id','left');   
        $result = $this->db->get();    
        //echo $this->db->last_query();exit;      
        return $result->result_array();
    }

    public function get_users_country_state_city($id) {
        $this->db->select("locations_state_relation.*,locations_state_relation.country_id as users_country,locations_state_relation.state_id as users_state");
        $this->db->from('locations_state_relation');
        $this->db->where('locations_state_relation.id', $id);        
        $result = $this->db->get();    
        //echo $this->db->last_query();exit;      
        return $result->result_array();
    } 

    public function location_city_relation($id) {
        $this->db->select("hia_users_locations_relation_city.id,hia_users_locations_relation_city.city_id,cities.name as cityname");
        $this->db->from('users_locations_relation_city');
        $this->db->where('users_locations_relation_city.relation_id', $id);   
        $this->db->join('cities','cities.id = users_locations_relation_city.city_id','left');     
        $result = $this->db->get();    
        //echo $this->db->last_query();exit;      
        return $result->result_array();
    }  

     public function fetchuserLocation($cid,$uid) {
        $this->db->select("users_locations_relation_id");
        $this->db->from('users_locations_relation');
        $this->db->where('relation_user_id', $uid);  
        $this->db->where('rel_country_id', $cid);       
        $result = $this->db->get();    
        //echo $this->db->last_query();exit;      
        return $result->result_array();
    }
    public function fetchuserstateLocation($rel_id,$stateid) {
        $this->db->select("id");
        $this->db->from('locations_state_relation');
        $this->db->where('relation_id', $rel_id);  
        $this->db->where('state_id', $stateid);       
        $result = $this->db->get();    
        //echo $this->db->last_query();exit;      
        return $result->result_array();
    }  

       

    public function getpostjobList($jobpost_id,$type) {
        if($type == 'location'){
        $this->db->select("locations.locations_id,locations.locations_name");  
        }
        if($type == 'skill'){
        $this->db->select("skills_master.skills_id,skills_master.skills_name");  
        }
        if($type == 'seniority'){
        $this->db->select("seniorities.seniority_id,seniorities.seniority_name");  
        }
        // if($type == 'area'){
        // $this->db->select("functional_area.area_id,functional_area.area_name");  
        // }
        if($type == 'area'){
        $this->db->select("industry.industry_id,industry.industry_name");  
        }
        if($type == 'jobfit' || $type == 'employerfit'){
        $this->db->select("type.type_id,type.type_name");    
        }

        $this->db->from('jobpost_company_relation');
        $this->db->where('jobpost_id', $jobpost_id);
        $this->db->where('type', $type);
        if($type == 'location'){
        $this->db->join('locations','locations.locations_id = jobpost_company_relation.type_id');
        }
        if($type == 'skill'){
        $this->db->join('skills_master','skills_master.skills_id = jobpost_company_relation.type_id');
        } 
        if($type == 'area'){
       // $this->db->join('functional_area','functional_area.area_id = jobpost_company_relation.type_id');
          $this->db->join('industry','industry.industry_id = jobpost_company_relation.type_id');
        } 
        if($type == 'jobfit' || $type == 'employerfit'){
        $this->db->join('type','type.type_id = jobpost_company_relation.type_id');
        }
        if($type == 'seniority'){
        $this->db->join('seniorities','seniorities.seniority_id = jobpost_company_relation.type_id');
        }
              
        $result = $this->db->get();
        //echo $this->db->last_query(); exit;               
        return $result->result_array();
    } 
    public function get_title_single_user_relation($id) {
        $this->db->select("title_user_relation.*,company_master.company_name");  
        $this->db->from('title_user_relation');     
        $this->db->where('id', $id); 
        $this->db->join('company_master','company_master.company_id = title_user_relation.company_id','left');       
        $result = $this->db->get();    
        //echo $this->db->last_query();       
        return $result->result_array();
    }
    public function get_assign_titles($id) {
        $this->db->select("type.*");
        $this->db->from('assign_titles');
        $this->db->where('relation_id', $id);
        $this->db->join('type', 'type.type_id = assign_titles.title_id', 'left');  
        $result = $this->db->get();    
        //echo $this->db->last_query();       
        return $result->result_array();
    }

    public function update_cmn_tbl($table,$field,$id,$data) {
       $this->db->where($field,$id);
       $this->db->update($table,$data); 
       //echo $this->db->last_query();exit;              
       return $this->db->affected_rows();
   }

   public function sendmail($username,$password) {

        //$to = 'bamadebupadhya@gmail.com';
    $to = $username;
    $message = "Hello User, <br><br>Your password is $password.<br><br><br>Thanks<br>Admin";
    $subject = $to;
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: <admin@haveitall.com>Forgot Password(-HaveItAll-)'. "\r\n";
        //$headers .= 'Cc: sangram@primacpl.com' . "\r\n";
    return  mail($to,$subject,$message,$headers);       

}

public function get_company_user($id) {
        $this->db->select('users_firstname,users_lastname,users_companyid,users_id,company_type,users_username,users_status');
        //if ($id) {
            $this->db->where('users_companyid', $id);
            $this->db->where('users_type', '1');               
       // } 

        $result = $this->db->get($this->userTable);   
        //echo $this->db->last_query();      
        return $result->result_array();
}

public function get_company_profileinfo($id) {
        $this->db->select('users_firstname,users_lastname,users_companyid,users_id,users_username,users_status,users_profilepic');
        $this->db->where('users_companyid', $id);
        $this->db->where('users_type', '2');
        $result = $this->db->get($this->userTable);   
       // echo $this->db->last_query();      
        return $result->result_array();
}

   // Common function list end ------------    

function base64_to_jpeg($base64_string, $output_file) {
        // open the output file for writing
        $ifp = fopen( $output_file, 'wb' ); 
        $data = explode( ',', $base64_string );
        fwrite( $ifp, base64_decode( $data[ 1 ] ) );
        fclose( $ifp ); 
        return $output_file; 
    }
function convery_code_to_jpg($data){        
        $data = str_replace('data:image/jpeg;base64,', '', $data);
        $data = str_replace(' ', '+', $data);
        $data = base64_decode($data);
        $file = image_url.'/'.rand() . '.jpg';
        $success = file_put_contents($file, $data);
        $data = base64_decode($data); 
        $source_img = imagecreatefromstring($data);
        $rotated_img = imagerotate($source_img, 90, 0); 
        $file = image_url.'/'. rand(). '.jpg';
        $imageSave = imagejpeg($rotated_img, $file, 10);
        imagedestroy($source_img);
    }


public function validateUserLogin($username = '', $password = '') {
    $this->db->select('users_id, users_username, users_companyid,users_type,company_type,CONCAT(users_firstname," ",users_lastname) as name,company.company_name,users_profilepic');
    $this->db->where('users_username', $username);
    $this->db->where('users_password', $password);
    $this->db->where('users_status','0');
	$this->db->join('company', 'company.company_id=users.users_companyid','left');
    $result = $this->db->get($this->userTable);
	//echo $this->db->last_query();exit;
    return $result->result_array();
} 

public function user_status_check($username) {
    $this->db->select('users_id');
    $this->db->where('users_username', $username);    
    $this->db->where('users_status','1');       
    $result = $this->db->get($this->userTable);   
       // echo $this->db->last_query();     
    return $result->result_array();
} 

public function get_all_type($type = FALSE) {
    $this->db->select('*');
    if ($type) {
        $this->db->where('type_category', $type);
        $this->db->where('type_status', '0');
    }

    $result = $this->db->get($this->typeTable);
    return $result->result_array();
}



public function delete_post($userid,$type,$id) {
    $this->db->where('type_rel_userid',$userid); 
    $this->db->where('type_id',$id); 
    $this->db->where('type_rel_category',$type); 
    $this->db->delete($this->type_user_relTable);
}
public function get_checked_type($id,$type) {
    $this->db->select('type_user_rel.type_id,type.type_name,type.type_parent_id,type.description,type_user_rel.user_description');
    $this->db->from('type_user_rel');
    if ($type) {
      $this->db->where('type_rel_userid',$id); 
      $this->db->where('type_rel_category',$type); 
  }
  $this->db->join('type', 'type.type_id = type_user_rel.type_id', 'left');
  //$this->db->order_by('type_titles_year_range', 'DESC');
  $result = $this->db->get();
  //echo $this->db->last_query();
  return $result->result_array();
}

public function update_profile_tbl($data,$id) {

  $this->db->where('users_id',$id);
  $this->db->update($this->userTable,$data);
//echo $this->db->last_query();
  return $this->db->affected_rows();

}
public function get_profile_info($id) {
    $this->db->select('users_firstname,users_lastname,users_username,users_current_title,users_current_employer,users_bio,users_linkedin_link,users_twitter_link,users_facebook_link,users_istagram_link,users_country,users_state,users_city,users_profilepic,users_type,company.company_name,users_companyid,countries.name as countryname,states.name as statename,cities.name as cityname,company.company_url');
    if ($id) {
      $this->db->where('users_id',$id);		  
  }		
  $this->db->join('company', 'users.users_companyid = company.company_id', 'left');
  $this->db->join('countries', 'users.users_country = countries.id', 'left');
  $this->db->join('states', 'users.users_state = states.id', 'left');
  $this->db->join('cities', 'users.users_city = cities.id', 'left');
  $result = $this->db->get($this->userTable);
  //echo $this->db->last_query();
  return $result->result_array();
}


/*---------------------parsu start------------------------*/

public function gettypecategories() {
    $this->db->select('*');
        //$this->db->where('type_status', '0');
    $this->db->order_by('type_category', 'asc');
    $this->db->order_by('type_id', 'desc');
    $result = $this->db->get($this->typeTable);
    return $result->result_array();
}

public function get_checked_country_exist($users_id,$country_id) {
    $this->db->select('users_locations_relation_id');        
    $this->db->where('relation_user_id', $users_id);
    $this->db->where('rel_country_id', $country_id); 
    $result = $this->db->get($this->locationsrelationTable);
    return $result->result_array();
}

public function get_checked_industry_exist($jobpost_id,$industry) {
    $this->db->select('type_id');        
    $this->db->where('jobpost_id', $jobpost_id);
    $this->db->where('type_id', $industry); 
    $this->db->where('type', 'area');
    $result = $this->db->get('jobpost_company_relation');
    //echo $this->db->last_query();exit;
    return $result->result_array();
}

public function get_single_typecategory($typeCategoryID = FALSE) {
    $this->db->select('*');
    if ($typeCategoryID) {
        $this->db->where('type_id', $typeCategoryID);
            //$this->db->where('type_status', '0');
    }

    $result = $this->db->get($this->typeTable);
    return $result->result_array();
}

public function add_typecategory($data){
    $this->db->insert($this->typeTable, $data);     
    return $this->db->insert_id();
}

public function edit_typecategory($typeID,$data){
    $this->db->where('type_id', $typeID);
    $this->db->update($this->typeTable, $data); 
    $affectedRows = $this->db->affected_rows();
    if($affectedRows >= 0){
        return $typeID;
    } else {
        return -1;
    }    

}

public function getallusers(){
    $this->db->select('users_id,users_firstname,users_companyid,users_lastname,users_username,users_status');
    $this->db->where('users_companyid', '0');
    $this->db->where('users_type <>', '3');
    $result = $this->db->get($this->userTable);
    return $result->result_array();
}

public function edit_userstatus($userID,$data){

    $updateData = array(
        'users_status' => "$data"
        );

    $this->db->where('users_id',$userID);
    $this->db->update($this->userTable, $updateData);
    return  $this->db->affected_rows();
    if($affectedRows >= 0){
      return $userID;
  } else {
      return -1;
  }       
}

public function check_duplicateTypeCategories($typeCategoryName,$typeCategory,$typeStatus){
    $this->db->select('*');
    $this->db->where('type_name', $typeCategoryName);
    $this->db->where('type_category', $typeCategory);
    $this->db->where('type_status', $typeStatus);
    $result = $this->db->get($this->typeTable);
       // echo $this->db->last_query();
    return $result->result_array();
}

public function fetch_inactiveTypeCategories($typeCategoryName,$typeCategory){
     $this->db->select('*');
     $this->db->where('type_name', $typeCategoryName);
     $this->db->where('type_category', $typeCategory);
     $this->db->where('type_status', '1');
     $result = $this->db->get($this->typeTable);
           // echo $this->db->last_query();
     return $result->result_array(); 
}

public function getalleducations(){
    $this->db->select('*');
    $this->db->where('type_parent_id ', 0);
    $this->db->where('type_category', 'education');
    $result = $this->db->get($this->typeTable);
    $educations  = $result->result_array();
    $education_arry = []; 

    for($i = 0;$i < count($educations); $i++){
         $education_arry[$i]['parentTypeID'] = $educations[$i]['type_id'];
         $education_arry[$i]['parentTypeName'] = $educations[$i]['type_name'];
         $education_arry[$i]['parentTypeStatus'] = $educations[$i]['type_status'];
         $education_arry[$i]['selected'] = false;
         $child_records = $this->geteducationdegrees($education_arry[$i]['parentTypeID'],'education');
         $education_arry[$i]['childrecords'] = $child_records;
    }

    return $education_arry;

}

public function deletesubcategories($categoryData){
    $sql = "delete from hia_type_user_rel where type_id IN (select type_id from hia_type where type_parent_id =". $categoryData['type_parent_id'].") and type_rel_userid =".$categoryData['type_rel_userid'].";";
    $this->db->query($sql);
    return $this->db->affected_rows();
}

public function deletecategory($userid,$id,$type){
      $this->db->where('type_rel_userid',$userid); 
      $this->db->where('type_id',$id); 
      $this->db->where('type_rel_category',$type); 
      $this->db->delete($this->type_user_relTable);
      return $this->db->affected_rows();
}

public function commonDelete($table,$field,$id){      
      $this->db->where($field,$id); 
      $this->db->delete($table);
      return $this->db->affected_rows();
}

public function commonrelationDel($table,$id,$type){      
      $this->db->where('jobpost_id',$id); 
      $this->db->where('type',$type);
      $this->db->delete($table);
      return $this->db->affected_rows();
}

public function geteducationdegrees($typeParentID, $typeCategory){
        $this->db->select('*');
        $this->db->where('type_parent_id ', $typeParentID);
        $this->db->where('type_category', $typeCategory);
        $this->db->where('type_status', '0');
        $this->db->order_by('type_name', 'asc');
        $result = $this->db->get($this->typeTable);
        //echo $this->db->last_query();exit;
        return $result->result_array();
}

public function fetch_countryID($countryName){
        $this->db->select('id');
        $this->db->where('name', $countryName);
        $result = $this->db->get($this->countryTable);
       // echo $this->db->last_query();
        return $result->row_array();
    }

public function add_linkedinuserinfo($data){
        $this->db->insert($this->userTable, $data);
        return $this->db->insert_id();
    }

    public function check_existingemail($userEmail){
        $this->db->select('*');
        $this->db->where('users_username', $userEmail);
        $result = $this->db->get($this->userTable);
       // echo $this->db->last_query();
        return $result->row_array();
    }

/*---------------------parsu end---------------------*/

// start  26/7/2017 =====================================

public function get_industry_user_relation($id) {
        $this->db->select("industry_user_relation.*,industry.industry_name");
        $this->db->from('industry_user_relation');
        $this->db->where('users_id', $id);
        $this->db->join('industry','industry.industry_id = industry_user_relation.industry_id','left');
        $this->db->order_by('id', 'desc');
        $result = $this->db->get();    
        //echo $this->db->last_query();       
        return $result->result_array();
    }
    
    public function get_assign_industry($id) {
        $this->db->select("functional_area.area_id,functional_area.area_name");
        $this->db->from('assign_industry');
        $this->db->where('relation_id', $id);
        $this->db->where('area_status', '0');
        $this->db->join('functional_area', 'functional_area.area_id = assign_industry.area_id', 'left');  
        $result = $this->db->get();    
        //echo $this->db->last_query();       
        return $result->result_array();
    }

     public function get_assign_education($id) {
        $this->db->select("type.type_id,type.type_name");
        $this->db->from('assign_education');
        $this->db->where('relation_id', $id);
        $this->db->where('type_status', '0');
        $this->db->join('type', 'type.type_id = assign_education.subeducation_id', 'left');  
        $result = $this->db->get();    
        //echo $this->db->last_query();       
        return $result->result_array();
    }

 public function get_seniority_level($id) {
        $this->db->select("seniorities.seniority_id,seniorities.seniority_name");
        $this->db->from('industry_user_level_relation');
        $this->db->where('rel_industry_id', $id);
        $this->db->where('seniority_status', '0');
        $this->db->join('seniorities', 'seniorities.seniority_id = industry_user_level_relation.level_id', 'left');  
        $result = $this->db->get();    
        //echo $this->db->last_query();  exit;     
        return $result->result_array();
    }
    public function get_education_type($type = FALSE) {
        $this->db->select('*');
        if ($type) {
            $this->db->where('type_category', $type);
            $this->db->where('type_status', '0');
            $this->db->where('type_parent_id', '0');
            $this->db->order_by('type_name', 'ASC');
        }

        $result = $this->db->get($this->typeTable);
        return $result->result_array();
    }

    public function get_education_user_relation($id) {
        $this->db->select("education_user_relation.*,type.type_name,institute.institute_name");
        $this->db->from('education_user_relation');
        $this->db->where('users_id', $id);
        $this->db->join('institute','institute.institute_id = education_user_relation.institute_id','left');
        $this->db->join('type','type.type_id = education_user_relation.education_id','left');
        //$this->db->join('type as t','t.type_id = education_user_relation.subeducation_id','left');
        $this->db->order_by('id', 'desc');
        $result = $this->db->get();    
        //echo $this->db->last_query(); exit;      
        return $result->result_array();
    }
    public function get_checked_record($id,$oldpassword) {
        $this->db->select('users_id');
        $this->db->where('users_id', $id);
        $this->db->where('users_password',$oldpassword);
        $result = $this->db->get($this->userTable);             
        return $result->result_array();
}

public function get_location_details($id){
    $this->db->select("locations.*");
    $this->db->from('users_locations_relation');
    $this->db->where('relation_user_id', $id);   
    $this->db->join('locations','locations.locations_id = users_locations_relation.relation_locations_id','left');     
    $result = $this->db->get();     
    return $result->result_array();

}

public function get_skill_details($id){
    $this->db->select("skills_master.skills_id,skills_master.skills_name,skills_master.skills_status");
    $this->db->from('users_skills_relation');
    $this->db->where('relation_user_id', $id);   
$this->db->join('skills_master','skills_master.skills_id = users_skills_relation.relation_skills_id','left');   
    $result = $this->db->get();     
    return $result->result_array();

}



// End  26/7/2017 =======================================

public function delete_location($userid,$country_id) {
    $this->db->where('relation_user_id',$userid); 
    $this->db->where('rel_country_id',$country_id);   
    $this->db->delete($this->locationsrelationTable);
      
    return $id;
}
public function delete_industry($jobpost_id,$industry_id) {
    $this->db->where('jobpost_id',$jobpost_id);  
    $this->db->where('type_id',$industry_id); 
    $this->db->where('type','area');       
    $this->db->delete('jobpost_company_relation');
    //echo $this->db->last_query(); exit;   
    return $jobpost_id;
}
public function delete_area($jobpost_id,$area_id) {
    $this->db->where('jobpost_id',$jobpost_id); 
    $this->db->where('area_id',$area_id);       
    $this->db->delete('jobpost_company_industry_area');
    //echo $this->db->last_query(); exit;   
    return $jobpost_id;
}
public function delete_arealist($jobpost_id,$industry_id) {
    $this->db->where('jobpost_id',$jobpost_id); 
    $this->db->where('industry_id',$industry_id);       
    $this->db->delete('jobpost_company_industry_area');
    //echo $this->db->last_query(); exit;   
    return $jobpost_id;
}
public function delete_location_state($userid,$id) {
    $this->db->where('user_id',$userid); 
    $this->db->where('state_id',$id);   
    $this->db->delete($this->locationsrelationStateTable);
    //echo $this->db->last_query(); exit;   
    return $id;
}
public function delete_location_city($userid,$id) {
    $this->db->where('user_id',$userid); 
    $this->db->where('city_id',$id);   
    $this->db->delete($this->locationsrelationCityTable);
    //echo $this->db->last_query(); exit;   
    return $id;
}
public function get_user_data($table, $field, $id) {
        $this->db->select('*');         
        $this->db->where($field, $id);      
        $result = $this->db->get($table);    
        //echo $this->db->last_query();       
        return $result->result_array();
    }
    public function get_all_state_city_location($countryid,$user_id) {
        $this->db->select('users_locations_relation_state.*,states.name');
        $this->db->from('users_locations_relation_state');         
        $this->db->where('users_locations_relation_state.country_id', $countryid);
        $this->db->where('users_locations_relation_state.user_id', $user_id);
        $this->db->join('states','states.id = users_locations_relation_state.state_id','left');   
        $result = $this->db->get();    
        //echo $this->db->last_query();       
        return $result->result_array();
    }

    public function get_all_citylist($stateid,$user_id) {
        $this->db->select('cities.name as cityname,cities.id as city_id');
        $this->db->from('users_locations_relation_city');         
        $this->db->where('users_locations_relation_city.state_id', $stateid);
        $this->db->where('users_locations_relation_city.user_id', $user_id);
        $this->db->join('cities','cities.id = users_locations_relation_city.city_id','left');   
        $result = $this->db->get();    
        //echo $this->db->last_query();       
        return $result->result_array();
    }

    public function get_all_notes($note_by,$note_to) {
        $this->db->select('*');                    
        $this->db->where('note_by', $note_by);
        $this->db->where('note_to', $note_to);
        $this->db->where('note_status', '0');
        $this->db->order_by('note_id', 'desc');
        $result = $this->db->get('notes');  
        //echo $this->db->last_query();exit;       
        return $result->result_array();
    }

    public function getculturefitdata($cutype_id,$users_id) {
        $this->db->select('type_rel_id,type_rel_userid,type_user_rel.type_id,user_description,type.type_name');
        $this->db->from('type_user_rel');                    
        $this->db->where('type_rel_userid', $users_id);
        $this->db->where('type_user_rel.type_id', $cutype_id);
        $this->db->join('type','type.type_id = type_user_rel.type_id','left');    
        $result = $this->db->get();  
        //echo $this->db->last_query();exit;       
        return $result->result_array();
    }

     public function get_all_feeds($id) {
        $this->db->select("*");        
        $this->db->where('post_userid', $id);         
        $this->db->order_by('post_id', 'desc');
        $result = $this->db->get('posts');  
        //echo $this->db->last_query();exit;               
        return $result->result_array();
    }
    

}
