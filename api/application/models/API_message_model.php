<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class API_message_model extends CI_Model {

    function company_of_chart_for_user_query($user_id='')
    {
        $sql = "SELECT DISTINCT(CUM.company_id) AS company_id, CM.company_name, CUM.company_id AS aaa, MAX(sent_time) AS sent_time, DATE_FORMAT(MAX(sent_time),'%H:%i %p') sent_time_only,
                (SELECT COUNT(id) FROM hia_company_user_messages WHERE end_user_id = '$user_id' AND company_id = aaa AND read_time IS NULL  ) AS no_of_msg, 
                IF(CU.users_profilepic IS NULL OR CU.users_profilepic = '', 'admin-no-image.png', CU.users_profilepic)AS company_logo
                FROM hia_company_user_messages AS CUM
                JOIN hia_company AS CM ON (CUM.company_id = CM.company_id)
                JOIN hia_users AS CU ON(CM.company_id = CU.users_companyid AND CU.users_type = '2')
                WHERE CUM.end_user_id = '$user_id'
                GROUP BY CUM.company_id ";

        // echo $sql;

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


    function all_charts_of_a_company_for_user_query($user_id='', $company_id='')
    {
        $sql = "SELECT CUM.*, DATE_FORMAT( sent_time,'%m-%d-%Y') sent_date_only, DATE_FORMAT( sent_time,'%H:%i %p') sent_time_only, CHR.users_firstname AS hr_firstname, CHR.users_lastname AS hr_last_name, IF(CHR.users_profilepic IS NULL OR CHR.users_profilepic = '', 'admin-no-image.png', CHR.users_profilepic) AS company_hr_logo,
                EUR.users_firstname, EUR.users_lastname
                FROM hia_company_user_messages AS CUM
                JOIN hia_company AS CM ON (CUM.company_id = CM.company_id)
                JOIN hia_users AS CHR ON( CUM.company_user_id = CHR.users_id )
                JOIN hia_users AS EUR ON( CUM.end_user_id = EUR.users_id )
                WHERE CUM.end_user_id = '$user_id'
                AND CUM.company_id = '$company_id'
                ORDER BY sent_time ASC, id ASC
                 ";

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

    function latest_msg_of_a_company_for_user_query($user_id='', $company_id='')
    {
        $sql = "SELECT CUM.*, COM.company_name, US.users_firstname, US.users_lastname
                FROM hia_company_user_messages AS CUM
                JOIN hia_company AS COM ON (CUM.company_id = COM.company_id)
                JOIN hia_users AS US ON (CUM.end_user_id = US.users_id)
                WHERE CUM.company_id = '$company_id' AND CUM.end_user_id = '$user_id' AND  CUM.sent_from = 'company'
                ORDER BY CUM.sent_time DESC LIMIT 1
                 ";

        // echo $sql;

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


    /* COMPANY */

    function users_list_for_company_chart_query($company_id='')
    {
        $sql = "SELECT DISTINCT   US.users_id, US.users_firstname, US.users_lastname, US.users_phone, 
                IF(US.users_profilepic IS NULL OR US.users_profilepic = '', 'admin-no-image.png', US.users_profilepic) AS users_profilepic, DATE_FORMAT(MAX(CUM.sent_time),'%H:%i %p') sent_time_only,
                (SELECT COUNT(id) FROM hia_company_user_messages WHERE end_user_id = US.users_id AND company_id = '$company_id' AND read_time IS NULL  ) AS no_of_msg
                FROM hia_user_applied_jobs AS UAJ
                JOIN hia_jobpost AS JP ON(UAJ.job_post_id = JP.jobpost_id)
                JOIN hia_users AS US ON (UAJ.user_id = US.users_id)
                LEFT JOIN hia_company_user_messages AS CUM ON(UAJ.user_id = CUM.end_user_id)
                WHERE JP.jobpost_companyid = '$company_id'
                GROUP BY US.users_id";

        // echo $sql;

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
