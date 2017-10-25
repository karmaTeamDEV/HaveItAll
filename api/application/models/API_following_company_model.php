<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class API_following_company_model extends CI_Model {


	function following_for_user_company_query($user_id='', $following_type='', $company_id="",$lebel = "")
	{
		$sql = "SELECT UFC.id, UFC.user_id, UFC.company_id, UFC.following_date, UFC.following_type, 
				U.users_firstname, U.users_lastname, CU.users_id AS company_user_id,
				IF(CU.users_profilepic IS NULL OR CU.users_profilepic = '', 'no_company_logo.png', CU.users_profilepic)AS users_profilepic,
				C.company_name, C.company_logo,
				fnStripTags(CU.users_bio) AS users_bio, IF(CU.users_phone IS NULL OR CU.users_phone = '', 'N/A', CU.users_phone) AS users_phone, 
				hia_cities.name AS city_name, hia_states.name AS state_name, hia_countries.name AS country_name,
				UCV.company_id AS viewing_company_id, UCV.id AS viewing_id,  UCV.viewing_date AS max_view_date
				FROM hia_user_following_company AS UFC
				JOIN hia_users AS U ON( UFC.user_id = U.users_id )
				JOIN hia_company AS C ON (UFC.company_id = C.company_id)
				JOIN hia_users AS CU ON( C.company_id = CU.users_companyid AND CU.users_type = '2' AND CU.users_status != '1')
				LEFT JOIN hia_cities ON (CU.users_city = hia_cities.id)
				LEFT JOIN hia_states  ON (CU.users_state = hia_states.id)
				LEFT JOIN hia_countries ON (CU.users_country = hia_countries.id)
				LEFT JOIN 
					(
						SELECT id, user_id, company_id, viewing_type, MAX(viewing_date) AS viewing_date  
						FROM hia_user_view_company WHERE user_id = '$user_id' AND viewing_type = 'user'
						GROUP BY company_id
						
					) UCV ON (U.users_id = UCV.user_id AND C.company_id = UCV.company_id )
				WHERE U.users_type != '3'
				AND U.users_status != '1' ";

		if ($following_type != "") {
			$sql.= " AND UFC.following_type = '$following_type' ";
		}
				
		if ($user_id != "") {
			$sql.= " AND UFC.user_id = '$user_id' ";
		}
				
		// if ($company_id != "") {
		// 	$sql.= " AND UFC.company_id = '$company_id' ";
		// }

		if ($company_id != "") {
			if($lebel == 'next'){
				$sql.= " AND CU.users_id > '$company_id'  ORDER BY  UFC.company_id ASC";
			}
			if($lebel == 'prev'){
				$sql.= " AND CU.users_id < '$company_id' order by  UFC.company_id DESC";
			}			
		}
		
		if ($lebel == '') {
			$sql.= "  ORDER BY  UFC.company_id ASC";
		}
		//echo $sql;

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

	function user_viewed_company_query($user_id='', $viewing_type='', $company_id="",$lebel="")
	{
		$sql = "SELECT MAX(UVC.viewing_date) AS viewing_date,
				UVC.id, UVC.user_id, UVC.company_id, UVC.viewing_type, 
				IF(CU.users_profilepic IS NULL OR CU.users_profilepic = '', 'no_company_logo.png', CU.users_profilepic)AS users_profilepic,
				U.users_firstname, U.users_lastname, 
				C.company_name, C.company_logo,
				fnStripTags(CU.users_bio) AS users_bio, CU.users_id AS company_user_id, CU.users_bio AS full_com_desc,
				 IF(CU.users_phone IS NULL OR CU.users_phone = '', 'N/A', CU.users_phone) AS users_phone, 
				hia_cities.name AS city_name, hia_states.name AS state_name, hia_countries.name AS country_name
				FROM hia_user_view_company AS UVC
				JOIN hia_users AS U ON( UVC.user_id = U.users_id )
				JOIN hia_company AS C ON (UVC.company_id = C.company_id)
				JOIN hia_users AS CU ON( C.company_id = CU.users_companyid AND CU.users_type = '2' AND CU.users_status != '1')
				LEFT JOIN hia_cities ON (CU.users_city = hia_cities.id)
				LEFT JOIN hia_states  ON (CU.users_state = hia_states.id)
				LEFT JOIN hia_countries ON (CU.users_country = hia_countries.id)
				WHERE U.users_type != '3'
				AND U.users_status != '1' 
				AND UVC.company_id NOT IN (SELECT company_id FROM hia_user_following_company WHERE user_id = '$user_id' AND following_type = 'user')  ";

		if ($viewing_type != "") {
			$sql.= " AND UVC.viewing_type = '$viewing_type' ";
		}
				
		if ($user_id != "") {
			$sql.= " AND UVC.user_id = '$user_id' ";
		}
				
		// if ($company_id != "") {
		// 	$sql.= " AND UVC.company_id = '$company_id' ";
		// }

		if ($company_id != "") {			
			if($lebel == 'next'){
				$sql.= " AND CU.users_id > '$company_id'  ";				
			}
			if($lebel == 'prev'){
				$sql.= " AND CU.users_id < '$company_id'  ";				 
			}
		}

		// if($lebel == 'next'){
		// 	$sql.= " GROUP BY UVC.company_id ";	
		// }
		if($lebel == 'prev'){
			$sql.= " GROUP BY UVC.company_id order by UVC.company_id DESC ";	
		}else{
			$sql.= " GROUP BY UVC.company_id ";	
		}
		//echo $sql;exit;

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

	function suggeted_company_for_user_query($user_id='', $view_status = '', $follow_status='', $next_company='',$lebel ='')
	{
		$sql = "SELECT COM_MATCH.company_id, COM_MATCH.company_name, COM_MATCH.company_life_friendly, 
				COM_MATCH.company_logo, COM_MATCH.contact_person, COM_MATCH.about, COM_MATCH.address, COM_MATCH.phone, 
				fnStripTags(CU.users_bio) AS users_bio, CU.users_id AS company_user_id,  CU.users_bio AS full_com_desc,
				IF(CU.users_profilepic IS NULL OR CU.users_profilepic = '', 'no_company_logo.png', CU.users_profilepic)AS users_profilepic,
				IF(CU.users_phone IS NULL OR CU.users_phone = '', 'N/A', CU.users_phone) AS users_phone, 
				hia_cities.name AS city_name, hia_states.name AS state_name, hia_countries.name AS country_name,
				SUM(COM_MATCH.jobfit_status) AS jobfit_status,  SUM( COM_MATCH.employeefit_status ) AS employeefit_status,  SUM( COM_MATCH.location_status ) AS location_status,
				SUM( COM_MATCH.industry_status ) AS industry_status,  SUM( COM_MATCH.area_status ) AS area_status,
				UCV.company_id AS viewing_company_id, UCV.id AS viewing_id,  UCV.viewing_date AS max_view_date
				FROM(
					SELECT DISTINCT COM.*,  1 AS jobfit_status, 0 AS employeefit_status, 0 AS location_status, 0 AS industry_status, 0 AS area_status
					FROM hia_company AS COM
					JOIN hia_users AS USR ON (COM.company_id = USR.users_companyid AND USR.users_type = '2')
					JOIN hia_type_user_rel AS TUR ON (USR.users_id = TUR.type_rel_userid AND TUR.type_rel_category IN('job_fit') )
					JOIN hia_users AS USR1 ON (  USR1.users_id = '$user_id')
					JOIN hia_type_user_rel AS TUR1 ON (USR1.users_id = TUR1.type_rel_userid AND TUR1.type_rel_category IN('job_fit') AND TUR.type_id = TUR1.type_id)
					
					UNION
					SELECT DISTINCT COM.*,  0 AS jobfit_status, 1 AS employeefit_status, 0 AS location_status, 0 AS industry_status, 0 AS area_status
					FROM hia_company AS COM
					JOIN hia_users AS USR ON (COM.company_id = USR.users_companyid AND USR.users_type = '2')
					JOIN hia_type_user_rel AS TUR ON (USR.users_id = TUR.type_rel_userid AND TUR.type_rel_category IN('employer_fit') )
					JOIN hia_users AS USR1 ON (  USR1.users_id = '$user_id')
					JOIN hia_type_user_rel AS TUR1 ON (USR1.users_id = TUR1.type_rel_userid AND TUR1.type_rel_category IN('employer_fit') AND TUR.type_id = TUR1.type_id)
					 
					UNION
					SELECT DISTINCT COM.*,  0 AS jobfit_status, 0 AS employeefit_status, 1 AS location_status, 0 AS industry_status, 0 AS area_status
					FROM hia_company AS COM
					JOIN hia_users AS USR ON (COM.company_id = USR.users_companyid AND USR.users_type = '2')
					JOIN hia_users AS USR1 ON (  USR1.users_id = '$user_id' AND USR.users_city = USR1.users_city )
					
					UNION
					SELECT DISTINCT COM.*,  0 AS jobfit_status, 0 AS employeefit_status, 0 AS location_status, 1 AS industry_status, 0 AS area_status
					FROM hia_company AS COM
					JOIN hia_users AS USR ON (COM.company_id = USR.users_companyid AND USR.users_type = '2')
					JOIN hia_industry_user_relation AS IUR ON (USR.users_id = IUR.users_id  )
					JOIN hia_users AS USR1 ON (  USR1.users_id = '$user_id')
					JOIN hia_industry_user_relation AS IUR1 ON (USR1.users_id = IUR1.users_id  AND IUR.industry_id = IUR1.industry_id)
					 
					UNION
					SELECT DISTINCT COM.*,  0 AS jobfit_status, 0 AS employeefit_status, 0 AS location_status, 0 AS industry_status, 1 AS area_status
					FROM hia_company AS COM
					JOIN hia_users AS USR ON (COM.company_id = USR.users_companyid AND USR.users_type = '2')
					JOIN hia_assign_industry AS IUR ON (USR.users_id = IUR.userid  )
					JOIN hia_users AS USR1 ON (  USR1.users_id = '$user_id')
					JOIN hia_assign_industry AS IUR1 ON (USR1.users_id = IUR1.userid  AND IUR.area_id = IUR1.area_id)
					 
					 
					) COM_MATCH
					JOIN hia_users AS CU ON( COM_MATCH.company_id = CU.users_companyid AND CU.users_type = '2' AND CU.users_status != '1')
					LEFT JOIN hia_cities ON (CU.users_city = hia_cities.id)
					LEFT JOIN hia_states  ON (CU.users_state = hia_states.id)
					LEFT JOIN hia_countries ON (CU.users_country = hia_countries.id)
					LEFT JOIN 
					(
						SELECT id, user_id, company_id, viewing_type, MAX(viewing_date) AS viewing_date  
						FROM hia_user_view_company WHERE user_id = '$user_id' AND viewing_type = 'user'
						GROUP BY company_id
						
					) UCV ON ( COM_MATCH.company_id = UCV.company_id )
				WHERE COM_MATCH.company_id NOT IN (SELECT company_id FROM hia_user_following_company WHERE user_id = '$user_id' AND following_type = 'user') 	
				
			"  ;

		if ($view_status == "NO") {
			$sql.= " AND COM_MATCH.company_id NOT IN (SELECT company_id FROM hia_user_view_company WHERE user_id = '$user_id' AND viewing_type = 'user')  ";
		}
		if ($next_company != "") {
			
			if($lebel == 'next'){
				$sql.= " AND CU.users_id > '$next_company'  ";
			}
			if($lebel == 'prev'){
				$sql.= " AND CU.users_id < '$next_company'  ";
			}
		}

		// if($lebel == 'next'){
		// 	$sql.=" GROUP BY COM_MATCH.company_id ";
		// }
		if($lebel == 'prev'){
			$sql.=" GROUP BY COM_MATCH.company_id order by COM_MATCH.company_id DESC ";
		}else{
			$sql.=" GROUP BY COM_MATCH.company_id ";
		}


		//echo $sql;		
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

	function suggeted_users_for_company_query($user_id='', $company_id='', $view_status = '', $current_user_id="", $short_type='')
	{
		$sql = "SELECT USER_MATCH.users_id, USER_MATCH.users_companyid, USER_MATCH.users_firstname, USER_MATCH.users_lastname, USER_MATCH.users_current_employer, USER_MATCH.users_current_title, USER_MATCH.users_id AS next_user_id,
				fnStripTags(USER_MATCH.users_bio)  AS users_bio,  USER_MATCH.users_current_employer,USER_MATCH.users_current_title, 
				IF(USER_MATCH.users_profilepic IS NULL OR USER_MATCH.users_profilepic = '', 'no-image.png', USER_MATCH.users_profilepic) AS users_profilepic,
				IF(USER_MATCH.users_phone IS NULL OR USER_MATCH.users_phone = '', 'N/A', USER_MATCH.users_phone) AS users_phone, 
				hia_cities.name AS city_name, hia_states.name AS state_name, hia_countries.name AS country_name,
				SUM(USER_MATCH.jobfit_status) AS jobfit_status,  SUM( USER_MATCH.employeefit_status ) AS employeefit_status,  SUM( USER_MATCH.location_status ) AS location_status,
				SUM( USER_MATCH.industry_status ) AS industry_status,  SUM( USER_MATCH.area_status ) AS area_status,
				UFC.id AS following_id
				FROM 
				(
					SELECT DISTINCT USR.*, 1 AS jobfit_status, 0 AS employeefit_status, 0 AS location_status, 0 AS industry_status, 0 AS area_status 
					FROM hia_users AS USR
					JOIN hia_type_user_rel AS TUR ON (USR.users_id = TUR.type_rel_userid AND TUR.type_rel_category IN('job_fit') AND USR.users_type = '1' AND USR.users_status != '1')
					JOIN hia_users AS CUSER ON (  CUSER.users_id = '$user_id')
					JOIN hia_type_user_rel AS TUR1 ON (CUSER.users_id = TUR1.type_rel_userid AND TUR1.type_rel_category IN('job_fit') AND TUR.type_id = TUR1.type_id)

					UNION
					SELECT DISTINCT USR.*,  0 AS jobfit_status, 1 AS employeefit_status, 0 AS location_status, 0 AS industry_status, 0 AS area_status
					FROM hia_users AS USR
					JOIN hia_type_user_rel AS TUR ON (USR.users_id = TUR.type_rel_userid AND TUR.type_rel_category IN('employer_fit') AND USR.users_type = '1' AND USR.users_status != '1')
					JOIN hia_users AS CUSER ON (  CUSER.users_id = '$user_id')
					JOIN hia_type_user_rel AS TUR1 ON (CUSER.users_id = TUR1.type_rel_userid AND TUR1.type_rel_category IN('employer_fit') AND TUR.type_id = TUR1.type_id)

					UNION
					SELECT DISTINCT USR.*,  0 AS jobfit_status, 0 AS employeefit_status, 1 AS location_status, 0 AS industry_status, 0 AS area_status
					FROM hia_users AS USR
					JOIN hia_users AS CUSER ON (  CUSER.users_id = '$user_id' AND USR.users_city = CUSER.users_city AND USR.users_type = '1' AND USR.users_status != '1' )

					UNION
					SELECT DISTINCT USR.*,  0 AS jobfit_status, 0 AS employeefit_status, 0 AS location_status, 1 AS industry_status, 0 AS area_status
					FROM hia_users AS USR
					JOIN hia_industry_user_relation AS IUR ON (USR.users_id = IUR.users_id  AND USR.users_type = '1' AND USR.users_status != '1' )
					JOIN hia_users AS CUSER ON (  CUSER.users_id = '$user_id')
					JOIN hia_industry_user_relation AS IUR1 ON (CUSER.users_id = IUR1.users_id  AND IUR.industry_id = IUR1.industry_id)

					UNION
					SELECT DISTINCT USR.*,  0 AS jobfit_status, 0 AS employeefit_status, 0 AS location_status, 0 AS industry_status, 1 AS area_status
					FROM hia_users AS USR
					JOIN hia_assign_industry AS IUR ON (USR.users_id = IUR.userid  AND USR.users_type = '1' AND USR.users_status != '1' )
					JOIN hia_users AS CUSER ON (  CUSER.users_id = '$user_id')
					JOIN hia_assign_industry AS IUR1 ON (CUSER.users_id = IUR1.userid  AND IUR.area_id = IUR1.area_id)
				)USER_MATCH
				LEFT JOIN hia_cities ON (USER_MATCH.users_city = hia_cities.id)
				LEFT JOIN hia_states  ON (USER_MATCH.users_state = hia_states.id)
				LEFT JOIN hia_countries ON (USER_MATCH.users_country = hia_countries.id)
				LEFT JOIN hia_user_following_company AS UFC ON(USER_MATCH.users_id = UFC.user_id AND UFC.company_id = '$company_id' AND UFC.following_type = 'user' )
				WHERE USER_MATCH.users_id NOT IN (SELECT user_id FROM hia_user_following_company WHERE company_id = '$company_id' AND following_type = 'company') 	
				
			"  ;

		if ($view_status == "NO") {
			$sql.= " AND USER_MATCH.users_id NOT IN (SELECT user_id FROM hia_user_view_company WHERE company_id = '$company_id' AND viewing_type = 'company')  ";
		}

		if ($current_user_id != "" && $short_type=='next') {
			$sql.= " AND USER_MATCH.users_id > '$current_user_id' ";
		}

		if ($current_user_id != "" && $short_type=='prev') {
			$sql.= " AND USER_MATCH.users_id < '$current_user_id' ";
		}

			$sql.=" GROUP BY USER_MATCH.users_id ";


		if ( $short_type=='prev') {
			$sql.= " ORDER BY USER_MATCH.users_id DESC ";
		}
		else {
			$sql.= " ORDER BY USER_MATCH.users_id ASC  ";
		}

		//echo $sql;		
		
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


	function suggeted_company_for_user_query_hard_join($user_id='')
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

		//echo $sql;		
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


/**** COMPANY  */

	function company_following_user_query( $company_id="", $following_type='', $user_id, $current_user_id="", $short_type='' )
	{
		//echo $current_user_id."<br>";
		$sql = "SELECT UFC.id, UFC.user_id, UFC.company_id, UFC.following_date, UFC.following_type,  UFC.user_id AS next_user_id,
				U.users_firstname, U.users_lastname, 
				IF(U.users_profilepic IS NULL OR U.users_profilepic = '', 'no-image.png', U.users_profilepic)AS users_profilepic,
				fnStripTags(U.users_bio)  AS users_bio, IF(U.users_phone IS NULL OR U.users_phone = '', 'N/A', U.users_phone) AS users_phone,  U.users_current_employer,U.users_current_title,
				hia_cities.name AS city_name, hia_states.name AS state_name, hia_countries.name AS country_name,
				UCV.company_id AS viewing_company_id, UCV.id AS viewing_id,  UCV.viewing_date AS max_view_date
				FROM hia_user_following_company AS UFC
				JOIN hia_users AS U ON( UFC.user_id = U.users_id )
				LEFT JOIN hia_cities ON (U.users_city = hia_cities.id)
				LEFT JOIN hia_states  ON (U.users_state = hia_states.id)
				LEFT JOIN hia_countries ON (U.users_country = hia_countries.id)
				LEFT JOIN 
					(
						SELECT id, user_id, company_id, viewing_type, MAX(viewing_date) AS viewing_date  
						FROM hia_user_view_company WHERE company_id = '$company_id' AND viewing_type = 'company'
						GROUP BY user_id
						
					) UCV ON (U.users_id = UCV.user_id AND  UCV.company_id = '$company_id' )
				WHERE U.users_type != '3'
				AND U.users_status != '1' ";

		if ($following_type != "") {
			$sql.= " AND UFC.following_type = '$following_type' ";
		}
				
		if ($user_id != "") {
			$sql.= " AND UFC.user_id = '$user_id' ";
		}
				
		if ($company_id != "") {
			$sql.= " AND UFC.company_id = '$company_id' ";
		}
		if ($current_user_id != "" && $short_type =='next') {
			$sql.= " AND UFC.user_id > '$current_user_id' ";
		}
		if ($current_user_id != "" && $short_type =='prev') {
			$sql.= " AND UFC.user_id < '$current_user_id' ";
		}
		

		if ( $short_type=='prev') {
			$sql.= " ORDER BY UFC.user_id DESC ";
		}
		else {
			$sql.= " ORDER BY UFC.user_id ASC  ";
		}
		//echo $sql;

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


	function user_viewed_by_company_query($company_id='', $viewing_type='', $user_id="", $current_user_id="", $short_type='')
	{
		$sql = "SELECT MAX(UVC.viewing_date) AS viewing_date, UVC.user_id AS next_user_id,
				UVC.id, UVC.user_id, UVC.company_id, UVC.viewing_type, 
				U.users_firstname, U.users_lastname, IF(U.users_profilepic IS NULL OR U.users_profilepic = '', 'admin-no-image.png', U.users_profilepic)AS users_profilepic,
				 SUBSTRING_INDEX(U.users_bio, ' ', 4)  AS users_bio,
				 IF(U.users_phone IS NULL OR U.users_phone = '', 'N/A', U.users_phone) AS users_phone, 
				hia_cities.name AS city_name, hia_states.name AS state_name, hia_countries.name AS country_name,
				UFC.id AS following_id
				FROM hia_user_view_company AS UVC
				JOIN hia_users AS U ON( UVC.user_id = U.users_id )
				
				LEFT JOIN hia_cities ON (U.users_city = hia_cities.id)
				LEFT JOIN hia_states  ON (U.users_state = hia_states.id)
				LEFT JOIN hia_countries ON (U.users_country = hia_countries.id)
				LEFT JOIN hia_user_following_company AS UFC ON(U.users_id = UFC.user_id AND UFC.company_id = '$company_id' AND UFC.following_type = 'user' )
				WHERE U.users_type != '3'
				AND U.users_status != '1' 
				AND UVC.user_id NOT IN (SELECT user_id FROM hia_user_following_company WHERE company_id = '$company_id' AND following_type = 'company')  ";

		if ($viewing_type != "") {
			$sql.= " AND UVC.viewing_type = '$viewing_type' ";
		}
				
		if ($user_id != "") {
			$sql.= " AND UVC.user_id = '$user_id' ";
		}
				
		if ($company_id != "") {
			$sql.= " AND UVC.company_id = '$company_id' ";
		}

		if ($current_user_id != ""  && $short_type=='next') {
			$sql.= " AND UVC.user_id > '$current_user_id' ";
		}
		if ($current_user_id != ""  && $short_type=='prev') {
			$sql.= " AND UVC.user_id < '$current_user_id' ";
		}

		$sql.= " GROUP BY UVC.user_id ";	

		//echo $sql;
		if ( $short_type=='prev') {
			$sql.= " ORDER BY UVC.user_id DESC ";
		}
		else {
			$sql.= " ORDER BY UVC.user_id ASC  ";
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

	function new_followers_count_query($company_id='')
	{
		$sql = "SELECT COUNT(FC.user_id) AS no_of_users
				FROM hia_user_following_company AS FC
				LEFT JOIN hia_user_view_company AS VC ON (FC.user_id = VC.user_id AND VC.company_id = '$company_id' AND VC.viewing_type='company' )
				WHERE FC.company_id = '$company_id' AND FC.following_type = 'user'
				AND VC.id IS NULL "  ;

		//echo $sql;		
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

	function new_applicant_count_query($company_id='')
	{
		$sql = "SELECT COUNT(AJ.user_id) AS no_of_users
			FROM hia_user_applied_jobs AS AJ
			JOIN hia_jobpost  AS FC ON (AJ.job_post_id = FC.jobpost_id)
			LEFT JOIN hia_user_view_company AS VC ON (AJ.user_id = VC.user_id AND FC.jobpost_companyid = VC.company_id AND VC.company_id = '$company_id' AND VC.viewing_type='company' )
			WHERE FC.jobpost_companyid = '$company_id' 
			AND VC.id IS NULL  "  ;

		//echo $sql;		
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

	function user_company_matching_criteria_query($company_id='', $user_id='')
	{
		$sql = "SELECT DISTINCT TY.type_name, 'job_fit' AS matching_criteria
				FROM hia_type_user_rel AS TUR
				JOIN hia_type AS TY ON (TUR.type_id = TY.type_id AND TUR.type_rel_category = 'job_fit' AND TUR.type_rel_userid = '$user_id' )
				JOIN hia_type_user_rel AS CUR ON (TUR.type_id = CUR.type_id AND CUR.type_rel_userid IN (SELECT users_id FROM hia_users WHERE users_companyid = '$company_id' AND users_type = '2' AND users_status != '1' ) )

				UNION
				SELECT DISTINCT TY.type_name, 'employer_fit' AS matching_criteria
				FROM hia_type_user_rel AS TUR
				JOIN hia_type AS TY ON (TUR.type_id = TY.type_id AND TUR.type_rel_category = 'employer_fit' AND TUR.type_rel_userid = '$user_id' )
				JOIN hia_type_user_rel AS CUR ON (TUR.type_id = CUR.type_id AND CUR.type_rel_userid IN (SELECT users_id FROM hia_users WHERE users_companyid = '$company_id' AND users_type = '2' AND users_status != '1' ) ) "  ;

		//echo $sql;		
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

function applied_users_for_company($company_id='', $status='',$short_type='',$next_id='')
	{
		$sql = "SELECT hia_user_applied_jobs.user_id, hia_user_applied_jobs.user_id as next_user_id, hia_users.users_firstname,hia_users.users_lastname,hia_users.users_phone,fnStripTags(hia_users.users_bio) as users_bio ,hia_users.users_profilepic,hia_countries.name as country_name,hia_users.users_phone,hia_states.name as state_name,hia_cities.name as city_name 
		FROM hia_jobpost 
		LEFT JOIN hia_user_applied_jobs ON (hia_jobpost.jobpost_id = hia_user_applied_jobs.job_post_id) 
		LEFT JOIN hia_users ON (hia_user_applied_jobs.user_id =hia_users.users_id) 
		LEFT JOIN hia_countries ON (hia_users.users_country = hia_countries.id) 
		LEFT JOIN hia_states ON (hia_users.users_state = hia_states.id) 
		LEFT JOIN hia_cities ON (hia_users.users_city = hia_cities.id)
		WHERE hia_jobpost.jobpost_companyid = '$company_id'  
		AND hia_jobpost.jobpost_status = '$status' ";          
        
        if($next_id != ""){
        	if($short_type == 'next'){
        		$sql .= " AND hia_user_applied_jobs.user_id > '$next_id'";
        	}
        	if($short_type == 'prev'){
        		$sql .= " AND hia_user_applied_jobs.user_id < '$next_id'";
        	}
        } 
		
		if($short_type == 'prev'){
			$sql.= " GROUP by hia_user_applied_jobs.user_id order by hia_user_applied_jobs.user_id DESC ";	
		}else{
			$sql.= " GROUP by hia_user_applied_jobs.user_id order by hia_user_applied_jobs.user_id ASC ";	
		}


		 // echo $sql;exit; 


		if ( ! $this->db->simple_query($sql))
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

	function viewed_users_for_company($company_id='', $status='',$short_type='',$next_id='')
	{
		$sql = "SELECT hia_user_view_jobs.user_id, hia_user_view_jobs.user_id as next_user_id,hia_users.users_firstname,hia_users.users_lastname,hia_users.users_phone,fnStripTags(hia_users.users_bio) as users_bio ,hia_users.users_profilepic,hia_countries.name as country_name,hia_users.users_phone,hia_states.name as state_name,hia_cities.name as city_name 
		FROM hia_jobpost 
		LEFT JOIN hia_user_view_jobs ON (hia_jobpost.jobpost_id = hia_user_view_jobs.job_post_id) 
		LEFT JOIN hia_users ON (hia_user_view_jobs.user_id =hia_users.users_id) 
		LEFT JOIN hia_countries ON (hia_users.users_country = hia_countries.id) 
		LEFT JOIN hia_states ON (hia_users.users_state = hia_states.id) 
		LEFT JOIN hia_cities ON (hia_users.users_city = hia_cities.id)
		WHERE hia_jobpost.jobpost_companyid = '$company_id'  
		AND hia_jobpost.jobpost_status = '$status' "; 

		if($next_id != ""){
			if($short_type == 'next'){
        		$sql .= " AND hia_user_view_jobs.user_id > '$next_id' ";
        	}
        	if($short_type == 'prev'){
        		$sql .= " AND hia_user_view_jobs.user_id < '$next_id' ";
        	} 
        } 

		
		if($short_type == 'prev'){
			$sql.= " GROUP by hia_user_view_jobs.user_id order by hia_user_view_jobs.user_id DESC ";	
		}else{
			$sql.= " GROUP by hia_user_view_jobs.user_id  order by hia_user_view_jobs.user_id ASC ";	
		}

        //echo $sql;exit; 

		if ( ! $this->db->simple_query($sql))
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

	function get_following_company($company_id,$user_id,$following_type)
	{
		$this->db->select('id');                  
        $this->db->where('user_id', $user_id);
        $this->db->where('company_id', $company_id);
        $this->db->where('following_type', $following_type);
        $result = $this->db->get('user_following_company');         
        return $result->result_array();
		
	}


}
