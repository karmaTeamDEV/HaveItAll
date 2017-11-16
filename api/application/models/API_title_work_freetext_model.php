<?php
/* ==========================================================================
Author: BISWAJIT PANDA
Create date:  05/29/2017
Description:  Title api model
============================================================================= */

defined('BASEPATH') OR exit('No direct script access allowed');

class API_title_work_freetext_model extends CI_Model {

    protected $companyTable = 'company';
	protected $userTable = 'users';
	protected $typeTable = 'type';
	protected $type_user_relTable = 'type_user_rel';
	
    public function __construct() {
        parent::__construct();
    }

/* ==========================================================================
Author: PADMA LOCHAN PRADHAN
update date:  5/11/2017
Description: common insert table 
============================================================================= */
    public function insert_cmn_tbl($table,$data){
        if($this->db->insert($table, $data)){
			//echo $this->db->last_query();
            return $this->db->insert_id();
			
        }       
        
    }

    public function get_single_record($table,$field, $id) {
        $this->db->select('users_username');
        if ($id) {
            $this->db->where($field, $id);            
        }        
        $result = $this->db->get($table);       
        return $result->row_array();
    }

     function get_master_record($table,$field,$id) {
        $this->db->select('*');
        if ($id) {
            $this->db->where($field, $id);            
        }        
        $result = $this->db->get($table);
        //echo $this->db->last_query();       
        return $result->result_array();
    }

    public function update_cmn_tbl($table,$field,$id,$data) {

         $this->db->where($field,$id);
         $this->db->update($table,$data);         
         return $this->db->affected_rows();

    }
	
	
	
	function all_masterData_for_user_query($type_category)
	{
		$sql = "SELECT type_id AS id, type_name FROM hia_type WHERE type_category = ? AND type_status != '1'";
		$query = $this->db->query( $sql, array($type_category )) ; 		
		if ( !$query )
		{
			$error = $this->db->error();
			print_r($error);
			//exit();
			return $error;
		}
		else
		{
			
			return $query->result_array();
		}
		
	}


/* ==========================================================================
Author: PADMA LOCHAN PRADHAN
update date:  6/11/2017
Description: common insert table 
============================================================================= */

	function check_master_data_query( $title_name, $catagory_type_id )
	{
		$sql = "SELECT * FROM hia_type WHERE type_name = ? AND type_category = ? AND type_status != '1'";
		$query = $this->db->query( $sql, array($title_name, $catagory_type_id )) ; 		
			
		return $query->result_array();
		
	}

	function get_a_title_for_user_query($user_id, $title_id, $catagory_type_id)
	{
		$sql = "SELECT * FROM hia_title_worked_freetext_for_user WHERE user_id = ? AND title_held_master_id = ?  AND category_type_id = ? ";
		//echo $sql ;
		$query = $this->db->query($sql, array($user_id, $title_id, $catagory_type_id));
		
		return $query->num_rows();
		
	}

	function get_a_title_for_user_titlename_query($user_id, $title_name, $catagory_type_id)
	{
		$sql = "SELECT * FROM hia_title_worked_freetext_for_user WHERE user_id = ? AND other_title_text = ?  AND category_type_id = ? ";
		
		$query = $this->db->query($sql, array($user_id, $title_name, $catagory_type_id ));
		//echo $this->db->last_query(); ;
		return $query->num_rows();
		
	}

	function title_work_for_user_query($user_id, $catagory_type_id)
	{
		$sql = "SELECT  TU.id, TU.user_id, TU.title_held_master_id, TU.category_type_id, TU.other_title_text AS title_work_name
				FROM hia_title_worked_freetext_for_user AS TU
				WHERE TU.user_id = '$user_id' 
				AND TU.category_type_id = '$catagory_type_id'
				AND (TU.title_held_master_id = 0 OR TU.title_held_master_id IS NULL  )
				UNION
				SELECT TU.id, TU.user_id, TU.title_held_master_id, TU.category_type_id, TM.type_name AS title_work_name
				FROM  hia_title_worked_freetext_for_user AS TU, hia_type TM
				WHERE TU.title_held_master_id = TM.type_id AND TU.category_type_id = TM.type_category
				AND TU.user_id = '$user_id' AND TU.category_type_id = '$catagory_type_id' AND TU.title_held_master_id !=0 AND TU.title_held_master_id IS NOT NULL 
				
				ORDER BY id";
				
		if ( ! $this->db->simple_query($sql))
		{
			$error = $this->db->error();
			//print_r($error);
			//exit();
			return $error;
		}
		else
		{
			$query = $this->db->query($sql);
			
			return $query->result_array();
		}
		
	}

	function delete_title_for_user_query($title_id)
	{
		$sql = "DELETE
				FROM hia_title_worked_freetext_for_user 
				WHERE id = '$title_id' ";
				
		if ( ! $this->db->simple_query($sql))
		{
			$error = $this->db->error();
			//print_r($error);
			//exit();
			return $error;
		}
		else
		{
			
			return $title_id;
		}
		
	}


}
