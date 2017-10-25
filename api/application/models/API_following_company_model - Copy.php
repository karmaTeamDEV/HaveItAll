<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class API_following_company_model extends CI_Model {


	function following_for_user_company_query($user_id='', $following_type='', $company_id="")
	{
		$sql = "SELECT UFC.id, UFC.user_id, UFC.company_id, UFC.following_date, UFC.following_type, 
				U.users_firstname, U.users_lastname, 
				C.company_name, C.company_logo, C.contact_person, C.address, C.phone
				FROM hia_user_following_company AS UFC
				JOIN hia_users AS U ON( UFC.user_id = U.users_id )
				JOIN hia_company AS C ON (UFC.company_id = C.company_id)
				WHERE U.users_type != '3'
				AND U.users_status != '1'";

		if ($following_type != "") {
			$sql.= " AND UFC.following_type = '$following_type' ";
		}
				
		if ($user_id != "") {
			$sql.= " AND UFC.user_id = '$user_id' ";
		}
				
		if ($company_id != "") {
			$sql.= " AND UFC.company_id = '$company_id' ";
		}
				
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

	function suggeted_company_for_user_query($user_id='')
	{
		$sql = "SELECT DISTINCT COM_MATCH.company_id, COM_MATCH.company_name, COM_MATCH.company_life_friendly, COM_MATCH.company_logo, COM_MATCH.contact_person, COM_MATCH.about, COM_MATCH.address, COM_MATCH.phone
			FROM
			(
					SELECT COM.*, USR.users_id, USR.users_city, TUR.type_id, TUR.type_rel_category
					FROM hia_company AS COM
					JOIN hia_users AS USR ON (COM.company_id = USR.users_companyid AND USR.users_type = '2')
					JOIN hia_type_user_rel AS TUR ON (USR.users_id = TUR.type_rel_userid AND TUR.type_rel_category IN('job_fit', 'employer_fit') )
				
			) COM_MATCH
			JOIN
			(
				SELECT USR.users_id, USR.users_city, TUR.type_id, TUR.type_rel_category
				FROM hia_users AS USR
				JOIN hia_type_user_rel AS TUR ON (USR.users_id = TUR.type_rel_userid AND TUR.type_rel_category IN('job_fit', 'employer_fit') )
				WHERE  USR.users_id = '$user_id'
				
				
			)USR_MATCH ON ( COM_MATCH.users_city = USR_MATCH.users_city AND COM_MATCH.type_id = USR_MATCH.type_id AND COM_MATCH.type_rel_category = USR_MATCH.type_rel_category )
				WHERE COM_MATCH.company_id NOT IN (SELECT company_id FROM hia_user_following_company WHERE user_id = '$user_id' AND following_type = 'user') "  ;

		echo $sql;		
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

	function delete_following_for_user_company_query($delete_id='')
	{
		$sql = $this->db->delete('user_following_company', array('id' => $delete_id)); 
		//$query = $this->db->query($sql);

		if ( ! $sql )
		{
			$error = $this->db->error();
			//print_r($error);
			//exit();
			return $error;
		}
		else
		{
			
			return $delete_id ;
		}
		
	}





}
