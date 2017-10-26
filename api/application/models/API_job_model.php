<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class API_job_model extends CI_Model {


	function user_applied_for_job_query($user_id='', $applied_type='', $company_id="",$current_job_id="",$level = "")
	{
		$sql = "SELECT JP.jobpost_id, JP.jobpost_companyid, fnStripTags(JP.jobpost_description) AS jobpost_description, TY.type_name AS jobpost_title,  JP.jobpost_jobtype, AJ.applied_date, COM.company_name,
				DATE_FORMAT( AJ.applied_date,'%m/%d/%Y') applied_date_only, DATE_FORMAT( AJ.applied_date,'%H:%i %p') applied_time_only,
				IF(USC.users_profilepic IS NULL OR USC.users_profilepic = '', 'no-image.png', USC.users_profilepic) AS company_logo,
				hia_cities.name AS city_name, hia_states.name AS state_name, hia_countries.name AS country_name

				FROM hia_user_applied_jobs AS AJ
				JOIN hia_jobpost AS JP ON (AJ.job_post_id = JP.jobpost_id AND AJ.user_id = '$user_id' AND AJ.applied_type = '$applied_type')
				JOIN hia_company AS COM ON (JP.jobpost_companyid = COM.company_id)
				JOIN hia_users AS US ON (AJ.user_id = US.users_id) 
				LEFT JOIN hia_users AS USC ON (COM.company_id = USC.users_companyid AND USC.users_type='2' AND USC.users_status != '1')
				LEFT JOIN hia_type AS TY ON (JP.jobpost_title = TY.type_id)

				LEFT JOIN hia_cities ON (JP.jobpost_cityid = hia_cities.id)
				LEFT JOIN hia_states  ON (JP.jobpost_stateid = hia_states.id)
				LEFT JOIN hia_countries ON (JP.jobpost_countryid = hia_countries.id)

				WHERE US.users_status != '1'
				AND US.users_type = '1'
				AND US.users_companyid = '' ";

		if ($current_job_id != "") {
			

			if($level == 'next'){
				$sql.= " AND AJ.job_post_id > '$current_job_id' ORDER BY  AJ.job_post_id ASC ";
			}

			if($level == 'prev'){
				$sql.= " AND AJ.job_post_id < '$current_job_id' ORDER BY AJ.job_post_id DESC ";
			}
		}
			
		if ($level == '') {
			$sql.= "  ORDER BY  AJ.job_post_id ASC";
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

	function user_saved_job_query($user_id='', $save_type='', $company_id="",$current_job_id = "",$level = "")
	{
		$sql = "SELECT JP.jobpost_id, JP.jobpost_companyid, fnStripTags(JP.jobpost_description) AS jobpost_description, TY.type_name AS jobpost_title,  JP.jobpost_jobtype, SJ.saved_date, COM.company_name, COM.company_name, UFC.id AS following_id,
		IF(USC.users_profilepic IS NULL OR USC.users_profilepic = '', 'no_company_logo.png', USC.users_profilepic) AS company_logo,
		DATE_FORMAT( JP.jobpost_added_datetime,'%m/%d/%Y') job_post_date_only, DATE_FORMAT( JP.jobpost_added_datetime,'%H:%i %p') job_post_time_only,
		hia_cities.name AS city_name, hia_states.name AS state_name, hia_countries.name AS country_name
				
				FROM hia_user_saved_jobs AS SJ
				JOIN hia_jobpost AS JP ON (SJ.job_post_id = JP.jobpost_id AND SJ.user_id = '$user_id' AND SJ.saving_type = '$save_type')
				JOIN hia_company AS COM ON (JP.jobpost_companyid = COM.company_id)
				JOIN hia_users AS US ON (SJ.user_id = US.users_id) 
				LEFT JOIN hia_users AS USC ON (COM.company_id = USC.users_companyid AND USC.users_type='2' AND USC.users_status != '1')
				LEFT JOIN hia_type AS TY ON (JP.jobpost_title = TY.type_id)
				LEFT JOIN hia_user_following_company AS UFC ON (COM.company_id = UFC.company_id AND UFC.user_id = '$user_id' AND UFC.following_type = 'user')

				LEFT JOIN hia_cities ON (JP.jobpost_cityid = hia_cities.id)
				LEFT JOIN hia_states  ON (JP.jobpost_stateid = hia_states.id)
				LEFT JOIN hia_countries ON (JP.jobpost_countryid = hia_countries.id)

				WHERE US.users_status != '1'
				AND US.users_type = '1'
				AND US.users_companyid = '' ";

		if ($current_job_id != "") {
			

			if($level == 'next'){
				$sql.= " AND SJ.job_post_id > '$current_job_id' ORDER BY  SJ.job_post_id ASC ";
			}

			if($level == 'prev'){
				$sql.= " AND SJ.job_post_id < '$current_job_id' ORDER BY SJ.job_post_id DESC ";
			}
			if ($level == '') {
				$sql.= "  ORDER BY  SJ.job_post_id ASC";
			}

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

	function user_viewed_job_query($user_id='', $viewing_type='', $company_id="")
	{
		$sql = "SELECT JP.jobpost_id, JP.jobpost_companyid, fnStripTags(JP.jobpost_description) AS jobpost_description, TY.type_name AS jobpost_title,  JP.jobpost_jobtype, MAX(VJ.viewing_date) AS viewing_date, COM.company_name, UFC.id AS following_id,
		IF(USC.users_profilepic IS NULL OR USC.users_profilepic = '', 'no_company_logo.png', USC.users_profilepic) AS company_logo,
		DATE_FORMAT( JP.jobpost_added_datetime,'%m/%d/%Y') job_post_date_only, DATE_FORMAT( JP.jobpost_added_datetime,'%H:%i %p') job_post_time_only,
		hia_cities.name AS city_name, hia_states.name AS state_name, hia_countries.name AS country_name

				FROM hia_user_view_jobs AS VJ
				JOIN hia_jobpost AS JP ON (VJ.job_post_id = JP.jobpost_id AND VJ.user_id = '$user_id' AND VJ.viewing_type = '$viewing_type')
				JOIN hia_company AS COM ON (JP.jobpost_companyid = COM.company_id)
				JOIN hia_users AS US ON (VJ.user_id = US.users_id) 
				LEFT JOIN hia_users AS USC ON (COM.company_id = USC.users_companyid AND USC.users_type='2' AND USC.users_status != '1')
				LEFT JOIN hia_type AS TY ON (JP.jobpost_title = TY.type_id)
				LEFT JOIN hia_user_following_company AS UFC ON (COM.company_id = UFC.company_id AND UFC.user_id = '$user_id' AND UFC.following_type = 'user')

				LEFT JOIN hia_cities ON (JP.jobpost_cityid = hia_cities.id)
				LEFT JOIN hia_states  ON (JP.jobpost_stateid = hia_states.id)
				LEFT JOIN hia_countries ON (JP.jobpost_countryid = hia_countries.id)


				WHERE US.users_status != '1'
				AND US.users_type = '1'
				AND US.users_companyid = ''
				AND VJ.job_post_id NOT IN (SELECT job_post_id FROM hia_user_applied_jobs WHERE user_id = '$user_id' AND applied_type = '$viewing_type') 
				AND VJ.job_post_id NOT IN (SELECT job_post_id FROM hia_user_saved_jobs WHERE user_id = '$user_id' AND saving_type = '$viewing_type') 
				GROUP BY VJ.job_post_id ";

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

	function matched_job_for_user_query($user_id='',  $view_status = '',  $following_status = 'YES', $next_job='',$level = "")
	{
		$sql = "SELECT JOB_MATCH.jobpost_id, JOB_MATCH.jobpost_companyid, TY.type_name AS jobpost_title, fnStripTags(JOB_MATCH.jobpost_description) AS jobpost_description , JOB_MATCH.jobpost_exp_minimum, 
		DATE_FORMAT( JOB_MATCH.jobpost_added_datetime,'%m/%d/%Y') job_post_date_only, DATE_FORMAT( JOB_MATCH.jobpost_added_datetime,'%H:%i %p') job_post_time_only, COM.company_name, DATE_FORMAT( JOB_MATCH.jobpost_tilldata,'%m/%d/%Y') job_expire_date_only,
				JOB_MATCH.jobpost_exp_maximum, JOB_MATCH.jobpost_jobtype,JOB_MATCH.jobpost_url,
				SUM(JOB_MATCH.jobfit_status) AS jobfit_status,  SUM( JOB_MATCH.employeefit_status ) AS employeefit_status,  SUM( JOB_MATCH.skill_status ) AS skill_status,
				SUM( JOB_MATCH.industry_status ) AS industry_status,  SUM( JOB_MATCH.area_status ) AS area_status,
				 SUM( JOB_MATCH.location_status ) AS location_status ,
				 IF(US.users_profilepic IS NULL OR US.users_profilepic = '', 'no_company_logo.png', US.users_profilepic) AS company_logo,
				 hia_cities.name AS city_name, hia_states.name AS state_name, hia_countries.name AS country_name

				FROM
				(
					SELECT DISTINCT JOB.*, 1 AS jobfit_status, 0 AS employeefit_status, 0 AS skill_status, 0 AS industry_status, 0 AS area_status, 0 AS location_status
					FROM
					hia_jobpost AS JOB
					JOIN hia_jobpost_company_relation AS JREL ON(JOB.jobpost_id = JREL.jobpost_id AND JREL.type = 'jobfit') 
					JOIN hia_users AS USR ON (USR.users_id = '$user_id')
					JOIN hia_type_user_rel AS TUR ON (USR.users_id = TUR.type_rel_userid AND TUR.type_id = JREL.type_id  AND TUR.type_rel_category IN('job_fit') )

					UNION 
					SELECT DISTINCT JOB.*, 0 AS jobfit_status, 1 AS employeefit_status, 0 AS skill_status, 0 AS industry_status, 0 AS area_status, 0 AS location_status
					FROM
					hia_jobpost AS JOB
					JOIN hia_jobpost_company_relation AS JREL ON(JOB.jobpost_id = JREL.jobpost_id AND JREL.type = 'employerfit') 
					JOIN hia_users AS USR ON (USR.users_id = '$user_id')
					JOIN hia_type_user_rel AS TUR ON (USR.users_id = TUR.type_rel_userid AND TUR.type_id = JREL.type_id  AND TUR.type_rel_category IN('employer_fit') )

					UNION 
					SELECT DISTINCT JOB.*, 0 AS jobfit_status, 0 AS employeefit_status, 1 AS skill_status, 0 AS industry_status, 0 AS area_status, 0 AS location_status
					FROM
					hia_jobpost AS JOB
					JOIN hia_jobpost_company_relation AS JREL ON(JOB.jobpost_id = JREL.jobpost_id AND JREL.type = 'skill') 
					JOIN hia_users AS USR ON (USR.users_id = '$user_id')
					JOIN hia_users_skills_relation AS TUR ON (USR.users_id = TUR.relation_user_id AND JREL.type_id = TUR.relation_skills_id )

					UNION 
					SELECT DISTINCT JOB.*, 0 AS jobfit_status, 0 AS employeefit_status, 0 AS skill_status, 1 AS industry_status, 0 AS area_status, 0 AS location_status
					FROM
					hia_jobpost AS JOB
					JOIN hia_jobpost_company_relation AS JREL ON(JOB.jobpost_id = JREL.jobpost_id AND JREL.type = 'area') 
					JOIN hia_users AS USR ON (USR.users_id = '$user_id')
					JOIN hia_industry_user_relation AS TUR ON (USR.users_id = TUR.users_id AND JREL.type_id = TUR.industry_id )


					UNION 
					SELECT DISTINCT JOB.*, 0 AS jobfit_status, 0 AS employeefit_status, 0 AS skill_status, 0 AS industry_status, 1 AS area_status, 0 AS location_status
					FROM
					hia_jobpost AS JOB
					JOIN hia_jobpost_company_relation AS JREL ON(JOB.jobpost_id = JREL.jobpost_id AND JREL.type = 'area') 
					JOIN hia_users AS USR ON (USR.users_id = '$user_id')
					JOIN hia_assign_industry AS IUR ON (USR.users_id = IUR.userid  AND JREL.type_id = IUR.area_id)

					UNION 
						SELECT DISTINCT JOB.*, 0 AS jobfit_status, 0 AS employeefit_status, 0 AS skill_status, 0 AS industry_status, 0 AS area_status, 1 AS location_status
						FROM
						hia_jobpost AS JOB
						JOIN hia_jobpost_company_relation AS JREL ON(JOB.jobpost_id = JREL.jobpost_id AND JREL.type = 'location') 
						JOIN hia_users AS USR ON (USR.users_id = '$user_id')
						JOIN hia_users_locations_relation AS ULR ON (USR.users_id = ULR.relation_user_id  AND JREL.type_id = ULR.relation_locations_id AND ULR.relation_status != '1')

					)JOB_MATCH
				LEFT JOIN hia_type AS TY ON (JOB_MATCH.jobpost_title = TY.type_id)
				LEFT JOIN hia_company AS COM ON (JOB_MATCH.jobpost_companyid = COM.company_id)
				LEFT JOIN hia_users AS US ON (COM.company_id = US.users_companyid AND US.users_type='2' AND US.users_status != '1')

				LEFT JOIN hia_cities ON (JOB_MATCH.jobpost_cityid = hia_cities.id)
				LEFT JOIN hia_states  ON (JOB_MATCH.jobpost_stateid = hia_states.id)
				LEFT JOIN hia_countries ON (JOB_MATCH.jobpost_countryid = hia_countries.id)

				WHERE JOB_MATCH.jobpost_id NOT IN (SELECT job_post_id FROM hia_user_applied_jobs WHERE user_id = '$user_id' AND applied_type = 'user') 
				AND JOB_MATCH.jobpost_id NOT IN (SELECT job_post_id FROM hia_user_saved_jobs WHERE user_id = '$user_id' AND saving_type = 'user') 
				AND JOB_MATCH.jobpost_status != '1'
				AND JOB_MATCH.jobpost_status = '3'
				
			"  ;

		if ($view_status == "NO") {
			$sql.= " JOB_MATCH.jobpost_id NOT IN (SELECT job_post_id FROM hia_user_view_jobs WHERE user_id = '$user_id' AND viewing_type = 'user')   ";
		}

		if ($following_status == "NO") {
			$sql.= " AND JOB_MATCH.jobpost_companyid NOT IN ( SELECT company_id FROM hia_user_following_company WHERE user_id = '$user_id' AND following_type = 'user')   ";
		}
		if ($following_status == "YES")  {
			$sql.= " AND JOB_MATCH.jobpost_companyid IN ( SELECT company_id FROM hia_user_following_company WHERE user_id = '$user_id' AND following_type = 'user')   ";
		}

		if ($next_job != "") {
			if($level == 'next'){
				$sql.= " AND JOB_MATCH.jobpost_id > '$next_job'  ";
			}

			if($level == 'prev'){
				$sql.= " AND JOB_MATCH.jobpost_id < '$next_job'  ";
			}
			
		}
			if($level == 'prev'){
				$sql.=" GROUP BY JOB_MATCH.jobpost_id ORDER BY JOB_MATCH.jobpost_id DESC ";
			}else{
				$sql.=" GROUP BY JOB_MATCH.jobpost_id ORDER BY JOB_MATCH.jobpost_id ASC ";
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






/**** COMPANY  */



	function applied_users_query( $jobpost_id='' )
	{
		$sql = "SELECT UAJ.*, DATE_FORMAT( UAJ.applied_date,'%m-%d-%Y') applied_date_only, DATE_FORMAT( UAJ.applied_date,'%H:%i %p') applied_time_only,
				US.users_firstname, US.users_lastname, 
				SUBSTRING_INDEX(US.users_bio, ' ', 4)  AS users_bio, IF(US.users_phone IS NULL OR US.users_phone = '', 'N/A', US.users_phone) AS users_phone, 
				IF(US.users_profilepic IS NULL OR US.users_profilepic = '', 'no-image.png', US.users_profilepic) AS users_profilepic,
				hia_cities.name AS city_name, hia_states.name AS state_name, hia_countries.name AS country_name
				FROM hia_user_applied_jobs AS UAJ
				JOIN hia_users AS US ON(UAJ.user_id = US.users_id AND US.users_status != '1')
				LEFT JOIN hia_cities ON (US.users_city = hia_cities.id)
				LEFT JOIN hia_states  ON (US.users_state = hia_states.id)
				LEFT JOIN hia_countries ON (US.users_country = hia_countries.id)
				WHERE UAJ.job_post_id = '$jobpost_id'  ";

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

	function job_details_query( $job_id='' )
	{
		$sql = "SELECT *
				FROM hia_jobpost AS JP
				JOIN hia_type AS TM ON(JP.jobpost_title = TM.type_id)
				WHERE JP.jobpost_id = '$job_id'  ";

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
			
			return $query->row_array();
		}
		
	}

	function company_details_from_job_query( $job_id='', $user_id='' )
	{
		$sql = "SELECT JP.*, CM.company_name, UFC.id AS following_id,
				IF(US.users_profilepic IS NULL OR US.users_profilepic = '', 'no-image.png', US.users_profilepic) AS users_profilepic
				FROM hia_jobpost AS JP
				JOIN hia_company AS CM ON (JP.jobpost_companyid = CM.company_id)
				JOIN hia_users AS US ON (CM.company_id = US.users_companyid AND US.users_type='2' AND US.users_status != '1')
				LEFT JOIN hia_user_following_company AS UFC ON (CM.company_id = UFC.company_id AND UFC.user_id = '$user_id' AND UFC.following_type = 'user')
				WHERE JP.jobpost_id = '$job_id'  ";
		//echo $sql ;
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
			
			return $query->row_array();
		}
		
	}

	function job_property_matching_with_user( $job_id='', $user_id )
	{
		$sql = "SELECT DISTINCT JREL.type_id, TY.type_name, 'jobfit' AS matching_status
				FROM
				hia_jobpost AS JOB
				JOIN hia_jobpost_company_relation AS JREL ON(JOB.jobpost_id = JREL.jobpost_id AND JREL.type = 'jobfit' AND JOB.jobpost_id = '$job_id') 
				JOIN hia_type AS TY ON(JREL.type_id = TY.type_id)
				JOIN hia_users AS USR ON (USR.users_id = '$user_id')
				JOIN hia_type_user_rel AS TUR ON (USR.users_id = TUR.type_rel_userid AND TUR.type_id = JREL.type_id  AND TUR.type_rel_category IN('job_fit') )

				UNION
				SELECT DISTINCT JREL.type_id, TY.type_name, 'employerfit' AS matching_status
				FROM
				hia_jobpost AS JOB
				JOIN hia_jobpost_company_relation AS JREL ON(JOB.jobpost_id = JREL.jobpost_id AND JREL.type = 'employerfit' AND JOB.jobpost_id = '$job_id') 
				JOIN hia_type AS TY ON(JREL.type_id = TY.type_id)
				JOIN hia_users AS USR ON (USR.users_id = '$user_id')
				JOIN hia_type_user_rel AS TUR ON (USR.users_id = TUR.type_rel_userid AND TUR.type_id = JREL.type_id  AND TUR.type_rel_category IN('employer_fit') )

				UNION
				SELECT DISTINCT JREL.type_id, M.industry_name  AS type_name, 'industry' AS matching_status
				FROM
				hia_jobpost AS JOB
				JOIN hia_jobpost_company_relation AS JREL ON(JOB.jobpost_id = JREL.jobpost_id AND JREL.type = 'area' AND JOB.jobpost_id = '$job_id')
				JOIN hia_industry AS M ON(JREL.type_id = M.industry_id)
				JOIN hia_users AS USR ON (USR.users_id = '$user_id')
				JOIN hia_industry_user_relation AS TUR ON (USR.users_id = TUR.users_id AND JREL.type_id = TUR.industry_id )
				";

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


	function job_applied_details_user_query( $job_id='', $user_id='' )
	{
		$sql = "SELECT JP.jobpost_id, UAJ.id AS applied_id, UAJ.applied_date, MAX(UVJ.viewing_date) AS viewing_date, USJ.id AS saved_id, USJ.saved_date AS saved_date
				FROM hia_jobpost AS JP
				LEFT JOIN hia_user_applied_jobs AS UAJ ON (JP.jobpost_id = UAJ.job_post_id AND UAJ.user_id = '$user_id' AND UAJ.applied_type = 'user' )
				LEFT JOIN hia_user_view_jobs AS UVJ ON (JP.jobpost_id = UVJ.job_post_id AND UVJ.user_id = '$user_id' AND UVJ.viewing_type = 'user')
				LEFT JOIN hia_user_saved_jobs AS USJ ON (JP.jobpost_id = USJ.job_post_id AND USJ.user_id = '$user_id' AND USJ.saving_type = 'user')
				WHERE JP.jobpost_id = '$job_id'
				GROUP BY JP.jobpost_id  ";
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
			
			return $query->row_array();
		}
		
	}


	function job_match_before_register_user( $employerfit='', $jobfit='', $industry='', $seniority='' )
	{
		$sql = "SELECT JP.*
				FROM hia_jobpost AS JP
				JOIN hia_jobpost_company_relation AS JPR ON (JP.jobpost_id = JPR.jobpost_id)
				WHERE JPR.type = 'employerfit' AND JPR.type_id IN ($employerfit)
				AND JP.jobpost_status != '1'

				UNION 
				SELECT JP.*
				FROM hia_jobpost AS JP
				JOIN hia_jobpost_company_relation AS JPR ON (JP.jobpost_id = JPR.jobpost_id)
				WHERE JPR.type = 'jobfit' AND JPR.type_id IN ($jobfit)
				AND JP.jobpost_status != '1'

				UNION 
				SELECT JP.*
				FROM hia_jobpost AS JP
				JOIN hia_jobpost_company_relation AS JPR ON (JP.jobpost_id = JPR.jobpost_id)
				JOIN hia_jobpost_company_relation AS JPR2 ON (JP.jobpost_id = JPR.jobpost_id AND JPR.jobpost_id = JPR2.jobpost_id)
				WHERE JPR.type = 'area' AND JPR.type_id IN ($industry)
				AND JPR.type = 'seniority' AND JPR.type_id IN ($seniority)
				AND JP.jobpost_status != '1'  ";

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

	function company_match_before_register_user( $employerfit='', $jobfit='', $industry='', $seniority='' )
	{
		$sql = "SELECT JP.jobpost_companyid
				FROM hia_jobpost AS JP
				JOIN hia_jobpost_company_relation AS JPR ON (JP.jobpost_id = JPR.jobpost_id)
				WHERE JPR.type = 'employerfit' AND JPR.type_id IN ($employerfit)
				AND JP.jobpost_status != '1'

				UNION 
				SELECT JP.jobpost_companyid
				FROM hia_jobpost AS JP
				JOIN hia_jobpost_company_relation AS JPR ON (JP.jobpost_id = JPR.jobpost_id)
				WHERE JPR.type = 'jobfit' AND JPR.type_id IN ($jobfit)
				AND JP.jobpost_status != '1'

				UNION 
				SELECT JP.jobpost_companyid
				FROM hia_jobpost AS JP
				JOIN hia_jobpost_company_relation AS JPR ON (JP.jobpost_id = JPR.jobpost_id)
				JOIN hia_jobpost_company_relation AS JPR2 ON (JP.jobpost_id = JPR.jobpost_id AND JPR.jobpost_id = JPR2.jobpost_id)
				WHERE JPR.type = 'area' AND JPR.type_id IN ($industry)
				AND JPR.type = 'seniority' AND JPR.type_id IN ($seniority)
				AND JP.jobpost_status != '1'  ";

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


	function get_no_of_published_jobs_company( $company_id='' )
	{
		$sql = "SELECT COUNT(jobpost_id) AS no_of_published_jobs
				FROM hia_jobpost 
				WHERE jobpost_companyid = '$company_id'
				AND jobpost_publish = '1'  ";

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


}
